/* Login · Dashboard · Projects · Create Project */

const {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, RadialBarChart, RadialBar,
} = Recharts;

// ============= LOGIN =============
// All demo accounts — exactly 6 roles
const DEMO_ACCOUNTS = [
  { role:'Ministry Administrator',  email:'ministry.demo@gov.in' },
  { role:'State Administrator',     email:'state.demo@delhi.gov.in' },
  { role:'District Administrator',  email:'district.demo@delhi.gov.in' },
  { role:'Project Manager',         email:'project.demo@delhi.gov.in' },
  { role:'Field Officer',           email:'field.demo@delhi.gov.in' },
  { role:'Landowner',               email:'landowner.demo@gmail.com' },
];
const DEMO_PASSWORD = 'digibhoomi@2026';
const ALL_ROLES = [
  'Ministry Administrator', 'State Administrator', 'District Administrator',
  'Project Manager', 'Field Officer', 'Landowner',
];

function LoginBrandPanel(){
  return (
    <div className="relative hidden lg:block bg-gradient-to-br from-[#F5EFE6] via-[#EDE3D5] to-[#E5D9C6] text-slate-800 overflow-hidden">
      <div className="absolute inset-0 opacity-30" style={{
        background:'radial-gradient(1000px 500px at 20% 10%, rgba(21,94,239,.35), transparent 60%), radial-gradient(600px 400px at 80% 80%, rgba(16,185,129,.25), transparent 60%)'
      }}/>
      <div className="absolute inset-0 opacity-[0.07]" style={{
        backgroundImage:'linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)',
        backgroundSize:'48px 48px'
      }}/>
      <div className="relative h-full flex flex-col p-12">
        <a href="#/" className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/40">
            <Icon name="mountain-snow" size={22}/>
          </div>
          <div>
            <div className="text-lg font-semibold text-slate-900">DigiBhoomi</div>
            <div className="text-[10px] tracking-widest text-slate-500">GOVERNMENT OF INDIA · SECURE PORTAL</div>
          </div>
        </a>
        <div className="flex-1 flex flex-col justify-center max-w-lg">
          <div className="text-[11px] tracking-widest text-brand-600 font-semibold">AI-POWERED LAND ACQUISITION INTELLIGENCE</div>
          <h1 className="mt-3 text-4xl font-semibold leading-tight text-slate-900">Predict delays. Resolve risks. Accelerate infrastructure.</h1>
          <p className="mt-4 text-slate-600 leading-relaxed">
            A decision-support platform for ministries, states and districts — combining
            geospatial land records, workflow governance and explainable ML predictions.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              {n:'1,248', l:'Projects tracked'},
              {n:'218 K',  l:'Households mapped'},
              {n:'87 %',   l:'Model confidence'},
            ].map((s,i)=>(
              <div key={i} className="rounded-xl bg-white/50 backdrop-blur ring-1 ring-brand-500/20 p-4">
                <div className="text-2xl font-semibold text-slate-900">{s.n}</div>
                <div className="text-[11px] text-slate-500 mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="text-[11px] text-slate-400">
          v2.4.1 · Restricted access · monitored under IT Act 2000
        </div>
      </div>
    </div>
  );
}

function LoginPage(){
  const nav = useNavigate();
  const [mode, setMode] = useState('signin'); // 'signin' | 'demo' | 'register'
  useLucide();

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      <LoginBrandPanel/>
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-brand-500 flex items-center justify-center text-white"><Icon name="mountain-snow" size={20}/></div>
            <div>
              <div className="text-lg font-semibold">DigiBhoomi</div>
              <div className="text-[10px] tracking-widest text-slate-500">SECURE PORTAL</div>
            </div>
          </div>

          {mode !== 'register' && (
            <div className="mb-6 grid grid-cols-2 gap-1 p-1 rounded-lg bg-slate-100">
              <button onClick={()=>setMode('signin')} className={`text-sm font-medium rounded-md py-2 transition-colors ${mode==='signin'?'bg-white shadow-sm text-slate-900':'text-slate-500 hover:text-slate-700'}`}>Sign In</button>
              <button onClick={()=>setMode('demo')} className={`text-sm font-medium rounded-md py-2 transition-colors ${mode==='demo'?'bg-white shadow-sm text-slate-900':'text-slate-500 hover:text-slate-700'}`}>Demo</button>
            </div>
          )}

          {mode === 'signin' && <SignInForm onRegister={()=>setMode('register')}/>}
          {mode === 'demo'   && <DemoForm/>}
          {mode === 'register' && <RegisterForm onBack={()=>setMode('signin')}/>}

          <div className="mt-8 text-[11px] text-slate-400 flex items-center gap-2 justify-center">
            <Icon name="shield-check" size={12}/>
            Multi-factor authentication · Session encrypted · Aadhaar-linked
          </div>
        </div>
      </div>
    </div>
  );
}

function SignInForm({ onRegister }){
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const submit = async () => {
    setBusy(true); setError(null);
    try {
      const user = await loginRequest(email, password);
      window.BS_STATE.user = user;
      localStorage.setItem('bs.user', JSON.stringify(user));
      await bootData();
      nav('/dashboard');
    } catch (err) {
      if (err.message && err.message.toLowerCase().includes('no account')) {
        try {
          await fetch('/api/seed', { method: 'POST' });
          const user = await loginRequest(email, password);
          window.BS_STATE.user = user;
          localStorage.setItem('bs.user', JSON.stringify(user));
          await bootData();
          nav('/dashboard');
          return;
        } catch (retryErr) {}
      }
      setError(err.message || 'Login failed');
    } finally { setBusy(false); }
  };

  return (
    <div>
      <div className="text-[11px] tracking-widest text-slate-500 font-semibold">SIGN IN</div>
      <h2 className="mt-2 text-2xl font-semibold text-slate-900">Welcome back</h2>
      <p className="mt-1 text-sm text-slate-500">Sign in with your registered email — authenticated against the DigiBhoomi server.</p>

      {error && <div className="mt-4 text-xs rounded-lg bg-red-50 text-danger-500 ring-1 ring-red-200 px-3 py-2">{error}</div>}

      <div className="mt-6 space-y-3">
        <label className="block">
          <div className="text-xs text-slate-500 mb-1">Official email</div>
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@gov.in" className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:border-brand-500 focus:bg-white outline-none text-sm"/>
        </label>
        <label className="block">
          <div className="text-xs text-slate-500 mb-1">Password</div>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==='Enter' && submit()} className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:border-brand-500 focus:bg-white outline-none text-sm"/>
        </label>
      </div>

      <button disabled={busy || !email || !password} onClick={submit} className="mt-5 w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white rounded-lg py-2.5 text-sm font-medium flex items-center justify-center gap-2">
        {busy ? 'Signing in…' : 'Sign In securely'} {!busy && <Icon name="arrow-right" size={14}/>}
      </button>

      <div className="mt-4 text-center text-sm">
        <span className="text-slate-500">Need an account? </span>
        <button onClick={onRegister} className="text-brand-600 font-medium hover:underline">Register here</button>
      </div>
    </div>
  );
}

function DemoForm(){
  const nav = useNavigate();
  const [role, setRole] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const account = DEMO_ACCOUNTS.find(a => a.role === role);
  const email = account ? account.email : '';
  const password = account ? DEMO_PASSWORD : '';

  const submit = async () => {
    if(!account) return;
    setBusy(true); setError(null);
    try {
      const user = await loginRequest(email, password);
      window.BS_STATE.user = user;
      localStorage.setItem('bs.user', JSON.stringify(user));
      await bootData();
      nav('/dashboard');
    } catch (err) {
      if (err.message && err.message.toLowerCase().includes('no account')) {
        try {
          await fetch('/api/seed', { method: 'POST' });
          const user = await loginRequest(email, password);
          window.BS_STATE.user = user;
          localStorage.setItem('bs.user', JSON.stringify(user));
          await bootData();
          nav('/dashboard');
          return;
        } catch (retryErr) {}
      }
      setError(err.message || 'Login failed');
    } finally { setBusy(false); }
  };

  return (
    <div>
      <div className="text-[11px] tracking-widest text-slate-500 font-semibold">DEMO ACCESS</div>
      <h2 className="mt-2 text-2xl font-semibold text-slate-900">Try a role</h2>
      <p className="mt-1 text-sm text-slate-500">Pick a role — credentials are filled in for you automatically.</p>

      {error && (
        <div className="mt-4 text-xs rounded-lg bg-red-50 text-danger-500 ring-1 ring-red-200 px-3 py-2 space-y-1">
          <div>{error}</div>
          {error.toLowerCase().includes('no account') && (
            <button
              type="button"
              onClick={async () => {
                setBusy(true);
                setError(null);
                try {
                  await fetch('/api/seed', { method: 'POST' });
                  await submit();
                } catch(se) {
                  setError('Failed to seed database: ' + se.message);
                  setBusy(false);
                }
              }}
              className="font-medium text-brand-600 hover:underline inline-block"
            >
              Click here to seed demo accounts on server & sign in
            </button>
          )}
        </div>
      )}

      <div className="mt-6 space-y-3">
        <label className="block">
          <div className="text-xs text-slate-500 mb-1">Role</div>
          <select value={role} onChange={e=>setRole(e.target.value)} className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:border-brand-500 focus:bg-white outline-none text-sm">
            <option value="">Select a role…</option>
            {DEMO_ACCOUNTS.map(a => <option key={a.role} value={a.role}>{a.role}</option>)}
          </select>
        </label>
        <label className="block">
          <div className="text-xs text-slate-500 mb-1">Official email <span className="text-slate-400">(auto-filled)</span></div>
          <input value={email} readOnly disabled placeholder="Select a role first" className="w-full px-3.5 py-2.5 rounded-lg bg-slate-100 border border-slate-200 outline-none text-sm text-slate-500 cursor-not-allowed"/>
        </label>
        <label className="block">
          <div className="text-xs text-slate-500 mb-1">Password <span className="text-slate-400">(auto-filled)</span></div>
          <input value={password ? '•'.repeat(password.length) : ''} readOnly disabled placeholder="Select a role first" className="w-full px-3.5 py-2.5 rounded-lg bg-slate-100 border border-slate-200 outline-none text-sm text-slate-500 cursor-not-allowed"/>
        </label>
      </div>

      <button disabled={busy || !account} onClick={submit} className="mt-5 w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white rounded-lg py-2.5 text-sm font-medium flex items-center justify-center gap-2">
        {busy ? 'Signing in…' : `Sign In as ${role || '…'}`} {!busy && <Icon name="arrow-right" size={14}/>}
      </button>
    </div>
  );
}

function RegisterForm({ onBack }){
  const nav = useNavigate();
  const [f, setF] = useState({ name:'', email:'', password:'', role:'Land Acquisition Officer', state:'', dept:'' });
  const set = (k,v) => setF(x=>({...x,[k]:v}));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const submit = async () => {
    if(!f.name || !f.email || !f.password){ setError('Name, email and password are required'); return; }
    if(f.password.length < 6){ setError('Password must be at least 6 characters'); return; }
    setBusy(true); setError(null);
    try {
      const user = await registerRequest(f);
      window.BS_STATE.user = user;
      localStorage.setItem('bs.user', JSON.stringify(user));
      await bootData();
      nav('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally { setBusy(false); }
  };

  return (
    <div>
      <button onClick={onBack} className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1 mb-4"><Icon name="arrow-left" size={12}/> Back to sign in</button>
      <div className="text-[11px] tracking-widest text-slate-500 font-semibold">CREATE ACCOUNT</div>
      <h2 className="mt-2 text-2xl font-semibold text-slate-900">Register</h2>
      <p className="mt-1 text-sm text-slate-500">Create an account for any role on the platform.</p>

      {error && <div className="mt-4 text-xs rounded-lg bg-red-50 text-danger-500 ring-1 ring-red-200 px-3 py-2">{error}</div>}

      <div className="mt-6 space-y-3">
        <label className="block">
          <div className="text-xs text-slate-500 mb-1">Full name</div>
          <input value={f.name} onChange={e=>set('name',e.target.value)} className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:border-brand-500 focus:bg-white outline-none text-sm"/>
        </label>
        <label className="block">
          <div className="text-xs text-slate-500 mb-1">Official email</div>
          <input value={f.email} onChange={e=>set('email',e.target.value)} placeholder="you@gov.in" className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:border-brand-500 focus:bg-white outline-none text-sm"/>
        </label>
        <label className="block">
          <div className="text-xs text-slate-500 mb-1">Password</div>
          <input type="password" value={f.password} onChange={e=>set('password',e.target.value)} className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:border-brand-500 focus:bg-white outline-none text-sm"/>
        </label>
        <label className="block">
          <div className="text-xs text-slate-500 mb-1">Role</div>
          <select value={f.role} onChange={e=>set('role',e.target.value)} className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:border-brand-500 focus:bg-white outline-none text-sm">
            {ALL_ROLES.map(r=><option key={r}>{r}</option>)}
          </select>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <div className="text-xs text-slate-500 mb-1">State</div>
            <input value={f.state} onChange={e=>set('state',e.target.value)} placeholder="e.g. Rajasthan" className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:border-brand-500 focus:bg-white outline-none text-sm"/>
          </label>
          <label className="block">
            <div className="text-xs text-slate-500 mb-1">Department</div>
            <input value={f.dept} onChange={e=>set('dept',e.target.value)} placeholder="e.g. Revenue" className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:border-brand-500 focus:bg-white outline-none text-sm"/>
          </label>
        </div>
      </div>

      <button disabled={busy} onClick={submit} className="mt-5 w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white rounded-lg py-2.5 text-sm font-medium flex items-center justify-center gap-2">
        {busy ? 'Creating account…' : 'Create account'} {!busy && <Icon name="arrow-right" size={14}/>}
      </button>
    </div>
  );
}

// ============= DASHBOARD =============
function Dashboard(){
  useLucide();
  useStore();
  const nav = useNavigate();
  const k = analyticsService.kpis();
  const trend = analyticsService.riskTrend();
  const states = analyticsService.stateRisk();
  const drivers = analyticsService.delayDrivers();
  const stages = analyticsService.stagePerformance();
  const compTrend = analyticsService.compensationTrend();
  const critical = analyticsService.criticalProjects();

  const user = window.BS_STATE?.user || {};
  const isNational = !user.state || user.state === '—' || user.role === 'Ministry Administrator' || (user.role && user.role.includes('Ministry'));
  const userState = user.state;
  const hasAir001 = window.BS_DATA?.PROJECTS?.some(p => p.id === 'AIR-001');
  const featuredProject = hasAir001 ? { id: 'AIR-001', name: 'AIR-001 Airport' } : window.BS_DATA?.PROJECTS?.[0] ? { id: window.BS_DATA.PROJECTS[0].id, name: window.BS_DATA.PROJECTS[0].name } : null;

  return (
    <AppLayout crumbs={[{label:'Command Center'}]}
      right={
        <div className="flex items-center gap-2">
          <Segmented value="30d" onChange={()=>{}} options={[{value:'7d',label:'7d'},{value:'30d',label:'30d'},{value:'qtr',label:'Quarter'},{value:'ytd',label:'YTD'}]}/>
          <Button variant="secondary" icon="download" size="sm">Export</Button>
          <Button variant="dark" icon="plus" size="sm" onClick={()=>nav('/projects/new')}>New Project</Button>
        </div>
      }>

      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-br from-[#F5EFE6] via-[#EDE3D5] to-[#E5D9C6] overflow-hidden relative ring-1 ring-brand-500/20">
        <div className="absolute inset-0 opacity-20" style={{
          background:'radial-gradient(700px 300px at 10% 0%, rgba(184,115,51,.4), transparent 60%), radial-gradient(500px 250px at 90% 100%, rgba(217,164,65,.35), transparent 60%)'
        }}/>
        <div className="relative px-6 py-6 grid md:grid-cols-[1.3fr_1fr] gap-6 items-center">
          <div>
            <div className="text-[11px] tracking-widest text-brand-600 font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 pulse-ring"/> LIVE · {isNational ? 'NATIONAL COMMAND CENTER' : `${userState.toUpperCase()} COMMAND CENTER`}
            </div>
            <h1 className="mt-1.5 text-2xl font-semibold text-slate-900">Good morning, {(user.name||'Officer')?.split(' ')[0]}.</h1>
            <p className="mt-1 text-sm text-slate-600 max-w-lg">
              {k.needsIntervention} {k.needsIntervention === 1 ? 'project needs' : 'projects need'} intervention today. Active recommendations: {window.BS_DATA?.RECOMMENDATIONS?.length || 0}{isNational ? ' across all states' : ` in ${userState}`}.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="primary" icon="brain-circuit" onClick={()=>nav('/ai/risk')}>Open AI Risk Center</Button>
              {featuredProject && (
                <button onClick={()=>nav('/projects/' + featuredProject.id)} className="rounded-lg bg-white/60 hover:bg-white/80 ring-1 ring-brand-500/20 text-sm px-3.5 py-2 flex items-center gap-2 text-slate-700">
                  <Icon name="star" size={14} className="text-amber-500"/> {hasAir001 ? 'Flagship · AIR-001 Airport' : `Project · ${featuredProject.id}`}
                </button>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { l:'Total Projects', v: k.total.toLocaleString(), sub: isNational ? 'across all states' : `in ${userState}` },
              { l:'Active',         v: k.active.toLocaleString(), sub:`${k.total > 0 ? Math.round(k.active/k.total*100) : 0}% of portfolio` },
              { l:'High Risk',      v: k.highRisk,  sub:'need attention', tone:'text-orange-600' },
              { l:'Critical',       v: k.critical,  sub:'red-flag list',  tone:'text-red-600' },
            ].map((s,i)=>(
              <div key={i} className="rounded-xl bg-white/50 ring-1 ring-brand-500/15 p-4">
                <div className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">{s.l}</div>
                <div className={`mt-1 text-2xl font-semibold tabular ${s.tone||'text-slate-900'}`}>{s.v}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-5">
        <StatCard label="On Track" value={k.onTrack} icon="check-circle-2" tone="good" hint={`${k.active > 0 ? Math.round(k.onTrack/k.active*100) : 0}% of active`}/>
        <StatCard label="Delayed"  value={k.delayed} icon="timer-off" tone="high" hint="mean 68 days"/>
        <StatCard label="Needs Intervention" value={k.needsIntervention} icon="shield-alert" tone="critical"/>
        <StatCard label="Land Under Acquisition" value={nfmt(k.landUnderAcquisition)+' ha'} icon="land-plot" tone="brand"/>
        <StatCard label="Affected Households" value={nfmt(k.affectedHouseholds)} icon="users" tone="default"/>
        <StatCard label="Pending Compensation" value={nfmt(k.pendingCompensation)} icon="wallet" tone="medium"/>
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-4 mt-5">
        <Card className="lg:col-span-2">
          <SectionHeader
            title={isNational ? "National risk trend" : `${userState} risk trend`}
            subtitle={isNational ? "Weighted delay-probability across all active projects" : `Weighted delay-probability for ${userState} projects`}
            right={
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-brand-500"/>{isNational ? 'National' : userState}</div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-red-500"/>Critical portfolio</div>
              </div>
            }/>
          <div className="h-64">
            <ResponsiveContainer>
              <AreaChart data={trend} margin={{left:-10,right:6,top:6,bottom:0}}>
                <defs>
                  <linearGradient id="gnat" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#B87333" stopOpacity=".35"/>
                    <stop offset="100%" stopColor="#B87333" stopOpacity="0"/>
                  </linearGradient>
                  <linearGradient id="gcrit" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#EF4444" stopOpacity=".3"/>
                    <stop offset="100%" stopColor="#EF4444" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#eef1f5"/>
                <XAxis dataKey="month" fontSize={11} stroke="#94a3b8" tickLine={false} axisLine={false}/>
                <YAxis fontSize={11} stroke="#94a3b8" tickLine={false} axisLine={false} width={30}/>
                <Tooltip contentStyle={{borderRadius:8, border:'1px solid #e2e8f0', fontSize:12}}/>
                <Area type="monotone" dataKey="national" stroke="#B87333" strokeWidth={2} fill="url(#gnat)"/>
                <Area type="monotone" dataKey="critical" stroke="#EF4444" strokeWidth={2} fill="url(#gcrit)"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <SectionHeader title="Delay causes" subtitle="Aggregated across critical projects"/>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={drivers} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80} paddingAngle={2}>
                  {drivers.map((d,i)=><Cell key={i} fill={d.color}/>)}
                </Pie>
                <Tooltip contentStyle={{borderRadius:8, border:'1px solid #e2e8f0', fontSize:12}}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
            {drivers.map(d => (
              <div key={d.name} className="flex items-center justify-between">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm" style={{background:d.color}}/><span className="text-slate-600">{d.name}</span></span>
                <span className="tabular font-medium text-slate-900">{d.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mt-4">
        <Card className="lg:col-span-2">
          <SectionHeader title="State-wise risk score" subtitle="Higher = greater aggregated delay probability"/>
          <div className="h-60">
            <ResponsiveContainer>
              <BarChart data={states} margin={{left:-14,right:6,top:6,bottom:0}}>
                <CartesianGrid vertical={false} stroke="#eef1f5"/>
                <XAxis dataKey="code" fontSize={11} stroke="#94a3b8" tickLine={false} axisLine={false}/>
                <YAxis fontSize={11} stroke="#94a3b8" tickLine={false} axisLine={false} width={30}/>
                <Tooltip contentStyle={{borderRadius:8, border:'1px solid #e2e8f0', fontSize:12}}
                  formatter={(v,name,p)=>[`${v}%`, p.payload.state]}/>
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
              <LineChart data={compTrend} margin={{left:-14,right:6,top:6,bottom:0}}>
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
      <Card className="mt-4">
        <SectionHeader title="Stage performance" subtitle="Where projects spend the most time and where they slip"/>
        <div className="h-56">
          <ResponsiveContainer>
            <BarChart data={stages} margin={{left:-10,right:6,top:6,bottom:0}} barGap={4}>
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

      {/* Critical projects */}
      <Card className="mt-4" pad={false}>
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
            { key:'state', label:'State', render:r=>`${r.state} · ${r.district}` },
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

// ============= PROJECTS LIST =============
function ProjectsList(){
  useLucide();
  useStore();
  const nav = useNavigate();
  const loc = useLocation();
  const params = new URLSearchParams(loc.search);
  const [q, setQ] = useState(params.get('q') || '');
  const [type, setType] = useState(params.get('type') || '');
  const [state, setState] = useState(params.get('state') || '');
  const [risk, setRisk] = useState(params.get('risk') || '');
  const [view, setView] = useState('cards');

  const projects = projectService.getProjects({ q, type, state, risk });

  return (
    <AppLayout crumbs={[{label:'Projects'}]} right={
      <Button variant="dark" icon="plus" size="sm" onClick={()=>nav('/projects/new')}>Create Project</Button>
    }>
      <div className="flex items-end justify-between gap-4 mb-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Portfolio · {projects.length} projects</h1>
          <p className="text-sm text-slate-500 mt-0.5">Every infrastructure project across states, with AI risk, workflow stage and accountability chain.</p>
        </div>
        <Segmented value={view} onChange={setView} options={[{value:'table',label:'Table'},{value:'cards',label:'Cards'}]}/>
      </div>

      <Card className="mb-4" pad={false}>
        <div className="p-3 flex flex-wrap items-center gap-2">
          <div className="relative">
            <Icon name="search" size={14} className="absolute left-3 top-2.5 text-slate-400"/>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search project id or name"
              className="w-72 pl-8 pr-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-500 text-sm outline-none"/>
          </div>
          <select value={type} onChange={e=>setType(e.target.value)} className="text-sm rounded-lg border border-slate-200 bg-white px-3 py-1.5">
            <option value="">All types</option>
            {window.BS_DATA.PROJECT_TYPES.map(t=><option key={t}>{t}</option>)}
          </select>
          <select value={state} onChange={e=>setState(e.target.value)} className="text-sm rounded-lg border border-slate-200 bg-white px-3 py-1.5">
            <option value="">All states</option>
            {window.BS_DATA.STATES.map(s=><option key={s.code}>{s.name}</option>)}
          </select>
          <select value={risk} onChange={e=>setRisk(e.target.value)} className="text-sm rounded-lg border border-slate-200 bg-white px-3 py-1.5">
            <option value="">All risk levels</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <div className="flex-1"/>
          <Button variant="ghost" size="sm" icon="filter">More filters</Button>
          <Button variant="secondary" size="sm" icon="download">Export</Button>
        </div>
      </Card>

      {view === 'table' ? (
        <Card pad={false}>
          <DataTable
            onRowClick={r=>nav('/projects/'+r.id)}
            columns={[
              { key:'id', label:'Project', render:r=>(
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-semibold ${r.flagship?'bg-gradient-to-br from-brand-500 to-brand-600 text-white ring-2 ring-brand-500/30':'bg-slate-200 text-slate-700'}`}>
                    {r.type[0]}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <div className="font-medium text-slate-900 text-sm truncate">{r.name}</div>
                      {r.flagship && <span className="text-[9px] bg-amber-100 text-amber-800 rounded px-1.5 py-0.5 font-semibold uppercase tracking-wider">Flagship</span>}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">{r.id} · {r.type}</div>
                  </div>
                </div>
              )},
              { key:'state', label:'Location', render:r=><div><div className="text-sm">{r.state}</div><div className="text-[11px] text-slate-500">{r.district}</div></div>},
              { key:'stage', label:'Stage', render:r=>(
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-500">S{r.currentStage}/7</span>
                  <div className="w-24"><Progress value={r.progress} tone={r.riskLevel} size="sm"/></div>
                  <span className="text-[11px] tabular text-slate-500">{r.progress}%</span>
                </div>
              )},
              { key:'aiRisk', label:'AI Risk', render:r=>(
                <div className="flex items-center gap-2">
                  <span className={`tabular font-semibold text-sm ${r.riskLevel==='critical'?'text-red-600':r.riskLevel==='high'?'text-orange-600':r.riskLevel==='medium'?'text-amber-600':'text-emerald-600'}`}>{r.aiRisk}%</span>
                  <RiskBadge level={r.riskLevel}/>
                </div>
              )},
              { key:'expectedDelay', label:'Est. Delay', render:r=><span className="tabular">{r.expectedDelay}d</span>},
              { key:'landRequired', label:'Land', render:r=><span className="tabular text-sm">{r.landAcquired}/{r.landRequired} <span className="text-slate-400">ha</span></span>},
              { key:'households', label:'Households', render:r=><span className="tabular">{nfmt(r.households)}</span>},
              { key:'owner', label:'Owner' },
            ]}
            rows={projects}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {projects.map(r => (
            <div key={r.id} className="aspect-square bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 p-4 flex flex-col justify-between group cursor-pointer" onClick={()=>nav('/projects/'+r.id)}>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-semibold shrink-0 group-hover:scale-110 transition-transform ${r.flagship?'bg-gradient-to-br from-brand-500 to-brand-600 text-white':'bg-brand-50 text-brand-600'}`}>
                    {r.type[0]}
                  </div>
                  <RiskBadge level={r.riskLevel}/>
                </div>
                <div>
                  <h3 className="font-medium text-slate-800 text-sm line-clamp-2 mt-1">{r.name}</h3>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">{r.id}</div>
                </div>
              </div>
              <div className="mt-auto pt-3 flex flex-col gap-2">
                <Progress value={r.progress} tone={r.riskLevel} showLabel size="sm"/>
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span className="truncate pr-2">{r.state}</span>
                  <span className="font-semibold">{r.aiRisk}% Risk</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
}

// ============= CREATE PROJECT =============
function CreateProject(){
  useLucide();
  const nav = useNavigate();
  const [f, setF] = useState({
    name:'', type:'Highway', state:'Rajasthan', district:'',
    landRequired: 500, households: 800, budget: 3000,
    department:'MoRTH', owner:'Anjali Verma',
    plannedCompletion:'2028-06-30',
  });
  const set = (k,v) => setF(x => ({...x, [k]:v}));

  const submit = () => {
    if(!f.name){ toastBus.push('Project name is required','error'); return; }
    const p = projectService.createProject(f);
    toastBus.push('Project created · Stage 1 announced','success');
    nav('/projects/'+p.id);
  };

  return (
    <AppLayout crumbs={[{label:'Projects', to:'/projects'},{label:'Create Project'}]}>
      <div className="max-w-4xl">
        <SectionHeader title="Create new project"
          subtitle="This will initiate Stage 1 — Project Announced. Subsequent stages unlock based on workflow approvals."/>
        <Card>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Project name" required>
              <input value={f.name} onChange={e=>set('name',e.target.value)} placeholder="e.g. Coastal Freight Corridor" className="input"/>
            </Field>
            <Field label="Project type">
              <select value={f.type} onChange={e=>set('type',e.target.value)} className="input">
                {window.BS_DATA.PROJECT_TYPES.map(t=><option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="State">
              <select value={f.state} onChange={e=>set('state',e.target.value)} className="input">
                {window.BS_DATA.STATES.map(s=><option key={s.code}>{s.name}</option>)}
              </select>
            </Field>
            <Field label="District">
              <input value={f.district} onChange={e=>set('district',e.target.value)} placeholder="e.g. Jaipur" className="input"/>
            </Field>
            <Field label="Land required (ha)">
              <input type="number" value={f.landRequired} onChange={e=>set('landRequired',+e.target.value)} className="input"/>
            </Field>
            <Field label="Affected households">
              <input type="number" value={f.households} onChange={e=>set('households',+e.target.value)} className="input"/>
            </Field>
            <Field label="Budget (₹ Cr)">
              <input type="number" value={f.budget} onChange={e=>set('budget',+e.target.value)} className="input"/>
            </Field>
            <Field label="Planned completion">
              <input type="date" value={f.plannedCompletion} onChange={e=>set('plannedCompletion',e.target.value)} className="input"/>
            </Field>
            <Field label="Nodal department">
              <select value={f.department} onChange={e=>set('department',e.target.value)} className="input">
                {['MoRTH','MoR','MoP','MoJS','DPIIT','MoCA','NHAI','NHSRCL'].map(d=><option key={d}>{d}</option>)}
              </select>
            </Field>
            <Field label="Project owner">
              <select value={f.owner} onChange={e=>set('owner',e.target.value)} className="input">
                {window.BS_DATA.OFFICERS.map(o=><option key={o.id}>{o.name}</option>)}
              </select>
            </Field>
          </div>

          <div className="mt-6 flex items-center justify-between rounded-xl bg-slate-50 border hairline p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-500/10 text-brand-500 flex items-center justify-center"><Icon name="brain-circuit" size={18}/></div>
              <div>
                <div className="text-sm font-medium text-slate-900">Initial AI risk assessment</div>
                <div className="text-xs text-slate-500">Preliminary estimate based on project type, land size and location. Will be refined after Stage 3.</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] uppercase tracking-widest text-slate-500 font-semibold">Predicted</div>
              <div className="text-2xl font-semibold text-amber-600 tabular">~35%</div>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-end gap-2">
            <Button variant="secondary" onClick={()=>nav('/projects')}>Cancel</Button>
            <Button variant="primary" icon="check" onClick={submit}>Create Project</Button>
          </div>
        </Card>

        <div className="mt-4 rounded-xl bg-navy-900 text-slate-700 p-5 text-xs leading-relaxed border border-navy-700">
          <div className="flex items-center gap-2 text-white font-semibold mb-1">
            <Icon name="shield-check" size={14}/>
            Governance disclaimer
          </div>
          AI predictions on this platform are decision-support estimates and do <span className="text-white">not</span> replace statutory approvals or administrative/legal decisions. Every stage advancement requires the designated approver's sign-off.
        </div>
      </div>

      <style>{`.input { width:100%; padding:.55rem .75rem; border-radius:.5rem; background:#f8fafc; border:1px solid #e2e8f0; font-size:.875rem; outline:none; }
      .input:focus { background:#fff; border-color:#B87333; }`}</style>
    </AppLayout>
  );
}

function Field({ label, required, children }){
  return (
    <label className="block">
      <div className="text-xs font-medium text-slate-600 mb-1">{label} {required && <span className="text-red-500">*</span>}</div>
      {children}
    </label>
  );
}

Object.assign(window, { LoginPage, Dashboard, ProjectsList, CreateProject });
