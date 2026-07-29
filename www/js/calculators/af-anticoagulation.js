/* Category: af — Atrial fibrillation & anticoagulation
 * Each entry follows SCHEMA.md. Point values verified against primary publications. */
(function () {
  'use strict';

  /* ---------- CHA2DS2-VASc ---------- */
  CARDIO.register({
    id: 'cha2ds2-vasc',
    name: 'CHA₂DS₂-VASc',
    category: 'af',
    short: 'Stroke risk in nonvalvular atrial fibrillation',
    keywords: ['stroke', 'atrial fibrillation', 'anticoagulation', 'chadsvasc'],
    inputs: [
      { id: 'chf', label: 'Congestive heart failure / LV dysfunction', type: 'check', points: 1 },
      { id: 'htn', label: 'Hypertension', type: 'check', points: 1 },
      { id: 'age', label: 'Age', type: 'select', options: [
        { label: '< 65 years', points: 0 },
        { label: '65–74 years', points: 1 },
        { label: '≥ 75 years', points: 2 }
      ] },
      { id: 'dm', label: 'Diabetes mellitus', type: 'check', points: 1 },
      { id: 'stroke', label: 'Prior stroke / TIA / thromboembolism', type: 'check', points: 2 },
      { id: 'vasc', label: 'Vascular disease', hint: 'Prior MI, peripheral artery disease, or aortic plaque', type: 'check', points: 1 },
      { id: 'sex', label: 'Sex category female', type: 'check', points: 1 }
    ],
    interpret: [
      { upTo: 0, text: 'Low stroke risk (~0.2%/yr). Anticoagulation generally not recommended.', level: 'low' },
      { upTo: 1, text: 'Annual stroke risk ~0.6%. In males, consider oral anticoagulation; if the single point is female sex alone, risk is low.', level: 'mod' },
      { upTo: 2, text: 'Annual stroke risk ~2.2%. Oral anticoagulation recommended.', level: 'high' },
      { upTo: 3, text: 'Annual stroke risk ~3.2%. Oral anticoagulation recommended.', level: 'high' },
      { upTo: 4, text: 'Annual stroke risk ~4.8%. Oral anticoagulation recommended.', level: 'vhigh' },
      { upTo: 5, text: 'Annual stroke risk ~7.2%. Oral anticoagulation recommended.', level: 'vhigh' },
      { upTo: 9, text: 'Annual stroke risk ~10–12%. Oral anticoagulation recommended.', level: 'vhigh' }
    ],
    notes: 'Annual rates from Friberg et al. (Swedish AF cohort). Female sex is a risk modifier, not an independent indication. The 2024 ESC guideline moved to CHA₂DS₂-VA (sex removed): OAC recommended at ≥2, considered at 1.',
    refs: [
      'Lip GYH et al. Chest 2010;137:263-72.',
      'Friberg L et al. Eur Heart J 2012;33:1500-10.',
      '2024 ESC Guidelines for management of atrial fibrillation. Eur Heart J 2024.'
    ]
  });

  /* ---------- CHADS2 ---------- */
  CARDIO.register({
    id: 'chads2',
    name: 'CHADS₂',
    category: 'af',
    short: 'Original stroke-risk score in AF (largely superseded by CHA₂DS₂-VASc)',
    keywords: ['stroke', 'atrial fibrillation'],
    inputs: [
      { id: 'chf', label: 'Congestive heart failure', type: 'check', points: 1 },
      { id: 'htn', label: 'Hypertension', type: 'check', points: 1 },
      { id: 'age', label: 'Age ≥ 75 years', type: 'check', points: 1 },
      { id: 'dm', label: 'Diabetes mellitus', type: 'check', points: 1 },
      { id: 'stroke', label: 'Prior stroke or TIA', type: 'check', points: 2 }
    ],
    interpret: [
      { upTo: 0, text: 'Adjusted stroke rate ~1.9%/yr.', level: 'low' },
      { upTo: 1, text: 'Adjusted stroke rate ~2.8%/yr.', level: 'mod' },
      { upTo: 2, text: 'Adjusted stroke rate ~4.0%/yr. Anticoagulation recommended.', level: 'high' },
      { upTo: 3, text: 'Adjusted stroke rate ~5.9%/yr. Anticoagulation recommended.', level: 'high' },
      { upTo: 4, text: 'Adjusted stroke rate ~8.5%/yr. Anticoagulation recommended.', level: 'vhigh' },
      { upTo: 6, text: 'Adjusted stroke rate ~12–18%/yr. Anticoagulation recommended.', level: 'vhigh' }
    ],
    refs: ['Gage BF et al. JAMA 2001;285:2864-70.']
  });

  /* ---------- HAS-BLED ---------- */
  CARDIO.register({
    id: 'has-bled',
    name: 'HAS-BLED',
    category: 'af',
    short: 'Major bleeding risk on anticoagulation for AF',
    keywords: ['bleeding', 'warfarin', 'anticoagulation'],
    inputs: [
      { id: 'htn', label: 'Hypertension (uncontrolled, SBP > 160 mmHg)', type: 'check', points: 1 },
      { id: 'renal', label: 'Abnormal renal function', hint: 'Dialysis, transplant, or creatinine > 2.26 mg/dL (200 µmol/L)', type: 'check', points: 1 },
      { id: 'liver', label: 'Abnormal liver function', hint: 'Cirrhosis, bilirubin > 2× normal, or AST/ALT/ALP > 3× normal', type: 'check', points: 1 },
      { id: 'stroke', label: 'Prior stroke', type: 'check', points: 1 },
      { id: 'bleed', label: 'Bleeding history or predisposition', type: 'check', points: 1 },
      { id: 'inr', label: 'Labile INR', hint: 'Time in therapeutic range < 60% (only if on VKA)', type: 'check', points: 1 },
      { id: 'age', label: 'Elderly (age > 65 years)', type: 'check', points: 1 },
      { id: 'drugs', label: 'Drugs predisposing to bleeding', hint: 'Antiplatelet agents or NSAIDs', type: 'check', points: 1 },
      { id: 'alcohol', label: 'Alcohol use (≥ 8 drinks/week)', type: 'check', points: 1 }
    ],
    interpret: [
      { upTo: 1, text: 'Low bleeding risk (~1%/yr major bleeding).', level: 'low' },
      { upTo: 2, text: 'Moderate bleeding risk (~2%/yr).', level: 'mod' },
      { upTo: 9, text: 'High bleeding risk (≥ ~4%/yr). Address modifiable factors and review more frequently — a high score is not by itself a reason to withhold anticoagulation.', level: 'high' }
    ],
    refs: ['Pisters R et al. Chest 2010;138:1093-100.']
  });

  /* ---------- ORBIT ---------- */
  CARDIO.register({
    id: 'orbit',
    name: 'ORBIT Bleeding Score',
    category: 'af',
    short: 'Major bleeding risk in AF patients on anticoagulation',
    keywords: ['bleeding', 'anticoagulation'],
    inputs: [
      { id: 'age', label: 'Age ≥ 75 years', type: 'check', points: 1 },
      { id: 'anemia', label: 'Reduced hemoglobin / hematocrit / history of anemia', hint: 'Hgb < 13 g/dL (men) or < 12 g/dL (women)', type: 'check', points: 2 },
      { id: 'bleed', label: 'History of bleeding', hint: 'e.g., GI or intracranial bleeding, hemorrhagic stroke', type: 'check', points: 2 },
      { id: 'renal', label: 'Insufficient renal function (eGFR < 60 mL/min/1.73 m²)', type: 'check', points: 1 },
      { id: 'antiplt', label: 'Treatment with an antiplatelet agent', type: 'check', points: 1 }
    ],
    interpret: [
      { upTo: 2, text: 'Low bleeding risk (~2.4 bleeds per 100 patient-years).', level: 'low' },
      { upTo: 3, text: 'Medium bleeding risk (~4.7 per 100 patient-years).', level: 'mod' },
      { upTo: 7, text: 'High bleeding risk (~8.1 per 100 patient-years).', level: 'high' }
    ],
    refs: ['O\'Brien EC et al. Eur Heart J 2015;36:3258-64.']
  });

  /* ---------- ATRIA bleeding ---------- */
  CARDIO.register({
    id: 'atria-bleeding',
    name: 'ATRIA Bleeding Score',
    category: 'af',
    short: 'Warfarin-associated major bleeding risk in AF',
    keywords: ['bleeding', 'warfarin'],
    inputs: [
      { id: 'anemia', label: 'Anemia', type: 'check', points: 3 },
      { id: 'renal', label: 'Severe renal disease', hint: 'eGFR < 30 mL/min or dialysis', type: 'check', points: 3 },
      { id: 'age', label: 'Age ≥ 75 years', type: 'check', points: 2 },
      { id: 'bleed', label: 'Prior bleeding', type: 'check', points: 1 },
      { id: 'htn', label: 'Hypertension', type: 'check', points: 1 }
    ],
    interpret: [
      { upTo: 3, text: 'Low risk (~0.8%/yr major bleeding).', level: 'low' },
      { upTo: 4, text: 'Intermediate risk (~2.6%/yr).', level: 'mod' },
      { upTo: 10, text: 'High risk (~5.8%/yr).', level: 'high' }
    ],
    refs: ['Fang MC et al. J Am Coll Cardiol 2011;58:395-401.']
  });

  /* ---------- SAMe-TT2R2 ---------- */
  CARDIO.register({
    id: 'same-tt2r2',
    name: 'SAMe-TT₂R₂',
    category: 'af',
    short: 'Predicts quality of INR control on a vitamin K antagonist',
    keywords: ['warfarin', 'inr', 'ttr', 'doac'],
    inputs: [
      { id: 'sex', label: 'Sex female', type: 'check', points: 1 },
      { id: 'age', label: 'Age < 60 years', type: 'check', points: 1 },
      { id: 'medhx', label: 'Medical history: ≥ 2 comorbidities', hint: 'Of: hypertension, diabetes, CAD/MI, PAD, CHF, prior stroke, pulmonary disease, hepatic or renal disease', type: 'check', points: 1 },
      { id: 'tx', label: 'Treatment with interacting drug (e.g., amiodarone)', type: 'check', points: 1 },
      { id: 'tobacco', label: 'Tobacco use (within 2 years)', type: 'check', points: 2 },
      { id: 'race', label: 'Race non-Caucasian', type: 'check', points: 2 }
    ],
    interpret: [
      { upTo: 2, text: 'Likely good INR control on a VKA (time in therapeutic range > 65%). VKA is a reasonable option.', level: 'low' },
      { upTo: 8, text: 'Likely poor INR control on a VKA. Favor a DOAC, or intensify INR monitoring/education if a VKA must be used.', level: 'mod' }
    ],
    refs: ['Apostolakis S et al. Chest 2013;144:1555-63.']
  });

  /* ---------- HEMORR2HAGES ---------- */
  CARDIO.register({
    id: 'hemorr2hages',
    name: 'HEMORR₂HAGES',
    category: 'af',
    short: 'Bleeding risk on anticoagulation (older score)',
    keywords: ['bleeding', 'warfarin'],
    inputs: [
      { id: 'hep', label: 'Hepatic or renal disease', type: 'check', points: 1 },
      { id: 'etoh', label: 'Ethanol (alcohol) abuse', type: 'check', points: 1 },
      { id: 'malig', label: 'Malignancy', type: 'check', points: 1 },
      { id: 'age', label: 'Older age (> 75 years)', type: 'check', points: 1 },
      { id: 'plt', label: 'Reduced platelet count or function', hint: 'Includes antiplatelet therapy', type: 'check', points: 1 },
      { id: 'rebleed', label: 'Rebleeding (prior bleed)', type: 'check', points: 2 },
      { id: 'htn', label: 'Hypertension (uncontrolled)', type: 'check', points: 1 },
      { id: 'anemia', label: 'Anemia', type: 'check', points: 1 },
      { id: 'genetic', label: 'Genetic factors (CYP2C9 variants)', type: 'check', points: 1 },
      { id: 'falls', label: 'Excessive fall risk', type: 'check', points: 1 },
      { id: 'stroke', label: 'Prior stroke', type: 'check', points: 1 }
    ],
    interpret: [
      { upTo: 1, text: 'Low bleeding risk (~1.9–2.5 bleeds per 100 patient-years).', level: 'low' },
      { upTo: 3, text: 'Intermediate bleeding risk (~5.3–8.4 per 100 patient-years).', level: 'mod' },
      { upTo: 12, text: 'High bleeding risk (~10.4+ per 100 patient-years).', level: 'high' }
    ],
    refs: ['Gage BF et al. Am Heart J 2006;151:713-9.']
  });

  /* ---------- EHRA symptom classification ---------- */
  CARDIO.register({
    id: 'ehra-class',
    name: 'EHRA Symptom Classification (modified)',
    category: 'af',
    short: 'Severity of AF-related symptoms',
    keywords: ['symptoms', 'atrial fibrillation', 'classification'],
    inputs: [
      { id: 'cls', label: 'Symptom description', type: 'select', hidePoints: true, options: [
        { label: 'EHRA 1 — No symptoms', points: 1 },
        { label: 'EHRA 2a — Mild: normal daily activity not affected', points: 2 },
        { label: 'EHRA 2b — Moderate: daily activity not affected but patient troubled by symptoms', points: 3 },
        { label: 'EHRA 3 — Severe: normal daily activity affected', points: 4 },
        { label: 'EHRA 4 — Disabling: normal daily activity discontinued', points: 5 }
      ] }
    ],
    result: { unit: '' },
    interpret: [
      { upTo: 1, text: 'EHRA 1: asymptomatic AF.', level: 'low' },
      { upTo: 2, text: 'EHRA 2a: mild symptoms; daily activity unaffected.', level: 'low' },
      { upTo: 3, text: 'EHRA 2b: moderate symptoms; daily activity unaffected but patient troubled — a threshold often used for rhythm-control decisions.', level: 'mod' },
      { upTo: 4, text: 'EHRA 3: severe symptoms; daily activity affected.', level: 'high' },
      { upTo: 5, text: 'EHRA 4: disabling symptoms; normal activity discontinued.', level: 'vhigh' }
    ],
    notes: 'The displayed number is an internal index (1–5), not a point score — read the class from the interpretation.',
    refs: ['Wynn GJ et al. Europace 2014;16:965-72.']
  });

})();
