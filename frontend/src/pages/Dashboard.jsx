import { useState, useEffect } from 'react';
import { hospitalAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import HospitalTypeInfoModal from '../components/HospitalTypeInfoModal';
import { getSpecialtiesBySymptom, isSymptom, popularSymptoms } from '../utils/symptomMapping';

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total: 0,
    byRegion: [],
    byCity: [],
    loading: true
  });
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [symptomDetected, setSymptomDetected] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await hospitalAPI.getStats();
        setStats({
          total: response.data.total || 0,
          byRegion: response.data.byRegion || [],
          byCity: response.data.byCity || [],
          loading: false
        });
      } catch (error) {
        console.error('통계 데이터 로딩 실패:', error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };
    fetchStats();
  }, []);

  // 오른손 엄지 도달성을 고려한 배치 (하단 우측에 많이 찾는 진료과 배치)
  const specialties = [
    { name: '재활의학과', icon: '♿', color: '#84cc16' },
    { name: '정신건강의학과', icon: '🧘', color: '#a855f7' },
    { name: '비뇨의학과', icon: '🩺', color: '#6366f1' },
    { name: '피부과', icon: '💆', color: '#f97316' },
    { name: '산부인과', icon: '👶', color: '#ec4899' },
    { name: '안과', icon: '👁️', color: '#3b82f6' },
    { name: '이비인후과', icon: '👂', color: '#14b8a6' },
    { name: '소아청소년과', icon: '👧', color: '#06b6d4' },
    { name: '신경외과', icon: '🧠', color: '#8b5cf6' },
    { name: '정형외과', icon: '🦴', color: '#10b981' },
    { name: '외과', icon: '🔪', color: '#f59e0b' },
    { name: '내과', icon: '🫀', color: '#ef4444' }
  ];

  const handleSpecialtyClick = (specialty) => {
    navigate(`/hospitals?specialty=${encodeURIComponent(specialty)}`);
  };

  const handleRegionClick = (region) => {
    navigate(`/hospitals?region=${encodeURIComponent(region)}`);
  };

  const handleCityClick = (region, city) => {
    navigate(`/hospitals?region=${encodeURIComponent(region)}&city=${encodeURIComponent(city)}`);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);

    if (value.trim()) {
      const detected = isSymptom(value);
      if (detected) {
        const specialties = getSpecialtiesBySymptom(value);
        setSymptomDetected({ symptom: value, specialties });
      } else {
        setSymptomDetected(null);
      }
    } else {
      setSymptomDetected(null);
    }
  };

  const handleSymptomClick = (symptom) => {
    const specialties = getSpecialtiesBySymptom(symptom);
    setSearchInput(symptom);
    setSymptomDetected({ symptom, specialties });
  };

  const handleSpecialtyFromSymptom = (specialty) => {
    navigate(`/hospitals?specialty=${encodeURIComponent(specialty)}`);
  };

  if (stats.loading) {
    return <div className="loading">로딩 중...</div>;
  }

  return (
    <div className="container">
      <div className="page-header" style={{textAlign: 'center', marginBottom: '32px'}}>
        <h1 className="page-title" style={{fontSize: 'clamp(24px, 5vw, 32px)', marginBottom: '8px'}}>어디가 불편하세요?</h1>
        <p className="page-subtitle" style={{fontSize: 'clamp(13px, 3vw, 16px)', marginBottom: '12px'}}>증상이나 진료과를 선택하시면 가까운 병원을 찾아드립니다</p>
        <button
          onClick={() => setShowInfoModal(true)}
          style={{
            padding: '8px 16px',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
            transition: 'all 0.2s',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
          }}
        >
          💡 병원과 의원의 차이?
        </button>
      </div>

      {/* 증상 검색 섹션 */}
      <div className="card" style={{marginBottom: '24px', padding: '16px'}}>
        <div>
          <input
            type="text"
            placeholder="증상을 입력하세요 (예: 두통, 복통, 감기)"
            value={searchInput}
            onChange={handleSearchChange}
            style={{
              width: '100%',
              minHeight: '48px',
              padding: '12px 16px',
              fontSize: '14px',
              border: '2px solid var(--border-color)',
              borderRadius: '10px',
              outline: 'none',
              transition: 'all 0.2s',
              touchAction: 'manipulation'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--primary-color)';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />

          {/* 증상 감지 메시지 */}
          {symptomDetected && symptomDetected.specialties.length > 0 && (
            <div style={{
              marginTop: '12px',
              padding: '12px',
              background: '#e8f5e9',
              borderRadius: '10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <span style={{fontSize: '13px', color: '#2e7d32', fontWeight: '600'}}>
                💡 "{symptomDetected.symptom}" 증상은 다음 진료과를 추천합니다:
              </span>
              <div style={{display: 'flex', gap: '6px', flexWrap: 'wrap'}}>
                {symptomDetected.specialties.map((specialty, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSpecialtyFromSymptom(specialty)}
                    style={{
                      padding: '8px 14px',
                      background: 'white',
                      color: '#2e7d32',
                      border: '2px solid #2e7d32',
                      borderRadius: '8px',
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

          {/* 인기 증상 빠른 검색 */}
          {!searchInput && !symptomDetected && (
            <div style={{marginTop: '12px'}}>
              <div style={{fontSize: '12px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-secondary)'}}>
                🔍 자주 찾는 증상
              </div>
              <div style={{display: 'flex', gap: '6px', flexWrap: 'wrap'}}>
                {popularSymptoms.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSymptomClick(item.keyword)}
                    style={{
                      minHeight: '36px',
                      padding: '0 14px',
                      background: 'white',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '18px',
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
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'white';
                      e.currentTarget.style.borderColor = 'var(--border-color)';
                      e.currentTarget.style.color = 'var(--text-primary)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {item.icon} {item.keyword}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="card" style={{marginBottom: '24px', padding: '16px'}}>
        <div style={{fontSize: '14px', fontWeight: '700', marginBottom: '12px', color: 'var(--text-primary)'}}>
          💊 주요 진료과
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
          gap: '10px'
        }}>
          {specialties.map((specialty) => (
            <button
              key={specialty.name}
              onClick={() => handleSpecialtyClick(specialty.name)}
              style={{
                minHeight: '80px',
                padding: '12px 8px',
                borderRadius: '10px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-primary)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textAlign: 'center',
                touchAction: 'manipulation',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = specialty.color;
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = `0 2px 8px ${specialty.color}30`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{fontSize: '24px', lineHeight: '1'}}>{specialty.icon}</div>
              <div style={{fontSize: '12px', fontWeight: '600', color: 'var(--text-primary)', lineHeight: '1.2'}}>{specialty.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 컴팩트한 빠른 액세스 섹션 */}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px'}}>
        {/* 빠른 링크 카드 */}
        <div className="card" style={{padding: '16px'}}>
          <div style={{fontSize: '14px', fontWeight: '700', marginBottom: '12px', color: 'var(--text-primary)'}}>
            🔗 빠른 링크
          </div>
          <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
            <button
              onClick={() => navigate('/hospitals')}
              style={{
                flex: '1 1 auto',
                minHeight: '40px',
                padding: '10px 14px',
                background: 'var(--primary-color)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
                touchAction: 'manipulation',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#1d4ed8'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'var(--primary-color)'}
            >
              전체 병원
            </button>
            <button
              onClick={() => navigate('/hospitals?type=상급종합병원')}
              style={{
                flex: '1 1 auto',
                minHeight: '40px',
                padding: '10px 14px',
                background: 'white',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
                touchAction: 'manipulation',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary-color)';
                e.currentTarget.style.color = 'var(--primary-color)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.color = 'var(--text-primary)';
              }}
            >
              상급종합
            </button>
            <button
              onClick={() => navigate('/hospitals?sort=ranking')}
              style={{
                flex: '1 1 auto',
                minHeight: '40px',
                padding: '10px 14px',
                background: 'white',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
                touchAction: 'manipulation',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary-color)';
                e.currentTarget.style.color = 'var(--primary-color)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.color = 'var(--text-primary)';
              }}
            >
              순위순
            </button>
          </div>
        </div>

        {/* 지금 이용 가능한 병원 카드 */}
        <div className="card" style={{padding: '16px'}}>
          <div style={{fontSize: '14px', fontWeight: '700', marginBottom: '12px', color: 'var(--text-primary)'}}>
            ⏰ 지금 이용 가능
          </div>
          <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
            <button
              onClick={() => {
                const url = new URL('/hospitals', window.location.origin);
                url.searchParams.set('open_24_hours', 'true');
                navigate(url.pathname + url.search);
              }}
              style={{
                flex: '1 1 auto',
                minHeight: '40px',
                padding: '10px 12px',
                background: '#dbeafe',
                color: '#1e40af',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
                touchAction: 'manipulation',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#bfdbfe'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#dbeafe'}
            >
              🌙 24시간
            </button>
            <button
              onClick={() => {
                const url = new URL('/hospitals', window.location.origin);
                url.searchParams.set('has_emergency_room', 'true');
                navigate(url.pathname + url.search);
              }}
              style={{
                flex: '1 1 auto',
                minHeight: '40px',
                padding: '10px 12px',
                background: '#fee2e2',
                color: '#991b1b',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
                touchAction: 'manipulation',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#fecaca'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#fee2e2'}
            >
              🚑 응급실
            </button>
            <button
              onClick={() => {
                const url = new URL('/hospitals', window.location.origin);
                url.searchParams.set('weekend_available', 'true');
                navigate(url.pathname + url.search);
              }}
              style={{
                flex: '1 1 auto',
                minHeight: '40px',
                padding: '10px 12px',
                background: '#dcfce7',
                color: '#166534',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
                touchAction: 'manipulation',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#bbf7d0'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#dcfce7'}
            >
              📅 주말
            </button>
          </div>
        </div>
      </div>

      {/* 시/구별 병원 - 컴팩트 버전 */}
      <div className="card">
        <div style={{padding: '16px', borderBottom: '1px solid var(--border-color)'}}>
          <div style={{fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)'}}>
            📍 시/구별 병원 ({stats.total}개)
          </div>
        </div>
        <div style={{maxHeight: '300px', overflowY: 'auto'}}>
          {stats.byCity.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleCityClick(item.region, item.city)}
              style={{
                width: '100%',
                minHeight: '40px',
                padding: '10px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: 'none',
                background: 'transparent',
                borderBottom: idx < stats.byCity.length - 1 ? '1px solid var(--border-color)' : 'none',
                cursor: 'pointer',
                transition: 'background 0.2s',
                touchAction: 'manipulation'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{fontSize: '13px', fontWeight: '500'}}>
                {item.region} {item.city}
              </span>
              <span style={{
                fontSize: '11px',
                fontWeight: '700',
                color: 'var(--primary-color)',
                background: '#dbeafe',
                padding: '3px 8px',
                borderRadius: '12px'
              }}>
                {item.count}개
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 병원 분류 설명 모달 */}
      <HospitalTypeInfoModal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
      />
    </div>
  );
}

export default Dashboard;
