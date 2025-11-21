import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'data', 'hospital-system.db'));

// 운영 정보 업데이트 데이터
// 웹 조사 결과를 바탕으로 작성
const operatingHoursData = {
  // 상급종합병원 - 대부분 권역/지역 응급의료센터 운영, 24시간, 주말 진료
  '분당서울대학교병원': { emergency: 1, h24: 1, weekend: 1 },
  '아주대학교병원': { emergency: 1, h24: 1, weekend: 1 },
  '한양대학교병원': { emergency: 1, h24: 1, weekend: 1 },
  '중앙대학교병원': { emergency: 1, h24: 1, weekend: 1 },
  '이화여자대학교 목동병원': { emergency: 1, h24: 1, weekend: 1 },
  '건국대학교병원': { emergency: 1, h24: 1, weekend: 1 },
  '고려대학교 구로병원': { emergency: 1, h24: 1, weekend: 1 },
  '고려대학교 안암병원': { emergency: 1, h24: 1, weekend: 1 },
  '고려대학교 안산병원': { emergency: 1, h24: 1, weekend: 1 },
  '경희대학교병원': { emergency: 1, h24: 1, weekend: 1 },
  '순천향대학교 부천병원': { emergency: 1, h24: 1, weekend: 1 },
  '한림대학교 성심병원': { emergency: 1, h24: 1, weekend: 1 },
  '동탄성심병원': { emergency: 1, h24: 1, weekend: 1 },
  '인하대학교병원': { emergency: 1, h24: 1, weekend: 1 },
  '가천대 길병원': { emergency: 1, h24: 1, weekend: 1 },
  '가톨릭대학교 성빈센트병원': { emergency: 1, h24: 1, weekend: 1 },

  // 종합병원 - 대형 종합병원은 응급실 및 주말진료 제공
  '가톨릭대학교 부천성모병원': { emergency: 1, h24: 1, weekend: 1 },
  '가톨릭대학교 여의도성모병원': { emergency: 1, h24: 1, weekend: 1 },
  '가톨릭대학교 은평성모병원': { emergency: 1, h24: 1, weekend: 1 },
  '강동경희대학교병원': { emergency: 1, h24: 1, weekend: 1 },
  '강동성심병원': { emergency: 1, h24: 1, weekend: 1 },
  '구로성심병원': { emergency: 1, h24: 0, weekend: 1 },
  '국립중앙의료원': { emergency: 1, h24: 1, weekend: 1 },
  '국민건강보험 일산병원': { emergency: 1, h24: 1, weekend: 1 },
  '노원을지대학교병원': { emergency: 1, h24: 1, weekend: 1 },
  '서울특별시 보라매병원': { emergency: 1, h24: 1, weekend: 1 },
  '서울특별시 서울의료원': { emergency: 1, h24: 1, weekend: 1 },
  '순천향대학교 서울병원': { emergency: 1, h24: 1, weekend: 1 },
  '인제대학교 상계백병원': { emergency: 1, h24: 1, weekend: 1 },
  '인제대학교 일산백병원': { emergency: 1, h24: 1, weekend: 1 },
  '중앙보훈병원': { emergency: 1, h24: 1, weekend: 1 },
  '한림대학교 강남성심병원': { emergency: 1, h24: 1, weekend: 1 },
  '한림대학교 한강성심병원': { emergency: 1, h24: 1, weekend: 1 },
  '명지병원': { emergency: 1, h24: 1, weekend: 1 },
  '의정부을지대학교병원': { emergency: 1, h24: 1, weekend: 1 },
  '경찰병원': { emergency: 1, h24: 1, weekend: 1 },
  '삼육서울병원': { emergency: 1, h24: 0, weekend: 1 },

  // 경기 지역 종합병원
  '경기도의료원 수원병원': { emergency: 1, h24: 1, weekend: 1 },
  '경기도의료원 이천병원': { emergency: 1, h24: 1, weekend: 1 },
  '근로복지공단 안산병원': { emergency: 1, h24: 0, weekend: 1 },
  '동안산병원': { emergency: 0, h24: 0, weekend: 1 },
  '안산단원병원': { emergency: 0, h24: 0, weekend: 1 },
  '센트럴병원': { emergency: 0, h24: 0, weekend: 1 },
  '시화병원': { emergency: 0, h24: 0, weekend: 1 },
  '사랑의병원': { emergency: 0, h24: 0, weekend: 1 },
  '화성중앙종합병원': { emergency: 1, h24: 0, weekend: 1 },
  '평택성모병원': { emergency: 1, h24: 0, weekend: 1 },
  '평택21세기병원': { emergency: 1, h24: 0, weekend: 1 },

  // 소형 병원 - 일반 외래 진료 위주
  '강남차병원': { emergency: 0, h24: 0, weekend: 0 },
  '안산21세기병원': { emergency: 0, h24: 0, weekend: 1 },
  '이천 바른병원': { emergency: 0, h24: 0, weekend: 0 },
  '이천엘리야병원': { emergency: 0, h24: 0, weekend: 0 },
  '이천파티마병원': { emergency: 0, h24: 0, weekend: 0 },
  '추새로병원': { emergency: 0, h24: 0, weekend: 0 },
  '화성유일병원': { emergency: 0, h24: 0, weekend: 0 },
  '흥케이병원': { emergency: 0, h24: 0, weekend: 0 }
};

console.log('🔄 병원 운영 정보 업데이트 시작...\n');

let updatedCount = 0;
let notFoundCount = 0;

for (const [hospitalName, hours] of Object.entries(operatingHoursData)) {
  try {
    const stmt = db.prepare(`
      UPDATE hospitals
      SET has_emergency_room = ?,
          open_24_hours = ?,
          weekend_available = ?
      WHERE name = ?
    `);

    const result = stmt.run(hours.emergency, hours.h24, hours.weekend, hospitalName);

    if (result.changes > 0) {
      updatedCount++;
      const badges = [];
      if (hours.emergency) badges.push('🚑');
      if (hours.h24) badges.push('🌙');
      if (hours.weekend) badges.push('📅');
      console.log(`✅ ${hospitalName} - ${badges.join(' ') || '운영정보 없음'}`);
    } else {
      notFoundCount++;
      console.log(`⚠️  ${hospitalName} - 데이터베이스에서 찾을 수 없음`);
    }
  } catch (error) {
    console.error(`❌ ${hospitalName} 업데이트 실패:`, error.message);
  }
}

console.log(`\n📊 업데이트 완료:`);
console.log(`   - 성공: ${updatedCount}개 병원`);
console.log(`   - 실패: ${notFoundCount}개 병원`);

// 업데이트 결과 확인
const checkStmt = db.prepare(`
  SELECT
    COUNT(*) as total,
    SUM(has_emergency_room) as with_emergency,
    SUM(open_24_hours) as with_24h,
    SUM(weekend_available) as with_weekend
  FROM hospitals
`);

const stats = checkStmt.get();
console.log(`\n📈 전체 통계:`);
console.log(`   - 총 병원: ${stats.total}개`);
console.log(`   - 응급실: ${stats.with_emergency}개`);
console.log(`   - 24시간: ${stats.with_24h}개`);
console.log(`   - 주말진료: ${stats.with_weekend}개`);

db.close();
console.log('\n✨ 데이터베이스 업데이트 완료!');
