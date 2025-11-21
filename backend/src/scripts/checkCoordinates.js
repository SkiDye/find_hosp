/**
 * GPS 좌표 확인 스크립트
 */

import db from '../database/init.js';

console.log('\n' + '='.repeat(80));
console.log('📍 GPS 좌표 확인');
console.log('='.repeat(80) + '\n');

// 새로 추가된 의원들 확인 (이천시, 강남구, 서초구)
const newClinics = db.prepare(`
  SELECT id, name, city, type, latitude, longitude
  FROM hospitals
  WHERE city IN ('이천시', '강남구', '서초구')
  AND type = '의원'
  ORDER BY id DESC
  LIMIT 20
`).all();

console.log(`📋 새로 추가된 의원 (${newClinics.length}개):\n`);

let missingCoords = 0;
let hasCoords = 0;

newClinics.forEach((hospital, idx) => {
  const hasGPS = hospital.latitude && hospital.longitude;

  if (hasGPS) {
    console.log(`✅ [${idx + 1}] ${hospital.name} (${hospital.city})`);
    console.log(`   좌표: ${hospital.latitude}, ${hospital.longitude}\n`);
    hasCoords++;
  } else {
    console.log(`❌ [${idx + 1}] ${hospital.name} (${hospital.city})`);
    console.log(`   좌표: ${hospital.latitude || 'null'}, ${hospital.longitude || 'null'}\n`);
    missingCoords++;
  }
});

console.log('='.repeat(80));
console.log('📊 통계');
console.log('='.repeat(80));
console.log(`✅ 좌표 있음: ${hasCoords}개`);
console.log(`❌ 좌표 없음: ${missingCoords}개`);
console.log('='.repeat(80));

// 전체 통계
const totalStats = db.prepare(`
  SELECT
    COUNT(*) as total,
    SUM(CASE WHEN latitude IS NOT NULL AND longitude IS NOT NULL THEN 1 ELSE 0 END) as with_coords,
    SUM(CASE WHEN latitude IS NULL OR longitude IS NULL THEN 1 ELSE 0 END) as without_coords
  FROM hospitals
`).get();

console.log('\n📊 전체 병원 GPS 좌표 통계:');
console.log(`총 병원 수: ${totalStats.total}개`);
console.log(`좌표 있음: ${totalStats.with_coords}개 (${(totalStats.with_coords / totalStats.total * 100).toFixed(1)}%)`);
console.log(`좌표 없음: ${totalStats.without_coords}개 (${(totalStats.without_coords / totalStats.total * 100).toFixed(1)}%)`);

console.log('\n');
