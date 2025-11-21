import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { hospitalAPI } from '../services/api';
import ImageGallery from '../components/ImageGallery';
import OperatingHours from '../components/OperatingHours';

function HospitalDetail() {
  const { id } = useParams();
  const [hospital, setHospital] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchHospital();
    fetchDoctors();
  }, [id]);

  const fetchHospital = async () => {
    try {
      const response = await hospitalAPI.getById(id);
      setHospital(response.data);
    } catch (error) {
      console.error('병원 정보 로딩 실패:', error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await hospitalAPI.getDoctors(id);
      setDoctors(response.data);
    } catch (error) {
      console.error('의사 목록 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  if (!hospital) {
    return (
      <div className="container">
        <div className="empty-state">
          <div className="empty-state-icon">⚠️</div>
          <p className="empty-state-text">병원 정보를 찾을 수 없습니다</p>
          <Link to="/hospitals" className="btn btn-primary mt-2" style={{minHeight: '44px', display: 'inline-flex', alignItems: 'center', padding: '0 20px', touchAction: 'manipulation'}}>목록으로 돌아가기</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* 이미지 갤러리 */}
      {hospital.image_urls && hospital.image_urls.length > 0 && (
        <div style={{marginBottom: '30px', position: 'relative'}}>
          <ImageGallery images={hospital.image_urls} alt={hospital.name} />
          <div style={{
            position: 'absolute',
            bottom: '30px',
            left: '30px',
            right: '30px',
            zIndex: 3
          }}>
            <h1 style={{
              fontSize: '36px',
              fontWeight: 'bold',
              color: 'white',
              textShadow: '0 2px 8px rgba(0,0,0,0.5)',
              marginBottom: '8px'
            }}>
              {hospital.name}
            </h1>
            <span style={{
              fontSize: '16px',
              padding: '6px 16px',
              background: 'rgba(255,255,255,0.95)',
              color: hospital.type === '의원' ? '#16a34a' : 'var(--primary-color)',
              borderRadius: '8px',
              fontWeight: 'bold',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }}>
              {hospital.type}
            </span>
          </div>
        </div>
      )}

      {/* 기존 헤더 (이미지가 없을 때만 표시) */}
      {!hospital.image_url && (
        <div className="page-header">
          <div className="flex-between mb-2">
            <div>
              <h1 className="page-title">{hospital.name}</h1>
              <p className="page-subtitle">{hospital.type}</p>
            </div>
            <Link to="/hospitals" className="btn btn-outline" style={{minHeight: '44px', display: 'flex', alignItems: 'center', padding: '0 20px', touchAction: 'manipulation'}}>목록으로</Link>
          </div>
        </div>
      )}

      {/* 뒤로가기 버튼 (이미지가 있을 때) */}
      {hospital.image_url && (
        <div style={{marginBottom: '20px', textAlign: 'right'}}>
          <Link to="/hospitals" className="btn btn-outline" style={{minHeight: '44px', display: 'inline-flex', alignItems: 'center', padding: '0 20px', touchAction: 'manipulation'}}>목록으로</Link>
        </div>
      )}

      <div className="card" style={{marginBottom: '20px'}}>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px'}}>
          <div>
            <div style={{fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px'}}>위치</div>
            <div className="font-bold" style={{marginBottom: '4px'}}>{hospital.region} {hospital.city}</div>
            <div style={{fontSize: '13px', color: 'var(--text-secondary)'}}>
              {hospital.address}
            </div>
          </div>
          <div>
            <div style={{fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px'}}>연락처</div>
            <div className="font-bold" style={{marginBottom: '8px'}}>{hospital.phone}</div>
            <a
              href={`tel:${hospital.phone}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                background: 'var(--primary-color)',
                color: 'white',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 'bold',
                textDecoration: 'none',
                marginBottom: '8px'
              }}
            >
              📞 전화하기
            </a>
            {hospital.homepage && (
              <a href={hospital.homepage} target="_blank" rel="noopener noreferrer"
                 style={{fontSize: '13px', color: 'var(--primary-color)', textDecoration: 'none', display: 'block', marginTop: '4px'}}>
                홈페이지 →
              </a>
            )}
          </div>
          {hospital.beds && (
            <div>
              <div style={{fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px'}}>병상 수</div>
              <div className="font-bold">{hospital.beds}병상</div>
            </div>
          )}
          {hospital.established_date && (
            <div>
              <div style={{fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px'}}>개원일</div>
              <div className="font-bold">{hospital.established_date}</div>
            </div>
          )}
          {(hospital.has_emergency_room || hospital.open_24_hours || hospital.weekend_available) && (
            <div>
              <div style={{fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px'}}>운영정보</div>
              <div style={{display: 'flex', gap: '6px', flexWrap: 'wrap'}}>
                {hospital.has_emergency_room && (
                  <span style={{
                    fontSize: '12px',
                    padding: '4px 10px',
                    background: '#fee2e2',
                    color: '#991b1b',
                    borderRadius: '6px',
                    fontWeight: '600'
                  }}>
                    🚑 응급실 운영
                  </span>
                )}
                {hospital.open_24_hours && (
                  <span style={{
                    fontSize: '12px',
                    padding: '4px 10px',
                    background: '#dbeafe',
                    color: '#1e40af',
                    borderRadius: '6px',
                    fontWeight: '600'
                  }}>
                    🌙 24시간 운영
                  </span>
                )}
                {hospital.weekend_available && (
                  <span style={{
                    fontSize: '12px',
                    padding: '4px 10px',
                    background: '#dcfce7',
                    color: '#166534',
                    borderRadius: '6px',
                    fontWeight: '600'
                  }}>
                    📅 주말 진료
                  </span>
                )}
              </div>
            </div>
          )}
          {(hospital.ranking_domestic || hospital.ranking_global) && (
            <div>
              <div style={{fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px'}}>병원 순위</div>
              {hospital.ranking_domestic && (
                <div style={{fontSize: '16px', fontWeight: 'bold', color: 'var(--primary-color)'}}>
                  국내 {hospital.ranking_domestic}위
                  {hospital.ranking_global && <span style={{fontSize: '13px', color: 'var(--text-secondary)', marginLeft: '6px'}}>/ 세계 {hospital.ranking_global}위</span>}
                </div>
              )}
            </div>
          )}
          {hospital.notes && (
            <div>
              <div style={{fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px'}}>비고</div>
              <div style={{fontSize: '14px'}}>{hospital.notes}</div>
            </div>
          )}
        </div>
      </div>

      {/* 위치 */}
      {hospital.latitude && hospital.longitude && (
        <div className="card">
          <div className="card-header">위치</div>
          <iframe
            src={`https://www.google.com/maps?q=${hospital.latitude},${hospital.longitude}&output=embed`}
            style={{
              width: '100%',
              height: '400px',
              marginTop: '10px',
              borderRadius: '8px',
              border: 'none'
            }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div style={{marginTop: '12px', padding: '12px', background: 'var(--bg-secondary)', borderRadius: '8px'}}>
            <div style={{fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px'}}>주소</div>
            <div style={{fontSize: '14px', fontWeight: 'bold'}}>{hospital.address}</div>
            {hospital.phone && (
              <div style={{fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px'}}>
                전화: {hospital.phone}
              </div>
            )}
            <div style={{display: 'flex', gap: '8px', marginTop: '12px'}}>
              <a
                href={`https://map.naver.com/v5/search/${encodeURIComponent(hospital.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{
                  flex: 1,
                  minHeight: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  fontSize: '14px',
                  textDecoration: 'none',
                  touchAction: 'manipulation'
                }}
              >
                🗺️ 네이버지도에서 보기
              </a>
              <a
                href={`https://map.naver.com/v5/directions///${hospital.latitude},${hospital.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
                style={{
                  flex: 1,
                  minHeight: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  fontSize: '14px',
                  textDecoration: 'none',
                  touchAction: 'manipulation'
                }}
              >
                🧭 길찾기
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 진료과 */}
      {hospital.specialties && hospital.specialties.length > 0 && (
        <div className="card">
          <div className="card-header">진료과 ({hospital.specialties.length}개)</div>
          <div style={{display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px'}}>
            {hospital.specialties.map((specialty, idx) => (
              <span key={idx} className="badge" style={{
                background: 'var(--bg-secondary)',
                padding: '4px 10px',
                fontSize: '13px',
                borderRadius: '4px'
              }}>
                {specialty}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 운영시간 */}
      <OperatingHours hospital={hospital} />

      <div className="card">
        <div className="card-header flex-between">
          <span>소속 의사 ({doctors.length}명)</span>
        </div>
        {doctors.length > 0 ? (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>이름</th>
                  <th>전문과</th>
                  <th>세부전공</th>
                  <th>직위</th>
                  <th>진료과</th>
                  <th>근무시작일</th>
                  <th>작업</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doctor) => (
                  <tr key={doctor.id}>
                    <td className="font-bold">
                      <Link to={`/doctors/${doctor.id}`} style={{color: 'var(--primary-color)'}}>
                        {doctor.name}
                      </Link>
                    </td>
                    <td>
                      <span className="badge badge-success">{doctor.specialty}</span>
                    </td>
                    <td>{doctor.sub_specialty || '-'}</td>
                    <td>{doctor.position}</td>
                    <td>{doctor.department}</td>
                    <td>{doctor.start_date}</td>
                    <td>
                      <Link to={`/doctors/${doctor.id}`} className="btn btn-sm btn-outline" style={{minHeight: '36px', display: 'inline-flex', alignItems: 'center', padding: '0 12px', touchAction: 'manipulation'}}>
                        상세보기
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <p className="empty-state-text">현재 소속 의사가 없습니다</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default HospitalDetail;
