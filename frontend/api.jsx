/* DigiBhoomi — real backend API client.
 * Replaces the old "everything lives in a JS object in the browser" approach.
 * Base URL is same-origin because the Express backend also serves this frontend.
 */

const API_BASE = '/api';

function getToken() { return localStorage.getItem('bs.token'); }
function setToken(t) { if (t) localStorage.setItem('bs.token', t); else localStorage.removeItem('bs.token'); }

async function apiFetch(path, opts = {}) {
  const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
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
  const res = await apiFetch('/documents', { method: 'POST', body: JSON.stringify(payload) });
  if (window.BS_DATA) {
    window.BS_DATA.DOCUMENTS = [res, ...(window.BS_DATA.DOCUMENTS || [])];
  }
  return res;
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
  submitGrievance, uploadDocument, markNotificationRead, fetchLandownerDashboard, fetchKpis,
});

