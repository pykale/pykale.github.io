  const SECTIONS = {
    problem:    { label:'Clinical Need', hue:6,
      icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h4l2-8 4 16 2-8h6"/></svg>' },
    gaps:       { label:'HANCOCK Case Study', hue:38,
      icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3L2 20h20L12 3z"/><path d="M12 10v4"/><circle cx="12" cy="17" r=".6" fill="currentColor" stroke="none"/></svg>' },
    built:      { label:'KaleCancer Workflow', hue:205,
      icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3.2"/><path d="M12 3v2.4M12 18.6V21M21 12h-2.4M5.4 12H3M18.1 5.9l-1.7 1.7M7.6 16.4l-1.7 1.7M18.1 18.1l-1.7-1.7M7.6 7.6L5.9 5.9"/></svg>' },
    results:    { label:'Evaluation', hue:150,
      icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 21V11M10 21V3M16 21v-8M21 21v-4"/></svg>' },
    landscape:  { label:'Wider Capability', hue:265,
      icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.5 3.2 2.5 14.8 0 18M12 3c-2.5 3.2-2.5 14.8 0 18"/></svg>' },
    ask:        { label:'Start the Next Study', hue:330,
      icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h15M13 6l6 6-6 6"/></svg>' },
  };

  const ICONS = {
    clinical: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 3V2h6v1M8 9h8M8 13h8M8 17h5"/></svg>',
    imaging: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.5"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/></svg>',
    combined: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="4"/><circle cx="15" cy="15" r="4"/></svg>',
    omics: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3c0 6 12 12 12 18M18 3c0 6-12 12-12 18M7 8h10M7 16h10"/></svg>',
    general: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l9 5-9 5-9-5 9-5z"/><path d="M3 12l9 5 9-5M3 17l9 5 9-5"/></svg>',
  };
  const DATATYPE_LABEL = { clinical:'Clinical / Tabular', imaging:'Imaging (WSI)', combined:'Combined / Multimodal', omics:'Omics', general:'General / Ecosystem' };

  const CAPABILITIES = [
    { id:'multimodal-by-nature', journey:'problem', primaryDataType:'general', kind:'motivation',
      title:'Multimodal by Nature, Manual in Practice',
      subtitle:"A single patient's record already spans imaging, pathology, and years of follow-up — today, turning that into a prediction means hand-extracting features from each piece separately.",
      dataTypes:['general'],
      summary:"A patient's cancer record spans whole-slide pathology images, immune-stain panels, and clinical history — and an outcome that unfolds over years, not a single point in time. One patient's histology data alone, in the HANCOCK dataset, is a whole-slide image plus seven immune-stain panels. Today, turning this into a usable prediction means extracting features from each modality by hand, one patient at a time.",
      objectives:[
        'The prediction target itself is a curve over years, not a single label',
        "One patient's histology alone: 1 whole-slide image + 7 immune-stain panels (HANCOCK)",
        'Feature extraction today is manual and modality-by-modality',
      ],
      evidence:null, caution:null,
    },
    { id:'clinical-burden', journey:'problem', primaryDataType:'general', kind:'motivation',
      title:'The Clinical Burden',
      subtitle:'Head & neck cancer: roughly 940,000 new cases and 480,000 deaths a year, with 5-year survival as low as 25%.',
      dataTypes:['general'],
      summary:'Outcomes remain poor despite advances in treatment. Head and neck cancer sees an estimated ~940,000 new cases and ~480,000 deaths worldwide each year, with 5-year survival ranging 25–60%. Two structural reasons are named for this: high heterogeneity across modalities, and few biomarkers available in routine clinical care.',
      objectives:[
        '~940,000 new cases / year, ~480,000 deaths / year — GLOBOCAN 2022, via Sun et al., 2025',
        '5-year survival: 25–60%',
        'Named drivers: high heterogeneity across modalities, and few biomarkers in routine care',
      ],
      evidence:'Sun, Hao, et al. "Global burden of head and neck cancer: Epidemiological transitions, inequities, and projections to 2050." Frontiers in Oncology 15 (2025): 1665019.',
      caution:null,
    },
    { id:'routine-data', journey:'problem', primaryDataType:'general', kind:'motivation',
      title:'Routine Data, Rarely Combined',
      subtitle:'Demographics, blood tests, pathology and surgery reports, whole-slide images, tissue microarrays, CT and PET scans — all routinely collected, rarely analysed together.',
      dataTypes:['general'],
      summary:'A typical patient journey — diagnosis, surgery, follow-up — already generates demographics, blood data, whole-slide images (H&E), tissue microarrays (H&E and IHC), pathology and surgery reports, therapy and event data, plus CT and PET scans. All of it is routinely collected. Almost none of it is routinely combined into one prediction.',
      objectives:[
        'Demographics, blood data, pathology report, surgery report, therapy & event data',
        'Whole-slide images (H&E) and tissue microarrays (H&E, IHC)',
        'CT and PET scans',
      ],
      evidence:null, caution:null,
    },
    { id:'hancock-benchmark', journey:'gaps', primaryDataType:'combined', kind:'evidence',
      title:"HANCOCK: the Field's Own Benchmark",
      subtitle:'One of the most complete public multimodal head & neck cancer datasets — and its own authors name two gaps in what it can do.',
      dataTypes:['clinical','imaging','combined'],
      summary:'HANCOCK is a public multimodal head-and-neck cancer dataset combining tabular data (demographics, blood data, pathology and surgery reports, TMA-derived cell densities) with whole-slide images and tissue microarrays. Its own published baseline reaches 0.69 AUC predicting 3-year mortality, and 0.79 AUC predicting mortality over the full 14-year follow-up.',
      objectives:[
        '3-year mortality prediction (first 3 of 14 years follow-up): 0.69 AUC',
        'Overall mortality prediction (full 14-year follow-up): 0.79 AUC',
        'Fusion approach: encode each modality once, concatenate, train a single fixed classifier',
      ],
      evidence:'Dörrich, Marion, et al. "A multimodal dataset for precision oncology in head and neck cancer." Nature Communications 16.1 (2025): 7163.',
      caution:null,
    },
    { id:'gap-binary', journey:'gaps', primaryDataType:'combined', kind:'gap',
      title:'Research gap 2: time-to-event prediction',
      subtitle:'"Will this patient die within 3 years?" — HANCOCK\'s own models answer yes or no, throwing away exactly when.',
      dataTypes:['combined'],
      summary:"HANCOCK's published models predict a binary outcome — will this patient die within a fixed window, yes or no. A binary answer treats a patient who dies at month 4 the same as one who dies at month 35. The dataset's own authors point to Cox-based, time-to-event risk modelling as a natural next step — not yet built into their published benchmark.",
      objectives:[
        'Binary classification loses temporal information a time-to-event model would keep',
        'The HANCOCK authors themselves flag Cox-based risk-over-time modelling as unexplored',
      ],
      evidence:null, caution:null,
    },
    { id:'gap-fusion', journey:'gaps', primaryDataType:'combined', kind:'gap',
      title:'Research gap 1: fusing highly heterogeneous data',
      subtitle:'Features are extracted once, concatenated, then fixed — the authors call end-to-end joint training unexplored.',
      dataTypes:['combined'],
      summary:"HANCOCK's own fusion approach encodes each modality once, concatenates the results, and trains a single fixed classifier on top. There is no joint, end-to-end training across modalities, and no way to try a different fusion strategy without redoing the feature extraction. The dataset's authors call this out directly as unexplored in their own discussion.",
      objectives:[
        'One fixed concatenation, decided once, not a configurable choice',
        'No end-to-end joint training across modalities in the published benchmark',
      ],
      evidence:'"Fusion, once, by hand" — Discussion, Dörrich et al., Nature Communications 2025.',
      caution:null,
    },
    { id:'gap-duplicated', journey:'gaps', primaryDataType:'general', kind:'gap',
      title:'Research gap 3: standardised, reusable evaluation',
      subtitle:'Without a shared tool, separate teams rebuild the same processing-embed-fuse-evaluate pipeline from scratch, with no standard way to compare results.',
      dataTypes:['general'],
      summary:"This third gap isn't named in HANCOCK's own paper — it's the KaleCancer team's own observation about the field: without a unified tool, Team A, Team B and Team C each independently repeat the same steps — processing, embeddings, fusion, evaluation — on the same kind of data, with no standardisation or reproducibility across their results.",
      objectives:[
        'Same four steps (processing → embeddings → fuse → evaluate) rebuilt independently by different teams',
        "No shared tool means no standard way to compare one team's results to another's",
      ],
      evidence:null,
      caution:"This is the KaleCancer team's own framing of a field-wide problem — unlike Gaps 1 and 2, it isn't a limitation named in the HANCOCK paper itself.",
    },
    { id:'one-pipeline', journey:'built', primaryDataType:'combined', kind:'built',
      title:'A reusable multimodal workflow',
      subtitle:'Encode → Fuse → Evaluate → Interpret — over tabular data, imaging, or your next modality — the same code path either way.',
      dataTypes:['clinical','imaging','combined'],
      summary:'What We Built: one pipeline, any combination of data, producing a risk over time rather than a guess. It takes tabular data (D), imaging (WSI), or a future modality, and runs the same Encode → Fuse → Evaluate → Interpret sequence regardless. Verified end-to-end on a real 763-patient cohort — the same code path runs clinical-only, imaging-only, and combined.',
      objectives:[
        'Supports Early, Intermediate, and Late fusion; time-to-event analysis and classification',
        'Same code path runs clinical-only, imaging-only, and combined',
        'Verified end-to-end on a real 763-patient cohort',
      ],
      evidence:'Verified end-to-end on a real 763-patient cohort — the same code path runs clinical-only, imaging-only, and combined.',
      caution:null,
    },
    { id:'fusion-config', journey:'built', primaryDataType:'combined', kind:'built',
      title:'Fusion as a Configuration, Not a Stage',
      subtitle:'FUSION.STAGE picks Early, Intermediate, or Late; FUSION.METHOD picks how they combine — both are settings, not new code.',
      dataTypes:['combined'],
      summary:"Fusion is not a pipeline stage — it's the point at which the modality streams join, and that point is set in a config file. FUSION.STAGE selects one of early (raw features join first, then one encoder and head), intermediate (embeddings join, then one shared head), or late (one head per stream, then the risk scores join). FUSION.METHOD separately selects how they combine: concatenation, product-of-experts, or low-rank tensor.",
      objectives:[
        'Early: fuse raw features, then one encoder and head',
        'Intermediate: fuse embeddings, then one shared Cox head',
        'Late: one head per stream, then fuse the risk scores',
        'All three fusion stages are implemented and unit-tested',
      ],
      evidence:null,
      caution:'Early fusion has not yet been run on a HANCOCK experiment — Intermediate and Late have.',
    },
    { id:'risk-over-time', journey:'built', primaryDataType:'combined', kind:'built',
      title:'Risk Over Time, Not Just a Guess',
      subtitle:"A Cox partial-likelihood loss trains a bias-free linear CoxHead — evaluated with Harrell's C-index, time-dependent AUC, Integrated Brier, and Kaplan–Meier curves.",
      dataTypes:['combined'],
      summary:'Rather than a single classification label, the evaluated path trains a CoxHead — a linear, bias-free head — using a Cox partial-likelihood loss, producing a risk-over-time estimate for each patient. It is evaluated with four complementary metrics: Harrell\'s concordance index (C-index), time-dependent AUC at 1/2/3 years, the Integrated Brier score, and Kaplan–Meier curves. The current repository lists classification and regression prediction heads as planned.',
      objectives:[
        'CoxHead: linear, bias-free, trained with Cox partial-likelihood loss',
        "Evaluated with C-index (Harrell's), td-AUC (1/2/3 years), Integrated Brier, Kaplan–Meier",
        'Classification and regression prediction heads are documented as planned',
      ],
      evidence:null,
      caution:'Decision support only — not a diagnostic tool. Classification and regression heads are roadmap items in the current repository README.',
    },
    { id:'reading-clinical', journey:'built', primaryDataType:'clinical', kind:'built',
      title:'Reading the Clinical Stream',
      subtitle:'4 baseline covariates, imputed and encoded, then passed through TabICL — a frozen 512-dimensional encoder projected down to a trained 64-dimensional embedding.',
      dataTypes:['clinical'],
      summary:'The clinical/tabular stream starts from a clinical table of 4 baseline covariates. After imputing missing values and encoding categories, it is passed through TabICL, a frozen tabular foundation-model encoder producing a 512-dimensional representation, which is then projected down through a trained 64-dimensional layer before reaching the fusion point.',
      objectives:[
        'Load: clinical table, 4 baseline covariates',
        'Prep: impute + encode',
        'Embed: TabICL (frozen) → 512-d, then a trained projection → 64-d',
      ],
      evidence:null, caution:null,
    },
    { id:'reading-imaging', journey:'built', primaryDataType:'imaging', kind:'built',
      title:'Reading the Imaging Stream',
      subtitle:'Primary-tumour whole-slide images, cached as UNI-embedded patch bags, merged and passed through an Attention-MIL encoder.',
      dataTypes:['imaging'],
      summary:'The imaging stream starts from the primary-tumour whole-slide image, cached as UNI-model-embedded patch bags (.h5) restricted to the primary tumour only. After merging the bag, it is passed through Attention-MIL — a trained multiple-instance-learning encoder that learns which patches matter most — producing a 128-dimensional representation, projected down through a trained 64-dimensional layer before fusion.',
      objectives:[
        'Load: primary-tumour WSI, cached UNI-embedded patch bags (.h5)',
        'Prep: bag merge, primary tumour only',
        'Embed: Attention-MIL (trained) → 128-d, then a trained projection → 64-d',
      ],
      evidence:null, caution:null,
    },
    { id:'beats-alone', journey:'results', primaryDataType:'combined', kind:'evidence',
      title:'Beats Either Modality Alone',
      subtitle:'Representative test split: 0.665 C-index clinical alone, 0.678 imaging alone, 0.713 combined — and combined won in every evaluation setup tested.',
      dataTypes:['clinical','imaging','combined'],
      summary:'On the Representative test split, the best combined fusion configuration reached a C-index of 0.713, against 0.678 for imaging alone and 0.665 for clinical alone. This was not a one-off: the same pattern — combined beating either single modality — held across all four evaluation setups tested.',
      objectives:[
        'Tabular (D) alone: 0.649 C-index / 0.698 AUC@1yr (5-fold CV)',
        'Imaging (WSI) alone: 0.646 C-index / 0.684 AUC@1yr (5-fold CV)',
        'Tabular + Imaging combined: 0.672 C-index / 0.735 AUC@1yr (5-fold CV)',
      ],
      evidence:"C-index / AUC@1yr, 5-fold CV — Tabular 0.649 / 0.698, Imaging 0.646 / 0.684, Combined 0.672 / 0.735. Harrell's concordance index.",
      caution:null,
    },
    { id:'four-ways', journey:'results', primaryDataType:'combined', kind:'evidence',
      title:'Evaluation across patient partitions',
      subtitle:'Representative, Divergent, Oropharynx-only, and repeated 5-fold cross-validation — combined data won on every one.',
      dataTypes:['clinical','imaging','combined'],
      summary:'Rather than reporting one convenient split, the pipeline was evaluated four ways: Representative (test cases maximally dissimilar to their nearest neighbour), Divergent (test cases maximally dissimilar to one another), Oropharynx (all oropharynx-cancer patients held out as the entire test set), and repeated 5-fold cross-validation (added by the KaleCancer team, not part of HANCOCK). Combined Tabular+Imaging matched or beat either modality alone on every one.',
      objectives:[
        'Representative — C-index: Tabular 0.665±0.008, Imaging 0.678±0.026, Combined 0.713±0.027',
        'Divergent — C-index: Tabular 0.708±0.006, Imaging 0.718±0.016, Combined 0.762±0.014',
        'Oropharynx — C-index: Tabular 0.661±0.003, Imaging 0.629±0.013, Combined 0.664±0.018',
        '5-fold CV — C-index: Tabular 0.649±0.034, Imaging 0.646±0.042, Combined 0.672±0.032',
      ],
      evidence:"Full evaluation-protocol table, Harrell's C-index ± standard deviation across four splits and three modality configurations.",
      caution:null,
    },
    { id:'fusion-method-wins', journey:'results', primaryDataType:'combined', kind:'evidence',
      title:'Which Fusion Method Wins?',
      subtitle:'5-fold CV, AUC@1yr — Ensemble 0.702, Concatenation 0.720, Product-of-experts 0.735, Low-rank tensor 0.710.',
      dataTypes:['combined'],
      summary:'Beyond choosing early/intermediate/late, KaleCancer also lets you choose how streams combine at that point: ensembling the separate predictions, concatenating the embeddings, a product-of-experts combination, or a low-rank tensor fusion. Product-of-experts scored highest on this slide\'s numbers; concatenation was close behind.',
      objectives:[
        'Ensemble: 0.702 AUC@1yr',
        'Concatenation: 0.720 AUC@1yr',
        'Product-of-experts: 0.735 AUC@1yr',
        'Low-rank tensor: 0.710 AUC@1yr',
      ],
      evidence:null,
      caution:"The source slide does not clearly state whether these four numbers are all Intermediate-fusion, all Late-fusion, or a mix of both — treat this table as directional, and check the original slide before quoting it precisely.",
    },
    { id:'broader-landscape', journey:'landscape', primaryDataType:'general', kind:'context',
      title:'Multimodality in Cancer, Broadly',
      subtitle:"KaleCancer's current focus — tabular plus whole-slide imaging — is one slice of a much wider multimodal-oncology picture.",
      dataTypes:['general','omics'],
      summary:"Radiology (CT, MRI, PET, mammography, ultrasound), digital pathology (whole-slide images, multiplex IHC, tissue microarrays), omics (genomics, epigenomics, proteomics, transcriptomics), and electronic health records (clinical notes, lab results, demographics, event data) all carry information relevant to cancer outcomes. KaleCancer's current, evaluated focus is tabular clinical data plus whole-slide pathology imaging — one deliberately-scoped slice of that wider landscape.",
      objectives:[
        'Radiology: CT, MRI, PET, mammography, ultrasound',
        'Digital pathology: whole-slide images, multiplex IHC, tissue microarrays',
        'Omics: genomics, epigenomics, proteomics, transcriptomics',
        'EHR: clinical notes, lab results, demographics, event data',
      ],
      evidence:null, caution:null,
    },
    { id:'mogonet', journey:'landscape', primaryDataType:'omics', kind:'context',
      title:'MOGONET — Multi-Omics, Elsewhere in PyKale',
      subtitle:'A sibling PyKale module, not KaleCancer itself: DNA methylation, mRNA and miRNA expression combine to call a breast-cancer molecular subtype.',
      dataTypes:['omics'],
      summary:'MOGONET is multi-omics integration built in PyKale generally — one cohort, three molecular modalities (DNA methylation, mRNA expression, miRNA expression), producing a subtype for each patient and a ranked list of named molecules. On the TCGA breast-invasive-carcinoma cohort (n=875), it distinguishes Luminal A, Luminal B, Basal-like, HER2-enriched, and Normal-like subtypes — a classification that drives both treatment and prognosis. It is a PyKale-wide capability, not a KaleCancer-specific one.',
      objectives:[
        'Three modalities: DNA methylation, mRNA expression, miRNA expression',
        'Cohort: TCGA breast invasive carcinoma, n=875',
        'Output: a molecular subtype per patient, plus a ranked list of named contributing molecules',
      ],
      evidence:'Wang, Tongxin, et al. "MOGONET integrates multi-omics data using graph convolutional networks allowing patient classification and biomarker identification." Nature Communications 12 (2021): 3445.',
      caution:'This is a broader PyKale capability shown for context — it is not part of the KaleCancer head-and-neck pipeline itself.',
    },
    { id:'ask-cohort', journey:'ask', primaryDataType:'general', kind:'ask',
      title:'Bring Us Your Cohort',
      subtitle:"The architecture is designed to make a new cohort configuration-led, while allowing for cohort-specific loading, schema mapping and preprocessing.",
      dataTypes:['general'],
      summary:"KaleCancer is designed to move repeatable experiment choices into configuration. A new cohort can reuse the same pipeline architecture, while still requiring cohort-specific loaders, schema mapping or preprocessing adapters. The evaluated HANCOCK path produces risk over time, and the broader automation layer remains part of the repository roadmap.",
      objectives:[
        'Reusable pipeline configuration reduces cohort-specific redevelopment',
        'New cohorts may still need loading, schema and preprocessing adapters',
        'KaleCancer is a new module in the wider PyKale ecosystem',
      ],
      evidence:null, caution:null,
    },
  ];

  // Public-facing editorial layer. Detailed implementation records remain
  // available to the Pipeline view, while the Story uses this concise set.
  const PRIMARY_STORY_IDS = new Set([
    'multimodal-by-nature','hancock-benchmark','gap-fusion','gap-binary',
    'gap-duplicated','one-pipeline','fusion-config','beats-alone','four-ways','mogonet','ask-cohort'
  ]);
  const CONTENT_REVISIONS = {
    'multimodal-by-nature':{
      title:'Why multimodal survival modelling?',
      subtitle:'Cancer prognosis draws on several patient-data sources and outcomes that unfold over time.',
      summary:'Routine cancer care generates a wealth of information-rich data, including whole-slide pathology images, demographic details, laboratory results and radiology scans. Yet these modalities are rarely integrated into a single pipeline for time-to-event (survival) prediction, where follow-up and censoring must be handled correctly. KaleCancer brings clinical records and medical imaging together in one reproducible workflow to close this gap.'
    },
    'hancock-benchmark':{
      title:'HANCOCK: the current case study',
      subtitle:'A public, multimodal head-and-neck cancer cohort used to develop and compare KaleCancer workflows.',
      summary:'HANCOCK provides matched patient information, pathology material and long-term outcomes for 763 patients. It is the present test bed for KaleCancer, rather than a limitation of the project.'
    },
    'gap-fusion':{
      title:'Research gap 1: fusing highly heterogeneous data',
      subtitle:'Combine learned image representations with other matched patient information.',
      summary:'Whole-slide pathology images and tabular clinical records differ greatly in scale and structure, which makes them hard to combine in one model. The published HANCOCK work fused clinical features with numeric TMA-derived cell densities, but did not integrate learned whole-slide image representations with tabular clinical data.'
    },
    'gap-binary':{
      title:'Research gap 2: time-to-event prediction',
      subtitle:'Estimate risk over time while accounting for censored follow-up.',
      summary:'Rather than predicting only a fixed-horizon binary label, KaleCancer supports survival modelling, which represents outcomes as time to an event and accounts for censored follow-up. The resulting risk-over-time estimates support patient risk stratification and care prioritisation.'
    },
    'gap-duplicated':{
      title:'Research gap 3: standardised, reusable evaluation',
      subtitle:'Compare baselines and fusion choices on consistent patient partitions.',
      summary:'A standardised, shared evaluation protocol makes experiments easier to reproduce and separates changes in modelling from changes in data preparation or partitioning.'
    },
    'one-pipeline':{
      title:'A reusable multimodal workflow',
      subtitle:'A common route from patient data to evaluated time-to-event risk.',
      summary:'The workflow seamlessly connects data loading, data preparation, encoding, fusion, survival prediction, evaluation and interpretation, while keeping dataset-specific code in separate examples.'
    },
    'fusion-config':{
      title:'Configurable fusion',
      subtitle:'Fusion choices are part of the reusable workflow.',
      summary:'Clinical and imaging streams can be combined at early, intermediate or late stages by changing configuration rather than rewriting the experiment.'
    },
    'beats-alone':{
      title:'Comparing multimodal inputs',
      subtitle:'Evaluate demographics, pathology and combined inputs on consistent patient partitions.',
      summary:'The case study compares unimodal baselines with a combined workflow using the same evaluation design. Numerical results are omitted until they are approved for public release.'
    },
    'four-ways':{
      title:'Evaluation across patient partitions',
      subtitle:'Robustness depends on how patients are separated for development and evaluation.',
      summary:'KaleCancer supports consistent comparisons across predefined patient partitions. Exact public claims and numerical comparisons should remain limited to verified repository or publication results.'
    },
    'mogonet':{
      title:'Multiomics through PyKale',
      subtitle:'A related PyKale example shows how molecular data can be integrated when a study requires it.',
      summary:'MOGONET demonstrates graph-based integration of mRNA expression, DNA methylation and miRNA expression. It is wider PyKale capability and is not part of the current HANCOCK workflow.'
    },
    'ask-cohort':{
      title:'Start a KaleCancer collaboration',
      subtitle:'Bring a clinical question, matched patient data, an outcome and a validation route.',
      summary:'Work with us to define the patient group, prediction point, useful modalities, outcome, data-access pathway and independent validation strategy. Together, we can turn these foundations into a rigorous study before selecting a model.'
    }
  };
  CAPABILITIES.forEach(item=>Object.assign(item,CONTENT_REVISIONS[item.id]||{}));
  const STORY_CAPABILITIES = Array.from(PRIMARY_STORY_IDS)
    .map(id=>CAPABILITIES.find(item=>item.id===id))
    .filter(Boolean);

  const KEYWORDS = [
    { id:'hancock-dataset',      label:'HANCOCK Dataset',                capabilities:['hancock-benchmark','gap-binary','gap-fusion','beats-alone','four-ways'] },
    { id:'cox-time-to-event',    label:'Cox / Time-to-Event',            capabilities:['gap-binary','risk-over-time','beats-alone','four-ways'] },
    { id:'fusion-configuration', label:'Fusion Is a Configuration',      capabilities:['gap-fusion','fusion-config','fusion-method-wins'] },
    { id:'tabicl-encoder',       label:'TabICL Encoder',                 capabilities:['reading-clinical'] },
    { id:'attention-mil',        label:'Attention-MIL Encoder',          capabilities:['reading-imaging'] },
    { id:'cohort-763',           label:'763-Patient Cohort',             capabilities:['one-pipeline','beats-alone','four-ways'] },
    { id:'concordance-index',    label:"Harrell's C-Index",              capabilities:['beats-alone','four-ways'] },
    { id:'reproducibility',      label:'Reproducibility, Not Duplication', capabilities:['gap-duplicated','one-pipeline'] },
    { id:'clinical-burden-kw',   label:'GLOBOCAN Burden Stats',          capabilities:['clinical-burden'] },
    { id:'pykale-ecosystem',     label:'Part of PyKale',                 capabilities:['one-pipeline','mogonet','ask-cohort'] },
    { id:'broader-multimodality',label:'Broader Multimodal Landscape',   capabilities:['broader-landscape','mogonet'] },
    { id:'new-cohort-ready',     label:'Ready for Your Cohort',          capabilities:['one-pipeline','ask-cohort'] },
  ];

  const ZONES = {
    journey: { problem:[12,18], gaps:[36,12], built:[62,20], results:[82,44], landscape:[64,72], ask:[28,76] },
    datatype: { clinical:[16,24], imaging:[82,26], combined:[50,50], omics:[78,78], general:[20,78] },
  };
  const OFFSETS = [[0,0],[3.6,-3],[-3.6,3],[3,3.6],[-3,-3.6],[5,0.6],[-5,-0.6],[0,5]];

  function computeLayout(axis){
    const key = c => axis==='journey' ? c.journey : c.primaryDataType;
    const groups = {};
    CAPABILITIES.forEach(c => { (groups[key(c)] = groups[key(c)] || []).push(c); });
    const pos = {};
    Object.entries(groups).forEach(([k, list]) => {
      const zone = ZONES[axis][k] || [50,50];
      list.forEach((c,i) => {
        const off = OFFSETS[i % OFFSETS.length];
        pos[c.id] = { x: zone[0]+off[0], y: zone[1]+off[1] };
      });
    });
    return pos;
  }
  const LAYOUTS = { journey: computeLayout('journey'), datatype: computeLayout('datatype') };
  const STORY_LAYOUT = {
    'multimodal-by-nature':{x:8,y:33},'clinical-burden':{x:8,y:53},'routine-data':{x:8,y:73},
    'hancock-benchmark':{x:25,y:28},'gap-binary':{x:25,y:44},'gap-fusion':{x:25,y:60},'gap-duplicated':{x:25,y:76},
    'one-pipeline':{x:44,y:27},'fusion-config':{x:44,y:42},'risk-over-time':{x:44,y:57},'reading-clinical':{x:44,y:72},'reading-imaging':{x:44,y:87},
    'beats-alone':{x:64,y:37},'four-ways':{x:64,y:56},'fusion-method-wins':{x:64,y:75},
    'broader-landscape':{x:82,y:40},'mogonet':{x:82,y:68},'ask-cohort':{x:95,y:55}
  };
  const STORY_EDGES = [
    ['multimodal-by-nature','hancock-benchmark'],
    ['hancock-benchmark','gap-fusion'],['hancock-benchmark','gap-binary'],['hancock-benchmark','gap-duplicated'],
    ['gap-fusion','one-pipeline'],['gap-binary','one-pipeline'],['gap-duplicated','one-pipeline'],
    ['one-pipeline','fusion-config'],['one-pipeline','four-ways'],['fusion-config','beats-alone'],
    ['one-pipeline','mogonet'],['beats-alone','ask-cohort'],['four-ways','ask-cohort'],['mogonet','ask-cohort']
  ];
  const STORY_KEYWORDS = KEYWORDS.map(keyword=>({
    ...keyword,
    capabilities:keyword.capabilities.filter(id=>PRIMARY_STORY_IDS.has(id))
  })).filter(keyword=>keyword.capabilities.length);

  const KW_CENTER = { x:590, y:360 };
  const KW_R_INNER = 145, KW_R_OUTER = 288;
  function polar(cx,cy,r,angleDeg){
    const a = angleDeg*Math.PI/180;
    return { x: cx + r*Math.cos(a), y: cy + r*Math.sin(a) };
  }
  function computeKeywordLayout(){
    const capPos = {}, kwPos = {};
    STORY_CAPABILITIES.forEach((c,i)=>{
      capPos[c.id] = polar(KW_CENTER.x, KW_CENTER.y, KW_R_INNER, -90 + i*(360/STORY_CAPABILITIES.length));
    });
    STORY_KEYWORDS.forEach((k,i)=>{
      kwPos[k.id] = polar(KW_CENTER.x, KW_CENTER.y, KW_R_OUTER, -90 + 9.5 + i*(360/STORY_KEYWORDS.length));
    });
    return { capPos, kwPos };
  }
  const KEYWORD_LAYOUT = computeKeywordLayout();

  // ---------------- pipeline cluster: the same items drawn in the Structured > Pipeline map,
  // laid out as free-form cluster nodes instead of a fixed top-to-bottom diagram ----------------
  const LAYER_META = {
    inputs:   { label:'Inputs', hue:205,
      icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 13h4l2 4h4l2-4h4"/><path d="M4 13V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6"/><path d="M4 13v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/></svg>' },
    loadprep: { label:'Load & Prepare', hue:170,
      icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3.2"/><path d="M12 3v2.4M12 18.6V21M21 12h-2.4M5.4 12H3M18.1 5.9l-1.7 1.7M7.6 16.4l-1.7 1.7M18.1 18.1l-1.7-1.7M7.6 7.6L5.9 5.9"/></svg>' },
    encode:   { label:'Encode', hue:265,
      icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/></svg>' },
    fuse:     { label:'Fuse', hue:35,
      icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="7" r="3.4"/><circle cx="17" cy="7" r="3.4"/><path d="M9.4 9.4L12 15l2.6-5.6"/><circle cx="12" cy="18" r="3.2"/></svg>' },
    predict:  { label:'Predict', hue:150,
      icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3"/></svg>' },
    evaluate: { label:'Evaluate', hue:330,
      icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 21V11M10 21V3M16 21v-8M21 21v-4"/></svg>' },
  };
  const PIPELINE_NODES = [
    { key:'in-clinical',  capId:'reading-clinical',   layer:'inputs',   status:'implemented', title:'Clinical table', detail:'Baseline covariates, categories and missing values.' },
    { key:'in-imaging',   capId:'reading-imaging',    layer:'inputs',   status:'implemented', title:'Whole-slide imaging', detail:'Primary-tumour UNI-embedded patch bags.' },
    { key:'in-radiology', capId:'broader-landscape',  layer:'inputs',   status:'planned',     title:'CT / MRI / PET adapters', detail:'Named in project scope; outside the evaluated HANCOCK path.' },
    { key:'lp-load',      capId:'one-pipeline',       layer:'loadprep', status:'implemented', title:'Cohort loading and splitting', detail:'Dataset access, matching and leakage-safe partitions.' },
    { key:'lp-prep',      capId:'one-pipeline',       layer:'loadprep', status:'implemented', title:'Modality preprocessing', detail:'Imputation, encoding and WSI bag preparation.' },
    { key:'enc-clinical', capId:'reading-clinical',   layer:'encode',   status:'implemented', title:'TabICL → 64-d', detail:'Frozen 512-d representation with trained projection.' },
    { key:'enc-imaging',  capId:'reading-imaging',    layer:'encode',   status:'implemented', title:'Attention-MIL → 64-d', detail:'Trained 128-d WSI representation with projection.' },
    { key:'fuse-early',   capId:'fusion-config',      layer:'fuse',     status:'implemented', title:'Early fusion', detail:'Join raw features before a shared encoder.' },
    { key:'fuse-inter',   capId:'fusion-config',      layer:'fuse',     status:'implemented', title:'Intermediate fusion', detail:'Join embeddings before a shared head.' },
    { key:'fuse-late',    capId:'fusion-config',      layer:'fuse',     status:'implemented', title:'Late fusion', detail:'Join modality-specific risk scores.' },
    { key:'pred-cox',     capId:'risk-over-time',     layer:'predict',  status:'implemented', title:'Cox proportional-hazards head', detail:'Bias-free head with Cox partial-likelihood loss.' },
    { key:'pred-class',   capId:'risk-over-time',     layer:'predict',  status:'planned',     title:'Classification / regression heads', detail:'The current repository marks these heads as planned.' },
    { key:'eval-cindex',  capId:'beats-alone',        layer:'evaluate', status:'implemented', title:"Harrell's C-index", detail:'Ranking concordance.' },
    { key:'eval-auc',     capId:'fusion-method-wins', layer:'evaluate', status:'implemented', title:'Time-dependent AUC', detail:'At 1, 2 and 3 years.' },
    { key:'eval-brier',   capId:'risk-over-time',     layer:'evaluate', status:'implemented', title:'Integrated Brier', detail:'Prediction error over time.' },
    { key:'eval-km',      capId:'risk-over-time',     layer:'evaluate', status:'implemented', title:'Kaplan–Meier', detail:'Survival visualisation.' },
  ];
  const ZONES_PIPELINE = { inputs:[25,10], loadprep:[70,24], encode:[30,40], fuse:[70,56], predict:[30,72], evaluate:[65,88] };
  function computePipelineLayout(){
    return {
      'in-clinical':{x:8,y:38},'in-imaging':{x:8,y:58},'in-radiology':{x:8,y:78},
      'lp-load':{x:25,y:45},'lp-prep':{x:25,y:71},'enc-clinical':{x:43,y:45},'enc-imaging':{x:43,y:71},
      'fuse-early':{x:61,y:40},'fuse-inter':{x:61,y:59},'fuse-late':{x:61,y:78},
      'pred-cox':{x:78,y:48},'pred-class':{x:78,y:72},
      'eval-cindex':{x:94,y:34},'eval-auc':{x:94,y:50},'eval-brier':{x:94,y:66},'eval-km':{x:94,y:82}
    };
  }
  const PIPELINE_LAYOUT = computePipelineLayout();
  const PIPELINE_EDGES = [
    ['in-clinical','lp-load'],['in-imaging','lp-load'],['in-radiology','lp-load','planned'],['lp-load','lp-prep'],
    ['lp-prep','enc-clinical'],['lp-prep','enc-imaging'],['enc-clinical','fuse-early'],['enc-clinical','fuse-inter'],['enc-clinical','fuse-late'],
    ['enc-imaging','fuse-early'],['enc-imaging','fuse-inter'],['enc-imaging','fuse-late'],['fuse-early','pred-cox'],['fuse-inter','pred-cox'],['fuse-late','pred-cox'],
    ['fuse-late','pred-class','planned'],['pred-cox','eval-cindex'],['pred-cox','eval-auc'],['pred-cox','eval-brier'],['pred-cox','eval-km']
  ];
