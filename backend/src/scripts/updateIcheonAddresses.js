import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, '../../data/hospital-system.db');
const db = new Database(dbPath);

console.log('📍 이천시 의원 주소 정확하게 업데이트 중...\n');

// 정확한 주소로 업데이트할 목록 (웹 검색으로 확인된 정보)
const addressUpdates = [
  // 동/읍/면만 적혀있는 불완전한 주소들을 정확한 주소로 업데이트
  {
    name: '고봉진내과의원',
    address: '경기도 이천시 부발읍 경충대로 2485'
  },
  {
    name: '서울삼성내과의원',
    address: '경기도 이천시 마장면 경충대로 2930'
  },
  {
    name: '양정분산부인과의원',
    address: '경기도 이천시 중리천로 118'
  },
  {
    name: '이천소아청소년과의원',
    address: '경기도 이천시 중리천로 96'
  },
  {
    name: '한내과의원',
    address: '경기도 이천시 이섭대천로 1295'
  },
  {
    name: '이천365의원',
    address: '경기도 이천시 이섭대천로 1380'
  },
  {
    name: '이천예치과',
    address: '경기도 이천시 중리천로 101'
  },
  // 이미 정확한 주소가 있는 것들은 그대로 유지
];

const updateStmt = db.prepare(`
  UPDATE hospitals
  SET address = ?,
      updated_at = ?
  WHERE city = '이천시' AND name = ?
`);

let updatedCount = 0;

addressUpdates.forEach(update => {
  try {
    const result = updateStmt.run(
      update.address,
      new Date().toISOString(),
      update.name
    );

    if (result.changes > 0) {
      updatedCount++;
      console.log(`✅ ${update.name}`);
      console.log(`   주소: ${update.address}\n`);
    }
  } catch (error) {
    console.error(`❌ ${update.name} - 업데이트 실패:`, error.message);
  }
});

console.log(`🎉 총 ${updatedCount}개 주소 업데이트 완료!`);

// 업데이트된 주소 확인
console.log('\n📋 업데이트된 주소 목록:');
const updatedClinics = db.prepare(`
  SELECT name, address FROM hospitals
  WHERE city = '이천시'
  ORDER BY name
`).all();

updatedClinics.forEach((clinic, i) => {
  console.log(`${i+1}. ${clinic.name}`);
  console.log(`   ${clinic.address}`);
});

db.close();
