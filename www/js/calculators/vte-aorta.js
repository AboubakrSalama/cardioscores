/* Category: vte — Pulmonary embolism / VTE, aortic syndromes & pulmonary hypertension
 * Each entry follows SCHEMA.md. Point values / cut-offs verified against primary
 * publications (Benza 2019 REVEAL 2.0; Humbert 2022 ESC/ERS PH guideline). */
(function () {
  'use strict';

  /* ---------- Wells score for PE ----------
   * kind:'custom' because the score uses half-points (1.5), which the 'points'
   * engine (integer checkbox points) cannot represent exactly. */
  CARDIO.register({
    id: 'wells-pe',
    name: 'Wells Score (Pulmonary Embolism)',
    category: 'vte',
    short: 'Pretest probability of pulmonary embolism',
    keywords: ['pe', 'pulmonary embolism', 'pretest probability', 'd-dimer', 'ctpa'],
    kind: 'custom',
    inputs: [
      { id: 'dvtsigns', label: 'Clinical signs and symptoms of DVT', hint: 'Minimum: leg swelling and pain with palpation of the deep veins', type: 'check' },
      { id: 'altdx', label: 'PE is the #1 diagnosis, or equally likely', type: 'check' },
      { id: 'hr100', label: 'Heart rate > 100 bpm', type: 'check' },
      { id: 'immob', label: 'Immobilization ≥ 3 days or surgery in the previous 4 weeks', type: 'check' },
      { id: 'priorvte', label: 'Previous objectively diagnosed PE or DVT', type: 'check' },
      { id: 'hemopt', label: 'Hemoptysis', type: 'check' },
      { id: 'cancer', label: 'Malignancy', hint: 'On treatment, treated within the last 6 months, or palliative', type: 'check' }
    ],
    compute: function (v) {
      var s = 0;
      if (v.dvtsigns) s += 3;
      if (v.altdx) s += 3;
      if (v.hr100) s += 1.5;
      if (v.immob) s += 1.5;
      if (v.priorvte) s += 1.5;
      if (v.hemopt) s += 1;
      if (v.cancer) s += 1;
      var three, level;
      if (s < 2) { three = 'Low probability (~1.3% PE prevalence in validation)'; level = 'low'; }
      else if (s <= 6) { three = 'Moderate probability (~16% PE prevalence)'; level = 'mod'; }
      else { three = 'High probability (~38% PE prevalence)'; level = 'high'; }
      var two = (s <= 4)
        ? 'Two-tier: PE UNLIKELY (≤ 4) — with a negative D-dimer, PE was safely excluded in the Christopher study (0.5% 3-month VTE).'
        : 'Two-tier: PE LIKELY (> 4) — proceed to CT pulmonary angiography.';
      return {
        value: (s % 1 === 0) ? String(s) : s.toFixed(1),
        unit: 'points',
        text: 'Three-tier: ' + three + '. ' + two,
        level: level
      };
    },
    notes: 'Three-tier: < 2 low, 2–6 moderate, > 6 high. Two-tier (dichotomized): ≤ 4 PE unlikely, > 4 PE likely. Apply D-dimer only to low/moderate or "unlikely" patients.',
    refs: [
      'Wells PS et al. Thromb Haemost 2000;83:416-20.',
      'Wells PS et al. Ann Intern Med 2001;135:98-107.',
      'van Belle A et al. (Christopher Study) JAMA 2006;295:172-9.'
    ]
  });

  /* ---------- Wells score for DVT ---------- */
  CARDIO.register({
    id: 'wells-dvt',
    name: 'Wells Score (DVT)',
    category: 'vte',
    short: 'Pretest probability of deep vein thrombosis',
    keywords: ['dvt', 'deep vein thrombosis', 'leg swelling', 'd-dimer', 'ultrasound'],
    inputs: [
      { id: 'cancer', label: 'Active cancer', hint: 'Treatment ongoing, within 6 months, or palliative', type: 'check', points: 1 },
      { id: 'paralysis', label: 'Paralysis, paresis, or recent plaster immobilization of the lower extremities', type: 'check', points: 1 },
      { id: 'bedridden', label: 'Recently bedridden ≥ 3 days, or major surgery within 12 weeks', hint: 'Surgery requiring general or regional anesthesia', type: 'check', points: 1 },
      { id: 'tender', label: 'Localized tenderness along the distribution of the deep venous system', type: 'check', points: 1 },
      { id: 'legswell', label: 'Entire leg swollen', type: 'check', points: 1 },
      { id: 'calf', label: 'Calf swelling ≥ 3 cm compared with the asymptomatic leg', hint: 'Measured 10 cm below the tibial tuberosity', type: 'check', points: 1 },
      { id: 'pitting', label: 'Pitting edema confined to the symptomatic leg', type: 'check', points: 1 },
      { id: 'collat', label: 'Collateral superficial veins (nonvaricose)', type: 'check', points: 1 },
      { id: 'priordvt', label: 'Previously documented DVT', type: 'check', points: 1 },
      { id: 'altdx', label: 'Alternative diagnosis at least as likely as DVT', type: 'check', points: -2 }
    ],
    interpret: [
      { upTo: 0, text: 'Low probability (~5% DVT prevalence). D-dimer testing; if negative, DVT is excluded.', level: 'low' },
      { upTo: 2, text: 'Moderate probability (~17% DVT prevalence). High-sensitivity D-dimer or ultrasound.', level: 'mod' },
      { upTo: 9, text: 'High probability (DVT prevalence up to ~53%). Proceed to ultrasound.', level: 'high' }
    ],
    notes: 'Includes the 2003 modification (+1 for previously documented DVT); range −2 to 9. Two-tier (Wells 2003): < 2 = DVT unlikely (~6% prevalence; negative D-dimer safely excludes DVT), ≥ 2 = DVT likely (~28% prevalence; image).',
    refs: [
      'Wells PS et al. Lancet 1997;350:1795-8.',
      'Wells PS et al. N Engl J Med 2003;349:1227-35.'
    ]
  });

  /* ---------- Revised Geneva score (points version) ---------- */
  CARDIO.register({
    id: 'revised-geneva',
    name: 'Revised Geneva Score (PE)',
    category: 'vte',
    short: 'Pretest probability of PE from objective variables only (no gestalt)',
    keywords: ['pe', 'pulmonary embolism', 'geneva', 'pretest probability'],
    inputs: [
      { id: 'age', label: 'Age > 65 years', type: 'check', points: 1 },
      { id: 'priorvte', label: 'Previous DVT or PE', type: 'check', points: 3 },
      { id: 'surgery', label: 'Surgery or fracture within 1 month', hint: 'Surgery under general anesthesia or lower-limb fracture', type: 'check', points: 2 },
      { id: 'cancer', label: 'Active malignant condition', hint: 'Solid or hematologic, currently active or considered cured < 1 year', type: 'check', points: 2 },
      { id: 'unipain', label: 'Unilateral lower-limb pain', type: 'check', points: 3 },
      { id: 'hemopt', label: 'Hemoptysis', type: 'check', points: 2 },
      { id: 'hr', label: 'Heart rate', type: 'select', options: [
        { label: '< 75 bpm', points: 0 },
        { label: '75–94 bpm', points: 3 },
        { label: '≥ 95 bpm', points: 5 }
      ] },
      { id: 'palpation', label: 'Pain on lower-limb deep venous palpation AND unilateral edema', type: 'check', points: 4 }
    ],
    interpret: [
      { upTo: 3, text: 'Low probability (PE prevalence ~8%).', level: 'low' },
      { upTo: 10, text: 'Intermediate probability (PE prevalence ~28%).', level: 'mod' },
      { upTo: 25, text: 'High probability (PE prevalence ~74%). Proceed to imaging.', level: 'high' }
    ],
    notes: 'Fully objective — no clinician-gestalt item, unlike the Wells score. A simplified (1-point-per-item) version also exists (Klok 2008).',
    refs: [
      'Le Gal G et al. Ann Intern Med 2006;144:165-71.',
      'Klok FA et al. Arch Intern Med 2008;168:2131-6.'
    ]
  });

  /* ---------- PERC rule ---------- */
  CARDIO.register({
    id: 'perc',
    name: 'PERC Rule',
    category: 'vte',
    short: 'Rules out PE without D-dimer in low-pretest-probability patients',
    keywords: ['pe', 'pulmonary embolism', 'rule out', 'perc', 'emergency'],
    kind: 'custom',
    inputs: [
      { id: 'lowprob', label: 'Clinician pretest probability is LOW (< 15%, gestalt)', hint: 'PERC applies only in this setting', type: 'check' },
      { id: 'age50', label: 'Age ≥ 50 years', type: 'check' },
      { id: 'hr100', label: 'Heart rate ≥ 100 bpm', type: 'check' },
      { id: 'sao2', label: 'SaO₂ < 95% on room air', type: 'check' },
      { id: 'legswell', label: 'Unilateral leg swelling', type: 'check' },
      { id: 'hemopt', label: 'Hemoptysis', type: 'check' },
      { id: 'surgery', label: 'Recent surgery or trauma', hint: 'Within 4 weeks, requiring general anesthesia', type: 'check' },
      { id: 'priorvte', label: 'Prior PE or DVT', type: 'check' },
      { id: 'hormone', label: 'Hormone use', hint: 'Oral contraceptives, hormone replacement, or estrogenic hormones', type: 'check' }
    ],
    compute: function (v) {
      var n = 0;
      if (v.age50) n++;
      if (v.hr100) n++;
      if (v.sao2) n++;
      if (v.legswell) n++;
      if (v.hemopt) n++;
      if (v.surgery) n++;
      if (v.priorvte) n++;
      if (v.hormone) n++;
      if (!v.lowprob) {
        return {
          value: String(n), unit: 'of 8 criteria',
          text: 'PERC is only applicable when the clinician\'s pretest probability is low (< 15%). For higher pretest probability, use a structured score (Wells, Geneva) and D-dimer/imaging.',
          level: 'info'
        };
      }
      if (n === 0) {
        return {
          value: '0', unit: 'of 8 criteria',
          text: 'PERC negative: all 8 criteria absent in a low-pretest-probability patient — PE is ruled out without D-dimer testing (missed PE < 2% in the multicenter validation).',
          level: 'low'
        };
      }
      return {
        value: String(n), unit: 'of 8 criteria',
        text: 'PERC positive (' + n + ' ' + (n > 1 ? 'criteria' : 'criterion') + ' present): PE is NOT ruled out. Continue the workup (D-dimer or imaging per pretest probability).',
        level: 'mod'
      };
    },
    notes: 'All 8 criteria must be negative AND pretest probability low to stop the workup. PERC is a rule-out rule, not a severity score.',
    refs: [
      'Kline JA et al. J Thromb Haemost 2004;2:1247-55.',
      'Kline JA et al. J Thromb Haemost 2008;6:772-80.'
    ]
  });

  /* ---------- YEARS algorithm ---------- */
  CARDIO.register({
    id: 'years-pe',
    name: 'YEARS Algorithm (PE)',
    category: 'vte',
    short: 'D-dimer-threshold algorithm to exclude PE with fewer CT scans',
    keywords: ['pe', 'pulmonary embolism', 'years', 'd-dimer', 'ctpa'],
    kind: 'custom',
    inputs: [
      { id: 'dvtsigns', label: 'Clinical signs of DVT', type: 'check' },
      { id: 'hemopt', label: 'Hemoptysis', type: 'check' },
      { id: 'pelikely', label: 'PE is the most likely diagnosis', type: 'check' },
      { id: 'ddimer', label: 'D-dimer', unit: 'µg/L FEU', hint: 'FEU; µg/L = ng/mL. Use the lab\'s FEU-calibrated assay value.', type: 'number', min: 0, step: 1, placeholder: 'e.g., 750' }
    ],
    compute: function (v) {
      if (v.ddimer === null) return null;
      var items = 0;
      if (v.dvtsigns) items++;
      if (v.hemopt) items++;
      if (v.pelikely) items++;
      var threshold = (items === 0) ? 1000 : 500;
      var detail = 'YEARS items: ' + items + ' of 3 → D-dimer threshold ' + threshold + ' µg/L FEU.\nMeasured D-dimer: ' + v.ddimer + ' µg/L FEU.';
      if (v.ddimer < threshold) {
        return {
          value: String(items), unit: 'YEARS items', badge: 'PE excluded',
          text: 'PE excluded without CTPA (D-dimer ' + v.ddimer + ' < ' + threshold + ' µg/L). In the YEARS study, 3-month VTE incidence was ~0.6% in patients managed without CTPA.',
          level: 'low', detail: detail
        };
      }
      return {
        value: String(items), unit: 'YEARS items', badge: 'CTPA indicated',
        text: 'PE NOT excluded (D-dimer ' + v.ddimer + ' ≥ ' + threshold + ' µg/L). CT pulmonary angiography is indicated.',
        level: 'high', detail: detail
      };
    },
    notes: 'Zero YEARS items: exclude PE if D-dimer < 1000 µg/L; ≥ 1 item: exclude if < 500 µg/L; otherwise CTPA. A pregnancy-adapted version (Artemis) adds compression ultrasound for DVT signs.',
    refs: [
      'van der Hulle T et al. Lancet 2017;390:289-97.',
      'van der Pol LM et al. (Artemis) N Engl J Med 2019;380:1139-49.'
    ]
  });

  /* ---------- PESI ---------- */
  CARDIO.register({
    id: 'pesi',
    name: 'PESI (Pulmonary Embolism Severity Index)',
    category: 'vte',
    short: '30-day mortality after acute PE; identifies candidates for outpatient care',
    keywords: ['pe', 'pulmonary embolism', 'prognosis', 'mortality', 'outpatient', 'severity'],
    kind: 'custom',
    inputs: [
      { id: 'age', label: 'Age', unit: 'years', type: 'number', min: 0, max: 120, step: 1, placeholder: 'e.g., 62' },
      { id: 'male', label: 'Male sex', type: 'check' },
      { id: 'cancer', label: 'History of cancer', type: 'check' },
      { id: 'chf', label: 'Chronic heart failure', type: 'check' },
      { id: 'lung', label: 'Chronic pulmonary disease', type: 'check' },
      { id: 'hr110', label: 'Heart rate ≥ 110 bpm', type: 'check' },
      { id: 'sbp100', label: 'Systolic BP < 100 mmHg', type: 'check' },
      { id: 'rr30', label: 'Respiratory rate ≥ 30 /min', type: 'check' },
      { id: 'temp36', label: 'Temperature < 36 °C', type: 'check' },
      { id: 'ams', label: 'Altered mental status', hint: 'Disorientation, lethargy, stupor, or coma', type: 'check' },
      { id: 'sao2', label: 'Arterial oxygen saturation < 90%', type: 'check' }
    ],
    compute: function (v) {
      if (v.age === null) return null;
      var p = Math.round(v.age);
      if (v.male) p += 10;
      if (v.cancer) p += 30;
      if (v.chf) p += 10;
      if (v.lung) p += 10;
      if (v.hr110) p += 20;
      if (v.sbp100) p += 30;
      if (v.rr30) p += 20;
      if (v.temp36) p += 20;
      if (v.ams) p += 60;
      if (v.sao2) p += 20;
      var cls, mort, level;
      if (p <= 65)       { cls = 'I';   mort = '0–1.6%';      level = 'low'; }
      else if (p <= 85)  { cls = 'II';  mort = '1.7–3.5%';    level = 'low'; }
      else if (p <= 105) { cls = 'III'; mort = '3.2–7.1%';    level = 'mod'; }
      else if (p <= 125) { cls = 'IV';  mort = '4.0–11.4%';   level = 'high'; }
      else               { cls = 'V';   mort = '10.0–24.5%';  level = 'vhigh'; }
      var extra = (cls === 'I' || cls === 'II')
        ? ' Very low / low risk — outpatient management may be considered if no other contraindication.'
        : ' Consider inpatient management' + (cls === 'III' ? '.' : ' and closer monitoring.');
      return {
        value: String(p), unit: 'points', badge: 'Class ' + cls,
        text: 'PESI class ' + cls + ': 30-day all-cause mortality ' + mort + '.' + extra,
        level: level,
        detail: 'Classes: I ≤ 65, II 66–85, III 86–105, IV 106–125, V > 125 points.'
      };
    },
    notes: 'Points = age in years + 10 (male) + 30 (cancer) + 10 (CHF) + 10 (chronic lung disease) + 20 (HR ≥ 110) + 30 (SBP < 100) + 20 (RR ≥ 30) + 20 (temp < 36 °C) + 60 (altered mental status) + 20 (SaO₂ < 90%). Mortality ranges span the derivation and validation cohorts.',
    refs: ['Aujesky D et al. Am J Respir Crit Care Med 2005;172:1041-6.']
  });

  /* ---------- Simplified PESI (sPESI) ---------- */
  CARDIO.register({
    id: 'spesi',
    name: 'Simplified PESI (sPESI)',
    category: 'vte',
    short: 'Simplified 30-day mortality risk after acute PE',
    keywords: ['pe', 'pulmonary embolism', 'prognosis', 'mortality', 'spesi'],
    inputs: [
      { id: 'age', label: 'Age > 80 years', type: 'check', points: 1 },
      { id: 'cancer', label: 'History of cancer', type: 'check', points: 1 },
      { id: 'cardiopulm', label: 'Chronic cardiopulmonary disease', hint: 'Chronic heart failure or chronic lung disease', type: 'check', points: 1 },
      { id: 'hr110', label: 'Heart rate ≥ 110 bpm', type: 'check', points: 1 },
      { id: 'sbp100', label: 'Systolic BP < 100 mmHg', type: 'check', points: 1 },
      { id: 'sao2', label: 'Arterial oxyhemoglobin saturation < 90%', type: 'check', points: 1 }
    ],
    interpret: [
      { upTo: 0, text: 'Low risk: 30-day all-cause mortality 1.0% in the derivation cohort. Outpatient management may be considered if no other contraindication.', level: 'low' },
      { upTo: 6, text: 'High risk (≥ 1 point): 30-day all-cause mortality 10.9% in the derivation cohort. Manage as inpatient; assess RV function and troponin for further stratification.', level: 'high' }
    ],
    notes: 'sPESI = 0 defines low risk in the ESC PE guideline algorithm (together with absence of RV dysfunction).',
    refs: [
      'Jiménez D et al. Arch Intern Med 2010;170:1383-9.',
      '2019 ESC Guidelines on acute pulmonary embolism. Eur Heart J 2020;41:543-603.'
    ]
  });

  /* ---------- Bova score ---------- */
  CARDIO.register({
    id: 'bova',
    name: 'Bova Score',
    category: 'vte',
    short: 'Risk of PE-related complications in normotensive (intermediate-risk) PE',
    keywords: ['pe', 'pulmonary embolism', 'intermediate risk', 'rv dysfunction', 'troponin'],
    inputs: [
      { id: 'sbp', label: 'Systolic BP 90–100 mmHg', hint: 'Score applies only to normotensive patients (SBP ≥ 90 mmHg)', type: 'check', points: 2 },
      { id: 'troponin', label: 'Elevated cardiac troponin', type: 'check', points: 2 },
      { id: 'rv', label: 'RV dysfunction (echocardiography or CT)', type: 'check', points: 2 },
      { id: 'hr110', label: 'Heart rate ≥ 110 bpm', type: 'check', points: 1 }
    ],
    interpret: [
      { upTo: 2, text: 'Stage I: 30-day PE-related complications ~4.4%; PE-related mortality ~3.1%.', level: 'low' },
      { upTo: 4, text: 'Stage II: 30-day PE-related complications ~18%; PE-related mortality ~6.8%.', level: 'mod' },
      { upTo: 7, text: 'Stage III: 30-day PE-related complications ~42%; PE-related mortality ~10.5%. Consider closer monitoring / escalation pathways.', level: 'high' }
    ],
    notes: 'For hemodynamically stable (SBP ≥ 90 mmHg) acute PE only. PE-related complications = death from PE, hemodynamic collapse, or recurrent PE. Stages: I 0–2, II 3–4, III > 4 points.',
    refs: [
      'Bova C et al. Eur Respir J 2014;44:694-703.',
      'Fernández C et al. Chest 2015;148:211-8.'
    ]
  });

  /* ---------- Hestia criteria ---------- */
  CARDIO.register({
    id: 'hestia',
    name: 'Hestia Criteria',
    category: 'vte',
    short: 'Eligibility for outpatient treatment of acute PE',
    keywords: ['pe', 'pulmonary embolism', 'outpatient', 'home treatment', 'hestia'],
    kind: 'custom',
    inputs: [
      { id: 'unstable', label: 'Hemodynamically unstable', hint: 'e.g., SBP < 100 mmHg with HR > 100 bpm, or condition requiring ICU admission', type: 'check' },
      { id: 'lysis', label: 'Thrombolysis or embolectomy necessary', type: 'check' },
      { id: 'bleeding', label: 'Active bleeding or high risk of bleeding', hint: 'e.g., GI bleeding or surgery ≤ 2 weeks, stroke ≤ 4 weeks, bleeding disorder, platelets < 75×10⁹/L, uncontrolled hypertension (SBP > 180 or DBP > 110 mmHg)', type: 'check' },
      { id: 'oxygen', label: 'Oxygen needed > 24 h to keep SaO₂ > 90%', type: 'check' },
      { id: 'onac', label: 'PE diagnosed while on anticoagulant treatment', type: 'check' },
      { id: 'pain', label: 'Severe pain needing IV analgesia > 24 h', type: 'check' },
      { id: 'social', label: 'Medical or social reason for admission > 24 h', hint: 'e.g., infection, malignancy-related care, no support system', type: 'check' },
      { id: 'renal', label: 'Creatinine clearance < 30 mL/min', hint: 'Cockcroft-Gault', type: 'check' },
      { id: 'liver', label: 'Severe liver impairment', type: 'check' },
      { id: 'pregnant', label: 'Pregnancy', type: 'check' },
      { id: 'hit', label: 'Documented history of heparin-induced thrombocytopenia', type: 'check' }
    ],
    compute: function (v) {
      var n = 0;
      var keys = ['unstable', 'lysis', 'bleeding', 'oxygen', 'onac', 'pain', 'social', 'renal', 'liver', 'pregnant', 'hit'];
      for (var i = 0; i < keys.length; i++) { if (v[keys[i]]) n++; }
      if (n === 0) {
        return {
          value: '0', unit: 'criteria positive', badge: 'Outpatient candidate',
          text: 'All Hestia criteria negative: the patient may be suitable for outpatient management of acute PE. In the Hestia study, home-treated patients had 2.0% recurrent VTE, 0.7% major bleeding, and no PE-related death at 3 months.',
          level: 'low'
        };
      }
      return {
        value: String(n), unit: 'criteria positive', badge: 'Not for outpatient care',
        text: 'Any positive Hestia criterion (' + n + ' present) → NOT suitable for outpatient management. Treat in hospital and reassess.',
        level: 'high'
      };
    },
    notes: 'Pragmatic checklist — any single positive criterion excludes home treatment. Often combined with sPESI/PESI for a second risk check.',
    refs: [
      'Zondag W et al. J Thromb Haemost 2011;9:1500-7.',
      'Roy PM et al. (HOME-PE) Eur Heart J 2021;42:3146-57.'
    ]
  });

  /* ---------- ADD-RS (Aortic Dissection Detection Risk Score) ---------- */
  CARDIO.register({
    id: 'add-rs',
    name: 'ADD-RS (Aortic Dissection Detection Risk Score)',
    category: 'vte',
    short: 'Pretest probability of acute aortic syndrome; pairs with D-dimer (ADvISED)',
    keywords: ['aortic dissection', 'acute aortic syndrome', 'add-rs', 'advised', 'd-dimer', 'aorta'],
    inputs: [
      { id: 'condition', label: 'Any high-risk CONDITION', hint: 'Marfan syndrome or other connective tissue disease, family history of aortic disease, known aortic valve disease, known thoracic aortic aneurysm, previous aortic manipulation (including cardiac surgery)', type: 'check', points: 1 },
      { id: 'pain', label: 'Any high-risk PAIN feature', hint: 'Chest, back, or abdominal pain of abrupt onset, severe intensity, or ripping/tearing quality', type: 'check', points: 1 },
      { id: 'exam', label: 'Any high-risk EXAM feature', hint: 'Pulse deficit or systolic BP differential, focal neurologic deficit (with pain), new murmur of aortic regurgitation (with pain), hypotension or shock', type: 'check', points: 1 }
    ],
    interpret: [
      { upTo: 0, text: 'ADD-RS 0 (low risk). Per ADvISED, ADD-RS 0 with D-dimer < 500 ng/mL makes acute aortic syndrome very unlikely (failure rate ~0.3%).', level: 'low' },
      { upTo: 1, text: 'ADD-RS 1 (intermediate risk). Per ADvISED, ADD-RS ≤ 1 with D-dimer < 500 ng/mL had a failure rate of ~0.3%; if D-dimer ≥ 500 ng/mL, proceed to definitive aortic imaging.', level: 'mod' },
      { upTo: 3, text: 'ADD-RS > 1 (high risk): proceed directly to definitive aortic imaging (CT angiography, TEE, or MRA). Do not use D-dimer alone to exclude dissection.', level: 'high' }
    ],
    notes: 'One point per category (condition / pain / exam) regardless of how many features within a category are present; range 0–3.',
    refs: [
      'Rogers AM et al. (IRAD) Circulation 2011;123:2213-8.',
      'Nazerian P et al. (ADvISED) Circulation 2018;137:250-8.'
    ]
  });

  /* ---------- REVEAL 2.0 (PAH) — local points ----------
   * Benza RL et al. Chest 2019;156:323-37. Final score = 6 + Σ(variable points).
   * Several variables carry NEGATIVE points (favourable findings), which the additive
   * engine sums directly; a fixed +6 base (encoded as the first, always-applied select)
   * shifts the range to the published 0–23. Three-strata simplification:
   *   ≤ 6 low, 7–8 intermediate, ≥ 9 high 1-year mortality risk.
   *
   * Published variable points (this is exactly what is encoded below):
   *   WHO subgroup:  other 0, CTD +1, heritable +2, portopulmonary +2
   *   Male > 60 y:   +2
   *   Renal insuff (eGFR < 60): +1
   *   WHO/NYHA FC:   I −1, II 0, III +1, IV +2
   *   SBP < 110:     +1     HR > 96: +1
   *   6MWD:          ≥440 −2, 320–439 −1, 165–319 0, <165 +1
   *   BNP/NT-proBNP: <50 (or NT <300) −2, 50–199 0, 200–799 +1, ≥800 (or NT ≥1100) +2
   *   Pericardial effusion: +1
   *   DLCO:          ≥80% −1, 32–80% 0, ≤32% +1
   *   All-cause hospitalization ≤ 6 mo: +1
   *
   * Worked example: CTD-PAH (+1), male 65 (+2), eGFR 70 (0), FC III (+1), SBP 105 (+1),
   *   HR 80 (0), 6MWD 300 m (0), BNP 400 (+1), effusion no (0), DLCO 60% (0), hosp no (0)
   *   → variable sum +7, + base 6 = 13 → high risk (≥ 9). */
  CARDIO.register({
    id: 'reveal-2-0',
    name: 'REVEAL 2.0 Risk Score (PAH)',
    category: 'vte',
    short: 'Mortality risk in pulmonary arterial hypertension (registry-derived score)',
    keywords: ['pulmonary arterial hypertension', 'pah', 'reveal', 'risk stratification'],
    inputs: [
      /* WHO-subgroup select carries the fixed +6 base offset (so this stays a pure
       * additive model): displayed points = 6 + published subgroup value. */
      { id: 'whogroup', label: 'WHO Group 1 subgroup / etiology', hidePoints: true, type: 'select', options: [
        { label: 'Other PAH subgroup', points: 6 },
        { label: 'Connective tissue disease-associated PAH', points: 7 },
        { label: 'Heritable PAH', points: 8 },
        { label: 'Portopulmonary hypertension', points: 8 }
      ], hint: 'Includes the REVEAL 2.0 fixed +6 base score (published subgroup points: other 0, CTD +1, heritable/portopulmonary +2).' },
      { id: 'male60', label: 'Male, age > 60 years', type: 'check', points: 2 },
      { id: 'renal', label: 'Renal insufficiency (eGFR < 60 mL/min/1.73 m² or reported)', type: 'check', points: 1 },
      { id: 'fc', label: 'WHO / NYHA functional class', type: 'select', options: [
        { label: 'Class II', points: 0 },
        { label: 'Class I', points: -1 },
        { label: 'Class III', points: 1 },
        { label: 'Class IV', points: 2 }
      ] },
      { id: 'sbp', label: 'Systolic BP < 110 mmHg', type: 'check', points: 1 },
      { id: 'hr', label: 'Heart rate > 96 bpm', type: 'check', points: 1 },
      { id: 'walk', label: '6-minute walk distance', type: 'select', options: [
        { label: '165 to 319 m', points: 0 },
        { label: '≥ 440 m', points: -2 },
        { label: '320 to 439 m', points: -1 },
        { label: '< 165 m', points: 1 }
      ] },
      { id: 'bnp', label: 'BNP / NT-proBNP', type: 'select', options: [
        { label: 'BNP 50–199 pg/mL', points: 0 },
        { label: 'BNP < 50 pg/mL or NT-proBNP < 300 pg/mL', points: -2 },
        { label: 'BNP 200–799 pg/mL', points: 1 },
        { label: 'BNP ≥ 800 pg/mL or NT-proBNP ≥ 1100 pg/mL', points: 2 }
      ] },
      { id: 'effusion', label: 'Pericardial effusion on echocardiography', type: 'check', points: 1 },
      { id: 'dlco', label: '% predicted DLCO', type: 'select', options: [
        { label: '> 32% and < 80%', points: 0 },
        { label: '≥ 80%', points: -1 },
        { label: '≤ 32%', points: 1 }
      ] },
      { id: 'hosp', label: 'All-cause hospitalization within prior 6 months', type: 'check', points: 1 }
    ],
    interpret: [
      { upTo: 6, text: 'Low risk. 1-year mortality roughly < 5% in the REVEAL registry.', level: 'low' },
      { upTo: 8, text: 'Intermediate risk. 1-year mortality roughly 5–10%.', level: 'mod' },
      { upTo: 30, text: 'High risk (≥ 9). 1-year mortality roughly ≥ 10–20%; consider treatment escalation and referral for advanced therapies / transplant evaluation.', level: 'high' }
    ],
    notes: 'REVEAL 2.0 final score = 6 (fixed base) + summed variable points; range 0–23. Favourable findings carry negative points (FC I, long 6MWD, low BNP, high DLCO). Three-strata simplification used here: ≤6 low, 7–8 intermediate, ≥9 high (the source also describes a finer scheme: <6 low, 6–7 intermediate-low, 8 intermediate-high, ≥9 high). Minimum of 7 of the 13 variables are needed for a valid score in the original tool. Estimates are registry-derived and approximate. Verify against the primary publication before clinical use.',
    refs: [
      'Benza RL et al. Predicting survival in patients with pulmonary arterial hypertension: the REVEAL Risk Score Calculator 2.0. Chest 2019;156:323-37.',
      'Benza RL et al. Circulation 2010;122:164-72.'
    ]
  });

  /* ---------- ESC/ERS PH risk stratification — local custom (average-grade) ----------
   * Humbert M et al. 2022 ESC/ERS PH guideline, Table on comprehensive risk assessment
   * (three-strata: low / intermediate / high). Each determinant is graded low = 1,
   * intermediate = 2, high = 3; the overall stratum is the rounded AVERAGE of the graded
   * determinants (the guideline's suggested method). Only determinants the user enters
   * are averaged, so partial assessments still yield a stratum.
   *
   * Published three-strata cut-offs encoded below:
   *   WHO-FC:      low I/II, intermediate III, high IV
   *   6MWD:        low > 440 m, intermediate 165–440 m, high < 165 m
   *   BNP:         low < 50, intermediate 50–800, high > 800 ng/L
   *   NT-proBNP:   low < 300, intermediate 300–1100, high > 1100 ng/L
   *   RAP:         low < 8, intermediate 8–14, high > 14 mmHg
   *   Cardiac index: low ≥ 2.5, intermediate 2.0–2.4, high < 2.0 L/min/m²
   *   SvO2:        low > 65%, intermediate 60–65%, high < 60% */
  CARDIO.register({
    id: 'esc-ers-ph-risk',
    name: 'ESC/ERS PH Risk Stratification',
    category: 'vte',
    short: 'Three-strata risk assessment in pulmonary hypertension (2022 ESC/ERS, average-grade)',
    keywords: ['pulmonary hypertension', 'pah', 'esc', 'ers', 'risk stratification'],
    kind: 'custom',
    inputs: [
      { id: 'fc', label: 'WHO functional class', type: 'select', options: [
        { label: 'Not assessed', value: 0 },
        { label: 'Class I or II', value: 1 },
        { label: 'Class III', value: 2 },
        { label: 'Class IV', value: 3 }
      ] },
      { id: 'walk', label: '6-minute walk distance', type: 'select', options: [
        { label: 'Not assessed', value: 0 },
        { label: '> 440 m', value: 1 },
        { label: '165–440 m', value: 2 },
        { label: '< 165 m', value: 3 }
      ] },
      { id: 'bnp', label: 'BNP', unit: 'ng/L', type: 'number', min: 0, step: 1, placeholder: 'e.g., 120', hint: 'Enter BNP OR NT-proBNP (leave the other blank).' },
      { id: 'ntprobnp', label: 'NT-proBNP', unit: 'ng/L', type: 'number', min: 0, step: 1, placeholder: 'e.g., 500' },
      { id: 'rap', label: 'Right atrial pressure', unit: 'mmHg', type: 'number', min: 0, step: 1, placeholder: 'e.g., 7' },
      { id: 'ci', label: 'Cardiac index', unit: 'L/min/m²', type: 'number', min: 0, step: 0.1, placeholder: 'e.g., 2.6' },
      { id: 'svo2', label: 'Mixed venous O₂ saturation (SvO₂)', unit: '%', type: 'number', min: 0, max: 100, step: 1, placeholder: 'e.g., 66' }
    ],
    compute: function (v) {
      var grades = [];
      var lines = [];
      function gradeLabel(g) { return g === 1 ? 'low' : (g === 2 ? 'intermediate' : 'high'); }
      function add(name, g) { grades.push(g); lines.push('  ' + name + ': ' + gradeLabel(g)); }

      if (v.fc === 1 || v.fc === 2 || v.fc === 3) add('WHO-FC', v.fc);
      if (v.walk === 1 || v.walk === 2 || v.walk === 3) add('6MWD', v.walk);

      if (v.bnp !== null) {
        add('BNP', v.bnp < 50 ? 1 : (v.bnp <= 800 ? 2 : 3));
      }
      if (v.ntprobnp !== null) {
        add('NT-proBNP', v.ntprobnp < 300 ? 1 : (v.ntprobnp <= 1100 ? 2 : 3));
      }
      if (v.rap !== null) {
        add('RAP', v.rap < 8 ? 1 : (v.rap <= 14 ? 2 : 3));
      }
      if (v.ci !== null) {
        add('Cardiac index', v.ci >= 2.5 ? 1 : (v.ci >= 2.0 ? 2 : 3));
      }
      if (v.svo2 !== null) {
        add('SvO₂', v.svo2 > 65 ? 1 : (v.svo2 >= 60 ? 2 : 3));
      }

      if (grades.length === 0) return null;

      var sum = 0;
      for (var i = 0; i < grades.length; i++) { sum += grades[i]; }
      var avg = sum / grades.length;
      var stratum = Math.round(avg);
      if (stratum < 1) stratum = 1;
      if (stratum > 3) stratum = 3;

      var level, text, badge;
      if (stratum === 1) {
        level = 'low';
        badge = 'Low risk';
        text = 'Low risk (estimated 1-year mortality < 5%). Consistent with treatment goals; continue/optimize therapy.';
      } else if (stratum === 2) {
        level = 'mod';
        badge = 'Intermediate risk';
        text = 'Intermediate risk (estimated 1-year mortality 5–20%). Consider treatment escalation toward a low-risk profile.';
      } else {
        level = 'high';
        badge = 'High risk';
        text = 'High risk (estimated 1-year mortality > 20%). Consider maximal combination therapy and referral for advanced therapies / transplant evaluation.';
      }

      return {
        value: avg.toFixed(2),
        unit: 'average grade',
        text: text,
        level: level,
        badge: badge,
        detail: 'Determinants graded (low 1 / intermediate 2 / high 3):\n' + lines.join('\n') +
          '\nAverage of ' + grades.length + ' determinant(s) = ' + avg.toFixed(2) + ' → ' + badge + '.'
      };
    },
    notes: 'Local implementation of the 2022 ESC/ERS three-strata risk table using the guideline\'s average-grade method: each entered determinant is graded low (1), intermediate (2), or high (3) by the published cut-offs, and the stratum is the rounded average. Cut-offs: WHO-FC I/II low, III intermediate, IV high; 6MWD > 440 low, 165–440 intermediate, < 165 high; BNP < 50 / 50–800 / > 800 ng/L; NT-proBNP < 300 / 300–1100 / > 1100 ng/L; RAP < 8 / 8–14 / > 14 mmHg; cardiac index ≥ 2.5 / 2.0–2.4 / < 2.0 L/min/m²; SvO₂ > 65 / 60–65 / < 60%. The full guideline table also includes clinical signs of RV failure, symptom progression, syncope, cardiopulmonary exercise testing (peak VO₂, VE/VCO₂), and imaging (RA area, pericardial effusion, TAPSE/sPAP), which are not captured here; a four-strata follow-up tool (WHO-FC, 6MWD, NT-proBNP only) is used to guide escalation. Enter at least one determinant. Verify against the primary publication before clinical use.',
    refs: [
      'Humbert M et al. 2022 ESC/ERS Guidelines for the diagnosis and treatment of pulmonary hypertension. Eur Heart J 2022;43:3618-731.'
    ]
  });

})();
