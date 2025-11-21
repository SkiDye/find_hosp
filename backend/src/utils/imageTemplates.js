/**
 * 병원 이미지 폴백 템플릿
 *
 * 다층 폴백 구조:
 * 1. 나무위키/위키피디아 실제 병원 이미지 (우선순위 최상)
 * 2. 공식 홈페이지 이미지
 * 3. 네이버 지도 업체 사진
 * 4. 고품질 Unsplash 병원 이미지들 (다양성 제공)
 * 5. 최종 Unsplash 폴백 (항상 작동 보장)
 */

// 고품질 Unsplash 병원 이미지 풀 (다양성을 위해 여러 개 준비)
const UNSPLASH_HOSPITAL_IMAGES = [
  'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=400&fit=crop', // 현대적 종합병원 외관 1
  'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&h=400&fit=crop', // 병원 건물 2
  'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=800&h=400&fit=crop', // 의료센터 3
  'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800&h=400&fit=crop', // 병원 외관 4
  'https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?w=800&h=400&fit=crop', // 의료시설 5
  'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=800&h=400&fit=crop', // 병원 빌딩 6
  'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=800&h=400&fit=crop', // 현대 병원 7
  'https://images.unsplash.com/photo-1563213126-a4273aed2016?w=800&h=400&fit=crop', // 의료건물 8
  'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=800&h=400&fit=crop', // 병원 정면 9
  'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=800&h=400&fit=crop', // 의료기관 10
  'https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&h=400&fit=crop', // 종합병원 외관 11
  'https://images.unsplash.com/photo-1631217675167-90a456a90863?w=800&h=400&fit=crop', // 병원 건물 12
  'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&h=400&fit=crop', // 의료시설 외관 13
];

// 최종 폴백 이미지 (항상 작동 보장)
const FINAL_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=400&fit=crop';

/**
 * 병원 ID를 기반으로 고유한 Unsplash 이미지 세트를 생성
 * @param {number} hospitalId - 병원 ID
 * @param {number} count - 생성할 이미지 개수 (기본값: 4)
 * @returns {string[]} - Unsplash 이미지 URL 배열
 */
function getUniqueUnsplashImages(hospitalId, count = 4) {
  const images = [];
  const poolSize = UNSPLASH_HOSPITAL_IMAGES.length;

  // 병원 ID를 시드로 사용하여 고유하지만 일관된 이미지 선택
  for (let i = 0; i < count; i++) {
    const index = (hospitalId * 7 + i * 3) % poolSize; // 고유성을 위한 간단한 해시
    images.push(UNSPLASH_HOSPITAL_IMAGES[index]);
  }

  return images;
}

/**
 * 병원 이미지 폴백 체인 생성
 * @param {Object} options - 이미지 옵션
 * @param {number} options.hospitalId - 병원 ID
 * @param {string} [options.namuwikiImage] - 나무위키 이미지 URL
 * @param {string} [options.wikipediaImage] - 위키피디아 이미지 URL
 * @param {string} [options.homepageImage] - 공식 홈페이지 이미지 URL
 * @param {string} [options.naverMapImage] - 네이버 지도 업체 사진 URL
 * @param {string[]} [options.customImages] - 추가 커스텀 이미지 URL들
 * @returns {Object} - { image_url, image_urls } 객체
 */
export function generateImageFallback(options = {}) {
  const {
    hospitalId = 1,
    namuwikiImage = null,
    wikipediaImage = null,
    homepageImage = null,
    naverMapImage = null,
    customImages = []
  } = options;

  const imageChain = [];

  // 1순위: 나무위키 이미지 (실제 병원 전경, 가장 신뢰할 수 있음)
  if (namuwikiImage) {
    imageChain.push(namuwikiImage);
  }

  // 2순위: 위키피디아 이미지 (공신력 있는 출처)
  if (wikipediaImage) {
    imageChain.push(wikipediaImage);
  }

  // 3순위: 공식 홈페이지 이미지
  if (homepageImage) {
    imageChain.push(homepageImage);
  }

  // 4순위: 네이버 지도 업체 사진
  if (naverMapImage) {
    imageChain.push(naverMapImage);
  }

  // 5순위: 커스텀 이미지들
  if (customImages && customImages.length > 0) {
    imageChain.push(...customImages);
  }

  // 6순위: 고유한 Unsplash 이미지들 (시각적 다양성 제공)
  const unsplashImages = getUniqueUnsplashImages(hospitalId, 3);
  imageChain.push(...unsplashImages);

  // 최종 폴백: 항상 작동하는 기본 이미지
  imageChain.push(FINAL_FALLBACK_IMAGE);

  // 중복 제거
  const uniqueImageChain = [...new Set(imageChain)];

  return {
    image_url: uniqueImageChain[0], // 첫 번째 이미지를 기본값으로
    image_urls: uniqueImageChain    // 전체 폴백 체인
  };
}

/**
 * 기본 병원 이미지 폴백 (실제 이미지가 없을 때)
 * @param {number} hospitalId - 병원 ID
 * @returns {Object} - { image_url, image_urls } 객체
 */
export function getDefaultImageFallback(hospitalId) {
  return generateImageFallback({ hospitalId });
}

/**
 * 기존 병원 데이터에 이미지 폴백 추가/업데이트
 * @param {Object} hospital - 병원 데이터
 * @returns {Object} - 이미지 폴백이 추가된 병원 데이터
 */
export function addImageFallbackToHospital(hospital) {
  // 이미 image_urls가 있고 충분한 폴백이 있으면 그대로 반환
  if (hospital.image_urls && hospital.image_urls.length >= 5) {
    return hospital;
  }

  // image_urls가 없거나 부족하면 새로 생성
  const existingImages = hospital.image_urls || [];
  const { image_url, image_urls } = generateImageFallback({
    hospitalId: hospital.id,
    customImages: existingImages
  });

  return {
    ...hospital,
    image_url: hospital.image_url || image_url,
    image_urls: image_urls
  };
}

export default {
  generateImageFallback,
  getDefaultImageFallback,
  addImageFallbackToHospital,
  UNSPLASH_HOSPITAL_IMAGES,
  FINAL_FALLBACK_IMAGE
};
