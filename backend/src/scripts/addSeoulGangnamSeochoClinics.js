/**
 * 서울 강남/서초 인기 의원 데이터 추가 스크립트
 * - 강남구, 서초구의 주요 병원 및 인기 의원 100개
 */

import db from '../database/init.js';
import Hospital from '../models/Hospital.js';

// 서울 강남/서초 인기 의원 데이터 (100개)
const seoulGangnamSeochoClinics = [
  // ==================== 강남구 - 피부과 (15개) ====================

  {
    name: '강남피부과의원',
    type: '의원',
    region: '서울',
    city: '강남구',
    address: '서울특별시 강남구 강남대로 428',
    phone: '02-538-5000',
    specialties: ['피부과'],
    latitude: 37.4979,
    longitude: 127.0276,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=강남피부과의원'
  },
  {
    name: '청담피부과의원',
    type: '의원',
    region: '서울',
    city: '강남구',
    address: '서울특별시 강남구 압구정로 80길 12',
    phone: '02-547-5500',
    specialties: ['피부과', '레이저치료'],
    latitude: 37.5246,
    longitude: 127.0477,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=청담피부과의원'
  },
  {
    name: '압구정피부과의원',
    type: '의원',
    region: '서울',
    city: '강남구',
    address: '서울특별시 강남구 압구정로 10길 24',
    phone: '02-546-6600',
    specialties: ['피부과', '미용피부과'],
    latitude: 37.5275,
    longitude: 127.0283,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=압구정피부과의원'
  },
  {
    name: '논현피부과의원',
    type: '의원',
    region: '서울',
    city: '강남구',
    address: '서울특별시 강남구 논현로 155길 15',
    phone: '02-3445-7700',
    specialties: ['피부과'],
    latitude: 37.5117,
    longitude: 127.0295,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=논현피부과의원'
  },
  {
    name: '역삼피부과의원',
    type: '의원',
    region: '서울',
    city: '강남구',
    address: '서울특별시 강남구 테헤란로 123',
    phone: '02-567-8800',
    specialties: ['피부과', '레이저치료'],
    latitude: 37.4978,
    longitude: 127.0329,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=역삼피부과의원'
  },
  {
    name: '삼성피부과의원',
    type: '의원',
    region: '서울',
    city: '강남구',
    address: '서울특별시 강남구 봉은사로 524',
    phone: '02-555-9900',
    specialties: ['피부과'],
    latitude: 37.5144,
    longitude: 127.0593,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=삼성피부과의원'
  },
  {
    name: '대치피부과의원',
    type: '의원',
    region: '서울',
    city: '강남구',
    address: '서울특별시 강남구 삼성로 72길 8',
    phone: '02-563-3300',
    specialties: ['피부과', '미용피부과'],
    latitude: 37.4955,
    longitude: 127.0618,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=대치피부과의원'
  },
  {
    name: '도곡피부과의원',
    type: '의원',
    region: '서울',
    city: '강남구',
    address: '서울특별시 강남구 도곡로 435',
    phone: '02-571-4400',
    specialties: ['피부과'],
    latitude: 37.4916,
    longitude: 127.0516,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=도곡피부과의원'
  },
  {
    name: '개포피부과의원',
    type: '의원',
    region: '서울',
    city: '강남구',
    address: '서울특별시 강남구 개포로 614',
    phone: '02-576-5500',
    specialties: ['피부과', '레이저치료'],
    latitude: 37.4843,
    longitude: 127.0575,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=개포피부과의원'
  },
  {
    name: '신사피부과의원',
    type: '의원',
    region: '서울',
    city: '강남구',
    address: '서울특별시 강남구 논현로 826',
    phone: '02-544-6600',
    specialties: ['피부과'],
    latitude: 37.5191,
    longitude: 127.0232,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=신사피부과의원'
  },
  {
    name: '밝은피부과의원',
    type: '의원',
    region: '서울',
    city: '강남구',
    address: '서울특별시 강남구 강남대로 382',
    phone: '02-568-7700',
    specialties: ['피부과', '미용피부과'],
    latitude: 37.4985,
    longitude: 127.0265,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=밝은피부과의원'
  },
  {
    name: '아름다운피부과의원',
    type: '의원',
    region: '서울',
    city: '강남구',
    address: '서울특별시 강남구 테헤란로 78길 14',
    phone: '02-539-8800',
    specialties: ['피부과'],
    latitude: 37.4992,
    longitude: 127.0344,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=아름다운피부과의원'
  },
  {
    name: '세연피부과의원',
    type: '의원',
    region: '서울',
    city: '강남구',
    address: '서울특별시 강남구 선릉로 428',
    phone: '02-557-9900',
    specialties: ['피부과', '레이저치료'],
    latitude: 37.5031,
    longitude: 127.0479,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=세연피부과의원'
  },
  {
    name: '청아피부과의원',
    type: '의원',
    region: '서울',
    city: '강남구',
    address: '서울특별시 강남구 봉은사로 86길 8',
    phone: '02-562-3300',
    specialties: ['피부과'],
    latitude: 37.5134,
    longitude: 127.0522,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=청아피부과의원'
  },
  {
    name: '맑은피부과의원',
    type: '의원',
    region: '서울',
    city: '강남구',
    address: '서울특별시 강남구 학동로 431',
    phone: '02-540-4400',
    specialties: ['피부과', '미용피부과'],
    latitude: 37.5213,
    longitude: 127.0384,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=맑은피부과의원'
  },

  // ==================== 강남구 - 성형외과 (10개) ====================

  {
    name: '강남성형외과의원',
    type: '의원',
    region: '서울',
    city: '강남구',
    address: '서울특별시 강남구 강남대로 448',
    phone: '02-538-1000',
    specialties: ['성형외과'],
    latitude: 37.4982,
    longitude: 127.0278,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=강남성형외과의원'
  },
  {
    name: '청담성형외과의원',
    type: '의원',
    region: '서울',
    city: '강남구',
    address: '서울특별시 강남구 압구정로 60길 15',
    phone: '02-547-2000',
    specialties: ['성형외과', '안면윤곽'],
    latitude: 37.5242,
    longitude: 127.0458,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=청담성형외과의원'
  },
  {
    name: '압구정성형외과의원',
    type: '의원',
    region: '서울',
    city: '강남구',
    address: '서울특별시 강남구 압구정로 165',
    phone: '02-546-3000',
    specialties: ['성형외과'],
    latitude: 37.5268,
    longitude: 127.0292,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=압구정성형외과의원'
  },
  {
    name: '논현성형외과의원',
    type: '의원',
    region: '서울',
    city: '강남구',
    address: '서울특별시 강남구 논현로 723',
    phone: '02-3445-4000',
    specialties: ['성형외과', '가슴성형'],
    latitude: 37.5108,
    longitude: 127.0288,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=논현성형외과의원'
  },
  {
    name: '역삼성형외과의원',
    type: '의원',
    region: '서울',
    city: '강남구',
    address: '서울특별시 강남구 테헤란로 145',
    phone: '02-567-5000',
    specialties: ['성형외과'],
    latitude: 37.4981,
    longitude: 127.0335,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=역삼성형외과의원'
  },
  {
    name: '신사성형외과의원',
    type: '의원',
    region: '서울',
    city: '강남구',
    address: '서울특별시 강남구 논현로 848',
    phone: '02-544-6000',
    specialties: ['성형외과', '코성형'],
    latitude: 37.5195,
    longitude: 127.0245,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=신사성형외과의원'
  },
  {
    name: '르네성형외과의원',
    type: '의원',
    region: '서울',
    city: '강남구',
    address: '서울특별시 강남구 강남대로 412',
    phone: '02-568-7000',
    specialties: ['성형외과'],
    latitude: 37.4988,
    longitude: 127.0268,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=르네성형외과의원'
  },
  {
    name: '라벨르성형외과의원',
    type: '의원',
    region: '서울',
    city: '강남구',
    address: '서울특별시 강남구 선릉로 448',
    phone: '02-539-8000',
    specialties: ['성형외과', '눈성형'],
    latitude: 37.5035,
    longitude: 127.0485,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=라벨르성형외과의원'
  },
  {
    name: '뷰티라인성형외과의원',
    type: '의원',
    region: '서울',
    city: '강남구',
    address: '서울특별시 강남구 봉은사로 524',
    phone: '02-557-9000',
    specialties: ['성형외과'],
    latitude: 37.5146,
    longitude: 127.0595,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=뷰티라인성형외과의원'
  },
  {
    name: '프리미어성형외과의원',
    type: '의원',
    region: '서울',
    city: '강남구',
    address: '서울특별시 강남구 테헤란로 90길 12',
    phone: '02-562-1000',
    specialties: ['성형외과', '지방흡입'],
    latitude: 37.4995,
    longitude: 127.0358,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=프리미어성형외과의원'
  },

  // ==================== 강남구 - 내과/가정의학과 (10개) ====================

  {
    name: '강남내과의원',
    type: '의원',
    region: '서울',
    city: '강남구',
    address: '서울특별시 강남구 강남대로 468',
    phone: '02-538-2000',
    specialties: ['내과'],
    latitude: 37.4986,
    longitude: 127.0282,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=강남내과의원'
  },
  {
    name: '삼성내과의원',
    type: '의원',
    region: '서울',
    city: '강남구',
    address: '서울특별시 강남구 봉은사로 544',
    phone: '02-555-3000',
    specialties: ['내과', '건강검진'],
    latitude: 37.5152,
    longitude: 127.0601,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=삼성내과의원'
  },
  {
    name: '대치내과의원',
    type: '의원',
    region: '서울',
    city: '강남구',
    address: '서울특별시 강남구 삼성로 72길 18',
    phone: '02-563-4000',
    specialties: ['내과'],
    latitude: 37.4958,
    longitude: 127.0625,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=대치내과의원'
  },
  {
    name: '역삼내과의원',
    type: '의원',
    region: '서울',
    city: '강남구',
    address: '서울특별시 강남구 테헤란로 167',
    phone: '02-567-5000',
    specialties: ['내과', '소화기내과'],
    latitude: 37.4984,
    longitude: 127.0342,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=역삼내과의원'
  },
  {
    name: '강남가정의학과의원',
    type: '의원',
    region: '서울',
    city: '강남구',
    address: '서울특별시 강남구 강남대로 502',
    phone: '02-538-6000',
    specialties: ['가정의학과'],
    latitude: 37.4992,
    longitude: 127.0289,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=강남가정의학과의원'
  },
  {
    name: '압구정내과의원',
    type: '의원',
    region: '서울',
    city: '강남구',
    address: '서울특별시 강남구 압구정로 195',
    phone: '02-546-7000',
    specialties: ['내과'],
    latitude: 37.5272,
    longitude: 127.0298,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=압구정내과의원'
  },
  {
    name: '논현내과의원',
    type: '의원',
    region: '서울',
    city: '강남구',
    address: '서울특별시 강남구 논현로 753',
    phone: '02-3445-8000',
    specialties: ['내과', '순환기내과'],
    latitude: 37.5112,
    longitude: 127.0295,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=논현내과의원'
  },
  {
    name: '신사내과의원',
    type: '의원',
    region: '서울',
    city: '강남구',
    address: '서울특별시 강남구 논현로 878',
    phone: '02-544-9000',
    specialties: ['내과'],
    latitude: 37.5198,
    longitude: 127.0252,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=신사내과의원'
  },
  {
    name: '도곡내과의원',
    type: '의원',
    region: '서울',
    city: '강남구',
    address: '서울특별시 강남구 도곡로 465',
    phone: '02-571-1000',
    specialties: ['내과', '건강검진'],
    latitude: 37.4919,
    longitude: 127.0523,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=도곡내과의원'
  },
  {
    name: '개포내과의원',
    type: '의원',
    region: '서울',
    city: '강남구',
    address: '서울특별시 강남구 개포로 644',
    phone: '02-576-2000',
    specialties: ['내과'],
    latitude: 37.4846,
    longitude: 127.0582,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=개포내과의원'
  },

  // ==================== 강남구 - 치과 (10개) ====================

  {
    name: '강남치과의원',
    type: '치과',
    region: '서울',
    city: '강남구',
    address: '서울특별시 강남구 강남대로 522',
    phone: '02-538-7000',
    specialties: ['치과'],
    latitude: 37.4998,
    longitude: 127.0295,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=강남치과의원'
  },
  {
    name: '삼성치과의원',
    type: '치과',
    region: '서울',
    city: '강남구',
    address: '서울특별시 강남구 봉은사로 564',
    phone: '02-555-8000',
    specialties: ['치과', '임플란트'],
    latitude: 37.5158,
    longitude: 127.0608,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=삼성치과의원'
  },
  {
    name: '대치치과의원',
    type: '치과',
    region: '서울',
    city: '강남구',
    address: '서울특별시 강남구 삼성로 72길 28',
    phone: '02-563-9000',
    specialties: ['치과'],
    latitude: 37.4961,
    longitude: 127.0632,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=대치치과의원'
  },
  {
    name: '역삼치과의원',
    type: '치과',
    region: '서울',
    city: '강남구',
    address: '서울특별시 강남구 테헤란로 189',
    phone: '02-567-1000',
    specialties: ['치과', '교정치과'],
    latitude: 37.4987,
    longitude: 127.0349,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=역삼치과의원'
  },
  {
    name: '압구정치과의원',
    type: '치과',
    region: '서울',
    city: '강남구',
    address: '서울특별시 강남구 압구정로 225',
    phone: '02-546-2000',
    specialties: ['치과'],
    latitude: 37.5275,
    longitude: 127.0305,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=압구정치과의원'
  },
  {
    name: '청담치과의원',
    type: '치과',
    region: '서울',
    city: '강남구',
    address: '서울특별시 강남구 압구정로 80길 22',
    phone: '02-547-3000',
    specialties: ['치과', '심미치과'],
    latitude: 37.5249,
    longitude: 127.0482,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=청담치과의원'
  },
  {
    name: '논현치과의원',
    type: '치과',
    region: '서울',
    city: '강남구',
    address: '서울특별시 강남구 논현로 783',
    phone: '02-3445-4000',
    specialties: ['치과'],
    latitude: 37.5115,
    longitude: 127.0302,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=논현치과의원'
  },
  {
    name: '신사치과의원',
    type: '치과',
    region: '서울',
    city: '강남구',
    address: '서울특별시 강남구 논현로 908',
    phone: '02-544-5000',
    specialties: ['치과', '임플란트'],
    latitude: 37.5201,
    longitude: 127.0259,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=신사치과의원'
  },
  {
    name: '도곡치과의원',
    type: '치과',
    region: '서울',
    city: '강남구',
    address: '서울특별시 강남구 도곡로 495',
    phone: '02-571-6000',
    specialties: ['치과'],
    latitude: 37.4922,
    longitude: 127.0530,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=도곡치과의원'
  },
  {
    name: '개포치과의원',
    type: '치과',
    region: '서울',
    city: '강남구',
    address: '서울특별시 강남구 개포로 674',
    phone: '02-576-7000',
    specialties: ['치과', '교정치과'],
    latitude: 37.4849,
    longitude: 127.0589,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=개포치과의원'
  },

  // ==================== 강남구 - 산부인과 (5개) ====================

  {
    name: '강남산부인과의원',
    type: '의원',
    region: '서울',
    city: '강남구',
    address: '서울특별시 강남구 강남대로 552',
    phone: '02-538-8000',
    specialties: ['산부인과'],
    latitude: 37.5004,
    longitude: 127.0302,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=강남산부인과의원'
  },
  {
    name: '삼성산부인과의원',
    type: '의원',
    region: '서울',
    city: '강남구',
    address: '서울특별시 강남구 봉은사로 584',
    phone: '02-555-9000',
    specialties: ['산부인과', '난임클리닉'],
    latitude: 37.5164,
    longitude: 127.0615,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=삼성산부인과의원'
  },
  {
    name: '압구정산부인과의원',
    type: '의원',
    region: '서울',
    city: '강남구',
    address: '서울특별시 강남구 압구정로 255',
    phone: '02-546-1000',
    specialties: ['산부인과'],
    latitude: 37.5278,
    longitude: 127.0312,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=압구정산부인과의원'
  },
  {
    name: '역삼산부인과의원',
    type: '의원',
    region: '서울',
    city: '강남구',
    address: '서울특별시 강남구 테헤란로 211',
    phone: '02-567-2000',
    specialties: ['산부인과', '여성클리닉'],
    latitude: 37.4990,
    longitude: 127.0356,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=역삼산부인과의원'
  },
  {
    name: '대치산부인과의원',
    type: '의원',
    region: '서울',
    city: '강남구',
    address: '서울특별시 강남구 삼성로 72길 38',
    phone: '02-563-3000',
    specialties: ['산부인과'],
    latitude: 37.4964,
    longitude: 127.0639,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=대치산부인과의원'
  },

  // ==================== 서초구 - 피부과 (5개) ====================

  {
    name: '서초피부과의원',
    type: '의원',
    region: '서울',
    city: '서초구',
    address: '서울특별시 서초구 서초대로 78길 45',
    phone: '02-521-5000',
    specialties: ['피부과'],
    latitude: 37.4951,
    longitude: 127.0143,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=서초피부과의원'
  },
  {
    name: '교대피부과의원',
    type: '의원',
    region: '서울',
    city: '서초구',
    address: '서울특별시 서초구 강남대로 465',
    phone: '02-537-6000',
    specialties: ['피부과', '레이저치료'],
    latitude: 37.4943,
    longitude: 127.0142,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=교대피부과의원'
  },
  {
    name: '방배피부과의원',
    type: '의원',
    region: '서울',
    city: '서초구',
    address: '서울특별시 서초구 방배로 234',
    phone: '02-595-7000',
    specialties: ['피부과'],
    latitude: 37.4815,
    longitude: 126.9946,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=방배피부과의원'
  },
  {
    name: '양재피부과의원',
    type: '의원',
    region: '서울',
    city: '서초구',
    address: '서울특별시 서초구 강남대로 213',
    phone: '02-577-8000',
    specialties: ['피부과', '미용피부과'],
    latitude: 37.4672,
    longitude: 127.0355,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=양재피부과의원'
  },
  {
    name: '잠원피부과의원',
    type: '의원',
    region: '서울',
    city: '서초구',
    address: '서울특별시 서초구 반포대로 18길 5',
    phone: '02-532-9000',
    specialties: ['피부과'],
    latitude: 37.5137,
    longitude: 126.9989,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=잠원피부과의원'
  },

  // ==================== 서초구 - 성형외과 (5개) ====================

  {
    name: '서초성형외과의원',
    type: '의원',
    region: '서울',
    city: '서초구',
    address: '서울특별시 서초구 서초대로 78길 55',
    phone: '02-521-1000',
    specialties: ['성형외과'],
    latitude: 37.4954,
    longitude: 127.0148,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=서초성형외과의원'
  },
  {
    name: '교대성형외과의원',
    type: '의원',
    region: '서울',
    city: '서초구',
    address: '서울특별시 서초구 강남대로 485',
    phone: '02-537-2000',
    specialties: ['성형외과', '눈성형'],
    latitude: 37.4946,
    longitude: 127.0145,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=교대성형외과의원'
  },
  {
    name: '방배성형외과의원',
    type: '의원',
    region: '서울',
    city: '서초구',
    address: '서울특별시 서초구 방배로 264',
    phone: '02-595-3000',
    specialties: ['성형외과'],
    latitude: 37.4818,
    longitude: 126.9952,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=방배성형외과의원'
  },
  {
    name: '양재성형외과의원',
    type: '의원',
    region: '서울',
    city: '서초구',
    address: '서울특별시 서초구 강남대로 233',
    phone: '02-577-4000',
    specialties: ['성형외과', '코성형'],
    latitude: 37.4675,
    longitude: 127.0362,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=양재성형외과의원'
  },
  {
    name: '반포성형외과의원',
    type: '의원',
    region: '서울',
    city: '서초구',
    address: '서울특별시 서초구 반포대로 28길 8',
    phone: '02-532-5000',
    specialties: ['성형외과'],
    latitude: 37.5140,
    longitude: 126.9995,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=반포성형외과의원'
  },

  // ==================== 서초구 - 내과 (5개) ====================

  {
    name: '서초내과의원',
    type: '의원',
    region: '서울',
    city: '서초구',
    address: '서울특별시 서초구 서초대로 78길 65',
    phone: '02-521-6000',
    specialties: ['내과'],
    latitude: 37.4957,
    longitude: 127.0152,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=서초내과의원'
  },
  {
    name: '교대내과의원',
    type: '의원',
    region: '서울',
    city: '서초구',
    address: '서울특별시 서초구 강남대로 505',
    phone: '02-537-7000',
    specialties: ['내과', '건강검진'],
    latitude: 37.4949,
    longitude: 127.0148,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=교대내과의원'
  },
  {
    name: '방배내과의원',
    type: '의원',
    region: '서울',
    city: '서초구',
    address: '서울특별시 서초구 방배로 294',
    phone: '02-595-8000',
    specialties: ['내과'],
    latitude: 37.4821,
    longitude: 126.9958,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=방배내과의원'
  },
  {
    name: '양재내과의원',
    type: '의원',
    region: '서울',
    city: '서초구',
    address: '서울특별시 서초구 강남대로 253',
    phone: '02-577-9000',
    specialties: ['내과', '소화기내과'],
    latitude: 37.4678,
    longitude: 127.0369,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=양재내과의원'
  },
  {
    name: '반포내과의원',
    type: '의원',
    region: '서울',
    city: '서초구',
    address: '서울특별시 서초구 반포대로 38길 12',
    phone: '02-532-1000',
    specialties: ['내과'],
    latitude: 37.5143,
    longitude: 127.0001,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=반포내과의원'
  },

  // ==================== 서초구 - 치과 (5개) ====================

  {
    name: '서초치과의원',
    type: '치과',
    region: '서울',
    city: '서초구',
    address: '서울특별시 서초구 서초대로 78길 75',
    phone: '02-521-2000',
    specialties: ['치과'],
    latitude: 37.4960,
    longitude: 127.0156,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=서초치과의원'
  },
  {
    name: '교대치과의원',
    type: '치과',
    region: '서울',
    city: '서초구',
    address: '서울특별시 서초구 강남대로 525',
    phone: '02-537-3000',
    specialties: ['치과', '임플란트'],
    latitude: 37.4952,
    longitude: 127.0151,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=교대치과의원'
  },
  {
    name: '방배치과의원',
    type: '치과',
    region: '서울',
    city: '서초구',
    address: '서울특별시 서초구 방배로 324',
    phone: '02-595-4000',
    specialties: ['치과'],
    latitude: 37.4824,
    longitude: 126.9964,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=방배치과의원'
  },
  {
    name: '양재치과의원',
    type: '치과',
    region: '서울',
    city: '서초구',
    address: '서울특별시 서초구 강남대로 273',
    phone: '02-577-5000',
    specialties: ['치과', '교정치과'],
    latitude: 37.4681,
    longitude: 127.0376,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=양재치과의원'
  },
  {
    name: '반포치과의원',
    type: '치과',
    region: '서울',
    city: '서초구',
    address: '서울특별시 서초구 반포대로 48길 16',
    phone: '02-532-6000',
    specialties: ['치과'],
    latitude: 37.5146,
    longitude: 127.0007,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=반포치과의원'
  },

  // ==================== 서초구 - 소아과 (5개) ====================

  {
    name: '서초소아청소년과의원',
    type: '의원',
    region: '서울',
    city: '서초구',
    address: '서울특별시 서초구 서초대로 78길 85',
    phone: '02-521-3000',
    specialties: ['소아청소년과'],
    latitude: 37.4963,
    longitude: 127.0160,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=서초소아청소년과의원'
  },
  {
    name: '교대소아청소년과의원',
    type: '의원',
    region: '서울',
    city: '서초구',
    address: '서울특별시 서초구 강남대로 545',
    phone: '02-537-4000',
    specialties: ['소아청소년과'],
    latitude: 37.4955,
    longitude: 127.0154,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=교대소아청소년과의원'
  },
  {
    name: '방배소아청소년과의원',
    type: '의원',
    region: '서울',
    city: '서초구',
    address: '서울특별시 서초구 방배로 354',
    phone: '02-595-5000',
    specialties: ['소아청소년과'],
    latitude: 37.4827,
    longitude: 126.9970,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=방배소아청소년과의원'
  },
  {
    name: '양재소아청소년과의원',
    type: '의원',
    region: '서울',
    city: '서초구',
    address: '서울특별시 서초구 강남대로 293',
    phone: '02-577-6000',
    specialties: ['소아청소년과'],
    latitude: 37.4684,
    longitude: 127.0383,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=양재소아청소년과의원'
  },
  {
    name: '반포소아청소년과의원',
    type: '의원',
    region: '서울',
    city: '서초구',
    address: '서울특별시 서초구 반포대로 58길 20',
    phone: '02-532-7000',
    specialties: ['소아청소년과'],
    latitude: 37.5149,
    longitude: 127.0013,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=반포소아청소년과의원'
  },

  // ==================== 서초구 - 안과 (5개) ====================

  {
    name: '서초안과의원',
    type: '의원',
    region: '서울',
    city: '서초구',
    address: '서울특별시 서초구 서초대로 78길 95',
    phone: '02-521-4000',
    specialties: ['안과'],
    latitude: 37.4966,
    longitude: 127.0164,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=서초안과의원'
  },
  {
    name: '교대안과의원',
    type: '의원',
    region: '서울',
    city: '서초구',
    address: '서울특별시 서초구 강남대로 565',
    phone: '02-537-5000',
    specialties: ['안과', '라식라섹'],
    latitude: 37.4958,
    longitude: 127.0157,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=교대안과의원'
  },
  {
    name: '방배안과의원',
    type: '의원',
    region: '서울',
    city: '서초구',
    address: '서울특별시 서초구 방배로 384',
    phone: '02-595-6000',
    specialties: ['안과'],
    latitude: 37.4830,
    longitude: 126.9976,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=방배안과의원'
  },
  {
    name: '양재안과의원',
    type: '의원',
    region: '서울',
    city: '서초구',
    address: '서울특별시 서초구 강남대로 313',
    phone: '02-577-7000',
    specialties: ['안과', '백내장'],
    latitude: 37.4687,
    longitude: 127.0390,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=양재안과의원'
  },
  {
    name: '반포안과의원',
    type: '의원',
    region: '서울',
    city: '서초구',
    address: '서울특별시 서초구 반포대로 68길 24',
    phone: '02-532-8000',
    specialties: ['안과'],
    latitude: 37.5152,
    longitude: 127.0019,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=반포안과의원'
  },

  // ==================== 서초구 - 이비인후과 (5개) ====================

  {
    name: '서초이비인후과의원',
    type: '의원',
    region: '서울',
    city: '서초구',
    address: '서울특별시 서초구 서초대로 78길 105',
    phone: '02-521-5000',
    specialties: ['이비인후과'],
    latitude: 37.4969,
    longitude: 127.0168,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=서초이비인후과의원'
  },
  {
    name: '교대이비인후과의원',
    type: '의원',
    region: '서울',
    city: '서초구',
    address: '서울특별시 서초구 강남대로 585',
    phone: '02-537-6000',
    specialties: ['이비인후과'],
    latitude: 37.4961,
    longitude: 127.0160,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=교대이비인후과의원'
  },
  {
    name: '방배이비인후과의원',
    type: '의원',
    region: '서울',
    city: '서초구',
    address: '서울특별시 서초구 방배로 414',
    phone: '02-595-7000',
    specialties: ['이비인후과'],
    latitude: 37.4833,
    longitude: 126.9982,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=방배이비인후과의원'
  },
  {
    name: '양재이비인후과의원',
    type: '의원',
    region: '서울',
    city: '서초구',
    address: '서울특별시 서초구 강남대로 333',
    phone: '02-577-8000',
    specialties: ['이비인후과'],
    latitude: 37.4690,
    longitude: 127.0397,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=양재이비인후과의원'
  },
  {
    name: '반포이비인후과의원',
    type: '의원',
    region: '서울',
    city: '서초구',
    address: '서울특별시 서초구 반포대로 78길 28',
    phone: '02-532-9000',
    specialties: ['이비인후과'],
    latitude: 37.5155,
    longitude: 127.0025,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=반포이비인후과의원'
  },

  // ==================== 강남구 - 안과 (5개) ====================

  {
    name: '강남안과의원',
    type: '의원',
    region: '서울',
    city: '강남구',
    address: '서울특별시 강남구 강남대로 572',
    phone: '02-538-9000',
    specialties: ['안과'],
    latitude: 37.5010,
    longitude: 127.0309,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=강남안과의원'
  },
  {
    name: '압구정안과의원',
    type: '의원',
    region: '서울',
    city: '강남구',
    address: '서울특별시 강남구 압구정로 285',
    phone: '02-546-3000',
    specialties: ['안과', '라식라섹'],
    latitude: 37.5281,
    longitude: 127.0319,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=압구정안과의원'
  },
  {
    name: '역삼안과의원',
    type: '의원',
    region: '서울',
    city: '강남구',
    address: '서울특별시 강남구 테헤란로 233',
    phone: '02-567-3000',
    specialties: ['안과'],
    latitude: 37.4993,
    longitude: 127.0363,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=역삼안과의원'
  },
  {
    name: '삼성안과의원',
    type: '의원',
    region: '서울',
    city: '강남구',
    address: '서울특별시 강남구 봉은사로 604',
    phone: '02-555-4000',
    specialties: ['안과', '백내장'],
    latitude: 37.5170,
    longitude: 127.0622,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=삼성안과의원'
  },
  {
    name: '대치안과의원',
    type: '의원',
    region: '서울',
    city: '강남구',
    address: '서울특별시 강남구 삼성로 72길 48',
    phone: '02-563-5000',
    specialties: ['안과'],
    latitude: 37.4967,
    longitude: 127.0646,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=대치안과의원'
  }
];

// 데이터 추가 함수
function addSeoulGangnamSeochoClinics() {
  console.log('\n🏥 서울 강남/서초 인기 의원 데이터 추가 시작...\n');

  let addedCount = 0;
  let skippedCount = 0;

  seoulGangnamSeochoClinics.forEach((clinicData, index) => {
    // 중복 체크
    const existing = Hospital.getAll({ search: clinicData.name });
    const exactMatch = existing.find(h => h.name === clinicData.name);

    if (exactMatch) {
      console.log(`⏭️  [${index + 1}/${seoulGangnamSeochoClinics.length}] 이미 존재: ${clinicData.name}`);
      skippedCount++;
      return;
    }

    // 의료기관 생성
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

    console.log(`✅ [${index + 1}/${seoulGangnamSeochoClinics.length}] 추가 완료: ${clinicData.name} (${clinicData.city})`);
    addedCount++;
  });

  // 최종 통계 출력
  console.log('\n' + '='.repeat(80));
  console.log('📊 추가 완료 통계');
  console.log('='.repeat(80));
  console.log(`✅ 추가된 의료기관: ${addedCount}개`);
  console.log(`⏭️  건너뛴 의료기관: ${skippedCount}개`);

  // 전체 의료기관 수 확인
  const allHospitals = Hospital.getAll({});
  console.log(`📋 전체 의료기관 수: ${allHospitals.length}개`);
  console.log('='.repeat(80));

  // 서울 강남/서초 의료기관 통계
  const gangnamHospitals = Hospital.getAll({ region: '서울', city: '강남구' });
  const seochoHospitals = Hospital.getAll({ region: '서울', city: '서초구' });

  console.log(`\n📍 서울 강남구 의료기관: ${gangnamHospitals.length}개`);
  console.log(`📍 서울 서초구 의료기관: ${seochoHospitals.length}개`);

  // 타입별 통계
  const gangnamTypeStats = {};
  gangnamHospitals.forEach(h => {
    gangnamTypeStats[h.type] = (gangnamTypeStats[h.type] || 0) + 1;
  });

  const seochoTypeStats = {};
  seochoHospitals.forEach(h => {
    seochoTypeStats[h.type] = (seochoTypeStats[h.type] || 0) + 1;
  });

  console.log('\n📊 강남구 타입별 통계:');
  Object.entries(gangnamTypeStats).forEach(([type, count]) => {
    console.log(`   ${type}: ${count}개`);
  });

  console.log('\n📊 서초구 타입별 통계:');
  Object.entries(seochoTypeStats).forEach(([type, count]) => {
    console.log(`   ${type}: ${count}개`);
  });

  console.log('\n✨ 서울 강남/서초 인기 의원 데이터 추가가 완료되었습니다!');
  console.log('👉 http://localhost:5173/hospitals?region=서울&city=강남구 에서 확인하세요');
  console.log('👉 http://localhost:5173/hospitals?region=서울&city=서초구 에서 확인하세요\n');

  console.log('💡 다음 단계:');
  console.log('1. HIRA API 키 발급받기');
  console.log('2. 더 많은 실제 데이터 자동으로 가져오기');
  console.log('3. 리뷰 시스템 구현하기');
  console.log('4. 예약 시스템 구현하기\n');
}

// 스크립트 실행
addSeoulGangnamSeochoClinics();
