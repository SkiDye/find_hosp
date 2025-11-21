/**
 * 거리 계산 테스트
 */

import db from '../database/init.js';

// Haversine 공식으로 거리 계산
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // 지구 반지름 (km)
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // km 단위
}

// 지역별 중심 좌표
const REGION_COORDINATES = {
  '강남구': { latitude: 37.5172, longitude: 127.0473 },
  '서초구': { latitude: 37.4837, longitude: 127.0324 },
  '이천시': { latitude: 37.2720, longitude: 127.4350 }
};

console.log('\n' + '='.repeat(80));
console.log('📏 거리 계산 테스트');
console.log('='.repeat(80) + '\n');

// 각 지역의 의원 5개씩 테스트
for (const [cityName, centerCoord] of Object.entries(REGION_COORDINATES)) {
  console.log(`\n📍 ${cityName} (중심: ${centerCoord.latitude}, ${centerCoord.longitude})\n`);

  const hospitals = db.prepare(`
    SELECT id, name, latitude, longitude
    FROM hospitals
    WHERE city = ?
    AND type = '의원'
    LIMIT 5
  `).all(cityName);

  hospitals.forEach(hospital => {
    const distance = calculateDistance(
      centerCoord.latitude,
      centerCoord.longitude,
      hospital.latitude,
      hospital.longitude
    );

    const distanceText = distance < 1
      ? `${Math.round(distance * 1000)}m`
      : `${distance.toFixed(1)}km`;

    console.log(`  ${hospital.name}`);
    console.log(`    좌표: ${hospital.latitude}, ${hospital.longitude}`);
    console.log(`    거리: ${distanceText} (${distance.toFixed(4)}km)`);
    console.log('');
  });
}

console.log('='.repeat(80));
console.log('✅ 거리 계산 테스트 완료\n');
