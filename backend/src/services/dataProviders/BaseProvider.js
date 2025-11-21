/**
 * 데이터 제공자 베이스 클래스
 *
 * 모든 데이터 소스(API, 크롤링, 수동 입력 등)가 구현해야 하는 인터페이스
 */

export class BaseProvider {
  constructor(name, priority = 50) {
    this.name = name;
    this.priority = priority; // 우선순위 (높을수록 먼저 시도)
    this.enabled = true;
  }

  /**
   * 병원 운영정보 조회
   * @param {Object} hospital - 병원 정보 {id, name, address, phone}
   * @returns {Promise<Object|null>} 운영정보 또는 null
   */
  async fetchOperatingInfo(hospital) {
    throw new Error('fetchOperatingInfo() must be implemented');
  }

  /**
   * 제공자 활성화 여부 확인
   * @returns {Promise<boolean>}
   */
  async isAvailable() {
    return this.enabled;
  }

  /**
   * 데이터 정규화 (표준 형식으로 변환)
   * @param {Object} rawData - 원본 데이터
   * @returns {Object} 표준 형식의 운영정보
   */
  normalizeData(rawData) {
    return {
      has_emergency_room: false,
      open_24_hours: false,
      weekend_available: false,
      opening_hours: null,
      source: this.name,
      updated_at: new Date().toISOString()
    };
  }

  /**
   * 에러 처리
   * @param {Error} error
   * @param {Object} hospital
   */
  handleError(error, hospital) {
    console.error(`[${this.name}] Error fetching ${hospital.name}:`, error.message);
    return null;
  }
}

/**
 * 표준 운영정보 형식
 *
 * @typedef {Object} OperatingInfo
 * @property {boolean} has_emergency_room - 응급실 운영 여부
 * @property {boolean} open_24_hours - 24시간 운영 여부
 * @property {boolean} weekend_available - 주말 진료 여부
 * @property {Object|null} opening_hours - 운영시간 상세
 * @property {Object} opening_hours.weekday - 평일 {open, close}
 * @property {Object|string} opening_hours.saturday - 토요일 {open, close} 또는 'closed'
 * @property {Object|string} opening_hours.sunday - 일요일 {open, close} 또는 'closed'
 * @property {Object|null} opening_hours.lunch_break - 점심시간 {start, end}
 * @property {string|null} opening_hours.note - 비고
 * @property {string} source - 데이터 출처
 * @property {string} updated_at - 업데이트 시간
 */

export default BaseProvider;
