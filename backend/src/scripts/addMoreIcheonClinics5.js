import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, '../../data/hospital-system.db');
const db = new Database(dbPath);

console.log('🏥 이천시 추가 의료기관 정보 추가 중 (7차)...\n');

// 추가 수집한 의료기관 데이터
const moreClinics = [
  // ===== 종합 병원 =====
  {
    name: '추새로병원',
    type: '병원',
    address: '경기도 이천시 영창로 189 3~8층 (창전동)',
    region: '경기',
    city: '이천시',
    phone: '1644-0810',
    specialties: '내과, 마취통증의학과, 신경과, 신경외과, 영상의학과, 정형외과',
    latitude: 37.2700,
    longitude: 127.4327,
    weekend_available: true
  },

  // ===== 안과 + 성형외과 =====
  {
    name: '이천새빛안과의원',
    type: '의원',
    address: '경기도 이천시 이섭대천로 1233 201호 (창전동, 화창빌딩)',
    region: '경기',
    city: '이천시',
    phone: '031-631-1275',
    specialties: '안과, 성형외과',
    latitude: 37.2688,
    longitude: 127.4310
  },

  // ===== 한의원 =====
  {
    name: '행복한의원',
    type: '한의원',
    address: '경기도 이천시 이섭대천로 1440-8 2층 (증포동, 신세기타운)',
    region: '경기',
    city: '이천시',
    phone: '031-635-5353',
    specialties: '한방내과, 침구과',
    latitude: 37.2735,
    longitude: 127.4388
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
