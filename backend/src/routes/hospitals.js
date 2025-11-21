import express from 'express';
import Hospital from '../models/Hospital.js';

const router = express.Router();

// 모든 병원 조회
router.get('/', (req, res) => {
  try {
    const filters = {
      region: req.query.region,
      city: req.query.city,
      type: req.query.type,
      specialty: req.query.specialty,
      search: req.query.search
    };
    console.log('🔍 Hospital filters:', filters);
    const hospitals = Hospital.getAll(filters);
    console.log(`✅ Found ${hospitals.length} hospitals`);
    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 병원 통계
router.get('/stats', (req, res) => {
  try {
    const stats = Hospital.getStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 특정 병원 조회
router.get('/:id', (req, res) => {
  try {
    const hospital = Hospital.getById(req.params.id);
    if (!hospital) {
      return res.status(404).json({ error: '병원을 찾을 수 없습니다.' });
    }
    res.json(hospital);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 병원의 의사 목록 조회
router.get('/:id/doctors', (req, res) => {
  try {
    const doctors = Hospital.getDoctors(req.params.id);
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 병원 생성
router.post('/', (req, res) => {
  try {
    const hospital = Hospital.create(req.body);
    res.status(201).json(hospital);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 병원 업데이트
router.put('/:id', (req, res) => {
  try {
    const hospital = Hospital.update(req.params.id, req.body);
    res.json(hospital);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 병원 삭제
router.delete('/:id', (req, res) => {
  try {
    Hospital.delete(req.params.id);
    res.json({ message: '병원이 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
