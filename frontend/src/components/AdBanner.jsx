import React from 'react';

/**
 * 광고 배너 컴포넌트
 * @param {string} type - 'sidebar' | 'horizontal' | 'mobile-fixed'
 * @param {string} position - 'left' | 'right' | 'bottom' (type이 sidebar일 때)
 */
function AdBanner({ type = 'horizontal', position = 'right', style = {} }) {
  // 배너 타입별 기본 스타일
  const getBaseStyle = () => {
    switch (type) {
      case 'sidebar':
        return {
          width: '160px',
          height: '600px',
          position: 'sticky',
          top: '80px',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-primary)',
          fontSize: '14px',
          fontWeight: 'bold',
          padding: '20px',
          textAlign: 'center',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)'
        };

      case 'horizontal':
        return {
          width: '100%',
          height: '90px',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-primary)',
          fontSize: '16px',
          fontWeight: 'bold',
          marginBottom: '20px',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)'
        };

      case 'mobile-fixed':
        return {
          position: 'fixed',
          bottom: '0',
          left: '0',
          right: '0',
          height: '60px',
          background: 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(15px)',
          WebkitBackdropFilter: 'blur(15px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.18)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          color: 'var(--text-primary)',
          fontSize: '14px',
          fontWeight: 'bold',
          boxShadow: '0 -4px 24px 0 rgba(31, 38, 135, 0.2)',
          zIndex: 1000
        };

      default:
        return {};
    }
  };

  const handleClose = () => {
    // 모바일 고정 배너 닫기
    if (type === 'mobile-fixed') {
      const banner = document.querySelector('.mobile-ad-banner');
      if (banner) {
        banner.style.display = 'none';
      }
    }
  };

  const bannerStyle = { ...getBaseStyle(), ...style };

  return (
    <div
      className={`ad-banner ${type === 'mobile-fixed' ? 'mobile-ad-banner' : ''}`}
      style={bannerStyle}
    >
      {type === 'sidebar' && (
        <>
          <div style={{ fontSize: '24px', marginBottom: '16px' }}>📢</div>
          <div>광고 영역</div>
          <div style={{ fontSize: '12px', marginTop: '8px', opacity: 0.9 }}>
            160 x 600
          </div>
        </>
      )}

      {type === 'horizontal' && (
        <>
          <div style={{ fontSize: '20px', marginRight: '12px' }}>📢</div>
          <div>광고 배너 영역 (가로형)</div>
        </>
      )}

      {type === 'mobile-fixed' && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ fontSize: '18px' }}>📢</div>
            <div>모바일 광고</div>
          </div>
          <button
            onClick={handleClose}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(5px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              color: 'var(--text-primary)',
              fontSize: '18px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            ×
          </button>
        </>
      )}
    </div>
  );
}

export default AdBanner;
