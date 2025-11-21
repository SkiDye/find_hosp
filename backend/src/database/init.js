import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, existsSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 데이터베이스 파일 경로
const dbDir = join(__dirname, '../../data');
const dbPath = join(dbDir, 'hospital-system.db');

// data 디렉토리가 없으면 생성
if (!existsSync(dbDir)) {
  mkdirSync(dbDir, { recursive: true });
}

// SQLite 데이터베이스 초기화
const db = new Database(dbPath);

// WAL 모드 활성화 (성능 향상)
db.pragma('journal_mode = WAL');

// 스키마 파일 읽기 및 실행
const schemaPath = join(__dirname, 'schema.sql');
const schema = readFileSync(schemaPath, 'utf-8');

// 스키마 실행 (세미콜론으로 분리된 각 SQL 문 실행)
const statements = schema.split(';').filter(stmt => stmt.trim());
for (const statement of statements) {
  if (statement.trim()) {
    db.exec(statement);
  }
}

console.log('📊 데이터베이스 초기화 완료');
console.log(`📁 데이터베이스 위치: ${dbPath}`);

// 데이터베이스가 비어있으면 샘플 데이터 로드
const hospitalCount = db.prepare('SELECT COUNT(*) as count FROM hospitals').get().count;

if (hospitalCount === 0) {
  console.log('🏥 서울·경기 수도권 병원 데이터 로딩 중...');
  console.log('');

  // 서울·경기 병원 데이터 로드
  import('../scripts/addSeoulGyeonggiHospitals.js')
    .then(module => {
      const addHospitals = module.default;
      addHospitals();
    })
    .catch(err => {
      console.error('⚠️  병원 데이터 로드 실패:', err.message);
    });
} else {
  console.log(`✅ 기존 데이터 로드 완료 (병원 ${hospitalCount}개)`);
  console.log('💡 의사 정보는 의사 본인이 직접 등록할 수 있습니다.\n');
}

export default db;
