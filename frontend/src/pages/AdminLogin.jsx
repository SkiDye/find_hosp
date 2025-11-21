import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api';

function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    hospital_id: '',
    admin_code: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      const response = await adminAPI.login(formData);

      if (response.data.success) {
        // 로그인 성공 - localStorage에 정보 저장
        localStorage.setItem('admin_hospital_id', formData.hospital_id);
        localStorage.setItem('admin_token', response.data.token || 'temp_token');

        // 관리자 대시보드로 이동
        navigate('/admin/dashboard');
      } else {
        setError(response.data.message || '로그인에 실패했습니다.');
      }
    } catch (error) {
      setError(error.response?.data?.message || '로그인에 실패했습니다. 병원 ID와 관리자 코드를 확인해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{maxWidth: '500px', marginTop: '80px'}}>
      <div className="card">
        <div style={{textAlign: 'center', marginBottom: '32px'}}>
          <h1 style={{fontSize: '28px', marginBottom: '8px'}}>병원 관리자 로그인</h1>
          <p style={{color: 'var(--text-secondary)', fontSize: '14px'}}>
            의사 정보 관리를 위한 로그인
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{marginBottom: '20px'}}>
            <label style={{display: 'block', marginBottom: '8px', fontWeight: '600'}}>
              병원 ID
            </label>
            <input
              type="text"
              name="hospital_id"
              value={formData.hospital_id}
              onChange={handleChange}
              placeholder="병원 ID를 입력하세요"
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
            <p style={{fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px'}}>
              예: 1, 2, 3...
            </p>
          </div>

          <div style={{marginBottom: '24px'}}>
            <label style={{display: 'block', marginBottom: '8px', fontWeight: '600'}}>
              관리자 코드
            </label>
            <input
              type="password"
              name="admin_code"
              value={formData.admin_code}
              onChange={handleChange}
              placeholder="관리자 코드를 입력하세요"
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
            <p style={{fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px'}}>
              형식: ADMIN{'{'} 병원ID{'}'}2024 (예: ADMIN12024)
            </p>
          </div>

          {error && (
            <div style={{
              padding: '12px',
              backgroundColor: '#fee',
              border: '1px solid #fcc',
              borderRadius: '8px',
              marginBottom: '20px',
              color: '#c33'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{width: '100%', padding: '14px', fontSize: '16px'}}
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <div style={{marginTop: '24px', padding: '16px', backgroundColor: 'var(--bg-color)', borderRadius: '8px'}}>
          <p style={{fontSize: '14px', fontWeight: '600', marginBottom: '8px'}}>
            관리자 코드 발급 안내
          </p>
          <p style={{fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6'}}>
            관리자 코드는 병원 등록 시 자동으로 발급됩니다.
            병원 ID 1번의 관리자 코드는 <strong>ADMIN12024</strong>입니다.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
