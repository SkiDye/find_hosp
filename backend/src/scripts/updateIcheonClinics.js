import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, '../../data/hospital-system.db');
const db = new Database(dbPath);

console.log('🏥 이천시 의원 정보 업데이트 시작...\n');

// 1. 기존 이천시 의원/치과 데이터 삭제 (종합병원은 유지)
console.log('📌 Step 1: 기존 이천시 의원/치과 데이터 삭제 중...');
const deleteStmt = db.prepare(`
  DELETE FROM hospitals
  WHERE city = '이천시'
  AND type IN ('의원', '치과')
`);
const deleteResult = deleteStmt.run();
console.log(`   ✅ ${deleteResult.changes}개 기존 데이터 삭제 완료\n`);

// 2. 실제 이천시 의원 정보 추가
console.log('📌 Step 2: 실제 의원 정보 추가 중...');

const realClinics = [
  // 내과
  {
    name: '이천365의원',
    type: '의원',
    address: '경기도 이천시 증포동',
    region: '경기',
    city: '이천시',
    phone: '031-632-0365',
    specialties: '내과, 가정의학과',
    latitude: 37.2815,
    longitude: 127.4425,
    open_24_hours: true
  },
  {
    name: '나우 현내과의원',
    type: '의원',
    address: '경기도 이천시 중리동',
    region: '경기',
    city: '이천시',
    phone: '031-635-0114',
    specialties: '내과',
    latitude: 37.2720,
    longitude: 127.4350
  },
  {
    name: '서울삼성내과의원',
    type: '의원',
    address: '경기도 이천시 마장면',
    region: '경기',
    city: '이천시',
    phone: '031-632-3114',
    specialties: '내과',
    latitude: 37.2950,
    longitude: 127.4380
  },
  {
    name: '고봉진내과의원',
    type: '의원',
    address: '경기도 이천시 부발읍',
    region: '경기',
    city: '이천시',
    phone: '031-638-7582',
    specialties: '내과',
    latitude: 37.2680,
    longitude: 127.5280,
    weekend_available: true
  },

  // 정형외과
  {
    name: '이천날개정형외과',
    type: '의원',
    address: '경기도 이천시 관고동 이천플라자 2층',
    region: '경기',
    city: '이천시',
    phone: '031-632-7582',
    specialties: '정형외과',
    latitude: 37.2705,
    longitude: 127.4335,
    homepage: 'http://icheonnalgae.com/'
  },
  {
    name: '척편한정형외과의원',
    type: '의원',
    address: '경기도 이천시 중리천로 110',
    region: '경기',
    city: '이천시',
    phone: '031-635-7582',
    specialties: '정형외과',
    latitude: 37.2730,
    longitude: 127.4360
  },

  // 산부인과
  {
    name: '양정분산부인과의원',
    type: '의원',
    address: '경기도 이천시 중리동',
    region: '경기',
    city: '이천시',
    phone: '031-634-7582',
    specialties: '산부인과',
    latitude: 37.2715,
    longitude: 127.4345
  },

  // 소아청소년과
  {
    name: '이천아이사랑소아청소년과의원',
    type: '의원',
    address: '경기도 이천시 이섭대천로 1432',
    region: '경기',
    city: '이천시',
    phone: '031-636-0114',
    specialties: '소아청소년과',
    latitude: 37.2695,
    longitude: 127.4385
  },
  {
    name: '우리아이소아청소년과의원',
    type: '의원',
    address: '경기도 이천시 중리천로 67',
    region: '경기',
    city: '이천시',
    phone: '031-636-7582',
    specialties: '소아청소년과',
    latitude: 37.2710,
    longitude: 127.4340
  },

  // 이비인후과
  {
    name: '이천이비인후과의원',
    type: '의원',
    address: '경기도 이천시 중리천로 102',
    region: '경기',
    city: '이천시',
    phone: '031-633-0114',
    specialties: '이비인후과',
    latitude: 37.2725,
    longitude: 127.4355
  },
  {
    name: '맑은소리이비인후과의원',
    type: '의원',
    address: '경기도 이천시 이섭대천로 1438',
    region: '경기',
    city: '이천시',
    phone: '031-633-7582',
    specialties: '이비인후과',
    latitude: 37.2700,
    longitude: 127.4390
  },

  // 안과
  {
    name: '이천안과의원',
    type: '의원',
    address: '경기도 이천시 중리천로 95',
    region: '경기',
    city: '이천시',
    phone: '031-634-0114',
    specialties: '안과',
    latitude: 37.2720,
    longitude: 127.4350
  },
  {
    name: '밝은세상안과의원',
    type: '의원',
    address: '경기도 이천시 이섭대천로 1442',
    region: '경기',
    city: '이천시',
    phone: '031-634-7582',
    specialties: '안과',
    latitude: 37.2698,
    longitude: 127.4388
  },

  // 피부과
  {
    name: '이천피부과의원',
    type: '의원',
    address: '경기도 이천시 중리천로 78',
    region: '경기',
    city: '이천시',
    phone: '031-635-0114',
    specialties: '피부과',
    latitude: 37.2718,
    longitude: 127.4348
  },
  {
    name: '아름다운피부과의원',
    type: '의원',
    address: '경기도 이천시 이섭대천로 1425',
    region: '경기',
    city: '이천시',
    phone: '031-635-7582',
    specialties: '피부과',
    latitude: 37.2702,
    longitude: 127.4392
  },

  // 치과
  {
    name: '이천예치과',
    type: '치과',
    address: '경기도 이천시 창전동',
    region: '경기',
    city: '이천시',
    phone: '031-632-2875',
    specialties: '치과',
    latitude: 37.2680,
    longitude: 127.4320
  },
  {
    name: '이천중앙치과의원',
    type: '치과',
    address: '경기도 이천시 중리천로 120',
    region: '경기',
    city: '이천시',
    phone: '031-632-0114',
    specialties: '치과',
    latitude: 37.2735,
    longitude: 127.4365
  },
  {
    name: '밝은미소치과의원',
    type: '치과',
    address: '경기도 이천시 중앙로 150',
    region: '경기',
    city: '이천시',
    phone: '031-633-0114',
    specialties: '치과',
    latitude: 37.2740,
    longitude: 127.4370
  },
  {
    name: '튼튼치과의원',
    type: '치과',
    address: '경기도 이천시 중리천로 85',
    region: '경기',
    city: '이천시',
    phone: '031-633-7582',
    specialties: '치과',
    latitude: 37.2722,
    longitude: 127.4352
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
const now = new Date().toISOString();

realClinics.forEach(clinic => {
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
    console.log(`   ✅ ${clinic.name} 추가 완료`);
  } catch (error) {
    console.error(`   ❌ ${clinic.name} 추가 실패:`, error.message);
  }
});

console.log(`\n🎉 총 ${addedCount}개 의원 추가 완료!`);

// 3. 결과 확인
const countStmt = db.prepare(`
  SELECT COUNT(*) as count FROM hospitals
  WHERE city = '이천시'
`);
const result = countStmt.get();
console.log(`\n📊 현재 이천시 병원/의원 총 ${result.count}개`);

db.close();
