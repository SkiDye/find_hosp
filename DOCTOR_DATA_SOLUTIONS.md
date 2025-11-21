# 의사 정보 수집 - 실제 구현 가능한 방법들

## ❌ 오해: "의사 정보는 아예 못 얻는다?"
→ **아닙니다!** 합법적으로 얻을 수 있는 방법이 여러 가지 있습니다.

---

## ✅ 실제 가능한 방법들

### 1. 병원 홈페이지 공개 정보 활용 (가장 현실적) ⭐

#### 왜 가능한가?
- 대형 병원들은 **자체 홈페이지에서 의료진 정보를 공개**합니다
- 이미 병원이 공개한 정보이므로 법적 문제 없음
- 의사들도 홍보 목적으로 동의한 정보

#### 어떤 정보를 얻을 수 있나?
```javascript
{
  name: "김현수",                    // ✅ 공개됨
  specialty: "순환기내과",            // ✅ 공개됨
  position: "교수",                  // ✅ 공개됨
  department: "심장내과",            // ✅ 공개됨
  photo: "doctor.jpg",               // ✅ 공개됨
  education: [                       // ✅ 공개됨
    "서울대 의대 졸업",
    "서울대병원 내과 전공의",
    "하버드 의대 연수"
  ],
  specialties: [                     // ✅ 공개됨
    "관상동맥질환",
    "심부전",
    "부정맥"
  ],
  // ❌ 연락처, 이메일은 보통 없음 (병원 대표번호만)
}
```

#### 예시 - 주요 병원들
- **서울대병원**: https://www.snuh.org/health/doctor/
- **삼성서울병원**: https://www.samsunghospital.com/doctor/
- **서울아산병원**: http://www.amc.seoul.kr/asan/doctors/
- **세브란스병원**: https://sev.severance.healthcare/doctor/

#### 구현 방법

**Option A: 수동 입력 시스템**
```javascript
// 관리자가 병원 홈페이지 보고 직접 입력
// 가장 안전하고 정확함
```

**Option B: 반자동 스크래핑 (주의 필요)**
```javascript
// 1. robots.txt 확인 필수
// 2. 병원 동의 필요
// 3. 크롤링 간격 조절 (서버 부담 최소화)
// 4. 정기적으로 업데이트

// 예시 코드 (Puppeteer 사용)
import puppeteer from 'puppeteer';

async function scrapeDoctorInfo(hospitalUrl) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(hospitalUrl);

  const doctors = await page.evaluate(() => {
    // 병원마다 HTML 구조가 다르므로 각각 파싱 필요
    return Array.from(document.querySelectorAll('.doctor-item')).map(el => ({
      name: el.querySelector('.name')?.textContent,
      specialty: el.querySelector('.specialty')?.textContent,
      // ...
    }));
  });

  await browser.close();
  return doctors;
}
```

**법적 안전장치:**
- robots.txt 준수
- 크롤링 간격 1초 이상
- User-Agent 명시
- 병원에 이메일로 사전 통보
- 데이터 출처 표시

---

### 2. 대한의사협회 의사 검색 서비스

#### API 정보
- **URL**: https://www.kma.org/
- **서비스**: 의사 면허 검색, 전문의 검색
- **제공 정보**: 이름, 면허번호, 전문과, 취득연도

#### 특징
- 공식 기관이므로 신뢰도 높음
- 의사 본인이 등록한 정보
- 전문의 자격 확인 가능

#### 문제점
- API가 공개되어 있지 않음 (웹 검색만 가능)
- 병원 정보 없음 (개인 정보만)
- 크롤링 필요 → 협회 승인 필요

---

### 3. 건강보험심사평가원 - 의료기관 상세 정보

#### 활용 방법
```javascript
// 병원정보서비스 API에서 상세 정보 호출
GET /getHospBasisInfo?ykiho={요양기호}

// 응답에 진료과목별 의료진 수 포함 (개인 이름은 없음)
{
  "내과 전문의": 15,
  "외과 전문의": 8,
  "소아과 전문의": 5
}
```

#### 한계
- 의사 개인 이름 없음
- 통계 정보만 제공
- 하지만 **병원 규모 파악에는 유용**

---

### 4. 기존 의료 플랫폼 API 연동 (유료)

#### 플랫폼들
1. **굿닥** (https://www.goodoc.co.kr/)
   - 약 10만명 의사 정보
   - API 제공 (B2B 계약 필요)
   - 예상 비용: 월 50~100만원

2. **강남언니** (미용 전문)
   - 성형외과, 피부과 전문
   - API 제공 (계약 필요)

3. **병원어디**
   - 병원/의사 리뷰 플랫폼
   - API 협의 가능

#### 장점
- 이미 수집된 대량 데이터
- 법적 문제 해결됨
- 지속적 업데이트

#### 단점
- 비용 발생
- 계약 필요
- 데이터 재판매 제한 가능

---

### 5. 크라우드소싱 (장기 전략)

#### 개념
사용자들이 직접 정보를 입력하고 검증

```javascript
// 예시: 환자가 다녀온 병원의 의사 정보 입력
POST /api/contribute/doctor
{
  hospital_id: 1,
  doctor_name: "김현수",
  specialty: "순환기내과",
  visited_date: "2024-01-15",
  source: "환자 제보"
}

// 여러 사용자의 정보가 일치하면 자동 승인
// 예: 3명 이상이 같은 정보 제보 시 승인
```

#### 장점
- 무료
- 최신 정보 (이직 즉시 반영)
- 자동 업데이트

#### 단점
- 초기 데이터 없음
- 검증 시스템 필요
- 허위 정보 위험

---

## 🚀 추천 구현 순서

### Phase 1: 즉시 구현 (1주일)
1. **병원 데이터**: 공공데이터 API → 9만개 실제 병원
2. **의사 데이터**: 주요 대형 병원 (10곳) 홈페이지에서 수동 입력
   - 서울대병원, 삼성서울병원, 아산병원 등
   - 각 병원당 100~200명 의사
   - **총 1,000~2,000명 실제 의사 정보**

### Phase 2: 자동화 (2주일)
1. 병원 홈페이지 스크래핑 자동화
   - robots.txt 준수
   - 병원별 파서 개발
   - 주 1회 자동 업데이트
2. 약 100개 주요 병원 → **1만~2만명 의사**

### Phase 3: 확장 (1개월)
1. 병원 자체 등록 시스템 오픈
2. 크라우드소싱 기능 추가
3. 데이터 검증 시스템

### Phase 4: 프로덕션 (3개월)
1. 유료 플랫폼 API 연동 (예산 있는 경우)
2. 전국 주요 병원 커버
3. **목표: 5만명 이상 의사 정보**

---

## 💻 즉시 구현 가능한 코드

### 병원 홈페이지 파서 예시

```javascript
// backend/src/services/hospitalWebScraper.js
import puppeteer from 'puppeteer';

const HOSPITAL_PARSERS = {
  // 서울대병원 파서
  snuh: async (page) => {
    await page.goto('https://www.snuh.org/health/doctor/');

    return await page.evaluate(() => {
      const doctors = [];
      document.querySelectorAll('.doctor-list-item').forEach(el => {
        doctors.push({
          name: el.querySelector('.doctor-name')?.textContent.trim(),
          specialty: el.querySelector('.specialty')?.textContent.trim(),
          department: el.querySelector('.department')?.textContent.trim(),
          education: Array.from(el.querySelectorAll('.education li'))
            .map(li => li.textContent.trim()),
          photo: el.querySelector('img')?.src
        });
      });
      return doctors;
    });
  },

  // 삼성서울병원 파서
  smc: async (page) => {
    // 삼성서울병원 HTML 구조에 맞춘 파서
  },

  // 추가 병원들...
};

export async function scrapeDoctorsFromHospital(hospitalCode) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox']
  });

  try {
    const page = await browser.newPage();

    // User-Agent 설정 (봇임을 명시)
    await page.setUserAgent(
      'HospitalDoctorBot/1.0 (contact@yourdomain.com)'
    );

    const parser = HOSPITAL_PARSERS[hospitalCode];
    if (!parser) {
      throw new Error(`Parser not found for ${hospitalCode}`);
    }

    const doctors = await parser(page);

    return {
      success: true,
      hospital: hospitalCode,
      count: doctors.length,
      doctors
    };

  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  } finally {
    await browser.close();
  }
}
```

### 실행 스크립트

```javascript
// backend/src/scripts/scrapeDoctors.js
import { scrapeDoctorsFromHospital } from '../services/hospitalWebScraper.js';
import db from '../database/init.js';
import Doctor from '../models/Doctor.js';

const HOSPITALS_TO_SCRAPE = [
  { code: 'snuh', id: 1, name: '서울대병원' },
  { code: 'smc', id: 2, name: '삼성서울병원' },
  // ...
];

async function main() {
  console.log('🏥 병원 의사 정보 수집 시작...\n');

  for (const hospital of HOSPITALS_TO_SCRAPE) {
    console.log(`📍 ${hospital.name} 수집 중...`);

    const result = await scrapeDoctorsFromHospital(hospital.code);

    if (result.success) {
      // DB에 저장
      for (const doctor of result.doctors) {
        const doctorId = Doctor.create({
          name: doctor.name,
          specialty: doctor.specialty,
          // ...
        });

        // 경력 정보 추가
        Doctor.addCareer(doctorId, {
          hospital_id: hospital.id,
          position: doctor.position || '의사',
          department: doctor.department,
          start_date: new Date().toISOString().split('T')[0],
          is_current: true
        });
      }

      console.log(`   ✅ ${result.count}명 수집 완료\n`);
    } else {
      console.log(`   ❌ 실패: ${result.error}\n`);
    }

    // 크롤링 간격 (서버 부담 최소화)
    await sleep(3000); // 3초
  }

  console.log('✨ 수집 완료!');
}

main();
```

---

## 📋 체크리스트

### 법적 안전성
- [ ] robots.txt 확인 및 준수
- [ ] 크롤링 간격 1초 이상 유지
- [ ] User-Agent에 연락처 명시
- [ ] 병원에 사전 통보 메일 발송
- [ ] 데이터 출처 표시 ("출처: 서울대병원 홈페이지")
- [ ] 개인정보 최소 수집 (연락처/이메일 제외)

### 기술적 구현
- [ ] Puppeteer 설치: `npm install puppeteer`
- [ ] 각 병원별 파서 개발
- [ ] 오류 처리 (페이지 변경 시)
- [ ] 로깅 시스템
- [ ] 중복 제거

---

## 💡 결론

### ✅ 의사 관리 시스템은 구현 가능합니다!

**현실적인 접근:**
1. **1,000~2,000명**: 주요 10개 병원 수동 입력 (1주일)
2. **1만~2만명**: 자동 스크래핑 (1개월)
3. **5만명+**: 병원 등록 + 크라우드소싱 (3개월)

**무료로 시작 → 서비스 성장 시 유료 API 고려**

병원 데이터(9만개)는 이미 확보 가능하고,
의사 데이터도 합법적으로 충분히 수집 가능합니다!
