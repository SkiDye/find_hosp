import db from '../database/init.js';

class Doctor {
  // 모든 의사 조회
  static getAll(filters = {}) {
    let query = 'SELECT * FROM doctors WHERE 1=1';
    const params = [];

    if (filters.specialty) {
      query += ' AND specialty = ?';
      params.push(filters.specialty);
    }

    if (filters.search) {
      query += ' AND (name LIKE ? OR license_number LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm);
    }

    query += ' ORDER BY name COLLATE NOCASE';

    const stmt = db.prepare(query);
    return stmt.all(...params);
  }

  // ID로 의사 조회 (전체 정보 포함)
  static getById(id) {
    const stmt = db.prepare('SELECT * FROM doctors WHERE id = ?');
    const doctor = stmt.get(parseInt(id));
    if (!doctor) return null;

    // 경력 정보 (이직 기록) - hospitals 테이블과 JOIN
    const careerStmt = db.prepare(`
      SELECT c.*, h.name as hospital_name, h.region, h.city
      FROM careers c
      LEFT JOIN hospitals h ON c.hospital_id = h.id
      WHERE c.doctor_id = ?
      ORDER BY c.start_date DESC
    `);
    const career = careerStmt.all(parseInt(id)).map(row => ({
      id: row.id,
      doctor_id: row.doctor_id,
      hospital_id: row.hospital_id,
      position: row.position,
      department: row.department,
      start_date: row.start_date,
      end_date: row.end_date,
      is_current: row.is_current === 1,
      hospital_name: row.hospital_name,
      region: row.region,
      city: row.city,
      created_at: row.created_at,
      updated_at: row.updated_at
    }));

    return {
      ...doctor,
      career
    };
  }

  // 의사 생성
  static create(data) {
    const stmt = db.prepare(`
      INSERT INTO doctors (
        name, email, password, specialty, sub_specialty,
        license_number, phone, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const now = new Date().toISOString();

    const info = stmt.run(
      data.name,
      data.email,
      data.password,
      data.specialty,
      data.sub_specialty || null,
      data.license_number,
      data.phone || null,
      now,
      now
    );

    return info.lastInsertRowid;
  }

  // 의사 업데이트
  static update(id, data) {
    const doctorId = parseInt(id);
    const existing = this.getById(doctorId);
    if (!existing) return null;

    const updates = [];
    const params = [];

    // Build dynamic UPDATE query
    if (data.name !== undefined) { updates.push('name = ?'); params.push(data.name); }
    if (data.email !== undefined) { updates.push('email = ?'); params.push(data.email); }
    if (data.password !== undefined) { updates.push('password = ?'); params.push(data.password); }
    if (data.specialty !== undefined) { updates.push('specialty = ?'); params.push(data.specialty); }
    if (data.sub_specialty !== undefined) { updates.push('sub_specialty = ?'); params.push(data.sub_specialty); }
    if (data.license_number !== undefined) { updates.push('license_number = ?'); params.push(data.license_number); }
    if (data.phone !== undefined) { updates.push('phone = ?'); params.push(data.phone); }

    updates.push('updated_at = ?');
    params.push(new Date().toISOString());

    params.push(doctorId);

    const query = `UPDATE doctors SET ${updates.join(', ')} WHERE id = ?`;
    const stmt = db.prepare(query);
    stmt.run(...params);

    return this.getById(doctorId);
  }

  // 의사 삭제
  static delete(id) {
    const doctorId = parseInt(id);
    const existing = this.getById(doctorId);
    if (!existing) return false;

    // Delete doctor (careers will be cascade deleted due to FOREIGN KEY)
    const stmt = db.prepare('DELETE FROM doctors WHERE id = ?');
    stmt.run(doctorId);
    return true;
  }

  // 경력 추가 (이직 기록)
  static addCareer(doctorId, career) {
    const stmt = db.prepare(`
      INSERT INTO careers (
        doctor_id, hospital_id, position, department,
        start_date, end_date, is_current, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const now = new Date().toISOString();

    const info = stmt.run(
      parseInt(doctorId),
      career.hospital_id,
      career.position,
      career.department,
      career.start_date,
      career.end_date || null,
      career.is_current ? 1 : 0,
      now,
      now
    );

    const getStmt = db.prepare('SELECT * FROM careers WHERE id = ?');
    const row = getStmt.get(info.lastInsertRowid);

    return {
      ...row,
      is_current: row.is_current === 1
    };
  }

  // 경력 업데이트
  static updateCareer(careerId, career) {
    const careerIdInt = parseInt(careerId);

    // Check if career exists
    const checkStmt = db.prepare('SELECT id FROM careers WHERE id = ?');
    const exists = checkStmt.get(careerIdInt);
    if (!exists) return false;

    const updates = [];
    const params = [];

    // Build dynamic UPDATE query
    if (career.hospital_id !== undefined) { updates.push('hospital_id = ?'); params.push(career.hospital_id); }
    if (career.position !== undefined) { updates.push('position = ?'); params.push(career.position); }
    if (career.department !== undefined) { updates.push('department = ?'); params.push(career.department); }
    if (career.start_date !== undefined) { updates.push('start_date = ?'); params.push(career.start_date); }
    if (career.end_date !== undefined) { updates.push('end_date = ?'); params.push(career.end_date); }
    if (career.is_current !== undefined) { updates.push('is_current = ?'); params.push(career.is_current ? 1 : 0); }

    updates.push('updated_at = ?');
    params.push(new Date().toISOString());

    params.push(careerIdInt);

    const query = `UPDATE careers SET ${updates.join(', ')} WHERE id = ?`;
    const stmt = db.prepare(query);
    stmt.run(...params);

    return true;
  }

  // 통계
  static getStats() {
    const totalStmt = db.prepare('SELECT COUNT(*) as count FROM doctors');
    const total = totalStmt.get().count;

    const bySpecialtyStmt = db.prepare(`
      SELECT specialty, COUNT(*) as count
      FROM doctors
      GROUP BY specialty
      ORDER BY specialty
    `);
    const bySpecialty = bySpecialtyStmt.all();

    return {
      total,
      bySpecialty
    };
  }

  // 현재 근무 중인 병원 조회
  static getCurrentHospital(doctorId) {
    const stmt = db.prepare(`
      SELECT h.*, c.position, c.department, c.start_date
      FROM hospitals h
      INNER JOIN careers c ON h.id = c.hospital_id
      WHERE c.doctor_id = ? AND c.is_current = 1
      LIMIT 1
    `);

    const row = stmt.get(parseInt(doctorId));
    if (!row) return null;

    return {
      id: row.id,
      name: row.name,
      type: row.type,
      address: row.address,
      region: row.region,
      city: row.city,
      phone: row.phone,
      homepage: row.homepage,
      specialties: row.specialties ? row.specialties.split(',').map(s => s.trim()) : [],
      beds: row.beds,
      established_date: row.established_date,
      latitude: row.latitude,
      longitude: row.longitude,
      ranking_domestic: row.ranking_domestic,
      ranking_global: row.ranking_global,
      notes: row.notes,
      has_emergency_room: row.has_emergency_room === 1,
      open_24_hours: row.open_24_hours === 1,
      weekend_available: row.weekend_available === 1,
      image_url: row.image_url,
      image_urls: JSON.parse(row.image_urls || '[]'),
      position: row.position,
      department: row.department,
      start_date: row.start_date,
      created_at: row.created_at,
      updated_at: row.updated_at
    };
  }
}

export default Doctor;
