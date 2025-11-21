# 병원 추가 가이드

이 가이드는 병원·의사 관리 시스템에 새로운 병원을 추가하는 방법을 설명합니다.

## 📋 사전 준비 체크리스트

새 병원을 추가하기 전에 다음 정보를 수집하세요:

### 필수 정보
- [ ] **병원명** (정확한 공식 명칭)
- [ ] **병원 유형** (상급종합병원 / 종합병원 / 병원)
- [ ] **주소** (도로명 주소)
- [ ] **지역** (서울 / 경기 / 인천 등)
- [ ] **시/구** (강남구, 수원시 등)
- [ ] **전화번호** (대표 전화 또는 콜센터)
- [ ] **GPS 좌표** (위도, 경도 - 소수점 6자리)
- [ ] **공식 홈페이지 URL** (HTTPS 우선)

### 선택 정보
- [ ] **병상 수**
- [ ] **개원일** (YYYY-MM-DD 형식)
- [ ] **진료과 목록** (배열 형식)
- [ ] **병원 순위** (국내/세계 - 해당되는 경우)
- [ ] **비고** (특이사항)
- [ ] **병원 이미지 URL**

---

## 🔍 정보 수집 방법

### 1. 기본 정보 수집

#### 공식 홈페이지에서 확인
- 병원 공식 홈페이지 방문
- "병원 소개" 또는 "찾아오시는 길" 페이지 확인
- 정확한 주소, 전화번호, 개원일, 병상 수 확인

#### 네이버 지도에서 확인
1. [네이버 지도](https://map.naver.com) 접속
2. 병원명으로 검색
3. 업체 정보 확인:
   - 주소
   - 전화번호
   - 영업시간
   - 홈페이지

### 2. GPS 좌표 찾기

#### 방법 1: 네이버 지도 (권장)
1. 네이버 지도에서 병원 검색
2. 병원 위치에서 **우클릭**
3. "URL 복사" 클릭
4. URL에서 좌표 확인
   ```
   예: https://map.naver.com/v5/?c=127.0123456,37.5123456,15,0,0,0,dh
   경도: 127.0123456, 위도: 37.5123456
   ```

#### 방법 2: 카카오맵
1. [카카오맵](https://map.kakao.com) 접속
2. 병원 검색
3. 지도에서 해당 위치 클릭
4. 좌표 확인 (우측 하단에 표시됨)

#### 방법 3: Google Maps
1. [Google Maps](https://www.google.com/maps) 접속
2. 병원 검색
3. 병원 위치에서 **우클릭** → "이 장소에 관하여"
4. 좌표 복사 (위도, 경도 순서)

**주의사항:**
- 소수점 **6자리**까지 정확하게 입력
- 위도(latitude): 37.xxx (한국은 대부분 37.x~38.x)
- 경도(longitude): 126.xxx ~ 129.xxx

### 3. 병원 이미지 찾기

#### 우선순위 (높은 순서대로)
1. **공식 홈페이지** → 병원 소개 페이지의 건물 외관 사진
2. **나무위키** → `https://namu.wiki/w/병원명`
3. **공식 SNS** → 네이버 플레이스, 페이스북, 인스타그램
4. **뉴스 기사** → 병원 관련 보도자료

#### 이미지 URL 추출 방법

**나무위키에서:**
1. `https://namu.wiki/w/병원명` 접속
2. 병원 건물 사진 **우클릭** → "이미지 주소 복사"
3. URL 예시: `https://i.namu.wiki/i/xxxxx.webp`

**공식 홈페이지에서:**
1. 병원 홈페이지 접속
2. F12 (개발자 도구) 열기
3. Elements 탭에서 이미지 찾기
4. `<img src="...">` 에서 URL 복사

**이미지 요구사항:**
- 직접 이미지 URL (.jpg, .png, .webp 등)
- 최소 800x400 픽셀 이상
- 병원 건물 외관 사진 (선호)

### 4. 홈페이지 URL 검증

#### 확인 사항
- [ ] URL이 정상 작동하는가?
- [ ] HTTPS를 지원하는가?
- [ ] 올바른 병원 페이지로 연결되는가?

#### HTTPS 확인
```bash
# URL 테스트 (브라우저에서)
https://www.병원주소.com

# HTTP → HTTPS 자동 리다이렉트 확인
http://www.병원주소.com  (→ https로 자동 전환되는지 확인)
```

---

## 📝 병원 데이터 추가하기

### 1. 파일 위치
```
C:\Claude\hospital-doctor-system\backend\src\scripts\addSeoulGyeonggiHospitals.js
```

### 2. 병원 데이터 템플릿

#### 상급종합병원 예제
```javascript
{
  name: '○○대학교병원',
  type: '상급종합병원',
  address: '서울특별시 ○○구 ○○로 123',
  region: '서울',
  city: '○○구',
  phone: '02-1234-5678',  // 또는 1588-xxxx 형식
  beds: 1000,
  homepage: 'https://www.hospital.ac.kr',
  established_date: '2000-01-01',
  specialties: comprehensiveSpecialties,  // 상급종합병원은 이 변수 사용
  ranking_domestic: null,  // 순위가 있으면 숫자 입력
  ranking_global: null,
  latitude: 37.123456,  // 소수점 6자리
  longitude: 127.123456,
  image_url: 'https://i.namu.wiki/i/xxxxx.webp',
  notes: null  // 특이사항이 있으면 입력
}
```

#### 종합병원 예제
```javascript
{
  name: '○○병원',
  type: '종합병원',
  address: '경기도 ○○시 ○○로 456',
  region: '경기',
  city: '○○시',
  phone: '031-1234-5678',
  beds: 500,
  homepage: 'https://www.hospital.com',
  established_date: '1995-06-01',
  specialties: ['내과', '외과', '정형외과', '신경외과', '산부인과', '소아청소년과', '응급의학과'],
  latitude: 37.234567,
  longitude: 127.234567,
  image_url: 'https://www.hospital.com/images/building.jpg',
  notes: '공공병원'
}
```

#### 일반 병원 예제
```javascript
{
  name: '○○정형외과',
  type: '병원',
  address: '경기도 ○○시 ○○로 789',
  region: '경기',
  city: '○○시',
  phone: '031-9876-5432',
  beds: null,  // 정보가 없으면 null
  homepage: 'https://www.clinic.com',
  established_date: null,
  specialties: ['정형외과', '재활의학과'],
  latitude: 37.345678,
  longitude: 127.345678,
  image_url: 'https://www.clinic.com/images/exterior.jpg',
  notes: '척추·관절 전문'
}
```

### 3. 데이터 필드 설명

| 필드 | 타입 | 필수 | 설명 | 예시 |
|------|------|------|------|------|
| `name` | String | ✅ | 병원 공식 명칭 | `'서울아산병원'` |
| `type` | String | ✅ | 병원 유형 | `'상급종합병원'` / `'종합병원'` / `'병원'` |
| `address` | String | ✅ | 도로명 주소 | `'서울특별시 송파구 올림픽로43길 88'` |
| `region` | String | ✅ | 지역 (시/도) | `'서울'` / `'경기'` / `'인천'` |
| `city` | String | ✅ | 시/구 | `'송파구'` / `'수원시'` |
| `phone` | String | ✅ | 대표 전화 | `'1688-7575'` / `'02-1234-5678'` |
| `beds` | Number/null | ❌ | 병상 수 | `2700` / `null` |
| `homepage` | String/null | ❌ | 공식 홈페이지 | `'https://www.amc.seoul.kr'` |
| `established_date` | String/null | ❌ | 개원일 (YYYY-MM-DD) | `'1989-06-01'` / `null` |
| `specialties` | Array/Variable | ✅ | 진료과 목록 | `comprehensiveSpecialties` 또는 배열 |
| `ranking_domestic` | Number/null | ❌ | 국내 순위 | `1` / `null` |
| `ranking_global` | Number/null | ❌ | 세계 순위 | `25` / `null` |
| `latitude` | Number | ✅ | 위도 (소수점 6자리) | `37.526484` |
| `longitude` | Number | ✅ | 경도 (소수점 6자리) | `127.109610` |
| `image_url` | String/null | ❌ | 병원 이미지 URL | `'https://...'` / `null` |
| `notes` | String/null | ❌ | 비고 | `'공공병원'` / `null` |

### 4. 진료과 목록 작성

#### 상급종합병원
```javascript
specialties: comprehensiveSpecialties  // 기본 변수 사용
```

#### 종합병원 / 일반 병원
```javascript
specialties: [
  '내과',
  '외과',
  '정형외과',
  '신경외과',
  '산부인과',
  '소아청소년과',
  '응급의학과',
  '마취통증의학과',
  '영상의학과',
  '재활의학과'
]
```

**주요 진료과 목록:**
- 내과, 외과, 정형외과, 신경외과, 성형외과
- 산부인과, 소아청소년과
- 안과, 이비인후과, 피부과
- 비뇨의학과, 정신건강의학과
- 재활의학과, 응급의학과, 가정의학과
- 영상의학과, 마취통증의학과

---

## 🚀 병원 추가 절차

### Step 1: 정보 수집
1. 체크리스트 작성
2. 모든 필수 정보 확인
3. GPS 좌표 검증 (네이버 지도에서 확인)
4. 홈페이지 URL 접속 테스트
5. 이미지 URL 접속 테스트

### Step 2: 코드 추가
1. `addSeoulGyeonggiHospitals.js` 파일 열기
2. 적절한 섹션에 병원 데이터 추가
   - 서울 상급종합병원 → `// ===== 서울 상급종합병원 (14개) =====`
   - 경기 상급종합병원 → `// ===== 경기 남부 상급종합병원 (7개) =====`
   - 종합병원/병원 → `// ===== 경기 남부 주요 종합병원/병원 =====`
3. 템플릿에 따라 데이터 입력
4. 콤마(,) 확인

### Step 3: 백엔드 재시작
```bash
# 기존 프로세스 종료
wmic process where "commandline like '%hospital-doctor-system%backend%' and name='node.exe'" get processid
wmic process where "processid=<PID>" delete

# 백엔드 시작
cd C:\Claude\hospital-doctor-system\backend
node src/server.js
```

### Step 4: 확인
1. 백엔드 로그에서 병원 추가 확인
   ```
   ✅ [X/XX] 추가 완료: ○○병원 (종합병원)
      📍 서울특별시 ○○구 ○○로 123
      📞 02-1234-5678
      🔑 관리자코드: ADMINXX2024
   ```

2. 프론트엔드에서 확인
   - http://localhost:5174/hospitals
   - 병원 목록에 새 병원이 표시되는지 확인
   - 병원 상세 페이지 접속
   - 지도, 이미지, 정보가 정상 표시되는지 확인

---

## ✅ 데이터 검증 체크리스트

병원 추가 후 다음 사항을 확인하세요:

### 기본 정보
- [ ] 병원명이 정확한가?
- [ ] 주소가 정확한가?
- [ ] 전화번호가 연결되는가?
- [ ] 홈페이지가 정상 작동하는가?

### GPS 좌표
- [ ] 구글맵 임베드에서 정확한 위치가 표시되는가?
- [ ] 네이버맵 링크를 클릭하면 정확한 병원이 검색되는가?
- [ ] 위도/경도가 소수점 6자리인가?

### 이미지
- [ ] 병원 이미지가 정상 표시되는가?
- [ ] 이미지가 병원 건물 외관인가?
- [ ] 이미지 로딩 속도가 적절한가?

### 기능 테스트
- [ ] 병원 목록에서 카드가 정상 표시되는가?
- [ ] 상세 페이지로 이동이 가능한가?
- [ ] "네이버지도에서 보기" 버튼이 작동하는가?
- [ ] "길찾기" 버튼이 작동하는가?
- [ ] 홈페이지 링크가 새 탭에서 열리는가?

---

## 🐛 문제 해결

### 이미지가 표시되지 않을 때
1. 이미지 URL이 직접 이미지 파일(.jpg, .png, .webp)인지 확인
2. 브라우저에서 이미지 URL을 직접 열어보기
3. CORS 문제인 경우 다른 출처의 이미지 사용
4. 폴백 이미지가 자동으로 표시되는지 확인

### GPS 좌표가 틀렸을 때
1. 네이버 지도에서 병원명으로 재검색
2. 병원 건물 정확한 위치 클릭
3. 좌표를 소수점 6자리까지 다시 확인
4. 위도/경도 순서 확인 (위도 먼저, 경도 나중)

### 홈페이지가 열리지 않을 때
1. URL이 `https://`로 시작하는지 확인
2. 브라우저에서 URL 직접 접속 테스트
3. 리다이렉트되는 경우 최종 URL 사용
4. 병원 공식 홈페이지인지 재확인

---

## 📞 도움말

추가 질문이나 문제가 있으면 다음을 확인하세요:

1. **기존 병원 데이터 참고**: `addSeoulGyeonggiHospitals.js` 파일의 28개 병원 데이터
2. **콘솔 로그 확인**: 백엔드 서버 로그에서 오류 메시지 확인
3. **브라우저 개발자 도구**: F12 → Console 탭에서 에러 확인

---

## 📚 참고 자료

- [네이버 지도](https://map.naver.com)
- [카카오맵](https://map.kakao.com)
- [Google Maps](https://www.google.com/maps)
- [나무위키](https://namu.wiki)
- [건강보험심사평가원 - 병원정보](https://www.hira.or.kr)

---

**작성일:** 2025-11-18
**버전:** 1.0.0
