import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, '../../data/hospital-system.db');
const db = new Database(dbPath);

console.log('🏥 이천시 추가 의료기관 정보 추가 중 (6차)...\n');

// 추가 수집한 의료기관 데이터
const moreClinics = [
  // ===== 한의원 =====
  {
    name: '안현주경희한의원',
    type: '한의원',
    address: '경기도 이천시 증신로 131 (증포동)',
    region: '경기',
    city: '이천시',
    phone: '031-632-7000',
    specialties: '한방내과, 침구과',
    latitude: 37.2760,
    longitude: 127.4410
  },
  {
    name: '도담한의원',
    type: '한의원',
    address: '경기도 이천시 아리역로 1 (창전동)',
    region: '경기',
    city: '이천시',
    phone: '031-634-8875',
    specialties: '한방내과, 침구과',
    latitude: 37.2690,
    longitude: 127.4310
  },

  // ===== 종합의원 =====
  {
    name: '서울중앙의원',
    type: '의원',
    address: '경기도 이천시 이섭대천로 1381 (증포동 178-14)',
    region: '경기',
    city: '이천시',
    phone: '031-631-8275',
    specialties: '내과, 외과, 정형외과, 성형외과, 산부인과, 소아청소년과, 이비인후과',
    latitude: 37.2750,
    longitude: 127.4400
  },
  {
    name: '이천한사랑의원',
    type: '의원',
    address: '경기도 이천시 증포동 178-2',
    region: '경기',
    city: '이천시',
    phone: '031-638-5544',
    specialties: '외과, 내과, 유방외과, 대장항문외과',
    latitude: 37.2752,
    longitude: 127.4402
  }
];

const insertStmt = db.prepare(`
  INSERT INTO hospitals (
    name, type, address, region, city, phone, specialties,
    latitude, longitude, homepage,
    has_emergency_room, open_24_hours, weekend_available,
    image_url, image_urls, created_at, updated_at
  ) VALUES (
    ?, ?, ?, ?, ?, ?, ?,
    ?, ?, ?,
    ?, ?, ?,
    ?, ?, ?, ?
  )
`);

let addedCount = 0;
let skippedCount = 0;
let errorCount = 0;
const now = new Date().toISOString();

console.log(`📊 총 ${moreClinics.length}개 의료기관 추가 시작...\n`);

moreClinics.forEach(clinic => {
  try {
    insertStmt.run(
      clinic.name,
      clinic.type,
      clinic.address,
      clinic.region,
      clinic.city,
      clinic.phone,
      clinic.specialties,
      clinic.latitude,
      clinic.longitude,
      clinic.homepage || null,
      clinic.has_emergency_room ? 1 : 0,
      clinic.open_24_hours ? 1 : 0,
      clinic.weekend_available ? 1 : 0,
      null, // image_url
      '[]', // image_urls
      now,
      now
    );
    addedCount++;
    console.log(`✅ ${clinic.name} (${clinic.type}) 추가 완료`);
  } catch (error) {
    if (error.message.includes('UNIQUE constraint')) {
      skippedCount++;
      console.log(`⚠️  ${clinic.name} 이미 존재함 (스킵)`);
    } else {
      errorCount++;
      console.error(`❌ ${clinic.name} 추가 실패:`, error.message);
    }
  }
});

console.log(`\n🎉 작업 완료!`);
console.log(`   ✅ 추가: ${addedCount}개`);
console.log(`   ⚠️  스킵: ${skippedCount}개`);
console.log(`   ❌ 실패: ${errorCount}개`);

// 결과 확인
const countStmt = db.prepare(`
  SELECT COUNT(*) as count FROM hospitals
  WHERE city = '이천시'
`);
const result = countStmt.get();
console.log(`\n📊 현재 이천시 병원/의원 총 ${result.count}개`);

// 타입별 통계
const typeStmt = db.prepare(`
  SELECT type, COUNT(*) as count FROM hospitals
  WHERE city = '이천시'
  GROUP BY type
  ORDER BY count DESC
`);
const types = typeStmt.all();
console.log('\n📋 타입별 분포:');
types.forEach(t => console.log(`   ${t.type}: ${t.count}개`));

// 한의원 통계
const haniCount = db.prepare(`
  SELECT COUNT(*) as count FROM hospitals
  WHERE city = '이천시' AND (type = '한의원' OR type = '한방병원')
`).get();
console.log(`\n🏥 한의원/한방병원: ${haniCount.count}개`);

db.close();
