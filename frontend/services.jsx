/* BHUMI-SETU — Services layer.
 * Reads come from window.BS_DATA (a local cache populated once at login via
 * GET /api/bootstrap). Writes update that local cache immediately for a snappy
 * UI, AND persist to the real Express + SQLite backend via apiSync(). This
 * keeps every existing page/component working unmodified while the app is
 * now backed by a genuine, persistent, multi-user database.
 */

// -------- Minimal pub/sub store ----------
const listeners = new Set();
function emit(){ listeners.forEach(l => l()); }
function subscribe(fn){ listeners.add(fn); return () => listeners.delete(fn); }

function useStore(){
  const [, setV] = React.useState(0);
  React.useEffect(() => subscribe(() => setV(v => v+1)), []);
  return window.BS_DATA;
}

// -------- Project service ----------
const projectService = {
  getProjects(filter={}){
    let list = window.BS_DATA.PROJECTS.slice();
    if(filter.state) list = list.filter(p => p.state === filter.state);
    if(filter.type)  list = list.filter(p => p.type === filter.type);
    if(filter.risk)  list = list.filter(p => p.riskLevel === filter.risk);
    if(filter.q){
      const q = filter.q.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q));
    }
    return list;
  },
  getProject(id){ return window.BS_DATA.PROJECTS.find(p => p.id === id); },
  createProject(payload){
    const id = payload.type.slice(0,3).toUpperCase() + '-' + Math.floor(1000+Math.random()*8999);
    const proj = {
      ...payload, id,
      currentStage: 1, progress: 5,
      aiRisk: 35, riskLevel:'medium', confidence: 78, expectedDelay: 20,
      landAcquired: 0, documentsVerified:0, documentsCollected:0,
      compensationApproved:0, compensationPaid:0, legalDisputes:0,
      rrProgress:0, pendingApprovals:0, simulatedRisk:null,
      stageHistory: null,
      center:[22, 78],
    };
    window.BS_DATA.PROJECTS.unshift(proj);
    auditService.log('Project created', proj.id, `${proj.name} · ${proj.state}`);
    emit();
    apiSync('/projects', { method:'POST', body: JSON.stringify(proj) });
    return proj;
  },
  approveStage(projectId, stage){
    const p = window.BS_DATA.PROJECTS.find(x => x.id === projectId);
    if(!p) return;
    if(p.stageHistory){
      const s = p.stageHistory.find(x => x.stage === stage);
      if(s){ s.status='approved'; s.completedAt = new Date().toISOString().slice(0,10); s.approver = window.BS_STATE?.user?.name || 'Approver'; }
      const next = p.stageHistory.find(x => x.stage === stage+1);
      if(next){ next.status='in_progress'; next.progress = 5; }
    }
    p.currentStage = Math.min(7, stage + 1);
    p.progress = Math.min(100, p.progress + 12);
    p.aiRisk = Math.max(30, p.aiRisk - 14);
    if(p.aiRisk >= 80) p.riskLevel='critical'; else if(p.aiRisk >= 65) p.riskLevel='high'; else if(p.aiRisk >= 45) p.riskLevel='medium'; else p.riskLevel='low';
    auditService.log('Stage approved', `${projectId} · Stage ${stage}`, `Stage ${stage+1} unlocked · Risk ↓ to ${p.aiRisk}%`);
    emit();
    apiSync(`/projects/${projectId}/approve-stage`, { method:'POST', body: JSON.stringify({ stage }) });
  },
  rejectStage(projectId, stage, reason){
    auditService.log('Stage rejected', `${projectId} · Stage ${stage}`, reason || 'Rejected pending revisions');
    emit();
    apiSync(`/projects/${projectId}/reject-stage`, { method:'POST', body: JSON.stringify({ stage, reason }) });
  },
  submitStage(projectId, stage){
    auditService.log('Stage submitted', `${projectId} · Stage ${stage}`, 'Awaiting approver review');
    emit();
    apiSync(`/projects/${projectId}/submit-stage`, { method:'POST', body: JSON.stringify({ stage }) });
  },
};

// -------- Prediction service (mock ML — swap for a real model endpoint later) ----------
const predictionService = {
  getRiskPrediction(projectId){
    const p = projectService.getProject(projectId);
    if(!p) return null;
    return {
      delay_probability: p.aiRisk,
      simulated_probability: p.simulatedRisk,
      expected_delay_days: p.expectedDelay,
      risk_level: p.riskLevel,
      confidence: p.confidence,
      model: 'XGBoost v2.4 · gradient boosted trees',
      updated: '2026-09-05 09:12',
      drivers: window.BS_DATA.DELAY_DRIVERS,
    };
  },
  getRecommendations(projectId){
    return window.BS_DATA.RECOMMENDATIONS.filter(r => r.projectId === projectId);
  },
  runSimulation(projectId, inputs){
    const p = projectService.getProject(projectId);
    if(!p) return null;
    const base = p.aiRisk;
    let reduction = 0;
    reduction += (inputs.verificationStaff||0) * 1.5;
    reduction += (inputs.legalTeams||0)       * 4.0;
    reduction += (inputs.compensationBoost||0)* 0.9;
    reduction += (inputs.fieldTeams||0)       * 1.1;
    const simulated = Math.max(20, Math.round(base - reduction));
    const delayReduction = Math.round((base - simulated) * 2.7);
    p.simulatedRisk = simulated;
    auditService.log('Simulation run', projectId, `Base ${base}% → Sim ${simulated}% · Δ delay -${delayReduction}d`);
    emit();
    apiSync(`/predictions/${projectId}/simulate`, { method:'POST', body: JSON.stringify(inputs) });
    return {
      base_risk: base,
      simulated_risk: simulated,
      risk_reduction: base - simulated,
      delay_reduction_days: delayReduction,
      confidence: 84,
    };
  },
  applySimulation(projectId){
    const p = projectService.getProject(projectId);
    if(!p || p.simulatedRisk == null) return;
    p.aiRisk = p.simulatedRisk;
    p.expectedDelay = Math.max(20, p.expectedDelay - 60);
    p.simulatedRisk = null;
    if(p.aiRisk >= 80) p.riskLevel='critical'; else if(p.aiRisk >= 65) p.riskLevel='high'; else if(p.aiRisk >= 45) p.riskLevel='medium'; else p.riskLevel='low';
    auditService.log('Risk recalculated', projectId, `New risk locked in at ${p.aiRisk}%`);
    emit();
    apiSync(`/predictions/${projectId}/apply`, { method:'POST' });
  },
};

// -------- GIS service ----------
const gisService = {
  getParcels(projectId){
    const all = (window.BS_DATA && window.BS_DATA.PARCELS) || [];
    if (!projectId) return all;
    const match = all.filter(p => p.projectId === projectId);
    if (match.length > 0) return match;

    // If projectId is DL-001 and no filtered match, look for DLP- prefix
    if (projectId === 'DL-001') {
      const dlp = all.filter(p => p.id && p.id.startsWith('DLP-'));
      if (dlp.length > 0) return dlp;
    }

    // Fallback: return up to 150 parcels from memory if available
    return all.slice(0, 150);
  },
  getVillages(projectId){
    if (projectId === 'DL-001' || (projectId && projectId.startsWith('DL'))) {
      return [
        { id: 'DLV-01', name: 'Najafgarh',     center: [28.609, 76.978], parcels: 280, households: 160 },
        { id: 'DLV-02', name: 'Dhansa',        center: [28.595, 76.991], parcels: 240, households: 140 },
        { id: 'DLV-03', name: 'Rewla Khanpur', center: [28.622, 77.001], parcels: 210, households: 120 },
        { id: 'DLV-04', name: 'Goela Khurd',   center: [28.584, 77.015], parcels: 190, households: 110 },
        { id: 'DLV-05', name: 'Malikpur',      center: [28.611, 77.030], parcels: 220, households: 130 },
      ];
    }
    if (projectId === 'AIR-001' && window.BS_DATA && window.BS_DATA.AIR001_VILLAGES) {
      return window.BS_DATA.AIR001_VILLAGES;
    }
    const parcels = this.getParcels(projectId);
    const vMap = {};
    parcels.forEach(p => {
      if (!p.village) return;
      if (!vMap[p.village]) vMap[p.village] = { name: p.village, lats: [], lngs: [] };
      vMap[p.village].lats.push(p.lat);
      vMap[p.village].lngs.push(p.lng);
    });
    const vList = Object.entries(vMap).map(([name, v], i) => ({
      id: 'V-' + (i + 1),
      name: v.name,
      center: [
        v.lats.reduce((a, b) => a + b, 0) / v.lats.length,
        v.lngs.reduce((a, b) => a + b, 0) / v.lngs.length,
      ],
      parcels: v.lats.length,
      households: Math.round(v.lats.length * 0.6),
    }));
    return vList.length > 0 ? vList : (window.BS_DATA && window.BS_DATA.AIR001_VILLAGES) || [];
  },
  getHouseholdByParcel(parcelId){
    const hh = (window.BS_DATA && window.BS_DATA.HOUSEHOLDS) || [];
    return hh.find(h => h.parcelId === parcelId);
  },
};

// -------- Task service ----------
const taskService = {
  list(filter={}){
    let t = window.BS_DATA.TASKS.slice();
    if(filter.projectId) t = t.filter(x => x.projectId === filter.projectId);
    if(filter.status)    t = t.filter(x => x.status === filter.status);
    if(filter.officer)   t = t.filter(x => x.officer === filter.officer);
    return t;
  },
  create(task){
    const id = 'T-' + (1100 + window.BS_DATA.TASKS.length);
    const t = { id, status:'Not Started', progress:0, evidence:[], ...task };
    window.BS_DATA.TASKS.unshift(t);
    auditService.log('Task created', id, `${t.title} → ${t.officer}`);
    emit();
    apiSync('/tasks', { method:'POST', body: JSON.stringify(t) });
    return t;
  },
  updateProgress(id, progress){
    const t = window.BS_DATA.TASKS.find(x => x.id === id);
    if(!t) return;
    const old = t.progress;
    t.progress = progress;
    if(progress >= 100){ t.status = 'Submitted'; }
    else if(progress > 0){ t.status = 'In Progress'; }
    auditService.log('Progress updated', id, `${old}% → ${progress}%`);
    emit();
    apiSync(`/tasks/${id}/progress`, { method:'PATCH', body: JSON.stringify({ progress }) });
  },
  setStatus(id, status){
    const t = window.BS_DATA.TASKS.find(x => x.id === id);
    if(!t) return;
    t.status = status;
    auditService.log(`Task ${status.toLowerCase()}`, id, t.title);
    emit();
    apiSync(`/tasks/${id}/status`, { method:'PATCH', body: JSON.stringify({ status }) });
  },
  assign(id, officer){
    const t = window.BS_DATA.TASKS.find(x => x.id === id);
    if(!t) return;
    t.officer = officer;
    auditService.log('Task reassigned', id, `Assigned to ${officer}`);
    emit();
    apiSync(`/tasks/${id}/assign`, { method:'PATCH', body: JSON.stringify({ officer }) });
  },
};

// -------- Analytics ----------
const analyticsService = {
  stateRisk(){ return window.BS_DATA.STATE_RISK; },
  riskTrend(){ return window.BS_DATA.RISK_TREND; },
  compensationTrend(){ return window.BS_DATA.COMPENSATION_TREND; },
  stagePerformance(){ return window.BS_DATA.STAGE_PERFORMANCE; },
  delayDrivers(){ return window.BS_DATA.DELAY_DRIVERS; },
  kpis(){
    const P = window.BS_DATA.PROJECTS;
    const total = P.length;
    const critical = P.filter(p => p.riskLevel === 'critical').length;
    const highRisk = P.filter(p => p.riskLevel === 'high' || p.riskLevel === 'critical').length;
    const delayed = P.filter(p => p.expectedDelay > 60).length;
    return {
      total, active: total, highRisk, critical,
      onTrack: total - delayed, delayed, needsIntervention: critical,
      landUnderAcquisition: P.reduce((a,p)=>a+p.landAcquired,0),
      affectedHouseholds: P.reduce((a,p)=>a+p.households,0),
      pendingCompensation: P.reduce((a,p)=>a+Math.max(0,p.households-p.compensationPaid),0),
    };
  },
  criticalProjects(){
    return window.BS_DATA.PROJECTS
      .filter(p => p.riskLevel === 'critical' || p.riskLevel === 'high')
      .sort((a,b) => b.aiRisk - a.aiRisk)
      .slice(0, 8);
  },
};

// -------- Audit ----------
const auditService = {
  log(action, target, detail){
    const id = 'A-' + (9021 + window.BS_DATA.AUDIT.length);
    window.BS_DATA.AUDIT.unshift({
      id,
      ts: new Date().toISOString().slice(0,16).replace('T',' '),
      actor: window.BS_STATE?.user?.name || 'System',
      action, target, detail
    });
  },
  list(){ return window.BS_DATA.AUDIT; },
};

// -------- Toast bus ----------
const toastBus = {
  subs: new Set(),
  subscribe(fn){ this.subs.add(fn); return () => this.subs.delete(fn); },
  push(msg, kind='info'){
    const id = Math.random().toString(36).slice(2,9);
    this.subs.forEach(fn => fn({ id, msg, kind }));
  }
};

// Global app state (user + prefs)
window.BS_STATE = {
  user: null, // set after login
};

Object.assign(window, {
  useStore, emit,
  projectService, predictionService, gisService,
  taskService, analyticsService, auditService, toastBus,
});
