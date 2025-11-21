import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdBanner from './components/AdBanner';
import Dashboard from './pages/Dashboard';
import HospitalList from './pages/HospitalList';
import HospitalDetail from './pages/HospitalDetail';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />

        {/* 메인 컨텐츠 + 사이드 배너 레이아웃 */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '40px',
          maxWidth: '1800px',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          {/* 왼쪽 사이드 배너 - 데스크톱만 표시 */}
          <div className="sidebar-ad-left" style={{
            display: 'none'
          }}>
            <AdBanner type="sidebar" position="left" />
          </div>

          {/* 메인 컨텐츠 */}
          <div style={{
            flex: '1',
            maxWidth: '1200px',
            width: '100%'
          }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/hospitals" element={<HospitalList />} />
              <Route path="/hospitals/:id" element={<HospitalDetail />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
            </Routes>
          </div>

          {/* 오른쪽 사이드 배너 - 데스크톱만 표시 */}
          <div className="sidebar-ad-right" style={{
            display: 'none'
          }}>
            <AdBanner type="sidebar" position="right" />
          </div>
        </div>

        <Footer />

        {/* 모바일 하단 고정 배너 */}
        <div className="mobile-bottom-ad">
          <AdBanner type="mobile-fixed" />
        </div>
      </div>
    </Router>
  );
}

export default App;
