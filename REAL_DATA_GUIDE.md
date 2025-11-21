# 실제 데이터 사용 가이드

## 현재 상태

### ❌ 샘플 데이터 (가짜)
- 7개 병원 (서울대병원, 삼성서울병원 등)
- 7명 의사
- 완전히 가짜 데이터

### ✅ 실제 데이터로 전환하는 방법

---

## 방법 1: 공공데이터포털 API 사용 (추천)

### 1단계: API 키 발급

1. **공공데이터포털 회원가입**
   - https://www.data.go.kr/ 접속
   - 회원가입 및 로그인

2. **API 활용신청**
   - 검색창에 "병원정보서비스" 입력
   - "건강보험심사평가원_병원정보서비스" 선택
   - "활용신청" 버튼 클릭
   - 상세기능정보 페이지에서 각 API 활용신청

3. **인증키 확인**
   - 마이페이지 > 오픈API > 개발계정
   - 일반 인증키(Decoding) 복사

### 2단계: 환경변수 설정

```bash
# backend 디렉토리에 .env 파일 생성
cd C:\Claude\hospital-doctor-system\backend
notepad .env
```

```env
# .env 파일 내용
PUBLIC_DATA_API_KEY=발급받은_인증키를_여기에_붙여넣기
PORT=5000
```

### 3단계: 실제 데이터 수집

```bash
# 스크립트 파일 수정
notepad src/scripts/fetchRealData.js

# 다음 라인 수정:
# CONFIRM_DELETE = false;  →  CONFIRM_DELETE = true;

# 스크립트 실행
node src/scripts/fetchRealData.js
```

### 4단계: 서버 재시작

```bash
# 기존 서버 종료 (Ctrl+C)
# 서버 재시작
npm start
```

### 수집 결과

- **서울**: 약 2만개 병원
- **부산**: 약 5천개 병원
- **대구**: 약 3천개 병원
- **인천**: 약 3천개 병원
- **광주**: 약 2천개 병원
- **대전**: 약 2천개 병원

**총 약 3~4만개 실제 병원 데이터 수집**

### API 제공 정보

```javascript
{
  name: "서울대학교병원",           // 병원명
  type: "상급종합병원",             // 병원 종별
  region: "서울",                  // 시도
  city: "종로구",                  // 시군구
  address: "서울시 종로구 대학로 101", // 주소
  phone: "02-2072-2114",           // 전화번호
  beds: 1779,                      // 병상 수
  postalCode: "03080",             // 우편번호
  latitude: 37.5800,               // 위도
  longitude: 127.0016,             // 경도
  emergencyRoom: true              // 응급실 운영 여부
}
```

---

## 방법 2: 병원 자체 등록 시스템

### 의사 정보는 왜 공공 API에 없나요?

**개인정보보호법 때문입니다.**
- ❌ 의사 이름
- ❌ 연락처
- ❌ 이메일
- ❌ 학력/경력

### 해결 방법: 병원 관리자 시스템

#### 1. 병원 관리자 로그인

```javascript
// POST /api/admin/login
{
  "hospital_id": 1,
  "admin_code": "ADMIN12024"  // 형식: ADMIN{병원ID}2024
}

// Response
{
  "success": true,
  "token": "TOKEN_1234567890_1",
  "hospital": {
    "id": 1,
    "name": "서울대학교병원"
  }
}
```

#### 2. 의사 등록

```javascript
// POST /api/admin/doctors
// Headers: { Authorization: "Bearer TOKEN_1234567890_1" }
{
  // 필수 정보
  "name": "김현수",
  "specialty": "내과",
  "license_number": "D2010-1234",

  // 선택 정보
  "sub_specialty": "순환기내과",
  "phone": "010-1234-5678",
  "email": "kim.hs@hospital.kr",
  "position": "임상교수",
  "department": "순환기내과",
  "start_date": "2015-03-01",

  // 학력 (배열)
  "education": [
    {
      "degree": "의학박사",
      "school": "서울대학교 의과대학",
      "major": "순환기내과학",
      "graduation_year": 2010
    }
  ],

  // 자격증 (배열)
  "certifications": [
    {
      "certification_name": "순환기내과 분과전문의",
      "issuer": "대한순환기학회",
      "issue_date": "2010-03-01"
    }
  ]
}
```

#### 3. 병원 소속 의사 목록 조회

```javascript
// GET /api/admin/doctors
// Headers: { Authorization: "Bearer TOKEN_1234567890_1" }

// Response: 현재 병원에 근무 중인 의사 목록
```

#### 4. 의사 정보 수정

```javascript
// PUT /api/admin/doctors/{doctor_id}
// Headers: { Authorization: "Bearer TOKEN_1234567890_1" }
{
  "phone": "010-9999-8888",
  "email": "new.email@hospital.kr"
}
```

#### 5. 의사 퇴사 처리

```javascript
// DELETE /api/admin/doctors/{doctor_id}
// Headers: { Authorization: "Bearer TOKEN_1234567890_1" }
{
  "end_date": "2024-12-31"
}
```

---

## 방법 3: 하이브리드 (추천)

### 병원 데이터: 공공 API
- 9만개 실제 병원
- 정기 업데이트 (월 1회)

### 의사 데이터: 병원 직접 등록
- 병원 관리자가 직접 입력
- 의사 동의 하에 정보 공개
- 실시간 업데이트

---

## 데이터 업데이트 전략

### 자동 업데이트 (선택)

```javascript
// backend/src/scripts/autoUpdate.js
import cron from 'node-cron';

// 매월 1일 새벽 2시에 자동 업데이트
cron.schedule('0 2 1 * *', async () => {
  console.log('공공데이터 업데이트 시작...');
  await fetchAndStoreHospitals();
});
```

### 수동 업데이트

```bash
# 필요할 때마다 실행
node src/scripts/fetchRealData.js
```

---

## 법적 고려사항

### ✅ 합법적 사용

1. **공공데이터포털 API**
   - 정부 공식 데이터
   - 이용약관 준수
   - 상업적 이용 시 별도 승인 필요

2. **병원 자체 등록**
   - 병원과 의사의 동의
   - 개인정보 처리방침 명시
   - 정보 삭제 요청 프로세스

### ❌ 불법적 사용

1. **크롤링**
   - 병원 홈페이지 무단 크롤링 금지
   - robots.txt 무시 금지
   - 저작권법 위반 가능

2. **개인정보 무단 수집**
   - 동의 없는 의사 정보 수집 금지
   - 개인정보보호법 위반

---

## 프로덕션 배포 시 체크리스트

- [ ] 공공데이터 API 키 발급 및 설정
- [ ] 실제 병원 데이터 수집
- [ ] 병원 관리자 인증 강화 (JWT, 비밀번호 암호화)
- [ ] HTTPS 적용
- [ ] 실제 데이터베이스 사용 (PostgreSQL, MySQL)
- [ ] 개인정보 처리방침 작성
- [ ] 이용약관 작성
- [ ] 정보 삭제 요청 프로세스 구현
- [ ] 백업 시스템 구축
- [ ] 모니터링 시스템 구축

---

## 예상 비용

### 무료
- 공공데이터포털 API
- 서버 구축 (자체)
- 개발 인력 (자체)

### 유료 (선택)
- 클라우드 서버: 월 5만원~
- 데이터베이스: 월 3만원~
- SSL 인증서: 연 10만원 (또는 무료)
- 도메인: 연 2만원~

**총 예상 비용: 월 8만원~ (최소)**

---

## 문의 및 지원

- 공공데이터포털: https://www.data.go.kr/
- 고객센터: 1661-2244
- 이메일: callcenter@data.go.kr
