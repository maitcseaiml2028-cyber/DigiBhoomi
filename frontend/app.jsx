/* App root · Router */

const { HashRouter, Routes, Route, Navigate } = ReactRouterDOM;

// Restore user from localStorage (token itself lives separately, see api.jsx)
try {
  const u = JSON.parse(localStorage.getItem('bs.user') || 'null');
  if (u) window.BS_STATE.user = u;
} catch (e) {}

let bootPromise = null;
function ensureBooted() {
  if (window.BS_DATA) return Promise.resolve(window.BS_DATA);
  if (!bootPromise) {
    bootPromise = bootData().finally(() => { bootPromise = null; });
  }
  return bootPromise;
}

function LoadingScreen({ label }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-navy-900 gap-4">
      <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      <div className="text-sm text-slate-500 font-medium">{label || 'Loading DigiBhoomi…'}</div>
    </div>
  );
}

function RequireAuth({ children }) {
  const [ready, setReady] = React.useState(!!window.BS_DATA);
  const [error, setError] = React.useState(null);
  const location = window.ReactRouterDOM ? window.ReactRouterDOM.useLocation() : {pathname:'/'};

  React.useEffect(() => {
    if (window.BS_DATA) { setReady(true); return; }
    ensureBooted().then(() => setReady(true)).catch((e) => setError(e.message));
  }, []);

  if (!getToken() || !window.BS_STATE.user) {
    return <Navigate to="/login" replace />;
  }

  // Enforce RBAC
  if (window.canAccess && window.BS_STATE.user) {
    const isAllowed = window.canAccess(window.BS_STATE.user.role, location.pathname);
    if (!isAllowed) {
      console.warn(`[RBAC] Access denied for ${window.BS_STATE.user.role} to ${location.pathname}`);
      return <Navigate to="/dashboard" replace />;
    }
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 text-center px-6">
        <div className="text-danger-500 font-semibold">Couldn't reach the DigiBhoomi server</div>
        <div className="text-sm text-slate-500 max-w-md">{error}. Make sure the backend is running, then reload.</div>
      </div>
    );
  }
  if (!ready) return <LoadingScreen />;
  return React.cloneElement(children, { key: location.pathname + location.search });
}

// Safety net: if any page throws while rendering, show a recoverable error
// screen instead of a blank white page.
class ErrorBoundary extends React.Component {
  constructor(props){ super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error){ return { error }; }
  componentDidCatch(error, info){ console.error('[ErrorBoundary]', error, info); }
  render(){
    if (this.state.error) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-3 text-center px-6 bg-slate-50">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <Icon name="alert-triangle" size={22} className="text-danger-500"/>
          </div>
          <div className="text-slate-900 font-semibold">Something went wrong loading this page</div>
          <div className="text-sm text-slate-500 max-w-md">{this.state.error.message}</div>
          <button onClick={()=>{ this.setState({error:null}); location.hash = '#/dashboard'; }}
            className="mt-2 text-sm rounded-lg bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 font-medium">
            Back to dashboard
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  // Rehydrate lucide icons after every render tick
  React.useEffect(() => {
    const t = setInterval(() => {
      if (window.lucide?.createIcons) { try { window.lucide.createIcons(); } catch (e) {} }
    }, 500);
    return () => clearInterval(t);
  }, []);
  return (
    <ErrorBoundary>
    <HashRouter>
      <Routes>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/"      element={<LandingPage/>}/>
        <Route path="/dashboard"     element={<RequireAuth><RoleDashboard/></RequireAuth>}/>
        <Route path="/projects"      element={<RequireAuth><ProjectsList/></RequireAuth>}/>
        <Route path="/projects/new"  element={<RequireAuth><CreateProject/></RequireAuth>}/>
        <Route path="/projects/:id"  element={<RequireAuth><ProjectDetail/></RequireAuth>}/>
        <Route path="/gis"           element={<RequireAuth><GISMap/></RequireAuth>}/>
        <Route path="/households"    element={<RequireAuth><HouseholdsPage/></RequireAuth>}/>
        <Route path="/documents"     element={<RequireAuth><DocumentsPage/></RequireAuth>}/>
        <Route path="/compensation"  element={<RequireAuth><CompensationPage/></RequireAuth>}/>
        <Route path="/ai/risk"       element={<RequireAuth><AIRiskDashboard/></RequireAuth>}/>
        <Route path="/ai/explainable" element={<RequireAuth><ExplainableAI/></RequireAuth>}/>
        <Route path="/ai/recommendations" element={<RequireAuth><Recommendations/></RequireAuth>}/>
        <Route path="/ai/simulator"  element={<RequireAuth><WhatIfSimulator/></RequireAuth>}/>
        <Route path="/ai/interventions" element={<RequireAuth><InterventionCenter/></RequireAuth>}/>
        <Route path="/tasks"         element={<RequireAuth><TasksPage/></RequireAuth>}/>
        <Route path="/approvals"     element={<RequireAuth><ApprovalsPage/></RequireAuth>}/>
        <Route path="/analytics"     element={<RequireAuth><AnalyticsPage/></RequireAuth>}/>
        <Route path="/reports"       element={<RequireAuth><ReportsPage/></RequireAuth>}/>
        <Route path="/admin"         element={<RequireAuth><AdminPage/></RequireAuth>}/>
        <Route path="/audit"         element={<RequireAuth><AuditLogsPage/></RequireAuth>}/>
        <Route path="*" element={<Navigate to="/dashboard" replace/>}/>
      </Routes>
    </HashRouter>
    </ErrorBoundary>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);
