import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, '../../data/hospital-system.db');
const db = new Database(dbPath);

console.log('🏥 이천시 모든 의원 정보 추가 중...\n');

// 수집한 모든 의원 데이터
const allClinics = [
  // ===== 내과 =====
  {
    name: '(의) 열린의료재단 이천열린의원',
    type: '의원',
    address: '경기도 이천시 이섭대천로 1440-8, 신세기타운 201,206호',
    region: '경기',
    city: '이천시',
    phone: '031-631-3001',
    specialties: '내과',
    latitude: 37.2735,
    longitude: 127.4388
  },
  {
    name: '고봉진내과의원',
    type: '의원',
    address: '경기도 이천시 부발읍 경충대로 2485',
    region: '경기',
    city: '이천시',
    phone: '031-638-0991',
    specialties: '내과',
    latitude: 37.2820,
    longitude: 127.4920
  },
  {
    name: '금강메디컬의원',
    type: '의원',
    address: '경기도 이천시 이섭대천로 1272',
    region: '경기',
    city: '이천시',
    phone: '031-634-3600',
    specialties: '내과, 가정의학과',
    latitude: 37.2695,
    longitude: 127.4305
  },
  {
    name: '김내과의원',
    type: '의원',
    address: '경기도 이천시 장호원읍 장감로 77',
    region: '경기',
    city: '이천시',
    phone: '031-641-5555',
    specialties: '내과',
    latitude: 37.1905,
    longitude: 127.6010
  },
  {
    name: '나우 현내과의원',
    type: '의원',
    address: '경기도 이천시 아리역로 1, 5층',
    region: '경기',
    city: '이천시',
    phone: '031-635-8744',
    specialties: '내과',
    latitude: 37.2708,
    longitude: 127.4295
  },
  {
    name: '민내과의원',
    type: '의원',
    address: '경기도 이천시 중리천로72번길 2, 3층',
    region: '경기',
    city: '이천시',
    phone: '031-635-5714',
    specialties: '내과',
    latitude: 37.2718,
    longitude: 127.4342
  },
  {
    name: '박민호내과의원',
    type: '의원',
    address: '경기도 이천시 장호원읍',
    region: '경기',
    city: '이천시',
    phone: '031-641-5533',
    specialties: '내과',
    latitude: 37.1895,
    longitude: 127.6005
  },
  {
    name: '삼성명인내과의원',
    type: '의원',
    address: '경기도 이천시 장호원읍',
    region: '경기',
    city: '이천시',
    phone: '031-642-1360',
    specialties: '내과',
    latitude: 37.1900,
    longitude: 127.6015
  },
  {
    name: '상승의원',
    type: '의원',
    address: '경기도 이천시 부발읍',
    region: '경기',
    city: '이천시',
    phone: '031-640-1705',
    specialties: '내과',
    latitude: 37.2815,
    longitude: 127.4915
  },
  {
    name: '서울내과의원',
    type: '의원',
    address: '경기도 이천시 창전동',
    region: '경기',
    city: '이천시',
    phone: '031-631-1588',
    specialties: '내과',
    latitude: 37.2693,
    longitude: 127.4318
  },
  {
    name: '서울삼성연합외과의원',
    type: '의원',
    address: '경기도 이천시 창전동',
    region: '경기',
    city: '이천시',
    phone: '031-637-3119',
    specialties: '내과, 외과',
    latitude: 37.2690,
    longitude: 127.4320
  },
  {
    name: '서울삼성내과의원',
    type: '의원',
    address: '경기도 이천시 마장면 경충대로 2930',
    region: '경기',
    city: '이천시',
    phone: '031-8011-3875',
    specialties: '내과',
    latitude: 37.2950,
    longitude: 127.4380
  },
  {
    name: '선두연합내과의원',
    type: '의원',
    address: '경기도 이천시 장호원읍 장터로83번길 43',
    region: '경기',
    city: '이천시',
    phone: '031-643-5300',
    specialties: '내과, 소아청소년과',
    latitude: 37.1890,
    longitude: 127.6020
  },
  {
    name: '사자의원',
    type: '의원',
    address: '경기도 이천시 진리동',
    region: '경기',
    city: '이천시',
    phone: '02-3403-1718',
    specialties: '내과',
    latitude: 37.2775,
    longitude: 127.4295
  },
  {
    name: '연세든든내과의원',
    type: '의원',
    address: '경기도 이천시 창전동',
    region: '경기',
    city: '이천시',
    phone: '031-694-0775',
    specialties: '내과',
    latitude: 37.2695,
    longitude: 127.4315
  },
  {
    name: '윤내과의원',
    type: '의원',
    address: '경기도 이천시 창전동',
    region: '경기',
    city: '이천시',
    phone: '031-637-7512',
    specialties: '내과',
    latitude: 37.2697,
    longitude: 127.4322
  },
  {
    name: '이천김내과의원',
    type: '의원',
    address: '경기도 이천시 창전동',
    region: '경기',
    city: '이천시',
    phone: '031-632-1570',
    specialties: '내과',
    latitude: 37.2698,
    longitude: 127.4325
  },
  {
    name: '이준편한내과의원',
    type: '의원',
    address: '경기도 이천시 장호원읍',
    region: '경기',
    city: '이천시',
    phone: '031-643-7001',
    specialties: '내과',
    latitude: 37.1892,
    longitude: 127.6012
  },
  {
    name: '장내과의원',
    type: '의원',
    address: '경기도 이천시 창전동',
    region: '경기',
    city: '이천시',
    phone: '031-632-0000',
    specialties: '내과',
    latitude: 37.2700,
    longitude: 127.4327
  },
  {
    name: '정승화내과의원',
    type: '의원',
    address: '경기도 이천시 창전동',
    region: '경기',
    city: '이천시',
    phone: '031-638-4191',
    specialties: '내과',
    latitude: 37.2702,
    longitude: 127.4330
  },
  {
    name: '지내과의원',
    type: '의원',
    address: '경기도 이천시 마장면',
    region: '경기',
    city: '이천시',
    phone: '031-637-4996',
    specialties: '내과',
    latitude: 37.2945,
    longitude: 127.4375
  },
  {
    name: '참사랑내과의원',
    type: '의원',
    address: '경기도 이천시 창전동',
    region: '경기',
    city: '이천시',
    phone: '031-631-2282',
    specialties: '내과',
    latitude: 37.2704,
    longitude: 127.4332
  },
  {
    name: '한결내과의원',
    type: '의원',
    address: '경기도 이천시 창전동',
    region: '경기',
    city: '이천시',
    phone: '031-635-1005',
    specialties: '내과',
    latitude: 37.2706,
    longitude: 127.4334
  },
  {
    name: '한국내과의원',
    type: '의원',
    address: '경기도 이천시 창전동',
    region: '경기',
    city: '이천시',
    phone: '031-632-7770',
    specialties: '내과',
    latitude: 37.2707,
    longitude: 127.4336
  },
  {
    name: '한내과의원',
    type: '의원',
    address: '경기도 이천시 이섭대천로 1295',
    region: '경기',
    city: '이천시',
    phone: '031-633-8788',
    specialties: '내과',
    latitude: 37.2680,
    longitude: 127.4320
  },

  // ===== 가정의학과 =====
  {
    name: 'Dr.배 가정의학과의원',
    type: '의원',
    address: '경기도 이천시 부발읍 경충대로 2088, 삼성홈플렉스 2층',
    region: '경기',
    city: '이천시',
    phone: '070-8824-4846',
    specialties: '가정의학과',
    latitude: 37.2810,
    longitude: 127.4910
  },
  {
    name: '금강이화의원',
    type: '의원',
    address: '경기도 이천시 이섭대천로 1272, 3층',
    region: '경기',
    city: '이천시',
    phone: '031-634-3600',
    specialties: '가정의학과',
    latitude: 37.2695,
    longitude: 127.4305
  },
  {
    name: '메디홈즈의원',
    type: '의원',
    address: '경기도 이천시 증신로291번길 133, 102호 (송정동)',
    region: '경기',
    city: '이천시',
    phone: '031-631-5191',
    specialties: '가정의학과',
    latitude: 37.2642,
    longitude: 127.4258
  },
  {
    name: '수메디컬의원',
    type: '의원',
    address: '경기도 이천시 장호원읍 장감로 64',
    region: '경기',
    city: '이천시',
    phone: '031-642-5119',
    specialties: '가정의학과',
    latitude: 37.1897,
    longitude: 127.6008
  },
  {
    name: '이안숙의원',
    type: '의원',
    address: '경기도 이천시 어재연로10번길 18 (중리동)',
    region: '경기',
    city: '이천시',
    phone: '031-633-0067',
    specialties: '가정의학과',
    latitude: 37.2715,
    longitude: 127.4335
  },
  {
    name: '이안의원',
    type: '의원',
    address: '경기도 이천시 설봉로 28 (중리동)',
    region: '경기',
    city: '이천시',
    phone: '031-631-7901',
    specialties: '가정의학과',
    latitude: 37.2720,
    longitude: 127.4340
  },
  {
    name: '이천365의원',
    type: '의원',
    address: '경기도 이천시 이섭대천로 1380',
    region: '경기',
    city: '이천시',
    phone: '031-636-3650',
    specialties: '가정의학과',
    latitude: 37.2712,
    longitude: 127.4342,
    open_24_hours: true
  },
  {
    name: '이화미의원',
    type: '의원',
    address: '경기도 이천시 영창로 189, 2층 (창전동)',
    region: '경기',
    city: '이천시',
    phone: '031-637-2738',
    specialties: '가정의학과',
    latitude: 37.2692,
    longitude: 127.4312
  },
  {
    name: '현대가정의원',
    type: '의원',
    address: '경기도 이천시 부발읍 경충대로 2257',
    region: '경기',
    city: '이천시',
    phone: '031-636-7272',
    specialties: '가정의학과',
    latitude: 37.2825,
    longitude: 127.4925
  },
  {
    name: '현대연합의원',
    type: '의원',
    address: '경기도 이천시 부발읍 무촌로 139, 2층',
    region: '경기',
    city: '이천시',
    phone: '031-635-7282',
    specialties: '가정의학과',
    latitude: 37.2818,
    longitude: 127.4918
  },

  // ===== 정신건강의학과 =====
  {
    name: '윤현상의원',
    type: '의원',
    address: '경기도 이천시 장호원읍 장터로 45-8',
    region: '경기',
    city: '이천시',
    phone: '031-643-2660',
    specialties: '정신건강의학과',
    latitude: 37.1893,
    longitude: 127.6013
  },
  {
    name: '이천삼성정신건강의학과의원',
    type: '의원',
    address: '경기도 이천시 중리천로 58 (중리동)',
    region: '경기',
    city: '이천시',
    phone: '031-631-6379',
    specialties: '정신건강의학과',
    latitude: 37.2722,
    longitude: 127.4352
  },
  {
    name: '하은정신건강의학과의원',
    type: '의원',
    address: '경기도 이천시 중리천로 76, 3층 (중리동)',
    region: '경기',
    city: '이천시',
    phone: '031-638-8202',
    specialties: '정신건강의학과',
    latitude: 37.2718,
    longitude: 127.4348
  },
  {
    name: '현대정신과의원',
    type: '의원',
    address: '경기도 이천시 이섭대천로 1218 (창전동)',
    region: '경기',
    city: '이천시',
    phone: '031-636-7791',
    specialties: '정신건강의학과',
    latitude: 37.2688,
    longitude: 127.4308
  },

  // ===== 정형외과 =====
  {
    name: '이천정형외과의원',
    type: '의원',
    address: '경기도 이천시 중리천로82번길 25',
    region: '경기',
    city: '이천시',
    phone: '031-632-7525',
    specialties: '정형외과',
    latitude: 37.2722,
    longitude: 127.4350
  },
  {
    name: '본사랑정형외과의원',
    type: '의원',
    address: '경기도 이천시 중리천로 76 라온팰리스 4층',
    region: '경기',
    city: '이천시',
    phone: '031-637-7585',
    specialties: '정형외과',
    latitude: 37.2718,
    longitude: 127.4348
  },
  {
    name: '우리들정형외과의원',
    type: '의원',
    address: '경기도 이천시 부발읍 경충대로2050번길 15-87, 2층',
    region: '경기',
    city: '이천시',
    phone: '031-636-0655',
    specialties: '정형외과',
    latitude: 37.2820,
    longitude: 127.4920
  },

  // ===== 산부인과 =====
  {
    name: '마리나산부인과의원',
    type: '의원',
    address: '경기도 이천시 경충대로 2564 (중리동)',
    region: '경기',
    city: '이천시',
    phone: '031-636-0552',
    specialties: '산부인과, 소아청소년과, 가정의학과',
    latitude: 37.2728,
    longitude: 127.4358,
    open_24_hours: true
  },

  // ===== 소아청소년과 =====
  {
    name: '드림키즈소아청소년과의원',
    type: '의원',
    address: '경기도 이천시 중리천로 76 (라온팰리스 3층)',
    region: '경기',
    city: '이천시',
    phone: '031-638-4090',
    specialties: '내과, 소아청소년과, 이비인후과, 피부과',
    latitude: 37.2718,
    longitude: 127.4348,
    weekend_available: true
  },

  // ===== 비뇨기과 =====
  {
    name: '엠비뇨기과의원',
    type: '의원',
    address: '경기도 이천시 장호원읍 장감로 96 4층',
    region: '경기',
    city: '이천시',
    phone: '031-642-7512',
    specialties: '비뇨의학과, 피부과',
    latitude: 37.1902,
    longitude: 127.6015
  },
  {
    name: '서울비뇨기과의원',
    type: '의원',
    address: '경기도 이천시 창전동',
    region: '경기',
    city: '이천시',
    phone: '031-632-0000',
    specialties: '비뇨의학과, 피부과',
    latitude: 37.2695,
    longitude: 127.4315
  },

  // ===== 피부과 =====
  {
    name: '톡스앤필 이천점',
    type: '의원',
    address: '경기 이천시 이섭대천로 1213 시계탑빌딩 5층',
    region: '경기',
    city: '이천시',
    phone: '031-631-0013',
    specialties: '피부과',
    latitude: 37.2685,
    longitude: 127.4302
  },
  {
    name: '연세피부과의원',
    type: '의원',
    address: '경기도 이천시 이섭대천로 1233',
    region: '경기',
    city: '이천시',
    phone: '031-632-0000',
    specialties: '피부과',
    latitude: 37.2687,
    longitude: 127.4305
  },
  {
    name: '리멤버피부과의원 이천점',
    type: '의원',
    address: '경기도 이천시 이섭대천로 1387-1 2층',
    region: '경기',
    city: '이천시',
    phone: '031-994-4005',
    specialties: '피부과',
    latitude: 37.2692,
    longitude: 127.4310
  },

  // ===== 치과 =====
  {
    name: '이천치과의원',
    type: '치과',
    address: '경기도 이천시 영창로 223 2층 (창전동, 역전빌딩)',
    region: '경기',
    city: '이천시',
    phone: '031-638-2021',
    specialties: '치과',
    latitude: 37.2690,
    longitude: 127.4328
  },
  {
    name: '행복치과의원',
    type: '치과',
    address: '경기도 이천시 부발읍 무촌로 125 (무촌리 166-50) 1층',
    region: '경기',
    city: '이천시',
    phone: '031-631-2726',
    specialties: '치과',
    latitude: 37.2815,
    longitude: 127.4915
  },
  {
    name: '이솜치과의원',
    type: '치과',
    address: '경기 이천시 증신로 93 2층',
    region: '경기',
    city: '이천시',
    phone: '031-632-8080',
    specialties: '치과',
    latitude: 37.2648,
    longitude: 127.4265
  },
  {
    name: '이천이다치과의원 부발점',
    type: '치과',
    address: '경기 이천시 부발읍 경충대로 2096-4 3층',
    region: '경기',
    city: '이천시',
    phone: '0507-1338-2875',
    specialties: '치과',
    latitude: 37.2812,
    longitude: 127.4912
  },
  {
    name: '이천이다치과의원',
    type: '치과',
    address: '경기 이천시 중리천로 76 이천 라온팰리스 3층',
    region: '경기',
    city: '이천시',
    phone: '1899-6286',
    specialties: '치과',
    latitude: 37.2718,
    longitude: 127.4348
  },

  // ===== 신경외과 =====
  {
    name: '이천튼튼신경외과의원',
    type: '의원',
    address: '경기도 이천시 중리천로 98, 3층 301호(중리동)',
    region: '경기',
    city: '이천시',
    phone: '031-637-1160',
    specialties: '신경외과',
    latitude: 37.2724,
    longitude: 127.4354
  },

  // ===== 이비인후과 =====
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

  // ===== 안과 =====
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

console.log(`📊 총 ${allClinics.length}개 의원 추가 시작...\n`);

allClinics.forEach(clinic => {
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

// 진료과별 통계
const specialtyStmt = db.prepare(`
  SELECT specialties, COUNT(*) as count FROM hospitals
  WHERE city = '이천시' AND type = '의원'
  GROUP BY specialties
  ORDER BY count DESC
  LIMIT 15
`);
const specialties = specialtyStmt.all();
console.log('\n🏥 주요 진료과별 분포:');
specialties.forEach(s => console.log(`   ${s.specialties}: ${s.count}개`));

db.close();
