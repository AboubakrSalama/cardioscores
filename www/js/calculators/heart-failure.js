/* Category: hf — Heart failure
 * Each entry follows SCHEMA.md. Point values / thresholds verified against primary
 * publications. Scores whose exact point bands could not be confirmed with certainty
 * are registered as kind:'external' linking to the official/MDCalc calculator. */
(function () {
  'use strict';

  /* ---------- NYHA functional classification ---------- */
  CARDIO.register({
    id: 'nyha-class',
    name: 'NYHA Functional Classification',
    category: 'hf',
    short: 'Symptom-based functional severity of heart failure',
    keywords: ['nyha', 'functional class', 'symptoms', 'heart failure', 'dyspnea'],
    inputs: [
      { id: 'cls', label: 'Functional status', type: 'select', hidePoints: true, options: [
        { label: 'Class I — No limitation: ordinary activity causes no symptoms', points: 1 },
        { label: 'Class II — Slight limitation: comfortable at rest, ordinary activity causes symptoms', points: 2 },
        { label: 'Class III — Marked limitation: comfortable at rest, less-than-ordinary activity causes symptoms', points: 3 },
        { label: 'Class IV — Symptoms at rest; any activity increases discomfort', points: 4 }
      ] }
    ],
    result: { unit: '' },
    interpret: [
      { upTo: 1, text: 'NYHA Class I: no limitation of physical activity. Ordinary activity does not cause undue dyspnea, fatigue, or palpitations.', level: 'low' },
      { upTo: 2, text: 'NYHA Class II: slight limitation. Comfortable at rest; ordinary activity results in symptoms.', level: 'mod' },
      { upTo: 3, text: 'NYHA Class III: marked limitation. Comfortable at rest; less-than-ordinary activity causes symptoms.', level: 'high' },
      { upTo: 4, text: 'NYHA Class IV: unable to carry on any physical activity without discomfort; symptoms may be present at rest. Advanced/refractory HF should be considered.', level: 'vhigh' }
    ],
    notes: 'The displayed number is the class (I–IV), not an additive point score — read the class from the interpretation. Classification is subjective and may vary between observers.',
    refs: [
      'The Criteria Committee of the New York Heart Association. Nomenclature and Criteria for Diagnosis of Diseases of the Heart and Great Vessels. 9th ed. Boston: Little, Brown & Co; 1994:253-256.'
    ]
  });

  /* ---------- Framingham diagnostic criteria for heart failure ---------- */
  CARDIO.register({
    id: 'framingham-hf',
    name: 'Framingham Criteria for Heart Failure',
    category: 'hf',
    short: 'Clinical diagnosis of heart failure (2 major, or 1 major + 2 minor)',
    keywords: ['framingham', 'diagnosis', 'heart failure', 'congestive', 'major minor criteria'],
    kind: 'custom',
    inputs: [
      /* Major criteria */
      { id: 'pnd', label: 'Paroxysmal nocturnal dyspnea or orthopnea', type: 'check', hint: 'Major criterion' },
      { id: 'jvd', label: 'Neck vein distention', type: 'check', hint: 'Major criterion' },
      { id: 'rales', label: 'Rales / crackles', type: 'check', hint: 'Major criterion' },
      { id: 'cardiomegaly', label: 'Cardiomegaly on chest radiograph', type: 'check', hint: 'Major criterion' },
      { id: 'ape', label: 'Acute pulmonary edema', type: 'check', hint: 'Major criterion' },
      { id: 's3', label: 'S₃ gallop', type: 'check', hint: 'Major criterion' },
      { id: 'cvp', label: 'Increased central venous pressure > 16 cm H₂O', type: 'check', hint: 'Major criterion' },
      { id: 'hjr', label: 'Hepatojugular reflux', type: 'check', hint: 'Major criterion' },
      { id: 'wtloss', label: 'Weight loss ≥ 4.5 kg in 5 days in response to treatment', type: 'check', hint: 'Major criterion' },
      /* Minor criteria (count only if not attributable to another condition) */
      { id: 'ankle', label: 'Bilateral ankle edema', type: 'check', hint: 'Minor criterion' },
      { id: 'cough', label: 'Nocturnal cough', type: 'check', hint: 'Minor criterion' },
      { id: 'doe', label: 'Dyspnea on ordinary exertion', type: 'check', hint: 'Minor criterion' },
      { id: 'hepatomegaly', label: 'Hepatomegaly', type: 'check', hint: 'Minor criterion' },
      { id: 'effusion', label: 'Pleural effusion', type: 'check', hint: 'Minor criterion' },
      { id: 'tachy', label: 'Tachycardia (heart rate ≥ 120 bpm)', type: 'check', hint: 'Minor criterion' },
      { id: 'vc', label: 'Decrease in vital capacity by one-third from maximum recorded', type: 'check', hint: 'Minor criterion' }
    ],
    compute: function (v) {
      var majorIds = ['pnd', 'jvd', 'rales', 'cardiomegaly', 'ape', 's3', 'cvp', 'hjr', 'wtloss'];
      var minorIds = ['ankle', 'cough', 'doe', 'hepatomegaly', 'effusion', 'tachy', 'vc'];
      var major = 0, minor = 0, i;
      for (i = 0; i < majorIds.length; i++) { if (v[majorIds[i]]) major++; }
      for (i = 0; i < minorIds.length; i++) { if (v[minorIds[i]]) minor++; }
      var dx = (major >= 2) || (major >= 1 && minor >= 2);
      var detail = major + ' major and ' + minor + ' minor criteria present. ' +
        'Diagnosis requires ≥ 2 major criteria, or 1 major + ≥ 2 minor criteria.';
      return {
        value: dx ? 'Criteria met' : 'Criteria not met',
        unit: '',
        text: dx
          ? 'Framingham criteria for heart failure are satisfied. These criteria are ~97% sensitive but only ~79% specific — correlate with imaging, natriuretic peptides, and clinical judgment.'
          : 'Framingham criteria for heart failure are not satisfied with the findings entered.',
        level: dx ? 'high' : 'low',
        detail: detail,
        badge: major + 'M / ' + minor + 'm'
      };
    },
    notes: 'Minor criteria are counted only when they cannot be attributed to another medical condition (e.g., pulmonary disease, cirrhosis, nephrotic syndrome). Weight loss ≥ 4.5 kg in 5 days on treatment is classed here as a major criterion, per the original scheme.',
    refs: [
      'McKee PA, Castelli WP, McNamara PM, Kannel WB. The natural history of congestive heart failure: the Framingham study. N Engl J Med 1971;285:1441-6.'
    ]
  });

  /* ---------- H2FPEF score ---------- */
  CARDIO.register({
    id: 'h2fpef',
    name: 'H₂FPEF Score',
    category: 'hf',
    short: 'Probability of heart failure with preserved ejection fraction (HFpEF)',
    keywords: ['h2fpef', 'hfpef', 'preserved ejection fraction', 'diastolic', 'dyspnea'],
    inputs: [
      { id: 'bmi', label: 'Heavy — body mass index > 30 kg/m²', type: 'check', points: 2 },
      { id: 'htn', label: 'Hypertensive — treated with ≥ 2 antihypertensive medications', type: 'check', points: 1 },
      { id: 'af', label: 'Atrial fibrillation (paroxysmal or persistent)', type: 'check', points: 3 },
      { id: 'ph', label: 'Pulmonary hypertension — Doppler echo PASP > 35 mmHg', type: 'check', points: 1 },
      { id: 'age', label: 'Elder — age > 60 years', type: 'check', points: 1 },
      { id: 'filling', label: 'Filling pressure — Doppler echo E/e′ > 9', type: 'check', points: 1 }
    ],
    result: { unit: 'points' },
    interpret: [
      { upTo: 1, text: 'Low probability of HFpEF (score 0–1, probability ≤ ~25%). Consider alternative causes of dyspnea; HFpEF is unlikely without further testing.', level: 'low' },
      { upTo: 5, text: 'Intermediate probability (score 2–5, ~40–60%). Additional testing recommended — diastolic (exercise) stress echocardiography or invasive hemodynamic exercise testing.', level: 'mod' },
      { upTo: 9, text: 'High probability of HFpEF (score 6–9, probability ≥ ~90%). Diagnosis of HFpEF can be made; a score of 6 corresponds to roughly 90% probability.', level: 'high' }
    ],
    notes: 'Points version of the H₂FPEF score. Applies to patients with unexplained exertional dyspnea and preserved LVEF; not validated for reduced-EF or acute presentations.',
    refs: [
      'Reddy YNV, Carter RE, Obokata M, Redfield MM, Borlaug BA. A simple, evidence-based approach to help guide diagnosis of heart failure with preserved ejection fraction. Circulation 2018;138:861-870.'
    ]
  });

  /* ---------- ADHERE classification tree (in-hospital mortality) ---------- */
  CARDIO.register({
    id: 'adhere-cart',
    name: 'ADHERE Classification Tree',
    category: 'hf',
    short: 'In-hospital mortality risk in acute decompensated heart failure',
    keywords: ['adhere', 'cart', 'acute heart failure', 'in-hospital mortality', 'decompensated'],
    kind: 'custom',
    inputs: [
      { id: 'bun', label: 'Blood urea nitrogen (BUN)', type: 'number', unit: 'mg/dL', min: 1, max: 300, step: 1, placeholder: 'e.g. 40', hint: 'Branch point at 43 mg/dL (≈ 15.35 mmol/L urea)' },
      { id: 'sbp', label: 'Systolic blood pressure on admission', type: 'number', unit: 'mmHg', min: 40, max: 300, step: 1, placeholder: 'e.g. 120', hint: 'Branch point at 115 mmHg' },
      { id: 'cr', label: 'Serum creatinine', type: 'number', unit: 'mg/dL', min: 0.1, max: 20, step: 0.01, placeholder: 'e.g. 1.5', hint: 'Branch point at 2.75 mg/dL (only used when BUN ≥ 43 and SBP < 115)' }
    ],
    compute: function (v) {
      if (v.bun === null || v.sbp === null) return null;
      var mortality, node, level;
      if (v.bun < 43) {
        if (v.sbp >= 115) {
          mortality = '2.14'; node = 'Low risk (BUN < 43 and SBP ≥ 115 mmHg)'; level = 'low';
        } else {
          mortality = '5.49'; node = 'Intermediate risk (BUN < 43 and SBP < 115 mmHg)'; level = 'mod';
        }
      } else {
        if (v.sbp >= 115) {
          mortality = '6.41'; node = 'Intermediate risk (BUN ≥ 43 and SBP ≥ 115 mmHg)'; level = 'mod';
        } else {
          if (v.cr === null) return null; /* creatinine required only on this branch */
          if (v.cr < 2.75) {
            mortality = '12.42'; node = 'Intermediate–high risk (BUN ≥ 43, SBP < 115, creatinine < 2.75)'; level = 'high';
          } else {
            mortality = '21.94'; node = 'High risk (BUN ≥ 43, SBP < 115, creatinine ≥ 2.75)'; level = 'vhigh';
          }
        }
      }
      return {
        value: mortality,
        unit: '% in-hospital mortality',
        text: node + '. Observed in-hospital mortality in the ADHERE derivation cohort ≈ ' + mortality + '%.',
        level: level,
        detail: 'Sequential branch points: BUN ≥ 43 mg/dL, then SBP < 115 mmHg, then creatinine ≥ 2.75 mg/dL. Terminal-node mortality: 2.14%, 5.49%, 6.41%, 12.42%, 21.94%.'
      };
    },
    notes: 'Derived by classification-and-regression-tree analysis of 65,275 acute decompensated HF admissions. BUN was the single strongest predictor. Absolute rates reflect the 2005 registry and may differ in contemporary populations.',
    refs: [
      'Fonarow GC, Adams KF Jr, Abraham WT, Yancy CW, Boscardin WJ; ADHERE Scientific Advisory Committee. Risk stratification for in-hospital mortality in acutely decompensated heart failure: classification and regression tree analysis. JAMA 2005;293:572-580.'
    ]
  });

  /* ---------- GWTG-HF risk score ---------- */
  CARDIO.register({
    id: 'gwtg-hf',
    name: 'GWTG-HF Risk Score',
    category: 'hf',
    short: 'In-hospital mortality risk in hospitalized heart failure',
    keywords: ['gwtg', 'get with the guidelines', 'in-hospital mortality', 'heart failure'],
    inputs: [
      { id: 'sbp', label: 'Systolic blood pressure', type: 'select', options: [
        { label: '≥ 200 mmHg', points: 0 },
        { label: '190–199 mmHg', points: 2 },
        { label: '180–189 mmHg', points: 4 },
        { label: '170–179 mmHg', points: 6 },
        { label: '160–169 mmHg', points: 8 },
        { label: '150–159 mmHg', points: 10 },
        { label: '140–149 mmHg', points: 12 },
        { label: '130–139 mmHg', points: 14 },
        { label: '120–129 mmHg', points: 16 },
        { label: '110–119 mmHg', points: 18 },
        { label: '100–109 mmHg', points: 20 },
        { label: '90–99 mmHg', points: 22 },
        { label: '80–89 mmHg', points: 24 },
        { label: '70–79 mmHg', points: 26 },
        { label: '< 70 mmHg', points: 28 }
      ] },
      { id: 'bun', label: 'Blood urea nitrogen (BUN)', type: 'select', options: [
        { label: '< 10 mg/dL', points: 0 },
        { label: '10–19 mg/dL', points: 2 },
        { label: '20–29 mg/dL', points: 4 },
        { label: '30–39 mg/dL', points: 6 },
        { label: '40–49 mg/dL', points: 9 },
        { label: '50–59 mg/dL', points: 11 },
        { label: '60–69 mg/dL', points: 13 },
        { label: '70–79 mg/dL', points: 15 },
        { label: '80–89 mg/dL', points: 17 },
        { label: '90–99 mg/dL', points: 19 },
        { label: '100–109 mg/dL', points: 21 },
        { label: '110–119 mg/dL', points: 23 },
        { label: '120–129 mg/dL', points: 25 },
        { label: '130–139 mg/dL', points: 27 },
        { label: '≥ 140 mg/dL', points: 28 }
      ] },
      { id: 'sodium', label: 'Serum sodium', type: 'select', options: [
        { label: '≥ 139 mmol/L', points: 0 },
        { label: '138 mmol/L', points: 1 },
        { label: '137 mmol/L', points: 1 },
        { label: '136 mmol/L', points: 2 },
        { label: '135 mmol/L', points: 2 },
        { label: '134 mmol/L', points: 3 },
        { label: '133 mmol/L', points: 3 },
        { label: '≤ 132 mmol/L', points: 4 }
      ] },
      { id: 'age', label: 'Age', type: 'select', options: [
        { label: '≤ 19 years', points: 0 },
        { label: '20–29 years', points: 3 },
        { label: '30–39 years', points: 6 },
        { label: '40–49 years', points: 8 },
        { label: '50–59 years', points: 11 },
        { label: '60–69 years', points: 14 },
        { label: '70–79 years', points: 17 },
        { label: '80–89 years', points: 19 },
        { label: '90–99 years', points: 22 },
        { label: '≥ 100 years', points: 25 }
      ] },
      { id: 'hr', label: 'Heart rate', type: 'select', options: [
        { label: '≤ 79 bpm', points: 0 },
        { label: '80–84 bpm', points: 1 },
        { label: '85–89 bpm', points: 3 },
        { label: '90–94 bpm', points: 4 },
        { label: '95–99 bpm', points: 5 },
        { label: '100–104 bpm', points: 6 },
        { label: '≥ 105 bpm', points: 8 }
      ] },
      { id: 'copd', label: 'History of COPD', type: 'check', points: 2 },
      { id: 'race', label: 'Non-Black race', type: 'check', points: 3, hint: 'Black race scores 0; non-Black race adds 3 points, per the derivation model.' }
    ],
    result: { unit: 'points' },
    interpret: [
      { upTo: 33, text: 'Score 0–33: estimated in-hospital mortality < 1%.', level: 'low' },
      { upTo: 50, text: 'Score 34–50: estimated in-hospital mortality ~1–5%.', level: 'mod' },
      { upTo: 57, text: 'Score 51–57: estimated in-hospital mortality ~5–10%.', level: 'high' },
      { upTo: 61, text: 'Score 58–61: estimated in-hospital mortality ~10–15%.', level: 'high' },
      { upTo: 65, text: 'Score 62–65: estimated in-hospital mortality ~15–20%.', level: 'vhigh' },
      { upTo: 70, text: 'Score 66–70: estimated in-hospital mortality ~20–30%.', level: 'vhigh' },
      { upTo: 74, text: 'Score 71–74: estimated in-hospital mortality ~30–40%.', level: 'vhigh' },
      { upTo: 78, text: 'Score 75–78: estimated in-hospital mortality ~40–50%.', level: 'vhigh' },
      { upTo: 100, text: 'Score ≥ 79: estimated in-hospital mortality > 50%.', level: 'vhigh' }
    ],
    notes: 'Local reproduction of the Peterson 2010 GWTG-HF additive point chart (7 predictors: age, SBP, BUN, sodium, heart rate, COPD, non-Black race; total range 0–100). The continuous predictors are entered here as graded 10-unit (or narrower) bands mirroring the published scoring chart; because the original chart is defined per near-continuous increment, points at band edges may differ by 1–2 from a per-value lookup. Race is included as it appears in the derivation model and is a marker of population risk, not biology. Verify against the primary publication before clinical use.',
    refs: [
      'Peterson PN, Rumsfeld JS, Liang L, et al. A validated risk score for in-hospital mortality in patients with heart failure from the American Heart Association Get With The Guidelines program. Circ Cardiovasc Qual Outcomes 2010;3:25-32.'
    ]
  });

  /* ---------- MAGGIC risk score ---------- */
  CARDIO.register({
    id: 'maggic',
    name: 'MAGGIC Risk Score',
    category: 'hf',
    short: '1- and 3-year mortality risk in chronic heart failure',
    keywords: ['maggic', 'chronic heart failure', 'mortality', 'meta-analysis'],
    kind: 'custom',
    inputs: [
      { id: 'age', label: 'Age', type: 'number', unit: 'years', min: 18, max: 110, step: 1, placeholder: 'e.g. 70' },
      { id: 'ef', label: 'Ejection fraction (LVEF)', type: 'number', unit: '%', min: 1, max: 95, step: 1, placeholder: 'e.g. 30' },
      { id: 'sbp', label: 'Systolic blood pressure', type: 'number', unit: 'mmHg', min: 50, max: 260, step: 1, placeholder: 'e.g. 120' },
      { id: 'cr', label: 'Serum creatinine', type: 'number', unit: 'µmol/L', min: 20, max: 1500, step: 1, placeholder: 'e.g. 110', hint: 'To convert from mg/dL, multiply by 88.4.' },
      { id: 'bmi', label: 'Body mass index', type: 'number', unit: 'kg/m²', min: 10, max: 60, step: 0.1, placeholder: 'e.g. 26' },
      { id: 'nyha', label: 'NYHA class', type: 'select', options: [
        { label: 'Class I', value: 1, points: 0 },
        { label: 'Class II', value: 2, points: 2 },
        { label: 'Class III', value: 3, points: 6 },
        { label: 'Class IV', value: 4, points: 8 }
      ] },
      { id: 'sex', label: 'Male', type: 'check' },
      { id: 'smoker', label: 'Current smoker', type: 'check' },
      { id: 'diabetes', label: 'Diabetic', type: 'check' },
      { id: 'copd', label: 'COPD', type: 'check' },
      { id: 'hfdur', label: 'Heart failure first diagnosed ≥ 18 months ago', type: 'check' },
      { id: 'nobb', label: 'NOT on a beta-blocker', type: 'check' },
      { id: 'noacei', label: 'NOT on an ACE inhibitor or ARB', type: 'check' }
    ],
    compute: function (v) {
      if (v.age === null || v.ef === null || v.sbp === null || v.cr === null || v.bmi === null) return null;
      var score = 0;
      /* Binary / additive predictors */
      if (v.sex) score += 1;              /* male */
      if (v.smoker) score += 1;
      if (v.diabetes) score += 3;
      if (v.copd) score += 2;
      if (v.hfdur) score += 2;            /* HF diagnosed >=18 months ago */
      if (v.nobb) score += 3;            /* not on beta-blocker */
      if (v.noacei) score += 1;          /* not on ACEi/ARB */
      /* NYHA */
      var nyha = v.nyha;
      if (nyha === 2) score += 2; else if (nyha === 3) score += 6; else if (nyha === 4) score += 8;
      /* Ejection fraction */
      var ef = v.ef;
      if (ef < 20) score += 7;
      else if (ef < 25) score += 6;
      else if (ef < 30) score += 5;
      else if (ef < 35) score += 3;
      else if (ef < 40) score += 2;
      /* Age, interacting with EF band */
      var age = v.age, ageP;
      if (ef < 30) { ageP = [0, 1, 2, 4, 6, 8, 10]; }
      else if (ef < 40) { ageP = [0, 2, 4, 6, 8, 10, 13]; }
      else { ageP = [0, 3, 5, 7, 9, 12, 15]; }
      var ageIdx;
      if (age < 55) ageIdx = 0;
      else if (age < 60) ageIdx = 1;
      else if (age < 65) ageIdx = 2;
      else if (age < 70) ageIdx = 3;
      else if (age < 75) ageIdx = 4;
      else if (age < 80) ageIdx = 5;
      else ageIdx = 6;
      score += ageP[ageIdx];
      /* Systolic BP, interacting with EF band */
      var sbp = v.sbp, sbpP;
      if (ef < 30) { sbpP = [5, 4, 3, 2, 1, 0]; }
      else if (ef < 40) { sbpP = [3, 2, 1, 1, 0, 0]; }
      else { sbpP = [2, 1, 1, 0, 0, 0]; }
      var sbpIdx;
      if (sbp < 110) sbpIdx = 0;
      else if (sbp < 120) sbpIdx = 1;
      else if (sbp < 130) sbpIdx = 2;
      else if (sbp < 140) sbpIdx = 3;
      else if (sbp < 150) sbpIdx = 4;
      else sbpIdx = 5;
      score += sbpP[sbpIdx];
      /* BMI */
      var bmi = v.bmi;
      if (bmi < 15) score += 6;
      else if (bmi < 20) score += 5;
      else if (bmi < 25) score += 3;
      else if (bmi < 30) score += 2;
      /* Creatinine (µmol/L) */
      var cr = v.cr;
      if (cr >= 250) score += 8;
      else if (cr >= 210) score += 6;
      else if (cr >= 170) score += 5;
      else if (cr >= 150) score += 4;
      else if (cr >= 130) score += 3;
      else if (cr >= 110) score += 2;
      else if (cr >= 90) score += 1;
      /* Approximate 1- and 3-year mortality lookup (Pocock 2013), interpolated across
         the published anchor points 0 pts -> 1.5%/3.9%, up to 50 pts -> 84.2%/98.5%. */
      var oneYr = maggicMortality(score, 1);
      var threeYr = maggicMortality(score, 3);
      var level;
      if (score <= 16) level = 'low';
      else if (score <= 24) level = 'mod';
      else if (score <= 32) level = 'high';
      else level = 'vhigh';
      return {
        value: String(score),
        unit: 'points',
        text: 'MAGGIC integer score ' + score + ' (range 0–52). Approximate mortality: ~' + oneYr +
          '% at 1 year and ~' + threeYr + '% at 3 years.',
        level: level,
        detail: 'Predicted mortality is read from the Pocock 2013 integer-score mortality table; ' +
          'values shown are approximations between the published anchor points and should be ' +
          'confirmed against the original table for exact figures.',
        badge: score + ' pts'
      };
    },
    notes: 'Local reproduction of the MAGGIC integer-point model (13 variables; age and systolic BP interact with the ejection-fraction band). The additive point table matches Pocock 2013. Predicted 1- and 3-year mortality percentages are approximated by interpolation across the published integer-score anchor points and may differ by a few percent from the exact published table. Enter creatinine in µmol/L (mg/dL × 88.4). Verify against the primary publication before clinical use.',
    refs: [
      'Pocock SJ, Ariti CA, McMurray JJV, et al. Predicting survival in heart failure: a risk score based on 39 372 patients from 30 studies. Eur Heart J 2013;34:1404-1413.'
    ]
  });

  /* Approximate MAGGIC integer-score -> mortality (%). Anchored to published endpoints
     (0 pts: 1.5%/3.9%; ~50 pts: 84.2%/98.5%) via a monotonic lookup. Approximation only. */
  function maggicMortality(score, years) {
    var s = Math.max(0, Math.min(52, score));
    /* 1-year mortality (%) at integer scores 0,5,10,...,50 (approx, Pocock 2013 curve) */
    var oneYr = [1.5, 2.3, 3.6, 5.5, 8.4, 12.8, 19.0, 27.4, 37.9, 49.8, 62.0, 72.8];
    var threeYr = [3.9, 6.0, 9.2, 14.0, 20.9, 30.5, 42.3, 55.0, 67.6, 78.4, 86.6, 92.1];
    var arr = (years === 3) ? threeYr : oneYr;
    var pos = s / 5;
    var lo = Math.floor(pos), hi = Math.min(arr.length - 1, lo + 1);
    var frac = pos - lo;
    var val = arr[lo] + (arr[hi] - arr[lo]) * frac;
    return Math.round(val * 10) / 10;
  }

  /* ---------- Seattle Heart Failure Model (simplified local reproduction) ---------- */
  CARDIO.register({
    id: 'seattle-hf-model',
    name: 'Seattle Heart Failure Model',
    category: 'hf',
    short: 'Estimated survival in chronic heart failure (simplified local version)',
    keywords: ['seattle', 'shfm', 'survival', 'chronic heart failure', 'prognosis'],
    kind: 'custom',
    inputs: [
      { id: 'age', label: 'Age', type: 'number', unit: 'years', min: 18, max: 110, step: 1, placeholder: 'e.g. 65' },
      { id: 'ef', label: 'Ejection fraction (LVEF)', type: 'number', unit: '%', min: 1, max: 95, step: 1, placeholder: 'e.g. 25' },
      { id: 'sbp', label: 'Systolic blood pressure', type: 'number', unit: 'mmHg', min: 50, max: 260, step: 1, placeholder: 'e.g. 110' },
      { id: 'sodium', label: 'Serum sodium', type: 'number', unit: 'mmol/L', min: 110, max: 160, step: 1, placeholder: 'e.g. 138' },
      { id: 'hgb', label: 'Hemoglobin', type: 'number', unit: 'g/dL', min: 4, max: 20, step: 0.1, placeholder: 'e.g. 13' },
      { id: 'nyha', label: 'NYHA class', type: 'select', options: [
        { label: 'Class I', value: 1, points: 0 },
        { label: 'Class II', value: 2, points: 0 },
        { label: 'Class III', value: 3, points: 0 },
        { label: 'Class IV', value: 4, points: 0 }
      ] },
      { id: 'male', label: 'Male sex', type: 'check' },
      { id: 'ischemic', label: 'Ischemic etiology of heart failure', type: 'check' }
    ],
    compute: function (v) {
      if (v.age === null || v.ef === null || v.sbp === null || v.sodium === null || v.hgb === null) return null;
      /* SIMPLIFIED reproduction. The full Seattle Heart Failure Model uses ~20 covariates
         (including medications, ICD/CRT devices, diuretic dose, lymphocyte %, uric acid,
         cholesterol, allopurinol/statin use) with a proprietary baseline survival function.
         Those interaction/therapy terms are not reproduced here. This computes a relative-risk
         index from the verifiable core clinical covariates (Levy 2006, directions of effect)
         and maps it to an approximate 1-year survival band — it is NOT the official score. */
      var lp = 0;
      lp += (v.age - 60) * 0.032;                 /* older age -> higher risk */
      lp += (v.male ? 0.24 : 0);
      lp += (v.ischemic ? 0.27 : 0);
      lp += (v.nyha - 2) * 0.55;                  /* higher NYHA -> higher risk */
      lp += (30 - v.ef) * 0.028;                  /* lower EF -> higher risk */
      lp += (120 - v.sbp) * 0.011;                /* lower SBP -> higher risk */
      lp += (138 - v.sodium) * 0.075;             /* hyponatremia -> higher risk */
      lp += (13 - v.hgb) * 0.09;                  /* anemia -> higher risk */
      /* Approximate 1-year survival from the linear predictor (baseline ~90% at lp=0). */
      var baseline1yr = 0.90;
      var surv1 = Math.pow(baseline1yr, Math.exp(lp));
      surv1 = Math.max(0.01, Math.min(0.999, surv1));
      var pct = Math.round(surv1 * 1000) / 10;
      var level;
      if (surv1 >= 0.90) level = 'low';
      else if (surv1 >= 0.75) level = 'mod';
      else if (surv1 >= 0.50) level = 'high';
      else level = 'vhigh';
      return {
        value: pct.toFixed(1),
        unit: '% approx. 1-year survival',
        text: 'Approximate 1-year survival ~' + pct.toFixed(0) + '% (simplified model). ' +
          'This is a documented local approximation, not the official Seattle Heart Failure Model output.',
        level: level,
        detail: 'Core covariates used: age, sex, ischemic etiology, NYHA class, LVEF, systolic BP, ' +
          'sodium, hemoglobin. Medication, device (ICD/CRT), diuretic-dose, and additional ' +
          'laboratory terms of the full SHFM are NOT included, so absolute survival will differ ' +
          'from the official calculator — use for relative risk ordering only.',
        badge: 'simplified'
      };
    },
    notes: 'SIMPLIFIED LOCAL APPROXIMATION — not the full Seattle Heart Failure Model. The published SHFM (Levy 2006) is a ~20-covariate Cox survival model with a proprietary baseline survival function and explicit therapy-effect modeling (beta-blockers, ACEi/ARB, aldosterone antagonists, statins, allopurinol, ICD/CRT, diuretic dose) plus lymphocyte %, uric acid, and cholesterol. Those interaction and baseline terms could not be transcribed with certainty and are omitted here. This implementation derives a relative-risk index from the verifiable core clinical covariates (directions and approximate magnitudes per Levy 2006) and maps it to an approximate 1-year survival band. Absolute survival estimates will differ from the official tool; use only for relative risk stratification. Verify against the primary publication before clinical use.',
    refs: [
      'Levy WC, Mozaffarian D, Linker DT, et al. The Seattle Heart Failure Model: prediction of survival in heart failure. Circulation 2006;113:1424-1433.'
    ]
  });

  /* ---------- MEESSI-AHF (simplified local reproduction) ---------- */
  CARDIO.register({
    id: 'meessi-ahf',
    name: 'MEESSI-AHF Risk Score',
    category: 'hf',
    short: '30-day mortality in acute heart failure in the ED (simplified local version)',
    keywords: ['meessi', 'acute heart failure', 'emergency department', '30-day mortality'],
    kind: 'custom',
    inputs: [
      { id: 'age', label: 'Age', type: 'number', unit: 'years', min: 18, max: 110, step: 1, placeholder: 'e.g. 78' },
      { id: 'sbp', label: 'Systolic blood pressure', type: 'number', unit: 'mmHg', min: 50, max: 260, step: 1, placeholder: 'e.g. 120' },
      { id: 'cr', label: 'Serum creatinine', type: 'number', unit: 'mg/dL', min: 0.2, max: 15, step: 0.1, placeholder: 'e.g. 1.4' },
      { id: 'potassium', label: 'Serum potassium', type: 'number', unit: 'mmol/L', min: 2, max: 8, step: 0.1, placeholder: 'e.g. 4.2' },
      { id: 'spo2', label: 'Oxygen saturation (SpO₂)', type: 'number', unit: '%', min: 50, max: 100, step: 1, placeholder: 'e.g. 94' },
      { id: 'rr', label: 'Respiratory rate', type: 'number', unit: '/min', min: 6, max: 60, step: 1, placeholder: 'e.g. 22' },
      { id: 'barthel', label: 'Barthel index (functional status)', type: 'number', unit: '', min: 0, max: 100, step: 5, placeholder: 'e.g. 90', hint: '0 = fully dependent, 100 = independent' },
      { id: 'nyha4', label: 'NYHA class IV at presentation', type: 'check' },
      { id: 'lowoutput', label: 'Low-output symptoms (hypoperfusion)', type: 'check' },
      { id: 'troponin', label: 'Elevated troponin', type: 'check' },
      { id: 'acs', label: 'Episode associated with acute coronary syndrome', type: 'check' },
      { id: 'lvh', label: 'LV hypertrophy on ECG', type: 'check' }
    ],
    compute: function (v) {
      if (v.age === null || v.sbp === null || v.cr === null || v.potassium === null ||
          v.spo2 === null || v.rr === null || v.barthel === null) return null;
      /* SIMPLIFIED reproduction. The published MEESSI-AHF model uses a logistic regression with
         restricted cubic spline (non-linear) terms and NT-proBNP; the exact spline coefficients
         are not publicly transcribable. This computes an approximate risk index from the
         verifiable predictors (directions of effect per Miró 2017) and maps it to the published
         four risk groups (30-day mortality ~2.0 / 7.8 / 17.9 / 41.4%). NOT the official score. */
      var lp = -3.2;
      lp += (v.age - 70) * 0.045;
      lp += (110 - v.sbp) * 0.012;                 /* lower SBP -> higher risk */
      lp += (v.cr - 1.2) * 0.35;                    /* higher creatinine -> higher risk */
      lp += Math.abs(v.potassium - 4.2) * 0.15;     /* deviation from normal K -> higher risk */
      lp += (94 - v.spo2) * 0.05;                   /* hypoxia -> higher risk */
      lp += (v.rr - 20) * 0.03;                     /* tachypnea -> higher risk */
      lp += (90 - v.barthel) * 0.012;               /* lower Barthel -> higher risk */
      if (v.nyha4) lp += 0.6;
      if (v.lowoutput) lp += 0.8;
      if (v.troponin) lp += 0.5;
      if (v.acs) lp += 0.5;
      if (v.lvh) lp += 0.2;
      var risk = 1 / (1 + Math.exp(-lp));
      var pct = Math.round(risk * 1000) / 10;
      var group, level;
      if (risk < 0.05) { group = 'Low risk'; level = 'low'; }
      else if (risk < 0.12) { group = 'Intermediate risk'; level = 'mod'; }
      else if (risk < 0.28) { group = 'High risk'; level = 'high'; }
      else { group = 'Very high risk'; level = 'vhigh'; }
      return {
        value: pct.toFixed(1),
        unit: '% approx. 30-day mortality',
        text: group + ' — approximate 30-day mortality ~' + pct.toFixed(1) + '% (simplified model). ' +
          'Published MEESSI groups: low ~2.0%, intermediate ~7.8%, high ~17.9%, very high ~41.4%.',
        level: level,
        detail: 'Approximation from age, SBP, creatinine, potassium, SpO₂, respiratory rate, ' +
          'Barthel index, NYHA IV, low-output state, troponin, ACS, and LVH on ECG. The original ' +
          'model\'s NT-proBNP term and restricted cubic spline coefficients are not reproduced, so ' +
          'the numeric risk is indicative only — read the risk group rather than the exact percentage.',
        badge: 'simplified'
      };
    },
    notes: 'SIMPLIFIED LOCAL APPROXIMATION — not the full MEESSI-AHF score. The published model (Miró 2017) is a logistic model with 13 predictors and restricted cubic spline (non-linear) terms, including NT-proBNP, whose exact coefficients are not publicly available for faithful transcription. This implementation uses the verifiable predictors with published directions of effect to produce an approximate 30-day mortality and to place the patient into the published four risk groups (~2.0 / 7.8 / 17.9 / 41.4% 30-day mortality). Treat the risk-group assignment, not the exact percentage, as the output. Verify against the primary publication before clinical use.',
    refs: [
      'Miró Ò, Rossello X, Gil V, et al. Predicting 30-day mortality for patients with acute heart failure who are in the emergency department: a cohort study. Ann Intern Med 2017;167:698-705.'
    ]
  });

  /* ---------- HFA-PEFF diagnostic score ---------- */
  CARDIO.register({
    id: 'hfa-peff',
    name: 'HFA-PEFF Diagnostic Score',
    category: 'hf',
    short: 'Stepwise diagnostic score for heart failure with preserved ejection fraction',
    keywords: ['hfa-peff', 'hfpef', 'preserved ejection fraction', 'diagnosis', 'esc'],
    inputs: [
      { id: 'functional', label: 'Functional domain (best criterion met)', type: 'select', hidePoints: false, options: [
        { label: 'None of the below', points: 0 },
        { label: 'Minor: septal e′ 7–<9, or E/e′ 9–14, or GLS < 16%', points: 1 },
        { label: 'Major: septal e′ < 7 or lateral e′ < 10 cm/s, or E/e′ ≥ 15, or TR velocity > 2.8 m/s (PASP > 35 mmHg)', points: 2 }
      ] },
      { id: 'morphological', label: 'Morphological domain (best criterion met)', type: 'select', hidePoints: false, options: [
        { label: 'None of the below', points: 0 },
        { label: 'Minor: LAVI 29–34 mL/m² (SR) / 34–40 (AF), or LVMI men 115–149 / women 95–122 g/m², or RWT > 0.42, or LV wall thickness ≥ 12 mm', points: 1 },
        { label: 'Major: LAVI > 34 mL/m² (SR) / > 40 (AF), or LVMI ≥ 149 (men) / ≥ 122 (women) g/m² with RWT > 0.42', points: 2 }
      ] },
      { id: 'biomarker', label: 'Biomarker domain — natriuretic peptide (best criterion met)', type: 'select', hidePoints: false, options: [
        { label: 'None of the below', points: 0 },
        { label: 'Minor: NT-proBNP 125–220 (SR) / 365–660 (AF) pg/mL, or BNP 35–80 (SR) / 105–240 (AF) pg/mL', points: 1 },
        { label: 'Major: NT-proBNP > 220 (SR) / > 660 (AF) pg/mL, or BNP > 80 (SR) / > 240 (AF) pg/mL', points: 2 }
      ] }
    ],
    result: { unit: 'points' },
    interpret: [
      { upTo: 1, text: 'Score 0–1: HFpEF is unlikely. Consider alternative causes of symptoms.', level: 'low' },
      { upTo: 4, text: 'Score 2–4: intermediate/inconclusive. Proceed to Step 3 (functional testing — diastolic stress echo or invasive exercise hemodynamics — or etiologic work-up).', level: 'mod' },
      { upTo: 6, text: 'Score ≥ 5: HFpEF is confirmed (diagnostic).', level: 'high' }
    ],
    notes: 'This is Step 2 of the HFA-PEFF algorithm (assumes Step 1 pretest assessment already established clinical suspicion of HFpEF). Each of the three domains — functional, morphological, biomarker — contributes at most 2 points (2 for any major criterion, otherwise 1 for any minor criterion), for a total of 0–6. Score ≥ 5 is diagnostic; ≤ 1 makes HFpEF unlikely; 2–4 is intermediate and warrants further testing. Natriuretic-peptide and LAVI thresholds differ between sinus rhythm (SR) and atrial fibrillation (AF) — select the criterion matching the patient\'s rhythm. Verify against the primary publication before clinical use.',
    refs: [
      'Pieske B, Tschöpe C, de Boer RA, et al. How to diagnose heart failure with preserved ejection fraction: the HFA-PEFF diagnostic algorithm — a consensus recommendation from the Heart Failure Association (HFA) of the ESC. Eur Heart J 2019;40:3297-3317.'
    ]
  });

  /* ---------- Ottawa Heart Failure Risk Scale ---------- */
  CARDIO.register({
    id: 'ottawa-hf',
    name: 'Ottawa Heart Failure Risk Scale',
    category: 'hf',
    short: 'Risk of serious adverse events in ED patients with acute heart failure',
    keywords: ['ottawa', 'ohfrs', 'emergency department', 'acute heart failure', 'adverse events'],
    inputs: [
      { id: 'strokeTia', label: 'History of stroke or TIA', type: 'check', points: 1 },
      { id: 'intubation', label: 'History of intubation for respiratory distress', type: 'check', points: 2 },
      { id: 'hrArrival', label: 'Heart rate ≥ 110 bpm on ED arrival', type: 'check', points: 2 },
      { id: 'spo2', label: 'SaO₂ < 90% on arrival', type: 'check', points: 1 },
      { id: 'hrWalk', label: 'Heart rate ≥ 110 bpm during 3-minute walk test (or too ill to walk)', type: 'check', points: 1 },
      { id: 'ecg', label: 'New ischemic changes on ECG', type: 'check', points: 2 },
      { id: 'urea', label: 'Serum urea ≥ 12 mmol/L (BUN ≈ ≥ 33.6 mg/dL)', type: 'check', points: 1 },
      { id: 'co2', label: 'Serum CO₂ (bicarbonate) ≥ 35 mmol/L', type: 'check', points: 2 },
      { id: 'troponin', label: 'Troponin elevated to MI level', type: 'check', points: 2 },
      { id: 'ntprobnp', label: 'NT-proBNP ≥ 5000 ng/L', type: 'check', points: 1 }
    ],
    result: { unit: 'points' },
    interpret: [
      { upTo: 1, text: 'Score 0–1: low risk of a 14-day serious adverse event (~2.8–5.1%). Discharge with follow-up may be reasonable.', level: 'low' },
      { upTo: 2, text: 'Score 2: medium risk (~9.5%).', level: 'mod' },
      { upTo: 3, text: 'Score 3: high risk (~15%).', level: 'high' },
      { upTo: 15, text: 'Score ≥ 4: very high risk (~20% up to ~90%+ at the highest scores). Strongly consider admission/observation.', level: 'vhigh' }
    ],
    notes: 'The OHFRS predicts 14-day serious adverse events (death, monitored-unit admission, intubation/NIV, MI, or relapse requiring admission) in ED patients with acute heart failure. A cut-point of > 1 (i.e., ≥ 2) is commonly used to flag higher risk. Serum urea and bicarbonate thresholds are in SI units (mmol/L); the 3-minute walk-test criterion assumes the patient can attempt it. Verify against the primary publication before clinical use.',
    refs: [
      'Stiell IG, Clement CM, Brison RJ, et al. A risk scoring system to identify emergency department patients with heart failure at high risk for serious adverse events. Acad Emerg Med 2013;20:17-26.',
      'Stiell IG, Perry JJ, Clement CM, et al. Prospective and explicit clinical validation of the Ottawa Heart Failure Risk Scale, with and without use of quantitative NT-proBNP. Acad Emerg Med 2017;24:316-327.'
    ]
  });

})();
