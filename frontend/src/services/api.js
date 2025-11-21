// GitHub Pages 정적 버전 - JSON 데이터 사용
let cachedData = null;

// JSON 데이터 로드
async function loadData() {
  if (cachedData) return cachedData;
  
  const response = await fetch('/data.json');
  cachedData = await response.json();
  return cachedData;
}

// 필터링 함수
function filterHospitals(hospitals, filters = {}) {
  return hospitals.filter(hospital => {
    if (filters.region && hospital.region !== filters.region) return false;
    if (filters.city && hospital.city !== filters.city) return false;
    if (filters.type && hospital.type !== filters.type) return false;
    if (filters.specialty && !hospital.specialties.includes(filters.specialty)) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (!hospital.name.toLowerCase().includes(searchLower) && 
          !hospital.address.toLowerCase().includes(searchLower)) {
        return false;
      }
    }
    if (filters.has_emergency_room && !hospital.has_emergency_room) return false;
    if (filters.open_24_hours && !hospital.open_24_hours) return false;
    if (filters.weekend_available && !hospital.weekend_available) return false;
    return true;
  });
}

// 병원 API
export const hospitalAPI = {
  getAll: async (filters = {}) => {
    const data = await loadData();
    const filtered = filterHospitals(data.hospitals, filters);
    return { data: filtered };
  },
  
  getById: async (id) => {
    const data = await loadData();
    const hospital = data.hospitals.find(h => h.id === parseInt(id));
    return { data: hospital };
  },
  
  getDoctors: async (id) => {
    const data = await loadData();
    const careers = data.careers.filter(c => c.hospital_id === parseInt(id) && c.is_current);
    const doctorIds = careers.map(c => c.doctor_id);
    const doctors = data.doctors.filter(d => doctorIds.includes(d.id));
    return { data: doctors };
  },
  
  getStats: async () => {
    const data = await loadData();
    return { 
      data: { 
        total: data.hospitals.length,
        byType: {}
      } 
    };
  },
  
  // 쓰기 작업은 지원하지 않음 (정적 버전)
  create: () => Promise.reject('정적 버전에서는 지원하지 않습니다'),
  update: () => Promise.reject('정적 버전에서는 지원하지 않습니다'),
  delete: () => Promise.reject('정적 버전에서는 지원하지 않습니다'),
};

// 의사 API
export const doctorAPI = {
  getAll: async (filters = {}) => {
    const data = await loadData();
    let doctors = data.doctors;
    
    if (filters.specialty) {
      doctors = doctors.filter(d => d.specialty === filters.specialty);
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      doctors = doctors.filter(d => d.name.toLowerCase().includes(searchLower));
    }
    
    return { data: doctors };
  },
  
  getById: async (id) => {
    const data = await loadData();
    const doctor = data.doctors.find(d => d.id === parseInt(id));
    return { data: doctor };
  },
  
  getCurrentHospital: async (id) => {
    const data = await loadData();
    const career = data.careers.find(c => c.doctor_id === parseInt(id) && c.is_current);
    if (!career) return { data: null };
    
    const hospital = data.hospitals.find(h => h.id === career.hospital_id);
    return { data: hospital };
  },
  
  getStats: async () => {
    const data = await loadData();
    return { 
      data: { 
        total: data.doctors.length 
      } 
    };
  },
  
  // 쓰기 작업은 지원하지 않음
  create: () => Promise.reject('정적 버전에서는 지원하지 않습니다'),
  update: () => Promise.reject('정적 버전에서는 지원하지 않습니다'),
  delete: () => Promise.reject('정적 버전에서는 지원하지 않습니다'),
  addEducation: () => Promise.reject('정적 버전에서는 지원하지 않습니다'),
  addCareer: () => Promise.reject('정적 버전에서는 지원하지 않습니다'),
  updateCareer: () => Promise.reject('정적 버전에서는 지원하지 않습니다'),
  addCertification: () => Promise.reject('정적 버전에서는 지원하지 않습니다'),
};

// 관리자 API (정적 버전에서는 비활성화)
export const adminAPI = {
  login: () => Promise.reject('정적 버전에서는 지원하지 않습니다'),
  addDoctor: () => Promise.reject('정적 버전에서는 지원하지 않습니다'),
  updateDoctor: () => Promise.reject('정적 버전에서는 지원하지 않습니다'),
  deleteDoctor: () => Promise.reject('정적 버전에서는 지원하지 않습니다'),
};

export default { hospitalAPI, doctorAPI, adminAPI };
