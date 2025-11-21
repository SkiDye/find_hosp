import { Link, NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="navbar-brand" style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="9" y="4" width="6" height="16" fill="#00A650" rx="1"/>
            <rect x="4" y="9" width="16" height="6" fill="#00A650" rx="1"/>
          </svg>
          <span>내 주변 병원찾기</span>
        </Link>
        <ul className="navbar-menu">
          <li>
            <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''} end>
              홈
            </NavLink>
          </li>
          <li>
            <NavLink to="/hospitals" className={({ isActive }) => isActive ? 'active' : ''}>
              병원 찾기
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
