import { useState, useEffect } from 'react';
import { hospitalAPI } from '../services/api';
import { Link, useSearchParams } from 'react-router-dom';
import SkeletonCard from '../components/SkeletonCard';
import AdBanner from '../components/AdBanner';
import { getBusinessStatus } from '../utils/businessHours';
import { getSpecialtiesBySymptom, isSymptom, popularSymptoms } from '../utils/symptomMapping';
import { specialtyCategories, popularSpecialties } from '../utils/specialtyCategories';

// 거리 계산 함수 (Haversine 공식)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // 지구 반지름 (km)
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // km 단위
}

// 지역별 대표 좌표 (중심점)
const REGION_COORDINATES = {
  '서울': { latitude: 37.5665, longitude: 126.9780, name: '서울시청' },
  '경기': { latitude: 37.4138, longitude: 127.5183, name: '경기도청' },
  '인천': { latitude: 37.4563, longitude: 126.7052, name: '인천시청' },
  '강남구': { latitude: 37.5172, longitude: 127.0473, name: '강남구청' },
  '서초구': { latitude: 37.4837, longitude: 127.0324, name: '서초구청' },
  '송파구': { latitude: 37.5145, longitude: 127.1059, name: '송파구청' },
  '용산구': { latitude: 37.5326, longitude: 126.9900, name: '용산구청' },
  '성동구': { latitude: 37.5633, longitude: 127.0366, name: '성동구청' },
  '성북구': { latitude: 37.5894, longitude: 127.0167, name: '성북구청' },
  '은평구': { latitude: 37.6027, longitude: 126.9292, name: '은평구청' },
  '마포구': { latitude: 37.5663, longitude: 126.9019, name: '마포구청' },
  '중구': { latitude: 37.5640, longitude: 126.9970, name: '중구청' },
  '강북구': { latitude: 37.6396, longitude: 127.0257, name: '강북구청' },
  '광진구': { latitude: 37.5384, longitude: 127.0822, name: '광진구청' },
  '구로구': { latitude: 37.4954, longitude: 126.8874, name: '구로구청' },
  '금천구': { latitude: 37.4564, longitude: 126.8955, name: '금천구청' },
  '영등포구': { latitude: 37.5264, longitude: 126.8963, name: '영등포구청' },
  '수원시': { latitude: 37.2636, longitude: 127.0286, name: '수원시청' },
  '성남시': { latitude: 37.4200, longitude: 127.1267, name: '성남시청' },
  '고양시': { latitude: 37.6584, longitude: 126.8320, name: '고양시청' },
  '용인시': { latitude: 37.2411, longitude: 127.1776, name: '용인시청' },
  '안양시': { latitude: 37.3943, longitude: 126.9568, name: '안양시청' },
  '부천시': { latitude: 37.5036, longitude: 126.7660, name: '부천시청' },
  '광명시': { latitude: 37.4783, longitude: 126.8644, name: '광명시청' },
  '이천시': { latitude: 37.2720, longitude: 127.4350, name: '이천시청' },
  '남양주시': { latitude: 37.6360, longitude: 127.2164, name: '남양주시청' },
  '화성시': { latitude: 37.1990, longitude: 126.8310, name: '화성시청' }
};

const ITEMS_PER_PAGE = 12; // 한 번에 표시할 병원 개수

function HospitalList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [hospitals, setHospitals] = useState([]);
  const [allHospitals, setAllHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [sortByDistance, setSortByDistance] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationSource, setLocationSource] = useState(''); // 'gps' or '지역명'
  const [filters, setFilters] = useState({
    region: searchParams.get('region') || '',
    city: searchParams.get('city') || '',
    type: searchParams.get('type') || '',
    specialty: searchParams.get('specialty') || '',
    search: '',
    has_emergency_room: searchParams.get('has_emergency_room') === 'true',
    open_24_hours: searchParams.get('open_24_hours') === 'true',
    weekend_available: searchParams.get('weekend_available') === 'true'
  });
  const [favorites, setFavorites] = useState([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [symptomDetected, setSymptomDetected] = useState(null); // 감지된 증상 정보
  const [displayedCount, setDisplayedCount] = useState(ITEMS_PER_PAGE); // 표시할 병원 개수
  const [loadingMore, setLoadingMore] = useState(false); // 추가 로딩 상태

  useEffect(() => {
    fetchAllHospitals();
  }, []);

  useEffect(() => {
    fetchHospitals();
    setDisplayedCount(ITEMS_PER_PAGE); // 필터 변경 시 표시 개수 초기화
  }, [filters]);

  // 필터 변경 시 URL 업데이트
  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.region) params.set('region', filters.region);
    if (filters.city) params.set('city', filters.city);
    if (filters.type) params.set('type', filters.type);
    if (filters.specialty) params.set('specialty', filters.specialty);
    if (filters.has_emergency_room) params.set('has_emergency_room', 'true');
    if (filters.open_24_hours) params.set('open_24_hours', 'true');
    if (filters.weekend_available) params.set('weekend_available', 'true');

    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  // 즐겨찾기 로드
  useEffect(() => {
    const savedFavorites = localStorage.getItem('hospital_favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // 즐겨찾기 토글
  const toggleFavorite = (hospitalId) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(hospitalId)
        ? prev.filter(id => id !== hospitalId)
        : [...prev, hospitalId];

      localStorage.setItem('hospital_favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  // 즐겨찾기 여부 확인
  const isFavorite = (hospitalId) => {
    return favorites.includes(hospitalId);
  };

  // 사용자 위치 가져오기
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      // 위치 서비스를 지원하지 않으면 바로 수동 선택 모달 표시
      setShowLocationModal(true);
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        setUserLocation(location);
        setSortByDistance(true);
        setLocationSource('GPS');
        setLocationLoading(false);
        console.log('📍 현재 위치 (GPS):', location);
      },
      (error) => {
        setLocationLoading(false);
        console.error('위치 정보 오류:', error);

        // GPS를 못 가져오면 수동 선택 모달 표시
        if (error.code === error.POSITION_UNAVAILABLE || error.code === error.TIMEOUT) {
          setShowLocationModal(true);
        } else if (error.code === error.PERMISSION_DENIED) {
          alert('위치 정보 접근이 거부되었습니다.\n수동으로 지역을 선택할 수 있습니다.');
          setShowLocationModal(true);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // 수동으로 지역 선택
  const selectManualLocation = (locationKey) => {
    const coords = REGION_COORDINATES[locationKey];
    if (coords) {
      setUserLocation({
        latitude: coords.latitude,
        longitude: coords.longitude
      });
      setSortByDistance(true);
      setLocationSource(coords.name);
      setShowLocationModal(false);
      console.log('📍 선택한 위치:', coords.name, coords);
    }
  };

  const fetchAllHospitals = async () => {
    try {
      const response = await hospitalAPI.getAll({});
      setAllHospitals(response.data);
    } catch (error) {
      console.error('병원 전체 목록 로딩 실패:', error);
    }
  };

  const fetchHospitals = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching hospitals with filters:', filters);
      const response = await hospitalAPI.getAll(filters);
      console.log(`✅ Received ${response.data.length} hospitals`);
      setHospitals(response.data);
    } catch (error) {
      console.error('병원 목록 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    // 검색어가 입력된 경우 증상 감지
    if (name === 'search' && value.trim()) {
      const detected = isSymptom(value);
      if (detected) {
        const specialties = getSpecialtiesBySymptom(value);
        setSymptomDetected({ symptom: value, specialties });
      } else {
        setSymptomDetected(null);
      }
    } else if (name === 'search') {
      setSymptomDetected(null);
    }

    // region이 변경되면 city를 초기화
    if (name === 'region') {
      setFilters({
        ...filters,
        region: value,
        city: ''
      });
    } else {
      setFilters({
        ...filters,
        [name]: value
      });
    }
  };

  // 토글 필터 핸들러
  const handleToggleFilter = (filterName) => {
    setFilters({
      ...filters,
      [filterName]: !filters[filterName]
    });
  };

  // region에 속한 city 목록 추출
  const availableCities = filters.region
    ? [...new Set(allHospitals.filter(h => h.region === filters.region).map(h => h.city))].sort()
    : [];

  // 거리 계산 및 정렬
  const hospitalsWithDistance = userLocation
    ? hospitals.map(hospital => ({
        ...hospital,
        distance: hospital.latitude && hospital.longitude
          ? calculateDistance(
              userLocation.latitude,
              userLocation.longitude,
              hospital.latitude,
              hospital.longitude
            )
          : null
      }))
    : hospitals;

  let displayHospitals = sortByDistance && userLocation
    ? [...hospitalsWithDistance].sort((a, b) => {
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return a.distance - b.distance;
      })
    : hospitalsWithDistance;

  // 즐겨찾기 필터 적용
  if (showOnlyFavorites) {
    displayHospitals = displayHospitals.filter(hospital => isFavorite(hospital.id));
  }

  // 전체 개수 저장
  const totalCount = displayHospitals.length;
  const hasMore = displayedCount < totalCount;

  // 무한 스크롤: displayedCount만큼만 표시
  const paginatedHospitals = displayHospitals.slice(0, displayedCount);

  // 더 보기 함수
  const loadMore = () => {
    setLoadingMore(true);
    // 약간의 딜레이로 로딩 효과
    setTimeout(() => {
      setDisplayedCount(prev => prev + ITEMS_PER_PAGE);
      setLoadingMore(false);
    }, 300);
  };

  return (
    <div className="container" style={{position: 'relative'}}>
      <div className="page-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px'}}>
        <div>
          <h1 className="page-title">내 주변 병원찾기</h1>
          <p className="page-subtitle">찾으시는 병원이 있으신가요?</p>
        </div>

        {/* 우측 가로형 광고 - 데스크톱만 표시 */}
        <div className="hospital-header-ad" style={{display: 'none'}}>
          <AdBanner
            type="horizontal"
            style={{
              width: '728px',
              height: '90px',
              marginBottom: '0'
            }}
          />
        </div>
      </div>

      <div className="card" style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'white',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div className="search-bar" style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
          <input
            type="text"
            name="search"
            className="search-input"
            placeholder="병원명, 주소, 진료과, 증상으로 검색... (예: 두통, 복통, 감기)"
            value={filters.search}
            onChange={handleFilterChange}
            style={{minHeight: '48px', touchAction: 'manipulation', flex: 1}}
          />
          <button
            onClick={getUserLocation}
            disabled={locationLoading}
            style={{
              minHeight: '48px',
              padding: '0 20px',
              background: sortByDistance ? 'var(--primary-color)' : 'white',
              color: sortByDistance ? 'white' : 'var(--text-primary)',
              border: sortByDistance ? 'none' : '2px solid var(--border-color)',
              borderRadius: '8px',
              cursor: locationLoading ? 'wait' : 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              whiteSpace: 'nowrap',
              touchAction: 'manipulation',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {locationLoading ? '위치 확인 중...' : sortByDistance ? '📍 거리순 정렬' : '📍 가까운 병원 찾기'}
          </button>
          {sortByDistance && (
            <button
              onClick={() => {
                setSortByDistance(false);
                setUserLocation(null);
              }}
              style={{
                minHeight: '48px',
                padding: '0 16px',
                background: 'white',
                color: 'var(--text-secondary)',
                border: '2px solid var(--border-color)',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                touchAction: 'manipulation'
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* 증상 감지 메시지 */}
        {symptomDetected && symptomDetected.specialties.length > 0 && (
          <div style={{
            padding: '12px 20px',
            background: '#e8f5e9',
            borderRadius: '8px',
            marginTop: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            <span style={{fontSize: '14px', color: '#2e7d32', fontWeight: '500'}}>
              💡 "{symptomDetected.symptom}" 증상은 다음 진료과를 추천합니다:
            </span>
            <div style={{display: 'flex', gap: '6px', flexWrap: 'wrap'}}>
              {symptomDetected.specialties.map((specialty, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setFilters({ ...filters, specialty, search: '' });
                    setSymptomDetected(null);
                  }}
                  style={{
                    padding: '6px 12px',
                    background: 'white',
                    color: '#2e7d32',
                    border: '2px solid #2e7d32',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '600',
                    touchAction: 'manipulation',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#2e7d32';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.color = '#2e7d32';
                  }}
                >
                  {specialty} 찾기 →
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 인기 증상 빠른 검색 - 컴팩트 버전 */}
        {!filters.search && !symptomDetected && (
          <div style={{padding: '12px 20px', borderTop: '1px solid var(--border-color)', marginTop: '8px'}}>
            <div style={{fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-secondary)'}}>
              🔍 증상 빠른 검색
            </div>
            <div style={{display: 'flex', gap: '6px', flexWrap: 'wrap'}}>
              {popularSymptoms.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    const specialties = getSpecialtiesBySymptom(item.keyword);
                    setSymptomDetected({ symptom: item.keyword, specialties });
                    setFilters({ ...filters, search: item.keyword });
                  }}
                  style={{
                    minHeight: '32px',
                    padding: '0 12px',
                    background: 'white',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '500',
                    touchAction: 'manipulation',
                    transition: 'all 0.2s',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f0f7ff';
                    e.currentTarget.style.borderColor = 'var(--primary-color)';
                    e.currentTarget.style.color = 'var(--primary-color)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }}
                >
                  {item.icon} {item.keyword}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="filter-bar" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px'}}>
          <select
            name="specialty"
            value={filters.specialty}
            onChange={handleFilterChange}
            style={{minHeight: '48px', touchAction: 'manipulation'}}
          >
            <option value="">전체 진료과</option>
            <option value="내과">내과</option>
            <option value="외과">외과</option>
            <option value="정형외과">정형외과</option>
            <option value="신경외과">신경외과</option>
            <option value="산부인과">산부인과</option>
            <option value="소아청소년과">소아청소년과</option>
            <option value="안과">안과</option>
            <option value="이비인후과">이비인후과</option>
            <option value="피부과">피부과</option>
            <option value="비뇨의학과">비뇨의학과</option>
            <option value="정신건강의학과">정신건강의학과</option>
            <option value="재활의학과">재활의학과</option>
          </select>

          <select
            name="region"
            value={filters.region}
            onChange={handleFilterChange}
            style={{minHeight: '48px', touchAction: 'manipulation'}}
          >
            <option value="">전체 지역</option>
            <option value="서울">서울</option>
            <option value="경기">경기</option>
            <option value="인천">인천</option>
          </select>

          <select
            name="city"
            value={filters.city}
            onChange={handleFilterChange}
            disabled={!filters.region}
            style={{minHeight: '48px', touchAction: 'manipulation', opacity: filters.region ? 1 : 0.5}}
          >
            <option value="">전체 시/구</option>
            {availableCities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>

          <select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            style={{minHeight: '48px', touchAction: 'manipulation'}}
          >
            <option value="">전체 유형</option>
            <option value="상급종합병원">상급종합병원</option>
            <option value="종합병원">종합병원</option>
            <option value="병원">병원</option>
            <option value="의원">의원</option>
            <option value="치과">치과</option>
          </select>
        </div>

        {/* 운영정보 필터 (토글 버튼) - 컴팩트 버전 */}
        <div style={{padding: '12px 20px', borderTop: '1px solid var(--border-color)'}}>
          <div style={{fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-secondary)'}}>
            🏥 운영 정보
          </div>
          <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
          <button
            onClick={() => handleToggleFilter('has_emergency_room')}
            style={{
              minHeight: '36px',
              padding: '0 14px',
              background: filters.has_emergency_room ? 'var(--primary-color)' : 'white',
              color: filters.has_emergency_room ? 'white' : 'var(--text-primary)',
              border: filters.has_emergency_room ? 'none' : '1px solid var(--border-color)',
              borderRadius: '18px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '600',
              touchAction: 'manipulation',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              transition: 'all 0.2s'
            }}
          >
            🚑 응급실
          </button>
          <button
            onClick={() => handleToggleFilter('open_24_hours')}
            style={{
              minHeight: '36px',
              padding: '0 14px',
              background: filters.open_24_hours ? 'var(--primary-color)' : 'white',
              color: filters.open_24_hours ? 'white' : 'var(--text-primary)',
              border: filters.open_24_hours ? 'none' : '1px solid var(--border-color)',
              borderRadius: '18px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '600',
              touchAction: 'manipulation',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              transition: 'all 0.2s'
            }}
          >
            🌙 24시간
          </button>
          <button
            onClick={() => handleToggleFilter('weekend_available')}
            style={{
              minHeight: '36px',
              padding: '0 14px',
              background: filters.weekend_available ? 'var(--primary-color)' : 'white',
              color: filters.weekend_available ? 'white' : 'var(--text-primary)',
              border: filters.weekend_available ? 'none' : '1px solid var(--border-color)',
              borderRadius: '18px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '600',
              touchAction: 'manipulation',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              transition: 'all 0.2s'
            }}
          >
            📅 주말
          </button>
          <button
            onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
            style={{
              minHeight: '36px',
              padding: '0 14px',
              background: showOnlyFavorites ? 'var(--primary-color)' : 'white',
              color: showOnlyFavorites ? 'white' : 'var(--text-primary)',
              border: showOnlyFavorites ? 'none' : '1px solid var(--border-color)',
              borderRadius: '18px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '600',
              touchAction: 'manipulation',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              transition: 'all 0.2s'
            }}
          >
            ❤️ 즐겨찾기
            {favorites.length > 0 && (
              <span style={{
                background: showOnlyFavorites ? 'rgba(255,255,255,0.3)' : 'var(--primary-color)',
                color: showOnlyFavorites ? 'white' : 'white',
                borderRadius: '10px',
                padding: '2px 6px',
                fontSize: '11px',
                fontWeight: 'bold'
              }}>
                {favorites.length}
              </span>
            )}
          </button>
          </div>
        </div>

        {(filters.specialty || filters.region || filters.city || filters.type || filters.has_emergency_room || filters.open_24_hours || filters.weekend_available || showOnlyFavorites) && (
          <div style={{padding: '12px 20px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)'}}>
            <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center'}}>
              <span style={{fontSize: '13px', color: 'var(--text-secondary)'}}>적용된 필터:</span>
              {showOnlyFavorites && (
                <span className="badge" style={{background: 'var(--primary-color)', color: 'white', padding: '4px 8px'}}>
                  ❤️ 즐겨찾기
                </span>
              )}
              {filters.specialty && (
                <span className="badge" style={{background: 'var(--primary-color)', color: 'white', padding: '4px 8px'}}>
                  {filters.specialty}
                </span>
              )}
              {filters.region && (
                <span className="badge" style={{background: 'var(--primary-color)', color: 'white', padding: '4px 8px'}}>
                  {filters.region}
                </span>
              )}
              {filters.city && (
                <span className="badge" style={{background: 'var(--primary-color)', color: 'white', padding: '4px 8px'}}>
                  {filters.city}
                </span>
              )}
              {filters.type && (
                <span className="badge" style={{background: 'var(--primary-color)', color: 'white', padding: '4px 8px'}}>
                  {filters.type}
                </span>
              )}
              {filters.has_emergency_room && (
                <span className="badge" style={{background: 'var(--primary-color)', color: 'white', padding: '4px 8px'}}>
                  🚑 응급실
                </span>
              )}
              {filters.open_24_hours && (
                <span className="badge" style={{background: 'var(--primary-color)', color: 'white', padding: '4px 8px'}}>
                  🌙 24시간
                </span>
              )}
              {filters.weekend_available && (
                <span className="badge" style={{background: 'var(--primary-color)', color: 'white', padding: '4px 8px'}}>
                  📅 주말진료
                </span>
              )}
              <button
                onClick={() => {
                  setFilters({ region: '', city: '', type: '', specialty: '', search: '', has_emergency_room: false, open_24_hours: false, weekend_available: false });
                  setShowOnlyFavorites(false);
                }}
                style={{
                  minHeight: '32px',
                  padding: '6px 12px',
                  fontSize: '13px',
                  background: 'transparent',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  touchAction: 'manipulation'
                }}
              >
                필터 초기화
              </button>
            </div>
          </div>
        )}

        {sortByDistance && userLocation && (
          <div style={{padding: '12px 20px', background: '#e8f5e9', borderBottom: '1px solid var(--border-color)'}}>
            <div style={{fontSize: '14px', color: '#2e7d32', fontWeight: '500'}}>
              📍 {locationSource === 'GPS' ? '현재 위치' : locationSource}에서 가까운 순으로 정렬되었습니다
            </div>
          </div>
        )}

        {loading ? (
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px', padding: '20px'}}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : totalCount === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🏥</div>
            <p className="empty-state-text">
              {filters.search || filters.region || filters.type
                ? '검색 결과가 없습니다'
                : '등록된 병원이 없습니다'}
            </p>
            {!filters.search && !filters.region && !filters.type && (
              <p style={{marginTop: '16px', fontSize: '14px', color: 'var(--text-secondary)'}}>
                공공데이터포털 API로 병원 정보를 가져오거나 직접 등록할 수 있습니다.
              </p>
            )}
          </div>
        ) : (
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px', padding: '20px'}}>
            {paginatedHospitals.map((hospital) => (
              <Link
                key={hospital.id}
                to={`/hospitals/${hospital.id}`}
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'block',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  background: 'white',
                  border: '1px solid var(--border-color)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* 병원 이미지 */}
                {hospital.image_url ? (
                  <div style={{
                    width: '100%',
                    height: '180px',
                    overflow: 'hidden',
                    position: 'relative',
                    background: 'var(--bg-secondary)'
                  }}>
                    <img
                      src={hospital.image_urls ? hospital.image_urls[0] : hospital.image_url}
                      alt={hospital.name}
                      loading="lazy"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                      onError={(e) => {
                        // image_urls 배열이 있으면 순차적으로 시도
                        if (hospital.image_urls) {
                          if (!e.target.dataset.retryCount) {
                            e.target.dataset.retryCount = '0';
                          }
                          const retryCount = parseInt(e.target.dataset.retryCount);

                          if (retryCount < hospital.image_urls.length - 1) {
                            // 다음 fallback 이미지 시도
                            e.target.dataset.retryCount = (retryCount + 1).toString();
                            e.target.src = hospital.image_urls[retryCount + 1];
                          } else {
                            // 모든 이미지 실패 시 아이콘 표시
                            e.target.onerror = null;
                            e.target.style.display = 'none';
                            const iconDiv = document.createElement('div');
                            iconDiv.style.cssText = 'width:100%;height:100%;background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);display:flex;align-items:center;justify-content:center;font-size:48px;color:white';
                            iconDiv.textContent = '🏥';
                            e.target.parentElement.appendChild(iconDiv);
                          }
                        } else {
                          // image_urls가 없으면 기본 fallback (Unsplash → 아이콘)
                          if (!e.target.dataset.fallbackUsed) {
                            e.target.dataset.fallbackUsed = 'true';
                            const fallbackImage = hospital.type === '상급종합병원'
                              ? 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=400&fit=crop'
                              : hospital.type === '종합병원'
                              ? 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=400&fit=crop'
                              : 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800&h=400&fit=crop';
                            e.target.src = fallbackImage;
                          } else {
                            e.target.onerror = null;
                            e.target.style.display = 'none';
                            const iconDiv = document.createElement('div');
                            iconDiv.style.cssText = 'width:100%;height:100%;background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);display:flex;align-items:center;justify-content:center;font-size:48px;color:white';
                            iconDiv.textContent = '🏥';
                            e.target.parentElement.appendChild(iconDiv);
                          }
                        }
                      }}
                    />
                    {/* 좌측 상단 운영정보 배지 */}
                    {(hospital.has_emergency_room || hospital.open_24_hours || hospital.weekend_available) && (
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        display: 'flex',
                        gap: '4px',
                        flexWrap: 'wrap',
                        maxWidth: '60%'
                      }}>
                        {hospital.has_emergency_room && (
                          <span style={{
                            fontSize: '11px',
                            padding: '3px 8px',
                            background: 'rgba(254, 226, 226, 0.95)',
                            color: '#991b1b',
                            borderRadius: '4px',
                            fontWeight: '600',
                            backdropFilter: 'blur(4px)'
                          }}>
                            🚑 응급
                          </span>
                        )}
                        {hospital.open_24_hours && (
                          <span style={{
                            fontSize: '11px',
                            padding: '3px 8px',
                            background: 'rgba(219, 234, 254, 0.95)',
                            color: '#1e40af',
                            borderRadius: '4px',
                            fontWeight: '600',
                            backdropFilter: 'blur(4px)'
                          }}>
                            🌙 24
                          </span>
                        )}
                        {hospital.weekend_available && (
                          <span style={{
                            fontSize: '11px',
                            padding: '3px 8px',
                            background: 'rgba(220, 252, 231, 0.95)',
                            color: '#166534',
                            borderRadius: '4px',
                            fontWeight: '600',
                            backdropFilter: 'blur(4px)'
                          }}>
                            📅 주말
                          </span>
                        )}
                      </div>
                    )}

                    {/* 우측 상단 병원 타입 */}
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'rgba(255,255,255,0.95)',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      color: hospital.type === '의원' ? '#16a34a' : 'var(--primary-color)'
                    }}>
                      {hospital.type}
                    </div>
                  </div>
                ) : (
                  <div style={{
                    width: '100%',
                    height: '180px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '48px',
                    color: 'white'
                  }}>
                    🏥
                  </div>
                )}

                {/* 병원 정보 */}
                <div style={{padding: '16px', position: 'relative'}}>
                  {/* 병원 이름 + 하트 버튼 */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '8px',
                    gap: '8px'
                  }}>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: 'var(--text-primary)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      flex: 1
                    }}>
                      {hospital.name}
                    </h3>
                    {/* 즐겨찾기 버튼 */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite(hospital.id);
                      }}
                      style={{
                        background: isFavorite(hospital.id) ? '#ef4444' : 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '50%',
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        fontSize: '18px',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                        transition: 'all 0.2s',
                        touchAction: 'manipulation',
                        padding: '0',
                        flexShrink: 0
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      {isFavorite(hospital.id) ? '❤️' : '🤍'}
                    </button>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '8px',
                    fontSize: '13px',
                    color: 'var(--text-secondary)'
                  }}>
                    <span>📍</span>
                    <span>{hospital.region} {hospital.city}</span>
                  </div>

                  <div style={{
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    marginBottom: '12px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {hospital.address}
                  </div>

                  {/* 전화번호 및 영업 상태 표시 */}
                  <div style={{
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px'
                  }}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                      <span>📞</span>
                      <span>{hospital.phone}</span>
                    </div>
                    {/* 영업 상태 표시 */}
                    {(() => {
                      const businessStatus = getBusinessStatus(hospital);
                      return (
                        <div style={{
                          background: businessStatus.bgColor,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: '600',
                          color: businessStatus.color,
                          border: `1px solid ${businessStatus.color}`,
                          whiteSpace: 'nowrap'
                        }}>
                          {businessStatus.text}
                        </div>
                      );
                    })()}
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '12px',
                    borderTop: '1px solid var(--border-color)',
                    gap: '8px'
                  }}>
                    <div style={{display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap'}}>
                      <a
                        href={`tel:${hospital.phone}`}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          padding: '6px 12px',
                          background: 'var(--primary-color)',
                          color: 'white',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          textDecoration: 'none',
                          whiteSpace: 'nowrap',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        📞 전화
                      </a>
                      {hospital.distance !== undefined && hospital.distance !== null && (
                        <span style={{fontSize: '13px', color: 'var(--primary-color)', fontWeight: 'bold'}}>
                          📍 {hospital.distance < 1
                            ? `${Math.round(hospital.distance * 1000)}m`
                            : `${hospital.distance.toFixed(1)}km`}
                        </span>
                      )}
                    </div>
                    <div style={{
                      fontSize: '13px',
                      fontWeight: 'bold',
                      color: 'var(--primary-color)'
                    }}>
                      상세보기 →
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* 더 보기 버튼 */}
        {!loading && hasMore && (
          <div style={{padding: '30px 20px', textAlign: 'center'}}>
            <button
              onClick={loadMore}
              disabled={loadingMore}
              style={{
                minHeight: '48px',
                padding: '12px 32px',
                background: loadingMore ? '#f3f4f6' : 'var(--primary-color)',
                color: loadingMore ? 'var(--text-secondary)' : 'white',
                border: 'none',
                borderRadius: '24px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: loadingMore ? 'not-allowed' : 'pointer',
                touchAction: 'manipulation',
                transition: 'all 0.2s',
                boxShadow: loadingMore ? 'none' : '0 2px 8px rgba(37, 99, 235, 0.3)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                if (!loadingMore) {
                  e.currentTarget.style.background = '#1d4ed8';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loadingMore) {
                  e.currentTarget.style.background = 'var(--primary-color)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(37, 99, 235, 0.3)';
                }
              }}
            >
              {loadingMore ? (
                <>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid var(--text-secondary)',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite'
                  }} />
                  로딩 중...
                </>
              ) : (
                <>
                  더 보기 ({displayedCount}/{totalCount})
                  <span style={{fontSize: '12px', opacity: 0.8}}>+{Math.min(ITEMS_PER_PAGE, totalCount - displayedCount)}개</span>
                </>
              )}
            </button>
            <style>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        )}

        {/* 전체 결과 표시 */}
        {!loading && totalCount > 0 && (
          <div style={{padding: '10px 20px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px'}}>
            {hasMore
              ? `전체 ${totalCount}개 중 ${displayedCount}개 표시`
              : `전체 ${totalCount}개 병원`}
          </div>
        )}
      </div>

      {/* 수동 위치 선택 모달 */}
      {showLocationModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '30px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
              <h2 style={{fontSize: '20px', fontWeight: 'bold'}}>위치 선택</h2>
              <button
                onClick={() => setShowLocationModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)'
                }}
              >
                ✕
              </button>
            </div>

            <p style={{marginBottom: '20px', color: 'var(--text-secondary)', fontSize: '14px'}}>
              GPS 위치 정보를 사용할 수 없습니다. 가까운 지역을 선택해주세요.
            </p>

            <div style={{marginBottom: '30px'}}>
              <h3 style={{fontSize: '16px', fontWeight: 'bold', marginBottom: '12px', color: 'var(--primary-color)'}}>서울특별시</h3>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px'}}>
                {['강남구', '서초구', '송파구', '용산구', '성동구', '성북구', '은평구', '마포구', '중구', '강북구', '광진구', '구로구', '금천구', '영등포구'].map(location => (
                  <button
                    key={location}
                    onClick={() => selectManualLocation(location)}
                    style={{
                      padding: '12px',
                      background: 'white',
                      border: '2px solid var(--border-color)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--primary-color)';
                      e.currentTarget.style.background = 'var(--bg-secondary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-color)';
                      e.currentTarget.style.background = 'white';
                    }}
                  >
                    📍 {location}
                  </button>
                ))}
              </div>
            </div>

            <div style={{marginBottom: '30px'}}>
              <h3 style={{fontSize: '16px', fontWeight: 'bold', marginBottom: '12px', color: 'var(--primary-color)'}}>경기도</h3>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px'}}>
                {['수원시', '성남시', '고양시', '용인시', '안양시', '부천시', '광명시', '이천시', '남양주시', '화성시'].map(location => (
                  <button
                    key={location}
                    onClick={() => selectManualLocation(location)}
                    style={{
                      padding: '12px',
                      background: 'white',
                      border: '2px solid var(--border-color)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--primary-color)';
                      e.currentTarget.style.background = 'var(--bg-secondary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-color)';
                      e.currentTarget.style.background = 'white';
                    }}
                  >
                    📍 {location}
                  </button>
                ))}
              </div>
            </div>

            <div style={{marginBottom: '20px'}}>
              <h3 style={{fontSize: '16px', fontWeight: 'bold', marginBottom: '12px', color: 'var(--primary-color)'}}>광역시/도</h3>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px'}}>
                {['서울', '경기', '인천'].map(location => (
                  <button
                    key={location}
                    onClick={() => selectManualLocation(location)}
                    style={{
                      padding: '12px',
                      background: 'white',
                      border: '2px solid var(--border-color)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--primary-color)';
                      e.currentTarget.style.background = 'var(--bg-secondary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-color)';
                      e.currentTarget.style.background = 'white';
                    }}
                  >
                    📍 {location}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HospitalList;
