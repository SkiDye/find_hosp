/**
 * 전체 데이터 검수 스크립트
 * - 중복 확인
 * - 필수 필드 누락 확인
 * - 데이터 형식 검증
 * - 논리적 오류 확인
 */

import db from '../database/init.js';
import Hospital from '../models/Hospital.js';

function auditAllData() {
  console.log('\n' + '='.repeat(80));
  console.log('🔍 전체 데이터 검수 시작');
  console.log('='.repeat(80) + '\n');

  const allHospitals = Hospital.getAll({});
  const issues = {
    duplicates: [],
    missingFields: [],
    invalidPhone: [],
    invalidCoordinates: [],
    invalidOpeningHours: [],
    logicErrors: [],
    imageIssues: []
  };

  // 중복 체크
  console.log('1️⃣  중복 데이터 확인...');
  const nameMap = new Map();
  allHospitals.forEach(h => {
    if (nameMap.has(h.name)) {
      issues.duplicates.push({
        name: h.name,
        ids: [nameMap.get(h.name), h.id]
      });
    } else {
      nameMap.set(h.name, h.id);
    }
  });
  console.log(`   ${issues.duplicates.length > 0 ? '⚠️' : '✅'} 중복: ${issues.duplicates.length}건\n`);

  // 필수 필드 검사
  console.log('2️⃣  필수 필드 누락 확인...');
  allHospitals.forEach(h => {
    const missing = [];
    if (!h.name) missing.push('name');
    if (!h.type) missing.push('type');
    if (!h.address) missing.push('address');
    if (!h.phone) missing.push('phone');
    if (!h.region) missing.push('region');
    if (!h.city) missing.push('city');

    if (missing.length > 0) {
      issues.missingFields.push({
        id: h.id,
        name: h.name || 'Unknown',
        missing
      });
    }
  });
  console.log(`   ${issues.missingFields.length > 0 ? '⚠️' : '✅'} 누락: ${issues.missingFields.length}건\n`);

  // 전화번호 형식 검사 (대표전화 포함)
  console.log('3️⃣  전화번호 형식 확인...');
  const phoneRegex = /^(0\d{1,2}-\d{3,4}-\d{4}|1\d{3}-\d{4})$/; // 일반전화 + 대표전화
  allHospitals.forEach(h => {
    if (h.phone && !phoneRegex.test(h.phone)) {
      issues.invalidPhone.push({
        id: h.id,
        name: h.name,
        phone: h.phone
      });
    }
  });
  console.log(`   ${issues.invalidPhone.length > 0 ? '⚠️' : '✅'} 잘못된 형식: ${issues.invalidPhone.length}건\n`);

  // 좌표 검사
  console.log('4️⃣  GPS 좌표 확인...');
  allHospitals.forEach(h => {
    if (!h.latitude || !h.longitude) {
      issues.invalidCoordinates.push({
        id: h.id,
        name: h.name,
        reason: '좌표 없음'
      });
    } else if (h.latitude < 33 || h.latitude > 43 || h.longitude < 124 || h.longitude > 132) {
      issues.invalidCoordinates.push({
        id: h.id,
        name: h.name,
        reason: '한국 범위 벗어남',
        lat: h.latitude,
        lng: h.longitude
      });
    }
  });
  console.log(`   ${issues.invalidCoordinates.length > 0 ? '⚠️' : '✅'} 좌표 문제: ${issues.invalidCoordinates.length}건\n`);

  // 운영시간 검사
  console.log('5️⃣  운영시간 데이터 확인...');
  allHospitals.forEach(h => {
    if (!h.opening_hours) {
      issues.invalidOpeningHours.push({
        id: h.id,
        name: h.name,
        reason: '운영시간 없음'
      });
    } else {
      try {
        const hours = JSON.parse(h.opening_hours);
        if (!hours.weekday || !hours.saturday || !hours.sunday) {
          issues.invalidOpeningHours.push({
            id: h.id,
            name: h.name,
            reason: '요일별 시간 불완전'
          });
        }
      } catch (e) {
        issues.invalidOpeningHours.push({
          id: h.id,
          name: h.name,
          reason: 'JSON 파싱 오류'
        });
      }
    }
  });
  console.log(`   ${issues.invalidOpeningHours.length > 0 ? '⚠️' : '✅'} 운영시간 문제: ${issues.invalidOpeningHours.length}건\n`);

  // 논리적 오류 검사
  console.log('6️⃣  논리적 오류 확인...');
  allHospitals.forEach(h => {
    // 24시간이면 운영시간도 24시간이어야 함
    if (h.open_24_hours && h.opening_hours) {
      try {
        const hours = JSON.parse(h.opening_hours);
        if (hours.weekday?.open !== '00:00' || hours.weekday?.close !== '23:59') {
          issues.logicErrors.push({
            id: h.id,
            name: h.name,
            error: '24시간 운영이지만 운영시간이 일치하지 않음'
          });
        }
      } catch (e) {}
    }

    // 주말 진료인데 일요일이 closed면 오류
    if (h.weekend_available && h.opening_hours) {
      try {
        const hours = JSON.parse(h.opening_hours);
        if (hours.saturday === 'closed' && hours.sunday === 'closed') {
          issues.logicErrors.push({
            id: h.id,
            name: h.name,
            error: '주말 진료 가능인데 토/일 모두 휴무'
          });
        }
      } catch (e) {}
    }

    // 치과가 type이 '의원'이면 문제
    const specialties = h.specialties || [];
    if (specialties.includes('치과') && h.type === '의원') {
      // 이건 괜찮음 (치과의원)
    }
    if (h.type === '치과' && !specialties.some(s => s.includes('치과'))) {
      issues.logicErrors.push({
        id: h.id,
        name: h.name,
        error: '타입은 치과인데 전문과목에 치과가 없음'
      });
    }
  });
  console.log(`   ${issues.logicErrors.length > 0 ? '⚠️' : '✅'} 논리 오류: ${issues.logicErrors.length}건\n`);

  // 이미지 검사
  console.log('7️⃣  이미지 데이터 확인...');
  allHospitals.forEach(h => {
    if (!h.image_url) {
      issues.imageIssues.push({
        id: h.id,
        name: h.name,
        issue: '대표 이미지 없음'
      });
    } else if (h.image_url.includes('placeholder')) {
      issues.imageIssues.push({
        id: h.id,
        name: h.name,
        issue: 'Placeholder 이미지 사용 중'
      });
    }

    if (!h.image_urls || h.image_urls.length === 0) {
      issues.imageIssues.push({
        id: h.id,
        name: h.name,
        issue: '배너 이미지 배열 없음'
      });
    } else if (h.image_urls.some(url => url.includes('placeholder'))) {
      issues.imageIssues.push({
        id: h.id,
        name: h.name,
        issue: '배너에 Placeholder 포함'
      });
    }

    if (!h.naver_map_image) {
      issues.imageIssues.push({
        id: h.id,
        name: h.name,
        issue: '지도 링크 없음'
      });
    }
  });
  console.log(`   ${issues.imageIssues.length > 0 ? '⚠️' : '✅'} 이미지 문제: ${issues.imageIssues.length}건\n`);

  // 최종 리포트
  console.log('='.repeat(80));
  console.log('📋 검수 결과 요약');
  console.log('='.repeat(80));

  const totalIssues = Object.values(issues).reduce((sum, arr) => sum + arr.length, 0);

  if (totalIssues === 0) {
    console.log('\n🎉 완벽합니다! 모든 데이터가 정상입니다.\n');
  } else {
    console.log(`\n⚠️  총 ${totalIssues}개의 문제가 발견되었습니다.\n`);

    if (issues.duplicates.length > 0) {
      console.log(`❌ 중복 데이터 (${issues.duplicates.length}건):`);
      issues.duplicates.forEach(d => {
        console.log(`   - ${d.name} (ID: ${d.ids.join(', ')})`);
      });
      console.log('');
    }

    if (issues.missingFields.length > 0) {
      console.log(`❌ 필수 필드 누락 (${issues.missingFields.length}건):`);
      issues.missingFields.slice(0, 10).forEach(m => {
        console.log(`   - ${m.name} (ID: ${m.id}): ${m.missing.join(', ')} 누락`);
      });
      if (issues.missingFields.length > 10) {
        console.log(`   ... 외 ${issues.missingFields.length - 10}건`);
      }
      console.log('');
    }

    if (issues.invalidPhone.length > 0) {
      console.log(`❌ 잘못된 전화번호 형식 (${issues.invalidPhone.length}건):`);
      issues.invalidPhone.slice(0, 10).forEach(p => {
        console.log(`   - ${p.name}: ${p.phone}`);
      });
      if (issues.invalidPhone.length > 10) {
        console.log(`   ... 외 ${issues.invalidPhone.length - 10}건`);
      }
      console.log('');
    }

    if (issues.invalidCoordinates.length > 0) {
      console.log(`❌ 좌표 문제 (${issues.invalidCoordinates.length}건):`);
      issues.invalidCoordinates.slice(0, 10).forEach(c => {
        console.log(`   - ${c.name}: ${c.reason}${c.lat ? ` (${c.lat}, ${c.lng})` : ''}`);
      });
      if (issues.invalidCoordinates.length > 10) {
        console.log(`   ... 외 ${issues.invalidCoordinates.length - 10}건`);
      }
      console.log('');
    }

    if (issues.invalidOpeningHours.length > 0) {
      console.log(`❌ 운영시간 문제 (${issues.invalidOpeningHours.length}건):`);
      issues.invalidOpeningHours.slice(0, 10).forEach(o => {
        console.log(`   - ${o.name}: ${o.reason}`);
      });
      if (issues.invalidOpeningHours.length > 10) {
        console.log(`   ... 외 ${issues.invalidOpeningHours.length - 10}건`);
      }
      console.log('');
    }

    if (issues.logicErrors.length > 0) {
      console.log(`❌ 논리적 오류 (${issues.logicErrors.length}건):`);
      issues.logicErrors.forEach(e => {
        console.log(`   - ${e.name}: ${e.error}`);
      });
      console.log('');
    }

    if (issues.imageIssues.length > 0) {
      console.log(`❌ 이미지 문제 (${issues.imageIssues.length}건):`);
      issues.imageIssues.slice(0, 10).forEach(i => {
        console.log(`   - ${i.name}: ${i.issue}`);
      });
      if (issues.imageIssues.length > 10) {
        console.log(`   ... 외 ${issues.imageIssues.length - 10}건`);
      }
      console.log('');
    }
  }

  // 통계
  console.log('='.repeat(80));
  console.log('📊 전체 통계');
  console.log('='.repeat(80));
  console.log(`총 의료기관: ${allHospitals.length}개`);
  console.log(`오류율: ${((totalIssues / allHospitals.length) * 100).toFixed(2)}%`);
  console.log(`정상 데이터: ${allHospitals.length - totalIssues}개 (${(((allHospitals.length - totalIssues) / allHospitals.length) * 100).toFixed(2)}%)`);
  console.log('='.repeat(80));

  console.log('\n✅ 데이터 검수 완료!\n');

  return issues;
}

// 스크립트 실행
auditAllData();
