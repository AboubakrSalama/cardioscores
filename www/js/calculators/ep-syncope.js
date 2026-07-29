/* Category: ep — Electrophysiology / syncope / sudden cardiac death
 * Each entry follows SCHEMA.md. Point values, coefficients and thresholds verified
 * against the primary publications cited in each entry's refs.
 * The 2010 ARVC Task Force Criteria are registered kind:'external' (no reliable
 * public calculator implements the full diagnostic criteria). */
(function () {
  'use strict';

  /* ---------- Schwartz score — LQTS diagnostic criteria (1993) ---------- */
  CARDIO.register({
    id: 'schwartz-lqts',
    name: 'Schwartz Score (LQTS)',
    category: 'ep',
    short: 'Diagnostic probability of congenital long QT syndrome',
    keywords: ['long qt', 'lqts', 'qtc', 'schwartz', 'torsades', 'sudden cardiac death'],
    inputs: [
      { id: 'qtc', label: 'QTc (Bazett), off QT-prolonging drugs', hint: 'Measured in the absence of drugs or conditions known to prolong the QT interval.', type: 'select', options: [
        { label: '< 460 ms (or male < 450 ms)', points: 0 },
        { label: '450–459 ms (males only)', points: 1 },
        { label: '460–479 ms', points: 2 },
        { label: '≥ 480 ms', points: 3 }
      ] },
      { id: 'tdp', label: 'Torsades de pointes', hint: 'Mutually exclusive with syncope — do not count both if the syncope was the documented torsades.', type: 'check', points: 2 },
      { id: 'talt', label: 'T-wave alternans', type: 'check', points: 1 },
      { id: 'notch', label: 'Notched T wave in 3 leads', type: 'check', points: 1 },
      { id: 'lowhr', label: 'Low heart rate for age', hint: 'Resting heart rate below the 2nd percentile for age (pediatric).', type: 'check', points: 0.5 },
      { id: 'syncope', label: 'Syncope', hint: 'Do not also count torsades if the syncope was a documented torsades event.', type: 'select', options: [
        { label: 'None', points: 0 },
        { label: 'Without stress', points: 1 },
        { label: 'With stress', points: 2 }
      ] },
      { id: 'deaf', label: 'Congenital deafness', type: 'check', points: 0.5 },
      { id: 'famlqts', label: 'Family member(s) with definite LQTS', hint: 'A given family member is counted only once (either here or as sudden death, not both).', type: 'check', points: 1 },
      { id: 'famscd', label: 'Unexplained sudden cardiac death < 30 y in an immediate family member', type: 'check', points: 0.5 }
    ],
    interpret: [
      { upTo: 1, text: '≤ 1 point: low probability of LQTS.', level: 'low' },
      { upTo: 3, text: '1.5–3 points: intermediate probability of LQTS.', level: 'mod' },
      { upTo: 11.5, text: '≥ 3.5 points: high probability of LQTS.', level: 'high' }
    ],
    notes: 'QTc must be measured off QT-prolonging drugs and after excluding secondary causes. Torsades and syncope are mutually exclusive; the two family-history items cannot both count the same relative. Point items follow the 1993 criteria; the ≤1 / 1.5–3 / ≥3.5 probability bands are the widely used Schwartz–Crotti thresholds (the original 1993 report labelled ≥4 as high probability). A resting bradycardia item applies to children.',
    refs: [
      'Schwartz PJ, Moss AJ, Vincent GM, Crampton RS. Circulation 1993;88:782-4.',
      'Schwartz PJ, Crotti L. Circulation 2011;124:2181-4.'
    ]
  });

  /* ---------- Tisdale risk score — QT prolongation in hospitalized patients ---------- */
  CARDIO.register({
    id: 'tisdale-qt',
    name: 'Tisdale Risk Score (QT Prolongation)',
    category: 'ep',
    short: 'Risk of QTc prolongation in hospitalized patients',
    keywords: ['qtc', 'qt prolongation', 'tisdale', 'torsades', 'inpatient', 'drug-induced'],
    inputs: [
      { id: 'age68', label: 'Age ≥ 68 years', type: 'check', points: 1 },
      { id: 'female', label: 'Female sex', type: 'check', points: 1 },
      { id: 'loop', label: 'Loop diuretic', type: 'check', points: 1 },
      { id: 'k', label: 'Serum potassium ≤ 3.5 mEq/L', type: 'check', points: 2 },
      { id: 'qtc450', label: 'Admission QTc ≥ 450 ms', type: 'check', points: 2 },
      { id: 'mi', label: 'Acute myocardial infarction', type: 'check', points: 2 },
      { id: 'sepsis', label: 'Sepsis', type: 'check', points: 3 },
      { id: 'hf', label: 'Heart failure (admission diagnosis)', type: 'check', points: 3 },
      { id: 'drugs', label: 'QTc-prolonging drugs', hint: 'Per a known-risk list (e.g., CredibleMeds). The one-drug and ≥2-drug points are additive.', type: 'select', options: [
        { label: 'None', points: 0 },
        { label: 'One QTc-prolonging drug', points: 3 },
        { label: 'Two or more QTc-prolonging drugs', points: 6 }
      ] }
    ],
    interpret: [
      { upTo: 6, text: 'Score 0–6: low risk of QTc prolongation.', level: 'low' },
      { upTo: 10, text: 'Score 7–10: moderate risk of QTc prolongation.', level: 'mod' },
      { upTo: 21, text: 'Score ≥ 11: high risk of QTc prolongation. A high-risk score was ~74% sensitive and ~77% specific for developing QTc > 500 ms in the derivation cohort — monitor ECG/electrolytes and minimize QT-prolonging drugs.', level: 'high' }
    ],
    notes: 'Derived and validated in cardiac-care-unit patients. "One drug" (3 points) and "≥ 2 drugs" (3 additional points) are cumulative, so patients on ≥ 2 QTc-prolonging drugs receive 6 points (maximum total 21).',
    refs: [
      'Tisdale JE et al. Circ Cardiovasc Qual Outcomes 2013;6:479-87.'
    ]
  });

  /* ---------- HCM Risk-SCD (O'Mahony et al. 2014) ---------- */
  CARDIO.register({
    id: 'hcm-risk-scd',
    name: 'HCM Risk-SCD',
    category: 'ep',
    short: '5-year sudden cardiac death risk in hypertrophic cardiomyopathy',
    keywords: ['hcm', 'hypertrophic cardiomyopathy', 'sudden cardiac death', 'icd', 'risk-scd'],
    kind: 'custom',
    inputs: [
      { id: 'age', label: 'Age', type: 'number', unit: 'years', min: 16, max: 120, step: 1, placeholder: 'e.g. 45' },
      { id: 'mwt', label: 'Maximal LV wall thickness', type: 'number', unit: 'mm', min: 10, max: 40, step: 1, placeholder: 'e.g. 20', hint: 'Model derived for 10–35 mm.' },
      { id: 'la', label: 'Left atrial diameter', type: 'number', unit: 'mm', min: 28, max: 70, step: 1, placeholder: 'e.g. 40', hint: 'M-mode / 2D parasternal long axis.' },
      { id: 'gradient', label: 'Maximal LVOT gradient', type: 'number', unit: 'mmHg', min: 0, max: 200, step: 1, placeholder: 'e.g. 30', hint: 'Rest or Valsalva, whichever is higher.' },
      { id: 'fhx', label: 'Family history of sudden cardiac death', type: 'check' },
      { id: 'nsvt', label: 'Non-sustained ventricular tachycardia', type: 'check' },
      { id: 'syncope', label: 'Unexplained syncope', type: 'check' }
    ],
    compute: function (v) {
      var age = v.age, mwt = v.mwt, la = v.la, grad = v.gradient;
      if (age == null || mwt == null || la == null || grad == null) return null;
      var fhx = v.fhx ? 1 : 0, nsvt = v.nsvt ? 1 : 0, syn = v.syncope ? 1 : 0;
      var pi = 0.15939858 * mwt
             - 0.00294271 * mwt * mwt
             + 0.0259082 * la
             + 0.00446131 * grad
             + 0.4583082 * fhx
             + 0.82639195 * nsvt
             + 0.71650361 * syn
             - 0.01799934 * age;
      var risk = (1 - Math.pow(0.998, Math.exp(pi))) * 100;
      if (!isFinite(risk)) return null;
      var level, badge, text;
      if (risk < 4) {
        level = 'low'; badge = 'Low 5-yr SCD risk';
        text = 'Estimated 5-year risk of sudden cardiac death < 4%. ICD generally not indicated (2014 ESC HCM guideline).';
      } else if (risk < 6) {
        level = 'mod'; badge = 'Intermediate 5-yr SCD risk';
        text = 'Estimated 5-year risk of sudden cardiac death 4% to < 6%. ICD may be considered.';
      } else {
        level = 'high'; badge = 'High 5-yr SCD risk';
        text = 'Estimated 5-year risk of sudden cardiac death ≥ 6%. ICD should be considered.';
      }
      var warn = [];
      if (age < 16) warn.push('age < 16 y is outside the validated range');
      if (mwt < 10 || mwt > 35) warn.push('maximal wall thickness outside the 10–35 mm derivation range');
      var detail = 'Prognostic index (PI) = ' + pi.toFixed(3) + '. '
        + 'Applies to patients ≥ 16 y with HCM and no prior cardiac arrest or sustained VT; not validated after septal reduction therapy, for gradients measured post-intervention, for maximal wall thickness > 35 mm, or for metabolic/syndromic HCM.'
        + (warn.length ? ' Caution: ' + warn.join('; ') + '.' : '');
      return { value: risk.toFixed(1), unit: '%', text: text, level: level, badge: badge, detail: detail };
    },
    notes: 'Prob(SCD at 5 y) = 1 − 0.998^exp(PI). The score estimates risk for primary prevention only; patients with prior cardiac arrest or sustained VT are already high risk and are not candidates for the model. Use maximal (rest or provoked) LVOT gradient.',
    refs: [
      'O\'Mahony C et al. Eur Heart J 2014;35:2010-20.',
      '2014 ESC Guidelines on diagnosis and management of hypertrophic cardiomyopathy. Eur Heart J 2014;35:2733-79.'
    ]
  });

  /* ---------- San Francisco Syncope Rule (CHESS) ---------- */
  CARDIO.register({
    id: 'sf-syncope-rule',
    name: 'San Francisco Syncope Rule',
    category: 'ep',
    short: 'Screens ED syncope patients for serious 7-day outcomes (CHESS)',
    keywords: ['syncope', 'chess', 'san francisco', 'emergency', 'serious outcome'],
    inputs: [
      { id: 'chf', label: 'History of congestive heart failure', type: 'check', points: 1 },
      { id: 'hct', label: 'Hematocrit < 30%', type: 'check', points: 1 },
      { id: 'ecg', label: 'Abnormal ECG', hint: 'New changes or a non-sinus rhythm.', type: 'check', points: 1 },
      { id: 'sob', label: 'Shortness of breath (symptom)', type: 'check', points: 1 },
      { id: 'sbp', label: 'Triage systolic BP < 90 mmHg', type: 'check', points: 1 }
    ],
    interpret: [
      { upTo: 0, text: 'No CHESS predictor: low risk. In the derivation cohort the rule was ~96–98% sensitive for a serious 7-day outcome.', level: 'low' },
      { upTo: 5, text: 'One or more CHESS predictors present: not low risk. Flagged for a serious 7-day outcome (death, MI, arrhythmia, PE, stroke, significant hemorrhage, or ED revisit/readmission) — consider admission and further evaluation.', level: 'high' }
    ],
    notes: 'CHESS = CHF history, Hematocrit < 30%, ECG abnormal, Shortness of breath, Systolic BP < 90 mmHg. Any single positive predictor classifies the patient as at risk. High sensitivity but modest specificity (~52–62%); external validation has been variable, so combine with clinical judgment.',
    refs: [
      'Quinn JV et al. Ann Emerg Med 2004;43:224-32.',
      'Quinn J et al. Ann Emerg Med 2006;47:448-54.'
    ]
  });

  /* ---------- EGSYS score ---------- */
  CARDIO.register({
    id: 'egsys',
    name: 'EGSYS Score',
    category: 'ep',
    short: 'Likelihood that syncope is cardiac in origin',
    keywords: ['syncope', 'egsys', 'cardiac syncope', 'palpitations'],
    inputs: [
      { id: 'ecgheart', label: 'Abnormal ECG and/or heart disease', type: 'check', points: 3 },
      { id: 'palp', label: 'Palpitations before syncope', type: 'check', points: 4 },
      { id: 'effort', label: 'Syncope during effort (exertion)', type: 'check', points: 3 },
      { id: 'supine', label: 'Syncope in the supine position', type: 'check', points: 2 },
      { id: 'autonomic', label: 'Autonomic prodromes (nausea/vomiting before syncope)', type: 'check', points: -1 },
      { id: 'precip', label: 'Predisposing/precipitating factors', hint: 'Warm or crowded place, prolonged standing, fear, pain, or emotion.', type: 'check', points: -1 }
    ],
    interpret: [
      { upTo: 2, text: 'Score < 3: cardiac syncope unlikely. Two-year mortality was ~3% for scores < 3 in the derivation cohort.', level: 'low' },
      { upTo: 12, text: 'Score ≥ 3: cardiac syncope likely (~92–95% sensitive for cardiac syncope). Admission and cardiac work-up advised; two-year mortality was ~17% for scores ≥ 3 in the derivation cohort.', level: 'high' }
    ],
    notes: 'A total score ≥ 3 is the threshold for probable cardiac syncope. Negative totals are possible when only the autonomic-prodrome and precipitating-factor items apply.',
    refs: [
      'Del Rosso A et al. Heart 2008;94:1620-6.'
    ]
  });

  /* ---------- OESIL risk score ---------- */
  CARDIO.register({
    id: 'oesil',
    name: 'OESIL Risk Score',
    category: 'ep',
    short: '1-year mortality risk after syncope',
    keywords: ['syncope', 'oesil', 'mortality', 'risk stratification'],
    inputs: [
      { id: 'age65', label: 'Age > 65 years', type: 'check', points: 1 },
      { id: 'cvd', label: 'History of cardiovascular disease', type: 'check', points: 1 },
      { id: 'noprodrome', label: 'Syncope without prodrome', type: 'check', points: 1 },
      { id: 'ecg', label: 'Abnormal ECG', type: 'check', points: 1 }
    ],
    interpret: [
      { upTo: 0, text: 'Score 0: 1-year mortality 0% in the derivation cohort.', level: 'low' },
      { upTo: 1, text: 'Score 1: 1-year mortality ~0.8% in the derivation cohort.', level: 'low' },
      { upTo: 2, text: 'Score 2: 1-year mortality ~19.6% in the derivation cohort.', level: 'high' },
      { upTo: 3, text: 'Score 3: 1-year mortality ~34.7% in the derivation cohort.', level: 'vhigh' },
      { upTo: 4, text: 'Score 4: 1-year mortality ~57.1% in the derivation cohort.', level: 'vhigh' }
    ],
    notes: 'Mortality rises steeply from a score of 2 upward; a score ≥ 2 is commonly used to support admission/observation. Abnormal ECG per the study definition (e.g., rhythm/conduction abnormalities, LV hypertrophy, prior MI, block).',
    refs: [
      'Colivicchi F et al. Eur Heart J 2003;24:811-9.'
    ]
  });

  /* ---------- Shanghai Score for Brugada syndrome ---------- */
  CARDIO.register({
    id: 'shanghai-brugada',
    name: 'Shanghai Score (Brugada Syndrome)',
    category: 'ep',
    short: 'Diagnostic probability of Brugada syndrome',
    keywords: ['brugada', 'shanghai', 'sudden cardiac death', 'sodium channel', 'type 1 ecg'],
    kind: 'custom',
    inputs: [
      { id: 'ecg', label: 'ECG (highest applicable)', hint: 'A type 1 pattern in standard or high (2nd/3rd intercostal) leads.', type: 'select', options: [
        { label: 'None', points: 0 },
        { label: 'Type 2/3 that converts to type 1 with sodium-channel blocker', points: 2 },
        { label: 'Fever-induced type 1', points: 3 },
        { label: 'Spontaneous type 1', points: 3.5 }
      ] },
      { id: 'clinical', label: 'Clinical history (highest applicable)', type: 'select', options: [
        { label: 'None', points: 0 },
        { label: 'Atrial flutter/fibrillation at age < 30 y without other cause', points: 0.5 },
        { label: 'Syncope of unclear mechanism', points: 1 },
        { label: 'Suspected arrhythmic syncope', points: 2 },
        { label: 'Nocturnal agonal respiration', points: 2 },
        { label: 'Unexplained cardiac arrest or documented VF/polymorphic VT', points: 3 }
      ] },
      { id: 'family', label: 'Family history (highest applicable)', type: 'select', options: [
        { label: 'None', points: 0 },
        { label: 'Unexplained SCD < 45 y with negative autopsy in a 1st/2nd-degree relative', points: 0.5 },
        { label: 'Suspicious SCD in a 1st/2nd-degree relative (fever, nocturnal, or BrS-aggravating drug)', points: 1 },
        { label: '1st/2nd-degree relative with definite Brugada syndrome', points: 2 }
      ] },
      { id: 'genetic', label: 'Genetic test result', type: 'select', options: [
        { label: 'None / not done', points: 0 },
        { label: 'Probable pathogenic mutation in a BrS susceptibility gene', points: 0.5 }
      ] }
    ],
    compute: function (v) {
      var ecg = v.ecg || 0, clin = v.clinical || 0, fam = v.family || 0, gen = v.genetic || 0;
      var total = Math.round((ecg + clin + fam + gen) * 10) / 10;
      var value = String(total);
      if (ecg <= 0) {
        return {
          value: value, unit: 'points', level: 'info', badge: 'Non-diagnostic',
          text: 'A Brugada syndrome diagnosis by the Shanghai score requires at least one type 1 ECG pattern (spontaneous, fever-induced, or drug-induced). With no type 1 ECG finding the score is non-diagnostic regardless of the total from clinical, family, and genetic items.',
          detail: 'Points awarded only for the highest item within each category.'
        };
      }
      var level, badge, text;
      if (total >= 3.5) { level = 'high'; badge = 'Probable/definite BrS'; text = 'Score ≥ 3.5: probable and/or definite Brugada syndrome.'; }
      else if (total >= 2) { level = 'mod'; badge = 'Possible BrS'; text = 'Score 2–3: possible Brugada syndrome.'; }
      else { level = 'low'; badge = 'Non-diagnostic'; text = 'Score < 2: non-diagnostic.'; }
      return {
        value: value, unit: 'points', level: level, badge: badge, text: text,
        detail: 'Points awarded only for the highest item within each category (ECG, clinical, family, genetic).'
      };
    },
    notes: 'From the 2016 J-Wave Syndromes expert consensus. Only the single highest-scoring item in each category counts; the category selectors enforce this. A diagnosis requires at least one type 1 ECG pattern. Thresholds: ≥ 3.5 probable/definite, 2–3 possible, < 2 non-diagnostic.',
    refs: [
      'Antzelevitch C et al. Heart Rhythm 2016;13:e295-324 (J-Wave Syndromes consensus).',
      'Kawada S et al. JACC Clin Electrophysiol 2018;4:724-30 (validation).'
    ]
  });

  /* ---------- Canadian Syncope Risk Score (CSRS) ---------- */
  CARDIO.register({
    id: 'canadian-syncope-risk-score',
    name: 'Canadian Syncope Risk Score (CSRS)',
    category: 'ep',
    short: '30-day serious adverse event risk after ED syncope',
    keywords: ['syncope', 'csrs', 'canadian', 'emergency', 'serious adverse event'],
    inputs: [
      { id: 'predisp', label: 'Predisposition to vasovagal symptoms', hint: 'Triggered by being in a warm crowded place, prolonged standing, fear, emotion, or pain', type: 'check', points: -1 },
      { id: 'heartdz', label: 'History of heart disease', hint: 'CAD, atrial fibrillation/flutter, CHF, or valvular disease', type: 'check', points: 1 },
      { id: 'sbp', label: 'Any systolic BP < 90 or > 180 mmHg', hint: 'On any ED reading', type: 'check', points: 2 },
      { id: 'trop', label: 'Elevated troponin (> 99th percentile)', type: 'check', points: 2 },
      { id: 'axis', label: 'Abnormal QRS axis (< −30° or > 100°)', type: 'check', points: 1 },
      { id: 'qrs', label: 'QRS duration > 130 ms', type: 'check', points: 1 },
      { id: 'qtc', label: 'Corrected QT interval > 480 ms', type: 'check', points: 2 },
      { id: 'eddx', label: 'Emergency department diagnosis', type: 'select', options: [
        { label: 'Neither / not yet diagnosed', points: 0 },
        { label: 'Vasovagal syncope', points: -2 },
        { label: 'Cardiac syncope', points: 2 }
      ] }
    ],
    interpret: [
      { upTo: -2, text: 'Very low risk — 30-day serious adverse event ~0.4–0.7%.', level: 'low' },
      { upTo: 0, text: 'Low risk — 30-day serious adverse event ~1.2–1.9%.', level: 'low' },
      { upTo: 3, text: 'Medium risk — 30-day serious adverse event ~3.1–8.1%.', level: 'mod' },
      { upTo: 5, text: 'High risk — 30-day serious adverse event ~12.9–17.6%.', level: 'high' },
      { upTo: 11, text: 'Very high risk — 30-day serious adverse event ~25.9–83.6%.', level: 'vhigh' }
    ],
    notes: 'Total ranges −3 to +11. Applies to adults presenting to the ED within 24 h of syncope; not for syncope from a serious condition already identified in the ED, or after intoxication/seizure/trauma. Serious adverse events include arrhythmia, MI, structural heart disease, PE, hemorrhage, and death. A score ≥ 1 (medium or higher) generally warrants further work-up or monitoring.',
    refs: [
      'Thiruganasambandamoorthy V et al. Development of the Canadian Syncope Risk Score. CMAJ 2016;188:E289-98.',
      'Thiruganasambandamoorthy V et al. Multicenter emergency department validation of the Canadian Syncope Risk Score. JAMA Intern Med 2020;180:737-44.'
    ]
  });

  /* ---------- 2010 Revised Task Force Criteria for ARVC (local checklist) ---------- */
  CARDIO.register({
    id: 'arvc-task-force-2010',
    name: '2010 Task Force Criteria for ARVC',
    category: 'ep',
    short: 'Diagnostic criteria for arrhythmogenic right ventricular cardiomyopathy',
    keywords: ['arvc', 'arvd', 'task force', 'arrhythmogenic', 'right ventricle', 'epsilon wave'],
    kind: 'custom',
    inputs: [
      /* I. Global/regional dysfunction & structural alterations */
      { id: 'img_major', label: 'Imaging — MAJOR', hint: 'Regional RV akinesia/dyskinesia/aneurysm PLUS one of: echo PLAX RVOT ≥ 32 mm (≥ 19 mm/m²) or PSAX RVOT ≥ 36 mm (≥ 21 mm/m²) or FAC ≤ 33%; OR MRI regional akinesia/dyskinesia/dyssynchrony PLUS RV EDV/BSA ≥ 110 (male) / ≥ 100 (female) mL/m² or RVEF ≤ 40%; OR RV angiography regional akinesia/dyskinesia/aneurysm.', type: 'check' },
      { id: 'img_minor', label: 'Imaging — MINOR', hint: 'Regional RV akinesia/dyskinesia PLUS one of: echo PLAX RVOT 29–<32 mm (16–<19 mm/m²) or PSAX RVOT 32–<36 mm (18–<21 mm/m²) or FAC >33%–≤40%; OR MRI RV EDV/BSA 100–<110 (male) / 90–<100 (female) mL/m² or RVEF >40%–≤45%.', type: 'check' },
      /* II. Tissue characterization */
      { id: 'tis_major', label: 'Tissue characterization — MAJOR', hint: 'Residual myocytes < 60% by morphometric analysis (or < 50% if estimated), with fibrous replacement of RV free wall ± fatty replacement on biopsy.', type: 'check' },
      { id: 'tis_minor', label: 'Tissue characterization — MINOR', hint: 'Residual myocytes 60–75% by morphometric analysis (or 50–65% if estimated), with fibrous replacement of RV free wall ± fatty replacement.', type: 'check' },
      /* III. Repolarization abnormalities */
      { id: 'rep_major', label: 'Repolarization — MAJOR', hint: 'Inverted T waves in V1, V2, and V3 (or beyond) in individuals > 14 years, in the absence of complete RBBB (QRS ≥ 120 ms).', type: 'check' },
      { id: 'rep_minor', label: 'Repolarization — MINOR', hint: 'Inverted T waves in V1 and V2 (age > 14, no RBBB) or in V4–V6; OR inverted T waves in V1–V4 in the presence of complete RBBB.', type: 'check' },
      /* IV. Depolarization / conduction abnormalities */
      { id: 'dep_major', label: 'Depolarization — MAJOR', hint: 'Epsilon wave (reproducible low-amplitude signals between end of QRS and onset of T) in the right precordial leads V1–V3.', type: 'check' },
      { id: 'dep_minor', label: 'Depolarization — MINOR', hint: 'Late potentials on SAECG in ≥ 1 of 3 parameters (filtered QRS ≥ 114 ms, low-amplitude signal duration ≥ 38 ms, or terminal 40-ms RMS voltage ≤ 20 µV) OR terminal activation duration of QRS ≥ 55 ms in V1–V3 without complete RBBB.', type: 'check' },
      /* V. Arrhythmias */
      { id: 'arr_major', label: 'Arrhythmias — MAJOR', hint: 'Nonsustained or sustained VT of LBBB morphology with SUPERIOR axis (negative/indeterminate QRS in II, III, aVF and positive in aVL).', type: 'check' },
      { id: 'arr_minor', label: 'Arrhythmias — MINOR', hint: 'Nonsustained/sustained VT of RVOT configuration, LBBB morphology with INFERIOR axis or of unknown axis; OR > 500 ventricular extrasystoles per 24 h on Holter.', type: 'check' },
      /* VI. Family history / genetics */
      { id: 'fam_major', label: 'Family history — MAJOR', hint: 'ARVC confirmed in a first-degree relative meeting current TFC; OR ARVC confirmed pathologically at autopsy/surgery in a first-degree relative; OR identification of a pathogenic/likely-pathogenic ARVC mutation in the patient.', type: 'check' },
      { id: 'fam_minor', label: 'Family history — MINOR', hint: 'History of ARVC in a first-degree relative in whom TFC cannot be confirmed; OR premature sudden death (< 35 y) from suspected ARVC in a first-degree relative; OR ARVC confirmed (by TFC or pathology) in a second-degree relative.', type: 'check' }
    ],
    compute: function (v) {
      var majorIds = ['img_major', 'tis_major', 'rep_major', 'dep_major', 'arr_major', 'fam_major'];
      var minorIds = ['img_minor', 'tis_minor', 'rep_minor', 'dep_minor', 'arr_minor', 'fam_minor'];
      var major = 0, minor = 0;
      majorIds.forEach(function (id) { if (v[id]) major++; });
      minorIds.forEach(function (id) { if (v[id]) minor++; });

      var category, level, badge;
      if (major >= 2 || (major === 1 && minor >= 2) || (major === 0 && minor >= 4)) {
        category = 'DEFINITE ARVC'; level = 'vhigh'; badge = 'Definite';
      } else if ((major === 1 && minor === 1) || (major === 0 && minor === 3)) {
        category = 'BORDERLINE'; level = 'high'; badge = 'Borderline';
      } else if (major === 1 || minor === 2) {
        category = 'POSSIBLE'; level = 'mod'; badge = 'Possible';
      } else {
        category = 'Criteria not met'; level = 'low'; badge = 'Not met';
      }

      return {
        value: major + ' major, ' + minor + ' minor',
        unit: '',
        badge: badge,
        level: level,
        text: category + '. Definite = 2 major, or 1 major + 2 minor, or 4 minor (from different categories). Borderline = 1 major + 1 minor, or 3 minor. Possible = 1 major, or 2 minor.',
        detail: 'Criteria from different categories are counted; within a single category a patient contributes at most one major or one minor criterion to the diagnostic tally. Enter only the highest-level criterion met per category.'
      };
    },
    notes: '2010 Revised Task Force Criteria (Marcus et al.) for arrhythmogenic right ventricular cardiomyopathy, across six categories: (I) global/regional dysfunction & structural alterations, (II) tissue characterization, (III) repolarization, (IV) depolarization/conduction, (V) arrhythmias, (VI) family history/genetics. Each category is scored as its single highest-level finding (major OR minor) — check the one box per category that best applies (see each hint for the exact thresholds). This tool implements the diagnostic classification, not the separate arvcrisk.com model (which estimates ventricular-arrhythmia risk in already-diagnosed patients). Verify against the primary publication before clinical use.',
    refs: [
      'Marcus FI et al. Diagnosis of arrhythmogenic right ventricular cardiomyopathy/dysplasia: proposed modification of the Task Force Criteria. Circulation 2010;121:1533-41 (Eur Heart J 2010;31:806-14).'
    ]
  });

})();
