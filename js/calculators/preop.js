/* Category: preop — Preoperative cardiac assessment for NON-cardiac surgery
 * Each entry follows SCHEMA.md. Point values / coefficients verified against
 * primary publications (Gupta 2011; Caprini 2005; Bilimoria 2013). */
(function () {
  'use strict';

  /* ---------- RCRI (Lee) ---------- */
  CARDIO.register({
    id: 'rcri',
    name: 'RCRI (Revised Cardiac Risk Index)',
    category: 'preop',
    short: 'Risk of major cardiac events after elective noncardiac surgery',
    keywords: ['lee index', 'perioperative', 'noncardiac surgery', 'cardiac risk'],
    inputs: [
      { id: 'surgery', label: 'High-risk surgery', hint: 'Intraperitoneal, intrathoracic, or suprainguinal vascular procedure', type: 'check', points: 1 },
      { id: 'ihd', label: 'History of ischemic heart disease', hint: 'Prior MI, positive stress test, current chest pain attributed to ischemia, nitrate therapy, or pathological Q waves on ECG', type: 'check', points: 1 },
      { id: 'chf', label: 'History of congestive heart failure', hint: 'Pulmonary edema, paroxysmal nocturnal dyspnea, bilateral rales or S3 gallop, or CXR showing pulmonary vascular redistribution', type: 'check', points: 1 },
      { id: 'cvd', label: 'History of cerebrovascular disease', hint: 'Prior stroke or TIA', type: 'check', points: 1 },
      { id: 'insulin', label: 'Diabetes mellitus on insulin therapy', type: 'check', points: 1 },
      { id: 'creat', label: 'Preoperative serum creatinine > 2.0 mg/dL (177 µmol/L)', type: 'check', points: 1 }
    ],
    interpret: [
      { upTo: 0, text: '30-day risk of death, MI, or cardiac arrest ~3.9% (pooled external validation cited by the 2017 CCS guideline). Original Lee cohort: ~0.4% major cardiac complications.', level: 'low' },
      { upTo: 1, text: '30-day risk of death, MI, or cardiac arrest ~6.0% (external validation). Original Lee cohort: ~0.9%.', level: 'mod' },
      { upTo: 2, text: '30-day risk of death, MI, or cardiac arrest ~10.1% (external validation). Original Lee cohort: ~6.6%.', level: 'high' },
      { upTo: 6, text: '30-day risk of death, MI, or cardiac arrest ~15% (external validation). Original Lee cohort: ~11%.', level: 'vhigh' }
    ],
    notes: 'External-validation rates (Duceppe et al. 2017) are higher than the original Lee rates because they capture 30-day death/MI/cardiac arrest with troponin surveillance, whereas Lee counted in-hospital major cardiac complications. The CCS guideline suggests preoperative NT-proBNP/BNP when RCRI ≥ 1, age ≥ 65, or age 45–64 with significant cardiovascular disease.',
    refs: [
      'Lee TH et al. Derivation and prospective validation of a simple index for prediction of cardiac risk of major noncardiac surgery. Circulation 1999;100:1043-9.',
      'Duceppe E et al. Canadian Cardiovascular Society guidelines on perioperative cardiac risk assessment and management for patients who undergo noncardiac surgery. Can J Cardiol 2017;33:17-32.'
    ]
  });

  /* ---------- Gupta MICA (local logistic model) ----------
   * Gupta PK et al. Circulation 2011;124:381-7. Multivariable logistic model
   * from the ACS-NSQIP 2007 dataset (n = 211,410; 1,371 MI/cardiac-arrest events).
   *
   * Risk (%) = 100 · e^x / (1 + e^x)
   *   x = -5.25 + 0.02·age(years) + status + ASA + creatinine + procedure
   *
   * Functional status: independent 0, partially dependent 0.65, totally dependent 1.03
   * ASA class:  I -5.17, II -3.29, III -1.92, IV -0.95, V 0
   * Creatinine: >1.5 mg/dL +0.61, else 0
   * Procedure (22 categories): anorectal -0.16, aortic +1.60, bariatric -0.25,
   *   brain +1.40, breast -1.61, cardiac +1.01, ENT +0.71, foregut/HPB +1.39,
   *   gallbladder/appendix/adrenal/spleen +0.59, hernia (ventral/inguinal/femoral) 0,
   *   intestinal +1.14, neck (thyroid/parathyroid) +0.18, obstetric/gynecologic +0.76,
   *   orthopedic +0.80, other abdominal +1.13, peripheral vascular +0.86, skin +0.54,
   *   spine +0.21, non-esophageal/non-cardiac thoracic +0.40, vein -1.09,
   *   urology +(-0.26) [kidney/urinary].
   *
   * Worked example (matches published nomogram behaviour):
   *   68-year-old, ASA III, partially dependent, creatinine 1.2 (normal), foregut/HPB surgery.
   *   x = -5.25 + 0.02·68 + 0.65 + (-1.92) + 0 + 1.39
   *     = -5.25 + 1.36 + 0.65 - 1.92 + 1.39 = -3.77
   *   Risk = 100·e^-3.77 / (1 + e^-3.77) = 100·0.02307 / 1.02307 ≈ 2.25 %.
   *
   * Sanity example (low risk): 40-year-old, ASA I, independent, normal creatinine, breast.
   *   x = -5.25 + 0.80 + 0 + (-5.17) + 0 + (-1.61) = -11.23 → risk ≈ 0.0013 %.
   */
  CARDIO.register({
    id: 'gupta-mica',
    name: 'Gupta MICA (Perioperative MI / Cardiac Arrest)',
    category: 'preop',
    short: 'Predicted 30-day risk of perioperative myocardial infarction or cardiac arrest',
    keywords: ['mica', 'nsqip', 'perioperative mi', 'cardiac arrest', 'noncardiac surgery'],
    kind: 'custom',
    inputs: [
      { id: 'age', label: 'Age', unit: 'years', type: 'number', min: 0, max: 120, step: 1, placeholder: 'e.g., 68' },
      { id: 'status', label: 'Functional status', type: 'select', options: [
        { label: 'Independent', value: 0 },
        { label: 'Partially dependent', value: 0.65 },
        { label: 'Totally dependent', value: 1.03 }
      ] },
      { id: 'asa', label: 'ASA physical status class', type: 'select', options: [
        { label: 'I — normal healthy patient', value: -5.17 },
        { label: 'II — mild systemic disease', value: -3.29 },
        { label: 'III — severe systemic disease', value: -1.92 },
        { label: 'IV — severe disease, constant threat to life', value: -0.95 },
        { label: 'V — moribund, not expected to survive without surgery', value: 0 }
      ] },
      { id: 'creat', label: 'Preoperative creatinine > 1.5 mg/dL (133 µmol/L)', type: 'check' },
      { id: 'proc', label: 'Type of surgery', type: 'select', options: [
        { label: 'Breast', value: -1.61 },
        { label: 'Vein', value: -1.09 },
        { label: 'Urology / kidney & urinary tract', value: -0.26 },
        { label: 'Bariatric', value: -0.25 },
        { label: 'Anorectal', value: -0.16 },
        { label: 'Hernia (ventral, inguinal, femoral)', value: 0 },
        { label: 'Neck (thyroid / parathyroid)', value: 0.18 },
        { label: 'Spine', value: 0.21 },
        { label: 'Non-esophageal, non-cardiac thoracic', value: 0.40 },
        { label: 'Skin', value: 0.54 },
        { label: 'Gallbladder, appendix, adrenal, spleen', value: 0.59 },
        { label: 'ENT (except thyroid / parathyroid)', value: 0.71 },
        { label: 'Obstetric / gynecologic', value: 0.76 },
        { label: 'Orthopedic (non-spine)', value: 0.80 },
        { label: 'Peripheral vascular (non-aortic, non-vein)', value: 0.86 },
        { label: 'Cardiac', value: 1.01 },
        { label: 'Other abdominal', value: 1.13 },
        { label: 'Intestinal', value: 1.14 },
        { label: 'Foregut / hepato-pancreato-biliary', value: 1.39 },
        { label: 'Brain', value: 1.40 },
        { label: 'Aortic', value: 1.60 }
      ] }
    ],
    compute: function (v) {
      if (v.age === null) return null;
      var age = Math.round(v.age);
      var status = (typeof v.status === 'number') ? v.status : 0;
      var asa = (typeof v.asa === 'number') ? v.asa : -5.17;
      var proc = (typeof v.proc === 'number') ? v.proc : 0;
      var creat = v.creat ? 0.61 : 0;
      var x = -5.25 + 0.02 * age + status + asa + creat + proc;
      var risk = 100 * Math.exp(x) / (1 + Math.exp(x));
      var level, text;
      if (risk < 0.5) {
        level = 'low';
        text = 'Low predicted risk of perioperative MI or cardiac arrest (< 0.5%).';
      } else if (risk < 1) {
        level = 'mod';
        text = 'Intermediate predicted risk (0.5–1%). Consider the RCRI and, where it will change management, biomarkers (BNP/NT-proBNP) or troponin surveillance.';
      } else {
        level = 'high';
        text = 'Elevated predicted risk (≥ 1%). Weigh cardiology input, biomarker/troponin surveillance, and optimization of modifiable factors per guideline.';
      }
      return {
        value: risk.toFixed(2),
        unit: '% (30-day MI / cardiac arrest)',
        text: text,
        level: level,
        detail: 'logit x = -5.25 + 0.02·age + status + ASA + creatinine + procedure = ' + x.toFixed(3) +
          '\nPredicted risk = 100·eˣ/(1+eˣ) = ' + risk.toFixed(2) + '%'
      };
    },
    notes: 'Local implementation of the published Gupta 2011 logistic model (ACS-NSQIP 2007 cohort). risk = 100·eˣ/(1+eˣ), x = -5.25 + 0.02·age + functional-status + ASA + (0.61 if creatinine > 1.5 mg/dL) + procedure coefficient. Often used alongside the RCRI; may underestimate risk because the derivation predated routine troponin surveillance. Reported C-statistic ~0.87. Verify against the primary publication before clinical use.',
    refs: [
      'Gupta PK et al. Development and validation of a risk calculator for prediction of cardiac risk after surgery. Circulation 2011;124:381-7.'
    ]
  });

  /* ---------- ACS NSQIP-style simplified estimator (local approximation) ----------
   * The official universal ACS NSQIP calculator (Bilimoria 2013) is proprietary: it
   * combines ~21 patient variables with the specific CPT procedure code and hierarchical
   * models regularly recalibrated by the ACS. That exact tool cannot be reproduced.
   *
   * This is a LOCAL, SIMPLIFIED, ON-DEVICE estimator built from the publicly published
   * predictor set. It applies illustrative log-odds increments to an approximate baseline
   * 30-day serious-complication rate and is intended for teaching / rough triage only —
   * NOT a substitute for the official calculator's procedure-specific outputs. */
  CARDIO.register({
    id: 'acs-nsqip',
    name: 'ACS NSQIP Surgical Risk Calculator (simplified local estimator)',
    category: 'preop',
    short: 'Approximate 30-day serious-complication risk from published predictors (NOT the proprietary tool)',
    keywords: ['nsqip', 'surgical risk', 'complications', 'american college of surgeons'],
    kind: 'custom',
    inputs: [
      { id: 'age', label: 'Age', unit: 'years', type: 'number', min: 0, max: 120, step: 1, placeholder: 'e.g., 70' },
      { id: 'urgency', label: 'Urgency of procedure', type: 'select', options: [
        { label: 'Elective', value: 0 },
        { label: 'Urgent', value: 0.5 },
        { label: 'Emergency', value: 0.9 }
      ] },
      { id: 'magnitude', label: 'Procedure magnitude', type: 'select', options: [
        { label: 'Minor (e.g., superficial, endoscopic, minor skin/soft tissue)', value: 0 },
        { label: 'Intermediate (e.g., laparoscopic cholecystectomy, hernia, TURP)', value: 0.6 },
        { label: 'Major (e.g., major intra-abdominal, thoracic, vascular, joint arthroplasty)', value: 1.3 }
      ] },
      { id: 'asa', label: 'ASA physical status class', type: 'select', options: [
        { label: 'I — normal healthy', value: 0 },
        { label: 'II — mild systemic disease', value: 0.4 },
        { label: 'III — severe systemic disease', value: 0.9 },
        { label: 'IV — constant threat to life', value: 1.5 },
        { label: 'V — moribund', value: 2.2 }
      ] },
      { id: 'functional', label: 'Functional status', type: 'select', options: [
        { label: 'Independent', value: 0 },
        { label: 'Partially dependent', value: 0.5 },
        { label: 'Totally dependent', value: 1.0 }
      ] },
      { id: 'diabetes', label: 'Diabetes mellitus (oral agents or insulin)', type: 'check' },
      { id: 'htn', label: 'Hypertension requiring medication', type: 'check' },
      { id: 'chf', label: 'Congestive heart failure within 30 days', type: 'check' },
      { id: 'dyspnea', label: 'Dyspnea', type: 'check' },
      { id: 'copd', label: 'Severe COPD', type: 'check' },
      { id: 'dialysis', label: 'Currently on dialysis', type: 'check' },
      { id: 'arf', label: 'Acute renal failure', type: 'check' },
      { id: 'steroid', label: 'Chronic steroid / immunosuppressant use', type: 'check' },
      { id: 'ascites', label: 'Ascites within 30 days', type: 'check' },
      { id: 'sepsis', label: 'Systemic sepsis within 48 h', type: 'check' },
      { id: 'smoker', label: 'Current smoker within 1 year', type: 'check' },
      { id: 'cancer', label: 'Disseminated cancer', type: 'check' }
    ],
    compute: function (v) {
      if (v.age === null) return null;
      // Illustrative baseline ~2% serious complication rate → baseline log-odds.
      var base = -3.9;
      var x = base;
      x += 0.02 * Math.max(0, Math.round(v.age) - 50);        // age increment above 50
      x += (typeof v.urgency === 'number') ? v.urgency : 0;
      x += (typeof v.magnitude === 'number') ? v.magnitude : 0;
      x += (typeof v.asa === 'number') ? v.asa : 0;
      x += (typeof v.functional === 'number') ? v.functional : 0;
      if (v.diabetes) x += 0.3;
      if (v.htn) x += 0.2;
      if (v.chf) x += 0.7;
      if (v.dyspnea) x += 0.4;
      if (v.copd) x += 0.5;
      if (v.dialysis) x += 0.7;
      if (v.arf) x += 0.8;
      if (v.steroid) x += 0.4;
      if (v.ascites) x += 0.7;
      if (v.sepsis) x += 0.8;
      if (v.smoker) x += 0.3;
      if (v.cancer) x += 0.7;
      var risk = 100 * Math.exp(x) / (1 + Math.exp(x));
      var level, text;
      if (risk < 5) {
        level = 'low';
        text = 'Approximate low serious-complication risk (< 5%).';
      } else if (risk < 15) {
        level = 'mod';
        text = 'Approximate intermediate serious-complication risk (5–15%).';
      } else {
        level = 'high';
        text = 'Approximate high serious-complication risk (≥ 15%). Consider multidisciplinary optimization and informed-consent discussion.';
      }
      return {
        value: risk.toFixed(1),
        unit: '% (approx. 30-day serious complication)',
        text: text + ' This is a simplified approximation — use the official ACS NSQIP tool for procedure-specific estimates.',
        level: level,
        badge: 'Simplified estimate',
        detail: 'SIMPLIFIED local estimator (illustrative log-odds), NOT the proprietary ACS NSQIP model.\nlogit ≈ ' + x.toFixed(2) + ' → ' + risk.toFixed(1) + '%'
      };
    },
    notes: 'SIMPLIFIED LOCAL APPROXIMATION of the proprietary universal ACS NSQIP surgical risk calculator (Bilimoria 2013). The official tool uses ~21 variables plus the exact CPT procedure code and hierarchical, regularly-recalibrated models to output procedure-specific rates of death, cardiac complications, pneumonia, VTE, renal failure, readmission, and discharge to nursing facility. This estimator uses only the publicly-published predictor set with illustrative weights and returns a single approximate serious-complication risk; the point weights here are NOT the official coefficients and results will differ from the official calculator. For teaching / rough triage only. Verify against the primary publication before clinical use.',
    refs: [
      'Bilimoria KY et al. Development and evaluation of the universal ACS NSQIP surgical risk calculator: a decision aid and informed consent tool for patients and surgeons. J Am Coll Surg 2013;217:833-42.'
    ]
  });

  /* ---------- DASI ----------
   * 12 weighted items per Hlatky et al. 1989. Weights sum to 58.20 (maximum score).
   * Estimated peak VO2 (mL/kg/min) = 0.43 × DASI + 9.6; METs = VO2 / 3.5.
   * Sanity check: all items checked → DASI 58.20, VO2 34.6 mL/kg/min, ~9.9 METs. */
  CARDIO.register({
    id: 'dasi',
    name: 'DASI (Duke Activity Status Index)',
    category: 'preop',
    short: 'Self-reported functional capacity with estimated peak VO₂ and METs',
    keywords: ['functional capacity', 'mets', 'vo2', 'duke activity'],
    kind: 'custom',
    inputs: [
      { id: 'care', label: 'Take care of yourself (eating, dressing, bathing, using the toilet)', type: 'check', hint: '+2.75' },
      { id: 'walkindoors', label: 'Walk indoors, such as around your house', type: 'check', hint: '+1.75' },
      { id: 'walkblock', label: 'Walk a block or two on level ground', type: 'check', hint: '+2.75' },
      { id: 'stairs', label: 'Climb a flight of stairs or walk up a hill', type: 'check', hint: '+5.50' },
      { id: 'run', label: 'Run a short distance', type: 'check', hint: '+8.00' },
      { id: 'lightwork', label: 'Do light work around the house (dusting, washing dishes)', type: 'check', hint: '+2.70' },
      { id: 'modwork', label: 'Do moderate work around the house (vacuuming, sweeping floors, carrying in groceries)', type: 'check', hint: '+3.50' },
      { id: 'heavywork', label: 'Do heavy work around the house (scrubbing floors, lifting or moving heavy furniture)', type: 'check', hint: '+8.00' },
      { id: 'yardwork', label: 'Do yardwork (raking leaves, weeding, pushing a power mower)', type: 'check', hint: '+4.50' },
      { id: 'sexual', label: 'Have sexual relations', type: 'check', hint: '+5.25' },
      { id: 'modrec', label: 'Participate in moderate recreational activities (golf, bowling, dancing, doubles tennis, throwing a baseball or football)', type: 'check', hint: '+6.00' },
      { id: 'sports', label: 'Participate in strenuous sports (swimming, singles tennis, football, basketball, skiing)', type: 'check', hint: '+7.50' }
    ],
    compute: function (v) {
      var weights = {
        care: 2.75, walkindoors: 1.75, walkblock: 2.75, stairs: 5.50,
        run: 8.00, lightwork: 2.70, modwork: 3.50, heavywork: 8.00,
        yardwork: 4.50, sexual: 5.25, modrec: 6.00, sports: 7.50
      };
      var dasi = 0;
      for (var k in weights) {
        if (Object.prototype.hasOwnProperty.call(weights, k) && v[k]) { dasi += weights[k]; }
      }
      var vo2 = 0.43 * dasi + 9.6;
      var mets = vo2 / 3.5;
      var level, text;
      if (mets < 4) {
        level = 'high';
        text = 'Estimated functional capacity < 4 METs — poor; associated with increased perioperative cardiac risk.';
      } else if (mets < 7) {
        level = 'mod';
        text = 'Estimated functional capacity 4–7 METs — moderate; ≥ 4 METs without symptoms is generally considered adequate for most noncardiac surgery.';
      } else {
        level = 'low';
        text = 'Estimated functional capacity ≥ 7 METs — good.';
      }
      return {
        value: dasi.toFixed(2),
        unit: 'points',
        text: text,
        level: level,
        badge: mets.toFixed(1) + ' METs',
        detail: 'DASI: ' + dasi.toFixed(2) + ' / 58.20\nEstimated peak VO₂ (0.43 × DASI + 9.6): ' + vo2.toFixed(1) + ' mL/kg/min\nEstimated METs (VO₂ / 3.5): ' + mets.toFixed(1)
      };
    },
    notes: 'Structured DASI assessment predicted perioperative outcomes better than subjective clinician estimates in the METS study (Wijeysundera 2018); a DASI < 34 has been proposed as a threshold for elevated risk in its substudies. VO₂ conversion per Hlatky 1989.',
    refs: [
      'Hlatky MA et al. A brief self-administered questionnaire to determine functional capacity (the Duke Activity Status Index). Am J Cardiol 1989;64:651-4.',
      'Wijeysundera DN et al. Assessment of functional capacity before major non-cardiac surgery: an international, prospective cohort study (METS). Lancet 2018;391:2631-40.'
    ]
  });

  /* ---------- Functional capacity (METs) quick reference ---------- */
  CARDIO.register({
    id: 'mets-functional-capacity',
    name: 'Functional Capacity (METs) Quick Reference',
    category: 'preop',
    short: 'Classify self-reported activity level for perioperative assessment (< 4 vs ≥ 4 METs)',
    keywords: ['mets', 'functional capacity', 'exercise tolerance', 'stairs'],
    inputs: [
      { id: 'cls', label: 'Best-matching activity level', type: 'select', hidePoints: true, options: [
        { label: 'Excellent (> 10 METs) — strenuous sports: swimming, singles tennis, football, basketball, skiing', points: 0 },
        { label: 'Good (7–10 METs) — running a short distance, heavy housework (scrubbing floors, moving heavy furniture)', points: 1 },
        { label: 'Moderate (4–6 METs) — climbing a flight of stairs or walking up a hill, walking on level ground at ~4 mph, golf, dancing, doubles tennis', points: 2 },
        { label: 'Poor (< 4 METs) — self-care only, walking indoors, walking 1–2 blocks slowly, light housework (dusting, dishes)', points: 3 }
      ] }
    ],
    result: { unit: '' },
    interpret: [
      { upTo: 0, text: 'Excellent functional capacity (> 10 METs). Perioperative cardiac risk is low; further cardiac testing is rarely indicated.', level: 'low' },
      { upTo: 1, text: 'Good functional capacity (7–10 METs). Generally proceed to surgery without additional cardiac testing.', level: 'low' },
      { upTo: 2, text: 'Moderate functional capacity (4–6 METs). ≥ 4 METs without symptoms is generally adequate to proceed without further testing per ACC/AHA guidance.', level: 'mod' },
      { upTo: 3, text: 'Poor functional capacity (< 4 METs). Elevated perioperative risk — consider further evaluation (e.g., biomarkers, stress testing) only if it will change management.', level: 'high' }
    ],
    notes: 'The displayed number is an internal index (0–3), not a point score — read the class from the interpretation. Activity examples follow the ACC/AHA perioperative guideline and the Duke Activity Status Index. Subjective MET estimates are unreliable (METS study); prefer the structured DASI when feasible.',
    refs: [
      'Fleisher LA et al. 2014 ACC/AHA guideline on perioperative cardiovascular evaluation and management of patients undergoing noncardiac surgery. J Am Coll Cardiol 2014;64:e77-137.',
      'Hlatky MA et al. Am J Cardiol 1989;64:651-4.',
      'Wijeysundera DN et al. Lancet 2018;391:2631-40.'
    ]
  });

  /* ---------- Caprini Score (VTE Risk), 2005 version — local points ----------
   * Caprini JA. Dis Mon 2005. Weighted risk-assessment model; each item 1, 2, 3, or 5
   * points. Age and one surgery-magnitude item are the mutually-exclusive selects; all
   * other factors are additive checkboxes. Risk categories: 0 very low, 1–2 low,
   * 3–4 moderate, ≥5 high. */
  CARDIO.register({
    id: 'caprini-vte',
    name: 'Caprini Score (VTE Risk)',
    category: 'preop',
    short: 'Venous thromboembolism risk stratification for surgical patients (2005 model)',
    keywords: ['vte', 'dvt', 'pe', 'thromboprophylaxis', 'caprini'],
    inputs: [
      { id: 'age', label: 'Age', type: 'select', options: [
        { label: '≤ 40 years', points: 0 },
        { label: '41–60 years', points: 1 },
        { label: '61–74 years', points: 2 },
        { label: '≥ 75 years', points: 3 }
      ] },
      { id: 'surgtype', label: 'Surgery type', type: 'select', options: [
        { label: 'None / minor procedure', points: 0 },
        { label: 'Minor surgery', points: 1 },
        { label: 'Major surgery (> 45 min) / laparoscopic (> 45 min) / arthroscopic', points: 2 },
        { label: 'Elective major lower-extremity arthroplasty', points: 5 }
      ] },
      /* 1-point factors */
      { id: 'bmi25', label: 'BMI > 25 kg/m²', type: 'check', points: 1 },
      { id: 'swollen', label: 'Swollen legs (current)', type: 'check', points: 1 },
      { id: 'varicose', label: 'Varicose veins', type: 'check', points: 1 },
      { id: 'sepsis1mo', label: 'Sepsis (< 1 month)', type: 'check', points: 1 },
      { id: 'lung1mo', label: 'Serious lung disease incl. pneumonia (< 1 month)', type: 'check', points: 1 },
      { id: 'pft', label: 'Abnormal pulmonary function (COPD)', type: 'check', points: 1 },
      { id: 'mi', label: 'Acute myocardial infarction', type: 'check', points: 1 },
      { id: 'chf1mo', label: 'Congestive heart failure (< 1 month)', type: 'check', points: 1 },
      { id: 'bedrest', label: 'Medical patient currently on bed rest', type: 'check', points: 1 },
      { id: 'ibd', label: 'History of inflammatory bowel disease', type: 'check', points: 1 },
      { id: 'majorsurg1mo', label: 'History of major surgery (< 1 month)', type: 'check', points: 1 },
      { id: 'ocp', label: 'Oral contraceptives or hormone replacement therapy', type: 'check', points: 1 },
      { id: 'pregnancy', label: 'Pregnancy or postpartum (< 1 month)', type: 'check', points: 1 },
      { id: 'abortion', label: 'History of unexplained or recurrent spontaneous abortion', type: 'check', points: 1 },
      /* 2-point factors */
      { id: 'malignancy', label: 'Malignancy (present or previous)', type: 'check', points: 2 },
      { id: 'bedrest72', label: 'Confined to bed > 72 hours', type: 'check', points: 2 },
      { id: 'cast', label: 'Immobilizing plaster cast (< 1 month)', type: 'check', points: 2 },
      { id: 'cvc', label: 'Central venous access', type: 'check', points: 2 },
      /* 3-point factors */
      { id: 'priorvte', label: 'History of DVT / PE', type: 'check', points: 3 },
      { id: 'famhx', label: 'Family history of thrombosis', type: 'check', points: 3 },
      { id: 'flv', label: 'Factor V Leiden', type: 'check', points: 3 },
      { id: 'prothrombin', label: 'Prothrombin 20210A mutation', type: 'check', points: 3 },
      { id: 'lupus', label: 'Lupus anticoagulant', type: 'check', points: 3 },
      { id: 'acla', label: 'Elevated anticardiolipin antibodies', type: 'check', points: 3 },
      { id: 'homocysteine', label: 'Elevated serum homocysteine', type: 'check', points: 3 },
      { id: 'hit', label: 'Heparin-induced thrombocytopenia (HIT)', type: 'check', points: 3 },
      { id: 'thrombophilia', label: 'Other congenital or acquired thrombophilia', type: 'check', points: 3 },
      /* 5-point factors */
      { id: 'stroke', label: 'Stroke (< 1 month)', type: 'check', points: 5 },
      { id: 'fracture', label: 'Hip, pelvis, or leg fracture (< 1 month)', type: 'check', points: 5 },
      { id: 'sci', label: 'Acute spinal cord injury / paralysis (< 1 month)', type: 'check', points: 5 },
      { id: 'trauma', label: 'Multiple trauma (< 1 month)', type: 'check', points: 5 }
    ],
    interpret: [
      { upTo: 0, text: 'Very low risk. Estimated baseline VTE risk ~0.5%. Early ambulation; pharmacologic prophylaxis generally not required.', level: 'low' },
      { upTo: 2, text: 'Low risk. Estimated VTE risk ~1.5%. Mechanical prophylaxis (e.g., intermittent pneumatic compression) is generally suggested.', level: 'low' },
      { upTo: 4, text: 'Moderate risk. Estimated VTE risk ~3%. Pharmacologic OR mechanical prophylaxis; pharmacologic prophylaxis suggested if bleeding risk is acceptable.', level: 'mod' },
      { upTo: 90, text: 'High risk (≥ 5). Estimated VTE risk ~6% or higher without prophylaxis. Pharmacologic prophylaxis (± mechanical) recommended; consider extended-duration prophylaxis after discharge in selected patients.', level: 'high' }
    ],
    notes: 'Caprini 2005 weighted model, enumerated locally: 1-, 2-, 3-, and 5-point factors. Age and surgery-type are mutually-exclusive selects; all other items are additive. Categories: 0 very low, 1–2 low, 3–4 moderate, ≥5 high (ACCP/Chest 2012 stratification). Percentage estimates are approximate and cohort-dependent. Select the single best age band and surgery-type band; do not double-count minor-vs-major surgery. Verify against the primary publication before clinical use.',
    refs: [
      'Caprini JA. Thrombosis risk assessment as a guide to quality patient care. Dis Mon 2005;51:70-8.',
      'Gould MK et al. Prevention of VTE in nonorthopedic surgical patients: ACCP evidence-based clinical practice guidelines (9th ed). Chest 2012;141(2 Suppl):e227S-77S.'
    ]
  });

})();
