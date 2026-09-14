/* GIS Map — Leaflet-based interactive parcel map with AI risk overlay */

function GISMap(){
  useLucide();
  useStore();
  const nav = useNavigate();
  const mapRef = useRef(null);
  const leafletRef = useRef(null);
  const layerRef = useRef(null);
  const [selected, setSelected] = useState(null);

  const user = (window.BS_STATE && window.BS_STATE.user) || {};
  const allProjects = (window.BS_DATA && window.BS_DATA.PROJECTS) || [];
  const defaultProjId = user.assignedProject || (user.state === 'Delhi' ? 'DL-001' : (allProjects[0] ? allProjects[0].id : 'AIR-001'));
  const defaultProj = allProjects.find(p => p.id === defaultProjId) || allProjects[0] || {};
  const defaultState = (user.state && user.state !== '—') ? user.state : (defaultProj.state || 'Delhi');

  const [filter, setFilter] = useState({ state: defaultState, project: defaultProjId, risk:'', stage:'' });
  const [view, setView] = useState('acquisition'); // acquisition | risk | compensation | legal

  const stateProjects = allProjects.filter(p => !filter.state || p.state === filter.state);
  const displayProjects = stateProjects.length > 0 ? stateProjects : allProjects;
  const curProj = allProjects.find(p => p.id === filter.project) || displayProjects[0] || {};

  const parcels = gisService.getParcels(filter.project);
  const villages = gisService.getVillages(filter.project);

  // Init map
  useEffect(() => {
    if(leafletRef.current) return;
    const initialCenter = curProj.centerLat ? [curProj.centerLat, curProj.centerLng] : (filter.state === 'Delhi' ? [28.609, 76.995] : [26.803, 75.575]);
    const map = L.map(mapRef.current, { zoomControl:false, attributionControl:false }).setView(initialCenter, 12);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      subdomains:'abcd', maxZoom:19
    }).addTo(map);
    L.control.zoom({ position:'topright' }).addTo(map);
    L.control.attribution({ position:'bottomright', prefix:'DigiBhoomi · © CartoDB · OpenStreetMap' }).addTo(map);
    leafletRef.current = map;

    setTimeout(() => { map.invalidateSize(); }, 200);
  }, []);

  // Colour selector
  const colorFor = useCallback((p) => {
    if(view === 'acquisition'){
      if(p.status === 'acquired')     return '#10B981';
      if(p.status === 'in_progress')  return p.risk==='high'?'#F97316':p.risk==='critical'?'#EF4444':'#F59E0B';
      if(p.status === 'disputed')     return '#EF4444';
      return '#94A3B8';
    }
    if(view === 'risk'){
      return p.risk==='low'?'#10B981':p.risk==='medium'?'#F59E0B':p.risk==='high'?'#F97316':'#EF4444';
    }
    if(view === 'compensation'){
      if(p.status==='acquired') return '#10B981';
      if(p.status==='in_progress') return '#B87333';
      return '#94A3B8';
    }
    if(view === 'legal'){
      return p.legalDispute ? '#EF4444' : '#10B981';
    }
    return '#B87333';
  }, [view]);

  // Render parcels
  useEffect(() => {
    const map = leafletRef.current;
    if(!map) return;
    if(layerRef.current) map.removeLayer(layerRef.current);

    const group = L.layerGroup();
    const filtered = parcels.filter(p => {
      if(filter.risk && p.risk !== filter.risk) return false;
      return true;
    });

    // Draw parcels as circles
    filtered.forEach(p => {
      const c = L.circleMarker([p.lat, p.lng], {
        radius: 4 + Math.min(4, (p.area||1)/2),
        color: colorFor(p),
        fillColor: colorFor(p),
        fillOpacity: 0.65,
        weight: 1.5,
      });
      c.on('click', () => setSelected(p));
      c.bindTooltip(`<div style="font-family:Inter"><b>${p.id}</b><br>${p.village || 'Sector'} · ${p.area || 1} ha<br><span style="text-transform:capitalize;color:${colorFor(p)}">${p.status || 'in progress'}</span></div>`, {sticky:true});
      c.addTo(group);
    });

    // Village labels
    villages.forEach(v => {
      const icon = L.divIcon({
        className: 'village-label',
        html: `<div style="background:rgba(7,20,38,.85);color:#fff;padding:2px 8px;border-radius:6px;font-size:11px;font-weight:600;font-family:Inter;box-shadow:0 4px 10px rgba(7,20,38,.2);white-space:nowrap;">${v.name}</div>`,
        iconSize: [80, 20],
        iconAnchor: [40, 30],
      });
      L.marker(v.center, { icon }).addTo(group);
    });

    // Project boundary polygon around villages
    if(villages.length > 1) {
      const bounds = villages.map(v => v.center);
      const b = L.latLngBounds(bounds);
      const pad = 0.02;
      const rect = L.rectangle([
        [b.getSouth()-pad, b.getWest()-pad],
        [b.getNorth()+pad, b.getEast()+pad]
      ], { color:'#B87333', weight:2, dashArray:'6 4', fillOpacity:0.04 });
      rect.addTo(group);
    }

    group.addTo(map);
    layerRef.current = group;
  }, [parcels, villages, filter, colorFor, view]);

  // Dynamic map re-centering when project changes
  useEffect(() => {
    const map = leafletRef.current;
    if(!map) return;
    setTimeout(() => { map.invalidateSize(); }, 150);

    if (parcels.length > 0) {
      const b = L.latLngBounds(parcels.map(p => [p.lat, p.lng]));
      map.fitBounds(b, { padding: [40, 40], maxZoom: 14 });
    } else if (villages.length > 0) {
      const b = L.latLngBounds(villages.map(v => v.center));
      map.fitBounds(b, { padding: [40, 40], maxZoom: 13 });
    } else if (curProj && curProj.centerLat) {
      map.setView([curProj.centerLat, curProj.centerLng], 12);
    } else if (filter.project === 'DL-001') {
      map.setView([28.609, 76.995], 12);
    } else if (filter.project === 'AIR-001') {
      map.setView([26.803, 75.575], 12);
    }
  }, [filter.project, parcels.length, villages.length]);

  return (
    <AppLayout crumbs={[{label:'GIS Map'}]}>
      <div className="grid lg:grid-cols-[280px_1fr] gap-4 h-[calc(100vh-8rem)]">
        {/* Sidebar filters */}
        <div className="space-y-3">
          <Card>
            <SectionHeader title="Map filters" className="mb-3"/>
            <div className="space-y-3 text-sm">
              <div>
                <div className="text-xs font-medium text-slate-600 mb-1">State</div>
                <select
                  value={filter.state}
                  onChange={e => {
                    const newState = e.target.value;
                    const pInState = allProjects.filter(p => !newState || p.state === newState);
                    const nextProj = pInState[0] ? pInState[0].id : filter.project;
                    setFilter({ ...filter, state: newState, project: nextProj });
                  }}
                  className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm"
                >
                  <option value="">All States</option>
                  {(window.BS_DATA && window.BS_DATA.STATES || []).map(s => <option key={s.code} value={s.name}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <div className="text-xs font-medium text-slate-600 mb-1">Project</div>
                <select
                  value={filter.project}
                  onChange={e => setFilter({ ...filter, project: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm"
                >
                  {displayProjects.map(p => (
                    <option key={p.id} value={p.id}>{p.id} · {p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <div className="text-xs font-medium text-slate-600 mb-1">Stage</div>
                <select value={filter.stage} onChange={e=>setFilter({...filter, stage:e.target.value})} className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm">
                  <option value="">All stages</option>
                  {[1,2,3,4,5,6,7].map(n=><option key={n}>Stage {n}</option>)}
                </select>
              </div>
              <div>
                <div className="text-xs font-medium text-slate-600 mb-1">AI Risk</div>
                <select value={filter.risk} onChange={e=>setFilter({...filter, risk:e.target.value})} className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm">
                  <option value="">All</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
          </Card>

          <Card>
            <SectionHeader title="View mode"/>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                {v:'acquisition', l:'Acquisition', i:'land-plot'},
                {v:'risk',        l:'AI Risk',     i:'brain-circuit'},
                {v:'compensation',l:'Compensation',i:'wallet'},
                {v:'legal',       l:'Legal',       i:'gavel'},
              ].map(x => (
                <button key={x.v} onClick={()=>setView(x.v)} className={`rounded-lg border p-2.5 flex flex-col items-start gap-1 transition-colors ${view===x.v?'border-brand-500 bg-brand-500/10 text-brand-700':'border-slate-200 hover:bg-slate-50'}`}>
                  <Icon name={x.i} size={14}/> <span className="font-medium">{x.l}</span>
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <SectionHeader title="Legend"/>
            <div className="space-y-2 text-xs">
              {view === 'acquisition' && (<>
                <LegendRow color="#10B981" label="Acquired"/>
                <LegendRow color="#F59E0B" label="In-progress · medium risk"/>
                <LegendRow color="#F97316" label="In-progress · high risk"/>
                <LegendRow color="#EF4444" label="Critical / Disputed"/>
                <LegendRow color="#94A3B8" label="Not started"/>
              </>)}
              {view === 'risk' && (<>
                <LegendRow color="#10B981" label="Low"/>
                <LegendRow color="#F59E0B" label="Medium"/>
                <LegendRow color="#F97316" label="High"/>
                <LegendRow color="#EF4444" label="Critical"/>
              </>)}
              {view === 'compensation' && (<>
                <LegendRow color="#10B981" label="Paid"/>
                <LegendRow color="#B87333" label="Approved / In-progress"/>
                <LegendRow color="#94A3B8" label="Not started"/>
              </>)}
              {view === 'legal' && (<>
                <LegendRow color="#10B981" label="Clear"/>
                <LegendRow color="#EF4444" label="Under Dispute"/>
              </>)}
            </div>
          </Card>

          <Card>
            <div className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-2">On map</div>
            <div className="text-sm space-y-1.5 tabular">
              <div className="flex justify-between"><span className="text-slate-600">Villages</span><b>{villages.length}</b></div>
              <div className="flex justify-between"><span className="text-slate-600">Parcels</span><b>{nfmt(parcels.length)}</b></div>
              <div className="flex justify-between"><span className="text-slate-600">Total area</span><b>{parcels.reduce((a,p)=>a+(p.area||0),0).toFixed(0)} ha</b></div>
              <div className="flex justify-between"><span className="text-slate-600">Disputed</span><b className="text-red-600">{parcels.filter(p=>p.legalDispute).length}</b></div>
            </div>
          </Card>
        </div>

        {/* Map */}
        <div className="relative rounded-2xl overflow-hidden ring-1 ring-slate-200/70 shadow-card bg-white">
          <div ref={mapRef} className="absolute inset-0"/>
          {/* Top overlay bar */}
          <div className="absolute top-3 left-3 z-[500] flex items-center gap-2">
            <div className="rounded-lg bg-white/95 backdrop-blur ring-1 ring-slate-200 shadow-sm px-3 py-1.5 text-xs flex items-center gap-2">
              <Icon name="map-pin" size={12} className="text-brand-500"/> 
              <b>{curProj.id || filter.project}</b> · {curProj.name || 'Greenfield Project'} · {curProj.district || curProj.state || 'Delhi'}
            </div>
            <div className={`rounded-lg ring-1 px-3 py-1.5 text-xs flex items-center gap-2 ${curProj.riskLevel==='critical'?'bg-red-50/95 ring-red-200 text-red-700':curProj.riskLevel==='high'?'bg-orange-50/95 ring-orange-200 text-orange-700':'bg-emerald-50/95 ring-emerald-200 text-emerald-700'} backdrop-blur shadow-sm`}>
              <span className={`w-1.5 h-1.5 rounded-full ${curProj.riskLevel==='critical'?'bg-red-500 pulse-ring':curProj.riskLevel==='high'?'bg-orange-500':'bg-emerald-500'}`}/>
              AI Risk {curProj.aiRisk || 65}% · {(curProj.riskLevel || 'medium').toUpperCase()}
            </div>
          </div>
          {/* Bottom AI panel */}
          <div className="absolute bottom-3 left-3 z-[500] rounded-xl bg-white/95 backdrop-blur ring-1 ring-slate-200 shadow-pop p-3 text-xs max-w-sm">
            <div className="flex items-center gap-2 font-semibold text-slate-900">
              <Icon name="brain-circuit" size={14} className="text-brand-500"/> AI signal on this project
            </div>
            <div className="mt-1.5 text-slate-600 leading-relaxed">
              {curProj.riskLevel === 'critical'
                ? `High density of disputed parcels in ${curProj.name} is driving potential delays. Recommended: activate fast-track Section 19 settlement cell.`
                : `Acquisition progressing smoothly across ${villages.length || 5} village sectors. DBT disbursement tracking at 88% efficiency.`}
            </div>
            <Button size="sm" className="mt-2" variant="dark" icon="arrow-right" onClick={()=>nav(`/ai/recommendations?project=${curProj.id||'DL-001'}`)}>Open recommendations</Button>
          </div>
        </div>
      </div>

      <ParcelDrawer parcel={selected} onClose={()=>setSelected(null)}/>
    </AppLayout>
  );
}

function LegendRow({ color, label }){
  return <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm" style={{background:color}}/>{label}</div>;
}

function ParcelDrawer({ parcel, onClose }){
  useLucide();
  const nav = useNavigate();
  if(!parcel) return <Drawer open={false}/>;
  const hh = gisService.getHouseholdByParcel(parcel.id);
  const openTask = () => {
    taskService.create({
      projectId:'AIR-001',
      title:`Intervention on parcel ${parcel.id} · ${parcel.village}`,
      officer:'Vikram Singh',
      role:'LAO',
      progress:0,
      due:'2026-12-15',
      priority:'High',
      risk: parcel.risk,
      description:`Resolve on-ground issue on parcel ${parcel.id} in ${parcel.village}`,
      approver:'Priya Nair',
    });
    toastBus.push('Intervention task created', 'success');
    onClose();
    nav('/tasks');
  };
  return (
    <Drawer open={!!parcel} onClose={onClose}
      title={`Parcel ${parcel.id}`}
      subtitle={`${parcel.village} · ${parcel.area} ha`}
      footer={
        <>
          <Button variant="secondary" icon="user" onClick={()=>{ onClose(); nav('/households'); }}>View Household</Button>
          <Button variant="secondary" icon="gavel">View Case</Button>
          <Button variant="primary" icon="shield-alert" onClick={openTask}>Create Intervention</Button>
        </>
      }>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <MetricRow label="Parcel ID" value={<span className="font-mono">{parcel.id}</span>}/>
          <MetricRow label="Village" value={parcel.village}/>
          <MetricRow label="Area" value={`${parcel.area} ha`}/>
          <MetricRow label="Household" value={hh?.owner || parcel.householdId}/>
          <MetricRow label="Land Status" value={<StatusBadge status={parcel.status.replace('_',' ')}/>}/>
          <MetricRow label="AI Risk" value={<RiskBadge level={parcel.risk}/>}/>
          <MetricRow label="Legal Status" value={<StatusBadge status={parcel.legalDispute?'Under Dispute':'Clear'}/>}/>
          <MetricRow label="Compensation" value={hh ? <StatusBadge status={hh.compensation.status}/> : '—'}/>
        </div>
        {hh && (
          <div className="rounded-xl border hairline p-4">
            <div className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-2">Documents</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {hh.documents.map((d,i)=>(
                <div key={i} className="flex items-center justify-between rounded-md bg-slate-50 px-2.5 py-1.5">
                  <span className="text-xs">{d.type}</span><StatusBadge status={d.status}/>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="rounded-xl bg-navy-900 text-slate-200 p-4 text-xs">
          <div className="flex items-center gap-2 text-white font-semibold mb-1">
            <Icon name="brain-circuit" size={14}/> Why this parcel is flagged
          </div>
          {parcel.risk === 'critical' && 'Multiple KYC gaps, active dispute, and compensation not yet approved. Estimated 48-day delay contribution.'}
          {parcel.risk === 'high' && 'Documentation partly missing and R&R not yet rolled out. Requires field-officer intervention.'}
          {parcel.risk === 'medium' && 'Standard processing timeline; compensation still pending approval.'}
          {parcel.risk === 'low' && 'On-track; no active flags.'}
        </div>
      </div>
    </Drawer>
  );
}

function MetricRow({ label, value }){
  return (
    <div className="rounded-lg border hairline px-3 py-2">
      <div className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">{label}</div>
      <div className="mt-0.5 text-sm font-medium text-slate-900">{value}</div>
    </div>
  );
}

Object.assign(window, { GISMap });
