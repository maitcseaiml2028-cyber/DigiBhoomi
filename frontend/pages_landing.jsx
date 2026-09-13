/* ============================================================
   DigiBhoomi — Production Homepage
   Reference-matched: SIH 2026 · Team CodeSmiths
   Stack: React (CDN) + Tailwind + Lucide + Leaflet + Recharts
   ============================================================ */

/* ── Inject global landing styles once ── */
const LandingStyles = () => {
  React.useEffect(() => {
    const id = 'db-lp-styles';
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `
      :root {
        --g900: #0d3b2e;
        --g800: #134e3a;
        --g700: #1a6349;
        --g600: #1d7a59;
        --g500: #25a06e;
        --g400: #34d399;
        --g100: #d1fae5;
        --g50:  #f0fdf4;
        --slate900: #0f172a;
        --slate700: #334155;
        --slate500: #64748b;
        --slate300: #cbd5e1;
        --slate100: #f1f5f9;
        --white: #ffffff;
        --orange: #f97316;
        --red: #ef4444;
        --blue: #3b82f6;
      }
      html { scroll-behavior: smooth; }
      body { background:#f8fafc; }

      /* Animations */
      @keyframes lp-fadeUp   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:none} }
      @keyframes lp-fadeLeft { from{opacity:0;transform:translateX(-24px)} to{opacity:1;transform:none} }
      @keyframes lp-fadeRight{ from{opacity:0;transform:translateX(24px)} to{opacity:1;transform:none} }
      @keyframes lp-scale    { from{opacity:0;transform:scale(.92)} to{opacity:1;transform:scale(1)} }
      @keyframes lp-pulse-dot{ 0%,100%{opacity:1} 50%{opacity:.4} }
      @keyframes lp-progress-fill{ from{width:0} to{width:var(--w)} }
      @keyframes lp-line-draw { from{stroke-dashoffset:200} to{stroke-dashoffset:0} }
      @keyframes lp-float     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
      @keyframes lp-shimmer   { from{background-position:-400px 0} to{background-position:400px 0} }

      .lp-fade-up    { animation: lp-fadeUp   .65s ease-out both; }
      .lp-fade-left  { animation: lp-fadeLeft  .65s ease-out both; }
      .lp-fade-right { animation: lp-fadeRight .65s ease-out both; }
      .lp-scale      { animation: lp-scale     .55s cubic-bezier(.34,1.56,.64,1) both; }
      .lp-float      { animation: lp-float 3s ease-in-out infinite; }
      .lp-delay-1 { animation-delay: .08s; }
      .lp-delay-2 { animation-delay: .16s; }
      .lp-delay-3 { animation-delay: .24s; }
      .lp-delay-4 { animation-delay: .32s; }
      .lp-delay-5 { animation-delay: .40s; }
      .lp-delay-6 { animation-delay: .48s; }

      /* Nav */
      .lp-nav-link {
        color: var(--slate700);
        font-size:14px;
        font-weight:500;
        text-decoration:none;
        padding:4px 0;
        position:relative;
        transition: color .2s;
      }
      .lp-nav-link::after{
        content:'';position:absolute;bottom:-2px;left:0;width:0;height:2px;
        background:var(--g600);border-radius:2px;transition:width .25s;
      }
      .lp-nav-link:hover::after { width:100%; }
      .lp-nav-link:hover { color:var(--g700); }
      .lp-nav-link.active { color:var(--g700); }
      .lp-nav-link.active::after { width:100%; }

      /* Hero bg — Indian fields gradient */
      .lp-hero-bg {
        background: linear-gradient(160deg,#e8f5e9 0%,#c8e6c9 30%,#a5d6a7 60%,#81c784 80%,#66bb6a 100%);
        position:relative;
        overflow:hidden;
      }
      .lp-hero-overlay {
        position:absolute;inset:0;
        background: linear-gradient(90deg,rgba(255,255,255,.96) 0%,rgba(255,255,255,.85) 48%,rgba(255,255,255,.1) 100%);
      }

      /* Cards */
      .lp-card {
        background:#fff;
        border-radius:14px;
        border:1px solid rgba(0,0,0,.06);
        box-shadow:0 2px 8px rgba(0,0,0,.06);
        transition: transform .22s ease, box-shadow .22s ease;
        overflow:hidden;
      }
      .lp-card:hover {
        transform:translateY(-4px);
        box-shadow:0 12px 32px rgba(0,0,0,.10);
      }
      .lp-card-green {
        border-top:3px solid var(--g600);
      }

      /* Buttons */
      .lp-btn-primary {
        background:var(--g700);
        color:#fff;
        border:none;
        border-radius:8px;
        padding:12px 24px;
        font-size:14px;
        font-weight:600;
        cursor:pointer;
        display:inline-flex;
        align-items:center;
        gap:8px;
        transition: background .2s, transform .15s, box-shadow .2s;
        box-shadow: 0 4px 14px rgba(26,99,73,.3);
        text-decoration:none;
      }
      .lp-btn-primary:hover {
        background:var(--g800);
        transform:translateY(-1px);
        box-shadow: 0 6px 20px rgba(26,99,73,.4);
      }
      .lp-btn-outline {
        background:transparent;
        color:var(--g700);
        border:2px solid var(--g700);
        border-radius:8px;
        padding:10px 22px;
        font-size:14px;
        font-weight:600;
        cursor:pointer;
        display:inline-flex;
        align-items:center;
        gap:8px;
        transition: all .2s;
        text-decoration:none;
      }
      .lp-btn-outline:hover {
        background:var(--g50);
        transform:translateY(-1px);
      }
      .lp-btn-orange {
        background: linear-gradient(135deg,#f97316,#ea580c);
        color:#fff;
        border:none;
        border-radius:8px;
        padding:12px 28px;
        font-size:14px;
        font-weight:700;
        cursor:pointer;
        display:inline-flex;
        align-items:center;
        gap:8px;
        transition: all .2s;
        box-shadow: 0 4px 14px rgba(249,115,22,.35);
        text-decoration:none;
      }
      .lp-btn-orange:hover {
        transform:translateY(-1px);
        box-shadow: 0 6px 22px rgba(249,115,22,.5);
      }

      /* Stat badge */
      .lp-stat { display:flex;align-items:center;gap:8px; }
      .lp-stat-icon { width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center; }

      /* Progress bar */
      .lp-prog-bar {
        height:6px;border-radius:6px;background:#e2e8f0;overflow:hidden;
      }
      .lp-prog-fill {
        height:100%;border-radius:6px;
        background:var(--g600);
        transition:width .8s ease;
      }

      /* Dashboard mock */
      .lp-dash {
        background:#fff;
        border-radius:16px;
        box-shadow:0 16px 64px rgba(0,0,0,.14);
        overflow:hidden;
        border:1px solid rgba(0,0,0,.06);
      }
      .lp-dash-sidebar {
        background:#0d3b2e;
        width:160px;
        flex-shrink:0;
        display:flex;
        flex-direction:column;
        padding:12px 0;
      }
      .lp-dash-sidenav-item {
        padding:8px 14px;
        font-size:11.5px;
        color:rgba(255,255,255,.6);
        cursor:pointer;
        display:flex;
        align-items:center;
        gap:8px;
        transition:all .18s;
        border-radius:6px;
        margin:1px 6px;
      }
      .lp-dash-sidenav-item:hover { background:rgba(255,255,255,.1); color:#fff; }
      .lp-dash-sidenav-item.active { background:rgba(52,211,153,.15); color:#34d399; }

      /* Leaflet hero map tweaks */
      .lp-hero-map .leaflet-container {
        border-radius:12px;
        font-size:11px;
      }
      .lp-hero-map .leaflet-popup-content-wrapper {
        border-radius:8px;
        font-size:11px;
        box-shadow:0 4px 16px rgba(0,0,0,.15);
      }

      /* Process step */
      .lp-step-circle {
        width:52px;height:52px;border-radius:50%;
        background:#e8f5e9;border:2px solid var(--g400);
        display:flex;align-items:center;justify-content:center;
        color:var(--g700);
        transition:all .2s;
        flex-shrink:0;
      }
      .lp-step-circle:hover { background:var(--g700);color:#fff;border-color:var(--g700); transform:scale(1.08); }
      .lp-step-arrow { color:var(--g400);flex-shrink:0; }

      /* Feature card icon */
      .lp-feat-icon {
        width:48px;height:48px;border-radius:12px;
        background:var(--g50);
        display:flex;align-items:center;justify-content:center;
        color:var(--g700);
        margin-bottom:14px;
        border:1px solid var(--g100);
      }

      /* CTA banner */
      .lp-cta-banner {
        background: linear-gradient(135deg,#0d3b2e 0%,#134e3a 50%,#0d3b2e 100%);
        position:relative;overflow:hidden;
      }
      .lp-cta-banner::before {
        content:'';
        position:absolute;inset:0;
        background:url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
      }

      /* Why section */
      .lp-why-card {
        background:#fff;
        border-radius:12px;
        padding:24px;
        border:1px solid #e2e8f0;
        display:flex;align-items:flex-start;gap:16px;
        transition:box-shadow .2s,transform .2s;
      }
      .lp-why-card:hover { box-shadow:0 8px 24px rgba(0,0,0,.09);transform:translateY(-3px); }
      .lp-why-icon {
        width:44px;height:44px;border-radius:10px;
        background:var(--g50);
        display:flex;align-items:center;justify-content:center;
        color:var(--g700);
        flex-shrink:0;border:1px solid var(--g100);
      }

      /* Sticky nav scrolled */
      .lp-nav-scrolled {
        background:rgba(255,255,255,.95)!important;
        backdrop-filter:blur(12px);
        box-shadow:0 1px 12px rgba(0,0,0,.08)!important;
      }

      /* Tag pill */
      .lp-pill {
        display:inline-flex;align-items:center;gap:5px;
        background:var(--g50);
        border:1px solid var(--g100);
        border-radius:100px;
        padding:4px 12px;
        font-size:11px;
        font-weight:600;
        color:var(--g700);
        letter-spacing:.5px;
        text-transform:uppercase;
      }

      /* Section header */
      .lp-section-title {
        font-size:clamp(22px,3vw,34px);
        font-weight:800;
        color:var(--slate900);
        letter-spacing:-.5px;
        line-height:1.2;
      }
      .lp-section-sub {
        font-size:15px;
        color:var(--slate500);
        line-height:1.7;
        max-width:540px;
      }

      /* Acquisition status dots */
      .dot-acquired { background:#25a06e; }
      .dot-progress { background:#f59e0b; }
      .dot-pending  { background:#ef4444; }

      /* Map legend */
      .lp-legend-dot { width:10px;height:10px;border-radius:50%;flex-shrink:0; }

      /* Scrollbar landing */
      .lp-scroll-x { overflow-x:auto; }
      .lp-scroll-x::-webkit-scrollbar { height:4px; }
      .lp-scroll-x::-webkit-scrollbar-thumb { background:var(--g300);border-radius:4px; }

      /* Footer */
      .lp-footer { background:var(--slate900); color:rgba(255,255,255,.7); }
      .lp-footer a { color:rgba(255,255,255,.6);text-decoration:none;font-size:13px;line-height:2; transition:color .15s; }
      .lp-footer a:hover { color:#fff; }
      .lp-footer-heading { color:#fff;font-weight:700;font-size:13px;margin-bottom:12px;letter-spacing:.5px;text-transform:uppercase; }

      /* Small green badge */
      .lp-green-badge {
        display:inline-flex;align-items:center;justify-content:center;
        background:var(--g50);color:var(--g700);
        border-radius:6px;padding:2px 8px;font-size:11px;font-weight:600;
        border:1px solid var(--g100);
      }
      .lp-red-badge {
        display:inline-flex;align-items:center;justify-content:center;
        background:#fef2f2;color:#dc2626;
        border-radius:6px;padding:2px 8px;font-size:11px;font-weight:600;
        border:1px solid #fecaca;
      }
      .lp-orange-badge {
        display:inline-flex;align-items:center;justify-content:center;
        background:#fff7ed;color:#ea580c;
        border-radius:6px;padding:2px 8px;font-size:11px;font-weight:600;
        border:1px solid #fed7aa;
      }
    `;
    document.head.appendChild(s);
  }, []);
  return null;
};

/* ── 0. NAV ────────────────────────────────────────────── */
function LandingNav() {
  const nav = useNavigate();
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <header style={{
      position:'fixed',top:0,left:0,right:0,zIndex:100,
      background:scrolled?'rgba(255,255,255,.96)':'rgba(255,255,255,.92)',
      backdropFilter:'blur(12px)',
      borderBottom:'1px solid rgba(0,0,0,.07)',
      boxShadow:scrolled?'0 2px 16px rgba(0,0,0,.08)':'none',
      transition:'all .25s',
    }}>
      <div style={{maxWidth:1180,margin:'0 auto',padding:'0 24px',height:60,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        {/* Logo */}
        <div style={{display:'flex',alignItems:'center',gap:9,cursor:'pointer'}} onClick={()=>nav('/')}>
          <div style={{width:34,height:34,borderRadius:9,background:'linear-gradient(135deg,#1a6349,#0d3b2e)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 3px 10px rgba(26,99,73,.3)'}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="rgba(255,255,255,.2)"/>
              <path d="M12 4c-1.5 2.5-3 5-3 8h6c0-3-1.5-5.5-3-8z" fill="#4ade80"/>
              <path d="M9 12c0 2.5 1 5 3 6 2-1 3-3.5 3-6H9z" fill="#86efac"/>
              <path d="M12 10l-2 4h4l-2-4z" fill="#fff" opacity=".6"/>
            </svg>
          </div>
          <span style={{fontWeight:800,fontSize:17,color:'#0d3b2e',letterSpacing:'-.3px'}}>DigiBhoomi</span>
        </div>

        <nav style={{display:'flex',alignItems:'center',gap:32}}>
          {[['#hero','Home'],['#challenge','About'],['#features','Features'],['#lifecycle','How It Works']].map(([href,label])=>(
            <a key={href} href={href} className="lp-nav-link" onClick={(e) => {
              e.preventDefault();
              const el = document.querySelector(href);
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}>{label}</a>
          ))}
        </nav>

        {/* Login */}
        <button onClick={()=>nav('/login')}
          style={{background:'#0d3b2e',color:'#fff',border:'none',borderRadius:8,padding:'8px 20px',fontSize:13,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',gap:7,boxShadow:'0 3px 10px rgba(13,59,46,.3)',transition:'all .2s'}}
          onMouseEnter={e=>{e.currentTarget.style.background='#134e3a';e.currentTarget.style.transform='translateY(-1px)';}}
          onMouseLeave={e=>{e.currentTarget.style.background='#0d3b2e';e.currentTarget.style.transform='none';}}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
          Login
        </button>
      </div>
    </header>
  );
}

/* ── 1. HERO ────────────────────────────────────────────── */
function HeroMap() {
  const mapRef = React.useRef(null);
  const mapInstance = React.useRef(null);

  React.useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;
    if (typeof L === 'undefined') return;

    const map = L.map(mapRef.current, {
      center: [20.5937, 78.9629],
      zoom: 5,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false,
      dragging: false,
    });
    mapInstance.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      opacity: 0.85,
    }).addTo(map);

    // Project polygons: color-coded by status
    const projects = [
      { coords: [[22.5,72.5],[22.8,73.2],[22.3,73.5],[22.0,72.9]], color:'#25a06e', status:'Acquired', name:'NH-48 Vadodara Bypass' },
      { coords: [[28.5,77.0],[28.8,77.6],[28.4,77.8],[28.1,77.3]], color:'#f59e0b', status:'In Progress', name:'Delhi Ring Road Phase 3' },
      { coords: [[17.3,78.3],[17.6,78.9],[17.1,79.1],[16.9,78.6]], color:'#ef4444', status:'Pending', name:'Hyderabad Metro Ext.' },
      { coords: [[12.9,77.5],[13.2,78.0],[12.8,78.2],[12.5,77.7]], color:'#25a06e', status:'Acquired', name:'Bengaluru Infra' },
      { coords: [[19.0,72.8],[19.3,73.4],[18.9,73.6],[18.6,73.0]], color:'#f59e0b', status:'In Progress', name:'Mumbai Coastal Rd' },
      { coords: [[26.4,80.2],[26.7,80.8],[26.3,81.0],[26.0,80.5]], color:'#ef4444', status:'Pending', name:'Lucknow Expressway' },
      { coords: [[13.0,80.2],[13.3,80.6],[13.0,80.9],[12.7,80.5]], color:'#25a06e', status:'Acquired', name:'Chennai Port Road' },
      { coords: [[23.2,77.3],[23.5,77.9],[23.1,78.1],[22.8,77.5]], color:'#f59e0b', status:'In Progress', name:'Bhopal BRTS' },
    ];

    projects.forEach(p => {
      const poly = L.polygon(p.coords, {
        color: p.color, weight: 2, opacity: 0.9,
        fillColor: p.color, fillOpacity: 0.25,
      }).addTo(map);
      poly.bindPopup(`<div style="font-family:Inter,sans-serif;min-width:140px"><div style="font-weight:700;font-size:12px;color:#0d3b2e;margin-bottom:4px">${p.name}</div><div style="display:flex;align-items:center;gap:5px"><div style="width:8px;height:8px;border-radius:50%;background:${p.color}"></div><span style="font-size:11px;color:#64748b">${p.status}</span></div></div>`);

      // Center marker
      const center = poly.getBounds().getCenter();
      L.circleMarker(center, { radius:5, color:'#fff', weight:2, fillColor:p.color, fillOpacity:1 }).addTo(map);
    });

    // Major city markers
    const cities = [
      [28.6139,77.2090,'Delhi'], [19.0760,72.8777,'Mumbai'],
      [13.0827,80.2707,'Chennai'], [22.5726,88.3639,'Kolkata'],
      [12.9716,77.5946,'Bengaluru'], [17.3850,78.4867,'Hyderabad'],
      [23.0225,72.5714,'Ahmedabad'], [18.5204,73.8567,'Pune'],
    ];
    cities.forEach(([lat,lng,name]) => {
      L.circleMarker([lat,lng], { radius:4, color:'#0d3b2e', weight:1.5, fillColor:'#fff', fillOpacity:1 })
        .addTo(map).bindTooltip(name, {permanent:false, direction:'top', offset:[0,-6], className:''});
    });

  }, []);

  return (
    <div style={{width:'100%',height:'100%',borderRadius:12,overflow:'hidden',boxShadow:'0 8px 32px rgba(0,0,0,.15)',border:'1px solid rgba(0,0,0,.08)'}}>
      <div ref={mapRef} style={{width:'100%',height:'100%'}} className="lp-hero-map"/>
    </div>
  );
}

function LandingHero() {
  const nav = useNavigate();
  const stats = [
    { icon:'layers', val:'142', label:'Projects Monitored', delta:'+13%', up:true },
    { icon:'map-pin', val:'2.8M', label:'Land Parcels', delta:'+4%', up:true },
    { icon:'percent', val:'68%', label:'Acquisition Progress', delta:'+6%', up:true },
    { icon:'users', val:'312', label:'Pending Cases', delta:'-4%', up:false },
  ];
  return (
    <section id="hero" className="lp-hero-bg" style={{paddingTop:60,minHeight:'90vh',display:'flex',alignItems:'center',position:'relative'}}>
      <div className="lp-hero-overlay"/>
      {/* Background SVG landscape */}
      <div style={{position:'absolute',bottom:0,left:0,right:0,height:220,opacity:.18,pointerEvents:'none',overflow:'hidden'}}>
        <svg viewBox="0 0 1440 220" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
          <path d="M0 180 Q200 120 400 160 Q600 200 800 140 Q1000 80 1200 130 Q1350 165 1440 120 L1440 220 L0 220Z" fill="#1a6349" opacity=".3"/>
          <path d="M0 200 Q300 160 600 185 Q900 210 1440 170 L1440 220 L0 220Z" fill="#0d3b2e" opacity=".4"/>
        </svg>
      </div>

      <div style={{maxWidth:1180,margin:'0 auto',padding:'48px 24px',position:'relative',zIndex:1,width:'100%'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:48,alignItems:'center'}}>

          {/* LEFT */}
          <div>
            <div className="lp-pill lp-fade-up" style={{marginBottom:20}}>
              <div style={{width:6,height:6,borderRadius:'50%',background:'#25a06e',animation:'lp-pulse-dot 1.5s infinite'}}/>
              Smarter Land Management · A Stronger Tomorrow
            </div>
            <h1 className="lp-fade-up lp-delay-1" style={{fontSize:'clamp(28px,3.5vw,46px)',fontWeight:900,color:'#0d3b2e',lineHeight:1.08,letterSpacing:'-1.5px',marginBottom:18}}>
              ONE PLATFORM.<br/>
              <span style={{color:'#1a6349'}}>COMPLETE LAND</span><br/>
              ACQUISITION VISIBILITY.
            </h1>
            <p className="lp-fade-up lp-delay-2" style={{fontSize:15,color:'#334155',lineHeight:1.7,marginBottom:28,maxWidth:460}}>
              DigiBhoomi connects land acquisition activities, GIS mapping, compensation, R&R and possession tracking in one digital platform — built for India's governance needs.
            </p>
            <div className="lp-fade-up lp-delay-3" style={{display:'flex',gap:14,marginBottom:40,flexWrap:'wrap'}}>
              <button className="lp-btn-primary" onClick={()=>nav('/login')}>
                Explore DigiBhoomi
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
              <a className="lp-btn-outline" href="#lifecycle" onClick={(e) => {
                e.preventDefault();
                const el = document.querySelector('#lifecycle');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
                See How It Works
              </a>
            </div>

            {/* Stats */}
            <div className="lp-fade-up lp-delay-4" style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:12}}>
              {stats.map((s,i)=>(
                <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 14px',background:'rgba(255,255,255,.85)',borderRadius:10,border:'1px solid rgba(0,0,0,.07)',backdropFilter:'blur(8px)'}}>
                  <div style={{width:34,height:34,borderRadius:8,background:'#e8f5e9',border:'1px solid #c8e6c9',display:'flex',alignItems:'center',justifyContent:'center'}}>
                    <Icon name={s.icon} size={15} style={{color:'#1a6349'}}/>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:'flex',alignItems:'baseline',gap:6}}>
                      <span style={{fontWeight:800,fontSize:18,color:'#0d3b2e',letterSpacing:'-.5px'}}>{s.val}</span>
                      <span style={{fontSize:10,fontWeight:700,color:s.up?'#25a06e':'#ef4444'}}>{s.delta}</span>
                    </div>
                    <div style={{fontSize:10,color:'#64748b',fontWeight:500}}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Dashboard card + map */}
          <div className="lp-fade-right lp-delay-2" style={{position:'relative'}}>
            <div style={{background:'#fff',borderRadius:16,boxShadow:'0 20px 60px rgba(0,0,0,.15)',overflow:'hidden',border:'1px solid rgba(0,0,0,.07)'}}>
              {/* Dashboard topbar */}
              <div style={{display:'flex',alignItems:'center',gap:10,padding:'10px 14px',borderBottom:'1px solid #f1f5f9',background:'#fff'}}>
                <div style={{width:26,height:26,borderRadius:6,background:'linear-gradient(135deg,#1a6349,#0d3b2e)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="rgba(255,255,255,.2)"/><path d="M12 4c-1.5 2.5-3 5-3 8h6c0-3-1.5-5.5-3-8z" fill="#4ade80"/></svg>
                </div>
                <span style={{fontWeight:700,fontSize:12,color:'#0d3b2e'}}>DigiBhoomi</span>
                <div style={{flex:1,background:'#f8fafc',borderRadius:6,padding:'4px 10px',fontSize:10,color:'#94a3b8',border:'1px solid #e2e8f0',marginLeft:4}}>
                  Search projects, locations, parcels...
                </div>
                <div style={{width:26,height:26,borderRadius:'50%',background:'#e8f5e9',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1a6349" strokeWidth="2.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                </div>
              </div>
              <div style={{display:'flex',height:320}}>
                {/* Sidebar */}
                <div style={{width:130,background:'#0d3b2e',flexShrink:0,padding:'8px 0'}}>
                  <div style={{padding:'6px 10px',marginBottom:6}}>
                    <div style={{fontSize:9,color:'rgba(255,255,255,.4)',letterSpacing:'1px',textTransform:'uppercase',marginBottom:6}}>Menu</div>
                  </div>
                  {[
                    ['layout-dashboard','Overview',true],
                    ['folder','Projects',false],
                    ['map','Land Parcels',false],
                    ['trending-up','Acquisition',false],
                    ['credit-card','Compensation',false],
                    ['home','R&R',false],
                    ['clipboard','Field Verify',false],
                    ['bar-chart-2','Analytics',false],
                    ['file-text','Documents',false],
                  ].map(([ic,label,active],i)=>(
                    <div key={i} className="lp-dash-sidenav-item" style={active?{background:'rgba(52,211,153,.15)',color:'#34d399'}:{}}>
                      <Icon name={ic} size={12} style={{flexShrink:0}}/>
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
                {/* Main area */}
                <div style={{flex:1,overflow:'hidden',padding:'12px'}}>
                  {/* Mini stats row */}
                  <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:6,marginBottom:10}}>
                    {[
                      {l:'Total Projects',v:'142',c:'#0d3b2e',ic:'layers',d:'+13%',up:true},
                      {l:'Land Parcels',v:'1.9M',c:'#1a6349',ic:'map-pin',d:'+4%',up:true},
                      {l:'Acquired Land',v:'68%',c:'#25a06e',ic:'check-circle',d:'+4%',up:true},
                      {l:'Pending Land',v:'32%',c:'#f97316',ic:'alert-circle',d:'-4%',up:false},
                    ].map((s,i)=>(
                      <div key={i} style={{background:'#f8fafc',borderRadius:8,padding:'7px 8px',border:'1px solid #e2e8f0'}}>
                        <div style={{fontSize:8,color:'#94a3b8',marginBottom:3,fontWeight:500}}>{s.l}</div>
                        <div style={{display:'flex',alignItems:'baseline',gap:4}}>
                          <span style={{fontWeight:800,fontSize:14,color:s.c}}>{s.v}</span>
                          <span style={{fontSize:8,color:s.up?'#25a06e':'#ef4444',fontWeight:700}}>{s.d}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Map placeholder */}
                  <div style={{height:160,borderRadius:8,overflow:'hidden',position:'relative',background:'#e8f5e9',border:'1px solid #c8e6c9',marginBottom:10}}>
                    <DashboardMiniMap/>
                    {/* Legend */}
                    <div style={{position:'absolute',bottom:8,right:8,background:'rgba(255,255,255,.92)',backdropFilter:'blur(4px)',borderRadius:6,padding:'6px 8px',fontSize:9,display:'flex',flexDirection:'column',gap:3,border:'1px solid #e2e8f0'}}>
                      {[['#25a06e','Acquired'],['#f59e0b','In Progress'],['#ef4444','Pending']].map(([c,l])=>(
                        <div key={l} style={{display:'flex',alignItems:'center',gap:5}}>
                          <div style={{width:7,height:7,borderRadius:'50%',background:c}}/>
                          <span style={{color:'#334155'}}>{l}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Bottom row: project detail + alerts */}
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6}}>
                    <div style={{background:'#f8fafc',borderRadius:7,padding:'8px',border:'1px solid #e2e8f0'}}>
                      <div style={{fontWeight:700,fontSize:9,color:'#0d3b2e',marginBottom:4}}>Delhi–Mumbai Expressway</div>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}>
                        <span style={{fontSize:8,color:'#64748b'}}>Land Required</span>
                        <span style={{fontSize:8,fontWeight:600,color:'#0d3b2e'}}>12,050 Ha</span>
                      </div>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}>
                        <span style={{fontSize:8,color:'#64748b'}}>Acquired</span>
                        <span style={{fontSize:8,fontWeight:600,color:'#25a06e'}}>6,750 Ha (78%)</span>
                      </div>
                      <div style={{height:3,background:'#e2e8f0',borderRadius:3,marginTop:5}}>
                        <div style={{width:'78%',height:'100%',background:'#25a06e',borderRadius:3}}/>
                      </div>
                    </div>
                    <div style={{background:'#fff7ed',borderRadius:7,padding:'8px',border:'1px solid #fed7aa'}}>
                      <div style={{fontWeight:700,fontSize:9,color:'#ea580c',marginBottom:4,display:'flex',alignItems:'center',gap:4}}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                        Delay Alerts
                      </div>
                      {[['Lucknow–Agra NH','High Priority'],['Mumbai Coastal','Medium'],['Hyd Metro Ext','High Priority']].map(([p,l],i)=>(
                        <div key={i} style={{display:'flex',justifyContent:'space-between',marginBottom:3}}>
                          <span style={{fontSize:8,color:'#92400e'}}>{p}</span>
                          <span style={{fontSize:7,padding:'1px 4px',borderRadius:3,background:l.includes('High')?'#fef2f2':'#fffbeb',color:l.includes('High')?'#dc2626':'#d97706',fontWeight:600}}>{l}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {/* Stats row bottom */}
              <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',borderTop:'1px solid #f1f5f9',padding:'10px 14px',gap:10,background:'#fafafa'}}>
                {[
                  {v:'142',l:'Total Projects',c:'#0d3b2e'},
                  {v:'68%',l:'Acquisition Progress',c:'#25a06e'},
                  {v:'2.8M',l:'Land Parcels',c:'#1a6349'},
                  {v:'8',l:'Delay Alerts',c:'#f97316'},
                ].map((s,i)=>(
                  <div key={i} style={{textAlign:'center'}}>
                    <div style={{fontWeight:800,fontSize:16,color:s.c,letterSpacing:'-.5px'}}>{s.v}</div>
                    <div style={{fontSize:9,color:'#94a3b8',marginTop:1}}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DashboardMiniMap() {
  const ref = React.useRef(null);
  const inst = React.useRef(null);
  React.useEffect(() => {
    if (!ref.current || inst.current || typeof L === 'undefined') return;
    const m = L.map(ref.current, {
      center:[23,80], zoom:4,
      zoomControl:false, attributionControl:false,
      scrollWheelZoom:false, dragging:false, keyboard:false,
    });
    inst.current = m;
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{opacity:.7}).addTo(m);
    const pts = [
      [[22.3,72.5],[22.7,73.2],[22.2,73.4],[21.9,72.8]],'#25a06e',
      [[28.3,76.8],[28.7,77.5],[28.2,77.7],[27.9,77.1]],'#f59e0b',
      [[17.1,78.1],[17.5,78.7],[16.9,78.9],[16.7,78.4]],'#ef4444',
      [[19.0,72.6],[19.3,73.2],[18.8,73.4],[18.5,72.9]],'#f59e0b',
      [[13.0,80.0],[13.3,80.4],[12.9,80.7],[12.6,80.3]],'#25a06e',
    ];
    for (let i = 0; i < pts.length; i += 2) {
      L.polygon(pts[i], {color:pts[i+1],weight:1.5,fillColor:pts[i+1],fillOpacity:.3}).addTo(m);
      const center = L.polygon(pts[i]).getBounds().getCenter();
      L.circleMarker(center, {radius:4,color:'#fff',weight:1.5,fillColor:pts[i+1],fillOpacity:1}).addTo(m);
    }
  }, []);
  return <div ref={ref} style={{width:'100%',height:'100%'}}/>;
}

/* ── 2. CHALLENGE ───────────────────────────────────────── */
function LandingChallenge() {
  const cards = [
    { icon:'database', title:'Fragmented Information', text:'Data is scattered across multiple departments and systems, making it hard to get a complete picture.' },
    { icon:'clock', title:'Delayed Processes', text:'Manual approvals and limited coordination lead to significant delays in acquisition.' },
    { icon:'eye-off', title:'Limited Transparency', text:'Stakeholders lack real-time visibility into progress, status and bottlenecks.' },
    { icon:'users', title:'Poor Coordination', text:'Multiple agencies and departments work in silos, causing miscommunication and rework.' },
  ];
  return (
    <section id="challenge" style={{background:'#fff',padding:'80px 0'}}>
      <div style={{maxWidth:1180,margin:'0 auto',padding:'0 24px'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:60,alignItems:'center',marginBottom:52}}>
          <div className="lp-fade-left">
            <div className="lp-pill" style={{marginBottom:16}}>
              <Icon name="alert-circle" size={11} style={{color:'#1a6349'}}/>
              The Problem
            </div>
            <h2 className="lp-section-title" style={{marginBottom:0}}>
              Land Acquisition Is Complex.{' '}
              <span style={{color:'#1a6349'}}>Monitoring Shouldn't Be.</span>
            </h2>
          </div>
          <div className="lp-fade-right">
            <p className="lp-section-sub">
              Multiple systems, fragmented data and manual processes make land acquisition slow, complex and opaque.
              DigiBhoomi brings everything <strong style={{color:'#1a6349'}}>together</strong>.
            </p>
          </div>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:20}}>
          {cards.map((c,i)=>(
            <div key={i} className={`lp-card lp-card-green lp-fade-up lp-delay-${i+1}`} style={{padding:'24px 20px'}}>
              <div className="lp-feat-icon" style={{width:42,height:42,borderRadius:10,background:'#f0fdf4',border:'1px solid #d1fae5',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:14}}>
                <Icon name={c.icon} size={19} style={{color:'#1a6349'}}/>
              </div>
              <div style={{fontWeight:700,fontSize:14,color:'#0d3b2e',marginBottom:8}}>{c.title}</div>
              <div style={{fontSize:12,color:'#64748b',lineHeight:1.65}}>{c.text}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 3. LIFECYCLE ───────────────────────────────────────── */
function LandingLifecycle() {
  const steps = [
    { icon:'file-text',     label:'Project\nProposal' },
    { icon:'map-pin',       label:'Land\nIdentification' },
    { icon:'map',           label:'GIS\nMapping' },
    { icon:'search',        label:'Verification' },
    { icon:'bell',          label:'Notification' },
    { icon:'credit-card',   label:'Compensation' },
    { icon:'home',          label:'R&R' },
    { icon:'key',           label:'Possession' },
  ];
  return (
    <section id="lifecycle" style={{background:'#f8fafc',padding:'80px 0'}}>
      <div style={{maxWidth:1180,margin:'0 auto',padding:'0 24px'}}>
        <div className="lp-fade-up" style={{textAlign:'center',marginBottom:52}}>
          <div className="lp-pill" style={{marginBottom:16,justifyContent:'center'}}>
            <Icon name="git-branch" size={11} style={{color:'#1a6349'}}/>
            Lifecycle
          </div>
          <h2 className="lp-section-title">DigiBhoomi Connects the Entire Acquisition Lifecycle</h2>
        </div>

        {/* Horizontal stepper */}
        <div className="lp-fade-up lp-delay-2 lp-scroll-x" style={{paddingBottom:8}}>
          <div style={{display:'flex',alignItems:'flex-start',gap:0,minWidth:'max-content',margin:'0 auto',justifyContent:'center'}}>
            {steps.map((s,i)=>(
              <React.Fragment key={i}>
                <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:12,width:100}}>
                  <div className="lp-step-circle" style={{width:54,height:54,borderRadius:'50%',background:'#e8f5e9',border:'2px solid #86efac',display:'flex',alignItems:'center',justifyContent:'center',color:'#1a6349',cursor:'default',transition:'all .2s'}}
                    onMouseEnter={e=>{e.currentTarget.style.background='#1a6349';e.currentTarget.style.color='#fff';e.currentTarget.style.borderColor='#1a6349';e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow='0 8px 20px rgba(26,99,73,.25)';}}
                    onMouseLeave={e=>{e.currentTarget.style.background='#e8f5e9';e.currentTarget.style.color='#1a6349';e.currentTarget.style.borderColor='#86efac';e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='none';}}
                  >
                    <Icon name={s.icon} size={22}/>
                  </div>
                  <div style={{fontSize:11,fontWeight:600,color:'#334155',textAlign:'center',lineHeight:1.35,whiteSpace:'pre-line'}}>{s.label}</div>
                </div>
                {i < steps.length-1 && (
                  <div style={{display:'flex',alignItems:'center',marginTop:16,paddingBottom:20,width:32,flexShrink:0}}>
                    <svg width="28" height="16" viewBox="0 0 28 16" fill="none">
                      <path d="M2 8 H22" stroke="#86efac" strokeWidth="2" strokeDasharray="3 2"/>
                      <path d="M18 4 L26 8 L18 12" stroke="#1a6349" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── 4. REAL-TIME DASHBOARD ─────────────────────────────── */
function DashboardPreview() {
  const { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } = Recharts;
  const progress = [
    { stage:'Proposal',   pct:100, color:'#25a06e' },
    { stage:'Mapping',    pct:100, color:'#25a06e' },
    { stage:'Verification',pct:88, color:'#25a06e' },
    { stage:'Acquisition',pct:68, color:'#f59e0b' },
    { stage:'Possession', pct:42, color:'#f59e0b' },
  ];
  const compData = [
    {name:'Approved',value:64,color:'#25a06e'},
    {name:'In Progress',value:22,color:'#f59e0b'},
    {name:'Pending',value:14,color:'#ef4444'},
  ];
  const timelineStages = ['Proposal','Mapping','Verification','Acquisition','Possession'];

  return (
    <div className="lp-dash" style={{border:'1px solid #e2e8f0',borderRadius:16,overflow:'hidden',boxShadow:'0 20px 64px rgba(0,0,0,.12)'}}>
      {/* Topbar */}
      <div style={{display:'flex',alignItems:'center',gap:12,padding:'10px 16px',background:'#fff',borderBottom:'1px solid #f1f5f9'}}>
        <div style={{width:28,height:28,borderRadius:7,background:'linear-gradient(135deg,#1a6349,#0d3b2e)',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="rgba(255,255,255,.2)"/><path d="M12 4c-1.5 2.5-3 5-3 8h6c0-3-1.5-5.5-3-8z" fill="#4ade80"/><path d="M9 12c0 2.5 1 5 3 6 2-1 3-3.5 3-6H9z" fill="#86efac"/></svg>
        </div>
        <span style={{fontWeight:800,fontSize:13,color:'#0d3b2e'}}>DigiBhoomi</span>
        <div style={{flex:1,background:'#f8fafc',borderRadius:7,padding:'5px 12px',fontSize:11,color:'#94a3b8',border:'1px solid #e2e8f0',maxWidth:280}}>
          🔍 Search projects, locations, parcels...
        </div>
        <div style={{display:'flex',gap:8,marginLeft:'auto'}}>
          <div style={{width:28,height:28,borderRadius:7,background:'#fff7ed',border:'1px solid #fed7aa',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <Icon name="bell" size={13} style={{color:'#f97316'}}/>
          </div>
          <div style={{width:28,height:28,borderRadius:'50%',background:'#e8f5e9',border:'1px solid #bbf7d0',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <Icon name="user" size={12} style={{color:'#1a6349'}}/>
          </div>
          <div style={{display:'flex',flexDirection:'column',justifyContent:'center'}}>
            <div style={{fontSize:10,fontWeight:700,color:'#0d3b2e'}}>Anjali Verma</div>
            <div style={{fontSize:9,color:'#94a3b8'}}>Ministry Admin</div>
          </div>
        </div>
      </div>

      <div style={{display:'flex',height:520}}>
        {/* Sidebar */}
        <div style={{width:150,background:'#0d3b2e',flexShrink:0,overflowY:'auto',padding:'12px 0'}}>
          {[
            ['layout-dashboard','Overview',true],
            ['folder-open','Projects',false],
            ['map','Land Parcels',false],
            ['trending-up','Acquisition',false],
            ['credit-card','Compensation',false],
            ['home','R&R',false],
            ['clipboard-check','Field Verify',false],
            ['bar-chart-2','Analytics',false],
            ['file-text','Documents',false],
          ].map(([ic,label,active],i)=>(
            <div key={i} style={{
              padding:'7px 12px',fontSize:11,color:active?'#34d399':'rgba(255,255,255,.6)',
              cursor:'pointer',display:'flex',alignItems:'center',gap:8,
              background:active?'rgba(52,211,153,.12)':'transparent',
              borderRadius:6,margin:'1px 6px',transition:'all .18s',
              fontWeight:active?600:400,
            }}
              onMouseEnter={e=>{if(!active){e.currentTarget.style.background='rgba(255,255,255,.06)';e.currentTarget.style.color='#fff';}}}
              onMouseLeave={e=>{if(!active){e.currentTarget.style.background='transparent';e.currentTarget.style.color='rgba(255,255,255,.6)';}}}
            >
              <Icon name={ic} size={12} style={{flexShrink:0}}/>
              <span>{label}</span>
            </div>
          ))}
        </div>

        {/* Main panel */}
        <div style={{flex:1,overflow:'auto',padding:'16px',background:'#f8fafc'}}>
          {/* KPI row */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:10,marginBottom:14}}>
            {[
              {l:'Total Projects',v:'142',c:'#0d3b2e',ic:'layers',bg:'#e8f5e9',bc:'#bbf7d0'},
              {l:'Land Parcels',v:'1.9M',c:'#1a6349',ic:'map-pin',bg:'#e8f5e9',bc:'#bbf7d0'},
              {l:'Acquired Land',v:'68%',c:'#25a06e',ic:'check-circle',bg:'#dcfce7',bc:'#86efac'},
              {l:'Pending Land',v:'32%',c:'#f97316',ic:'clock',bg:'#fff7ed',bc:'#fed7aa'},
              {l:'Delay Alerts',v:'8',c:'#ef4444',ic:'alert-triangle',bg:'#fef2f2',bc:'#fecaca'},
            ].map((s,i)=>(
              <div key={i} style={{background:'#fff',borderRadius:10,padding:'10px 12px',border:'1px solid #e2e8f0',boxShadow:'0 1px 3px rgba(0,0,0,.04)'}}>
                <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:7}}>
                  <div style={{width:26,height:26,borderRadius:7,background:s.bg,border:`1px solid ${s.bc}`,display:'flex',alignItems:'center',justifyContent:'center'}}>
                    <Icon name={s.ic} size={12} style={{color:s.c}}/>
                  </div>
                  <span style={{fontSize:9,color:'#94a3b8',fontWeight:500}}>{s.l}</span>
                </div>
                <div style={{fontWeight:800,fontSize:18,color:s.c,letterSpacing:'-.5px'}}>{s.v}</div>
              </div>
            ))}
          </div>

          {/* Map + detail side-by-side */}
          <div style={{display:'grid',gridTemplateColumns:'1.6fr 1fr',gap:12,marginBottom:14}}>
            {/* Map */}
            <div style={{background:'#fff',borderRadius:10,overflow:'hidden',border:'1px solid #e2e8f0',boxShadow:'0 1px 4px rgba(0,0,0,.05)',height:220}}>
              <div style={{padding:'8px 12px',borderBottom:'1px solid #f1f5f9',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span style={{fontWeight:700,fontSize:11,color:'#0d3b2e'}}>GIS Overview · National</span>
                <div style={{display:'flex',gap:8}}>
                  {[['#25a06e','Acquired'],['#f59e0b','In Progress'],['#ef4444','Delayed']].map(([c,l])=>(
                    <div key={l} style={{display:'flex',alignItems:'center',gap:3}}>
                      <div style={{width:7,height:7,borderRadius:'50%',background:c}}/>
                      <span style={{fontSize:8.5,color:'#64748b'}}>{l}</span>
                    </div>
                  ))}
                </div>
              </div>
              <DashboardMiniMap/>
            </div>

            {/* Project Detail */}
            <div style={{background:'#fff',borderRadius:10,padding:'12px',border:'1px solid #e2e8f0',boxShadow:'0 1px 4px rgba(0,0,0,.05)'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
                <div>
                  <div style={{fontWeight:700,fontSize:11,color:'#0d3b2e'}}>Delhi–Mumbai Expressway</div>
                  <div style={{fontSize:9,color:'#64748b'}}>NH-148N · Maharashtra · Gujarat · Rajasthan</div>
                </div>
                <span style={{fontSize:9,fontWeight:700,padding:'2px 7px',borderRadius:4,background:'#fef2f2',color:'#dc2626',border:'1px solid #fecaca'}}>High Priority</span>
              </div>
              {[
                {l:'Land Required',v:'12,050 Ha',c:'#0d3b2e'},
                {l:'Acquired',v:'6,750 Ha (78%)',c:'#25a06e'},
                {l:'Compensation',v:'₹8,200 Cr (88%)',c:'#1a6349'},
                {l:'Possession',v:'3,400 Ha (61%)',c:'#f59e0b'},
              ].map((r,i)=>(
                <div key={i} style={{display:'flex',justifyContent:'space-between',marginBottom:5,padding:'4px 0',borderBottom:i<3?'1px solid #f1f5f9':'none'}}>
                  <span style={{fontSize:10,color:'#64748b'}}>{r.l}</span>
                  <span style={{fontSize:10,fontWeight:700,color:r.c}}>{r.v}</span>
                </div>
              ))}
              <div style={{marginTop:8}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}>
                  <span style={{fontSize:9,color:'#64748b'}}>Overall Progress</span>
                  <span style={{fontSize:9,fontWeight:700,color:'#f59e0b'}}>68%</span>
                </div>
                <div style={{height:5,background:'#f1f5f9',borderRadius:3}}>
                  <div style={{width:'68%',height:'100%',background:'linear-gradient(90deg,#25a06e,#f59e0b)',borderRadius:3}}/>
                </div>
              </div>
              <div style={{marginTop:6,padding:'5px 8px',background:'#fef2f2',borderRadius:6,border:'1px solid #fecaca'}}>
                <span style={{fontSize:9,color:'#dc2626',fontWeight:600}}>⚠ Delay Risk: High — Legal disputes pending in 3 districts</span>
              </div>
            </div>
          </div>

          {/* Bottom charts row */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10}}>
            {/* Acquisition Progress */}
            <div style={{background:'#fff',borderRadius:10,padding:'12px',border:'1px solid #e2e8f0',boxShadow:'0 1px 3px rgba(0,0,0,.04)'}}>
              <div style={{fontWeight:700,fontSize:10,color:'#0d3b2e',marginBottom:10}}>Acquisition Progress</div>
              <div style={{position:'relative',width:64,height:64,margin:'0 auto 8px'}}>
                <svg viewBox="0 0 36 36" width="64" height="64" style={{transform:'rotate(-90deg)'}}>
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f1f5f9" strokeWidth="3"/>
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#25a06e" strokeWidth="3"
                    strokeDasharray={`${68*100/100} ${100-68}`} strokeDashoffset="0" strokeLinecap="round"/>
                </svg>
                <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:900,color:'#0d3b2e'}}>68%</div>
              </div>
              <div style={{fontSize:9,color:'#64748b',textAlign:'center'}}>68 of 100% target</div>
            </div>

            {/* Compensation Status */}
            <div style={{background:'#fff',borderRadius:10,padding:'12px',border:'1px solid #e2e8f0',boxShadow:'0 1px 3px rgba(0,0,0,.04)'}}>
              <div style={{fontWeight:700,fontSize:10,color:'#0d3b2e',marginBottom:8}}>Compensation Status</div>
              <div style={{display:'flex',flexDirection:'column',gap:5}}>
                {[['Approved','#25a06e',64],['In Progress','#f59e0b',22],['Pending','#ef4444',14]].map(([l,c,v])=>(
                  <div key={l}>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:2}}>
                      <div style={{display:'flex',alignItems:'center',gap:4}}>
                        <div style={{width:7,height:7,borderRadius:'50%',background:c}}/>
                        <span style={{fontSize:9,color:'#64748b'}}>{l}</span>
                      </div>
                      <span style={{fontSize:9,fontWeight:700,color:c}}>{v}%</span>
                    </div>
                    <div style={{height:4,background:'#f1f5f9',borderRadius:3}}>
                      <div style={{width:`${v}%`,height:'100%',background:c,borderRadius:3}}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* R&R Progress */}
            <div style={{background:'#fff',borderRadius:10,padding:'12px',border:'1px solid #e2e8f0',boxShadow:'0 1px 3px rgba(0,0,0,.04)'}}>
              <div style={{fontWeight:700,fontSize:10,color:'#0d3b2e',marginBottom:8}}>R&R Progress</div>
              <div style={{position:'relative',width:60,height:60,margin:'0 auto 6px'}}>
                <svg viewBox="0 0 36 36" width="60" height="60" style={{transform:'rotate(-90deg)'}}>
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f1f5f9" strokeWidth="3.5"/>
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f59e0b" strokeWidth="3.5"
                    strokeDasharray={`${62} ${38}`} strokeLinecap="round"/>
                </svg>
                <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:900,color:'#f59e0b'}}>62%</div>
              </div>
              <div style={{fontSize:9,color:'#64748b',textAlign:'center'}}>Families resettled</div>
            </div>

            {/* Project Timeline */}
            <div style={{background:'#fff',borderRadius:10,padding:'12px',border:'1px solid #e2e8f0',boxShadow:'0 1px 3px rgba(0,0,0,.04)'}}>
              <div style={{fontWeight:700,fontSize:10,color:'#0d3b2e',marginBottom:8}}>Project Timeline</div>
              <div style={{display:'flex',flexDirection:'column',gap:4}}>
                {[
                  {l:'Proposal',pct:100,c:'#25a06e'},
                  {l:'Mapping',pct:100,c:'#25a06e'},
                  {l:'Verification',pct:88,c:'#25a06e'},
                  {l:'Acquisition',pct:68,c:'#f59e0b'},
                  {l:'Possession',pct:42,c:'#f59e0b'},
                ].map((s,i)=>(
                  <div key={i}>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:1}}>
                      <span style={{fontSize:8.5,color:'#64748b'}}>{s.l}</span>
                      <span style={{fontSize:8.5,fontWeight:700,color:s.c}}>{s.pct}%</span>
                    </div>
                    <div style={{height:4,background:'#f1f5f9',borderRadius:3}}>
                      <div style={{width:`${s.pct}%`,height:'100%',background:s.c,borderRadius:3,transition:'width .8s ease'}}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LandingDashboard() {
  return (
    <section style={{background:'#fff',padding:'80px 0'}}>
      <div style={{maxWidth:1180,margin:'0 auto',padding:'0 24px'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 2fr',gap:60,alignItems:'flex-start',marginBottom:48}}>
          <div className="lp-fade-left">
            <div className="lp-pill" style={{marginBottom:16}}>
              <div style={{width:6,height:6,borderRadius:'50%',background:'#25a06e',animation:'lp-pulse-dot 1.5s ease-in-out infinite'}}/>
              Real-Time Dashboard
            </div>
            <h2 className="lp-section-title" style={{marginBottom:14}}>
              Everything You Need.<br/>
              <span style={{color:'#1a6349'}}>One Platform.</span>
            </h2>
            <div style={{width:40,height:3,background:'linear-gradient(90deg,#1a6349,#25a06e)',borderRadius:3,marginBottom:16}}/>
            <p className="lp-section-sub" style={{marginBottom:24}}>
              Get complete visibility of your land acquisition projects with real-time data, interactive maps and actionable insights.
            </p>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
              {[
                {v:'142',l:'Total Projects',ic:'layers',c:'#0d3b2e'},
                {v:'68%',l:'Acquisition Progress',ic:'trending-up',c:'#25a06e'},
              ].map((s,i)=>(
                <div key={i} style={{padding:'12px',background:'#f0fdf4',borderRadius:10,border:'1px solid #d1fae5',display:'flex',alignItems:'center',gap:10}}>
                  <div style={{width:36,height:36,borderRadius:8,background:'#1a6349',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 3px 8px rgba(26,99,73,.25)'}}>
                    <Icon name={s.ic} size={16} style={{color:'#fff'}}/>
                  </div>
                  <div>
                    <div style={{fontWeight:800,fontSize:18,color:s.c,letterSpacing:'-.5px'}}>{s.v}</div>
                    <div style={{fontSize:10,color:'#64748b'}}>{s.l}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="lp-fade-right lp-delay-2">
            <DashboardPreview/>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── 5. FEATURES ────────────────────────────────────────── */
function LandingFeatures() {
  const feats = [
    { icon:'map', title:'GIS Land Mapping', text:'Visualize land parcels and project boundaries on interactive maps with real-time acquisition status.' },
    { icon:'activity', title:'Real-Time Tracking', text:'Monitor progress across all acquisition stages in real time from proposal to possession.' },
    { icon:'brain-circuit', title:'Predictive Delay Detection', text:'Identify bottlenecks before they impact project timelines using AI-powered analysis.' },
    { icon:'heart-handshake', title:'Compensation & R&R Monitoring', text:'Track compensation, R&R and family rehabilitation in one unified platform.' },
    { icon:'smartphone', title:'Field Verification', text:'Enable geo-tagged verification with mobile field teams directly from the app.' },
    { icon:'shield-check', title:'Secure Role-Based Access', text:'Ensure data security with role-based permissions and complete audit logs.' },
  ];
  return (
    <section id="features" style={{background:'#f8fafc',padding:'80px 0'}}>
      <div style={{maxWidth:1180,margin:'0 auto',padding:'0 24px'}}>
        <div className="lp-fade-up" style={{textAlign:'center',marginBottom:52}}>
          <div className="lp-pill" style={{marginBottom:16,justifyContent:'center'}}>
            <Icon name="sparkles" size={11} style={{color:'#1a6349'}}/>
            Key Features
          </div>
          <h2 className="lp-section-title">Powerful tools for smarter, faster<br/>and more transparent land acquisition.</h2>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20}}>
          {feats.map((f,i)=>(
            <div key={i} className={`lp-card lp-fade-up lp-delay-${i%3+1}`} style={{padding:'28px 24px'}}>
              <div style={{width:48,height:48,borderRadius:12,background:'#f0fdf4',border:'1px solid #d1fae5',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:16,transition:'all .2s'}}
                onMouseEnter={e=>{e.currentTarget.style.background='#1a6349';e.currentTarget.querySelector('*').style.color='#fff';}}
                onMouseLeave={e=>{e.currentTarget.style.background='#f0fdf4';e.currentTarget.querySelector('*').style.color='#1a6349';}}
              >
                <Icon name={f.icon} size={22} style={{color:'#1a6349',transition:'color .2s'}}/>
              </div>
              <div style={{fontWeight:700,fontSize:15,color:'#0d3b2e',marginBottom:9}}>{f.title}</div>
              <div style={{fontSize:13,color:'#64748b',lineHeight:1.65}}>{f.text}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 6. WHY DIGIBHOOMI ──────────────────────────────────── */
function LandingWhy() {
  const cards = [
    { icon:'plug', title:'Integration, not Replacement', text:'Works with existing systems and government portals. DigiBhoomi adds a unified monitoring and coordination layer on top.' },
    { icon:'git-merge', title:'End-to-End Lifecycle Monitoring', text:'From proposal to possession, all 18 stages of the acquisition process are tracked in a single platform.' },
    { icon:'cpu', title:'Predictive Decision Support', text:'Identify risks early and make data-driven decisions with AI-powered delay forecasts and bottleneck alerts.' },
  ];
  return (
    <section style={{background:'#fff',padding:'80px 0'}}>
      <div style={{maxWidth:1180,margin:'0 auto',padding:'0 24px'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 2fr',gap:60,alignItems:'flex-start'}}>
          <div className="lp-fade-left">
            <div className="lp-pill" style={{marginBottom:16}}>
              <Icon name="help-circle" size={11} style={{color:'#1a6349'}}/>
              Why DigiBhoomi?
            </div>
            <h2 className="lp-section-title" style={{marginBottom:16}}>
              Existing systems solve individual parts of the process.
            </h2>
            <p className="lp-section-sub">
              DigiBhoomi connects available systems and provides a unified monitoring and decision-support layer — so nothing falls through the cracks.
            </p>
            <div style={{marginTop:24,padding:'16px',background:'#f0fdf4',borderRadius:10,border:'1px solid #d1fae5'}}>
              <div style={{display:'flex',gap:10,marginBottom:10}}>
                <div style={{width:36,height:36,borderRadius:8,background:'#1a6349',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  <Icon name="award" size={16} style={{color:'#fff'}}/>
                </div>
                <div>
                  <div style={{fontWeight:700,fontSize:13,color:'#0d3b2e'}}>SIH 2026 Problem Statement</div>
                  <div style={{fontSize:11,color:'#64748b',marginTop:2}}>ID: SIH26016 · Smart Automation</div>
                </div>
              </div>
              <div style={{fontSize:11,color:'#16a34a',fontWeight:500}}>Team CodeSmiths · Software Category</div>
            </div>
          </div>
          <div className="lp-fade-right lp-delay-1" style={{display:'flex',flexDirection:'column',gap:16}}>
            {cards.map((c,i)=>(
              <div key={i} className="lp-why-card">
                <div className="lp-why-icon">
                  <Icon name={c.icon} size={20} style={{color:'#1a6349'}}/>
                </div>
                <div>
                  <div style={{fontWeight:700,fontSize:15,color:'#0d3b2e',marginBottom:6}}>{c.title}</div>
                  <div style={{fontSize:13,color:'#64748b',lineHeight:1.65}}>{c.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── 7. CTA BANNER ──────────────────────────────────────── */
function LandingCTA() {
  const nav = useNavigate();
  return (
    <section className="lp-cta-banner" style={{padding:'80px 0',position:'relative',overflow:'hidden'}}>
      {/* Decorative map background */}
      <div style={{position:'absolute',inset:0,opacity:.06}}>
        <svg viewBox="0 0 1440 400" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%',objectFit:'cover'}}>
          <path d="M0 200 Q200 150 400 180 Q600 210 800 160 Q1000 110 1200 150 Q1350 180 1440 140" stroke="#fff" strokeWidth="2" fill="none"/>
          <path d="M0 280 Q300 240 600 270 Q900 300 1440 250" stroke="#fff" strokeWidth="1.5" fill="none"/>
          {[200,400,700,950,1200].map(x=>(
            <React.Fragment key={x}>
              <circle cx={x} cy={150+Math.sin(x*.01)*50} r="4" fill="#fff" opacity=".6"/>
              <circle cx={x} cy={150+Math.sin(x*.01)*50} r="10" fill="none" stroke="#fff" strokeWidth="1" opacity=".3"/>
            </React.Fragment>
          ))}
        </svg>
      </div>
      <div style={{position:'absolute',top:-80,left:'50%',transform:'translateX(-50%)',width:600,height:300,background:'radial-gradient(circle,rgba(52,211,153,.12),transparent 70%)',pointerEvents:'none'}}/>

      <div style={{maxWidth:1180,margin:'0 auto',padding:'0 24px',position:'relative',zIndex:1}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr auto',gap:48,alignItems:'center'}}>
          <div className="lp-fade-left">
            <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:16}}>
              <div style={{width:42,height:42,borderRadius:10,background:'rgba(52,211,153,.15)',border:'1px solid rgba(52,211,153,.25)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <Icon name="map-pin" size={20} style={{color:'#34d399'}}/>
              </div>
              <div style={{fontSize:11,fontWeight:700,color:'rgba(255,255,255,.5)',letterSpacing:'1.5px',textTransform:'uppercase'}}>Ready to Transform Land Acquisition?</div>
            </div>
            <h2 style={{fontSize:'clamp(24px,3.5vw,44px)',fontWeight:900,color:'#fff',letterSpacing:'-1px',lineHeight:1.1,marginBottom:14}}>
              Track Every Step.<br/>
              From Proposal to Possession.
            </h2>
            <p style={{fontSize:15,color:'rgba(255,255,255,.6)',lineHeight:1.7,maxWidth:560}}>
              DigiBhoomi enables transparent, connected and data-driven land acquisition management — for ministries, states, districts and field teams across India.
            </p>
          </div>
          <div className="lp-fade-right lp-delay-2" style={{display:'flex',flexDirection:'column',alignItems:'center',gap:14}}>
            <button className="lp-btn-orange" onClick={()=>nav('/login')} style={{whiteSpace:'nowrap',fontSize:15,padding:'14px 32px'}}>
              Enter DigiBhoomi
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
            <div style={{fontSize:11,color:'rgba(255,255,255,.35)',textAlign:'center'}}>Ministry Admin · State Admin · Field Officer</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── 8. FOOTER ──────────────────────────────────────────── */
function LandingFooter() {
  const nav = useNavigate();
  return (
    <footer className="lp-footer" style={{padding:'52px 0 24px'}}>
      <div style={{maxWidth:1180,margin:'0 auto',padding:'0 24px'}}>
        <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',gap:40,marginBottom:40}}>
          {/* Brand */}
          <div>
            <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:14,cursor:'pointer'}} onClick={()=>nav('/')}>
              <div style={{width:32,height:32,borderRadius:8,background:'linear-gradient(135deg,#1a6349,#0d3b2e)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 2px 8px rgba(26,99,73,.4)'}}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="rgba(255,255,255,.2)"/><path d="M12 4c-1.5 2.5-3 5-3 8h6c0-3-1.5-5.5-3-8z" fill="#4ade80"/><path d="M9 12c0 2.5 1 5 3 6 2-1 3-3.5 3-6H9z" fill="#86efac"/></svg>
              </div>
              <span style={{fontWeight:800,fontSize:16,color:'#fff'}}>DigiBhoomi</span>
            </div>
            <p style={{fontSize:12,color:'rgba(255,255,255,.5)',lineHeight:1.7,maxWidth:260,marginBottom:16}}>
              Real-Time National Land Acquisition & Management System for End-to-End Digital Monitoring and Decision Support.
            </p>
            <div style={{display:'flex',gap:8}}>
              {[['shield-check','Secure'],['zap','AI-Powered'],['globe-2','Nationwide']].map(([ic,l])=>(
                <div key={l} style={{display:'flex',alignItems:'center',gap:4,padding:'3px 8px',background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.1)',borderRadius:5}}>
                  <Icon name={ic} size={10} style={{color:'#34d399'}}/>
                  <span style={{fontSize:9,color:'rgba(255,255,255,.5)',fontWeight:600}}>{l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <div className="lp-footer-heading">Quick Links</div>
            {['Home','About','Features','How It Works','Dashboard','Analytics'].map(l=>(
              <div key={l}><a href="#hero">{l}</a></div>
            ))}
          </div>

          {/* Contact */}
          <div>
            <div className="lp-footer-heading">Contact</div>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              <div style={{display:'flex',alignItems:'center',gap:6,fontSize:12,color:'rgba(255,255,255,.55)'}}>
                <Icon name="mail" size={12} style={{color:'#34d399',flexShrink:0}}/>
                support@digibhoomi.gov.in
              </div>
              <div style={{display:'flex',alignItems:'center',gap:6,fontSize:12,color:'rgba(255,255,255,.55)'}}>
                <Icon name="phone" size={12} style={{color:'#34d399',flexShrink:0}}/>
                +91 1800 123 4567
              </div>
              <div style={{display:'flex',alignItems:'center',gap:6,fontSize:12,color:'rgba(255,255,255,.55)'}}>
                <Icon name="map-pin" size={12} style={{color:'#34d399',flexShrink:0}}/>
                Ministry of Rural Development, New Delhi
              </div>
            </div>
          </div>

          {/* Legal */}
          <div>
            <div className="lp-footer-heading">Legal</div>
            {['Privacy Policy','Security Policy','Terms of Use','Accessibility','RTI'].map(l=>(
              <div key={l}><a href="#hero">{l}</a></div>
            ))}
          </div>
        </div>

        <div style={{borderTop:'1px solid rgba(255,255,255,.08)',paddingTop:20,display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:12}}>
          <div style={{fontSize:11,color:'rgba(255,255,255,.3)'}}>
            © 2025 DigiBhoomi. All rights reserved. · Ministry of Rural Development, Dept. of Land Resources (DoLR)
          </div>
          <div style={{display:'flex',alignItems:'center',gap:6,fontSize:11,color:'rgba(255,255,255,.3)'}}>
            <Icon name="zap" size={10} style={{color:'#34d399'}}/>
            Building a Smarter, More Connected India
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ── PAGE ASSEMBLY ──────────────────────────────────────── */
function LandingPage() {
  useLucide();
  return (
    <div style={{minHeight:'100vh',fontFamily:'Inter,system-ui,sans-serif',background:'#f8fafc'}}>
      <LandingStyles/>
      <LandingNav/>
      <LandingHero/>
      <LandingChallenge/>
      <LandingLifecycle/>
      <LandingDashboard/>
      <LandingFeatures/>
      <LandingWhy/>
      <LandingCTA/>
      <LandingFooter/>
    </div>
  );
}

Object.assign(window, { LandingPage });