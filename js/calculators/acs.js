/* Category: acs — ER / chest pain / acute coronary syndrome
 * Each entry follows SCHEMA.md. Point values verified against primary publications.
 * GRACE (Granger 2003 point-based in-hospital mortality) and CRUSADE (Subherwal 2009)
 * are implemented locally with their published multi-band point tables. */
(function () {
  'use strict';

  /* ---------- HEART Score ---------- */
  CARDIO.register({
    id: 'heart-score',
    name: 'HEART Score',
    category: 'acs',
    short: 'Risk of major adverse cardiac events (MACE) in ED chest-pain patients',
    keywords: ['chest pain', 'mace', 'emergency', 'troponin', 'triage'],
    inputs: [
      { id: 'history', label: 'History', type: 'select', options: [
        { label: 'Slightly suspicious', points: 0 },
        { label: 'Moderately suspicious', points: 1 },
        { label: 'Highly suspicious', points: 2 }
      ] },
      { id: 'ecg', label: 'ECG', type: 'select', options: [
        { label: 'Normal', points: 0 },
        { label: 'Non-specific repolarization disturbance', points: 1 },
        { label: 'Significant ST deviation', points: 2 }
      ] },
      { id: 'age', label: 'Age', type: 'select', options: [
        { label: '< 45 years', points: 0 },
        { label: '45–64 years', points: 1 },
        { label: '≥ 65 years', points: 2 }
      ] },
      { id: 'risk', label: 'Risk factors', type: 'select', options: [
        { label: 'No known risk factors', points: 0 },
        { label: '1–2 risk factors', points: 1 },
        { label: '≥ 3 risk factors, or history of atherosclerotic disease', points: 2 }
      ] },
      { id: 'trop', label: 'Initial troponin', type: 'select', options: [
        { label: '≤ normal limit', points: 0 },
        { label: '1–3× normal limit', points: 1 },
        { label: '> 3× normal limit', points: 2 }
      ] }
    ],
    interpret: [
      { upTo: 3, text: 'Low risk: ~1.7% MACE within 6 weeks (validation cohort). Early discharge with outpatient follow-up is reasonable in most pathways.', level: 'low' },
      { upTo: 6, text: 'Intermediate risk: ~16.6% MACE within 6 weeks. Observation and serial troponin / noninvasive testing generally advised.', level: 'mod' },
      { upTo: 10, text: 'High risk: ~50.1% MACE within 6 weeks. Early invasive management generally advised.', level: 'high' }
    ],
    notes: 'Risk factors: hypertension, hypercholesterolemia, diabetes, current or recent smoking, family history of premature CAD, obesity (BMI > 30). Atherosclerotic disease = prior MI, PCI/CABG, stroke/TIA, or peripheral arterial disease. Event rates from the 2013 multicenter validation (Backus et al.).',
    refs: [
      'Six AJ, Backus BE, Kelder JC. Neth Heart J 2008;16:191-6.',
      'Backus BE et al. Int J Cardiol 2013;168:2153-8.'
    ]
  });

  /* ---------- EDACS ---------- */
  CARDIO.register({
    id: 'edacs',
    name: 'EDACS',
    category: 'acs',
    short: 'Emergency Department Assessment of Chest pain Score (low-risk identification)',
    keywords: ['chest pain', 'emergency', 'accelerated diagnostic protocol', 'adp', 'mace'],
    inputs: [
      { id: 'age', label: 'Age', type: 'select', options: [
        { label: '18–45 years', points: 2 },
        { label: '46–50 years', points: 4 },
        { label: '51–55 years', points: 6 },
        { label: '56–60 years', points: 8 },
        { label: '61–65 years', points: 10 },
        { label: '66–70 years', points: 12 },
        { label: '71–75 years', points: 14 },
        { label: '76–80 years', points: 16 },
        { label: '81–85 years', points: 18 },
        { label: '≥ 86 years', points: 20 }
      ] },
      { id: 'male', label: 'Male sex', type: 'check', points: 6 },
      { id: 'youngcad', label: 'Aged 18–50 years AND known CAD or ≥ 3 risk factors', hint: 'Risk factors: family history of premature CAD, dyslipidemia, diabetes, hypertension, current smoker. Only applies if age 18–50.', type: 'check', points: 4 },
      { id: 'diaph', label: 'Diaphoresis', type: 'check', points: 3 },
      { id: 'radiate', label: 'Pain radiates to arm, shoulder, neck, or jaw', type: 'check', points: 5 },
      { id: 'pleuritic', label: 'Pain occurred or worsened with inspiration', type: 'check', points: -4 },
      { id: 'palp', label: 'Pain reproduced by palpation', type: 'check', points: -6 }
    ],
    interpret: [
      { upTo: 15, text: 'EDACS < 16: low risk IF combined with no new ischemia on ECG and negative 0-h and 2-h troponins (EDACS-ADP). In derivation, the low-risk pathway identified ~half of patients with ~99% sensitivity for 30-day MACE.', level: 'low' },
      { upTo: 99, text: 'EDACS ≥ 16: not low risk — proceed with usual ACS evaluation (serial troponins ± further testing).', level: 'mod' }
    ],
    notes: 'The score alone does not rule out ACS: low-risk disposition requires the full accelerated diagnostic protocol (EDACS < 16 AND no new ischemic ECG changes AND negative serial troponins). Negative totals are possible.',
    refs: [
      'Than M et al. Emerg Med Australas 2014;26:34-44.'
    ]
  });

  /* ---------- TIMI risk score for UA/NSTEMI ---------- */
  CARDIO.register({
    id: 'timi-ua-nstemi',
    name: 'TIMI Risk Score (UA/NSTEMI)',
    category: 'acs',
    short: '14-day risk of death, MI, or urgent revascularization in UA/NSTEMI',
    keywords: ['unstable angina', 'nstemi', 'chest pain', 'timi'],
    inputs: [
      { id: 'age', label: 'Age ≥ 65 years', type: 'check', points: 1 },
      { id: 'risk', label: '≥ 3 CAD risk factors', hint: 'Family history of CAD, hypertension, hypercholesterolemia, diabetes, active smoker', type: 'check', points: 1 },
      { id: 'cad', label: 'Known CAD (prior stenosis ≥ 50%)', type: 'check', points: 1 },
      { id: 'asa', label: 'Aspirin use in the past 7 days', type: 'check', points: 1 },
      { id: 'angina', label: 'Severe angina (≥ 2 episodes in past 24 h)', type: 'check', points: 1 },
      { id: 'st', label: 'ST deviation ≥ 0.5 mm on presenting ECG', type: 'check', points: 1 },
      { id: 'markers', label: 'Elevated cardiac markers', type: 'check', points: 1 }
    ],
    interpret: [
      { upTo: 1, text: 'Score 0–1: ~4.7% risk of death / MI / urgent revascularization at 14 days.', level: 'low' },
      { upTo: 2, text: 'Score 2: ~8.3% risk at 14 days.', level: 'low' },
      { upTo: 3, text: 'Score 3: ~13.2% risk at 14 days.', level: 'mod' },
      { upTo: 4, text: 'Score 4: ~19.9% risk at 14 days.', level: 'mod' },
      { upTo: 5, text: 'Score 5: ~26.2% risk at 14 days.', level: 'high' },
      { upTo: 7, text: 'Score 6–7: ~40.9% risk at 14 days.', level: 'vhigh' }
    ],
    notes: 'Event rates from the TIMI 11B / ESSENCE derivation cohorts (Antman et al.). Higher scores favor an early invasive strategy.',
    refs: [
      'Antman EM et al. JAMA 2000;284:835-42.'
    ]
  });

  /* ---------- TIMI risk score for STEMI ---------- */
  CARDIO.register({
    id: 'timi-stemi',
    name: 'TIMI Risk Score (STEMI)',
    category: 'acs',
    short: '30-day mortality after STEMI (derived in fibrinolytic-treated patients)',
    keywords: ['stemi', 'mortality', 'fibrinolysis', 'timi'],
    inputs: [
      { id: 'age', label: 'Age', type: 'select', options: [
        { label: '< 65 years', points: 0 },
        { label: '65–74 years', points: 2 },
        { label: '≥ 75 years', points: 3 }
      ] },
      { id: 'hx', label: 'History of diabetes, hypertension, or angina', type: 'check', points: 1 },
      { id: 'sbp', label: 'Systolic BP < 100 mmHg', type: 'check', points: 3 },
      { id: 'hr', label: 'Heart rate > 100 bpm', type: 'check', points: 2 },
      { id: 'killip', label: 'Killip class II–IV', type: 'check', points: 2 },
      { id: 'weight', label: 'Weight < 67 kg', type: 'check', points: 1 },
      { id: 'ant', label: 'Anterior ST elevation or LBBB', type: 'check', points: 1 },
      { id: 'time', label: 'Time to treatment > 4 hours', type: 'check', points: 1 }
    ],
    interpret: [
      { upTo: 0, text: 'Score 0: ~0.8% 30-day mortality.', level: 'low' },
      { upTo: 1, text: 'Score 1: ~1.6% 30-day mortality.', level: 'low' },
      { upTo: 2, text: 'Score 2: ~2.2% 30-day mortality.', level: 'low' },
      { upTo: 3, text: 'Score 3: ~4.4% 30-day mortality.', level: 'mod' },
      { upTo: 4, text: 'Score 4: ~7.3% 30-day mortality.', level: 'mod' },
      { upTo: 5, text: 'Score 5: ~12.4% 30-day mortality.', level: 'high' },
      { upTo: 6, text: 'Score 6: ~16.1% 30-day mortality.', level: 'high' },
      { upTo: 7, text: 'Score 7: ~23.4% 30-day mortality.', level: 'vhigh' },
      { upTo: 8, text: 'Score 8: ~26.8% 30-day mortality.', level: 'vhigh' },
      { upTo: 14, text: 'Score > 8: ~35.9% 30-day mortality.', level: 'vhigh' }
    ],
    notes: 'Derived in the InTIME II trial (fibrinolytic-eligible STEMI patients); mortality in contemporary primary-PCI populations is lower, but risk ordering is preserved.',
    refs: [
      'Morrow DA et al. Circulation 2000;102:2031-7.'
    ]
  });

  /* ---------- Killip classification ---------- */
  CARDIO.register({
    id: 'killip-class',
    name: 'Killip Classification',
    category: 'acs',
    short: 'Heart-failure severity at presentation of acute MI',
    keywords: ['heart failure', 'myocardial infarction', 'classification', 'pulmonary edema', 'cardiogenic shock'],
    inputs: [
      { id: 'cls', label: 'Examination findings', type: 'select', hidePoints: true, options: [
        { label: 'Class I — No signs of heart failure', points: 1 },
        { label: 'Class II — Rales, S3 gallop, or elevated JVP', points: 2 },
        { label: 'Class III — Acute pulmonary edema', points: 3 },
        { label: 'Class IV — Cardiogenic shock', points: 4 }
      ] }
    ],
    result: { unit: '' },
    interpret: [
      { upTo: 1, text: 'Killip class I: no clinical heart failure. In-hospital mortality ~6% in the original 1967 cohort.', level: 'low' },
      { upTo: 2, text: 'Killip class II: mild heart failure (rales, S3, venous hypertension). In-hospital mortality ~17% in the original cohort.', level: 'mod' },
      { upTo: 3, text: 'Killip class III: frank pulmonary edema. In-hospital mortality ~38% in the original cohort.', level: 'high' },
      { upTo: 4, text: 'Killip class IV: cardiogenic shock. In-hospital mortality ~81% in the original cohort.', level: 'vhigh' }
    ],
    notes: 'The displayed number is an internal index (1–4), not a point score — read the class from the interpretation. Mortality figures are from the pre-reperfusion era (1967); contemporary mortality is substantially lower in every class, but the risk gradient persists.',
    refs: [
      'Killip T 3rd, Kimball JT. Am J Cardiol 1967;20:457-64.'
    ]
  });

  /* ---------- Forrester hemodynamic classification ---------- */
  CARDIO.register({
    id: 'forrester-class',
    name: 'Forrester Hemodynamic Classification',
    category: 'acs',
    short: 'Hemodynamic subsets in acute MI by cardiac index and wedge pressure',
    keywords: ['hemodynamics', 'cardiac index', 'pcwp', 'wedge pressure', 'swan-ganz', 'wet', 'cold', 'classification'],
    inputs: [
      { id: 'subset', label: 'Hemodynamic subset', type: 'select', hidePoints: true, options: [
        { label: 'Subset I — CI > 2.2 and PCWP ≤ 18 (no hypoperfusion, no congestion)', points: 1 },
        { label: 'Subset II — CI > 2.2 and PCWP > 18 (congestion without hypoperfusion)', points: 2 },
        { label: 'Subset III — CI ≤ 2.2 and PCWP ≤ 18 (hypoperfusion without congestion)', points: 3 },
        { label: 'Subset IV — CI ≤ 2.2 and PCWP > 18 (hypoperfusion and congestion)', points: 4 }
      ] }
    ],
    result: { unit: '' },
    interpret: [
      { upTo: 1, text: 'Subset I ("warm and dry"): normal perfusion and no pulmonary congestion. Mortality ~3% in the original cohort.', level: 'low' },
      { upTo: 2, text: 'Subset II ("warm and wet"): pulmonary congestion with preserved perfusion — diuretics/vasodilators. Mortality ~9% in the original cohort.', level: 'mod' },
      { upTo: 3, text: 'Subset III ("cold and dry"): peripheral hypoperfusion without congestion — consider volume, rate/rhythm causes. Mortality ~23% in the original cohort.', level: 'high' },
      { upTo: 4, text: 'Subset IV ("cold and wet"): hypoperfusion with congestion (cardiogenic shock physiology) — inotropes/mechanical support. Mortality ~51% in the original cohort.', level: 'vhigh' }
    ],
    notes: 'CI = cardiac index (L/min/m²); PCWP = pulmonary capillary wedge pressure (mmHg). The displayed number is an internal index (1–4), not a point score. Original mortality figures predate reperfusion therapy; the same 2×2 logic underlies the clinical warm/cold–wet/dry bedside classification.',
    refs: [
      'Forrester JS et al. N Engl J Med 1976;295:1356-62 and 1404-13.'
    ]
  });

  /* ---------- GRACE (in-hospital mortality, point-based) ---------- */
  CARDIO.register({
    id: 'grace',
    name: 'GRACE Score (ACS mortality)',
    category: 'acs',
    short: 'In-hospital mortality after ACS (Granger 2003 point-based version)',
    keywords: ['grace', 'mortality', 'nstemi', 'stemi', 'risk stratification'],
    inputs: [
      { id: 'age', label: 'Age', type: 'select', options: [
        { label: '< 30 years', points: 0 },
        { label: '30–39 years', points: 8 },
        { label: '40–49 years', points: 25 },
        { label: '50–59 years', points: 41 },
        { label: '60–69 years', points: 58 },
        { label: '70–79 years', points: 75 },
        { label: '80–89 years', points: 91 },
        { label: '≥ 90 years', points: 100 }
      ] },
      { id: 'hr', label: 'Heart rate', type: 'select', options: [
        { label: '< 50 bpm', points: 0 },
        { label: '50–69 bpm', points: 3 },
        { label: '70–89 bpm', points: 9 },
        { label: '90–109 bpm', points: 15 },
        { label: '110–149 bpm', points: 24 },
        { label: '150–199 bpm', points: 38 },
        { label: '≥ 200 bpm', points: 46 }
      ] },
      { id: 'sbp', label: 'Systolic blood pressure', type: 'select', options: [
        { label: '< 80 mmHg', points: 58 },
        { label: '80–99 mmHg', points: 53 },
        { label: '100–119 mmHg', points: 43 },
        { label: '120–139 mmHg', points: 34 },
        { label: '140–159 mmHg', points: 24 },
        { label: '160–199 mmHg', points: 10 },
        { label: '≥ 200 mmHg', points: 0 }
      ] },
      { id: 'creat', label: 'Serum creatinine', type: 'select', options: [
        { label: '0 – 0.39 mg/dL', points: 1 },
        { label: '0.40 – 0.79 mg/dL', points: 4 },
        { label: '0.80 – 1.19 mg/dL', points: 7 },
        { label: '1.20 – 1.59 mg/dL', points: 10 },
        { label: '1.60 – 1.99 mg/dL', points: 13 },
        { label: '2.00 – 3.99 mg/dL', points: 21 },
        { label: '≥ 4.00 mg/dL', points: 28 }
      ] },
      { id: 'killip', label: 'Killip class', type: 'select', options: [
        { label: 'Class I — no heart failure', points: 0 },
        { label: 'Class II — rales / JVD', points: 20 },
        { label: 'Class III — pulmonary edema', points: 39 },
        { label: 'Class IV — cardiogenic shock', points: 59 }
      ] },
      { id: 'arrest', label: 'Cardiac arrest at admission', type: 'check', points: 39 },
      { id: 'st', label: 'ST-segment deviation', type: 'check', points: 28 },
      { id: 'enzymes', label: 'Elevated cardiac enzymes / markers', type: 'check', points: 14 }
    ],
    interpret: [
      { upTo: 60, text: 'Low risk (GRACE ≤ 60): in-hospital mortality ~0.2%.', level: 'low' },
      { upTo: 88, text: 'Low risk (GRACE 61–88): in-hospital mortality ~0.3–0.5%.', level: 'low' },
      { upTo: 108, text: 'Low risk (GRACE 89–108): in-hospital mortality ~0.6–0.8% (GRACE < 109 is the conventional low-risk band).', level: 'low' },
      { upTo: 128, text: 'Intermediate risk (GRACE 109–128): in-hospital mortality ~1.1–2.0%.', level: 'mod' },
      { upTo: 140, text: 'Intermediate risk (GRACE 129–140): in-hospital mortality ~2.1–2.9% (GRACE 109–140 is the conventional intermediate band).', level: 'mod' },
      { upTo: 155, text: 'High risk (GRACE 141–155): in-hospital mortality ~3–4%.', level: 'high' },
      { upTo: 175, text: 'High risk (GRACE 156–175): in-hospital mortality ~5–8%. GRACE > 140 supports an early invasive strategy in NSTE-ACS.', level: 'high' },
      { upTo: 199, text: 'Very high risk (GRACE 176–199): in-hospital mortality ~10–13%.', level: 'vhigh' },
      { upTo: 372, text: 'Very high risk (GRACE ≥ 200): in-hospital mortality ~18% to > 50% (52% at ≥ 250).', level: 'vhigh' }
    ],
    result: { unit: 'points' },
    notes: 'This is the original Granger 2003 point-based GRACE model for IN-HOSPITAL mortality; enter admission (baseline) values. Creatinine points use the published mg/dL bands. Mortality figures are read from the published GRACE nomogram (≤60 ~0.2%, 100 ~0.8%, 140 ~2.9%, 180 ~9.8%, ≥250 ≥52%). Conventional risk bands: < 109 low, 109–140 intermediate, > 140 high. GRACE 2.0 replaces the point table with nonlinear spline functions and also estimates 1-year and 3-year mortality — those versions are not reproduced here. Verify against the primary publication before clinical use.',
    refs: [
      'Granger CB et al. Arch Intern Med 2003;163:2345-53.',
      'Fox KAA et al. BMJ 2006;333:1091.',
      'Fox KAA et al. BMJ Open 2014;4:e004425 (GRACE 2.0).'
    ]
  });

  /* ---------- CRUSADE bleeding score (point-based) ---------- */
  CARDIO.register({
    id: 'crusade',
    name: 'CRUSADE Bleeding Score',
    category: 'acs',
    short: 'In-hospital major bleeding risk in NSTEMI',
    keywords: ['bleeding', 'nstemi', 'crusade', 'antithrombotic'],
    inputs: [
      { id: 'hct', label: 'Baseline hematocrit (%)', type: 'select', options: [
        { label: '≥ 40', points: 0 },
        { label: '37 – 39.9', points: 2 },
        { label: '34 – 36.9', points: 3 },
        { label: '31 – 33.9', points: 7 },
        { label: '< 31', points: 9 }
      ] },
      { id: 'crcl', label: 'Creatinine clearance (Cockcroft-Gault, mL/min)', type: 'select', options: [
        { label: '> 120', points: 0 },
        { label: '> 90 – 120', points: 7 },
        { label: '> 60 – 90', points: 17 },
        { label: '> 30 – 60', points: 28 },
        { label: '> 15 – 30', points: 35 },
        { label: '≤ 15', points: 39 }
      ], hint: 'Cockcroft-Gault: CrCl = (140 − age) × weight(kg) × (0.85 if female) / (72 × serum creatinine mg/dL)' },
      { id: 'hr', label: 'Heart rate (bpm)', type: 'select', options: [
        { label: '≤ 70', points: 0 },
        { label: '71 – 80', points: 1 },
        { label: '81 – 90', points: 3 },
        { label: '91 – 100', points: 6 },
        { label: '101 – 110', points: 8 },
        { label: '111 – 120', points: 10 },
        { label: '≥ 121', points: 11 }
      ] },
      { id: 'sbp', label: 'Systolic blood pressure (mmHg)', type: 'select', options: [
        { label: '121 – 180', points: 1 },
        { label: '101 – 120', points: 5 },
        { label: '181 – 200', points: 3 },
        { label: '91 – 100', points: 8 },
        { label: '≥ 201', points: 5 },
        { label: '≤ 90', points: 10 }
      ], hint: 'Risk is U-shaped: both very low and very high systolic BP add points' },
      { id: 'female', label: 'Female sex', type: 'check', points: 8 },
      { id: 'chf', label: 'Signs of CHF at presentation', type: 'check', points: 7 },
      { id: 'vasc', label: 'Prior vascular disease', hint: 'Prior peripheral artery disease or stroke', type: 'check', points: 6 },
      { id: 'dm', label: 'Diabetes mellitus', type: 'check', points: 6 }
    ],
    interpret: [
      { upTo: 20, text: 'Very low risk (score ≤ 20): predicted in-hospital major bleeding ~3.1%.', level: 'low' },
      { upTo: 30, text: 'Low risk (score 21–30): predicted in-hospital major bleeding ~5.5%.', level: 'low' },
      { upTo: 40, text: 'Moderate risk (score 31–40): predicted in-hospital major bleeding ~8.6%.', level: 'mod' },
      { upTo: 50, text: 'High risk (score 41–50): predicted in-hospital major bleeding ~11.9%.', level: 'high' },
      { upTo: 100, text: 'Very high risk (score > 50): predicted in-hospital major bleeding ~19.5%.', level: 'vhigh' }
    ],
    result: { unit: 'points' },
    notes: 'Derived and validated in community-treated NSTEMI patients (CRUSADE registry). Score range 1–100. Creatinine clearance is by the Cockcroft-Gault equation. The systolic BP contribution is U-shaped (points for both hypotension and severe hypertension). Predicted bleeding rates are the published quintile figures (≤20 ~3.1%, 21–30 ~5.5%, 31–40 ~8.6%, 41–50 ~11.9%, > 50 ~19.5%). A high bleeding score should prompt bleeding-avoidance strategies, not automatic withholding of indicated antithrombotic therapy. Verify against the primary publication before clinical use.',
    refs: [
      'Subherwal S et al. Circulation 2009;119:1873-82.'
    ]
  });

})();
