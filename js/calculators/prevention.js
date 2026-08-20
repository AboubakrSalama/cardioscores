/* Category: prevention — Primary prevention, lipids & global CVD risk
 * Each entry follows SCHEMA.md. Coefficients/thresholds verified against primary
 * publications. Anything not certain is registered kind:'external' or omitted. */
(function () {
  'use strict';

  /* ---------- ASCVD Pooled Cohort Equations (custom) ----------
   * Race/sex-specific Cox model from Goff et al. 2013 (ACC/AHA). Sanity check:
   * 55-y white man, TC 213, HDL 50, untreated SBP 120, non-smoker, non-diabetic
   * -> ~5.4% 10-year risk, matching the published worked example (~5.3%). */
  CARDIO.register({
    id: 'ascvd-pce',
    name: 'ASCVD Risk (Pooled Cohort Equations)',
    category: 'prevention',
    short: '10-year risk of a first hard ASCVD event (MI, CHD death, stroke)',
    keywords: ['ascvd', 'pooled cohort', 'pce', 'statin', 'primary prevention', 'goff', 'acc aha'],
    kind: 'custom',
    inputs: [
      { id: 'sex', label: 'Sex', type: 'select', options: [
        { label: 'Male', value: 'male', points: 0 },
        { label: 'Female', value: 'female', points: 0 }
      ] },
      { id: 'race', label: 'Race', type: 'select', options: [
        { label: 'White or other', value: 'white', points: 0 },
        { label: 'African American / Black', value: 'black', points: 0 }
      ] },
      { id: 'age', label: 'Age', type: 'number', unit: 'years', min: 40, max: 79, step: 1, placeholder: 'e.g., 55', hint: 'Validated for 40–79 years' },
      { id: 'tc', label: 'Total cholesterol', type: 'number', unit: 'mg/dL', units: [{ label: 'mg/dL', factor: 1, system: 'us' }, { label: 'mmol/L', factor: 38.67, system: 'si' }], min: 100, max: 430, step: 1, placeholder: 'e.g., 213' },
      { id: 'hdl', label: 'HDL cholesterol', type: 'number', unit: 'mg/dL', units: [{ label: 'mg/dL', factor: 1, system: 'us' }, { label: 'mmol/L', factor: 38.67, system: 'si' }], min: 20, max: 100, step: 1, placeholder: 'e.g., 50' },
      { id: 'sbp', label: 'Systolic blood pressure', type: 'number', unit: 'mmHg', min: 90, max: 200, step: 1, placeholder: 'e.g., 120' },
      { id: 'treated', label: 'On blood-pressure treatment', type: 'check' },
      { id: 'smoker', label: 'Current smoker', type: 'check' },
      { id: 'diabetes', label: 'Diabetes mellitus', type: 'check' }
    ],
    compute: function (v) {
      var age = v.age, tc = v.tc, hdl = v.hdl, sbp = v.sbp;
      if (age == null || tc == null || hdl == null || sbp == null) return null;
      if (age <= 0 || tc <= 0 || hdl <= 0 || sbp <= 0) return null;
      var female = v.sex === 'female';
      var black = v.race === 'black';
      var rx = !!v.treated, smk = !!v.smoker, dm = !!v.diabetes;
      var lnAge = Math.log(age), lnTc = Math.log(tc), lnHdl = Math.log(hdl), lnSbp = Math.log(sbp);
      var s, s0, mean;

      if (female && !black) {
        s = -29.799 * lnAge + 4.884 * lnAge * lnAge + 13.540 * lnTc - 3.114 * lnAge * lnTc
          - 13.578 * lnHdl + 3.149 * lnAge * lnHdl
          + (rx ? 2.019 : 1.957) * lnSbp
          + (smk ? 7.574 - 1.665 * lnAge : 0)
          + (dm ? 0.661 : 0);
        s0 = 0.9665; mean = -29.18;
      } else if (female && black) {
        s = 17.114 * lnAge + 0.940 * lnTc - 18.920 * lnHdl + 4.475 * lnAge * lnHdl
          + (rx ? 29.291 : 27.820) * lnSbp + (rx ? -6.432 : -6.087) * lnAge * lnSbp
          + (smk ? 0.691 : 0)
          + (dm ? 0.874 : 0);
        s0 = 0.9533; mean = 86.61;
      } else if (!female && !black) {
        s = 12.344 * lnAge + 11.853 * lnTc - 2.664 * lnAge * lnTc
          - 7.990 * lnHdl + 1.769 * lnAge * lnHdl
          + (rx ? 1.797 : 1.764) * lnSbp
          + (smk ? 7.837 - 1.795 * lnAge : 0)
          + (dm ? 0.658 : 0);
        s0 = 0.9144; mean = 61.18;
      } else { // black male
        s = 2.469 * lnAge + 0.302 * lnTc - 0.307 * lnHdl
          + (rx ? 1.916 : 1.809) * lnSbp
          + (smk ? 0.549 : 0)
          + (dm ? 0.645 : 0);
        s0 = 0.8954; mean = 19.54;
      }

      var risk = (1 - Math.pow(s0, Math.exp(s - mean))) * 100;
      if (!isFinite(risk)) return null;
      if (risk < 0) risk = 0;
      if (risk > 100) risk = 100;

      var level, text;
      if (risk < 5) { level = 'low'; text = 'Low 10-year ASCVD risk (< 5%). Emphasize lifestyle; statin generally not indicated.'; }
      else if (risk < 7.5) { level = 'mod'; text = 'Borderline risk (5 to < 7.5%). If risk-enhancing factors are present, a moderate-intensity statin may be considered.'; }
      else if (risk < 20) { level = 'high'; text = 'Intermediate risk (7.5 to < 20%). Moderate- to high-intensity statin recommended after clinician–patient risk discussion; CAC scoring may reclassify if uncertain.'; }
      else { level = 'vhigh'; text = 'High risk (≥ 20%). High-intensity statin recommended (goal LDL-C reduction ≥ 50%).'; }

      var detail = (black ? 'Black' : 'White/other') + ' ' + (female ? 'female' : 'male') + ' Pooled Cohort Equation.'
        + '\nCategories: < 5% low, 5–7.5% borderline, 7.5–20% intermediate, ≥ 20% high.'
        + '\nStatin discussion generally begins at ≥ 7.5% (or 5–7.5% with risk-enhancing factors).';
      if (age < 40 || age > 79) detail += '\n⚠ Validated only for ages 40–79; result outside this range is extrapolated and unreliable.';

      return { value: risk.toFixed(1), unit: '%', text: text, level: level, detail: detail };
    },
    notes: 'Estimates 10-year risk of a first hard ASCVD event in adults 40–79 without prior ASCVD. Uses the 2013 ACC/AHA race- and sex-specific Cox equations (White/other and African American only; other race/ethnicities use the White coefficients and risk may be over- or under-estimated). The 2018 AHA/ACC cholesterol guideline uses 7.5% and 20% thresholds and adds risk-enhancing factors and CAC scoring for borderline/intermediate patients. Note: the newer AHA PREVENT equations (2023) are increasingly preferred and are listed separately.',
    refs: [
      'Goff DC Jr, Lloyd-Jones DM, Bennett G, et al. 2013 ACC/AHA Guideline on the Assessment of Cardiovascular Risk. Circulation 2014;129(25 Suppl 2):S49-73.',
      'Stone NJ, Robinson JG, Lichtenstein AH, et al. Circulation 2014;129(25 Suppl 2):S1-45.',
      'Grundy SM, Stone NJ, Bailey AL, et al. 2018 AHA/ACC Cholesterol Guideline. Circulation 2019;139:e1082-e1143.'
    ]
  });

  /* ---------- Framingham 2008 general CVD risk (custom) ----------
   * Sex-specific Cox model, D'Agostino 2008 (lipids version). Beta coefficients and
   * baseline survival cross-verified against the official Framingham Heart Study risk
   * function page and the CVrisk R package (frs_coef).
   * Risk = 1 - S0(10)^exp(sum(beta*X) - meanLP).
   * Worked-example sanity checks (both reproduce exactly):
   *   - 55-y man, TC 213, HDL 50, SBP 140 untreated, non-smoker, non-diabetic -> 13.53%
   *     (CVrisk package unit-test assertion).
   *   - 61-y woman, TC 180, HDL 47, SBP 124 untreated, current smoker, non-diabetic -> 10.48%
   *     (D'Agostino 2008 paper's own worked example, reported as ~10%).
   * NOTE: treated/untreated SBP are two separate terms; only one is active. */
  CARDIO.register({
    id: 'framingham-cvd-2008',
    name: 'Framingham 10-year General CVD Risk (2008)',
    category: 'prevention',
    short: '10-year risk of general cardiovascular disease (D’Agostino 2008)',
    keywords: ['framingham', 'general cvd', 'd agostino', 'dagostino', 'primary prevention'],
    kind: 'custom',
    inputs: [
      { id: 'sex', label: 'Sex', type: 'select', options: [
        { label: 'Male', value: 'male', points: 0 },
        { label: 'Female', value: 'female', points: 0 }
      ] },
      { id: 'age', label: 'Age', type: 'number', unit: 'years', min: 30, max: 74, step: 1, placeholder: 'e.g., 55', hint: 'Validated for 30–74 years' },
      { id: 'tc', label: 'Total cholesterol', type: 'number', unit: 'mg/dL', units: [{ label: 'mg/dL', factor: 1, system: 'us' }, { label: 'mmol/L', factor: 38.67, system: 'si' }], min: 100, max: 400, step: 1, placeholder: 'e.g., 213' },
      { id: 'hdl', label: 'HDL cholesterol', type: 'number', unit: 'mg/dL', units: [{ label: 'mg/dL', factor: 1, system: 'us' }, { label: 'mmol/L', factor: 38.67, system: 'si' }], min: 10, max: 100, step: 1, placeholder: 'e.g., 50' },
      { id: 'sbp', label: 'Systolic blood pressure', type: 'number', unit: 'mmHg', min: 90, max: 200, step: 1, placeholder: 'e.g., 125' },
      { id: 'treated', label: 'On blood-pressure treatment', type: 'check' },
      { id: 'smoker', label: 'Current smoker', type: 'check' },
      { id: 'diabetes', label: 'Diabetes mellitus', type: 'check' }
    ],
    compute: function (v) {
      var age = v.age, tc = v.tc, hdl = v.hdl, sbp = v.sbp;
      if (age == null || tc == null || hdl == null || sbp == null) return null;
      if (age <= 0 || tc <= 0 || hdl <= 0 || sbp <= 0) return null;
      var female = v.sex === 'female';
      var rx = !!v.treated, smk = !!v.smoker, dm = !!v.diabetes;
      var lnAge = Math.log(age), lnTc = Math.log(tc), lnHdl = Math.log(hdl), lnSbp = Math.log(sbp);
      var b, s0, mean;

      if (female) {
        b = 2.32888 * lnAge + 1.20904 * lnTc - 0.70833 * lnHdl
          + (rx ? 2.82263 : 2.76157) * lnSbp
          + (smk ? 0.52873 : 0) + (dm ? 0.69154 : 0);
        s0 = 0.95012; mean = 26.1931;
      } else {
        b = 3.06117 * lnAge + 1.12370 * lnTc - 0.93263 * lnHdl
          + (rx ? 1.99881 : 1.93303) * lnSbp
          + (smk ? 0.65451 : 0) + (dm ? 0.57367 : 0);
        s0 = 0.88936; mean = 23.9802;
      }

      var risk = (1 - Math.pow(s0, Math.exp(b - mean))) * 100;
      if (!isFinite(risk)) return null;
      if (risk < 0) risk = 0;
      if (risk > 100) risk = 100;

      var level, text;
      if (risk < 10) { level = 'low'; text = 'Low 10-year general CVD risk (< 10%).'; }
      else if (risk < 20) { level = 'mod'; text = 'Intermediate 10-year general CVD risk (10 to < 20%).'; }
      else { level = 'high'; text = 'High 10-year general CVD risk (≥ 20%).'; }

      var detail = (female ? 'Female' : 'Male') + ' Framingham general-CVD Cox model (D\'Agostino 2008).'
        + '\nOutcome: first general CVD event (coronary death/MI, coronary insufficiency, angina, stroke/TIA, PAD, heart failure).'
        + '\nCategories used here: < 10% low, 10–20% intermediate, ≥ 20% high.';
      if (age < 30 || age > 74) detail += '\n⚠ Validated only for ages 30–74; a result outside this range is extrapolated and unreliable.';
      return { value: risk.toFixed(1), unit: '%', text: text, level: level, detail: detail };
    },
    notes: 'Native implementation of the D\'Agostino 2008 sex-specific "lipids" Cox model for a first general CVD event in adults 30–74 without prior CVD. Beta coefficients and baseline survival verified against the Framingham Heart Study official risk-function page and the CVrisk R package; reproduces the paper\'s 61-y-woman worked example (10.48%) and the CVrisk unit-test case (13.53%). A simpler office-based version substitutes BMI for lipids and is not implemented here. This general-CVD endpoint is broader than the ASCVD hard endpoint, so absolute percentages are not comparable across the two scores. Verify against the primary publication before clinical use.',
    refs: [
      'D’Agostino RB Sr, Vasan RS, Pencina MJ, et al. General cardiovascular risk profile for use in primary care: the Framingham Heart Study. Circulation 2008;117:743-53.'
    ]
  });

  /* ---------- SCORE2 / SCORE2-OP (custom) ----------
   * 2021 ESC sex-specific competing-risk models with four-region recalibration.
   * Age < 70 uses SCORE2 (40–69); age >= 70 uses SCORE2-OP (70–89).
   * Coefficients / baselines / scale factors verified against the primary papers
   * (Eur Heart J 2021) and the RiskScorescvd R package.
   * SCORE2 (40–69) reproduces all four published chart examples exactly, e.g. a
   * 50-y smoker, SBP 140, TC 5.5, HDL 1.3 mmol/L: male low-region 5.9% / very-high 14.0%;
   * female low-region 4.2% / very-high 13.7%.
   * SCORE2-OP coefficients/baselines match the OP paper's Table 2, but the region
   * scale factors are published/available only to 2 decimals; OP estimates near a
   * chart boundary can differ from the ESC chart by a few points (see notes).
   * Calibration: cal = 1 - exp(-exp(scale1 + scale2 * ln(-ln(1 - uncal)))). */
  CARDIO.register({
    id: 'score2',
    name: 'SCORE2 / SCORE2-OP',
    category: 'prevention',
    short: '10-year risk of fatal + non-fatal CVD (European populations)',
    keywords: ['score2', 'score2-op', 'esc', 'europe', 'cvd risk', 'primary prevention'],
    kind: 'custom',
    inputs: [
      { id: 'sex', label: 'Sex', type: 'select', options: [
        { label: 'Male', value: 'male', points: 0 },
        { label: 'Female', value: 'female', points: 0 }
      ] },
      { id: 'region', label: 'ESC risk region', type: 'select', hint: 'Country CVD-mortality region per 2021 ESC prevention guideline', options: [
        { label: 'Low risk', value: 'low', points: 0 },
        { label: 'Moderate risk', value: 'mod', points: 0 },
        { label: 'High risk', value: 'high', points: 0 },
        { label: 'Very high risk', value: 'vhigh', points: 0 }
      ] },
      { id: 'age', label: 'Age', type: 'number', unit: 'years', min: 40, max: 89, step: 1, placeholder: 'e.g., 55', hint: '40–69 uses SCORE2; 70–89 uses SCORE2-OP' },
      { id: 'sbp', label: 'Systolic blood pressure', type: 'number', unit: 'mmHg', min: 90, max: 200, step: 1, placeholder: 'e.g., 140' },
      { id: 'tc', label: 'Total cholesterol', type: 'number', unit: 'mmol/L', units: [{ label: 'mmol/L', factor: 1, system: 'si' }, { label: 'mg/dL', factor: 0.02586, system: 'us' }], min: 2.5, max: 12, step: 0.1, placeholder: 'e.g., 5.5', hint: 'mmol/L (mg/dL ÷ 38.67)' },
      { id: 'hdl', label: 'HDL cholesterol', type: 'number', unit: 'mmol/L', units: [{ label: 'mmol/L', factor: 1, system: 'si' }, { label: 'mg/dL', factor: 0.02586, system: 'us' }], min: 0.5, max: 3.5, step: 0.1, placeholder: 'e.g., 1.3', hint: 'mmol/L (mg/dL ÷ 38.67)' },
      { id: 'smoker', label: 'Current smoker', type: 'check' }
    ],
    compute: function (v) {
      var age = v.age, sbp = v.sbp, tc = v.tc, hdl = v.hdl;
      if (age == null || sbp == null || tc == null || hdl == null) return null;
      if (age <= 0 || sbp <= 0 || tc <= 0 || hdl <= 0) return null;
      var female = v.sex === 'female';
      var region = v.region || 'low';
      var smk = v.smoker ? 1 : 0;
      var op = age >= 70;
      var uncal, model;

      if (!op) {
        // SCORE2 (40–69)
        model = 'SCORE2';
        var cage = (age - 60) / 5, csbp = (sbp - 120) / 20, ctc = (tc - 6), chdl = (hdl - 1.3) / 0.5;
        var lp, s0;
        if (female) {
          lp = 0.4648 * cage + 0.7744 * smk + 0.3131 * csbp + 0.1002 * ctc - 0.2606 * chdl
            - 0.1088 * cage * smk - 0.0277 * cage * csbp - 0.0226 * cage * ctc + 0.0613 * cage * chdl;
          s0 = 0.9776;
        } else {
          lp = 0.3742 * cage + 0.6012 * smk + 0.2777 * csbp + 0.1458 * ctc - 0.2698 * chdl
            - 0.0755 * cage * smk - 0.0255 * cage * csbp - 0.0281 * cage * ctc + 0.0426 * cage * chdl;
          s0 = 0.9605;
        }
        uncal = 1 - Math.pow(s0, Math.exp(lp));
      } else {
        // SCORE2-OP (70–89) — competing-risk model
        model = 'SCORE2-OP';
        var ca = (age - 73), csbp2 = (sbp - 150), ctc2 = (tc - 6), chdl2 = (hdl - 1.4);
        var lp2, s02, off;
        if (female) {
          lp2 = 0.0789 * ca + 0.4921 * smk + 0.0102 * csbp2 + 0.0605 * ctc2 - 0.3040 * chdl2
            - 0.0255 * ca * smk - 0.0004 * ca * csbp2 - 0.0009 * ca * ctc2 + 0.0154 * ca * chdl2;
          s02 = 0.8082; off = 0.229;
        } else {
          lp2 = 0.0634 * ca + 0.3524 * smk + 0.0094 * csbp2 + 0.0850 * ctc2 - 0.3564 * chdl2
            - 0.0247 * ca * smk - 0.0005 * ca * csbp2 + 0.0073 * ca * ctc2 + 0.0091 * ca * chdl2;
          s02 = 0.7576; off = 0.0929;
        }
        uncal = 1 - Math.pow(s02, Math.exp(lp2 - off));
      }

      // Region recalibration scale factors [scale1, scale2]
      var SC = op
        ? (female
            ? { low: [-0.52, 1.01], mod: [-0.10, 1.10], high: [0.38, 1.09], vhigh: [0.38, 0.69] }
            : { low: [-0.34, 1.19], mod: [0.01, 1.25], high: [0.08, 1.15], vhigh: [0.05, 0.70] })
        : (female
            ? { low: [-0.7380, 0.7019], mod: [-0.3143, 0.7701], high: [0.5710, 0.9369], vhigh: [0.9412, 0.8329] }
            : { low: [-0.5699, 0.7476], mod: [-0.1565, 0.8009], high: [0.3207, 0.9360], vhigh: [0.5836, 0.8294] });
      var sc = SC[region] || SC.low;
      var risk = (1 - Math.exp(-Math.exp(sc[0] + sc[1] * Math.log(-Math.log(1 - uncal))))) * 100;
      if (!isFinite(risk)) return null;
      if (risk < 0) risk = 0;
      if (risk > 100) risk = 100;

      // Age-specific thresholds (2021 ESC prevention guideline)
      var lowCut, highCut;
      if (age < 50) { lowCut = 2.5; highCut = 7.5; }
      else if (age < 70) { lowCut = 5; highCut = 10; }
      else { lowCut = 7.5; highCut = 15; }

      var level, text;
      if (risk < lowCut) { level = 'low'; text = 'Low-to-moderate 10-year CVD risk (< ' + lowCut + '% for this age band). Generally no drug treatment on risk grounds alone.'; }
      else if (risk < highCut) { level = 'high'; text = 'High 10-year CVD risk (' + lowCut + ' to < ' + highCut + '%). Risk-factor treatment generally considered.'; }
      else { level = 'vhigh'; text = 'Very high 10-year CVD risk (≥ ' + highCut + '%). Risk-factor treatment generally recommended.'; }

      var regionName = { low: 'Low', mod: 'Moderate', high: 'High', vhigh: 'Very high' }[region] || 'Low';
      var detail = model + ', ' + (female ? 'female' : 'male') + ', ' + regionName + '-risk region.'
        + '\nAge-band thresholds: <' + lowCut + '% low-to-moderate, ' + lowCut + '–' + highCut + '% high, ≥' + highCut + '% very high.'
        + '\nCholesterol entered in mmol/L (multiply mg/dL by 0.02586).';
      if (op) detail += '\n⚠ SCORE2-OP region scale factors are available only to 2 decimals; estimates near a threshold may differ slightly from the ESC chart.';
      if (age < 40 || age > 89) detail += '\n⚠ Validated only for ages 40–89.';
      return { value: risk.toFixed(1), unit: '%', text: text, level: level, detail: detail, badge: model };
    },
    notes: 'Native implementation of the 2021 ESC SCORE2 (ages 40–69) and SCORE2-OP (ages 70–89) sex-specific competing-risk models with recalibration to the four ESC risk regions (choose your country\'s region). Coefficients, baseline survival and region scale factors were verified against the Eur Heart J 2021 papers and the RiskScorescvd package; SCORE2 reproduces all four published chart examples exactly. SCORE2-OP coefficients/baselines match the OP paper\'s Table 2, but its region scale factors are available only to two decimals, so OP estimates near a boundary can differ from the official ESC chart by a few percentage points. For diabetes, use the dedicated SCORE2-Diabetes model instead (not implemented here). Cholesterol inputs are in mmol/L. Verify against the primary publication before clinical use.',
    refs: [
      'SCORE2 working group and ESC Cardiovascular risk collaboration. SCORE2 risk prediction algorithms. Eur Heart J 2021;42:2439-2454.',
      'SCORE2-OP working group and ESC Cardiovascular risk collaboration. SCORE2-OP risk prediction algorithms. Eur Heart J 2021;42:2455-2467.',
      '2021 ESC Guidelines on cardiovascular disease prevention in clinical practice. Eur Heart J 2021;42:3227-3337.'
    ]
  });

  /* ---------- QRISK3 (custom) ----------
   * ClinRisk open-source (LGPL) QRISK3-2017 algorithm, sex-specific Cox models.
   * All coefficients copied verbatim from the released algorithm (as transcribed in
   * the CRAN QRISK3 package, R/QRISK3-2017ver9.R). Score = 100*(1 - S0^exp(sum)).
   * Sex-specific fractional-polynomial age powers: female age^-2 & age^1; male age^-1
   * & age^3. Survivor constants: female 0.988876402378082, male 0.977268040180206.
   * Sanity checks (clinically plausible, consistent with published QRISK3 behaviour):
   *   - 64-y white man, non-smoker, BMI 25, SBP 125, chol/HDL 4, no comorbidities -> ~12.3%
   *   - 50-y white man, same otherwise, SBP 120, ratio 3.5 -> ~3.7%
   *   - 60-y white woman, non-smoker, BMI 25, SBP 125, ratio 4 -> ~5.5%
   * OMITTED optional inputs vs the official tool (each set to reference/absent here):
   * Townsend deprivation (set 0 = UK average), SBP standard deviation (set 0), and
   * b_ra/b_semi are exposed; all comorbidity toggles are included. See notes. */
  CARDIO.register({
    id: 'qrisk3',
    name: 'QRISK3',
    category: 'prevention',
    short: '10-year cardiovascular risk (UK-derived, extended risk factors)',
    keywords: ['qrisk', 'qrisk3', 'uk', 'nice', 'cvd risk', 'primary prevention'],
    kind: 'custom',
    inputs: [
      { id: 'sex', label: 'Sex', type: 'select', options: [
        { label: 'Male', value: 'male', points: 0 },
        { label: 'Female', value: 'female', points: 0 }
      ] },
      { id: 'eth', label: 'Ethnicity', type: 'select', options: [
        { label: 'White or not stated', value: 1, points: 0 },
        { label: 'Indian', value: 2, points: 0 },
        { label: 'Pakistani', value: 3, points: 0 },
        { label: 'Bangladeshi', value: 4, points: 0 },
        { label: 'Other Asian', value: 5, points: 0 },
        { label: 'Black Caribbean', value: 6, points: 0 },
        { label: 'Black African', value: 7, points: 0 },
        { label: 'Chinese', value: 8, points: 0 },
        { label: 'Other ethnic group', value: 9, points: 0 }
      ] },
      { id: 'smoke', label: 'Smoking status', type: 'select', options: [
        { label: 'Non-smoker', value: 1, points: 0 },
        { label: 'Ex-smoker', value: 2, points: 0 },
        { label: 'Light smoker (< 10/day)', value: 3, points: 0 },
        { label: 'Moderate smoker (10–19/day)', value: 4, points: 0 },
        { label: 'Heavy smoker (≥ 20/day)', value: 5, points: 0 }
      ] },
      { id: 'age', label: 'Age', type: 'number', unit: 'years', min: 25, max: 84, step: 1, placeholder: 'e.g., 60', hint: 'Validated for 25–84 years' },
      { id: 'bmi', label: 'Body mass index', type: 'number', unit: 'kg/m²', min: 18, max: 47, step: 0.1, placeholder: 'e.g., 26' },
      { id: 'sbp', label: 'Systolic blood pressure', type: 'number', unit: 'mmHg', min: 70, max: 210, step: 1, placeholder: 'e.g., 130' },
      { id: 'rati', label: 'Total cholesterol / HDL ratio', type: 'number', min: 1, max: 12, step: 0.1, placeholder: 'e.g., 4', hint: 'e.g., TC 200 / HDL 50 = 4.0' },
      { id: 'sbps5', label: 'SBP standard deviation (optional)', type: 'number', unit: 'mmHg', min: 0, max: 40, step: 1, placeholder: '0 if unknown', hint: 'SD of recent SBP readings; leave 0 if unknown' },
      { id: 'town', label: 'Townsend deprivation score (optional)', type: 'number', min: -8, max: 12, step: 0.1, placeholder: '0 = UK average', hint: 'Leave 0 for UK average' },
      { id: 'treatedhyp', label: 'On blood-pressure treatment', type: 'check' },
      { id: 'type1', label: 'Type 1 diabetes', type: 'check' },
      { id: 'type2', label: 'Type 2 diabetes', type: 'check' },
      { id: 'af', label: 'Atrial fibrillation', type: 'check' },
      { id: 'ckd', label: 'Chronic kidney disease (stage 3–5)', type: 'check' },
      { id: 'migraine', label: 'Migraine', type: 'check' },
      { id: 'ra', label: 'Rheumatoid arthritis', type: 'check' },
      { id: 'sle', label: 'Systemic lupus erythematosus (SLE)', type: 'check' },
      { id: 'semi', label: 'Severe mental illness', hint: 'Schizophrenia, bipolar or moderate/severe depression', type: 'check' },
      { id: 'antipsy', label: 'On atypical antipsychotic', type: 'check' },
      { id: 'steroids', label: 'On regular oral corticosteroids', type: 'check' },
      { id: 'impotence', label: 'Erectile dysfunction (men)', type: 'check' },
      { id: 'fh', label: 'Family history of CHD (1st-degree relative < 60)', type: 'check' }
    ],
    compute: function (v) {
      var age = v.age, bmi = v.bmi, sbp = v.sbp, rati = v.rati;
      if (age == null || bmi == null || sbp == null || rati == null) return null;
      if (age <= 0 || bmi <= 0 || sbp <= 0 || rati <= 0) return null;
      var female = v.sex === 'female';
      var ethrisk = +v.eth || 1;
      var smoke_cat = +v.smoke || 1;
      var sbps5 = (v.sbps5 == null ? 0 : v.sbps5);
      var town = (v.town == null ? 0 : v.town);
      var b_treatedhyp = v.treatedhyp ? 1 : 0;
      var b_type1 = v.type1 ? 1 : 0, b_type2 = v.type2 ? 1 : 0;
      var b_AF = v.af ? 1 : 0, b_renal = v.ckd ? 1 : 0, b_migraine = v.migraine ? 1 : 0;
      var b_ra = v.ra ? 1 : 0, b_sle = v.sle ? 1 : 0, b_semi = v.semi ? 1 : 0;
      var b_atypicalantipsy = v.antipsy ? 1 : 0, b_corticosteroids = v.steroids ? 1 : 0;
      var b_impotence2 = (!female && v.impotence) ? 1 : 0;
      var fh_cvd = v.fh ? 1 : 0;

      var dage = age / 10, dbmi = bmi / 10, a = 0, age_1, age_2, bmi_1, bmi_2, Ieth, Ismoke;

      if (female) {
        Ieth = [0, 0, 0.28040314332995425, 0.56298994142075398, 0.29590000851116516, 0.072785379877982545,
          -0.17072135508857317, -0.39371043314874971, -0.32632495283530272, -0.17127056883241784];
        Ismoke = [0, 0, 0.13386833786546262, 0.56200858012438537, 0.66749593377502547, 0.84948177644830847];
        age_1 = Math.pow(dage, -2) - 0.053274843841791;
        age_2 = dage - 4.332503318786621;
        bmi_1 = Math.pow(dbmi, -2) - 0.154946178197861;
        bmi_2 = Math.pow(dbmi, -2) * Math.log(dbmi) - 0.144462317228317;
        var fr = rati - 3.476326465606690, fs = sbp - 123.130012512207030, f5 = sbps5 - 9.002537727355957, ft = town - 0.392308831214905;

        a += Ieth[ethrisk] + Ismoke[smoke_cat];
        a += age_1 * -8.1388109247726188 + age_2 * 0.7973337668969910;
        a += bmi_1 * 0.2923609227546005 + bmi_2 * -4.1513300213837665;
        a += fr * 0.1533803582080255 + fs * 0.0131314884071034 + f5 * 0.0078894541014586 + ft * 0.0772237905885901;
        a += b_AF * 1.5923354969269663 + b_atypicalantipsy * 0.2523764207011556 + b_corticosteroids * 0.5952072530460185;
        a += b_migraine * 0.3012672608703450 + b_ra * 0.2136480343518194 + b_renal * 0.6519456949384583;
        a += b_semi * 0.1255530805882018 + b_sle * 0.7588093865426769 + b_treatedhyp * 0.5093159368342300;
        a += b_type1 * 1.7267977510537347 + b_type2 * 1.0688773244615468 + fh_cvd * 0.4544531902089621;
        a += age_1 * ((smoke_cat === 2 ? -4.7057161785851891 : 0) + (smoke_cat === 3 ? -2.7430383403573337 : 0)
          + (smoke_cat === 4 ? -0.8660808882939218 : 0) + (smoke_cat === 5 ? 0.9024156236971065 : 0));
        a += age_1 * b_AF * 19.9380348895465610 + age_1 * b_corticosteroids * -0.9840804523593628 + age_1 * b_migraine * 1.7634979587872999;
        a += age_1 * b_renal * -3.5874047731694114 + age_1 * b_sle * 19.6903037386382920 + age_1 * b_treatedhyp * 11.8728097339218120;
        a += age_1 * b_type1 * -1.2444332714320747 + age_1 * b_type2 * 6.8652342000009599 + age_1 * bmi_1 * 23.8026234121417420;
        a += age_1 * bmi_2 * -71.1849476920870070 + age_1 * fh_cvd * 0.9946780794043513 + age_1 * fs * 0.0341318423386155 + age_1 * ft * -1.0301180802035639;
        a += age_2 * ((smoke_cat === 2 ? -0.0755892446431930 : 0) + (smoke_cat === 3 ? -0.1195119287486707 : 0)
          + (smoke_cat === 4 ? -0.1036630639757192 : 0) + (smoke_cat === 5 ? -0.1399185359171839 : 0));
        a += age_2 * b_AF * -0.0761826510111625 + age_2 * b_corticosteroids * -0.1200536494674247 + age_2 * b_migraine * -0.0655869178986999;
        a += age_2 * b_renal * -0.2268887308644251 + age_2 * b_sle * 0.0773479496790163 + age_2 * b_treatedhyp * 0.0009685782358817;
        a += age_2 * b_type1 * -0.2872406462448895 + age_2 * b_type2 * -0.0971122525906955 + age_2 * bmi_1 * 0.5236995893366443;
        a += age_2 * bmi_2 * 0.0457441901223238 + age_2 * fh_cvd * -0.0768850516984230 + age_2 * fs * -0.0015082501423272 + age_2 * ft * -0.0315934146749623;

        var riskF = 100 * (1 - Math.pow(0.988876402378082, Math.exp(a)));
        return finish(riskF);
      } else {
        Ieth = [0, 0, 0.27719248760308279, 0.47446360714931268, 0.52961729919689371, 0.035100159186299017,
          -0.35807899669327919, -0.40056485232165140, -0.41522792889830173, -0.26321348134749967];
        Ismoke = [0, 0, 0.19128222863388983, 0.55241588192645552, 0.63835053027506072, 0.78983819881858019];
        age_1 = Math.pow(dage, -1) - 0.234766781330109;
        age_2 = Math.pow(dage, 3) - 77.284080505371094;
        bmi_1 = Math.pow(dbmi, -2) - 0.149176135659218;
        bmi_2 = Math.pow(dbmi, -2) * Math.log(dbmi) - 0.141913309693336;
        var mr = rati - 4.300998687744141, ms = sbp - 128.571578979492190, m5 = sbps5 - 8.756621360778809, mt = town - 0.526304900646210;

        a += Ieth[ethrisk] + Ismoke[smoke_cat];
        a += age_1 * -17.8397816660055750 + age_2 * 0.0022964880605765;
        a += bmi_1 * 2.4562776660536358 + bmi_2 * -8.3011122314711354;
        a += mr * 0.1734019685632711 + ms * 0.0129101265425533 + m5 * 0.0102519142912905 + mt * 0.0332682012772873;
        a += b_AF * 0.8820923692805466 + b_atypicalantipsy * 0.1304687985517351 + b_corticosteroids * 0.4548539975044554;
        a += b_impotence2 * 0.2225185908670538 + b_migraine * 0.2558417807415991 + b_ra * 0.2097065801395657;
        a += b_renal * 0.7185326128827438 + b_semi * 0.1213303988204716 + b_sle * 0.4401572174457522;
        a += b_treatedhyp * 0.5165987108269547 + b_type1 * 1.2343425521675175 + b_type2 * 0.8594207143093222 + fh_cvd * 0.5405546900939016;
        a += age_1 * ((smoke_cat === 2 ? -0.2101113393351635 : 0) + (smoke_cat === 3 ? 0.7526867644750319 : 0)
          + (smoke_cat === 4 ? 0.9931588755640579 : 0) + (smoke_cat === 5 ? 2.1331163414389076 : 0));
        a += age_1 * b_AF * 3.4896675530623207 + age_1 * b_corticosteroids * 1.1708133653489108 + age_1 * b_impotence2 * -1.5064009857454310;
        a += age_1 * b_migraine * 2.3491159871402441 + age_1 * b_renal * -0.5065671632722369 + age_1 * b_treatedhyp * 6.5114581098532671;
        a += age_1 * b_type1 * 5.3379864878006531 + age_1 * b_type2 * 3.6461817406221311 + age_1 * bmi_1 * 31.0049529560338860;
        a += age_1 * bmi_2 * -111.2915718439164300 + age_1 * fh_cvd * 2.7808628508531887 + age_1 * ms * 0.0188585244698659 + age_1 * mt * -0.1007554870063731;
        a += age_2 * ((smoke_cat === 2 ? -0.0004985487027533 : 0) + (smoke_cat === 3 ? -0.0007987563331739 : 0)
          + (smoke_cat === 4 ? -0.0008370618426625 : 0) + (smoke_cat === 5 ? -0.0007840031915564 : 0));
        a += age_2 * b_AF * -0.0003499560834064 + age_2 * b_corticosteroids * -0.0002496045095297 + age_2 * b_impotence2 * -0.0011058218441227;
        a += age_2 * b_migraine * 0.0001989644604148 + age_2 * b_renal * -0.0018325930166499 + age_2 * b_treatedhyp * 0.0006383805310417;
        a += age_2 * b_type1 * 0.0006409780808753 + age_2 * b_type2 * -0.0002469569558887 + age_2 * bmi_1 * 0.0050380102356322;
        a += age_2 * bmi_2 * -0.0130744830025243 + age_2 * fh_cvd * -0.0002479180990740 + age_2 * ms * -0.0000127187419159 + age_2 * mt * -0.0000932996423233;

        var riskM = 100 * (1 - Math.pow(0.977268040180206, Math.exp(a)));
        return finish(riskM);
      }

      function finish(risk) {
        if (!isFinite(risk)) return null;
        if (risk < 0) risk = 0;
        if (risk > 100) risk = 100;
        var level, text;
        if (risk < 10) { level = 'low'; text = 'Low 10-year CVD risk (< 10%).'; }
        else if (risk < 20) { level = 'mod'; text = 'Moderate 10-year CVD risk (10 to < 20%). NICE considers a statin (atorvastatin 20 mg) at ≥ 10%.'; }
        else { level = 'high'; text = 'High 10-year CVD risk (≥ 20%). Statin therapy recommended.'; }
        var detail = (female ? 'Female' : 'Male') + ' QRISK3-2017 Cox model.'
          + '\nNICE offers a statin at a 10-year risk ≥ 10%.'
          + '\nOptional fields left at 0 (Townsend, SBP variability) assume UK-average / unknown.';
        if (age < 25 || age > 84) detail += '\n⚠ Validated only for ages 25–84.';
        return { value: risk.toFixed(1), unit: '%', text: text, level: level, detail: detail };
      }
    },
    notes: 'Native implementation of the ClinRisk open-source (LGPL) QRISK3-2017 sex-specific Cox algorithm; all coefficients copied verbatim from the released code (as transcribed in the CRAN QRISK3 package). Includes ethnicity, smoking, BMI, cholesterol/HDL ratio, SBP and its variability, Townsend deprivation, and the full comorbidity set (AF, CKD, RA, SLE, migraine, severe mental illness, atypical antipsychotics, corticosteroids, type 1/2 diabetes, treated hypertension, erectile dysfunction, family history). Townsend deprivation and SBP standard deviation are optional and default to 0 (UK average / unknown) if left blank, which slightly changes the estimate versus supplying real values. Derived and validated in UK primary-care populations and used by NICE; it is not calibrated to non-UK populations. Outputs are clinically plausible and consistent with published QRISK3 behaviour but have not been checked term-by-term against the ClinRisk C reference dataset here. Verify against the primary publication (and qrisk.org) before clinical use.',
    refs: [
      'Hippisley-Cox J, Coupland C, Brindle P. Development and validation of QRISK3 risk prediction algorithms to estimate future risk of cardiovascular disease: prospective cohort study. BMJ 2017;357:j2099.',
      'ClinRisk Ltd. QRISK3-2017 open-source algorithm (LGPL). https://qrisk.org/src.php'
    ]
  });

  /* ---------- AHA PREVENT equations (custom) ----------
   * 2023 AHA PREVENT sex-specific base equations, 10-year TOTAL CVD outcome.
   * Race-free logistic model: risk = 1/(1 + exp(-LP)). Coefficients verified against
   * the Circulation 2024 supplement via two independent R packages (preventr,
   * PooledCohort), which agree to every decimal.
   * Cholesterol native unit is mmol/L (mg/dL x 0.02586). Centering: age 55, non-HDL 3.5,
   * HDL 1.3, SBP 130 (knot 110), eGFR 90 (knot 60).
   * Worked-example sanity checks (reproduce exactly):
   *   - Woman, age 50, SBP 160 treated, TC 200, HDL 45 mg/dL, no statin, diabetic,
   *     non-smoker, eGFR 90 -> 14.7% (preventr package README example).
   *   - Reference woman at all centering points (age 55, non-HDL 3.5, HDL 1.3, SBP 130,
   *     eGFR 90, no risk factors/meds) -> 3.5%; equivalent man -> 4.6%.
   * BMI, UACR, HbA1c and social-deprivation index are NOT in the total-CVD base model. */
  CARDIO.register({
    id: 'prevent',
    name: 'AHA PREVENT Equations',
    category: 'prevention',
    short: '10-year risk of total CVD (2023 AHA PREVENT base equations)',
    keywords: ['prevent', 'aha', 'ckm', 'egfr', 'primary prevention', 'race-free'],
    kind: 'custom',
    inputs: [
      { id: 'sex', label: 'Sex', type: 'select', options: [
        { label: 'Male', value: 'male', points: 0 },
        { label: 'Female', value: 'female', points: 0 }
      ] },
      { id: 'age', label: 'Age', type: 'number', unit: 'years', min: 30, max: 79, step: 1, placeholder: 'e.g., 55', hint: 'Validated for 30–79 years' },
      { id: 'tc', label: 'Total cholesterol', type: 'number', unit: 'mg/dL', units: [{ label: 'mg/dL', factor: 1, system: 'us' }, { label: 'mmol/L', factor: 38.67, system: 'si' }], min: 100, max: 400, step: 1, placeholder: 'e.g., 200' },
      { id: 'hdl', label: 'HDL cholesterol', type: 'number', unit: 'mg/dL', units: [{ label: 'mg/dL', factor: 1, system: 'us' }, { label: 'mmol/L', factor: 38.67, system: 'si' }], min: 20, max: 100, step: 1, placeholder: 'e.g., 45' },
      { id: 'sbp', label: 'Systolic blood pressure', type: 'number', unit: 'mmHg', min: 90, max: 200, step: 1, placeholder: 'e.g., 130' },
      { id: 'egfr', label: 'eGFR', type: 'number', unit: 'mL/min/1.73m²', min: 15, max: 140, step: 1, placeholder: 'e.g., 90' },
      { id: 'treated', label: 'On blood-pressure treatment', type: 'check' },
      { id: 'statin', label: 'On statin therapy', type: 'check' },
      { id: 'diabetes', label: 'Diabetes mellitus', type: 'check' },
      { id: 'smoker', label: 'Current smoker', type: 'check' }
    ],
    compute: function (v) {
      var age = v.age, tc = v.tc, hdl = v.hdl, sbp = v.sbp, egfr = v.egfr;
      if (age == null || tc == null || hdl == null || sbp == null || egfr == null) return null;
      if (age <= 0 || tc <= 0 || hdl <= 0 || sbp <= 0 || egfr <= 0) return null;
      var female = v.sex === 'female';
      var conv = 0.02586; // mg/dL -> mmol/L
      var nonhdl = (tc - hdl) * conv - 3.5;
      var hdlt = (hdl * conv - 1.3) / 0.3;
      var agec = (age - 55) / 10;
      var sbplt = (Math.min(sbp, 110) - 110) / 20;
      var sbpge = (Math.max(sbp, 110) - 130) / 20;
      var egfrlt = (Math.min(egfr, 60) - 60) / (-15);
      var egfrge = (Math.max(egfr, 60) - 90) / (-15);
      var dm = v.diabetes ? 1 : 0, sm = v.smoker ? 1 : 0, bt = v.treated ? 1 : 0, st = v.statin ? 1 : 0;
      var lp;

      if (female) {
        lp = 0.7939329 * agec + 0.0305239 * nonhdl - 0.1606857 * hdlt
          - 0.2394003 * sbplt + 0.3600781 * sbpge + 0.8667604 * dm + 0.5360739 * sm
          + 0.6045917 * egfrlt + 0.0433769 * egfrge + 0.3151672 * bt - 0.1477655 * st
          - 0.0663612 * (bt * sbpge) + 0.1197879 * (st * nonhdl)
          - 0.0819715 * (agec * nonhdl) + 0.0306769 * (agec * hdlt) - 0.0946348 * (agec * sbpge)
          - 0.2705700 * (agec * dm) - 0.0787150 * (agec * sm) - 0.1637806 * (agec * egfrlt)
          - 3.3077280;
      } else {
        lp = 0.7688528 * agec + 0.0736174 * nonhdl - 0.0954431 * hdlt
          - 0.4347345 * sbplt + 0.3362658 * sbpge + 0.7692857 * dm + 0.4386871 * sm
          + 0.5378979 * egfrlt + 0.0164827 * egfrge + 0.2888790 * bt - 0.1337349 * st
          - 0.0475924 * (bt * sbpge) + 0.1502730 * (st * nonhdl)
          - 0.0517874 * (agec * nonhdl) + 0.0191169 * (agec * hdlt) - 0.1049477 * (agec * sbpge)
          - 0.2251948 * (agec * dm) - 0.0895067 * (agec * sm) - 0.1543702 * (agec * egfrlt)
          - 3.0311680;
      }

      var risk = 100 / (1 + Math.exp(-lp));
      if (!isFinite(risk)) return null;
      if (risk < 0) risk = 0;
      if (risk > 100) risk = 100;

      var level, text;
      if (risk < 5) { level = 'low'; text = 'Low 10-year total-CVD risk (< 5%).'; }
      else if (risk < 7.5) { level = 'mod'; text = 'Borderline 10-year total-CVD risk (5 to < 7.5%).'; }
      else if (risk < 20) { level = 'high'; text = 'Intermediate 10-year total-CVD risk (7.5 to < 20%).'; }
      else { level = 'vhigh'; text = 'High 10-year total-CVD risk (≥ 20%).'; }

      var detail = (female ? 'Female' : 'Male') + ' PREVENT base equation (race-free), 10-year total CVD (ASCVD + heart failure).'
        + '\nCholesterol converted mg/dL → mmol/L (× 0.02586) internally.'
        + '\nThe total-CVD endpoint is broader than ASCVD, so thresholds are not identical to the Pooled Cohort Equations.';
      if (age < 30 || age > 79) detail += '\n⚠ Validated only for ages 30–79.';
      return { value: risk.toFixed(1), unit: '%', text: text, level: level, detail: detail };
    },
    notes: 'Native implementation of the 2023 AHA PREVENT sex-specific, race-free base equation for 10-year TOTAL CVD (ASCVD + heart failure) in adults 30–79. Coefficients verified against the Circulation 2024 supplement via two independent open-source packages (preventr, PooledCohort) that agree to every decimal; reproduces the package worked example (14.7%). This implements only the 10-year total-CVD base model — the separate ASCVD-only, heart-failure, and 30-year equations, and the optional UACR/HbA1c/social-deprivation-index predictors, are not included. BMI is not part of the total-CVD base model. Cholesterol is entered in mg/dL and converted internally. Verify against the primary publication before clinical use.',
    refs: [
      'Khan SS, Matsushita K, Sang Y, et al. Development and Validation of the American Heart Association Predicting Risk of Cardiovascular Disease EVENTs (PREVENT) Equations. Circulation 2024;149:430-449.'
    ]
  });

  /* ---------- LDL by Friedewald (custom) ---------- */
  CARDIO.register({
    id: 'ldl-friedewald',
    name: 'LDL Cholesterol (Friedewald)',
    category: 'prevention',
    short: 'Calculated LDL-C with non-HDL cholesterol and TC/HDL ratio',
    keywords: ['ldl', 'friedewald', 'non-hdl', 'lipid panel', 'cholesterol ratio'],
    kind: 'custom',
    inputs: [
      { id: 'tc', label: 'Total cholesterol', type: 'number', unit: 'mg/dL', units: [{ label: 'mg/dL', factor: 1, system: 'us' }, { label: 'mmol/L', factor: 38.67, system: 'si' }], min: 50, max: 600, step: 1, placeholder: 'e.g., 200' },
      { id: 'hdl', label: 'HDL cholesterol', type: 'number', unit: 'mg/dL', units: [{ label: 'mg/dL', factor: 1, system: 'us' }, { label: 'mmol/L', factor: 38.67, system: 'si' }], min: 10, max: 150, step: 1, placeholder: 'e.g., 50' },
      { id: 'tg', label: 'Triglycerides', type: 'number', unit: 'mg/dL', units: [{ label: 'mg/dL', factor: 1, system: 'us' }, { label: 'mmol/L', factor: 88.57, system: 'si' }], min: 20, max: 2000, step: 1, placeholder: 'e.g., 150' }
    ],
    compute: function (v) {
      var tc = v.tc, hdl = v.hdl, tg = v.tg;
      if (tc == null || hdl == null || tg == null) return null;
      if (tc <= 0 || hdl <= 0 || tg < 0) return null;
      var nonhdl = tc - hdl;
      var ratio = hdl > 0 ? tc / hdl : null;

      if (tg > 400) {
        var d = 'Non-HDL cholesterol = ' + nonhdl.toFixed(0) + ' mg/dL (remains valid).';
        if (ratio) d += '\nTotal cholesterol / HDL ratio = ' + ratio.toFixed(1) + '.';
        return {
          value: '—', unit: 'mg/dL',
          text: 'Triglycerides > 400 mg/dL: the Friedewald equation is invalid. Obtain a direct LDL, or use a validated alternative (Martin/Hopkins or Sampson).',
          level: 'info', badge: 'TG too high', detail: d
        };
      }

      var ldl = tc - hdl - tg / 5;
      var level, text;
      if (ldl < 100) { level = 'low'; text = 'LDL-C optimal (< 100 mg/dL).'; }
      else if (ldl < 130) { level = 'low'; text = 'LDL-C near/above optimal (100–129 mg/dL).'; }
      else if (ldl < 160) { level = 'mod'; text = 'LDL-C borderline high (130–159 mg/dL).'; }
      else if (ldl < 190) { level = 'high'; text = 'LDL-C high (160–189 mg/dL).'; }
      else { level = 'vhigh'; text = 'LDL-C very high (≥ 190 mg/dL) — consider familial hypercholesterolemia; high-intensity statin indicated.'; }

      var detail = 'Non-HDL cholesterol = ' + nonhdl.toFixed(0) + ' mg/dL (goal is generally 30 mg/dL above the LDL goal).';
      if (ratio) detail += '\nTotal cholesterol / HDL ratio = ' + ratio.toFixed(1) + '.';
      detail += '\nFriedewald: LDL = TC − HDL − (TG / 5), mg/dL.';
      return { value: ldl.toFixed(0), unit: 'mg/dL', text: text, level: level, detail: detail };
    },
    notes: 'Friedewald estimate is unreliable when triglycerides exceed 400 mg/dL and underestimates LDL-C at low LDL/high TG levels; the Martin/Hopkins method (variable factor) is more accurate in those settings. LDL categories shown follow NCEP ATP III; treatment targets depend on overall ASCVD risk. Non-HDL cholesterol is valid regardless of triglyceride level and is a secondary target of therapy.',
    refs: [
      'Friedewald WT, Levy RI, Fredrickson DS. Clin Chem 1972;18:499-502.',
      'Expert Panel (NCEP ATP III). JAMA 2001;285:2486-97.',
      'Martin SS, Blaha MJ, Elshazly MB, et al. JAMA 2013;310:2061-8.'
    ]
  });

  /* ---------- Lipoprotein(a) interpretation (custom) ---------- */
  CARDIO.register({
    id: 'lipoprotein-a',
    name: 'Lipoprotein(a) Interpretation',
    category: 'prevention',
    short: 'Risk banding of a measured Lp(a) level',
    keywords: ['lp(a)', 'lipoprotein a', 'lpa', 'residual risk', 'aortic stenosis'],
    kind: 'custom',
    inputs: [
      { id: 'lpa', label: 'Lipoprotein(a)', type: 'number', unit: 'mg/dL', min: 0, max: 400, step: 1, placeholder: 'e.g., 40', hint: 'Enter the mass value in mg/dL' }
    ],
    compute: function (v) {
      var x = v.lpa;
      if (x == null) return null;
      if (x < 0) return null;
      var level, text;
      if (x < 30) { level = 'low'; text = 'Desirable / low risk (< 30 mg/dL).'; }
      else if (x <= 50) { level = 'mod'; text = 'Grey zone / borderline (30–50 mg/dL). Interpret alongside global ASCVD risk and family history.'; }
      else { level = 'high'; text = 'Elevated (> 50 mg/dL) — independently associated with increased risk of ASCVD and calcific aortic valve stenosis.'; }
      return {
        value: x.toFixed(0), unit: 'mg/dL', text: text, level: level,
        detail: 'Approximate molar-unit thresholds: < 75 low, 75–125 borderline, > 125 nmol/L elevated. Mass (mg/dL) and molar (nmol/L) values do not convert linearly and depend on the assay — do not interconvert. Lp(a) is ~80–90% genetically determined and stable through life, so a single measurement usually suffices.'
      };
    },
    notes: 'Thresholds follow ESC/EAS consensus guidance (elevated ≳ 50 mg/dL or ≳ 125 nmol/L); Lp(a) confers a continuous, graded risk rather than a hard cut-off, and isoform-sensitive assays vary. Measure once in most adults to refine risk; consider more strongly in premature ASCVD, familial hypercholesterolemia or a strong family history.',
    refs: [
      'Kronenberg F, Mora S, Stroes ESG, et al. Lipoprotein(a) in atherosclerotic cardiovascular disease and aortic stenosis: EAS consensus statement. Eur Heart J 2022;43:3925-3946.',
      'Wilson DP, Jacobson TA, Jones PH, et al. J Clin Lipidol 2019;13:374-392.'
    ]
  });

})();
