function SkeletonCard() {
  return (
    <div style={{
      display: 'block',
      borderRadius: '12px',
      overflow: 'hidden',
      background: 'white',
      border: '1px solid var(--border-color)',
    }}>
      {/* 이미지 영역 */}
      <div style={{
        width: '100%',
        height: '180px',
        background: 'linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite'
      }} />

      {/* 내용 영역 */}
      <div style={{padding: '16px'}}>
        {/* 병원명 */}
        <div style={{
          height: '24px',
          width: '70%',
          background: 'linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite',
          borderRadius: '4px',
          marginBottom: '8px'
        }} />

        {/* 위치 */}
        <div style={{
          height: '16px',
          width: '50%',
          background: 'linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite',
          borderRadius: '4px',
          marginBottom: '8px'
        }} />

        {/* 주소 */}
        <div style={{
          height: '16px',
          width: '90%',
          background: 'linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite',
          borderRadius: '4px',
          marginBottom: '12px'
        }} />

        {/* 전화번호 */}
        <div style={{
          height: '16px',
          width: '40%',
          background: 'linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite',
          borderRadius: '4px',
          marginBottom: '12px'
        }} />

        {/* 하단 버튼 영역 */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '12px',
          borderTop: '1px solid var(--border-color)',
          gap: '8px'
        }}>
          <div style={{display: 'flex', gap: '8px', flex: 1}}>
            {/* 버튼들 */}
            {[1, 2, 3].map(i => (
              <div key={i} style={{
                height: '32px',
                width: '60px',
                background: 'linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite',
                borderRadius: '6px'
              }} />
            ))}
          </div>
          <div style={{
            height: '16px',
            width: '80px',
            background: 'linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            borderRadius: '4px'
          }} />
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </div>
  );
}

export default SkeletonCard;
