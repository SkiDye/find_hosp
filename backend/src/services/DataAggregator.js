/**
 * 데이터 통합 관리자
 *
 * 여러 데이터 소스(API, 크롤링 등)에서 병원 운영정보를 가져와 통합
 */

import HIRAProvider from './dataProviders/HIRAProvider.js';
import KakaoMapProvider from './dataProviders/KakaoMapProvider.js';
import NaverPlaceProvider from './dataProviders/NaverPlaceProvider.js';

export class DataAggregator {
  constructor() {
    // 데이터 제공자 등록 (우선순위 순)
    this.providers = [
      new HIRAProvider(),      // 100: 공식 API (최우선)
      new KakaoMapProvider(),  // 80: 카카오 공식 API
      new NaverPlaceProvider() // 70: 네이버 (크롤링, 비활성화)
    ];

    // 우선순위로 정렬
    this.providers.sort((a, b) => b.priority - a.priority);
  }

  /**
   * 병원 운영정보 조회 (여러 소스 시도)
   */
  async fetchOperatingInfo(hospital) {
    console.log(`\n🔍 [${hospital.name}] 운영정보 조회 시작`);

    const results = [];

    // 우선순위 순으로 각 Provider 시도
    for (const provider of this.providers) {
      // Provider 사용 가능 여부 확인
      if (!await provider.isAvailable()) {
        console.log(`   ⏭️  [${provider.name}] 비활성화됨`);
        continue;
      }

      console.log(`   🔄 [${provider.name}] 조회 중...`);

      // 데이터 조회
      const data = await provider.fetchOperatingInfo(hospital);

      if (data) {
        console.log(`   ✅ [${provider.name}] 데이터 획득`);
        results.push(data);

        // 고우선순위 Provider에서 완전한 데이터를 얻었으면 중단
        if (this.isCompleteData(data) && provider.priority >= 80) {
          console.log(`   🎯 충분한 데이터 획득, 조회 종료`);
          break;
        }
      } else {
        console.log(`   ⚠️  [${provider.name}] 데이터 없음`);
      }

      // API 호출 간격 (Rate Limiting 방지)
      await this.delay(500);
    }

    // 결과 병합
    if (results.length === 0) {
      console.log(`   ❌ 모든 소스에서 데이터를 가져올 수 없음`);
      return null;
    }

    const mergedData = this.mergeResults(results);
    console.log(`   ✅ 최종 데이터: ${JSON.stringify(mergedData, null, 2)}`);

    return mergedData;
  }

  /**
   * 여러 소스의 데이터 병합 (우선순위 기반)
   */
  mergeResults(results) {
    if (results.length === 0) return null;
    if (results.length === 1) return results[0];

    // 기본값: 첫 번째 결과 (최고 우선순위)
    const merged = { ...results[0] };

    // 나머지 결과로 빈 필드 채우기
    for (let i = 1; i < results.length; i++) {
      const data = results[i];

      // opening_hours가 없으면 다음 소스에서 가져오기
      if (!merged.opening_hours && data.opening_hours) {
        merged.opening_hours = data.opening_hours;
      }

      // raw_data 병합
      if (data.raw_data) {
        merged.raw_data = {
          ...merged.raw_data,
          ...data.raw_data
        };
      }

      // 여러 소스 기록
      if (!merged.sources) {
        merged.sources = [merged.source];
      }
      merged.sources.push(data.source);
    }

    return merged;
  }

  /**
   * 데이터 완전성 검사
   */
  isCompleteData(data) {
    return !!(
      data &&
      data.opening_hours &&
      data.opening_hours.weekday &&
      (data.opening_hours.saturday || data.opening_hours.saturday === 'closed')
    );
  }

  /**
   * 딜레이 함수
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 일괄 조회 (여러 병원)
   */
  async fetchBulk(hospitals, options = {}) {
    const {
      batchSize = 5,     // 동시 처리 개수
      delayBetweenBatches = 2000 // 배치 간 대기시간 (ms)
    } = options;

    console.log(`\n${'='.repeat(80)}`);
    console.log(`📊 일괄 조회 시작: ${hospitals.length}개 병원`);
    console.log(`   배치 크기: ${batchSize}개`);
    console.log(`   배치 간 대기: ${delayBetweenBatches}ms`);
    console.log(`${'='.repeat(80)}`);

    const results = [];
    const batches = [];

    // 배치로 나누기
    for (let i = 0; i < hospitals.length; i += batchSize) {
      batches.push(hospitals.slice(i, i + batchSize));
    }

    // 각 배치 처리
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];

      console.log(`\n📦 배치 ${i + 1}/${batches.length} (${batch.length}개 병원)`);

      // 배치 내 병원들을 병렬로 처리
      const batchResults = await Promise.all(
        batch.map(hospital => this.fetchOperatingInfo(hospital))
      );

      results.push(...batchResults);

      // 마지막 배치가 아니면 대기
      if (i < batches.length - 1) {
        console.log(`\n⏳ ${delayBetweenBatches}ms 대기...`);
        await this.delay(delayBetweenBatches);
      }
    }

    // 통계
    const successCount = results.filter(r => r !== null).length;
    const failCount = results.filter(r => r === null).length;

    console.log(`\n${'='.repeat(80)}`);
    console.log(`📊 일괄 조회 완료`);
    console.log(`   ✅ 성공: ${successCount}개`);
    console.log(`   ❌ 실패: ${failCount}개`);
    console.log(`   📋 전체: ${hospitals.length}개`);
    console.log(`${'='.repeat(80)}\n`);

    return results;
  }
}

export default DataAggregator;
