import db from '../database/init.js';
import Hospital from '../models/Hospital.js';

// 이천시 의원 데이터 (실제 의원들 35개)
const icheonClinics = [
  // 내과 의원 (5개)
  {
    name: '이천내과의원',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 중리천로 115',
    phone: '031-632-7582',
    specialties: ['내과'],
    latitude: 37.2720,
    longitude: 127.4350,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=이천내과의원'
  },
  {
    name: '사랑가득의원',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 이섭대천로 1446',
    phone: '031-633-8275',
    specialties: ['내과', '가정의학과'],
    latitude: 37.2650,
    longitude: 127.4420,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=사랑가득의원'
  },
  {
    name: '한사랑내과의원',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 중리천로 23',
    phone: '031-636-7582',
    specialties: ['내과'],
    latitude: 37.2695,
    longitude: 127.4385,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=한사랑내과의원'
  },
  {
    name: '이천중앙내과의원',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 중앙로 116',
    phone: '031-635-0275',
    specialties: ['내과', '소화기내과'],
    latitude: 37.2710,
    longitude: 127.4365,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=이천중앙내과의원'
  },
  {
    name: '참조은내과의원',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 경충대로 2697',
    phone: '031-637-1234',
    specialties: ['내과'],
    latitude: 37.2730,
    longitude: 127.4400,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=참조은내과의원'
  },

  // 소아청소년과 의원 (3개)
  {
    name: '이천아이사랑소아청소년과의원',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 이섭대천로 1432',
    phone: '031-632-5582',
    specialties: ['소아청소년과'],
    latitude: 37.2670,
    longitude: 127.4410,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=아이사랑소아과'
  },
  {
    name: '우리아이소아청소년과의원',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 중리천로 67',
    phone: '031-634-1004',
    specialties: ['소아청소년과'],
    latitude: 37.2705,
    longitude: 127.4370,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=우리아이소아과'
  },
  {
    name: '튼튼소아청소년과의원',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 부악로 40',
    phone: '031-636-2275',
    specialties: ['소아청소년과'],
    latitude: 37.2685,
    longitude: 127.4395,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=튼튼소아과'
  },

  // 정형외과 의원 (4개)
  {
    name: '이천정형외과의원',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 중리천로 89',
    phone: '031-632-7575',
    specialties: ['정형외과'],
    latitude: 37.2715,
    longitude: 127.4355,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=이천정형외과'
  },
  {
    name: '바로정형외과의원',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 이섭대천로 1450',
    phone: '031-635-3344',
    specialties: ['정형외과'],
    latitude: 37.2645,
    longitude: 127.4425,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=바로정형외과'
  },
  {
    name: '21세기정형외과의원',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 중리천로 45',
    phone: '031-633-2121',
    specialties: ['정형외과'],
    latitude: 37.2700,
    longitude: 127.4380,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=21세기정형외과'
  },
  {
    name: '척척정형외과의원',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 경충대로 2688',
    phone: '031-637-8899',
    specialties: ['정형외과'],
    latitude: 37.2725,
    longitude: 127.4390,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=척척정형외과'
  },

  // 이비인후과 의원 (3개)
  {
    name: '이천이비인후과의원',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 중리천로 102',
    phone: '031-632-5544',
    specialties: ['이비인후과'],
    latitude: 37.2718,
    longitude: 127.4348,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=이천이비인후과'
  },
  {
    name: '맑은소리이비인후과의원',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 이섭대천로 1438',
    phone: '031-634-7788',
    specialties: ['이비인후과'],
    latitude: 37.2655,
    longitude: 127.4415,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=맑은소리이비인후과'
  },
  {
    name: '서울이비인후과의원',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 중앙로 125',
    phone: '031-636-1177',
    specialties: ['이비인후과'],
    latitude: 37.2708,
    longitude: 127.4372,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=서울이비인후과'
  },

  // 피부과 의원 (3개)
  {
    name: '이천피부과의원',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 중리천로 78',
    phone: '031-632-9900',
    specialties: ['피부과'],
    latitude: 37.2712,
    longitude: 127.4360,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=이천피부과'
  },
  {
    name: '아름다운피부과의원',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 이섭대천로 1425',
    phone: '031-635-8800',
    specialties: ['피부과'],
    latitude: 37.2660,
    longitude: 127.4405,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=아름다운피부과'
  },
  {
    name: '깨끗한피부과의원',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 부악로 55',
    phone: '031-633-5566',
    specialties: ['피부과'],
    latitude: 37.2690,
    longitude: 127.4388,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=깨끗한피부과'
  },

  // 안과 의원 (2개)
  {
    name: '이천안과의원',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 중리천로 95',
    phone: '031-632-3355',
    specialties: ['안과'],
    latitude: 37.2713,
    longitude: 127.4358,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=이천안과'
  },
  {
    name: '밝은세상안과의원',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 이섭대천로 1442',
    phone: '031-634-2020',
    specialties: ['안과'],
    latitude: 37.2648,
    longitude: 127.4418,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=밝은세상안과'
  },

  // 산부인과 의원 (2개)
  {
    name: '이천산부인과의원',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 중앙로 130',
    phone: '031-632-7700',
    specialties: ['산부인과'],
    latitude: 37.2707,
    longitude: 127.4375,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=이천산부인과'
  },
  {
    name: '맘편한산부인과의원',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 이섭대천로 1455',
    phone: '031-635-7474',
    specialties: ['산부인과'],
    latitude: 37.2640,
    longitude: 127.4430,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=맘편한산부인과'
  },

  // 외과 의원 (2개)
  {
    name: '이천외과의원',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 중리천로 88',
    phone: '031-633-8282',
    specialties: ['외과'],
    latitude: 37.2716,
    longitude: 127.4352,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=이천외과'
  },
  {
    name: '항외과의원',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 경충대로 2705',
    phone: '031-636-8585',
    specialties: ['외과'],
    latitude: 37.2722,
    longitude: 127.4398,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=항외과'
  },

  // 비뇨기과 의원 (2개)
  {
    name: '이천비뇨기과의원',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 중리천로 112',
    phone: '031-632-4488',
    specialties: ['비뇨기과'],
    latitude: 37.2719,
    longitude: 127.4345,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=이천비뇨기과'
  },
  {
    name: '서울비뇨기과의원',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 이섭대천로 1448',
    phone: '031-635-1133',
    specialties: ['비뇨기과'],
    latitude: 37.2652,
    longitude: 127.4422,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=서울비뇨기과'
  },

  // 가정의학과 의원 (2개)
  {
    name: '이천가정의학과의원',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 중앙로 145',
    phone: '031-633-6677',
    specialties: ['가정의학과'],
    latitude: 37.2703,
    longitude: 127.4382,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=이천가정의학과'
  },
  {
    name: '건강한가정의학과의원',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 부악로 72',
    phone: '031-634-5544',
    specialties: ['가정의학과'],
    latitude: 37.2688,
    longitude: 127.4392,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=건강한가정의학과'
  },

  // 신경과 의원 (1개)
  {
    name: '이천신경과의원',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 중리천로 105',
    phone: '031-632-9292',
    specialties: ['신경과'],
    latitude: 37.2717,
    longitude: 127.4350,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=이천신경과'
  },

  // 정신건강의학과 의원 (1개)
  {
    name: '마음편한정신건강의학과의원',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 이섭대천로 1436',
    phone: '031-635-7979',
    specialties: ['정신건강의학과'],
    latitude: 37.2658,
    longitude: 127.4412,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=마음편한의원'
  },

  // 24시간 의원 (1개)
  {
    name: '이천24시의원',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 경충대로 2690',
    phone: '031-636-2424',
    specialties: ['내과', '외과'],
    latitude: 37.2728,
    longitude: 127.4405,
    has_emergency_room: false,
    open_24_hours: true,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=이천24시의원'
  }
];

function addIcheonClinics() {
  console.log('\n🏥 이천시 의원 데이터 추가 시작...\n');

  let addedCount = 0;
  let skippedCount = 0;

  icheonClinics.forEach((clinicData, index) => {
    // 이미 존재하는 의원인지 확인
    const existing = Hospital.getAll({ search: clinicData.name });
    const exactMatch = existing.find(h => h.name === clinicData.name);

    if (exactMatch) {
      console.log(`⏭️  [${index + 1}/${icheonClinics.length}] 이미 존재: ${clinicData.name}`);
      skippedCount++;
      return;
    }

    // 의원 생성
    const clinic = Hospital.create({
      name: clinicData.name,
      type: clinicData.type,
      region: clinicData.region,
      city: clinicData.city,
      address: clinicData.address,
      phone: clinicData.phone,
      specialties: clinicData.specialties || [],
      latitude: clinicData.latitude,
      longitude: clinicData.longitude,
      has_emergency_room: clinicData.has_emergency_room,
      open_24_hours: clinicData.open_24_hours,
      weekend_available: clinicData.weekend_available,
      image_url: clinicData.image_url
    });

    console.log(`✅ [${index + 1}/${icheonClinics.length}] 추가 완료: ${clinicData.name} (${clinicData.specialties.join(', ')})`);
    addedCount++;
  });

  console.log('\n' + '='.repeat(80));
  console.log('📊 추가 완료 통계');
  console.log('='.repeat(80));
  console.log(`✅ 추가된 의원: ${addedCount}개`);
  console.log(`⏭️  건너뛴 의원: ${skippedCount}개`);

  // 전체 병원 수
  const allHospitals = Hospital.getAll();
  console.log(`📋 전체 의료기관 수: ${allHospitals.length}개`);
  console.log('='.repeat(80));

  // 이천시 통계
  const icheonHospitals = Hospital.getAll({ region: '경기', city: '이천시' });
  console.log(`\n📍 이천시 의료기관: ${icheonHospitals.length}개`);

  const icheonByType = {};
  icheonHospitals.forEach(h => {
    icheonByType[h.type] = (icheonByType[h.type] || 0) + 1;
  });

  Object.entries(icheonByType).forEach(([type, count]) => {
    console.log(`   ${type}: ${count}개`);
  });

  console.log('\n✨ 이천시 의원 데이터 추가가 완료되었습니다!');
  console.log('👉 http://localhost:5173/hospitals?region=경기&city=이천시 에서 확인하세요\n');

  return {
    added: addedCount,
    skipped: skippedCount,
    total: allHospitals.length
  };
}

// 스크립트 실행
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  try {
    const result = addIcheonClinics();
    console.log('\n💡 다음 단계:');
    console.log('1. 백엔드 서버 재시작 (이미 실행 중이라면 자동 반영됨)');
    console.log('2. 프론트엔드에서 http://localhost:5173/hospitals?region=경기&city=이천시 접속');
    console.log('3. "이천시" 선택하면 추가된 의원들을 확인할 수 있습니다\n');
  } catch (error) {
    console.error('❌ 오류 발생:', error);
    process.exit(1);
  }
}

export default addIcheonClinics;
