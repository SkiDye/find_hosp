/**
 * API 키 설정
 *
 * 공공데이터포털에서 발급받은 API 키를 여기에 입력하세요.
 * 신청 방법: backend/API_SIGNUP_GUIDE.md 참고
 */

export const API_KEYS = {
  // 건강보험심사평가원 - 전국 병의원 찾기 서비스
  // https://www.data.go.kr/data/15051059/openapi.do
  HIRA: process.env.HIRA_API_KEY || '',

  // 국민건강보험공단 - 요양기관 현황정보 (선택)
  // https://www.data.go.kr/data/15007912/openapi.do
  NHIS: process.env.NHIS_API_KEY || '',

  // 보건복지부 - 전국 응급의료기관 조회 서비스 (선택)
  // https://www.data.go.kr/data/15000563/openapi.do
  EMERGENCY: process.env.EMERGENCY_API_KEY || ''
};

// API 키 검증
export function validateApiKeys() {
  const errors = [];

  if (!API_KEYS.HIRA) {
    errors.push('HIRA_API_KEY가 설정되지 않았습니다.');
  }

  if (errors.length > 0) {
    console.warn('⚠️  API 키 경고:');
    errors.forEach(err => console.warn(`   - ${err}`));
    console.warn('\n📖 설정 방법: backend/API_SIGNUP_GUIDE.md 참고\n');
    return false;
  }

  console.log('✅ API 키 검증 완료\n');
  return true;
}

export default API_KEYS;
