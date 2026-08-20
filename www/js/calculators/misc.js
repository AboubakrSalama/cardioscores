/* Category: misc — General bedside tools used in cardiology
 * Each entry follows SCHEMA.md. Formulas/thresholds verified against primary
 * publications. Anything not certain is registered kind:'external' or omitted. */
(function () {
  'use strict';

  /* ---------- Cockcroft-Gault creatinine clearance (custom) ---------- */
  CARDIO.register({
    id: 'cockcroft-gault',
    name: 'Cockcroft-Gault Creatinine Clearance',
    category: 'misc',
    short: 'Estimated creatinine clearance for drug (incl. DOAC) dosing',
    keywords: ['cockcroft', 'gault', 'crcl', 'creatinine clearance', 'renal', 'doac', 'kidney'],
    kind: 'custom',
    inputs: [
      { id: 'age', label: 'Age', type: 'number', unit: 'years', min: 18, max: 120, step: 1, placeholder: 'e.g., 72' },
      { id: 'weight', label: 'Body weight', type: 'number', unit: 'kg', units: [{ label: 'kg', factor: 1, system: 'si' }, { label: 'lb', factor: 0.45359237, system: 'us' }], min: 20, max: 250, step: 0.5, placeholder: 'e.g., 80' },
      { id: 'scr', label: 'Serum creatinine', type: 'number', unit: 'mg/dL', units: [{ label: 'mg/dL', factor: 1, system: 'us' }, { label: 'µmol/L', factor: 0.011312, system: 'si' }], min: 0.2, max: 15, step: 0.1, placeholder: 'e.g., 1.1', hint: 'SI: divide µmol/L by 88.4' },
      { id: 'sex', label: 'Sex', type: 'select', options: [
        { label: 'Male', value: 'male', points: 0 },
        { label: 'Female', value: 'female', points: 0 }
      ] }
    ],
    compute: function (v) {
      var age = v.age, wt = v.weight, scr = v.scr;
      if (age == null || wt == null || scr == null) return null;
      if (scr <= 0 || age <= 0 || wt <= 0) return null;
      var female = v.sex === 'female';
      var crcl = (140 - age) * wt * (female ? 0.85 : 1) / (72 * scr);
      if (crcl < 0) crcl = 0;

      var level, text;
      if (crcl >= 90) { level = 'low'; text = 'Estimated CrCl ' + crcl.toFixed(0) + ' mL/min — normal range.'; }
      else if (crcl >= 60) { level = 'low'; text = 'Estimated CrCl ' + crcl.toFixed(0) + ' mL/min — mildly reduced.'; }
      else if (crcl >= 30) { level = 'mod'; text = 'Estimated CrCl ' + crcl.toFixed(0) + ' mL/min — moderately reduced; check for dose adjustments.'; }
      else if (crcl >= 15) { level = 'high'; text = 'Estimated CrCl ' + crcl.toFixed(0) + ' mL/min — severely reduced; many agents need dose reduction or avoidance.'; }
      else { level = 'vhigh'; text = 'Estimated CrCl ' + crcl.toFixed(0) + ' mL/min — kidney failure range.'; }

      return {
        value: crcl.toFixed(0), unit: 'mL/min', text: text, level: level,
        detail: 'Cockcroft-Gault: (140 − age) × weight(kg) × (0.85 if female) / (72 × Scr).\n' +
          'DOAC dosing pivots on this estimate (not eGFR): e.g., dabigatran avoid if CrCl < 30; rivaroxaban reduce/avoid at low CrCl; apixaban criteria include CrCl; edoxaban not recommended if CrCl > 95 or < 15. Confirm each drug label.'
      };
    },
    notes: 'Cockcroft-Gault estimates creatinine clearance and is the method used in most anticoagulant (DOAC) and renally-cleared drug dosing trials — prefer it over CKD-EPI eGFR for dose decisions. Actual body weight overestimates clearance in obesity; ideal or adjusted body weight is often used when BMI is high, and estimates are unreliable at extremes of muscle mass or unstable/rapidly changing creatinine.',
    refs: [
      'Cockcroft DW, Gault MH. Prediction of creatinine clearance from serum creatinine. Nephron 1976;16:31-41.'
    ]
  });

  /* ---------- Body surface area (custom) ---------- */
  CARDIO.register({
    id: 'bsa',
    name: 'Body Surface Area',
    category: 'misc',
    short: 'BSA by Mosteller (headline) and Du Bois',
    keywords: ['bsa', 'mosteller', 'du bois', 'dubois', 'surface area', 'indexing'],
    kind: 'custom',
    inputs: [
      { id: 'height', label: 'Height', type: 'number', unit: 'cm', units: [{ label: 'cm', factor: 1, system: 'si' }, { label: 'in', factor: 2.54, system: 'us' }], min: 50, max: 250, step: 0.5, placeholder: 'e.g., 175' },
      { id: 'weight', label: 'Weight', type: 'number', unit: 'kg', units: [{ label: 'kg', factor: 1, system: 'si' }, { label: 'lb', factor: 0.45359237, system: 'us' }], min: 2, max: 300, step: 0.1, placeholder: 'e.g., 80' }
    ],
    compute: function (v) {
      var h = v.height, w = v.weight;
      if (h == null || w == null) return null;
      if (h <= 0 || w <= 0) return null;
      var mosteller = Math.sqrt(h * w / 3600);
      var dubois = 0.007184 * Math.pow(h, 0.725) * Math.pow(w, 0.425);
      return {
        value: mosteller.toFixed(2), unit: 'm²', level: 'info',
        text: 'Mosteller BSA ' + mosteller.toFixed(2) + ' m². Used to index cardiac output, valve area, LV mass, etc.',
        detail: 'Mosteller: √(height[cm] × weight[kg] / 3600) = ' + mosteller.toFixed(2) + ' m²\n' +
          'Du Bois: 0.007184 × height[cm]^0.725 × weight[kg]^0.425 = ' + dubois.toFixed(2) + ' m²'
      };
    },
    notes: 'Mosteller is simplest and most widely used; Du Bois is the classic formula but tends to underestimate BSA in obesity. Both agree closely for average adults.',
    refs: [
      'Mosteller RD. Simplified calculation of body-surface area. N Engl J Med 1987;317:1098.',
      'Du Bois D, Du Bois EF. A formula to estimate the approximate surface area if height and weight be known. Arch Intern Med 1916;17:863-71.'
    ]
  });

  /* ---------- Body mass index (custom) ---------- */
  CARDIO.register({
    id: 'bmi',
    name: 'Body Mass Index',
    category: 'misc',
    short: 'BMI with WHO weight classification',
    keywords: ['bmi', 'body mass index', 'obesity', 'who class', 'overweight'],
    kind: 'custom',
    inputs: [
      { id: 'height', label: 'Height', type: 'number', unit: 'cm', units: [{ label: 'cm', factor: 1, system: 'si' }, { label: 'in', factor: 2.54, system: 'us' }], min: 50, max: 250, step: 0.5, placeholder: 'e.g., 175' },
      { id: 'weight', label: 'Weight', type: 'number', unit: 'kg', units: [{ label: 'kg', factor: 1, system: 'si' }, { label: 'lb', factor: 0.45359237, system: 'us' }], min: 2, max: 400, step: 0.1, placeholder: 'e.g., 80' }
    ],
    compute: function (v) {
      var h = v.height, w = v.weight;
      if (h == null || w == null) return null;
      if (h <= 0 || w <= 0) return null;
      var m = h / 100;
      var bmi = w / (m * m);

      var level, text;
      if (bmi < 18.5) { level = 'mod'; text = 'Underweight (< 18.5 kg/m²).'; }
      else if (bmi < 25) { level = 'low'; text = 'Normal weight (18.5–24.9 kg/m²).'; }
      else if (bmi < 30) { level = 'mod'; text = 'Overweight (25.0–29.9 kg/m²).'; }
      else if (bmi < 35) { level = 'high'; text = 'Obesity class I (30.0–34.9 kg/m²).'; }
      else if (bmi < 40) { level = 'high'; text = 'Obesity class II (35.0–39.9 kg/m²).'; }
      else { level = 'vhigh'; text = 'Obesity class III (≥ 40 kg/m²).'; }

      return {
        value: bmi.toFixed(1), unit: 'kg/m²', text: text, level: level,
        detail: 'BMI = weight[kg] / height[m]². WHO classes: < 18.5 underweight, 18.5–24.9 normal, 25–29.9 overweight, ≥ 30 obese (I 30–34.9, II 35–39.9, III ≥ 40).'
      };
    },
    notes: 'WHO cut-offs shown are for adults; lower thresholds (overweight ≥ 23, obese ≥ 27.5) are suggested for some Asian populations. BMI does not distinguish fat from lean mass and can mislead in athletes, the elderly, or with fluid overload.',
    refs: [
      'World Health Organization. Obesity: preventing and managing the global epidemic. WHO Technical Report Series 894. Geneva: WHO; 2000.'
    ]
  });

  /* ---------- Mean arterial pressure (custom) ---------- */
  CARDIO.register({
    id: 'map',
    name: 'Mean Arterial Pressure',
    category: 'misc',
    short: 'MAP from systolic and diastolic blood pressure',
    keywords: ['map', 'mean arterial pressure', 'perfusion', 'shock', 'blood pressure'],
    kind: 'custom',
    inputs: [
      { id: 'sbp', label: 'Systolic blood pressure', type: 'number', unit: 'mmHg', min: 40, max: 300, step: 1, placeholder: 'e.g., 120' },
      { id: 'dbp', label: 'Diastolic blood pressure', type: 'number', unit: 'mmHg', min: 20, max: 200, step: 1, placeholder: 'e.g., 80' }
    ],
    compute: function (v) {
      var sbp = v.sbp, dbp = v.dbp;
      if (sbp == null || dbp == null) return null;
      var map = dbp + (sbp - dbp) / 3;

      var level, text;
      if (map < 60) { level = 'high'; text = 'MAP ' + map.toFixed(0) + ' mmHg — below the ~60 mmHg often needed for organ perfusion.'; }
      else if (map < 65) { level = 'mod'; text = 'MAP ' + map.toFixed(0) + ' mmHg — below the usual ≥ 65 mmHg resuscitation target.'; }
      else { level = 'low'; text = 'MAP ' + map.toFixed(0) + ' mmHg — at or above the common ≥ 65 mmHg target.'; }

      return {
        value: map.toFixed(0), unit: 'mmHg', text: text, level: level,
        detail: 'MAP ≈ DBP + (SBP − DBP) / 3 (a diastole-weighted approximation valid at normal heart rates).\nA MAP ≥ 65 mmHg is a common initial hemodynamic target in shock resuscitation.'
      };
    },
    notes: 'The 1/3–2/3 estimate assumes a normal heart rate; at high heart rates diastole shortens and the formula under-reads true MAP. Invasive arterial monitoring measures MAP directly.',
    refs: [
      'Evans L, Rhodes A, Alhazzani W, et al. Surviving Sepsis Campaign: International Guidelines 2021. Crit Care Med 2021;49:e1063-e1143.'
    ]
  });

  /* ---------- Shock index (custom) ---------- */
  CARDIO.register({
    id: 'shock-index',
    name: 'Shock Index',
    category: 'misc',
    short: 'Heart rate divided by systolic blood pressure',
    keywords: ['shock index', 'hemodynamic', 'sepsis', 'hemorrhage', 'triage'],
    kind: 'custom',
    inputs: [
      { id: 'hr', label: 'Heart rate', type: 'number', unit: 'bpm', min: 20, max: 300, step: 1, placeholder: 'e.g., 110' },
      { id: 'sbp', label: 'Systolic blood pressure', type: 'number', unit: 'mmHg', min: 40, max: 300, step: 1, placeholder: 'e.g., 100' }
    ],
    compute: function (v) {
      var hr = v.hr, sbp = v.sbp;
      if (hr == null || sbp == null) return null;
      if (sbp <= 0 || hr <= 0) return null;
      var si = hr / sbp;

      var level, text;
      if (si < 0.5) { level = 'low'; text = 'Shock index ' + si.toFixed(2) + ' — below the normal range (0.5–0.7); recheck values.'; }
      else if (si <= 0.7) { level = 'low'; text = 'Shock index ' + si.toFixed(2) + ' — normal (0.5–0.7).'; }
      else if (si < 0.9) { level = 'mod'; text = 'Shock index ' + si.toFixed(2) + ' — borderline elevated.'; }
      else { level = 'high'; text = 'Shock index ' + si.toFixed(2) + ' — elevated (≥ 0.9); associated with occult hypoperfusion and worse outcomes.'; }

      return {
        value: si.toFixed(2), unit: '', text: text, level: level,
        detail: 'Shock index = heart rate / systolic BP. Normal 0.5–0.7; ≥ 0.9 has been linked to increased need for transfusion/critical care and higher mortality in trauma, sepsis and post-partum hemorrhage.'
      };
    },
    notes: 'A simple adjunct that can flag compensated shock before overt hypotension. Blunted by beta-blockade, pacing and chronotropic incompetence, and unreliable in atrial fibrillation. Age-adjusted and modified shock indices exist for specific settings.',
    refs: [
      'Allgöwer M, Burri C. Schockindex. Dtsch Med Wochenschr 1967;92:1947-50.',
      'Rady MY, Nightingale P, Little RA, Edwards JD. Am J Emerg Med 1992;10:538-42.'
    ]
  });

  /* ---------- Jones criteria for acute rheumatic fever, 2015 revision (custom) ---------- */
  CARDIO.register({
    id: 'jones-arf',
    name: 'Jones Criteria (acute rheumatic fever, 2015)',
    category: 'misc',
    short: 'Diagnosis of a first episode of ARF (low-risk population criteria)',
    keywords: ['jones', 'rheumatic fever', 'arf', 'strep', 'carditis', 'chorea'],
    kind: 'custom',
    inputs: [
      { id: 'gas', label: 'Evidence of preceding group A streptococcal infection', type: 'check', hint: 'Elevated or rising ASO / anti-DNase B, or positive throat culture or rapid antigen test' },
      { id: 'major_carditis', label: 'Major — carditis (clinical and/or subclinical)', type: 'check' },
      { id: 'major_arthritis', label: 'Major — polyarthritis', type: 'check', hint: 'Low-risk populations: polyarthritis only' },
      { id: 'major_chorea', label: 'Major — chorea (Sydenham)', type: 'check' },
      { id: 'major_em', label: 'Major — erythema marginatum', type: 'check' },
      { id: 'major_nodules', label: 'Major — subcutaneous nodules', type: 'check' },
      { id: 'minor_arthralgia', label: 'Minor — polyarthralgia', type: 'check' },
      { id: 'minor_fever', label: 'Minor — fever ≥ 38.5°C', type: 'check' },
      { id: 'minor_acute', label: 'Minor — ESR ≥ 60 mm/h and/or CRP ≥ 3.0 mg/dL', type: 'check' },
      { id: 'minor_pr', label: 'Minor — prolonged PR interval', type: 'check', hint: 'Only counts if carditis is not a major criterion' }
    ],
    compute: function (v) {
      var major = (v.major_carditis ? 1 : 0) + (v.major_arthritis ? 1 : 0) + (v.major_chorea ? 1 : 0)
        + (v.major_em ? 1 : 0) + (v.major_nodules ? 1 : 0);
      var minor = (v.minor_arthralgia ? 1 : 0) + (v.minor_fever ? 1 : 0) + (v.minor_acute ? 1 : 0) + (v.minor_pr ? 1 : 0);
      var gas = !!v.gas;
      var met = (major >= 2) || (major >= 1 && minor >= 2);

      var cls, level, text;
      if (met && gas) {
        cls = 'Criteria met'; level = 'high';
        text = 'Meets 2015 Jones criteria for a first episode of ARF (2 major, or 1 major + 2 minor, with evidence of preceding GAS infection).';
      } else if (met && !gas) {
        cls = 'Major/minor met, GAS evidence needed'; level = 'mod';
        text = 'Major/minor combination is satisfied but evidence of preceding group A strep is required (exceptions: chorea and indolent carditis may be diagnosed without it).';
      } else {
        cls = 'Not met'; level = 'low';
        text = 'Does not meet the criteria for a first ARF episode.';
      }

      return {
        value: cls, unit: '', text: text, level: level,
        badge: major + ' major, ' + minor + ' minor',
        detail: 'Initial ARF (low-risk): 2 major OR 1 major + 2 minor, PLUS evidence of preceding GAS infection.\nRecurrent ARF additionally allows 3 minor criteria.'
      };
    },
    notes: 'Uses the 2015 AHA revision, LOW-RISK population definitions. For moderate/high-risk populations the thresholds relax: monoarthritis or polyarthralgia can count as a major criterion; minor fever is ≥ 38°C, minor ESR is ≥ 30 mm/h, and monoarthralgia counts as a minor criterion. All-population change from prior versions: subclinical carditis (echocardiographic valvulitis) qualifies as major carditis.',
    refs: [
      'Gewitz MH, Baltimore RS, Tani LY, et al. Revision of the Jones Criteria for the diagnosis of acute rheumatic fever in the era of Doppler echocardiography. Circulation 2015;131:1806-18.'
    ]
  });

  /* ---------- Kawasaki disease classic criteria (custom) ---------- */
  CARDIO.register({
    id: 'kawasaki-classic',
    name: 'Kawasaki Disease (classic criteria)',
    category: 'misc',
    short: 'Classic Kawasaki disease: fever ≥ 5 days plus principal features',
    keywords: ['kawasaki', 'mucocutaneous', 'coronary aneurysm', 'pediatric', 'vasculitis'],
    kind: 'custom',
    inputs: [
      { id: 'fever', label: 'Fever for ≥ 5 days', type: 'check' },
      { id: 'conj', label: 'Bilateral bulbar conjunctival injection (nonexudative)', type: 'check' },
      { id: 'oral', label: 'Oral mucosal changes (cracked/red lips, strawberry tongue, mucosal erythema)', type: 'check' },
      { id: 'extremity', label: 'Extremity changes (erythema/edema acutely; periungual desquamation later)', type: 'check' },
      { id: 'rash', label: 'Polymorphous rash', type: 'check' },
      { id: 'lymph', label: 'Cervical lymphadenopathy (≥ 1.5 cm, usually unilateral)', type: 'check' }
    ],
    compute: function (v) {
      var features = (v.conj ? 1 : 0) + (v.oral ? 1 : 0) + (v.extremity ? 1 : 0) + (v.rash ? 1 : 0) + (v.lymph ? 1 : 0);
      var fever = !!v.fever;

      var cls, level, text;
      if (fever && features >= 4) {
        cls = 'Classic KD'; level = 'high';
        text = 'Meets criteria for classic (complete) Kawasaki disease: fever ≥ 5 days plus ≥ 4 of 5 principal features. Obtain echocardiography.';
      } else if (fever && features >= 2) {
        cls = 'Consider incomplete KD'; level = 'mod';
        text = 'Fever with ' + features + ' principal feature(s). Consider the incomplete KD pathway (supportive labs and echocardiography), especially in infants.';
      } else {
        cls = 'Criteria not met'; level = 'low';
        text = 'Does not meet the classic criteria.';
      }

      return {
        value: cls, unit: '', text: text, level: level,
        badge: features + '/5 features',
        detail: 'Classic KD = fever ≥ 5 days + ≥ 4 of 5 principal features (conjunctivae, oral mucosa, extremities, rash, cervical node). Experienced clinicians may diagnose on day 4 when ≥ 4 features are present. An incomplete-KD algorithm (prolonged fever + 2–3 features + supportive labs/echo findings) exists and is important because coronary aneurysms occur without full criteria.'
      };
    },
    notes: 'Principal clinical features are often not all present simultaneously and may appear sequentially. Incomplete (atypical) KD is common in infants < 6 months and warrants a lower threshold for echocardiography and treatment. This tool covers the classic diagnostic criteria only.',
    refs: [
      'McCrindle BW, Rowley AH, Newburger JW, et al. Diagnosis, Treatment, and Long-Term Management of Kawasaki Disease: AHA Scientific Statement. Circulation 2017;135:e927-e999.'
    ]
  });

})();
