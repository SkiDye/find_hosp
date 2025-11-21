/**
 * 의원 운영정보 초기화 스크립트
 * 확인되지 않은 추정치를 제거하고 보수적으로 재설정
 */

import db from '../database/init.js';

console.log('\n' + '='.repeat(80));
console.log('🔧 의원 운영정보 초기화');
console.log('='.repeat(80) + '\n');

// 모든 의원 가져오기
const allClinics = db.prepare(`
  SELECT id, name, type, has_emergency_room, open_24_hours, weekend_available
  FROM hospitals
  WHERE type = '의원'
`).all();

console.log(`📋 총 ${allClinics.length}개 의원의 운영정보를 보수적으로 재설정합니다.\n`);

// 일반 의원의 현실적인 기본값:
// - 응급실: 없음 (has_emergency_room = 0)
// - 24시간: 운영 안 함 (open_24_hours = 0)
// - 주말: 토요일 오전만 (weekend_available = 1, 하지만 opening_hours에서 토요일만 표시)

const updateStmt = db.prepare(`
  UPDATE hospitals
  SET
    has_emergency_room = ?,
    open_24_hours = ?,
    weekend_available = ?
  WHERE id = ?
`);

let updatedCount = 0;

allClinics.forEach(clinic => {
  // 특수한 경우만 예외 처리
  let hasEmergency = 0;
  let open24h = 0;
  let weekendAvailable = 1; // 대부분 의원이 토요일 오전 진료

  // 응급의학과, 24시간 표시된 경우만 유지
  if (clinic.name.includes('응급') || clinic.name.includes('24시')) {
    hasEmergency = clinic.name.includes('응급') ? 1 : 0;
    open24h = clinic.name.includes('24시') ? 1 : 0;
  }

  // 약국은 일부 24시간 운영
  if (clinic.name.includes('약국') && clinic.name.includes('24')) {
    open24h = 1;
  }

  // 일요일도 진료하는 것으로 표시된 경우 - 일단 토요일만으로 변경
  // (실제 확인 전까지 보수적으로)

  updateStmt.run(hasEmergency, open24h, weekendAvailable, clinic.id);

  const changes = [];
  if (clinic.has_emergency_room !== hasEmergency) changes.push(`응급실: ${clinic.has_emergency_room} → ${hasEmergency}`);
  if (clinic.open_24_hours !== open24h) changes.push(`24시간: ${clinic.open_24_hours} → ${open24h}`);
  if (clinic.weekend_available !== weekendAvailable) changes.push(`주말: ${clinic.weekend_available} → ${weekendAvailable}`);

  if (changes.length > 0) {
    console.log(`🔄 ${clinic.name}`);
    changes.forEach(change => console.log(`   ${change}`));
    updatedCount++;
  }
});

console.log('\n' + '='.repeat(80));
console.log('📊 초기화 완료');
console.log('='.repeat(80));
console.log(`✅ 변경된 의원: ${updatedCount}개`);
console.log(`📋 전체 의원: ${allClinics.length}개`);
console.log('='.repeat(80));

// 새로운 통계
const newStats = db.prepare(`
  SELECT
    SUM(has_emergency_room) as emergency_count,
    SUM(open_24_hours) as open_24h_count,
    SUM(weekend_available) as weekend_count
  FROM hospitals
  WHERE type = '의원'
`).get();

console.log('\n📊 재설정 후 통계:');
console.log(`   응급실: ${newStats.emergency_count}개`);
console.log(`   24시간: ${newStats.open_24h_count}개`);
console.log(`   토요일 진료: ${newStats.weekend_count}개`);

console.log('\n💡 참고:');
console.log('   - 대부분의 의원은 토요일 오전(09:00-13:00)만 진료합니다.');
console.log('   - 일요일은 대부분 휴무입니다.');
console.log('   - 실제 운영시간은 opening_hours 필드에서 확인하세요.');
console.log('   - 정확한 정보는 각 의원에 직접 확인이 필요합니다.\n');
