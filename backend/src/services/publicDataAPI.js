/**
 * 공공데이터포털 API 연동 서비스
 *
 * 사용 API: 건강보험심사평가원 - 병원정보서비스
 * URL: https://www.data.go.kr/data/15051059/openapi.do
 */

import fetch from 'node-fetch';

const API_BASE_URL = 'http://apis.data.go.kr/B551182/hospInfoServicev2';
const API_KEY = process.env.PUBLIC_DATA_API_KEY || '';

/**
 * 병원 목록 조회
 */
async function getHospitalList(params = {}) {
  const {
    sidoCd = '',
    sgguCd = '',
    emdongNm = '',
    ykiho = '',
    pageNo = 1,
    numOfRows = 100
  } = params;

  if (!API_KEY) {
    return {
      success: false,
      error: 'API 키가 설정되지 않았습니다. .env 파일에 PUBLIC_DATA_API_KEY를 추가하세요.',
      data: []
    };
  }

  const queryParams = new URLSearchParams({
    serviceKey: decodeURIComponent(API_KEY),
    pageNo: pageNo.toString(),
    numOfRows: numOfRows.toString(),
  });

  if (sidoCd) queryParams.append('sidoCd', sidoCd);
  if (sgguCd) queryParams.append('sgguCd', sgguCd);
  if (emdongNm) queryParams.append('emdongNm', emdongNm);
  if (ykiho) queryParams.append('ykiho', ykiho);

  try {
    const url = `${API_BASE_URL}/getHospBasisList?${queryParams}`;
    console.log(`API 호출: ${url.substring(0, 100)}...`);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // API 응답 구조 확인
    if (data.response?.header?.resultCode !== '00') {
      const errorMsg = data.response?.header?.resultMsg || 'Unknown error';
      throw new Error(`API 오류: ${errorMsg}`);
    }

    const items = data.response?.body?.items?.item || [];
    const totalCount = data.response?.body?.totalCount || 0;

    return {
      success: true,
      data: Array.isArray(items) ? items : [items],
      totalCount
    };
  } catch (error) {
    console.error('공공데이터 API 호출 오류:', error.message);
    return {
      success: false,
      error: error.message,
      data: []
    };
  }
}

/**
 * 병원 상세정보 조회
 */
async function getHospitalDetail(ykiho) {
  if (!API_KEY) {
    return {
      success: false,
      error: 'API 키가 설정되지 않았습니다.',
      data: null
    };
  }

  const queryParams = new URLSearchParams({
    serviceKey: decodeURIComponent(API_KEY),
    ykiho
  });

  try {
    const response = await fetch(
      `${API_BASE_URL}/getHospBasisInfo?${queryParams}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.status}`);
    }

    const data = await response.json();

    if (data.response?.header?.resultCode !== '00') {
      throw new Error(data.response?.header?.resultMsg || 'Unknown error');
    }

    return {
      success: true,
      data: data.response?.body?.items?.item || null
    };
  } catch (error) {
    console.error('공공데이터 API 호출 오류:', error.message);
    return {
      success: false,
      error: error.message,
      data: null
    };
  }
}

/**
 * 공공데이터 병원 정보를 내부 데이터 모델로 변환
 */
function transformHospitalData(apiData) {
  return {
    name: apiData.yadmNm || '',
    type: apiData.clCdNm || '',
    region: apiData.sidoNm || '',
    city: apiData.sgguNm || '',
    address: apiData.addr || '',
    phone: apiData.telno || '',
    beds: parseInt(apiData.hospBdCnt) || 0,
    established_date: apiData.estbDd || '',
    postalCode: apiData.postNo || '',
    latitude: parseFloat(apiData.YPos) || null,
    longitude: parseFloat(apiData.XPos) || null,
    emergencyRoom: apiData.emyDayYn === 'Y',
    ykiho: apiData.ykiho || '',
    // 데이터 출처 표시 (법적 준수)
    dataSource: '건강보험심사평가원',
    dataSourceUrl: 'https://www.data.go.kr/data/15051059/openapi.do',
    lastUpdated: new Date().toISOString()
  };
}

/**
 * 시도 코드 매핑
 */
const SIDO_CODES = {
  '서울': '110000',
  '부산': '260000',
  '대구': '270000',
  '인천': '280000',
  '광주': '290000',
  '대전': '300000',
  '울산': '310000',
  '세종': '360000',
  '경기': '410000',
  '강원': '420000',
  '충북': '430000',
  '충남': '440000',
  '전북': '450000',
  '전남': '460000',
  '경북': '470000',
  '경남': '480000',
  '제주': '500000'
};

/**
 * 지역명으로 시도코드 얻기
 */
function getSidoCode(regionName) {
  return SIDO_CODES[regionName] || '';
}

/**
 * API 키 확인
 */
function checkApiKey() {
  if (!API_KEY || API_KEY.length < 10) {
    console.error('\n❌ 공공데이터 API 키가 설정되지 않았습니다.');
    console.log('\n📝 API 키 발급 방법:');
    console.log('1. https://www.data.go.kr/ 접속');
    console.log('2. 회원가입 및 로그인');
    console.log('3. "병원정보서비스" 검색');
    console.log('4. 활용신청 후 인증키 발급');
    console.log('5. backend/.env 파일 생성:');
    console.log('   PUBLIC_DATA_API_KEY=발급받은키\n');
    return false;
  }
  return true;
}

export {
  getHospitalList,
  getHospitalDetail,
  transformHospitalData,
  getSidoCode,
  checkApiKey,
  SIDO_CODES
};
