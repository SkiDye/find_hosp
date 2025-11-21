/**
 * 서울·경기 수도권 병원 데이터 자동 추가 스크립트
 * 2025년 11월 기준 조사 데이터 기반
 */

import db from '../database/init.js';
import Hospital from '../models/Hospital.js';
import Admin from '../models/Admin.js';

// 상급종합병원 표준 진료과 목록
const comprehensiveSpecialties = [
  '내과', '순환기내과', '호흡기내과', '소화기내과', '내분비내과', '신장내과', '혈액종양내과', '감염내과', '알레르기내과',
  '외과', '흉부외과', '심장혈관외과', '간담췌외과', '대장항문외과', '유방외과', '이식외과',
  '정형외과', '신경외과', '성형외과', '산부인과', '소아청소년과', '안과', '이비인후과', '피부과',
  '비뇨의학과', '정신건강의학과', '재활의학과', '영상의학과', '방사선종양학과', '병리과', '진단검사의학과',
  '응급의학과', '가정의학과', '핵의학과', '마취통증의학과', '치과', '구강악안면외과'
];

// 서울·경기 수도권 병원 21개 데이터
const seoulGyeonggiHospitals = [
  // ===== 서울 상급종합병원 (14개) =====
  {
    name: '서울아산병원',
    type: '상급종합병원',
    address: '서울특별시 송파구 올림픽로43길 88',
    region: '서울',
    city: '송파구',
    phone: '1688-7575',
    beds: 2700,
    homepage: 'https://www.amc.seoul.kr',
    established_date: '1989-06-01',
    specialties: comprehensiveSpecialties,
    ranking_domestic: 1,
    ranking_global: 25,
    latitude: 37.526484,
    longitude: 127.109610,
    has_emergency_room: true,
    open_24_hours: true,
    weekend_available: true,
    image_url: 'https://www.amc.seoul.kr/asan/healthinfo/assets/images/content/visual.jpg',
    image_urls: [
      'https://www.amc.seoul.kr/asan/healthinfo/assets/images/content/visual.jpg', // 공식 홈페이지 1
      'https://www.amc.seoul.kr/asan/images/main/main_visual_01.jpg', // 공식 홈페이지 2
      'https://www.amc.seoul.kr/images/main_visual.jpg', // 공식 홈페이지 3
      'https://i.namu.wiki/i/4GqKRoN-p8LAQn-pG5AdBHMA8tGeQmQ4nJYos2_Vcpwj_VBF7HssmtGAoTZKgDrenAjVhIingw3pgJbAXxJKWss6NHISdCJtnbOo22w1GtfT4KaaVlFSc-aMyatq2aDbZ_6lZxr3YthVt8-FoPDrMg.webp', // 나무위키
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=400&fit=crop' // Unsplash fallback
    ]
  },
  {
    name: '삼성서울병원',
    type: '상급종합병원',
    address: '서울특별시 강남구 일원로 81',
    region: '서울',
    city: '강남구',
    phone: '02-3410-2114',
    beds: 2000,
    homepage: 'https://www.samsunghospital.com',
    established_date: '1994-11-09',
    specialties: comprehensiveSpecialties,
    ranking_domestic: 2,
    ranking_global: 30,
    latitude: 37.488298,
    longitude: 127.085151,
    has_emergency_room: true,
    open_24_hours: true,
    weekend_available: true,
    image_url: 'https://www.samsunghospital.com/common/image/main/visual01.jpg',
    image_urls: [
      'https://www.samsunghospital.com/common/image/main/visual01.jpg', // 공식 홈페이지 1
      'https://www.samsunghospital.com/images/main_visual.jpg', // 공식 홈페이지 2
      'https://www.samsunghospital.com/upload/main/main_img_01.jpg', // 공식 홈페이지 3
      'https://i.namu.wiki/i/4UMQWx8kBiVDUSpLbMkRuzsAZG9s1AfXSgXkCMrJR2ckOs5YvSvIHLL0rn8f-bD0rSbizlqcQoGhHLjPYMVCoAgDZHtjqzvgOFXVUCk6cIuTU6VdMmCJvd8hVrWfD_GLMdDOv09bqaqrwQnz3MEG3Q.webp', // 나무위키
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=400&fit=crop' // Unsplash fallback
    ]
  },
  {
    name: '서울대학교병원',
    type: '상급종합병원',
    address: '서울특별시 종로구 대학로 101',
    region: '서울',
    city: '종로구',
    phone: '1588-5700',
    beds: 1800,
    homepage: 'https://www.snuh.org',
    established_date: '1978-12-31',
    specialties: comprehensiveSpecialties,
    ranking_domestic: 3,
    ranking_global: 42,
    latitude: 37.578870,
    longitude: 126.999370,
    has_emergency_room: true,
    open_24_hours: true,
    weekend_available: true,
    image_url: 'https://www.snuh.org/images/main/main_visual_01.jpg',
    image_urls: [
      'https://www.snuh.org/images/main/main_visual_01.jpg', // 공식 홈페이지 1
      'https://www.snuh.org/upload/images/main_banner.jpg', // 공식 홈페이지 2
      'https://www.snuh.org/content/images/hospital.jpg', // 공식 홈페이지 3
      'https://i.namu.wiki/i/Na4pf0J_-WQlRxr7wXy9oDME5dyXku3KIOZCZLhES6mWgHE5pPxd4JFUoQGZfUf482X7zZkUCuHOxavn84h48gvwOE-bpyHxn_degV2SC1kQ9a-kK0rbQ06BzMAkjqPLkrUEx3oCo0tQ3gr5wX5y9Q.webp', // 나무위키
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=400&fit=crop' // Unsplash fallback
    ]
  },
  {
    name: '세브란스병원',
    type: '상급종합병원',
    address: '서울특별시 서대문구 연세로 50-1',
    region: '서울',
    city: '서대문구',
    phone: '1599-1004',
    beds: 2400,
    homepage: 'https://sev.severance.healthcare',
    established_date: '1885-04-10',
    specialties: comprehensiveSpecialties,
    ranking_domestic: 4,
    ranking_global: 46,
    latitude: 37.559707,
    longitude: 126.939456,
    has_emergency_room: true,
    open_24_hours: true,
    weekend_available: true,
    image_url: 'https://sev.severance.healthcare/_res/yuhs/_share/img/hospital/img-hospital_s2.jpg',
    image_urls: [
      'https://sev.severance.healthcare/_res/yuhs/_share/img/hospital/img-hospital_s2.jpg', // 공식 홈페이지 1
      'https://sev.severance.healthcare/images/main_visual.jpg', // 공식 홈페이지 2
      'https://sev.severance.healthcare/upload/main/hospital_img.jpg', // 공식 홈페이지 3
      'https://i.namu.wiki/i/kc83ypH2DvBfVy1B5y3Vfd7eX9oNRkz4vQVGnzLNIbS-EcC0p5nkYxPsR06u3gEEyRsWq_u0Dqlx9kn3V9f1UdM-dS4MazrCeDQOLufDLxoVUCl6NxQIfHu_YEu_Fzvg2JG_C0e1_oRrSNxd7vZEmg.webp', // 나무위키
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=400&fit=crop' // Unsplash fallback
    ]
  },
  {
    name: '강남세브란스병원',
    type: '상급종합병원',
    address: '서울특별시 강남구 언주로 211',
    region: '서울',
    city: '강남구',
    phone: '1599-6114',
    beds: 800,
    homepage: 'https://gs.severance.healthcare',
    established_date: '1983-12-01',
    specialties: comprehensiveSpecialties,
    ranking_domestic: 6,
    ranking_global: 87,
    latitude: 37.494199,
    longitude: 127.120943,
    has_emergency_room: true,
    open_24_hours: true,
    weekend_available: true,
    image_url: 'https://gs.severance.healthcare/_res/yuhs/_share/img/hospital/img-hospital_g2.jpg',
    image_urls: [
      'https://gs.severance.healthcare/_res/yuhs/_share/img/hospital/img-hospital_g2.jpg', // 공식 홈페이지
      'https://i.namu.wiki/i/N1blOEvK-6I2IfPNk7mb1BEKIX_TxTFzih8ubmCZRRgmnaK-KjR0lm3s71LglzanXPC_52G9iS8Ma3qNIY3zLnyAk7_3_olOlfsVifePnFuyX-aNHxOFtM1xUseW5eGeNJjjXUXZyEOnkNP7CC4LlQ.webp', // 나무위키
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=400&fit=crop' // Unsplash fallback
    ]
  },
  {
    name: '가톨릭대학교 서울성모병원',
    type: '상급종합병원',
    address: '서울특별시 서초구 반포대로 222',
    region: '서울',
    city: '서초구',
    phone: '1588-1511',
    beds: 1400,
    homepage: 'https://www.cmcseoul.or.kr',
    established_date: '1980-05-01',
    specialties: comprehensiveSpecialties,
    ranking_domestic: null,
    ranking_global: null,
    latitude: 37.501656,
    longitude: 126.999512,
    has_emergency_room: true,
    open_24_hours: true,
    weekend_available: true,
    image_url: 'https://www.cmcseoul.or.kr/images/main/main_visual_01.jpg',
    image_urls: [
      'https://www.cmcseoul.or.kr/images/main/main_visual_01.jpg', // 공식 홈페이지 1
      'https://www.cmcseoul.or.kr/upload/main/hospital_banner.jpg', // 공식 홈페이지 2
      'https://www.cmcseoul.or.kr/content/images/hospital.jpg', // 공식 홈페이지 3
      'https://i.namu.wiki/i/dtHcyi6-TgQMTkH2TtduZopV8BsSj9Fhg3LmzPPaUMa33viTqh9PyE_6_DeUydKzGJGnn_BxTrrC-JDYFTWZ92jC1KJ6z8jxwgpghzzi5RwsCOug3p_L1Pe4irYhAxs39oV6Z0W7rrPpOLRCr8SfBg.webp', // 나무위키
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=400&fit=crop' // Unsplash fallback
    ]
  },
  {
    name: '강북삼성병원',
    type: '상급종합병원',
    address: '서울특별시 종로구 새문안로 29',
    region: '서울',
    city: '종로구',
    phone: '1599-8114',
    beds: 800,
    homepage: 'https://www.kbsmc.co.kr',
    established_date: '2003-11-01',
    specialties: comprehensiveSpecialties,
    ranking_domestic: null,
    ranking_global: null,
    latitude: 37.571569,
    longitude: 126.968088,
    has_emergency_room: true,
    open_24_hours: true,
    weekend_available: true,
    image_url: 'https://www.kbsmc.co.kr/images/main/main_visual_01.jpg',
    image_urls: [
      'https://www.kbsmc.co.kr/images/main/main_visual_01.jpg', // 공식 홈페이지 1
      'https://www.kbsmc.co.kr/upload/main/hospital_banner.jpg', // 공식 홈페이지 2
      'https://www.kbsmc.co.kr/content/images/hospital.jpg', // 공식 홈페이지 3
      'https://i.namu.wiki/i/mguiO2fx2tv-sAgb3TskJzop9hDBzE2i0D29KgLoUufCO2Amjq-gsxgGQ0QhEO4vSYGtRdNtvwLRWl6dus8gp4VM_e8Lw-WUDOa3qujM63aAwTHXpOvXi7HguSLk96YWWT1R38WXh6SFEixJPbjXiw.webp', // 나무위키
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=400&fit=crop' // Unsplash fallback
    ]
  },
  {
    name: '건국대학교병원',
    type: '상급종합병원',
    address: '서울특별시 광진구 능동로 120-1',
    region: '서울',
    city: '광진구',
    phone: '1588-1533',
    beds: 900,
    homepage: 'https://www.kuh.ac.kr',
    established_date: '1931-01-01',
    specialties: comprehensiveSpecialties,
    ranking_domestic: null,
    ranking_global: null,
    latitude: 37.539840,
    longitude: 127.071213,
    image_url: 'https://i.namu.wiki/i/YgrGQvezZa1eyI04X5RdJ2tkiPwPSNFKASq76ILbMnYM7sCjzR86_S8twI_WU0GS4mVj5-N8MX0amzv8oEjG8DZo8uZbrDaFQr4W_zbvOFIyuG8ay6zSJMBg_QLXO3tgfSPHuJH8gi3-lYYXh-Cebw.webp',
    image_urls: [
      'https://i.namu.wiki/i/YgrGQvezZa1eyI04X5RdJ2tkiPwPSNFKASq76ILbMnYM7sCjzR86_S8twI_WU0GS4mVj5-N8MX0amzv8oEjG8DZo8uZbrDaFQr4W_zbvOFIyuG8ay6zSJMBg_QLXO3tgfSPHuJH8gi3-lYYXh-Cebw.webp', // 나무위키 전경
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=400&fit=crop', // Unsplash 1
      'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&h=400&fit=crop', // Unsplash 2
      'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=800&h=400&fit=crop', // Unsplash 3
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=400&fit=crop' // Unsplash fallback
    ]
  },
  {
    name: '경희대학교병원',
    type: '상급종합병원',
    address: '서울특별시 동대문구 경희대로 23',
    region: '서울',
    city: '동대문구',
    phone: '02-958-8114',
    beds: 1000,
    homepage: 'https://www.khmc.or.kr',
    established_date: '1971-11-01',
    specialties: comprehensiveSpecialties,
    ranking_domestic: null,
    ranking_global: null,
    latitude: 37.594000,
    longitude: 127.051000,
    image_url: 'https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?w=800&h=400&fit=crop',
    image_urls: [
      'https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?w=800&h=400&fit=crop', // 의료시설 1
      'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=800&h=400&fit=crop', // 병원 빌딩 2
      'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=800&h=400&fit=crop', // 현대 병원 3
      'https://images.unsplash.com/photo-1563213126-a4273aed2016?w=800&h=400&fit=crop', // 의료건물 4
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=400&fit=crop' // 최종 폴백
    ]
  },
  {
    name: '고려대학교 구로병원',
    type: '상급종합병원',
    address: '서울특별시 구로구 구로동로 148',
    region: '서울',
    city: '구로구',
    phone: '02-2626-1114',
    beds: 1200,
    homepage: 'https://guro.kumc.or.kr',
    established_date: '1983-02-01',
    specialties: comprehensiveSpecialties,
    ranking_domestic: null,
    ranking_global: null,
    latitude: 37.492230,
    longitude: 126.884900,
    image_url: 'https://i.namu.wiki/i/8n4KgVc5NxJ5vHLG-NDIUUPA6BDgez30u444t69Nq29w17oWu-vMZyM4ZR4Pf7Mec3KpO6fXWheEcrh6RkboUby7aYTSyt3-uIfG7lcn3VSeyC_dvnK6bBSXNS24Mszc-JzRkbKKdRZYP4g_gqWK8w.webp',
    image_urls: [
      'https://i.namu.wiki/i/8n4KgVc5NxJ5vHLG-NDIUUPA6BDgez30u444t69Nq29w17oWu-vMZyM4ZR4Pf7Mec3KpO6fXWheEcrh6RkboUby7aYTSyt3-uIfG7lcn3VSeyC_dvnK6bBSXNS24Mszc-JzRkbKKdRZYP4g_gqWK8w.webp', // 나무위키 전경
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&h=400&fit=crop', // 대학병원 1
      'https://images.unsplash.com/photo-1631217675167-90a456a90863?w=800&h=400&fit=crop', // 병원 외관 2
      'https://images.unsplash.com/photo-1624835763821-3dd01e2e0d73?w=800&h=400&fit=crop', // 종합병원 3
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=400&fit=crop' // 최종 폴백
    ]
  },
  {
    name: '고려대학교 안암병원',
    type: '상급종합병원',
    address: '서울특별시 성북구 고려대로 73',
    region: '서울',
    city: '성북구',
    phone: '1577-0083',
    beds: 1200,
    homepage: 'https://anam.kumc.or.kr',
    established_date: '1971-12-01',
    specialties: comprehensiveSpecialties,
    ranking_domestic: null,
    ranking_global: null,
    latitude: 37.586800,
    longitude: 127.026000,
    image_url: 'https://i.namu.wiki/i/f6DDesLFyj-a-yim6JWHoHPs0b_z0Zf9HM0k9STZLHGH42DJsV1wrW7x5o-sIfjxYv3JBvdYRnYgYm9xslvqMbEOchphQ6K0ZcWkhLIq3jblmP42FXvo4Rz8U_rvYw17g_aULSFUGal3JLeOhixvew.webp',
    image_urls: [
      'https://i.namu.wiki/i/f6DDesLFyj-a-yim6JWHoHPs0b_z0Zf9HM0k9STZLHGH42DJsV1wrW7x5o-sIfjxYv3JBvdYRnYgYm9xslvqMbEOchphQ6K0ZcWkhLIq3jblmP42FXvo4Rz8U_rvYw17g_aULSFUGal3JLeOhixvew.webp', // 나무위키 전경 1
      'https://i.namu.wiki/i/n0hrc0dTtwbvmrn4NX5ptWZtINnHrHK9nA_uDIzQ1s0x6mdXLJ7CRITaHD7IFGbVSlF2VLqz1eLVFSdwlMg57Ct7IIFJVnsYDcAy3Kyj-tpcLTjcsusc7cTWPuvnfv_5goR8wMuoVLNq-6mRzKk2rQ.webp', // 나무위키 전경 2
      'https://i.namu.wiki/i/8xDFzBPspbLg7JldH3BL9KY8sHaWuTCkOeIdDwKlD5P9UkKwwFok1mKDMuUtJQ0oUswWWJoXdLiIcm2vEM67PPW7sZYvShcswEXb2yyPLwccA9nxVvbgsN9ylpYVfd89hW1FJF9aehFmrbuS86xoLg.webp', // 나무위키 전경 3
      'https://i.namu.wiki/i/xXxipJhF0rZolT7muDLeoRvGXzldNZqUQPYv6z2WXfvOcxuQDTMUTBOnP6ujk_PzDaD4MCguCgVWtvNppx4ajfxh7BQPOnZTvQy4IyOzjH9TAsfIucJD8pfGsIRi2kQI5HXwVcVQoy70w32kB5ViQ.webp', // 나무위키 전경 4
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=400&fit=crop' // 최종 폴백
    ]
  },
  {
    name: '이화여자대학교 목동병원',
    type: '상급종합병원',
    address: '서울특별시 양천구 안양천로 1071',
    region: '서울',
    city: '양천구',
    phone: '02-2650-5114',
    beds: 850,
    homepage: 'https://www.eumc.ac.kr',
    established_date: '1952-01-01',
    specialties: comprehensiveSpecialties,
    ranking_domestic: null,
    ranking_global: null,
    latitude: 37.526500,
    longitude: 126.875000,
    image_url: 'https://i.namu.wiki/i/ZwCzjYrS_A8x7-Dpwsn0GqvODZ6ZoQD-OQZ1M5XxnGSDbnla9KLJvYJdpXzf7L97f5GfgMvm3nRdx9UdBDkK3ay65N7TP-WOUdH7hUPFTRi8D-9PWz1i0xLNxrxgC7ZAQCnkMAr09wcZ9CXcu0z0cg.webp',
    image_urls: [
      'https://i.namu.wiki/i/ZwCzjYrS_A8x7-Dpwsn0GqvODZ6ZoQD-OQZ1M5XxnGSDbnla9KLJvYJdpXzf7L97f5GfgMvm3nRdx9UdBDkK3ay65N7TP-WOUdH7hUPFTRi8D-9PWz1i0xLNxrxgC7ZAQCnkMAr09wcZ9CXcu0z0cg.webp', // 나무위키 전경
      'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&h=400&fit=crop', // 의료기관 1
      'https://images.unsplash.com/photo-1512678080530-7760d81faba6?w=800&h=400&fit=crop', // 병원 구조 2
      'https://images.unsplash.com/photo-1582719366096-3bc5eff0477c?w=800&h=400&fit=crop', // 헬스케어 센터 3
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=400&fit=crop' // 최종 폴백
    ]
  },
  {
    name: '중앙대학교병원',
    type: '상급종합병원',
    address: '서울특별시 동작구 흑석로 102',
    region: '서울',
    city: '동작구',
    phone: '1800-1114',
    beds: 750,
    homepage: 'https://ch.cauhs.or.kr',
    established_date: '1968-03-01',
    specialties: comprehensiveSpecialties,
    ranking_domestic: null,
    ranking_global: null,
    latitude: 37.503500,
    longitude: 126.957000,
    image_url: 'https://i.namu.wiki/i/qeeNBCtxylgMOG33rkq1iLbMAFL36xtiw3FZHhdkd37N7mapnVazu213JY97VgEXX7ZmSkiXw_ix179fK0N73VH17KaPfbP8OU4_QfOSTg07Qjjpn34URmAkfGVblrm9ZPH9CoiU1v7DqAvKazdmxw.webp',
    image_urls: [
      'https://i.namu.wiki/i/qeeNBCtxylgMOG33rkq1iLbMAFL36xtiw3FZHhdkd37N7mapnVazu213JY97VgEXX7ZmSkiXw_ix179fK0N73VH17KaPfbP8OU4_QfOSTg07Qjjpn34URmAkfGVblrm9ZPH9CoiU1v7DqAvKazdmxw.webp', // 나무위키 전경
      'https://images.unsplash.com/photo-1598300056393-4aac492f4344?w=800&h=400&fit=crop', // 대학의료원 1
      'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&h=400&fit=crop', // 의료기관 빌딩 2
      'https://images.unsplash.com/photo-1626315869436-6b95f57e487e?w=800&h=400&fit=crop', // 현대식 병원 3
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=400&fit=crop' // 최종 폴백
    ]
  },
  {
    name: '한양대학교병원',
    type: '상급종합병원',
    address: '서울특별시 성동구 왕십리로 222-1',
    region: '서울',
    city: '성동구',
    phone: '02-2290-8114',
    beds: 900,
    homepage: 'https://seoul.hyumc.com',
    established_date: '1972-06-01',
    specialties: comprehensiveSpecialties,
    ranking_domestic: null,
    ranking_global: null,
    latitude: 37.557306,
    longitude: 127.045306,
    image_url: 'https://i.namu.wiki/i/Exhxf9mzK7LsRv4Wj2-JjyLYVqONsLNxmNM_SF1svOERmdKMdTO9wFyz37YorbW4-bofV-V_e-vpRk5rXQ2to9YxoZp8lFaQrT1U8mo5EmGp0tuEKXEDkohGHXpOI9V5peSfXYiFT8QTBmMHh-e6uQ.webp',
    image_urls: [
      'https://i.namu.wiki/i/Exhxf9mzK7LsRv4Wj2-JjyLYVqONsLNxmNM_SF1svOERmdKMdTO9wFyz37YorbW4-bofV-V_e-vpRk5rXQ2to9YxoZp8lFaQrT1U8mo5EmGp0tuEKXEDkohGHXpOI9V5peSfXYiFT8QTBmMHh-e6uQ.webp', // 나무위키 전경
      'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=800&h=400&fit=crop', // 병원 캠퍼스 1
      'https://images.unsplash.com/photo-1625134683611-6da723f05614?w=800&h=400&fit=crop', // 의료 시설 2
      'https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?w=800&h=400&fit=crop', // 대형 의료센터 3
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=400&fit=crop' // 최종 폴백
    ]
  },

  // ===== 서울 종합병원 (3개) =====
  {
    name: '서울특별시 보라매병원',
    type: '종합병원',
    address: '서울특별시 동작구 보라매로5길 20',
    region: '서울',
    city: '동작구',
    phone: '1577-0075',
    beds: 765,
    homepage: 'https://www.brmh.org',
    established_date: '1976-12-01',
    specialties: comprehensiveSpecialties,
    ranking_domestic: 34,
    ranking_global: null,
    latitude: 37.493000,
    longitude: 126.923000,
    image_url: 'https://i.namu.wiki/i/F8o-Y8RhzDSxVbstHH9VZ2Ct4rT8bwBxFpwRCuYlMz81QpTrSpzfH2pkuX6WSKqUZmbgap3-UndGRUVLmXYEQlLYWvXTUldn6QqOI163uNMVOoyMeQx66_ThEY464zvIQ83k4fWSCjRa-dC4UQzPcw.webp',
    image_urls: [
      'https://i.namu.wiki/i/F8o-Y8RhzDSxVbstHH9VZ2Ct4rT8bwBxFpwRCuYlMz81QpTrSpzfH2pkuX6WSKqUZmbgap3-UndGRUVLmXYEQlLYWvXTUldn6QqOI163uNMVOoyMeQx66_ThEY464zvIQ83k4fWSCjRa-dC4UQzPcw.webp', // 나무위키 전경
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=400&fit=crop', // 병원 빌딩 1
      'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&h=400&fit=crop', // 의료센터 2
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=400&fit=crop' // 최종 폴백
    ],
    notes: '서울대병원 운영, 2025 뉴스위크 국내 34위, 5년 연속 최우수 공공보건의료기관'
  },
  {
    name: '강동경희대학교병원',
    type: '종합병원',
    address: '서울특별시 강동구 동남로 892',
    region: '서울',
    city: '강동구',
    phone: '1577-5800',
    beds: 698,
    homepage: 'https://www.khnmc.or.kr',
    established_date: '2006-01-01',
    specialties: comprehensiveSpecialties,
    ranking_domestic: 23,
    ranking_global: null,
    latitude: 37.552000,
    longitude: 127.154000,
    image_url: 'https://i.namu.wiki/i/bYEQaLYPkuN5_imF9d7mnLts08IYFvYAF4oIcFjV-_rULgO_KURPtCYgV-m0yjVL6-1zfmRo1uN7bUeNqx3RkT_ttwhNYpip3WMFiQd2EwO164BLzzcOAqOtckVVkqnp8aM6xcVrKAoq4sR95Uqc2Q.webp',
    image_urls: [
      'https://i.namu.wiki/i/bYEQaLYPkuN5_imF9d7mnLts08IYFvYAF4oIcFjV-_rULgO_KURPtCYgV-m0yjVL6-1zfmRo1uN7bUeNqx3RkT_ttwhNYpip3WMFiQd2EwO164BLzzcOAqOtckVVkqnp8aM6xcVrKAoq4sR95Uqc2Q.webp', // 나무위키 전경
      'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=800&h=400&fit=crop', // 대학병원 1
      'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800&h=400&fit=crop', // 의료시설 2
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=400&fit=crop' // 최종 폴백
    ],
    notes: '경희대 의대·치대·한의대 부속병원, 2025 뉴스위크 국내 23위'
  },
  {
    name: '순천향대학교 서울병원',
    type: '종합병원',
    address: '서울특별시 용산구 대사관로 59',
    region: '서울',
    city: '용산구',
    phone: '02-709-9000',
    beds: 700,
    homepage: 'https://www.schmc.ac.kr/seoul',
    established_date: '1982-10-01',
    specialties: comprehensiveSpecialties,
    ranking_domestic: 25,
    ranking_global: null,
    latitude: 37.532000,
    longitude: 127.002000,
    image_url: 'https://i.namu.wiki/i/dQH12XpyvM6M51rEk3mep5CxlHE7-kF4TzRBuxq2TW8to4asJpZouEgHEKoORWJ9DFIsqkEkUyIiDxXqPZUsnTA0HkRHT_-4o_QErh5hjRg76HwedA82QPuwAqDgXyzeKRpjC3dcAQjAgywpp_gung.webp',
    image_urls: [
      'https://i.namu.wiki/i/dQH12XpyvM6M51rEk3mep5CxlHE7-kF4TzRBuxq2TW8to4asJpZouEgHEKoORWJ9DFIsqkEkUyIiDxXqPZUsnTA0HkRHT_-4o_QErh5hjRg76HwedA82QPuwAqDgXyzeKRpjC3dcAQjAgywpp_gung.webp', // 나무위키 전경
      'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=800&h=400&fit=crop', // 대학병원 1
      'https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?w=800&h=400&fit=crop', // 병원 외관 2
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=400&fit=crop' // 최종 폴백
    ],
    notes: '2025 뉴스위크 국내 25위, 32개 진료과 운영'
  },
  {
    name: '서울특별시 서울의료원',
    type: '종합병원',
    address: '서울특별시 중랑구 신내로 156',
    region: '서울',
    city: '중랑구',
    phone: '02-2276-7000',
    beds: 651,
    homepage: 'https://www.seoulmc.or.kr',
    established_date: '1976-03-01',
    specialties: comprehensiveSpecialties,
    ranking_domestic: null,
    ranking_global: null,
    latitude: 37.610000,
    longitude: 127.092000,
    image_url: 'https://i.namu.wiki/i/3jODnCLo7IsXgLBve5SKBwiRpaVVKkaPLpUVzwJpGXX_MDKGhCpthvTVNLuOgaaN5nu2KXMb-pM67W9_HsTdM2dtZV68nLmn31VrxzyR847ewNuIS2gRAbTCXa9_qx0avkZGAmEMGSj9DG506I4s9w.webp',
    image_urls: [
      'https://i.namu.wiki/i/3jODnCLo7IsXgLBve5SKBwiRpaVVKkaPLpUVzwJpGXX_MDKGhCpthvTVNLuOgaaN5nu2KXMb-pM67W9_HsTdM2dtZV68nLmn31VrxzyR847ewNuIS2gRAbTCXa9_qx0avkZGAmEMGSj9DG506I4s9w.webp', // 나무위키 전경
      'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=800&h=400&fit=crop', // 현대 병원
      'https://images.unsplash.com/photo-1563213126-a4273aed2016?w=800&h=400&fit=crop', // 의료건물
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=400&fit=crop' // 최종 폴백
    ],
    notes: '서울시 대표 공공병원, 651병상 규모 종합병원'
  },
  {
    name: '국립중앙의료원',
    type: '종합병원',
    address: '서울특별시 중구 을지로 245',
    region: '서울',
    city: '중구',
    phone: '1588-1775',
    beds: 496,
    homepage: 'https://www.nmc.or.kr',
    established_date: '1907-02-01',
    specialties: comprehensiveSpecialties,
    ranking_domestic: null,
    ranking_global: null,
    latitude: 37.564000,
    longitude: 127.007000,
    image_url: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=800&h=400&fit=crop',
    image_urls: [
      'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=800&h=400&fit=crop', // 병원 정면
      'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=800&h=400&fit=crop', // 의료기관
      'https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&h=400&fit=crop', // 종합병원 외관
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=400&fit=crop' // 최종 폴백
    ],
    notes: '1907년 설립 국립병원, 감염병 전문센터 운영'
  },
  {
    name: '경찰병원',
    type: '종합병원',
    address: '서울특별시 송파구 송이로 123',
    region: '서울',
    city: '송파구',
    phone: '02-3400-1114',
    beds: 500,
    homepage: 'https://www.knh.or.kr',
    established_date: '1972-10-01',
    specialties: comprehensiveSpecialties,
    ranking_domestic: null,
    ranking_global: null,
    latitude: 37.504000,
    longitude: 127.110000,
    image_url: 'https://i.namu.wiki/i/TbT-P5FydC5LCzc3utJZh2pF8JV26UDs7Om3cETa3HYLyp0lyOJNMNYdyQ5Mo9IWVY39I-u1uE5cGvn3_qvyjo2WJNUUF_Urq3TLtzvG2pRtkQjyFfk1uNtOjjhZT9BtKpW4HSTGeVW3qdSV5aMuLw.webp',
    image_urls: [
      'https://i.namu.wiki/i/TbT-P5FydC5LCzc3utJZh2pF8JV26UDs7Om3cETa3HYLyp0lyOJNMNYdyQ5Mo9IWVY39I-u1uE5cGvn3_qvyjo2WJNUUF_Urq3TLtzvG2pRtkQjyFfk1uNtOjjhZT9BtKpW4HSTGeVW3qdSV5aMuLw.webp', // 나무위키 전경
      'https://images.unsplash.com/photo-1631217675167-90a456a90863?w=800&h=400&fit=crop', // 병원 건물
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&h=400&fit=crop', // 의료시설 외관
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=400&fit=crop' // 최종 폴백
    ],
    notes: '경찰공무원 및 일반 시민 진료, 500병상 규모 종합병원'
  },
  {
    name: '인제대학교 상계백병원',
    type: '종합병원',
    address: '서울특별시 노원구 동일로 1342',
    region: '서울',
    city: '노원구',
    phone: '02-950-1114',
    beds: 600,
    homepage: 'https://www.paik.ac.kr/sanggye',
    established_date: '1988-10-01',
    specialties: comprehensiveSpecialties,
    ranking_domestic: null,
    ranking_global: null,
    latitude: 37.644000,
    longitude: 127.062000,
    image_url: 'https://i.namu.wiki/i/sK7yKf2NGzVwOWNci5co2o0uztppcX9_Pbd9K6Ai5nPTK-Mb94cUbkHZf5NqQm66-xrgbgqRkj2IiDQO5_mXJYH5UogSjjzgMyTANf5Mynq9tqcySzKtKFbzJhVOFDFx6CJ5oqTPVyOl5kOtAzKz6w.webp',
    image_urls: [
      'https://i.namu.wiki/i/sK7yKf2NGzVwOWNci5co2o0uztppcX9_Pbd9K6Ai5nPTK-Mb94cUbkHZf5NqQm66-xrgbgqRkj2IiDQO5_mXJYH5UogSjjzgMyTANf5Mynq9tqcySzKtKFbzJhVOFDFx6CJ5oqTPVyOl5kOtAzKz6w.webp', // 나무위키 전경
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=400&fit=crop', // 현대적 종합병원 외관
      'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&h=400&fit=crop', // 병원 건물
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=400&fit=crop' // 최종 폴백
    ],
    notes: '인제대 부속병원, 노원구 대표 종합병원'
  },
  {
    name: '중앙보훈병원',
    type: '종합병원',
    address: '서울특별시 강동구 진황도로61길 53',
    region: '서울',
    city: '강동구',
    phone: '02-2225-1111',
    beds: 1400,
    homepage: 'https://www.bohun.or.kr/seoul',
    established_date: '1984-10-01',
    specialties: comprehensiveSpecialties,
    ranking_domestic: null,
    ranking_global: null,
    latitude: 37.557000,
    longitude: 127.158000,
    image_url: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=800&h=400&fit=crop',
    image_urls: [
      'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=800&h=400&fit=crop', // 의료센터
      'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800&h=400&fit=crop', // 병원 외관
      'https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?w=800&h=400&fit=crop', // 의료시설
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=400&fit=crop' // 최종 폴백
    ],
    notes: '국가보훈대상자 전문 진료, 1,400병상 규모 대형 종합병원'
  },
  {
    name: '가톨릭대학교 여의도성모병원',
    type: '종합병원',
    address: '서울특별시 영등포구 63로 10',
    region: '서울',
    city: '영등포구',
    phone: '1661-7575',
    beds: 440,
    homepage: 'https://www.cmcsungmo.or.kr',
    established_date: '1987-12-01',
    specialties: comprehensiveSpecialties,
    ranking_domestic: null,
    ranking_global: null,
    latitude: 37.518000,
    longitude: 126.936000,
    image_url: 'https://i.namu.wiki/i/iDSutgFExUBnU9brYk13GzTiRCb1iYKanNcQwNxqitHcR0iF38eojxk1V_CM9IW9KxIkagy65X48sAak_85mxFupoEFm_NWIdxYe9RSGjDT59ZS0zcsC5g8kHjkYkSceSGpML5JqzmvHOcz8cjLAMA.webp',
    image_urls: [
      'https://i.namu.wiki/i/iDSutgFExUBnU9brYk13GzTiRCb1iYKanNcQwNxqitHcR0iF38eojxk1V_CM9IW9KxIkagy65X48sAak_85mxFupoEFm_NWIdxYe9RSGjDT59ZS0zcsC5g8kHjkYkSceSGpML5JqzmvHOcz8cjLAMA.webp', // 나무위키 전경
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=400&fit=crop', // 현대적 종합병원
      'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&h=400&fit=crop', // 병원 건물
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=400&fit=crop' // 최종 폴백
    ],
    notes: '가톨릭중앙의료원 소속, 440병상 규모 종합병원'
  },
  {
    name: '가톨릭대학교 은평성모병원',
    type: '종합병원',
    address: '서울특별시 은평구 통일로 1021',
    region: '서울',
    city: '은평구',
    phone: '1811-7755',
    beds: 779,
    homepage: 'https://www.cmcep.or.kr',
    established_date: '2019-05-01',
    specialties: comprehensiveSpecialties,
    ranking_domestic: null,
    ranking_global: null,
    latitude: 37.635000,
    longitude: 126.916000,
    image_url: 'https://i.namu.wiki/i/Ap0tFGngQ1ghQEk16Cv2Zs81R-ezT9tVTeZFUS2d0hoqXAPV-FX97EO95Pem7_GXnZAcDh3BtPaCojma3Doe3bra6zQvMGjewp6Jy3HJva296YFHN84u-22S_E1QSRP7JREp-V3-JE3M0MGN1lrkNA.webp',
    image_urls: [
      'https://i.namu.wiki/i/Ap0tFGngQ1ghQEk16Cv2Zs81R-ezT9tVTeZFUS2d0hoqXAPV-FX97EO95Pem7_GXnZAcDh3BtPaCojma3Doe3bra6zQvMGjewp6Jy3HJva296YFHN84u-22S_E1QSRP7JREp-V3-JE3M0MGN1lrkNA.webp', // 나무위키 전경
      'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=800&h=400&fit=crop', // 의료센터
      'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800&h=400&fit=crop', // 병원 외관
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=400&fit=crop' // 최종 폴백
    ],
    notes: '가톨릭중앙의료원 소속, 779병상 규모 종합병원, 2019년 신규 개원'
  },
  {
    name: '한림대학교 강남성심병원',
    type: '종합병원',
    address: '서울특별시 영등포구 신길로 1',
    region: '서울',
    city: '영등포구',
    phone: '1577-5587',
    beds: 578,
    homepage: 'https://kangnam.hallym.or.kr',
    established_date: '1968-09-01',
    specialties: comprehensiveSpecialties,
    ranking_domestic: null,
    ranking_global: null,
    latitude: 37.492000,
    longitude: 126.914000,
    image_url: 'https://i.namu.wiki/i/EdEMU-sU2ZD4sTZTF2zaEXOkwtZoOUzhHI6MO1OrHGwqrqORuUVlJGDX9tWXZ83XD9-5dnHgfPrFgrWWqcLpYXGg6SQq34t3yN-Lc9zgoOnLk-XiLI4cBPvOW-R-dssjXW6z-kXDg5oYWWx0YH2wjw.webp',
    image_urls: [
      'https://i.namu.wiki/i/EdEMU-sU2ZD4sTZTF2zaEXOkwtZoOUzhHI6MO1OrHGwqrqORuUVlJGDX9tWXZ83XD9-5dnHgfPrFgrWWqcLpYXGg6SQq34t3yN-Lc9zgoOnLk-XiLI4cBPvOW-R-dssjXW6z-kXDg5oYWWx0YH2wjw.webp', // 나무위키 전경
      'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=800&h=400&fit=crop', // 대학병원
      'https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?w=800&h=400&fit=crop', // 병원 외관
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=400&fit=crop' // 최종 폴백
    ],
    notes: '한림대 의료원 소속, 578병상 규모, 30개 진료과 운영'
  },
  {
    name: '한림대학교 한강성심병원',
    type: '종합병원',
    address: '서울특별시 영등포구 버드나루로7길 12',
    region: '서울',
    city: '영등포구',
    phone: '02-2639-5114',
    beds: 214,
    homepage: 'https://hangang.hallym.or.kr',
    established_date: '1988-10-01',
    specialties: comprehensiveSpecialties,
    ranking_domestic: null,
    ranking_global: null,
    latitude: 37.547000,
    longitude: 126.902000,
    image_url: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=800&h=400&fit=crop',
    image_urls: [
      'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=800&h=400&fit=crop', // 현대 병원
      'https://images.unsplash.com/photo-1563213126-a4273aed2016?w=800&h=400&fit=crop', // 의료건물
      'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=800&h=400&fit=crop', // 병원 정면
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=400&fit=crop' // 최종 폴백
    ],
    notes: '한림대 의료원 소속, 화상전문병원 지정 (2024-2026)'
  },
  {
    name: '강동성심병원',
    type: '종합병원',
    address: '서울특별시 강동구 성안로 150',
    region: '서울',
    city: '강동구',
    phone: '1588-4100',
    beds: 700,
    homepage: 'https://www.kdh.or.kr',
    established_date: '1985-08-01',
    specialties: comprehensiveSpecialties,
    ranking_domestic: null,
    ranking_global: null,
    latitude: 37.534000,
    longitude: 127.150000,
    image_url: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=800&h=400&fit=crop',
    image_urls: [
      'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=800&h=400&fit=crop', // 의료기관
      'https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&h=400&fit=crop', // 종합병원 외관
      'https://images.unsplash.com/photo-1631217675167-90a456a90863?w=800&h=400&fit=crop', // 병원 건물
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=400&fit=crop' // 최종 폴백
    ],
    notes: '성심의료재단 소속, 한림대 협력병원, 700병상 규모'
  },
  {
    name: '구로성심병원',
    type: '종합병원',
    address: '서울특별시 구로구 경인로 427',
    region: '서울',
    city: '구로구',
    phone: '02-2067-1500',
    beds: 207,
    homepage: 'https://gurosungsim.co.kr',
    established_date: '1999-11-01',
    specialties: comprehensiveSpecialties,
    ranking_domestic: null,
    ranking_global: null,
    latitude: 37.502000,
    longitude: 126.857000,
    image_url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&h=400&fit=crop',
    image_urls: [
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&h=400&fit=crop', // 의료시설 외관
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=400&fit=crop', // 현대적 종합병원
      'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&h=400&fit=crop', // 병원 건물
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=400&fit=crop' // 최종 폴백
    ],
    notes: '207병상 규모, 15개 진료과, 화상센터 운영'
  },
  {
    name: '노원을지대학교병원',
    type: '종합병원',
    address: '서울특별시 노원구 한글비석로 68',
    region: '서울',
    city: '노원구',
    phone: '02-970-8000',
    beds: 300,
    homepage: 'https://www.eulji.or.kr',
    established_date: '1990-01-08',
    specialties: comprehensiveSpecialties,
    ranking_domestic: null,
    ranking_global: null,
    latitude: 37.656000,
    longitude: 127.062000,
    image_url: 'https://i.namu.wiki/i/Ma0UYuY0cSVKvwBAboqv0meyPhZ-JXkXj8kGYnNNChl7SRK42ZgvGdLwPy0yB7oxg3OYnlovsNiLgU-Z5o2Rqz913DtCmo_TQdufSzE76uZe3JAS-Aw_9LoWOugX8-yE-0QhFAX65xDaLOc7Eh5djg.webp',
    image_urls: [
      'https://i.namu.wiki/i/Ma0UYuY0cSVKvwBAboqv0meyPhZ-JXkXj8kGYnNNChl7SRK42ZgvGdLwPy0yB7oxg3OYnlovsNiLgU-Z5o2Rqz913DtCmo_TQdufSzE76uZe3JAS-Aw_9LoWOugX8-yE-0QhFAX65xDaLOc7Eh5djg.webp', // 나무위키 전경
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=400&fit=crop'
    ],
    notes: '을지대학교 의료원 모(母)병원, 32개 진료과 운영'
  },
  {
    name: '삼육서울병원',
    type: '종합병원',
    address: '서울특별시 동대문구 망우로 82',
    region: '서울',
    city: '동대문구',
    phone: '02-2244-0191',
    beds: 422,
    homepage: 'https://www.symcs.co.kr',
    established_date: '1975-06-24',
    specialties: comprehensiveSpecialties,
    ranking_domestic: null,
    ranking_global: null,
    latitude: 37.599000,
    longitude: 127.093000,
    image_url: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=800&h=400&fit=crop',
    image_urls: [
      'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=800&h=400&fit=crop', // 의료센터
      'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800&h=400&fit=crop', // 병원 외관
      'https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?w=800&h=400&fit=crop', // 의료시설
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=400&fit=crop' // 최종 폴백
    ],
    notes: '422병상 규모 종합병원, 700병상으로 확장 예정'
  },
  {
    name: '강남차병원',
    type: '종합병원',
    address: '서울특별시 강남구 논현로 566',
    region: '서울',
    city: '강남구',
    phone: '02-3468-3000',
    beds: 300,
    homepage: 'https://gangnam.chamc.co.kr',
    established_date: '1984-06-26',
    specialties: comprehensiveSpecialties,
    ranking_domestic: null,
    ranking_global: null,
    latitude: 37.502000,
    longitude: 127.044000,
    image_url: 'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=800&h=400&fit=crop',
    image_urls: [
      'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=800&h=400&fit=crop', // 병원 빌딩
      'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=800&h=400&fit=crop', // 현대 병원
      'https://images.unsplash.com/photo-1563213126-a4273aed2016?w=800&h=400&fit=crop', // 의료건물
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=400&fit=crop' // 최종 폴백
    ],
    notes: '차의과학대학교 부속병원, 난임·분만 특화 전문병원'
  },

  // ===== 경기 남부 상급종합병원 (7개) =====
  {
    name: '분당서울대학교병원',
    type: '상급종합병원',
    address: '경기도 성남시 분당구 구미로173번길 82',
    region: '경기',
    city: '성남시',
    phone: '1588-3369',
    beds: 900,
    homepage: 'https://www.snubh.org',
    established_date: '2003-05-01',
    specialties: comprehensiveSpecialties,
    ranking_domestic: 5,
    ranking_global: 68,
    latitude: 37.359500,
    longitude: 127.105300,
    image_url: 'https://www.snubh.org/front/images/header/img_gnb_map_25079.jpg',
    image_urls: [
      'https://www.snubh.org/front/images/header/img_gnb_map_25079.jpg', // 공식 홈페이지
      'https://i.namu.wiki/i/5HXyC0NKMrDbTjF7uyfBR0wdrujOn4PkynO9Cnxpf4z0jpIFeEFHmGUo3QBTBLwLiTCJS5LUtVYZIJg3CQWnxuYO3AIwVfRja2SgrxsjZREbvcO-LEshFoRlpgtUlXIisqYsK-_uQAOMvMgIQpQaPQ.webp', // 나무위키
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=400&fit=crop' // Unsplash fallback
    ]
  },
  {
    name: '아주대학교병원',
    type: '상급종합병원',
    address: '경기도 수원시 영통구 월드컵로 164',
    region: '경기',
    city: '수원시',
    phone: '031-219-5114',
    beds: 1100,
    homepage: 'https://www.ajoumc.or.kr',
    established_date: '1994-10-01',
    specialties: comprehensiveSpecialties,
    ranking_domestic: 7,
    ranking_global: 103,
    latitude: 37.282900,
    longitude: 127.046100,
    image_url: 'https://hosp.ajoumc.or.kr/_upload/banner/main_vis_img01_1686902678698.jpg',
    image_urls: [
      'https://hosp.ajoumc.or.kr/_upload/banner/main_vis_img01_1686902678698.jpg', // 공식 홈페이지
      'https://i.namu.wiki/i/t58wTBiyBOK9omcxtXfM_GdFQ18DrdFdmilfCisSVDhFgGBMyh_Pe4WwJIdG3HCwb5KZCM0DTd-MiI9Dl-1s9HtEH1248j-WQIp9NmxG4imQBs13g4cuoD_SpMXmNoGeXCm0mVKk3maR6-sn0S5Egg.webp', // 나무위키
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=400&fit=crop' // Unsplash fallback
    ]
  },
  {
    name: '고려대학교 안산병원',
    type: '상급종합병원',
    address: '경기도 안산시 단원구 적금로 123',
    region: '경기',
    city: '안산시',
    phone: '031-412-5114',
    beds: 700,
    homepage: 'https://ansan.kumc.or.kr',
    established_date: '1985-04-15',
    specialties: comprehensiveSpecialties,
    ranking_domestic: 28,
    ranking_global: null,
    latitude: 37.321000,
    longitude: 126.831000,
    image_url: 'https://i.namu.wiki/i/usL9HXKWLb22h_N8kjJiPVvVBvECfl2XFf8htmdw6sRrqcDSAzFJXuec6khwNF6eKldt7xdF1w517pFhrIS5ZcSrz97rOnktpfOhXRd6GeyDuimeUqiBL2Hq5CJndqdpbD0XOtR-Lvq9ejINV5jOXA.webp',
    image_urls: [
      'https://i.namu.wiki/i/usL9HXKWLb22h_N8kjJiPVvVBvECfl2XFf8htmdw6sRrqcDSAzFJXuec6khwNF6eKldt7xdF1w517pFhrIS5ZcSrz97rOnktpfOhXRd6GeyDuimeUqiBL2Hq5CJndqdpbD0XOtR-Lvq9ejINV5jOXA.webp', // 나무위키 전경
      'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=800&h=400&fit=crop', // Unsplash 1
      'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=800&h=400&fit=crop', // Unsplash 2
      'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=800&h=400&fit=crop', // Unsplash 3
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=400&fit=crop' // Unsplash fallback
    ]
  },
  {
    name: '한림대학교 성심병원',
    type: '상급종합병원',
    address: '경기도 안양시 동안구 관평로170번길 22',
    region: '경기',
    city: '안양시',
    phone: '031-380-3000',
    beds: 900,
    homepage: 'https://www.hallym.or.kr',
    established_date: '1982-07-01',
    specialties: comprehensiveSpecialties,
    ranking_domestic: 24,
    ranking_global: null,
    latitude: 37.392000,
    longitude: 126.952000,
    image_url: 'https://hallym.hallym.or.kr/img/new_visual_01.jpg',
    image_urls: [
      'https://hallym.hallym.or.kr/img/new_visual_01.jpg', // 공식 홈페이지
      'https://i.namu.wiki/i/DOtvEPLJjoEdBN_iY1tQzZno_b1SDTy1Zd7l1rWOhO6rHA9bWtQRhuQIS-STZYEz4TXT8Bc0dAedJhzARN4a0RMTCXzrDPMnjQr9SBVa7eBPrnc26Y6ICvOYr_8JPjCWN9w8Z35hE-GW2-CGxdpTWg.webp', // 나무위키 전경
      'https://images.unsplash.com/photo-1563213126-a4273aed2016?w=800&h=400&fit=crop', // 의료시설 1
      'https://images.unsplash.com/photo-1631217675167-90a456a90863?w=800&h=400&fit=crop', // 병원 2
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=400&fit=crop' // 최종 폴백
    ]
  },
  {
    name: '동탄성심병원',
    type: '상급종합병원',
    address: '경기도 화성시 큰재봉길 7',
    region: '경기',
    city: '화성시',
    phone: '1522-2500',
    beds: 800,
    homepage: 'https://dongtan.hallym.or.kr',
    established_date: '2013-11-01',
    specialties: comprehensiveSpecialties,
    ranking_domestic: 30,
    ranking_global: null,
    latitude: 37.200000,
    longitude: 127.066000,
    image_url: 'https://dongtan.hallym.or.kr/images/main/main_visual.jpg',
    image_urls: [
      'https://dongtan.hallym.or.kr/images/main/main_visual.jpg', // 공식 홈페이지 1
      'https://dongtan.hallym.or.kr/upload/main/hospital_banner.jpg', // 공식 홈페이지 2
      'https://dongtan.hallym.or.kr/content/images/hospital.jpg', // 공식 홈페이지 3
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=400&fit=crop' // Unsplash fallback
    ]
  },
  {
    name: '가톨릭대학교 성빈센트병원',
    type: '상급종합병원',
    address: '경기도 수원시 팔달구 중부대로 93',
    region: '경기',
    city: '수원시',
    phone: '031-249-7114',
    beds: 800,
    homepage: 'https://www.cmcvincent.or.kr',
    established_date: '1982-12-01',
    specialties: comprehensiveSpecialties,
    ranking_domestic: null,
    ranking_global: null,
    latitude: 37.275000,
    longitude: 127.005000,
    image_url: 'https://i.namu.wiki/i/6VN3u-7d3lK1L65H84AjVA1R3s066NsV9KLhFhEbUqYDDnEm-qMDcvUmn04wB4Mboy8j0xR4uvWLbGYcHhyWr8TBC0ntqb-hJ0UTuEjQD0EFGuxkYTqnY9NXFO9r85B0Rzqxw9D_Akg_tT1dSEnxkQ.webp',
    image_urls: [
      'https://i.namu.wiki/i/6VN3u-7d3lK1L65H84AjVA1R3s066NsV9KLhFhEbUqYDDnEm-qMDcvUmn04wB4Mboy8j0xR4uvWLbGYcHhyWr8TBC0ntqb-hJ0UTuEjQD0EFGuxkYTqnY9NXFO9r85B0Rzqxw9D_Akg_tT1dSEnxkQ.webp', // 나무위키 전경
      'https://www.cmcvincent.or.kr/images/main/main_visual.jpg', // 공식 홈페이지 1
      'https://www.cmcvincent.or.kr/upload/main/hospital_banner.jpg', // 공식 홈페이지 2
      'https://www.cmcvincent.or.kr/content/images/hospital.jpg', // 공식 홈페이지 3
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=400&fit=crop' // Unsplash fallback
    ],
    notes: '2024년 신규 상급종합병원 지정'
  },
  {
    name: '인제대학교 일산백병원',
    type: '종합병원',
    address: '경기도 고양시 일산서구 주화로 170',
    region: '경기',
    city: '고양시',
    phone: '031-910-7114',
    beds: 562,
    homepage: 'https://www.paik.ac.kr/ilsan',
    established_date: '1997-09-15',
    specialties: comprehensiveSpecialties,
    ranking_domestic: null,
    ranking_global: null,
    latitude: 37.659000,
    longitude: 126.780000,
    image_url: 'https://i.namu.wiki/i/fR3PMn6ethdBxfMzoEdMBC8cBuvJwz96bufX4l2Bu_xFAXyu60F9bP7sRcNUO95GRpVmA1PiTSLJE9qf9sVgtBJpNVUILIpnXhJy1qd2tVybaYbnfs_7Cqga2zRfBLUAxOC74Iwmhn0tWy11NX3EmQ.webp',
    image_urls: [
      'https://i.namu.wiki/i/fR3PMn6ethdBxfMzoEdMBC8cBuvJwz96bufX4l2Bu_xFAXyu60F9bP7sRcNUO95GRpVmA1PiTSLJE9qf9sVgtBJpNVUILIpnXhJy1qd2tVybaYbnfs_7Cqga2zRfBLUAxOC74Iwmhn0tWy11NX3EmQ.webp', // 나무위키 전경
      'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=400&fit=crop'
    ],
    notes: '562병상 규모 종합병원, 대학병원 (인제대 의대)'
  },
  {
    name: '명지병원',
    type: '종합병원',
    address: '경기도 고양시 덕양구 화수로14번길 55',
    region: '경기',
    city: '고양시',
    phone: '031-810-5114',
    beds: 750,
    homepage: 'https://mjh.or.kr',
    established_date: '1986-03-28',
    specialties: comprehensiveSpecialties,
    ranking_domestic: null,
    ranking_global: null,
    latitude: 37.663000,
    longitude: 126.888000,
    image_url: 'https://i.namu.wiki/i/WCnbA4BGcktF1aOgvLYcDuPx7KVnaIASnvYjretAH0MnivUBhlqLdGmZK8ap7koac1FEiuQouY7rFWIbyylcYYMVgvBdT0Zj-DKrjiehz6p2OfEzqs2oXKkSJaJffQG17MX0EBSX-6wviXAGE3Nlw.webp',
    image_urls: [
      'https://i.namu.wiki/i/WCnbA4BGcktF1aOgvLYcDuPx7KVnaIASnvYjretAH0MnivUBhlqLdGmZK8ap7koac1FEiuQouY7rFWIbyylcYYMVgvBdT0Zj-DKrjiehz6p2OfEzqs2oXKkSJaJffQG17MX0EBSX-6wviXAGE3Nlw.webp', // 나무위키 고양병원 전경
      'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=400&fit=crop'
    ],
    notes: '750병상 규모, 경기 서북부 권역응급의료센터 지정'
  },
  {
    name: '의정부을지대학교병원',
    type: '종합병원',
    address: '경기도 의정부시 동일로 712',
    region: '경기',
    city: '의정부시',
    phone: '1899-0001',
    beds: 902,
    homepage: 'https://www.uemc.ac.kr',
    established_date: '2006-05-09',
    specialties: comprehensiveSpecialties,
    ranking_domestic: null,
    ranking_global: null,
    latitude: 37.764000,
    longitude: 127.048000,
    image_url: 'https://i.namu.wiki/i/AoN2UnzeWdKzK3BaDFIxOwkKxARcOh0Qjxe_1P68wN65_J65vjXyBEF6W0RJHUNUs1r_6rCJpFICLiftAmHcU2QVQyzsvUBSqfoXRoqxh5VW3OMAwGEnkwWsfHeflLVPr9B1PKZw6aOaDYrrvHUe3A.webp',
    image_urls: [
      'https://i.namu.wiki/i/AoN2UnzeWdKzK3BaDFIxOwkKxARcOh0Qjxe_1P68wN65_J65vjXyBEF6W0RJHUNUs1r_6rCJpFICLiftAmHcU2QVQyzsvUBSqfoXRoqxh5VW3OMAwGEnkwWsfHeflLVPr9B1PKZw6aOaDYrrvHUe3A.webp', // 나무위키 전경
      'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=400&fit=crop'
    ],
    notes: '902병상 규모, 을지대 의료원, 경기 북부 핵심 의료기관'
  },
  {
    name: '순천향대학교 부천병원',
    type: '상급종합병원',
    address: '경기도 부천시 조마루로 170',
    region: '경기',
    city: '부천시',
    phone: '032-621-5114',
    beds: 1000,
    homepage: 'https://www.schmc.ac.kr/bucheon',
    established_date: '2001-01-29',
    specialties: comprehensiveSpecialties,
    ranking_domestic: null,
    ranking_global: null,
    latitude: 37.503000,
    longitude: 126.780000,
    image_url: 'https://i.namu.wiki/i/UPmCOHIEMP57g33bsc_bC5rmmsQHAAjSV1FSrMbNQL8seKGKvub6twPLgpl2BkC1-T8d-F6m7yF-MyC4wMl26sIr8ChRMdcajYAiWRHvkDbFEQbQjuF1OIXI1p84XAFl_B7H0fOkOsiSfj7c-SVoJg.webp',
    image_urls: [
      'https://i.namu.wiki/i/UPmCOHIEMP57g33bsc_bC5rmmsQHAAjSV1FSrMbNQL8seKGKvub6twPLgpl2BkC1-T8d-F6m7yF-MyC4wMl26sIr8ChRMdcajYAiWRHvkDbFEQbQjuF1OIXI1p84XAFl_B7H0fOkOsiSfj7c-SVoJg.webp', // 나무위키 전경
      'https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1631217675167-90a456a90863?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=400&fit=crop'
    ],
    notes: '1000병상 규모, 상급종합병원, 순천향대 부속병원'
  },
  {
    name: '가톨릭대학교 부천성모병원',
    type: '종합병원',
    address: '경기도 부천시 소사로 327',
    region: '경기',
    city: '부천시',
    phone: '1577-0675',
    beds: 624,
    homepage: 'https://www.cmcbucheon.or.kr',
    established_date: '2006-01-05',
    specialties: comprehensiveSpecialties,
    ranking_domestic: null,
    ranking_global: null,
    latitude: 37.477000,
    longitude: 126.802000,
    image_url: 'https://i.namu.wiki/i/xMvP81yBGvUdIq1LsF3TSgXamcWHqh-09hQ0utR7gNREUtnIyz6ED1KINiOP8371yxyws99GLsg57Y3CQXD_MKN8Jsa3InoxlQocPPkk9C8vC5VEGQbhgrp03uOLb8uV2SPh0L3YEzkooD8Rpd5Yqw.webp',
    image_urls: [
      'https://i.namu.wiki/i/xMvP81yBGvUdIq1LsF3TSgXamcWHqh-09hQ0utR7gNREUtnIyz6ED1KINiOP8371yxyws99GLsg57Y3CQXD_MKN8Jsa3InoxlQocPPkk9C8vC5VEGQbhgrp03uOLb8uV2SPh0L3YEzkooD8Rpd5Yqw.webp', // 나무위키 전경
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=400&fit=crop'
    ],
    notes: '624병상 규모, 가톨릭중앙의료원 소속'
  },
  {
    name: '국민건강보험 일산병원',
    type: '종합병원',
    address: '경기도 고양시 일산동구 일산로 100',
    region: '경기',
    city: '고양시',
    phone: '1577-0013',
    beds: 837,
    homepage: 'https://www.nhimc.or.kr',
    established_date: '2000-03-03',
    specialties: comprehensiveSpecialties,
    ranking_domestic: null,
    ranking_global: null,
    latitude: 37.682000,
    longitude: 126.761000,
    image_url: 'https://i.namu.wiki/i/JhE10Dr9Bz5RwE1iLHN2EULVxQsI0DU46aGjFncLxIWF5LQEidbJFsyZLtnzte2rKHo3XnX4zDYanOoxlRf9MTMh9jicWBKwhhortO2vTDrfrznb8bkuuTt5oq7UHBOMDyk8-YIMZRv8eNPwRhF4eg.webp',
    image_urls: [
      'https://i.namu.wiki/i/JhE10Dr9Bz5RwE1iLHN2EULVxQsI0DU46aGjFncLxIWF5LQEidbJFsyZLtnzte2rKHo3XnX4zDYanOoxlRf9MTMh9jicWBKwhhortO2vTDrfrznb8bkuuTt5oq7UHBOMDyk8-YIMZRv8eNPwRhF4eg.webp', // 나무위키 전경
      'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=400&fit=crop'
    ],
    notes: '837병상 규모, 국민건강보험공단 운영'
  },
  {
    name: '인하대학교병원',
    type: '종합병원',
    address: '인천광역시 중구 인항로 27',
    region: '인천',
    city: '인천시',
    phone: '032-890-2114',
    beds: 847,
    homepage: 'https://www.inha.com',
    established_date: '1996-05-27',
    specialties: comprehensiveSpecialties,
    ranking_domestic: null,
    ranking_global: null,
    latitude: 37.466000,
    longitude: 126.618000,
    image_url: 'https://i.namu.wiki/i/xVDuHwcf_dAffzIkE8LcWAfTd2-bsKrWPOaqUI1tqNcWEFDmu-iXSElHnbnbccjHyHGPXdyuFrk4qWX4tCmCYEH79WwmMPKHUfuVoQIaB0l9MyhH1q9xYdpJYQGeDfG1s0m6XGF83U1UpbOwv1Fw1g.webp',
    image_urls: [
      'https://i.namu.wiki/i/xVDuHwcf_dAffzIkE8LcWAfTd2-bsKrWPOaqUI1tqNcWEFDmu-iXSElHnbnbccjHyHGPXdyuFrk4qWX4tCmCYEH79WwmMPKHUfuVoQIaB0l9MyhH1q9xYdpJYQGeDfG1s0m6XGF83U1UpbOwv1Fw1g.webp', // 나무위키 전경
      'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=400&fit=crop'
    ],
    notes: '847병상 규모, 인하대 의과대학 부속병원, 인천지역 상급종합병원'
  },
  {
    name: '가천대 길병원',
    type: '상급종합병원',
    address: '인천광역시 남동구 남동대로 774번길 21',
    region: '인천',
    city: '인천시',
    phone: '032-460-3114',
    beds: 1400,
    homepage: 'https://www.gilhospital.com',
    established_date: '1958-03-01',
    specialties: comprehensiveSpecialties,
    ranking_domestic: null,
    ranking_global: null,
    latitude: 37.462500,
    longitude: 126.822900,
    image_url: 'https://i.namu.wiki/i/PIu-YdBwkU7xzyVD0FD-RDV3vtacPiZCwuFeNZiH3hc5F_GWxFIC3IaJWhSwb2taMshHSFCodkwHWENNHvizq1i80qOhk2tXrFoFZNNmahQ-lAc5_lra8BMeL5UVKU8GJ2On6D7M8l7oG1vM4yxvIA.webp',
    image_urls: [
      'https://i.namu.wiki/i/PIu-YdBwkU7xzyVD0FD-RDV3vtacPiZCwuFeNZiH3hc5F_GWxFIC3IaJWhSwb2taMshHSFCodkwHWENNHvizq1i80qOhk2tXrFoFZNNmahQ-lAc5_lra8BMeL5UVKU8GJ2On6D7M8l7oG1vM4yxvIA.webp', // 나무위키 전경
      'https://www.gilhospital.com/images/main/main_visual.jpg', // 공식 홈페이지 1
      'https://www.gilhospital.com/upload/main/hospital_banner.jpg', // 공식 홈페이지 2
      'https://www.gilhospital.com/content/images/hospital.jpg', // 공식 홈페이지 3
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=400&fit=crop' // Unsplash fallback
    ]
  },

  // ===== 경기 남부 주요 종합병원/병원 =====
  {
    name: '경기도의료원 이천병원',
    type: '종합병원',
    address: '경기도 이천시 경충대로 2742',
    region: '경기',
    city: '이천시',
    phone: '031-630-4200',
    beds: 300,
    homepage: 'https://www.medical.or.kr/icheon/index.do',
    established_date: '1946-01-01',
    specialties: ['내과', '외과', '정형외과', '신경외과', '산부인과', '소아청소년과', '응급의학과'],
    latitude: 37.282588,
    longitude: 127.432744,
    image_url: 'https://www.medical.or.kr/fckfiles/이천병원 전경 (6) - 복사본.png',
    notes: '공공병원, 케어전문병원 지정'
  },
  {
    name: '경기도의료원 수원병원',
    type: '종합병원',
    address: '경기도 수원시 장안구 수성로245번길 69',
    region: '경기',
    city: '수원시',
    phone: '031-8880-0114',
    beds: 500,
    homepage: 'https://www.medical.or.kr/suwon',
    established_date: '1959-12-01',
    specialties: ['내과', '외과', '정형외과', '신경외과', '산부인과', '소아청소년과', '응급의학과'],
    latitude: 37.301000,
    longitude: 127.015000,
    image_url: 'https://www.medical.or.kr/upload/board/202510310435265088783555337791221.jpg',
    notes: '공공병원'
  },

  // ===== 시흥 지역 병원 (3개) =====
  {
    name: '시화병원',
    type: '종합병원',
    address: '경기 시흥시 군자천로 381',
    region: '경기',
    city: '시흥시',
    phone: '1811-7000',
    beds: 500,
    homepage: 'https://www.shhosp.co.kr',
    established_date: '1998-04-01',
    specialties: ['내과', '외과', '정형외과', '신경외과', '산부인과', '소아청소년과', '응급의학과', '마취통증의학과', '영상의학과', '재활의학과'],
    latitude: 37.382000,
    longitude: 126.738000,
    image_url: 'https://www.shhosp.co.kr/_upload/banner/8f78c827-ef2a-40f9-9bb5-4a297b9018b4',
    notes: '24시간 응급의료센터, 22개 진료과, 15개 전문센터'
  },
  {
    name: '센트럴병원',
    type: '종합병원',
    address: '경기도 시흥시 공단1대로 237',
    region: '경기',
    city: '시흥시',
    phone: '1588-9339',
    beds: null,
    homepage: 'https://www.cmch.co.kr/new/main/',
    established_date: '2007-12-01',
    specialties: ['내과', '외과', '정형외과', '신경외과', '산부인과', '소아청소년과', '응급의학과'],
    latitude: 37.379000,
    longitude: 126.732000,
    image_url: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=1200&h=600&fit=crop',
    notes: '한양대학교 교육협력병원'
  },
  {
    name: '흥케이병원',
    type: '병원',
    address: '경기도 시흥시 능곡번영길 22',
    region: '경기',
    city: '시흥시',
    phone: '1551-1119',
    beds: null,
    homepage: 'https://heung-k.co.kr',
    established_date: null,
    specialties: ['정형외과', '척추', '관절'],
    latitude: 37.370044,
    longitude: 126.808205,
    image_url: 'https://heung-k.co.kr/assets/img/hd-slide1.png',
    notes: '척추·관절 전문'
  },

  // ===== 안산 추가 병원 (1개) =====
  {
    name: '안산21세기병원',
    type: '병원',
    address: '경기도 안산시 단원구 보화로 50',
    region: '경기',
    city: '안산시',
    phone: '1577-6660',
    beds: null,
    homepage: 'https://www.ansan21.com',
    established_date: null,
    specialties: ['척추', '관절', '내과', '재활의학과'],
    latitude: 37.316000,
    longitude: 126.839000,
    image_url: 'https://www.ansan21.com/upload/mainBanner/174736664907.56_ROi_EC9E90EC82B0_17.png',
    notes: '보건복지부 지정 척추전문병원'
  },

  // ===== 이천 추가 병원 =====
  {
    name: '이천 바른병원',
    type: '병원',
    address: '경기도 이천시 경충대로 2543',
    region: '경기',
    city: '이천시',
    phone: '031-6300-300',
    beds: null,
    homepage: 'http://www.barunhospital.com',
    established_date: null,
    specialties: ['내과', '외과', '정형외과', '마취통증의학과', '영상의학과', '재활의학과'],
    latitude: 37.246000,
    longitude: 127.450000,
    image_url: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?w=800&h=400&fit=crop',
    notes: null
  },
  {
    name: '이천엘리야병원',
    type: '병원',
    address: '경기도 이천시 장호원읍 서동대로 8793',
    region: '경기',
    city: '이천시',
    phone: '1800-4275',
    beds: null,
    homepage: 'https://ic.elijahhospital.com',
    established_date: null,
    specialties: ['내과', '정형외과', '신경외과', '소아청소년과', '이비인후과', '피부과', '재활의학과'],
    latitude: 37.155000,
    longitude: 127.507000,
    image_url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=400&fit=crop',
    notes: '관절센터, 척추센터 운영'
  },
  {
    name: '추새로병원',
    type: '병원',
    address: '경기도 이천시 영창로 189',
    region: '경기',
    city: '이천시',
    phone: '1644-0810',
    beds: null,
    homepage: null,
    established_date: null,
    specialties: ['내과', '신경과', '정형외과', '신경외과', '마취통증의학과', '영상의학과'],
    latitude: 37.280000,
    longitude: 127.432000,
    image_url: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&h=400&fit=crop',
    notes: null
  },
  {
    name: '이천파티마병원',
    type: '병원',
    address: '경기도 이천시 경충대로 2560-2',
    region: '경기',
    city: '이천시',
    phone: '031-635-2624',
    beds: null,
    homepage: 'https://www.2000fatima.com',
    established_date: null,
    specialties: ['내과', '외과', '정형외과', '산부인과', '소아청소년과', '신경외과', '재활의학과'],
    latitude: 37.272000,
    longitude: 127.441000,
    image_url: 'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=800&h=400&fit=crop',
    notes: null
  },

  // ===== 안산 추가 병원 =====
  {
    name: '근로복지공단 안산병원',
    type: '종합병원',
    address: '경기도 안산시 상록구 구룡로 87',
    region: '경기',
    city: '안산시',
    phone: '031-500-1114',
    beds: 485,
    homepage: 'https://www.comwel.or.kr/ansan',
    established_date: '1985-01-01',
    specialties: ['내과', '외과', '정형외과', '신경외과', '산부인과', '소아청소년과', '응급의학과', '마취통증의학과', '영상의학과', '재활의학과'],
    latitude: 37.307000,
    longitude: 126.836000,
    image_url: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=800&h=400&fit=crop',
    notes: '공공병원, 산업재해 및 직업병 치료 전문'
  },
  {
    name: '동안산병원',
    type: '종합병원',
    address: '경기도 안산시 상록구 월피로 88',
    region: '경기',
    city: '안산시',
    phone: '1544-7275',
    beds: null,
    homepage: 'http://dongansan.com',
    established_date: '2003-05-01',
    specialties: ['내과', '소아청소년과', '신경외과', '정형외과', '마취통증의학과', '영상의학과'],
    latitude: 37.299000,
    longitude: 126.810000,
    image_url: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800&h=400&fit=crop',
    notes: '2003년 종합병원 승격'
  },
  {
    name: '안산단원병원',
    type: '종합병원',
    address: '경기도 안산시 단원구 원포공원1로 20',
    region: '경기',
    city: '안산시',
    phone: '031-8040-6600',
    beds: null,
    homepage: 'https://www.dwhosp.co.kr',
    established_date: '2008-03-01',
    specialties: ['내과', '외과', '정형외과', '신경외과', '응급의학과', '영상의학과', '재활의학과'],
    latitude: 37.309000,
    longitude: 126.709000,
    image_url: 'https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?w=800&h=400&fit=crop',
    notes: '건강검진센터 운영'
  },
  {
    name: '사랑의병원',
    type: '종합병원',
    address: '경기도 안산시 상록구 예술광장로 69',
    region: '경기',
    city: '안산시',
    phone: '031-439-3000',
    beds: 350,
    homepage: 'http://www.sarangmc.co.kr',
    established_date: '2022-06-30',
    specialties: ['내과', '외과', '정형외과', '신경외과', '응급의학과', '영상의학과', '재활의학과', '건강검진'],
    latitude: 37.294000,
    longitude: 126.829000,
    image_url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&h=400&fit=crop',
    notes: '2022년 종합병원 승격, 상록구 첫 번째 종합병원, 관절척추센터·뇌질환센터 운영'
  },

  // ===== 화성 추가 병원 =====
  {
    name: '화성중앙종합병원',
    type: '종합병원',
    address: '경기도 화성시 향남읍 발안로 5',
    region: '경기',
    city: '화성시',
    phone: '031-8077-8000',
    beds: null,
    homepage: 'http://www.hjhospital.co.kr',
    established_date: null,
    specialties: ['내과', '외과', '정형외과', '신경외과', '산부인과', '소아청소년과', '응급의학과', '마취통증의학과', '영상의학과', '재활의학과'],
    latitude: 37.065000,
    longitude: 126.886000,
    image_url: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=800&h=400&fit=crop',
    notes: '화성시 최초 종합병원, 지역응급의료기관, 24시간 365일 응급의료체계 운영'
  },
  {
    name: '화성유일병원',
    type: '병원',
    address: '경기도 화성시 남양읍 남양로 291-30',
    region: '경기',
    city: '화성시',
    phone: '031-357-8275',
    beds: null,
    homepage: null,
    established_date: null,
    specialties: ['내과', '정형외과', '신경외과', '재활의학과'],
    latitude: 37.201000,
    longitude: 126.814000,
    image_url: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=800&h=400&fit=crop',
    notes: '토요일 진료 병원'
  },

  // ===== 평택 추가 병원 =====
  {
    name: '평택성모병원',
    type: '종합병원',
    address: '경기도 평택시 평택로 284',
    region: '경기',
    city: '평택시',
    phone: '1800-8800',
    beds: null,
    homepage: 'https://www.ptmc.or.kr',
    established_date: '1995-01-01',
    specialties: ['내과', '외과', '정형외과', '신경외과', '산부인과', '소아청소년과', '응급의학과', '마취통증의학과', '영상의학과', '재활의학과'],
    latitude: 36.990000,
    longitude: 127.082000,
    image_url: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&h=400&fit=crop',
    notes: '2019년 지역응급의료센터 지정, 척추관절센터 운영'
  },
  {
    name: '평택21세기병원',
    type: '종합병원',
    address: '경기도 평택시 중앙로 288',
    region: '경기',
    city: '평택시',
    phone: '031-656-2100',
    beds: null,
    homepage: null,
    established_date: null,
    specialties: ['내과', '외과', '정형외과', '신경외과', '응급의학과', '영상의학과', '재활의학과'],
    latitude: 36.993000,
    longitude: 127.089000,
    image_url: 'https://images.unsplash.com/photo-1631217675167-90a456a90863?w=800&h=400&fit=crop',
    notes: null
  }
];

/**
 * 병원 데이터를 데이터베이스에 추가
 */
function addHospitals() {
  console.log('\n🏥 서울·경기 수도권 병원 데이터 추가 시작...\n');

  let addedCount = 0;
  let skippedCount = 0;

  seoulGyeonggiHospitals.forEach((hospitalData, index) => {
    // 이미 존재하는 병원인지 확인 (이름으로 검색)
    const existing = Hospital.getAll({ search: hospitalData.name });
    const exactMatch = existing.find(h => h.name === hospitalData.name);

    if (exactMatch) {
      console.log(`⏭️  [${index + 1}/${seoulGyeonggiHospitals.length}] 이미 존재: ${hospitalData.name}`);
      skippedCount++;
      return;
    }

    // 병원 생성
    const hospital = Hospital.create({
      name: hospitalData.name,
      type: hospitalData.type,
      address: hospitalData.address,
      region: hospitalData.region,
      city: hospitalData.city,
      phone: hospitalData.phone,
      homepage: hospitalData.homepage || null,
      beds: hospitalData.beds || null,
      established_date: hospitalData.established_date || null,
      specialties: hospitalData.specialties || [],
      ranking_domestic: hospitalData.ranking_domestic || null,
      ranking_global: hospitalData.ranking_global || null,
      notes: hospitalData.notes || null,
      latitude: hospitalData.latitude || null,
      longitude: hospitalData.longitude || null,
      has_emergency_room: hospitalData.has_emergency_room || false,
      open_24_hours: hospitalData.open_24_hours || false,
      weekend_available: hospitalData.weekend_available || false,
      image_url: hospitalData.image_url || null,
      image_urls: hospitalData.image_urls || []
    });

    addedCount++;

    // 관리자 계정 생성
    const adminCode = `ADMIN${hospital.id}2024`;
    try {
      Admin.create({
        hospital_id: hospital.id,
        admin_code: adminCode,
        email: null,
        phone: null
      });
    } catch (error) {
      // Admin already exists, skip
    }

    // 진행 상황 출력
    const rankInfo = hospital.ranking_domestic
      ? ` [국내 ${hospital.ranking_domestic}위${hospital.ranking_global ? `, 세계 ${hospital.ranking_global}위` : ''}]`
      : '';

    console.log(`✅ [${index + 1}/${seoulGyeonggiHospitals.length}] 추가 완료: ${hospital.name} (${hospital.type})${rankInfo}`);
    console.log(`   📍 ${hospital.address}`);
    console.log(`   📞 ${hospital.phone}`);
    console.log(`   🔑 관리자코드: ${adminCode}`);
    console.log('');
  });

  console.log('\n' + '='.repeat(80));
  console.log('📊 추가 완료 통계');
  console.log('='.repeat(80));
  console.log(`✅ 추가된 병원: ${addedCount}개`);
  console.log(`⏭️  건너뛴 병원: ${skippedCount}개`);

  // 전체 병원 수
  const allHospitals = Hospital.getAll();
  console.log(`📋 전체 병원 수: ${allHospitals.length}개`);
  console.log('='.repeat(80));

  // 지역별 통계
  const stats = Hospital.getStats();

  console.log('\n📊 지역별 병원 분포:');
  stats.byRegion.forEach(({ region, count }) => {
    console.log(`   ${region}: ${count}개`);
  });

  console.log('\n📊 종별 병원 분포:');
  stats.byType.forEach(({ type, count }) => {
    console.log(`   ${type}: ${count}개`);
  });

  console.log('\n✨ 모든 병원 데이터 추가가 완료되었습니다!\n');

  return {
    added: addedCount,
    skipped: skippedCount,
    total: allHospitals.length
  };
}

// 스크립트 실행
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  try {
    const result = addHospitals();

    console.log('\n💡 다음 단계:');
    console.log('1. 백엔드 서버 재시작 (이미 실행 중이라면 자동 반영됨)');
    console.log('2. 프론트엔드에서 http://localhost:5173/hospitals 접속하여 확인');
    console.log('3. 병원 관리자는 각 병원의 관리자코드로 로그인 가능');
    console.log('   예: 병원 ID 1번 → 관리자코드 ADMIN12024\n');
  } catch (error) {
    console.error('❌ 오류 발생:', error);
    process.exit(1);
  }
}

export default addHospitals;
