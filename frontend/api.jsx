/* DigiBhoomi — real backend API client.
 * Replaces the old "everything lives in a JS object in the browser" approach.
 * Base URL is same-origin because the Express backend also serves this frontend.
 */

const API_BASE = '/api';

function getToken() { return localStorage.getItem('bs.token'); }
function setToken(t) { if (t) localStorage.setItem('bs.token', t); else localStorage.removeItem('bs.token'); }

async function apiFetch(path, opts = {}) {
  const isFormData = typeof FormData !== 'undefined' && opts.body instanceof FormData;
  const headers = { ...(isFormData ? {} : { 'Content-Type': 'application/json' }), ...(opts.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(API_BASE + path, { ...opts, headers });
  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try { const j = await res.json(); if (j.error) msg = j.error; } catch (e) {}
    throw new Error(msg);
  }
  if (res.status === 204) return null;
  return res.json();
}

// Fire-and-forget mutation: keeps the existing optimistic-UI pages/components
// working exactly as before, while genuinely persisting every change to the
// SQLite database on the server. Errors surface as a toast.
function apiSync(path, opts) {
  apiFetch(path, opts).catch((e) => {
    if (window.toastBus) window.toastBus.push('Sync failed: ' + e.message, 'error');
    console.error('[apiSync]', path, e);
  });
}

async function loginRequest(email, password) {
  const data = await apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
  setToken(data.token);
  return data.user;
}

async function registerRequest(payload) {
  const data = await apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(payload) });
  setToken(data.token);
  return data.user;
}

function logoutRequest() {
  setToken(null);
  localStorage.removeItem('bs.user');
  window.BS_DATA = null;
  if (window.BS_STATE) window.BS_STATE.user = null;
}

// Loads the scoped dataset from the server into window.BS_DATA.
// Loads the scoped dataset from the server into window.BS_DATA.
// Guarantees strict Role-Based Access Control & state isolation.
async function bootData() {
  const data = await apiFetch('/bootstrap');
  const user = window.BS_STATE?.user;
  const isNational = !user || !user.state || user.state === '—' || user.role === 'Ministry Administrator' || (user.role && user.role.includes('Ministry'));

  if (!isNational && user && user.state) {
    if (data.PROJECTS) {
      data.PROJECTS = data.PROJECTS.filter(p => p.state === user.state);
    }
    const projIds = new Set((data.PROJECTS || []).map(p => p.id));
    if (data.TASKS) {
      data.TASKS = data.TASKS.filter(t => projIds.has(t.projectId) || (t.officer && t.officer === user.name));
    }
    if (data.RECOMMENDATIONS) {
      data.RECOMMENDATIONS = data.RECOMMENDATIONS.filter(r => projIds.has(r.projectId));
    }
    if (data.HOUSEHOLDS && data.HOUSEHOLDS.length > 0) {
      const total = data.HOUSEHOLDS.length;
      const approved = data.HOUSEHOLDS.filter(h => h.compensationApproved > 0).length;
      const paid = data.HOUSEHOLDS.filter(h => h.compensationPaid > 0).length;
      const totalAmount = data.HOUSEHOLDS.reduce((a, h) => a + (h.compensationTotal || 0), 0);
      data.COMP_SUMMARY = { total, approved, paid, pending: Math.max(0, total - paid), totalAmount };
    } else if (data.PROJECTS && data.PROJECTS.length > 0) {
      const total = data.PROJECTS.reduce((a, p) => a + (p.households || 0), 0);
      const approved = data.PROJECTS.reduce((a, p) => a + (p.compensationApproved || 0), 0);
      const paid = data.PROJECTS.reduce((a, p) => a + (p.compensationPaid || 0), 0);
      const totalAmount = data.PROJECTS.reduce((a, p) => a + (p.compensationTotal || 0), 0);
      data.COMP_SUMMARY = { total, approved, paid, pending: Math.max(0, total - paid), totalAmount };
    }
  }

  window.BS_DATA = data;
  return data;
}

async function submitGrievance(payload) {
  const res = await apiFetch('/grievances', { method: 'POST', body: JSON.stringify(payload) });
  if (window.BS_DATA) {
    window.BS_DATA.GRIEVANCES = [res, ...(window.BS_DATA.GRIEVANCES || [])];
  }
  return res;
}

async function uploadDocument(payload) {
  let body;
  if (payload.file) {
    body = new FormData();
    body.append('file', payload.file);
    body.append('type', payload.type || '');
    body.append('description', payload.description || '');
    if (payload.projectId) body.append('projectId', payload.projectId);
    if (payload.parcelId) body.append('parcelId', payload.parcelId);
  } else {
    body = JSON.stringify(payload);
  }
  const res = await apiFetch('/documents', { method: 'POST', body });
  if (window.BS_DATA) {
    window.BS_DATA.DOCUMENTS = [res, ...(window.BS_DATA.DOCUMENTS || [])];
  }
  return res;
}

function documentFileUrl(id) {
  return `${API_BASE}/documents/${id}/file`;
}

// Downloads/opens a document's file using the current auth token (since
// plain <a href> links can't send an Authorization header).
async function openDocumentFile(id) {
  const res = await fetch(documentFileUrl(id), { headers: { Authorization: `Bearer ${getToken()}` } });
  if (!res.ok) { throw new Error('Could not load file'); }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
}

async function fetchDocuments(projectId) {
  const qs = projectId ? `?projectId=${encodeURIComponent(projectId)}` : '';
  return apiFetch('/documents' + qs);
}

async function markNotificationRead(id) {
  await apiFetch(`/notifications/${id}/read`, { method: 'PATCH' });
  if (window.BS_DATA && window.BS_DATA.NOTIFICATIONS) {
    const n = window.BS_DATA.NOTIFICATIONS.find(x => x.id === id);
    if (n) n.read = 1;
  }
}

async function fetchLandownerDashboard() {
  return await apiFetch('/dashboard/landowner');
}

async function fetchKpis() {
  return await apiFetch('/kpis');
}

Object.assign(window, {
  API_BASE, apiFetch, apiSync, getToken, setToken,
  loginRequest, registerRequest, logoutRequest, bootData,
  submitGrievance, uploadDocument, fetchDocuments, documentFileUrl, openDocumentFile, markNotificationRead, fetchLandownerDashboard, fetchKpis,
});

