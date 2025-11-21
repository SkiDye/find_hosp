/**
 * HIRA API를 통한 병원 데이터 가져오기 스크립트
 *
 * 사용법:
 * node src/scripts/importFromHira.js [시도코드] [시군구코드] [최대페이지수]
 *
 * 예시:
 * node src/scripts/importFromHira.js 410000 41500 10  # 경기도 이천시, 최대 10페이지
 */

import db from '../database/init.js';
import Hospital from '../models/Hospital.js';
import hiraApiService from '../services/hiraApi.js';

/**
 * 명령줄 인자 파싱
 */
function parseArguments() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log('\n❌ 사용법: node src/scripts/importFromHira.js [시도코드] [시군구코드] [최대페이지수]');
    console.log('\n예시:');
    console.log('  node src/scripts/importFromHira.js 410000 41500 10  # 경기도 이천시');
    console.log('  node src/scripts/importFromHira.js 110000 null 20   # 서울 전체');
    console.log('\n시도코드:');
    console.log('  110000 - 서울,  410000 - 경기,  260000 - 부산');
    console.log('  270000 - 대구,  280000 - 인천,  290000 - 광주');
    console.log('  300000 - 대전,  310000 - 울산,  360000 - 세종');
    console.log('\n경기도 시군구코드:');
    console.log('  41500 - 이천시,  41110 - 수원시,  41130 - 성남시');
    console.log('  41460 - 용인시,  41170 - 안양시,  41190 - 부천시');
    console.log('  41220 - 평택시,  41590 - 화성시,  41610 - 광주시\n');
    process.exit(1);
  }

  const siDoCd = args[0];
  const siGunGuCd = args[1] === 'null' ? undefined : args[1];
  const maxPages = parseInt(args[2]) || 10;

  return { siDoCd, siGunGuCd, maxPages };
}

/**
 * HIRA 데이터를 DB에 추가
 */
async function importHospitalsFromHira(siDoCd, siGunGuCd, maxPages) {
  console.log('\n' + '='.repeat(80));
  console.log('🏥 HIRA API를 통한 병원 데이터 가져오기');
  console.log('='.repeat(80));

  // API 키 확인
  const apiKey = process.env.HIRA_API_KEY;
  if (!apiKey) {
    console.log('\n❌ HIRA API 키가 설정되지 않았습니다.');
    console.log('📝 .env 파일에 다음과 같이 추가하세요:');
    console.log('   HIRA_API_KEY=your_api_key_here\n');
    console.log('💡 API 키 발급 방법:');
    console.log('   1. https://www.data.go.kr 접속');
    console.log('   2. 회원가입 및 로그인');
    console.log('   3. "병의원 찾기 서비스" 검색');
    console.log('   4. 활용신청 후 API 키 발급\n');
    console.log('⚠️  현재는 HIRA API 없이 수동 데이터만 사용 가능합니다.\n');
    return;
  }

  hiraApiService.setApiKey(apiKey);

  let addedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  try {
    // HIRA API에서 데이터 가져오기
    const hiraData = await hiraApiService.getAllHospitalsInRegion(
      siDoCd,
      siGunGuCd,
      maxPages
    );

    console.log(`\n📊 가져온 데이터: ${hiraData.length}개`);
    console.log('🔄 데이터베이스에 추가 중...\n');

    // 각 병원 데이터 처리
    for (let i = 0; i < hiraData.length; i++) {
      const data = hiraData[i];

      try {
        // HIRA 데이터를 우리 스키마로 변환
        const hospitalData = hiraApiService.transformToHospitalData(data);

        // 중복 체크 (병원명으로)
        const existing = Hospital.getAll({ search: hospitalData.name });
        const exactMatch = existing.find(h => h.name === hospitalData.name);

        if (exactMatch) {
          console.log(`⏭️  [${i + 1}/${hiraData.length}] 이미 존재: ${hospitalData.name}`);
          skippedCount++;
          continue;
        }

        // 병원 생성
        const hospital = Hospital.create({
          name: hospitalData.name,
          type: hospitalData.type,
          region: hospitalData.region,
          city: hospitalData.city,
          address: hospitalData.address,
          phone: hospitalData.phone,
          latitude: hospitalData.latitude,
          longitude: hospitalData.longitude,
          has_emergency_room: hospitalData.has_emergency_room,
          open_24_hours: hospitalData.open_24_hours,
          weekend_available: hospitalData.weekend_available,
          specialties: hospitalData.specialties || [],
          image_url: `https://via.placeholder.com/400x300?text=${encodeURIComponent(hospitalData.name)}`
        });

        console.log(`✅ [${i + 1}/${hiraData.length}] 추가 완료: ${hospitalData.name} (${hospitalData.type})`);
        addedCount++;

        // 진료과목 정보 가져오기 (선택적)
        if (hospitalData.metadata?.ykiho) {
          try {
            const subjects = await hiraApiService.getMedicalSubjects(hospitalData.metadata.ykiho);
            if (subjects && subjects.items) {
              // 진료과목 업데이트 로직 추가 가능
              console.log(`   ℹ️  진료과목 정보 가져옴`);
            }
            // API 호출 제한 고려
            await new Promise(resolve => setTimeout(resolve, 500));
          } catch (err) {
            // 진료과목 조회 실패는 무시
          }
        }

      } catch (error) {
        console.error(`❌ [${i + 1}/${hiraData.length}] 추가 실패: ${data.yadmNm || '알 수 없음'}`);
        console.error(`   오류: ${error.message}`);
        errorCount++;
      }
    }

  } catch (error) {
    console.error('\n❌ HIRA API 호출 중 오류 발생:', error.message);
    return;
  }

  // 최종 통계
  console.log('\n' + '='.repeat(80));
  console.log('📊 가져오기 완료 통계');
  console.log('='.repeat(80));
  console.log(`✅ 추가된 병원: ${addedCount}개`);
  console.log(`⏭️  건너뛴 병원: ${skippedCount}개 (이미 존재)`);
  console.log(`❌ 실패한 병원: ${errorCount}개`);

  const allHospitals = Hospital.getAll({});
  console.log(`📋 전체 의료기관 수: ${allHospitals.length}개`);
  console.log('='.repeat(80));

  console.log('\n✨ HIRA 데이터 가져오기가 완료되었습니다!');
  console.log('👉 http://localhost:5173/hospitals 에서 확인하세요\n');
}

// 스크립트 실행
(async () => {
  const { siDoCd, siGunGuCd, maxPages } = parseArguments();

  console.log('\n설정:');
  console.log(`  시도코드: ${siDoCd}`);
  console.log(`  시군구코드: ${siGunGuCd || '전체'}`);
  console.log(`  최대 페이지: ${maxPages}\n`);

  await importHospitalsFromHira(siDoCd, siGunGuCd, maxPages);
})();
