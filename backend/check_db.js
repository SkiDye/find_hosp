import Database from 'better-sqlite3';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import Hospital from './src/models/Hospital.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, 'data', 'hospital-system.db');
const db = new Database(dbPath);

console.log('=== 데이터베이스 진단 ===\n');

// 1. Check table schema
console.log('1. hospitals 테이블 스키마:');
const schema = db.prepare("PRAGMA table_info(hospitals)").all();
console.log(schema.filter(col =>
  col.name.includes('emergency') ||
  col.name.includes('24') ||
  col.name.includes('weekend') ||
  col.name.includes('open_24')
));

// 2. Check actual data
console.log('\n2. 첫 번째 병원 데이터 (전체):');
const row = db.prepare('SELECT * FROM hospitals WHERE id = 1').get();
console.log(row);

// 3. Check specific fields
console.log('\n3. 운영시간 필드만 (직접 DB 쿼리):');
const operating = db.prepare(`
  SELECT id, name, has_emergency_room, open_24_hours, weekend_available
  FROM hospitals
  LIMIT 3
`).all();
console.log(operating);

// 4. Test Hospital.getById() conversion
console.log('\n4. Hospital.getById(2) 결과:');
const hospital = Hospital.getById(2);
console.log('has_emergency_room:', hospital?.has_emergency_room);
console.log('open_24_hours:', hospital?.open_24_hours);
console.log('weekend_available:', hospital?.weekend_available);
console.log('\n전체 객체:', hospital);

db.close();
