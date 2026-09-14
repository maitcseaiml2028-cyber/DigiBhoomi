/* Shared UI components — exposed to window at end. */

const { useState, useEffect, useMemo, useRef, useCallback, createContext, useContext } = React;
const { Link, NavLink, useNavigate, useLocation, useParams, Outlet } = ReactRouterDOM;

// ---------- Icons (Lucide) ----------
function Icon({ name, size=16, className='', strokeWidth=1.75 }){
  const html = `<i data-lucide="${name}"></i>`;
  return <span dangerouslySetInnerHTML={{ __html: html }} className={`inline-flex align-[-2px] ${className}`} style={{width:size,height:size,strokeWidth,display:'inline-flex',alignItems:'center',justifyContent:'center'}} />;
}
function toCamel(s){ return s.replace(/-([a-z])/g, (_,c)=>c.toUpperCase()); }

// Global lucide hydrator — call once after mount, and after DOM updates.
function useLucide(){
  useEffect(() => {
    if(window.lucide?.createIcons){
      try { window.lucide.createIcons(); } catch(e){}
    }
  });
}

// ---------- Risk / Status Badges ----------
const RISK_STYLE = {
  low:      { bg:'bg-emerald-50', fg:'text-emerald-700', dot:'bg-emerald-500', label:'Low' },
  medium:   { bg:'bg-amber-50',   fg:'text-amber-700',  dot:'bg-amber-500',  label:'Medium' },
  high:     { bg:'bg-orange-50',  fg:'text-orange-700', dot:'bg-orange-500', label:'High' },
  critical: { bg:'bg-red-50',     fg:'text-red-700',    dot:'bg-red-500',    label:'Critical' },
};
function RiskBadge({ level, size='sm' }){
  const s = RISK_STYLE[level] || RISK_STYLE.medium;
  const cls = size === 'lg' ? 'text-xs px-2.5 py-1' : 'text-[11px] px-2 py-0.5';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${s.bg} ${s.fg} ${cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

function StatusBadge({ status }){
  const map = {
    'Not Started':{bg:'bg-slate-100', fg:'text-slate-600'},
    'In Progress':{bg:'bg-blue-50',   fg:'text-blue-700'},
    'Submitted':  {bg:'bg-indigo-50', fg:'text-indigo-700'},
    'Approved':   {bg:'bg-emerald-50',fg:'text-emerald-700'},
    'Rejected':   {bg:'bg-red-50',    fg:'text-red-700'},
    'Overdue':    {bg:'bg-red-50',    fg:'text-red-700'},
    'Completed':  {bg:'bg-emerald-50',fg:'text-emerald-700'},
    'Verified':   {bg:'bg-emerald-50',fg:'text-emerald-700'},
    'Pending':    {bg:'bg-amber-50',  fg:'text-amber-700'},
    'Missing':    {bg:'bg-slate-100', fg:'text-slate-600'},
    'Paid':       {bg:'bg-emerald-50',fg:'text-emerald-700'},
    'Clear':      {bg:'bg-emerald-50',fg:'text-emerald-700'},
    'Under Dispute':{bg:'bg-red-50',fg:'text-red-700'},
  };
  const s = map[status] || {bg:'bg-slate-100', fg:'text-slate-600'};
  return <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium ${s.bg} ${s.fg}`}>{status}</span>;
}

// ---------- Cards / Stats ----------
function Card({ children, className='', pad=true }){
  return (
    <div className={`bg-white rounded-xl ring-1 ring-slate-200/70 shadow-card ${pad?'p-5':''} ${className}`}>{children}</div>
  );
}

function StatCard({ label, value, delta, trend, icon, tone='default', hint }){
  const tones = {
    default:   'text-slate-900',
    critical:  'text-red-600',
    high:      'text-orange-600',
    medium:    'text-amber-600',
    good:      'text-emerald-600',
    brand:     'text-brand-500',
  };
  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="text-[11px] uppercase tracking-wider font-medium text-slate-500 truncate">{label}</div>
          <div className={`mt-1.5 text-[24px] sm:text-[26px] font-semibold leading-none tabular truncate ${tones[tone]}`}>{value}</div>
          {hint && <div className="mt-1.5 text-xs text-slate-500 truncate">{hint}</div>}
        </div>
        {icon && (
          <div className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${tone==='critical'?'bg-red-50 text-red-600':tone==='high'?'bg-orange-50 text-orange-600':tone==='medium'?'bg-amber-50 text-amber-600':tone==='good'?'bg-emerald-50 text-emerald-600':'bg-brand-500/10 text-brand-500'}`}>
            <Icon name={icon} size={18}/>
          </div>
        )}
      </div>
      {typeof delta !== 'undefined' && (
        <div className="mt-3 flex items-center gap-1.5 text-xs">
          <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-medium ${trend==='up'?'text-emerald-700 bg-emerald-50':trend==='down'?'text-red-700 bg-red-50':'text-slate-600 bg-slate-100'}`}>
            <Icon name={trend==='up'?'trending-up':trend==='down'?'trending-down':'minus'} size={12}/>
            {delta}
          </span>
          <span className="text-slate-500">vs last month</span>
        </div>
      )}
    </Card>
  );
}

// ---------- Sidebar ----------
// NAV is now dynamically resolved from ROLE_NAV (defined in pages_roles.jsx)
// based on the current user's role.
function getNavForRole() {
  const role = window.BS_STATE && window.BS_STATE.user && window.BS_STATE.user.role;
  if (window.ROLE_NAV && window.getRoleType) {
    const type = window.getRoleType(role);
    if (type && window.ROLE_NAV[type]) return window.ROLE_NAV[type];
  }
  // Fallback while pages_roles.jsx is still loading
  return [
    { section:'OVERVIEW', items:[
      { to:'/dashboard', label:'Command Center', icon:'layout-dashboard' },
      { to:'/projects',  label:'Projects',        icon:'folder-kanban' },
      { to:'/gis',       label:'GIS Map',         icon:'map' },
    ]},
    { section:'OPERATIONS', items:[
      { to:'/tasks',      label:'Tasks',       icon:'list-checks' },
      { to:'/approvals',  label:'Approvals',   icon:'stamp' },
      { to:'/documents',  label:'Documents',   icon:'file-check-2' },
    ]},
  ];
}

// Core active check:
// - If the nav item has a query string  → require an EXACT match with currentPath
//   (prevents /tasks?tab=my and /tasks?tab=today both lighting up)
// - If the nav item has NO query string → match by base-path prefix
function isNavItemActive(item, currentPath) {
  const path = currentPath || '/';
  if (item.to.includes('?')) {
    // Exact full match (path + query must be identical)
    return path === item.to;
  }
  // Plain route: match exact OR sub-path (e.g. /projects/123 matches /projects)
  return path === item.to || (item.to !== '/' && path.startsWith(item.to + '/'));
}

// Returns true if any item in the group is active (used to highlight section header)
function groupHasActive(items, currentPath) {
  return items.some(it => isNavItemActive(it, currentPath));
}

// Collapsible section group rendered inside the sidebar nav
function NavGroup({ group, isOpen, onToggle, collapsed, currentPath, onNav }) {
  const hasActive = groupHasActive(group.items, currentPath);
  return (
    <div className="px-3 mb-1">
      {!collapsed ? (
        <button
          onClick={onToggle}
          className={`w-full flex items-center justify-between gap-2 px-3 py-1.5 rounded-md mb-0.5 transition-colors
            ${hasActive ? 'text-brand-600' : 'text-slate-400 hover:text-slate-600'}`}
          title={group.section}
        >
          <span className="text-[10px] tracking-[0.15em] font-semibold uppercase truncate">{group.section}</span>
          <span className="shrink-0 transition-transform duration-200" style={{ transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)' }}>
            <Icon name="chevron-down" size={12} />
          </span>
        </button>
      ) : (
        <div className="mx-1 my-2 border-t border-navy-700/60" title={group.section} />
      )}
      <div
        className="flex flex-col gap-0.5 overflow-hidden transition-all duration-200"
        style={{
          maxHeight: (collapsed || isOpen) ? `${group.items.length * 44}px` : '0px',
          opacity: (collapsed || isOpen) ? 1 : 0,
        }}
      >
        {group.items.map(it => {
          const active = isNavItemActive(it, currentPath);
          return (
            <NavLink key={it.label} to={it.to}
              onClick={onNav}
              title={collapsed ? it.label : undefined}
              className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors
                ${active ? 'bg-brand-500/15 text-brand-600 ring-1 ring-brand-500/30' : 'text-slate-600 hover:bg-navy-700/60 hover:text-slate-900'}`}>
              <Icon name={it.icon} size={16} className="shrink-0" />
              {!collapsed && <span className="flex-1 truncate">{it.label}</span>}
              {!collapsed && it.pill && (
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-500 font-semibold">{it.pill}</span>
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}

function Sidebar({ mobileOpen, setMobileOpen }){
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('bs.sidebar') === '1');
  useEffect(()=>{ localStorage.setItem('bs.sidebar', collapsed?'1':'0'); }, [collapsed]);
  useLucide();
  const nav = useNavigate();
  const logout = () => {
    window.BS_STATE.user = null;
    window.BS_DATA = null;
    logoutRequest();
    toastBus.push('Signed out securely', 'info');
    nav('/login');
  };

  const navRef = useRef(null);
  useEffect(() => {
    const saved = sessionStorage.getItem('bs.sidebar.scroll');
    if (saved && navRef.current) navRef.current.scrollTop = Number(saved);
    const handleScroll = (e) => sessionStorage.setItem('bs.sidebar.scroll', e.target.scrollTop);
    const el = navRef.current;
    if (el) el.addEventListener('scroll', handleScroll);
    return () => { if (el) el.removeEventListener('scroll', handleScroll); };
  }, []);

  // Reactively track current hash-router path
  const [currentPath, setCurrentPath] = useState(
    () => window.location.hash.replace(/^#/, '') || '/'
  );
  useEffect(() => {
    const onHash = () => setCurrentPath(window.location.hash.replace(/^#/, '') || '/');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // Initialise open/closed per section — auto-expand the group containing the active page
  const navGroups = getNavForRole();
  const [openSections, setOpenSections] = useState(() => {
    const state = {};
    const groups = getNavForRole();
    groups.forEach(g => { state[g.section] = groupHasActive(g.items, window.location.hash.replace(/^#/, '') || '/'); });
    if (!Object.values(state).some(Boolean) && groups.length > 0) state[groups[0].section] = true;
    return state;
  });

  // Auto-expand matching group when path changes
  useEffect(() => {
    setOpenSections(prev => {
      const next = { ...prev };
      getNavForRole().forEach(g => { if (groupHasActive(g.items, currentPath)) next[g.section] = true; });
      return next;
    });
  }, [currentPath]);

  const toggleSection = (section) => setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));

  return (
    <>
    {/* Mobile backdrop */}
    {mobileOpen && <div className="fixed inset-0 z-40 bg-slate-800/50 md:hidden" onClick={() => setMobileOpen?.(false)} />}
    <aside className={`bg-navy-900 text-slate-800 h-screen flex flex-col overflow-hidden transition-all duration-200 border-r border-navy-700
      fixed md:static top-0 left-0 z-50 transform ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} 
      ${collapsed?'w-[68px]':'w-[248px]'}`}>
      <div className="h-16 shrink-0 px-4 flex items-center gap-3 border-b border-navy-700">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/30">
          <Icon name="mountain-snow" size={20} className="text-white"/>
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <div className="text-[15px] font-semibold tracking-tight text-slate-900">DigiBhoomi</div>
            <div className="text-[10px] uppercase tracking-widest text-slate-500">Land · AI · Governance</div>
          </div>
        )}
      </div>

      <nav ref={navRef} className="flex-1 min-h-0 overflow-y-auto sb-scroll py-3">
        {navGroups.map(g => (
          <NavGroup
            key={g.section}
            group={g}
            isOpen={!!openSections[g.section]}
            onToggle={() => toggleSection(g.section)}
            collapsed={collapsed}
            currentPath={currentPath}
            onNav={() => setMobileOpen?.(false)}
          />
        ))}
      </nav>

      <div className="border-t border-navy-700 p-3">
        {!collapsed ? (
          <>
            {/* Profile row */}
            <div className="rounded-lg bg-navy-800/60 ring-1 ring-navy-700 p-2 flex items-center gap-2">
              <div className="w-8 h-8 shrink-0 rounded-full bg-gradient-to-br from-brand-500 to-amber-500 flex items-center justify-center text-white text-xs font-semibold">
                {(window.BS_STATE.user?.name || 'AV').split(' ').map(s=>s[0]).join('').slice(0,2)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-medium truncate text-slate-800">{window.BS_STATE.user?.name || 'Anjali Verma'}</div>
                <div className="text-[10px] text-slate-500 truncate">
                  {window.BS_STATE.user?.role || 'Ministry Admin'}
                  {window.BS_STATE.user?.state && window.BS_STATE.user?.state !== '—' ? ` · ${window.BS_STATE.user.state}` : ''}
                </div>
              </div>
              <button onClick={()=>setCollapsed(true)}
                title="Collapse sidebar"
                className="w-7 h-7 rounded-md hover:bg-navy-700 hidden md:flex items-center justify-center text-slate-500 hover:text-slate-900 shrink-0">
                <Icon name="chevrons-left" size={14}/>
              </button>
            </div>
            {/* Profile + Logout actions */}
            <div className="mt-2 grid grid-cols-2 gap-1.5">
              <button
                title="View profile"
                className="group flex items-center justify-center gap-1.5 rounded-lg bg-navy-800/60 hover:bg-navy-700 text-slate-600 hover:text-slate-900 text-[11px] font-medium py-2 transition-colors ring-1 ring-navy-700">
                <Icon name="user-circle-2" size={13}/> Profile
              </button>
              <button
                onClick={logout}
                title="Sign out"
                className="group flex items-center justify-center gap-1.5 rounded-lg bg-brand-500/15 hover:bg-brand-500/25 text-brand-600 hover:text-brand-700 text-[11px] font-medium py-2 transition-colors ring-1 ring-brand-500/30">
                <Icon name="log-out" size={13}/> Logout
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-1.5">
            <button onClick={()=>setCollapsed(false)}
              title="Expand sidebar"
              className="w-9 h-9 rounded-lg bg-navy-800/60 hover:bg-navy-700 hidden md:flex items-center justify-center text-slate-500 hover:text-slate-900">
              <Icon name="chevrons-right" size={16}/>
            </button>
            <button
              title={window.BS_STATE.user?.name || 'Profile'}
              className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-amber-500 flex items-center justify-center text-white text-[10px] font-semibold">
              {(window.BS_STATE.user?.name || 'AV').split(' ').map(s=>s[0]).join('').slice(0,2)}
            </button>
            <button onClick={logout}
              title="Sign out"
              className="w-9 h-9 rounded-lg bg-brand-500/15 hover:bg-brand-500/25 ring-1 ring-brand-500/30 flex items-center justify-center text-brand-600 hover:text-brand-700">
              <Icon name="log-out" size={15}/>
            </button>
          </div>
        )}
      </div>
    </aside>
    </>
  );
}

// ---------- Topbar ----------
function Topbar({ crumbs=[], right=null, setMobileOpen }){
  const nav = useNavigate();
  useLucide();
  return (
    <div className="h-16 shrink-0 bg-white/85 backdrop-blur border-b hairline flex items-center px-4 md:px-6 gap-3 md:gap-4 sticky top-0 z-30">
      <button onClick={() => setMobileOpen?.(true)} className="md:hidden w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-600">
        <Icon name="menu" size={20}/>
      </button>
      <div className="flex items-center gap-2 text-sm hidden sm:flex">
        {crumbs.map((c,i)=>(
          <React.Fragment key={i}>
            {i>0 && <Icon name="chevron-right" size={14} className="text-slate-400"/>}
            {c.to ? <Link to={c.to} className="text-slate-500 hover:text-slate-900">{c.label}</Link> : <span className="font-medium text-slate-900">{c.label}</span>}
          </React.Fragment>
        ))}
      </div>
      {/* Mobile abbreviated crumbs */}
      <div className="flex items-center sm:hidden text-sm font-medium text-slate-900 min-w-0 flex-1 px-1">
        <span className="truncate">{crumbs[crumbs.length - 1]?.label || 'DigiBhoomi'}</span>
      </div>
      <div className="hidden sm:block flex-1"/>
      <div className="relative hidden md:block">
        <Icon name="search" size={14} className="absolute left-3 top-2.5 text-slate-400"/>
        <input placeholder="Search projects, parcels, officers…"
          onKeyDown={e=>{ if(e.key==='Enter' && e.currentTarget.value){ nav('/projects?q='+encodeURIComponent(e.currentTarget.value)); }}}
          className="w-80 pl-8 pr-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-100/70 focus:bg-white text-sm border border-transparent focus:border-brand-500/40 outline-none transition"/>
      </div>
      <button className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 relative">
        <Icon name="bell" size={16}/>
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 pulse-ring"/>
      </button>
      <button className="hidden sm:flex w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 items-center justify-center text-slate-600">
        <Icon name="help-circle" size={16}/>
      </button>
      <div className="hidden sm:block h-8 w-px bg-slate-200"/>
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-amber-500 flex items-center justify-center text-white text-xs font-semibold">
          {(window.BS_STATE.user?.name || 'AV').split(' ').map(s=>s[0]).join('').slice(0,2)}
        </div>
        <div className="hidden md:block">
          <div className="text-sm font-medium text-slate-900 leading-tight">{window.BS_STATE.user?.name || 'Anjali Verma'}</div>
          <div className="text-[11px] text-slate-500 leading-tight">
            {window.BS_STATE.user?.role || 'Ministry Administrator'}
            {window.BS_STATE.user?.state && window.BS_STATE.user?.state !== '—' ? ` · ${window.BS_STATE.user.state}` : ''}
          </div>
        </div>
      </div>
      {right}
    </div>
  );
}

// ---------- Layout ----------
function AppLayout({ crumbs, right, children }){
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="flex h-screen min-h-0 overflow-hidden">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        <Topbar crumbs={crumbs} right={right} setMobileOpen={setMobileOpen} />
        <main className="flex-1 min-w-0 min-h-0 overflow-auto px-4 md:px-6 py-4 md:py-6 fade-up">{children}</main>
      </div>
      <ToastHost/>
    </div>
  );
}

// ---------- Modal / Drawer ----------
function Modal({ open, onClose, title, subtitle, children, footer, size='md' }){
  useLucide();
  if(!open) return null;
  const sizes = { sm:'max-w-md', md:'max-w-2xl', lg:'max-w-4xl', xl:'max-w-6xl' };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-800/30 backdrop-blur-sm" onClick={onClose}/>
      <div className={`relative bg-white rounded-2xl shadow-pop w-full ${sizes[size]} max-h-[90vh] flex flex-col fade-up`}>
        <div className="px-6 py-4 border-b hairline flex items-start justify-between gap-3">
          <div>
            <div className="text-base font-semibold text-slate-900">{title}</div>
            {subtitle && <div className="text-xs text-slate-500 mt-0.5">{subtitle}</div>}
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500"><Icon name="x" size={16}/></button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin px-6 py-5">{children}</div>
        {footer && <div className="px-6 py-3 border-t hairline bg-slate-50/60 rounded-b-2xl flex items-center justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}

function Drawer({ open, onClose, title, subtitle, width='w-full sm:w-[520px]', children, footer }){
  useLucide();
  return (
    <div className={`fixed inset-0 z-40 pointer-events-none ${open?'':''}`}>
      <div className={`absolute inset-0 bg-slate-800/20 transition-opacity ${open?'opacity-100 pointer-events-auto':'opacity-0'}`} onClick={onClose}/>
      <div className={`absolute top-0 right-0 h-full ${width} bg-white shadow-pop transform transition-transform ${open?'translate-x-0 pointer-events-auto':'translate-x-full'} flex flex-col`}>
        <div className="px-5 py-4 border-b hairline flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-base font-semibold text-slate-900 truncate">{title}</div>
            {subtitle && <div className="text-xs text-slate-500 mt-0.5 truncate">{subtitle}</div>}
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 shrink-0"><Icon name="x" size={16}/></button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin p-5">{children}</div>
        {footer && <div className="px-5 py-3 border-t hairline bg-slate-50/60 flex items-center justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}

// ---------- Buttons ----------
function Button({ children, variant='primary', size='md', icon, iconRight, onClick, disabled, className='', type='button', title }){
  const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed';
  const sizes = { sm:'text-xs px-2.5 py-1.5', md:'text-sm px-3.5 py-2', lg:'text-sm px-4 py-2.5' };
  const variants = {
    primary:   'bg-brand-500 text-white hover:bg-brand-600 shadow-sm shadow-brand-500/20',
    secondary: 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50',
    ghost:     'text-slate-600 hover:bg-slate-100',
    danger:    'bg-red-500 text-white hover:bg-red-600',
    dark:      'bg-slate-800 text-white hover:bg-slate-700',
    success:   'bg-emerald-500 text-white hover:bg-emerald-600',
    warn:      'bg-amber-500 text-white hover:bg-amber-600',
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} title={title}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}>
      {icon && <Icon name={icon} size={14}/>}
      {children}
      {iconRight && <Icon name={iconRight} size={14}/>}
    </button>
  );
}

// ---------- Toasts ----------
function ToastHost(){
  const [toasts, setToasts] = useState([]);
  useEffect(() => {
    return toastBus.subscribe(t => {
      setToasts(list => [...list, t]);
      setTimeout(() => setToasts(list => list.filter(x => x.id !== t.id)), 3500);
    });
  }, []);
  useLucide();
  return (
    <div className="fixed bottom-4 right-4 z-[100] space-y-2">
      {toasts.map(t => {
        const map = { info:{bg:'bg-slate-800 text-white', icon:'info'}, success:{bg:'bg-emerald-600 text-white', icon:'check-circle-2'}, error:{bg:'bg-red-600 text-white', icon:'alert-triangle'}, warn:{bg:'bg-amber-500 text-white', icon:'alert-circle'} };
        const m = map[t.kind] || map.info;
        return (
          <div key={t.id} className={`${m.bg} rounded-xl px-4 py-2.5 shadow-pop flex items-center gap-2.5 text-sm fade-up min-w-[260px]`}>
            <Icon name={m.icon} size={16}/>
            <div>{t.msg}</div>
          </div>
        );
      })}
    </div>
  );
}

// ---------- Data Table ----------
function DataTable({ columns, rows, onRowClick, empty='No records', dense=false }){
  return (
    <div className="overflow-x-auto scrollbar-thin">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-[11px] uppercase tracking-wider text-slate-500 border-b hairline">
            {columns.map(c => <th key={c.key} className={`px-4 py-3 font-semibold ${c.className||''}`}>{c.label}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr><td colSpan={columns.length} className="px-4 py-8 text-center text-slate-400">{empty}</td></tr>
          )}
          {rows.map((r, i) => (
            <tr key={r.id || i}
              onClick={() => onRowClick?.(r)}
              className={`border-b hairline last:border-0 hover:bg-slate-50/70 ${onRowClick?'cursor-pointer':''}`}>
              {columns.map(c => (
                <td key={c.key} className={`px-4 ${dense?'py-2.5':'py-3.5'} align-middle ${c.className||''}`}>
                  {c.render ? c.render(r) : r[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---------- Section header ----------
function SectionHeader({ title, subtitle, right, className='' }){
  return (
    <div className={`flex items-end justify-between gap-4 mb-4 ${className}`}>
      <div>
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

// ---------- Segmented ----------
function Segmented({ options, value, onChange }){
  return (
    <div className="inline-flex bg-slate-100 rounded-lg p-0.5">
      {options.map(o => (
        <button key={o.value} onClick={()=>onChange(o.value)}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${value===o.value ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

// ---------- Progress ----------
function Progress({ value, max=100, tone='brand', size='md', showLabel=false }){
  const pct = Math.min(100, Math.max(0, (value/max)*100));
  const tones = {
    brand:'bg-brand-500', good:'bg-emerald-500', warn:'bg-amber-500',
    critical:'bg-red-500', high:'bg-orange-500', medium:'bg-amber-500', low:'bg-emerald-500',
  };
  const heights = { sm:'h-1', md:'h-1.5', lg:'h-2' };
  return (
    <div className="flex items-center gap-2">
      <div className={`flex-1 bg-slate-100 rounded-full overflow-hidden ${heights[size]}`}>
        <div className={`${heights[size]} ${tones[tone]||tones.brand} rounded-full transition-all`} style={{width:`${pct}%`}}/>
      </div>
      {showLabel && <span className="text-xs text-slate-600 tabular w-9 text-right">{Math.round(pct)}%</span>}
    </div>
  );
}

// ---------- Empty ----------
function Empty({ icon='inbox', title, subtitle, action }){
  useLucide();
  return (
    <div className="text-center py-12">
      <div className="w-12 h-12 rounded-xl bg-slate-100 mx-auto flex items-center justify-center text-slate-400"><Icon name={icon} size={22}/></div>
      <div className="mt-3 text-sm font-medium text-slate-900">{title}</div>
      {subtitle && <div className="mt-1 text-xs text-slate-500 max-w-xs mx-auto">{subtitle}</div>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// ---------- Currency & Number ----------
function inr(n){
  if(n == null) return '—';
  if(n >= 1e7) return `₹${(n/1e7).toFixed(2)} Cr`;
  if(n >= 1e5) return `₹${(n/1e5).toFixed(2)} L`;
  return '₹' + n.toLocaleString('en-IN');
}
function nfmt(n){ if(n==null) return '—'; return n.toLocaleString('en-IN'); }

// Expose
Object.assign(window, {
  Icon, useLucide, RiskBadge, StatusBadge,
  Card, StatCard, Sidebar, Topbar, AppLayout,
  Modal, Drawer, Button, ToastHost,
  DataTable, SectionHeader, Segmented, Progress, Empty,
  inr, nfmt,
});
