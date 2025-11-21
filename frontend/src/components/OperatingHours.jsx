import { getBusinessStatus } from '../utils/businessHours';

/**
 * 운영시간 표시 컴포넌트
 */
function OperatingHours({ hospital }) {
  if (!hospital.opening_hours) {
    return null;
  }

  let hours;
  try {
    hours = typeof hospital.opening_hours === 'string'
      ? JSON.parse(hospital.opening_hours)
      : hospital.opening_hours;
  } catch (error) {
    console.error('운영시간 파싱 실패:', error);
    return null;
  }

  const businessStatus = getBusinessStatus(hospital);
  const today = new Date().getDay(); // 0 (일요일) ~ 6 (토요일)

  const daysOfWeek = [
    { key: 'sunday', label: '일요일', dayNum: 0 },
    { key: 'weekday', label: '월요일', dayNum: 1 },
    { key: 'weekday', label: '화요일', dayNum: 2 },
    { key: 'weekday', label: '수요일', dayNum: 3 },
    { key: 'weekday', label: '목요일', dayNum: 4 },
    { key: 'weekday', label: '금요일', dayNum: 5 },
    { key: 'saturday', label: '토요일', dayNum: 6 }
  ];

  const formatTime = (timeObj) => {
    if (!timeObj || timeObj === 'closed') return '휴무';
    if (typeof timeObj === 'string') return timeObj;
    return `${timeObj.open} - ${timeObj.close}`;
  };

  return (
    <div className="card" style={{marginBottom: '20px'}}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h2 style={{fontSize: '20px', fontWeight: 'bold', margin: 0}}>운영시간</h2>
        <div style={{
          padding: '8px 16px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '600',
          background: businessStatus.bgColor,
          color: businessStatus.color,
          border: `2px solid ${businessStatus.color}`
        }}>
          {businessStatus.text}
        </div>
      </div>

      <div style={{
        background: 'var(--bg-secondary)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '16px'
      }}>
        {daysOfWeek.map((day, index) => {
          const isToday = day.dayNum === today;
          const timeData = hours[day.key];
          const timeStr = formatTime(timeData);

          return (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: index < daysOfWeek.length - 1 ? '8px' : 0,
                background: isToday ? 'white' : 'transparent',
                border: isToday ? '2px solid var(--primary-color)' : '2px solid transparent',
                transition: 'all 0.2s'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{
                  fontSize: '15px',
                  fontWeight: isToday ? 'bold' : '500',
                  color: isToday ? 'var(--primary-color)' : 'var(--text-primary)'
                }}>
                  {day.label}
                </span>
                {isToday && (
                  <span style={{
                    fontSize: '11px',
                    padding: '2px 8px',
                    background: 'var(--primary-color)',
                    color: 'white',
                    borderRadius: '12px',
                    fontWeight: 'bold'
                  }}>
                    오늘
                  </span>
                )}
              </div>
              <span style={{
                fontSize: '14px',
                fontWeight: isToday ? '600' : '500',
                color: timeStr === '휴무' ? 'var(--text-secondary)' : 'var(--text-primary)'
              }}>
                {timeStr}
              </span>
            </div>
          );
        })}
      </div>

      {/* 점심시간 */}
      {hours.lunch_break && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 16px',
          background: '#fff8e1',
          borderRadius: '8px',
          marginBottom: '12px'
        }}>
          <span style={{fontSize: '18px'}}>🍱</span>
          <span style={{fontSize: '14px', color: '#f57c00', fontWeight: '500'}}>
            점심시간: {hours.lunch_break.start} - {hours.lunch_break.end}
          </span>
        </div>
      )}

      {/* 비고 */}
      {hours.note && (
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '8px',
          padding: '12px 16px',
          background: '#e3f2fd',
          borderRadius: '8px'
        }}>
          <span style={{fontSize: '18px'}}>ℹ️</span>
          <span style={{fontSize: '14px', color: '#1976d2', lineHeight: '1.6'}}>
            {hours.note}
          </span>
        </div>
      )}
    </div>
  );
}

export default OperatingHours;
