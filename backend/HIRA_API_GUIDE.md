# 건강보험심사평가원(HIRA) API 연동 가이드

## 개요

이 가이드는 건강보험심사평가원(HIRA) 공공데이터 API를 사용하여 실제 병·의원 데이터를 자동으로 가져오는 방법을 설명합니다.

## 📋 목차

1. [API 키 발급](#api-키-발급)
2. [환경 설정](#환경-설정)
3. [사용 방법](#사용-방법)
4. [지역 코드](#지역-코드)
5. [문제 해결](#문제-해결)

---

## API 키 발급

### 1단계: 공공데이터포털 회원가입

1. [공공데이터포털](https://www.data.go.kr) 접속
2. 회원가입 및 로그인

### 2단계: API 신청

1. 검색창에 **"병의원 찾기 서비스"** 검색
2. 또는 다음 링크로 직접 이동:
   - [병의원 정보서비스](https://www.data.go.kr/tcs/dss/selectApiDataDetailView.do?publicDataPk=15000736)
3. **활용신청** 버튼 클릭
4. 신청 정보 입력:
   - 활용 목적: 병원 검색 서비스 개발
   - 상세 기능: 지역별 병원 정보 조회 및 검색
5. 신청 완료 (승인까지 1-2시간 소요)

### 3단계: API 키 확인

1. 로그인 후 **마이페이지** > **오픈API** 접속
2. **인증키(Encoding)** 복사
   - ⚠️ **디코딩 인증키가 아닌 인코딩 인증키를 사용하세요**

---

## 환경 설정

### 1. .env 파일 생성

프로젝트의 `backend` 폴더에 `.env` 파일을 생성합니다:

```bash
cd backend
```

`.env` 파일 내용:

```env
HIRA_API_KEY=your_api_key_here
```

**예시:**
```env
HIRA_API_KEY=dKj3kls9d%2BfKlsdf8s9dfKlsdf9sdf%2Bklsdf8sdf
```

### 2. 환경 변수 확인

API 키가 제대로 설정되었는지 확인:

```bash
node -e "console.log(process.env.HIRA_API_KEY || 'API 키가 설정되지 않았습니다')"
```

---

## 사용 방법

### 기본 사용법

```bash
node src/scripts/importFromHira.js [시도코드] [시군구코드] [최대페이지수]
```

### 예시 1: 이천시 전체 병·의원 가져오기

```bash
node src/scripts/importFromHira.js 410000 41500 10
```

- `410000`: 경기도 시도코드
- `41500`: 이천시 시군구코드
- `10`: 최대 10페이지 (페이지당 100개, 최대 1000개)

### 예시 2: 서울 전체 가져오기

```bash
node src/scripts/importFromHira.js 110000 null 20
```

- `110000`: 서울 시도코드
- `null`: 시군구 전체
- `20`: 최대 20페이지 (최대 2000개)

### 예시 3: 서울 강남구

```bash
node src/scripts/importFromHira.js 110000 11680 10
```

### 예시 4: 서울 서초구

```bash
node src/scripts/importFromHira.js 110000 11650 10
```

---

## 지역 코드

### 주요 시도 코드

| 지역명 | 시도코드 |
|--------|----------|
| 서울   | 110000   |
| 부산   | 260000   |
| 대구   | 270000   |
| 인천   | 280000   |
| 광주   | 290000   |
| 대전   | 300000   |
| 울산   | 310000   |
| 세종   | 360000   |
| 경기   | 410000   |
| 강원   | 420000   |
| 충북   | 430000   |
| 충남   | 440000   |
| 전북   | 450000   |
| 전남   | 460000   |
| 경북   | 470000   |
| 경남   | 480000   |
| 제주   | 490000   |

### 경기도 주요 시군구 코드

| 시/군명 | 시군구코드 |
|---------|------------|
| 이천시  | 41500      |
| 수원시  | 41110      |
| 성남시  | 41130      |
| 용인시  | 41460      |
| 안양시  | 41170      |
| 부천시  | 41190      |
| 광명시  | 41210      |
| 평택시  | 41220      |
| 과천시  | 41290      |
| 오산시  | 41370      |
| 시흥시  | 41390      |
| 군포시  | 41410      |
| 의왕시  | 41430      |
| 하남시  | 41450      |
| 김포시  | 41570      |
| 안성시  | 41550      |
| 화성시  | 41590      |
| 광주시  | 41610      |

### 서울 주요 구 코드

| 구명   | 시군구코드 |
|--------|------------|
| 강남구 | 11680      |
| 강동구 | 11740      |
| 강북구 | 11305      |
| 강서구 | 11500      |
| 관악구 | 11620      |
| 광진구 | 11215      |
| 구로구 | 11530      |
| 금천구 | 11545      |
| 노원구 | 11350      |
| 도봉구 | 11320      |
| 동대문구 | 11230    |
| 동작구 | 11590      |
| 마포구 | 11440      |
| 서대문구 | 11410    |
| 서초구 | 11650      |
| 성동구 | 11200      |
| 성북구 | 11290      |
| 송파구 | 11710      |
| 양천구 | 11470      |
| 영등포구 | 11560    |
| 용산구 | 11170      |
| 은평구 | 11380      |
| 종로구 | 11110      |
| 중구   | 11140      |
| 중랑구 | 11260      |

---

## API 응답 데이터 구조

HIRA API는 다음과 같은 데이터를 제공합니다:

```json
{
  "yadmNm": "병원명",
  "clCd": "종별코드 (01-종합병원, 05-의원, 28-치과의원 등)",
  "sidoCd": "시도코드",
  "sigunguNm": "시군구명",
  "addr": "주소",
  "telno": "전화번호",
  "XPos": "경도",
  "YPos": "위도",
  "ykiho": "요양기관번호",
  "hospUrl": "병원 홈페이지"
}
```

### 종별코드 설명

- `01`: 상급종합병원
- `02`: 종합병원
- `03`: 병원
- `04`: 요양병원
- `05`: 의원
- `11`: 보건소
- `12`: 보건지소
- `13`: 보건진료소
- `21`: 치과병원
- `28`: 치과의원
- `29`: 한방병원
- `31`: 한의원

---

## 데이터 변환 로직

HIRA API 데이터는 다음과 같이 우리 DB 스키마로 변환됩니다:

```javascript
{
  name: hiraData.yadmNm,              // 요양기관명
  type: mapHospitalType(hiraData.clCd),  // 종별코드 -> '병원', '의원', '치과' 등
  region: mapRegionCode(hiraData.sidoCd), // 시도코드 -> '서울', '경기' 등
  city: hiraData.sigunguNm,           // 시군구명
  address: hiraData.addr,             // 주소
  phone: hiraData.telno,              // 전화번호
  latitude: parseFloat(hiraData.YPos),   // 위도
  longitude: parseFloat(hiraData.XPos),  // 경도
  specialties: []                     // 별도 조회 필요
}
```

---

## 프로그래밍 방식 사용

스크립트가 아닌 코드에서 직접 사용하는 방법:

```javascript
import hiraApiService from '../services/hiraApi.js';

// API 키 설정
hiraApiService.setApiKey(process.env.HIRA_API_KEY);

// 이천시 병원 데이터 가져오기
const hospitals = await hiraApiService.getAllHospitalsInRegion(
  '410000',  // 경기도
  '41500',   // 이천시
  10         // 최대 10페이지
);

// 각 병원 정보 변환
hospitals.forEach(hiraData => {
  const hospitalData = hiraApiService.transformToHospitalData(hiraData);
  console.log(hospitalData);
});

// 특정 병원의 진료과목 조회
const subjects = await hiraApiService.getMedicalSubjects('요양기관번호');

// 응급실 정보 조회
const emergency = await hiraApiService.getEmergencyInfo('요양기관번호');
```

---

## 문제 해결

### ❌ "API 키가 설정되지 않았습니다"

**원인:** `.env` 파일이 없거나 `HIRA_API_KEY`가 설정되지 않음

**해결:**
1. `backend` 폴더에 `.env` 파일 생성
2. `HIRA_API_KEY=your_key` 추가
3. 스크립트 재실행

### ❌ "API 오류: SERVICE_KEY_IS_NOT_REGISTERED_ERROR"

**원인:** API 키가 잘못되었거나 승인되지 않음

**해결:**
1. 공공데이터포털에서 API 승인 상태 확인
2. **인코딩된 인증키**를 사용하는지 확인
3. API 키 복사 시 공백이 포함되지 않았는지 확인

### ❌ "API 오류: LIMITED_NUMBER_OF_SERVICE_REQUESTS_EXCEEDS_ERROR"

**원인:** API 호출 횟수 초과 (일일 1000회 제한)

**해결:**
1. 다음 날 재시도
2. 또는 더 적은 페이지 수로 요청

### ❌ 데이터가 중복으로 추가됨

**원인:** 같은 지역을 여러 번 가져옴

**해결:**
- 스크립트는 병원명으로 중복을 자동 체크합니다
- 이미 존재하는 병원은 건너뜁니다

---

## API 사용 제한

- **일일 호출 횟수:** 1,000회
- **초당 호출 횟수:** 약 10회
- **페이지당 최대 결과:** 100개

스크립트는 자동으로 1초 딜레이를 추가하여 API 제한을 준수합니다.

---

## 추가 API 엔드포인트

### 진료과목 조회

```javascript
const subjects = await hiraApiService.getMedicalSubjects('요양기관번호');
```

### 응급실 정보 조회

```javascript
const emergency = await hiraApiService.getEmergencyInfo('요양기관번호');
```

---

## 참고 자료

- [공공데이터포털](https://www.data.go.kr)
- [병의원 정보서비스 API 문서](https://www.data.go.kr/tcs/dss/selectApiDataDetailView.do?publicDataPk=15000736)
- [건강보험심사평가원](https://www.hira.or.kr)

---

## 다음 단계

1. ✅ API 키 발급 받기
2. ✅ .env 파일에 API 키 설정
3. ✅ 이천시 데이터 가져오기
4. ⏳ 서울 강남/서초 데이터 가져오기
5. ⏳ 진료과목 정보 추가로 가져오기
6. ⏳ 실시간 업데이트 스케줄러 구현

---

**💡 팁:** API 키 없이도 수동으로 추가한 데이터(이천시 132개)는 계속 사용할 수 있습니다!
