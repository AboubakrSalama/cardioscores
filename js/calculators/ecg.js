/* Category: ecg — Electrocardiography interpretation aids
 * Each entry follows SCHEMA.md. Formulas and point values verified against primary
 * publications. Anything not certain is registered kind:'external' or omitted. */
(function () {
  'use strict';

  /* ---------- QTc (Bazett / Fridericia / Framingham / Hodges) ---------- */
  CARDIO.register({
    id: 'qtc',
    name: 'QTc (corrected QT interval)',
    category: 'ecg',
    short: 'Heart-rate–corrected QT by four published formulas',
    keywords: ['qt', 'qtc', 'bazett', 'fridericia', 'framingham', 'hodges', 'torsades', 'long qt'],
    kind: 'custom',
    inputs: [
      { id: 'qt', label: 'Measured QT interval', type: 'number', unit: 'ms', min: 200, max: 800, step: 1, placeholder: 'e.g., 400' },
      { id: 'hr', label: 'Heart rate', type: 'number', unit: 'bpm', min: 20, max: 300, step: 1, placeholder: 'e.g., 70' },
      { id: 'sex', label: 'Sex', type: 'select', options: [
        { label: 'Male', value: 'male', points: 0 },
        { label: 'Female', value: 'female', points: 0 }
      ] }
    ],
    compute: function (v) {
      var qt = v.qt, hr = v.hr, sex = v.sex;
      if (qt == null || hr == null || hr <= 0) return null;
      var rr = 60 / hr; // RR interval in seconds
      var bazett = qt / Math.sqrt(rr);
      var frid = qt / Math.pow(rr, 1 / 3);
      var fram = qt + 154 * (1 - rr);
      var hodges = qt + 1.75 * (hr - 60);
      var b = Math.round(bazett);

      var female = sex === 'female';
      var normalMax = female ? 450 : 430;
      var proThresh = female ? 470 : 450;
      var who = female ? 'woman' : 'man';

      var text, level, badge;
      if (b >= 500) {
        text = 'Bazett QTc ' + b + ' ms — markedly prolonged (≥ 500 ms): high risk of torsades de pointes.';
        level = 'vhigh';
        badge = 'High risk';
      } else if (b > proThresh) {
        text = 'Bazett QTc ' + b + ' ms — prolonged for a ' + who + ' (> ' + proThresh + ' ms).';
        level = 'high';
        badge = 'Prolonged';
      } else if (b > normalMax) {
        text = 'Bazett QTc ' + b + ' ms — borderline for a ' + who + ' (' + (normalMax + 1) + '–' + proThresh + ' ms).';
        level = 'mod';
        badge = 'Borderline';
      } else {
        text = 'Bazett QTc ' + b + ' ms — normal for a ' + who + ' (≤ ' + normalMax + ' ms).';
        level = 'low';
        badge = 'Normal';
      }

      var detail =
        'Bazett (QT/√RR): ' + Math.round(bazett) + ' ms\n' +
        'Fridericia (QT/RR^⅓): ' + Math.round(frid) + ' ms\n' +
        'Framingham (QT + 154·(1−RR)): ' + Math.round(fram) + ' ms\n' +
        'Hodges (QT + 1.75·(HR−60)): ' + Math.round(hodges) + ' ms\n' +
        'RR interval ' + rr.toFixed(2) + ' s at ' + Math.round(hr) + ' bpm';

      return { value: String(b), unit: 'ms', text: text, level: level, detail: detail, badge: badge };
    },
    notes: 'Headline value is Bazett QTc. Bazett over-corrects at high heart rates and under-corrects at low rates; Fridericia or Framingham are preferred outside 60–100 bpm. Sex-specific normal/borderline/prolonged cutoffs (men 430/450, women 450/470 ms) follow the AHA/ACCF/HRS 2009 statement; QTc ≥ 500 ms flags markedly increased torsades risk. Measure QT in the lead with the longest interval and avoid U-wave contamination.',
    refs: [
      'Bazett HC. Heart. 1920;7:353-370.',
      'Fridericia LS. Acta Med Scand. 1920;53:469-486.',
      'Sagie A, Larson MG, Goldberg RJ, et al. Am J Cardiol. 1992;70:797-801.',
      'Hodges M, Salerno D, Erlien D. J Am Coll Cardiol. 1983;1:694 (abstr).',
      'Rautaharju PM, Surawicz B, Gettes LS, et al. AHA/ACCF/HRS. Circulation. 2009;119:e241-e250.'
    ]
  });

  /* ---------- LVH — Sokolow-Lyon voltage criteria ---------- */
  CARDIO.register({
    id: 'lvh-sokolow-lyon',
    name: 'LVH — Sokolow-Lyon voltage',
    category: 'ecg',
    short: 'ECG voltage criteria for left ventricular hypertrophy',
    keywords: ['lvh', 'hypertrophy', 'sokolow', 'lyon', 'voltage'],
    kind: 'custom',
    inputs: [
      { id: 'sv1', label: 'S wave depth in V1', type: 'number', unit: 'mm', min: 0, max: 60, step: 1, placeholder: 'e.g., 15' },
      { id: 'rv5', label: 'R wave height in V5', type: 'number', unit: 'mm', min: 0, max: 60, step: 1, placeholder: 'e.g., 22' },
      { id: 'rv6', label: 'R wave height in V6', type: 'number', unit: 'mm', min: 0, max: 60, step: 1, placeholder: 'optional' },
      { id: 'ravl', label: 'R wave height in aVL', type: 'number', unit: 'mm', min: 0, max: 40, step: 1, placeholder: 'optional' }
    ],
    compute: function (v) {
      var sv1 = v.sv1, rv5 = v.rv5, rv6 = v.rv6, ravl = v.ravl;
      var haveIndex = sv1 != null && (rv5 != null || rv6 != null);
      if (!haveIndex && ravl == null) return null; // nothing usable entered

      var rMax = Math.max(rv5 == null ? 0 : rv5, rv6 == null ? 0 : rv6);
      var idx = haveIndex ? (sv1 + rMax) : null;
      var precordialPos = idx != null && idx >= 35;
      var avlPos = ravl != null && ravl >= 11;
      var pos = precordialPos || avlPos;

      var detail =
        'S V1 + R (V5/V6): ' + (idx != null ? idx + ' mm' : '—') + ' (criterion ≥ 35 mm)\n' +
        'R aVL: ' + (ravl != null ? ravl + ' mm' : '—') + ' (criterion ≥ 11 mm)';

      var text = pos
        ? 'Meets Sokolow-Lyon voltage criteria for LVH. Sensitive to age/body habitus — low sensitivity, moderate specificity; correlate clinically.'
        : 'Does not meet Sokolow-Lyon voltage criteria. Normal voltage does not exclude LVH.';

      return { value: pos ? 'Positive' : 'Negative', unit: '', text: text, level: pos ? 'high' : 'low', detail: detail };
    },
    notes: 'Voltage criteria are affected by age, sex, body habitus and lead placement; sensitivity is low. Not applicable in the presence of left bundle branch block.',
    refs: ['Sokolow M, Lyon TP. Am Heart J. 1949;37:161-186.']
  });

  /* ---------- LVH — Cornell voltage criteria ---------- */
  CARDIO.register({
    id: 'lvh-cornell-voltage',
    name: 'LVH — Cornell voltage',
    category: 'ecg',
    short: 'Sex-specific ECG voltage criteria for LVH',
    keywords: ['lvh', 'hypertrophy', 'cornell', 'voltage'],
    kind: 'custom',
    inputs: [
      { id: 'ravl', label: 'R wave height in aVL', type: 'number', unit: 'mm', min: 0, max: 40, step: 1, placeholder: 'e.g., 12' },
      { id: 'sv3', label: 'S wave depth in V3', type: 'number', unit: 'mm', min: 0, max: 60, step: 1, placeholder: 'e.g., 20' },
      { id: 'sex', label: 'Sex', type: 'select', options: [
        { label: 'Male', value: 'male', points: 0 },
        { label: 'Female', value: 'female', points: 0 }
      ] }
    ],
    compute: function (v) {
      var ravl = v.ravl, sv3 = v.sv3, sex = v.sex;
      if (ravl == null || sv3 == null) return null;
      var sum = ravl + sv3;
      var female = sex === 'female';
      var thr = female ? 20 : 28;
      var pos = sum > thr;
      var who = female ? 'woman' : 'man';

      var detail = 'R aVL + S V3 = ' + sum + ' mm (threshold > ' + thr + ' mm for a ' + who + ')';
      var text = pos
        ? 'Meets Cornell voltage criteria for LVH (> ' + thr + ' mm for a ' + who + ').'
        : 'Does not meet Cornell voltage criteria (≤ ' + thr + ' mm for a ' + who + '). A normal result does not exclude LVH.';

      return { value: pos ? 'Positive' : 'Negative', unit: '', text: text, level: pos ? 'high' : 'low', detail: detail };
    },
    notes: 'Cornell voltage uses sex-specific thresholds (> 28 mm men, > 20 mm women). The related Cornell voltage-duration product (voltage × QRS duration) is a separate criterion not computed here.',
    refs: ['Casale PN, Devereux RB, Kligfield P, et al. J Am Coll Cardiol. 1985;6:572-580.']
  });

  /* ---------- LVH — Romhilt-Estes point score ---------- */
  CARDIO.register({
    id: 'lvh-romhilt-estes',
    name: 'LVH — Romhilt-Estes point score',
    category: 'ecg',
    short: 'Point-score ECG diagnosis of left ventricular hypertrophy',
    keywords: ['lvh', 'hypertrophy', 'romhilt', 'estes', 'point score'],
    inputs: [
      { id: 'voltage', label: 'Voltage criteria (any limb-lead R or S ≥ 20 mm, or S in V1/V2 ≥ 30 mm, or R in V5/V6 ≥ 30 mm)', type: 'check', points: 3 },
      { id: 'stt', label: 'ST-T abnormality (typical "strain" pattern)', type: 'select', hidePoints: false, options: [
        { label: 'None', points: 0 },
        { label: 'Present, NOT on digitalis', points: 3 },
        { label: 'Present, on digitalis', points: 1 }
      ] },
      { id: 'lae', label: 'Left atrial abnormality (terminal P negativity in V1 ≥ 1 mm deep and ≥ 0.04 s wide)', type: 'check', points: 3 },
      { id: 'lad', label: 'Left axis deviation ≥ −30°', type: 'check', points: 2 },
      { id: 'qrsdur', label: 'QRS duration ≥ 0.09 s (90 ms)', type: 'check', points: 1 },
      { id: 'intrinsicoid', label: 'Intrinsicoid deflection in V5/V6 ≥ 0.05 s (50 ms)', type: 'check', points: 1 }
    ],
    result: { unit: 'points' },
    interpret: [
      { upTo: 3, text: 'LVH not present by Romhilt-Estes criteria (< 4 points).', level: 'low' },
      { upTo: 4, text: '4 points: probable LVH.', level: 'mod' },
      { upTo: 13, text: '≥ 5 points: definite LVH by Romhilt-Estes criteria.', level: 'high' }
    ],
    notes: 'Maximum 13 points. ST-T "strain" scores 3 points off digitalis and 1 point on digitalis (mutually exclusive). Highly specific but insensitive.',
    refs: ['Romhilt DW, Estes EH Jr. Am Heart J. 1968;75:752-758.']
  });

  /* ---------- Sgarbossa criteria (original) ---------- */
  CARDIO.register({
    id: 'sgarbossa-original',
    name: 'Sgarbossa criteria (original)',
    category: 'ecg',
    short: 'ECG diagnosis of acute MI in LBBB or ventricular-paced rhythm',
    keywords: ['sgarbossa', 'lbbb', 'paced', 'mi', 'stemi', 'st elevation'],
    inputs: [
      { id: 'conste', label: 'Concordant ST elevation ≥ 1 mm in ≥ 1 lead', type: 'check', points: 5 },
      { id: 'constd', label: 'Concordant ST depression ≥ 1 mm in V1–V3', type: 'check', points: 3 },
      { id: 'disc', label: 'Discordant ST elevation ≥ 5 mm', type: 'check', points: 2 }
    ],
    result: { unit: 'points' },
    interpret: [
      { upTo: 2, text: 'Below the Sgarbossa threshold (< 3 points). A negative score does not exclude acute MI.', level: 'low' },
      { upTo: 10, text: '≥ 3 points: specific (though not sensitive) for acute MI in the setting of LBBB or ventricular-paced rhythm.', level: 'high' }
    ],
    notes: 'A total ≥ 3 points is specific for acute MI. Sensitivity is limited, so a low score cannot rule out infarction. Applies to LBBB and ventricular-paced rhythms.',
    refs: ['Sgarbossa EB, Pinski SL, Barbagelata A, et al. N Engl J Med. 1996;334:481-487.']
  });

  /* ---------- Modified (Smith) Sgarbossa criteria ---------- */
  CARDIO.register({
    id: 'sgarbossa-modified',
    name: 'Modified Sgarbossa (Smith) criteria',
    category: 'ecg',
    short: 'Modified rule for acute MI in LBBB using the ST/S ratio',
    keywords: ['sgarbossa', 'smith', 'lbbb', 'paced', 'mi', 'st/s ratio', 'discordance'],
    kind: 'custom',
    inputs: [
      { id: 'conste', label: 'Any concordant ST elevation ≥ 1 mm', type: 'check', points: 0 },
      { id: 'constd', label: 'Any concordant ST depression ≥ 1 mm in V1–V3', type: 'check', points: 0 },
      { id: 'discratio', label: 'Discordant ST elevation with ST/S ratio ≤ −0.25 in ≥ 1 lead', type: 'check', points: 0 }
    ],
    compute: function (v) {
      var a = !!v.conste, b = !!v.constd, c = !!v.discratio;
      var pos = a || b || c;
      var met = [];
      if (a) met.push('concordant STE ≥ 1 mm');
      if (b) met.push('concordant STD ≥ 1 mm in V1–V3');
      if (c) met.push('discordant STE with ST/S ≤ −0.25');

      var detail = pos ? ('Criteria met: ' + met.join('; ')) : 'No criterion met';
      var text = pos
        ? 'Positive modified Sgarbossa — concerning for acute MI in LBBB or ventricular-paced rhythm.'
        : 'No modified Sgarbossa criterion met. A negative result does not exclude acute MI.';

      return { value: pos ? 'Positive' : 'Negative', unit: '', text: text, level: pos ? 'high' : 'low', detail: detail };
    },
    notes: 'Any-positive rule: the third original criterion (absolute discordant STE ≥ 5 mm) is replaced by proportional discordance — discordant STE ≥ 25% of the preceding S-wave depth (ST/S ratio ≤ −0.25). More sensitive than the original weighted score.',
    refs: ['Smith SW, Dodd KW, Henry TD, et al. Ann Emerg Med. 2012;60:766-776.']
  });

  /* ---------- QRS axis interpretation (two-lead quadrant method) ---------- */
  CARDIO.register({
    id: 'qrs-axis',
    name: 'QRS axis (quadrant method)',
    category: 'ecg',
    short: 'Frontal-plane QRS axis from net deflection in leads I and aVF',
    keywords: ['axis', 'qrs axis', 'left axis deviation', 'right axis deviation', 'lad', 'rad'],
    kind: 'custom',
    inputs: [
      { id: 'leadI', label: 'Net QRS deflection in lead I', type: 'select', options: [
        { label: 'Positive (net upward)', value: 'pos', points: 0 },
        { label: 'Negative (net downward)', value: 'neg', points: 0 }
      ] },
      { id: 'avf', label: 'Net QRS deflection in lead aVF', type: 'select', options: [
        { label: 'Positive (net upward)', value: 'pos', points: 0 },
        { label: 'Negative (net downward)', value: 'neg', points: 0 }
      ] }
    ],
    compute: function (v) {
      var i = v.leadI, avf = v.avf;
      var axis, range, level;
      if (i === 'pos' && avf === 'pos') {
        axis = 'Normal axis'; range = '−30° to +90°'; level = 'low';
      } else if (i === 'pos' && avf === 'neg') {
        axis = 'Left axis deviation (possible)'; range = '0° to −90°'; level = 'mod';
      } else if (i === 'neg' && avf === 'pos') {
        axis = 'Right axis deviation'; range = '+90° to +180°'; level = 'mod';
      } else if (i === 'neg' && avf === 'neg') {
        axis = 'Extreme axis deviation (Northwest / “no-man’s land”)'; range = '−90° to −180°'; level = 'high';
      } else {
        return null;
      }

      var detail = 'Lead I: ' + (i === 'pos' ? 'positive' : 'negative') + ', aVF: ' + (avf === 'pos' ? 'positive' : 'negative') + '\nApproximate range: ' + range;
      var text = axis + ' (' + range + ').';
      if (i === 'pos' && avf === 'neg') {
        text += ' Check lead II: if lead II is positive the axis is physiologic (0° to −30°); if negative, true left axis deviation (−30° to −90°).';
      }

      return { value: axis, unit: '', text: text, level: level, detail: detail, badge: range };
    },
    notes: 'Two-lead quadrant method. For a lead I positive / aVF negative pattern, lead II distinguishes a physiologic leftward axis from true left axis deviation.',
    refs: ['Surawicz B, Knilans TK. Chou’s Electrocardiography in Clinical Practice. 6th ed. Saunders; 2008.']
  });

  /* NOTE: "Corrected QT for wide QRS" is intentionally OMITTED.
   * No single coefficient/method could be cited with certainty, and per the accuracy
   * rule a guessed formula is harmful. Omitted rather than invented. */

})();
