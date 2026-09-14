document.getElementById('copyrightYear').textContent = new Date().getFullYear();

  // ---------------- state ----------------
  const INITIAL_PARAMS = new URLSearchParams(location.search);
  let view = INITIAL_PARAMS.get('view')==='system' ? 'cluster' : 'tree';
  const mapStyle = 'legacy';
  let axis = ['pipelinecluster','journey','keywords'].includes(INITIAL_PARAMS.get('map')) ? INITIAL_PARAMS.get('map') : 'journey';
  let filterJourney = 'all';
  let filterDataType = 'all';
  let filterStatus = 'all';
  let filterPipelineLayer = 'all';
  let query = '';
  let zoom = 1, panX = 0, panY = 0;
  let lastFocused = null;
  let pinnedKeyword = null;

  const els = {
    app: document.getElementById('app'),
    treeView: document.getElementById('treeView'),
    clusterView: document.getElementById('clusterView'),
    systemView: document.getElementById('systemView'),
    topbarTree: document.getElementById('topbarTree'),
    topbarCluster: document.getElementById('topbarCluster'),
    treeCount: document.getElementById('treeCount'),
    domainList: document.getElementById('domainList'),
    domainListWrap: document.getElementById('domainListWrap'),
    legendPanel: document.getElementById('legendPanel'),
    legendList: document.getElementById('legendList'),
    legendTitle: document.getElementById('legendTitle'),
    legendHint: document.getElementById('legendHint'),
    canvasBox: document.getElementById('canvasBox'),
    connSvg: document.getElementById('connSvg'),
    viewport: document.getElementById('viewport'),
    canvasTools: document.getElementById('canvasTools'),
    hoverCard: document.getElementById('hoverCard'),
    searchInput: document.getElementById('searchInput'),
    legendToggle: document.getElementById('legendToggle'),
    statusOptions: document.getElementById('statusOptions'),
    dataTypeOptions: document.getElementById('dataTypeOptions'),
    scrim: document.getElementById('scrim'),
    panel: document.getElementById('panel'),
  };

  const STATUS_LABEL = { motivation:'Motivation', gap:'Named Gap', built:'Built', evidence:'Evidence', context:'Context', ask:'The Ask' };
  const KIND_ORDER = ['all','motivation','gap','built','evidence','context','ask'];

  function modChip(m){ return `<span class="mchip">${ICONS[m]}${DATATYPE_LABEL[m]}</span>`; }

  function matches(c){
    if(filterJourney!=='all' && c.journey!==filterJourney) return false;
    if(filterDataType!=='all' && !c.dataTypes.includes(filterDataType)) return false;
    if(filterStatus!=='all' && c.kind!==filterStatus) return false;
    if(query){
      const hay = `${c.title} ${c.subtitle} ${c.summary} ${SECTIONS[c.journey].label}`.toLowerCase();
      if(!hay.includes(query)) return false;
    }
    return true;
  }

  // ---------------- sidebar: view toggle ----------------
  document.getElementById('viewToggle').addEventListener('click', e=>{
    const btn = e.target.closest('button'); if(!btn) return;
    view = btn.dataset.view;
    document.querySelectorAll('#viewToggle button').forEach(b=>b.classList.toggle('is-active', b===btn));
    render();
  });

  // ---------------- sidebar: filters accordion ----------------
  const filtersToggle = document.getElementById('filtersToggle');
  const filtersBody = document.getElementById('filtersBody');
  filtersToggle.addEventListener('click', ()=>{
    const open = filtersBody.hidden;
    filtersBody.hidden = !open;
    filtersToggle.classList.toggle('is-open', open);
  });

  els.statusOptions.innerHTML = KIND_ORDER.map(v=>
    `<button class="facet-opt${v==='all'?' is-active':''}" data-status="${v}">${v==='all' ? 'All kinds' : STATUS_LABEL[v]}</button>`).join('');
  els.statusOptions.addEventListener('click', e=>{
    const btn = e.target.closest('button'); if(!btn) return;
    filterStatus = btn.dataset.status;
    els.statusOptions.querySelectorAll('button').forEach(b=>b.classList.toggle('is-active', b===btn));
    render();
  });

  els.dataTypeOptions.innerHTML = `<button class="facet-opt is-active" data-dt="all">All streams</button>` +
    Object.entries(DATATYPE_LABEL).map(([k,l])=>`<button class="facet-opt" data-dt="${k}">${ICONS[k]}${l}</button>`).join('');
  els.dataTypeOptions.addEventListener('click', e=>{
    const btn = e.target.closest('button'); if(!btn) return;
    filterDataType = btn.dataset.dt;
    els.dataTypeOptions.querySelectorAll('button').forEach(b=>b.classList.toggle('is-active', b===btn));
    render();
  });

  // ---------------- sidebar: story quick list (tree mode) ----------------
  function renderDomainList(){
    const counts = {}; STORY_CAPABILITIES.forEach(c=>counts[c.journey]=(counts[c.journey]||0)+1);
    const allRow = `<button class="domain-item${filterJourney==='all'?' is-active':''}" data-journey="all">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18z"/></svg>
        <span class="lbl">All stages</span><span class="cnt">${STORY_CAPABILITIES.length}</span></button>`;
    const rows = Object.entries(SECTIONS).map(([k,d])=>
      `<button class="domain-item${filterJourney===k?' is-active':''}" data-journey="${k}" style="color:hsl(${d.hue} var(--stage-s) var(--stage-l))">
        ${d.icon}<span class="lbl" style="color:var(--ink-soft)">${d.label}</span><span class="cnt">${counts[k]||0}</span></button>`).join('');
    els.domainList.innerHTML = allRow + rows;
  }
  els.domainList.addEventListener('click', e=>{
    const btn = e.target.closest('[data-journey]'); if(!btn) return;
    filterJourney = btn.dataset.journey;
    render();
  });

  // ---------------- search ----------------
  els.searchInput.addEventListener('input', e=>{ query = e.target.value.trim().toLowerCase(); render(); });

  // ---------------- cluster navigation ----------------
  const AXIS_OPTIONS = [['journey','Story'],['pipelinecluster','Pipeline'],['keywords','Keywords']];
  function renderAxisPill(){
    document.getElementById('axisPill').innerHTML = AXIS_OPTIONS.map(([v,l])=>
      `<button data-axis="${v}"${axis===v?' class="is-active"':''}>${l}</button>`).join('');
  }

  // ---------------- axis toggle (cluster mode) ----------------
  document.getElementById('axisPill').addEventListener('click', e=>{
    const btn = e.target.closest('button'); if(!btn) return;
    axis = btn.dataset.axis;
    document.querySelectorAll('#axisPill button').forEach(b=>b.classList.toggle('is-active', b===btn));
    pinnedKeyword = null;
    filterPipelineLayer = 'all';
    renderCluster();
  });

  els.legendToggle.addEventListener('click',()=>{
    const collapsed=els.legendPanel.classList.toggle('is-collapsed');
    els.legendToggle.setAttribute('aria-expanded',String(!collapsed));
    els.legendToggle.setAttribute('aria-label',collapsed?'Expand right sidebar':'Collapse right sidebar');
  });

  // ---------------- cluster view dispatch ----------------
  function resetClusterCanvas(){
    els.canvasBox.querySelectorAll('.node,.knode,.map-annotation').forEach(n=>n.remove());
    els.connSvg.innerHTML='';
    els.connSvg.setAttribute('viewBox','0 0 100 100');
    els.connSvg.setAttribute('preserveAspectRatio','none');
    hideHoverCard();
  }
  function renderCluster(){
    els.systemView.hidden = mapStyle!=='system';
    els.viewport.hidden = mapStyle!=='legacy';
    els.canvasTools.hidden = mapStyle!=='legacy';
    if(mapStyle==='system'){
      renderSystemMap();
    } else {
      resetClusterCanvas();
      if(axis==='keywords'){ renderKeywordLegend(); renderKeywordGraph(); }
      else if(axis==='pipelinecluster'){ renderPipelineLegend(); positionPipelineNodes(); }
      else { renderLegend(); positionStoryNodes(); }
      applyZoom();
    }
  }

  // ---------------- legend (cluster mode) ----------------
  function renderLegend(){
    const list = axis==='journey' ? SECTIONS : Object.fromEntries(Object.entries(DATATYPE_LABEL).map(([k,l])=>[k,{label:l, icon:ICONS[k], hue:null}]));
    els.legendTitle.textContent = axis==='journey' ? 'Story' : 'Data Stream';
    const activeKey = axis==='journey' ? filterJourney : filterDataType;
    els.legendList.innerHTML = Object.entries(list).map(([k,d])=>{
      const active = activeKey===k;
      const color = d.hue!=null ? `style="color:hsl(${d.hue} var(--stage-s) var(--stage-l))"` : '';
      const count=STORY_CAPABILITIES.filter(c=>(axis==='journey'?c.journey:c.primaryDataType)===k).length;
      return `<button class="legend-item${active?' is-active':''}" data-key="${k}" ${color}><span class="legend-symbol">${d.icon}</span><span style="flex:1;color:var(--ink-soft)">${d.label}</span><span class="cnt">${count}</span></button>`;
    }).join('');
    els.legendHint.textContent = axis==='journey'
      ? 'Arrows show the authored story sequence. Hover or focus a card to emphasise its previous and next claims; click for sourced details.'
      : 'Hover a node to see connections to the same story stage.';
  }
  els.legendList.addEventListener('click', e=>{
    const btn = e.target.closest('[data-key]'); if(!btn) return;
    const k = btn.dataset.key;
    if(axis==='keywords'){ togglePinKeyword(k); return; }
    if(axis==='journey'){ filterJourney = filterJourney===k ? 'all' : k; }
    else { filterDataType = filterDataType===k ? 'all' : k; }
    render();
  });

  function renderKeywordLegend(){
    els.legendTitle.textContent = 'Keywords';
    const sorted = [...STORY_KEYWORDS].sort((a,b)=> b.capabilities.length - a.capabilities.length);
    els.legendList.innerHTML = sorted.map(k=>{
      const active = pinnedKeyword===k.id;
      return `<button class="legend-item${active?' is-active':''}" data-key="${k.id}"><span style="flex:1">${k.label}</span><span class="cnt">${k.capabilities.length}</span></button>`;
    }).join('');
    els.legendHint.textContent = 'Click a keyword to pin its connections — or hover any node on the map to preview.';
  }

  function renderPipelineLegend(){
    els.legendTitle.textContent = 'Pipeline Stage';
    els.legendList.innerHTML = Object.entries(LAYER_META).map(([k,d])=>{
      const active = filterPipelineLayer===k;
      return `<button class="legend-item${active?' is-active':''}" data-layer="${k}" style="color:hsl(${d.hue} var(--stage-s) var(--stage-l))">${d.icon}<span>${d.label}</span></button>`;
    }).join('');
    els.legendHint.textContent = 'Hover a node to see other items with the same delivery status. Click a card to open its details — click a stage below to filter.';
  }
  els.legendList.addEventListener('click', e=>{
    const btn = e.target.closest('[data-layer]'); if(!btn) return;
    filterPipelineLayer = filterPipelineLayer===btn.dataset.layer ? 'all' : btn.dataset.layer;
    renderPipelineLegend();
    applyPipelineFilterDim();
  });

  // ---------------- authored system views ----------------
  const STATUS_META = {
    implemented:['Implemented','Current library or validated pipeline'],
    experiment:['Experiment','Reported HANCOCK evaluation'],
    planned:['Planned','Documented direction, not shipped'],
    context:['Context','Dataset or wider ecosystem']
  };
  function systemNode(id,status,type,title,detail,extra=''){
    const c=id?CAPABILITIES.find(x=>x.id===id):null;
    const dim=c&&!matches(c);
    return `<button class="system-node${dim?' is-dim':''}" data-id="${id}" data-status="${status}"><span class="node-top"><i class="status-dot ${status}"></i><span class="node-type">${type} · ${STATUS_META[status][0]}</span></span><strong>${title}</strong><small>${detail}</small>${extra}</button>`;
  }
  function flowArrow(){ return `<div class="flow-arrow"><span></span><span aria-hidden="true">↓</span></div>`; }
  function renderStatusLegend(){
    els.legendTitle.textContent='Delivery status';
    els.legendList.innerHTML=`<div class="status-legend">${Object.entries(STATUS_META).map(([k,v])=>`<div class="status-row"><i class="status-dot ${k}"></i><span>${v[0]}</span></div>`).join('')}</div><p class="status-note">Arrows show authored data or dependency flow. Shared tags do not create edges.</p>`;
    els.legendHint.textContent=axis==='pipeline'?'Read from inputs at the top to evaluation below.':axis==='evidence'?'Follow cohort through evaluation design to results.':'Columns identify each concept type and its role.';
  }
  function renderPipelineMap(){
    const n=systemNode;
    return `<header class="map-heading"><div><h2>How KaleCancer turns patient data into risk over time</h2><p>A functional view of the pipeline. Every arrow represents data flow; status markers separate implemented components from planned scope and experimental evidence.</p></div><span class="map-key">TOP → BOTTOM</span></header><div class="architecture">
    <section class="arch-layer"><div class="layer-label"><b>Inputs</b><span>patient modalities</span></div><div class="layer-content">${n('reading-clinical','implemented','Clinical','Clinical table','Baseline covariates, categories and missing values.')}${n('reading-imaging','implemented','Pathology','Whole-slide imaging','Primary-tumour UNI-embedded patch bags.')}${n('broader-landscape','planned','Radiology','CT / MRI / PET adapters','Named in project scope; outside the evaluated HANCOCK path.')}</div></section>${flowArrow()}
    <section class="arch-layer"><div class="layer-label"><b>Load & prepare</b><span>leakage-safe inputs</span></div><div class="layer-content two">${n('one-pipeline','implemented','loaddata','Cohort loading and splitting','Dataset access, matching and leakage-safe partitions.')}${n('one-pipeline','implemented','prepdata','Modality preprocessing','Imputation, encoding and WSI bag preparation.')}</div></section>${flowArrow()}
    <section class="arch-layer"><div class="layer-label"><b>Encode</b><span>representations</span></div><div class="layer-content two">${n('reading-clinical','implemented','Encoder','TabICL → 64-d','Frozen 512-d representation with trained projection.')}${n('reading-imaging','implemented','Encoder','Attention-MIL → 64-d','Trained 128-d WSI representation with projection.')}</div></section>${flowArrow()}
    <section class="arch-layer"><div class="layer-label"><b>Fuse</b><span>configuration</span></div><div class="layer-content">${n('fusion-config','implemented','Fusion','Early','Join raw features before a shared encoder.')}${n('fusion-config','implemented','Fusion','Intermediate','Join embeddings before a shared head.')}${n('fusion-config','implemented','Fusion','Late','Join modality-specific risk scores.')}</div></section>${flowArrow()}
    <section class="arch-layer"><div class="layer-label"><b>Predict</b><span>outcome model</span></div><div class="layer-content two">${n('risk-over-time','implemented','Survival','Cox proportional-hazards head','Bias-free head with Cox partial-likelihood loss.').replace('system-node','system-node fusion-node')}${n('risk-over-time','planned','Classification','Classification / regression heads','The current repository marks these heads as planned.')}</div></section>${flowArrow()}
    <section class="arch-layer"><div class="layer-label"><b>Evaluate</b><span>decision support</span></div><div class="layer-content four">${n('beats-alone','implemented','Metric',"Harrell's C-index",'Ranking concordance.')}${n('fusion-method-wins','implemented','Metric','Time-dependent AUC','At 1, 2 and 3 years.')}${n('risk-over-time','implemented','Metric','Integrated Brier','Prediction error over time.')}${n('risk-over-time','implemented','Interpret','Kaplan–Meier','Survival visualisation.')}</div></section></div>`;
  }
  function renderEvidenceMap(){
    const n=systemNode; const metrics=`<div class="evidence-metrics"><span><b>0.665</b>Clinical</span><span><b>0.678</b>Imaging</span><span><b>0.713</b>Combined</span></div>`;
    return `<header class="map-heading"><div><h2>How the evidence was produced</h2><p>Cohort, protocols and results are separate entities, so evidence cannot be mistaken for software architecture.</p></div><span class="map-key">COHORT → TEST → RESULT</span></header><div class="evidence-map"><div class="evidence-column"><h3>Dataset</h3>${n('hancock-benchmark','context','Dataset','HANCOCK','Public multimodal head-and-neck cohort.')}${n('one-pipeline','experiment','Cohort','763 patients','End-to-end evaluation cohort.')}</div><div class="evidence-arrow">→</div><div class="evidence-column"><h3>Evaluation design</h3>${n('four-ways','experiment','Protocol','Representative','Dissimilar to nearest neighbour.')}${n('four-ways','experiment','Protocol','Divergent','Dissimilar from one another.')}${n('four-ways','experiment','Protocol','Oropharynx + 5-fold CV','Site holdout and repeated CV.')}</div><div class="evidence-arrow">→</div><div class="evidence-column"><h3>Reported comparison</h3>${n('beats-alone','experiment','Result','Combined beats either stream','Representative split, C-index.',metrics)}${n('four-ways','experiment','Robustness','Combined wins in all four setups','Inspect uncertainty before generalising.')}${n('fusion-method-wins','experiment','Directional','Fusion-method comparison','Product-of-experts leads, subject to the source-table caution.')}</div></div><div class="map-caution"><b>Interpretation boundary:</b> Internal cohort experiments, not external clinical validation. The fusion-method pairing remains directional until checked against the original slide.</div>`;
  }
  function renderConceptMap(){
    const n=systemNode;
    return `<header class="map-heading"><div><h2>Concept network</h2><p>Concepts are grouped by entity type and follow authored project relationships rather than shared tags.</p></div><span class="map-key">TYPED RELATIONSHIPS</span></header><div class="concept-map"><section class="concept-column"><h3>Dataset</h3>${n('hancock-benchmark','context','Dataset','HANCOCK','Clinical + pathology.')}${n('one-pipeline','experiment','Cohort','763 patients','Evaluation cohort.')}</section><section class="concept-column"><h3>Modality</h3>${n('reading-clinical','implemented','Stream','Clinical','Tabular covariates.')}${n('reading-imaging','implemented','Stream','Pathology WSI','Patch bags.')}${n('broader-landscape','planned','Stream','Radiology','Wider scope.')}</section><section class="concept-column"><h3>Model</h3>${n('reading-clinical','implemented','Encoder','TabICL','Clinical representation.')}${n('reading-imaging','implemented','Encoder','Attention-MIL','WSI representation.')}${n('fusion-config','implemented','Fusion','Fusion methods','Concat, PoE, low-rank.')}</section><section class="concept-column"><h3>Outcome</h3>${n('risk-over-time','implemented','Survival','Cox risk score','Time-to-event output.')}${n('gap-binary','context','Contrast','Binary mortality','Benchmark limitation.')}</section><section class="concept-column"><h3>Evidence</h3>${n('beats-alone','experiment','Metric','C-index','Discrimination.')}${n('fusion-method-wins','experiment','Metric','td-AUC','Time-specific ranking.')}${n('risk-over-time','implemented','Metric','Brier + KM','Calibration + interpretation.')}</section></div><div class="relation-strip"><span>HANCOCK supplies Clinical + WSI</span><span>Clinical → TabICL</span><span>WSI → Attention-MIL</span><span>Embeddings → configurable fusion</span><span>Fusion → Cox head</span><span>Risk → survival metrics</span><span>MOGONET = wider PyKale context</span></div>`;
  }
  function renderSystemMap(){
    renderStatusLegend();
    els.systemView.innerHTML=axis==='pipeline'?renderPipelineMap():axis==='evidence'?renderEvidenceMap():renderConceptMap();
    els.systemView.querySelectorAll('.system-node[data-id]').forEach(node=>node.addEventListener('click',()=>openPanel(node.dataset.id,node)));
  }

  // ---------------- legacy free-layout canvas (retained, not rendered) ----------------
  function storyNodeVisible(id){ const c=STORY_CAPABILITIES.find(x=>x.id===id); return c&&matches(c); }
  function drawStoryEdges(activeId=null){
    const lines=STORY_EDGES.map(([from,to])=>{
      const a=STORY_LAYOUT[from],b=STORY_LAYOUT[to];
      if(!a||!b||!storyNodeVisible(from)||!storyNodeVisible(to)) return '';
      const active=activeId&&(from===activeId||to===activeId),muted=activeId&&!active;
      return `<line class="story-edge${active?' is-active':''}${muted?' is-muted':''}" x1="${a.x}%" y1="${a.y}%" x2="${b.x}%" y2="${b.y}%"/>`;
    }).join('');
    els.connSvg.innerHTML=lines;
  }
  function positionStoryNodes(){
    els.connSvg.setAttribute('viewBox','0 0 100 100'); els.connSvg.setAttribute('preserveAspectRatio','none');
    els.canvasBox.insertAdjacentHTML('beforeend','<div class="map-annotation cluster-map-heading"><h2>The case for KaleCancer</h2><p>Read left to right from the clinical problem through the benchmark gaps, the implemented response, evidence, wider context and the next cohort.</p></div>');
    drawStoryEdges();
    STORY_CAPABILITIES.forEach(c=>{
      const xy=STORY_LAYOUT[c.id]; if(!xy)return; const d=SECTIONS[c.journey];
      const btn=document.createElement('button'); btn.className='node story-node'; btn.dataset.id=c.id; btn.style.left=xy.x+'%'; btn.style.top=xy.y+'%'; btn.style.color=`hsl(${d.hue} var(--stage-s) var(--stage-l))`;
      btn.setAttribute('aria-label',`${c.title}, ${d.label}`); btn.innerHTML=`${d.icon}<span class="node-copy"><b>${c.title}</b></span>`;
      btn.addEventListener('mouseenter',()=>hoverStoryNode(c)); btn.addEventListener('focus',()=>hoverStoryNode(c)); btn.addEventListener('mouseleave',clearStoryHover); btn.addEventListener('blur',clearStoryHover); btn.addEventListener('click',()=>openPanel(c.id,btn)); els.canvasBox.appendChild(btn);
    });
    applyStoryFilterDim();
  }
  function hoverStoryNode(c){
    const neighbours=new Set(); STORY_EDGES.forEach(([a,b])=>{if(a===c.id)neighbours.add(b);if(b===c.id)neighbours.add(a);});
    els.canvasBox.querySelectorAll('.story-node').forEach(n=>n.style.opacity=(n.dataset.id===c.id||neighbours.has(n.dataset.id))?'1':'.3'); drawStoryEdges(c.id);
    const previous=STORY_EDGES.filter(([,b])=>b===c.id).map(([a])=>CAPABILITIES.find(x=>x.id===a)?.title).filter(Boolean);
    const next=STORY_EDGES.filter(([a])=>a===c.id).map(([,b])=>CAPABILITIES.find(x=>x.id===b)?.title).filter(Boolean);
    showHoverCard({badge:`Stage ${Object.keys(SECTIONS).indexOf(c.journey)+1} · ${SECTIONS[c.journey].label}`,title:c.title,subtitle:c.subtitle,rows:[['Comes from',previous.join('; ')||'Start of the story'],['Leads to',next.join('; ')||'End of the story']]});
  }
  function clearStoryHover(){ applyStoryFilterDim(); hideHoverCard(); }
  function applyStoryFilterDim(){ els.canvasBox.querySelectorAll('.story-node').forEach(n=>{const ok=storyNodeVisible(n.dataset.id);n.style.opacity=ok?'1':'.42';n.style.pointerEvents=ok?'auto':'none';}); drawStoryEdges(); }

  function secondaryValue(c){ return axis==='journey' ? c.primaryDataType : c.journey; }

  function positionNodes(){
    const pos = LAYOUTS[axis];
    els.connSvg.setAttribute('viewBox','0 0 100 100');
    els.connSvg.setAttribute('preserveAspectRatio','none');
    els.connSvg.innerHTML = '';
    els.canvasBox.querySelectorAll('.node,.knode').forEach(n=>n.remove());
    STORY_CAPABILITIES.forEach(c=>{
      const xy = pos[c.id]; if(!xy) return;
      const d = SECTIONS[c.journey];
      const icon = axis==='journey' ? d.icon : ICONS[c.primaryDataType];
      const btn = document.createElement('button');
      btn.className = 'node';
      btn.dataset.id = c.id;
      btn.style.left = xy.x+'%'; btn.style.top = xy.y+'%';
      btn.style.color = `hsl(${d.hue} var(--stage-s) var(--stage-l))`;
      btn.setAttribute('data-label', c.title);
      btn.setAttribute('aria-label', `${c.title}, ${d.label}`);
      btn.innerHTML = icon;
      btn.addEventListener('mouseenter', ()=>hoverNode(c));
      btn.addEventListener('focus', ()=>hoverNode(c));
      btn.addEventListener('mouseleave', clearHover);
      btn.addEventListener('blur', clearHover);
      btn.addEventListener('click', ()=>openPanel(c.id, btn));
      els.canvasBox.appendChild(btn);
    });
    applyFilterDim();
  }

  function hoverNode(c){
    const pos = LAYOUTS[axis];
    const related = CAPABILITIES.filter(o => o.id!==c.id && secondaryValue(o)===secondaryValue(c));
    els.canvasBox.querySelectorAll('.node').forEach(n=>{
      const isSelf = n.dataset.id===c.id;
      const isRelated = related.some(r=>r.id===n.dataset.id);
      n.style.opacity = (isSelf || isRelated) ? '1' : '.15';
    });
    const a = pos[c.id];
    els.connSvg.innerHTML = related.map(r=>{
      const b = pos[r.id]; if(!a||!b) return '';
      return `<line x1="${a.x}%" y1="${a.y}%" x2="${b.x}%" y2="${b.y}%"/>`;
    }).join('');
    els.connSvg.setAttribute('viewBox','0 0 100 100');
    els.connSvg.setAttribute('preserveAspectRatio','none');

    const secLabel = axis==='journey' ? DATATYPE_LABEL[c.primaryDataType] : SECTIONS[c.journey].label;
    capabilityHoverCard(c, `${related.length} connected in "${secLabel}"`);
  }
  function clearHover(){
    els.connSvg.innerHTML = '';
    applyFilterDim();
    hideHoverCard();
  }

  function capabilityHoverCard(c, badge){
    const d = SECTIONS[c.journey];
    showHoverCard({
      badge,
      title: c.title,
      subtitle: c.subtitle,
      rows: [
        ['Story stage', d.label],
        ['Data stream', DATATYPE_LABEL[c.primaryDataType]],
      ]
    });
  }
  function showHoverCard({badge, title, subtitle, rows}){
    els.hoverCard.innerHTML = `
      <div class="hover-card-badge">${badge}</div>
      <div class="hover-card-title">${title}</div>
      ${subtitle ? `<div class="hover-card-sub">${subtitle}</div>` : ''}
      <div class="hover-card-meta">${rows.map(r=>`<div><b>${r[0]}:</b> ${r[1]}</div>`).join('')}</div>
    `;
    els.hoverCard.hidden = false;
  }
  function hideHoverCard(){ els.hoverCard.hidden = true; }

  function applyFilterDim(){
    els.canvasBox.querySelectorAll('.node').forEach(n=>{
      const c = CAPABILITIES.find(x=>x.id===n.dataset.id);
      n.style.opacity = matches(c) ? '1' : '.12';
      n.style.pointerEvents = matches(c) ? 'auto' : 'none';
    });
  }

  // ---------------- pipeline cluster (free-form layout of the Structured > Pipeline items) ----------------
  function pipelineNodeVisible(node){ const c=CAPABILITIES.find(x=>x.id===node.capId); return (filterPipelineLayer==='all'||node.layer===filterPipelineLayer)&&matches(c); }
  function drawPipelineEdges(activeKey=null){
    const defs=`<defs><marker id="pipeline-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--accent)"/></marker><marker id="pipeline-arrow-planned" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--status-partial)"/></marker></defs>`;
    const lines=PIPELINE_EDGES.map(([from,to,kind])=>{const a=PIPELINE_LAYOUT[from],b=PIPELINE_LAYOUT[to],f=PIPELINE_NODES.find(n=>n.key===from),t=PIPELINE_NODES.find(n=>n.key===to);if(!a||!b||!pipelineNodeVisible(f)||!pipelineNodeVisible(t))return '';const active=activeKey&&(from===activeKey||to===activeKey),muted=activeKey&&!active;return `<line class="pipeline-edge${kind==='planned'?' is-planned':''}${active?' is-active':''}${muted?' is-muted':''}" x1="${a.x}%" y1="${a.y}%" x2="${b.x}%" y2="${b.y}%"/>`;}).join('');
    els.connSvg.innerHTML=defs+lines;
  }
  function positionPipelineNodes(){
    els.connSvg.setAttribute('viewBox','0 0 100 100');
    els.connSvg.setAttribute('preserveAspectRatio','none');
    drawPipelineEdges();
    els.canvasBox.insertAdjacentHTML('beforeend','<div class="map-annotation cluster-map-heading"><h2>How KaleCancer turns patient data into risk over time</h2><p>A functional view of the pipeline. Every arrow represents data flow; status markers separate implemented components from planned scope and experimental evidence.</p></div>');
    PIPELINE_NODES.forEach(node=>{
      const xy = PIPELINE_LAYOUT[node.key]; if(!xy) return;
      const d = LAYER_META[node.layer];
      const btn = document.createElement('button');
      btn.className = 'node pipeline-node';
      btn.dataset.key = node.key;
      btn.dataset.status = node.status;
      btn.style.left = xy.x+'%'; btn.style.top = xy.y+'%';
      btn.style.color = `hsl(${d.hue} var(--stage-s) var(--stage-l))`;
      btn.setAttribute('data-label', node.title);
      btn.setAttribute('aria-label', `${node.title}, ${d.label}`);
      btn.innerHTML = `${d.icon}<span class="node-copy"><b>${node.title}</b>${node.status==='planned'?'<small>Planned</small>':''}</span>`;
      btn.addEventListener('mouseenter', ()=>hoverPipelineNode(node));
      btn.addEventListener('focus', ()=>hoverPipelineNode(node));
      btn.addEventListener('mouseleave', clearPipelineHover);
      btn.addEventListener('blur', clearPipelineHover);
      btn.addEventListener('click', ()=>openPanel(node.capId, btn));
      els.canvasBox.appendChild(btn);
    });
    applyPipelineFilterDim();
  }
  function hoverPipelineNode(node){
    const neighbourKeys=new Set(); PIPELINE_EDGES.forEach(([a,b])=>{if(a===node.key)neighbourKeys.add(b);if(b===node.key)neighbourKeys.add(a);});
    const related = PIPELINE_NODES.filter(o=>neighbourKeys.has(o.key));
    els.canvasBox.querySelectorAll('.node').forEach(n=>{
      const isSelf = n.dataset.key===node.key;
      const isRelated = neighbourKeys.has(n.dataset.key);
      n.style.opacity = (isSelf || isRelated) ? '1' : '.15';
    });
    drawPipelineEdges(node.key);

    const c = CAPABILITIES.find(x=>x.id===node.capId);
    showHoverCard({
      badge: `${related.length} also "${STATUS_META[node.status][0]}"`,
      title: node.title,
      subtitle: node.detail,
      rows: [
        ['Pipeline stage', LAYER_META[node.layer].label],
        ['Status', STATUS_META[node.status][0]],
        ['Full card', c ? c.title : '—'],
      ]
    });
  }
  function clearPipelineHover(){
    applyPipelineFilterDim();
    hideHoverCard();
  }
  function applyPipelineFilterDim(){
    els.canvasBox.querySelectorAll('.node').forEach(n=>{
      const node = PIPELINE_NODES.find(x=>x.key===n.dataset.key);
      const c = CAPABILITIES.find(x=>x.id===node.capId);
      const ok = pipelineNodeVisible(node);
      n.style.opacity = ok ? '1' : '.12';
      n.style.pointerEvents = ok ? 'auto' : 'none';
    });
    drawPipelineEdges();
  }

  // ---------------- keyword graph (bipartite: cards <-> keywords) ----------------
  function renderKeywordGraph(){
    const { capPos, kwPos } = KEYWORD_LAYOUT;

    els.connSvg.setAttribute('viewBox','0 0 1180 720');
    els.connSvg.removeAttribute('preserveAspectRatio');
    let edgesHtml = '';
    STORY_KEYWORDS.forEach(k=>{
      k.capabilities.forEach(cid=>{
        const a = capPos[cid], b = kwPos[k.id];
        if(!a || !b) return;
        edgesHtml += `<line class="edge-base" data-cap="${cid}" data-keyword="${k.id}" x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}"/>`;
      });
    });
    els.connSvg.innerHTML = edgesHtml;
    els.canvasBox.insertAdjacentHTML('beforeend',`<div class="map-annotation keyword-core-label"><b>${STORY_CAPABILITIES.length} key points</b><br>Explore their shared concepts</div>`);

    STORY_CAPABILITIES.forEach(c=>{
      const d = SECTIONS[c.journey];
      const pos = capPos[c.id];
      const btn = document.createElement('button');
      btn.className = 'node';
      btn.dataset.id = c.id; btn.dataset.type = 'capability';
      btn.style.left = pos.x+'px'; btn.style.top = pos.y+'px';
      btn.style.color = `hsl(${d.hue} var(--stage-s) var(--stage-l))`;
      btn.setAttribute('data-label', c.title);
      btn.setAttribute('aria-label', `${c.title}, ${d.label}`);
      btn.innerHTML = d.icon;
      const showCapHover = ()=>{
        paintKeywordFocus({id:c.id, type:'capability'});
        const kwCount = STORY_KEYWORDS.filter(k=>k.capabilities.includes(c.id)).length;
        capabilityHoverCard(c, `${kwCount} connected keyword${kwCount===1?'':'s'}`);
      };
      const hideCapHover = ()=>{ keywordFocusRevert(); hideHoverCard(); };
      btn.addEventListener('mouseenter', showCapHover);
      btn.addEventListener('focus', showCapHover);
      btn.addEventListener('mouseleave', hideCapHover);
      btn.addEventListener('blur', hideCapHover);
      btn.addEventListener('click', ()=>openPanel(c.id, btn));
      els.canvasBox.appendChild(btn);
    });

    STORY_KEYWORDS.forEach(k=>{
      const pos = kwPos[k.id];
      const btn = document.createElement('button');
      btn.className = 'knode';
      btn.dataset.id = k.id; btn.dataset.type = 'keyword';
      btn.style.left = pos.x+'px'; btn.style.top = pos.y+'px';
      btn.textContent = k.label;
      btn.setAttribute('aria-label', `${k.label} — ${k.capabilities.length} points`);
      btn.addEventListener('mouseenter', ()=>paintKeywordFocus({id:k.id, type:'keyword'}));
      btn.addEventListener('focus', ()=>paintKeywordFocus({id:k.id, type:'keyword'}));
      btn.addEventListener('mouseleave', keywordFocusRevert);
      btn.addEventListener('blur', keywordFocusRevert);
      btn.addEventListener('click', ()=>togglePinKeyword(k.id));
      els.canvasBox.appendChild(btn);
    });

    applyKeywordFilterDim();
    markPinnedNode();
    paintKeywordFocus(pinnedKeyword ? { id:pinnedKeyword, type:'keyword' } : null);
  }

  function paintKeywordFocus(focus){
    const lines = els.connSvg.querySelectorAll('line');
    const nodes = els.canvasBox.querySelectorAll('.node,.knode');
    if(!focus){
      lines.forEach(l=>{ l.style.opacity='.4'; l.style.stroke='var(--line-strong)'; l.style.strokeWidth='1'; });
      nodes.forEach(n=> n.style.opacity = (n.classList.contains('node') && n.style.pointerEvents==='none') ? '.12' : '1');
      return;
    }
    const relCaps = new Set(focus.type==='capability' ? [focus.id] : (STORY_KEYWORDS.find(k=>k.id===focus.id)||{capabilities:[]}).capabilities);
    const relKeywords = new Set(focus.type==='keyword' ? [focus.id] : STORY_KEYWORDS.filter(k=>k.capabilities.includes(focus.id)).map(k=>k.id));
    lines.forEach(l=>{
      const on = relCaps.has(l.dataset.cap) && relKeywords.has(l.dataset.keyword);
      l.style.opacity = on ? '.9' : '.05';
      l.style.stroke = on ? 'var(--accent)' : 'var(--line-strong)';
      l.style.strokeWidth = on ? '1.6' : '1';
    });
    nodes.forEach(n=>{
      const on = n.dataset.type==='capability' ? relCaps.has(n.dataset.id) : relKeywords.has(n.dataset.id);
      n.style.opacity = on ? '1' : '.2';
    });
  }
  function keywordFocusRevert(){
    paintKeywordFocus(pinnedKeyword ? { id:pinnedKeyword, type:'keyword' } : null);
  }
  function togglePinKeyword(id){
    pinnedKeyword = pinnedKeyword===id ? null : id;
    markPinnedNode();
    paintKeywordFocus(pinnedKeyword ? { id:pinnedKeyword, type:'keyword' } : null);
    if(!els.legendPanel.hidden && axis==='keywords') renderKeywordLegend();
  }
  function markPinnedNode(){
    els.canvasBox.querySelectorAll('.knode').forEach(n=> n.classList.toggle('is-pinned', n.dataset.id===pinnedKeyword));
  }
  function applyKeywordFilterDim(){
    els.canvasBox.querySelectorAll('.node').forEach(n=>{
      const c = CAPABILITIES.find(x=>x.id===n.dataset.id);
      const ok = matches(c);
      n.style.pointerEvents = ok ? 'auto' : 'none';
      if(!ok) n.style.opacity = '.12';
    });
  }

  function applyZoom(){
    els.canvasBox.style.transform = `translate(${panX}px, ${panY}px) scale(${zoom})`;
  }
  document.getElementById('zoomIn').addEventListener('click', ()=>{ zoom = Math.min(2, +(zoom+0.15).toFixed(2)); applyZoom(); });
  document.getElementById('zoomOut').addEventListener('click', ()=>{ zoom = Math.max(0.55, +(zoom-0.15).toFixed(2)); applyZoom(); });
  document.getElementById('resetView').addEventListener('click', ()=>{ zoom=1; panX=0; panY=0; applyZoom(); });

  els.viewport.addEventListener('wheel', e=>{
    if(view!=='cluster') return;
    e.preventDefault();
    zoom = Math.min(2, Math.max(0.55, +(zoom - e.deltaY*0.0012).toFixed(2)));
    applyZoom();
  }, { passive:false });

  let panning = false, startX=0, startY=0, startPanX=0, startPanY=0;
  els.viewport.addEventListener('pointerdown', e=>{
    if(e.target.closest('.node') || e.target.closest('.knode')) return;
    panning = true; startX=e.clientX; startY=e.clientY; startPanX=panX; startPanY=panY;
    els.viewport.classList.add('is-panning');
    els.viewport.setPointerCapture(e.pointerId);
  });
  els.viewport.addEventListener('pointermove', e=>{
    if(!panning) return;
    panX = startPanX + (e.clientX-startX);
    panY = startPanY + (e.clientY-startY);
    applyZoom();
  });
  els.viewport.addEventListener('pointerup', ()=>{ panning=false; els.viewport.classList.remove('is-panning'); });
  els.viewport.addEventListener('pointerleave', ()=>{ panning=false; els.viewport.classList.remove('is-panning'); });

  // ---------------- story chapters ----------------
  const SECTION_COPY = {
    problem:'Why several patient-data sources and censored outcomes require a coordinated modelling workflow.',
    gaps:'The public case study and three precise extensions beyond its published proof of concept.',
    built:'How reusable loading, encoding, fusion, survival modelling and evaluation fit together.',
    results:'How multimodal inputs and patient partitions are compared consistently in the case study.',
    landscape:'Related multimodal capability available through the wider PyKale ecosystem.',
    ask:'Bring your clinical question and data to shape a rigorous, reproducible KaleCancer study with us.'
  };

  function resultMetrics(c){
    return '';
  }

  function storyCard(c, index, group){
    const d = SECTIONS[c.journey];
    const featured = (group==='problem' && index===0) ? ' is-feature' : (group==='problem' && index===1 ? ' is-side' : '');
    return `<button class="tcard${featured}" data-id="${c.id}" style="--h:${d.hue}">
      <div class="tcard-head">
        <span style="color:hsl(${d.hue} var(--stage-s) var(--stage-l))">${d.icon}</span>
        <div><div class="tcard-title">${c.title}</div><div class="tcard-sub">${c.subtitle}</div></div>
      </div>
      ${resultMetrics(c)}
      <p class="tcard-summary">${c.summary}</p>
      <div class="tcard-mods">${c.dataTypes.map(modChip).join('')}</div>
      <span class="tcard-cta"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"/></svg>${group==='ask'?'Explore collaboration':'View details'}</span>
    </button>`;
  }

  function renderTree(){
    const list = STORY_CAPABILITIES.filter(matches);
    els.treeCount.textContent = `${list.length} of ${STORY_CAPABILITIES.length} key points · six-stage research narrative`;
    if(!list.length){
      els.treeView.innerHTML = `<div class="empty">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
        <p>Nothing matches your filters.</p>
        <button id="clearFilters">Clear filters</button>
      </div>`;
      document.getElementById('clearFilters').addEventListener('click', ()=>{
        filterJourney='all'; filterDataType='all'; filterStatus='all'; query=''; els.searchInput.value='';
        els.statusOptions.querySelectorAll('button').forEach((b,i)=>b.classList.toggle('is-active', i===0));
        els.dataTypeOptions.querySelectorAll('button').forEach((b,i)=>b.classList.toggle('is-active', i===0));
        render();
      });
      return;
    }
    const visibleSections = Object.entries(SECTIONS).filter(([key])=>list.some(c=>c.journey===key));
    const intro = `<div class="story-intro"><img class="hero-cell" src="assets/images/cancer-cell.png" alt="" aria-hidden="true"><p class="story-kicker">Multimodal survival modelling · research narrative</p><h2>From patient data to reliable risk-over-time research.</h2><p>See how a clinical question, the HANCOCK case study and a reusable KaleCancer workflow connect to evaluation and the next study.</p><div class="story-contact"><span>Have a clinical question, cohort or idea to explore with us?</span><a href="https://forms.gle/Z1WkKLNoZXpWQDSr6" target="_blank" rel="noopener">Collaborate with us →</a></div><div class="story-stats"><span class="story-stat"><strong>763</strong><span>HANCOCK patients</span></span><span class="story-stat"><strong>3</strong><span>proposed extensions</span></span><span class="story-stat"><strong>3</strong><span>fusion stages</span></span><span class="story-stat"><strong>${STORY_CAPABILITIES.length}</strong><span>key points</span></span></div></div>`;
    const spine = `<nav class="story-spine" aria-label="Story stages">${Object.entries(SECTIONS).map(([key,d],i)=>`<button class="spine-step${i===0?' is-active':''}" data-scroll-stage="${key}">${d.label}</button>`).join('')}</nav>`;
    const chapters = visibleSections.map(([key,d],sectionIndex)=>{
      const cards = list.filter(c=>c.journey===key);
      const pipeline = key==='built' ? `<div class="pipeline-visual" aria-label="KaleCancer pipeline"><div class="pipe-step"><b>01 · Encode</b><span>TabICL + Attention-MIL</span></div><div class="pipe-step"><b>02 · Fuse</b><span>Early, intermediate, or late</span></div><div class="pipe-step"><b>03 · Evaluate</b><span>C-index, td-AUC, Brier</span></div><div class="pipe-step"><b>04 · Interpret</b><span>Risk over time</span></div></div>` : '';
      return `<section class="story-section chapter-${key}" id="story-${key}" style="--h:${d.hue}"><header class="story-section-head"><span class="section-number">0${sectionIndex+1}</span><div><h2>${d.label}</h2><p>${SECTION_COPY[key]}</p></div><span class="section-count">${cards.length} point${cards.length===1?'':'s'}</span></header><div class="chapter-grid">${pipeline}${cards.map((c,i)=>storyCard(c,i+1,key)).join('')}</div></section>`;
    }).join('');
    els.treeView.innerHTML = intro + spine + chapters;
    els.treeView.querySelectorAll('.tcard').forEach(c=>c.addEventListener('click', ()=>openPanel(c.dataset.id, c)));
    els.treeView.querySelectorAll('[data-scroll-stage]').forEach(btn=>btn.addEventListener('click', ()=>{
      const target = document.getElementById(`story-${btn.dataset.scrollStage}`);
      if(target) target.scrollIntoView({behavior:'smooth',block:'start'});
    }));
    const sections = [...els.treeView.querySelectorAll('.story-section')];
    els.treeView.onscroll = ()=>{
      let active = sections[0]?.id.replace('story-','');
      sections.forEach(s=>{ if(s.getBoundingClientRect().top < 210) active=s.id.replace('story-',''); });
      els.treeView.querySelectorAll('.spine-step').forEach(b=>b.classList.toggle('is-active',b.dataset.scrollStage===active));
    };
  }

  // ---------------- detail overlay ----------------
  function openPanel(id, triggerEl){
    const c = CAPABILITIES.find(x=>x.id===id); if(!c) return;
    const d = SECTIONS[c.journey];
    lastFocused = triggerEl;
    els.panel.style.setProperty('--h', d.hue);
    els.panel.innerHTML = `
      <button class="icon-btn" id="closePanel" aria-label="Close">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
      <div class="panel-tags">
        <span class="stage-pill">${d.icon}${d.label}</span>
      </div>
      <h2>${c.title}</h2>
      <p class="subtitle">${c.subtitle}</p>
      <div class="panel-section"><h4>In plain terms</h4><p>${c.summary}</p></div>
      ${c.journey==='ask' ? `<div class="panel-section"><h4>Get in touch</h4><p>Interested in collaborating on a KaleCancer study? <a href="https://forms.gle/Z1WkKLNoZXpWQDSr6" target="_blank" rel="noopener">Share your details through our collaboration form</a> and we will follow up with you.</p></div>` : ''}
      <div class="panel-section"><h4>Public references</h4><p><a href="https://github.com/pykale/cancer">KaleCancer / PyKale</a> · <a href="https://hancock.research.fau.eu/">HANCOCK dataset</a></p></div>
    `;
    document.getElementById('closePanel').addEventListener('click', closePanel);
    els.scrim.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    document.getElementById('closePanel').focus();
  }
  function closePanel(){
    els.scrim.classList.remove('is-open');
    document.body.style.overflow = '';
    if(lastFocused) lastFocused.focus();
  }
  els.scrim.addEventListener('click', e=>{ if(e.target===els.scrim) closePanel(); });
  document.addEventListener('keydown', e=>{
    if(e.key!=='Escape') return;
    if(els.scrim.classList.contains('is-open')){ closePanel(); return; }
    if(axis==='keywords' && pinnedKeyword){ togglePinKeyword(pinnedKeyword); }
  });

  // ---------------- master render ----------------
  function render(){
    renderDomainList();
    document.querySelectorAll('#viewToggle button').forEach(b=>b.classList.toggle('is-active',b.dataset.view===view));
    document.querySelectorAll('#axisPill button').forEach(b=>b.classList.toggle('is-active',b.dataset.axis===axis));
    els.topbarTree.hidden = view!=='tree';
    els.topbarCluster.hidden = view!=='cluster';
    els.treeView.hidden = view!=='tree';
    els.clusterView.hidden = view!=='cluster';
    els.legendPanel.hidden = view!=='cluster';
    els.domainListWrap.hidden = view!=='tree';

    if(view==='tree'){ renderTree(); }
    else { renderCluster(); }
  }

  renderAxisPill();
  render();
