import db from '../database/init.js';

class Career {
  // Helper method to convert database row to career object
  static _rowToCareer(row) {
    if (!row) return null;

    return {
      ...row,
      // Convert INTEGER to boolean
      is_current: row.is_current === 1
    };
  }

  // 모든 경력 조회
  static getAll(filters = {}) {
    let query = 'SELECT * FROM careers WHERE 1=1';
    const params = [];

    if (filters.doctor_id) {
      query += ' AND doctor_id = ?';
      params.push(parseInt(filters.doctor_id));
    }

    if (filters.hospital_id) {
      query += ' AND hospital_id = ?';
      params.push(parseInt(filters.hospital_id));
    }

    if (filters.is_current !== undefined) {
      query += ' AND is_current = ?';
      params.push(filters.is_current ? 1 : 0);
    }

    query += ' ORDER BY start_date DESC';

    const stmt = db.prepare(query);
    const rows = stmt.all(...params);
    return rows.map(row => this._rowToCareer(row));
  }

  // ID로 경력 조회
  static getById(id) {
    const stmt = db.prepare('SELECT * FROM careers WHERE id = ?');
    const row = stmt.get(parseInt(id));
    return this._rowToCareer(row);
  }

  // 경력 조회 with 의사 및 병원 정보
  static getByIdWithDetails(id) {
    const stmt = db.prepare(`
      SELECT
        c.*,
        d.name as doctor_name,
        d.specialty as doctor_specialty,
        d.license_number,
        h.name as hospital_name,
        h.region,
        h.city,
        h.type as hospital_type
      FROM careers c
      LEFT JOIN doctors d ON c.doctor_id = d.id
      LEFT JOIN hospitals h ON c.hospital_id = h.id
      WHERE c.id = ?
    `);

    const row = stmt.get(parseInt(id));
    if (!row) return null;

    return {
      id: row.id,
      doctor_id: row.doctor_id,
      hospital_id: row.hospital_id,
      position: row.position,
      department: row.department,
      start_date: row.start_date,
      end_date: row.end_date,
      is_current: row.is_current === 1,
      created_at: row.created_at,
      updated_at: row.updated_at,
      doctor: {
        name: row.doctor_name,
        specialty: row.doctor_specialty,
        license_number: row.license_number
      },
      hospital: {
        name: row.hospital_name,
        region: row.region,
        city: row.city,
        type: row.hospital_type
      }
    };
  }

  // 의사의 모든 경력 조회
  static getByDoctorId(doctorId) {
    const stmt = db.prepare(`
      SELECT c.*, h.name as hospital_name, h.region, h.city
      FROM careers c
      LEFT JOIN hospitals h ON c.hospital_id = h.id
      WHERE c.doctor_id = ?
      ORDER BY c.start_date DESC
    `);

    const rows = stmt.all(parseInt(doctorId));
    return rows.map(row => ({
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
  }

  // 병원의 모든 경력 조회
  static getByHospitalId(hospitalId) {
    const stmt = db.prepare(`
      SELECT c.*, d.name as doctor_name, d.specialty
      FROM careers c
      LEFT JOIN doctors d ON c.doctor_id = d.id
      WHERE c.hospital_id = ?
      ORDER BY c.start_date DESC
    `);

    const rows = stmt.all(parseInt(hospitalId));
    return rows.map(row => ({
      id: row.id,
      doctor_id: row.doctor_id,
      hospital_id: row.hospital_id,
      position: row.position,
      department: row.department,
      start_date: row.start_date,
      end_date: row.end_date,
      is_current: row.is_current === 1,
      doctor_name: row.doctor_name,
      doctor_specialty: row.specialty,
      created_at: row.created_at,
      updated_at: row.updated_at
    }));
  }

  // 경력 생성
  static create(data) {
    const stmt = db.prepare(`
      INSERT INTO careers (
        doctor_id, hospital_id, position, department,
        start_date, end_date, is_current,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const now = new Date().toISOString();

    const info = stmt.run(
      parseInt(data.doctor_id),
      parseInt(data.hospital_id),
      data.position,
      data.department,
      data.start_date,
      data.end_date || null,
      data.is_current ? 1 : 0,
      now,
      now
    );

    return this.getById(info.lastInsertRowid);
  }

  // 경력 업데이트
  static update(id, data) {
    const careerId = parseInt(id);
    const existing = this.getById(careerId);
    if (!existing) return null;

    const updates = [];
    const params = [];

    // Build dynamic UPDATE query
    if (data.doctor_id !== undefined) { updates.push('doctor_id = ?'); params.push(parseInt(data.doctor_id)); }
    if (data.hospital_id !== undefined) { updates.push('hospital_id = ?'); params.push(parseInt(data.hospital_id)); }
    if (data.position !== undefined) { updates.push('position = ?'); params.push(data.position); }
    if (data.department !== undefined) { updates.push('department = ?'); params.push(data.department); }
    if (data.start_date !== undefined) { updates.push('start_date = ?'); params.push(data.start_date); }
    if (data.end_date !== undefined) { updates.push('end_date = ?'); params.push(data.end_date); }
    if (data.is_current !== undefined) { updates.push('is_current = ?'); params.push(data.is_current ? 1 : 0); }

    updates.push('updated_at = ?');
    params.push(new Date().toISOString());

    params.push(careerId);

    const query = `UPDATE careers SET ${updates.join(', ')} WHERE id = ?`;
    const stmt = db.prepare(query);
    stmt.run(...params);

    return this.getById(careerId);
  }

  // 경력 삭제
  static delete(id) {
    const careerId = parseInt(id);
    const existing = this.getById(careerId);
    if (!existing) return false;

    const stmt = db.prepare('DELETE FROM careers WHERE id = ?');
    stmt.run(careerId);
    return true;
  }

  // 의사의 현재 근무지 조회
  static getCurrentByDoctorId(doctorId) {
    const stmt = db.prepare(`
      SELECT c.*, h.name as hospital_name, h.region, h.city
      FROM careers c
      LEFT JOIN hospitals h ON c.hospital_id = h.id
      WHERE c.doctor_id = ? AND c.is_current = 1
      LIMIT 1
    `);

    const row = stmt.get(parseInt(doctorId));
    if (!row) return null;

    return {
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
    };
  }

  // 병원의 현재 근무 의사 목록
  static getCurrentByHospitalId(hospitalId) {
    const stmt = db.prepare(`
      SELECT c.*, d.name as doctor_name, d.specialty
      FROM careers c
      LEFT JOIN doctors d ON c.doctor_id = d.id
      WHERE c.hospital_id = ? AND c.is_current = 1
      ORDER BY d.name COLLATE NOCASE
    `);

    const rows = stmt.all(parseInt(hospitalId));
    return rows.map(row => ({
      id: row.id,
      doctor_id: row.doctor_id,
      hospital_id: row.hospital_id,
      position: row.position,
      department: row.department,
      start_date: row.start_date,
      end_date: row.end_date,
      is_current: row.is_current === 1,
      doctor_name: row.doctor_name,
      doctor_specialty: row.specialty,
      created_at: row.created_at,
      updated_at: row.updated_at
    }));
  }

  // 의사의 이전 근무지를 현재가 아니게 업데이트
  static setNotCurrentForDoctor(doctorId) {
    const stmt = db.prepare(`
      UPDATE careers
      SET is_current = 0, updated_at = ?
      WHERE doctor_id = ? AND is_current = 1
    `);

    stmt.run(new Date().toISOString(), parseInt(doctorId));
  }

  // 통계
  static getStats() {
    const totalStmt = db.prepare('SELECT COUNT(*) as count FROM careers');
    const total = totalStmt.get().count;

    const currentStmt = db.prepare('SELECT COUNT(*) as count FROM careers WHERE is_current = 1');
    const currentCount = currentStmt.get().count;

    const byPositionStmt = db.prepare(`
      SELECT position, COUNT(*) as count
      FROM careers
      WHERE is_current = 1
      GROUP BY position
      ORDER BY count DESC
    `);
    const byPosition = byPositionStmt.all();

    const byDepartmentStmt = db.prepare(`
      SELECT department, COUNT(*) as count
      FROM careers
      WHERE is_current = 1
      GROUP BY department
      ORDER BY count DESC
    `);
    const byDepartment = byDepartmentStmt.all();

    return {
      total,
      currentCount,
      byPosition,
      byDepartment
    };
  }
}

export default Career;
