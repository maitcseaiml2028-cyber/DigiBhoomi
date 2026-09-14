/* AI Risk · Explainable AI · Recommendations · What-If Simulator · Intervention Center */

// -------- Utility: project selector chip --------
function ProjectPicker({ value, onChange }){
  const projects = window.BS_DATA.PROJECTS.slice(0,20);
  return (
    <select value={value} onChange={e=>onChange(e.target.value)} className="text-sm rounded-lg border border-slate-200 bg-white px-3 py-1.5">
      {projects.map(p=><option key={p.id} value={p.id}>{p.id} · {p.name}</option>)}
    </select>
  );
}

// ================= AI Risk Dashboard =================
function AIRiskDashboard(){
  useLucide();
  useStore();
  const loc = useLocation();
  const initial = new URLSearchParams(loc.search).get('project') || resolveFocusProjectId();
  const [pid, setPid] = useState(initial);
  const nav = useNavigate();
  const p = projectService.getProject(pid);
  const r = predictionService.getRiskPrediction(pid);

  if(!p || !r){
    return (
      <AppLayout crumbs={[{label:'AI Risk'}]}>
        <Empty icon="brain-circuit" title="No project data available yet"
          subtitle="You don't have any projects in scope yet, so there's no risk prediction to show."
          action={<Button variant="secondary" size="sm" onClick={()=>nav('/projects')}>View projects</Button>}/>
      </AppLayout>
    );
  }

  const stageRisks = [
    { stage:'S1', risk: 10 },
    { stage:'S2', risk: 18 },
    { stage:'S3', risk: 42 },
    { stage:'S4', risk: r.delay_probability },
    { stage:'S5', risk: 62 },
    { stage:'S6', risk: 44 },
    { stage:'S7', risk: 20 },
  ];

  return (
    <AppLayout crumbs={[{label:'AI Risk'}]}
      right={<ProjectPicker value={pid} onChange={setPid}/>}>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 relative overflow-hidden">
          <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ background: 'radial-gradient(600px 240px at 20% 0%, rgba(239,68,68,.12), transparent 60%)' }}/>
          <div className="relative">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[11px] tracking-widest text-slate-500 font-semibold">AI DELAY PROBABILITY — {p.id}</div>
                <div className="mt-1 flex items-baseline gap-3">
                  <div className="text-[80px] leading-none font-bold tabular text-red-600">{r.delay_probability}<span className="text-3xl">%</span></div>
                  <RiskBadge level={r.risk_level} size="lg"/>
                </div>
                <div className="mt-2 text-sm text-slate-600">{p.name} · {p.state} → {p.district}</div>
              </div>
              <div className="grid grid-cols-2 gap-3 w-64">
                <div className="rounded-xl bg-slate-50 border hairline p-3">
                  <div className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Expected Delay</div>
                  <div className="text-2xl font-semibold tabular text-slate-900">{r.expected_delay_days}<span className="text-sm text-slate-500"> d</span></div>
                </div>
                <div className="rounded-xl bg-slate-50 border hairline p-3">
                  <div className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Confidence</div>
                  <div className="text-2xl font-semibold tabular text-slate-900">{r.confidence}%</div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-2 flex-wrap">
              <Button variant="primary" icon="sparkles" onClick={()=>nav('/ai/explainable?project='+pid)}>Explain risk</Button>
              <Button variant="dark" icon="lightbulb" onClick={()=>nav('/ai/recommendations?project='+pid)}>Recommendations</Button>
              <Button variant="secondary" icon="sliders-horizontal" onClick={()=>nav('/ai/simulator?project='+pid)}>Simulate</Button>
              <Button variant="secondary" icon="shield-alert" onClick={()=>nav('/ai/interventions?project='+pid)}>Interventions</Button>
            </div>
          </div>
        </Card>

        <Card>
          <SectionHeader title="Model card"/>
          <div className="text-sm space-y-2">
            <div className="flex justify-between"><span className="text-slate-500">Model</span><span className="font-medium">XGBoost v2.4</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Algorithm</span><span className="font-medium">Gradient-boosted trees</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Features</span><span className="tabular font-medium">147</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Training rows</span><span className="tabular font-medium">42,318</span></div>
            <div className="flex justify-between"><span className="text-slate-500">AUC · offline</span><span className="tabular font-medium">0.912</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Last retrained</span><span className="tabular font-medium">28 Aug 2026</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Updated</span><span className="tabular font-medium">09:12 IST</span></div>
          </div>
          <div className="mt-4 rounded-lg bg-slate-50 border hairline p-3 text-[11px] text-slate-600 leading-relaxed">
            AI predictions are decision-support estimates and do <b>not</b> replace statutory approvals or administrative/legal decisions.
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mt-4">
        <Card>
          <SectionHeader title="Stage-level predictions" subtitle="Risk on each stage of the workflow"/>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={stageRisks} margin={{left:-14,right:6,top:6,bottom:0}}>
                <CartesianGrid vertical={false} stroke="#eef1f5"/>
                <XAxis dataKey="stage" fontSize={11} stroke="#94a3b8" tickLine={false} axisLine={false}/>
                <YAxis fontSize={11} stroke="#94a3b8" tickLine={false} axisLine={false} width={30}/>
                <Tooltip contentStyle={{borderRadius:8, border:'1px solid #e2e8f0', fontSize:12}} formatter={v=>[v+'%','Risk']}/>
                <Bar dataKey="risk" radius={[6,6,0,0]}>
                  {stageRisks.map((s,i)=>{
                    const c = s.risk>=80?'#EF4444':s.risk>=60?'#F97316':s.risk>=40?'#F59E0B':'#10B981';
                    return <Cell key={i} fill={c}/>;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <SectionHeader title="Historical risk trajectory" subtitle="How this project's risk evolved"/>
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={[
                { m:'Mar', v:74 },{ m:'Apr', v:78 },{ m:'May', v:82 },{ m:'Jun', v:86 },{ m:'Jul', v:88 },{ m:'Aug', v:93 },{ m:'Sep', v:r.delay_probability }
              ]} margin={{left:-14,right:6,top:6,bottom:0}}>
                <CartesianGrid vertical={false} stroke="#eef1f5"/>
                <XAxis dataKey="m" fontSize={11} stroke="#94a3b8" tickLine={false} axisLine={false}/>
                <YAxis fontSize={11} stroke="#94a3b8" tickLine={false} axisLine={false} width={30} domain={[40,100]}/>
                <Tooltip contentStyle={{borderRadius:8, border:'1px solid #e2e8f0', fontSize:12}}/>
                <Line dataKey="v" type="monotone" stroke="#EF4444" strokeWidth={2} dot={{r:3,fill:'#EF4444'}}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}

// ================= Explainable AI =================
function ExplainableAI(){
  useLucide();
  useStore();
  const loc = useLocation();
  const initial = new URLSearchParams(loc.search).get('project') || resolveFocusProjectId();
  const [pid, setPid] = useState(initial);
  const p = projectService.getProject(pid);
  const r = predictionService.getRiskPrediction(pid);
  const nav = useNavigate();

  if(!p || !r){
    return (
      <AppLayout crumbs={[{label:'Explainable AI'}]}>
        <Empty icon="sparkles" title="No project data available yet"
          subtitle="You don't have any projects in scope yet, so there's no explanation to show."
          action={<Button variant="secondary" size="sm" onClick={()=>nav('/projects')}>View projects</Button>}/>
      </AppLayout>
    );
  }
  const drivers = r.drivers;

  return (
    <AppLayout crumbs={[{label:'Explainable AI'}]} right={<ProjectPicker value={pid} onChange={setPid}/>}>
      <div className="grid lg:grid-cols-3 gap-4">
        <Card>
          <div className="text-[11px] tracking-widest text-slate-500 font-semibold">FOR PROJECT</div>
          <div className="mt-1 text-lg font-semibold">{p.name}</div>
          <div className="text-xs text-slate-500 font-mono">{p.id} · {p.state}</div>
          <div className="mt-4 rounded-xl bg-red-50 border border-red-100 p-4">
            <div className="text-xs uppercase tracking-widest text-red-700 font-semibold">Predicted delay</div>
            <div className="mt-1 text-4xl font-semibold text-red-600 tabular">{r.delay_probability}%</div>
            <div className="text-xs text-red-700 mt-0.5">≈ {r.expected_delay_days} days · confidence {r.confidence}%</div>
          </div>
        </Card>
        <Card className="lg:col-span-2">
          <SectionHeader title="Delay driver decomposition" subtitle="SHAP-based feature attribution"/>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={drivers} layout="vertical" margin={{left:0,right:30}}>
                <CartesianGrid horizontal={false} stroke="#eef1f5"/>
                <XAxis type="number" tickFormatter={v=>v+'%'} fontSize={11} stroke="#94a3b8" tickLine={false} axisLine={false}/>
                <YAxis type="category" dataKey="name" width={150} fontSize={12} stroke="#475569" tickLine={false} axisLine={false}/>
                <Tooltip contentStyle={{borderRadius:8, border:'1px solid #e2e8f0', fontSize:12}} formatter={v=>[v+'%','Contribution']}/>
                <Bar dataKey="value" radius={[0,6,6,0]}>
                  {drivers.map((d,i)=><Cell key={i} fill={d.color}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="mt-4 grid md:grid-cols-2 gap-4">
        {drivers.map((d,i) => (
          <Card key={i} className="border-l-4" style={{ borderLeftColor: d.color }}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[11px] uppercase tracking-widest text-slate-500 font-semibold">Driver</div>
                <div className="mt-1 text-base font-semibold">{d.name}</div>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  {d.name === 'Compensation Backlog' && '430 approved-but-unpaid households are creating a bottleneck. Historical data shows that projects with >20% payout backlog exceed timelines by 60 days on average.'}
                  {d.name === 'Legal Disputes' && '137 unresolved cases pending in courts. Similar projects with >100 open disputes saw 45–90 day slippages during possession stage.'}
                  {d.name === 'R&R' && 'Rehabilitation packages behind plan in Newta and Sanwalka. R&R delays typically compound with communal grievances.'}
                  {d.name === 'Pending Approvals' && '7 approvals with state and central authorities > 21 days old. Escalation to district collector recommended.'}
                  {d.name === 'Documentation' && '440 households missing at least one document (title deed / khasra / KYC). Verification desks operating at 65% capacity.'}
                  {d.name === 'Other' && 'Contractor readiness, right-of-way overlap with utility corridors, monsoon window in October.'}
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-semibold tabular" style={{ color: d.color }}>{d.value}%</div>
                <div className="text-[11px] text-slate-500">contribution</div>
              </div>
            </div>
            <div className="mt-4">
              <Button size="sm" variant="secondary" icon="lightbulb" onClick={()=>nav('/ai/recommendations?project='+pid)}>See intervention</Button>
            </div>
          </Card>
        ))}
      </div>
    </AppLayout>
  );
}

// ================= AI Recommendations =================
function Recommendations(){
  useLucide();
  useStore();
  const loc = useLocation();
  const initial = new URLSearchParams(loc.search).get('project') || resolveFocusProjectId();
  const [pid, setPid] = useState(initial);
  const [taskModal, setTaskModal] = useState(null);
  const nav = useNavigate();
  const recs = predictionService.getRecommendations(pid);

  return (
    <AppLayout crumbs={[{label:'AI Recommendations'}]} right={<ProjectPicker value={pid} onChange={setPid}/>}>
      <SectionHeader title="AI-generated interventions"
        subtitle="Actionable steps ranked by estimated delay reduction. Officers remain accountable for execution and outcomes."/>
      <div className="space-y-3">
        {recs.map(r => (
          <Card key={r.id} className="hover:shadow-pop transition-shadow">
            <div className="flex items-start gap-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0 ${r.priority==='Critical'?'bg-red-500':'bg-brand-500'}`}>
                <Icon name="lightbulb" size={20}/>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="text-base font-semibold text-slate-900">{r.title}</div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase tracking-widest ${r.priority==='Critical'?'bg-red-100 text-red-700':r.priority==='High'?'bg-orange-100 text-orange-700':'bg-amber-100 text-amber-700'}`}>{r.priority}</span>
                    </div>
                    <p className="mt-1 text-sm text-slate-600 leading-relaxed">{r.detail}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Estimated impact</div>
                    <div className="text-2xl font-semibold tabular text-emerald-600">-{r.impactDays}d</div>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Button variant="primary" size="sm" icon="plus" onClick={()=>setTaskModal(r)}>{r.action}</Button>
                  <Button variant="secondary" size="sm" icon="user-plus">Assign officer</Button>
                  <Button variant="ghost" size="sm" icon="info">View evidence</Button>
                  <div className="ml-auto text-xs text-slate-500">Owner role · <b>{r.ownerRole}</b></div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <CreateTaskModal rec={taskModal} onClose={()=>setTaskModal(null)} projectId={pid}/>
    </AppLayout>
  );
}

function CreateTaskModal({ rec, onClose, projectId }){
  useLucide();
  const nav = useNavigate();
  const [f, setF] = useState({
    title:'', officer:'', priority:'High', due:'2026-11-30', description:''
  });
  useEffect(() => {
    if(rec) setF({
      title: rec.title,
      officer: rec.ownerRole === 'Legal Officer' ? 'Arun Mehta' : rec.ownerRole === 'Revenue Officer' ? 'Neha Kapoor' : rec.ownerRole === 'R&R Officer' ? 'Suresh Rao' : 'Vikram Singh',
      priority: rec.priority,
      due:'2026-11-30',
      description: rec.detail,
    });
  }, [rec]);
  if(!rec) return <Modal open={false}/>;
  const submit = () => {
    taskService.create({
      projectId, ...f,
      role: rec.ownerRole,
      progress: 0,
      risk: rec.priority === 'Critical' ? 'critical' : rec.priority === 'High' ? 'high' : 'medium',
      evidence:[], approver:'Priya Nair',
    });
    toastBus.push('Task created and assigned', 'success');
    onClose();
    nav('/tasks');
  };
  return (
    <Modal open={!!rec} onClose={onClose}
      title="Create task from AI recommendation"
      subtitle="Pre-filled from recommendation · review and submit"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" icon="check" onClick={submit}>Create & Assign</Button>
        </>
      }>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <label className="col-span-2 block">
          <div className="text-xs font-medium text-slate-600 mb-1">Title</div>
          <input value={f.title} onChange={e=>setF({...f,title:e.target.value})} className="w-full input"/>
        </label>
        <label className="block">
          <div className="text-xs font-medium text-slate-600 mb-1">Assign to</div>
          <select value={f.officer} onChange={e=>setF({...f,officer:e.target.value})} className="w-full input">
            {window.BS_DATA.OFFICERS.map(o=><option key={o.id}>{o.name}</option>)}
          </select>
        </label>
        <label className="block">
          <div className="text-xs font-medium text-slate-600 mb-1">Priority</div>
          <select value={f.priority} onChange={e=>setF({...f,priority:e.target.value})} className="w-full input">
            {['Critical','High','Medium','Low'].map(p=><option key={p}>{p}</option>)}
          </select>
        </label>
        <label className="block">
          <div className="text-xs font-medium text-slate-600 mb-1">Deadline</div>
          <input type="date" value={f.due} onChange={e=>setF({...f,due:e.target.value})} className="w-full input"/>
        </label>
        <label className="block">
          <div className="text-xs font-medium text-slate-600 mb-1">Approver</div>
          <input value="Priya Nair" disabled className="w-full input"/>
        </label>
        <label className="col-span-2 block">
          <div className="text-xs font-medium text-slate-600 mb-1">Description</div>
          <textarea value={f.description} rows={3} onChange={e=>setF({...f,description:e.target.value})} className="w-full input"/>
        </label>
      </div>
    </Modal>
  );
}

// ================= What-If Simulator =================
function WhatIfSimulator(){
  useLucide();
  useStore();
  const loc = useLocation();
  const initial = new URLSearchParams(loc.search).get('project') || resolveFocusProjectId();
  const [pid, setPid] = useState(initial);
  const p = projectService.getProject(pid);
  const [inputs, setInputs] = useState({ verificationStaff: 10, legalTeams: 4, compensationBoost: 30, fieldTeams: 6 });
  const [result, setResult] = useState(null);
  const nav = useNavigate();

  if(!p){
    return (
      <AppLayout crumbs={[{label:'What-If Simulator'}]}>
        <Empty icon="sliders-horizontal" title="No project data available yet"
          subtitle="You don't have any projects in scope yet, so there's nothing to simulate."
          action={<Button variant="secondary" size="sm" onClick={()=>nav('/projects')}>View projects</Button>}/>
      </AppLayout>
    );
  }

  const run = () => {
    const r = predictionService.runSimulation(pid, inputs);
    setResult(r);
    toastBus.push(`Simulated risk ${r.simulated_risk}% · -${r.delay_reduction_days} days`, 'success');
  };
  const apply = () => {
    predictionService.applySimulation(pid);
    toastBus.push('Simulation applied · risk recalculated', 'success');
    setResult(null);
    nav('/projects/'+pid);
  };

  return (
    <AppLayout crumbs={[{label:'What-If Simulator'}]} right={<ProjectPicker value={pid} onChange={setPid}/>}>
      <div className="grid lg:grid-cols-[380px_1fr] gap-4">
        <Card>
          <SectionHeader title="Intervention levers" subtitle="Simulate adding resources or accelerating processes"/>
          <div className="space-y-4">
            <SimSlider label="Additional verification staff" hint="Faster document verification" min={0} max={40} step={2}
              value={inputs.verificationStaff} onChange={v=>setInputs({...inputs, verificationStaff:v})} suffix=" desks"/>
            <SimSlider label="Additional legal teams" hint="Fast-track court + mediation" min={0} max={10} step={1}
              value={inputs.legalTeams} onChange={v=>setInputs({...inputs, legalTeams:v})} suffix=" cells"/>
            <SimSlider label="Accelerate compensation processing" hint="DBT throughput boost" min={0} max={100} step={5}
              value={inputs.compensationBoost} onChange={v=>setInputs({...inputs, compensationBoost:v})} suffix="%"/>
            <SimSlider label="Additional field teams" hint="R&R rollout + on-ground survey" min={0} max={20} step={1}
              value={inputs.fieldTeams} onChange={v=>setInputs({...inputs, fieldTeams:v})} suffix=" teams"/>
          </div>
          <Button className="w-full mt-6" variant="primary" icon="play" onClick={run}>Run Simulation</Button>
        </Card>

        <div className="space-y-4">
          <Card className="relative overflow-hidden">
            <div className="grid md:grid-cols-3 gap-6">
              <ScoreBlock label="Current risk" value={p.aiRisk} tone="red"/>
              <ScoreBlock label="Simulated risk" value={result?.simulated_risk ?? '—'} tone="green" pending={!result}/>
              <ScoreBlock label="Delay reduction" value={result ? `-${result.delay_reduction_days}d` : '—'} tone="blue" pending={!result}/>
            </div>
            {result && (
              <div className="mt-6">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Before → After</div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="flex items-center gap-4">
                    <div className="tabular text-red-600 font-semibold w-14 text-right">{p.aiRisk}%</div>
                    <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden relative">
                      <div className="absolute inset-y-0 left-0 bg-red-500" style={{ width: `${p.aiRisk}%` }}/>
                      <div className="absolute inset-y-0 left-0 bg-emerald-500" style={{ width: `${result.simulated_risk}%`, opacity:0.9 }}/>
                    </div>
                    <div className="tabular text-emerald-600 font-semibold w-14">{result.simulated_risk}%</div>
                  </div>
                  <div className="mt-3 text-xs text-slate-600">
                    Interventions above would reduce delay probability by <b>{result.risk_reduction} pp</b> and expected delay by <b>{result.delay_reduction_days} days</b> with confidence {result.confidence}%.
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Button variant="primary" icon="check" onClick={apply}>Apply · Recalculate Risk</Button>
                  <Button variant="secondary" icon="plus" onClick={()=>nav('/ai/recommendations?project='+pid)}>Convert to tasks</Button>
                </div>
              </div>
            )}
            {!result && (
              <div className="mt-6 rounded-xl bg-slate-50 border hairline p-6 text-center text-sm text-slate-500">
                Move the sliders and click <b>Run Simulation</b> to project a new risk score.
              </div>
            )}
          </Card>

          <Card>
            <SectionHeader title="Sensitivity" subtitle="Marginal impact of each lever"/>
            <div className="h-56">
              <ResponsiveContainer>
                <BarChart data={[
                  { l:'Legal teams', v: inputs.legalTeams*4 },
                  { l:'Field teams', v: inputs.fieldTeams*1.1 },
                  { l:'Verification staff', v: inputs.verificationStaff*1.5 },
                  { l:'Comp acceleration', v: inputs.compensationBoost*0.9 },
                ]} margin={{left:-14,right:6,top:6,bottom:0}}>
                  <CartesianGrid vertical={false} stroke="#eef1f5"/>
                  <XAxis dataKey="l" fontSize={11} stroke="#94a3b8" tickLine={false} axisLine={false}/>
                  <YAxis fontSize={11} stroke="#94a3b8" tickLine={false} axisLine={false} width={30}/>
                  <Tooltip contentStyle={{borderRadius:8, border:'1px solid #e2e8f0', fontSize:12}} formatter={v=>[v.toFixed(1)+' pp','Risk reduction']}/>
                  <Bar dataKey="v" radius={[6,6,0,0]} fill="#B87333"/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
      <style>{`.input { width:100%; padding:.55rem .75rem; border-radius:.5rem; background:#f8fafc; border:1px solid #e2e8f0; font-size:.875rem; outline:none; }`}</style>
    </AppLayout>
  );
}

function SimSlider({ label, hint, min, max, step, value, onChange, suffix }){
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-slate-800">{label}</div>
          <div className="text-[11px] text-slate-500">{hint}</div>
        </div>
        <div className="text-sm font-semibold tabular text-brand-600">{value}{suffix}</div>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e=>onChange(+e.target.value)}
        className="w-full mt-2 accent-brand-500"/>
    </div>
  );
}

function ScoreBlock({ label, value, tone, pending }){
  const toneMap = { red:'text-red-600', green:'text-emerald-600', blue:'text-brand-500' };
  return (
    <div>
      <div className="text-[11px] tracking-widest text-slate-500 font-semibold uppercase">{label}</div>
      <div className={`mt-1 text-5xl font-bold tabular ${toneMap[tone]} ${pending?'opacity-40':''}`}>
        {value}{typeof value === 'number' && '%'}
      </div>
    </div>
  );
}

// ================= Intervention Center =================
function InterventionCenter(){
  useLucide();
  useStore();
  const projects = window.BS_DATA.PROJECTS.filter(p => p.riskLevel === 'critical' || p.riskLevel === 'high').slice(0,12);
  const nav = useNavigate();
  return (
    <AppLayout crumbs={[{label:'Intervention Center'}]}>
      <SectionHeader title="Intervention Center"
        subtitle="Projects that need supervisor action right now. AI has flagged, explained and proposed remedies — you decide, assign and execute."/>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {projects.map(p => (
          <Card key={p.id} className="hover:shadow-pop cursor-pointer transition-shadow" onClick={()=>nav('/projects/'+p.id)}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[11px] tracking-widest text-slate-500 font-semibold">{p.id} · {p.type}</div>
                <div className="mt-0.5 text-sm font-semibold text-slate-900 leading-tight">{p.name}</div>
                <div className="text-xs text-slate-500 mt-0.5">{p.state} · {p.district}</div>
              </div>
              <RiskBadge level={p.riskLevel}/>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <div className={`text-3xl font-semibold tabular ${p.riskLevel==='critical'?'text-red-600':'text-orange-600'}`}>{p.aiRisk}%</div>
              <div className="text-xs text-slate-500">· {p.expectedDelay}d delay</div>
            </div>
            <div className="mt-3"><Progress value={p.progress} tone={p.riskLevel} showLabel/></div>
            <div className="mt-3 pt-3 border-t hairline flex items-center gap-2">
              <Button size="sm" variant="secondary" icon="lightbulb" onClick={(e)=>{e.stopPropagation(); nav('/ai/recommendations?project='+p.id);}}>Recs</Button>
              <Button size="sm" variant="secondary" icon="sliders-horizontal" onClick={(e)=>{e.stopPropagation(); nav('/ai/simulator?project='+p.id);}}>Simulate</Button>
              <div className="ml-auto text-[11px] text-slate-500">Owner · {p.owner.split(' ')[0]}</div>
            </div>
          </Card>
        ))}
      </div>
    </AppLayout>
  );
}

Object.assign(window, {
  AIRiskDashboard, ExplainableAI, Recommendations, WhatIfSimulator, InterventionCenter,
});
