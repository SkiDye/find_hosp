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

  const formatTime = (timeObj) => {
    if (!timeObj || timeObj === 'closed') return '휴무';
    if (typeof timeObj === 'string') return timeObj;
    return `${timeObj.open} - ${timeObj.close}`;
  };

  // 요일별 데이터 준비
  const scheduleData = [
    { key: 'weekday', label: '평일', shortLabel: '월-금', days: '(월화수목금)', dayNums: [1, 2, 3, 4, 5] },
    { key: 'saturday', label: '토요일', shortLabel: '토', days: '', dayNums: [6] },
    { key: 'sunday', label: '일요일', shortLabel: '일', days: '', dayNums: [0] }
  ];

  return (
    <div className="card" style={{marginBottom: '20px'}}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <h2 style={{fontSize: '20px', fontWeight: 'bold', margin: 0}}>운영시간</h2>
        <div style={{
          padding: '6px 12px',
          borderRadius: '6px',
          fontSize: '13px',
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
        borderRadius: '8px',
        padding: '12px',
        marginBottom: '12px'
      }}>
        {scheduleData.map((schedule, index) => {
          const timeData = hours[schedule.key];
          const timeStr = formatTime(timeData);
          const isToday = schedule.dayNums.includes(today);

          return (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 12px',
                borderRadius: '6px',
                marginBottom: index < scheduleData.length - 1 ? '6px' : 0,
                background: isToday ? 'white' : 'transparent',
                border: isToday ? '2px solid var(--primary-color)' : '2px solid transparent'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span style={{
                  fontSize: '14px',
                  fontWeight: isToday ? 'bold' : '600',
                  color: isToday ? 'var(--primary-color)' : 'var(--text-primary)',
                  minWidth: '50px'
                }}>
                  {schedule.shortLabel}
                </span>
                {schedule.days && (
                  <span style={{
                    fontSize: '12px',
                    color: 'var(--text-secondary)'
                  }}>
                    {schedule.days}
                  </span>
                )}
                {isToday && (
                  <span style={{
                    fontSize: '10px',
                    padding: '2px 6px',
                    background: 'var(--primary-color)',
                    color: 'white',
                    borderRadius: '10px',
                    fontWeight: 'bold'
                  }}>
                    오늘
                  </span>
                )}
              </div>
              <span style={{
                fontSize: '13px',
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
          gap: '6px',
          padding: '8px 12px',
          background: '#fff8e1',
          borderRadius: '6px',
          marginBottom: '8px'
        }}>
          <span style={{fontSize: '16px'}}>🍱</span>
          <span style={{fontSize: '13px', color: '#f57c00', fontWeight: '500'}}>
            점심시간: {hours.lunch_break.start} - {hours.lunch_break.end}
          </span>
        </div>
      )}

      {/* 비고 */}
      {hours.note && (
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '6px',
          padding: '8px 12px',
          background: '#e3f2fd',
          borderRadius: '6px'
        }}>
          <span style={{fontSize: '16px'}}>ℹ️</span>
          <span style={{fontSize: '13px', color: '#1976d2', lineHeight: '1.5'}}>
            {hours.note}
          </span>
        </div>
      )}
    </div>
  );
}

export default OperatingHours;
