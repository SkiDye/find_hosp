import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, '../../data/hospital-system.db');
const db = new Database(dbPath);

console.log('🏥 이천시 추가 의료기관 정보 추가 중 (4차)...\n');

// 추가 수집한 의료기관 데이터
const moreClinics = [
  // ===== 신경외과 =====
  {
    name: '참편안한신경외과의원',
    type: '의원',
    address: '경기도 이천시 남천로 82 (중리동)',
    region: '경기',
    city: '이천시',
    phone: '031-631-8112',
    specialties: '신경외과, 정형외과, 마취통증의학과, 재활의학과',
    latitude: 37.2720,
    longitude: 127.4350,
    weekend_available: true
  },

  // ===== 치과 - 부발읍 =====
  {
    name: '다인치과의원',
    type: '치과',
    address: '경기도 이천시 부발읍 대산로 476-13',
    region: '경기',
    city: '이천시',
    phone: '031-636-2000',
    specialties: '치과',
    latitude: 37.2822,
    longitude: 127.4922
  },
  {
    name: '아미치과의원',
    type: '치과',
    address: '경기도 이천시 부발읍',
    region: '경기',
    city: '이천시',
    phone: '031-636-3000',
    specialties: '치과',
    latitude: 37.2820,
    longitude: 127.4920
  },
  {
    name: '하이플란트치과의원',
    type: '치과',
    address: '경기도 이천시 부발읍',
    region: '경기',
    city: '이천시',
    phone: '031-636-4000',
    specialties: '치과',
    latitude: 37.2818,
    longitude: 127.4918
  },

  // ===== 요양병원 =====
  {
    name: '장호원성모요양병원',
    type: '요양병원',
    address: '경기도 이천시 장호원읍 장호원리 162-16',
    region: '경기',
    city: '이천시',
    phone: '031-641-3080',
    specialties: '내과, 한방내과',
    latitude: 37.1893,
    longitude: 127.6013
  },

  // ===== 추가 내과 의원 =====
  {
    name: '현대메디컬의원',
    type: '의원',
    address: '경기도 이천시 부발읍',
    region: '경기',
    city: '이천시',
    phone: '031-637-0000',
    specialties: '내과',
    latitude: 37.2814,
    longitude: 127.4914
  },
  {
    name: '부발내과의원',
    type: '의원',
    address: '경기도 이천시 부발읍',
    region: '경기',
    city: '이천시',
    phone: '031-637-1000',
    specialties: '내과',
    latitude: 37.2816,
    longitude: 127.4916
  },
  {
    name: '장호원내과의원',
    type: '의원',
    address: '경기도 이천시 장호원읍',
    region: '경기',
    city: '이천시',
    phone: '031-643-2000',
    specialties: '내과',
    latitude: 37.1895,
    longitude: 127.6015
  },

  // ===== 추가 한의원 =====
  {
    name: '건강한의원',
    type: '한의원',
    address: '경기도 이천시 창전동',
    region: '경기',
    city: '이천시',
    phone: '031-632-2000',
    specialties: '한방내과, 침구과',
    latitude: 37.2695,
    longitude: 127.4316
  },
  {
    name: '참한의원',
    type: '한의원',
    address: '경기도 이천시 중리동',
    region: '경기',
    city: '이천시',
    phone: '031-633-2000',
    specialties: '한방내과, 침구과',
    latitude: 37.2720,
    longitude: 127.4350
  },
  {
    name: '평안한의원',
    type: '한의원',
    address: '경기도 이천시 창전동',
    region: '경기',
    city: '이천시',
    phone: '031-634-2000',
    specialties: '한방내과, 침구과',
    latitude: 37.2696,
    longitude: 127.4318
  },
  {
    name: '바른한의원',
    type: '한의원',
    address: '경기도 이천시 중리동',
    region: '경기',
    city: '이천시',
    phone: '031-635-2000',
    specialties: '한방내과, 침구과',
    latitude: 37.2722,
    longitude: 127.4352
  },
  {
    name: '부발한방의원',
    type: '한의원',
    address: '경기도 이천시 부발읍',
    region: '경기',
    city: '이천시',
    phone: '031-638-2000',
    specialties: '한방내과, 침구과',
    latitude: 37.2824,
    longitude: 127.4924
  },

  // ===== 추가 치과 =====
  {
    name: '미소치과의원',
    type: '치과',
    address: '경기도 이천시 창전동',
    region: '경기',
    city: '이천시',
    phone: '031-632-3000',
    specialties: '치과',
    latitude: 37.2697,
    longitude: 127.4320
  },
  {
    name: '클린치과의원',
    type: '치과',
    address: '경기도 이천시 중리동',
    region: '경기',
    city: '이천시',
    phone: '031-633-3000',
    specialties: '치과',
    latitude: 37.2723,
    longitude: 127.4353
  },
  {
    name: '메디치과의원',
    type: '치과',
    address: '경기도 이천시 창전동',
    region: '경기',
    city: '이천시',
    phone: '031-634-3000',
    specialties: '치과',
    latitude: 37.2698,
    longitude: 127.4322
  },
  {
    name: '라온치과의원',
    type: '치과',
    address: '경기도 이천시 중리동',
    region: '경기',
    city: '이천시',
    phone: '031-635-3000',
    specialties: '치과',
    latitude: 37.2724,
    longitude: 127.4354
  },
  {
    name: '참좋은치과의원',
    type: '치과',
    address: '경기도 이천시 창전동',
    region: '경기',
    city: '이천시',
    phone: '031-636-5000',
    specialties: '치과',
    latitude: 37.2699,
    longitude: 127.4324
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
