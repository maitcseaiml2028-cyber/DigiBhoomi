/* Project Detail · Stage Tracker · Households · Documents · Compensation */

const STAGES = [
  { n:1, name:'Project Announced',           icon:'megaphone' },
  { n:2, name:'Department Assigned',         icon:'building-2' },
  { n:3, name:'Land Identified & Selected',  icon:'map-pin' },
  { n:4, name:'Land Acquisition',            icon:'handshake' },
  { n:5, name:'Land Cleared / Possession',   icon:'key-round' },
  { n:6, name:'Construction Started',        icon:'hard-hat' },
  { n:7, name:'Completed',                   icon:'trophy' },
];

// ================ PROJECT DETAIL ================
function ProjectDetail(){
  useLucide();
  useStore();
  const { id } = useParams();
  const nav = useNavigate();
  const p = projectService.getProject(id);
  const [tab, setTab] = useState('overview');
  const [stageDrawer, setStageDrawer] = useState(null);
  if(!p) return <AppLayout crumbs={[{label:'Projects',to:'/projects'},{label:id}]}><Empty icon="folder-x" title="Project not found"/></AppLayout>;

  const risk = predictionService.getRiskPrediction(id);
  const tone = p.riskLevel;

  return (
    <AppLayout crumbs={[{label:'Projects',to:'/projects'},{label:p.name}]} right={
      <div className="flex items-center gap-2">
        <Button variant="secondary" size="sm" icon="download">Report</Button>
        <Button variant="primary" size="sm" icon="brain-circuit" onClick={()=>nav('/ai/risk?project='+p.id)}>AI Risk</Button>
      </div>
    }>
      {/* HERO */}
      <div className="rounded-2xl bg-white ring-1 ring-slate-200/70 shadow-card overflow-hidden">
        <div className="grid lg:grid-cols-[1.4fr_1fr]">
          <div className="p-6">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-semibold ${p.flagship?'bg-gradient-to-br from-brand-500 to-navy-800':'bg-slate-200 text-slate-700'}`}>
                {p.type[0]}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-semibold text-slate-900">{p.name}</h1>
                  {p.flagship && <span className="text-[9px] bg-amber-100 text-amber-800 rounded px-1.5 py-0.5 font-semibold uppercase tracking-widest">Flagship demo</span>}
                </div>
                <div className="text-sm text-slate-500 font-mono">{p.id} · {p.type} · {p.state} → {p.district}</div>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
              <MiniStat label="Land Required" value={`${nfmt(p.landRequired)} ha`}/>
              <MiniStat label="Land Acquired" value={`${nfmt(p.landAcquired)} ha`} sub={`${Math.round(p.landAcquired/p.landRequired*100)}%`}/>
              <MiniStat label="Households" value={nfmt(p.households)}/>
              <MiniStat label="Villages · Parcels" value={`${p.villages} · ${nfmt(p.parcels)}`}/>
              <MiniStat label="Budget" value={`₹${nfmt(p.budget)} Cr`}/>
              <MiniStat label="Started" value={p.startedAt}/>
              <MiniStat label="Planned Completion" value={p.plannedCompletion}/>
              <MiniStat label="Progress" value={`${p.progress}%`}/>
            </div>
            <div className="mt-5 pt-5 border-t hairline grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div><div className="text-[11px] text-slate-500 uppercase tracking-widest">Owner</div><div className="mt-0.5 font-medium">{p.owner}</div></div>
              <div><div className="text-[11px] text-slate-500 uppercase tracking-widest">Current Assignee</div><div className="mt-0.5 font-medium">{p.assignee}</div></div>
              <div><div className="text-[11px] text-slate-500 uppercase tracking-widest">Approver</div><div className="mt-0.5 font-medium">{p.approver}</div></div>
              <div><div className="text-[11px] text-slate-500 uppercase tracking-widest">Department</div><div className="mt-0.5 font-medium">{p.department}</div></div>
            </div>
          </div>

          {/* Risk card */}
          <div className={`p-6 relative overflow-hidden ${tone==='critical'?'bg-gradient-to-br from-red-50 to-red-100/50':tone==='high'?'bg-gradient-to-br from-orange-50 to-orange-100/50':'bg-gradient-to-br from-amber-50 to-amber-100/50'}`}>
            <div className="text-[11px] tracking-widest font-semibold text-slate-600">AI DELAY PROBABILITY</div>
            <div className="mt-1 flex items-baseline gap-3">
              <div className={`text-[64px] font-bold leading-none tabular ${tone==='critical'?'text-red-600':tone==='high'?'text-orange-600':'text-amber-600'}`}>{p.aiRisk}<span className="text-3xl">%</span></div>
              <RiskBadge level={tone} size="lg"/>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-white/70 backdrop-blur ring-1 ring-white/40 p-3">
                <div className="text-[10px] text-slate-500 uppercase tracking-widest">Expected Delay</div>
                <div className="mt-1 text-xl font-semibold tabular text-slate-900">{p.expectedDelay} <span className="text-sm text-slate-500">days</span></div>
              </div>
              <div className="rounded-xl bg-white/70 backdrop-blur ring-1 ring-white/40 p-3">
                <div className="text-[10px] text-slate-500 uppercase tracking-widest">Confidence</div>
                <div className="mt-1 text-xl font-semibold tabular text-slate-900">{p.confidence}%</div>
              </div>
            </div>
            <div className="mt-3 text-[11px] text-slate-600 flex items-center gap-1.5">
              <Icon name="cpu" size={12}/> {risk.model} · updated 09:12 IST
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm" variant="dark" icon="sparkles" onClick={()=>nav('/ai/explainable?project='+p.id)}>Explain risk</Button>
              <Button size="sm" variant="secondary" icon="lightbulb" onClick={()=>nav('/ai/recommendations?project='+p.id)}>Recommendations</Button>
            </div>
          </div>
        </div>

        {/* Stage tracker */}
        <div className="border-t hairline p-6 bg-slate-50/40">
          <SectionHeader title="Project journey · 7 stages" subtitle="A stage cannot proceed until the previous one is completed AND approved"
            right={<div className="text-xs text-slate-500 flex items-center gap-4">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"/> Approved</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-brand-500"/> Current</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-300"/> Locked</span>
            </div>}/>
          <StageTracker project={p} onStageClick={setStageDrawer}/>
        </div>
      </div>

      {/* TABS */}
      <div className="mt-5 flex items-center gap-1 border-b hairline">
        {[
          {v:'overview',label:'Overview',icon:'layout-panel-left'},
          {v:'tracker', label:'Stage Tracker',icon:'git-branch'},
          {v:'households',label:'Households',icon:'users'},
          {v:'documents', label:'Documents',icon:'file-check-2'},
          {v:'compensation', label:'Compensation',icon:'wallet'},
          {v:'legal', label:'Legal',icon:'gavel'},
          {v:'timeline', label:'Timeline',icon:'clock'},
        ].map(t=>(
          <button key={t.v} onClick={()=>setTab(t.v)}
            className={`px-3.5 py-2.5 text-sm font-medium flex items-center gap-2 border-b-2 -mb-px transition-colors ${tab===t.v?'border-brand-500 text-brand-600':'border-transparent text-slate-500 hover:text-slate-900'}`}>
            <Icon name={t.icon} size={14}/> {t.label}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {tab==='overview'    && <ProjectOverview project={p}/>}
        {tab==='tracker'     && <StageTrackerDetail project={p} onOpen={setStageDrawer}/>}
        {tab==='households'  && <HouseholdsView projectId={p.id}/>}
        {tab==='documents'   && <DocumentsView projectId={p.id}/>}
        {tab==='compensation'&& <CompensationView projectId={p.id}/>}
        {tab==='legal'       && <LegalView projectId={p.id}/>}
        {tab==='timeline'    && <TimelineView projectId={p.id}/>}
      </div>

      <StageDrawer project={p} stage={stageDrawer} onClose={()=>setStageDrawer(null)}/>
    </AppLayout>
  );
}

function MiniStat({ label, value, sub }){
  return (
    <div>
      <div className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">{label}</div>
      <div className="mt-1 text-lg font-semibold tabular text-slate-900">{value}</div>
      {sub && <div className="text-[11px] text-slate-500">{sub}</div>}
    </div>
  );
}

// -------- Stage Tracker (horizontal) --------
function StageTracker({ project, onStageClick }){
  const cur = project.currentStage;
  const history = project.stageHistory;
  return (
    <div className="relative">
      <div className="absolute top-6 left-6 right-6 h-0.5 bg-slate-200"/>
      <div className="absolute top-6 left-6 h-0.5 bg-emerald-500" style={{ width: `calc(${(Math.max(0,cur-1))/6*100}% - 3rem)`}}/>
      <div className="relative grid grid-cols-7 gap-2">
        {STAGES.map(s => {
          const isDone = s.n < cur;
          const isCur = s.n === cur;
          const isLocked = s.n > cur;
          const h = history?.find(x => x.stage === s.n);
          return (
            <button key={s.n} onClick={()=>onStageClick(s.n)}
              className="group flex flex-col items-center text-center px-1">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center relative ring-4 ring-slate-50 z-10 transition-transform group-hover:scale-105 ${
                isDone ? 'bg-emerald-500 text-white' :
                isCur ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/40 pulse-ring-blue' :
                'bg-white ring-slate-200 text-slate-400 border border-slate-200'
              }`}>
                {isLocked ? <Icon name="lock" size={16}/> : isDone ? <Icon name="check" size={18}/> : <Icon name={s.icon} size={18}/>}
              </div>
              <div className={`mt-2 text-[10px] font-semibold uppercase tracking-widest ${isCur?'text-brand-600':isDone?'text-emerald-600':'text-slate-400'}`}>Stage {s.n}</div>
              <div className={`mt-0.5 text-xs font-medium leading-tight ${isCur?'text-slate-900':isDone?'text-slate-700':'text-slate-500'}`}>{s.name}</div>
              {isCur && <div className="mt-1 text-[10px] text-brand-600 font-mono">{h?.progress || project.progress}% · in progress</div>}
              {isDone && h?.completedAt && <div className="mt-1 text-[10px] text-slate-400 font-mono">{h.completedAt}</div>}
              {isLocked && <div className="mt-1 text-[10px] text-slate-400">Locked</div>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// -------- Stage Tracker (detailed panel) --------
function StageTrackerDetail({ project, onOpen }){
  const cur = project.currentStage;
  const history = project.stageHistory || STAGES.map(s => ({
    stage:s.n, name:s.name,
    status: s.n < cur ? 'approved' : s.n === cur ? 'in_progress' : 'locked',
    progress: s.n === cur ? project.progress : 0,
    completedAt: s.n < cur ? '—' : null,
  }));
  return (
    <div className="space-y-3">
      {STAGES.map(s => {
        const h = history.find(x => x.stage === s.n) || {};
        const isDone = h.status === 'approved';
        const isCur = h.status === 'in_progress';
        const isLocked = h.status === 'locked';
        return (
          <Card key={s.n} className="!p-0">
            <div className="flex items-start gap-4 p-5">
              <div className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center ${isDone?'bg-emerald-500 text-white':isCur?'bg-brand-500 text-white':'bg-slate-100 text-slate-400'}`}>
                {isLocked ? <Icon name="lock" size={20}/> : isDone ? <Icon name="check" size={22}/> : <Icon name={s.icon} size={22}/>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[10px] tracking-widest text-slate-500 font-semibold">STAGE {s.n} · {isDone?'APPROVED':isCur?'IN PROGRESS':'LOCKED'}</div>
                    <div className="text-base font-semibold text-slate-900 mt-0.5">{s.name}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isDone && <StatusBadge status="Approved"/>}
                    {isCur && <StatusBadge status="In Progress"/>}
                    {isLocked && <StatusBadge status="Not Started"/>}
                    <Button variant="secondary" size="sm" icon="external-link" onClick={()=>onOpen(s.n)}>Open</Button>
                  </div>
                </div>
                {isCur && s.n === 4 && (
                  <div className="mt-4">
                    <Progress value={project.progress} tone="brand" size="lg" showLabel/>
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <SubStat label="Acquired" value={`${project.landAcquired}/${project.landRequired} ha`}/>
                      <SubStat label="Docs Verified" value={`${nfmt(project.documentsVerified)}/${nfmt(project.households)}`}/>
                      <SubStat label="Comp Approved" value={`${nfmt(project.compensationApproved)}/${nfmt(project.households)}`}/>
                      <SubStat label="Comp Paid" value={`${nfmt(project.compensationPaid)}/${nfmt(project.households)}`}/>
                      <SubStat label="Legal Disputes" value={project.legalDisputes} tone="danger"/>
                      <SubStat label="R&R Progress" value={`${project.rrProgress}%`}/>
                      <SubStat label="Pending Approvals" value={project.pendingApprovals}/>
                      <SubStat label="AI Risk" value={`${project.aiRisk}%`} tone="danger"/>
                    </div>
                  </div>
                )}
                {isCur && s.n !== 4 && <div className="mt-3"><Progress value={h.progress||10} tone="brand" showLabel/></div>}
                {isDone && (
                  <div className="mt-3 text-xs text-slate-500 flex flex-wrap items-center gap-x-5 gap-y-1">
                    <div>Completed <span className="text-slate-900 font-medium">{h.completedAt}</span></div>
                    <div>Approver <span className="text-slate-900 font-medium">{h.approver||project.approver}</span></div>
                  </div>
                )}
                {isLocked && (
                  <div className="mt-3 rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800 flex items-start gap-2">
                    <Icon name="lock" size={14} className="mt-0.5 shrink-0"/>
                    <div>
                      <b>Cannot start until Stage {cur} is complete.</b> Stage {s.n} requires possession certificate, verified khasra records and cleared compensation for at least 90% of parcels in the previous stage.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function SubStat({ label, value, tone }){
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">{label}</div>
      <div className={`mt-0.5 text-base font-semibold tabular ${tone==='danger'?'text-red-600':'text-slate-900'}`}>{value}</div>
    </div>
  );
}

// -------- Stage Drawer (approve/reject) --------
function StageDrawer({ project, stage, onClose }){
  useLucide();
  const [reason, setReason] = useState('');
  if(!stage) return <Drawer open={false}/>;
  const s = STAGES.find(x => x.n === stage);
  const isCur = stage === project.currentStage;
  const isDone = stage < project.currentStage;
  const isLocked = stage > project.currentStage;

  const approve = () => {
    projectService.approveStage(project.id, stage);
    toastBus.push(`Stage ${stage} approved · Stage ${stage+1} unlocked`, 'success');
    onClose();
  };
  const reject = () => {
    projectService.rejectStage(project.id, stage, reason);
    toastBus.push(`Stage ${stage} rejected · sent back for revision`, 'warn');
    onClose();
  };
  const submit = () => {
    projectService.submitStage(project.id, stage);
    toastBus.push(`Stage ${stage} submitted for approval`,'success');
  };

  return (
    <Drawer open={!!stage} onClose={onClose}
      title={`Stage ${stage} · ${s.name}`}
      subtitle={project.name + ' · ' + project.id}
      footer={
        isCur ? (
          <>
            <Button variant="ghost" onClick={onClose}>Close</Button>
            <Button variant="secondary" icon="upload" onClick={submit}>Submit for approval</Button>
            <Button variant="danger" icon="x" onClick={reject}>Reject</Button>
            <Button variant="success" icon="check" onClick={approve}>Approve & Unlock Next</Button>
          </>
        ) : <Button variant="secondary" onClick={onClose}>Close</Button>
      }>
      <div className="space-y-4">
        <div className={`rounded-xl p-4 ${isDone?'bg-emerald-50 text-emerald-700':isCur?'bg-brand-500/10 text-brand-700':'bg-slate-100 text-slate-600'}`}>
          <div className="text-xs uppercase tracking-widest font-semibold">{isDone?'Approved':isCur?'In Progress · Awaiting evidence':'Locked'}</div>
          <div className="mt-1 text-sm">
            {isDone && 'This stage has been signed off and cannot be re-opened without escalation.'}
            {isCur && 'The current stage. Officer must submit evidence and the approver must sign off before the next stage can begin.'}
            {isLocked && `This stage cannot begin until Stage ${stage-1} is fully approved.`}
          </div>
        </div>

        {isCur && stage === 4 && (
          <div className="rounded-xl border hairline">
            <div className="p-4 border-b hairline">
              <div className="text-sm font-semibold text-slate-900">Stage 4 evidence · Land Acquisition</div>
              <div className="text-xs text-slate-500 mt-0.5">All fields below must be at ≥90% before submission.</div>
            </div>
            <div className="p-4 grid grid-cols-2 gap-3 text-sm">
              <EvidenceRow label="Ownership verified" cur={project.documentsVerified} total={project.households}/>
              <EvidenceRow label="Compensation approved" cur={project.compensationApproved} total={project.households}/>
              <EvidenceRow label="Compensation paid" cur={project.compensationPaid} total={project.households}/>
              <EvidenceRow label="Legal disputes resolved" cur={project.households - project.legalDisputes} total={project.households}/>
              <EvidenceRow label="R&R rolled out" cur={Math.round(project.households*project.rrProgress/100)} total={project.households}/>
              <EvidenceRow label="Parcels demarcated" cur={Math.round(project.parcels * 0.86)} total={project.parcels}/>
            </div>
          </div>
        )}

        {isCur && (
          <div>
            <div className="text-xs font-medium text-slate-600 mb-1">Reject reason (if applicable)</div>
            <textarea value={reason} onChange={e=>setReason(e.target.value)} rows={3} placeholder="Missing evidence · compensation shortfall · procedural gap"
              className="w-full rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-500 px-3 py-2 text-sm outline-none"/>
          </div>
        )}

        <div className="rounded-xl bg-navy-900 text-slate-200 p-4 text-xs leading-relaxed">
          <div className="flex items-center gap-2 text-white font-semibold mb-1"><Icon name="shield-alert" size={14}/> AI does not approve legal/statutory stages</div>
          AI predicts risk and recommends interventions, but approval remains with the designated administrative authority.
        </div>
      </div>
    </Drawer>
  );
}

function EvidenceRow({ label, cur, total }){
  const pct = Math.round(cur/total*100);
  const tone = pct >= 90 ? 'good' : pct >= 60 ? 'warn' : 'critical';
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="text-xs text-slate-600">{label}</div>
        <div className="text-xs tabular text-slate-900 font-medium">{nfmt(cur)}/{nfmt(total)} · <span className={`${tone==='good'?'text-emerald-600':tone==='warn'?'text-amber-600':'text-red-600'} font-semibold`}>{pct}%</span></div>
      </div>
      <div className="mt-1"><Progress value={pct} tone={tone==='good'?'good':tone==='warn'?'warn':'critical'} size="sm"/></div>
    </div>
  );
}

// -------- Project Overview tab --------
function ProjectOverview({ project }){
  const risk = predictionService.getRiskPrediction(project.id);
  const tasks = taskService.list({ projectId: project.id });
  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <Card className="lg:col-span-2">
        <SectionHeader title="Delay drivers · why the AI predicts risk" subtitle={`Model ${risk.model.split(' · ')[0]} · confidence ${risk.confidence}%`}/>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="h-52">
            <ResponsiveContainer>
              <BarChart data={risk.drivers} layout="vertical" margin={{left:0,right:20}}>
                <CartesianGrid horizontal={false} stroke="#eef1f5"/>
                <XAxis type="number" hide/>
                <YAxis type="category" dataKey="name" fontSize={11} stroke="#475569" tickLine={false} axisLine={false} width={130}/>
                <Tooltip contentStyle={{borderRadius:8, border:'1px solid #e2e8f0', fontSize:12}} formatter={v=>[v+'%','Contribution']}/>
                <Bar dataKey="value" radius={[0,6,6,0]}>
                  {risk.drivers.map((d,i)=><Cell key={i} fill={d.color}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-sm space-y-2.5">
            {risk.drivers.map(d => (
              <div key={d.name} className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full mt-1.5" style={{background:d.color}}/>
                <div>
                  <div className="font-medium">{d.name} · <span className="tabular text-slate-500">{d.value}%</span></div>
                  <div className="text-xs text-slate-500 leading-snug">
                    {d.name==='Compensation Backlog' && 'Approved but unpaid cases in DBT queue.'}
                    {d.name==='Legal Disputes' && '137 unresolved disputes pending in court.'}
                    {d.name==='R&R' && 'Rehabilitation package rollout below plan in 2 villages.'}
                    {d.name==='Pending Approvals' && 'Signoffs pending with State + Central approvers.'}
                    {d.name==='Documentation' && 'Missing khasra / bank KYC for 440 households.'}
                    {d.name==='Other' && 'Weather, right-of-way, contractor readiness.'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <SectionHeader title="Open tasks" subtitle={`${tasks.length} active on this project`}/>
        <div className="space-y-3">
          {tasks.slice(0,5).map(t => (
            <div key={t.id} className="rounded-lg border hairline p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="text-sm font-medium text-slate-900 leading-snug">{t.title}</div>
                <RiskBadge level={t.risk}/>
              </div>
              <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500">
                <Icon name="user" size={11}/> {t.officer} · <Icon name="calendar" size={11}/> due {t.due}
              </div>
              <div className="mt-2"><Progress value={t.progress} tone={t.risk} size="sm" showLabel/></div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="lg:col-span-3">
        <SectionHeader title="Accountability chain" subtitle="Who is responsible for this project's outcomes"/>
        <div className="grid md:grid-cols-6 gap-2">
          {[
            { role:'Ministry',  name:'MoCA',              icon:'landmark' },
            { role:'State',     name:project.state,       icon:'flag' },
            { role:'District',  name:project.district,    icon:'map-pin' },
            { role:'Department',name:project.department,  icon:'building-2' },
            { role:'Owner',     name:project.owner,       icon:'user' },
            { role:'Assignee',  name:project.assignee,    icon:'user-cog' },
          ].map((n,i)=>(
            <div key={i} className="rounded-lg border hairline p-3 flex flex-col items-start gap-2">
              <div className="w-8 h-8 rounded-lg bg-navy-900 text-white flex items-center justify-center"><Icon name={n.icon} size={14}/></div>
              <div>
                <div className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">{n.role}</div>
                <div className="text-sm font-medium text-slate-900">{n.name}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// -------- Households tab (also usable as page) --------
function HouseholdsView({ projectId, embedded=true }){
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);
  const size = 15;
  useStore();
  useLucide();
  let list = window.BS_DATA.HOUSEHOLDS;
  if(q) list = list.filter(h => h.id.toLowerCase().includes(q.toLowerCase()) || h.owner.toLowerCase().includes(q.toLowerCase()) || h.village.toLowerCase().includes(q.toLowerCase()));
  if(status) list = list.filter(h => h.verification === status);
  const total = list.length;
  const paged = list.slice((page-1)*size, page*size);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <div className="relative">
          <Icon name="search" size={14} className="absolute left-3 top-2.5 text-slate-400"/>
          <input value={q} onChange={e=>{setQ(e.target.value); setPage(1);}} placeholder="Search owner, village, ID…"
            className="w-72 pl-8 pr-3 py-1.5 rounded-lg bg-white border border-slate-200 focus:border-brand-500 text-sm outline-none"/>
        </div>
        <select value={status} onChange={e=>setStatus(e.target.value)} className="text-sm rounded-lg border border-slate-200 bg-white px-3 py-1.5">
          <option value="">All verification statuses</option>
          <option>Verified</option><option>Pending</option><option>Rejected</option>
        </select>
        <div className="flex-1"/>
        <div className="text-xs text-slate-500 tabular">{nfmt(total)} households · page {page} of {Math.ceil(total/size)}</div>
        <Button variant="secondary" size="sm" icon="download">Export CSV</Button>
      </div>

      <Card pad={false}>
        <DataTable
          dense
          onRowClick={setSelected}
          columns={[
            { key:'id', label:'ID', render:r=><span className="font-mono text-xs text-slate-600">{r.id}</span> },
            { key:'village', label:'Village' },
            { key:'owner', label:'Owner' },
            { key:'landArea', label:'Land (ha)', render:r=><span className="tabular">{r.landArea}</span> },
            { key:'documents', label:'Documents', render:r=>{
              const v = r.documents.filter(d=>d.status==='Verified').length;
              return <span className="text-xs tabular">{v}/{r.documents.length} verified</span>;
            }},
            { key:'verification', label:'Verification', render:r=><StatusBadge status={r.verification}/> },
            { key:'comp', label:'Compensation', render:r=><StatusBadge status={r.compensation.status}/> },
            { key:'legalStatus', label:'Legal', render:r=><StatusBadge status={r.legalStatus}/> },
            { key:'aiRisk', label:'AI Risk', render:r=><RiskBadge level={r.aiRisk}/> },
          ]}
          rows={paged}
        />
        <div className="p-3 border-t hairline flex items-center justify-between text-xs">
          <div className="text-slate-500">Showing {(page-1)*size+1}–{Math.min(page*size,total)} of {nfmt(total)}</div>
          <div className="flex items-center gap-1">
            <button onClick={()=>setPage(Math.max(1,page-1))} className="px-2.5 py-1.5 rounded-md hover:bg-slate-100"><Icon name="chevron-left" size={14}/></button>
            <div className="px-2 tabular">{page}</div>
            <button onClick={()=>setPage(Math.min(Math.ceil(total/size),page+1))} className="px-2.5 py-1.5 rounded-md hover:bg-slate-100"><Icon name="chevron-right" size={14}/></button>
          </div>
        </div>
      </Card>

      <HouseholdDrawer h={selected} onClose={()=>setSelected(null)}/>
    </div>
  );
}

function HouseholdDrawer({ h, onClose }){
  useLucide();
  if(!h) return <Drawer open={false}/>;
  return (
    <Drawer open={!!h} onClose={onClose}
      title={`Household ${h.id}`}
      subtitle={`${h.owner} · ${h.village} · Parcel ${h.parcelId}`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Close</Button>
          <Button variant="secondary" icon="map">View on Map</Button>
          <Button variant="primary" icon="wallet">Process Compensation</Button>
        </>
      }>
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <MiniStat label="Land Area" value={h.landArea+' ha'}/>
          <MiniStat label="Compensation" value={inr(h.compensation.total)}/>
          <MiniStat label="AI Risk" value={<RiskBadge level={h.aiRisk}/>}/>
        </div>
        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Documents</div>
          <div className="rounded-xl border hairline overflow-hidden">
            {h.documents.map((d,i)=>(
              <div key={i} className={`flex items-center justify-between px-4 py-2.5 text-sm ${i>0?'border-t hairline':''}`}>
                <div className="flex items-center gap-2.5">
                  <Icon name={d.status==='Verified'?'file-check-2':d.status==='Missing'?'file-x':'file-clock'} size={16} className={d.status==='Verified'?'text-emerald-500':d.status==='Missing'?'text-slate-400':'text-amber-500'}/>
                  <div>{d.type}</div>
                </div>
                <StatusBadge status={d.status}/>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Compensation ledger</div>
          <div className="rounded-xl border hairline p-4 text-sm space-y-2">
            <div className="flex justify-between"><span className="text-slate-600">Total Award</span><span className="tabular font-medium">{inr(h.compensation.total)}</span></div>
            <div className="flex justify-between"><span className="text-slate-600">Approved</span><span className="tabular font-medium">{inr(h.compensation.approved)}</span></div>
            <div className="flex justify-between"><span className="text-slate-600">Paid</span><span className="tabular font-medium">{inr(h.compensation.paid)}</span></div>
            <div className="flex justify-between"><span className="text-slate-600">Status</span><StatusBadge status={h.compensation.status}/></div>
          </div>
        </div>
        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Legal Status</div>
          <div className="rounded-xl border hairline p-4 text-sm flex items-center justify-between">
            <div>{h.legalStatus === 'Under Dispute' ? 'Pending in fast-track court · Case #C-04521' : 'No open legal action'}</div>
            <StatusBadge status={h.legalStatus}/>
          </div>
        </div>
      </div>
    </Drawer>
  );
}

// -------- Documents tab --------
function DocumentUploadForm({ projectId, onUploaded }){
  const [type, setType] = useState('Supporting Document');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);

  const submit = async () => {
    if(!file){ toastBus.push('Please choose a file to upload', 'error'); return; }
    setBusy(true);
    try {
      await uploadDocument({ type, description, projectId, file });
      toastBus.push('Document uploaded — pending verification', 'success');
      setDescription(''); setFile(null);
      setOpen(false);
      onUploaded && onUploaded();
    } catch (e) {
      toastBus.push(e.message || 'Upload failed', 'error');
    } finally { setBusy(false); }
  };

  if(!open){
    return <Button variant="primary" size="sm" icon="upload" onClick={()=>setOpen(true)}>Upload Document</Button>;
  }
  return (
    <Card className="mb-4">
      <SectionHeader title="Upload a document" subtitle="PDF, JPG, PNG, WEBP or DOC/DOCX, up to 15 MB. Adds a pending record for verification."/>
      <div className="mt-3 grid sm:grid-cols-2 gap-3">
        <label className="block">
          <div className="text-xs text-slate-500 mb-1">Document type</div>
          <select value={type} onChange={e=>setType(e.target.value)} className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:border-brand-500 focus:bg-white outline-none text-sm">
            {['Title Deed','Khasra / Land Record','Aadhaar / ID Proof','Bank KYC','Encumbrance Certificate','Site Photo','Survey Report','Supporting Document'].map(t=><option key={t}>{t}</option>)}
          </select>
        </label>
        <label className="block">
          <div className="text-xs text-slate-500 mb-1">Description</div>
          <input value={description} onChange={e=>setDescription(e.target.value)} placeholder="e.g. Updated khasra copy for parcel DLP-00043" className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:border-brand-500 focus:bg-white outline-none text-sm"/>
        </label>
      </div>
      <label className="block mt-3">
        <div className="text-xs text-slate-500 mb-1">File</div>
        <div className="flex items-center gap-3">
          <input type="file" accept=".pdf,.jpg,.jpeg,.png,.webp,.heic,.doc,.docx"
            onChange={e=>setFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
            className="text-sm file:mr-3 file:py-2 file:px-3.5 file:rounded-lg file:border-0 file:bg-brand-500 file:text-white file:text-sm file:font-medium hover:file:bg-brand-600 file:cursor-pointer cursor-pointer"/>
        </div>
        {file && <div className="mt-1.5 text-xs text-slate-500 flex items-center gap-1.5"><Icon name="paperclip" size={12}/> {file.name} · {(file.size/1024).toFixed(0)} KB</div>}
      </label>
      <div className="mt-3 flex gap-2">
        <Button variant="primary" size="sm" disabled={busy} onClick={submit}>{busy ? 'Uploading…' : 'Submit document'}</Button>
        <Button variant="ghost" size="sm" onClick={()=>{setOpen(false); setFile(null);}}>Cancel</Button>
      </div>
    </Card>
  );
}

function MyUploadsPanel({ projectId }){
  const [docs, setDocs] = useState(null);
  const load = () => fetchDocuments(projectId).then(setDocs).catch(()=>setDocs([]));
  React.useEffect(() => { load(); }, [projectId]);

  const user = (window.BS_STATE && window.BS_STATE.user) || {};
  const type = window.getRoleType ? window.getRoleType(user.role) : null;
  const canUpload = type === window.ROLE_TYPES.LANDOWNER || type === window.ROLE_TYPES.FIELD || type === window.ROLE_TYPES.PROJECT;
  const isLandowner = type === window.ROLE_TYPES.LANDOWNER;

  if(!canUpload) return null;

  return (
    <Card className="mb-4" pad={false}>
      <div className="p-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{isLandowner ? 'My uploaded documents' : 'Project documents'}</h2>
          <p className="text-sm text-slate-500 mt-0.5">{isLandowner ? "Documents you've submitted for this project, and their verification status." : 'Documents uploaded for this project by you and your team, pending verification.'}</p>
        </div>
        <DocumentUploadForm projectId={projectId} onUploaded={load}/>
      </div>
      {docs === null ? (
        <div className="px-5 pb-5 text-sm text-slate-400">Loading…</div>
      ) : docs.length === 0 ? (
        <div className="px-5 pb-5 text-sm text-slate-400">No documents uploaded yet.</div>
      ) : (
        <DataTable dense
          columns={[
            { key:'id', label:'ID', render:r=><span className="font-mono text-xs">{r.id}</span>},
            { key:'type', label:'Type'},
            { key:'description', label:'Description'},
            { key:'fileName', label:'File', render:r=>r.fileName ? (
              <button onClick={()=>openDocumentFile(r.id).catch(e=>toastBus.push(e.message,'error'))}
                className="text-brand-600 hover:underline text-xs flex items-center gap-1">
                <Icon name="paperclip" size={12}/> {r.fileName}
              </button>
            ) : <span className="text-xs text-slate-300">—</span>},
            { key:'uploadedAt', label:'Uploaded'},
            { key:'status', label:'Status', render:r=><StatusBadge status={r.status}/>},
          ]}
          rows={docs}
        />
      )}
    </Card>
  );
}

function DocumentsView({ projectId }){
  const list = window.BS_DATA.HOUSEHOLDS.slice(0,80).flatMap(h => h.documents.map(d => ({...d, hh:h.id, owner:h.owner, village:h.village })));
  const counts = list.reduce((a,d)=>{ a[d.status]=(a[d.status]||0)+1; return a; }, {});
  return (
    <div>
      <MyUploadsPanel projectId={projectId}/>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <StatCard label="Verified" value={nfmt(counts.Verified||0)} icon="check-circle-2" tone="good"/>
        <StatCard label="Pending" value={nfmt(counts.Pending||0)} icon="clock" tone="medium"/>
        <StatCard label="Rejected" value={nfmt(counts.Rejected||0)} icon="x-circle" tone="critical"/>
        <StatCard label="Missing" value={nfmt(counts.Missing||0)} icon="file-x" tone="high"/>
      </div>
      <Card pad={false}>
        <DataTable dense
          columns={[
            { key:'hh', label:'Household', render:r=><span className="font-mono text-xs">{r.hh}</span>},
            { key:'owner', label:'Owner'},
            { key:'village', label:'Village'},
            { key:'type', label:'Document type'},
            { key:'status', label:'Status', render:r=><StatusBadge status={r.status}/>},
            { key:'action', label:'', render:_=><Button variant="ghost" size="sm" icon="eye">View</Button>},
          ]}
          rows={list.slice(0,80)}
        />
      </Card>
    </div>
  );
}

// -------- Compensation tab --------
function CompensationView({ projectId }){
  const s = window.BS_DATA.COMP_SUMMARY;
  const rows = window.BS_DATA.HOUSEHOLDS.slice(0,50);
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
        <StatCard label="Total Cases" value={nfmt(s.total)} icon="users"/>
        <StatCard label="Approved" value={nfmt(s.approved)} icon="check-circle-2" tone="good"/>
        <StatCard label="Paid" value={nfmt(s.paid)} icon="wallet" tone="brand"/>
        <StatCard label="Pending" value={nfmt(s.pending)} icon="clock" tone="medium"/>
        <StatCard label="Total Amount" value={inr(s.totalAmount)} icon="banknote" tone="default"/>
      </div>
      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        <Card className="lg:col-span-2">
          <SectionHeader title="Disbursement trend"/>
          <div className="h-56">
            <ResponsiveContainer>
              <LineChart data={window.BS_DATA.COMPENSATION_TREND} margin={{left:-14,right:6,top:6,bottom:0}}>
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
          <SectionHeader title="Bottlenecks"/>
          <ul className="text-sm space-y-2.5">
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-red-500 mt-1.5"/>430 approved cases unpaid ({'>'} 30 days)</li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-orange-500 mt-1.5"/>96 rejected due to bank KYC gaps</li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5"/>212 cases awaiting district approval</li>
            <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-slate-400 mt-1.5"/>4 verified for DBT rollout next batch</li>
          </ul>
        </Card>
      </div>
      <Card pad={false}>
        <DataTable dense
          columns={[
            { key:'id', label:'Household', render:r=><span className="font-mono text-xs">{r.id}</span>},
            { key:'owner', label:'Owner'},
            { key:'village', label:'Village'},
            { key:'total', label:'Total', render:r=><span className="tabular">{inr(r.compensation.total)}</span>},
            { key:'approved', label:'Approved', render:r=><span className="tabular">{inr(r.compensation.approved)}</span>},
            { key:'paid', label:'Paid', render:r=><span className="tabular">{inr(r.compensation.paid)}</span>},
            { key:'status', label:'Status', render:r=><StatusBadge status={r.compensation.status}/>},
          ]}
          rows={rows}
        />
      </Card>
    </div>
  );
}

// -------- Legal tab --------
function LegalView({ projectId }){
  const cases = window.BS_DATA.HOUSEHOLDS.filter(h => h.legalStatus === 'Under Dispute').slice(0, 30);
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <StatCard label="Open Disputes" value="137" icon="gavel" tone="critical"/>
        <StatCard label="In Fast-Track Court" value="48" icon="scale" tone="high"/>
        <StatCard label="In Mediation" value="61" icon="handshake" tone="medium"/>
        <StatCard label="Resolved (30d)" value="22" icon="check-circle-2" tone="good"/>
      </div>
      <Card pad={false}>
        <DataTable dense
          columns={[
            { key:'case', label:'Case #', render:(r,i)=><span className="font-mono text-xs">C-{4500+cases.indexOf(r)}</span>},
            { key:'owner', label:'Petitioner'},
            { key:'village', label:'Village'},
            { key:'landArea', label:'Land (ha)', render:r=><span className="tabular">{r.landArea}</span>},
            { key:'nature', label:'Nature', render:_=><span className="text-xs">Compensation quantum</span>},
            { key:'stage', label:'Stage', render:_=><StatusBadge status="Under Dispute"/>},
            { key:'next', label:'Next Hearing', render:_=><span className="tabular text-xs">18 Nov 2026</span>},
          ]}
          rows={cases}
        />
      </Card>
    </div>
  );
}

// -------- Timeline tab --------
function TimelineView({ projectId }){
  useLucide();
  const events = window.BS_DATA.AUDIT.filter(a => a.target.includes(projectId) || projectId === 'AIR-001').slice(0,20);
  return (
    <Card>
      <SectionHeader title="Activity timeline" subtitle="All system + human actions on this project"/>
      <div className="relative pl-6">
        <div className="absolute left-2 top-1 bottom-1 w-px bg-slate-200"/>
        {events.map(e => (
          <div key={e.id} className="relative pb-5">
            <div className="absolute -left-[13px] top-1 w-2.5 h-2.5 rounded-full bg-brand-500 ring-4 ring-white"/>
            <div className="text-xs text-slate-500 font-mono">{e.ts}</div>
            <div className="text-sm font-medium text-slate-900">{e.action}</div>
            <div className="text-xs text-slate-500 mt-0.5">{e.detail} · <span className="text-slate-700">{e.actor}</span></div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// Resolves which project a given user should see by default for
// project-scoped pages (Households/Documents/Compensation) — same logic
// GISMap already uses, so every role sees data for their own assigned
// project instead of a hardcoded one.
function resolveFocusProjectId(){
  const user = (window.BS_STATE && window.BS_STATE.user) || {};
  const allProjects = (window.BS_DATA && window.BS_DATA.PROJECTS) || [];
  return user.assignedProject || (user.state === 'Delhi' ? 'DL-001' : (allProjects[0] ? allProjects[0].id : 'AIR-001'));
}

// Standalone pages using views
function HouseholdsPage(){
  const projectId = resolveFocusProjectId();
  const proj = ((window.BS_DATA && window.BS_DATA.PROJECTS) || []).find(p => p.id === projectId);
  return <AppLayout crumbs={[{label:'Households'}]}>
    <SectionHeader title={`Households · ${projectId}`} subtitle={proj ? `Households linked to ${proj.name}` : ''}/>
    <HouseholdsView projectId={projectId}/>
  </AppLayout>;
}
function DocumentsPage(){
  const projectId = resolveFocusProjectId();
  return <AppLayout crumbs={[{label:'Documents'}]}>
    <SectionHeader title="Documents"/>
    <DocumentsView projectId={projectId}/>
  </AppLayout>;
}
function CompensationPage(){
  const projectId = resolveFocusProjectId();
  return <AppLayout crumbs={[{label:'Compensation'}]}>
    <SectionHeader title="Compensation"/>
    <CompensationView projectId={projectId}/>
  </AppLayout>;
}

Object.assign(window, {
  ProjectDetail, StageTracker, HouseholdsPage, DocumentsPage, CompensationPage,
});
