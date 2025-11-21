function HospitalTypeInfoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '16px',
          padding: '32px',
          maxWidth: '700px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          paddingBottom: '16px',
          borderBottom: '2px solid var(--border-color)'
        }}>
          <h2 style={{fontSize: '24px', fontWeight: 'bold', color: 'var(--primary-color)'}}>
            병원과 의원의 차이?
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '28px',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              lineHeight: 1,
              padding: '4px 8px'
            }}
          >
            ✕
          </button>
        </div>

        {/* 설명 */}
        <p style={{marginBottom: '28px', fontSize: '15px', lineHeight: '1.6', color: 'var(--text-secondary)'}}>
          한국 법상 의료기관은 병상 수와 진료 능력에 따라 다음과 같이 분류됩니다.
        </p>

        {/* 의료기관 분류 카드들 */}
        <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
          {/* 상급종합병원 */}
          <div style={{
            padding: '20px',
            background: 'linear-gradient(135deg, #667eea15, #764ba215)',
            borderRadius: '12px',
            border: '2px solid #667eea'
          }}>
            <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px'}}>
              <div style={{fontSize: '32px'}}>🏥</div>
              <div>
                <h3 style={{fontSize: '18px', fontWeight: 'bold', color: '#667eea', marginBottom: '4px'}}>
                  상급종합병원
                </h3>
                <p style={{fontSize: '13px', color: 'var(--text-secondary)'}}>중증질환 전문 치료</p>
              </div>
            </div>
            <div style={{fontSize: '14px', lineHeight: '1.6', color: 'var(--text-primary)'}}>
              <p style={{marginBottom: '8px'}}>
                <strong>기준:</strong> 300병상 이상, 중증질환 진료 능력, 전문의 수련 기능
              </p>
              <p style={{marginBottom: '8px'}}>
                <strong>특징:</strong> 암, 심장병, 뇌질환 등 중증 질환 치료에 특화된 최상위 의료기관
              </p>
              <p style={{marginBottom: '0'}}>
                <strong>예시:</strong> 서울아산병원, 삼성서울병원, 서울대학교병원, 세브란스병원 등
              </p>
            </div>
          </div>

          {/* 종합병원 */}
          <div style={{
            padding: '20px',
            background: 'linear-gradient(135deg, #10b98115, #34d39915)',
            borderRadius: '12px',
            border: '2px solid #10b981'
          }}>
            <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px'}}>
              <div style={{fontSize: '32px'}}>🏥</div>
              <div>
                <h3 style={{fontSize: '18px', fontWeight: 'bold', color: '#10b981', marginBottom: '4px'}}>
                  종합병원
                </h3>
                <p style={{fontSize: '13px', color: 'var(--text-secondary)'}}>다양한 진료과목 보유</p>
              </div>
            </div>
            <div style={{fontSize: '14px', lineHeight: '1.6', color: 'var(--text-primary)'}}>
              <p style={{marginBottom: '8px'}}>
                <strong>기준:</strong> 100병상 이상, 7개 이상의 진료과목 운영
              </p>
              <p style={{marginBottom: '8px'}}>
                <strong>특징:</strong> 내과, 외과, 소아과, 산부인과 등 주요 진료과가 갖춰진 종합 의료기관
              </p>
              <p style={{marginBottom: '0'}}>
                <strong>예시:</strong> 명지병원, 일산백병원, 부천성모병원, 인하대학교병원 등
              </p>
            </div>
          </div>

          {/* 병원 */}
          <div style={{
            padding: '20px',
            background: 'linear-gradient(135deg, #3b82f615, #2563eb15)',
            borderRadius: '12px',
            border: '2px solid #3b82f6'
          }}>
            <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px'}}>
              <div style={{fontSize: '32px'}}>🏥</div>
              <div>
                <h3 style={{fontSize: '18px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '4px'}}>
                  병원
                </h3>
                <p style={{fontSize: '13px', color: 'var(--text-secondary)'}}>입원 치료 가능</p>
              </div>
            </div>
            <div style={{fontSize: '14px', lineHeight: '1.6', color: 'var(--text-primary)'}}>
              <p style={{marginBottom: '8px'}}>
                <strong>기준:</strong> 30병상 이상
              </p>
              <p style={{marginBottom: '8px'}}>
                <strong>특징:</strong> 입원 치료가 가능한 의료기관으로, 특정 분야에 특화된 경우가 많음
              </p>
              <p style={{marginBottom: '0'}}>
                <strong>예시:</strong> 정형외과병원, 재활병원, 요양병원 등
              </p>
            </div>
          </div>

          {/* 의원 */}
          <div style={{
            padding: '20px',
            background: 'linear-gradient(135deg, #f59e0b15, #fbbf2415)',
            borderRadius: '12px',
            border: '2px solid #f59e0b'
          }}>
            <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px'}}>
              <div style={{fontSize: '32px'}}>🏥</div>
              <div>
                <h3 style={{fontSize: '18px', fontWeight: 'bold', color: '#f59e0b', marginBottom: '4px'}}>
                  의원 (클리닉)
                </h3>
                <p style={{fontSize: '13px', color: 'var(--text-secondary)'}}>외래 진료 중심</p>
              </div>
            </div>
            <div style={{fontSize: '14px', lineHeight: '1.6', color: 'var(--text-primary)'}}>
              <p style={{marginBottom: '8px'}}>
                <strong>기준:</strong> 30병상 미만 (또는 병상 없음)
              </p>
              <p style={{marginBottom: '8px'}}>
                <strong>특징:</strong> 외래 진료 중심의 1차 의료기관으로, 동네에서 쉽게 찾을 수 있음
              </p>
              <p style={{marginBottom: '0'}}>
                <strong>예시:</strong> 내과의원, 정형외과의원, 치과의원, 한의원 등
              </p>
            </div>
          </div>
        </div>

        {/* TIP */}
        <div style={{
          marginTop: '24px',
          padding: '16px',
          background: '#fef3c7',
          borderRadius: '10px',
          border: '1px solid #fbbf24'
        }}>
          <p style={{fontSize: '14px', lineHeight: '1.6', color: '#92400e', margin: 0}}>
            <strong>💡 TIP:</strong> 가벼운 질환은 가까운 의원에서, 입원이 필요하거나 전문적인 치료가 필요한 경우에는
            병원이나 종합병원을, 중증 질환은 상급종합병원에서 진료받는 것이 효율적입니다.
          </p>
        </div>

        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="btn btn-primary"
          style={{
            width: '100%',
            marginTop: '24px',
            minHeight: '48px',
            fontSize: '15px',
            fontWeight: 'bold'
          }}
        >
          확인
        </button>
      </div>
    </div>
  );
}

export default HospitalTypeInfoModal;
