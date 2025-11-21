import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doctorAPI } from '../services/api';

function DoctorDetail() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchDoctor();
  }, [id]);

  const fetchDoctor = async () => {
    try {
      const response = await doctorAPI.getById(id);
      setDoctor(response.data);
    } catch (error) {
      console.error('의사 정보 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  if (!doctor) {
    return (
      <div className="container">
        <div className="empty-state">
          <div className="empty-state-icon">⚠️</div>
          <p className="empty-state-text">의사 정보를 찾을 수 없습니다</p>
          <Link to="/doctors" className="btn btn-primary mt-2">목록으로 돌아가기</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <div className="flex-between mb-2">
          <div>
            <h1 className="page-title">{doctor.name}</h1>
            <p className="page-subtitle">
              {doctor.specialty} {doctor.sub_specialty && `· ${doctor.sub_specialty}`}
            </p>
          </div>
          <Link to="/doctors" className="btn btn-outline">목록으로</Link>
        </div>
      </div>

      <div className="card mb-3">
        <div style={{display: 'flex', gap: '32px', alignItems: 'flex-start'}}>
          <img
            src={doctor.photo_url}
            alt={doctor.name}
            style={{
              width: '200px',
              height: '250px',
              borderRadius: '12px',
              objectFit: 'cover',
              border: '2px solid var(--border-color)',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
          />
          <div style={{flex: 1, paddingTop: '8px'}}>
            <h2 style={{fontSize: '28px', fontWeight: 'bold', marginBottom: '12px'}}>{doctor.name}</h2>
            <div style={{fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '16px'}}>
              <span className="badge badge-success" style={{fontSize: '15px', padding: '6px 12px'}}>{doctor.specialty}</span>
              {doctor.sub_specialty && <span className="badge" style={{fontSize: '15px', padding: '6px 12px', marginLeft: '8px', background: 'var(--bg-secondary)'}}>{doctor.sub_specialty}</span>}
            </div>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginTop: '24px'}}>
              <div>
                <div style={{fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px'}}>경력</div>
                <div style={{fontSize: '18px', fontWeight: '600', color: 'var(--primary-color)'}}>{doctor.years_of_experience}년</div>
              </div>
              <div>
                <div style={{fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px'}}>면허번호</div>
                <div style={{fontSize: '18px', fontWeight: '600'}}>{doctor.license_number}</div>
              </div>
              <div>
                <div style={{fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px'}}>연락처</div>
                <div style={{fontSize: '18px', fontWeight: '600'}}>{doctor.phone}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">학력</div>
        {doctor.education && doctor.education.length > 0 ? (
          <div className="list-group">
            {doctor.education.map((edu, idx) => (
              <div key={idx} className="list-item">
                <div className="font-bold">{edu.school}</div>
                <div className="text-muted" style={{fontSize: '14px'}}>
                  {edu.degree} · {edu.major} · {edu.graduation_year}년 졸업
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted">등록된 학력 정보가 없습니다</p>
        )}
      </div>

      <div className="card">
        <div className="card-header">경력 및 이직 기록</div>
        {doctor.career && doctor.career.length > 0 ? (
          <div className="timeline">
            {doctor.career.map((career, idx) => (
              <div key={idx} className="timeline-item">
                <div className="timeline-date">
                  {career.start_date} ~ {career.end_date || '현재'}
                  {career.is_current && <span className="badge badge-success ml-1">재직중</span>}
                </div>
                <div className="timeline-content">
                  <Link to={`/hospitals/${career.hospital_id}`} className="font-bold" style={{color: 'var(--primary-color)'}}>
                    {career.hospital_name}
                  </Link>
                  <div className="text-muted" style={{fontSize: '14px'}}>
                    {career.position} · {career.department}
                  </div>
                  <div className="text-muted" style={{fontSize: '13px'}}>
                    {career.region} {career.city}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted">등록된 경력 정보가 없습니다</p>
        )}
      </div>

      <div className="card">
        <div className="card-header">자격 및 인증</div>
        {doctor.certifications && doctor.certifications.length > 0 ? (
          <div className="list-group">
            {doctor.certifications.map((cert, idx) => (
              <div key={idx} className="list-item">
                <div className="font-bold">{cert.certification_name}</div>
                <div className="text-muted" style={{fontSize: '14px'}}>
                  {cert.issuer} · 발급일: {cert.issue_date}
                  {cert.expiry_date && ` · 만료일: ${cert.expiry_date}`}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted">등록된 자격증 정보가 없습니다</p>
        )}
      </div>
    </div>
  );
}

export default DoctorDetail;
