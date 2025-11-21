/**
 * 병원 관리자 라우트
 *
 * 병원이 직접 의사 정보를 등록/수정/삭제할 수 있는 API
 */

import express from 'express';
import db from '../database/init.js';
import Doctor from '../models/Doctor.js';

const router = express.Router();

// 간단한 인증 토큰 저장소 (실제로는 JWT 등 사용 권장)
const adminSessions = new Map();

/**
 * 병원 관리자 로그인
 * POST /api/admin/login
 * Body: { hospital_id, admin_code }
 */
router.post('/login', (req, res) => {
  try {
    const { hospital_id, admin_code } = req.body;

    // 병원 존재 확인
    const hospital = db.hospitals.find(h => h.id === parseInt(hospital_id));
    if (!hospital) {
      return res.status(404).json({ error: '병원을 찾을 수 없습니다.' });
    }

    // 관리자 코드 확인 (실제로는 암호화된 비밀번호 사용)
    // 여기서는 데모용으로 간단히 구현
    const expectedCode = `ADMIN${hospital_id}2024`; // 예: ADMIN12024

    if (admin_code !== expectedCode) {
      return res.status(401).json({ error: '관리자 코드가 올바르지 않습니다.' });
    }

    // 세션 토큰 생성
    const token = `TOKEN_${Date.now()}_${hospital_id}`;
    adminSessions.set(token, {
      hospital_id: parseInt(hospital_id),
      hospital_name: hospital.name,
      login_time: new Date().toISOString()
    });

    res.json({
      success: true,
      token,
      hospital: {
        id: hospital.id,
        name: hospital.name
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 병원 소속 의사 목록 조회
 * GET /api/admin/doctors
 * Headers: { Authorization: Bearer TOKEN }
 */
router.get('/doctors', authenticateAdmin, (req, res) => {
  try {
    const { hospital_id } = req.admin;

    // 현재 근무 중인 의사 목록
    const currentDoctors = db.careers
      .filter(c => c.hospital_id === hospital_id && c.is_current)
      .map(career => {
        const doctor = db.doctors.find(d => d.id === career.doctor_id);
        return {
          ...doctor,
          career_id: career.id,
          position: career.position,
          department: career.department,
          start_date: career.start_date
        };
      });

    res.json(currentDoctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 의사 등록
 * POST /api/admin/doctors
 * Headers: { Authorization: Bearer TOKEN }
 */
router.post('/doctors', authenticateAdmin, (req, res) => {
  try {
    const { hospital_id } = req.admin;
    const {
      // 의사 기본 정보
      name,
      specialty,
      sub_specialty,
      license_number,
      phone,
      email,
      // 경력 정보
      position,
      department,
      start_date,
      // 학력 정보 (선택)
      education,
      // 자격증 정보 (선택)
      certifications
    } = req.body;

    // 필수 항목 확인
    if (!name || !specialty || !license_number) {
      return res.status(400).json({
        error: '필수 항목을 입력해주세요. (이름, 전문과, 면허번호)'
      });
    }

    // 면허번호 중복 확인
    const existingDoctor = db.doctors.find(d => d.license_number === license_number);
    if (existingDoctor) {
      return res.status(400).json({
        error: '이미 등록된 면허번호입니다.'
      });
    }

    // 의사 정보 저장
    const doctorId = Doctor.create({
      name,
      specialty,
      sub_specialty,
      license_number,
      phone,
      email
    });

    // 경력 정보 저장
    Doctor.addCareer(doctorId, {
      hospital_id,
      position: position || '전문의',
      department: department || specialty,
      start_date: start_date || new Date().toISOString().split('T')[0],
      end_date: null,
      is_current: true
    });

    // 학력 정보 저장 (있는 경우)
    if (education && Array.isArray(education)) {
      education.forEach(edu => {
        Doctor.addEducation(doctorId, edu);
      });
    }

    // 자격증 정보 저장 (있는 경우)
    if (certifications && Array.isArray(certifications)) {
      certifications.forEach(cert => {
        Doctor.addCertification(doctorId, cert);
      });
    }

    const newDoctor = Doctor.getById(doctorId);

    res.status(201).json({
      success: true,
      message: '의사 정보가 등록되었습니다.',
      doctor: newDoctor
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 의사 정보 수정
 * PUT /api/admin/doctors/:id
 */
router.put('/doctors/:id', authenticateAdmin, (req, res) => {
  try {
    const { hospital_id } = req.admin;
    const doctorId = parseInt(req.params.id);

    // 의사가 해당 병원 소속인지 확인
    const career = db.careers.find(
      c => c.doctor_id === doctorId && c.hospital_id === hospital_id && c.is_current
    );

    if (!career) {
      return res.status(403).json({
        error: '해당 의사의 정보를 수정할 권한이 없습니다.'
      });
    }

    const updatedDoctor = Doctor.update(doctorId, req.body);

    res.json({
      success: true,
      message: '의사 정보가 수정되었습니다.',
      doctor: updatedDoctor
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 의사 퇴사 처리
 * DELETE /api/admin/doctors/:id
 */
router.delete('/doctors/:id', authenticateAdmin, (req, res) => {
  try {
    const { hospital_id } = req.admin;
    const doctorId = parseInt(req.params.id);
    const { end_date } = req.body;

    // 현재 경력 찾기
    const careerIndex = db.careers.findIndex(
      c => c.doctor_id === doctorId && c.hospital_id === hospital_id && c.is_current
    );

    if (careerIndex === -1) {
      return res.status(404).json({
        error: '해당 의사를 찾을 수 없습니다.'
      });
    }

    // 퇴사 처리
    db.careers[careerIndex].is_current = false;
    db.careers[careerIndex].end_date = end_date || new Date().toISOString().split('T')[0];

    res.json({
      success: true,
      message: '퇴사 처리가 완료되었습니다.'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 인증 미들웨어
 */
function authenticateAdmin(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: '인증이 필요합니다.' });
  }

  const token = authHeader.substring(7);
  const session = adminSessions.get(token);

  if (!session) {
    return res.status(401).json({ error: '유효하지 않은 토큰입니다.' });
  }

  req.admin = session;
  next();
}

export default router;
