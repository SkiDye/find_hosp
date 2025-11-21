import db from '../database/init.js';

class Admin {
  // 모든 관리자 조회
  static getAll(filters = {}) {
    let query = 'SELECT * FROM admins WHERE 1=1';
    const params = [];

    if (filters.hospital_id) {
      query += ' AND hospital_id = ?';
      params.push(parseInt(filters.hospital_id));
    }

    if (filters.search) {
      query += ' AND (admin_code LIKE ? OR email LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm);
    }

    query += ' ORDER BY created_at DESC';

    const stmt = db.prepare(query);
    return stmt.all(...params);
  }

  // ID로 관리자 조회
  static getById(id) {
    const stmt = db.prepare('SELECT * FROM admins WHERE id = ?');
    return stmt.get(parseInt(id));
  }

  // 관리자 조회 with 병원 정보
  static getByIdWithHospital(id) {
    const stmt = db.prepare(`
      SELECT
        a.*,
        h.name as hospital_name,
        h.type as hospital_type,
        h.region,
        h.city,
        h.address
      FROM admins a
      LEFT JOIN hospitals h ON a.hospital_id = h.id
      WHERE a.id = ?
    `);

    const row = stmt.get(parseInt(id));
    if (!row) return null;

    return {
      id: row.id,
      hospital_id: row.hospital_id,
      admin_code: row.admin_code,
      email: row.email,
      phone: row.phone,
      created_at: row.created_at,
      updated_at: row.updated_at,
      hospital: {
        name: row.hospital_name,
        type: row.hospital_type,
        region: row.region,
        city: row.city,
        address: row.address
      }
    };
  }

  // 병원 ID로 관리자 조회
  static getByHospitalId(hospitalId) {
    const stmt = db.prepare('SELECT * FROM admins WHERE hospital_id = ?');
    return stmt.get(parseInt(hospitalId));
  }

  // 관리자 코드로 조회
  static getByAdminCode(adminCode) {
    const stmt = db.prepare('SELECT * FROM admins WHERE admin_code = ?');
    return stmt.get(adminCode);
  }

  // 관리자 코드로 조회 with 병원 정보
  static getByAdminCodeWithHospital(adminCode) {
    const stmt = db.prepare(`
      SELECT
        a.*,
        h.name as hospital_name,
        h.type as hospital_type,
        h.region,
        h.city,
        h.address,
        h.phone as hospital_phone,
        h.homepage
      FROM admins a
      LEFT JOIN hospitals h ON a.hospital_id = h.id
      WHERE a.admin_code = ?
    `);

    const row = stmt.get(adminCode);
    if (!row) return null;

    return {
      id: row.id,
      hospital_id: row.hospital_id,
      admin_code: row.admin_code,
      email: row.email,
      phone: row.phone,
      created_at: row.created_at,
      updated_at: row.updated_at,
      hospital: {
        name: row.hospital_name,
        type: row.hospital_type,
        region: row.region,
        city: row.city,
        address: row.address,
        phone: row.hospital_phone,
        homepage: row.homepage
      }
    };
  }

  // 관리자 생성
  static create(data) {
    // Check if hospital already has an admin
    const existingAdmin = this.getByHospitalId(data.hospital_id);
    if (existingAdmin) {
      throw new Error('This hospital already has an administrator');
    }

    const stmt = db.prepare(`
      INSERT INTO admins (
        hospital_id, admin_code, email, phone,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?)
    `);

    const now = new Date().toISOString();

    const info = stmt.run(
      parseInt(data.hospital_id),
      data.admin_code,
      data.email || null,
      data.phone || null,
      now,
      now
    );

    return this.getById(info.lastInsertRowid);
  }

  // 관리자 업데이트
  static update(id, data) {
    const adminId = parseInt(id);
    const existing = this.getById(adminId);
    if (!existing) return null;

    const updates = [];
    const params = [];

    // Build dynamic UPDATE query
    if (data.admin_code !== undefined) { updates.push('admin_code = ?'); params.push(data.admin_code); }
    if (data.email !== undefined) { updates.push('email = ?'); params.push(data.email); }
    if (data.phone !== undefined) { updates.push('phone = ?'); params.push(data.phone); }

    // Hospital ID should not be changed after creation, but allow it
    if (data.hospital_id !== undefined) {
      // Check if new hospital already has an admin
      const existingAdmin = this.getByHospitalId(data.hospital_id);
      if (existingAdmin && existingAdmin.id !== adminId) {
        throw new Error('The target hospital already has an administrator');
      }
      updates.push('hospital_id = ?');
      params.push(parseInt(data.hospital_id));
    }

    updates.push('updated_at = ?');
    params.push(new Date().toISOString());

    params.push(adminId);

    const query = `UPDATE admins SET ${updates.join(', ')} WHERE id = ?`;
    const stmt = db.prepare(query);
    stmt.run(...params);

    return this.getById(adminId);
  }

  // 관리자 삭제
  static delete(id) {
    const adminId = parseInt(id);
    const existing = this.getById(adminId);
    if (!existing) return false;

    const stmt = db.prepare('DELETE FROM admins WHERE id = ?');
    stmt.run(adminId);
    return true;
  }

  // 관리자 코드로 삭제
  static deleteByAdminCode(adminCode) {
    const admin = this.getByAdminCode(adminCode);
    if (!admin) return false;

    const stmt = db.prepare('DELETE FROM admins WHERE admin_code = ?');
    stmt.run(adminCode);
    return true;
  }

  // 병원 ID로 삭제
  static deleteByHospitalId(hospitalId) {
    const admin = this.getByHospitalId(hospitalId);
    if (!admin) return false;

    const stmt = db.prepare('DELETE FROM admins WHERE hospital_id = ?');
    stmt.run(parseInt(hospitalId));
    return true;
  }

  // 관리자 코드 유효성 검사
  static validateAdminCode(adminCode, hospitalId) {
    const admin = this.getByAdminCode(adminCode);
    if (!admin) return false;

    return admin.hospital_id === parseInt(hospitalId);
  }

  // 통계
  static getStats() {
    const totalStmt = db.prepare('SELECT COUNT(*) as count FROM admins');
    const total = totalStmt.get().count;

    const withEmailStmt = db.prepare('SELECT COUNT(*) as count FROM admins WHERE email IS NOT NULL');
    const withEmail = withEmailStmt.get().count;

    const withPhoneStmt = db.prepare('SELECT COUNT(*) as count FROM admins WHERE phone IS NOT NULL');
    const withPhone = withPhoneStmt.get().count;

    const byRegionStmt = db.prepare(`
      SELECT h.region, COUNT(*) as count
      FROM admins a
      LEFT JOIN hospitals h ON a.hospital_id = h.id
      GROUP BY h.region
      ORDER BY count DESC
    `);
    const byRegion = byRegionStmt.all();

    return {
      total,
      withEmail,
      withPhone,
      byRegion
    };
  }
}

export default Admin;
