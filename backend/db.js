const path = require('path');
const Database = require('better-sqlite3');

const db = new Database(path.join(__dirname, 'digibhoomi.db'));
db.pragma('journal_mode = WAL');

db.exec(`
CREATE TABLE IF NOT EXISTS officers (
  id TEXT PRIMARY KEY,
  name TEXT, role TEXT, dept TEXT, state TEXT, district TEXT, email TEXT UNIQUE,
  password_hash TEXT, assignedProject TEXT
);

CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  flagship INTEGER DEFAULT 0,
  name TEXT, type TEXT, state TEXT, district TEXT,
  implementingAgency TEXT, projectStatus TEXT,
  landRequired REAL, landIdentified REAL, landVerified REAL, landAcquired REAL, remaining REAL,
  totalParcels INTEGER, verifiedParcels INTEGER, acquiredParcels INTEGER, pendingParcels INTEGER,
  households INTEGER,
  compensationTotal REAL, compensationApproved REAL, compensationPaid REAL, compensationPending REAL,
  rrTotal INTEGER, rrCompleted INTEGER, rrPending INTEGER, possessionStatus TEXT,
  documentsVerified INTEGER, documentsCollected INTEGER,
  legalDisputes INTEGER, rrProgress INTEGER, pendingApprovals INTEGER,
  villages INTEGER, parcels INTEGER,
  currentStage INTEGER, progress INTEGER,
  aiRisk INTEGER, expectedDelay INTEGER, confidence INTEGER, simulatedRisk INTEGER,
  riskLevel TEXT, owner TEXT, assignee TEXT, approver TEXT, department TEXT,
  startedAt TEXT, plannedCompletion TEXT, budget INTEGER,
  centerLat REAL, centerLng REAL,
  stageHistory TEXT
);

CREATE TABLE IF NOT EXISTS parcels (
  id TEXT PRIMARY KEY,
  projectId TEXT DEFAULT 'AIR-001',
  village TEXT, villageId TEXT,
  lat REAL, lng REAL, area REAL,
  status TEXT, risk TEXT, householdId TEXT, legalDispute INTEGER
);

CREATE TABLE IF NOT EXISTS households (
  id TEXT PRIMARY KEY,
  parcelId TEXT, projectId TEXT, village TEXT, owner TEXT, landArea REAL,
  documents TEXT,
  verification TEXT,
  compensationTotal INTEGER, compensationApproved INTEGER, compensationPaid INTEGER,
  compensationStatus TEXT, legalStatus TEXT, aiRisk TEXT, phone TEXT
);

CREATE TABLE IF NOT EXISTS villages (
  id TEXT PRIMARY KEY, projectId TEXT, name TEXT,
  lat REAL, lng REAL, parcels INTEGER, households INTEGER
);

CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY, projectId TEXT, title TEXT, officer TEXT, role TEXT,
  progress INTEGER, due TEXT, priority TEXT, status TEXT, risk TEXT,
  approver TEXT, description TEXT, evidence TEXT DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS audit (
  id TEXT PRIMARY KEY, ts TEXT, actor TEXT, action TEXT, target TEXT, detail TEXT
);

CREATE TABLE IF NOT EXISTS recommendations (
  id TEXT PRIMARY KEY, projectId TEXT, title TEXT, detail TEXT,
  impactDays INTEGER, priority TEXT, action TEXT, ownerRole TEXT
);

CREATE TABLE IF NOT EXISTS meta (
  key TEXT PRIMARY KEY, value TEXT
);

CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  userId TEXT,
  role TEXT,
  projectId TEXT,
  title TEXT,
  message TEXT,
  type TEXT,
  createdAt TEXT,
  read INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS grievances (
  id TEXT PRIMARY KEY,
  ownerId TEXT,
  ownerName TEXT,
  projectId TEXT,
  parcelId TEXT,
  category TEXT,
  description TEXT,
  status TEXT,
  createdAt TEXT,
  response TEXT,
  respondedAt TEXT
);

CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  ownerId TEXT,
  projectId TEXT,
  parcelId TEXT,
  type TEXT,
  status TEXT,
  uploadedAt TEXT,
  verifiedAt TEXT,
  description TEXT
);

CREATE TABLE IF NOT EXISTS rr_records (
  id TEXT PRIMARY KEY,
  householdId TEXT,
  ownerId TEXT,
  ownerName TEXT,
  projectId TEXT,
  entitlement TEXT,
  assistanceType TEXT,
  amount REAL,
  status TEXT,
  rehabilitationStatus TEXT,
  resettlementStatus TEXT,
  createdAt TEXT,
  updatedAt TEXT
);

CREATE TABLE IF NOT EXISTS compensation_records (
  id TEXT PRIMARY KEY,
  projectId TEXT,
  parcelId TEXT,
  ownerId TEXT,
  ownerName TEXT,
  householdId TEXT,
  assessedAmount REAL,
  approvedAmount REAL,
  paidAmount REAL,
  pendingAmount REAL,
  status TEXT,
  approvalDate TEXT,
  paymentDate TEXT,
  remarks TEXT
);

CREATE TABLE IF NOT EXISTS landowner_data (
  id TEXT PRIMARY KEY,
  ownerId TEXT UNIQUE,
  parcelId TEXT,
  householdId TEXT,
  projectId TEXT,
  ownerName TEXT,
  surveyNumber TEXT,
  village TEXT,
  district TEXT,
  state TEXT,
  landArea REAL,
  landUnit TEXT,
  acquisitionStage TEXT,
  stageIndex INTEGER,
  compensationAssessed REAL,
  compensationApproved REAL,
  compensationPaid REAL,
  compensationPending REAL,
  compensationStatus TEXT,
  rrStatus TEXT,
  rrEntitlement TEXT,
  rrExpectedDate TEXT,
  possessionStatus TEXT,
  nextAction TEXT
);
`);

// Safe migrations for databases created with earlier schema
const migrations = [
  `ALTER TABLE officers ADD COLUMN district TEXT DEFAULT '—'`,
  `ALTER TABLE officers ADD COLUMN assignedProject TEXT DEFAULT NULL`,
  `ALTER TABLE projects ADD COLUMN implementingAgency TEXT DEFAULT 'NHAI'`,
  `ALTER TABLE projects ADD COLUMN projectStatus TEXT DEFAULT 'In Progress'`,
  `ALTER TABLE projects ADD COLUMN landIdentified REAL DEFAULT 0`,
  `ALTER TABLE projects ADD COLUMN landVerified REAL DEFAULT 0`,
  `ALTER TABLE projects ADD COLUMN remaining REAL DEFAULT 0`,
  `ALTER TABLE projects ADD COLUMN totalParcels INTEGER DEFAULT 0`,
  `ALTER TABLE projects ADD COLUMN verifiedParcels INTEGER DEFAULT 0`,
  `ALTER TABLE projects ADD COLUMN acquiredParcels INTEGER DEFAULT 0`,
  `ALTER TABLE projects ADD COLUMN pendingParcels INTEGER DEFAULT 0`,
  `ALTER TABLE projects ADD COLUMN compensationTotal REAL DEFAULT 0`,
  `ALTER TABLE projects ADD COLUMN compensationPending REAL DEFAULT 0`,
  `ALTER TABLE projects ADD COLUMN rrTotal INTEGER DEFAULT 0`,
  `ALTER TABLE projects ADD COLUMN rrCompleted INTEGER DEFAULT 0`,
  `ALTER TABLE projects ADD COLUMN rrPending INTEGER DEFAULT 0`,
  `ALTER TABLE projects ADD COLUMN possessionStatus TEXT DEFAULT 'Partial'`,
];

for (const sql of migrations) {
  try { db.exec(sql); } catch (e) { /* column already exists */ }
}

module.exports = db;

