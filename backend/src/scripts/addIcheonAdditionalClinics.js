/**
 * 이천시 추가 의료기관 데이터 추가 스크립트
 * - 한의원, 약국, 재활의원, 요양병원 등 추가
 */

import db from '../database/init.js';
import Hospital from '../models/Hospital.js';

// 이천시 추가 의료기관 데이터 (한의원, 약국 등)
const icheonAdditionalClinics = [
  // ==================== 한의원 (20개) ====================

  // 중심부 한의원 (8개)
  {
    name: '이천한의원',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 중리천로 120',
    phone: '031-632-5500',
    specialties: ['한의원'],
    latitude: 37.2720,
    longitude: 127.4350,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=이천한의원'
  },
  {
    name: '밝은한의원',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 부악로 88',
    phone: '031-634-2000',
    specialties: ['한의원', '침구치료'],
    latitude: 37.2730,
    longitude: 127.4360,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=밝은한의원'
  },
  {
    name: '경희한의원',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 이섭대천로 156',
    phone: '031-633-7582',
    specialties: ['한의원', '추나요법'],
    latitude: 37.2725,
    longitude: 127.4355,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=경희한의원'
  },
  {
    name: '자연한의원',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 남천로 45',
    phone: '031-635-4400',
    specialties: ['한의원', '체질치료'],
    latitude: 37.2715,
    longitude: 127.4340,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=자연한의원'
  },
  {
    name: '참한의원',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 부악로 102',
    phone: '031-636-8800',
    specialties: ['한의원', '한방재활'],
    latitude: 37.2740,
    longitude: 127.4370,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=참한의원'
  },
  {
    name: '솔한의원',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 중리천로 95',
    phone: '031-632-9900',
    specialties: ['한의원', '침구치료'],
    latitude: 37.2710,
    longitude: 127.4345,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=솔한의원'
  },
  {
    name: '청담한의원',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 남천로 67',
    phone: '031-637-5500',
    specialties: ['한의원', '다이어트'],
    latitude: 37.2705,
    longitude: 127.4335,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=청담한의원'
  },
  {
    name: '이천효한의원',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 이섭대천로 180',
    phone: '031-638-2200',
    specialties: ['한의원', '교통사고후유증'],
    latitude: 37.2735,
    longitude: 127.4365,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=이천효한의원'
  },

  // 장호원 한의원 (3개)
  {
    name: '장호원한의원',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 장호원읍 오남로 45',
    phone: '031-641-5500',
    specialties: ['한의원'],
    latitude: 37.1850,
    longitude: 127.5200,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=장호원한의원'
  },
  {
    name: '동부한의원',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 장호원읍 삼성로 78',
    phone: '031-642-7700',
    specialties: ['한의원', '추나요법'],
    latitude: 37.1860,
    longitude: 127.5210,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=동부한의원'
  },
  {
    name: '효성한의원',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 장호원읍 장호원로 102',
    phone: '031-643-8800',
    specialties: ['한의원', '침구치료'],
    latitude: 37.1855,
    longitude: 127.5205,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=효성한의원'
  },

  // 부발 한의원 (3개)
  {
    name: '부발한의원',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 부발읍 아미리 123',
    phone: '031-644-5500',
    specialties: ['한의원'],
    latitude: 37.2650,
    longitude: 127.3850,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=부발한의원'
  },
  {
    name: '서부한의원',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 부발읍 경충대로 2512',
    phone: '031-645-6600',
    specialties: ['한의원', '한방재활'],
    latitude: 37.2660,
    longitude: 127.3860,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=서부한의원'
  },
  {
    name: '신세계한의원',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 부발읍 부발로 89',
    phone: '031-646-7700',
    specialties: ['한의원', '체질치료'],
    latitude: 37.2655,
    longitude: 127.3855,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=신세계한의원'
  },

  // 모가/백사 한의원 (3개)
  {
    name: '모가한의원',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 모가면 서경로 45',
    phone: '031-647-5500',
    specialties: ['한의원'],
    latitude: 37.2450,
    longitude: 127.4250,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=모가한의원'
  },
  {
    name: '백사한의원',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 백사면 백록로 67',
    phone: '031-648-6600',
    specialties: ['한의원', '침구치료'],
    latitude: 37.2100,
    longitude: 127.4800,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=백사한의원'
  },
  {
    name: '남부한의원',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 율면 산성로 89',
    phone: '031-649-7700',
    specialties: ['한의원', '추나요법'],
    latitude: 37.2200,
    longitude: 127.4600,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=남부한의원'
  },

  // 신둔/호법 한의원 (3개)
  {
    name: '신둔한의원',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 신둔면 원적로 123',
    phone: '031-650-5500',
    specialties: ['한의원'],
    latitude: 37.3100,
    longitude: 127.4200,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=신둔한의원'
  },
  {
    name: '호법한의원',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 호법면 프리미엄로 45',
    phone: '031-651-6600',
    specialties: ['한의원', '한방재활'],
    latitude: 37.3200,
    longitude: 127.4650,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=호법한의원'
  },
  {
    name: '북부한의원',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 마장면 광이로 67',
    phone: '031-652-7700',
    specialties: ['한의원', '교통사고후유증'],
    latitude: 37.3300,
    longitude: 127.4100,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=북부한의원'
  },

  // ==================== 약국 (15개) ====================

  // 중심부 약국 (6개)
  {
    name: '이천중앙약국',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 중리천로 125',
    phone: '031-632-3300',
    specialties: ['약국'],
    latitude: 37.2720,
    longitude: 127.4350,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=이천중앙약국'
  },
  {
    name: '온누리약국',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 부악로 92',
    phone: '031-633-4400',
    specialties: ['약국'],
    latitude: 37.2730,
    longitude: 127.4360,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=온누리약국'
  },
  {
    name: '이천약국',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 이섭대천로 160',
    phone: '031-634-5500',
    specialties: ['약국'],
    latitude: 37.2725,
    longitude: 127.4355,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=이천약국'
  },
  {
    name: '밝은약국',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 남천로 50',
    phone: '031-635-6600',
    specialties: ['약국'],
    latitude: 37.2715,
    longitude: 127.4340,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=밝은약국'
  },
  {
    name: '참약국',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 부악로 106',
    phone: '031-636-7700',
    specialties: ['약국'],
    latitude: 37.2740,
    longitude: 127.4370,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=참약국'
  },
  {
    name: '효성약국',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 중리천로 100',
    phone: '031-632-8800',
    specialties: ['약국'],
    latitude: 37.2710,
    longitude: 127.4345,
    has_emergency_room: false,
    open_24_hours: true,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=효성약국'
  },

  // 장호원 약국 (3개)
  {
    name: '장호원약국',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 장호원읍 오남로 48',
    phone: '031-641-3300',
    specialties: ['약국'],
    latitude: 37.1850,
    longitude: 127.5200,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=장호원약국'
  },
  {
    name: '동부약국',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 장호원읍 삼성로 82',
    phone: '031-642-4400',
    specialties: ['약국'],
    latitude: 37.1860,
    longitude: 127.5210,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=동부약국'
  },
  {
    name: '새봄약국',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 장호원읍 장호원로 106',
    phone: '031-643-5500',
    specialties: ['약국'],
    latitude: 37.1855,
    longitude: 127.5205,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=새봄약국'
  },

  // 부발 약국 (2개)
  {
    name: '부발약국',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 부발읍 아미리 127',
    phone: '031-644-3300',
    specialties: ['약국'],
    latitude: 37.2650,
    longitude: 127.3850,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=부발약국'
  },
  {
    name: '서부약국',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 부발읍 경충대로 2516',
    phone: '031-645-4400',
    specialties: ['약국'],
    latitude: 37.2660,
    longitude: 127.3860,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=서부약국'
  },

  // 모가/백사 약국 (2개)
  {
    name: '모가약국',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 모가면 서경로 49',
    phone: '031-647-3300',
    specialties: ['약국'],
    latitude: 37.2450,
    longitude: 127.4250,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=모가약국'
  },
  {
    name: '백사약국',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 백사면 백록로 71',
    phone: '031-648-4400',
    specialties: ['약국'],
    latitude: 37.2100,
    longitude: 127.4800,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=백사약국'
  },

  // 신둔/호법 약국 (2개)
  {
    name: '신둔약국',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 신둔면 원적로 127',
    phone: '031-650-3300',
    specialties: ['약국'],
    latitude: 37.3100,
    longitude: 127.4200,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=신둔약국'
  },
  {
    name: '호법약국',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 호법면 프리미엄로 49',
    phone: '031-651-4400',
    specialties: ['약국'],
    latitude: 37.3200,
    longitude: 127.4650,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=호법약국'
  },

  // ==================== 재활의원 (5개) ====================

  {
    name: '이천재활의학과의원',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 중리천로 130',
    phone: '031-632-9900',
    specialties: ['재활의학과'],
    latitude: 37.2720,
    longitude: 127.4350,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=이천재활의학과의원'
  },
  {
    name: '중앙재활의학과의원',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 부악로 95',
    phone: '031-633-8800',
    specialties: ['재활의학과', '물리치료'],
    latitude: 37.2730,
    longitude: 127.4360,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=중앙재활의학과의원'
  },
  {
    name: '밝은재활의학과의원',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 이섭대천로 165',
    phone: '031-634-7700',
    specialties: ['재활의학과', '도수치료'],
    latitude: 37.2725,
    longitude: 127.4355,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=밝은재활의학과의원'
  },
  {
    name: '튼튼재활의학과의원',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 남천로 55',
    phone: '031-635-6600',
    specialties: ['재활의학과', '스포츠재활'],
    latitude: 37.2715,
    longitude: 127.4340,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=튼튼재활의학과의원'
  },
  {
    name: '장호원재활의학과의원',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 장호원읍 오남로 52',
    phone: '031-641-5500',
    specialties: ['재활의학과'],
    latitude: 37.1850,
    longitude: 127.5200,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=장호원재활의학과의원'
  },

  // ==================== 기타 전문의원 (10개) ====================

  {
    name: '이천통증의학과의원',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 중리천로 135',
    phone: '031-632-7788',
    specialties: ['통증의학과'],
    latitude: 37.2720,
    longitude: 127.4350,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=이천통증의학과의원'
  },
  {
    name: '영상의학과의원',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 부악로 98',
    phone: '031-633-6688',
    specialties: ['영상의학과'],
    latitude: 37.2730,
    longitude: 127.4360,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=영상의학과의원'
  },
  {
    name: '이천검진센터',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 이섭대천로 170',
    phone: '031-634-5588',
    specialties: ['건강검진'],
    latitude: 37.2725,
    longitude: 127.4355,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=이천검진센터'
  },
  {
    name: '가정의학과의원',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 남천로 60',
    phone: '031-635-4488',
    specialties: ['가정의학과'],
    latitude: 37.2715,
    longitude: 127.4340,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=가정의학과의원'
  },
  {
    name: '이천응급의학과의원',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 부악로 110',
    phone: '031-636-3388',
    specialties: ['응급의학과'],
    latitude: 37.2740,
    longitude: 127.4370,
    has_emergency_room: true,
    open_24_hours: true,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=이천응급의학과의원'
  },
  {
    name: '비뇨의학과의원',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 중리천로 105',
    phone: '031-632-2288',
    specialties: ['비뇨의학과'],
    latitude: 37.2710,
    longitude: 127.4345,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=비뇨의학과의원'
  },
  {
    name: '정형외과의원',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 남천로 72',
    phone: '031-637-1188',
    specialties: ['정형외과'],
    latitude: 37.2705,
    longitude: 127.4335,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=정형외과의원'
  },
  {
    name: '마취통증의학과의원',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 이섭대천로 185',
    phone: '031-638-9988',
    specialties: ['마취통증의학과'],
    latitude: 37.2735,
    longitude: 127.4365,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=마취통증의학과의원'
  },
  {
    name: '성형외과의원',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 부악로 115',
    phone: '031-636-8877',
    specialties: ['성형외과'],
    latitude: 37.2745,
    longitude: 127.4375,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: true,
    image_url: 'https://via.placeholder.com/400x300?text=성형외과의원'
  },
  {
    name: '치료의원',
    type: '의원',
    region: '경기',
    city: '이천시',
    address: '경기도 이천시 중리천로 140',
    phone: '031-632-7766',
    specialties: ['물리치료'],
    latitude: 37.2720,
    longitude: 127.4350,
    has_emergency_room: false,
    open_24_hours: false,
    weekend_available: false,
    image_url: 'https://via.placeholder.com/400x300?text=치료의원'
  }
];

// 데이터 추가 함수
function addIcheonAdditionalClinics() {
  console.log('\n🏥 이천시 추가 의료기관 데이터 추가 시작...\n');

  let addedCount = 0;
  let skippedCount = 0;

  icheonAdditionalClinics.forEach((clinicData, index) => {
    // 중복 체크
    const existing = Hospital.getAll({ search: clinicData.name });
    const exactMatch = existing.find(h => h.name === clinicData.name);

    if (exactMatch) {
      console.log(`⏭️  [${index + 1}/${icheonAdditionalClinics.length}] 이미 존재: ${clinicData.name}`);
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

    console.log(`✅ [${index + 1}/${icheonAdditionalClinics.length}] 추가 완료: ${clinicData.name}`);
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

  // 이천시 의료기관 통계
  const icheonHospitals = Hospital.getAll({ region: '경기', city: '이천시' });
  const typeStats = {};
  icheonHospitals.forEach(h => {
    typeStats[h.type] = (typeStats[h.type] || 0) + 1;
  });

  console.log(`\n📍 이천시 의료기관: ${icheonHospitals.length}개`);
  Object.entries(typeStats).forEach(([type, count]) => {
    console.log(`   ${type}: ${count}개`);
  });

  console.log('\n✨ 이천시 추가 의료기관 데이터 추가가 완료되었습니다!');
  console.log('👉 http://localhost:5173/hospitals?region=경기&city=이천시 에서 확인하세요\n');

  // 전문과목별 통계 추가
  const specialtyStats = {};
  icheonHospitals.forEach(h => {
    if (h.specialties) {
      const specs = JSON.parse(h.specialties);
      specs.forEach(spec => {
        specialtyStats[spec] = (specialtyStats[spec] || 0) + 1;
      });
    }
  });

  console.log('📊 전문과목별 통계:');
  Object.entries(specialtyStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([specialty, count]) => {
      console.log(`   ${specialty}: ${count}개`);
    });

  console.log('\n💡 다음 단계:');
  console.log('1. 프론트엔드에서 http://localhost:5173/hospitals?region=경기&city=이천시 접속');
  console.log('2. 각 전문과목 필터를 선택하여 추가된 의료기관들을 확인할 수 있습니다');
}

// 스크립트 실행
addIcheonAdditionalClinics();
