/**
 * 데이터 퀄리티 비교 스크립트
 */

import db from '../database/init.js';
import Hospital from '../models/Hospital.js';

function compareDataQuality() {
  console.log('\n' + '='.repeat(80));
  console.log('📊 데이터 퀄리티 상세 비교');
  console.log('='.repeat(80) + '\n');

  // 다양한 샘플 선택
  const samples = [
    { name: '삼성서울병원', desc: '대형 상급종합병원' },
    { name: '강남피부과의원', desc: '서울 강남구 신규 의원' },
    { name: '이천한의원', desc: '이천시 신규 한의원' },
    { name: '효성약국', desc: '이천시 신규 약국' },
    { name: '청담성형외과의원', desc: '서울 강남구 성형외과' }
  ];

  samples.forEach((sample, i) => {
    const hospital = Hospital.getAll({ search: sample.name })[0];

    if (!hospital) {
      console.log(`${i + 1}. ❌ ${sample.name} - 찾을 수 없음\n`);
      return;
    }

    console.log(`${i + 1}. ${hospital.name}`);
    console.log(`   타입: ${hospital.type} | 지역: ${hospital.city} | ${sample.desc}`);
    console.log('   ' + '-'.repeat(76));

    // 홈페이지
    const homepageStatus = hospital.homepage
      ? (hospital.homepage.includes('samsunghospital') || hospital.homepage.includes('severance')
        ? '✅ 실제 홈페이지'
        : '🟡 네이버 플레이스')
      : '❌ 없음';
    console.log('   📱 홈페이지:', homepageStatus);
    if (hospital.homepage) {
      console.log('      → ' + hospital.homepage.substring(0, 70));
    }

    // 운영시간
    if (hospital.opening_hours) {
      const hours = JSON.parse(hospital.opening_hours);
      console.log('   🕐 운영시간: ✅ 상세정보 있음');
      console.log('      평일:', hours.weekday?.open, '-', hours.weekday?.close);
      console.log('      토요일:', hours.saturday === 'closed' ? '휴무' : `${hours.saturday?.open} - ${hours.saturday?.close}`);
      console.log('      일요일:', hours.sunday === 'closed' ? '휴무' : `${hours.sunday?.open} - ${hours.sunday?.close}`);
      if (hours.lunch_break) {
        console.log('      점심시간:', hours.lunch_break.start, '-', hours.lunch_break.end);
      }
      if (hours.note) {
        console.log('      비고:', hours.note);
      }
    } else {
      console.log('   🕐 운영시간: ❌ 없음');
    }

    // 이미지
    const imageStatus = hospital.image_url.includes('placeholder')
      ? '❌ Placeholder'
      : (hospital.image_url.includes('unsplash') ? '✅ Unsplash' : '✅ 실제');
    console.log('   🖼️  이미지:', imageStatus);
    console.log('      → ' + hospital.image_url.substring(0, 60) + '...');

    // 전문과목
    const specialties = hospital.specialties || [];
    console.log('   🏥 전문과목:', specialties.length, '개');
    console.log('      →', specialties.slice(0, 5).join(', '));

    // 좌표
    const coordStatus = hospital.latitude && hospital.longitude
      ? `✅ (${hospital.latitude.toFixed(4)}, ${hospital.longitude.toFixed(4)})`
      : '❌ 없음';
    console.log('   📍 좌표:', coordStatus);

    // 기타 정보
    console.log('   🚑 응급실:', hospital.has_emergency_room ? '✅ 있음' : '❌ 없음');
    console.log('   🌙 24시간:', hospital.open_24_hours ? '✅ 운영' : '❌ 미운영');
    console.log('   📅 주말진료:', hospital.weekend_available ? '✅ 가능' : '❌ 불가');

    console.log('');
  });

  // 전체 통계
  console.log('='.repeat(80));
  console.log('📈 전체 데이터 통계');
  console.log('='.repeat(80));

  const allHospitals = Hospital.getAll({});
  const stats = {
    total: allHospitals.length,
    withHomepage: allHospitals.filter(h => h.homepage).length,
    withOpeningHours: allHospitals.filter(h => h.opening_hours).length,
    withRealImage: allHospitals.filter(h => h.image_url && !h.image_url.includes('placeholder')).length,
    withCoordinates: allHospitals.filter(h => h.latitude && h.longitude).length,
    withEmergency: allHospitals.filter(h => h.has_emergency_room).length,
    with24Hours: allHospitals.filter(h => h.open_24_hours).length,
    withWeekend: allHospitals.filter(h => h.weekend_available).length
  };

  console.log(`\n총 의료기관: ${stats.total}개\n`);
  console.log('데이터 완성도:');
  console.log(`  📱 홈페이지/네이버:  ${stats.withHomepage}/${stats.total} (${(stats.withHomepage/stats.total*100).toFixed(1)}%)`);
  console.log(`  🕐 운영시간:         ${stats.withOpeningHours}/${stats.total} (${(stats.withOpeningHours/stats.total*100).toFixed(1)}%)`);
  console.log(`  🖼️  실제 이미지:      ${stats.withRealImage}/${stats.total} (${(stats.withRealImage/stats.total*100).toFixed(1)}%)`);
  console.log(`  📍 GPS 좌표:         ${stats.withCoordinates}/${stats.total} (${(stats.withCoordinates/stats.total*100).toFixed(1)}%)`);
  console.log('');
  console.log('특수 기능:');
  console.log(`  🚑 응급실:           ${stats.withEmergency}개`);
  console.log(`  🌙 24시간 운영:      ${stats.with24Hours}개`);
  console.log(`  📅 주말 진료:        ${stats.withWeekend}개`);

  // 지역별 통계
  console.log('\n' + '='.repeat(80));
  console.log('📍 지역별 통계');
  console.log('='.repeat(80) + '\n');

  const icheon = allHospitals.filter(h => h.city === '이천시');
  const gangnam = allHospitals.filter(h => h.city === '강남구');
  const seocho = allHospitals.filter(h => h.city === '서초구');

  console.log(`이천시: ${icheon.length}개`);
  console.log(`  - 의원: ${icheon.filter(h => h.type === '의원').length}개`);
  console.log(`  - 치과: ${icheon.filter(h => h.type === '치과').length}개`);
  console.log(`  - 병원: ${icheon.filter(h => h.type === '병원').length}개`);
  console.log(`  - 종합병원: ${icheon.filter(h => h.type === '종합병원').length}개`);

  console.log(`\n서울 강남구: ${gangnam.length}개`);
  console.log(`  - 의원: ${gangnam.filter(h => h.type === '의원').length}개`);
  console.log(`  - 치과: ${gangnam.filter(h => h.type === '치과').length}개`);
  console.log(`  - 상급종합병원: ${gangnam.filter(h => h.type === '상급종합병원').length}개`);

  console.log(`\n서울 서초구: ${seocho.length}개`);
  console.log(`  - 의원: ${seocho.filter(h => h.type === '의원').length}개`);
  console.log(`  - 치과: ${seocho.filter(h => h.type === '치과').length}개`);
  console.log(`  - 상급종합병원: ${seocho.filter(h => h.type === '상급종합병원').length}개`);

  console.log('\n' + '='.repeat(80));
  console.log('✅ 데이터 퀄리티 비교 완료!\n');
}

compareDataQuality();
