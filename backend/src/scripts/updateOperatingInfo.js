/**
 * 병원 운영정보 업데이트 통합 스크립트
 *
 * 여러 데이터 소스(공공 API, 크롤링 등)에서 실제 운영정보를 조회하여 DB 업데이트
 *
 * 사용법:
 *   node src/scripts/updateOperatingInfo.js
 *   node src/scripts/updateOperatingInfo.js --type=의원
 *   node src/scripts/updateOperatingInfo.js --city=강남구
 */

import db from '../database/init.js';
import DataAggregator from '../services/DataAggregator.js';
import { validateApiKeys } from '../config/apiKeys.js';

// 명령행 인자 파싱
const args = process.argv.slice(2);
const options = {};

args.forEach(arg => {
  const [key, value] = arg.split('=');
  if (key.startsWith('--')) {
    options[key.slice(2)] = value;
  }
});

async function updateOperatingInfo() {
  console.log('\n' + '='.repeat(80));
  console.log('🏥 병원 운영정보 업데이트');
  console.log('='.repeat(80) + '\n');

  // API 키 검증
  console.log('🔑 API 키 검증 중...\n');
  const hasValidKeys = validateApiKeys();

  if (!hasValidKeys) {
    console.log('⚠️  일부 API가 비활성화됩니다.');
    console.log('💡 API 신청: backend/API_SIGNUP_GUIDE.md 참고\n');
  }

  // 데이터 통합기 초기화
  const aggregator = new DataAggregator();

  // 병원 조회 (필터 적용)
  let query = 'SELECT id, name, address, phone, city, type FROM hospitals WHERE 1=1';
  const params = [];

  if (options.type) {
    query += ' AND type = ?';
    params.push(options.type);
  }

  if (options.city) {
    query += ' AND city = ?';
    params.push(options.city);
  }

  // 의원만 업데이트 (기본값)
  if (!options.type && !options.all) {
    query += ' AND type = ?';
    params.push('의원');
  }

  query += ' ORDER BY id';

  const hospitals = db.prepare(query).all(...params);

  console.log(`📋 대상 병원: ${hospitals.length}개\n`);

  if (hospitals.length === 0) {
    console.log('⚠️  업데이트할 병원이 없습니다.\n');
    return;
  }

  // 확인 메시지
  if (hospitals.length > 50) {
    console.log(`⚠️  ${hospitals.length}개 병원을 업데이트합니다.`);
    console.log(`   예상 소요 시간: 약 ${Math.ceil(hospitals.length / 5 * 3 / 60)}분\n`);
  }

  // 일괄 조회
  const results = await aggregator.fetchBulk(hospitals, {
    batchSize: 5,           // 5개씩 동시 처리
    delayBetweenBatches: 2000 // 배치 간 2초 대기
  });

  // DB 업데이트
  console.log('\n💾 데이터베이스 업데이트 중...\n');

  const updateStmt = db.prepare(`
    UPDATE hospitals
    SET
      has_emergency_room = ?,
      open_24_hours = ?,
      weekend_available = ?,
      opening_hours = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);

  let updatedCount = 0;
  let skippedCount = 0;

  results.forEach((data, index) => {
    const hospital = hospitals[index];

    if (data) {
      updateStmt.run(
        data.has_emergency_room ? 1 : 0,
        data.open_24_hours ? 1 : 0,
        data.weekend_available ? 1 : 0,
        data.opening_hours ? JSON.stringify(data.opening_hours) : null,
        hospital.id
      );

      console.log(`✅ [${index + 1}/${hospitals.length}] ${hospital.name} 업데이트 완료`);
      updatedCount++;
    } else {
      console.log(`⏭️  [${index + 1}/${hospitals.length}] ${hospital.name} 스킵 (데이터 없음)`);
      skippedCount++;
    }
  });

  // 최종 통계
  console.log('\n' + '='.repeat(80));
  console.log('📊 업데이트 완료');
  console.log('='.repeat(80));
  console.log(`✅ 업데이트: ${updatedCount}개`);
  console.log(`⏭️  스킵: ${skippedCount}개`);
  console.log(`📋 전체: ${hospitals.length}개`);
  console.log('='.repeat(80));

  // 업데이트 후 통계
  const stats = db.prepare(`
    SELECT
      SUM(has_emergency_room) as emergency_count,
      SUM(open_24_hours) as open_24h_count,
      SUM(weekend_available) as weekend_count,
      COUNT(*) as total
    FROM hospitals
    WHERE type = '의원'
  `).get();

  console.log('\n📊 의원 통계:');
  console.log(`   응급실: ${stats.emergency_count}개 (${(stats.emergency_count / stats.total * 100).toFixed(1)}%)`);
  console.log(`   24시간: ${stats.open_24h_count}개 (${(stats.open_24h_count / stats.total * 100).toFixed(1)}%)`);
  console.log(`   주말진료: ${stats.weekend_count}개 (${(stats.weekend_count / stats.total * 100).toFixed(1)}%)`);
  console.log('\n');
}

// 스크립트 실행
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  updateOperatingInfo().catch(error => {
    console.error('\n❌ 오류 발생:', error);
    process.exit(1);
  });
}

export default updateOperatingInfo;
