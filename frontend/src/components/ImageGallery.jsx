import { useState } from 'react';

/**
 * 이미지 갤러리 슬라이더 컴포넌트
 */
function ImageGallery({ images, alt }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '400px',
      borderRadius: '12px',
      overflow: 'hidden',
      background: 'var(--bg-secondary)'
    }}>
      {/* 메인 이미지 */}
      <img
        src={images[currentIndex]}
        alt={`${alt} - ${currentIndex + 1}`}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'opacity 0.3s ease-in-out'
        }}
        onError={(e) => {
          e.target.style.display = 'none';
        }}
      />

      {/* 이전 버튼 */}
      {images.length > 1 && (
        <button
          onClick={goToPrevious}
          style={{
            position: 'absolute',
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '48px',
            height: '48px',
            fontSize: '24px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s',
            zIndex: 2
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.5)'}
        >
          ‹
        </button>
      )}

      {/* 다음 버튼 */}
      {images.length > 1 && (
        <button
          onClick={goToNext}
          style={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '48px',
            height: '48px',
            fontSize: '24px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s',
            zIndex: 2
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.5)'}
        >
          ›
        </button>
      )}

      {/* 인디케이터 */}
      {images.length > 1 && (
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '8px',
          zIndex: 2
        }}>
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              style={{
                width: currentIndex === index ? '32px' : '8px',
                height: '8px',
                borderRadius: '4px',
                border: 'none',
                background: currentIndex === index
                  ? 'white'
                  : 'rgba(255, 255, 255, 0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s',
                padding: 0
              }}
              aria-label={`이미지 ${index + 1}로 이동`}
            />
          ))}
        </div>
      )}

      {/* 이미지 카운터 */}
      {images.length > 1 && (
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: 'rgba(0, 0, 0, 0.6)',
          color: 'white',
          padding: '6px 12px',
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: '600',
          zIndex: 2
        }}>
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* 그라데이션 오버레이 (하단) */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '120px',
        background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
        pointerEvents: 'none'
      }} />
    </div>
  );
}

export default ImageGallery;
