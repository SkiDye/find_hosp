import { useState, useEffect } from 'react';
import { doctorAPI } from '../services/api';
import { Link } from 'react-router-dom';

function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    specialty: '',
    search: ''
  });

  useEffect(() => {
    fetchDoctors();
  }, [filters]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await doctorAPI.getAll(filters);
      setDoctors(response.data);
    } catch (error) {
      console.error('의사 목록 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="container">
      <div className="page-header flex-between">
        <div>
          <h1 className="page-title">의사 관리</h1>
          <p className="page-subtitle">의사 정보 및 이력을 관리합니다</p>
        </div>
        <Link to="/doctors/new" className="btn btn-primary">의사 등록</Link>
      </div>

      <div className="card">
        <div className="search-bar">
          <input
            type="text"
            name="search"
            className="search-input"
            placeholder="의사명 또는 면허번호로 검색..."
            value={filters.search}
            onChange={handleFilterChange}
          />
        </div>

        <div className="filter-bar">
          <select name="specialty" value={filters.specialty} onChange={handleFilterChange}>
            <option value="">전체 진료과</option>
            <option value="내과">내과</option>
            <option value="외과">외과</option>
            <option value="소아청소년과">소아청소년과</option>
            <option value="산부인과">산부인과</option>
            <option value="정형외과">정형외과</option>
            <option value="신경외과">신경외과</option>
            <option value="정신건강의학과">정신건강의학과</option>
            <option value="안과">안과</option>
            <option value="이비인후과">이비인후과</option>
            <option value="피부과">피부과</option>
          </select>
        </div>

        {loading ? (
          <div className="loading">로딩 중...</div>
        ) : doctors.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">👨‍⚕️</div>
            <p className="empty-state-text">
              {filters.search || filters.specialty
                ? '검색 결과가 없습니다'
                : '등록된 의사가 없습니다'}
            </p>
            {!filters.search && !filters.specialty && (
              <p style={{marginTop: '16px', fontSize: '14px', color: 'var(--text-secondary)'}}>
                병원 관리자가 의사 정보를 직접 등록할 수 있습니다.
              </p>
            )}
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>프로필</th>
                  <th>이름</th>
                  <th>전문과</th>
                  <th>세부전공</th>
                  <th>경력</th>
                  <th>면허번호</th>
                  <th>작업</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doctor) => (
                  <tr key={doctor.id}>
                    <td>
                      <img
                        src={doctor.photo_url}
                        alt={doctor.name}
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '50%',
                          objectFit: 'cover'
                        }}
                      />
                    </td>
                    <td className="font-bold">
                      <Link to={`/doctors/${doctor.id}`} style={{color: 'var(--primary-color)'}}>
                        {doctor.name}
                      </Link>
                    </td>
                    <td>
                      <span className="badge badge-success">{doctor.specialty}</span>
                    </td>
                    <td>{doctor.sub_specialty || '-'}</td>
                    <td>{doctor.years_of_experience ? `${doctor.years_of_experience}년` : '-'}</td>
                    <td>{doctor.license_number}</td>
                    <td>
                      <Link to={`/doctors/${doctor.id}`} className="btn btn-sm btn-outline">
                        상세보기
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default DoctorList;
