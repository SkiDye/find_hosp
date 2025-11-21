import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { hospitalAPI, doctorAPI } from '../services/api';

function AdminDashboard() {
  const navigate = useNavigate();
  const [hospital, setHospital] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const hospitalId = localStorage.getItem('admin_hospital_id');

  useEffect(() => {
    // 로그인 확인
    if (!hospitalId) {
      navigate('/admin/login');
      return;
    }

    fetchData();
  }, [hospitalId, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // 병원 정보 가져오기
      const hospitalRes = await hospitalAPI.getById(hospitalId);
      setHospital(hospitalRes.data);

      // 해당 병원의 의사 목록 가져오기
      const doctorsRes = await hospitalAPI.getDoctors(hospitalId);
      setDoctors(doctorsRes.data);
    } catch (error) {
      console.error('데이터 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_hospital_id');
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  if (!hospital) {
    return (
      <div className="container">
        <div className="card">
          <p>병원 정보를 찾을 수 없습니다.</p>
          <button onClick={handleLogout} className="btn btn-outline">
            다시 로그인
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header flex-between">
        <div>
          <h1 className="page-title">{hospital.name} 관리</h1>
          <p className="page-subtitle">의사 정보 관리 대시보드</p>
        </div>
        <div style={{display: 'flex', gap: '12px'}}>
          <Link to="/admin/doctor/new" className="btn btn-primary">
            의사 등록
          </Link>
          <button onClick={handleLogout} className="btn btn-outline">
            로그아웃
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 mb-3">
        <div className="stats-card">
          <div className="stats-number">{doctors.length}</div>
          <div className="stats-label">등록된 의사</div>
        </div>
        <div className="stats-card" style={{background: 'linear-gradient(135deg, #10b981, #34d399)'}}>
          <div className="stats-number">{hospital.beds || 0}</div>
          <div className="stats-label">병상 수</div>
        </div>
        <div className="stats-card" style={{background: 'linear-gradient(135deg, #f59e0b, #fbbf24)'}}>
          <div className="stats-number">{hospital.type}</div>
          <div className="stats-label">병원 유형</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">등록된 의사 목록</div>

        {doctors.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">👨‍⚕️</div>
            <p className="empty-state-text">등록된 의사가 없습니다</p>
            <p style={{marginTop: '8px', fontSize: '14px', color: 'var(--text-secondary)'}}>
              의사 등록 버튼을 클릭하여 의사 정보를 추가하세요.
            </p>
            <Link to="/admin/doctor/new" className="btn btn-primary" style={{marginTop: '16px'}}>
              의사 등록하기
            </Link>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>이름</th>
                  <th>전문과</th>
                  <th>세부전공</th>
                  <th>면허번호</th>
                  <th>작업</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doctor) => (
                  <tr key={doctor.id}>
                    <td className="font-bold">{doctor.name}</td>
                    <td>
                      <span className="badge badge-success">{doctor.specialty}</span>
                    </td>
                    <td>{doctor.sub_specialty || '-'}</td>
                    <td>{doctor.license_number}</td>
                    <td>
                      <div style={{display: 'flex', gap: '8px'}}>
                        <Link
                          to={`/admin/doctor/edit/${doctor.id}`}
                          className="btn btn-sm btn-outline"
                        >
                          수정
                        </Link>
                        <Link
                          to={`/doctors/${doctor.id}`}
                          className="btn btn-sm btn-outline"
                        >
                          상세보기
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card">
        <div className="card-header">병원 정보</div>
        <div style={{padding: '16px'}}>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px'}}>
            <div>
              <p style={{fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px'}}>주소</p>
              <p>{hospital.address}</p>
            </div>
            <div>
              <p style={{fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px'}}>전화번호</p>
              <p>{hospital.phone}</p>
            </div>
            <div>
              <p style={{fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px'}}>지역</p>
              <p>{hospital.region} {hospital.city}</p>
            </div>
            <div>
              <p style={{fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px'}}>설립일</p>
              <p>{hospital.established_date || '-'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
