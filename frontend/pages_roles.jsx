/* DigiBhoomi — Role-Specific Dashboard Components
 * ONE PLATFORM. SIX PERSPECTIVES.
 */

const { useNavigate: useNav } = ReactRouterDOM;

// ─────────────────────────────────────────────
//  RBAC HELPERS
// ─────────────────────────────────────────────

const ROLE_TYPES = {
  MINISTRY: 'Ministry Administrator',
  STATE: 'State Administrator',
  DISTRICT: 'District Administrator',
  PROJECT: 'Project Manager',
  FIELD: 'Field Officer',
  LANDOWNER: 'Landowner',
};

function getRoleType(role) {
  if (!role) return null;
  if (role === 'Ministry Administrator') return ROLE_TYPES.MINISTRY;
  if (role === 'State Administrator') return ROLE_TYPES.STATE;
  if (role === 'District Administrator') return ROLE_TYPES.DISTRICT;
  if (role === 'Project Manager') return ROLE_TYPES.PROJECT;
  if (role === 'Field Officer') return ROLE_TYPES.FIELD;
  if (role === 'Landowner') return ROLE_TYPES.LANDOWNER;
  return null;
}

const ROLE_ALLOWED_ROUTES = {
  [ROLE_TYPES.MINISTRY]: ['*'],
  [ROLE_TYPES.STATE]: [
    '/dashboard', '/projects', '/gis', '/households', '/documents', '/compensation',
    '/ai/risk', '/ai/explainable', '/ai/recommendations', '/ai/interventions', '/tasks', '/approvals',
    '/analytics', '/reports',
  ],
  [ROLE_TYPES.DISTRICT]: [
    '/dashboard', '/projects', '/gis', '/households', '/documents', '/compensation',
    '/tasks', '/approvals', '/reports',
  ],
  [ROLE_TYPES.PROJECT]: [
    '/dashboard', '/projects', '/gis', '/households', '/documents', '/compensation',
    '/ai/risk', '/ai/explainable', '/ai/recommendations', '/tasks', '/approvals', '/reports',
  ],
  [ROLE_TYPES.FIELD]: ['/dashboard', '/gis', '/tasks', '/documents'],
  [ROLE_TYPES.LANDOWNER]: ['/dashboard', '/documents', '/gis', '/households', '/compensation'],
};

function canAccess(role, path) {
  const type = getRoleType(role);
  if (!type) return false;
  const allowed = ROLE_ALLOWED_ROUTES[type] || [];
  if (allowed.includes('*')) return true;
  return allowed.some(r => path === r || path.startsWith(r + '/'));
}

window.getRoleType = getRoleType;
window.canAccess = canAccess;
window.ROLE_TYPES = ROLE_TYPES;

// ─────────────────────────────────────────────
//  ROLE-BASED NAV
// ─────────────────────────────────────────────

const ROLE_NAV = {
  [ROLE_TYPES.MINISTRY]: [
    {
      section: 'OVERVIEW', items: [
        { to: '/dashboard', label: 'Command Center', icon: 'layout-dashboard' },
        { to: '/projects', label: 'National Projects', icon: 'folder-kanban' },
        { to: '/gis', label: 'GIS Intelligence', icon: 'map' },
        { to: '/analytics', label: 'State Overview', icon: 'bar-chart-3' },
      ]
    },
    {
      section: 'LAND ACQUISITION', items: [
        { to: '/projects?tab=acq', label: 'Acquisition', icon: 'land-plot' },
        { to: '/compensation', label: 'Compensation', icon: 'wallet' },
        { to: '/households', label: 'R&R Monitoring', icon: 'users' },
        { to: '/tasks', label: 'Possession', icon: 'check-circle-2' },
      ]
    },
    {
      section: 'INTELLIGENCE SUPPORT', items: [
        { to: '/ai/risk', label: 'Risk & Delays', icon: 'brain-circuit', pill: 'AI' },
        { to: '/ai/explainable', label: 'Explainable AI', icon: 'sparkles', pill: 'AI' },
        { to: '/ai/recommendations', label: 'Recommendations', icon: 'lightbulb' },
        { to: '/ai/simulator', label: 'What-If Simulator', icon: 'sliders-horizontal' },
        { to: '/ai/interventions', label: 'Intervention Center', icon: 'shield-alert' },
      ]
    },
    {
      section: 'ANALYTICS', items: [
        { to: '/analytics?tab=national', label: 'National Analytics', icon: 'bar-chart-3' },
        { to: '/analytics?tab=state', label: 'State Comparison', icon: 'map-pin' },
        { to: '/reports', label: 'Reports', icon: 'file-bar-chart' },
      ]
    },
    {
      section: 'ADMINISTRATION', items: [
        { to: '/admin', label: 'Users & Roles', icon: 'settings-2' },
        { to: '/documents', label: 'Documents', icon: 'file-check-2' },
        { to: '/audit', label: 'Audit Logs', icon: 'scroll-text' },
      ]
    },
  ],
  [ROLE_TYPES.STATE]: [
    {
      section: 'OVERVIEW', items: [
        { to: '/dashboard', label: 'Command Center', icon: 'layout-dashboard' },
        { to: '/projects', label: 'State Projects', icon: 'folder-kanban' },
        { to: '/gis', label: 'GIS Map', icon: 'map' },
        { to: '/analytics?tab=district', label: 'District Overview', icon: 'bar-chart-3' },
      ]
    },
    {
      section: 'ACQUISITION', items: [
        { to: '/projects?tab=acq', label: 'Acquisition Progress', icon: 'land-plot' },
        { to: '/households?tab=parcels', label: 'Land Parcels', icon: 'map-pin' },
        { to: '/compensation', label: 'Compensation', icon: 'wallet' },
        { to: '/households?tab=rr', label: 'R&R', icon: 'users' },
        { to: '/tasks?tab=poss', label: 'Possession', icon: 'check-circle-2' },
      ]
    },
    {
      section: 'INTELLIGENCE SUPPORT', items: [
        { to: '/ai/risk', label: 'Risk & Delays', icon: 'brain-circuit', pill: 'AI' },
        { to: '/ai/recommendations', label: 'AI Recommendations', icon: 'lightbulb' },
        { to: '/ai/interventions', label: 'Intervention Center', icon: 'shield-alert' },
        { to: '/approvals?tab=esc', label: 'Escalations', icon: 'alert-triangle' },
      ]
    },
    {
      section: 'OPERATIONS', items: [
        { to: '/tasks?tab=main', label: 'Tasks', icon: 'list-checks' },
        { to: '/approvals?tab=main', label: 'Approvals', icon: 'stamp' },
        { to: '/households', label: 'Households', icon: 'users' },
        { to: '/documents', label: 'Documents', icon: 'file-check-2' },
      ]
    },
    {
      section: 'ANALYTICS', items: [
        { to: '/analytics?tab=state', label: 'State Analytics', icon: 'bar-chart-3' },
        { to: '/reports', label: 'Reports', icon: 'file-bar-chart' },
      ]
    },
  ],
  [ROLE_TYPES.DISTRICT]: [
    {
      section: 'OVERVIEW', items: [
        { to: '/dashboard', label: 'Command Center', icon: 'layout-dashboard' },
        { to: '/projects?tab=district', label: 'District Projects', icon: 'folder-kanban' },
        { to: '/gis?tab=district', label: 'GIS Map', icon: 'map' },
        { to: '/households?tab=parcels', label: 'Land Parcels', icon: 'map-pin' },
      ]
    },
    {
      section: 'ACQUISITION', items: [
        { to: '/projects?tab=acq', label: 'Acquisition', icon: 'land-plot' },
        { to: '/compensation?tab=main', label: 'Compensation', icon: 'wallet' },
        { to: '/households?tab=rr', label: 'R&R', icon: 'users' },
        { to: '/tasks?tab=poss', label: 'Possession', icon: 'check-circle-2' },
      ]
    },
    {
      section: 'FIELD OPERATIONS', items: [
        { to: '/tasks?tab=field', label: 'Field Verification', icon: 'clipboard-check' },
        { to: '/tasks?tab=survey', label: 'Survey', icon: 'compass' },
        { to: '/gis?tab=geo', label: 'Geo-Tagging', icon: 'map-pin' },
        { to: '/documents?tab=site', label: 'Site Records', icon: 'file-text' },
      ]
    },
    {
      section: 'WORK MANAGEMENT', items: [
        { to: '/tasks?tab=main', label: 'Tasks', icon: 'list-checks' },
        { to: '/approvals?tab=main', label: 'Approvals', icon: 'stamp' },
        { to: '/approvals?tab=pending', label: 'Pending Actions', icon: 'clock' },
        { to: '/approvals?tab=esc', label: 'Escalations', icon: 'alert-triangle' },
      ]
    },
    {
      section: 'STAKEHOLDERS', items: [
        { to: '/households?tab=families', label: 'Affected Families', icon: 'users' },
        { to: '/households?tab=owners', label: 'Landowners', icon: 'user' },
        { to: '/documents?tab=stakeholders', label: 'Documents', icon: 'file-check-2' },
      ]
    },
    {
      section: 'REPORTING', items: [
        { to: '/reports', label: 'District Reports', icon: 'file-bar-chart' },
      ]
    },
  ],
  [ROLE_TYPES.PROJECT]: [
    {
      section: 'MY PORTFOLIO', items: [
        { to: '/dashboard', label: 'Command Center', icon: 'layout-dashboard' },
        { to: '/projects?tab=my', label: 'My Projects', icon: 'folder-kanban' },
        { to: '/gis?tab=project', label: 'Project GIS', icon: 'map' },
      ]
    },
    {
      section: 'LAND ACQUISITION', items: [
        { to: '/projects?tab=req', label: 'Land Requirements', icon: 'land-plot' },
        { to: '/households?tab=parcels', label: 'Land Parcels', icon: 'map-pin' },
        { to: '/projects?tab=prog', label: 'Acquisition Progress', icon: 'trending-up' },
        { to: '/tasks?tab=poss', label: 'Possession', icon: 'check-circle-2' },
      ]
    },
    {
      section: 'COMPENSATION & R&R', items: [
        { to: '/compensation?tab=main', label: 'Compensation', icon: 'wallet' },
        { to: '/households?tab=families', label: 'Affected Families', icon: 'users' },
        { to: '/households?tab=rr', label: 'R&R Progress', icon: 'heart-handshake' },
      ]
    },
    {
      section: 'INTELLIGENCE SUPPORT', items: [
        { to: '/ai/risk', label: 'Project Risk', icon: 'brain-circuit', pill: 'AI' },
        { to: '/ai/recommendations', label: 'AI Recommendations', icon: 'lightbulb' },
        { to: '/projects?tab=time', label: 'Project Timeline', icon: 'calendar' },
      ]
    },
    {
      section: 'WORK MANAGEMENT', items: [
        { to: '/tasks?tab=main', label: 'Tasks', icon: 'list-checks' },
        { to: '/approvals?tab=main', label: 'Approvals', icon: 'stamp' },
        { to: '/documents?tab=main', label: 'Documents', icon: 'file-check-2' },
      ]
    },
    {
      section: 'REPORTING', items: [
        { to: '/reports', label: 'Project Reports', icon: 'file-bar-chart' },
      ]
    },
  ],
  [ROLE_TYPES.FIELD]: [
    {
      section: 'MY WORK', items: [
        { to: '/dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
        { to: '/tasks?tab=my', label: 'My Tasks', icon: 'list-checks' },
        { to: '/tasks?tab=today', label: "Today's Visits", icon: 'calendar-check' },
      ]
    },
    {
      section: 'FIELD', items: [
        { to: '/gis?tab=map', label: 'GIS Map', icon: 'map' },
        { to: '/tasks?tab=assigned', label: 'Assigned Parcels', icon: 'map-pin' },
        { to: '/tasks?tab=verification', label: 'Parcel Verification', icon: 'clipboard-check' },
        { to: '/gis?tab=geo', label: 'Geo-Tagging', icon: 'tag' },
        { to: '/documents?tab=photos', label: 'Site Photos', icon: 'camera' },
      ]
    },
    {
      section: 'VERIFICATION', items: [
        { to: '/documents?tab=records', label: 'Land Records', icon: 'file-text' },
        { to: '/tasks?tab=owner', label: 'Owner Verification', icon: 'user-check' },
        { to: '/tasks?tab=survey', label: 'Survey', icon: 'compass' },
        { to: '/documents?tab=docs', label: 'Documents', icon: 'file-check-2' },
      ]
    },
    {
      section: 'WORK STATUS', items: [
        { to: '/tasks?tab=pending', label: 'Pending', icon: 'clock' },
        { to: '/tasks?tab=progress', label: 'In Progress', icon: 'loader-2' },
        { to: '/tasks?tab=completed', label: 'Completed', icon: 'check-circle-2' },
        { to: '/tasks?tab=sync', label: 'Sync Pending', icon: 'refresh-cw' },
      ]
    },
    {
      section: 'COMMUNICATION', items: [
        { to: '/tasks?tab=notifs', label: 'Notifications', icon: 'bell' },
        { to: '/tasks?tab=escalations', label: 'Escalations', icon: 'alert-triangle' },
      ]
    },
  ],
  [ROLE_TYPES.LANDOWNER]: [
    {
      section: 'MY LAND', items: [
        { to: '/dashboard', label: 'My Dashboard', icon: 'layout-dashboard' },
        { to: '/documents?tab=parcels', label: 'My Land Parcels', icon: 'map-pin' },
        { to: '/gis', label: 'GIS Location', icon: 'map' },
        { to: '/dashboard?tab=status', label: 'Acquisition Status', icon: 'activity' },
      ]
    },
    {
      section: 'MY ACQUISITION', items: [
        { to: '/dashboard?tab=notifs', label: 'Notifications', icon: 'bell' },
        { to: '/dashboard?tab=survey', label: 'Survey & Verification', icon: 'clipboard-check' },
        { to: '/documents?tab=award', label: 'Award Details', icon: 'award' },
        { to: '/dashboard?tab=poss', label: 'Possession Status', icon: 'check-circle-2' },
      ]
    },
    {
      section: 'COMPENSATION', items: [
        { to: '/compensation?tab=status', label: 'Compensation Status', icon: 'wallet' },
        { to: '/compensation?tab=details', label: 'Payment Details', icon: 'credit-card' },
        { to: '/compensation?tab=history', label: 'Payment History', icon: 'history' },
      ]
    },
    {
      section: 'R&R', items: [
        { to: '/households?tab=rr', label: 'R&R Status', icon: 'heart-handshake' },
        { to: '/households?tab=entitlements', label: 'My Entitlements', icon: 'list' },
        { to: '/households?tab=benefits', label: 'Benefits & Assistance', icon: 'gift' },
        { to: '/households?tab=rehab', label: 'Rehabilitation', icon: 'home' },
      ]
    },
    {
      section: 'DOCUMENTS', items: [
        { to: '/documents?tab=my', label: 'My Documents', icon: 'file-text' },
        { to: '/documents?tab=submitted', label: 'Submitted Documents', icon: 'file-check-2' },
        { to: '/documents?tab=govt', label: 'Government Documents', icon: 'landmark' },
      ]
    },
    {
      section: 'SUPPORT', items: [
        { to: '/documents?tab=raise', label: 'Raise Grievance', icon: 'message-square-plus' },
        { to: '/documents?tab=track', label: 'Track Grievance', icon: 'search' },
        { to: '/documents?tab=help', label: 'Help & Support', icon: 'help-circle' },
      ]
    },
  ],
};

window.ROLE_NAV = ROLE_NAV;

// ─────────────────────────────────────────────
//  SHARED MINI COMPONENTS
// ─────────────────────────────────────────────

function KPICard({ label, value, sub, icon, color = 'brand', onClick }) {
  const colors = {
    brand: { bg: 'bg-brand-500/10', text: 'text-brand-500', val: 'text-slate-900' },
    green: { bg: 'bg-emerald-50', text: 'text-emerald-600', val: 'text-emerald-700' },
    red: { bg: 'bg-red-50', text: 'text-red-500', val: 'text-red-700' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-500', val: 'text-orange-700' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600', val: 'text-amber-700' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-500', val: 'text-blue-700' },
    slate: { bg: 'bg-slate-100', text: 'text-slate-500', val: 'text-slate-900' },
  };
  const c = colors[color] || colors.brand;
  return (
    <div onClick={onClick}
      className={`bg-white rounded-xl ring-1 ring-slate-200/70 shadow-card p-4 flex items-center gap-4 ${onClick ? 'cursor-pointer hover:shadow-pop transition-shadow' : ''}`}>
      {icon && <div className={`w-10 h-10 shrink-0 rounded-lg flex items-center justify-center ${c.bg}`}><Icon name={icon} size={18} className={c.text} /></div>}
      <div>
        <div className="text-[11px] uppercase tracking-wider font-medium text-slate-500">{label}</div>
        <div className={`text-2xl font-semibold tabular leading-tight mt-0.5 ${c.val}`}>{value}</div>
        {sub && <div className="text-[11px] text-slate-400 mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}

function PanelCard({ title, badge, badgeColor = 'amber', children, action, icon }) {
  const bc = { red: 'bg-red-100 text-red-700', amber: 'bg-amber-100 text-amber-700', green: 'bg-emerald-100 text-emerald-700', blue: 'bg-blue-100 text-blue-700' };
  return (
    <div className="bg-white rounded-xl ring-1 ring-slate-200/70 shadow-card overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {icon && <Icon name={icon} size={14} className="text-slate-500" />}
          <span className="text-sm font-semibold text-slate-900">{title}</span>
          {badge !== undefined && <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${bc[badgeColor] || bc.amber}`}>{badge}</span>}
        </div>
        {action}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function MiniRow({ label, value, pct, color = '#B87333' }) {
  return (
    <div className="flex items-center gap-2 py-1">
      <div className="text-xs text-slate-600 w-28 shrink-0 truncate">{label}</div>
      {pct !== undefined && <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden"><div className="h-1.5 rounded-full transition-all" style={{ width: `${pct}%`, background: color }} /></div>}
      <div className="text-xs font-semibold text-slate-900 tabular w-12 text-right">{value}</div>
    </div>
  );
}

function StagePill({ label, done }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${done ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${done ? 'bg-emerald-500' : 'bg-slate-300'}`} />
      {label}
    </span>
  );
}

function ActionRow({ time, parcel, status, done }) {
  return (
    <div className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
      <div className="text-[11px] text-slate-400 w-10 shrink-0 font-mono">{time}</div>
      <div className="flex-1 text-xs font-medium text-slate-800">{parcel}</div>
      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${done ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{status}</span>
    </div>
  );
}

// ─────────────────────────────────────────────
//  DEMO MAP (LEAFLET INTERACTIVE GIS)
// ─────────────────────────────────────────────
function DemoMap({
  center = [28.6139, 77.2090],
  zoom = 11,
  height = 'h-64',
  markers = [],
  parcels = [],
  onClick,
  badgeText = 'GIS DEMO',
  showLegend = true,
  legendItems = [
    { color: '#10B981', label: 'Acquired / Verified' },
    { color: '#F59E0B', label: 'Under Acquisition' },
    { color: '#EF4444', label: 'Dispute / High Risk' },
  ],
}) {
  const mapContainerRef = React.useRef(null);
  const mapInstanceRef = React.useRef(null);

  React.useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) {
      try { mapInstanceRef.current.remove(); } catch (e) { }
      mapInstanceRef.current = null;
    }

    try {
      const validCenter = (center && center[0] != null && center[1] != null) ? center : [28.6139, 77.2090];
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false,
      }).setView(validCenter, zoom);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      // Render custom pins/markers
      markers.forEach(m => {
        if (m.lat == null || m.lng == null) return;
        const circle = L.circleMarker([m.lat, m.lng], {
          radius: m.radius || 6,
          color: m.color || '#B87333',
          fillColor: m.color || '#B87333',
          fillOpacity: 0.85,
          weight: 2,
        }).addTo(map);
        if (m.tooltip) {
          circle.bindTooltip(m.tooltip, { sticky: true });
        }
      });

      // Render parcels
      parcels.forEach(p => {
        if (p.lat == null || p.lng == null) return;
        const color = p.status === 'acquired' ? '#10B981' : (p.risk === 'critical' || p.status === 'disputed') ? '#EF4444' : p.risk === 'high' ? '#F97316' : '#F59E0B';
        const cm = L.circleMarker([p.lat, p.lng], {
          radius: 4 + Math.min(3, (p.area || 1) / 2),
          color: color,
          fillColor: color,
          fillOpacity: 0.65,
          weight: 1.5,
        }).addTo(map);
        cm.bindTooltip(`<b>${p.id || 'Parcel'}</b><br>${p.village || 'Sector'} · ${p.area || 1} ha`, { sticky: true });
      });

      mapInstanceRef.current = map;

      // Invalidate size once container is rendered
      setTimeout(() => {
        if (mapInstanceRef.current) mapInstanceRef.current.invalidateSize();
      }, 200);
    } catch (e) {
      console.warn('DemoMap init error', e);
    }

    return () => {
      if (mapInstanceRef.current) {
        try { mapInstanceRef.current.remove(); } catch (e) { }
        mapInstanceRef.current = null;
      }
    };
  }, [center[0], center[1], zoom, markers.length, parcels.length]);

  return (
    <div
      className={`${height} w-full rounded-lg border border-slate-200/80 relative overflow-hidden cursor-pointer group shadow-inner`}
      onClick={onClick}
    >
      <div ref={mapContainerRef} className="absolute inset-0 z-0" />

      {/* Top Badge */}
      <div className="absolute top-2 left-2 z-10 bg-white/90 backdrop-blur px-2 py-0.5 rounded text-[10px] font-semibold text-slate-700 shadow-sm flex items-center gap-1.5 pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-brand-500 pulse-ring" />
        {badgeText}
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="absolute bottom-2 left-2 z-10 flex flex-col gap-0.5 text-[9px] bg-white/90 p-1.5 rounded backdrop-blur shadow-sm pointer-events-none">
          {legendItems.map(item => (
            <span key={item.label} className="flex items-center gap-1 text-slate-700 font-medium">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              {item.label}
            </span>
          ))}
        </div>
      )}

      {/* Hover prompt */}
      <div className="absolute top-2 right-2 z-10 bg-white/90 backdrop-blur px-2 py-0.5 rounded text-[10px] font-medium text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm flex items-center gap-1 pointer-events-none">
        <span>Click to open Full GIS</span>
        <Icon name="external-link" size={10} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  1. MINISTRY DASHBOARD
// ─────────────────────────────────────────────
function MinistryDashboard() {
  useLucide(); useStore();
  const nav = useNav();
  const k = analyticsService.kpis();
  const states = analyticsService.stateRisk();
  const critical = analyticsService.criticalProjects();
  const riskTrend = analyticsService.riskTrend();
  const delayDrivers = analyticsService.delayDrivers();
  const compensationTrendData = analyticsService.compensationTrend();
  const stagePerformanceData = analyticsService.stagePerformance();
  const projects = (window.BS_DATA && window.BS_DATA.PROJECTS) || [];
  const cs = (window.BS_DATA && window.BS_DATA.COMP_SUMMARY) || {};
  
  const user = window.BS_STATE?.user || {};
  const userRole = user.role || 'Ministry Administrator';
  const userName = user.name ? user.name.split(' ')[0] : 'Anjali';

  // Real parcel/household counts come from the DB tables (via /api/kpis),
  // not each project's rough display-estimate field, which previously
  // inflated national totals ~3x.
  const [liveKpis, setLiveKpis] = React.useState(null);
  React.useEffect(() => { fetchKpis().then(setLiveKpis).catch(() => {}); }, []);

  const landReq = projects.reduce((a, p) => a + (p.landRequired || 0), 0);
  const landAcq = projects.reduce((a, p) => a + (p.landAcquired || 0), 0);
  const totalH = liveKpis ? liveKpis.totalHouseholds : projects.reduce((a, p) => a + (p.households || 0), 0);
  const totalParcels = liveKpis ? liveKpis.totalParcels : projects.reduce((a, p) => a + (p.totalParcels || p.parcels || 0), 0);
  const compPending = projects.reduce((a, p) => a + (p.compensationPending || Math.max(0, (p.compensationTotal || 0) - (p.compensationPaid || 0))), 0);
  const rrCompletedSum = projects.reduce((a, p) => a + (p.rrCompleted || 0), 0);

  const nationalMarkers = projects.filter(p => p.centerLat && p.centerLng).map(p => ({
    lat: p.centerLat,
    lng: p.centerLng,
    color: p.riskLevel === 'critical' ? '#EF4444' : p.riskLevel === 'high' ? '#F97316' : '#10B981',
    radius: 5,
    tooltip: `<b>${p.id}</b> · ${p.name}<br>${p.district || p.state} · ${p.riskLevel ? p.riskLevel.toUpperCase() : 'LOW'} RISK`,
  }));

  const topRiskList = (critical && critical.length > 0)
    ? critical.slice(0, 6).map(p => ({
      name: p.name,
      r: p.riskLevel ? p.riskLevel.toUpperCase() : 'HIGH',
      d: `${p.expectedDelay || 14} days`,
      c: p.riskLevel === 'critical' ? 'text-red-600 bg-red-50' : 'text-orange-600 bg-orange-50',
    }))
    : [
      { name: 'Delhi Ring Road — Phase 4 Expansion', r: 'HIGH', d: '24 days', c: 'text-red-600 bg-red-50' },
      { name: 'Jaipur Greenfield International Airport', r: 'CRITICAL', d: '204 days', c: 'text-red-600 bg-red-50' },
      { name: 'Ganga Expressway — Phase 2', r: 'HIGH', d: '72 days', c: 'text-orange-600 bg-orange-50' },
    ];

  // Using deterministic mock data since the backend no longer supplies total required values for percentages
  const statePerfList = [
    { s: 'DE', acq: 85, cmp: 70, rr: 60 },
    { s: 'UT', acq: 65, cmp: 80, rr: 45 },
    { s: 'RA', acq: 90, cmp: 60, rr: 75 },
    { s: 'MA', acq: 50, cmp: 40, rr: 30 },
    { s: 'GU', acq: 75, cmp: 85, rr: 65 },
    { s: 'KA', acq: 80, cmp: 75, rr: 70 },
    { s: 'TA', acq: 95, cmp: 90, rr: 85 },
    { s: 'TE', acq: 60, cmp: 50, rr: 40 },
  ];

  return (
    <AppLayout crumbs={[{ label: userRole }]}
      right={<div className="flex gap-2"><Button variant="secondary" icon="download" size="sm">Export Data</Button><Button variant="dark" icon="plus" size="sm" onClick={() => nav('/projects/new')}>New Project</Button></div>}>
      <div className="rounded-2xl bg-gradient-to-br from-[#F5EFE6] via-[#EDE3D5] to-[#E5D9C6] ring-1 ring-brand-500/20 px-6 py-8 mb-5 relative overflow-hidden flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(700px 300px at 10% 0%, rgba(184,115,51,.4), transparent 60%)' }} />
        
        <div className="relative z-10 max-w-xl">
          <div className="text-[11px] tracking-widest text-brand-600 font-semibold flex items-center gap-2 uppercase mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 pulse-ring" />
            LIVE · {userRole.toUpperCase()}
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">Good morning, {userName}.</h1>
          <p className="text-sm text-slate-700 leading-relaxed mb-4">
            {critical.length || 27} projects need intervention today. The AI has generated {Math.max(4, Math.floor((critical.length||27)/2))} recommendations across {new Set(projects.map(p => p.state).filter(Boolean)).size || 1} states.
          </p>
          <div className="flex items-center gap-3">
            <button onClick={() => nav('/ai/risk')} className="flex items-center gap-2 bg-[#B87333] hover:bg-[#9E5F26] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
              <Icon name="brain-circuit" size={14} />
              Open AI Risk Center
            </button>
            <button onClick={() => nav('/projects/AIR-001')} className="flex items-center gap-2 bg-white/60 hover:bg-white text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm ring-1 ring-slate-200/50">
              <Icon name="star" size={14} className="text-amber-500" />
              Flagship · AIR-001 Airport
            </button>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-3 w-full md:w-auto">
          <div className="bg-[#F5EFE6]/80 backdrop-blur-sm border border-brand-500/10 rounded-xl px-4 py-2.5 min-w-0 w-full">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Projects</div>
            <div className="text-2xl font-bold text-slate-900">{projects.length || k.total || 78}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">across {new Set(projects.map(p => p.state).filter(Boolean)).size || 12} states</div>
          </div>
          <div className="bg-[#F5EFE6]/80 backdrop-blur-sm border border-brand-500/10 rounded-xl px-4 py-2.5 min-w-0 w-full">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Active</div>
            <div className="text-2xl font-bold text-slate-900">{projects.length || k.total || 78}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">100% of portfolio</div>
          </div>
          <div className="bg-[#F5EFE6]/80 backdrop-blur-sm border border-brand-500/10 rounded-xl px-4 py-2.5 min-w-0 w-full">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">High Risk</div>
            <div className="text-2xl font-bold text-[#ea580c]">{projects.filter(p=>p.riskLevel==='high').length || 38}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">need attention</div>
          </div>
          <div className="bg-[#F5EFE6]/80 backdrop-blur-sm border border-brand-500/10 rounded-xl px-4 py-2.5 min-w-0 w-full">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Critical</div>
            <div className="text-2xl font-bold text-[#dc2626]">{critical.length || 27}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">red-flag list</div>
          </div>
        </div>
      </div>

      {/* 8 KPIs in a 4x2 grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <KPICard label="Total Projects" value={projects.length || k.total} icon="folder-kanban" color="brand" onClick={() => nav('/projects')} />
        <KPICard label="Total Parcels" value={nfmt(totalParcels)} icon="map-pin" color="blue" />
        <KPICard label="Land Under Acq." value={nfmt(landReq) + ' Ha'} icon="land-plot" color="amber" />
        <KPICard label="Land Acquired" value={nfmt(landAcq) + ' Ha'} icon="check-circle-2" color="green" />

        <KPICard label="Affected Families" value={nfmt(totalH)} icon="users" color="slate" />
        <KPICard label="Compensation Pending" value={inr(compPending)} icon="wallet" color="orange" />
        <KPICard label="R&R Pending" value={nfmt(Math.max(0, totalH - rrCompletedSum))} icon="heart-handshake" color="blue" />
        <KPICard label="High-Risk Projects" value={critical.length} icon="alert-triangle" color="red" />
      </div>

      {/* 3 Column Layout below */}
      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        <PanelCard title="National GIS Overview" icon="map" action={<Icon name="more-horizontal" size={14} className="text-slate-400" />}>
          <DemoMap
            center={[22.5, 79.5]}
            zoom={4}
            height="h-64"
            badgeText="LIVE · 45 NATIONAL PROJECTS"
            markers={nationalMarkers}
            legendItems={[
              { color: '#10B981', label: 'On Track / Low Risk' },
              { color: '#F97316', label: 'High Delay Risk' },
              { color: '#EF4444', label: 'Critical Risk' },
            ]}
            onClick={() => nav('/gis')}
          />
          <div className="mt-3 flex gap-2">
            <Button variant="secondary" size="sm" className="flex-1" icon="map" onClick={() => nav('/gis')}>Open National GIS</Button>
            <Button variant="secondary" size="sm" className="flex-1" icon="brain-circuit" onClick={() => nav('/ai/risk')}>AI Risk & Delays</Button>
          </div>
        </PanelCard>

        <PanelCard title="State Performance Comparison" icon="bar-chart-3" action={<Icon name="more-horizontal" size={14} className="text-slate-400" />}>
          <div className="h-64 flex flex-col justify-end gap-2 p-2">
            <div className="flex gap-4 text-[10px] text-slate-500 justify-center mb-2">
              <span className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-500"></div> Acquisition</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 bg-emerald-500"></div> Compensation</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 bg-amber-500"></div> R&R</span>
            </div>
            {/* Mock Bar Chart */}
            <div className="flex-1 flex items-stretch justify-between gap-1 mt-2">
              {statePerfList.map(item => (
                <div key={item.s} className="flex-1 flex flex-col items-center gap-1 h-full">
                  <div className="w-full flex items-end justify-center gap-0.5 flex-1">
                    <div className="w-1/3 bg-blue-500 rounded-t-sm transition-all hover:opacity-80" style={{ height: `${item.acq}%` }}></div>
                    <div className="w-1/3 bg-emerald-500 rounded-t-sm transition-all hover:opacity-80" style={{ height: `${item.cmp}%` }}></div>
                    <div className="w-1/3 bg-amber-500 rounded-t-sm transition-all hover:opacity-80" style={{ height: `${item.rr}%` }}></div>
                  </div>
                  <div className="text-[10px] font-medium text-slate-600">{item.s}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <Button variant="secondary" size="sm" className="flex-1" icon="shield-alert" onClick={() => nav('/ai/interventions')}>Intervention Center</Button>
          </div>
        </PanelCard>

        <PanelCard title="Top Risk Projects" icon="alert-triangle" action={<Icon name="more-horizontal" size={14} className="text-slate-400" />}>
          <div className="h-64 flex flex-col">
            <div className="grid grid-cols-12 gap-2 text-[10px] uppercase font-semibold text-slate-400 border-b border-slate-100 pb-2 mb-2 px-1">
              <div className="col-span-6">Project</div>
              <div className="col-span-3 text-center">Risk</div>
              <div className="col-span-3 text-right">Delay</div>
            </div>
            <div className="flex-1 overflow-y-auto space-y-1 sb-scroll pr-1">
              {topRiskList.map(p => (
                <div key={p.name} className="grid grid-cols-12 gap-2 items-center py-2 px-1 hover:bg-slate-50 rounded cursor-pointer transition-colors" onClick={() => nav('/projects')}>
                  <div className="col-span-6 text-xs font-medium text-slate-800 truncate">{p.name}</div>
                  <div className="col-span-3 text-center"><span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${p.c}`}>{p.r}</span></div>
                  <div className="col-span-3 text-right text-xs font-semibold text-slate-600 tabular">{p.d}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <Button variant="secondary" size="sm" className="flex-1" icon="file-bar-chart" onClick={() => nav('/reports')}>National Reports</Button>
          </div>
        </PanelCard>
      </div>

      {/* National analytics — risk trend + delay causes */}
      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        <Card className="lg:col-span-2">
          <SectionHeader title="National risk trend" subtitle="Weighted delay-probability across all active projects"
            right={
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-brand-500"/>National</div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-red-500"/>Critical portfolio</div>
              </div>
            }/>
          <div className="h-64">
            <ResponsiveContainer>
              <AreaChart data={riskTrend} margin={{left:-10,right:6,top:6,bottom:0}}>
                <defs>
                  <linearGradient id="gnat2" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#B87333" stopOpacity=".35"/>
                    <stop offset="100%" stopColor="#B87333" stopOpacity="0"/>
                  </linearGradient>
                  <linearGradient id="gcrit2" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#EF4444" stopOpacity=".3"/>
                    <stop offset="100%" stopColor="#EF4444" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#eef1f5"/>
                <XAxis dataKey="month" fontSize={11} stroke="#94a3b8" tickLine={false} axisLine={false}/>
                <YAxis fontSize={11} stroke="#94a3b8" tickLine={false} axisLine={false} width={30}/>
                <Tooltip contentStyle={{borderRadius:8, border:'1px solid #e2e8f0', fontSize:12}}/>
                <Area type="monotone" dataKey="national" stroke="#B87333" strokeWidth={2} fill="url(#gnat2)"/>
                <Area type="monotone" dataKey="critical" stroke="#EF4444" strokeWidth={2} fill="url(#gcrit2)"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <SectionHeader title="Delay causes" subtitle="Aggregated across critical projects"/>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={delayDrivers} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80} paddingAngle={2}>
                  {delayDrivers.map((d,i)=><Cell key={i} fill={d.color}/>)}
                </Pie>
                <Tooltip contentStyle={{borderRadius:8, border:'1px solid #e2e8f0', fontSize:12}}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
            {delayDrivers.map(d => (
              <div key={d.name} className="flex items-center justify-between">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm" style={{background:d.color}}/><span className="text-slate-600">{d.name}</span></span>
                <span className="tabular font-medium text-slate-900">{d.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* State-wise risk + compensation trend */}
      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        <Card className="lg:col-span-2">
          <SectionHeader title="State-wise risk score" subtitle="Higher = greater aggregated delay probability"/>
          <div className="h-60">
            <ResponsiveContainer>
              <BarChart data={states} margin={{left:-14,right:6,top:6,bottom:0}}>
                <CartesianGrid vertical={false} stroke="#eef1f5"/>
                <XAxis dataKey="code" fontSize={11} stroke="#94a3b8" tickLine={false} axisLine={false}/>
                <YAxis fontSize={11} stroke="#94a3b8" tickLine={false} axisLine={false} width={30}/>
                <Tooltip contentStyle={{borderRadius:8, border:'1px solid #e2e8f0', fontSize:12}} formatter={(v,name,p)=>[`${v}%`, p.payload.state]}/>
                <Bar dataKey="risk" radius={[6,6,0,0]}>
                  {states.map((s,i)=>{
                    const color = s.risk >= 75 ? '#EF4444' : s.risk >= 60 ? '#F97316' : s.risk >= 45 ? '#F59E0B' : '#10B981';
                    return <Cell key={i} fill={color}/>;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <SectionHeader title="Compensation trend" subtitle="Cases approved vs paid"/>
          <div className="h-60">
            <ResponsiveContainer>
              <LineChart data={compensationTrendData} margin={{left:-14,right:6,top:6,bottom:0}}>
                <CartesianGrid vertical={false} stroke="#eef1f5"/>
                <XAxis dataKey="month" fontSize={11} stroke="#94a3b8" tickLine={false} axisLine={false}/>
                <YAxis fontSize={11} stroke="#94a3b8" tickLine={false} axisLine={false} width={30}/>
                <Tooltip contentStyle={{borderRadius:8, border:'1px solid #e2e8f0', fontSize:12}}/>
                <Line type="monotone" dataKey="approved" stroke="#B87333" strokeWidth={2} dot={false}/>
                <Line type="monotone" dataKey="paid" stroke="#10B981" strokeWidth={2} dot={false}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-brand-500"/>Approved</div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"/>Paid</div>
          </div>
        </Card>
      </div>

      {/* Stage performance */}
      <Card className="mb-4">
        <SectionHeader title="Stage performance" subtitle="Where projects spend the most time and where they slip"/>
        <div className="h-56">
          <ResponsiveContainer>
            <BarChart data={stagePerformanceData} margin={{left:-10,right:6,top:6,bottom:0}} barGap={4}>
              <CartesianGrid vertical={false} stroke="#eef1f5"/>
              <XAxis dataKey="label" fontSize={11} stroke="#94a3b8" tickLine={false} axisLine={false}/>
              <YAxis fontSize={11} stroke="#94a3b8" tickLine={false} axisLine={false} width={40} unit="d"/>
              <Tooltip contentStyle={{borderRadius:8, border:'1px solid #e2e8f0', fontSize:12}}/>
              <Legend wrapperStyle={{fontSize:11}}/>
              <Bar dataKey="avgDays" name="Avg duration" fill="#B87333" radius={[6,6,0,0]}/>
              <Bar dataKey="delayed" name="Avg delay" fill="#EF4444" radius={[6,6,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Critical projects red-flag table */}
      <Card pad={false}>
        <div className="p-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Critical projects · red-flag list</h2>
            <p className="text-sm text-slate-500 mt-0.5">Projects with predicted risk ≥ 65% requiring supervisor attention</p>
          </div>
          <Button variant="secondary" size="sm" icon="arrow-right" onClick={()=>nav('/projects?risk=critical')}>Open list</Button>
        </div>
        <DataTable
          onRowClick={(r)=>nav('/projects/'+r.id)}
          columns={[
            { key:'id', label:'Project', render:r=>(
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-[11px] font-semibold ${r.riskLevel==='critical'?'bg-red-500':'bg-orange-500'}`}>
                  {r.type[0]}
                </div>
                <div>
                  <div className="font-medium text-slate-900 text-sm">{r.name}</div>
                  <div className="text-[11px] text-slate-500 font-mono">{r.id}</div>
                </div>
              </div>
            )},
            { key:'type', label:'Type' },
            { key:'state', label:'State', render:r=>`${r.state} · ${r.district || ''}` },
            { key:'stage', label:'Stage', render:r=>(
              <div className="flex items-center gap-2">
                <div className="text-xs font-mono text-slate-600">S{r.currentStage}/7</div>
                <div className="w-24"><Progress value={r.progress} tone="brand" size="sm"/></div>
              </div>
            )},
            { key:'risk', label:'Risk', render:r=>(
              <div className="flex items-center gap-2">
                <span className={`tabular font-semibold ${r.riskLevel==='critical'?'text-red-600':r.riskLevel==='high'?'text-orange-600':'text-amber-600'}`}>{r.aiRisk}%</span>
                <RiskBadge level={r.riskLevel}/>
              </div>
            )},
            { key:'delay', label:'Expected Delay', render:r=><span className="tabular">{r.expectedDelay}d</span> },
            { key:'owner', label:'Owner' },
          ]}
          rows={critical}
        />
      </Card>
    </AppLayout>
  );
}

// ─────────────────────────────────────────────
//  2. STATE DASHBOARD
// ─────────────────────────────────────────────
function StateDashboard() {
  useLucide(); useStore();
  const nav = useNav();
  const user = (window.BS_STATE && window.BS_STATE.user) || {};
  const userState = user.state || 'Delhi';
  const allP = (window.BS_DATA && window.BS_DATA.PROJECTS) || [];
  const stP = allP.filter(p => p.state === userState);
  const cs = (window.BS_DATA && window.BS_DATA.COMP_SUMMARY) || {};

  const totalParcels = stP.reduce((a, p) => a + (p.totalParcels || p.parcels || 0), 0);
  const landReq = stP.reduce((a, p) => a + (p.landRequired || 0), 0);
  const landAcq = stP.reduce((a, p) => a + (p.landAcquired || 0), 0);
  const affectedH = stP.reduce((a, p) => a + (p.households || 0), 0);
  const compPending = stP.reduce((a, p) => a + (p.compensationPending || 0), 0);
  const rrPending = stP.reduce((a, p) => a + (p.rrPending || 0), 0);
  const posPct = landReq > 0 ? Math.round((landAcq / landReq) * 100) : 48;

  const distPerf = userState === 'Delhi' ? [
    { name: 'South-West Delhi', acq: 62, del: 'High', cmp: 52, rr: 42, pos: 38 },
    { name: 'North-East Delhi', acq: 55, del: 'Medium', cmp: 48, rr: 35, pos: 32 },
    { name: 'Central Delhi', acq: 72, del: 'Low', cmp: 65, rr: 50, pos: 45 },
    { name: 'West Delhi', acq: 44, del: 'Low', cmp: 40, rr: 28, pos: 25 },
    { name: 'North-West Delhi', acq: 58, del: 'High', cmp: 50, rr: 38, pos: 30 },
  ] : [
    { name: 'Jaipur', acq: 78, del: 'Low', cmp: 55, rr: 40, pos: 55 },
    { name: 'Ajmer', acq: 62, del: 'Medium', cmp: 48, rr: 32, pos: 42 },
    { name: 'Jaisalmer', acq: 56, del: 'High', cmp: 37, rr: 28, pos: 36 },
    { name: 'Alwar', acq: 71, del: 'Medium', cmp: 52, rr: 34, pos: 47 },
    { name: 'Jodhpur', acq: 68, del: 'Low', cmp: 46, rr: 31, pos: 39 },
  ];

  const delhiVillages = [
    { name: 'Najafgarh', center: [28.609, 76.978] },
    { name: 'Dhansa', center: [28.595, 76.991] },
    { name: 'Rewla Khanpur', center: [28.622, 77.001] },
    { name: 'Goela Khurd', center: [28.584, 77.015] },
    { name: 'Malikpur', center: [28.611, 77.030] },
  ];
  const stateMarkers = userState === 'Delhi'
    ? delhiVillages.map(v => ({
      lat: v.center[0], lng: v.center[1],
      color: '#B87333', radius: 7,
      tooltip: `<b>Sector: ${v.name}</b><br>South-West Delhi · Active Acquisition Zone`,
    }))
    : stP.map(p => ({
      lat: p.centerLat || 26.8, lng: p.centerLng || 75.5,
      color: p.riskLevel === 'critical' ? '#EF4444' : '#10B981', radius: 6,
      tooltip: `<b>${p.id}</b> · ${p.name}`,
    }));
  const stateParcels = (window.BS_DATA && window.BS_DATA.PARCELS && window.BS_DATA.PARCELS.slice(0, 80)) || [];

  return (
    <AppLayout crumbs={[{ label: userState + ' Command Center' }]}
      right={<div className="flex gap-2"><Button variant="secondary" icon="download" size="sm">Export</Button><Button variant="dark" icon="plus" size="sm" onClick={() => nav('/projects/new')}>New Project</Button></div>}>
      <div className="rounded-2xl bg-gradient-to-br from-[#F5EFE6] via-[#EDE3D5] to-[#E5D9C6] ring-1 ring-brand-500/20 px-6 py-8 mb-5 relative overflow-hidden flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(600px 250px at 15% 0%, rgba(16,185,129,.3), transparent 60%)' }} />
        
        <div className="relative z-10 max-w-xl">
          <div className="text-[11px] tracking-widest text-brand-600 font-semibold flex items-center gap-2 uppercase mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 pulse-ring" />
            LIVE · {userState.toUpperCase()} COMMAND CENTER
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">Good morning, {user.name || 'Anjali Verma'}.</h1>
          <p className="text-sm text-slate-700 leading-relaxed mb-4">
            {stP.filter(p=>p.riskLevel==='critical').length || 2} projects need intervention today. The AI has generated recommendations across {userState}.
          </p>
          <div className="flex items-center gap-3">
            <button onClick={() => nav('/ai/risk')} className="flex items-center gap-2 bg-[#B87333] hover:bg-[#9E5F26] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
              <Icon name="brain-circuit" size={14} />
              Open AI Risk Center
            </button>
            {(() => {
              const topP = stP.find(p => p.riskLevel === 'critical') || stP.find(p => p.riskLevel === 'high') || stP[0];
              if (!topP) return null;
              return (
                <button onClick={() => nav('/projects/' + topP.id)} className="flex items-center gap-2 bg-white/60 hover:bg-white text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm ring-1 ring-slate-200/50">
                  <Icon name={topP.riskLevel === 'critical' ? 'alert-triangle' : 'star'} size={14} className={topP.riskLevel === 'critical' ? 'text-red-500' : 'text-amber-500'} />
                  {topP.riskLevel === 'critical' ? 'Critical' : 'Project'} · {topP.id}
                </button>
              );
            })()}
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-3 w-full md:w-auto">
          <div className="bg-[#F5EFE6]/80 backdrop-blur-sm border border-brand-500/10 rounded-xl px-4 py-2.5 min-w-0 w-full">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">State Projects</div>
            <div className="text-2xl font-bold text-slate-900">{stP.length || 15}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">across {userState}</div>
          </div>
          <div className="bg-[#F5EFE6]/80 backdrop-blur-sm border border-brand-500/10 rounded-xl px-4 py-2.5 min-w-0 w-full">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Active</div>
            <div className="text-2xl font-bold text-slate-900">{stP.length || 15}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">100% of portfolio</div>
          </div>
          <div className="bg-[#F5EFE6]/80 backdrop-blur-sm border border-brand-500/10 rounded-xl px-4 py-2.5 min-w-0 w-full">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">High Risk</div>
            <div className="text-2xl font-bold text-[#ea580c]">{stP.filter(p=>p.riskLevel==='high').length || 4}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">need attention</div>
          </div>
          <div className="bg-[#F5EFE6]/80 backdrop-blur-sm border border-brand-500/10 rounded-xl px-4 py-2.5 min-w-0 w-full">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Critical</div>
            <div className="text-2xl font-bold text-[#dc2626]">{stP.filter(p=>p.riskLevel==='critical').length || 2}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">red-flag list</div>
          </div>
        </div>
      </div>

      {/* 8 KPIs in a 4x2 grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <KPICard label="State Projects" value={stP.length} icon="folder-kanban" color="brand" onClick={() => nav('/projects')} />
        <KPICard label="Total Parcels" value={nfmt(totalParcels || 1140)} icon="map-pin" color="blue" />
        <KPICard label="Land Under Acq." value={nfmt(landReq || 1635) + ' Ha'} icon="land-plot" color="amber" />
        <KPICard label="Land Acquired" value={nfmt(landAcq || 820) + ' Ha'} icon="check-circle-2" color="green" />

        <KPICard label="Affected Families" value={nfmt(affectedH || 2450)} icon="users" color="slate" />
        <KPICard label="Compensation Pending" value={'₹' + Math.round((compPending || (cs.pending || 0) * 1.6) / 10000000) + ' Cr'} icon="wallet" color="orange" />
        <KPICard label="R&R Pending" value={nfmt(rrPending || 340)} icon="heart-handshake" color="blue" />
        <KPICard label="Possession Progress" value={posPct + '%'} icon="home" color={posPct > 50 ? "green" : "red"} />
      </div>

      {/* Main Layout: 2/3 District Overview, 1/3 State Map */}
      <div className="grid lg:grid-cols-3 gap-4 mb-4">

        {/* District Overview Table */}
        <div className="lg:col-span-2 flex flex-col">
          <PanelCard title="District Overview" icon="bar-chart-3" action={<Icon name="more-horizontal" size={14} className="text-slate-400" />}>
            <div className="h-64 flex flex-col">
              <div className="grid grid-cols-6 gap-2 text-[10px] uppercase font-semibold text-slate-400 border-b border-slate-100 pb-2 mb-2 px-1">
                <div className="col-span-1">District</div>
                <div className="col-span-1 text-center">Acquisition</div>
                <div className="col-span-1 text-center">Delay</div>
                <div className="col-span-1 text-center">Compensation</div>
                <div className="col-span-1 text-center">R&R</div>
                <div className="col-span-1 text-center">Possession</div>
              </div>
              <div className="flex-1 overflow-y-auto space-y-1 sb-scroll pr-1">
                {distPerf.map(d => (
                  <div key={d.name} className="grid grid-cols-6 gap-2 items-center py-2 px-1 hover:bg-slate-50 rounded cursor-pointer transition-colors" onClick={() => nav('/analytics')}>
                    <div className="col-span-1 text-xs font-medium text-slate-800">{d.name}</div>
                    <div className="col-span-1 text-center text-xs font-semibold text-slate-600">{d.acq}%</div>
                    <div className="col-span-1 text-center"><span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${d.del === 'High' ? 'text-red-600 bg-red-50' : d.del === 'Medium' ? 'text-orange-600 bg-orange-50' : 'text-emerald-600 bg-emerald-50'}`}>{d.del}</span></div>
                    <div className="col-span-1 text-center text-xs font-semibold text-slate-600">{d.cmp}%</div>
                    <div className="col-span-1 text-center text-xs font-semibold text-slate-600">{d.rr}%</div>
                    <div className="col-span-1 text-center text-xs font-semibold text-slate-600">{d.pos}%</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <Button variant="secondary" size="sm" icon="alert-triangle" className="flex-1" onClick={() => nav('/ai/risk')}>Risk & Delays</Button>
              <Button variant="secondary" size="sm" icon="shield-alert" className="flex-1" onClick={() => nav('/approvals')}>Escalations</Button>
            </div>
          </PanelCard>
        </div>

        {/* State Map */}
        <div className="lg:col-span-1 flex flex-col">
          <PanelCard title={`${userState} GIS Map`} icon="map" action={<Icon name="more-horizontal" size={14} className="text-slate-400" />}>
            <DemoMap
              center={userState === 'Delhi' ? [28.609, 77.005] : [26.803, 75.575]}
              zoom={userState === 'Delhi' ? 11 : 8}
              height="h-64"
              badgeText={`LIVE · ${userState.toUpperCase()} GIS`}
              markers={stateMarkers}
              parcels={stateParcels}
              onClick={() => nav('/gis')}
            />
            <div className="mt-3 flex gap-2">
              <Button variant="secondary" size="sm" className="flex-1" icon="wallet" onClick={() => nav('/compensation')}>Compensation</Button>
              <Button variant="secondary" size="sm" className="flex-1" icon="users" onClick={() => nav('/households')}>R&R</Button>
            </div>
          </PanelCard>
        </div>

      </div>

      {/* Critical projects red-flag table */}
      <Card pad={false} className="mb-4">
        <div className="p-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Critical projects · red-flag list</h2>
            <p className="text-sm text-slate-500 mt-0.5">Projects with predicted risk ≥ 65% requiring supervisor attention</p>
          </div>
          <Button variant="secondary" size="sm" icon="arrow-right" onClick={()=>nav('/projects?risk=critical')}>Open list</Button>
        </div>
        <DataTable
          onRowClick={(r)=>nav('/projects/'+r.id)}
          columns={[
            { key:'id', label:'Project', render:r=>(
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-[11px] font-semibold ${r.riskLevel==='critical'?'bg-red-500':'bg-orange-500'}`}>
                  {(r.type||'P')[0]}
                </div>
                <div>
                  <div className="font-medium text-slate-900 text-sm">{r.name}</div>
                  <div className="text-[11px] text-slate-500 font-mono">{r.id}</div>
                </div>
              </div>
            )},
            { key:'type', label:'Type' },
            { key:'state', label:'State', render:r=>`${r.state} · ${r.district || ''}` },
            { key:'stage', label:'Stage', render:r=>(
              <div className="flex items-center gap-2">
                <div className="text-xs font-mono text-slate-600">S{r.currentStage}/7</div>
                <div className="w-24"><Progress value={r.progress} tone="brand" size="sm"/></div>
              </div>
            )},
            { key:'risk', label:'Risk', render:r=>(
              <div className="flex items-center gap-2">
                <span className={`tabular font-semibold ${r.riskLevel==='critical'?'text-red-600':r.riskLevel==='high'?'text-orange-600':'text-amber-600'}`}>{r.aiRisk}%</span>
                <RiskBadge level={r.riskLevel}/>
              </div>
            )},
            { key:'delay', label:'Expected Delay', render:r=><span className="tabular">{r.expectedDelay}d</span> },
            { key:'owner', label:'Owner' },
          ]}
          rows={stP.filter(p => p.riskLevel === 'critical' || p.riskLevel === 'high').slice(0, 5)}
        />
      </Card>
    </AppLayout>
  );
}

// ─────────────────────────────────────────────
//  3. DISTRICT DASHBOARD
// ─────────────────────────────────────────────
function DistrictDashboard() {
  useLucide(); useStore();
  const nav = useNav();
  const user = (window.BS_STATE && window.BS_STATE.user) || {};
  const userState = user.state || 'Delhi';
  const userDistrict = (user.district && user.district !== '—') ? user.district : 'South-West Delhi';
  const allP = (window.BS_DATA && window.BS_DATA.PROJECTS) || [];
  const myP = allP.filter(p => p.state === userState);
  const critCount = myP.filter(p => p.riskLevel === 'critical' || p.riskLevel === 'high').length;

  const pendingActions = [
    { task: 'Parcel Verification (Najafgarh)', count: 15, priority: 'High', c: 'text-red-600 bg-red-50' },
    { task: 'Compensation Approval (Dhansa)', count: 8, priority: 'High', c: 'text-red-600 bg-red-50' },
    { task: 'R&R Package Review', count: 6, priority: 'Medium', c: 'text-orange-600 bg-orange-50' },
    { task: 'Boundary Survey (Rewla Khanpur)', count: 12, priority: 'Medium', c: 'text-orange-600 bg-orange-50' },
    { task: 'Title Documents Verification', count: 9, priority: 'Low', c: 'text-amber-600 bg-amber-50' },
  ];

  return (
    <AppLayout crumbs={[{ label: userDistrict + ' Command Center' }]} right={<Button variant="secondary" size="sm" icon="download">Export</Button>}>
      <div className="rounded-2xl bg-gradient-to-br from-[#F5EFE6] via-[#EDE3D5] to-[#E5D9C6] ring-1 ring-brand-500/20 px-6 py-8 mb-5 relative overflow-hidden flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(600px 250px at 10% 0%, rgba(99,102,241,.3), transparent 60%)' }} />
        
        <div className="relative z-10 max-w-xl">
          <div className="text-[11px] tracking-widest text-brand-600 font-semibold flex items-center gap-2 uppercase mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 pulse-ring" />
            LIVE · {userDistrict.toUpperCase()} COMMAND CENTER
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">Good morning, {user.name || 'Suresh Rao'}.</h1>
          <p className="text-sm text-slate-700 leading-relaxed mb-4">
            {myP.filter(p=>p.riskLevel==='critical').length || 1} projects need intervention today. The AI has generated recommendations across {userDistrict}.
          </p>
          <div className="flex items-center gap-3">
            <button onClick={() => nav('/ai/risk')} className="flex items-center gap-2 bg-[#B87333] hover:bg-[#9E5F26] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
              <Icon name="brain-circuit" size={14} />
              Open AI Risk Center
            </button>
            {(() => {
              const topP = myP.find(p => p.riskLevel === 'critical') || myP.find(p => p.riskLevel === 'high') || myP[0];
              if (!topP) return null;
              return (
                <button onClick={() => nav('/projects/' + topP.id)} className="flex items-center gap-2 bg-white/60 hover:bg-white text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm ring-1 ring-slate-200/50">
                  <Icon name={topP.riskLevel === 'critical' ? 'alert-triangle' : 'star'} size={14} className={topP.riskLevel === 'critical' ? 'text-red-500' : 'text-amber-500'} />
                  {topP.riskLevel === 'critical' ? 'Critical' : 'Project'} · {topP.id}
                </button>
              );
            })()}
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-3 w-full md:w-auto">
          <div className="bg-[#F5EFE6]/80 backdrop-blur-sm border border-brand-500/10 rounded-xl px-4 py-2.5 min-w-0 w-full">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">District Projects</div>
            <div className="text-2xl font-bold text-slate-900">{myP.length || 8}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">across {userDistrict}</div>
          </div>
          <div className="bg-[#F5EFE6]/80 backdrop-blur-sm border border-brand-500/10 rounded-xl px-4 py-2.5 min-w-0 w-full">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Active</div>
            <div className="text-2xl font-bold text-slate-900">{myP.length || 8}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">100% of portfolio</div>
          </div>
          <div className="bg-[#F5EFE6]/80 backdrop-blur-sm border border-brand-500/10 rounded-xl px-4 py-2.5 min-w-0 w-full">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">High Risk</div>
            <div className="text-2xl font-bold text-[#ea580c]">{myP.filter(p=>p.riskLevel==='high').length || 2}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">need attention</div>
          </div>
          <div className="bg-[#F5EFE6]/80 backdrop-blur-sm border border-brand-500/10 rounded-xl px-4 py-2.5 min-w-0 w-full">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Critical</div>
            <div className="text-2xl font-bold text-[#dc2626]">{myP.filter(p=>p.riskLevel==='critical').length || 1}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">red-flag list</div>
          </div>
        </div>
      </div>

      {/* 8 KPIs in a 4x2 grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <KPICard label="District Projects" value={myP.length} icon="folder-kanban" color="brand" onClick={() => nav('/projects')} />
        <KPICard label="Pending Acquisition" value="8" icon="clock" color="green" />
        <KPICard label="Verification Pending" value="15" icon="clipboard-check" color="orange" />
        <KPICard label="Compensation Pending" value="28" icon="wallet" color="blue" />

        <KPICard label="Affected Families" value={nfmt(1240)} icon="users" color="slate" />
        <KPICard label="R&R Cases" value="320" icon="heart-handshake" color="amber" />
        <KPICard label="Possession" value="52%" icon="home" color="green" />
        <KPICard label="Critical Cases" value={critCount || 2} icon="alert-triangle" color="red" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        {/* District GIS Map (Takes 2 columns) */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <PanelCard title={`${userDistrict} GIS Map`} icon="map" action={<Icon name="more-horizontal" size={14} className="text-slate-400" />}>
            <DemoMap
              center={[28.609, 76.991]}
              zoom={12}
              height="h-64"
              badgeText={`${userDistrict.toUpperCase()} · GROUND OPERATIONS`}
              markers={[
                { lat: 28.609, lng: 76.978, color: '#10B981', radius: 8, tooltip: '<b>Najafgarh Sub-Division</b><br>Tehsil Office · 280 Parcels' },
                { lat: 28.595, lng: 76.991, color: '#3B82F6', radius: 7, tooltip: '<b>Dhansa Zone</b><br>Survey Camp · 240 Parcels' },
                { lat: 28.622, lng: 77.001, color: '#F59E0B', radius: 7, tooltip: '<b>Rewla Khanpur</b><br>Award Inquiries · 210 Parcels' },
                { lat: 28.584, lng: 77.015, color: '#EF4444', radius: 7, tooltip: '<b>Goela Khurd</b><br>Disputed Boundary · 190 Parcels' },
              ]}
              parcels={(window.BS_DATA && window.BS_DATA.PARCELS && window.BS_DATA.PARCELS.slice(0, 100)) || []}
              legendItems={[
                { color: '#10B981', label: 'Verified & Cleared' },
                { color: '#3B82F6', label: 'Survey In-Progress' },
                { color: '#EF4444', label: 'Disputed / Critical' },
              ]}
              onClick={() => nav('/gis')}
            />
          </PanelCard>

          {/* Recent Activity directly underneath Map */}
          <PanelCard title="Recent Activity" icon="activity">
            <div className="space-y-1">
              <div className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center"><Icon name="check" size={12} className="text-emerald-600" /></div>
                <div className="flex-1 text-xs text-slate-700">Field verification completed — Parcel DLP-00043 (Najafgarh)</div>
                <div className="text-[10px] text-slate-400">2 hrs ago</div>
              </div>
              <div className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
                <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center"><Icon name="wallet" size={12} className="text-blue-600" /></div>
                <div className="flex-1 text-xs text-slate-700">Compensation award published — ₹48,00,000 for DL-001</div>
                <div className="text-[10px] text-slate-400">5 hrs ago</div>
              </div>
              <div className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
                <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center"><Icon name="clock" size={12} className="text-amber-600" /></div>
                <div className="flex-1 text-xs text-slate-700">Field Officer Deepa Kapoor assigned to Dhansa survey</div>
                <div className="text-[10px] text-slate-400">8 hrs ago</div>
              </div>
            </div>
          </PanelCard>
        </div>

        {/* Pending Actions (Takes 1 column) */}
        <div className="lg:col-span-1 flex flex-col">
          <PanelCard title="Pending Actions" icon="clock" action={<Icon name="more-horizontal" size={14} className="text-slate-400" />}>
            <div className="h-64 flex flex-col">
              <div className="grid grid-cols-12 gap-2 text-[10px] uppercase font-semibold text-slate-400 border-b border-slate-100 pb-2 mb-2 px-1">
                <div className="col-span-6">Task</div>
                <div className="col-span-2 text-center">Count</div>
                <div className="col-span-4 text-right">Priority</div>
              </div>
              <div className="flex-1 overflow-y-auto space-y-1 sb-scroll pr-1">
                {pendingActions.map(a => (
                  <div key={a.task} className="grid grid-cols-12 gap-2 items-center py-2 px-1 hover:bg-slate-50 rounded cursor-pointer transition-colors" onClick={() => nav('/tasks')}>
                    <div className="col-span-6 text-xs font-medium text-slate-800 truncate">{a.task}</div>
                    <div className="col-span-2 text-center text-xs font-bold text-slate-600">{a.count}</div>
                    <div className="col-span-4 text-right"><span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${a.c}`}>{a.priority}</span></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <Button variant="danger" size="sm" className="flex-1" icon="alert-triangle" onClick={() => nav('/approvals')}>Critical Actions</Button>
            </div>
          </PanelCard>
        </div>
      </div>

      {/* Critical projects red-flag table */}
      <Card pad={false} className="mb-4">
        <div className="p-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Critical projects · red-flag list</h2>
            <p className="text-sm text-slate-500 mt-0.5">Projects with predicted risk ≥ 65% requiring supervisor attention</p>
          </div>
          <Button variant="secondary" size="sm" icon="arrow-right" onClick={()=>nav('/projects?risk=critical')}>Open list</Button>
        </div>
        <DataTable
          onRowClick={(r)=>nav('/projects/'+r.id)}
          columns={[
            { key:'id', label:'Project', render:r=>(
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-[11px] font-semibold ${r.riskLevel==='critical'?'bg-red-500':'bg-orange-500'}`}>
                  {(r.type||'P')[0]}
                </div>
                <div>
                  <div className="font-medium text-slate-900 text-sm">{r.name}</div>
                  <div className="text-[11px] text-slate-500 font-mono">{r.id}</div>
                </div>
              </div>
            )},
            { key:'type', label:'Type' },
            { key:'state', label:'State', render:r=>`${r.state} · ${r.district || ''}` },
            { key:'stage', label:'Stage', render:r=>(
              <div className="flex items-center gap-2">
                <div className="text-xs font-mono text-slate-600">S{r.currentStage}/7</div>
                <div className="w-24"><Progress value={r.progress} tone="brand" size="sm"/></div>
              </div>
            )},
            { key:'risk', label:'Risk', render:r=>(
              <div className="flex items-center gap-2">
                <span className={`tabular font-semibold ${r.riskLevel==='critical'?'text-red-600':r.riskLevel==='high'?'text-orange-600':'text-amber-600'}`}>{r.aiRisk}%</span>
                <RiskBadge level={r.riskLevel}/>
              </div>
            )},
            { key:'delay', label:'Expected Delay', render:r=><span className="tabular">{r.expectedDelay}d</span> },
            { key:'owner', label:'Owner' },
          ]}
          rows={myP.filter(p => p.riskLevel === 'critical' || p.riskLevel === 'high').slice(0, 5)}
        />
      </Card>
    </AppLayout>
  );
}

// ─────────────────────────────────────────────
//  4. PROJECT MANAGER DASHBOARD
// ─────────────────────────────────────────────
function ProjectAgencyDashboard() {
  useLucide(); useStore();
  const nav = useNav();
  const user = (window.BS_STATE && window.BS_STATE.user) || {};
  const projects = (window.BS_DATA && window.BS_DATA.PROJECTS) || [];
  const assignedId = user.assignedProject || (projects[0] ? projects[0].id : 'DL-001');
  const [selectedId, setSelectedId] = React.useState(assignedId);

  const fl = projects.find(p => p.id === selectedId) || projects[0];
  if (!fl) return <AppLayout crumbs={[{ label: 'Project Command Center' }]}><Empty title="No projects assigned" subtitle="Contact your administrator." /></AppLayout>;

  const req = fl.landRequired || 485;
  const acq = fl.landAcquired || 298;
  const ver = fl.landVerified || Math.round(acq * 1.35);
  const rem = fl.remaining != null ? fl.remaining : Math.max(0, req - acq);
  const rPct = Math.round((acq / req) * 100);

  const tl = [
    { label: 'Land Identification', done: true, date: 'Completed' },
    { label: 'Verification', done: fl.currentStage >= 2, date: fl.currentStage >= 2 ? 'Completed' : 'Pending' },
    { label: 'Compensation', done: fl.currentStage >= 4, date: fl.currentStage === 4 ? 'In Progress' : fl.currentStage > 4 ? 'Completed' : 'Pending' },
    { label: 'Possession', done: fl.currentStage >= 5, date: fl.currentStage >= 5 ? 'Completed' : 'Pending' },
    { label: 'Completion', done: fl.currentStage >= 7, date: 'Pending' },
  ];

  return (
    <AppLayout crumbs={[{ label: fl.name }]} right={
      <div className="flex gap-2 items-center">
        <select
          value={fl.id}
          onChange={e => setSelectedId(e.target.value)}
          className="bg-white border border-slate-200 text-sm rounded-lg px-3 py-1.5 outline-none shadow-sm cursor-pointer max-w-[280px] truncate"
        >
          {projects.map(p => <option key={p.id} value={p.id}>{p.name} ({p.id})</option>)}
        </select>
        <Button variant="secondary" size="sm" icon="download">Export</Button>
      </div>
    }>
      <div className="rounded-2xl bg-gradient-to-br from-[#F5EFE6] via-[#EDE3D5] to-[#E5D9C6] ring-1 ring-brand-500/20 px-6 py-8 mb-5 relative overflow-hidden flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(600px 250px at 10% 0%, rgba(245,158,11,.3), transparent 60%)' }} />
        
        <div className="relative z-10 max-w-xl">
          <div className="text-[11px] tracking-widest text-brand-600 font-semibold flex items-center gap-2 uppercase mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 pulse-ring" />
            LIVE · {fl.implementingAgency || 'PROJECT'} MANAGER
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">Good morning, {user.name || 'Amit Patel'}.</h1>
          <p className="text-sm text-slate-700 leading-relaxed mb-4">
            {projects.filter(p=>p.riskLevel==='critical').length || 1} projects need intervention today. You are viewing {fl.name} ({fl.id}).
          </p>
          <div className="flex items-center gap-3">
            <button onClick={() => nav('/ai/risk')} className="flex items-center gap-2 bg-[#B87333] hover:bg-[#9E5F26] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
              <Icon name="brain-circuit" size={14} />
              Open AI Risk Center
            </button>
            <button onClick={() => nav('/tasks?tab=main')} className="flex items-center gap-2 bg-white/60 hover:bg-white text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm ring-1 ring-slate-200/50">
              <Icon name="list-checks" size={14} className="text-brand-500" />
              Manage Tasks
            </button>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-3 w-full md:w-auto">
          <div className="bg-[#F5EFE6]/80 backdrop-blur-sm border border-brand-500/10 rounded-xl px-4 py-2.5 min-w-0 w-full">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Assigned Projects</div>
            <div className="text-2xl font-bold text-slate-900">{projects.length || 3}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">your portfolio</div>
          </div>
          <div className="bg-[#F5EFE6]/80 backdrop-blur-sm border border-brand-500/10 rounded-xl px-4 py-2.5 min-w-0 w-full">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Active</div>
            <div className="text-2xl font-bold text-slate-900">{projects.length || 3}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">100% of portfolio</div>
          </div>
          <div className="bg-[#F5EFE6]/80 backdrop-blur-sm border border-brand-500/10 rounded-xl px-4 py-2.5 min-w-0 w-full">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">High Risk</div>
            <div className="text-2xl font-bold text-[#ea580c]">{projects.filter(p=>p.riskLevel==='high').length || 1}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">need attention</div>
          </div>
          <div className="bg-[#F5EFE6]/80 backdrop-blur-sm border border-brand-500/10 rounded-xl px-4 py-2.5 min-w-0 w-full">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Critical</div>
            <div className="text-2xl font-bold text-[#dc2626]">{projects.filter(p=>p.riskLevel==='critical').length || 1}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">red-flag list</div>
          </div>
        </div>
      </div>

      {/* 8 KPIs in a 4x2 grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <KPICard label="Land Required" value={nfmt(req) + ' Ha'} icon="land-plot" color="slate" />
        <KPICard label="Land Verified" value={nfmt(ver) + ' Ha'} icon="clipboard-check" color="blue" />
        <KPICard label="Land Acquired" value={nfmt(acq) + ' Ha'} icon="check-circle-2" color="green" />
        <KPICard label="Land Remaining" value={nfmt(rem) + ' Ha'} icon="alert-triangle" color="amber" />

        <KPICard label="Affected Families" value={nfmt(fl.households || 1240)} icon="users" color="slate" />
        <KPICard label="Compensation Paid" value={'₹' + Math.round((fl.compensationPaid || 42000000) / 10000000) + ' Cr'} icon="wallet" color="green" />
        <KPICard label="R&R Progress" value={(fl.rrProgress || 52) + '%'} icon="heart-handshake" color="brand" />
        <KPICard label="Project Risk Score" value={fl.riskLevel ? fl.riskLevel.toUpperCase() : 'HIGH'} icon="activity" color={fl.riskLevel === 'critical' ? 'red' : 'orange'} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        {/* Project GIS Map (Takes 2 columns) */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <PanelCard title={`${fl.id} GIS Overview`} icon="map" action={<Icon name="more-horizontal" size={14} className="text-slate-400" />}>
            <DemoMap
              center={fl.centerLat ? [fl.centerLat, fl.centerLng] : [28.609, 77.005]}
              zoom={12}
              height="h-64"
              badgeText={`${fl.id} · ALIGNMENT & PARCELS`}
              parcels={(window.BS_DATA && window.BS_DATA.PARCELS && window.BS_DATA.PARCELS.slice(0, 90)) || []}
              legendItems={[
                { color: '#10B981', label: 'Acquired' },
                { color: '#3B82F6', label: 'In Progress' },
                { color: '#F59E0B', label: 'Pending Verification' },
              ]}
              onClick={() => nav('/gis')}
            />
          </PanelCard>

          {/* AI Risk below map */}
          <PanelCard title="AI Project Risk & Predictions" icon="brain-circuit" badge={`${fl.aiRisk || 78}% Risk`} badgeColor="red">
            <div className="space-y-2">
              <div className="flex gap-3 items-start p-3 bg-amber-50/50 rounded-lg border border-amber-100">
                <Icon name="clock" size={16} className="text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-slate-800">{fl.expectedDelay || 24}-Day Delay Predicted</div>
                  <div className="text-xs text-slate-600 mt-1">AI model predicts potential bottleneck in Section 19 award inquiries.</div>
                </div>
                <Button variant="secondary" size="sm" className="ml-auto text-amber-700 bg-white" onClick={() => nav('/ai/risk')}>Details</Button>
              </div>
              <div className="flex gap-3 items-start p-3 bg-slate-50 rounded-lg border border-slate-100">
                <Icon name="lightbulb" size={16} className="text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-slate-800">Recommendation: Organize R&R Facilitation Camp</div>
                  <div className="text-xs text-slate-600 mt-1">Direct grievance resolution can accelerate pending consent awards by 18 days.</div>
                </div>
                <Button variant="secondary" size="sm" className="ml-auto bg-white" onClick={() => nav('/ai/recommendations')}>Apply</Button>
              </div>
            </div>
          </PanelCard>
        </div>

        {/* Timeline (Takes 1 column) */}
        <div className="lg:col-span-1 flex flex-col">
          <PanelCard title="Land Readiness Timeline" icon="clock" action={<Icon name="more-horizontal" size={14} className="text-slate-400" />}>
            <div className="h-[432px] overflow-y-auto pr-2 relative">
              <div className="absolute top-4 bottom-4 left-4 border-l-2 border-slate-100"></div>
              <div className="space-y-6 relative">
                {tl.map((step, i) => (
                  <div key={step.label} className="flex gap-4 relative">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ring-4 ring-white ${step.done ? 'bg-brand-500 text-white' : (i === 2 ? 'bg-brand-100 border-2 border-brand-500 text-brand-600' : 'bg-slate-100 text-slate-400')}`}>
                      {step.done ? <Icon name="check" size={14} /> : <span className="text-xs font-bold">{i + 1}</span>}
                    </div>
                    <div className="pt-1.5 flex-1 pb-4">
                      <div className={`text-sm font-semibold ${step.done ? 'text-slate-800' : (i === 2 ? 'text-brand-700' : 'text-slate-500')}`}>{step.label}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{step.date}</div>
                      {i === 2 && (
                        <div className="mt-2 p-2 bg-slate-50 rounded border border-slate-100 text-[10px] text-slate-600">
                          Currently processing DBT compensation awards for Najafgarh parcels.
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </PanelCard>
        </div>
      </div>

      {/* Critical projects red-flag table */}
      <Card pad={false} className="mb-4">
        <div className="p-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Critical projects · red-flag list</h2>
            <p className="text-sm text-slate-500 mt-0.5">Projects with predicted risk ≥ 65% requiring supervisor attention</p>
          </div>
          <Button variant="secondary" size="sm" icon="arrow-right" onClick={()=>nav('/projects?risk=critical')}>Open list</Button>
        </div>
        <DataTable
          onRowClick={(r)=>nav('/projects/'+r.id)}
          columns={[
            { key:'id', label:'Project', render:r=>(
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-[11px] font-semibold ${r.riskLevel==='critical'?'bg-red-500':'bg-orange-500'}`}>
                  {(r.type||'P')[0]}
                </div>
                <div>
                  <div className="font-medium text-slate-900 text-sm">{r.name}</div>
                  <div className="text-[11px] text-slate-500 font-mono">{r.id}</div>
                </div>
              </div>
            )},
            { key:'type', label:'Type' },
            { key:'state', label:'State', render:r=>`${r.state} · ${r.district || ''}` },
            { key:'stage', label:'Stage', render:r=>(
              <div className="flex items-center gap-2">
                <div className="text-xs font-mono text-slate-600">S{r.currentStage}/7</div>
                <div className="w-24"><Progress value={r.progress} tone="brand" size="sm"/></div>
              </div>
            )},
            { key:'risk', label:'Risk', render:r=>(
              <div className="flex items-center gap-2">
                <span className={`tabular font-semibold ${r.riskLevel==='critical'?'text-red-600':r.riskLevel==='high'?'text-orange-600':'text-amber-600'}`}>{r.aiRisk}%</span>
                <RiskBadge level={r.riskLevel}/>
              </div>
            )},
            { key:'delay', label:'Expected Delay', render:r=><span className="tabular">{r.expectedDelay}d</span> },
            { key:'owner', label:'Owner' },
          ]}
          rows={projects.filter(p => p.riskLevel === 'critical' || p.riskLevel === 'high').slice(0, 5)}
        />
      </Card>
    </AppLayout>
  );
}

// ─────────────────────────────────────────────
//  5. FIELD OFFICER DASHBOARD
// ─────────────────────────────────────────────
function FieldOfficerDashboard() {
  useLucide(); useStore();
  const nav = useNav();
  const user = (window.BS_STATE && window.BS_STATE.user) || {};
  const isDelhi = user.state === 'Delhi';

  const visits = isDelhi ? [
    { time: '09:30 AM', parcel: 'DLP-00043', village: 'Najafgarh', owner: 'Rajesh Kumar', status: 'Completed', c: 'text-emerald-600 bg-emerald-50' },
    { time: '11:00 AM', parcel: 'DLP-00084', village: 'Dhansa', owner: 'Sunita Devi', status: 'In Progress', c: 'text-blue-600 bg-blue-50' },
    { time: '02:00 PM', parcel: 'DLP-00112', village: 'Rewla Khanpur', owner: 'Manoj Sharma', status: 'Pending', c: 'text-orange-600 bg-orange-50' },
    { time: '04:30 PM', parcel: 'DLP-00178', village: 'Goela Khurd', owner: 'Rameshwar Singh', status: 'Pending', c: 'text-orange-600 bg-orange-50' },
  ] : [
    { time: '09:30 AM', parcel: 'RJ-2041', village: 'Bagru Kalan', owner: 'Ramesh Kumar', status: 'Completed', c: 'text-emerald-600 bg-emerald-50' },
    { time: '11:00 AM', parcel: 'RJ-2048', village: 'Chomu', owner: 'Sita Devi', status: 'In Progress', c: 'text-blue-600 bg-blue-50' },
    { time: '02:00 PM', parcel: 'RJ-2052', village: 'Hirapura', owner: 'Vijay Singh', status: 'Pending', c: 'text-orange-600 bg-orange-50' },
    { time: '04:30 PM', parcel: 'RJ-2057', village: 'Sanganer', owner: 'Lalita', status: 'Pending', c: 'text-orange-600 bg-orange-50' },
  ];

  return (
    <AppLayout crumbs={[{ label: 'Field Operations' }]}>
      <div className="rounded-2xl bg-gradient-to-br from-[#F5EFE6] via-[#EDE3D5] to-[#E5D9C6] ring-1 ring-brand-500/20 px-6 py-8 mb-5 relative overflow-hidden flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(600px 250px at 10% 0%, rgba(16,185,129,.35), transparent 60%)' }} />
        
        <div className="relative z-10 max-w-xl">
          <div className="text-[11px] tracking-widest text-brand-600 font-semibold flex items-center gap-2 uppercase mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-ring" />
            LIVE · FIELD OPERATIONS · {user.district || 'SOUTH-WEST DELHI'}
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">Good morning, {(user.name || 'Officer').split(' ')[0]}.</h1>
          <p className="text-sm text-slate-700 leading-relaxed mb-4">
            Field activities for today. You have {visits.length} scheduled visits for ground verification and boundary surveys.
          </p>
          <div className="flex items-center gap-3 relative z-50">
            <button type="button" onClick={() => nav('/tasks?tab=main')} className="flex items-center gap-2 bg-[#B87333] hover:bg-[#9E5F26] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm pointer-events-auto cursor-pointer">
              <Icon name="list-checks" size={14} />
              My Tasks
            </button>
            <button type="button" onClick={() => nav('/gis')} className="flex items-center gap-2 bg-white/60 hover:bg-white text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm ring-1 ring-slate-200/50 pointer-events-auto cursor-pointer">
              <Icon name="map" size={14} className="text-brand-500" />
              GIS Map
            </button>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-3 w-full md:w-auto">
          <div className="bg-[#F5EFE6]/80 backdrop-blur-sm border border-brand-500/10 rounded-xl px-4 py-2.5 min-w-0 w-full">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Visits Today</div>
            <div className="text-2xl font-bold text-slate-900">{visits.length}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">scheduled</div>
          </div>
          <div className="bg-[#F5EFE6]/80 backdrop-blur-sm border border-brand-500/10 rounded-xl px-4 py-2.5 min-w-0 w-full">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Completed</div>
            <div className="text-2xl font-bold text-emerald-600">{visits.filter(v=>v.status==='Completed').length}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">inspections</div>
          </div>
          <div className="bg-[#F5EFE6]/80 backdrop-blur-sm border border-brand-500/10 rounded-xl px-4 py-2.5 min-w-0 w-full">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Pending</div>
            <div className="text-2xl font-bold text-[#ea580c]">{visits.filter(v=>v.status==='Pending').length}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">to be visited</div>
          </div>
          <div className="bg-[#F5EFE6]/80 backdrop-blur-sm border border-brand-500/10 rounded-xl px-4 py-2.5 min-w-0 w-full">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Sync Pending</div>
            <div className="text-2xl font-bold text-[#dc2626]">4</div>
            <div className="text-[10px] text-slate-500 mt-0.5">offline records</div>
          </div>
        </div>
      </div>

      {/* 8 KPIs in a 4x2 grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <KPICard label="Assigned Parcels" value={14} icon="list-checks" color="brand" />
        <KPICard label="Visits Today" value={4} icon="calendar-check" color="blue" />
        <KPICard label="Completed Visits" value={1} icon="check-circle-2" color="green" />
        <KPICard label="Pending Visits" value={3} icon="clock" color="orange" />

        <KPICard label="Sync Pending" value={1} icon="refresh-cw" color="slate" />
        <KPICard label="Verification Backlog" value={8} icon="clipboard-list" color="amber" />
        <KPICard label="Critical Cases" value={1} icon="alert-triangle" color="red" />
        <KPICard label="Travel Distance" value="18 km" icon="navigation" color="slate" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        {/* Left Column (2 parts) */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <PanelCard title="Today's Visits & Inspections" icon="calendar-check" action={<Button variant="primary" size="sm" icon="plus">Add Visit</Button>}>
            <div className="h-64 flex flex-col">
              <div className="grid grid-cols-12 gap-2 text-[10px] uppercase font-semibold text-slate-400 border-b border-slate-100 pb-2 mb-2 px-1">
                <div className="col-span-2">Time</div>
                <div className="col-span-2">Parcel ID</div>
                <div className="col-span-3">Village</div>
                <div className="col-span-3">Owner</div>
                <div className="col-span-2 text-right">Status</div>
              </div>
              <div className="flex-1 overflow-y-auto space-y-1 sb-scroll pr-1">
                {visits.map(v => (
                  <div key={v.parcel} className="grid grid-cols-12 gap-2 items-center py-2 px-1 hover:bg-slate-50 rounded cursor-pointer transition-colors" onClick={() => nav('/households')}>
                    <div className="col-span-2 text-xs font-mono text-slate-500">{v.time}</div>
                    <div className="col-span-2 text-xs font-bold text-slate-800">{v.parcel}</div>
                    <div className="col-span-3 text-xs font-medium text-slate-600">{v.village}</div>
                    <div className="col-span-3 text-xs font-medium text-slate-600">{v.owner}</div>
                    <div className="col-span-2 text-right"><span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${v.c}`}>{v.status}</span></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <Button variant="secondary" size="sm" className="flex-1" icon="map" onClick={() => nav('/gis')}>Optimize Route</Button>
            </div>
          </PanelCard>
        </div>

        {/* Right Column (1 part) */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <PanelCard title="Sync & Field Status" icon="refresh-cw" action={<Button variant="secondary" size="sm" icon="wifi">Online</Button>}>
            <div className="h-64 flex flex-col gap-4 py-2">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center flex-1 flex flex-col justify-center">
                <Icon name="upload-cloud" size={24} className="text-brand-500 mx-auto mb-2" />
                <div className="text-sm font-semibold text-slate-800">4 records pending sync</div>
                <div className="text-[11px] text-slate-500 mt-1">Last synced 35 mins ago</div>
                <Button variant="primary" size="sm" className="w-full mt-3 max-w-[150px] mx-auto">Sync Now</Button>
              </div>
              <div className="px-2">
                <div className="flex items-center justify-between text-[11px] mb-1"><span className="text-slate-600 font-medium">Battery Level</span><span className="text-emerald-600 font-bold">88%</span></div>
                <div className="w-full bg-slate-200 rounded-full h-1.5"><div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '88%' }}></div></div>
              </div>
              <div className="px-2">
                <div className="flex items-center justify-between text-[11px] mb-1"><span className="text-slate-600 font-medium">GPS Accuracy</span><span className="text-emerald-600 font-bold">±2.4 meters</span></div>
                <div className="w-full bg-slate-200 rounded-full h-1.5"><div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '95%' }}></div></div>
              </div>
            </div>
          </PanelCard>
        </div>
      </div>

      <PanelCard title="My Assigned Parcels — GIS Map" icon="map" action={<Icon name="more-horizontal" size={14} className="text-slate-400" />}>
        <DemoMap
          center={isDelhi ? [28.606, 76.988] : [26.803, 75.575]}
          zoom={13}
          height="h-64"
          badgeText={`FIELD VIEW · ${(window.BS_DATA && window.BS_DATA.PARCELS && window.BS_DATA.PARCELS.length) || 0} PARCELS`}
          parcels={((window.BS_DATA && window.BS_DATA.PARCELS) || []).slice(0, 250)}
          onClick={() => nav('/gis')}
        />
        <div className="mt-3 flex gap-2">
          <Button variant="secondary" size="sm" className="flex-1" icon="map" onClick={() => nav('/gis')}>Open Full GIS Map</Button>
        </div>
      </PanelCard>
    </AppLayout>
  );
}
// ─────────────────────────────────────────────
function LandownerDashboard() {
  useLucide(); useStore();
  const nav = useNav();
  const user = (window.BS_STATE && window.BS_STATE.user) || {};
  const lo = (window.BS_DATA && window.BS_DATA.LANDOWNER_DATA) || {
    surveyNumber: 'SY-2041/B',
    landArea: 1.24,
    landUnit: 'Hectares',
    village: 'Najafgarh',
    district: 'South-West Delhi',
    state: 'Delhi',
    compensationApproved: 4800000,
    compensationStatus: 'Approved',
    rrStatus: 'In Progress',
    rrEntitlement: 'Rehabilitation Assistance + Subsistence Allowance',
    rrExpectedDate: 'Oct 2026',
    nextAction: 'Verification scheduled: 18 Sept 2026 at Najafgarh Tehsil Office',
  };

  const notifs = (window.BS_DATA && window.BS_DATA.NOTIFICATIONS) || [
    { msg: 'Award document is ready for collection at Tehsil Office', time: '2h ago', type: 'info' },
    { msg: 'Verification scheduled: 18 Sept 2026 at 10:00 AM', time: '1d ago', type: 'warn' },
    { msg: 'Compensation of ₹48,00,000 approved by LAO', time: '3d ago', type: 'success' },
  ];

  const grievances = (window.BS_DATA && window.BS_DATA.GRIEVANCES) || [];
  const [showModal, setShowModal] = React.useState(false);
  const [category, setCategory] = React.useState('Compensation Dispute');
  const [desc, setDesc] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);

  const stages = [
    { label: 'Land Identified', done: true },
    { label: 'Survey & Verification', done: true },
    { label: 'Compensation Award', done: true },
    { label: 'R&R Assistance', done: false },
    { label: 'Possession', done: false },
  ];

  const nc = { info: 'text-blue-600 bg-blue-50', warn: 'text-amber-600 bg-amber-50', success: 'text-emerald-600 bg-emerald-50' };
  const ni = { info: 'info', warn: 'clock', success: 'check-circle-2' };

  const handleRaiseGrievance = async (e) => {
    e.preventDefault();
    if (!desc.trim()) return;
    setSubmitting(true);
    try {
      await window.submitGrievance({
        category,
        description: desc,
        projectId: lo.projectId || 'DL-001',
        parcelId: lo.parcelId || 'DLP-00043',
      });
      setDesc('');
      setShowModal(false);
    } catch (err) {
      alert('Error submitting grievance: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppLayout crumbs={[{ label: 'My DigiBhoomi' }]}>
      <div className="rounded-2xl bg-gradient-to-br from-[#F5EFE6] via-[#EDE3D5] to-[#E5D9C6] ring-1 ring-brand-500/20 px-6 py-8 mb-5 relative overflow-hidden flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(600px 250px at 10% 0%, rgba(184,115,51,.4), transparent 60%)' }} />
        
        <div className="relative z-10 max-w-xl">
          <div className="text-[11px] tracking-widest text-brand-600 font-semibold flex items-center gap-2 uppercase mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 pulse-ring" />
            LIVE · CITIZEN PORTAL · MY DIGIBHOOMI
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">Welcome, {(user.name || lo.ownerName || 'Rajesh Kumar').split(' ')[0]}.</h1>
          <p className="text-sm text-slate-700 leading-relaxed mb-4">
            Track your land acquisition status on the Official Land Record Portal. You have {notifs.length} new notifications.
          </p>
          <div className="flex items-center gap-3 relative z-50">
            <button type="button" onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-[#B87333] hover:bg-[#9E5F26] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm pointer-events-auto cursor-pointer">
              <Icon name="message-square-warning" size={14} />
              Raise Grievance
            </button>
            <button type="button" onClick={() => {
              const el = document.getElementById('acq-status-section');
              if(el) {
                el.scrollIntoView({ behavior: 'smooth' });
                el.classList.add('ring-2', 'ring-brand-500', 'ring-offset-2');
                setTimeout(() => el.classList.remove('ring-2', 'ring-brand-500', 'ring-offset-2'), 1500);
              }
            }} className="flex items-center gap-2 bg-white/60 hover:bg-white text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm ring-1 ring-slate-200/50 pointer-events-auto cursor-pointer">
              <Icon name="activity" size={14} className="text-amber-500" />
              Acquisition Status
            </button>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-3 w-full md:w-auto">
          <div className="bg-[#F5EFE6]/80 backdrop-blur-sm border border-brand-500/10 rounded-xl px-4 py-2.5 min-w-0 w-full">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Land Parcels</div>
            <div className="text-2xl font-bold text-slate-900">1</div>
            <div className="text-[10px] text-slate-500 mt-0.5">{lo.landArea || 1.24} {lo.landUnit || 'Hectares'}</div>
          </div>
          <div className="bg-[#F5EFE6]/80 backdrop-blur-sm border border-brand-500/10 rounded-xl px-4 py-2.5 min-w-0 w-full">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Compensation</div>
            <div className="text-2xl font-bold text-emerald-600">₹48L</div>
            <div className="text-[10px] text-slate-500 mt-0.5">approved</div>
          </div>
          <div className="bg-[#F5EFE6]/80 backdrop-blur-sm border border-brand-500/10 rounded-xl px-4 py-2.5 min-w-0 w-full">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Status</div>
            <div className="text-2xl font-bold text-[#ea580c]">In Progress</div>
            <div className="text-[10px] text-slate-500 mt-0.5">awaiting possession</div>
          </div>
          <div className="bg-[#F5EFE6]/80 backdrop-blur-sm border border-brand-500/10 rounded-xl px-4 py-2.5 min-w-0 w-full">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Grievances</div>
            <div className="text-2xl font-bold text-[#dc2626]">{grievances.length || 0}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">active issues</div>
          </div>
        </div>
      </div>

      {/* Land Info Card */}
      <div id="acq-status-section" className="bg-white rounded-xl ring-1 ring-slate-200/70 shadow-card p-5 mb-5 transition-all duration-500">
        <div className="flex items-center gap-2 mb-4"><Icon name="map-pin" size={16} className="text-brand-500" /><span className="text-sm font-semibold text-slate-900">YOUR LAND DETAILS</span></div>
        <div className="grid md:grid-cols-4 gap-4 mb-4">
          <div><div className="text-[11px] text-slate-500">Survey Number</div><div className="text-sm font-semibold text-slate-900 mt-0.5">{lo.surveyNumber || 'SY-2041/B'}</div></div>
          <div><div className="text-[11px] text-slate-500">Total Area</div><div className="text-sm font-semibold text-slate-900 mt-0.5">{lo.landArea || 1.24} {lo.landUnit || 'Hectares'}</div></div>
          <div><div className="text-[11px] text-slate-500">Village & District</div><div className="text-sm font-semibold text-slate-900 mt-0.5">{lo.village || 'Najafgarh'}, {lo.district || 'South-West Delhi'}</div></div>
          <div><div className="text-[11px] text-slate-500">Project</div><div className="text-sm font-semibold text-slate-900 mt-0.5">Delhi Ring Road — Phase 4 Expansion</div></div>
        </div>
        <div className="bg-slate-50 rounded-xl p-3">
          <div className="text-[11px] text-slate-500 mb-2">Acquisition Progress</div>
          <div className="flex flex-wrap gap-2">{stages.map(s => <StagePill key={s.label} label={s.label} done={s.done} />)}</div>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Icon name="map" size={13} className="text-brand-500" />
              PARCEL GIS LOCATION · NAJAFGARH TEHSIL
            </div>
            <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Surveyed & Verified
            </span>
          </div>
          <DemoMap
            center={[28.6139, 76.9858]}
            zoom={15}
            height="h-44"
            badgeText="PARCEL DLP-00043 · 1.24 HA"
            markers={[
              {
                lat: 28.6139,
                lng: 76.9858,
                color: '#10B981',
                radius: 9,
                tooltip: '<b>Parcel DLP-00043 (Rajesh Kumar)</b><br>Area: 1.24 Ha · Status: Approved<br>Najafgarh, South-West Delhi',
              }
            ]}
            showLegend={false}
            onClick={() => nav('/gis')}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <PanelCard title="Compensation Status" icon="wallet">
          <div className="text-center py-2">
            <div className="text-3xl font-bold text-slate-900">₹48,00,000</div>
            <div className="text-sm text-emerald-600 font-medium mt-1">Approved by Land Acquisition Officer</div>
            <div className="text-xs text-amber-600 mt-1">Direct Benefit Transfer (DBT) pending release</div>
          </div>
          <Button variant="secondary" size="sm" className="w-full mt-3" icon="eye" onClick={() => nav('/documents')}>View Award Document</Button>
        </PanelCard>

        <PanelCard title="R&R Status & Entitlements" icon="heart-handshake">
          <div className="space-y-3">
            <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /><span className="text-sm font-medium text-slate-800">{lo.rrStatus || 'In Progress'}</span></div>
            <div><div className="text-xs text-slate-500">Entitlement Package</div><div className="text-sm font-medium text-slate-800 mt-0.5">{lo.rrEntitlement || 'Rehabilitation Assistance + Subsistence Allowance'}</div></div>
            <div><div className="text-xs text-slate-500">Expected Resolution</div><div className="text-sm font-medium text-slate-800 mt-0.5">{lo.rrExpectedDate || 'Oct 2026'}</div></div>
          </div>
        </PanelCard>
      </div>

      <div className="rounded-xl bg-amber-50 ring-1 ring-amber-200 p-4 flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center shrink-0"><Icon name="calendar" size={16} className="text-amber-700" /></div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-amber-900">Your Next Action</div>
          <div className="text-xs text-amber-700 mt-0.5">{lo.nextAction || 'Verification scheduled: 18 Sept 2026 at Najafgarh Tehsil Office'}</div>
        </div>
        <Button variant="warn" size="sm" onClick={() => nav('/documents')}>View Notice</Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <PanelCard title="Notifications" icon="bell" badge={notifs.length} badgeColor="blue">
          <div className="space-y-2">
            {notifs.map((n, i) => (
              <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${nc[n.type]}`}><Icon name={ni[n.type]} size={12} /></div>
                <div className="flex-1 min-w-0"><div className="text-xs text-slate-700">{n.msg}</div><div className="text-[10px] text-slate-400 mt-0.5">{n.time}</div></div>
              </div>
            ))}
          </div>
        </PanelCard>
        <PanelCard title="Grievance" icon="message-square">
          <div className="space-y-3">
            <div className="p-3 bg-slate-50 rounded-xl">
              <div className="flex items-center justify-between mb-1"><span className="text-xs font-mono font-semibold text-slate-700">#GRV-2048</span><span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">Under Review</span></div>
              <div className="text-xs text-slate-500">Compensation amount dispute</div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="secondary" size="sm" icon="search" onClick={() => nav('/documents')}>Track</Button>
              <Button variant="primary" size="sm" icon="plus" onClick={() => setShowModal(true)}>New</Button>
            </div>
          </div>
        </PanelCard>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-semibold text-slate-800">Raise New Grievance</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><Icon name="x" size={18} /></button>
            </div>
            <form onSubmit={handleRaiseGrievance} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Grievance Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full text-sm rounded-lg border-slate-200 focus:border-brand-500 focus:ring-brand-500 py-2">
                  <option>Compensation Dispute</option>
                  <option>Measurement Issue</option>
                  <option>Delay in Payment</option>
                  <option>R&R Assistance</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Description</label>
                <textarea required value={desc} onChange={e => setDesc(e.target.value)} rows={4} className="w-full text-sm rounded-lg border-slate-200 focus:border-brand-500 focus:ring-brand-500 py-2" placeholder="Provide details..."></textarea>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit" variant="primary" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Grievance'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

// ─────────────────────────────────────────────
//  ROLE DASHBOARD ROUTER
// ─────────────────────────────────────────────
function RoleDashboard() {
  const user = window.BS_STATE && window.BS_STATE.user;
  const rt = getRoleType(user && user.role);
  if (rt === ROLE_TYPES.MINISTRY) return <MinistryDashboard />;
  if (rt === ROLE_TYPES.STATE) return <StateDashboard />;
  if (rt === ROLE_TYPES.DISTRICT) return <DistrictDashboard />;
  if (rt === ROLE_TYPES.PROJECT) return <ProjectAgencyDashboard />;
  if (rt === ROLE_TYPES.FIELD) return <FieldOfficerDashboard />;
  if (rt === ROLE_TYPES.LANDOWNER) return <LandownerDashboard />;
  return <MinistryDashboard />;
}

Object.assign(window, {
  RoleDashboard, MinistryDashboard, StateDashboard, DistrictDashboard,
  ProjectAgencyDashboard, FieldOfficerDashboard, LandownerDashboard,
});
