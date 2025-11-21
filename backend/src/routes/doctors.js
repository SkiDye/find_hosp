import express from 'express';
import Doctor from '../models/Doctor.js';

const router = express.Router();

// 모든 의사 조회
router.get('/', (req, res) => {
  try {
    const filters = {
      specialty: req.query.specialty,
      search: req.query.search
    };
    const doctors = Doctor.getAll(filters);
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 의사 통계
router.get('/stats', (req, res) => {
  try {
    const stats = Doctor.getStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 특정 의사 조회 (전체 정보)
router.get('/:id', (req, res) => {
  try {
    const doctor = Doctor.getById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ error: '의사를 찾을 수 없습니다.' });
    }
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 의사의 현재 병원 조회
router.get('/:id/current-hospital', (req, res) => {
  try {
    const hospital = Doctor.getCurrentHospital(req.params.id);
    res.json(hospital);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 의사 생성
router.post('/', (req, res) => {
  try {
    const doctorId = Doctor.create(req.body);
    const doctor = Doctor.getById(doctorId);
    res.status(201).json(doctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 의사 업데이트
router.put('/:id', (req, res) => {
  try {
    const doctor = Doctor.update(req.params.id, req.body);
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 의사 삭제
router.delete('/:id', (req, res) => {
  try {
    Doctor.delete(req.params.id);
    res.json({ message: '의사 정보가 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 학력 추가
router.post('/:id/education', (req, res) => {
  try {
    Doctor.addEducation(req.params.id, req.body);
    const doctor = Doctor.getById(req.params.id);
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 경력 추가 (이직 기록)
router.post('/:id/career', (req, res) => {
  try {
    Doctor.addCareer(req.params.id, req.body);
    const doctor = Doctor.getById(req.params.id);
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 경력 업데이트
router.put('/:id/career/:careerId', (req, res) => {
  try {
    Doctor.updateCareer(req.params.careerId, req.body);
    const doctor = Doctor.getById(req.params.id);
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 자격증 추가
router.post('/:id/certifications', (req, res) => {
  try {
    Doctor.addCertification(req.params.id, req.body);
    const doctor = Doctor.getById(req.params.id);
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
