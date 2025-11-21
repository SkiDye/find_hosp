/**
 * 공공데이터포털 API로 실제 운영정보 조회
 *
 * API: 건강보험심사평가원_전국 병의원 찾기 서비스
 * URL: https://www.data.go.kr/data/15051059/openapi.do
 *
 * 사용방법:
 * 1. https://www.data.go.kr 에서 회원가입
 * 2. "전국 병의원 찾기 서비스" 검색 후 활용신청
 * 3. 발급받은 API 키를 API_KEY 변수에 입력
 * 4. node src/scripts/fetchRealOperatingInfo.js 실행
 */

import axios from 'axios';
import db from '../database/init.js';

// ⚠️ 여기에 공공데이터포털 API 키를 입력하세요
const API_KEY = 'YOUR_API_KEY_HERE'; // 발급받은 인증키 입력

const BASE_URL = 'http://apis.data.go.kr/B551182/hospInfoServicev2';

// 병원 정보 조회
async function fetchHospitalInfo(hospitalName, address) {
  try {
    const response = await axios.get(`${BASE_URL}/getHospBasisList`, {
      params: {
        serviceKey: API_KEY,
        yadmNm: hospitalName, // 병원명
        sidoCd: address.includes('서울') ? '110000' : '410000', // 시도코드
        pageNo: 1,
        numOfRows: 10,
        _type: 'json'
      }
    });

    const items = response.data?.response?.body?.items?.item || [];

    if (Array.isArray(items)) {
      return items[0]; // 첫 번째 결과 반환
    } else if (items) {
      return items;
    }

    return null;
  } catch (error) {
    console.error(`API 오류 (${hospitalName}):`, error.message);
    return null;
  }
}

// 운영시간 정보 파싱
function parseOperatingHours(apiData) {
  if (!apiData) return null;

  // API 응답에서 운영시간 필드 추출
  // (실제 API 응답 구조에 맞춰 수정 필요)
  return {
    weekday: {
      open: apiData.trmtMonStart || '09:00',
      close: apiData.trmtMonEnd || '18:00'
    },
    saturday: apiData.trmtSatStart ? {
      open: apiData.trmtSatStart,
      close: apiData.trmtSatEnd
    } : 'closed',
    sunday: apiData.trmtSunStart ? {
      open: apiData.trmtSunStart,
      close: apiData.trmtSunEnd
    } : 'closed',
    lunch_break: apiData.lunchStart ? {
      start: apiData.lunchStart,
      end: apiData.lunchEnd
    } : null
  };
}

async function updateClinicOperatingInfo() {
  console.log('\n' + '='.repeat(80));
  console.log('🔍 실제 운영정보 조회 및 업데이트');
  console.log('='.repeat(80) + '\n');

  // API 키 확인
  if (API_KEY === 'YOUR_API_KEY_HERE') {
    console.error('❌ API 키가 설정되지 않았습니다!');
    console.log('\n사용 방법:');
    console.log('1. https://www.data.go.kr 에서 회원가입');
    console.log('2. "전국 병의원 찾기 서비스" 검색 후 활용신청');
    console.log('3. 발급받은 API 키를 이 스크립트의 API_KEY 변수에 입력');
    console.log('4. 다시 실행\n');
    return;
  }

  // 모든 의원 조회
  const allClinics = db.prepare(`
    SELECT id, name, address, phone
    FROM hospitals
    WHERE type = '의원'
    ORDER BY id
  `).all();

  console.log(`📋 총 ${allClinics.length}개 의원 조회 시작\n`);

  const updateStmt = db.prepare(`
    UPDATE hospitals
    SET
      has_emergency_room = ?,
      open_24_hours = ?,
      weekend_available = ?,
      opening_hours = ?
    WHERE id = ?
  `);

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < allClinics.length; i++) {
    const clinic = allClinics[i];

    console.log(`[${i + 1}/${allClinics.length}] ${clinic.name} 조회 중...`);

    // API 호출
    const apiData = await fetchHospitalInfo(clinic.name, clinic.address);

    if (apiData) {
      const operatingHours = parseOperatingHours(apiData);
      const hasWeekend = operatingHours.saturday !== 'closed' || operatingHours.sunday !== 'closed';

      updateStmt.run(
        apiData.emgncyYn === 'Y' ? 1 : 0, // 응급실
        0, // 의원은 대부분 24시간 운영 안 함
        hasWeekend ? 1 : 0, // 주말 진료
        JSON.stringify(operatingHours),
        clinic.id
      );

      console.log(`   ✅ 업데이트 완료`);
      successCount++;
    } else {
      console.log(`   ⚠️  정보를 찾을 수 없습니다`);
      failCount++;
    }

    // API 호출 제한 방지 (0.5초 대기)
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n' + '='.repeat(80));
  console.log('📊 업데이트 완료');
  console.log('='.repeat(80));
  console.log(`✅ 성공: ${successCount}개`);
  console.log(`⚠️  실패: ${failCount}개`);
  console.log(`📋 전체: ${allClinics.length}개`);
  console.log('='.repeat(80) + '\n');
}

// API 키가 설정되어 있으면 실행
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  updateClinicOperatingInfo().catch(console.error);
}

export default updateClinicOperatingInfo;
