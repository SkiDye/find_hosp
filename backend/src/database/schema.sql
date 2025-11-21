-- 병원 정보 테이블
CREATE TABLE IF NOT EXISTS hospitals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  address TEXT NOT NULL,
  region TEXT NOT NULL,
  city TEXT NOT NULL,
  phone TEXT NOT NULL,
  homepage TEXT,
  specialties TEXT,
  beds INTEGER,
  established_date TEXT,
  latitude REAL,
  longitude REAL,
  ranking_domestic INTEGER,
  ranking_global INTEGER,
  notes TEXT,
  has_emergency_room INTEGER DEFAULT 0,
  open_24_hours INTEGER DEFAULT 0,
  weekend_available INTEGER DEFAULT 0,
  opening_hours TEXT,
  image_url TEXT,
  image_urls TEXT,
  namuwiki_image TEXT,
  wikipedia_image TEXT,
  homepage_image TEXT,
  naver_map_image TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 의사 정보 테이블
CREATE TABLE IF NOT EXISTS doctors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  specialty TEXT NOT NULL,
  sub_specialty TEXT,
  license_number TEXT UNIQUE NOT NULL,
  phone TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 경력 정보 테이블
CREATE TABLE IF NOT EXISTS careers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  doctor_id INTEGER NOT NULL,
  hospital_id INTEGER NOT NULL,
  position TEXT NOT NULL,
  department TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT,
  is_current INTEGER DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
  FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE CASCADE
);

-- 관리자 정보 테이블
CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  hospital_id INTEGER NOT NULL UNIQUE,
  admin_code TEXT NOT NULL UNIQUE,
  email TEXT,
  phone TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE CASCADE
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_hospitals_region ON hospitals(region);
CREATE INDEX IF NOT EXISTS idx_hospitals_city ON hospitals(city);
CREATE INDEX IF NOT EXISTS idx_hospitals_type ON hospitals(type);
CREATE INDEX IF NOT EXISTS idx_hospitals_emergency ON hospitals(has_emergency_room);
CREATE INDEX IF NOT EXISTS idx_hospitals_24hours ON hospitals(open_24_hours);
CREATE INDEX IF NOT EXISTS idx_hospitals_weekend ON hospitals(weekend_available);
CREATE INDEX IF NOT EXISTS idx_doctors_email ON doctors(email);
CREATE INDEX IF NOT EXISTS idx_doctors_license ON doctors(license_number);
CREATE INDEX IF NOT EXISTS idx_careers_doctor ON careers(doctor_id);
CREATE INDEX IF NOT EXISTS idx_careers_hospital ON careers(hospital_id);
CREATE INDEX IF NOT EXISTS idx_careers_current ON careers(is_current);
CREATE INDEX IF NOT EXISTS idx_admins_hospital ON admins(hospital_id);
CREATE INDEX IF NOT EXISTS idx_admins_code ON admins(admin_code);
