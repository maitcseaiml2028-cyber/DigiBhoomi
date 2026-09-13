/* DigiBhoomi — Complete Demo Dataset Generator
 * 45 projects total (exactly 5 in Delhi)
 * All demo data is fictional and for testing purposes only.
 */

// ─── Seeded RNG for deterministic output ───────────────────────────────────
function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20260912);
function pick(arr) { return arr[Math.floor(rand() * arr.length)]; }
function rInt(min, max) { return Math.floor(min + rand() * (max - min + 1)); }
function rFloat(min, max, dp = 2) { return parseFloat((min + rand() * (max - min)).toFixed(dp)); }

// ─── Reference Data ─────────────────────────────────────────────────────────
const STATES = [
  { code: 'DL', name: 'Delhi',            center: [28.6139, 77.2090] },
  { code: 'UP', name: 'Uttar Pradesh',    center: [26.8467, 80.9462] },
  { code: 'RJ', name: 'Rajasthan',        center: [26.9124, 75.7873] },
  { code: 'MH', name: 'Maharashtra',      center: [19.7515, 75.7139] },
  { code: 'GJ', name: 'Gujarat',          center: [22.2587, 71.1924] },
  { code: 'HR', name: 'Haryana',          center: [29.0588, 76.0856] },
  { code: 'MP', name: 'Madhya Pradesh',   center: [22.9734, 78.6569] },
  { code: 'KA', name: 'Karnataka',        center: [15.3173, 75.7139] },
  { code: 'TN', name: 'Tamil Nadu',       center: [11.1271, 78.6569] },
  { code: 'TS', name: 'Telangana',        center: [17.9784, 79.5941] },
  { code: 'AP', name: 'Andhra Pradesh',   center: [15.9129, 79.7400] },
  { code: 'BR', name: 'Bihar',            center: [25.0961, 85.3131] },
  { code: 'WB', name: 'West Bengal',      center: [22.9868, 87.8550] },
  { code: 'OD', name: 'Odisha',           center: [20.9517, 85.0985] },
  { code: 'PB', name: 'Punjab',           center: [31.1471, 75.3412] },
  { code: 'AS', name: 'Assam',            center: [26.2006, 92.9376] },
  { code: 'JH', name: 'Jharkhand',        center: [23.6102, 85.2799] },
  { code: 'CG', name: 'Chhattisgarh',     center: [21.2787, 81.8661] },
  { code: 'KL', name: 'Kerala',           center: [10.8505, 76.2711] },
];

const PROJECT_TYPES = ['Highway', 'Railway', 'Metro', 'Airport', 'Industrial Corridor', 'Power Project', 'Urban Infrastructure', 'Logistics', 'Irrigation', 'Other Infrastructure'];
const RISK_LEVELS = ['low', 'medium', 'high', 'critical'];
const PROJECT_STATUSES = ['Proposed', 'Land Identification', 'Verification', 'Notification', 'Compensation', 'R&R', 'Possession', 'Completed', 'Delayed'];
const DEPARTMENTS = ['MoRTH', 'MoR', 'MoP', 'MoJS', 'DPIIT', 'MoCA', 'NHAI', 'NHSRCL', 'AAI', 'RVNL', 'DMRC', 'PWD'];

// ─── OFFICERS (6 primary roles + specialists) ──────────────────────────────
const OFFICERS = [
  // Primary demo accounts
  { id: 'OFF-001', name: 'Anjali Verma',        role: 'Ministry Administrator',  dept: 'MoRTH',   state: '—',             district: '—',            email: 'ministry.demo@gov.in',         assignedProject: null },
  { id: 'OFF-002', name: 'Suresh Mehta',         role: 'State Administrator',    dept: 'Revenue',  state: 'Delhi',         district: '—',            email: 'state.demo@delhi.gov.in',      assignedProject: null },
  { id: 'OFF-003', name: 'Priya Sharma',          role: 'District Administrator', dept: 'Revenue',  state: 'Delhi',         district: 'South-West Delhi', email: 'district.demo@delhi.gov.in', assignedProject: null },
  { id: 'OFF-004', name: 'Vikram Malhotra',       role: 'Project Manager',        dept: 'Projects', state: 'Delhi',         district: '—',            email: 'project.demo@delhi.gov.in',    assignedProject: 'DL-001' },
  { id: 'OFF-005', name: 'Deepa Kapoor',          role: 'Field Officer',          dept: 'Revenue',  state: 'Delhi',         district: 'South-West Delhi', email: 'field.demo@delhi.gov.in',  assignedProject: 'DL-001' },
  { id: 'OFF-006', name: 'Rajesh Kumar',          role: 'Landowner',              dept: 'Citizen',  state: 'Delhi',         district: 'South-West Delhi', email: 'landowner.demo@gmail.com', assignedProject: null },
  // Legacy accounts (kept for backward compatibility)
  { id: 'OFF-007', name: 'Rakesh Sharma',         role: 'State Administrator',    dept: 'Revenue',  state: 'Rajasthan',     district: '—',            email: 'r.sharma@rj.gov.in',           assignedProject: null },
  { id: 'OFF-008', name: 'Priya Nair',             role: 'District Administrator', dept: 'Revenue',  state: 'Rajasthan',     district: 'Jaipur',       email: 'p.nair@rj.gov.in',             assignedProject: null },
  { id: 'OFF-009', name: 'Vikram Singh',           role: 'Project Manager',        dept: 'Projects', state: 'Rajasthan',     district: '—',            email: 'v.singh@rj.gov.in',            assignedProject: 'AIR-001' },
  { id: 'OFF-010', name: 'Deepa Iyer',             role: 'Field Officer',          dept: 'Revenue',  state: 'Rajasthan',     district: 'Jaipur',       email: 'd.iyer@rj.gov.in',             assignedProject: 'AIR-001' },
  { id: 'OFF-011', name: 'Ravi Kumar',             role: 'Landowner',              dept: 'Citizen',  state: 'Rajasthan',     district: 'Jaipur',       email: 'r.kumar@citizen.in',           assignedProject: null },
  // Specialists
  { id: 'OFF-012', name: 'Neha Kapoor',            role: 'Revenue Officer',        dept: 'Revenue',  state: 'Delhi',         district: 'South-West Delhi', email: 'n.kapoor@delhi.gov.in',    assignedProject: 'DL-001' },
  { id: 'OFF-013', name: 'Arun Mehta',             role: 'Legal Officer',          dept: 'Legal',    state: 'Delhi',         district: '—',            email: 'a.mehta@delhi.gov.in',         assignedProject: null },
  { id: 'OFF-014', name: 'Sunita Yadav',           role: 'R&R Officer',            dept: 'Revenue',  state: 'Delhi',         district: 'South-West Delhi', email: 's.yadav@delhi.gov.in',     assignedProject: 'DL-001' },
  { id: 'OFF-015', name: 'Aditya Patel',           role: 'State Administrator',    dept: 'Revenue',  state: 'Gujarat',       district: '—',            email: 'a.patel@gj.gov.in',            assignedProject: null },
  { id: 'OFF-016', name: 'Sunil Deshmukh',         role: 'State Administrator',    dept: 'Revenue',  state: 'Maharashtra',   district: '—',            email: 's.deshmukh@mh.gov.in',         assignedProject: null },
];

// ─── DELHI VILLAGES (for DL-001 parcels) ───────────────────────────────────
const DL001_VILLAGES = [
  { id: 'DLV-01', name: 'Najafgarh',       center: [28.609, 76.978], parcels: 280, households: 160 },
  { id: 'DLV-02', name: 'Dhansa',          center: [28.595, 76.991], parcels: 240, households: 140 },
  { id: 'DLV-03', name: 'Rewla Khanpur',   center: [28.622, 77.001], parcels: 210, households: 120 },
  { id: 'DLV-04', name: 'Goela Khurd',     center: [28.584, 77.015], parcels: 190, households: 110 },
  { id: 'DLV-05', name: 'Malikpur',        center: [28.611, 77.030], parcels: 220, households: 130 },
];

// Legacy AIR-001 villages (Rajasthan, kept for backward compat)
const AIR001_VILLAGES = [
  { id: 'V01', name: 'Bagru Kalan',        center: [26.808, 75.545], parcels: 480, households: 260 },
  { id: 'V02', name: 'Chomu Purohitan',    center: [26.821, 75.560], parcels: 420, households: 240 },
  { id: 'V03', name: 'Dyodhi',             center: [26.795, 75.575], parcels: 380, households: 220 },
  { id: 'V04', name: 'Hirapura',           center: [26.812, 75.588], parcels: 410, households: 230 },
  { id: 'V05', name: 'Kanota Khurd',       center: [26.782, 75.552], parcels: 360, households: 200 },
  { id: 'V06', name: 'Mahapura',           center: [26.826, 75.535], parcels: 400, households: 235 },
  { id: 'V07', name: 'Newta',              center: [26.775, 75.596], parcels: 420, households: 240 },
  { id: 'V08', name: 'Sanwalka',           center: [26.803, 75.612], parcels: 370, households: 225 },
];

// ─── ALL 45 PROJECTS ────────────────────────────────────────────────────────
function genProjects() {
  const projects = [];

  // Helper to build a project
  function makeProject(overrides) {
    const req = overrides.landRequired || rInt(200, 1500);
    const identified = Math.round(req * rFloat(0.5, 1.0));
    const verified = Math.round(identified * rFloat(0.6, 1.0));
    const acquired = Math.round(verified * rFloat(0.3, 1.0));
    const remaining = req - acquired;
    const totalParcels = rInt(500, 4000);
    const verifiedParcels = Math.round(totalParcels * (verified / req));
    const acquiredParcels = Math.round(totalParcels * (acquired / req));
    const pendingParcels = totalParcels - acquiredParcels;
    const households = rInt(100, 2500);
    const compTotal = Math.round(acquired * rInt(800000, 2000000));
    const compPaid = Math.round(compTotal * rFloat(0.3, 0.85));
    const compPending = compTotal - compPaid;
    const aiRisk = overrides.aiRisk || rInt(20, 95);
    const riskLevel = aiRisk >= 80 ? 'critical' : aiRisk >= 65 ? 'high' : aiRisk >= 45 ? 'medium' : 'low';
    const stage = overrides.currentStage || rInt(1, 7);
    const progress = Math.min(100, Math.round((stage / 7) * 100 * rFloat(0.7, 1.0)));
    const stateObj = STATES.find(s => s.name === overrides.state) || STATES[0];
    const centerLat = stateObj.center[0] + rFloat(-1.5, 1.5, 4);
    const centerLng = stateObj.center[1] + rFloat(-1.5, 1.5, 4);

    return {
      flagship: 0,
      landRequired: req,
      landIdentified: identified,
      landVerified: verified,
      landAcquired: acquired,
      remaining,
      totalParcels,
      verifiedParcels,
      acquiredParcels,
      pendingParcels,
      households,
      compensationTotal: compTotal,
      compensationApproved: Math.round(compTotal * rFloat(0.5, 0.95)),
      compensationPaid: compPaid,
      compensationPending: compPending,
      rrTotal: households,
      rrCompleted: Math.round(households * rFloat(0.2, 0.8)),
      rrPending: Math.round(households * rFloat(0.2, 0.5)),
      possessionStatus: pick(['Pending', 'Partial', 'Completed']),
      documentsVerified: Math.round(households * rFloat(0.6, 0.95)),
      documentsCollected: Math.round(households * rFloat(0.75, 1.0)),
      legalDisputes: rInt(0, 180),
      rrProgress: rInt(20, 85),
      pendingApprovals: rInt(0, 15),
      villages: rInt(2, 12),
      parcels: totalParcels,
      currentStage: stage,
      progress,
      aiRisk,
      expectedDelay: aiRisk >= 60 ? rInt(30, 220) : rInt(0, 45),
      confidence: rInt(70, 95),
      simulatedRisk: null,
      riskLevel,
      owner: pick(['Anjali Verma', 'Suresh Mehta', 'Vikram Malhotra']),
      assignee: pick(['Vikram Malhotra', 'Vikram Singh', 'Arjun Reddy']),
      approver: pick(['Anjali Verma', 'Suresh Mehta', 'Rakesh Sharma']),
      department: pick(DEPARTMENTS),
      implementingAgency: overrides.implementingAgency || pick(['NHAI', 'RVNL', 'AAI', 'DMRC', 'PWD', 'NHSRCL']),
      projectStatus: overrides.projectStatus || pick(PROJECT_STATUSES),
      startedAt: `202${rInt(3, 5)}-0${rInt(1, 9)}-${rInt(10, 28)}`,
      plannedCompletion: `202${rInt(6, 8)}-0${rInt(1, 9)}-${rInt(10, 28)}`,
      budget: rInt(500, 45000),
      centerLat: overrides.centerLat || centerLat,
      centerLng: overrides.centerLng || centerLng,
      stageHistory: null,
      ...overrides,
    };
  }

  // ── 5 DELHI PROJECTS ────────────────────────────────────────────────────
  projects.push(makeProject({
    id: 'DL-001', flagship: 1, name: 'Delhi Ring Road — Phase 4 Expansion',
    type: 'Urban Infrastructure', state: 'Delhi', district: 'South-West Delhi',
    implementingAgency: 'NHAI', projectStatus: 'Compensation',
    landRequired: 485, landIdentified: 472, landVerified: 410, landAcquired: 298,
    households: 1240, aiRisk: 78, currentStage: 4, progress: 52,
    centerLat: 28.5921, centerLng: 77.0460,
    stageHistory: JSON.stringify([
      { stage: 1, name: 'Project Announced',      status: 'approved',    completedAt: '2024-03-15', approver: 'Delhi Cabinet' },
      { stage: 2, name: 'Department Assigned',    status: 'approved',    completedAt: '2024-06-10', approver: 'Lt. Governor' },
      { stage: 3, name: 'Land Identified',        status: 'approved',    completedAt: '2025-01-08', approver: 'DDA' },
      { stage: 4, name: 'Land Acquisition',       status: 'in_progress', progress: 52 },
      { stage: 5, name: 'Possession',             status: 'locked' },
      { stage: 6, name: 'Construction',           status: 'locked' },
      { stage: 7, name: 'Completed',              status: 'locked' },
    ]),
  }));

  projects.push(makeProject({
    id: 'DL-002', name: 'Delhi–Meerut Regional Connectivity Corridor',
    type: 'Highway', state: 'Delhi', district: 'North-East Delhi',
    implementingAgency: 'NHAI', projectStatus: 'Verification',
    landRequired: 320, aiRisk: 55, currentStage: 3, centerLat: 28.698, centerLng: 77.311,
  }));

  projects.push(makeProject({
    id: 'DL-003', name: 'Delhi Urban Infrastructure & Transit Corridor',
    type: 'Metro', state: 'Delhi', district: 'Central Delhi',
    implementingAgency: 'DMRC', projectStatus: 'Notification',
    landRequired: 180, aiRisk: 42, currentStage: 4, centerLat: 28.644, centerLng: 77.216,
  }));

  projects.push(makeProject({
    id: 'DL-004', name: 'Najafgarh–Dwarka Multi-Modal Connectivity Project',
    type: 'Logistics', state: 'Delhi', district: 'West Delhi',
    implementingAgency: 'PWD', projectStatus: 'Land Identification',
    landRequired: 260, aiRisk: 38, currentStage: 2, centerLat: 28.618, centerLng: 77.058,
  }));

  projects.push(makeProject({
    id: 'DL-005', name: 'Delhi Logistics & Integrated Transport Hub',
    type: 'Logistics', state: 'Delhi', district: 'North-West Delhi',
    implementingAgency: 'DPIIT', projectStatus: 'R&R',
    landRequired: 390, aiRisk: 83, currentStage: 5, centerLat: 28.724, centerLng: 77.089,
  }));

  projects.push(makeProject({
    id: 'DL-006', name: 'Dwarka Sector Land Pooling & Infrastructure',
    type: 'Urban Infrastructure', state: 'Delhi', district: 'South-West Delhi',
    implementingAgency: 'DDA', projectStatus: 'Compensation',
    landRequired: 210, aiRisk: 66, currentStage: 4, centerLat: 28.585, centerLng: 77.038,
  }));

  projects.push(makeProject({
    id: 'DL-007', name: 'Najafgarh Drain Realignment & Road Widening',
    type: 'Highway', state: 'Delhi', district: 'South-West Delhi',
    implementingAgency: 'PWD', projectStatus: 'Verification',
    landRequired: 165, aiRisk: 48, currentStage: 3, centerLat: 28.609, centerLng: 76.986,
  }));

  projects.push(makeProject({
    id: 'DL-008', name: 'Delhi Airport Cargo Corridor Extension',
    type: 'Logistics', state: 'Delhi', district: 'South Delhi',
    implementingAgency: 'AAI', projectStatus: 'Land Identification',
    landRequired: 140, aiRisk: 52, currentStage: 2, centerLat: 28.556, centerLng: 77.100,
  }));

  // ── 40 NON-DELHI PROJECTS ───────────────────────────────────────────────
  const nonDelhiProjects = [
    // Uttar Pradesh (5)
    { id: 'UP-001', name: 'Greenfield International Airport — Jewar',   type: 'Airport',              state: 'Uttar Pradesh', district: 'Gautam Buddha Nagar', aiRisk: 58, centerLat: 28.124, centerLng: 77.584 },
    { id: 'UP-002', name: 'Ganga Expressway — Phase 2',                  type: 'Highway',              state: 'Uttar Pradesh', district: 'Prayagraj',           aiRisk: 72, centerLat: 25.440, centerLng: 81.842 },
    { id: 'UP-003', name: 'Lucknow Metro — Corridor 3',                  type: 'Metro',                state: 'Uttar Pradesh', district: 'Lucknow',             aiRisk: 45, centerLat: 26.846, centerLng: 80.946 },
    { id: 'UP-004', name: 'Purvanchal Expressway Widening',               type: 'Highway',              state: 'Uttar Pradesh', district: 'Azamgarh',            aiRisk: 61, centerLat: 26.065, centerLng: 83.184 },
    { id: 'UP-005', name: 'Kanpur–Lucknow Industrial Corridor',           type: 'Industrial Corridor',  state: 'Uttar Pradesh', district: 'Kanpur',              aiRisk: 50, centerLat: 26.449, centerLng: 80.344 },
    // Rajasthan (3)
    { id: 'AIR-001', name: 'Jaipur Greenfield International Airport',    type: 'Airport',              state: 'Rajasthan',     district: 'Jaipur',              aiRisk: 91, currentStage: 4, centerLat: 26.803, centerLng: 75.575, flagship: 1 },
    { id: 'RJ-001', name: 'Jaipur–Ajmer Six-Lane Highway',               type: 'Highway',              state: 'Rajasthan',     district: 'Ajmer',               aiRisk: 44, centerLat: 26.445, centerLng: 74.639 },
    { id: 'RJ-002', name: 'Jodhpur Ultra Mega Solar Park',                type: 'Power Project',        state: 'Rajasthan',     district: 'Jaisalmer',           aiRisk: 35, centerLat: 26.920, centerLng: 70.899 },
    // Maharashtra (4)
    { id: 'MH-001', name: 'Mumbai–Nagpur Samruddhi Expressway Link',     type: 'Highway',              state: 'Maharashtra',   district: 'Nashik',              aiRisk: 62, centerLat: 19.998, centerLng: 73.789 },
    { id: 'MH-002', name: 'Nagpur Metro — Phase 2',                       type: 'Metro',                state: 'Maharashtra',   district: 'Nagpur',              aiRisk: 40, centerLat: 21.145, centerLng: 79.088 },
    { id: 'MH-003', name: 'Aurangabad Industrial Corridor',               type: 'Industrial Corridor',  state: 'Maharashtra',   district: 'Chhatrapati Sambhajinagar', aiRisk: 57, centerLat: 19.876, centerLng: 75.343 },
    { id: 'MH-004', name: 'Konkan Railway Doubling Project',              type: 'Railway',              state: 'Maharashtra',   district: 'Ratnagiri',           aiRisk: 33, centerLat: 16.994, centerLng: 73.300 },
    // Gujarat (3)
    { id: 'GJ-001', name: 'Dholera SIR Smart City Phase 2',              type: 'Industrial Corridor',  state: 'Gujarat',       district: 'Ahmedabad',           aiRisk: 48, centerLat: 22.246, centerLng: 72.193 },
    { id: 'GJ-002', name: 'Dedicated Freight Corridor — Gujarat Stretch', type: 'Railway',              state: 'Gujarat',       district: 'Vadodara',            aiRisk: 36, centerLat: 22.307, centerLng: 73.181 },
    { id: 'GJ-003', name: 'Narmada Canal Extension — Phase 3',            type: 'Irrigation',           state: 'Gujarat',       district: 'Rajkot',              aiRisk: 29, centerLat: 22.303, centerLng: 70.800 },
    // Karnataka (3)
    { id: 'KA-001', name: 'Bengaluru Metro Phase 3 — Outer Ring Road',   type: 'Metro',                state: 'Karnataka',     district: 'Bengaluru Urban',     aiRisk: 55, centerLat: 12.971, centerLng: 77.594 },
    { id: 'KA-002', name: 'Vande Bharat Rail Corridor — Mysuru–KSR',     type: 'Railway',              state: 'Karnataka',     district: 'Mysuru',              aiRisk: 41, centerLat: 12.295, centerLng: 76.639 },
    { id: 'KA-003', name: 'Belagavi Cargo Terminal Expansion',            type: 'Airport',              state: 'Karnataka',     district: 'Belagavi',            aiRisk: 38, centerLat: 15.859, centerLng: 74.499 },
    // Tamil Nadu (3)
    { id: 'TN-001', name: 'Chennai–Salem Greenfield Expressway',          type: 'Highway',              state: 'Tamil Nadu',    district: 'Salem',               aiRisk: 70, centerLat: 11.664, centerLng: 78.146 },
    { id: 'TN-002', name: 'Cauvery Delta Irrigation Modernisation',        type: 'Irrigation',           state: 'Tamil Nadu',    district: 'Thanjavur',           aiRisk: 32, centerLat: 10.787, centerLng: 79.139 },
    { id: 'TN-003', name: 'Coimbatore Ring Road Bypass',                   type: 'Highway',              state: 'Tamil Nadu',    district: 'Coimbatore',          aiRisk: 44, centerLat: 11.017, centerLng: 76.966 },
    // Telangana (2)
    { id: 'TS-001', name: 'Hyderabad Outer Ring Road Expansion',           type: 'Highway',              state: 'Telangana',     district: 'Rangareddy',          aiRisk: 59, centerLat: 17.385, centerLng: 78.486 },
    { id: 'TS-002', name: 'Krishna Basin Lift Irrigation Project',          type: 'Irrigation',           state: 'Telangana',     district: 'Nalgonda',            aiRisk: 43, centerLat: 17.052, centerLng: 79.265 },
    // Andhra Pradesh (2)
    { id: 'AP-001', name: 'Bhogapuram International Airport',              type: 'Airport',              state: 'Andhra Pradesh', district: 'Vizianagaram',        aiRisk: 66, centerLat: 17.830, centerLng: 83.422 },
    { id: 'AP-002', name: 'Vizag Industrial Corridor — Phase 1',            type: 'Industrial Corridor',  state: 'Andhra Pradesh', district: 'Visakhapatnam',       aiRisk: 52, centerLat: 17.686, centerLng: 83.218 },
    // Bihar (2)
    { id: 'BR-001', name: 'Patna Ring Railway Project',                    type: 'Railway',              state: 'Bihar',         district: 'Patna',               aiRisk: 75, centerLat: 25.594, centerLng: 85.137 },
    { id: 'BR-002', name: 'Bihar Solar Grid — Gaya Phase 1',               type: 'Power Project',        state: 'Bihar',         district: 'Gaya',                aiRisk: 47, centerLat: 24.797, centerLng: 84.994 },
    // West Bengal (2)
    { id: 'WB-001', name: 'Kolkata Metro Extension — Joka Corridor',       type: 'Metro',                state: 'West Bengal',   district: 'Kolkata',             aiRisk: 53, centerLat: 22.572, centerLng: 88.363 },
    { id: 'WB-002', name: 'Bengal Industrial Township — Rajarhat',          type: 'Industrial Corridor',  state: 'West Bengal',   district: 'North 24 Parganas',   aiRisk: 49, centerLat: 22.612, centerLng: 88.472 },
    // Haryana (2)
    { id: 'HR-001', name: 'Gurugram–Faridabad Elevated Expressway',        type: 'Highway',              state: 'Haryana',       district: 'Gurugram',            aiRisk: 60, centerLat: 28.459, centerLng: 77.026 },
    { id: 'HR-002', name: 'Rewari–Rohtak Railway Doubling',                 type: 'Railway',              state: 'Haryana',       district: 'Rohtak',              aiRisk: 37, centerLat: 28.895, centerLng: 76.602 },
    // Madhya Pradesh (2)
    { id: 'MP-001', name: 'Bhopal Ring Road — Outer Bypass',               type: 'Highway',              state: 'Madhya Pradesh', district: 'Bhopal',             aiRisk: 51, centerLat: 23.259, centerLng: 77.412 },
    { id: 'MP-002', name: 'Mandsaur Textile Special Economic Zone',         type: 'Industrial Corridor',  state: 'Madhya Pradesh', district: 'Mandsaur',           aiRisk: 39, centerLat: 24.074, centerLng: 75.069 },
    // Odisha (2)
    { id: 'OD-001', name: 'Bhubaneswar Metro Rail — Phase 1',              type: 'Metro',                state: 'Odisha',        district: 'Bhubaneswar',         aiRisk: 46, centerLat: 20.296, centerLng: 85.824 },
    { id: 'OD-002', name: 'Odisha Coastal Highway — Puri to Balasore',     type: 'Highway',              state: 'Odisha',        district: 'Puri',                aiRisk: 34, centerLat: 19.810, centerLng: 85.830 },
    // Punjab (1)
    { id: 'PB-001', name: 'Amritsar–Pathankot Expressway',                 type: 'Highway',              state: 'Punjab',        district: 'Amritsar',            aiRisk: 42, centerLat: 31.634, centerLng: 74.872 },
    // Kerala (1)
    { id: 'KL-001', name: 'Thiruvananthapuram Coastal Road',                type: 'Urban Infrastructure', state: 'Kerala',        district: 'Thiruvananthapuram',  aiRisk: 40, centerLat: 8.524,  centerLng: 76.936 },
    // Assam (1)
    { id: 'AS-001', name: 'Guwahati Ring Road & Bridge Project',            type: 'Urban Infrastructure', state: 'Assam',         district: 'Kamrup',              aiRisk: 64, centerLat: 26.144, centerLng: 91.744 },
    // Jharkhand (1)
    { id: 'JH-001', name: 'Ranchi Smart City Infrastructure Corridor',       type: 'Urban Infrastructure', state: 'Jharkhand',     district: 'Ranchi',              aiRisk: 58, centerLat: 23.344, centerLng: 85.309 },
    // Chhattisgarh (1)
    { id: 'CG-001', name: 'Raipur Outer Ring Road Development',              type: 'Urban Infrastructure', state: 'Chhattisgarh',  district: 'Raipur',              aiRisk: 45, centerLat: 21.250, centerLng: 81.629 },
  ];

  // Build special AIR-001 with full stageHistory (backward compat)
  const air001Template = nonDelhiProjects.find(p => p.id === 'AIR-001');
  const air001 = makeProject({
    ...air001Template,
    landRequired: 1200, landIdentified: 1100, landVerified: 980, landAcquired: 650,
    households: 1850, compensationTotal: 18500000000,
    compensationApproved: 15840000000, compensationPaid: 10680000000,
    compensationPending: 7820000000, rrTotal: 1850, rrCompleted: 777, rrPending: 590,
    totalParcels: 3240, verifiedParcels: 2650, acquiredParcels: 1800, pendingParcels: 1440,
    documentsVerified: 1410, documentsCollected: 1620,
    compensationApproved: 1320, compensationPaid: 890,
    legalDisputes: 137, rrProgress: 42, pendingApprovals: 7,
    villages: 8, parcels: 3240, currentStage: 4, progress: 48,
    confidence: 87, expectedDelay: 204, budget: 42000,
    riskLevel: 'critical', owner: 'Anjali Verma', assignee: 'Vikram Singh',
    approver: 'Rakesh Sharma', department: 'Airports Authority of India',
    implementingAgency: 'Airports Authority of India',
    projectStatus: 'Compensation',
    startedAt: '2024-06-14', plannedCompletion: '2027-08-30',
    stageHistory: JSON.stringify([
      { stage: 1, name: 'Project Announced',         status: 'approved',    completedAt: '2024-06-14', approver: 'Union Cabinet' },
      { stage: 2, name: 'Department Assigned',       status: 'approved',    completedAt: '2024-08-02', approver: 'MoCA' },
      { stage: 3, name: 'Land Identified & Selected', status: 'approved',   completedAt: '2025-01-20', approver: 'State Cabinet' },
      { stage: 4, name: 'Land Acquisition',          status: 'in_progress', progress: 48 },
      { stage: 5, name: 'Land Cleared / Possession', status: 'locked' },
      { stage: 6, name: 'Construction Started',      status: 'locked' },
      { stage: 7, name: 'Completed',                 status: 'locked' },
    ]),
  });

  for (const tmpl of nonDelhiProjects) {
    if (tmpl.id === 'AIR-001') {
      projects.push(air001);
    } else {
      projects.push(makeProject(tmpl));
    }
  }

  // ── PADDING: additional projects to reach a realistic national scale (~76) ──
  const EXTRA_STATE_DISTRICTS = [
    ['Uttar Pradesh', 'Varanasi'], ['Uttar Pradesh', 'Agra'], ['Uttar Pradesh', 'Meerut'],
    ['Rajasthan', 'Udaipur'], ['Rajasthan', 'Bikaner'],
    ['Maharashtra', 'Pune'], ['Maharashtra', 'Aurangabad'],
    ['Gujarat', 'Surat'], ['Gujarat', 'Bhavnagar'],
    ['Karnataka', 'Hubballi'], ['Karnataka', 'Mangaluru'],
    ['Tamil Nadu', 'Madurai'], ['Tamil Nadu', 'Trichy'],
    ['Telangana', 'Warangal'],
    ['Andhra Pradesh', 'Vijayawada'],
    ['Bihar', 'Bhagalpur'],
    ['West Bengal', 'Howrah'], ['West Bengal', 'Siliguri'],
    ['Haryana', 'Faridabad'], ['Haryana', 'Panipat'],
    ['Madhya Pradesh', 'Indore'], ['Madhya Pradesh', 'Gwalior'],
    ['Odisha', 'Cuttack'],
    ['Punjab', 'Ludhiana'], ['Punjab', 'Jalandhar'],
    ['Kerala', 'Kochi'],
    ['Assam', 'Dibrugarh'],
    ['Jharkhand', 'Jamshedpur'],
  ];
  let extraSeq = 1;
  for (const [state, district] of EXTRA_STATE_DISTRICTS) {
    const type = pick(PROJECT_TYPES);
    const code = state.slice(0, 2).toUpperCase();
    projects.push(makeProject({
      id: `${code}-X${String(extraSeq++).padStart(2, '0')}`,
      name: `${district} ${type} Development Project`,
      type, state, district,
    }));
  }

  // Validate: expected national scale
  const EXPECTED_TOTAL = 5 + 3 + 40 + EXTRA_STATE_DISTRICTS.length; // 5 base Delhi + 3 added Delhi + 40 non-Delhi + padding
  if (projects.length !== EXPECTED_TOTAL) {
    console.warn(`⚠️  Expected ${EXPECTED_TOTAL} projects, got ${projects.length}`);
  }
  const delhiCount = projects.filter(p => p.state === 'Delhi').length;
  if (delhiCount < 8) {
    console.warn(`⚠️  Expected at least 8 Delhi projects, got ${delhiCount}`);
  }

  return projects;
}

// ─── PARCELS for DL-001 (Delhi demo project, for GIS) ──────────────────────
function genDL001Parcels() {
  const parcels = [];
  let idx = 0;
  DL001_VILLAGES.forEach((v) => {
    for (let i = 0; i < v.parcels; i++) {
      idx++;
      const jitter = () => (rand() - 0.5) * 0.022;
      const lat = v.center[0] + jitter();
      const lng = v.center[1] + jitter();
      const area = +(0.2 + rand() * 2.8).toFixed(2);
      const r = rand();
      let status, risk;
      if (r < 0.22)       { status = 'acquired';     risk = 'low'; }
      else if (r < 0.45)  { status = 'in_progress';  risk = 'medium'; }
      else if (r < 0.65)  { status = 'in_progress';  risk = 'high'; }
      else if (r < 0.80)  { status = 'disputed';     risk = 'critical'; }
      else                { status = 'not_started';  risk = 'medium'; }
      const legal = risk === 'critical' && rand() < 0.55;
      parcels.push({
        id: `DLP-${String(idx).padStart(5, '0')}`,
        projectId: 'DL-001',
        village: v.name, villageId: v.id,
        lat, lng, area, status, risk,
        householdId: `DLH-${String(idx).padStart(5, '0')}`,
        legalDispute: legal ? 1 : 0,
      });
    }
  });
  return parcels;
}

// ─── PARCELS for AIR-001 (legacy Rajasthan) ─────────────────────────────────
function genAIR001Parcels() {
  const parcels = [];
  let idx = 0;
  AIR001_VILLAGES.forEach((v) => {
    for (let i = 0; i < v.parcels; i++) {
      idx++;
      const jitter = () => (rand() - 0.5) * 0.028;
      const lat = v.center[0] + jitter();
      const lng = v.center[1] + jitter();
      const area = +(0.3 + rand() * 3.2).toFixed(2);
      const r = rand();
      let status, risk;
      if (r < 0.2)       { status = 'acquired';    risk = 'low'; }
      else if (r < 0.42) { status = 'in_progress'; risk = 'medium'; }
      else if (r < 0.65) { status = 'in_progress'; risk = 'high'; }
      else if (r < 0.8)  { status = 'disputed';    risk = 'critical'; }
      else               { status = 'not_started'; risk = 'medium'; }
      const legal = risk === 'critical' && rand() < 0.6;
      parcels.push({
        id: `P-${String(idx).padStart(5, '0')}`,
        projectId: 'AIR-001',
        village: v.name, villageId: v.id,
        lat, lng, area, status, risk,
        householdId: `H-${String(idx).padStart(5, '0')}`,
        legalDispute: legal ? 1 : 0,
      });
    }
  });
  return parcels;
}

// ─── HOUSEHOLDS ──────────────────────────────────────────────────────────────
function genHouseholds(parcels, prefix = 'H') {
  const surnames = ['Sharma', 'Singh', 'Kumar', 'Verma', 'Yadav', 'Gupta', 'Meena', 'Chauhan', 'Joshi', 'Tiwari', 'Choudhary', 'Patel'];
  const first = ['Ram', 'Shyam', 'Mohan', 'Kailash', 'Rajendra', 'Suresh', 'Devi', 'Sita', 'Geeta', 'Manoj', 'Anita', 'Prakash', 'Anil', 'Sunita'];
  return parcels.map((p, i) => {
    const owner = `${pick(first)} ${pick(surnames)}`;
    const docs = [
      { type: 'Title Deed',       status: pick(['Verified', 'Verified', 'Verified', 'Pending', 'Missing']) },
      { type: 'Khasra',           status: pick(['Verified', 'Verified', 'Pending', 'Rejected']) },
      { type: 'Aadhaar',          status: pick(['Verified', 'Verified', 'Verified', 'Pending']) },
      { type: 'Bank KYC',         status: pick(['Verified', 'Pending', 'Pending', 'Missing']) },
      { type: 'Encumbrance Cert', status: pick(['Verified', 'Pending', 'Rejected', 'Missing']) },
    ];
    const verified = docs.every(d => d.status === 'Verified');
    const compTotal = Math.round(p.area * (1200000 + rand() * 800000));
    const approved = i < Math.round(parcels.length * 0.72);
    const paid = i < Math.round(parcels.length * 0.48);
    return {
      id: `${prefix}-${String(i + 1).padStart(5, '0')}`,
      parcelId: p.id,
      projectId: p.projectId,
      village: p.village,
      owner, landArea: p.area, documents: docs,
      verification: verified ? 'Verified' : docs.some(d => d.status === 'Rejected') ? 'Rejected' : 'Pending',
      compensationTotal: compTotal,
      compensationApproved: approved ? compTotal : 0,
      compensationPaid: paid ? compTotal : 0,
      compensationStatus: paid ? 'Paid' : approved ? 'Approved' : 'Pending',
      legalStatus: p.legalDispute ? 'Under Dispute' : 'Clear',
      aiRisk: p.risk,
      phone: `+91 9${Math.floor(100000000 + rand() * 899999999)}`,
    };
  });
}

// ─── DEMO LANDOWNER DATA (Rajesh Kumar — DL-001 parcel) ─────────────────────
function genLandownerData(dl001Parcels, dl001Households) {
  // The landowner demo account (OFF-006, Rajesh Kumar) is linked to this specific parcel
  const ownerParcel = dl001Parcels[42]; // Pick a specific parcel
  const ownerHousehold = dl001Households[42];

  // Override with realistic landowner-specific data
  return {
    ownerId: 'OFF-006',
    parcelId: ownerParcel.id,
    householdId: ownerHousehold.id,
    projectId: 'DL-001',
    ownerName: 'Rajesh Kumar',
    surveyNumber: 'SY-2041/B',
    village: 'Najafgarh',
    district: 'South-West Delhi',
    state: 'Delhi',
    landArea: 1.24,
    landUnit: 'Hectares',
    acquisitionStage: 'Compensation',
    stageIndex: 4,
    compensationAssessed: 3840000,
    compensationApproved: 4800000,
    compensationPaid: 0,
    compensationPending: 4800000,
    compensationStatus: 'Approved',
    rrStatus: 'In Progress',
    rrEntitlement: 'Rehabilitation Assistance',
    rrExpectedDate: 'Oct 2026',
    possessionStatus: 'Pending',
    nextAction: 'Verification scheduled: 18 Sept 2026',
    notifications: [
      { id: 'N-001', msg: 'Award document is ready for collection at District Office', time: '2h ago', type: 'info' },
      { id: 'N-002', msg: 'Verification reminder: 18 Sept 2026 at 10:00 AM', time: '1d ago', type: 'warn' },
      { id: 'N-003', msg: 'Compensation of ₹4,80,000 has been approved', time: '3d ago', type: 'success' },
      { id: 'N-004', msg: 'R&R package details shared. Please review.', time: '5d ago', type: 'info' },
    ],
    grievances: [
      {
        id: 'GRV-2048',
        category: 'Compensation Dispute',
        description: 'The assessed compensation amount is lower than the prevailing market rate. Requesting review.',
        status: 'Under Review',
        createdAt: '2026-08-25',
        response: 'Your grievance has been received and forwarded to the LAO for review within 15 working days.',
      }
    ],
    documents: [
      { id: 'DOC-001', type: 'Title Deed',        status: 'Verified',  date: '2026-01-15', downloadable: true },
      { id: 'DOC-002', type: 'Khasra Nakal',      status: 'Verified',  date: '2026-01-15', downloadable: true },
      { id: 'DOC-003', type: 'Section 11 Notice', status: 'Verified',  date: '2026-03-10', downloadable: true },
      { id: 'DOC-004', type: 'Award Document',    status: 'Available', date: '2026-09-01', downloadable: true },
      { id: 'DOC-005', type: 'R&R Package',        status: 'Pending',   date: null,         downloadable: false },
    ],
  };
}

// ─── TASKS ───────────────────────────────────────────────────────────────────
function genTasks() {
  return [
    // AIR-001 tasks (Rajasthan)
    { id: 'T-1001', projectId: 'AIR-001', title: 'Ownership Verification — Bagru Kalan cluster',       officer: 'Neha Kapoor',    role: 'Revenue Officer',        progress: 40, due: '2026-11-10', priority: 'High',     status: 'In Progress', risk: 'high',     approver: 'Priya Nair',       description: 'Verify title deeds and khasra records for 260 households.' },
    { id: 'T-1002', projectId: 'AIR-001', title: 'Resolve pending legal disputes',                       officer: 'Arun Mehta',     role: 'Legal Officer',          progress: 22, due: '2026-12-05', priority: 'Critical', status: 'In Progress', risk: 'critical', approver: 'Priya Nair',       description: 'Address 137 pending disputes in fast-track court.' },
    { id: 'T-1003', projectId: 'AIR-001', title: 'Accelerate compensation disbursement — Batch 4',      officer: 'Vikram Singh',   role: 'Project Manager',        progress: 65, due: '2026-10-30', priority: 'High',     status: 'In Progress', risk: 'medium',   approver: 'Rakesh Sharma',    description: 'Disburse compensation to 430 approved households.' },
    { id: 'T-1004', projectId: 'AIR-001', title: 'R&R package rollout — Newta village',                  officer: 'Sunita Yadav',   role: 'R&R Officer',            progress: 18, due: '2026-11-25', priority: 'Medium',   status: 'Not Started', risk: 'high',     approver: 'Priya Nair',       description: 'Deliver R&R package to displaced households.' },
    { id: 'T-1005', projectId: 'AIR-001', title: 'Field survey — Sanwalka disputed parcels',             officer: 'Deepa Iyer',     role: 'Field Officer',          progress: 80, due: '2026-10-15', priority: 'High',     status: 'Submitted',   risk: 'medium',   approver: 'Vikram Singh',     description: 'Re-survey 84 disputed parcels; validate GPS boundaries.' },
    // DL-001 tasks (Delhi Ring Road)
    { id: 'T-2001', projectId: 'DL-001',  title: 'GPS Geo-tagging — Najafgarh Sector A',                 officer: 'Deepa Kapoor',   role: 'Field Officer',          progress: 55, due: '2026-10-20', priority: 'High',     status: 'In Progress', risk: 'medium',   approver: 'Priya Sharma',     description: 'GPS tag 280 parcels in Najafgarh Sector A.' },
    { id: 'T-2002', projectId: 'DL-001',  title: 'Owner Verification — Dhansa cluster',                  officer: 'Neha Kapoor',    role: 'Revenue Officer',        progress: 35, due: '2026-11-05', priority: 'High',     status: 'In Progress', risk: 'high',     approver: 'Priya Sharma',     description: 'Verify ownership documents for 240 parcels in Dhansa.' },
    { id: 'T-2003', projectId: 'DL-001',  title: 'Compensation disbursement — Batch 1',                  officer: 'Vikram Malhotra',role: 'Project Manager',        progress: 70, due: '2026-10-25', priority: 'Critical', status: 'In Progress', risk: 'high',     approver: 'Suresh Mehta',     description: 'Release first batch of approved compensation payments.' },
    { id: 'T-2004', projectId: 'DL-001',  title: 'Legal dispute resolution — Rewla Khanpur',             officer: 'Arun Mehta',     role: 'Legal Officer',          progress: 15, due: '2026-12-10', priority: 'Critical', status: 'Not Started', risk: 'critical', approver: 'Suresh Mehta',     description: 'Mediate 42 disputed parcels in Rewla Khanpur.' },
    { id: 'T-2005', projectId: 'DL-001',  title: 'R&R camp — Malikpur & Goela Khurd',                    officer: 'Sunita Yadav',   role: 'R&R Officer',            progress: 45, due: '2026-11-15', priority: 'Medium',   status: 'In Progress', risk: 'medium',   approver: 'Priya Sharma',     description: 'Conduct R&R awareness and benefit camps.' },
    { id: 'T-2006', projectId: 'DL-001',  title: 'Landowner Rajesh Kumar — Verification Visit',          officer: 'Deepa Kapoor',   role: 'Field Officer',          progress: 0,  due: '2026-09-18', priority: 'Medium',   status: 'Pending',     risk: 'low',      approver: 'Priya Sharma',     description: 'Schedule and complete verification visit for parcel DLP-00043.' },
    // Other state tasks
    { id: 'T-3001', projectId: 'UP-001',  title: 'Environmental clearance follow-up — Jewar Airport',    officer: 'Arun Mehta',     role: 'Legal Officer',          progress: 30, due: '2026-11-30', priority: 'High',     status: 'In Progress', risk: 'high',     approver: 'Anjali Verma',     description: 'Coordinate with MoEFCC for pending clearances.' },
    { id: 'T-3002', projectId: 'MH-001',  title: 'Boundary marking — NH-753 KM 42–48',                   officer: 'Rakesh Sharma',  role: 'State Administrator',    progress: 55, due: '2026-11-01', priority: 'Medium',   status: 'In Progress', risk: 'medium',   approver: 'Anjali Verma',     description: 'Complete boundary demarcation along 6 km stretch.' },
    { id: 'T-3003', projectId: 'KA-001',  title: 'Public consultation — ORR Metro Corridor',              officer: 'Priya Nair',     role: 'District Administrator', progress: 100,due: '2026-09-20', priority: 'High',     status: 'Submitted',   risk: 'low',      approver: 'Anjali Verma',     description: 'Consult 8 RWAs along Outer Ring Road Metro Corridor.' },
  ];
}

// ─── AUDIT LOG ───────────────────────────────────────────────────────────────
function genAudit() {
  return [
    { id: 'A-9030', ts: '2026-09-12 10:15', actor: 'System',          action: 'AI prediction generated',  target: 'DL-001',   detail: 'Risk 78% · Delay 112 days · Confidence 82%' },
    { id: 'A-9029', ts: '2026-09-12 09:44', actor: 'Suresh Mehta',    action: 'Project status updated',   target: 'DL-001',   detail: 'Status moved to Compensation stage' },
    { id: 'A-9028', ts: '2026-09-11 16:30', actor: 'Vikram Malhotra', action: 'Task created',              target: 'T-2003',   detail: 'Compensation disbursement Batch 1 assigned' },
    { id: 'A-9027', ts: '2026-09-11 14:22', actor: 'Deepa Kapoor',    action: 'GPS tagging completed',     target: 'DL-001',   detail: 'Sector A: 168/280 parcels geo-tagged' },
    { id: 'A-9026', ts: '2026-09-10 11:05', actor: 'Neha Kapoor',     action: 'Documents verified',        target: 'DLH-00043',detail: 'Rajesh Kumar — all 5 documents verified' },
    { id: 'A-9025', ts: '2026-09-09 17:15', actor: 'System',          action: 'Grievance received',        target: 'GRV-2048', detail: 'Rajesh Kumar — Compensation Dispute' },
    { id: 'A-9024', ts: '2026-09-09 09:00', actor: 'System',          action: 'Notification sent',         target: 'OFF-006',  detail: 'Compensation approval: ₹4,80,000' },
    { id: 'A-9023', ts: '2026-09-08 14:33', actor: 'Anjali Verma',    action: 'National KPI review',       target: 'National', detail: '45 projects reviewed; 4 critical flags raised' },
    { id: 'A-9022', ts: '2026-09-07 11:20', actor: 'System',          action: 'Risk recalculated',         target: 'AIR-001',  detail: '93% → 91% · Delay unchanged at 204 days' },
    { id: 'A-9021', ts: '2026-09-05 09:12', actor: 'System',          action: 'AI prediction generated',  target: 'AIR-001',  detail: 'Risk 91% · Delay 204 days · Confidence 87%' },
    { id: 'A-9020', ts: '2026-09-05 09:12', actor: 'System',          action: 'Recommendation generated', target: 'AIR-001',  detail: '4 interventions suggested' },
    { id: 'A-9019', ts: '2026-09-04 17:44', actor: 'Anjali Verma',    action: 'Task assigned',             target: 'T-1002',   detail: 'Assigned to Arun Mehta' },
    { id: 'A-9018', ts: '2026-09-04 15:02', actor: 'Vikram Singh',    action: 'Progress updated',          target: 'T-1003',   detail: '55% → 65%' },
  ];
}

// ─── RECOMMENDATIONS ─────────────────────────────────────────────────────────
function genRecommendations() {
  return [
    { id: 'R-01', projectId: 'AIR-001', title: 'Resolve 137 pending legal disputes',             detail: 'Deploy dedicated fast-track court and mediation cell across 4 villages.',           impactDays: 52, priority: 'Critical', action: 'Assign Legal Team', ownerRole: 'Legal Officer' },
    { id: 'R-02', projectId: 'AIR-001', title: 'Increase document verification capacity',         detail: 'Add 12 verification desks; parallelise khasra + title-deed workflows.',              impactDays: 31, priority: 'High',     action: 'Create Task',      ownerRole: 'Revenue Officer' },
    { id: 'R-03', projectId: 'AIR-001', title: 'Accelerate compensation processing',              detail: 'Enable DBT rails; clear 430 approved-but-unpaid cases in 21 days.',                  impactDays: 24, priority: 'High',     action: 'View Cases',       ownerRole: 'LAO' },
    { id: 'R-04', projectId: 'AIR-001', title: 'Strengthen R&R rollout in Newta and Sanwalka',   detail: 'Deploy field R&R teams; targeted grievance camps twice weekly.',                      impactDays: 18, priority: 'Medium',   action: 'Create Task',      ownerRole: 'R&R Officer' },
    { id: 'R-05', projectId: 'DL-001',  title: 'Fast-track Rewla Khanpur dispute resolution',    detail: 'Engage Senior Advocate; prioritise 42 critical land dispute hearings.',               impactDays: 38, priority: 'Critical', action: 'Assign Legal Team', ownerRole: 'Legal Officer' },
    { id: 'R-06', projectId: 'DL-001',  title: 'Accelerate compensation — Batch 1 release',      detail: 'Release ₹4.2 Cr pending compensation to 312 approved landowners within 7 days.',     impactDays: 28, priority: 'High',     action: 'View Cases',       ownerRole: 'LAO' },
    { id: 'R-07', projectId: 'DL-001',  title: 'Increase GPS tagging field teams by 3',          detail: 'Current tagging speed insufficient; adding 3 teams will halve pending backlog.',       impactDays: 21, priority: 'High',     action: 'Create Task',      ownerRole: 'Field Officer' },
    { id: 'R-08', projectId: 'UP-001',  title: 'Environmental clearance — escalation required',  detail: 'MoEFCC clearance delayed by 45 days. Escalate to Joint Secretary level.',              impactDays: 45, priority: 'Critical', action: 'Escalate',         ownerRole: 'Legal Officer' },
    { id: 'R-09', projectId: 'TN-001',  title: 'Community consultation — Salem segment',          detail: 'Hold 3 public hearings in Salem District to address farmer concerns.',                 impactDays: 15, priority: 'Medium',   action: 'Create Task',      ownerRole: 'District Administrator' },
  ];
}

// ─── ANALYTICS METADATA ───────────────────────────────────────────────────────
function genAnalytics(projects) {
  const DELAY_DRIVERS = [
    { name: 'Compensation Backlog', value: 28, color: '#EF4444' },
    { name: 'Legal Disputes',       value: 22, color: '#F59E0B' },
    { name: 'R&R Progress',         value: 18, color: '#F97316' },
    { name: 'Pending Approvals',    value: 13, color: '#B87333' },
    { name: 'Documentation',        value: 8,  color: '#8B5CF6' },
    { name: 'Other',                value: 11, color: '#64748B' },
  ];

  const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
  const RISK_TREND = months.map((month, i) => ({
    month, national: 55 + Math.round(Math.sin(i / 2) * 8) + i, critical: 50 + i * 3,
  }));
  const COMPENSATION_TREND = months.map((month, i) => ({
    month, approved: 60 + i * 8, paid: 40 + i * 7,
  }));
  const STAGE_PERFORMANCE = [
    { stage: 'S1', label: 'Announced',   avgDays: 22,  delayed: 4   },
    { stage: 'S2', label: 'Assigned',    avgDays: 41,  delayed: 9   },
    { stage: 'S3', label: 'Identified',  avgDays: 87,  delayed: 18  },
    { stage: 'S4', label: 'Acquisition', avgDays: 212, delayed: 126 },
    { stage: 'S5', label: 'Possession',  avgDays: 74,  delayed: 33  },
    { stage: 'S6', label: 'Construction',avgDays: 398, delayed: 82  },
    { stage: 'S7', label: 'Completed',   avgDays: 41,  delayed: 7   },
  ];

  // Per-state aggregate from actual project data
  const stateMap = {};
  projects.forEach(p => {
    if (!stateMap[p.state]) stateMap[p.state] = { projects: 0, totalRisk: 0, code: '' };
    stateMap[p.state].projects++;
    stateMap[p.state].totalRisk += p.aiRisk;
  });
  const STATE_RISK = STATES.map(s => ({
    state: s.name, code: s.code,
    risk: stateMap[s.name] ? Math.round(stateMap[s.name].totalRisk / stateMap[s.name].projects) : 35,
    projects: stateMap[s.name] ? stateMap[s.name].projects : 0,
  }));

  return { DELAY_DRIVERS, RISK_TREND, COMPENSATION_TREND, STAGE_PERFORMANCE, STATE_RISK };
}

// ─── NOTIFICATIONS (for all roles) ───────────────────────────────────────────
function genNotifications() {
  return [
    // Ministry
    { id: 'NOTIF-001', userId: 'OFF-001', role: 'Ministry Administrator', projectId: 'DL-005', title: 'Critical Risk Alert', message: 'DL-005 Delhi Logistics Hub risk score crossed 80%. Immediate intervention recommended.', type: 'critical', createdAt: '2026-09-12 08:30', read: 0 },
    { id: 'NOTIF-002', userId: 'OFF-001', role: 'Ministry Administrator', projectId: 'AIR-001', title: 'National KPI Update', message: 'Monthly KPI report ready. 45 projects tracked, 6 critical, 8 high risk.', type: 'info', createdAt: '2026-09-10 09:00', read: 0 },
    // State (Delhi)
    { id: 'NOTIF-003', userId: 'OFF-002', role: 'State Administrator', projectId: 'DL-001', title: 'Compensation Milestone', message: 'DL-001 Ring Road: 312 landowners approved for compensation disbursement.', type: 'success', createdAt: '2026-09-11 14:00', read: 0 },
    { id: 'NOTIF-004', userId: 'OFF-002', role: 'State Administrator', projectId: 'DL-004', title: 'Legal Dispute Escalation', message: 'DL-004 Najafgarh project: 15 new legal disputes filed. Legal review required.', type: 'warning', createdAt: '2026-09-09 16:00', read: 0 },
    // District
    { id: 'NOTIF-005', userId: 'OFF-003', role: 'District Administrator', projectId: 'DL-001', title: 'Verification Visit Scheduled', message: 'GPS verification visit scheduled for Najafgarh Sector A on 15 Sept.', type: 'info', createdAt: '2026-09-08 10:00', read: 0 },
    // Project Manager
    { id: 'NOTIF-006', userId: 'OFF-004', role: 'Project Manager', projectId: 'DL-001', title: 'Task Overdue Alert', message: 'Task T-2004 (Legal Dispute Resolution) is overdue. Immediate action required.', type: 'warning', createdAt: '2026-09-12 07:00', read: 0 },
    // Field Officer
    { id: 'NOTIF-007', userId: 'OFF-005', role: 'Field Officer', projectId: 'DL-001', title: 'Today\'s Visits', message: '4 parcel visits scheduled for today. First visit at 09:30 AM — Najafgarh Sector A.', type: 'info', createdAt: '2026-09-12 08:00', read: 0 },
    // Landowner
    { id: 'NOTIF-008', userId: 'OFF-006', role: 'Landowner', projectId: 'DL-001', title: 'Compensation Approved', message: 'Your compensation of ₹4,80,000 has been approved. Payment will be processed within 15 days.', type: 'success', createdAt: '2026-09-09 09:00', read: 0 },
    { id: 'NOTIF-009', userId: 'OFF-006', role: 'Landowner', projectId: 'DL-001', title: 'Verification Visit Reminder', message: 'Verification visit scheduled: 18 September 2026 at 10:00 AM at your parcel site.', type: 'warning', createdAt: '2026-09-11 09:00', read: 0 },
    { id: 'NOTIF-010', userId: 'OFF-006', role: 'Landowner', projectId: 'DL-001', title: 'Award Document Ready', message: 'Your land award document is ready for collection at the District Office, South-West Delhi.', type: 'info', createdAt: '2026-09-12 08:00', read: 0 },
  ];
}

// ─── GRIEVANCES ───────────────────────────────────────────────────────────────
function genGrievances() {
  return [
    {
      id: 'GRV-2048',
      ownerId: 'OFF-006',
      ownerName: 'Rajesh Kumar',
      projectId: 'DL-001',
      parcelId: 'DLP-00043',
      category: 'Compensation Dispute',
      description: 'The assessed compensation amount of ₹38,40,000 is significantly lower than the prevailing market rate of ₹55,00,000 per hectare. Requesting review and upward revision.',
      status: 'Under Review',
      createdAt: '2026-08-25',
      response: 'Your grievance has been received (GRV-2048) and forwarded to the Land Acquisition Officer for review. You will receive a response within 15 working days.',
      respondedAt: '2026-08-26',
    },
    {
      id: 'GRV-2049',
      ownerId: 'OFF-011',
      ownerName: 'Ravi Kumar',
      projectId: 'AIR-001',
      parcelId: 'P-00084',
      category: 'Documentation Issue',
      description: 'Title deed rejected due to mismatch in survey number. The original revenue record shows correct survey number SY-1248. Please verify.',
      status: 'Resolved',
      createdAt: '2026-07-15',
      response: 'Survey confirmed. Title deed has been accepted. Documentation updated in system.',
      respondedAt: '2026-07-28',
    },
  ];
}

// ─── DOCUMENTS ────────────────────────────────────────────────────────────────
function genDocuments() {
  return [
    // Landowner documents (Rajesh Kumar — DL-001)
    { id: 'DOC-001', ownerId: 'OFF-006', projectId: 'DL-001', parcelId: 'DLP-00043', type: 'Title Deed',        status: 'Verified',  uploadedAt: '2026-01-15', verifiedAt: '2026-02-01', description: 'Original title deed for parcel DLP-00043, Najafgarh' },
    { id: 'DOC-002', ownerId: 'OFF-006', projectId: 'DL-001', parcelId: 'DLP-00043', type: 'Khasra Nakal',      status: 'Verified',  uploadedAt: '2026-01-15', verifiedAt: '2026-02-01', description: 'Revenue record — Khasra Nakal, Village Najafgarh' },
    { id: 'DOC-003', ownerId: 'OFF-006', projectId: 'DL-001', parcelId: 'DLP-00043', type: 'Section 11 Notice', status: 'Verified',  uploadedAt: '2026-03-10', verifiedAt: '2026-03-10', description: 'LA Act Section 11 notification issued and acknowledged' },
    { id: 'DOC-004', ownerId: 'OFF-006', projectId: 'DL-001', parcelId: 'DLP-00043', type: 'Award Document',    status: 'Available', uploadedAt: '2026-09-01', verifiedAt: null,          description: 'Compensation award document ready for collection' },
    { id: 'DOC-005', ownerId: 'OFF-006', projectId: 'DL-001', parcelId: 'DLP-00043', type: 'R&R Package',        status: 'Pending',   uploadedAt: null,          verifiedAt: null,          description: 'R&R entitlement package — pending preparation' },
    // Project documents
    { id: 'DOC-010', ownerId: null, projectId: 'DL-001', parcelId: null, type: 'Environmental Impact Report', status: 'Verified', uploadedAt: '2025-06-01', verifiedAt: '2025-08-15', description: 'EIA for Delhi Ring Road Phase 4' },
    { id: 'DOC-011', ownerId: null, projectId: 'DL-001', parcelId: null, type: 'Social Impact Assessment',    status: 'Verified', uploadedAt: '2025-07-20', verifiedAt: '2025-09-10', description: 'SIA report — 1,240 affected families' },
    { id: 'DOC-012', ownerId: null, projectId: 'AIR-001', parcelId: null, type: 'Cabinet Approval',           status: 'Verified', uploadedAt: '2024-06-14', verifiedAt: '2024-06-14', description: 'Union Cabinet approval for Jaipur Greenfield Airport' },
  ];
}

// ─── R&R RECORDS ──────────────────────────────────────────────────────────────
function genRRRecords(dl001Households) {
  const records = [];
  // Landowner's own R&R record
  records.push({
    id: 'RR-001',
    householdId: 'DLH-00043',
    ownerId: 'OFF-006',
    ownerName: 'Rajesh Kumar',
    projectId: 'DL-001',
    entitlement: 'Rehabilitation Assistance + Subsistence Allowance',
    assistanceType: 'Financial',
    amount: 120000,
    status: 'In Progress',
    rehabilitationStatus: 'Pending',
    resettlementStatus: 'Not Required',
    createdAt: '2026-05-15',
    updatedAt: '2026-09-01',
  });

  // Batch R&R records for Delhi
  dl001Households.slice(0, 50).forEach((h, i) => {
    records.push({
      id: `RR-${String(i + 2).padStart(3, '0')}`,
      householdId: h.id,
      ownerId: null,
      ownerName: h.owner,
      projectId: 'DL-001',
      entitlement: pick(['Rehabilitation Assistance', 'Resettlement Package', 'Livelihood Support', 'Housing Allowance']),
      assistanceType: pick(['Financial', 'Housing', 'Employment']),
      amount: rInt(80000, 500000),
      status: pick(['Pending', 'Approved', 'In Progress', 'Completed']),
      rehabilitationStatus: pick(['Pending', 'In Progress', 'Completed']),
      resettlementStatus: pick(['Not Required', 'Pending', 'Completed']),
      createdAt: '2026-04-01',
      updatedAt: '2026-09-01',
    });
  });
  return records;
}

// ─── COMPENSATION RECORDS ─────────────────────────────────────────────────────
function genCompensationRecords(dl001Parcels, dl001Households) {
  const records = [];
  // Landowner's own compensation record
  records.push({
    id: 'COMP-001',
    projectId: 'DL-001',
    parcelId: 'DLP-00043',
    ownerId: 'OFF-006',
    ownerName: 'Rajesh Kumar',
    householdId: 'DLH-00043',
    assessedAmount: 3840000,
    approvedAmount: 4800000,
    paidAmount: 0,
    pendingAmount: 4800000,
    status: 'Approved',
    approvalDate: '2026-09-01',
    paymentDate: null,
    remarks: 'Approved by LAO. Payment pending DBT transfer.',
  });

  // Batch compensation records for Delhi
  dl001Households.slice(0, 60).forEach((h, i) => {
    const parcel = dl001Parcels[i];
    if (!parcel) return;
    const assessed = Math.round(parcel.area * 1200000);
    const approved = Math.round(assessed * rFloat(0.9, 1.2));
    const paid = i < 35 ? approved : 0;
    records.push({
      id: `COMP-${String(i + 2).padStart(3, '0')}`,
      projectId: 'DL-001',
      parcelId: parcel.id,
      ownerId: null,
      ownerName: h.owner,
      householdId: h.id,
      assessedAmount: assessed,
      approvedAmount: approved,
      paidAmount: paid,
      pendingAmount: approved - paid,
      status: paid > 0 ? 'Paid' : approved > 0 ? 'Approved' : 'Under Review',
      approvalDate: approved > 0 ? '2026-08-15' : null,
      paymentDate: paid > 0 ? '2026-09-01' : null,
      remarks: '',
    });
  });
  return records;
}

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────
function generateAll() {
  const PROJECTS = genProjects();
  const AIR001_PARCELS = genAIR001Parcels();
  const DL001_PARCELS  = genDL001Parcels();
  const PARCELS = [...AIR001_PARCELS, ...DL001_PARCELS];

  const AIR001_HOUSEHOLDS = genHouseholds(AIR001_PARCELS.slice(0, 1850), 'H');
  const DL001_HOUSEHOLDS  = genHouseholds(DL001_PARCELS.slice(0, 660),   'DLH');

  const LANDOWNER_DATA    = genLandownerData(DL001_PARCELS, DL001_HOUSEHOLDS);
  const NOTIFICATIONS     = genNotifications();
  const GRIEVANCES        = genGrievances();
  const DOCUMENTS         = genDocuments();
  const RR_RECORDS        = genRRRecords(DL001_HOUSEHOLDS);
  const COMP_RECORDS      = genCompensationRecords(DL001_PARCELS, DL001_HOUSEHOLDS);

  const TASKS             = genTasks();
  const AUDIT             = genAudit();
  const RECOMMENDATIONS   = genRecommendations();

  const analytics         = genAnalytics(PROJECTS);

  // Aggregate comp summary from households
  const allHouseholds = [...AIR001_HOUSEHOLDS, ...DL001_HOUSEHOLDS];
  const COMP_SUMMARY = {
    total:       allHouseholds.length,
    approved:    allHouseholds.filter(h => h.compensationApproved > 0).length,
    paid:        allHouseholds.filter(h => h.compensationPaid > 0).length,
    pending:     allHouseholds.filter(h => h.compensationPaid === 0).length,
    totalAmount: allHouseholds.reduce((a, h) => a + h.compensationTotal, 0),
  };

  return {
    STATES, PROJECT_TYPES, OFFICERS,
    AIR001_VILLAGES, DL001_VILLAGES,
    PROJECTS, PARCELS,
    AIR001_HOUSEHOLDS, DL001_HOUSEHOLDS, HOUSEHOLDS: AIR001_HOUSEHOLDS, // backward compat
    LANDOWNER_DATA, NOTIFICATIONS, GRIEVANCES, DOCUMENTS,
    RR_RECORDS, COMP_RECORDS,
    TASKS, AUDIT, RECOMMENDATIONS, COMP_SUMMARY,
    ...analytics,
  };
}

module.exports = { generateAll };
