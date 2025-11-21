/**
 * 진료과 카테고리 데이터
 * 각 진료과에 아이콘, 설명, 색상 테마를 포함
 */

export const specialtyCategories = [
  {
    name: '내과',
    icon: '🫀',
    description: '일반적인 내과 질환, 감기, 발열, 소화기, 순환기',
    color: '#3b82f6',
    bgColor: '#dbeafe',
    keywords: ['감기', '발열', '복통', '소화불량', '고혈압', '당뇨']
  },
  {
    name: '외과',
    icon: '🔪',
    description: '수술, 외상, 상처, 복부 질환',
    color: '#ef4444',
    bgColor: '#fee2e2',
    keywords: ['수술', '외상', '베임', '복통', '탈장']
  },
  {
    name: '정형외과',
    icon: '🦴',
    description: '뼈, 관절, 근육, 척추, 골절',
    color: '#f59e0b',
    bgColor: '#fef3c7',
    keywords: ['골절', '허리통증', '무릎통증', '어깨통증', '관절염']
  },
  {
    name: '신경외과',
    icon: '🧠',
    description: '뇌, 척추, 신경 수술',
    color: '#8b5cf6',
    bgColor: '#ede9fe',
    keywords: ['두통', '목디스크', '허리디스크', '뇌질환']
  },
  {
    name: '산부인과',
    icon: '👶',
    description: '임신, 출산, 여성 질환',
    color: '#ec4899',
    bgColor: '#fce7f3',
    keywords: ['임신', '출산', '생리통', '갱년기', '자궁']
  },
  {
    name: '소아청소년과',
    icon: '👧',
    description: '소아 질환, 성장, 예방접종',
    color: '#10b981',
    bgColor: '#d1fae5',
    keywords: ['예방접종', '성장', '발열', '감기', '아기']
  },
  {
    name: '안과',
    icon: '👁️',
    description: '눈 질환, 시력 교정, 백내장, 녹내장',
    color: '#06b6d4',
    bgColor: '#cffafe',
    keywords: ['시력', '눈통증', '백내장', '녹내장', '결막염']
  },
  {
    name: '이비인후과',
    icon: '👂',
    description: '귀, 코, 목 질환, 중이염, 비염',
    color: '#f97316',
    bgColor: '#ffedd5',
    keywords: ['중이염', '비염', '축농증', '귀통증', '코막힘']
  },
  {
    name: '피부과',
    icon: '🔴',
    description: '피부 질환, 여드름, 탈모, 아토피',
    color: '#a855f7',
    bgColor: '#f3e8ff',
    keywords: ['여드름', '탈모', '아토피', '두드러기', '습진']
  },
  {
    name: '비뇨의학과',
    icon: '💧',
    description: '비뇨기 질환, 전립선, 요로감염',
    color: '#0ea5e9',
    bgColor: '#e0f2fe',
    keywords: ['빈뇨', '혈뇨', '전립선', '요로감염']
  },
  {
    name: '정신건강의학과',
    icon: '🧘',
    description: '우울증, 불안장애, 스트레스, 불면증',
    color: '#6366f1',
    bgColor: '#e0e7ff',
    keywords: ['우울증', '불안', '불면증', '스트레스', '공황장애']
  },
  {
    name: '재활의학과',
    icon: '🏃',
    description: '재활 치료, 물리치료, 통증 관리',
    color: '#14b8a6',
    bgColor: '#ccfbf1',
    keywords: ['재활', '물리치료', '통증', '근력회복']
  },
  {
    name: '가정의학과',
    icon: '🏠',
    description: '건강검진, 만성질환 관리, 예방접종',
    color: '#84cc16',
    bgColor: '#ecfccb',
    keywords: ['건강검진', '예방접종', '금연', '비만']
  },
  {
    name: '신경과',
    icon: '⚡',
    description: '두통, 어지러움, 뇌졸중, 치매',
    color: '#eab308',
    bgColor: '#fef9c3',
    keywords: ['두통', '어지러움', '뇌졸중', '치매', '편두통']
  },
  {
    name: '내분비내과',
    icon: '🩺',
    description: '당뇨, 갑상선, 호르몬 질환',
    color: '#64748b',
    bgColor: '#f1f5f9',
    keywords: ['당뇨', '갑상선', '비만', '대사증후군']
  },
  {
    name: '호흡기내과',
    icon: '🫁',
    description: '천식, 폐렴, 기관지염',
    color: '#0891b2',
    bgColor: '#cffafe',
    keywords: ['천식', '폐렴', '기침', '기관지염']
  }
];

/**
 * 진료과 이름으로 카테고리 정보 찾기
 * @param {string} specialtyName - 진료과 이름
 * @returns {Object|null} 카테고리 정보
 */
export function getSpecialtyCategory(specialtyName) {
  return specialtyCategories.find(cat => cat.name === specialtyName) || null;
}

/**
 * 인기 진료과 (상위 8개)
 */
export const popularSpecialties = [
  '내과',
  '정형외과',
  '피부과',
  '이비인후과',
  '안과',
  '소아청소년과',
  '산부인과',
  '외과'
];
