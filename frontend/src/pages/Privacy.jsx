function Privacy() {
  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">개인정보 처리방침</h1>
        <p className="page-subtitle">최종 업데이트: 2024년 11월</p>
      </div>

      <div className="card">
        <h2 style={{marginBottom: '16px', fontSize: '20px'}}>1. 개인정보의 수집 및 이용 목적</h2>
        <p style={{marginBottom: '20px', lineHeight: '1.8'}}>
          본 서비스는 다음의 목적으로 개인정보를 수집하고 이용합니다:
        </p>
        <ul style={{marginBottom: '20px', lineHeight: '1.8', paddingLeft: '20px'}}>
          <li>병원 및 의사 정보 제공 서비스 운영</li>
          <li>병원 관리자 계정 인증 및 관리</li>
          <li>서비스 개선 및 통계 분석</li>
        </ul>

        <h2 style={{marginBottom: '16px', fontSize: '20px'}}>2. 수집하는 개인정보 항목</h2>
        <h3 style={{marginBottom: '12px', fontSize: '16px', fontWeight: '600'}}>가. 병원 관리자</h3>
        <ul style={{marginBottom: '16px', lineHeight: '1.8', paddingLeft: '20px'}}>
          <li>필수: 병원명, 병원ID, 관리자 코드</li>
          <li>선택: 담당자 이메일, 연락처</li>
        </ul>

        <h3 style={{marginBottom: '12px', fontSize: '16px', fontWeight: '600'}}>나. 의사 정보</h3>
        <ul style={{marginBottom: '20px', lineHeight: '1.8', paddingLeft: '20px'}}>
          <li>필수: 이름, 전문과, 면허번호</li>
          <li>선택: 세부전공, 학력, 경력, 자격증</li>
          <li>연락처 및 이메일은 수집하지 않습니다 (병원 대표번호만 제공)</li>
        </ul>

        <h2 style={{marginBottom: '16px', fontSize: '20px'}}>3. 개인정보의 보유 및 이용기간</h2>
        <p style={{marginBottom: '20px', lineHeight: '1.8'}}>
          개인정보는 수집 및 이용목적이 달성된 후에는 해당 정보를 지체없이 파기합니다.
          단, 관계 법령에 의하여 보존할 필요가 있는 경우 법령에서 정한 기간 동안 보관합니다.
        </p>

        <h2 style={{marginBottom: '16px', fontSize: '20px'}}>4. 개인정보의 제3자 제공</h2>
        <p style={{marginBottom: '20px', lineHeight: '1.8'}}>
          본 서비스는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다.
          다만, 아래의 경우에는 예외로 합니다:
        </p>
        <ul style={{marginBottom: '20px', lineHeight: '1.8', paddingLeft: '20px'}}>
          <li>이용자가 사전에 동의한 경우</li>
          <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
        </ul>

        <h2 style={{marginBottom: '16px', fontSize: '20px'}}>5. 개인정보의 파기</h2>
        <p style={{marginBottom: '20px', lineHeight: '1.8'}}>
          이용자의 개인정보는 원칙적으로 개인정보의 수집 및 이용목적이 달성되면 지체없이 파기합니다.
          파기절차 및 방법은 다음과 같습니다:
        </p>
        <ul style={{marginBottom: '20px', lineHeight: '1.8', paddingLeft: '20px'}}>
          <li>파기절차: 이용자가 입력한 정보는 목적이 달성된 후 별도의 DB로 옮겨져 내부 방침 및 기타 관련 법령에 의한 정보보호 사유에 따라 일정 기간 저장된 후 파기됩니다.</li>
          <li>파기방법: 전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용합니다.</li>
        </ul>

        <h2 style={{marginBottom: '16px', fontSize: '20px'}}>6. 이용자의 권리</h2>
        <p style={{marginBottom: '20px', lineHeight: '1.8'}}>
          이용자는 언제든지 다음 각 호의 권리를 행사할 수 있습니다:
        </p>
        <ul style={{marginBottom: '20px', lineHeight: '1.8', paddingLeft: '20px'}}>
          <li>개인정보 열람 요구</li>
          <li>오류 등이 있을 경우 정정 요구</li>
          <li>삭제 요구</li>
          <li>처리정지 요구</li>
        </ul>

        <h2 style={{marginBottom: '16px', fontSize: '20px'}}>7. 개인정보 보호책임자</h2>
        <p style={{marginBottom: '20px', lineHeight: '1.8'}}>
          서비스는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
        </p>
        <div style={{backgroundColor: 'var(--bg-color)', padding: '16px', borderRadius: '8px', marginBottom: '20px'}}>
          <p style={{marginBottom: '8px'}}><strong>개인정보 보호책임자</strong></p>
          <p style={{marginBottom: '4px'}}>문의: 서비스 관리자</p>
          <p>이메일: privacy@hospital-system.kr (예시)</p>
        </div>

        <h2 style={{marginBottom: '16px', fontSize: '20px'}}>8. 개인정보 처리방침의 변경</h2>
        <p style={{marginBottom: '20px', lineHeight: '1.8'}}>
          이 개인정보 처리방침은 법령, 정책 또는 보안기술의 변경에 따라 내용의 추가, 삭제 및 수정이 있을 시에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
        </p>

        <h2 style={{marginBottom: '16px', fontSize: '20px'}}>9. 데이터 출처</h2>
        <p style={{marginBottom: '12px', lineHeight: '1.8'}}>
          본 서비스에서 제공하는 정보의 출처는 다음과 같습니다:
        </p>
        <ul style={{marginBottom: '20px', lineHeight: '1.8', paddingLeft: '20px'}}>
          <li><strong>병원 정보:</strong> 건강보험심사평가원 공공데이터포털 API</li>
          <li><strong>의사 정보:</strong> 병원 관리자가 직접 등록한 정보 또는 병원 홈페이지 공개 정보 (출처 명시)</li>
        </ul>

        <div style={{marginTop: '32px', padding: '16px', backgroundColor: '#e3f2fd', borderRadius: '8px'}}>
          <p style={{marginBottom: '8px', fontWeight: '600'}}>개인정보 침해 신고</p>
          <p style={{fontSize: '14px', lineHeight: '1.8'}}>
            개인정보 침해에 대한 신고나 상담이 필요하신 경우에는 아래 기관에 문의하시기 바랍니다:
          </p>
          <ul style={{fontSize: '14px', lineHeight: '1.8', paddingLeft: '20px', marginTop: '8px'}}>
            <li>개인정보침해신고센터: 국번없이 118</li>
            <li>대검찰청 사이버범죄수사단: 02-3480-3573</li>
            <li>경찰청 사이버안전국: 국번없이 182</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Privacy;
