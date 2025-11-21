function Terms() {
  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">이용약관</h1>
        <p className="page-subtitle">최종 업데이트: 2024년 11월</p>
      </div>

      <div className="card">
        <h2 style={{marginBottom: '16px', fontSize: '20px'}}>제1조 (목적)</h2>
        <p style={{marginBottom: '20px', lineHeight: '1.8'}}>
          본 약관은 병원·의사 관리 시스템(이하 "서비스")의 이용과 관련하여 서비스 제공자와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
        </p>

        <h2 style={{marginBottom: '16px', fontSize: '20px'}}>제2조 (정의)</h2>
        <ul style={{marginBottom: '20px', lineHeight: '1.8', paddingLeft: '20px'}}>
          <li>"서비스"란 병원 및 의사 정보를 제공하는 플랫폼을 말합니다.</li>
          <li>"이용자"란 본 약관에 따라 서비스를 이용하는 자를 말합니다.</li>
          <li>"병원 정보"란 공공데이터포털 API를 통해 수집된 병원 기본 정보를 말합니다.</li>
          <li>"의사 정보"란 병원이 직접 등록하거나 공개된 정보를 기반으로 제공되는 의료진 정보를 말합니다.</li>
        </ul>

        <h2 style={{marginBottom: '16px', fontSize: '20px'}}>제3조 (데이터 출처 및 정확성)</h2>
        <ol style={{marginBottom: '20px', lineHeight: '1.8', paddingLeft: '20px'}}>
          <li>병원 기본 정보는 건강보험심사평가원의 공공데이터를 활용합니다.</li>
          <li>의사 정보는 다음의 방법으로 수집됩니다:
            <ul style={{marginTop: '8px', paddingLeft: '20px'}}>
              <li>병원 관리자가 직접 등록한 정보</li>
              <li>병원 홈페이지에 공개된 정보 (출처 명시)</li>
            </ul>
          </li>
          <li>서비스 제공자는 정보의 정확성을 보장하기 위해 노력하나, 모든 정보의 정확성을 보장하지는 않습니다.</li>
          <li>중요한 의료 결정 시에는 반드시 해당 병원에 직접 확인하시기 바랍니다.</li>
        </ol>

        <h2 style={{marginBottom: '16px', fontSize: '20px'}}>제4조 (개인정보 보호)</h2>
        <p style={{marginBottom: '20px', lineHeight: '1.8'}}>
          서비스 제공자는 이용자의 개인정보를 보호하기 위해 개인정보보호법 및 관련 법령을 준수합니다.
          자세한 내용은 <a href="/privacy" style={{color: 'var(--primary-color)'}}>개인정보 처리방침</a>을 참조하세요.
        </p>

        <h2 style={{marginBottom: '16px', fontSize: '20px'}}>제5조 (면책사항)</h2>
        <ol style={{marginBottom: '20px', lineHeight: '1.8', paddingLeft: '20px'}}>
          <li>서비스는 정보 제공 목적으로만 운영되며, 의료 상담이나 진단을 제공하지 않습니다.</li>
          <li>서비스 제공자는 이용자가 서비스를 이용하여 기대하는 이익을 얻지 못한 것에 대하여 책임을 지지 않습니다.</li>
          <li>서비스에 게재된 정보의 오류로 인한 손해에 대해 서비스 제공자는 책임을 지지 않습니다.</li>
          <li>정보의 정확성은 각 병원에 직접 확인하시기 바랍니다.</li>
        </ol>

        <h2 style={{marginBottom: '16px', fontSize: '20px'}}>제6조 (저작권)</h2>
        <p style={{marginBottom: '20px', lineHeight: '1.8'}}>
          서비스에 게재된 모든 콘텐츠의 저작권은 원 저작권자에게 있으며, 무단 복제 및 배포를 금지합니다.
        </p>

        <h2 style={{marginBottom: '16px', fontSize: '20px'}}>제7조 (정보 수정 및 삭제 요청)</h2>
        <p style={{marginBottom: '20px', lineHeight: '1.8'}}>
          본인의 정보가 잘못 게재되었거나 삭제를 원하는 경우, 언제든지 수정 또는 삭제를 요청할 수 있습니다.
        </p>

        <h2 style={{marginBottom: '16px', fontSize: '20px'}}>제8조 (분쟁 해결)</h2>
        <p style={{marginBottom: '20px', lineHeight: '1.8'}}>
          서비스 이용과 관련하여 발생한 분쟁에 대해서는 대한민국 법을 준거법으로 하며,
          관할 법원은 서비스 제공자의 소재지를 관할하는 법원으로 합니다.
        </p>
      </div>
    </div>
  );
}

export default Terms;
