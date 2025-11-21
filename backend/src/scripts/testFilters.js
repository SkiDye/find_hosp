/**
 * 필터 기능 전체 테스트
 */

import Hospital from '../models/Hospital.js';

console.log('\n' + '='.repeat(80));
console.log('🧪 필터 기능 전체 테스트');
console.log('='.repeat(80) + '\n');

// 1. 응급실 필터
console.log('1️⃣  응급실 필터 테스트');
const emergencyHospitals = Hospital.getAll({ has_emergency_room: true });
console.log(`   결과: ${emergencyHospitals.length}개`);
console.log(`   예시: ${emergencyHospitals.slice(0, 3).map(h => h.name).join(', ')}\n`);

// 2. 24시간 필터
console.log('2️⃣  24시간 운영 필터 테스트');
const open24Hours = Hospital.getAll({ open_24_hours: true });
console.log(`   결과: ${open24Hours.length}개`);
console.log(`   예시: ${open24Hours.slice(0, 3).map(h => h.name).join(', ')}\n`);

// 3. 주말 진료 필터
console.log('3️⃣  주말 진료 필터 테스트');
const weekendAvailable = Hospital.getAll({ weekend_available: true });
console.log(`   결과: ${weekendAvailable.length}개`);
console.log(`   예시: ${weekendAvailable.slice(0, 3).map(h => h.name).join(', ')}\n`);

// 4. 지역 필터
console.log('4️⃣  지역 필터 테스트 (서울)');
const seoulHospitals = Hospital.getAll({ region: '서울' });
console.log(`   결과: ${seoulHospitals.length}개`);
console.log(`   예시: ${seoulHospitals.slice(0, 3).map(h => `${h.name} (${h.city})`).join(', ')}\n`);

// 5. 도시 필터
console.log('5️⃣  도시 필터 테스트 (강남구)');
const gangnamHospitals = Hospital.getAll({ city: '강남구' });
console.log(`   결과: ${gangnamHospitals.length}개`);
console.log(`   예시: ${gangnamHospitals.slice(0, 3).map(h => h.name).join(', ')}\n`);

// 6. 타입 필터 - 의원
console.log('6️⃣  타입 필터 테스트 (의원)');
const clinics = Hospital.getAll({ type: '의원' });
console.log(`   결과: ${clinics.length}개`);
console.log(`   예시: ${clinics.slice(0, 3).map(h => `${h.name} (${h.city})`).join(', ')}\n`);

// 7. 타입 필터 - 치과
console.log('7️⃣  타입 필터 테스트 (치과)');
const dentals = Hospital.getAll({ type: '치과' });
console.log(`   결과: ${dentals.length}개`);
console.log(`   예시: ${dentals.slice(0, 3).map(h => `${h.name} (${h.city})`).join(', ')}\n`);

// 8. 전문과목 필터
console.log('8️⃣  전문과목 필터 테스트 (피부과)');
const dermatology = Hospital.getAll({ specialty: '피부과' });
console.log(`   결과: ${dermatology.length}개`);
console.log(`   예시: ${dermatology.slice(0, 3).map(h => `${h.name} (${h.city})`).join(', ')}\n`);

// 9. 복합 필터 1 - 강남구 + 의원
console.log('9️⃣  복합 필터 테스트 (강남구 + 의원)');
const gangnamClinics = Hospital.getAll({ city: '강남구', type: '의원' });
console.log(`   결과: ${gangnamClinics.length}개`);
console.log(`   예시: ${gangnamClinics.slice(0, 3).map(h => h.name).join(', ')}\n`);

// 10. 복합 필터 2 - 주말 진료 + 피부과
console.log('🔟 복합 필터 테스트 (주말 진료 + 피부과)');
const weekendDermatology = Hospital.getAll({ weekend_available: true, specialty: '피부과' });
console.log(`   결과: ${weekendDermatology.length}개`);
console.log(`   예시: ${weekendDermatology.slice(0, 3).map(h => `${h.name} (${h.city})`).join(', ')}\n`);

// 11. 검색 필터
console.log('1️⃣1️⃣ 검색 필터 테스트 ("삼성")');
const searchResults = Hospital.getAll({ search: '삼성' });
console.log(`   결과: ${searchResults.length}개`);
console.log(`   예시: ${searchResults.slice(0, 3).map(h => h.name).join(', ')}\n`);

console.log('='.repeat(80));
console.log('✅ 모든 필터 테스트 완료!');
console.log('='.repeat(80));

// 요약 통계
const allHospitals = Hospital.getAll({});
console.log('\n📊 전체 통계:');
console.log(`   전체 병원: ${allHospitals.length}개`);
console.log(`   응급실: ${emergencyHospitals.length}개 (${(emergencyHospitals.length/allHospitals.length*100).toFixed(1)}%)`);
console.log(`   24시간: ${open24Hours.length}개 (${(open24Hours.length/allHospitals.length*100).toFixed(1)}%)`);
console.log(`   주말진료: ${weekendAvailable.length}개 (${(weekendAvailable.length/allHospitals.length*100).toFixed(1)}%)`);
console.log(`   의원: ${clinics.length}개 (${(clinics.length/allHospitals.length*100).toFixed(1)}%)`);
console.log(`   치과: ${dentals.length}개 (${(dentals.length/allHospitals.length*100).toFixed(1)}%)`);
console.log('\n');
