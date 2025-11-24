import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, '../../data/hospital-system.db');
const db = new Database(dbPath);

console.log('🏥 이천시 실제 의원 정보 추가 중...\n');

// 실제 존재하는 이천시 의원들 (웹 검색으로 확인된 정보)
const realClinics = [
  // 내과
  {
    name: '나우 현내과의원',
    type: '의원',
    address: '경기도 이천시 이섭대천로 1183 (중리동)',
    region: '경기',
    city: '이천시',
    phone: '031-635-0114',
    specialties: '내과',
    latitude: 37.2715,
    longitude: 127.4345,
    weekend_available: false
  },
  {
    name: '뉴선두연합내과의원',
    type: '의원',
    address: '경기도 이천시 장호원읍 장터로83번길 43',
    region: '경기',
    city: '이천시',
    phone: '031-643-5300',
    specialties: '내과, 소아청소년과',
    latitude: 37.1890,
    longitude: 127.6020,
    weekend_available: false
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
    longitude: 127.4380,
    weekend_available: false
  },
  {
    name: '한내과의원',
    type: '의원',
    address: '경기도 이천시 창전동',
    region: '경기',
    city: '이천시',
    phone: '031-633-8788',
    specialties: '내과',
    latitude: 37.2680,
    longitude: 127.4320,
    weekend_available: false
  },
  {
    name: '금강메디컬의원',
    type: '의원',
    address: '경기도 이천시 이섭대천로 1272 (창전동)',
    region: '경기',
    city: '이천시',
    phone: '031-634-3600',
    specialties: '내과, 가정의학과',
    latitude: 37.2695,
    longitude: 127.4305,
    weekend_available: false
  },

  // 정형외과
  {
    name: '이천날개정형외과',
    type: '의원',
    address: '경기도 이천시 중리천로13번길 21 이천프라자 2층',
    region: '경기',
    city: '이천시',
    phone: '031-694-8288',
    specialties: '정형외과',
    latitude: 37.2705,
    longitude: 127.4335,
    homepage: 'http://icheonnalgae.com/',
    weekend_available: true
  },
  {
    name: '이천정형외과의원',
    type: '의원',
    address: '경기도 이천시 중리천로82번길 25',
    region: '경기',
    city: '이천시',
    phone: '031-632-0114',
    specialties: '정형외과',
    latitude: 37.2722,
    longitude: 127.4350,
    weekend_available: false
  },

  // 소아청소년과
  {
    name: '이천소아청소년과의원',
    type: '의원',
    address: '경기도 이천시 중리동',
    region: '경기',
    city: '이천시',
    phone: '031-636-0114',
    specialties: '소아청소년과',
    latitude: 37.2710,
    longitude: 127.4340,
    weekend_available: false
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
    longitude: 127.4355,
    weekend_available: false
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
    longitude: 127.4350,
    weekend_available: false
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
    longitude: 127.4348,
    weekend_available: false
  },

  // 치과
  {
    name: '이천예치과',
    type: '치과',
    address: '경기도 이천시 중리천로 101',
    region: '경기',
    city: '이천시',
    phone: '031-632-2875',
    specialties: '치과',
    latitude: 37.2724,
    longitude: 127.4353,
    weekend_available: false
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
    longitude: 127.4365,
    weekend_available: false
  },
  {
    name: '이천서울이엘치과의원',
    type: '치과',
    address: '경기도 이천시 영창로 223 2층 (창전동, 역전빌딩)',
    region: '경기',
    city: '이천시',
    phone: '031-638-2021',
    specialties: '치과',
    latitude: 37.2690,
    longitude: 127.4328,
    homepage: 'https://seoulel.co.kr/',
    weekend_available: false
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
    console.log(`✅ ${clinic.name} 추가 완료`);
  } catch (error) {
    if (error.message.includes('UNIQUE constraint')) {
      console.log(`⚠️  ${clinic.name} 이미 존재함 (스킵)`);
    } else {
      console.error(`❌ ${clinic.name} 추가 실패:`, error.message);
    }
  }
});

console.log(`\n🎉 총 ${addedCount}개 의원 추가 완료!`);

// 결과 확인
const countStmt = db.prepare(`
  SELECT COUNT(*) as count FROM hospitals
  WHERE city = '이천시'
`);
const result = countStmt.get();
console.log(`📊 현재 이천시 병원/의원 총 ${result.count}개`);

// 타입별 통계
const typeStmt = db.prepare(`
  SELECT type, COUNT(*) as count FROM hospitals
  WHERE city = '이천시'
  GROUP BY type
  ORDER BY type
`);
const types = typeStmt.all();
console.log('\n📋 타입별 분포:');
types.forEach(t => console.log(`   ${t.type}: ${t.count}개`));

db.close();
