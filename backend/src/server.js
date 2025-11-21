import express from 'express';
import cors from 'cors';
import hospitalRoutes from './routes/hospitals.js';
import doctorRoutes from './routes/doctors.js';
import adminRoutes from './routes/admin.js';
import './database/init.js'; // 데이터베이스 초기화

const app = express();
const PORT = process.env.PORT || 5001;

// 미들웨어
app.use(cors());
app.use(express.json());

// 라우트
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/admin', adminRoutes);

// 헬스 체크
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: '병원-의사 관리 시스템 API 서버' });
});

// 404 핸들러
app.use((req, res) => {
  res.status(404).json({ error: '요청한 엔드포인트를 찾을 수 없습니다.' });
});

// 에러 핸들러
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: '서버 오류가 발생했습니다.' });
});

app.listen(PORT, () => {
  console.log(`🚀 서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`📍 API 주소: http://localhost:${PORT}/api`);
});
