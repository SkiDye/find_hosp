import Hospital from './src/models/Hospital.js';

const hospitals = Hospital.getAll();

console.log(`총 병원 수: ${hospitals.length}\n`);

hospitals.forEach((h, i) => {
  const badges = [];
  if (h.has_emergency_room) badges.push('🚑');
  if (h.open_24_hours) badges.push('🌙');
  if (h.weekend_available) badges.push('📅');

  const badgeStr = badges.length > 0 ? badges.join(' ') : '❌';

  console.log(`${i+1}. [ID:${h.id}] ${h.name} (${h.type}) - ${badgeStr}`);
  console.log(`   위치: ${h.region} ${h.city}`);
  if (badges.length === 0) {
    console.log(`   ⚠️  운영 정보 없음 - 조사 필요`);
  }
  console.log('');
});

const needsInfo = hospitals.filter(h => !h.has_emergency_room && !h.open_24_hours && !h.weekend_available);
console.log(`\n📊 운영 정보 조사가 필요한 병원: ${needsInfo.length}개`);
