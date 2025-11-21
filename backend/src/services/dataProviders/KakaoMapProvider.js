/**
 * 카카오맵 데이터 제공자
 *
 * ⚠️ 주의: 크롤링은 카카오 이용약관 위반 가능성이 있습니다.
 * - 카카오맵 공식 API 사용 권장
 * - REST API 키: https://developers.kakao.com
 *
 * 카카오 로컬 API (공식):
 * - 키워드로 장소 검색
 * - 카테고리로 장소 검색
 * - 좌표로 주소 변환
 */

import axios from 'axios';
import { BaseProvider } from './BaseProvider.js';

export class KakaoMapProvider extends BaseProvider {
  constructor() {
    super('KAKAO_MAP', 80); // 높은 우선순위
    this.baseURL = 'https://dapi.kakao.com/v2/local';
    this.apiKey = process.env.KAKAO_REST_API_KEY || '';
  }

  async isAvailable() {
    return this.enabled && !!this.apiKey;
  }

  /**
   * 카카오 로컬 API로 병원 정보 조회
   */
  async fetchOperatingInfo(hospital) {
    if (!await this.isAvailable()) {
      return null;
    }

    try {
      // 1. 키워드 검색으로 장소 찾기
      const place = await this.searchPlace(hospital.name, hospital.address);

      if (!place) {
        console.log(`[KAKAO] ${hospital.name}: 장소를 찾을 수 없음`);
        return null;
      }

      // 2. 장소 상세 정보 조회 (카카오는 기본 정보만 제공)
      const placeDetail = await this.fetchPlaceDetail(place.id);

      if (!placeDetail) {
        return null;
      }

      // 3. 데이터 정규화
      return this.normalizeData(placeDetail);

    } catch (error) {
      return this.handleError(error, hospital);
    }
  }

  /**
   * 카카오 로컬 API로 장소 검색
   */
  async searchPlace(name, address) {
    try {
      const response = await axios.get(`${this.baseURL}/search/keyword.json`, {
        headers: {
          'Authorization': `KakaoAK ${this.apiKey}`
        },
        params: {
          query: `${name} ${address}`,
          category_group_code: 'HP8', // 병원
          size: 5
        },
        timeout: 10000
      });

      const documents = response.data.documents;

      if (!documents || documents.length === 0) {
        return null;
      }

      // 첫 번째 결과 반환
      return documents[0];

    } catch (error) {
      console.error(`[KAKAO] 검색 실패 (${name}):`, error.message);
      return null;
    }
  }

  /**
   * 장소 상세 정보 조회
   */
  async fetchPlaceDetail(placeId) {
    // 카카오 로컬 API는 운영시간 정보를 제공하지 않음
    // 추가 정보가 필요하면 크롤링 필요 (비추천)

    console.log(`[KAKAO] 카카오 API는 운영시간 정보를 제공하지 않습니다.`);
    return null;
  }

  /**
   * 카카오 데이터를 표준 형식으로 변환
   */
  normalizeData(rawData) {
    return {
      has_emergency_room: false,
      open_24_hours: false,
      weekend_available: false,
      opening_hours: null,
      source: this.name,
      updated_at: new Date().toISOString(),
      raw_data: {
        place_name: rawData.place_name,
        phone: rawData.phone,
        address_name: rawData.address_name,
        road_address_name: rawData.road_address_name,
        x: rawData.x, // 경도
        y: rawData.y, // 위도
        place_url: rawData.place_url
      }
    };
  }
}

export default KakaoMapProvider;
