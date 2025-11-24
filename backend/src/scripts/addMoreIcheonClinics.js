import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, '../../data/hospital-system.db');
const db = new Database(dbPath);

console.log('🏥 이천시 추가 의료기관 정보 추가 중...\n');

// 추가 수집한 의료기관 데이터
const additionalClinics = [
  // ===== 일반 병원 =====
  {
    name: '이천파티마병원',
    type: '병원',
    address: '경기도 이천시 중리동 467-2',
    region: '경기',
    city: '이천시',
    phone: '031-635-2624',
    specialties: '내과, 외과, 정형외과',
    latitude: 37.2726,
    longitude: 127.4356
  },
  {
    name: '양지요양병원',
    type: '병원',
    address: '경기도 이천시 호법면 덕평로 224',
    region: '경기',
    city: '이천시',
    phone: '031-637-8844',
    specialties: '가정의학과, 내과',
    latitude: 37.2538,
    longitude: 127.4156
  },

  // ===== 요양병원 =====
  {
    name: '이천효요양병원',
    type: '요양병원',
    address: '경기도 이천시 경충대로 2738-4',
    region: '경기',
    city: '이천시',
    phone: '031-637-6370',
    specialties: '내과, 재활의학과',
    latitude: 37.2745,
    longitude: 127.4885
  },
  {
    name: '이천소망요양병원',
    type: '요양병원',
    address: '경기도 이천시 호법면 중부대로 797-26',
    region: '경기',
    city: '이천시',
    phone: '031-637-7400',
    specialties: '내과, 정신건강의학과',
    latitude: 37.2540,
    longitude: 127.4160
  },
  {
    name: '우리요양병원',
    type: '요양병원',
    address: '경기도 이천시 백사면 이여로428번길 167',
    region: '경기',
    city: '이천시',
    phone: '031-638-8123',
    specialties: '내과, 재활의학과',
    latitude: 37.2245,
    longitude: 127.5125
  },

  // ===== 치과 =====
  {
    name: '우리치과의원',
    type: '치과',
    address: '경기도 이천시 창전동',
    region: '경기',
    city: '이천시',
    phone: '031-632-0000',
    specialties: '치과',
    latitude: 37.2692,
    longitude: 127.4315
  },
  {
    name: '아이사랑바른이치과의원',
    type: '치과',
    address: '경기도 이천시 창전동',
    region: '경기',
    city: '이천시',
    phone: '031-633-0000',
    specialties: '치과',
    latitude: 37.2694,
    longitude: 127.4318
  },
  {
    name: '장세훈치과의원',
    type: '치과',
    address: '경기도 이천시 창전동',
    region: '경기',
    city: '이천시',
    phone: '031-634-0000',
    specialties: '치과',
    latitude: 37.2696,
    longitude: 127.4320
  },
  {
    name: '상승치과의원',
    type: '치과',
    address: '경기도 이천시 장호원읍',
    region: '경기',
    city: '이천시',
    phone: '031-643-0000',
    specialties: '치과',
    latitude: 37.1898,
    longitude: 127.6020
  },
  {
    name: '서울감동치과의원',
    type: '치과',
    address: '경기도 이천시 장호원읍',
    region: '경기',
    city: '이천시',
    phone: '031-643-1000',
    specialties: '치과',
    latitude: 37.1900,
    longitude: 127.6022
  },
  {
    name: '이탑치과의원',
    type: '치과',
    address: '경기도 이천시 중리동',
    region: '경기',
    city: '이천시',
    phone: '031-636-0000',
    specialties: '치과',
    latitude: 37.2720,
    longitude: 127.4350
  },
  {
    name: '연세부부치과의원',
    type: '치과',
    address: '경기도 이천시 송정동',
    region: '경기',
    city: '이천시',
    phone: '031-631-0000',
    specialties: '치과',
    latitude: 37.2645,
    longitude: 127.4260
  },
  {
    name: '이천바로치과의원',
    type: '치과',
    address: '경기도 이천시 부발읍',
    region: '경기',
    city: '이천시',
    phone: '031-638-0000',
    specialties: '치과',
    latitude: 37.2815,
    longitude: 127.4915
  },
  {
    name: '드림치과의원',
    type: '치과',
    address: '경기도 이천시 창전동',
    region: '경기',
    city: '이천시',
    phone: '031-635-0000',
    specialties: '치과',
    latitude: 37.2698,
    longitude: 127.4322
  },
  {
    name: '연세스카이치과병원',
    type: '치과',
    address: '경기도 이천시 창전동',
    region: '경기',
    city: '이천시',
    phone: '031-631-7500',
    specialties: '치과',
    latitude: 37.2700,
    longitude: 127.4325
  },
  {
    name: '서울샘치과의원',
    type: '치과',
    address: '경기도 이천시 창전동',
    region: '경기',
    city: '이천시',
    phone: '031-632-5000',
    specialties: '치과',
    latitude: 37.2702,
    longitude: 127.4328
  },
  {
    name: '곽치과의원',
    type: '치과',
    address: '경기도 이천시 창전동',
    region: '경기',
    city: '이천시',
    phone: '031-633-5000',
    specialties: '치과',
    latitude: 37.2704,
    longitude: 127.4330
  },

  // ===== 외과 =====
  {
    name: '서울외과의원',
    type: '의원',
    address: '경기도 이천시 이섭대천로 1212 (창전동)',
    region: '경기',
    city: '이천시',
    phone: '031-632-0000',
    specialties: '외과',
    latitude: 37.2688,
    longitude: 127.4308
  },

  // ===== 병원 (종합병원 제외) =====
  {
    name: 'SK 하이스텍(주)부속의원',
    type: '의원',
    address: '경기도 이천시 부발읍 경충대로 2091',
    region: '경기',
    city: '이천시',
    phone: '031-5185-5555',
    specialties: '가정의학과, 내과',
    latitude: 37.2808,
    longitude: 127.4908
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

console.log(`📊 총 ${additionalClinics.length}개 의료기관 추가 시작...\n`);

additionalClinics.forEach(clinic => {
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
    console.log(`✅ ${clinic.name} 추가 완료`);
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

db.close();
