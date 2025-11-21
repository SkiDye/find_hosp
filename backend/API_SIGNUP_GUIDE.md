# 공공데이터포털 API 신청 가이드

## 📋 신청 방법

### 1️⃣ 회원가입 및 로그인
1. https://www.data.go.kr 접속
2. 회원가입 (소셜 로그인 가능)
3. 로그인

### 2️⃣ API 검색 및 활용신청

#### 추천 API 목록:

**A. 건강보험심사평가원_전국 병의원 찾기 서비스** ⭐ (가장 추천)
- URL: https://www.data.go.kr/data/15051059/openapi.do
- 제공 정보:
  - 병원명, 주소, 전화번호
  - 진료과목
  - **운영시간** (평일/토요일/일요일)
  - 응급실 여부
  - 병상 수
- 트래픽: 일 10,000건
- **신청 방법**:
  1. 위 URL 접속
  2. "활용신청" 버튼 클릭
  3. 활용목적: "병원 정보 제공 웹서비스 개발"
  4. 상세기능: "병원 검색 및 정보 제공"
  5. 승인까지: **즉시~1일**

**B. 국민건강보험공단_요양기관 현황정보**
- URL: https://www.data.go.kr/data/15007912/openapi.do
- 제공 정보: 요양기관 기본 정보
- 트래픽: 일 1,000건
- 승인까지: 즉시~1일

**C. 보건복지부_전국 응급의료기관 조회 서비스**
- URL: https://www.data.go.kr/data/15000563/openapi.do
- 제공 정보: 응급실 운영 정보
- 트래픽: 일 1,000건
- 승인까지: 즉시~1일

### 3️⃣ 인증키 발급

1. "마이페이지" → "오픈API" → "개발계정" 메뉴
2. 활용신청한 API의 **일반 인증키(Encoding)** 복사
3. 또는 **일반 인증키(Decoding)** 복사 (둘 다 제공됨)

### 4️⃣ 인증키 입력

발급받은 인증키를 다음 파일에 입력:

```bash
backend/src/config/apiKeys.js
```

```javascript
export const API_KEYS = {
  // 건강보험심사평가원 API
  HIRA: 'YOUR_API_KEY_HERE',

  // 국민건강보험공단 API (선택)
  NHIS: 'YOUR_API_KEY_HERE',

  // 응급의료기관 API (선택)
  EMERGENCY: 'YOUR_API_KEY_HERE'
};
```

### 5️⃣ 스크립트 실행

```bash
cd backend
node src/scripts/fetchRealOperatingInfo.js
```

## 🔧 테스트 방법

API 키를 입력한 후 테스트:

```bash
# 단일 병원 테스트
node src/scripts/testApiConnection.js

# 전체 155개 의원 업데이트
node src/scripts/fetchRealOperatingInfo.js
```

## ⚠️ 주의사항

1. **일일 트래픽 제한**: 10,000건 (155개 의원 × 1회 = 155건 사용)
2. **호출 간격**: 0.5초 이상 권장 (API 서버 부하 방지)
3. **인증키 보안**: `.gitignore`에 apiKeys.js 추가됨 (깃허브 업로드 방지)

## 📞 문의

- 공공데이터포털 고객센터: 1566-3006
- 이메일: info@data.go.kr

## 🚀 다음 단계

API 키 발급 완료 후:
1. `backend/src/config/apiKeys.js`에 키 입력
2. `node src/scripts/fetchRealOperatingInfo.js` 실행
3. 155개 의원의 실제 운영정보 자동 업데이트 완료!
