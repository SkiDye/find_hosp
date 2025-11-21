/**
 * 실제 병원 데이터 수집 스크립트
 *
 * 실행 방법:
 * 1. .env 파일에 PUBLIC_DATA_API_KEY 설정
 * 2. node src/scripts/fetchRealData.js
 */

import {
  getHospitalList,
  transformHospitalData,
  getSidoCode,
  SIDO_CODES
} from '../services/publicDataAPI.js';
import db from '../database/init.js';

// 수집할 지역 목록 (전국 또는 특정 지역만 선택 가능)
const TARGET_REGIONS = ['서울', '부산', '대구', '인천', '광주', '대전'];

// 수집할 병원 종별 (선택사항)
const TARGET_TYPES = ['상급종합병원', '종합병원', '병원'];

/**
 * 실제 병원 데이터 수집
 */
async function fetchAndStoreHospitals() {
  console.log('🚀 실제 병원 데이터 수집 시작...\n');

  let totalCollected = 0;
  let successCount = 0;
  let errorCount = 0;

  // API 키 확인
  const apiKey = process.env.PUBLIC_DATA_API_KEY;
  if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
    console.error('❌ 오류: PUBLIC_DATA_API_KEY가 설정되지 않았습니다.');
    console.log('\n📝 API 키 발급 방법:');
    console.log('1. https://www.data.go.kr/ 접속');
    console.log('2. 회원가입 및 로그인');
    console.log('3. "병원정보서비스" 검색');
    console.log('4. 활용신청 후 인증키 발급');
    console.log('5. backend/.env 파일 생성 후 다음 추가:');
    console.log('   PUBLIC_DATA_API_KEY=발급받은키\n');
    return;
  }

  // 기존 샘플 데이터 제거 여부 확인
  console.log('⚠️  기존 샘플 데이터를 삭제하고 실제 데이터로 교체하시겠습니까?');
  console.log('계속하려면 이 스크립트를 수정하여 CONFIRM_DELETE를 true로 설정하세요.\n');

  const CONFIRM_DELETE = false; // true로 변경하여 실행

  if (!CONFIRM_DELETE) {
    console.log('❌ 작업 취소됨. CONFIRM_DELETE를 true로 설정 후 재실행하세요.');
    return;
  }

  // 기존 데이터 삭제
  db.hospitals = [];
  db._nextId.hospitals = 1;
  console.log('✅ 기존 샘플 데이터 삭제 완료\n');

  // 지역별로 데이터 수집
  for (const region of TARGET_REGIONS) {
    console.log(`📍 ${region} 지역 병원 수집 중...`);

    const sidoCode = getSidoCode(region);
    if (!sidoCode) {
      console.log(`   ⚠️  ${region} 시도코드를 찾을 수 없습니다.`);
      continue;
    }

    try {
      // API 호출 (페이지네이션 고려)
      let pageNo = 1;
      let hasMore = true;

      while (hasMore && pageNo <= 10) { // 최대 10페이지까지만 수집 (안전장치)
        const result = await getHospitalList({
          sidoCd: sidoCode,
          pageNo,
          numOfRows: 100
        });

        if (!result.success) {
          console.log(`   ❌ API 호출 실패: ${result.error}`);
          errorCount++;
          break;
        }

        const hospitals = result.data;
        if (!hospitals || hospitals.length === 0) {
          hasMore = false;
          break;
        }

        // 데이터 변환 및 저장
        for (const apiHospital of hospitals) {
          try {
            const transformedData = transformHospitalData(apiHospital);

            // 병원 종별 필터링 (선택사항)
            // if (!TARGET_TYPES.includes(transformedData.type)) {
            //   continue;
            // }

            // DB에 저장
            const newHospital = {
              id: db._nextId.hospitals++,
              ...transformedData,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };

            db.hospitals.push(newHospital);
            successCount++;
            totalCollected++;
          } catch (error) {
            console.log(`   ⚠️  데이터 변환 오류: ${error.message}`);
            errorCount++;
          }
        }

        console.log(`   페이지 ${pageNo}: ${hospitals.length}개 수집 (총 ${totalCollected}개)`);

        // 다음 페이지 확인
        if (hospitals.length < 100) {
          hasMore = false;
        } else {
          pageNo++;
          // API 호출 간격 (과도한 요청 방지)
          await sleep(500); // 0.5초 대기
        }
      }

      console.log(`✅ ${region} 완료: ${successCount}개 수집\n`);

    } catch (error) {
      console.log(`❌ ${region} 오류: ${error.message}\n`);
      errorCount++;
    }

    // 지역 간 API 호출 간격
    await sleep(1000); // 1초 대기
  }

  // 결과 요약
  console.log('\n' + '='.repeat(50));
  console.log('📊 데이터 수집 완료');
  console.log('='.repeat(50));
  console.log(`✅ 성공: ${successCount}개`);
  console.log(`❌ 실패: ${errorCount}개`);
  console.log(`📁 총 수집: ${db.hospitals.length}개 병원`);
  console.log('='.repeat(50));

  // 지역별 통계
  console.log('\n📈 지역별 수집 현황:');
  const regionStats = {};
  db.hospitals.forEach(h => {
    regionStats[h.region] = (regionStats[h.region] || 0) + 1;
  });

  Object.entries(regionStats).forEach(([region, count]) => {
    console.log(`   ${region}: ${count}개`);
  });

  // 병원 종별 통계
  console.log('\n🏥 병원 종별 현황:');
  const typeStats = {};
  db.hospitals.forEach(h => {
    typeStats[h.type] = (typeStats[h.type] || 0) + 1;
  });

  Object.entries(typeStats).forEach(([type, count]) => {
    console.log(`   ${type}: ${count}개`);
  });

  console.log('\n✨ 서버를 재시작하면 새 데이터가 반영됩니다.');
}

/**
 * 대기 함수 (API 호출 간격 조절)
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 스크립트 실행
 */
fetchAndStoreHospitals()
  .then(() => {
    console.log('\n✅ 스크립트 실행 완료');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ 스크립트 실행 오류:', error);
    process.exit(1);
  });
