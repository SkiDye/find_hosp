/**
 * 병원의 현재 영업 상태를 계산합니다
 * @param {Object} hospital - 병원 정보
 * @returns {Object} { status: 'open'|'closed', text: '영업 중'|'영업 종료'|'24시간 운영', color: string }
 */
export function getBusinessStatus(hospital) {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentDay = now.getDay(); // 0=일요일, 6=토요일
  const isWeekend = currentDay === 0 || currentDay === 6;

  // 24시간 운영 병원
  if (hospital.open_24_hours) {
    return {
      status: 'open',
      text: '영업 중',
      color: '#10b981', // 초록색
      bgColor: '#d1fae5'
    };
  }

  // 일반적인 병원 영업시간 (평일 09:00-18:00)
  const openHour = 9;
  const closeHour = 18;

  // 주말인 경우
  if (isWeekend) {
    if (hospital.weekend_available) {
      // 주말 영업 (09:00-13:00 가정)
      if (currentHour >= openHour && currentHour < 13) {
        return {
          status: 'open',
          text: '영업 중',
          color: '#10b981',
          bgColor: '#d1fae5'
        };
      } else {
        return {
          status: 'closed',
          text: '영업 종료',
          color: '#6b7280',
          bgColor: '#f3f4f6'
        };
      }
    } else {
      return {
        status: 'closed',
        text: '주말 휴무',
        color: '#6b7280',
        bgColor: '#f3f4f6'
      };
    }
  }

  // 평일인 경우
  if (currentHour >= openHour && currentHour < closeHour) {
    // 마감 1시간 전
    if (currentHour === closeHour - 1) {
      return {
        status: 'closing-soon',
        text: '곧 마감',
        color: '#f59e0b', // 주황색
        bgColor: '#fef3c7'
      };
    }
    return {
      status: 'open',
      text: '영업 중',
      color: '#10b981',
      bgColor: '#d1fae5'
    };
  } else {
    return {
      status: 'closed',
      text: '영업 종료',
      color: '#6b7280',
      bgColor: '#f3f4f6'
    };
  }
}

/**
 * 병원의 영업 시간 텍스트를 반환합니다
 * @param {Object} hospital - 병원 정보
 * @returns {string} 영업 시간 텍스트
 */
export function getBusinessHours(hospital) {
  if (hospital.open_24_hours) {
    return '24시간 운영';
  }

  let hours = '평일 09:00-18:00';

  if (hospital.weekend_available) {
    hours += ' | 주말 09:00-13:00';
  } else {
    hours += ' | 주말 휴무';
  }

  return hours;
}
