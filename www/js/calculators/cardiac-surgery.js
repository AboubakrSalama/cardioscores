/* Category: surgery — Cardiac surgery risk (CABG, valve surgery, TAVR)
 * Each entry follows SCHEMA.md. Point values verified against primary publications.
 * Per the user's requirement, every score is computed on-device (no external links).
 * EuroSCORE II implements the FULL published logistic model. STS PROM and STS/ACC TVT
 * are proprietary; they are implemented as clearly-labeled local approximations. */
(function () {
  'use strict';

  /* ---------- EuroSCORE II (full local logistic model, Nashef 2012) ----------
   * Predicted mortality = e^y / (1 + e^y), y = b0 + sum(bi * xi).
   * Intercept b0 = -5.324537. Age term = max(1, age - 59), coefficient 0.0285181
   * (Xi = 1 for age <= 60, +1 per year thereafter). All coefficients from Table 3.
   *
   * WORKED SANITY CHECK (used in a unit assertion in the smoke test):
   *   65-year-old male, elective isolated CABG, LVEF > 50%, NYHA I, CrCl > 85, no other
   *   factors. Age term = 65 - 59 = 6.  y = -5.324537 + 0.0285181*6 = -5.153428.
   *   Predicted mortality = e^(-5.153428)/(1+e^(-5.153428)) = 0.00578 = ~0.58%.
   * Adding female sex (+0.2196434) -> y = -4.933785 -> ~0.72%. */
  CARDIO.register({
    id: 'euroscore-ii',
    name: 'EuroSCORE II',
    category: 'surgery',
    short: 'Predicted in-hospital mortality after major cardiac surgery (logistic model)',
    keywords: ['cabg', 'valve', 'mortality', 'euroscore', 'cardiac surgery'],
    kind: 'custom',
    inputs: [
      { id: 'age', label: 'Age', type: 'number', unit: 'years', min: 18, max: 110, step: 1, placeholder: 'e.g., 68' },
      { id: 'female', label: 'Female sex', type: 'check' },
      { id: 'idd', label: 'Insulin-dependent diabetes mellitus', type: 'check' },
      { id: 'copd', label: 'Chronic pulmonary dysfunction', hint: 'Long-term bronchodilators or steroids for lung disease', type: 'check' },
      { id: 'mobility', label: 'Poor mobility', hint: 'Neurological or musculoskeletal dysfunction severely affecting mobility', type: 'check' },
      { id: 'redo', label: 'Previous cardiac surgery', hint: 'Requiring opening of the pericardium', type: 'check' },
      { id: 'endocarditis', label: 'Active endocarditis', hint: 'On antibiotics for endocarditis at the time of surgery', type: 'check' },
      { id: 'critical', label: 'Critical preoperative state', hint: 'VT/VF or aborted sudden death, cardiac massage, ventilation before anesthesia, inotropes/IABP/VAD, or acute renal failure preoperatively', type: 'check' },
      { id: 'ccs4', label: 'CCS class 4 angina', type: 'check' },
      { id: 'recentmi', label: 'Recent myocardial infarction (≤ 90 days)', type: 'check' },
      { id: 'aorta', label: 'Surgery on thoracic aorta', type: 'check' },
      { id: 'arteriopathy', label: 'Extracardiac arteriopathy', hint: 'Claudication, carotid > 50% stenosis/occlusion, or prior/planned intervention on aorta, limb or carotid arteries', type: 'check' },
      { id: 'renal', label: 'Renal impairment (creatinine clearance, Cockcroft-Gault)', type: 'select', options: [
        { label: 'Normal (CrCl > 85 mL/min)', value: 'normal' },
        { label: 'Moderate (CrCl 50–85 mL/min)', value: 'moderate' },
        { label: 'Severe (CrCl < 50 mL/min, not on dialysis)', value: 'severe' },
        { label: 'On dialysis (regardless of creatinine)', value: 'dialysis' }
      ] },
      { id: 'nyha', label: 'NYHA class', type: 'select', options: [
        { label: 'I', value: 1 },
        { label: 'II', value: 2 },
        { label: 'III', value: 3 },
        { label: 'IV', value: 4 }
      ] },
      { id: 'lv', label: 'LV function', type: 'select', options: [
        { label: 'Good (LVEF > 50%)', value: 'good' },
        { label: 'Moderate (LVEF 31–50%)', value: 'moderate' },
        { label: 'Poor (LVEF 21–30%)', value: 'poor' },
        { label: 'Very poor (LVEF ≤ 20%)', value: 'vpoor' }
      ] },
      { id: 'pah', label: 'Pulmonary hypertension', type: 'select', options: [
        { label: 'None / < 31 mmHg', value: 'none' },
        { label: 'Moderate (PA systolic 31–55 mmHg)', value: 'moderate' },
        { label: 'Severe (PA systolic > 55 mmHg)', value: 'severe' }
      ] },
      { id: 'urgency', label: 'Urgency', type: 'select', options: [
        { label: 'Elective', value: 'elective' },
        { label: 'Urgent', value: 'urgent' },
        { label: 'Emergency', value: 'emergency' },
        { label: 'Salvage', value: 'salvage' }
      ] },
      { id: 'weight', label: 'Weight of intervention', type: 'select', options: [
        { label: 'Isolated CABG', value: 'cabg' },
        { label: 'Single non-CABG procedure', value: 'single' },
        { label: 'Two procedures', value: 'two' },
        { label: 'Three or more procedures', value: 'three' }
      ] }
    ],
    compute: function (v) {
      if (v.age == null) return null;
      var b0 = -5.324537;
      var y = b0;
      var ageTerm = Math.max(1, v.age - 59);
      y += 0.0285181 * ageTerm;
      if (v.female) y += 0.2196434;
      if (v.idd) y += 0.3542749;
      if (v.copd) y += 0.1886564;
      if (v.mobility) y += 0.2407181;
      if (v.redo) y += 1.118599;
      if (v.endocarditis) y += 0.6194522;
      if (v.critical) y += 1.086517;
      if (v.ccs4) y += 0.2226147;
      if (v.recentmi) y += 0.1528943;
      if (v.aorta) y += 0.6527205;
      if (v.arteriopathy) y += 0.5360268;
      var renal = v.renal || 'normal';
      if (renal === 'moderate') y += 0.303553;
      else if (renal === 'severe') y += 0.8592256;
      else if (renal === 'dialysis') y += 0.6421508;
      var nyha = v.nyha || 1;
      if (nyha === 2) y += 0.1070545;
      else if (nyha === 3) y += 0.2958358;
      else if (nyha === 4) y += 0.5597929;
      var lv = v.lv || 'good';
      if (lv === 'moderate') y += 0.3150652;
      else if (lv === 'poor') y += 0.8084096;
      else if (lv === 'vpoor') y += 0.9346919;
      var pah = v.pah || 'none';
      if (pah === 'moderate') y += 0.1788899;
      else if (pah === 'severe') y += 0.3491475;
      var urg = v.urgency || 'elective';
      if (urg === 'urgent') y += 0.3174673;
      else if (urg === 'emergency') y += 0.7039121;
      else if (urg === 'salvage') y += 1.362947;
      var wt = v.weight || 'cabg';
      if (wt === 'single') y += 0.0062118;
      else if (wt === 'two') y += 0.5521478;
      else if (wt === 'three') y += 0.9724533;
      var mort = Math.exp(y) / (1 + Math.exp(y)) * 100;
      var level;
      if (mort < 2) level = 'low';
      else if (mort < 5) level = 'mod';
      else if (mort < 10) level = 'high';
      else level = 'vhigh';
      return {
        value: mort.toFixed(2),
        unit: '% predicted in-hospital mortality',
        text: 'EuroSCORE II predicted in-hospital mortality ≈ ' + mort.toFixed(2) + '%. Successor to the 1999 EuroSCORE, recalibrated to contemporary (2010) surgical outcomes across the full range of adult cardiac surgery.',
        level: level,
        detail: 'Logit y = ' + y.toFixed(4) + ' (intercept −5.324537, age term ' + ageTerm + ' × 0.0285181)'
      };
    },
    notes: 'Full published logistic model implemented locally (Nashef 2012, Table 3): predicted mortality = e^y/(1+e^y). Age is coded as max(1, age−59) with coefficient 0.0285181. Renal impairment uses creatinine clearance (Cockcroft-Gault); note the published quirk that severe impairment off dialysis carries a higher coefficient (0.859) than dialysis (0.642). Coefficients carry 7 significant figures — small transcription errors distort the estimate, so cross-check a few cases against the official EuroSCORE II calculator. Verify against the primary publication before clinical use.',
    refs: [
      'Nashef SA et al. EuroSCORE II. Eur J Cardiothorac Surg 2012;41:734-44.'
    ]
  });

  /* ---------- EuroSCORE I (additive) ----------
   * Classic 17-item additive score (Nashef 1999 / Roques 1999). Point values below
   * match the original publication. Retained for reference/teaching: it substantially
   * overestimates mortality in contemporary practice. */
  CARDIO.register({
    id: 'euroscore-i-additive',
    name: 'EuroSCORE I (additive)',
    category: 'surgery',
    short: 'Classic additive estimate of operative mortality in cardiac surgery (superseded by EuroSCORE II)',
    keywords: ['cabg', 'valve', 'mortality', 'euroscore', 'additive'],
    inputs: [
      { id: 'age', label: 'Age', hint: '1 point per 5 years or part thereof over 60 years', type: 'select', options: [
        { label: '≤ 60 years', points: 0 },
        { label: '61–65 years', points: 1 },
        { label: '66–70 years', points: 2 },
        { label: '71–75 years', points: 3 },
        { label: '76–80 years', points: 4 },
        { label: '81–85 years', points: 5 },
        { label: '86–90 years', points: 6 },
        { label: '> 90 years', points: 7 }
      ] },
      { id: 'sex', label: 'Sex female', type: 'check', points: 1 },
      { id: 'copd', label: 'Chronic pulmonary disease', hint: 'Long-term use of bronchodilators or steroids for lung disease', type: 'check', points: 1 },
      { id: 'arteriopathy', label: 'Extracardiac arteriopathy', hint: 'Claudication, carotid occlusion or > 50% stenosis, or previous/planned intervention on the abdominal aorta, limb arteries or carotids', type: 'check', points: 2 },
      { id: 'neuro', label: 'Neurological dysfunction', hint: 'Disease severely affecting ambulation or day-to-day functioning', type: 'check', points: 2 },
      { id: 'redo', label: 'Previous cardiac surgery', hint: 'Requiring opening of the pericardium', type: 'check', points: 3 },
      { id: 'creat', label: 'Serum creatinine > 200 µmol/L (> 2.26 mg/dL)', type: 'check', points: 2 },
      { id: 'endocarditis', label: 'Active endocarditis', hint: 'Still on antibiotic treatment for endocarditis at the time of surgery', type: 'check', points: 3 },
      { id: 'critical', label: 'Critical preoperative state', hint: 'VT/VF or aborted sudden death, preoperative cardiac massage, ventilation before arrival in the anesthetic room, preoperative inotropes or IABP, or preoperative acute renal failure (anuria or oliguria < 10 mL/h)', type: 'check', points: 3 },
      { id: 'ua', label: 'Unstable angina', hint: 'Rest angina requiring IV nitrates until arrival in the anesthetic room', type: 'check', points: 2 },
      { id: 'lv', label: 'LV function', type: 'select', options: [
        { label: 'Good (LVEF > 50%)', points: 0 },
        { label: 'Moderate (LVEF 30–50%)', points: 1 },
        { label: 'Poor (LVEF < 30%)', points: 3 }
      ] },
      { id: 'mi', label: 'Recent myocardial infarction (within 90 days)', type: 'check', points: 2 },
      { id: 'ph', label: 'Pulmonary hypertension', hint: 'Systolic pulmonary artery pressure > 60 mmHg', type: 'check', points: 2 },
      { id: 'emergency', label: 'Emergency operation', hint: 'Carried out on referral before the beginning of the next working day', type: 'check', points: 2 },
      { id: 'noncabg', label: 'Other than isolated CABG', hint: 'Major cardiac procedure other than, or in addition to, CABG', type: 'check', points: 2 },
      { id: 'aorta', label: 'Surgery on thoracic aorta', hint: 'Ascending, arch or descending aorta', type: 'check', points: 3 },
      { id: 'septal', label: 'Postinfarct septal rupture', type: 'check', points: 4 }
    ],
    interpret: [
      { upTo: 2, text: 'Low risk group (0–2): operative mortality ~1% in the original 1995 cohorts. Contemporary mortality is lower.', level: 'low' },
      { upTo: 5, text: 'Medium risk group (3–5): operative mortality ~3% in the original cohorts.', level: 'mod' },
      { upTo: 44, text: 'High risk group (≥ 6): operative mortality ~11% in the original cohorts. Consider the logistic model / EuroSCORE II for very-high-risk patients, where the additive score underperforms.', level: 'high' }
    ],
    notes: 'Derived from 1995 European data; overestimates risk in modern practice and has been superseded by EuroSCORE II. Kept for reference and education.',
    refs: [
      'Nashef SA et al. European system for cardiac operative risk evaluation (EuroSCORE). Eur J Cardiothorac Surg 1999;16:9-13.',
      'Roques F et al. Risk factors and outcome in European cardiac surgery: analysis of the EuroSCORE multinational database of 19030 patients. Eur J Cardiothorac Surg 1999;15:816-22.'
    ]
  });

  /* ---------- STS Risk Score / PROM (local risk-category classifier) ----------
   * The STS 2018 PROM is a set of proprietary procedure-specific logistic models with
   * dozens of variables; the per-variable coefficients are NOT published, so the exact
   * percentage cannot be reproduced locally. This tool does the two things that ARE
   * defensible from the public literature: (1) classify a known STS-PROM percentage into
   * the guideline risk bands (<4 / 4-8 / >8%), and (2) let the clinician review the major
   * published mortality risk factors. It does NOT compute a percentage from scratch. */
  CARDIO.register({
    id: 'sts-prom',
    name: 'STS Risk Score (PROM) — risk-band classifier',
    category: 'surgery',
    short: 'Predicted risk of mortality and major morbidity for common adult cardiac operations',
    keywords: ['sts', 'prom', 'cabg', 'avr', 'mvr', 'mortality', 'morbidity'],
    kind: 'custom',
    inputs: [
      { id: 'prom', label: 'STS-PROM (from the official STS calculator)', type: 'number', unit: '%', min: 0, max: 100, step: 0.1, placeholder: 'e.g., 3.2', hint: 'Enter the percentage produced by the official STS ACSD calculator to classify it' },
      { id: 'emergent', label: 'Reference: emergent/salvage status', hint: 'One of the strongest published mortality drivers', type: 'check' },
      { id: 'dialysis', label: 'Reference: dialysis / renal failure', type: 'check' },
      { id: 'shock', label: 'Reference: cardiogenic shock', type: 'check' },
      { id: 'redo', label: 'Reference: reoperation', type: 'check' },
      { id: 'combined', label: 'Reference: combined valve + CABG procedure', type: 'check' }
    ],
    compute: function (v) {
      if (v.prom == null) return null;
      var p = v.prom;
      var band, level;
      if (p < 4) { band = 'Low risk (STS-PROM < 4%)'; level = 'low'; }
      else if (p <= 8) { band = 'Intermediate risk (STS-PROM 4–8%)'; level = 'mod'; }
      else { band = 'High risk (STS-PROM > 8%)'; level = 'high'; }
      var flags = [];
      if (v.emergent) flags.push('emergent/salvage');
      if (v.dialysis) flags.push('dialysis/renal failure');
      if (v.shock) flags.push('cardiogenic shock');
      if (v.redo) flags.push('reoperation');
      if (v.combined) flags.push('combined valve+CABG');
      return {
        value: p.toFixed(1),
        unit: '% (classified)',
        text: band + '. These thresholds are used in the 2020 ACC/AHA valvular heart disease guideline for surgical-risk stratification, though STS-PROM is only one input alongside frailty, major-organ compromise and procedure-specific impediments; the TAVR-vs-SAVR decision now weighs age/life expectancy heavily.',
        level: level,
        detail: 'Major published high-risk factors flagged: ' + (flags.length ? flags.join(', ') : 'none')
      };
    },
    notes: 'LOCAL RISK-BAND CLASSIFIER, not a reproduction of the STS PROM. The STS 2018 models are proprietary procedure-specific regressions (isolated CABG / isolated valve / combined valve+CABG) whose per-variable coefficients are NOT published; no valid local recomputation of the percentage is possible, and no official point-based version exists. Enter the percentage from the official STS ACSD Operative Risk Calculator to classify it against the guideline bands (<4 / 4–8 / >8%). The checkboxes are an educational reminder of the strongest published mortality drivers, not a scoring input. The official STS calculator remains the reference for reporting. Verify against the primary publication before clinical use.',
    refs: [
      'Shahian DM et al. The Society of Thoracic Surgeons 2018 Adult Cardiac Surgery Risk Models: Part 1. Ann Thorac Surg 2018;105:1411-8.',
      'O\'Brien SM et al. The Society of Thoracic Surgeons 2018 Adult Cardiac Surgery Risk Models: Part 2. Ann Thorac Surg 2018;105:1419-28.',
      'Otto CM et al. 2020 ACC/AHA Guideline for the Management of Patients With Valvular Heart Disease. J Am Coll Cardiol 2021;77:e25-197.'
    ]
  });

  /* ---------- ACEF ----------
   * ACEF = age / LVEF(%) + 1 if serum creatinine > 2.0 mg/dL (Ranucci 2009).
   * Sanity check: age 60, LVEF 40%, creatinine ≤ 2.0 → 60/40 = 1.50. */
  CARDIO.register({
    id: 'acef',
    name: 'ACEF Score',
    category: 'surgery',
    short: 'Parsimonious operative mortality estimate for elective cardiac surgery (age, creatinine, EF)',
    keywords: ['acef', 'age creatinine ejection fraction', 'mortality', 'parsimony'],
    kind: 'custom',
    inputs: [
      { id: 'age', label: 'Age', type: 'number', unit: 'years', min: 18, max: 110, step: 1, placeholder: 'e.g., 68' },
      { id: 'lvef', label: 'Left ventricular ejection fraction', type: 'number', unit: '%', min: 10, max: 80, step: 1, placeholder: 'e.g., 55' },
      { id: 'cr', label: 'Serum creatinine > 2.0 mg/dL (177 µmol/L)', type: 'check' }
    ],
    compute: function (v) {
      if (v.age === null || v.lvef === null) return null;
      if (v.lvef <= 0) return null;
      var base = v.age / v.lvef;
      var score = base + (v.cr ? 1 : 0);
      var detail = 'Age / LVEF = ' + base.toFixed(2) + (v.cr ? '\nCreatinine > 2.0 mg/dL: +1.00' : '');
      return {
        value: score.toFixed(2),
        unit: '',
        text: 'Operative mortality rises continuously with the ACEF score; no standard risk categories are defined in the derivation study. In the derivation cohort (elective cardiac surgery) discrimination was comparable to more complex scores (per Ranucci 2009).',
        level: 'info',
        detail: detail
      };
    },
    notes: 'Derived and validated in ELECTIVE cardiac operations only — not applicable to emergency surgery (see ACEF II). Interpretation per Ranucci 2009: use as a continuous risk indicator alongside, not instead of, full models such as EuroSCORE II or STS.',
    refs: [
      'Ranucci M et al. Risk of assessing mortality risk in elective cardiac operations: age, creatinine, ejection fraction, and the law of parsimony. Circulation 2009;119:3053-61.'
    ]
  });

  /* ---------- ACEF II ----------
   * ACEF II = age / LVEF(%) + 1 if creatinine > 2.0 mg/dL + 2 if emergency surgery
   *           + 0.2 × (36 − hematocrit) when hematocrit < 36% (Ranucci 2018).
   * Sanity checks: age 60, LVEF 40%, elective, Cr ≤ 2, Hct ≥ 36 → 1.50 (same as ACEF).
   *                Same patient, emergency + Hct 30 → 1.50 + 2 + 0.2×6 = 4.70. */
  CARDIO.register({
    id: 'acef-ii',
    name: 'ACEF II Score',
    category: 'surgery',
    short: 'Updated ACEF adding emergency status and anemia; applicable to elective and emergency cardiac surgery',
    keywords: ['acef', 'acef 2', 'hematocrit', 'emergency', 'mortality'],
    kind: 'custom',
    inputs: [
      { id: 'age', label: 'Age', type: 'number', unit: 'years', min: 18, max: 110, step: 1, placeholder: 'e.g., 68' },
      { id: 'lvef', label: 'Left ventricular ejection fraction', type: 'number', unit: '%', min: 10, max: 80, step: 1, placeholder: 'e.g., 55' },
      { id: 'hct', label: 'Hematocrit', type: 'number', unit: '%', min: 10, max: 60, step: 0.1, placeholder: 'e.g., 38', hint: 'Adds 0.2 points per hematocrit point below 36%' },
      { id: 'cr', label: 'Serum creatinine > 2.0 mg/dL (177 µmol/L)', type: 'check' },
      { id: 'emergency', label: 'Emergency surgery', type: 'check' }
    ],
    compute: function (v) {
      if (v.age === null || v.lvef === null || v.hct === null) return null;
      if (v.lvef <= 0) return null;
      var base = v.age / v.lvef;
      var anemia = v.hct < 36 ? 0.2 * (36 - v.hct) : 0;
      var score = base + (v.cr ? 1 : 0) + (v.emergency ? 2 : 0) + anemia;
      var lines = ['Age / LVEF = ' + base.toFixed(2)];
      if (v.cr) { lines.push('Creatinine > 2.0 mg/dL: +1.00'); }
      if (v.emergency) { lines.push('Emergency surgery: +2.00'); }
      if (anemia > 0) { lines.push('Anemia (Hct ' + v.hct + '%): +' + anemia.toFixed(2)); }
      return {
        value: score.toFixed(2),
        unit: '',
        text: 'Operative mortality rises continuously with the ACEF II score; the update recalibrated ACEF and extended it to emergency operations and anemic patients (Ranucci 2018). No standard categorical cut-offs are defined.',
        level: 'info',
        detail: lines.join('\n')
      };
    },
    notes: 'Use as a parsimonious bedside estimate; full models (EuroSCORE II, STS) remain the reference for formal risk assessment.',
    refs: [
      'Ranucci M et al. ACEF II Risk Score for cardiac surgery: updated but still parsimonious. Eur Heart J 2018;39:2183-9.'
    ]
  });

  /* ---------- STS/ACC TVT TAVR in-hospital mortality (local OR-based surrogate) ----------
   * The official model's exact coefficients/intercept are not fully published. This is a
   * LOCAL APPROXIMATION built from the published odds ratios (Edwards 2016, Table) applied
   * as a logistic model, anchored to the derivation-cohort baseline in-hospital mortality
   * of 5.3%. Published ORs used (log-OR = beta):
   *   Age            OR 1.13 per 5 yr  -> beta = ln(1.13)/5 per year, centered at 80 yr
   *   GFR            OR 0.93 per 5 units (protective), centered at 60 mL/min
   *   Hemodialysis   OR 3.25
   *   Severe lung dz OR 1.67
   *   Nonfemoral access OR 1.96
   *   Acuity 2       OR 1.57 ; Acuity 3 OR 2.70 ; Acuity 4 (salvage) OR 3.34
   *   NYHA IV        OR 1.25 (conservative value; sources disagree 1.25 vs 3.34)
   * Intercept solved so a reference patient (age 80, GFR 60, no risk flags, elective)
   * returns the 5.3% cohort baseline. */
  CARDIO.register({
    id: 'sts-acc-tvt-tavr',
    name: 'STS/ACC TVT Score (TAVR In-Hospital Mortality)',
    category: 'surgery',
    short: 'Predicted in-hospital mortality after transcatheter aortic valve replacement',
    keywords: ['tavr', 'tavi', 'tvt', 'aortic stenosis', 'transcatheter'],
    kind: 'custom',
    inputs: [
      { id: 'age', label: 'Age', type: 'number', unit: 'years', min: 40, max: 110, step: 1, placeholder: 'e.g., 84' },
      { id: 'gfr', label: 'Glomerular filtration rate', type: 'number', unit: 'mL/min/1.73 m²', min: 5, max: 150, step: 1, placeholder: 'e.g., 55', hint: 'Not used if on dialysis' },
      { id: 'dialysis', label: 'Hemodialysis', type: 'check' },
      { id: 'lung', label: 'Severe chronic lung disease', type: 'check' },
      { id: 'nonfem', label: 'Nonfemoral (alternative) access', type: 'check' },
      { id: 'nyha4', label: 'NYHA class IV', type: 'check' },
      { id: 'acuity', label: 'Procedural acuity', type: 'select', options: [
        { label: 'Elective (category 1)', value: 0 },
        { label: 'Category 2', value: 1 },
        { label: 'Category 3', value: 2 },
        { label: 'Category 4 — salvage', value: 3 }
      ] }
    ],
    compute: function (v) {
      if (v.age == null) return null;
      if (!v.dialysis && v.gfr == null) return null;
      var bAgePerYr = Math.log(1.13) / 5;      // OR 1.13 per 5 yr
      var bGfrPerUnit = Math.log(0.93) / 5;    // OR 0.93 per 5 units (protective)
      // Intercept anchored so reference patient (age 80, GFR 60, no flags, elective) = 5.3%.
      var baseline = 0.053;
      var b0 = Math.log(baseline / (1 - baseline)) - (bAgePerYr * 80) - (bGfrPerUnit * 60);
      var y = b0;
      y += bAgePerYr * v.age;
      // On dialysis: GFR term omitted, dialysis OR applied instead.
      if (v.dialysis) { y += bGfrPerUnit * 60; y += Math.log(3.25); }
      else { y += bGfrPerUnit * v.gfr; }
      if (v.lung) y += Math.log(1.67);
      if (v.nonfem) y += Math.log(1.96);
      if (v.nyha4) y += Math.log(1.25);
      var acu = v.acuity || 0;
      if (acu === 1) y += Math.log(1.57);
      else if (acu === 2) y += Math.log(2.70);
      else if (acu === 3) y += Math.log(3.34);
      var mort = Math.exp(y) / (1 + Math.exp(y)) * 100;
      var level;
      if (mort < 3) level = 'low';
      else if (mort < 7) level = 'mod';
      else if (mort < 15) level = 'high';
      else level = 'vhigh';
      return {
        value: mort.toFixed(1),
        unit: '% (approx.) in-hospital mortality',
        text: 'Approximate in-hospital mortality after TAVR ≈ ' + mort.toFixed(1) + '%. Surrogate anchored to the 5.3% derivation-cohort baseline (Edwards 2016). Contemporary TAVR mortality is now lower (~1–2%), so this derivation-era model tends to overestimate.',
        level: level,
        detail: 'Logit y = ' + y.toFixed(3) + ' (from published odds ratios; discrimination in the source model was modest, C ≈ 0.66–0.67)'
      };
    },
    notes: 'LOCAL APPROXIMATION of a proprietary registry model, not the official tool. Built from the published odds ratios in Edwards 2016 (age 1.13/5 yr, GFR 0.93/5 units, dialysis 3.25, severe lung disease 1.67, nonfemoral access 1.96, acuity 1.57/2.70/3.34, NYHA IV 1.25) applied as a logistic model anchored to the 5.3% cohort baseline; the official intercept and any interaction/spline terms are not public. The NYHA IV odds ratio is uncertain (sources report 1.25 vs 3.34) — the conservative 1.25 is used here. The model has only modest discrimination (C ≈ 0.66–0.67). The official ACC/STS TVT TAVR calculator remains the reference for reporting. Verify against the primary publication before clinical use.',
    refs: [
      'Edwards FH et al. Development and validation of a risk prediction model for in-hospital mortality after transcatheter aortic valve replacement. JAMA Cardiol 2016;1:46-52.'
    ]
  });

})();
