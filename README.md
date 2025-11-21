# 내 주변 병원찾기

서울/경기 지역의 병원 정보를 제공하는 웹 애플리케이션입니다.

## 🌐 데모
https://skidye.github.io/find_hosp/

## ✨ 기능
- 🗺️ 위치 기반 병원 검색 (거리순 정렬)
- 🔍 다양한 필터링 (지역, 진료과, 병원 유형)
- 🏥 병원 상세 정보 (이미지 갤러리, 운영시간, 위치)
- ⏰ 실시간 영업 상태 표시
- 🚑 응급실/24시간/주말 진료 필터
- ⭐ 즐겨찾기 기능

## 📊 데이터
- 병원: 278개
- 서울/경기 주요 대형병원, 의원, 치과 포함
- 실제 GPS 좌표, 연락처, 운영시간 데이터

## 🛠 기술 스택
- **Frontend**: React + Vite
- **Backend**: Supabase (PostgreSQL)
- **Styling**: Custom CSS with responsive design
- **Maps**: Google Maps Embed API, Naver Maps integration

## 🚀 배포
- **Frontend**: GitHub Pages
- **Backend**: Supabase
- **Database**: PostgreSQL (Supabase)

## 📝 환경 설정
프론트엔드 환경변수 설정이 필요합니다:
```bash
cd frontend
cp .env.example .env
# .env 파일에서 VITE_API_URL을 Supabase API URL로 변경
```

## 💾 데이터 구조
- 병원 정보 (hospitals)
- 의사 정보 (doctors)
- 경력 정보 (careers)

---
🤖 Generated with [Claude Code](https://claude.com/claude-code)
