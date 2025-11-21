import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'data', 'hospital-system.db'));

console.log('🔍 이천 지역 병원 운영 정보 정확한 조사 결과:\n');

// 웹 조사 결과 기반 정확한 정보
const icheonHospitals = {
  // 경기도의료원 이천병원 - 종합병원, 응급실 24시간 운영 확인
  '경기도의료원 이천병원': {
    emergency: 1,    // 응급실 있음 (031-630-4333~4334)
    h24: 1,          // 24시간 운영
    weekend: 1,      // 주말 진료 (응급실은 연중무휴)
    note: '응급실 24시간 연중무휴 운영'
  },

  // 이천 바른병원 - 2024년 이천시와 24시간 응급의료 협력체계 구축
  '이천 바른병원': {
    emergency: 1,    // 응급실 있음 (031-630-0300)
    h24: 1,          // 24시간 운영
    weekend: 1,      // 주말 진료 (응급실은 연중무휴)
    note: '2024년 이천시와 24시간 응급의료 협력체계 구축'
  },

  // 이천엘리야병원 - 응급의료기관 아님, 일반 외래만
  '이천엘리야병원': {
    emergency: 0,    // 응급의료기관 아님
    h24: 0,          // 24시간 운영 안함
    weekend: 1,      // 주말 외래진료 09:00-17:00
    note: '응급의료기관 아님, 평일/주말 외래진료만 (09:00-17:00)'
  },

  // 이천파티마병원 - 토요일 진료, 응급실 정보 불명확
  '이천파티마병원': {
    emergency: 0,    // 응급실 정보 확인 안됨
    h24: 0,          // 24시간 운영 안함
    weekend: 1,      // 토요일 진료 09:00-13:00
    note: '토요일 외래진료, 화요일 야간진료 (~22:00)'
  },

  // 추새로병원 - 응급의학과 없음
  '추새로병원': {
    emergency: 0,    // 응급실 없음
    h24: 0,          // 24시간 운영 안함
    weekend: 1,      // 토요일 진료 09:00-13:30
    note: '응급실 없음, 토요일 오전 진료만'
  }
};

console.log('📋 이천 지역 병원별 운영 정보:\n');

let updatedCount = 0;

for (const [hospitalName, info] of Object.entries(icheonHospitals)) {
  try {
    const stmt = db.prepare(`
      UPDATE hospitals
      SET has_emergency_room = ?,
          open_24_hours = ?,
          weekend_available = ?
      WHERE name = ?
    `);

    const result = stmt.run(info.emergency, info.h24, info.weekend, hospitalName);

    if (result.changes > 0) {
      updatedCount++;
      const badges = [];
      if (info.emergency) badges.push('🚑 응급실');
      if (info.h24) badges.push('🌙 24시간');
      if (info.weekend) badges.push('📅 주말');

      console.log(`✅ ${hospitalName}`);
      console.log(`   ${badges.length > 0 ? badges.join(', ') : '❌ 응급실/24시간 없음'}`);
      console.log(`   ℹ️  ${info.note}`);
      console.log('');
    } else {
      console.log(`⚠️  ${hospitalName} - 데이터베이스에서 찾을 수 없음\n`);
    }
  } catch (error) {
    console.error(`❌ ${hospitalName} 업데이트 실패:`, error.message);
  }
}

console.log(`\n📊 업데이트 완료: ${updatedCount}개 병원`);

// 이천 지역 통계
const checkStmt = db.prepare(`
  SELECT
    name,
    has_emergency_room,
    open_24_hours,
    weekend_available
  FROM hospitals
  WHERE city LIKE '%이천%'
  ORDER BY has_emergency_room DESC, open_24_hours DESC
`);

const icheonStats = checkStmt.all();
console.log(`\n📈 이천 지역 병원 최종 통계:`);
console.log(`   - 총 병원: ${icheonStats.length}개`);
console.log(`   - 응급실 운영: ${icheonStats.filter(h => h.has_emergency_room).length}개`);
console.log(`   - 24시간 운영: ${icheonStats.filter(h => h.open_24_hours).length}개`);
console.log(`   - 주말 진료: ${icheonStats.filter(h => h.weekend_available).length}개`);

db.close();
console.log('\n✨ 이천 지역 병원 정보 업데이트 완료!');
