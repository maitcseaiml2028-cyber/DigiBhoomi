/* Tasks · Approvals · Analytics · Reports · Administration · Audit Logs */

// ================= Tasks =================
function TasksPage(){
  useLucide();
  useStore();
  const [drawer, setDrawer] = useState(null);
  const [filter, setFilter] = useState('all');
  const tasks = window.BS_DATA.TASKS;
  const filtered = filter === 'all' ? tasks : tasks.filter(t => t.status === filter);

  const kpis = useMemo(() => ({
    all: tasks.length,
    open: tasks.filter(t => t.status === 'In Progress' || t.status === 'Not Started').length,
    submitted: tasks.filter(t => t.status === 'Submitted').length,
    overdue: 2,
    critical: tasks.filter(t => t.risk === 'critical').length,
  }), [tasks.length]);

  return (
    <AppLayout crumbs={[{label:'Tasks'}]}
      right={<Button variant="dark" size="sm" icon="plus">New Task</Button>}>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
        <StatCard label="Total" value={kpis.all} icon="list-checks"/>
        <StatCard label="Open" value={kpis.open} icon="hourglass" tone="brand"/>
        <StatCard label="Submitted" value={kpis.submitted} icon="upload" tone="medium"/>
        <StatCard label="Overdue" value={kpis.overdue} icon="alarm-clock-off" tone="critical"/>
        <StatCard label="Critical Risk" value={kpis.critical} icon="shield-alert" tone="high"/>
      </div>

      <Card pad={false} className="mb-4">
        <div className="p-3 flex items-center gap-1 border-b hairline">
          {['all','Not Started','In Progress','Submitted','Approved','Rejected','Overdue','Completed'].map(x => (
            <button key={x} onClick={()=>setFilter(x)}
              className={`px-3 py-1.5 text-xs rounded-md font-medium ${filter===x?'bg-navy-900 text-white':'text-slate-600 hover:bg-slate-100'}`}>
              {x==='all'?'All':x}
            </button>
          ))}
          <div className="flex-1"/>
          <Button variant="secondary" size="sm" icon="filter">Filter</Button>
        </div>
        <DataTable
          onRowClick={setDrawer}
          columns={[
            { key:'id', label:'ID', render:r=><span className="font-mono text-xs">{r.id}</span>},
            { key:'title', label:'Task', render:r=>(
              <div>
                <div className="font-medium text-slate-900 text-sm">{r.title}</div>
                <div className="text-[11px] text-slate-500 font-mono">Project · {r.projectId}</div>
              </div>
            )},
            { key:'officer', label:'Assignee', render:r=>(
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-brand-500/10 text-brand-600 flex items-center justify-center text-[10px] font-semibold">{r.officer.split(' ').map(s=>s[0]).join('')}</div>
                <div>
                  <div className="text-sm">{r.officer}</div>
                  <div className="text-[11px] text-slate-500">{r.role}</div>
                </div>
              </div>
            )},
            { key:'progress', label:'Progress', render:r=><div className="w-32"><Progress value={r.progress} tone={r.risk} showLabel/></div>},
            { key:'due', label:'Due', render:r=><span className="tabular text-sm">{r.due}</span>},
            { key:'priority', label:'Priority', render:r=><span className={`text-xs font-semibold ${r.priority==='Critical'?'text-red-600':r.priority==='High'?'text-orange-600':'text-slate-700'}`}>{r.priority}</span>},
            { key:'risk', label:'Risk', render:r=><RiskBadge level={r.risk}/>},
            { key:'status', label:'Status', render:r=><StatusBadge status={r.status}/>},
          ]}
          rows={filtered}
        />
      </Card>

      <TaskDrawer task={drawer} onClose={()=>setDrawer(null)}/>
    </AppLayout>
  );
}

function TaskDrawer({ task, onClose }){
  useLucide();
  const [progress, setProgress] = useState(task?.progress || 0);
  useEffect(() => { if(task) setProgress(task.progress); }, [task]);
  if(!task) return <Drawer open={false}/>;
  const save = () => { taskService.updateProgress(task.id, progress); toastBus.push('Progress updated · risk recalculated','success'); onClose(); };
  const submit = () => { taskService.setStatus(task.id, 'Submitted'); toastBus.push('Submitted for approval','success'); onClose(); };
  const approve = () => { taskService.setStatus(task.id, 'Approved'); toastBus.push('Task approved','success'); onClose(); };
  const reject = () => { taskService.setStatus(task.id, 'Rejected'); toastBus.push('Task sent back to assignee','warn'); onClose(); };

  return (
    <Drawer open={!!task} onClose={onClose}
      title={task.title}
      subtitle={`${task.id} · ${task.projectId} · ${task.role}`}
      width="w-[560px]"
      footer={<>
        <Button variant="ghost" onClick={onClose}>Close</Button>
        {task.status !== 'Approved' && <Button variant="secondary" icon="save" onClick={save}>Save progress</Button>}
        {task.status === 'In Progress' && <Button variant="primary" icon="upload" onClick={submit}>Submit</Button>}
        {task.status === 'Submitted' && <>
          <Button variant="danger" icon="x" onClick={reject}>Reject</Button>
          <Button variant="success" icon="check" onClick={approve}>Approve</Button>
        </>}
      </>}>
      <div className="space-y-4">
        <div className="rounded-xl bg-slate-50 border hairline p-4 text-sm text-slate-700 leading-relaxed">{task.description}</div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <MetricRow label="Assignee" value={task.officer}/>
          <MetricRow label="Role" value={task.role}/>
          <MetricRow label="Due Date" value={task.due}/>
          <MetricRow label="Priority" value={task.priority}/>
          <MetricRow label="Status" value={<StatusBadge status={task.status}/>}/>
          <MetricRow label="Risk" value={<RiskBadge level={task.risk}/>}/>
          <MetricRow label="Approver" value={task.approver}/>
          <MetricRow label="Evidence" value={task.evidence.length ? task.evidence.join(', ') : '—'}/>
        </div>
        <div>
          <div className="flex items-center justify-between">
            <div className="text-xs font-medium text-slate-600">Progress</div>
            <div className="text-sm font-semibold tabular text-brand-600">{progress}%</div>
          </div>
          <input type="range" min={0} max={100} step={5} value={progress} onChange={e=>setProgress(+e.target.value)} className="w-full mt-2 accent-brand-500"/>
          <div className="mt-1"><Progress value={progress} tone={task.risk} size="lg"/></div>
        </div>
        <div>
          <div className="text-xs font-medium text-slate-600 mb-1">Upload evidence</div>
          <div className="rounded-lg border-2 border-dashed border-slate-200 p-6 text-center text-xs text-slate-500 hover:border-brand-500 hover:bg-slate-50 cursor-pointer">
            <Icon name="upload-cloud" size={20} className="text-slate-400 mx-auto mb-1"/>
            Drag & drop or click to upload documents
          </div>
        </div>
        <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800 flex items-start gap-2">
          <Icon name="bell" size={14} className="mt-0.5 shrink-0"/>
          <div>Escalation chain · Reminder D-7 → Warning D-3 → Critical Escalation on due date to <b>Priya Nair</b> → then <b>Rakesh Sharma</b>.</div>
        </div>
      </div>
    </Drawer>
  );
}

// ================= Approvals =================
function ApprovalsPage(){
  useLucide();
  useStore();
  const pending = window.BS_DATA.TASKS.filter(t => t.status === 'Submitted');
  const stageApprovals = window.BS_DATA.PROJECTS.filter(p => p.pendingApprovals > 0).slice(0, 6);

  return (
    <AppLayout crumbs={[{label:'Approvals'}]}>
      <SectionHeader title="Approvals inbox" subtitle="Items awaiting sign-off from you and your delegates"/>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card pad={false}>
          <div className="p-4 border-b hairline flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">Stage approvals</div>
              <div className="text-xs text-slate-500">Move projects to next workflow stage</div>
            </div>
            <span className="text-xs text-slate-500 tabular">{stageApprovals.length} pending</span>
          </div>
          <div className="divide-y hairline">
            {stageApprovals.map(p => (
              <div key={p.id} className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-navy-900 text-white flex items-center justify-center text-xs font-semibold">S{p.currentStage}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-900 truncate">{p.name}</div>
                  <div className="text-[11px] text-slate-500 font-mono">{p.id} · Stage {p.currentStage} submitted</div>
                </div>
                <RiskBadge level={p.riskLevel}/>
                <Button variant="secondary" size="sm" icon="arrow-right" onClick={()=>window.location.hash = '#/projects/'+p.id}>Review</Button>
              </div>
            ))}
          </div>
        </Card>

        <Card pad={false}>
          <div className="p-4 border-b hairline flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">Task approvals</div>
              <div className="text-xs text-slate-500">Officer submissions awaiting your sign-off</div>
            </div>
            <span className="text-xs text-slate-500 tabular">{pending.length} pending</span>
          </div>
          <div className="divide-y hairline">
            {pending.length === 0 && <div className="p-8 text-center text-sm text-slate-400">No pending task approvals</div>}
            {pending.map(t => (
              <div key={t.id} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-brand-500/10 text-brand-600 flex items-center justify-center text-[11px] font-semibold">{t.officer.split(' ').map(s=>s[0]).join('')}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-900">{t.title}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">By {t.officer} · {t.role} · {t.projectId}</div>
                    <div className="mt-2 flex items-center gap-2">
                      <Button variant="danger" size="sm" icon="x" onClick={()=>{taskService.setStatus(t.id,'Rejected'); toastBus.push('Task rejected','warn');}}>Reject</Button>
                      <Button variant="success" size="sm" icon="check" onClick={()=>{taskService.setStatus(t.id,'Approved'); toastBus.push('Task approved','success');}}>Approve</Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}

// ================= Analytics =================
function AnalyticsPage(){
  useLucide();
  useStore();
  const states = analyticsService.stateRisk();
  const stages = analyticsService.stagePerformance();
  const drivers = analyticsService.delayDrivers();
  const projectTypeRisk = window.BS_DATA.PROJECT_TYPES.map(t => {
    const list = window.BS_DATA.PROJECTS.filter(p => p.type === t);
    const risk = list.length ? Math.round(list.reduce((a,p)=>a+p.aiRisk,0)/list.length) : 0;
    return { type:t, risk, count:list.length };
  });

  return (
    <AppLayout crumbs={[{label:'Analytics'}]}>
      <SectionHeader title="Analytics" subtitle="National-scale insight into risk, bottlenecks and outcomes"/>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <SectionHeader title="State-wise risk"/>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={states} margin={{left:-14}}>
                <CartesianGrid vertical={false} stroke="#eef1f5"/>
                <XAxis dataKey="code" fontSize={11} stroke="#94a3b8" tickLine={false} axisLine={false}/>
                <YAxis fontSize={11} stroke="#94a3b8" tickLine={false} axisLine={false} width={30}/>
                <Tooltip contentStyle={{borderRadius:8, border:'1px solid #e2e8f0', fontSize:12}} formatter={(v,name,p)=>[`${v}%`, p.payload.state]}/>
                <Bar dataKey="risk" radius={[6,6,0,0]}>
                  {states.map((s,i)=>{
                    const c = s.risk>=75?'#EF4444':s.risk>=60?'#F97316':s.risk>=45?'#F59E0B':'#10B981';
                    return <Cell key={i} fill={c}/>;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <SectionHeader title="Project-type risk"/>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={projectTypeRisk} margin={{left:-10}}>
                <CartesianGrid vertical={false} stroke="#eef1f5"/>
                <XAxis dataKey="type" fontSize={10} stroke="#94a3b8" tickLine={false} axisLine={false} angle={-15} textAnchor="end" height={50}/>
                <YAxis fontSize={11} stroke="#94a3b8" tickLine={false} axisLine={false} width={30}/>
                <Tooltip contentStyle={{borderRadius:8, border:'1px solid #e2e8f0', fontSize:12}}/>
                <Bar dataKey="risk" radius={[6,6,0,0]} fill="#B87333"/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <SectionHeader title="Stage bottlenecks · duration vs delay"/>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={stages} margin={{left:-10}}>
                <CartesianGrid vertical={false} stroke="#eef1f5"/>
                <XAxis dataKey="label" fontSize={11} stroke="#94a3b8" tickLine={false} axisLine={false}/>
                <YAxis fontSize={11} stroke="#94a3b8" tickLine={false} axisLine={false} width={40}/>
                <Tooltip contentStyle={{borderRadius:8, border:'1px solid #e2e8f0', fontSize:12}}/>
                <Legend wrapperStyle={{fontSize:11}}/>
                <Bar dataKey="avgDays" name="Avg days" fill="#B87333" radius={[6,6,0,0]}/>
                <Bar dataKey="delayed" name="Avg delay" fill="#EF4444" radius={[6,6,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <SectionHeader title="Delay cause distribution"/>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={drivers} dataKey="value" nameKey="name" innerRadius={40} outerRadius={90} paddingAngle={2}>
                  {drivers.map((d,i)=><Cell key={i} fill={d.color}/>)}
                </Pie>
                <Tooltip contentStyle={{borderRadius:8, border:'1px solid #e2e8f0', fontSize:12}}/>
                <Legend wrapperStyle={{fontSize:11}}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <SectionHeader title="Compensation trend"/>
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={window.BS_DATA.COMPENSATION_TREND} margin={{left:-10}}>
                <CartesianGrid vertical={false} stroke="#eef1f5"/>
                <XAxis dataKey="month" fontSize={11} stroke="#94a3b8" tickLine={false} axisLine={false}/>
                <YAxis fontSize={11} stroke="#94a3b8" tickLine={false} axisLine={false} width={30}/>
                <Tooltip contentStyle={{borderRadius:8, border:'1px solid #e2e8f0', fontSize:12}}/>
                <Line type="monotone" dataKey="approved" stroke="#B87333" strokeWidth={2} dot={false}/>
                <Line type="monotone" dataKey="paid" stroke="#10B981" strokeWidth={2} dot={false}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <SectionHeader title="Historical outcomes"/>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={[
                { yr:'2021', ontime:38, delayed:44, cancelled: 8 },
                { yr:'2022', ontime:42, delayed:48, cancelled: 6 },
                { yr:'2023', ontime:51, delayed:44, cancelled: 5 },
                { yr:'2024', ontime:57, delayed:39, cancelled: 4 },
                { yr:'2025', ontime:62, delayed:34, cancelled: 4 },
                { yr:'2026', ontime:68, delayed:29, cancelled: 3 },
              ]} margin={{left:-10}} stackOffset="expand">
                <CartesianGrid vertical={false} stroke="#eef1f5"/>
                <XAxis dataKey="yr" fontSize={11} stroke="#94a3b8" tickLine={false} axisLine={false}/>
                <YAxis fontSize={11} stroke="#94a3b8" tickLine={false} axisLine={false} width={30} tickFormatter={v=>Math.round(v*100)+'%'}/>
                <Tooltip contentStyle={{borderRadius:8, border:'1px solid #e2e8f0', fontSize:12}}/>
                <Legend wrapperStyle={{fontSize:11}}/>
                <Bar dataKey="ontime"    stackId="a" name="On time"  fill="#10B981"/>
                <Bar dataKey="delayed"   stackId="a" name="Delayed"  fill="#F59E0B"/>
                <Bar dataKey="cancelled" stackId="a" name="Cancelled" fill="#EF4444"/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Continuous learning */}
      <Card className="mt-4">
        <SectionHeader title="Continuous learning pipeline"
          subtitle="How DigiBhoomi's model gets smarter with every completed project"/>
        <div className="grid md:grid-cols-6 gap-2">
          {[
            {i:'archive',   l:'Historical projects', s:'42k+ records'},
            {i:'target',    l:'Actual outcomes',      s:'Delay / on-time'},
            {i:'database',  l:'Training dataset',     s:'147 features'},
            {i:'brain-circuit', l:'ML model',         s:'XGBoost v2.4'},
            {i:'wand-2',    l:'New predictions',      s:'Live scoring'},
            {i:'refresh-cw',l:'Model improvement',    s:'Retrain 30d'},
          ].map((n,i,arr)=>(
            <div key={i} className="relative rounded-xl bg-slate-50 border hairline p-3">
              <div className="w-9 h-9 rounded-lg bg-brand-500/10 text-brand-500 flex items-center justify-center"><Icon name={n.i} size={16}/></div>
              <div className="mt-2 text-[11px] uppercase tracking-widest text-slate-500 font-semibold">Step {i+1}</div>
              <div className="text-sm font-semibold">{n.l}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">{n.s}</div>
              {i < arr.length-1 && <Icon name="arrow-right" size={16} className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 text-slate-300 z-10 bg-white rounded-full"/>}
            </div>
          ))}
        </div>
      </Card>
    </AppLayout>
  );
}

// ================= Reports =================
function ReportsPage(){
  useLucide();
  const reports = [
    { id:'RP-001', name:'National land acquisition status', freq:'Weekly', format:'PDF · XLSX', last:'02 Sep 2026', owner:'Ministry' },
    { id:'RP-002', name:'State-wise delay analysis',        freq:'Monthly',format:'PDF',        last:'01 Sep 2026', owner:'State' },
    { id:'RP-003', name:'Compensation disbursement audit',  freq:'Monthly',format:'XLSX',       last:'01 Sep 2026', owner:'Ministry' },
    { id:'RP-004', name:'AI risk trajectory · critical',    freq:'Weekly', format:'PDF',        last:'02 Sep 2026', owner:'Ministry' },
    { id:'RP-005', name:'Approval SLA compliance',          freq:'Fortnightly',format:'XLSX',   last:'30 Aug 2026', owner:'District' },
    { id:'RP-006', name:'R&R rollout dashboard',            freq:'Weekly', format:'PDF',        last:'02 Sep 2026', owner:'R&R Cell' },
  ];
  return (
    <AppLayout crumbs={[{label:'Reports'}]}
      right={<Button variant="dark" size="sm" icon="plus">New Report</Button>}>
      <SectionHeader title="Reports" subtitle="Scheduled + on-demand exports for auditors and executives"/>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {reports.map(r => (
          <Card key={r.id}>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-500/10 text-brand-500 flex items-center justify-center"><Icon name="file-bar-chart" size={18}/></div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-slate-900">{r.name}</div>
                <div className="text-[11px] text-slate-500 font-mono">{r.id}</div>
                <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
                  <div><span className="text-slate-500">Frequency</span><div className="font-medium">{r.freq}</div></div>
                  <div><span className="text-slate-500">Format</span><div className="font-medium">{r.format}</div></div>
                  <div><span className="text-slate-500">Last run</span><div className="font-medium">{r.last}</div></div>
                  <div><span className="text-slate-500">Owner</span><div className="font-medium">{r.owner}</div></div>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Button variant="primary" size="sm" icon="download">Download</Button>
              <Button variant="secondary" size="sm" icon="settings-2">Configure</Button>
            </div>
          </Card>
        ))}
      </div>
    </AppLayout>
  );
}

// ================= Administration =================
function AdminPage(){
  useLucide();
  const [tab, setTab] = useState('users');
  return (
    <AppLayout crumbs={[{label:'Administration'}]}>
      <SectionHeader title="Administration" subtitle="Users, roles, departments and system settings"/>
      <div className="flex items-center gap-1 border-b hairline mb-4">
        {['users','roles','departments','integrations','settings'].map(t => (
          <button key={t} onClick={()=>setTab(t)} className={`px-3.5 py-2.5 text-sm font-medium border-b-2 -mb-px ${tab===t?'border-brand-500 text-brand-600':'border-transparent text-slate-500 hover:text-slate-900'}`}>{t[0].toUpperCase()+t.slice(1)}</button>
        ))}
      </div>
      {tab==='users' && (
        <Card pad={false}>
          <DataTable
            columns={[
              { key:'id', label:'ID', render:r=><span className="font-mono text-xs">{r.id}</span>},
              { key:'name', label:'Name', render:r=>(
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-navy-800 to-brand-500 text-white flex items-center justify-center text-[10px] font-semibold">{r.name.split(' ').map(s=>s[0]).join('')}</div>
                  <div>
                    <div className="text-sm font-medium">{r.name}</div>
                    <div className="text-[11px] text-slate-500">{r.email}</div>
                  </div>
                </div>
              )},
              { key:'role', label:'Role'},
              { key:'dept', label:'Department'},
              { key:'state', label:'State'},
              { key:'status', label:'Status', render:_=><StatusBadge status="Verified"/>},
              { key:'action', label:'', render:_=>(
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" icon="edit-3">Edit</Button>
                  <Button variant="ghost" size="sm" icon="key">Reset</Button>
                </div>
              )},
            ]}
            rows={window.BS_DATA.OFFICERS}
          />
        </Card>
      )}
      {tab==='roles' && (
        <div className="grid md:grid-cols-2 gap-4">
          {['Super Admin','Ministry Administrator','State Administrator','District Administrator','Land Acquisition Officer','Field Officer','Viewer'].map(r=>(
            <Card key={r}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm font-semibold">{r}</div>
                  <div className="text-xs text-slate-500 mt-0.5">Hierarchy-based access control</div>
                </div>
                <Button size="sm" variant="secondary" icon="edit-3">Edit</Button>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {['dashboard.read','projects.write','tasks.assign','approvals.act','audit.read'].map(p=>(
                  <span key={p} className="text-[10px] rounded bg-slate-100 text-slate-700 px-1.5 py-0.5 font-mono">{p}</span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
      {tab==='departments' && (
        <div className="grid md:grid-cols-3 gap-3">
          {['MoRTH','MoR','MoP','MoJS','DPIIT','MoCA','NHAI','NHSRCL','AAI'].map(d=>(
            <Card key={d}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-navy-900 text-white flex items-center justify-center"><Icon name="building-2" size={18}/></div>
                <div>
                  <div className="text-sm font-semibold">{d}</div>
                  <div className="text-xs text-slate-500">{2+Math.floor(Math.random()*40)} active projects</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      {tab==='integrations' && (
        <div className="grid md:grid-cols-2 gap-3">
          {[
            {n:'Bhulekh · State land records',ok:true},
            {n:'DBT Bharat',ok:true},
            {n:'NHAI project registry',ok:true},
            {n:'PM Gati Shakti',ok:true},
            {n:'MoEFCC — Parivesh',ok:false},
            {n:'e-Courts',ok:true},
            {n:'Aadhaar Authentication API',ok:true},
            {n:'ISRO Bhuvan',ok:true},
          ].map(x=>(
            <Card key={x.n}>
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">{x.n}</div>
                <span className={`text-[11px] font-semibold ${x.ok?'text-emerald-600':'text-amber-600'}`}>{x.ok?'● Connected':'● Pending'}</span>
              </div>
            </Card>
          ))}
        </div>
      )}
      {tab==='settings' && (
        <Card>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <SettingRow label="Model retraining cadence" value="Every 30 days"/>
            <SettingRow label="Risk recalculation frequency" value="Hourly for active projects"/>
            <SettingRow label="Escalation SLA" value="D-7 reminder · D-3 warning · D0 escalate"/>
            <SettingRow label="Data retention" value="7 years"/>
            <SettingRow label="Audit log retention" value="Permanent"/>
            <SettingRow label="Two-factor authentication" value="Required for all admins"/>
          </div>
        </Card>
      )}
    </AppLayout>
  );
}

function SettingRow({ label, value }){
  return (
    <div className="rounded-lg border hairline p-3 flex items-center justify-between">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
}

// ================= Audit Logs =================
function AuditLogsPage(){
  useLucide();
  useStore();
  const logs = auditService.list();
  return (
    <AppLayout crumbs={[{label:'Audit Logs'}]}>
      <SectionHeader title="Audit trail" subtitle="Immutable record of every system + human action"/>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <StatCard label="Events (30d)" value={nfmt(23108)} icon="scroll-text" tone="brand"/>
        <StatCard label="System predictions" value={nfmt(4212)} icon="brain-circuit"/>
        <StatCard label="Approvals" value={nfmt(842)} icon="stamp" tone="good"/>
        <StatCard label="Escalations" value={nfmt(96)} icon="alert-triangle" tone="high"/>
      </div>
      <Card pad={false}>
        <DataTable
          columns={[
            { key:'ts', label:'Timestamp', render:r=><span className="font-mono text-xs tabular">{r.ts}</span>},
            { key:'actor', label:'Actor'},
            { key:'action', label:'Action', render:r=><span className="font-medium">{r.action}</span>},
            { key:'target', label:'Target', render:r=><span className="font-mono text-xs">{r.target}</span>},
            { key:'detail', label:'Detail', className:'max-w-md'},
            { key:'id', label:'Event ID', render:r=><span className="font-mono text-xs text-slate-400">{r.id}</span>},
          ]}
          rows={logs}
        />
      </Card>
    </AppLayout>
  );
}

Object.assign(window, {
  TasksPage, ApprovalsPage, AnalyticsPage, ReportsPage, AdminPage, AuditLogsPage,
});
