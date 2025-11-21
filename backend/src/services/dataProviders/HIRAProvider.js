/**
 * 건강보험심사평가원 API 데이터 제공자
 *
 * API: 전국 병의원 찾기 서비스
 * URL: https://www.data.go.kr/data/15051059/openapi.do
 */

import axios from 'axios';
import { BaseProvider } from './BaseProvider.js';
import { API_KEYS } from '../../config/apiKeys.js';

export class HIRAProvider extends BaseProvider {
  constructor() {
    super('HIRA_API', 100); // 최우선 (공식 API)
    this.baseURL = 'http://apis.data.go.kr/B551182/hospInfoServicev2';
  }

  async isAvailable() {
    return this.enabled && !!API_KEYS.HIRA;
  }

  /**
   * 병원 운영정보 조회
   */
  async fetchOperatingInfo(hospital) {
    try {
      // 시도코드 결정
      const sidoCd = this.getSidoCode(hospital.address);

      // API 호출
      const response = await axios.get(`${this.baseURL}/getHospBasisList`, {
        params: {
          serviceKey: API_KEYS.HIRA,
          yadmNm: hospital.name, // 병원명
          sidoCd: sidoCd,
          pageNo: 1,
          numOfRows: 10,
          _type: 'json'
        },
        timeout: 10000
      });

      const data = response.data?.response?.body;

      // 결과 확인
      if (!data || data.totalCount === 0) {
        console.log(`[HIRA] ${hospital.name}: 검색 결과 없음`);
        return null;
      }

      // 첫 번째 결과 사용
      const items = Array.isArray(data.items.item) ? data.items.item : [data.items.item];
      const hospitalData = items[0];

      // 데이터 정규화
      return this.normalizeData(hospitalData);

    } catch (error) {
      return this.handleError(error, hospital);
    }
  }

  /**
   * HIRA API 데이터를 표준 형식으로 변환
   */
  normalizeData(rawData) {
    // 운영시간 파싱
    const openingHours = this.parseOperatingHours(rawData);

    // 주말 진료 여부
    const hasWeekend = openingHours.saturday !== 'closed' || openingHours.sunday !== 'closed';

    return {
      has_emergency_room: rawData.emgncyYn === 'Y',
      open_24_hours: false, // HIRA API에서 제공하지 않음
      weekend_available: hasWeekend,
      opening_hours: openingHours,
      source: this.name,
      updated_at: new Date().toISOString(),
      raw_data: {
        yadmNm: rawData.yadmNm, // 병원명
        telno: rawData.telno, // 전화번호
        addr: rawData.addr, // 주소
        hospUrl: rawData.hospUrl // 홈페이지
      }
    };
  }

  /**
   * 운영시간 파싱
   */
  parseOperatingHours(data) {
    return {
      weekday: {
        open: data.trmtMonStart || data.trmtTueStart || '09:00',
        close: data.trmtMonEnd || data.trmtTueEnd || '18:00'
      },
      saturday: data.trmtSatStart ? {
        open: data.trmtSatStart,
        close: data.trmtSatEnd
      } : 'closed',
      sunday: data.trmtSunStart ? {
        open: data.trmtSunStart,
        close: data.trmtSunEnd
      } : 'closed',
      lunch_break: data.lunchWeek ? {
        start: data.lunchWeek.split('~')[0] || '13:00',
        end: data.lunchWeek.split('~')[1] || '14:00'
      } : null,
      note: data.parkEtc || null
    };
  }

  /**
   * 주소에서 시도코드 추출
   */
  getSidoCode(address) {
    const sidoCodes = {
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

    for (const [name, code] of Object.entries(sidoCodes)) {
      if (address.includes(name)) {
        return code;
      }
    }

    return '110000'; // 기본값: 서울
  }
}

export default HIRAProvider;
