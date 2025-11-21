/**
 * 네이버 플레이스 데이터 제공자
 *
 * ⚠️ 주의: 크롤링은 네이버 이용약관 위반 가능성이 있습니다.
 * - robots.txt 확인 필수
 * - 공식 API가 없으므로 사용에 주의 필요
 * - 개인 프로젝트 용도로만 사용
 *
 * 대안:
 * 1. 네이버 검색 API 활용 (제한적)
 * 2. 사용자가 직접 정보 입력
 * 3. 공공데이터 API 사용 (추천)
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import { BaseProvider } from './BaseProvider.js';

export class NaverPlaceProvider extends BaseProvider {
  constructor() {
    super('NAVER_PLACE', 70); // 중간 우선순위
    this.enabled = false; // 기본적으로 비활성화
  }

  async isAvailable() {
    // 크롤링은 기본적으로 비활성화
    // 활성화하려면 환경변수 설정 필요
    return this.enabled && process.env.ENABLE_NAVER_CRAWLING === 'true';
  }

  /**
   * 네이버 플레이스에서 병원 정보 조회
   */
  async fetchOperatingInfo(hospital) {
    if (!await this.isAvailable()) {
      return null;
    }

    try {
      // 1. 네이버 검색으로 플레이스 ID 찾기
      const placeId = await this.searchPlaceId(hospital.name, hospital.address);

      if (!placeId) {
        console.log(`[NAVER] ${hospital.name}: 플레이스를 찾을 수 없음`);
        return null;
      }

      // 2. 플레이스 상세 페이지에서 운영시간 크롤링
      const placeData = await this.fetchPlaceDetail(placeId);

      if (!placeData) {
        return null;
      }

      // 3. 데이터 정규화
      return this.normalizeData(placeData);

    } catch (error) {
      return this.handleError(error, hospital);
    }
  }

  /**
   * 네이버 검색으로 플레이스 ID 찾기
   */
  async searchPlaceId(name, address) {
    // TODO: 네이버 검색 API 또는 크롤링 구현
    // 현재는 구조만 작성
    console.log(`[NAVER] 검색: ${name} ${address}`);

    // 예시 URL: https://m.place.naver.com/hospital/PLACE_ID/home
    // 실제 구현 시 검색 결과에서 PLACE_ID 추출 필요

    return null; // 구현 필요
  }

  /**
   * 플레이스 상세 정보 크롤링
   */
  async fetchPlaceDetail(placeId) {
    // TODO: 네이버 플레이스 상세 페이지 크롤링
    // 현재는 구조만 작성

    const url = `https://m.place.naver.com/hospital/${placeId}/home`;

    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 10000
      });

      const $ = cheerio.load(response.data);

      // TODO: HTML 파싱하여 운영시간 추출
      // 예: $('.operating_hours').text()

      return {
        // 파싱된 데이터
        operatingHours: {},
        phone: '',
        address: ''
      };

    } catch (error) {
      console.error(`[NAVER] 플레이스 조회 실패 (${placeId}):`, error.message);
      return null;
    }
  }

  /**
   * 네이버 플레이스 데이터를 표준 형식으로 변환
   */
  normalizeData(rawData) {
    // TODO: 네이버 플레이스 데이터 파싱 로직
    return {
      has_emergency_room: false,
      open_24_hours: false,
      weekend_available: false,
      opening_hours: rawData.operatingHours || null,
      source: this.name,
      updated_at: new Date().toISOString()
    };
  }
}

export default NaverPlaceProvider;
