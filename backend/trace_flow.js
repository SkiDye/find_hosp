import Hospital from './src/models/Hospital.js';
import fetch from 'node-fetch';

console.log('=== 데이터 플로우 추적 ===\n');

// Step 1: Direct Model Call
console.log('1️⃣  직접 모델 호출 (Hospital.getById(2)):');
const directResult = Hospital.getById(2);
console.log('   Operating Hours Fields:');
console.log('   - has_emergency_room:', directResult?.has_emergency_room);
console.log('   - open_24_hours:', directResult?.open_24_hours);
console.log('   - weekend_available:', directResult?.weekend_available);
console.log('   - 타입:', typeof directResult?.has_emergency_room);
console.log('');

// Step 2: Direct Model Call for getAll
console.log('2️⃣  직접 모델 호출 (Hospital.getAll() - 첫 번째 결과):');
const allResults = Hospital.getAll();
const firstHospital = allResults[0];
console.log('   Operating Hours Fields:');
console.log('   - has_emergency_room:', firstHospital?.has_emergency_room);
console.log('   - open_24_hours:', firstHospital?.open_24_hours);
console.log('   - weekend_available:', firstHospital?.weekend_available);
console.log('   - 타입:', typeof firstHospital?.has_emergency_room);
console.log('');

// Step 3: API Call
console.log('3️⃣  API 호출 (GET /api/hospitals/2):');
try {
  const response = await fetch('http://localhost:5000/api/hospitals/2');
  const apiResult = await response.json();
  console.log('   Operating Hours Fields:');
  console.log('   - has_emergency_room:', apiResult?.has_emergency_room);
  console.log('   - open_24_hours:', apiResult?.open_24_hours);
  console.log('   - weekend_available:', apiResult?.weekend_available);
  console.log('   - 타입:', typeof apiResult?.has_emergency_room);
  console.log('');
  console.log('   전체 키 목록:', Object.keys(apiResult).filter(k =>
    k.includes('emergency') || k.includes('24') || k.includes('weekend') || k.includes('open')
  ));
} catch (error) {
  console.log('   ❌ API 호출 실패:', error.message);
}
console.log('');

// Step 4: API Call for list
console.log('4️⃣  API 호출 (GET /api/hospitals - 첫 번째 결과):');
try {
  const response = await fetch('http://localhost:5000/api/hospitals');
  const apiResults = await response.json();
  const firstApi = apiResults[0];
  console.log('   Operating Hours Fields:');
  console.log('   - has_emergency_room:', firstApi?.has_emergency_room);
  console.log('   - open_24_hours:', firstApi?.open_24_hours);
  console.log('   - weekend_available:', firstApi?.weekend_available);
  console.log('   - 타입:', typeof firstApi?.has_emergency_room);
  console.log('');
  console.log('   전체 키 목록:', Object.keys(firstApi).filter(k =>
    k.includes('emergency') || k.includes('24') || k.includes('weekend') || k.includes('open')
  ));
} catch (error) {
  console.log('   ❌ API 호출 실패:', error.message);
}
