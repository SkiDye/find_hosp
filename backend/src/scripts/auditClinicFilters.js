/**
 * 의원 필터 요소 감사 스크립트
 */

import db from '../database/init.js';

console.log('\n' + '='.repeat(80));
console.log('🏥 의원 필터 요소 감사');
console.log('='.repeat(80) + '\n');

// 모든 의원 가져오기
const allClinics = db.prepare(`
  SELECT id, name, city, type, has_emergency_room, open_24_hours, weekend_available
  FROM hospitals
  WHERE type = '의원'
  ORDER BY city, name
`).all();

console.log(`📋 총 의원 수: ${allClinics.length}개\n`);

// 통계
const stats = {
  withEmergency: allClinics.filter(c => c.has_emergency_room === 1).length,
  with24Hours: allClinics.filter(c => c.open_24_hours === 1).length,
  withWeekend: allClinics.filter(c => c.weekend_available === 1).length,
  noWeekend: allClinics.filter(c => c.weekend_available === 0).length
};

console.log('📊 전체 통계:');
console.log(`   응급실 운영: ${stats.withEmergency}개 (${(stats.withEmergency/allClinics.length*100).toFixed(1)}%)`);
console.log(`   24시간 운영: ${stats.with24Hours}개 (${(stats.with24Hours/allClinics.length*100).toFixed(1)}%)`);
console.log(`   주말 진료: ${stats.withWeekend}개 (${(stats.withWeekend/allClinics.length*100).toFixed(1)}%)`);
console.log(`   주말 휴무: ${stats.noWeekend}개 (${(stats.noWeekend/allClinics.length*100).toFixed(1)}%)`);

// 지역별 분석
console.log('\n' + '='.repeat(80));
console.log('📍 지역별 의원 분석');
console.log('='.repeat(80) + '\n');

const cities = [...new Set(allClinics.map(c => c.city))].sort();

cities.forEach(city => {
  const cityClinics = allClinics.filter(c => c.city === city);
  const cityWeekend = cityClinics.filter(c => c.weekend_available === 1).length;

  console.log(`${city}: ${cityClinics.length}개 의원`);
  console.log(`  - 주말 진료: ${cityWeekend}개 (${(cityWeekend/cityClinics.length*100).toFixed(1)}%)`);
  console.log(`  - 주말 휴무: ${cityClinics.length - cityWeekend}개 (${((cityClinics.length - cityWeekend)/cityClinics.length*100).toFixed(1)}%)`);
  console.log('');
});

// 비정상적인 케이스 확인
console.log('='.repeat(80));
console.log('⚠️  비정상 케이스 확인');
console.log('='.repeat(80) + '\n');

// 1. 응급실이 있는 의원 (일반적으로 의원은 응급실이 없음)
const clinicsWithER = allClinics.filter(c => c.has_emergency_room === 1);
if (clinicsWithER.length > 0) {
  console.log(`❗ 응급실이 있는 의원 (${clinicsWithER.length}개):`);
  clinicsWithER.forEach(c => {
    console.log(`   - ${c.name} (${c.city})`);
  });
  console.log('');
} else {
  console.log('✅ 응급실이 있는 의원 없음 (정상)\n');
}

// 2. 24시간 운영하는 의원
const clinics24h = allClinics.filter(c => c.open_24_hours === 1);
if (clinics24h.length > 0) {
  console.log(`📋 24시간 운영 의원 (${clinics24h.length}개):`);
  clinics24h.forEach(c => {
    console.log(`   - ${c.name} (${c.city})`);
  });
  console.log('');
} else {
  console.log('📋 24시간 운영 의원 없음\n');
}

// 샘플 확인 - 각 지역별로 5개씩
console.log('='.repeat(80));
console.log('🔍 샘플 확인 (각 지역별 5개)');
console.log('='.repeat(80) + '\n');

['이천시', '강남구', '서초구'].forEach(city => {
  const samples = allClinics.filter(c => c.city === city).slice(0, 5);
  console.log(`${city}:`);
  samples.forEach(c => {
    const flags = [];
    if (c.has_emergency_room) flags.push('🚑');
    if (c.open_24_hours) flags.push('🌙');
    if (c.weekend_available) flags.push('📅');
    if (flags.length === 0) flags.push('❌');

    console.log(`  ${flags.join(' ')} ${c.name}`);
  });
  console.log('');
});

console.log('='.repeat(80));
console.log('✅ 감사 완료');
console.log('='.repeat(80));
console.log('\n💡 권장 사항:');
console.log('   - 의원은 일반적으로 응급실 없음 (has_emergency_room = 0)');
console.log('   - 의원은 일반적으로 24시간 운영 안 함 (open_24_hours = 0)');
console.log('   - 주말 진료는 의원마다 다름 (weekend_available = 0 or 1)');
console.log('   - 강남/서초 의원: 주말 진료 비율 높음 (50%+)');
console.log('   - 이천시 의원: 주말 진료 비율 중간 (30-50%)\n');
