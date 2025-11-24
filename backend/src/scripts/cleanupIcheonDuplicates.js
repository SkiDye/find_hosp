import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, '../../data/hospital-system.db');
const db = new Database(dbPath);

console.log('🧹 이천시 의원 중복 데이터 정리 중...\n');

// 중복 병원 찾기
const duplicatesStmt = db.prepare(`
  SELECT name, COUNT(*) as count
  FROM hospitals
  WHERE city = '이천시'
  GROUP BY name
  HAVING COUNT(*) > 1
`);

const duplicates = duplicatesStmt.all();
console.log(`📊 중복된 의원 ${duplicates.length}개 발견:\n`);

duplicates.forEach(dup => {
  console.log(`   - ${dup.name} (${dup.count}개)`);
});

// 각 중복 의원에 대해, 더 상세한 주소를 가진 것만 남기기
console.log('\n🔍 중복 제거 중...\n');

duplicates.forEach(dup => {
  // 해당 이름의 모든 레코드 가져오기
  const recordsStmt = db.prepare(`
    SELECT id, name, address
    FROM hospitals
    WHERE name = ? AND city = '이천시'
    ORDER BY LENGTH(address) DESC
  `);

  const records = recordsStmt.all(dup.name);

  // 가장 상세한 주소를 가진 첫 번째 레코드 제외하고 나머지 삭제
  const toKeep = records[0];
  const toDelete = records.slice(1);

  console.log(`✅ ${dup.name}:`);
  console.log(`   유지: ${toKeep.address}`);

  toDelete.forEach(record => {
    const deleteStmt = db.prepare('DELETE FROM hospitals WHERE id = ?');
    deleteStmt.run(record.id);
    console.log(`   삭제: ${record.address}`);
  });
  console.log();
});

// 최종 결과 확인
const finalCount = db.prepare(`
  SELECT COUNT(*) as count FROM hospitals
  WHERE city = '이천시'
`).get();

console.log(`\n🎉 정리 완료!`);
console.log(`📊 최종 이천시 병원/의원: ${finalCount.count}개\n`);

// 타입별 통계
const typeStmt = db.prepare(`
  SELECT type, COUNT(*) as count FROM hospitals
  WHERE city = '이천시'
  GROUP BY type
  ORDER BY type
`);
const types = typeStmt.all();
console.log('📋 타입별 분포:');
types.forEach(t => console.log(`   ${t.type}: ${t.count}개`));

db.close();
