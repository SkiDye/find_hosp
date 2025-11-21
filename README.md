# 병원·의사 관리 시스템

전국 병원 정보와 의사 이력을 관리하는 웹 애플리케이션입니다.

## 주요 기능

- **병원 관리**: 병원 등록, 조회, 검색 및 필터링
- **의사 관리**: 의사 정보, 학력, 경력, 자격증 관리
- **이직 추적**: 의사의 병원 간 이동 기록 타임라인
- **통계 대시보드**: 지역별/진료과별 통계 한눈에 보기
- **검색 기능**: 병원명, 주소, 의사명, 면허번호로 검색

## 기술 스택

### Backend
- Node.js + Express
- 메모리 기반 데이터베이스 (In-Memory Database)
- RESTful API

### Frontend
- React 18 + Vite
- React Router
- Axios
- 순수 CSS (반응형 디자인)

## 설치 및 실행

### 1. 프로젝트 클론 또는 디렉토리 이동
```bash
cd C:\Claude\hospital-doctor-system
```

### 2. Backend 실행
```bash
cd backend
npm install  # (이미 설치됨)
npm start
```

Backend 서버가 `http://localhost:5000`에서 실행됩니다.

### 3. Frontend 실행
새 터미널 창에서:
```bash
cd C:\Claude\hospital-doctor-system\frontend
npm install  # (이미 설치됨)
npm run dev
```

Frontend 앱이 `http://localhost:5173`에서 실행됩니다.

### 4. 브라우저에서 접속
http://localhost:5173 을 브라우저에서 열어주세요.

## API 엔드포인트

### 병원 API
- `GET /api/hospitals` - 모든 병원 조회 (필터링 가능)
- `GET /api/hospitals/:id` - 특정 병원 조회
- `GET /api/hospitals/:id/doctors` - 병원 소속 의사 목록
- `GET /api/hospitals/stats` - 병원 통계
- `POST /api/hospitals` - 병원 등록
- `PUT /api/hospitals/:id` - 병원 정보 수정
- `DELETE /api/hospitals/:id` - 병원 삭제

### 의사 API
- `GET /api/doctors` - 모든 의사 조회 (필터링 가능)
- `GET /api/doctors/:id` - 특정 의사 조회 (학력, 경력, 자격증 포함)
- `GET /api/doctors/:id/current-hospital` - 현재 근무 병원
- `GET /api/doctors/stats` - 의사 통계
- `POST /api/doctors` - 의사 등록
- `PUT /api/doctors/:id` - 의사 정보 수정
- `DELETE /api/doctors/:id` - 의사 삭제
- `POST /api/doctors/:id/education` - 학력 추가
- `POST /api/doctors/:id/career` - 경력 추가
- `PUT /api/doctors/:id/career/:careerId` - 경력 수정
- `POST /api/doctors/:id/certifications` - 자격증 추가

## 프로젝트 구조

```
hospital-doctor-system/
├── backend/
│   ├── src/
│   │   ├── database/
│   │   │   └── init.js          # 데이터베이스 초기화 (샘플 데이터 제거됨)
│   │   ├── models/
│   │   │   ├── Hospital.js       # 병원 모델
│   │   │   └── Doctor.js         # 의사 모델
│   │   ├── routes/
│   │   │   ├── hospitals.js      # 병원 라우트
│   │   │   └── doctors.js        # 의사 라우트
│   │   ├── services/
│   │   │   └── publicDataAPI.js  # 공공데이터 API 연동
│   │   └── server.js             # Express 서버 설정
│   ├── .env.example              # 환경변수 예시
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # 네비게이션 바
│   │   │   └── Footer.jsx        # Footer (데이터 출처 표시)
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx     # 대시보드
│   │   │   ├── HospitalList.jsx  # 병원 목록
│   │   │   ├── HospitalDetail.jsx # 병원 상세
│   │   │   ├── DoctorList.jsx    # 의사 목록
│   │   │   ├── DoctorDetail.jsx  # 의사 상세
│   │   │   ├── Terms.jsx         # 이용약관
│   │   │   └── Privacy.jsx       # 개인정보 처리방침
│   │   ├── services/
│   │   │   └── api.js            # API 서비스
│   │   ├── App.jsx               # 메인 앱 컴포넌트
│   │   ├── main.jsx              # 진입점
│   │   └── index.css             # 글로벌 스타일 (모바일 최적화)
│   └── package.json
├── README.md
├── LEGAL_RISK_ANALYSIS.md        # 법적 위험 분석
├── DATA_STRATEGY.md              # 데이터 수집 전략
└── DOCTOR_DATA_SOLUTIONS.md      # 의사 정보 수집 솔루션
```

## 법적 준수 사항

이 시스템은 다음 법률을 준수하여 개발되었습니다:
- **개인정보보호법**: 개인정보 처리방침 제공 (/privacy)
- **저작권법**: 데이터 출처 명시 및 공정 이용
- **의료법**: 의료광고 제한 준수

**법적 안전장치**:
- 이용약관 페이지 (/terms)
- 개인정보 처리방침 (/privacy)
- Footer에 데이터 출처 표시
- 병원 정보: 건강보험심사평가원 출처 명시
- 의사 정보: 병원 직접 등록 또는 공개 정보만 수집

**자세한 법적 분석**: [LEGAL_RISK_ANALYSIS.md](./LEGAL_RISK_ANALYSIS.md) 참고

## 데이터 소스

### ✅ 현재 상태: 실제 데이터 전용 시스템
**샘플 데이터는 모두 제거되었습니다.** 시스템은 다음 방법으로 실제 데이터를 수집합니다:

### 실제 데이터 사용 방법

#### 옵션 1: 공공데이터포털 API (추천)
**9만개 실제 병원 데이터 수집 가능**

1. **API 키 발급**
   - https://www.data.go.kr/ 회원가입
   - "병원정보서비스" 검색 후 활용신청
   - 인증키 발급 (즉시 또는 1-2일)

2. **환경변수 설정**
   ```bash
   # backend/.env 파일 생성
   PUBLIC_DATA_API_KEY=발급받은_인증키
   ```

3. **데이터 수집**
   ```bash
   # backend/src/scripts/fetchRealData.js 파일에서
   # CONFIRM_DELETE = true 로 변경 후 실행
   node src/scripts/fetchRealData.js
   ```

**자세한 가이드: [REAL_DATA_GUIDE.md](./REAL_DATA_GUIDE.md) 참고**

#### 옵션 2: 병원 자체 등록 시스템
**의사 정보는 개인정보보호법상 공개 불가**
- 병원 관리자가 직접 의사 정보 등록
- POST /api/admin/login (병원 로그인)
- POST /api/admin/doctors (의사 등록)

**관리자 코드 형식**: ADMIN{병원ID}2024
- 예: 병원ID가 1이면 → ADMIN12024

## 개발 모드

### Backend 자동 재시작
```bash
npm run dev  # Node.js --watch 모드
```

### Frontend 핫 리로드
```bash
npm run dev  # Vite 개발 서버
```

## 주의사항

- 데이터는 메모리에 저장되므로 서버 재시작 시 초기화됩니다
- 프로덕션 환경에서는 실제 데이터베이스 (PostgreSQL, MySQL 등) 사용을 권장합니다
- CORS가 활성화되어 있어 로컬 개발 환경에서 사용 가능합니다

## 라이선스

ISC
