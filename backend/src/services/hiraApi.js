/**
 * 건강보험심사평가원(HIRA) API 연동 서비스
 *
 * API 문서: https://www.data.go.kr
 * 사용 API: 병의원 찾기 서비스
 */

import fetch from 'node-fetch';

class HiraApiService {
  constructor() {
    // 공공데이터포털 API 키 (발급 필요)
    this.apiKey = process.env.HIRA_API_KEY || '';
    this.baseUrl = 'http://apis.data.go.kr/B551182/hospInfoService1';

    // API 엔드포인트
    this.endpoints = {
      // 병원 기본 정보 조회
      hospitalInfo: '/getHospBasisList1',
      // 진료과목 정보 조회
      medicalSubject: '/getMdlrtSbjectList1',
      // 응급실 정보 조회
      emergency: '/getEmrrmSrsillList1'
    };
  }

  /**
   * API 키 설정
   */
  setApiKey(apiKey) {
    this.apiKey = apiKey;
  }

  /**
   * 병원 기본 정보 조회
   * @param {Object} params - 검색 파라미터
   * @param {string} params.siDoCd - 시도코드 (예: 110000 - 서울)
   * @param {string} params.siGunGuCd - 시군구코드
   * @param {string} params.emdongNm - 읍면동명
   * @param {string} params.ykiho - 요양기관번호
   * @param {number} params.pageNo - 페이지번호
   * @param {number} params.numOfRows - 한 페이지 결과 수
   * @returns {Promise<Object>} API 응답 데이터
   */
  async getHospitalList(params = {}) {
    if (!this.apiKey) {
      throw new Error('HIRA API 키가 설정되지 않았습니다. .env 파일에 HIRA_API_KEY를 추가하세요.');
    }

    const defaultParams = {
      serviceKey: this.apiKey,
      pageNo: 1,
      numOfRows: 100,
      _type: 'json'
    };

    const queryParams = { ...defaultParams, ...params };

    // URL 쿼리 스트링 생성
    const queryString = new URLSearchParams(queryParams).toString();
    const url = `${this.baseUrl}${this.endpoints.hospitalInfo}?${queryString}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      return this.parseResponse(data);
    } catch (error) {
      console.error('❌ HIRA API 호출 실패:', error.message);
      throw error;
    }
  }

  /**
   * 진료과목 정보 조회
   * @param {string} ykiho - 요양기관번호
   * @returns {Promise<Object>} 진료과목 정보
   */
  async getMedicalSubjects(ykiho) {
    if (!this.apiKey) {
      throw new Error('HIRA API 키가 설정되지 않았습니다.');
    }

    const params = {
      serviceKey: this.apiKey,
      ykiho: ykiho,
      _type: 'json'
    };

    const queryString = new URLSearchParams(params).toString();
    const url = `${this.baseUrl}${this.endpoints.medicalSubject}?${queryString}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      return this.parseResponse(data);
    } catch (error) {
      console.error('❌ 진료과목 조회 실패:', error.message);
      return null;
    }
  }

  /**
   * 응급실 정보 조회
   * @param {string} ykiho - 요양기관번호
   * @returns {Promise<Object>} 응급실 정보
   */
  async getEmergencyInfo(ykiho) {
    if (!this.apiKey) {
      throw new Error('HIRA API 키가 설정되지 않았습니다.');
    }

    const params = {
      serviceKey: this.apiKey,
      ykiho: ykiho,
      _type: 'json'
    };

    const queryString = new URLSearchParams(params).toString();
    const url = `${this.baseUrl}${this.endpoints.emergency}?${queryString}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      return this.parseResponse(data);
    } catch (error) {
      console.error('❌ 응급실 정보 조회 실패:', error.message);
      return null;
    }
  }

  /**
   * API 응답 파싱
   */
  parseResponse(data) {
    if (!data || !data.response) {
      throw new Error('잘못된 API 응답 형식');
    }

    const { header, body } = data.response;

    if (header.resultCode !== '00') {
      throw new Error(`API 오류: ${header.resultMsg}`);
    }

    return body;
  }

  /**
   * HIRA 데이터를 우리 DB 스키마로 변환
   * @param {Object} hiraData - HIRA API 응답 데이터
   * @returns {Object} 변환된 병원 데이터
   */
  transformToHospitalData(hiraData) {
    return {
      name: hiraData.yadmNm || '',  // 요양기관명
      type: this.mapHospitalType(hiraData.clCd),  // 종별코드 -> 병원 타입
      region: this.mapRegionCode(hiraData.sidoCd),  // 시도코드 -> 지역명
      city: hiraData.sigunguNm || '',  // 시군구명
      address: `${hiraData.addr || ''}`.trim(),  // 주소
      phone: hiraData.telno || '',  // 전화번호
      latitude: parseFloat(hiraData.YPos) || null,  // 위도
      longitude: parseFloat(hiraData.XPos) || null,  // 경도
      has_emergency_room: false,  // 별도 조회 필요
      open_24_hours: false,  // 별도 확인 필요
      weekend_available: false,  // 별도 확인 필요
      specialties: [],  // 별도 조회 필요
      // 추가 메타데이터
      metadata: {
        ykiho: hiraData.ykiho,  // 요양기관번호
        hospUrl: hiraData.hospUrl || '',  // 병원 홈페이지
        estbDd: hiraData.estbDd || '',  // 개설일자
        postNo: hiraData.postNo || ''  // 우편번호
      }
    };
  }

  /**
   * 병원 종별코드를 우리 타입으로 매핑
   * @param {string} clCd - 종별코드
   * @returns {string} 병원 타입
   */
  mapHospitalType(clCd) {
    const typeMapping = {
      '01': '종합병원',  // 상급종합병원
      '02': '종합병원',  // 종합병원
      '03': '병원',      // 병원
      '04': '의원',      // 요양병원
      '05': '의원',      // 의원
      '11': '의원',      // 보건소
      '12': '의원',      // 보건지소
      '13': '의원',      // 보건진료소
      '21': '치과',      // 치과병원
      '28': '치과',      // 치과의원
      '29': '의원',      // 한방병원
      '31': '의원'       // 한의원
    };

    return typeMapping[clCd] || '의원';
  }

  /**
   * 시도코드를 지역명으로 매핑
   * @param {string} sidoCd - 시도코드
   * @returns {string} 지역명
   */
  mapRegionCode(sidoCd) {
    const regionMapping = {
      '110000': '서울',
      '260000': '부산',
      '270000': '대구',
      '280000': '인천',
      '290000': '광주',
      '300000': '대전',
      '310000': '울산',
      '360000': '세종',
      '410000': '경기',
      '420000': '강원',
      '430000': '충북',
      '440000': '충남',
      '450000': '전북',
      '460000': '전남',
      '470000': '경북',
      '480000': '경남',
      '490000': '제주'
    };

    return regionMapping[sidoCd] || '기타';
  }

  /**
   * 시군구 이름으로 시군구 코드 검색 (역방향 매핑)
   * @param {string} cityName - 시군구 이름 (예: "이천시")
   * @returns {string|null} 시군구 코드
   */
  getCityCode(cityName) {
    // 경기도 시군구 코드 (이천시 포함)
    const gyeonggiCities = {
      '이천시': '41500',
      '수원시': '41110',
      '성남시': '41130',
      '용인시': '41460',
      '안양시': '41170',
      '부천시': '41190',
      '광명시': '41210',
      '평택시': '41220',
      '과천시': '41290',
      '오산시': '41370',
      '시흥시': '41390',
      '군포시': '41410',
      '의왕시': '41430',
      '하남시': '41450',
      '김포시': '41570',
      '안성시': '41550',
      '화성시': '41590',
      '광주시': '41610',
      '양주시': '41630',
      '포천시': '41650',
      '여주시': '41670',
      '연천군': '41800',
      '가평군': '41820',
      '양평군': '41830'
    };

    return gyeonggiCities[cityName] || null;
  }

  /**
   * 특정 지역의 모든 병원 데이터 가져오기 (페이징 처리)
   * @param {string} siDoCd - 시도코드 (예: '410000' - 경기)
   * @param {string} siGunGuCd - 시군구코드 (예: '41500' - 이천시)
   * @param {number} maxPages - 최대 페이지 수
   * @returns {Promise<Array>} 병원 데이터 배열
   */
  async getAllHospitalsInRegion(siDoCd, siGunGuCd, maxPages = 10) {
    const allHospitals = [];
    let currentPage = 1;
    let hasMoreData = true;

    console.log(`\n📡 HIRA API 데이터 수집 시작...`);
    console.log(`   시도코드: ${siDoCd}, 시군구코드: ${siGunGuCd}\n`);

    while (hasMoreData && currentPage <= maxPages) {
      try {
        const result = await this.getHospitalList({
          siDoCd,
          siGunGuCd,
          pageNo: currentPage,
          numOfRows: 100
        });

        if (!result.items || !result.items.item) {
          hasMoreData = false;
          break;
        }

        const items = Array.isArray(result.items.item)
          ? result.items.item
          : [result.items.item];

        console.log(`   📄 페이지 ${currentPage}: ${items.length}개 병원 데이터 수집`);

        allHospitals.push(...items);

        // 더 이상 데이터가 없으면 중단
        if (items.length < 100) {
          hasMoreData = false;
        }

        currentPage++;

        // API 호출 제한을 고려한 딜레이 (1초)
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        console.error(`   ❌ 페이지 ${currentPage} 조회 실패:`, error.message);
        hasMoreData = false;
      }
    }

    console.log(`\n✅ 총 ${allHospitals.length}개 병원 데이터 수집 완료\n`);

    return allHospitals;
  }
}

// 싱글톤 인스턴스 생성
const hiraApiService = new HiraApiService();

export default hiraApiService;
