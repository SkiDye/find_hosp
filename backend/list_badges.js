import fetch from 'node-fetch';

const response = await fetch('http://localhost:5000/api/hospitals');
const data = await response.json();

const withBadges = data.filter(h => h.has_emergency_room || h.open_24_hours || h.weekend_available);

console.log('운영 시간 뱃지가 있는 병원들:\n');
withBadges.forEach((h, i) => {
  console.log(`${i+1}. ${h.name} (ID: ${h.id})`);
  console.log(`   🚑 응급실: ${h.has_emergency_room ? 'O' : 'X'}`);
  console.log(`   🌙 24시간: ${h.open_24_hours ? 'O' : 'X'}`);
  console.log(`   📅 주말진료: ${h.weekend_available ? 'O' : 'X'}`);
  console.log('');
});
