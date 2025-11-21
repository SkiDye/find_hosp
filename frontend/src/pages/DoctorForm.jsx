import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { adminAPI, doctorAPI } from '../services/api';

function DoctorForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // 수정 모드일 때 의사 ID
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    sub_specialty: '',
    license_number: '',
    phone: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const hospitalId = localStorage.getItem('admin_hospital_id');

  useEffect(() => {
    // 로그인 확인
    if (!hospitalId) {
      navigate('/admin/login');
      return;
    }

    // 수정 모드일 경우 기존 데이터 로드
    if (isEditMode) {
      fetchDoctorData();
    }
  }, [hospitalId, isEditMode, id, navigate]);

  const fetchDoctorData = async () => {
    try {
      const response = await doctorAPI.getById(id);
      const doctor = response.data;
      setFormData({
        name: doctor.name || '',
        specialty: doctor.specialty || '',
        sub_specialty: doctor.sub_specialty || '',
        license_number: doctor.license_number || '',
        phone: doctor.phone || '',
        email: doctor.email || ''
      });
    } catch (error) {
      console.error('의사 정보 로딩 실패:', error);
      setError('의사 정보를 불러오는데 실패했습니다.');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const doctorData = {
        ...formData,
        hospital_id: hospitalId
      };

      if (isEditMode) {
        // 수정
        await adminAPI.updateDoctor(id, doctorData);
        alert('의사 정보가 성공적으로 수정되었습니다.');
      } else {
        // 등록
        await adminAPI.addDoctor(doctorData);
        alert('의사가 성공적으로 등록되었습니다.');
      }

      navigate('/admin/dashboard');
    } catch (error) {
      console.error('의사 저장 실패:', error);
      setError(error.response?.data?.message || '의사 정보 저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const specialties = [
    '내과', '외과', '소아청소년과', '산부인과', '정형외과',
    '신경외과', '정신건강의학과', '안과', '이비인후과', '피부과',
    '비뇨의학과', '영상의학과', '방사선종양학과', '병리과', '진단검사의학과',
    '재활의학과', '예방의학과', '가정의학과', '응급의학과', '핵의학과',
    '마취통증의학과', '흉부외과', '성형외과', '신경과', '치과'
  ];

  return (
    <div className="container" style={{maxWidth: '800px'}}>
      <div className="page-header flex-between">
        <div>
          <h1 className="page-title">{isEditMode ? '의사 정보 수정' : '의사 등록'}</h1>
          <p className="page-subtitle">의사 정보를 입력하세요</p>
        </div>
        <Link to="/admin/dashboard" className="btn btn-outline">
          돌아가기
        </Link>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2" style={{gap: '20px'}}>
            {/* 이름 */}
            <div>
              <label style={{display: 'block', marginBottom: '8px', fontWeight: '600'}}>
                이름 <span style={{color: 'red'}}>*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="의사 이름"
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            </div>

            {/* 전문과 */}
            <div>
              <label style={{display: 'block', marginBottom: '8px', fontWeight: '600'}}>
                전문과 <span style={{color: 'red'}}>*</span>
              </label>
              <select
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              >
                <option value="">선택하세요</option>
                {specialties.map(specialty => (
                  <option key={specialty} value={specialty}>{specialty}</option>
                ))}
              </select>
            </div>

            {/* 세부전공 */}
            <div>
              <label style={{display: 'block', marginBottom: '8px', fontWeight: '600'}}>
                세부전공
              </label>
              <input
                type="text"
                name="sub_specialty"
                value={formData.sub_specialty}
                onChange={handleChange}
                placeholder="예: 심장내과, 소화기내과 등"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            </div>

            {/* 면허번호 */}
            <div>
              <label style={{display: 'block', marginBottom: '8px', fontWeight: '600'}}>
                면허번호 <span style={{color: 'red'}}>*</span>
              </label>
              <input
                type="text"
                name="license_number"
                value={formData.license_number}
                onChange={handleChange}
                placeholder="D2020-1234"
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            </div>

            {/* 전화번호 */}
            <div>
              <label style={{display: 'block', marginBottom: '8px', fontWeight: '600'}}>
                전화번호
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="010-1234-5678"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            </div>

            {/* 이메일 */}
            <div>
              <label style={{display: 'block', marginBottom: '8px', fontWeight: '600'}}>
                이메일
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="doctor@hospital.com"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            </div>
          </div>

          {error && (
            <div style={{
              padding: '12px',
              backgroundColor: '#fee',
              border: '1px solid #fcc',
              borderRadius: '8px',
              marginTop: '20px',
              color: '#c33'
            }}>
              {error}
            </div>
          )}

          <div style={{marginTop: '32px', padding: '16px', backgroundColor: 'var(--bg-color)', borderRadius: '8px'}}>
            <p style={{fontSize: '14px', fontWeight: '600', marginBottom: '8px'}}>
              개인정보 보호 안내
            </p>
            <p style={{fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6'}}>
              입력하신 의사 정보는 개인정보보호법에 따라 관리됩니다.
              연락처와 이메일은 병원 대표번호와 이메일로 공개되며, 개인 연락처는 공개되지 않습니다.
            </p>
          </div>

          <div style={{display: 'flex', gap: '12px', marginTop: '24px'}}>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{flex: 1}}
            >
              {loading ? '저장 중...' : (isEditMode ? '수정 완료' : '등록하기')}
            </button>
            <Link to="/admin/dashboard" className="btn btn-outline" style={{flex: 1, textAlign: 'center'}}>
              취소
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DoctorForm;
