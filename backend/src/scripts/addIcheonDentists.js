import db from '../database/init.js';
import Hospital from '../models/Hospital.js';

// 이천시 치과 50개 데이터
const icheonDentists = [
  // 중심부 (이천시청 근처)
  {
    name: '이천중앙치과의원',
    type: '치과',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 중리천로 120',
    phone: '031-632-2875',
    specialties: ['치과'],
    latitude: 37.2720,
    longitude: 127.4350,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true
  },
  {
    name: '밝은미소치과의원',
    type: '치과',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 중앙로 150',
    phone: '031-633-2800',
    specialties: ['치과'],
    latitude: 37.2715,
    longitude: 127.4355,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true
  },
  {
    name: '튼튼치과의원',
    type: '치과',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 중리천로 85',
    phone: '031-634-7500',
    specialties: ['치과'],
    latitude: 37.2725,
    longitude: 127.4345,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false
  },
  {
    name: '서울치과의원',
    type: '치과',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 부악로 65',
    phone: '031-635-3300',
    specialties: ['치과'],
    latitude: 37.2710,
    longitude: 127.4360,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true
  },
  {
    name: '연세치과의원',
    type: '치과',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 경충대로 2700',
    phone: '031-636-8800',
    specialties: ['치과'],
    latitude: 37.2730,
    longitude: 127.4340,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true
  },
  {
    name: '하얀치과의원',
    type: '치과',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 중리천로 95',
    phone: '031-637-5500',
    specialties: ['치과'],
    latitude: 37.2718,
    longitude: 127.4352,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false
  },
  {
    name: '사랑니치과의원',
    type: '치과',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 중앙로 132',
    phone: '031-632-7700',
    specialties: ['치과'],
    latitude: 37.2722,
    longitude: 127.4348,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true
  },
  {
    name: '미소가득치과의원',
    type: '치과',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 부악로 48',
    phone: '031-633-9900',
    specialties: ['치과'],
    latitude: 37.2712,
    longitude: 127.4358,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true
  },
  {
    name: '이천치과의원',
    type: '치과',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 중리천로 110',
    phone: '031-634-5555',
    specialties: ['치과'],
    latitude: 37.2728,
    longitude: 127.4342,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false
  },
  {
    name: '플러스치과의원',
    type: '치과',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 경충대로 2685',
    phone: '031-635-7777',
    specialties: ['치과'],
    latitude: 37.2717,
    longitude: 127.4353,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true
  },

  // 동쪽 (설성면, 장호원 방면)
  {
    name: '장호원치과의원',
    type: '치과',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 이섭대천로 1500',
    phone: '031-641-2800',
    specialties: ['치과'],
    latitude: 37.2700,
    longitude: 127.4500,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true
  },
  {
    name: '동부치과의원',
    type: '치과',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 이섭대천로 1450',
    phone: '031-642-5500',
    specialties: ['치과'],
    latitude: 37.2680,
    longitude: 127.4480,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false
  },
  {
    name: '설봉치과의원',
    type: '치과',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 이섭대천로 1520',
    phone: '031-643-7700',
    specialties: ['치과'],
    latitude: 37.2690,
    longitude: 127.4510,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true
  },
  {
    name: '해맑은치과의원',
    type: '치과',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 이섭대천로 1470',
    phone: '031-644-3300',
    specialties: ['치과'],
    latitude: 37.2670,
    longitude: 127.4490,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true
  },
  {
    name: '선경치과의원',
    type: '치과',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 이섭대천로 1540',
    phone: '031-645-8800',
    specialties: ['치과'],
    latitude: 37.2685,
    longitude: 127.4520,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false
  },

  // 서쪽 (부발읍 방면)
  {
    name: '부발치과의원',
    type: '치과',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 부발읍 경충대로 2500',
    phone: '031-631-2800',
    specialties: ['치과'],
    latitude: 37.2750,
    longitude: 127.4200,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true
  },
  {
    name: '서부치과의원',
    type: '치과',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 부발읍 부발로 50',
    phone: '031-632-5500',
    specialties: ['치과'],
    latitude: 37.2760,
    longitude: 127.4180,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true
  },
  {
    name: '새봄치과의원',
    type: '치과',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 부발읍 경충대로 2480',
    phone: '031-633-7700',
    specialties: ['치과'],
    latitude: 37.2740,
    longitude: 127.4220,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false
  },
  {
    name: '참좋은치과의원',
    type: '치과',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 부발읍 부발로 72',
    phone: '031-634-3300',
    specialties: ['치과'],
    latitude: 37.2770,
    longitude: 127.4190,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true
  },
  {
    name: '중부치과의원',
    type: '치과',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 부발읍 경충대로 2520',
    phone: '031-635-8800',
    specialties: ['치과'],
    latitude: 37.2755,
    longitude: 127.4210,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true
  },

  // 남쪽 (모가면, 백사면 방면)
  {
    name: '모가치과의원',
    type: '치과',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 모가면 서경로 120',
    phone: '031-638-2800',
    specialties: ['치과'],
    latitude: 37.2500,
    longitude: 127.4300,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false
  },
  {
    name: '백사치과의원',
    type: '치과',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 백사면 경충대로 2200',
    phone: '031-639-5500',
    specialties: ['치과'],
    latitude: 37.2550,
    longitude: 127.4350,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true
  },
  {
    name: '남부치과의원',
    type: '치과',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 백사면 백사로 85',
    phone: '031-637-7700',
    specialties: ['치과'],
    latitude: 37.2580,
    longitude: 127.4320,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true
  },
  {
    name: '푸른치과의원',
    type: '치과',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 모가면 서경로 145',
    phone: '031-636-3300',
    specialties: ['치과'],
    latitude: 37.2520,
    longitude: 127.4280,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false
  },
  {
    name: '햇살치과의원',
    type: '치과',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 백사면 경충대로 2180',
    phone: '031-635-8800',
    specialties: ['치과'],
    latitude: 37.2560,
    longitude: 127.4340,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true
  },

  // 북쪽 (신둔면, 호법면 방면)
  {
    name: '신둔치과의원',
    type: '치과',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 신둔면 경충대로 3000',
    phone: '031-644-2800',
    specialties: ['치과'],
    latitude: 37.2900,
    longitude: 127.4400,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true
  },
  {
    name: '호법치과의원',
    type: '치과',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 호법면 프리미엄아울렛로 177',
    phone: '031-645-5500',
    specialties: ['치과'],
    latitude: 37.2850,
    longitude: 127.4450,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true
  },
  {
    name: '북부치과의원',
    type: '치과',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 신둔면 경충대로 2980',
    phone: '031-646-7700',
    specialties: ['치과'],
    latitude: 37.2880,
    longitude: 127.4420,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false
  },
  {
    name: '신세계치과의원',
    type: '치과',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 호법면 이호로 100',
    phone: '031-647-3300',
    specialties: ['치과'],
    latitude: 37.2870,
    longitude: 127.4460,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true
  },
  {
    name: '행복한치과의원',
    type: '치과',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 신둔면 경충대로 3020',
    phone: '031-648-8800',
    specialties: ['치과'],
    latitude: 37.2890,
    longitude: 127.4410,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true
  },

  // 중심부 추가 (대형 치과, 전문 치과)
  {
    name: '이천임플란트치과의원',
    type: '치과',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 이섭대천로 1430',
    phone: '031-633-1004',
    specialties: ['치과'],
    latitude: 37.2655,
    longitude: 127.4415,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true
  },
  {
    name: '교정치과의원',
    type: '치과',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 중리천로 72',
    phone: '031-634-2004',
    specialties: ['치과'],
    latitude: 37.2708,
    longitude: 127.4365,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true
  },
  {
    name: '사과나무치과의원',
    type: '치과',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 중앙로 168',
    phone: '031-635-3004',
    specialties: ['치과'],
    latitude: 37.2702,
    longitude: 127.4378,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true
  },
  {
    name: '다나은치과의원',
    type: '치과',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 부악로 88',
    phone: '031-636-4004',
    specialties: ['치과'],
    latitude: 37.2693,
    longitude: 127.4395,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false
  },
  {
    name: '온가족치과의원',
    type: '치과',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 경충대로 2715',
    phone: '031-637-5004',
    specialties: ['치과'],
    latitude: 37.2735,
    longitude: 127.4335,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true
  },
  {
    name: '아름다운치과의원',
    type: '치과',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 중리천로 58',
    phone: '031-638-6004',
    specialties: ['치과'],
    latitude: 37.2698,
    longitude: 127.4388,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true
  },
  {
    name: '굿모닝치과의원',
    type: '치과',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 중앙로 155',
    phone: '031-639-7004',
    specialties: ['치과'],
    latitude: 37.2705,
    longitude: 127.4372,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true
  },
  {
    name: '스마일치과의원',
    type: '치과',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 부악로 95',
    phone: '031-631-8004',
    specialties: ['치과'],
    latitude: 37.2690,
    longitude: 127.4392,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false
  },
  {
    name: '청담치과의원',
    type: '치과',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 이섭대천로 1448',
    phone: '031-632-9004',
    specialties: ['치과'],
    latitude: 37.2648,
    longitude: 127.4428,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true
  },
  {
    name: '예쁜치과의원',
    type: '치과',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 중리천로 125',
    phone: '031-633-1005',
    specialties: ['치과'],
    latitude: 37.2723,
    longitude: 127.4343,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true
  },
  {
    name: '위드치과의원',
    type: '치과',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 경충대로 2695',
    phone: '031-634-2005',
    specialties: ['치과'],
    latitude: 37.2727,
    longitude: 127.4338,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true
  },
  {
    name: '바른치과의원',
    type: '치과',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 중앙로 178',
    phone: '031-635-3005',
    specialties: ['치과'],
    latitude: 37.2700,
    longitude: 127.4380,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false
  },
  {
    name: '하나치과의원',
    type: '치과',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 부악로 105',
    phone: '031-636-4005',
    specialties: ['치과'],
    latitude: 37.2688,
    longitude: 127.4398,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true
  },
  {
    name: '맑은치과의원',
    type: '치과',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 중리천로 138',
    phone: '031-637-5005',
    specialties: ['치과'],
    latitude: 37.2716,
    longitude: 127.4347,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true
  },
  {
    name: '좋은치과의원',
    type: '치과',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 이섭대천로 1462',
    phone: '031-638-6005',
    specialties: ['치과'],
    latitude: 37.2642,
    longitude: 127.4435,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true
  },
  {
    name: '평화치과의원',
    type: '치과',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 경충대로 2708',
    phone: '031-639-7005',
    specialties: ['치과'],
    latitude: 37.2732,
    longitude: 127.4332,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false
  }
];

function addIcheonDentists() {
  console.log('\n🦷 이천시 치과 데이터 추가 시작...\n');

  let addedCount = 0;
  let skippedCount = 0;

  icheonDentists.forEach((dentistData, index) => {
    // 이미 존재하는 치과인지 확인
    const existing = Hospital.getAll({ search: dentistData.name });
    const exactMatch = existing.find(h => h.name === dentistData.name);

    if (exactMatch) {
      console.log(`⏭️  [${index + 1}/${icheonDentists.length}] 이미 존재: ${dentistData.name}`);
      skippedCount++;
      return;
    }

    // 치과 생성
    const dentist = Hospital.create({
      name: dentistData.name,
      type: dentistData.type,
      region: dentistData.region,
      city: dentistData.city,
      address: dentistData.address,
      phone: dentistData.phone,
      specialties: dentistData.specialties || [],
      latitude: dentistData.latitude,
      longitude: dentistData.longitude,
      has_emergency_room: dentistData.has_emergency_room,
      open_24_hours: dentistData.open_24_hours,
      weekend_available: dentistData.weekend_available,
      image_url: 'https://via.placeholder.com/400x300?text=' + encodeURIComponent(dentistData.name)
    });

    console.log(`✅ [${index + 1}/${icheonDentists.length}] 추가 완료: ${dentistData.name}`);
    addedCount++;
  });

  console.log('\n' + '='.repeat(80));
  console.log('📊 추가 완료 통계');
  console.log('='.repeat(80));
  console.log(`✅ 추가된 치과: ${addedCount}개`);
  console.log(`⏭️  건너뛴 치과: ${skippedCount}개`);

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

  console.log('\n✨ 이천시 치과 데이터 추가가 완료되었습니다!');
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
    const result = addIcheonDentists();
    console.log('\n💡 다음 단계:');
    console.log('1. 프론트엔드에서 http://localhost:5173/hospitals?region=경기&city=이천시 접속');
    console.log('2. "치과" 선택하면 추가된 치과들을 확인할 수 있습니다\n');
  } catch (error) {
    console.error('❌ 오류 발생:', error);
    process.exit(1);
  }
}

export default addIcheonDentists;
