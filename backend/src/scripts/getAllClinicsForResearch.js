/**
 * 모든 의원 목록 추출 (실제 조사용)
 */

import db from '../database/init.js';

const allClinics = db.prepare(`
  SELECT id, name, address, phone, city
  FROM hospitals
  WHERE type = '의원'
  ORDER BY city, name
`).all();

console.log('의원 목록 (총 ' + allClinics.length + '개)\n');
console.log('ID | 이름 | 주소 | 전화번호 | 지역');
console.log('='.repeat(120));

allClinics.forEach(c => {
  console.log(`${c.id} | ${c.name} | ${c.address} | ${c.phone} | ${c.city}`);
});

// JSON 형태로도 출력
const fs = require('fs');
const path = require('path');

const outputPath = path.join(__dirname, 'clinics_for_research.json');
fs.writeFileSync(outputPath, JSON.stringify(allClinics, null, 2), 'utf-8');

console.log(`\n✅ JSON 파일 저장: ${outputPath}`);
