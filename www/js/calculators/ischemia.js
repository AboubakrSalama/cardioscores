/* Category: ischemia — Stable CAD, ischemia testing & pretest probability
 * Each entry follows SCHEMA.md. Values verified against primary publications.
 * Duke Clinical Score is implemented locally (Pryor 1993 logistic model). MESA CAC
 * implements the verifiable Agatston-category interpretation; its exact percentile and
 * Cox 10-year risk are deferred to the official NHLBI tool (coefficients unverifiable). */
(function () {
  'use strict';

  /* 2019 ESC pretest probabilities of obstructive CAD (%) — guideline Table 5,
   * pooled contemporary data (Juarez-Orozco et al., n = 15,815).
   * Rows: age 30–39, 40–49, 50–59, 60–69, 70+. */
  var ESC_PTP = {
    m: {
      typical:    [3, 22, 32, 44, 52],
      atypical:   [4, 10, 17, 26, 34],
      nonanginal: [1, 3, 11, 22, 24],
      dyspnea:    [0, 12, 20, 27, 32]
    },
    f: {
      typical:    [5, 10, 13, 16, 27],
      atypical:   [3, 6, 6, 11, 19],
      nonanginal: [1, 2, 3, 6, 10],
      dyspnea:    [3, 3, 9, 14, 12]
    }
  };

  /* Diamond-Forrester (1979) pretest likelihood of CAD (%).
   * Rows: age 30–39, 40–49, 50–59, 60–69. */
  var DF_PTP = {
    m: {
      typical:    [69.7, 87.3, 92.0, 94.3],
      atypical:   [21.8, 46.1, 58.9, 67.1],
      nonanginal: [5.2, 14.1, 21.5, 28.1]
    },
    f: {
      typical:    [25.8, 55.2, 79.4, 90.6],
      atypical:   [4.2, 13.3, 32.4, 54.4],
      nonanginal: [0.8, 2.8, 8.4, 18.6]
    }
  };

  /* ---------- Duke Treadmill Score ---------- */
  CARDIO.register({
    id: 'duke-treadmill',
    name: 'Duke Treadmill Score',
    category: 'ischemia',
    short: 'Prognosis from exercise ECG: time, ST deviation and angina',
    keywords: ['exercise', 'treadmill', 'stress test', 'bruce', 'st depression', 'prognosis', 'dts'],
    kind: 'custom',
    inputs: [
      { id: 'time', label: 'Exercise time (Bruce protocol)', type: 'number', unit: 'min', min: 0, max: 30, step: 0.5, placeholder: 'e.g., 9' },
      { id: 'st', label: 'Maximal ST deviation', type: 'number', unit: 'mm', min: 0, max: 10, step: 0.5, placeholder: 'e.g., 1.5', hint: 'Largest net ST elevation or depression in any lead except aVR' },
      { id: 'angina', label: 'Angina index', type: 'select', options: [
        { label: '0 — No angina during exercise', value: 0 },
        { label: '1 — Non-limiting angina', value: 1 },
        { label: '2 — Angina that limited exercise', value: 2 }
      ] }
    ],
    compute: function (v) {
      if (v.time == null || v.st == null) return null;
      var angina = v.angina || 0;
      var dts = v.time - 5 * v.st - 4 * angina;
      var shown = Math.round(dts * 10) / 10;
      var text, level;
      if (dts >= 5) {
        text = 'Low risk (DTS ≥ +5): 4-year survival ~99% (average annual mortality ~0.25%). Further invasive evaluation is rarely needed on prognostic grounds.';
        level = 'low';
      } else if (dts > -11) {
        text = 'Moderate risk (DTS −10 to +4): 4-year survival ~95% (average annual mortality ~1.25%). Consider stress imaging or angiography depending on symptoms and clinical context.';
        level = 'mod';
      } else {
        text = 'High risk (DTS ≤ −11): 4-year survival ~79% (average annual mortality ≥ 5%). Strongly consider coronary angiography.';
        level = 'high';
      }
      var detail = 'DTS = exercise time − (5 × ST deviation) − (4 × angina index)\n= ' + v.time + ' − 5×' + v.st + ' − 4×' + angina + ' = ' + shown;
      return { value: String(shown), unit: 'points', text: text, level: level, detail: detail };
    },
    notes: 'Derived on the Bruce protocol — enter Bruce-protocol minutes (for other protocols, convert to metabolic equivalents with caution; the score is not validated for them). ST deviation is the largest net deviation in any lead except aVR. Survival figures are from the outpatient validation cohort (Mark 1991).',
    refs: [
      'Mark DB et al. Ann Intern Med 1987;106:793-800.',
      'Mark DB et al. N Engl J Med 1991;325:849-53.'
    ]
  });

  /* ---------- ESC 2019 pretest probability ---------- */
  CARDIO.register({
    id: 'esc-ptp-2019',
    name: 'ESC 2019 Pretest Probability of CAD',
    category: 'ischemia',
    short: 'Pretest probability of obstructive CAD by age, sex and symptoms (2019 ESC table)',
    keywords: ['pretest probability', 'ptp', 'chest pain', 'chronic coronary syndrome', 'ccs', 'esc'],
    kind: 'custom',
    inputs: [
      { id: 'sex', label: 'Sex', type: 'select', options: [
        { label: 'Male', value: 'm' },
        { label: 'Female', value: 'f' }
      ] },
      { id: 'age', label: 'Age', type: 'select', options: [
        { label: '30–39 years', value: 0 },
        { label: '40–49 years', value: 1 },
        { label: '50–59 years', value: 2 },
        { label: '60–69 years', value: 3 },
        { label: '≥ 70 years', value: 4 }
      ] },
      { id: 'sym', label: 'Symptom type', type: 'select', options: [
        { label: 'Typical angina', value: 'typical' },
        { label: 'Atypical angina', value: 'atypical' },
        { label: 'Non-anginal chest pain', value: 'nonanginal' },
        { label: 'Dyspnea (only or primary symptom)', value: 'dyspnea' }
      ], hint: 'Typical = substernal, provoked by exertion/emotion, relieved by rest or nitrates (all 3); atypical = 2 of 3; non-anginal = ≤ 1 of 3' }
    ],
    compute: function (v) {
      var bySex = ESC_PTP[v.sex];
      var row = bySex && bySex[v.sym];
      var p = row ? row[v.age] : undefined;
      if (p === undefined) return null;
      var text, level, badge;
      if (p > 15) {
        text = 'Pretest probability ' + p + '% (> 15%): noninvasive diagnostic testing is most beneficial in this group.';
        level = 'high';
        badge = 'PTP > 15%';
      } else if (p >= 5) {
        text = 'Pretest probability ' + p + '% (5–15%): diagnostic testing may be considered after assessing overall clinical likelihood with PTP modifiers (risk factors, resting ECG, LV function, coronary calcium).';
        level = 'mod';
        badge = 'PTP 5–15%';
      } else {
        text = 'Pretest probability ' + p + '% (< 5%): obstructive CAD is unlikely; testing is generally deferred unless there are compelling reasons.';
        level = 'low';
        badge = 'PTP < 5%';
      }
      return { value: String(p), unit: '%', text: text, level: level, badge: badge };
    },
    notes: 'Table 5 of the 2019 ESC chronic coronary syndromes guideline, from pooled contemporary data (n = 15,815); estimates are roughly one third of the 2013 ESC/older Diamond-Forrester values. The 2024 ESC guideline refines these with the risk-factor-weighted clinical likelihood (RF-CL) model, which additionally accounts for cardiovascular risk factors.',
    refs: [
      'Knuuti J et al. 2019 ESC guidelines on chronic coronary syndromes. Eur Heart J 2020;41:407-77.',
      'Juarez-Orozco LE et al. Eur Heart J Cardiovasc Imaging 2019;20:1198-207.',
      '2024 ESC Guidelines for the management of chronic coronary syndromes. Eur Heart J 2024.'
    ]
  });

  /* ---------- Diamond-Forrester (classic) ---------- */
  CARDIO.register({
    id: 'diamond-forrester',
    name: 'Diamond-Forrester Pretest Probability',
    category: 'ischemia',
    short: 'Classic 1979 pretest likelihood of CAD by age, sex and chest-pain type',
    keywords: ['pretest probability', 'chest pain', 'angina', 'classic', 'diamond', 'forrester'],
    kind: 'custom',
    inputs: [
      { id: 'sex', label: 'Sex', type: 'select', options: [
        { label: 'Male', value: 'm' },
        { label: 'Female', value: 'f' }
      ] },
      { id: 'age', label: 'Age', type: 'select', options: [
        { label: '30–39 years', value: 0 },
        { label: '40–49 years', value: 1 },
        { label: '50–59 years', value: 2 },
        { label: '60–69 years', value: 3 }
      ] },
      { id: 'sym', label: 'Chest-pain type', type: 'select', options: [
        { label: 'Typical angina', value: 'typical' },
        { label: 'Atypical angina', value: 'atypical' },
        { label: 'Non-anginal chest pain', value: 'nonanginal' }
      ], hint: 'Typical = substernal, provoked by exertion, relieved by rest or nitrates (all 3); atypical = 2 of 3; non-anginal = ≤ 1 of 3' }
    ],
    compute: function (v) {
      var bySex = DF_PTP[v.sex];
      var row = bySex && bySex[v.sym];
      var p = row ? row[v.age] : undefined;
      if (p === undefined) return null;
      var text, level, badge;
      if (p > 90) {
        text = 'Pretest likelihood ' + p.toFixed(1) + '% (> 90%): high probability — a negative noninvasive test is more likely false-negative than truly reassuring.';
        level = 'high';
        badge = 'High PTP';
      } else if (p >= 10) {
        text = 'Pretest likelihood ' + p.toFixed(1) + '% (10–90%): intermediate probability — the range in which noninvasive testing is most informative.';
        level = 'mod';
        badge = 'Intermediate PTP';
      } else {
        text = 'Pretest likelihood ' + p.toFixed(1) + '% (< 10%): low probability — positive noninvasive tests are more likely false-positive.';
        level = 'low';
        badge = 'Low PTP';
      }
      return { value: p.toFixed(1), unit: '%', text: text, level: level, badge: badge };
    },
    notes: 'Original 1979 estimates from angiographic and autopsy series, ages 30–69 only. Substantially overestimates CAD prevalence in contemporary populations (the 2019 ESC estimates are roughly one third of these values); shown for historical and US-guideline context. Low/intermediate/high framing (< 10% / 10–90% / > 90%) follows ACC/AHA stable chest pain convention.',
    refs: [
      'Diamond GA, Forrester JS. N Engl J Med 1979;300:1350-8.',
      'Gibbons RJ et al. ACC/AHA 2002 guideline update for exercise testing. Circulation 2002;106:1883-92.'
    ]
  });

  /* ---------- CAC (Agatston) score interpretation ---------- */
  CARDIO.register({
    id: 'cac-interpretation',
    name: 'Coronary Artery Calcium (Agatston) Interpretation',
    category: 'ischemia',
    short: 'Guideline-based interpretation of the coronary calcium score in primary prevention',
    keywords: ['calcium', 'agatston', 'cac', 'ct', 'statin', 'prevention', 'score'],
    kind: 'custom',
    inputs: [
      { id: 'cac', label: 'Agatston score', type: 'number', unit: 'AU', min: 0, max: 10000, step: 1, placeholder: 'e.g., 120' }
    ],
    compute: function (v) {
      if (v.cac == null || v.cac < 0) return null;
      var s = Math.round(v.cac);
      var text, level, badge;
      if (s === 0) {
        text = 'CAC 0 — no calcified plaque detected. Event risk is low; in intermediate-risk primary prevention (age 40–75), this favors withholding or deferring statin therapy with later reassessment, unless diabetes, a family history of premature CHD, or cigarette smoking is present.';
        level = 'low';
        badge = 'CAC 0';
      } else if (s <= 99) {
        text = 'CAC 1–99 — mild calcification; coronary atherosclerosis is present. Favors initiating statin therapy in intermediate-risk patients, particularly at age ≥ 55 (2018 AHA/ACC cholesterol guideline).';
        level = 'mod';
        badge = 'Mild (1–99)';
      } else if (s <= 399) {
        text = 'CAC 100–399 — moderate calcification. CAC ≥ 100 (or ≥ 75th percentile) favors statin therapy; intensify lifestyle and risk-factor management.';
        level = 'high';
        badge = 'Moderate (100–399)';
      } else {
        text = 'CAC ≥ 400 — extensive calcification, the highest-risk category. Statin therapy is indicated with intensive risk-factor modification; symptoms, if present, warrant evaluation for obstructive CAD.';
        level = 'vhigh';
        badge = 'Extensive (≥ 400)';
      }
      return { value: String(s), unit: 'AU', text: text, level: level, detail: 'Agatston categories: 0 none · 1–99 mild · 100–399 moderate · ≥ 400 extensive' };
    },
    notes: 'For asymptomatic, statin-naive adults without known ASCVD; interpretation follows the 2018 AHA/ACC/multisociety cholesterol guideline use of CAC to refine intermediate-risk statin decisions. CAC 0 does not exclude non-calcified plaque. Age/sex/ethnicity percentile (MESA) adds context, especially in younger patients.',
    refs: [
      'Agatston AS et al. J Am Coll Cardiol 1990;15:827-32.',
      'Grundy SM et al. 2018 AHA/ACC/multisociety cholesterol guideline. Circulation 2019;139:e1082-e1143.',
      'Detrano R et al. N Engl J Med 2008;358:1336-45.'
    ]
  });

  /* ---------- MESA CAC (Agatston interpretation) ---------- */
  CARDIO.register({
    id: 'mesa-cac',
    name: 'MESA CAC Percentile & Risk Score',
    category: 'ischemia',
    short: 'Agatston CAC interpretation with age/sex/ethnicity and predicted-CHD context',
    keywords: ['calcium', 'agatston', 'percentile', 'mesa', 'chd risk'],
    kind: 'custom',
    inputs: [
      { id: 'age', label: 'Age', type: 'number', unit: 'years', min: 45, max: 85, step: 1, placeholder: 'e.g., 60' },
      { id: 'sex', label: 'Sex', type: 'select', options: [
        { label: 'Male', value: 'm' },
        { label: 'Female', value: 'f' }
      ] },
      { id: 'race', label: 'Race / ethnicity', type: 'select', options: [
        { label: 'White', value: 'white' },
        { label: 'Chinese American', value: 'chinese' },
        { label: 'African American / Black', value: 'black' },
        { label: 'Hispanic', value: 'hispanic' }
      ] },
      { id: 'cac', label: 'Agatston CAC score', type: 'number', unit: 'AU', min: 0, max: 10000, step: 1, placeholder: 'e.g., 120' }
    ],
    compute: function (v) {
      if (v.cac == null || v.cac < 0) return null;
      var s = Math.round(v.cac);
      var text, level, badge;
      if (s === 0) {
        text = 'CAC 0 — no calcified plaque detected. Lowest-risk category; in intermediate-risk primary prevention this favors deferring statin therapy with reassessment, unless diabetes, family history of premature CHD, or smoking is present.';
        level = 'low';
        badge = 'CAC 0';
      } else if (s <= 99) {
        text = 'CAC 1–99 — mild calcification; coronary atherosclerosis is present. Favors statin therapy in intermediate-risk patients.';
        level = 'mod';
        badge = 'Mild (1–99)';
      } else if (s <= 399) {
        text = 'CAC 100–399 — moderate calcification. CAC ≥ 100 (or ≥ 75th percentile for age/sex/ethnicity) favors statin therapy.';
        level = 'high';
        badge = 'Moderate (100–399)';
      } else {
        text = 'CAC ≥ 400 — extensive calcification, highest-risk category. Statin therapy with intensive risk-factor modification is indicated.';
        level = 'vhigh';
        badge = 'Extensive (≥ 400)';
      }
      var ageNote = (v.age != null && (v.age < 45 || v.age > 85))
        ? '\nNote: the MESA cohort was aged 45–85; percentile context is not defined outside this range.'
        : '';
      var demo = [];
      if (v.sex) demo.push(v.sex === 'f' ? 'female' : 'male');
      if (v.race) demo.push({ white: 'White', chinese: 'Chinese-American', black: 'African-American', hispanic: 'Hispanic' }[v.race]);
      var demoStr = demo.length ? ' (' + demo.join(', ') + (v.age != null ? ', age ' + Math.round(v.age) : '') + ')' : '';
      var detail = 'Agatston categories: 0 none · 1–99 mild · 100–399 moderate · ≥ 400 extensive.' +
        '\nFor the exact age/sex/race percentile' + demoStr + ' and the MESA 10-year CHD risk estimate, use the official NHLBI MESA calculator; those require the published cohort distribution tables and Cox coefficients not reproduced here.' + ageNote;
      return { value: String(s), unit: 'AU', text: text, level: level, badge: badge, detail: detail };
    },
    notes: 'SCOPE: this tool provides the guideline-based Agatston-category interpretation of the CAC score with age/sex/ethnicity context. The exact MESA age-/sex-/race-specific percentile (McClelland 2006 distribution tables) and the MESA 10-year CHD Cox risk score (McClelland 2015) are NOT computed here: authoritative coefficient values could not be verified (published sources give the CAC term 0.2743 × ln(CAC+1) with baseline survival 0.99833/0.99963, but the individual risk-factor betas could not be confirmed, and third-party calculators disagree). Implementing an unverified Cox model would be unsafe, so the percentile and 10-year risk should be obtained from the official NHLBI MESA calculator. CAC 0 does not exclude non-calcified plaque. Verify against the primary publication before clinical use.',
    refs: [
      'McClelland RL et al. Circulation 2006;113:30-7.',
      'McClelland RL et al. J Am Coll Cardiol 2015;66:1643-53.',
      'Agatston AS et al. J Am Coll Cardiol 1990;15:827-32.'
    ]
  });

  /* ---------- Duke Clinical Score (Pryor 1993, logistic) ---------- */
  CARDIO.register({
    id: 'duke-clinical-score',
    name: 'Duke Clinical Score',
    category: 'ischemia',
    short: 'Pretest probability of significant CAD from history, risk factors and ECG',
    keywords: ['pretest probability', 'chest pain', 'nomogram', 'duke', 'pryor'],
    kind: 'custom',
    inputs: [
      { id: 'age', label: 'Age', type: 'number', unit: 'years', min: 18, max: 100, step: 1, placeholder: 'e.g., 58' },
      { id: 'sex', label: 'Sex', type: 'select', options: [
        { label: 'Male', value: 'm' },
        { label: 'Female', value: 'f' }
      ] },
      { id: 'cp', label: 'Chest-pain type', type: 'select', options: [
        { label: 'Non-anginal chest pain', value: 'nonanginal' },
        { label: 'Atypical angina', value: 'atypical' },
        { label: 'Typical angina', value: 'typical' }
      ], hint: 'Typical = substernal, provoked by exertion, relieved by rest or nitrates (all 3); atypical = 2 of 3; non-anginal = ≤ 1 of 3' },
      { id: 'mi', label: 'Previous myocardial infarction', type: 'check' },
      { id: 'qwaves', label: 'Q waves on ECG', type: 'check' },
      { id: 'stt', label: 'ST-T changes on ECG', type: 'check' },
      { id: 'smoke', label: 'Smoking history', type: 'check' },
      { id: 'lipid', label: 'Dyslipidemia (hyperlipidemia)', type: 'check', hint: 'Total cholesterol > 6.4 mmol/L (~247 mg/dL) or treated' },
      { id: 'dm', label: 'Diabetes mellitus', type: 'check' }
    ],
    compute: function (v) {
      if (v.age == null) return null;
      var age = v.age;
      var sex = v.sex === 'f' ? 1 : 0;           // female = 1, male = 0
      var typical = v.cp === 'typical' ? 1 : 0;
      var atypical = v.cp === 'atypical' ? 1 : 0;
      var mi = v.mi ? 1 : 0;
      var q = v.qwaves ? 1 : 0;
      var stt = v.stt ? 1 : 0;
      var smoke = v.smoke ? 1 : 0;
      var lipid = v.lipid ? 1 : 0;
      var dm = v.dm ? 1 : 0;
      var lp = -7.376 +
        0.1126 * age +
        -0.328 * sex +
        -0.0301 * age * sex +
        2.581 * typical +
        0.976 * atypical +
        1.093 * mi +
        1.213 * q +
        0.741 * mi * q +
        2.596 * smoke +
        1.845 * lipid +
        0.694 * dm +
        0.637 * stt +
        -0.0404 * age * smoke +
        -0.0251 * age * lipid +
        0.550 * sex * smoke;
      var p = 1 / (1 + Math.exp(-lp));
      var pct = Math.round(p * 1000) / 10;
      var text, level, badge;
      if (pct < 15) {
        text = 'Pretest probability ' + pct + '% (< 15%): low likelihood of significant CAD — obstructive disease is unlikely and testing is often deferred.';
        level = 'low';
        badge = 'Low';
      } else if (pct <= 85) {
        text = 'Pretest probability ' + pct + '% (15–85%): intermediate likelihood — the range in which noninvasive testing is most informative.';
        level = 'mod';
        badge = 'Intermediate';
      } else {
        text = 'Pretest probability ' + pct + '% (> 85%): high likelihood of significant CAD — a negative noninvasive test is more likely false-negative than truly reassuring.';
        level = 'high';
        badge = 'High';
      }
      return { value: String(pct), unit: '%', text: text, level: level, badge: badge };
    },
    notes: 'Duke Clinical Score (Pryor 1993) logistic model for the probability of significant CAD (> 75% narrowing of ≥ 1 major coronary artery). Coefficients (including the age × sex, MI × Q-wave, age × smoking, age × dyslipidemia and sex × smoking interaction terms) are from the primary publication. Chest-pain type is entered as a single category (typical/atypical/non-anginal), reproducing the paper\'s mutually exclusive indicator coding. Derived in patients referred for catheterization (1969–1983); like other historical models it tends to overestimate CAD prevalence in contemporary populations. The < 15% / 15–85% / > 85% bands follow the common low/intermediate/high framing, not thresholds from the original paper. Verify against the primary publication before clinical use.',
    refs: [
      'Pryor DB et al. Ann Intern Med 1993;118:81-90.',
      'Pryor DB et al. Am J Med 1983;75:771-80.'
    ]
  });

})();
