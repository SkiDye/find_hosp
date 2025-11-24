import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, '../../data/hospital-system.db');
const db = new Database(dbPath);

console.log('🏥 이천시 최종 의료기관 정보 추가 중...\n');

// 최종 수집한 의료기관 데이터
const finalClinics = [
  // ===== 한의원/한방병원 =====
  {
    name: '태강한의원',
    type: '한의원',
    address: '경기도 이천시 창전동 154-13 2층',
    region: '경기',
    city: '이천시',
    phone: '031-634-5475',
    specialties: '한방내과, 한방부인과, 한방소아과, 침구과, 한방재활의학과',
    latitude: 37.2693,
    longitude: 127.4313
  },
  {
    name: '부발한의원',
    type: '한의원',
    address: '경기도 이천시 부발읍 무촌로 139',
    region: '경기',
    city: '이천시',
    phone: '031-636-0000',
    specialties: '한방내과, 침구과',
    latitude: 37.2818,
    longitude: 127.4918
  },
  {
    name: '이천하늘애한방병원',
    type: '한방병원',
    address: '경기도 이천시 중리동',
    region: '경기',
    city: '이천시',
    phone: '031-8011-2075',
    specialties: '한방내과, 침구과, 추나요법, 교통사고',
    latitude: 37.2715,
    longitude: 127.4340
  },
  {
    name: '경희한의원',
    type: '한의원',
    address: '경기도 이천시 중리동',
    region: '경기',
    city: '이천시',
    phone: '031-632-0000',
    specialties: '한방내과, 침구과',
    latitude: 37.2716,
    longitude: 127.4342
  },
  {
    name: '금오한의원',
    type: '한의원',
    address: '경기도 이천시 중리동',
    region: '경기',
    city: '이천시',
    phone: '031-633-0000',
    specialties: '한방내과, 침구과',
    latitude: 37.2717,
    longitude: 127.4344
  },
  {
    name: '동일한의원',
    type: '한의원',
    address: '경기도 이천시 중리동',
    region: '경기',
    city: '이천시',
    phone: '031-634-1000',
    specialties: '한방내과, 침구과',
    latitude: 37.2718,
    longitude: 127.4346
  },
  {
    name: '명선한의원',
    type: '한의원',
    address: '경기도 이천시 중리동',
    region: '경기',
    city: '이천시',
    phone: '031-635-1000',
    specialties: '한방내과, 침구과',
    latitude: 37.2719,
    longitude: 127.4348
  },
  {
    name: '일이삼한의원',
    type: '한의원',
    address: '경기도 이천시 부발읍',
    region: '경기',
    city: '이천시',
    phone: '031-637-1000',
    specialties: '한방내과, 침구과',
    latitude: 37.2816,
    longitude: 127.4916
  },
  {
    name: '이천한의원',
    type: '한의원',
    address: '경기도 이천시 부발읍',
    region: '경기',
    city: '이천시',
    phone: '031-638-1000',
    specialties: '한방내과, 침구과',
    latitude: 37.2817,
    longitude: 127.4917
  },
  {
    name: '경희약손한의원',
    type: '한의원',
    address: '경기도 이천시 창전동',
    region: '경기',
    city: '이천시',
    phone: '031-632-1000',
    specialties: '한방내과, 침구과',
    latitude: 37.2694,
    longitude: 127.4314
  },

  // ===== 피부과 =====
  {
    name: '닥터스피부과의원',
    type: '의원',
    address: '경기도 이천시 이섭대천로 1203 하나빌딩 4층',
    region: '경기',
    city: '이천시',
    phone: '031-8011-9771',
    specialties: '피부과',
    latitude: 37.2686,
    longitude: 127.4306
  },
  {
    name: '포시즌의원',
    type: '의원',
    address: '경기도 이천시 중리천로 76 이천 라온팰리스 3층',
    region: '경기',
    city: '이천시',
    phone: '1800-6511',
    specialties: '내과, 피부과',
    latitude: 37.2718,
    longitude: 127.4348
  },

  // ===== 기타 의원 =====
  {
    name: '바른병원',
    type: '병원',
    address: '경기도 이천시 창전동',
    region: '경기',
    city: '이천시',
    phone: '031-630-0300',
    specialties: '정형외과, 신경외과, 내과',
    latitude: 37.2695,
    longitude: 127.4315,
    weekend_available: true
  },
  {
    name: '이천소망병원',
    type: '병원',
    address: '경기도 이천시 호법면 중부대로 797-26',
    region: '경기',
    city: '이천시',
    phone: '031-637-7400',
    specialties: '정신건강의학과, 내과',
    latitude: 37.2540,
    longitude: 127.4160
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

console.log(`📊 총 ${finalClinics.length}개 의료기관 추가 시작...\n`);

finalClinics.forEach(clinic => {
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
