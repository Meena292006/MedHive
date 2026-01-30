const db = require("../config/db");

exports.createVersion = (data) => {
  const stmt = db.prepare(`
    INSERT INTO prescription_versions
    (prescription_id, version_number, data, created_at, created_by)
    VALUES (?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    data.prescriptionId,
    data.versionNumber,
    JSON.stringify(data.data),
    new Date().toISOString(),
    data.createdBy
  );
  return result.lastInsertRowid;
};

exports.getVersionsByPrescriptionId = (prescriptionId) => {
  const versions = db.prepare(`
    SELECT * FROM prescription_versions WHERE prescription_id=? ORDER BY version_number DESC
  `).all(prescriptionId);
  return versions.map(v => ({
    ...v,
    data: JSON.parse(v.data)
  }));
};

exports.getVersionById = (id) => {
  const version = db.prepare(`
    SELECT * FROM prescription_versions WHERE id=?
  `).get(id);
  if (version) {
    version.data = JSON.parse(version.data);
  }
  return version;
};
