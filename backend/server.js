require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const db = require('./db');
const seed = require('./seed');
const { requireAuth, sign } = require('./middleware/auth');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

// ---------------- File uploads ----------------
const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const safeExt = path.extname(file.originalname).slice(0, 10);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExt}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15 MB
  fileFilter: (req, file, cb) => {
    const allowed = /pdf|jpe?g|png|webp|heic|doc|docx/i;
    if (allowed.test(path.extname(file.originalname))) cb(null, true);
    else cb(new Error('Unsupported file type. Allowed: PDF, JPG, PNG, WEBP, DOC, DOCX.'));
  },
});

// Auto-seed database if empty (ensures deployed instances have demo accounts & data out of the box)
try {
  const row = db.prepare('SELECT COUNT(*) c FROM officers').get();
  if (!row || row.c === 0) {
    console.log('Database empty — running auto-seed...');
    seed();
  }
} catch (e) {
  console.warn('Auto-seed check failed, running seed:', e.message);
  try { seed(); } catch (se) { console.error('Seed error:', se); }
}

function auditLog(actor, action, target, detail) {
  const row = db.prepare(`SELECT COUNT(*) c FROM audit`).get();
  const id = 'A-' + (9021 + row.c + 1);
  const ts = new Date().toISOString().slice(0, 16).replace('T', ' ');
  db.prepare(`INSERT INTO audit (id,ts,actor,action,target,detail) VALUES (?,?,?,?,?,?)`)
    .run(id, ts, actor, action, target, detail);
  return { id, ts, actor, action, target, detail };
}

/* ---------------- SEED ENDPOINT ---------------- */
app.all('/api/seed', (req, res) => {
  try {
    seed();
    res.json({ ok: true, message: 'Database seeded successfully with demo accounts and data' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------- AUTH ---------------- */
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  let officer = db.prepare(`SELECT * FROM officers WHERE email = ?`).get((email || '').toLowerCase());
  if (!officer) {
    const row = db.prepare('SELECT COUNT(*) c FROM officers').get();
    if (!row || row.c === 0) {
      console.log('Officers table empty on login attempt — running auto-seed...');
      try {
        seed();
        officer = db.prepare(`SELECT * FROM officers WHERE email = ?`).get((email || '').toLowerCase());
      } catch (err) {
        console.error('On-demand seed failed:', err);
      }
    }
  }
  if (!officer) return res.status(401).json({ error: 'No account with that email' });
  if (!bcrypt.compareSync(password || '', officer.password_hash)) {
    return res.status(401).json({ error: 'Incorrect password' });
  }
  const user = {
    id: officer.id,
    name: officer.name,
    role: officer.role,
    dept: officer.dept,
    state: officer.state,
    district: officer.district || '—',
    assignedProject: officer.assignedProject || null,
    email: officer.email,
  };
  const token = sign(user);
  auditLog(user.name, 'Login', officer.id, `${officer.role} signed in`);
  res.json({ token, user });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role, state, district, dept } = req.body || {};
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'Name, email, password and role are required' });
  }
  if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });
  const emailLower = email.toLowerCase();
  const existing = db.prepare('SELECT id FROM officers WHERE email = ?').get(emailLower);
  if (existing) return res.status(409).json({ error: 'An account with this email already exists' });

  const row = db.prepare('SELECT COUNT(*) c FROM officers').get();
  const id = 'OFF-' + String(row.c + 1).padStart(3, '0');
  const password_hash = bcrypt.hashSync(password, 10);
  db.prepare(`INSERT INTO officers (id,name,role,dept,state,district,email,password_hash) VALUES (?,?,?,?,?,?,?,?)`)
    .run(id, name, role, dept || '', state || '—', district || '—', emailLower, password_hash);

  const user = { id, name, role, dept: dept || '', state: state || '—', district: district || '—', assignedProject: null, email: emailLower };
  const token = sign(user);
  auditLog(name, 'Account registered', id, `${role}${state ? ' · ' + state : ''}`);
  res.status(201).json({ token, user });
});

app.get('/api/auth/me', requireAuth, (req, res) => {
  const officer = db.prepare('SELECT id,name,role,dept,state,district,assignedProject,email FROM officers WHERE id = ?').get(req.user.id);
  res.json({ user: officer || req.user });
});

app.get('/api/officers', requireAuth, (req, res) => {
  res.json(db.prepare(`SELECT id,name,role,dept,state,district,assignedProject,email FROM officers`).all());
});

/* ---------------- BOOTSTRAP (complete dataset with strict RBAC) ---------------- */
app.get('/api/bootstrap', requireAuth, (req, res) => {
  const user = req.user || {};
  const isMinistry = !user.state || user.state === '—' || user.role === 'Ministry Administrator' || user.role?.includes('Ministry');
  const isLandowner = user.role === 'Landowner';
  const isProjectManager = user.role === 'Project Manager';
  const isFieldOfficer = user.role === 'Field Officer';
  const isDistrictAdmin = user.role === 'District Administrator';

  let projects = db.prepare(`SELECT * FROM projects`).all().map(rowToProject);
  let tasks = db.prepare(`SELECT * FROM tasks`).all().map((t) => ({ ...t, evidence: JSON.parse(t.evidence || '[]') }));
  let recommendations = db.prepare(`SELECT * FROM recommendations`).all();
  let parcels = db.prepare(`SELECT * FROM parcels`).all().map((p) => ({ ...p, legalDispute: !!p.legalDispute }));
  let households = db.prepare(`SELECT * FROM households`).all().map(rowToHousehold);
  let villages = db.prepare(`SELECT * FROM villages`).all().map((v) => ({ id: v.id, name: v.name, center: [v.lat, v.lng], parcels: v.parcels, households: v.households }));
  const audit = db.prepare(`SELECT * FROM audit ORDER BY id DESC`).all();
  const officers = db.prepare(`SELECT id,name,role,dept,state,district,assignedProject,email FROM officers`).all();
  const meta = JSON.parse(db.prepare(`SELECT value FROM meta WHERE key='analytics'`).get().value);

  let landownerData = null;
  if (isLandowner) {
    landownerData = db.prepare('SELECT * FROM landowner_data WHERE ownerId = ?').get(user.id) ||
      db.prepare('SELECT * FROM landowner_data LIMIT 1').get();
  }

  // 1. Filter Projects by Role Scope
  if (isLandowner) {
    const loProjId = landownerData ? landownerData.projectId : 'DL-001';
    projects = projects.filter((p) => p.id === loProjId);
  } else if (!isMinistry) {
    // State, District, Project Manager, Field Officer
    projects = projects.filter((p) => p.state === user.state);
  }

  const projIds = new Set(projects.map((p) => p.id));

  // 2. Filter Parcels & Households & Villages
  if (isLandowner && landownerData) {
    parcels = parcels.filter((p) => p.id === landownerData.parcelId);
    households = households.filter((h) => h.id === landownerData.householdId);
    villages = villages.filter((v) => v.name === landownerData.village);
  } else {
    parcels = parcels.filter((p) => projIds.has(p.projectId));
    households = households.filter((h) => projIds.has(h.projectId));
    villages = villages.filter((v) => projIds.has(v.projectId));
  }

  // 3. Filter Tasks
  if (isLandowner) {
    tasks = [];
  } else if (isFieldOfficer) {
    tasks = tasks.filter((t) => t.officer === user.name || projIds.has(t.projectId));
  } else if (!isMinistry) {
    tasks = tasks.filter((t) => projIds.has(t.projectId) || (t.officer && t.officer === user.name));
  }

  // 4. Filter Recommendations
  recommendations = recommendations.filter((r) => projIds.has(r.projectId));

  // 5. Notifications (scoped)
  let notifications = [];
  try {
    if (isLandowner) {
      notifications = db.prepare(`SELECT * FROM notifications WHERE userId = ? OR role = 'Landowner' ORDER BY createdAt DESC`).all(user.id);
    } else {
      notifications = db.prepare(`SELECT * FROM notifications WHERE userId = ? OR role = ? OR role = 'All' ORDER BY createdAt DESC`).all(user.id, user.role);
    }
  } catch (e) { notifications = []; }

  // 6. Grievances (scoped)
  let grievances = [];
  try {
    if (isLandowner) {
      grievances = db.prepare(`SELECT * FROM grievances WHERE ownerId = ? ORDER BY createdAt DESC`).all(user.id);
    } else if (!isMinistry) {
      grievances = db.prepare(`SELECT * FROM grievances WHERE projectId IN (${Array.from(projIds).map(()=>'?').join(',') || "''"}) ORDER BY createdAt DESC`).all(...projIds);
    } else {
      grievances = db.prepare(`SELECT * FROM grievances ORDER BY createdAt DESC`).all();
    }
  } catch (e) { grievances = []; }

  // 7. Documents (scoped)
  let documents = [];
  try {
    if (isLandowner) {
      documents = db.prepare(`SELECT * FROM documents WHERE ownerId = ? ORDER BY uploadedAt DESC`).all(user.id);
    } else {
      documents = db.prepare(`SELECT * FROM documents ORDER BY uploadedAt DESC`).all();
    }
  } catch (e) { documents = []; }

  // 8. R&R Records
  let rrRecords = [];
  try {
    if (isLandowner) {
      rrRecords = db.prepare(`SELECT * FROM rr_records WHERE ownerId = ?`).all(user.id);
    } else if (!isMinistry) {
      rrRecords = db.prepare(`SELECT * FROM rr_records WHERE projectId IN (${Array.from(projIds).map(()=>'?').join(',') || "''"})`).all(...projIds);
    } else {
      rrRecords = db.prepare(`SELECT * FROM rr_records`).all();
    }
  } catch (e) { rrRecords = []; }

  // 9. Compensation Records
  let compRecords = [];
  try {
    if (isLandowner) {
      compRecords = db.prepare(`SELECT * FROM compensation_records WHERE ownerId = ?`).all(user.id);
    } else if (!isMinistry) {
      compRecords = db.prepare(`SELECT * FROM compensation_records WHERE projectId IN (${Array.from(projIds).map(()=>'?').join(',') || "''"})`).all(...projIds);
    } else {
      compRecords = db.prepare(`SELECT * FROM compensation_records`).all();
    }
  } catch (e) { compRecords = []; }

  // Dynamic compensation summary reflecting the user's filtered scope
  let compSummary = meta.COMP_SUMMARY;
  if (!isMinistry) {
    if (households.length > 0) {
      const totalCases = households.length;
      const approvedCases = households.filter((h) => h.compensationApproved > 0).length;
      const paidCases = households.filter((h) => h.compensationPaid > 0).length;
      const totalAmount = households.reduce((a, h) => a + (h.compensationTotal || 0), 0);
      compSummary = {
        total: totalCases, approved: approvedCases, paid: paidCases,
        pending: Math.max(0, totalCases - paidCases), totalAmount,
      };
    } else {
      const totalCases = projects.reduce((a, p) => a + (p.households || 0), 0);
      const approvedCases = projects.reduce((a, p) => a + (p.compensationApproved || 0), 0);
      const paidCases = projects.reduce((a, p) => a + (p.compensationPaid || 0), 0);
      const totalAmount = projects.reduce((a, p) => a + (p.compensationTotal || 0), 0);
      compSummary = {
        total: totalCases, approved: approvedCases, paid: paidCases,
        pending: Math.max(0, totalCases - paidCases), totalAmount,
      };
    }
  }

  res.json({
    STATES: meta.STATES,
    PROJECT_TYPES: meta.PROJECT_TYPES,
    OFFICERS: officers,
    PROJECTS: projects,
    PARCELS: parcels,
    HOUSEHOLDS: households,
    AIR001_VILLAGES: villages,
    VILLAGES: villages,
    TASKS: tasks,
    AUDIT: audit,
    RECOMMENDATIONS: recommendations,
    DELAY_DRIVERS: meta.DELAY_DRIVERS,
    RISK_TREND: meta.RISK_TREND,
    COMPENSATION_TREND: meta.COMPENSATION_TREND,
    STAGE_PERFORMANCE: meta.STAGE_PERFORMANCE,
    STATE_RISK: meta.STATE_RISK,
    COMP_SUMMARY: compSummary,
    NOTIFICATIONS: notifications,
    GRIEVANCES: grievances,
    DOCUMENTS: documents,
    RR_RECORDS: rrRecords,
    COMP_RECORDS: compRecords,
    LANDOWNER_DATA: landownerData,
  });
});

function rowToProject(p) {
  return {
    ...p,
    flagship: !!p.flagship,
    center: [p.centerLat, p.centerLng],
    stageHistory: p.stageHistory ? JSON.parse(p.stageHistory) : null,
  };
}
function rowToHousehold(h) {
  return {
    ...h,
    documents: JSON.parse(h.documents || '[]'),
    compensation: { total: h.compensationTotal, approved: h.compensationApproved, paid: h.compensationPaid, status: h.compensationStatus },
  };
}

/* ---------------- PROJECTS ---------------- */
app.get('/api/projects', requireAuth, (req, res) => {
  let sql = 'SELECT * FROM projects WHERE 1=1';
  const params = [];
  const user = req.user || {};
  const isNational = !user.state || user.state === '—' || user.role === 'Ministry Administrator' || user.role?.includes('Ministry');

  if (!isNational) {
    sql += ' AND state = ?';
    params.push(user.state);
  } else if (req.query.state) {
    sql += ' AND state = ?';
    params.push(req.query.state);
  }
  if (req.query.type) { sql += ' AND type = ?'; params.push(req.query.type); }
  if (req.query.risk) { sql += ' AND riskLevel = ?'; params.push(req.query.risk); }
  if (req.query.q) { sql += ' AND (LOWER(name) LIKE ? OR LOWER(id) LIKE ?)'; const q = `%${req.query.q.toLowerCase()}%`; params.push(q, q); }
  const rows = db.prepare(sql).all(...params);
  res.json(rows.map(rowToProject));
});

app.get('/api/projects/:id', requireAuth, (req, res) => {
  const p = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
  if (!p) return res.status(404).json({ error: 'Project not found' });
  res.json(rowToProject(p));
});

app.post('/api/projects', requireAuth, (req, res) => {
  const payload = req.body;
  // Accept a client-generated id (so optimistic-UI frontends stay in sync with the DB record)
  const id = payload.id || ((payload.type || 'PRJ').slice(0, 3).toUpperCase() + '-' + Math.floor(1000 + Math.random() * 8999));
  const proj = {
    id, flagship: 0, name: payload.name, type: payload.type, state: payload.state, district: payload.district || '',
    landRequired: payload.landRequired || 0, landAcquired: 0, households: payload.households || 0,
    documentsVerified: 0, documentsCollected: 0, compensationApproved: 0, compensationPaid: 0,
    legalDisputes: 0, rrProgress: 0, pendingApprovals: 0,
    villages: payload.villages || 0, parcels: payload.parcels || 0,
    currentStage: 1, progress: 5, aiRisk: 35, expectedDelay: 20, confidence: 78, simulatedRisk: null,
    riskLevel: 'medium', owner: req.user.name, assignee: payload.assignee || req.user.name, approver: payload.approver || req.user.name,
    department: payload.department || '', startedAt: new Date().toISOString().slice(0, 10),
    plannedCompletion: payload.plannedCompletion || '', budget: payload.budget || 0,
    centerLat: 22, centerLng: 78, stageHistory: null,
  };
  db.prepare(`INSERT INTO projects (id,flagship,name,type,state,district,landRequired,landAcquired,households,documentsVerified,documentsCollected,compensationApproved,compensationPaid,legalDisputes,rrProgress,pendingApprovals,villages,parcels,currentStage,progress,aiRisk,expectedDelay,confidence,simulatedRisk,riskLevel,owner,assignee,approver,department,startedAt,plannedCompletion,budget,centerLat,centerLng,stageHistory)
    VALUES (@id,@flagship,@name,@type,@state,@district,@landRequired,@landAcquired,@households,@documentsVerified,@documentsCollected,@compensationApproved,@compensationPaid,@legalDisputes,@rrProgress,@pendingApprovals,@villages,@parcels,@currentStage,@progress,@aiRisk,@expectedDelay,@confidence,@simulatedRisk,@riskLevel,@owner,@assignee,@approver,@department,@startedAt,@plannedCompletion,@budget,@centerLat,@centerLng,@stageHistory)`).run(proj);
  auditLog(req.user.name, 'Project created', id, `${proj.name} · ${proj.state}`);
  res.status(201).json(rowToProject(proj));
});

app.post('/api/projects/:id/approve-stage', requireAuth, (req, res) => {
  const { stage } = req.body;
  const p = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
  if (!p) return res.status(404).json({ error: 'Project not found' });
  let history = p.stageHistory ? JSON.parse(p.stageHistory) : null;
  if (history) {
    const s = history.find((x) => x.stage === stage);
    if (s) { s.status = 'approved'; s.completedAt = new Date().toISOString().slice(0, 10); s.approver = req.user.name; }
    const next = history.find((x) => x.stage === stage + 1);
    if (next) { next.status = 'in_progress'; next.progress = 5; }
  }
  const currentStage = Math.min(7, stage + 1);
  const progress = Math.min(100, p.progress + 12);
  let aiRisk = Math.max(30, p.aiRisk - 14);
  let riskLevel = aiRisk >= 80 ? 'critical' : aiRisk >= 65 ? 'high' : aiRisk >= 45 ? 'medium' : 'low';
  db.prepare(`UPDATE projects SET currentStage=?, progress=?, aiRisk=?, riskLevel=?, stageHistory=? WHERE id=?`)
    .run(currentStage, progress, aiRisk, riskLevel, history ? JSON.stringify(history) : null, p.id);
  auditLog(req.user.name, 'Stage approved', `${p.id} · Stage ${stage}`, `Stage ${stage + 1} unlocked · Risk ↓ to ${aiRisk}%`);
  res.json(rowToProject(db.prepare('SELECT * FROM projects WHERE id = ?').get(p.id)));
});

app.post('/api/projects/:id/reject-stage', requireAuth, (req, res) => {
  const { stage, reason } = req.body;
  auditLog(req.user.name, 'Stage rejected', `${req.params.id} · Stage ${stage}`, reason || 'Rejected pending revisions');
  res.json({ ok: true });
});

app.post('/api/projects/:id/submit-stage', requireAuth, (req, res) => {
  const { stage } = req.body;
  auditLog(req.user.name, 'Stage submitted', `${req.params.id} · Stage ${stage}`, 'Awaiting approver review');
  res.json({ ok: true });
});

/* ---------------- PREDICTIONS (mock ML service, swap for a real model later) ---------------- */
app.get('/api/predictions/:projectId', requireAuth, (req, res) => {
  const p = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.projectId);
  if (!p) return res.status(404).json({ error: 'Project not found' });
  const meta = JSON.parse(db.prepare(`SELECT value FROM meta WHERE key='analytics'`).get().value);
  res.json({
    delay_probability: p.aiRisk, simulated_probability: p.simulatedRisk,
    expected_delay_days: p.expectedDelay, risk_level: p.riskLevel, confidence: p.confidence,
    model: 'XGBoost v2.4 · gradient boosted trees', updated: '2026-09-05 09:12',
    drivers: meta.DELAY_DRIVERS,
  });
});

app.get('/api/recommendations/:projectId', requireAuth, (req, res) => {
  res.json(db.prepare('SELECT * FROM recommendations WHERE projectId = ?').all(req.params.projectId));
});

app.post('/api/predictions/:projectId/simulate', requireAuth, (req, res) => {
  const p = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.projectId);
  if (!p) return res.status(404).json({ error: 'Project not found' });
  const inputs = req.body || {};
  const base = p.aiRisk;
  let reduction = 0;
  reduction += (inputs.verificationStaff || 0) * 1.5;
  reduction += (inputs.legalTeams || 0) * 4.0;
  reduction += (inputs.compensationBoost || 0) * 0.9;
  reduction += (inputs.fieldTeams || 0) * 1.1;
  const simulated = Math.max(20, Math.round(base - reduction));
  const delayReduction = Math.round((base - simulated) * 2.7);
  db.prepare('UPDATE projects SET simulatedRisk=? WHERE id=?').run(simulated, p.id);
  auditLog(req.user.name, 'Simulation run', p.id, `Base ${base}% → Sim ${simulated}% · Δ delay -${delayReduction}d`);
  res.json({ base_risk: base, simulated_risk: simulated, risk_reduction: base - simulated, delay_reduction_days: delayReduction, confidence: 84 });
});

app.post('/api/predictions/:projectId/apply', requireAuth, (req, res) => {
  const p = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.projectId);
  if (!p || p.simulatedRisk == null) return res.status(400).json({ error: 'No simulation to apply' });
  const aiRisk = p.simulatedRisk;
  const expectedDelay = Math.max(20, p.expectedDelay - 60);
  const riskLevel = aiRisk >= 80 ? 'critical' : aiRisk >= 65 ? 'high' : aiRisk >= 45 ? 'medium' : 'low';
  db.prepare('UPDATE projects SET aiRisk=?, expectedDelay=?, riskLevel=?, simulatedRisk=NULL WHERE id=?').run(aiRisk, expectedDelay, riskLevel, p.id);
  auditLog(req.user.name, 'Risk recalculated', p.id, `New risk locked in at ${aiRisk}%`);
  res.json(rowToProject(db.prepare('SELECT * FROM projects WHERE id = ?').get(p.id)));
});

/* ---------------- GIS ---------------- */
app.get('/api/parcels/:projectId', requireAuth, (req, res) => {
  const projectId = req.params.projectId;
  const parcels = db.prepare('SELECT * FROM parcels WHERE projectId = ?').all(projectId);
  if (parcels.length > 0) {
    return res.json(parcels.map((p) => ({ ...p, legalDispute: !!p.legalDispute })));
  }

  // If no specific parcels in database for this project, generate synthetic parcels around its center coordinates
  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(projectId);
  if (!project) return res.json([]);

  const synthetic = [];
  const cLat = project.centerLat || 28.6139;
  const cLng = project.centerLng || 77.2090;
  const count = Math.min(project.parcels || 120, 120);

  for (let i = 1; i <= count; i++) {
    const latOffset = Math.sin(i * 12.3) * 0.025;
    const lngOffset = Math.cos(i * 17.5) * 0.025;
    const r = (i * 37) % 100;
    synthetic.push({
      id: `${project.id}-P${String(i).padStart(4, '0')}`,
      projectId: project.id,
      village: (project.district || 'Sector') + ' Zone ' + ((i % 4) + 1),
      villageId: 'V-' + ((i % 4) + 1),
      lat: +(cLat + latOffset).toFixed(4),
      lng: +(cLng + lngOffset).toFixed(4),
      area: +(0.4 + (i % 7) * 0.35).toFixed(2),
      status: r < 30 ? 'acquired' : r < 65 ? 'in_progress' : r < 85 ? 'not_started' : 'disputed',
      risk: r > 85 ? 'critical' : r > 65 ? 'high' : r > 30 ? 'medium' : 'low',
      householdId: `${project.id}-H${String(i).padStart(4, '0')}`,
      legalDispute: r > 85,
    });
  }
  res.json(synthetic);
});

app.get('/api/villages/:projectId', requireAuth, (req, res) => {
  const projectId = req.params.projectId;
  const villages = db.prepare('SELECT * FROM villages WHERE projectId = ?').all(projectId);
  if (villages.length > 0) {
    return res.json(villages.map((v) => ({ id: v.id, name: v.name, center: [v.lat, v.lng], parcels: v.parcels, households: v.households })));
  }

  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(projectId);
  if (!project) return res.json([]);
  const cLat = project.centerLat || 28.6139;
  const cLng = project.centerLng || 77.2090;

  res.json([
    { id: 'V01', name: (project.district || 'Sector 1') + ' North', center: [cLat + 0.015, cLng + 0.015], parcels: 60, households: 35 },
    { id: 'V02', name: (project.district || 'Sector 2') + ' Central', center: [cLat, cLng], parcels: 80, households: 50 },
    { id: 'V03', name: (project.district || 'Sector 3') + ' South', center: [cLat - 0.015, cLng - 0.015], parcels: 50, households: 30 },
  ]);
});

app.get('/api/households/by-parcel/:parcelId', requireAuth, (req, res) => {
  const h = db.prepare('SELECT * FROM households WHERE parcelId = ?').get(req.params.parcelId);
  res.json(h ? rowToHousehold(h) : null);
});

/* ---------------- TASKS ---------------- */
app.get('/api/tasks', requireAuth, (req, res) => {
  const user = req.user || {};
  const isNational = !user.state || user.state === '—' || user.role === 'Ministry Administrator' || user.role?.includes('Ministry');
  let sql = 'SELECT * FROM tasks WHERE 1=1';
  const params = [];

  if (!isNational) {
    const stateProjects = db.prepare('SELECT id FROM projects WHERE state = ?').all(user.state).map((p) => p.id);
    if (stateProjects.length > 0) {
      const placeholders = stateProjects.map(() => '?').join(',');
      sql += ` AND (projectId IN (${placeholders}) OR officer = ?)`;
      params.push(...stateProjects, user.name);
    } else {
      sql += ` AND officer = ?`;
      params.push(user.name);
    }
  }

  if (req.query.projectId) { sql += ' AND projectId = ?'; params.push(req.query.projectId); }
  if (req.query.status) { sql += ' AND status = ?'; params.push(req.query.status); }
  if (req.query.officer) { sql += ' AND officer = ?'; params.push(req.query.officer); }
  res.json(db.prepare(sql).all(...params).map((t) => ({ ...t, evidence: JSON.parse(t.evidence || '[]') })));
});

app.post('/api/tasks', requireAuth, (req, res) => {
  const row = db.prepare('SELECT COUNT(*) c FROM tasks').get();
  const id = req.body.id || 'T-' + (1100 + row.c);
  const t = { id, status: 'Not Started', progress: 0, evidence: '[]', ...req.body, id };
  db.prepare(`INSERT INTO tasks (id,projectId,title,officer,role,progress,due,priority,status,risk,approver,description,evidence)
    VALUES (@id,@projectId,@title,@officer,@role,@progress,@due,@priority,@status,@risk,@approver,@description,@evidence)`).run(t);
  auditLog(req.user.name, 'Task created', id, `${t.title} → ${t.officer}`);
  res.status(201).json({ ...t, evidence: [] });
});

app.patch('/api/tasks/:id/progress', requireAuth, (req, res) => {
  const t = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  if (!t) return res.status(404).json({ error: 'Task not found' });
  const { progress } = req.body;
  const status = progress >= 100 ? 'Submitted' : progress > 0 ? 'In Progress' : t.status;
  db.prepare('UPDATE tasks SET progress=?, status=? WHERE id=?').run(progress, status, t.id);
  auditLog(req.user.name, 'Progress updated', t.id, `${t.progress}% → ${progress}%`);
  res.json({ ...t, progress, status });
});

app.patch('/api/tasks/:id/status', requireAuth, (req, res) => {
  const t = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  if (!t) return res.status(404).json({ error: 'Task not found' });
  const { status } = req.body;
  db.prepare('UPDATE tasks SET status=? WHERE id=?').run(status, t.id);
  auditLog(req.user.name, `Task ${status.toLowerCase()}`, t.id, t.title);
  res.json({ ...t, status });
});

app.patch('/api/tasks/:id/assign', requireAuth, (req, res) => {
  const t = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  if (!t) return res.status(404).json({ error: 'Task not found' });
  const { officer } = req.body;
  db.prepare('UPDATE tasks SET officer=? WHERE id=?').run(officer, t.id);
  auditLog(req.user.name, 'Task reassigned', t.id, `Assigned to ${officer}`);
  res.json({ ...t, officer });
});

/* ---------------- ANALYTICS ---------------- */
app.get('/api/analytics/kpis', requireAuth, (req, res) => {
  const user = req.user || {};
  const isNational = !user.state || user.state === '—' || user.role === 'Ministry Administrator' || user.role?.includes('Ministry');
  let projects = db.prepare('SELECT * FROM projects').all();
  if (!isNational) {
    projects = projects.filter((p) => p.state === user.state);
  }
  const total = projects.length;
  const critical = projects.filter((p) => p.riskLevel === 'critical').length;
  const highRisk = projects.filter((p) => p.riskLevel === 'high' || p.riskLevel === 'critical').length;
  const delayed = projects.filter((p) => p.expectedDelay > 60).length;
  const landUnderAcquisition = projects.reduce((a, p) => a + p.landAcquired, 0);
  const affectedHouseholds = projects.reduce((a, p) => a + p.households, 0);
  const pendingCompensation = projects.reduce((a, p) => a + Math.max(0, p.households - p.compensationPaid), 0);
  res.json({
    total, active: total, highRisk, critical, onTrack: total - delayed, delayed,
    needsIntervention: critical, landUnderAcquisition, affectedHouseholds, pendingCompensation,
  });
});
app.get('/api/analytics/critical-projects', requireAuth, (req, res) => {
  const user = req.user || {};
  const isNational = !user.state || user.state === '—' || user.role === 'Ministry Administrator' || user.role?.includes('Ministry');
  let sql = `SELECT * FROM projects WHERE riskLevel IN ('critical','high')`;
  const params = [];
  if (!isNational) {
    sql += ` AND state = ?`;
    params.push(user.state);
  }
  sql += ` ORDER BY aiRisk DESC LIMIT 8`;
  const rows = db.prepare(sql).all(...params);
  res.json(rows.map(rowToProject));
});
app.get('/api/analytics/:key', requireAuth, (req, res) => {
  const map = { 'state-risk': 'STATE_RISK', 'risk-trend': 'RISK_TREND', 'compensation-trend': 'COMPENSATION_TREND', 'stage-performance': 'STAGE_PERFORMANCE', 'delay-drivers': 'DELAY_DRIVERS' };
  const field = map[req.params.key];
  if (!field) return res.status(404).json({ error: 'Unknown analytics key' });
  const meta = JSON.parse(db.prepare(`SELECT value FROM meta WHERE key='analytics'`).get().value);
  res.json(meta[field]);
});

/* ---------------- AUDIT ---------------- */
app.get('/api/audit', requireAuth, (req, res) => {
  res.json(db.prepare('SELECT * FROM audit ORDER BY id DESC').all());
});

/* ---------------- LANDOWNER DASHBOARD DATA ---------------- */
app.get('/api/dashboard/landowner', requireAuth, (req, res) => {
  const user = req.user || {};
  let lo = db.prepare('SELECT * FROM landowner_data WHERE ownerId = ?').get(user.id);
  if (!lo) {
    lo = db.prepare('SELECT * FROM landowner_data LIMIT 1').get();
  }
  if (!lo) return res.status(404).json({ error: 'Landowner record not found' });

  const parcel = db.prepare('SELECT * FROM parcels WHERE id = ?').get(lo.parcelId);
  const household = db.prepare('SELECT * FROM households WHERE id = ?').get(lo.householdId);
  const documents = db.prepare('SELECT * FROM documents WHERE ownerId = ? ORDER BY uploadedAt DESC').all(lo.ownerId);
  const grievances = db.prepare('SELECT * FROM grievances WHERE ownerId = ? ORDER BY createdAt DESC').all(lo.ownerId);
  const notifications = db.prepare(`SELECT * FROM notifications WHERE userId = ? OR role = 'Landowner' ORDER BY createdAt DESC`).all(lo.ownerId);
  const compRecord = db.prepare('SELECT * FROM compensation_records WHERE ownerId = ?').get(lo.ownerId);
  const rrRecord = db.prepare('SELECT * FROM rr_records WHERE ownerId = ?').get(lo.ownerId);

  res.json({
    landowner: lo,
    parcel: parcel ? { ...parcel, legalDispute: !!parcel.legalDispute } : null,
    household: household ? rowToHousehold(household) : null,
    documents,
    grievances,
    notifications,
    compensation: compRecord || {
      assessedAmount: lo.compensationAssessed,
      approvedAmount: lo.compensationApproved,
      paidAmount: lo.compensationPaid,
      pendingAmount: lo.compensationPending,
      status: lo.compensationStatus,
    },
    rr: rrRecord || {
      status: lo.rrStatus,
      entitlement: lo.rrEntitlement,
      expectedDate: lo.rrExpectedDate,
    },
  });
});

/* ---------------- LIVE KPIS ENDPOINT ---------------- */
app.get('/api/kpis', requireAuth, (req, res) => {
  const user = req.user || {};
  const isMinistry = !user.state || user.state === '—' || user.role === 'Ministry Administrator' || user.role?.includes('Ministry');

  let projects = db.prepare('SELECT * FROM projects').all();
  if (!isMinistry) {
    projects = projects.filter((p) => p.state === user.state);
  }

  const totalProjects = projects.length;
  const delhiProjects = projects.filter((p) => p.state === 'Delhi').length;
  const totalLandRequired = projects.reduce((a, p) => a + (p.landRequired || 0), 0);
  const totalLandAcquired = projects.reduce((a, p) => a + (p.landAcquired || 0), 0);
  const totalLandRemaining = projects.reduce((a, p) => a + (p.remaining || 0), 0);
  // Real counts from the parcels/households tables (only projects with actual
  // linked GIS records contribute here) rather than each project's rough
  // display-estimate field, which previously inflated these totals ~3x.
  const scopedIds = projects.map((p) => p.id);
  const ph = scopedIds.length ? scopedIds.map(() => '?').join(',') : "''";
  const totalParcels = scopedIds.length ? db.prepare(`SELECT COUNT(*) c FROM parcels WHERE projectId IN (${ph})`).get(...scopedIds).c : 0;
  const acquiredParcels = scopedIds.length ? db.prepare(`SELECT COUNT(*) c FROM parcels WHERE status='acquired' AND projectId IN (${ph})`).get(...scopedIds).c : 0;
  const pendingParcels = scopedIds.length ? db.prepare(`SELECT COUNT(*) c FROM parcels WHERE status IN ('not_started','in_progress') AND projectId IN (${ph})`).get(...scopedIds).c : 0;
  const totalHouseholds = scopedIds.length ? db.prepare(`SELECT COUNT(*) c FROM households WHERE projectId IN (${ph})`).get(...scopedIds).c : 0;
  const verifiedParcels = scopedIds.length ? db.prepare(`SELECT COUNT(*) c FROM households WHERE verification='Verified' AND projectId IN (${ph})`).get(...scopedIds).c : 0;
  const compensationTotal = projects.reduce((a, p) => a + (p.compensationTotal || 0), 0);
  const compensationPaid = projects.reduce((a, p) => a + (p.compensationPaid || 0), 0);
  const compensationPending = projects.reduce((a, p) => a + (p.compensationPending || 0), 0);
  const rrTotal = projects.reduce((a, p) => a + (p.rrTotal || p.households || 0), 0);
  const rrCompleted = projects.reduce((a, p) => a + (p.rrCompleted || 0), 0);
  const rrPending = projects.reduce((a, p) => a + (p.rrPending || 0), 0);
  const criticalCount = projects.filter((p) => p.riskLevel === 'critical').length;
  const highRiskCount = projects.filter((p) => p.riskLevel === 'high' || p.riskLevel === 'critical').length;
  const delayedCount = projects.filter((p) => (p.expectedDelay || 0) > 60).length;

  res.json({
    totalProjects,
    delhiProjects,
    totalLandRequired: Math.round(totalLandRequired),
    totalLandAcquired: Math.round(totalLandAcquired),
    totalLandRemaining: Math.round(totalLandRemaining),
    totalParcels,
    verifiedParcels,
    acquiredParcels,
    pendingParcels,
    totalHouseholds,
    compensationTotal,
    compensationPaid,
    compensationPending,
    rrTotal,
    rrCompleted,
    rrPending,
    criticalCount,
    highRiskCount,
    delayedCount,
    onTrackCount: Math.max(0, totalProjects - delayedCount),
  });
});

/* ---------------- NOTIFICATIONS ---------------- */
app.get('/api/notifications', requireAuth, (req, res) => {
  const user = req.user || {};
  let notifs;
  if (user.role === 'Landowner') {
    notifs = db.prepare(`SELECT * FROM notifications WHERE userId = ? OR role = 'Landowner' ORDER BY createdAt DESC`).all(user.id);
  } else {
    notifs = db.prepare(`SELECT * FROM notifications WHERE userId = ? OR role = ? OR role = 'All' ORDER BY createdAt DESC`).all(user.id, user.role);
  }
  res.json(notifs);
});

app.patch('/api/notifications/:id/read', requireAuth, (req, res) => {
  db.prepare(`UPDATE notifications SET read = 1 WHERE id = ?`).run(req.params.id);
  res.json({ ok: true });
});

app.post('/api/notifications', requireAuth, (req, res) => {
  const { userId, role, projectId, title, message, type } = req.body;
  const id = 'NOTIF-' + Math.floor(1000 + Math.random() * 9000);
  const createdAt = new Date().toISOString().slice(0, 16).replace('T', ' ');
  db.prepare(`INSERT INTO notifications (id, userId, role, projectId, title, message, type, createdAt, read) VALUES (?,?,?,?,?,?,?,?,0)`)
    .run(id, userId || null, role || 'All', projectId || null, title, message, type || 'info', createdAt);
  res.status(201).json({ id, title, message });
});

/* ---------------- GRIEVANCES ---------------- */
app.get('/api/grievances', requireAuth, (req, res) => {
  const user = req.user || {};
  let grvs;
  if (user.role === 'Landowner') {
    grvs = db.prepare('SELECT * FROM grievances WHERE ownerId = ? ORDER BY createdAt DESC').all(user.id);
  } else if (req.query.projectId) {
    grvs = db.prepare('SELECT * FROM grievances WHERE projectId = ? ORDER BY createdAt DESC').all(req.query.projectId);
  } else {
    grvs = db.prepare('SELECT * FROM grievances ORDER BY createdAt DESC').all();
  }
  res.json(grvs);
});

app.post('/api/grievances', requireAuth, (req, res) => {
  const user = req.user || {};
  const { category, description, projectId, parcelId } = req.body;
  const count = db.prepare('SELECT COUNT(*) c FROM grievances').get().c;
  const id = 'GRV-' + (2050 + count);
  const createdAt = new Date().toISOString().slice(0, 10);
  const defaultResp = 'Your grievance has been received and forwarded to the Land Acquisition Officer. Reference: ' + id;
  const respondedAt = new Date().toISOString().slice(0, 10);

  db.prepare(`
    INSERT INTO grievances (id, ownerId, ownerName, projectId, parcelId, category, description, status, createdAt, response, respondedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'Under Review', ?, ?, ?)
  `).run(id, user.id, user.name, projectId || 'DL-001', parcelId || 'DLP-00043', category || 'General', description || '', createdAt, defaultResp, respondedAt);

  auditLog(user.name, 'Grievance submitted', id, `${category} · ${id}`);
  res.status(201).json({
    id, ownerId: user.id, ownerName: user.name,
    projectId, parcelId, category, description,
    status: 'Under Review', createdAt, response: defaultResp, respondedAt,
  });
});

app.patch('/api/grievances/:id/status', requireAuth, (req, res) => {
  const { status, response } = req.body;
  const respondedAt = new Date().toISOString().slice(0, 10);
  db.prepare('UPDATE grievances SET status = ?, response = COALESCE(?, response), respondedAt = ? WHERE id = ?')
    .run(status, response || null, respondedAt, req.params.id);
  auditLog(req.user.name, 'Grievance updated', req.params.id, `Status: ${status}`);
  res.json({ ok: true });
});

/* ---------------- DOCUMENTS ---------------- */
app.get('/api/documents', requireAuth, (req, res) => {
  const user = req.user || {};
  let docs;
  if (user.role === 'Landowner') {
    docs = db.prepare('SELECT * FROM documents WHERE ownerId = ? ORDER BY uploadedAt DESC').all(user.id);
  } else if (req.query.projectId) {
    docs = db.prepare('SELECT * FROM documents WHERE projectId = ? ORDER BY uploadedAt DESC').all(req.query.projectId);
  } else {
    docs = db.prepare('SELECT * FROM documents ORDER BY uploadedAt DESC').all();
  }
  res.json(docs);
});

app.post('/api/documents', requireAuth, upload.single('file'), (req, res) => {
  const user = req.user || {};
  const { type, description, projectId, parcelId } = req.body;
  const count = db.prepare('SELECT COUNT(*) c FROM documents').get().c;
  const id = 'DOC-' + String(count + 20).padStart(3, '0');
  const uploadedAt = new Date().toISOString().slice(0, 10);
  const file = req.file;

  db.prepare(`
    INSERT INTO documents (id, ownerId, projectId, parcelId, type, status, uploadedAt, verifiedAt, description, fileName, storedName, mimeType, fileSize)
    VALUES (?, ?, ?, ?, ?, 'Pending', ?, NULL, ?, ?, ?, ?, ?)
  `).run(
    id, user.id, projectId || 'DL-001', parcelId || 'DLP-00043', type || 'Supporting Document', uploadedAt, description || '',
    file ? file.originalname : null, file ? file.filename : null, file ? file.mimetype : null, file ? file.size : null
  );

  auditLog(user.name, 'Document uploaded', id, `${type}${file ? ' · ' + file.originalname : ''} · ${id}`);
  res.status(201).json({
    id, type, status: 'Pending', uploadedAt, description,
    fileName: file ? file.originalname : null, hasFile: !!file,
  });
});

// Authenticated file download — only the uploader or a non-landowner (officer) role can fetch it
app.get('/api/documents/:id/file', requireAuth, (req, res) => {
  const doc = db.prepare('SELECT * FROM documents WHERE id = ?').get(req.params.id);
  if (!doc || !doc.storedName) return res.status(404).json({ error: 'No file attached to this document' });
  const user = req.user || {};
  if (user.role === 'Landowner' && doc.ownerId !== user.id) {
    return res.status(403).json({ error: 'Not authorized to view this file' });
  }
  const filePath = path.join(UPLOAD_DIR, doc.storedName);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File missing on server' });
  res.setHeader('Content-Disposition', `inline; filename="${doc.fileName || doc.storedName}"`);
  if (doc.mimeType) res.setHeader('Content-Type', doc.mimeType);
  fs.createReadStream(filePath).pipe(res);
});

/* ---------------- R&R & COMPENSATION ---------------- */
app.get('/api/rr', requireAuth, (req, res) => {
  const user = req.user || {};
  let rows;
  if (user.role === 'Landowner') {
    rows = db.prepare('SELECT * FROM rr_records WHERE ownerId = ?').all(user.id);
  } else if (req.query.projectId) {
    rows = db.prepare('SELECT * FROM rr_records WHERE projectId = ?').all(req.query.projectId);
  } else {
    rows = db.prepare('SELECT * FROM rr_records').all();
  }
  res.json(rows);
});

app.get('/api/compensation', requireAuth, (req, res) => {
  const user = req.user || {};
  let rows;
  if (user.role === 'Landowner') {
    rows = db.prepare('SELECT * FROM compensation_records WHERE ownerId = ?').all(user.id);
  } else if (req.query.projectId) {
    rows = db.prepare('SELECT * FROM compensation_records WHERE projectId = ?').all(req.query.projectId);
  } else {
    rows = db.prepare('SELECT * FROM compensation_records').all();
  }
  res.json(rows);
});

/* ---------------- Serve frontend (single process for easy demo) ---------------- */
const FRONTEND_DIR = path.join(__dirname, '..', 'frontend');
app.use(express.static(FRONTEND_DIR));
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'Not found' });
  res.sendFile(path.join(FRONTEND_DIR, 'index.html'));
});

// JSON error handler — catches multer errors (bad file type, too large, etc.)
// so uploads always fail with a readable message instead of a raw HTML 500.
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError || err) {
    const status = err.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
    return res.status(status).json({ error: err.message || 'Upload failed' });
  }
  next();
});

app.listen(PORT, () => {
  console.log(`\n🌍 DigiBhoomi backend + frontend running → http://localhost:${PORT}\n`);
});
