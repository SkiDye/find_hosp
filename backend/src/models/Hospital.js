import db from '../database/init.js';
import { generateImageFallback } from '../utils/imageTemplates.js';

class Hospital {
  // Helper method to convert database row to hospital object
  static _rowToHospital(row) {
    if (!row) return null;

    return {
      ...row,
      // Convert INTEGER to boolean
      has_emergency_room: row.has_emergency_room === 1,
      open_24_hours: row.open_24_hours === 1,
      weekend_available: row.weekend_available === 1,
      // Parse JSON strings to arrays/objects
      image_urls: JSON.parse(row.image_urls || '[]'),
      specialties: row.specialties ? row.specialties.split(',').map(s => s.trim()) : []
    };
  }

  // 모든 병원 조회
  static getAll(filters = {}) {
    let query = 'SELECT * FROM hospitals WHERE 1=1';
    const params = [];

    if (filters.region) {
      query += ' AND region = ?';
      params.push(filters.region);
    }

    if (filters.city) {
      query += ' AND city = ?';
      params.push(filters.city);
    }

    if (filters.type) {
      query += ' AND type = ?';
      params.push(filters.type);
    }

    if (filters.specialty) {
      query += ' AND specialties LIKE ?';
      params.push(`%${filters.specialty}%`);
    }

    if (filters.search) {
      query += ' AND (name LIKE ? OR address LIKE ? OR specialties LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    // 응급실 필터
    if (filters.has_emergency_room === 'true' || filters.has_emergency_room === true) {
      query += ' AND has_emergency_room = 1';
    }

    // 24시간 운영 필터
    if (filters.open_24_hours === 'true' || filters.open_24_hours === true) {
      query += ' AND open_24_hours = 1';
    }

    // 주말 진료 필터
    if (filters.weekend_available === 'true' || filters.weekend_available === true) {
      query += ' AND weekend_available = 1';
    }

    query += ' ORDER BY name COLLATE NOCASE';

    const stmt = db.prepare(query);
    const rows = stmt.all(...params);
    return rows.map(row => this._rowToHospital(row));
  }

  // ID로 병원 조회
  static getById(id) {
    const stmt = db.prepare('SELECT * FROM hospitals WHERE id = ?');
    const row = stmt.get(parseInt(id));
    return this._rowToHospital(row);
  }

  // 병원에 소속된 의사 목록
  static getDoctors(hospitalId) {
    const stmt = db.prepare(`
      SELECT d.*, c.position, c.department, c.start_date
      FROM doctors d
      INNER JOIN careers c ON d.id = c.doctor_id
      WHERE c.hospital_id = ? AND c.is_current = 1
      ORDER BY d.name COLLATE NOCASE
    `);

    const rows = stmt.all(parseInt(hospitalId));
    return rows.map(row => ({
      id: row.id,
      name: row.name,
      email: row.email,
      specialty: row.specialty,
      sub_specialty: row.sub_specialty,
      license_number: row.license_number,
      phone: row.phone,
      position: row.position,
      department: row.department,
      start_date: row.start_date,
      created_at: row.created_at,
      updated_at: row.updated_at
    }));
  }

  // 병원 생성
  static create(data) {
    // 이미지 폴백 체인 자동 생성
    const imageFallback = generateImageFallback({
      hospitalId: null, // Will be set after insert
      namuwikiImage: data.namuwiki_image,
      wikipediaImage: data.wikipedia_image,
      homepageImage: data.homepage_image || data.image_url,
      naverMapImage: data.naver_map_image,
      customImages: data.image_urls || []
    });

    const stmt = db.prepare(`
      INSERT INTO hospitals (
        name, type, address, region, city, phone, homepage,
        specialties, beds, established_date, latitude, longitude,
        ranking_domestic, ranking_global, notes,
        has_emergency_room, open_24_hours, weekend_available,
        image_url, image_urls,
        namuwiki_image, wikipedia_image, homepage_image, naver_map_image,
        created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?,
        ?, ?,
        ?, ?, ?, ?,
        ?, ?
      )
    `);

    const now = new Date().toISOString();
    const specialtiesStr = Array.isArray(data.specialties) ? data.specialties.join(', ') : (data.specialties || '');

    const info = stmt.run(
      data.name,
      data.type,
      data.address,
      data.region,
      data.city,
      data.phone,
      data.homepage || null,
      specialtiesStr,
      data.beds || null,
      data.established_date || null,
      data.latitude || null,
      data.longitude || null,
      data.ranking_domestic || null,
      data.ranking_global || null,
      data.notes || null,
      data.has_emergency_room ? 1 : 0,
      data.open_24_hours ? 1 : 0,
      data.weekend_available ? 1 : 0,
      imageFallback.image_url,
      JSON.stringify(imageFallback.image_urls),
      data.namuwiki_image || null,
      data.wikipedia_image || null,
      data.homepage_image || data.image_url || null,
      data.naver_map_image || null,
      now,
      now
    );

    return this.getById(info.lastInsertRowid);
  }

  // 병원 업데이트
  static update(id, data) {
    const hospitalId = parseInt(id);
    const existing = this.getById(hospitalId);
    if (!existing) return null;

    // 이미지 관련 데이터가 있으면 폴백 체인 재생성
    let imageFallback = {};
    if (data.namuwiki_image || data.wikipedia_image || data.homepage_image ||
        data.naver_map_image || data.image_url || data.image_urls) {

      // 기존 이미지 데이터와 새 데이터 병합
      const existingImages = existing.image_urls || [];
      const newCustomImages = data.image_urls || [];

      imageFallback = generateImageFallback({
        hospitalId: hospitalId,
        namuwikiImage: data.namuwiki_image || existing.namuwiki_image,
        wikipediaImage: data.wikipedia_image || existing.wikipedia_image,
        homepageImage: data.homepage_image || data.image_url || existing.image_url,
        naverMapImage: data.naver_map_image || existing.naver_map_image,
        customImages: [...existingImages, ...newCustomImages]
      });
    }

    const updates = [];
    const params = [];

    // Build dynamic UPDATE query
    if (data.name !== undefined) { updates.push('name = ?'); params.push(data.name); }
    if (data.type !== undefined) { updates.push('type = ?'); params.push(data.type); }
    if (data.address !== undefined) { updates.push('address = ?'); params.push(data.address); }
    if (data.region !== undefined) { updates.push('region = ?'); params.push(data.region); }
    if (data.city !== undefined) { updates.push('city = ?'); params.push(data.city); }
    if (data.phone !== undefined) { updates.push('phone = ?'); params.push(data.phone); }
    if (data.homepage !== undefined) { updates.push('homepage = ?'); params.push(data.homepage); }
    if (data.specialties !== undefined) {
      const specialtiesStr = Array.isArray(data.specialties) ? data.specialties.join(', ') : data.specialties;
      updates.push('specialties = ?');
      params.push(specialtiesStr);
    }
    if (data.beds !== undefined) { updates.push('beds = ?'); params.push(data.beds); }
    if (data.established_date !== undefined) { updates.push('established_date = ?'); params.push(data.established_date); }
    if (data.latitude !== undefined) { updates.push('latitude = ?'); params.push(data.latitude); }
    if (data.longitude !== undefined) { updates.push('longitude = ?'); params.push(data.longitude); }
    if (data.ranking_domestic !== undefined) { updates.push('ranking_domestic = ?'); params.push(data.ranking_domestic); }
    if (data.ranking_global !== undefined) { updates.push('ranking_global = ?'); params.push(data.ranking_global); }
    if (data.notes !== undefined) { updates.push('notes = ?'); params.push(data.notes); }
    if (data.has_emergency_room !== undefined) { updates.push('has_emergency_room = ?'); params.push(data.has_emergency_room ? 1 : 0); }
    if (data.open_24_hours !== undefined) { updates.push('open_24_hours = ?'); params.push(data.open_24_hours ? 1 : 0); }
    if (data.weekend_available !== undefined) { updates.push('weekend_available = ?'); params.push(data.weekend_available ? 1 : 0); }
    if (data.namuwiki_image !== undefined) { updates.push('namuwiki_image = ?'); params.push(data.namuwiki_image); }
    if (data.wikipedia_image !== undefined) { updates.push('wikipedia_image = ?'); params.push(data.wikipedia_image); }
    if (data.homepage_image !== undefined) { updates.push('homepage_image = ?'); params.push(data.homepage_image); }
    if (data.naver_map_image !== undefined) { updates.push('naver_map_image = ?'); params.push(data.naver_map_image); }

    // Apply image fallback if generated
    if (imageFallback.image_url) {
      updates.push('image_url = ?');
      params.push(imageFallback.image_url);
    }
    if (imageFallback.image_urls) {
      updates.push('image_urls = ?');
      params.push(JSON.stringify(imageFallback.image_urls));
    }

    updates.push('updated_at = ?');
    params.push(new Date().toISOString());

    params.push(hospitalId);

    const query = `UPDATE hospitals SET ${updates.join(', ')} WHERE id = ?`;
    const stmt = db.prepare(query);
    stmt.run(...params);

    return this.getById(hospitalId);
  }

  // 병원 삭제
  static delete(id) {
    const hospitalId = parseInt(id);
    const existing = this.getById(hospitalId);
    if (!existing) return false;

    // Delete hospital (careers will be cascade deleted due to FOREIGN KEY)
    const stmt = db.prepare('DELETE FROM hospitals WHERE id = ?');
    stmt.run(hospitalId);
    return true;
  }

  // 통계
  static getStats() {
    const totalStmt = db.prepare('SELECT COUNT(*) as count FROM hospitals');
    const total = totalStmt.get().count;

    const byRegionStmt = db.prepare(`
      SELECT region, COUNT(*) as count
      FROM hospitals
      GROUP BY region
      ORDER BY region
    `);
    const byRegion = byRegionStmt.all();

    const byCityStmt = db.prepare(`
      SELECT region, city, COUNT(*) as count
      FROM hospitals
      GROUP BY region, city
      ORDER BY city COLLATE NOCASE
    `);
    const byCity = byCityStmt.all();

    const byTypeStmt = db.prepare(`
      SELECT type, COUNT(*) as count
      FROM hospitals
      GROUP BY type
      ORDER BY type
    `);
    const byType = byTypeStmt.all();

    return {
      total,
      byRegion,
      byCity,
      byType
    };
  }
}

export default Hospital;
