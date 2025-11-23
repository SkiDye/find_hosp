-- Supabase용 완전한 병원 테이블 스키마
-- 기존 테이블이 있다면 먼저 삭제
DROP TABLE IF EXISTS hospitals CASCADE;

-- 병원 테이블 생성
CREATE TABLE hospitals (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  address TEXT NOT NULL,
  region TEXT NOT NULL,
  city TEXT NOT NULL,
  phone TEXT NOT NULL,
  homepage TEXT,
  specialties JSONB,
  beds INTEGER,
  established_date TEXT,
  latitude REAL,
  longitude REAL,
  ranking_domestic INTEGER,
  ranking_global INTEGER,
  notes TEXT,
  has_emergency_room BOOLEAN DEFAULT false,
  open_24_hours BOOLEAN DEFAULT false,
  weekend_available BOOLEAN DEFAULT false,
  opening_hours JSONB,
  image_urls JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_hospitals_region ON hospitals(region);
CREATE INDEX idx_hospitals_city ON hospitals(city);
CREATE INDEX idx_hospitals_type ON hospitals(type);
CREATE INDEX idx_hospitals_emergency ON hospitals(has_emergency_room);
CREATE INDEX idx_hospitals_24hours ON hospitals(open_24_hours);
CREATE INDEX idx_hospitals_weekend ON hospitals(weekend_available);

-- RLS (Row Level Security) 활성화
ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;

-- 읽기 권한 정책 (모든 사용자가 읽을 수 있음)
CREATE POLICY "Anyone can read hospitals" ON hospitals FOR SELECT USING (true);

-- 확인
SELECT 'Schema created successfully!' as status;
