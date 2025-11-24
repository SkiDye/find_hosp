import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { generateImageFallback } from '../utils/imageTemplates.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, '../../data/hospital-system.db');
const db = new Database(dbPath);

console.log('🎨 이천시 의원 상세정보 추가 중...\n');

// 진료과별 기본 운영시간
const OPERATING_HOURS = {
  '내과': {
    weekday: { open: '09:00', close: '18:00' },
    saturday: { open: '09:00', close: '13:00' },
    sunday: 'closed',
    lunch_break: { start: '12:30', end: '13:30' },
    note: '점심시간 진료 불가'
  },
  '정형외과': {
    weekday: { open: '09:00', close: '18:30' },
    saturday: { open: '09:00', close: '14:00' },
    sunday: 'closed',
    lunch_break: { start: '13:00', end: '14:00' },
    note: '물리치료 가능'
  },
  '소아청소년과': {
    weekday: { open: '09:00', close: '18:00' },
    saturday: { open: '09:00', close: '13:00' },
    sunday: 'closed',
    lunch_break: { start: '12:30', end: '14:00' },
    note: '예방접종 가능'
  },
  '이비인후과': {
    weekday: { open: '09:00', close: '18:00' },
    saturday: { open: '09:00', close: '13:00' },
    sunday: 'closed',
    lunch_break: { start: '12:30', end: '13:30' },
    note: null
  },
  '안과': {
    weekday: { open: '09:00', close: '18:00' },
    saturday: { open: '09:00', close: '13:00' },
    sunday: 'closed',
    lunch_break: { start: '12:30', end: '13:30' },
    note: null
  },
  '피부과': {
    weekday: { open: '09:00', close: '18:00' },
    saturday: { open: '09:00', close: '13:00' },
    sunday: 'closed',
    lunch_break: { start: '12:30', end: '13:30' },
    note: '레이저 시술 가능'
  },
  '산부인과': {
    weekday: { open: '09:00', close: '18:00' },
    saturday: { open: '09:00', close: '13:00' },
    sunday: 'closed',
    lunch_break: { start: '12:30', end: '13:30' },
    note: null
  },
  '치과': {
    weekday: { open: '09:00', close: '18:30' },
    saturday: { open: '09:00', close: '14:00' },
    sunday: 'closed',
    lunch_break: { start: '13:00', end: '14:00' },
    note: null
  },
  '가정의학과': {
    weekday: { open: '09:00', close: '18:00' },
    saturday: { open: '09:00', close: '13:00' },
    sunday: 'closed',
    lunch_break: { start: '12:30', end: '13:30' },
    note: '건강검진 가능'
  }
};

// 특수 케이스 (24시간 운영)
const SPECIAL_HOURS = {
  '이천365의원': {
    weekday: { open: '00:00', close: '23:59' },
    saturday: { open: '00:00', close: '23:59' },
    sunday: { open: '00:00', close: '23:59' },
    lunch_break: null,
    note: '24시간 진료'
  }
};

// 주말 진료 특수 케이스
const WEEKEND_HOURS = {
  '이천날개정형외과': {
    weekday: { open: '09:00', close: '18:30' },
    saturday: { open: '09:00', close: '14:00' },
    sunday: { open: '10:00', close: '13:00' },
    lunch_break: { start: '13:00', end: '14:00' },
    note: '일요일 진료 (오전만), 물리치료 가능'
  },
  '고봉진내과의원': {
    weekday: { open: '09:00', close: '18:00' },
    saturday: { open: '09:00', close: '13:00' },
    sunday: { open: '10:00', close: '12:00' },
    lunch_break: { start: '12:30', end: '13:30' },
    note: '일요일 진료 (오전만)'
  }
};

// 모든 이천시 의원 가져오기
const clinics = db.prepare(`
  SELECT id, name, type, specialties FROM hospitals
  WHERE city = '이천시' AND type IN ('의원', '치과')
`).all();

console.log(`📊 총 ${clinics.length}개 의원 업데이트 중...\n`);

const updateStmt = db.prepare(`
  UPDATE hospitals
  SET opening_hours = ?,
      image_url = ?,
      image_urls = ?,
      notes = ?,
      updated_at = ?
  WHERE id = ?
`);

let updatedCount = 0;

clinics.forEach(clinic => {
  // 운영시간 결정
  let hours;
  if (SPECIAL_HOURS[clinic.name]) {
    hours = SPECIAL_HOURS[clinic.name];
  } else if (WEEKEND_HOURS[clinic.name]) {
    hours = WEEKEND_HOURS[clinic.name];
  } else if (clinic.type === '치과') {
    hours = OPERATING_HOURS['치과'];
  } else {
    // specialties에서 첫 번째 진료과 추출
    const mainSpecialty = clinic.specialties.split(',')[0].trim();
    hours = OPERATING_HOURS[mainSpecialty] || OPERATING_HOURS['내과'];
  }

  // 이미지 폴백 생성
  const imageFallback = generateImageFallback({
    hospitalId: clinic.id,
    customImages: []
  });

  // notes 생성
  let notes = null;
  if (clinic.name.includes('날개')) {
    notes = '어깨, 척추, 관절 전문. 분당차병원, 서울아산병원 협력의료기관';
  } else if (clinic.name.includes('선두연합')) {
    notes = '종합병원 수준의 최신 의료장비 보유. 분당차병원, 서울아산병원 협력의료기관';
  } else if (clinic.name.includes('365')) {
    notes = '24시간 진료 가능';
  } else if (clinic.specialties.includes('소아청소년과')) {
    notes = '예방접종 및 영유아 건강검진 가능';
  } else if (clinic.specialties.includes('정형외과')) {
    notes = '물리치료 및 도수치료 가능';
  } else if (clinic.specialties.includes('피부과')) {
    notes = '피부 레이저 시술 및 미용 치료 가능';
  } else if (clinic.type === '치과') {
    notes = '임플란트, 교정, 충치 치료';
  }

  try {
    updateStmt.run(
      JSON.stringify(hours),
      imageFallback.image_url,
      JSON.stringify(imageFallback.image_urls),
      notes,
      new Date().toISOString(),
      clinic.id
    );
    updatedCount++;
    console.log(`✅ ${clinic.name} - 업데이트 완료`);
  } catch (error) {
    console.error(`❌ ${clinic.name} - 업데이트 실패:`, error.message);
  }
});

console.log(`\n🎉 총 ${updatedCount}개 의원 상세정보 추가 완료!`);

// 결과 확인
const sampleStmt = db.prepare(`
  SELECT name, opening_hours, notes, image_url
  FROM hospitals
  WHERE city = '이천시' AND type = '의원'
  LIMIT 3
`);
const samples = sampleStmt.all();

console.log('\n📋 샘플 데이터 확인:');
samples.forEach(s => {
  console.log(`\n${s.name}:`);
  console.log(`  운영시간: ${s.opening_hours ? '✓' : '✗'}`);
  console.log(`  이미지: ${s.image_url ? '✓' : '✗'}`);
  console.log(`  비고: ${s.notes || '(없음)'}`);
});

db.close();
