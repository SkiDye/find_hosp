/**
 * 필터 데이터 점검 스크립트
 */

import db from '../database/init.js';

console.log('\n' + '='.repeat(80));
console.log('🔍 필터 데이터 점검');
console.log('='.repeat(80) + '\n');

// 응급실 있는 병원
const emergencyRooms = db.prepare(`
  SELECT id, name, type, city, has_emergency_room
  FROM hospitals
  WHERE has_emergency_room = 1
  ORDER BY name
  LIMIT 10
`).all();

console.log('🚑 응급실 운영 병원:');
console.log(`   총 ${emergencyRooms.length}개 발견\n`);
emergencyRooms.forEach(h => {
  console.log(`   - ${h.name} (${h.type}, ${h.city}) - DB값: ${h.has_emergency_room}`);
});

// 24시간 운영 병원
const open24Hours = db.prepare(`
  SELECT id, name, type, city, open_24_hours
  FROM hospitals
  WHERE open_24_hours = 1
  ORDER BY name
  LIMIT 10
`).all();

console.log(`\n🌙 24시간 운영 병원:`);
console.log(`   총 ${open24Hours.length}개 발견\n`);
open24Hours.forEach(h => {
  console.log(`   - ${h.name} (${h.type}, ${h.city}) - DB값: ${h.open_24_hours}`);
});

// 주말 진료 병원
const weekendAvailable = db.prepare(`
  SELECT id, name, type, city, weekend_available
  FROM hospitals
  WHERE weekend_available = 1
  ORDER BY name
  LIMIT 10
`).all();

console.log(`\n📅 주말 진료 가능 병원:`);
console.log(`   총 ${weekendAvailable.length}개 발견\n`);
weekendAvailable.forEach(h => {
  console.log(`   - ${h.name} (${h.type}, ${h.city}) - DB값: ${h.weekend_available}`);
});

// 전체 통계
const stats = db.prepare(`
  SELECT
    COUNT(*) as total,
    SUM(has_emergency_room) as emergency_count,
    SUM(open_24_hours) as open_24h_count,
    SUM(weekend_available) as weekend_count
  FROM hospitals
`).get();

console.log('\n' + '='.repeat(80));
console.log('📊 전체 통계');
console.log('='.repeat(80));
console.log(`총 병원: ${stats.total}개`);
console.log(`응급실: ${stats.emergency_count}개 (${(stats.emergency_count / stats.total * 100).toFixed(1)}%)`);
console.log(`24시간: ${stats.open_24h_count}개 (${(stats.open_24h_count / stats.total * 100).toFixed(1)}%)`);
console.log(`주말진료: ${stats.weekend_count}개 (${(stats.weekend_count / stats.total * 100).toFixed(1)}%)`);
console.log('='.repeat(80));

// 새로 추가된 의원들 확인
console.log('\n📋 신규 의원 (이천시/강남구/서초구) 필터 값 확인:\n');
const newClinics = db.prepare(`
  SELECT name, city, type, has_emergency_room, open_24_hours, weekend_available
  FROM hospitals
  WHERE city IN ('이천시', '강남구', '서초구')
  AND type = '의원'
  ORDER BY id DESC
  LIMIT 15
`).all();

newClinics.forEach(h => {
  console.log(`${h.name} (${h.city})`);
  console.log(`  응급실: ${h.has_emergency_room} | 24시간: ${h.open_24_hours} | 주말: ${h.weekend_available}`);
});

console.log('\n');
