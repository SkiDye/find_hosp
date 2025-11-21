# SQLite Migration Summary

## Overview
Successfully migrated all backend model files from in-memory arrays to SQLite database queries using better-sqlite3.

## Migration Date
2025-11-19

## Files Migrated

### 1. Hospital.js (`C:\Claude\hospital-doctor-system\backend\src\models\Hospital.js`)

**Methods Migrated:**
- `getAll(filters)` - Query hospitals with optional filters (region, city, type, specialty, search, emergency room, 24-hour, weekend)
- `getById(id)` - Get single hospital by ID
- `getDoctors(hospitalId)` - Get all doctors working at a hospital (with JOIN)
- `create(data)` - Create new hospital record
- `update(id, data)` - Update hospital with dynamic SQL
- `delete(id)` - Delete hospital (CASCADE deletes related records)
- `getStats()` - Get statistics (total, by region, by city, by type)

**Key Changes:**
- Boolean fields (`has_emergency_room`, `open_24_hours`, `weekend_available`) converted to INTEGER (0/1) in DB, parsed to boolean in JS
- `image_urls` stored as JSON TEXT, parsed to array when reading
- `specialties` stored as comma-separated TEXT, split to array when reading
- All queries use prepared statements with `db.prepare()`
- Helper method `_rowToHospital(row)` handles data type conversions

### 2. Doctor.js (`C:\Claude\hospital-doctor-system\backend\src\models\Doctor.js`)

**Methods Migrated:**
- `getAll(filters)` - Query doctors with filters (specialty, search)
- `getById(id)` - Get doctor with career history (JOIN with careers and hospitals tables)
- `create(data)` - Create new doctor record
- `update(id, data)` - Update doctor with dynamic SQL
- `delete(id)` - Delete doctor (CASCADE deletes related records)
- `addCareer(doctorId, career)` - Add career/job history record
- `updateCareer(careerId, career)` - Update career record
- `getStats()` - Get statistics (total, by specialty)
- `getCurrentHospital(doctorId)` - Get current workplace with hospital details

**Key Changes:**
- Removed `education` and `certifications` arrays (tables don't exist in schema)
- Career records include `is_current` boolean (stored as INTEGER)
- Career queries JOIN with hospitals table to get hospital info
- All queries use prepared statements

### 3. Career.js (`C:\Claude\hospital-doctor-system\backend\src\models\Career.js`) - NEW FILE

**Methods Created:**
- `getAll(filters)` - Query careers with filters (doctor_id, hospital_id, is_current)
- `getById(id)` - Get single career record
- `getByIdWithDetails(id)` - Get career with doctor and hospital info (JOIN)
- `getByDoctorId(doctorId)` - Get all careers for a doctor
- `getByHospitalId(hospitalId)` - Get all careers for a hospital
- `create(data)` - Create new career record
- `update(id, data)` - Update career with dynamic SQL
- `delete(id)` - Delete career record
- `getCurrentByDoctorId(doctorId)` - Get doctor's current job
- `getCurrentByHospitalId(hospitalId)` - Get all current employees at hospital
- `setNotCurrentForDoctor(doctorId)` - Mark all doctor's careers as not current
- `getStats()` - Get statistics (total, current count, by position, by department)

**Key Changes:**
- New model created to manage career/job history
- Boolean `is_current` stored as INTEGER (0/1)
- Helper method `_rowToCareer(row)` handles data type conversion
- Multiple JOIN queries for detailed information

### 4. Admin.js (`C:\Claude\hospital-doctor-system\backend\src\models\Admin.js`) - NEW FILE

**Methods Created:**
- `getAll(filters)` - Query admins with filters (hospital_id, search)
- `getById(id)` - Get single admin record
- `getByIdWithHospital(id)` - Get admin with hospital info (JOIN)
- `getByHospitalId(hospitalId)` - Get admin for a specific hospital
- `getByAdminCode(adminCode)` - Get admin by their admin code
- `getByAdminCodeWithHospital(adminCode)` - Get admin with hospital info by code
- `create(data)` - Create new admin (validates uniqueness)
- `update(id, data)` - Update admin with validation
- `delete(id)` - Delete admin record
- `deleteByAdminCode(adminCode)` - Delete by admin code
- `deleteByHospitalId(hospitalId)` - Delete by hospital ID
- `validateAdminCode(adminCode, hospitalId)` - Verify admin code matches hospital
- `getStats()` - Get statistics (total, with email, with phone, by region)

**Key Changes:**
- New model created for hospital administrators
- Enforces one admin per hospital (UNIQUE constraint)
- Admin code format: `ADMIN{hospital_id}2024`
- Multiple query methods for flexibility

## Database Schema Integration

All models now work with the SQLite schema defined in `C:\Claude\hospital-doctor-system\backend\src\database\schema.sql`:

**Tables:**
- `hospitals` - Hospital information with metadata
- `doctors` - Doctor credentials and basic info
- `careers` - Job history linking doctors to hospitals
- `admins` - Hospital administrator accounts

**Foreign Keys:**
- `careers.doctor_id` → `doctors.id` (CASCADE DELETE)
- `careers.hospital_id` → `hospitals.id` (CASCADE DELETE)
- `admins.hospital_id` → `hospitals.id` (CASCADE DELETE, UNIQUE)

## Data Type Conversions

### Boolean Fields
**Storage:** INTEGER (0 = false, 1 = true)
**Reading:** `row.field_name === 1`
**Writing:** `data.field_name ? 1 : 0`

**Examples:**
- `has_emergency_room`
- `open_24_hours`
- `weekend_available`
- `is_current`

### Array Fields
**Storage:** JSON TEXT
**Reading:** `JSON.parse(row.field_name || '[]')`
**Writing:** `JSON.stringify(data.field_name || [])`

**Examples:**
- `image_urls` - Array of image URLs

### Comma-Separated Text
**Storage:** TEXT with values joined by ", "
**Reading:** `row.field_name ? row.field_name.split(',').map(s => s.trim()) : []`
**Writing:** `Array.isArray(data.field_name) ? data.field_name.join(', ') : data.field_name`

**Examples:**
- `specialties` - Medical specialties

## SQL Query Patterns

### SELECT with Filters
```javascript
let query = 'SELECT * FROM table WHERE 1=1';
const params = [];

if (filters.field) {
  query += ' AND field = ?';
  params.push(filters.field);
}

const stmt = db.prepare(query);
return stmt.all(...params);
```

### INSERT
```javascript
const stmt = db.prepare('INSERT INTO table (col1, col2) VALUES (?, ?)');
const info = stmt.run(value1, value2);
return this.getById(info.lastInsertRowid);
```

### UPDATE (Dynamic)
```javascript
const updates = [];
const params = [];

if (data.field1 !== undefined) {
  updates.push('field1 = ?');
  params.push(data.field1);
}

updates.push('updated_at = ?');
params.push(new Date().toISOString());
params.push(id);

const query = `UPDATE table SET ${updates.join(', ')} WHERE id = ?`;
const stmt = db.prepare(query);
stmt.run(...params);
```

### DELETE
```javascript
const stmt = db.prepare('DELETE FROM table WHERE id = ?');
stmt.run(id);
```

### JOIN
```javascript
const stmt = db.prepare(`
  SELECT a.*, b.field as b_field
  FROM table_a a
  INNER JOIN table_b b ON a.b_id = b.id
  WHERE a.id = ?
`);
return stmt.get(id);
```

## Updated Scripts

### addSeoulGyeonggiHospitals.js
Updated to use Hospital and Admin models instead of in-memory arrays:
- Creates hospitals using `Hospital.create()`
- Creates admin accounts using `Admin.create()`
- Uses `Hospital.getStats()` for statistics
- All 63 hospitals successfully loaded

## Testing

Created comprehensive test script at `C:\Claude\hospital-doctor-system\backend\test-models.js`

**Test Results:**
```
✓ Hospital.getAll(): Found 63 hospitals
✓ Hospital.getById(): Retrieved hospital with all fields
✓ Boolean conversion: has_emergency_room = true (boolean)
✓ Array parsing: image_urls is array
✓ Specialties parsing: array
✓ Hospital.getStats(): Total 63 hospitals
✓ Doctor.getAll(): Working
✓ Doctor.getById(): Retrieved with career history
✓ Boolean conversion in career: is_current = boolean
✓ Career.getAll(): Working
✓ Career.getByIdWithDetails(): Retrieved with hospital info
✓ Admin.getAll(): Working
✓ Admin.getByIdWithHospital(): Retrieved with hospital info
✓ Hospital.create(): Created with ID
✓ Hospital.update(): Updated successfully
✓ Hospital.delete(): Success
```

## Important Considerations

### 1. Prepared Statements
All SQL queries use `db.prepare()` for:
- Performance (statements are cached)
- Security (prevents SQL injection)
- Type safety

### 2. Data Integrity
- Foreign key constraints ensure referential integrity
- CASCADE DELETE automatically removes related records
- UNIQUE constraints prevent duplicates (e.g., one admin per hospital)

### 3. Error Handling
Models return `null` for not found instead of throwing errors
- Makes it easier to handle missing data
- Consistent pattern across all models

### 4. Type Conversion
Always remember:
- Booleans are stored as INTEGER (0/1)
- Arrays are stored as JSON TEXT
- Dates are stored as ISO 8601 TEXT
- Numbers are stored as INTEGER or REAL

### 5. Performance
- Indexes created on commonly queried fields:
  - `hospitals(region, city, type, has_emergency_room, open_24_hours, weekend_available)`
  - `doctors(email, license_number)`
  - `careers(doctor_id, hospital_id, is_current)`
  - `admins(hospital_id, admin_code)`

## Verification

To verify the migration:
```bash
cd C:\Claude\hospital-doctor-system\backend
node test-models.js
```

To start the server:
```bash
npm start
# or
npm run dev  # for development with auto-reload
```

## Conclusion

All CRUD operations successfully migrated from in-memory arrays to SQLite database queries. The system now:
- Persists data across server restarts
- Supports concurrent access through SQLite
- Maintains data integrity with foreign keys
- Provides efficient querying with indexes
- Handles complex queries with JOINs
- Properly converts data types between SQLite and JavaScript

**Migration Status: COMPLETE ✅**
