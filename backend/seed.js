require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./db');
const { generateAll } = require('./generateData');

const DEMO_PASSWORD = process.env.DEMO_PASSWORD || 'digibhoomi@2026';

function seed() {
  const data = generateAll();

  db.exec(`
    DROP TABLE IF EXISTS officers;
    DROP TABLE IF EXISTS projects;
    DROP TABLE IF EXISTS parcels;
    DROP TABLE IF EXISTS households;
    DROP TABLE IF EXISTS villages;
    DROP TABLE IF EXISTS tasks;
    DROP TABLE IF EXISTS audit;
    DROP TABLE IF EXISTS recommendations;
    DROP TABLE IF EXISTS meta;
    DROP TABLE IF EXISTS notifications;
    DROP TABLE IF EXISTS grievances;
    DROP TABLE IF EXISTS documents;
    DROP TABLE IF EXISTS rr_records;
    DROP TABLE IF EXISTS compensation_records;
    DROP TABLE IF EXISTS landowner_data;

    CREATE TABLE officers (
      id TEXT PRIMARY KEY,
      name TEXT, role TEXT, dept TEXT, state TEXT, district TEXT, email TEXT UNIQUE,
      password_hash TEXT, assignedProject TEXT
    );

    CREATE TABLE projects (
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

    CREATE TABLE parcels (
      id TEXT PRIMARY KEY,
      projectId TEXT DEFAULT 'AIR-001',
      village TEXT, villageId TEXT,
      lat REAL, lng REAL, area REAL,
      status TEXT, risk TEXT, householdId TEXT, legalDispute INTEGER
    );

    CREATE TABLE households (
      id TEXT PRIMARY KEY,
      parcelId TEXT, projectId TEXT, village TEXT, owner TEXT, landArea REAL,
      documents TEXT,
      verification TEXT,
      compensationTotal INTEGER, compensationApproved INTEGER, compensationPaid INTEGER,
      compensationStatus TEXT, legalStatus TEXT, aiRisk TEXT, phone TEXT
    );

    CREATE TABLE villages (
      id TEXT PRIMARY KEY, projectId TEXT, name TEXT,
      lat REAL, lng REAL, parcels INTEGER, households INTEGER
    );

    CREATE TABLE tasks (
      id TEXT PRIMARY KEY, projectId TEXT, title TEXT, officer TEXT, role TEXT,
      progress INTEGER, due TEXT, priority TEXT, status TEXT, risk TEXT,
      approver TEXT, description TEXT, evidence TEXT DEFAULT '[]'
    );

    CREATE TABLE audit (
      id TEXT PRIMARY KEY, ts TEXT, actor TEXT, action TEXT, target TEXT, detail TEXT
    );

    CREATE TABLE recommendations (
      id TEXT PRIMARY KEY, projectId TEXT, title TEXT, detail TEXT,
      impactDays INTEGER, priority TEXT, action TEXT, ownerRole TEXT
    );

    CREATE TABLE meta (
      key TEXT PRIMARY KEY, value TEXT
    );

    CREATE TABLE notifications (
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

    CREATE TABLE grievances (
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

    CREATE TABLE documents (
      id TEXT PRIMARY KEY,
      ownerId TEXT,
      projectId TEXT,
      parcelId TEXT,
      type TEXT,
      status TEXT,
      uploadedAt TEXT,
      verifiedAt TEXT,
      description TEXT,
      fileName TEXT,
      storedName TEXT,
      mimeType TEXT,
      fileSize INTEGER
    );

    CREATE TABLE rr_records (
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

    CREATE TABLE compensation_records (
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

    CREATE TABLE landowner_data (
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

  const passwordHash = bcrypt.hashSync(DEMO_PASSWORD, 10);

  // 1. OFFICERS
  const insOfficer = db.prepare(`
    INSERT INTO officers (id, name, role, dept, state, district, email, password_hash, assignedProject)
    VALUES (@id, @name, @role, @dept, @state, @district, @email, @password_hash, @assignedProject)
  `);
  const officerTx = db.transaction((rows) => rows.forEach((o) => insOfficer.run({
    ...o,
    district: o.district || '—',
    assignedProject: o.assignedProject || null,
    password_hash: passwordHash,
  })));
  officerTx(data.OFFICERS);

  // 2. PROJECTS (45 projects)
  const insProject = db.prepare(`
    INSERT INTO projects (
      id, flagship, name, type, state, district,
      implementingAgency, projectStatus,
      landRequired, landIdentified, landVerified, landAcquired, remaining,
      totalParcels, verifiedParcels, acquiredParcels, pendingParcels,
      households,
      compensationTotal, compensationApproved, compensationPaid, compensationPending,
      rrTotal, rrCompleted, rrPending, possessionStatus,
      documentsVerified, documentsCollected,
      legalDisputes, rrProgress, pendingApprovals,
      villages, parcels, currentStage, progress,
      aiRisk, expectedDelay, confidence, simulatedRisk,
      riskLevel, owner, assignee, approver, department,
      startedAt, plannedCompletion, budget,
      centerLat, centerLng, stageHistory
    ) VALUES (
      @id, @flagship, @name, @type, @state, @district,
      @implementingAgency, @projectStatus,
      @landRequired, @landIdentified, @landVerified, @landAcquired, @remaining,
      @totalParcels, @verifiedParcels, @acquiredParcels, @pendingParcels,
      @households,
      @compensationTotal, @compensationApproved, @compensationPaid, @compensationPending,
      @rrTotal, @rrCompleted, @rrPending, @possessionStatus,
      @documentsVerified, @documentsCollected,
      @legalDisputes, @rrProgress, @pendingApprovals,
      @villages, @parcels, @currentStage, @progress,
      @aiRisk, @expectedDelay, @confidence, @simulatedRisk,
      @riskLevel, @owner, @assignee, @approver, @department,
      @startedAt, @plannedCompletion, @budget,
      @centerLat, @centerLng, @stageHistory
    )
  `);
  const projectTx = db.transaction((rows) => rows.forEach((p) => insProject.run({
    ...p,
    implementingAgency: p.implementingAgency || 'NHAI',
    projectStatus: p.projectStatus || 'In Progress',
    landIdentified: p.landIdentified != null ? p.landIdentified : p.landRequired,
    landVerified: p.landVerified != null ? p.landVerified : Math.round(p.landAcquired * 1.2),
    remaining: p.remaining != null ? p.remaining : Math.max(0, p.landRequired - p.landAcquired),
    totalParcels: p.totalParcels || p.parcels,
    verifiedParcels: p.verifiedParcels || Math.round(p.parcels * 0.7),
    acquiredParcels: p.acquiredParcels || Math.round(p.parcels * 0.4),
    pendingParcels: p.pendingParcels || Math.round(p.parcels * 0.6),
    compensationTotal: p.compensationTotal || (p.budget ? Math.round(p.budget * 0.35 * 10000000) : 10000000),
    compensationPending: p.compensationPending != null ? p.compensationPending : Math.max(0, (p.compensationTotal || 0) - (p.compensationPaid || 0)),
    rrTotal: p.rrTotal || p.households,
    rrCompleted: p.rrCompleted || Math.round(p.households * 0.4),
    rrPending: p.rrPending || Math.round(p.households * 0.6),
    possessionStatus: p.possessionStatus || 'Partial',
  })));
  projectTx(data.PROJECTS);

  // 3. PARCELS
  const insParcel = db.prepare(`
    INSERT INTO parcels (id, projectId, village, villageId, lat, lng, area, status, risk, householdId, legalDispute)
    VALUES (@id, @projectId, @village, @villageId, @lat, @lng, @area, @status, @risk, @householdId, @legalDispute)
  `);
  const parcelTx = db.transaction((rows) => rows.forEach((p) => insParcel.run({
    ...p,
    projectId: p.projectId || 'AIR-001',
    legalDispute: p.legalDispute ? 1 : 0,
  })));
  parcelTx(data.PARCELS);

  // 4. HOUSEHOLDS
  const allHouseholds = [...(data.AIR001_HOUSEHOLDS || []), ...(data.DL001_HOUSEHOLDS || [])];
  const insHousehold = db.prepare(`
    INSERT INTO households (id, parcelId, projectId, village, owner, landArea, documents, verification, compensationTotal, compensationApproved, compensationPaid, compensationStatus, legalStatus, aiRisk, phone)
    VALUES (@id, @parcelId, @projectId, @village, @owner, @landArea, @documents, @verification, @compensationTotal, @compensationApproved, @compensationPaid, @compensationStatus, @legalStatus, @aiRisk, @phone)
  `);
  const householdTx = db.transaction((rows) => rows.forEach((h) => insHousehold.run({
    ...h,
    projectId: h.projectId || (h.id.startsWith('DLH') ? 'DL-001' : 'AIR-001'),
    documents: JSON.stringify(h.documents || []),
  })));
  householdTx(allHouseholds);

  // 5. VILLAGES (AIR-001 + DL-001)
  const insVillage = db.prepare(`
    INSERT INTO villages (id, projectId, name, lat, lng, parcels, households)
    VALUES (@id, @projectId, @name, @lat, @lng, @parcels, @households)
  `);
  const allVillages = [
    ...(data.AIR001_VILLAGES || []).map((v) => ({ ...v, projectId: 'AIR-001' })),
    ...(data.DL001_VILLAGES || []).map((v) => ({ ...v, projectId: 'DL-001' })),
  ];
  const villageTx = db.transaction((rows) => rows.forEach((v) => insVillage.run({
    ...v,
    lat: v.center[0],
    lng: v.center[1],
  })));
  villageTx(allVillages);

  // 6. TASKS
  const insTask = db.prepare(`
    INSERT INTO tasks (id, projectId, title, officer, role, progress, due, priority, status, risk, approver, description, evidence)
    VALUES (@id, @projectId, @title, @officer, @role, @progress, @due, @priority, @status, @risk, @approver, @description, '[]')
  `);
  const taskTx = db.transaction((rows) => rows.forEach((t) => insTask.run(t)));
  taskTx(data.TASKS);

  // 7. AUDIT
  const insAudit = db.prepare(`
    INSERT INTO audit (id, ts, actor, action, target, detail)
    VALUES (@id, @ts, @actor, @action, @target, @detail)
  `);
  const auditTx = db.transaction((rows) => rows.forEach((a) => insAudit.run(a)));
  auditTx(data.AUDIT);

  // 8. RECOMMENDATIONS
  const insRec = db.prepare(`
    INSERT INTO recommendations (id, projectId, title, detail, impactDays, priority, action, ownerRole)
    VALUES (@id, @projectId, @title, @detail, @impactDays, @priority, @action, @ownerRole)
  `);
  const recTx = db.transaction((rows) => rows.forEach((r) => insRec.run(r)));
  recTx(data.RECOMMENDATIONS);

  // 9. NOTIFICATIONS
  if (data.NOTIFICATIONS && data.NOTIFICATIONS.length > 0) {
    const insNotif = db.prepare(`
      INSERT INTO notifications (id, userId, role, projectId, title, message, type, createdAt, read)
      VALUES (@id, @userId, @role, @projectId, @title, @message, @type, @createdAt, @read)
    `);
    const notifTx = db.transaction((rows) => rows.forEach((n) => insNotif.run(n)));
    notifTx(data.NOTIFICATIONS);
  }

  // 10. GRIEVANCES
  if (data.GRIEVANCES && data.GRIEVANCES.length > 0) {
    const insGrv = db.prepare(`
      INSERT INTO grievances (id, ownerId, ownerName, projectId, parcelId, category, description, status, createdAt, response, respondedAt)
      VALUES (@id, @ownerId, @ownerName, @projectId, @parcelId, @category, @description, @status, @createdAt, @response, @respondedAt)
    `);
    const grvTx = db.transaction((rows) => rows.forEach((g) => insGrv.run(g)));
    grvTx(data.GRIEVANCES);
  }

  // 11. DOCUMENTS
  if (data.DOCUMENTS && data.DOCUMENTS.length > 0) {
    const insDoc = db.prepare(`
      INSERT INTO documents (id, ownerId, projectId, parcelId, type, status, uploadedAt, verifiedAt, description)
      VALUES (@id, @ownerId, @projectId, @parcelId, @type, @status, @uploadedAt, @verifiedAt, @description)
    `);
    const docTx = db.transaction((rows) => rows.forEach((d) => insDoc.run(d)));
    docTx(data.DOCUMENTS);
  }

  // 12. R&R RECORDS
  if (data.RR_RECORDS && data.RR_RECORDS.length > 0) {
    const insRR = db.prepare(`
      INSERT INTO rr_records (id, householdId, ownerId, ownerName, projectId, entitlement, assistanceType, amount, status, rehabilitationStatus, resettlementStatus, createdAt, updatedAt)
      VALUES (@id, @householdId, @ownerId, @ownerName, @projectId, @entitlement, @assistanceType, @amount, @status, @rehabilitationStatus, @resettlementStatus, @createdAt, @updatedAt)
    `);
    const rrTx = db.transaction((rows) => rows.forEach((r) => insRR.run(r)));
    rrTx(data.RR_RECORDS);
  }

  // 13. COMPENSATION RECORDS
  if (data.COMP_RECORDS && data.COMP_RECORDS.length > 0) {
    const insComp = db.prepare(`
      INSERT INTO compensation_records (id, projectId, parcelId, ownerId, ownerName, householdId, assessedAmount, approvedAmount, paidAmount, pendingAmount, status, approvalDate, paymentDate, remarks)
      VALUES (@id, @projectId, @parcelId, @ownerId, @ownerName, @householdId, @assessedAmount, @approvedAmount, @paidAmount, @pendingAmount, @status, @approvalDate, @paymentDate, @remarks)
    `);
    const compTx = db.transaction((rows) => rows.forEach((c) => insComp.run(c)));
    compTx(data.COMP_RECORDS);
  }

  // 14. LANDOWNER DATA
  if (data.LANDOWNER_DATA) {
    const insLO = db.prepare(`
      INSERT OR REPLACE INTO landowner_data (
        id, ownerId, parcelId, householdId, projectId, ownerName, surveyNumber, village, district, state,
        landArea, landUnit, acquisitionStage, stageIndex, compensationAssessed, compensationApproved,
        compensationPaid, compensationPending, compensationStatus, rrStatus, rrEntitlement, rrExpectedDate,
        possessionStatus, nextAction
      ) VALUES (
        @id, @ownerId, @parcelId, @householdId, @projectId, @ownerName, @surveyNumber, @village, @district, @state,
        @landArea, @landUnit, @acquisitionStage, @stageIndex, @compensationAssessed, @compensationApproved,
        @compensationPaid, @compensationPending, @compensationStatus, @rrStatus, @rrEntitlement, @rrExpectedDate,
        @possessionStatus, @nextAction
      )
    `);
    insLO.run({
      id: 'LOD-001',
      ...data.LANDOWNER_DATA,
    });
  }

  // 15. META ANALYTICS
  db.prepare(`INSERT INTO meta (key,value) VALUES ('analytics', ?)`).run(JSON.stringify({
    STATES: data.STATES,
    PROJECT_TYPES: data.PROJECT_TYPES,
    STATE_RISK: data.STATE_RISK,
    RISK_TREND: data.RISK_TREND,
    COMPENSATION_TREND: data.COMPENSATION_TREND,
    STAGE_PERFORMANCE: data.STAGE_PERFORMANCE,
    DELAY_DRIVERS: data.DELAY_DRIVERS,
    COMP_SUMMARY: data.COMP_SUMMARY,
  }));

  const delhiCount = data.PROJECTS.filter((p) => p.state === 'Delhi').length;
  console.log('✅ Seeded database:');
  console.log(`   ${data.OFFICERS.length} officers   (demo password: ${DEMO_PASSWORD})`);
  console.log(`   ${data.PROJECTS.length} projects (${delhiCount} in Delhi)`);
  console.log(`   ${data.PARCELS.length} parcels`);
  console.log(`   ${allHouseholds.length} households`);
  console.log(`   ${data.TASKS.length} tasks`);
  console.log('   Demo logins: ministry.demo@gov.in, state.demo@delhi.gov.in, district.demo@delhi.gov.in, etc.');
}

if (require.main === module) {
  seed();
}

module.exports = seed;

