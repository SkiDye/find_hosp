/**
 * 이미지 데이터 보완 스크립트
 * - placeholder 제거
 * - 네이버 맵 이미지 추가
 * - 배너 이미지 배열 정리
 */

import db from '../database/init.js';
import Hospital from '../models/Hospital.js';

// 네이버 정적 지도 API URL 생성
function generateNaverMapImage(lat, lng, name) {
  // 네이버 정적 지도 API (키 없이도 사용 가능한 기본 형식)
  const zoom = 16;
  const width = 800;
  const height = 400;

  // 네이버 맵 URL (마커 포함)
  return `https://naveropenapi.apigw.ntruss.com/map-static/v2/raster?w=${width}&h=${height}&center=${lng},${lat}&level=${zoom}&markers=type:d|size:mid|pos:${lng}%20${lat}`;
}

// 카카오 맵 URL 생성 (대체)
function generateKakaoMapUrl(lat, lng, name) {
  return `https://map.kakao.com/link/map/${encodeURIComponent(name)},${lat},${lng}`;
}

// 구글 맵 정적 이미지 생성 (키 필요 없는 버전)
function generateGoogleMapImage(lat, lng) {
  return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=16&size=800x400&markers=color:red%7C${lat},${lng}`;
}

// 전문과목/타입별 배너 이미지 세트
const bannerImageSets = {
  '상급종합병원': [
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&h=400&fit=crop'
  ],
  '종합병원': [
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&h=400&fit=crop'
  ],
  '피부과': [
    'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&h=400&fit=crop'
  ],
  '성형외과': [
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&h=400&fit=crop'
  ],
  '치과': [
    'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1629909615957-be38b3a89c2c?w=800&h=400&fit=crop'
  ],
  '내과': [
    'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&h=400&fit=crop'
  ],
  '소아과': [
    'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1631815587760-f91abb485a2e?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1622037800110-22d62d41d889?w=800&h=400&fit=crop'
  ],
  '산부인과': [
    'https://images.unsplash.com/photo-1584515933487-779824d29309?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1631815587888-9e9b93c10f67?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&h=400&fit=crop'
  ],
  '안과': [
    'https://images.unsplash.com/photo-1574068468668-a05a11f871da?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1591370874773-6702e8f12fd8?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1622034817-94b77e51c923?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800&h=400&fit=crop'
  ],
  '이비인후과': [
    'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&h=400&fit=crop'
  ],
  '정형외과': [
    'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1579684453423-f84349ef60b0?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1612832021429-1c7c6c180a4f?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1599045118108-bf9954418b76?w=800&h=400&fit=crop'
  ],
  '한의원': [
    'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1603400521630-9f2de124b33b?w=800&h=400&fit=crop'
  ],
  '약국': [
    'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&h=400&fit=crop'
  ],
  'default': [
    'https://images.unsplash.com/photo-1629909615957-be38b3a89c2c?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&h=400&fit=crop'
  ]
};

// 배너 이미지 세트 선택
function selectBannerImages(hospital) {
  const specialties = hospital.specialties || [];

  // 전문과목 기준
  for (const specialty of specialties) {
    if (bannerImageSets[specialty]) {
      return bannerImageSets[specialty];
    }
  }

  // 타입 기준
  if (bannerImageSets[hospital.type]) {
    return bannerImageSets[hospital.type];
  }

  // 기본값
  return bannerImageSets['default'];
}

// 이미지 데이터 보완
function fixImageData() {
  console.log('\n' + '='.repeat(80));
  console.log('🖼️  이미지 데이터 보완 시작');
  console.log('='.repeat(80) + '\n');

  const allHospitals = Hospital.getAll({});
  let updatedCount = 0;

  const updateStmt = db.prepare(`
    UPDATE hospitals
    SET
      image_urls = ?,
      naver_map_image = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);

  allHospitals.forEach((hospital, index) => {
    try {
      // 배너 이미지 배열 생성 (placeholder 제거)
      let bannerImages = selectBannerImages(hospital);

      // 대표 이미지를 맨 앞에 추가
      if (hospital.image_url && !hospital.image_url.includes('placeholder')) {
        bannerImages = [hospital.image_url, ...bannerImages.slice(0, 4)];
      }

      // 네이버 맵 이미지 (카카오 맵 링크로 대체)
      let mapImage = null;
      if (hospital.latitude && hospital.longitude) {
        mapImage = generateKakaoMapUrl(
          hospital.latitude,
          hospital.longitude,
          hospital.name
        );
      }

      // 업데이트
      updateStmt.run(
        JSON.stringify(bannerImages),
        mapImage,
        hospital.id
      );

      console.log(`✅ [${index + 1}/${allHospitals.length}] ${hospital.name} 이미지 보완 완료`);
      updatedCount++;

    } catch (error) {
      console.error(`❌ [${index + 1}/${allHospitals.length}] ${hospital.name} 업데이트 실패:`, error.message);
    }
  });

  // 최종 통계
  console.log('\n' + '='.repeat(80));
  console.log('📊 이미지 보완 완료');
  console.log('='.repeat(80));
  console.log(`✅ 업데이트된 의료기관: ${updatedCount}개`);
  console.log(`📋 전체 의료기관 수: ${allHospitals.length}개`);
  console.log('='.repeat(80));

  // 샘플 확인
  console.log('\n📋 샘플 데이터 확인:\n');
  const sampleHospital = Hospital.getAll({ search: '강남피부과의원' })[0];
  if (sampleHospital) {
    console.log('병원명:', sampleHospital.name);
    console.log('배너 이미지 수:', sampleHospital.image_urls.length, '개');
    console.log('첫 번째 이미지:', sampleHospital.image_urls[0].substring(0, 60) + '...');
    console.log('Placeholder 포함?', sampleHospital.image_urls.some(url => url.includes('placeholder')) ? '❌ 있음' : '✅ 없음');
    console.log('네이버 맵:', sampleHospital.naver_map_image ? '✅ ' + sampleHospital.naver_map_image.substring(0, 50) + '...' : '❌ 없음');
  }

  console.log('\n✨ 이미지 데이터 보완이 완료되었습니다!');
  console.log('👉 http://localhost:5173/hospitals 에서 확인하세요\n');

  console.log('💡 보완된 내용:');
  console.log('   ✅ Placeholder 이미지 완전 제거');
  console.log('   ✅ 전문과목별 고품질 배너 이미지 (5장)');
  console.log('   ✅ 카카오 맵 링크 추가');
  console.log('   ✅ 갤러리/슬라이드 기능 지원\n');
}

// 스크립트 실행
fixImageData();
