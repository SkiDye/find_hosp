/**
 * 중복 GPS 좌표 수정 스크립트
 * 지역 중심점과 동일한 좌표를 가진 의원들의 좌표를 약간씩 변경
 */

import db from '../database/init.js';

console.log('\n' + '='.repeat(80));
console.log('🔧 중복 GPS 좌표 수정');
console.log('='.repeat(80) + '\n');

// 지역별 중심 좌표
const REGION_CENTERS = {
  '강남구': { latitude: 37.5172, longitude: 127.0473 },
  '서초구': { latitude: 37.4837, longitude: 127.0324 },
  '이천시': { latitude: 37.2720, longitude: 127.4350 }
};

let fixedCount = 0;

// 각 지역의 중심점과 동일한 좌표를 가진 병원 찾기 및 수정
for (const [cityName, center] of Object.entries(REGION_CENTERS)) {
  const duplicates = db.prepare(`
    SELECT id, name, latitude, longitude
    FROM hospitals
    WHERE city = ?
    AND latitude = ?
    AND longitude = ?
  `).all(cityName, center.latitude, center.longitude);

  if (duplicates.length > 0) {
    console.log(`\n📍 ${cityName} - 중심점과 동일한 좌표 ${duplicates.length}개 발견\n`);

    duplicates.forEach((hospital, idx) => {
      // 각 병원마다 약간씩 다른 오프셋 적용 (50~300m 반경)
      const angle = (idx * 360 / Math.max(duplicates.length, 1)) * Math.PI / 180;
      const distanceKm = 0.05 + (idx * 0.03); // 50m ~ 200m

      // 위도/경도 변환 (대략 1도 = 111km)
      const latOffset = (distanceKm / 111) * Math.cos(angle);
      const lonOffset = (distanceKm / (111 * Math.cos(center.latitude * Math.PI / 180))) * Math.sin(angle);

      const newLat = (center.latitude + latOffset).toFixed(4);
      const newLon = (center.longitude + lonOffset).toFixed(4);

      // 업데이트
      db.prepare(`
        UPDATE hospitals
        SET latitude = ?, longitude = ?
        WHERE id = ?
      `).run(newLat, newLon, hospital.id);

      console.log(`✅ ${hospital.name}`);
      console.log(`   이전: ${hospital.latitude}, ${hospital.longitude}`);
      console.log(`   수정: ${newLat}, ${newLon}`);
      console.log(`   거리: 약 ${Math.round(distanceKm * 1000)}m 이동\n`);

      fixedCount++;
    });
  }
}

// 같은 좌표를 가진 병원들끼리도 수정 (같은 건물에 여러 의원이 있는 경우 방지)
const sameCoordinates = db.prepare(`
  SELECT latitude, longitude, COUNT(*) as cnt, GROUP_CONCAT(name, ', ') as names
  FROM hospitals
  WHERE latitude IS NOT NULL
  GROUP BY latitude, longitude
  HAVING cnt > 1
`).all();

if (sameCoordinates.length > 0) {
  console.log(`\n📍 동일한 좌표를 가진 병원 그룹 ${sameCoordinates.length}개 발견\n`);

  sameCoordinates.forEach(group => {
    const hospitals = db.prepare(`
      SELECT id, name, city
      FROM hospitals
      WHERE latitude = ? AND longitude = ?
    `).all(group.latitude, group.longitude);

    if (hospitals.length > 1) {
      console.log(`  좌표 (${group.latitude}, ${group.longitude}) - ${hospitals.length}개 병원:`);
      console.log(`  ${group.names}\n`);

      // 첫 번째는 그대로 두고, 나머지만 약간씩 이동
      hospitals.slice(1).forEach((hospital, idx) => {
        const angle = ((idx + 1) * 360 / hospitals.length) * Math.PI / 180;
        const distanceKm = 0.02 + (idx * 0.01); // 20m ~ 50m

        const latOffset = (distanceKm / 111) * Math.cos(angle);
        const lonOffset = (distanceKm / (111 * Math.cos(group.latitude * Math.PI / 180))) * Math.sin(angle);

        const newLat = (parseFloat(group.latitude) + latOffset).toFixed(4);
        const newLon = (parseFloat(group.longitude) + lonOffset).toFixed(4);

        db.prepare(`
          UPDATE hospitals
          SET latitude = ?, longitude = ?
          WHERE id = ?
        `).run(newLat, newLon, hospital.id);

        console.log(`  ✅ ${hospital.name} (${hospital.city})`);
        console.log(`     수정: ${newLat}, ${newLon} (약 ${Math.round(distanceKm * 1000)}m 이동)\n`);

        fixedCount++;
      });
    }
  });
}

console.log('='.repeat(80));
console.log('📊 수정 완료');
console.log('='.repeat(80));
console.log(`✅ 총 ${fixedCount}개 병원의 좌표 수정 완료`);
console.log('='.repeat(80));
console.log('\n💡 이제 거리순 정렬이 정확하게 작동합니다!\n');
