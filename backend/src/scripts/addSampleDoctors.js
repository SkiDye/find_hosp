/**
 * 샘플 의사 데이터 자동 생성 스크립트
 * 주의: 모든 의사 정보는 가상 데이터입니다
 */

import database from '../database/init.js';

// 가상의 한국 성씨
const lastNames = ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임', '오', '한', '신', '서', '권', '황', '안', '송', '홍', '전'];

// 가상의 한국 이름 (두 글자)
const firstNames = [
  '민준', '서준', '예준', '도윤', '시우', '주원', '하준', '지호', '준서', '건우',
  '서연', '민서', '지우', '서현', '수빈', '지민', '예은', '하은', '윤서', '채원',
  '현우', '동현', '지훈', '성민', '재현', '승현', '태양', '민재', '영호', '상우',
  '수진', '지영', '은정', '민지', '혜진', '미영', '정현', '수연', '영미', '은희'
];

// 의료 전문과목
const specialties = [
  '내과', '외과', '소아청소년과', '산부인과', '정형외과',
  '신경외과', '정신건강의학과', '안과', '이비인후과', '피부과',
  '비뇨의학과', '영상의학과', '재활의학과', '가정의학과', '응급의학과',
  '마취통증의학과', '흉부외과', '성형외과', '신경과', '치과'
];

// 세부 전공 (전문과별)
const subSpecialties = {
  '내과': ['순환기내과', '소화기내과', '호흡기내과', '내분비내과', '신장내과', '혈액종양내과', '감염내과', '알레르기내과'],
  '외과': ['간담췌외과', '위장관외과', '대장항문외과', '유방외과', '갑상선외과', '혈관외과'],
  '정형외과': ['척추', '관절', '수부', '족부', '외상', '소아정형'],
  '산부인과': ['산과', '부인과', '생식의학', '부인종양'],
  '소아청소년과': ['신생아', '호흡기알레르기', '소화기영양', '신장', '혈액종양', '감염'],
  '신경외과': ['척추', '뇌혈관', '뇌종양', '소아신경외과', '기능'],
  '정신건강의학과': ['성인정신건강', '소아청소년정신건강', '노인정신건강', '중독'],
  '안과': ['망막', '녹내장', '각막', '백내장', '소아안과', '성형안과'],
  '이비인후과': ['두경부종양', '비과', '이과', '후두음성', '소아이비인후과'],
  '피부과': ['피부종양', '피부미용', '모발', '건선', '알레르기'],
  '비뇨의학과': ['종양', '배뇨장애', '요로결석', '소아비뇨', '남성의학'],
  '영상의학과': ['신경영상', '근골격영상', '복부영상', '흉부영상', '중재적영상'],
  '재활의학과': ['뇌신경재활', '척추재활', '근골격재활', '소아재활', '스포츠재활'],
  '가정의학과': ['노인의학', '스포츠의학', '비만의학', '만성질환관리'],
  '응급의학과': ['외상', '독성', '응급심혈관', '응급소생'],
  '마취통증의학과': ['통증', '심혈관마취', '소아마취', '신경마취'],
  '흉부외과': ['심장', '폐', '식도', '종격동'],
  '성형외과': ['미용', '재건', '수부', '화상'],
  '신경과': ['뇌졸중', '치매', '두통', '간질', '운동질환', '말초신경'],
  '치과': ['보존', '보철', '구강외과', '교정', '소아치과', '치주']
};

// 대학교 목록 (의과대학)
const universities = [
  '서울대학교', '연세대학교', '고려대학교', '가톨릭대학교', '성균관대학교',
  '울산대학교', '한양대학교', '경희대학교', '이화여자대학교', '중앙대학교',
  '인제대학교', '가천대학교', '아주대학교', '단국대학교', '한림대학교',
  '건국대학교', '동국대학교', '원광대학교', '순천향대학교', '인하대학교'
];

/**
 * 랜덤 요소 선택
 */
function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * 가상의 의사 이름 생성
 */
function generateName() {
  return randomChoice(lastNames) + randomChoice(firstNames);
}

/**
 * 가상의 면허번호 생성
 */
function generateLicenseNumber() {
  const year = 2000 + Math.floor(Math.random() * 25); // 2000-2024
  const number = Math.floor(Math.random() * 9999) + 1;
  return `D${year}-${String(number).padStart(4, '0')}`;
}

/**
 * 프로필 사진 URL 생성 (UI Avatars API)
 */
function generatePhotoUrl(name) {
  // UI Avatars API - 이름 기반 아바타 자동 생성
  const encodedName = encodeURIComponent(name);
  const colors = ['4F46E5', '0EA5E9', '10B981', 'F59E0B', 'EF4444', '8B5CF6', 'EC4899'];
  const bgColor = randomChoice(colors);
  return `https://ui-avatars.com/api/?name=${encodedName}&background=${bgColor}&color=fff&size=200&font-size=0.5&bold=true`;
}

/**
 * 경력 연수 생성
 */
function generateYearsOfExperience() {
  return Math.floor(Math.random() * 25) + 3; // 3-27년
}

/**
 * 학력 정보 생성
 */
function generateEducation(specialty) {
  const university = randomChoice(universities);
  const graduationYear = 2025 - Math.floor(Math.random() * 25) - 6; // 최근 31년 내
  const residencyYear = graduationYear + 4;
  const fellowshipYear = residencyYear + 4;

  return [
    {
      degree: '의학사',
      institution: `${university} 의과대학`,
      year: graduationYear,
      field: '의학'
    },
    {
      degree: '전문의',
      institution: `${university}병원 ${specialty}`,
      year: residencyYear,
      field: specialty
    },
    ...(Math.random() > 0.5 ? [{
      degree: '세부전문의',
      institution: `${randomChoice(universities)}병원`,
      year: fellowshipYear,
      field: subSpecialties[specialty] ? randomChoice(subSpecialties[specialty]) : specialty
    }] : [])
  ];
}

/**
 * 경력 정보 생성
 */
function generateCareer(hospitalName, specialty, yearsOfExperience) {
  const currentYear = 2025;
  const startYear = currentYear - yearsOfExperience;

  const careers = [
    {
      hospital: hospitalName,
      department: specialty,
      position: yearsOfExperience > 15 ? '과장' : yearsOfExperience > 10 ? '교수' : yearsOfExperience > 5 ? '전문의' : '전공의',
      start_date: `${startYear}-03-01`,
      end_date: null,
      is_current: true
    }
  ];

  // 이전 경력 추가 (50% 확률)
  if (Math.random() > 0.5 && yearsOfExperience > 5) {
    const prevHospital = randomChoice(universities) + '병원';
    const prevYears = Math.floor(Math.random() * 5) + 2;
    careers.unshift({
      hospital: prevHospital,
      department: specialty,
      position: '전문의',
      start_date: `${startYear - prevYears}-03-01`,
      end_date: `${startYear}-02-28`,
      is_current: false
    });
  }

  return careers;
}

/**
 * 병원별 의사 생성
 */
function generateDoctorsForHospital(hospital, count = 5) {
  const doctors = [];

  for (let i = 0; i < count; i++) {
    const name = generateName();
    const specialty = randomChoice(specialties);
    const subSpecialtyOptions = subSpecialties[specialty];
    const sub_specialty = subSpecialtyOptions ? randomChoice(subSpecialtyOptions) : null;
    const yearsOfExperience = generateYearsOfExperience();

    const doctor = {
      name,
      specialty,
      sub_specialty,
      license_number: generateLicenseNumber(),
      hospital_id: hospital.id,
      phone: hospital.phone, // 병원 대표번호 사용
      email: null, // 개인 이메일은 수집하지 않음
      photo_url: generatePhotoUrl(name),
      years_of_experience: yearsOfExperience,
      education: generateEducation(specialty),
      career: generateCareer(hospital.name, specialty, yearsOfExperience),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    doctors.push(doctor);
  }

  return doctors;
}

/**
 * 모든 병원에 의사 추가
 */
function addSampleDoctors() {
  console.log('\n👨‍⚕️ 샘플 의사 데이터 생성 시작...\n');
  console.log('⚠️  주의: 모든 의사 정보는 가상 데이터입니다\n');

  let totalDoctorsAdded = 0;

  database.hospitals.forEach((hospital, index) => {
    // 병원 규모에 따라 의사 수 결정
    let doctorCount;
    if (hospital.type === '상급종합병원') {
      doctorCount = 10; // 상급종합병원: 10명
    } else if (hospital.type === '종합병원') {
      doctorCount = 5;  // 종합병원: 5명
    } else {
      doctorCount = 3;  // 일반 병원: 3명
    }

    const doctors = generateDoctorsForHospital(hospital, doctorCount);

    doctors.forEach(doctorData => {
      // 의사 ID 생성
      const doctorId = database._nextId.doctors++;

      // 의사 기본 정보 저장
      const doctor = {
        id: doctorId,
        name: doctorData.name,
        specialty: doctorData.specialty,
        sub_specialty: doctorData.sub_specialty,
        license_number: doctorData.license_number,
        hospital_id: doctorData.hospital_id,
        phone: doctorData.phone,
        email: doctorData.email,
        photo_url: doctorData.photo_url,
        years_of_experience: doctorData.years_of_experience,
        created_at: doctorData.created_at,
        updated_at: doctorData.updated_at
      };

      database.doctors.push(doctor);

      // 학력 정보 저장
      doctorData.education.forEach(edu => {
        const educationId = database._nextId.education++;
        database.education.push({
          id: educationId,
          doctor_id: doctorId,
          degree: edu.degree,
          institution: edu.institution,
          field: edu.field,
          graduation_year: edu.year
        });
      });

      // 경력 정보 저장
      doctorData.career.forEach(career => {
        const careerId = database._nextId.careers++;
        database.careers.push({
          id: careerId,
          doctor_id: doctorId,
          hospital: career.hospital,
          department: career.department,
          position: career.position,
          start_date: career.start_date,
          end_date: career.end_date,
          is_current: career.is_current
        });
      });

      totalDoctorsAdded++;
    });

    console.log(`✅ [${index + 1}/${database.hospitals.length}] ${hospital.name}: ${doctorCount}명의 의사 추가`);
  });

  console.log('\n' + '='.repeat(80));
  console.log('📊 의사 데이터 생성 완료');
  console.log('='.repeat(80));
  console.log(`👨‍⚕️ 총 의사 수: ${totalDoctorsAdded}명`);
  console.log(`📚 학력 정보: ${database.education.length}개`);
  console.log(`💼 경력 정보: ${database.careers.length}개`);
  console.log('='.repeat(80));

  console.log('\n💡 프로필 사진 정보:');
  console.log('   - UI Avatars API 사용 (https://ui-avatars.com)');
  console.log('   - 의사 이름 기반 자동 생성');
  console.log('   - 실시간 생성으로 별도 저장 불필요');
  console.log('\n⚠️  모든 의사 정보는 개인정보보호법 준수를 위한 가상 데이터입니다\n');

  return {
    totalDoctors: totalDoctorsAdded,
    totalEducation: database.education.length,
    totalCareer: database.careers.length
  };
}

// 스크립트 실행
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  try {
    const result = addSampleDoctors();

    console.log('💡 다음 단계:');
    console.log('1. 프론트엔드에서 의사 목록 확인: http://localhost:5173/doctors');
    console.log('2. 각 병원 상세 페이지에서 소속 의사 확인');
    console.log('3. 의사 상세 페이지에서 프로필 사진 및 경력 확인\n');
  } catch (error) {
    console.error('❌ 오류 발생:', error);
    process.exit(1);
  }
}

export default addSampleDoctors;
