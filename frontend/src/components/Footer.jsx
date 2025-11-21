import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer style={{
      backgroundColor: 'var(--card-bg)',
      borderTop: '1px solid var(--border-color)',
      marginTop: '60px',
      padding: '40px 0 20px'
    }}>
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3" style={{marginBottom: '32px'}}>
          <div>
            <h3 style={{fontSize: '16px', fontWeight: '600', marginBottom: '16px'}}>
              병원·의사 관리 시스템
            </h3>
            <p style={{fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6'}}>
              전국 병원 및 의사 정보를<br/>
              한눈에 확인하세요
            </p>
          </div>

          <div>
            <h4 style={{fontSize: '14px', fontWeight: '600', marginBottom: '12px'}}>
              법적 고지
            </h4>
            <ul style={{listStyle: 'none', fontSize: '14px', lineHeight: '2'}}>
              <li>
                <Link to="/terms" style={{color: 'var(--text-secondary)', textDecoration: 'none'}}>
                  이용약관
                </Link>
              </li>
              <li>
                <Link to="/privacy" style={{color: 'var(--text-secondary)', textDecoration: 'none'}}>
                  개인정보 처리방침
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 style={{fontSize: '14px', fontWeight: '600', marginBottom: '12px'}}>
              데이터 출처
            </h4>
            <ul style={{listStyle: 'none', fontSize: '13px', lineHeight: '2', color: 'var(--text-secondary)'}}>
              <li>병원 정보: 건강보험심사평가원</li>
              <li>의사 정보: 병원 직접 등록</li>
              <li>
                <a
                  href="https://www.data.go.kr"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{color: 'var(--primary-color)', textDecoration: 'none'}}
                >
                  공공데이터포털 →
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid var(--border-color)',
          paddingTop: '20px',
          textAlign: 'center'
        }}>
          <p style={{fontSize: '13px', color: 'var(--text-secondary)'}}>
            © 2024 병원·의사 관리 시스템. All rights reserved.
          </p>
          <p style={{fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px'}}>
            본 서비스는 정보 제공 목적으로만 운영되며, 의료 상담이나 진단을 제공하지 않습니다.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
