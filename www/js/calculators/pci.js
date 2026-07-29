/* Category: pci — Interventional cardiology & PCI
 * Each entry follows SCHEMA.md. Point values verified against primary publications.
 * Per the user's requirement, every score is computed on-device (no external links).
 * Where a model is proprietary or its exact coefficients are not public, a clearly
 * labeled local approximation/simplified estimator is provided instead. */
(function () {
  'use strict';

  /* Linear interpolation between anchor points of a nomogram axis, with clamping
   * to the endpoints (used for PRECISE-DAPT, whose per-unit values are not tabulated). */
  function interpAxis(x, pts) {
    // pts: array of [xValue, points] sorted ascending by xValue.
    if (x <= pts[0][0]) return pts[0][1];
    var last = pts[pts.length - 1];
    if (x >= last[0]) return last[1];
    for (var i = 0; i < pts.length - 1; i++) {
      var a = pts[i], b = pts[i + 1];
      if (x >= a[0] && x <= b[0]) {
        var frac = (x - a[0]) / (b[0] - a[0]);
        return a[1] + frac * (b[1] - a[1]);
      }
    }
    return last[1];
  }

  /* ---------- DAPT score ---------- */
  CARDIO.register({
    id: 'dapt-score',
    name: 'DAPT Score',
    category: 'pci',
    short: 'Benefit vs harm of prolonging dual antiplatelet therapy beyond 12 months after PCI',
    keywords: ['dapt', 'dual antiplatelet', 'stent', 'thienopyridine', 'clopidogrel', 'prasugrel', 'duration'],
    inputs: [
      { id: 'age', label: 'Age', type: 'select', options: [
        { label: '< 65 years', points: 0 },
        { label: '65–74 years', points: -1 },
        { label: '≥ 75 years', points: -2 }
      ] },
      { id: 'smoker', label: 'Current cigarette smoker', type: 'check', points: 1 },
      { id: 'dm', label: 'Diabetes mellitus', type: 'check', points: 1 },
      { id: 'mi', label: 'MI at presentation', hint: 'Index PCI performed for myocardial infarction', type: 'check', points: 1 },
      { id: 'priormi', label: 'Prior PCI or prior MI', type: 'check', points: 1 },
      { id: 'pes', label: 'Paclitaxel-eluting stent', type: 'check', points: 1 },
      { id: 'smallstent', label: 'Stent diameter < 3 mm', type: 'check', points: 1 },
      { id: 'chf', label: 'CHF or LVEF < 30%', type: 'check', points: 2 },
      { id: 'svg', label: 'Vein-graft stent (saphenous vein graft PCI)', type: 'check', points: 2 }
    ],
    result: { unit: 'points' },
    interpret: [
      { upTo: 1, text: 'Score < 2: prolonged DAPT not favored. In the DAPT Study, continuing thienopyridine beyond 12 months in low-score patients increased moderate/severe bleeding more than it reduced ischemic events.', level: 'low' },
      { upTo: 10, text: 'Score ≥ 2: favors prolonged DAPT. In the DAPT Study, high-score patients had a substantially larger reduction in MI/stent thrombosis than the increase in bleeding with thienopyridine continuation beyond 12 months.', level: 'mod' }
    ],
    notes: 'Apply at 12 months to patients who completed 1 year of DAPT after coronary stenting without MI, repeat revascularization, stroke, or moderate/severe bleeding. Score range −2 to +10. Not designed for decision-making at the time of PCI; weigh against bleeding risk (e.g., PRECISE-DAPT at implantation).',
    refs: [
      'Yeh RW et al. JAMA 2016;315:1735-49.',
      'Mauri L et al. N Engl J Med 2014;371:2155-66.'
    ]
  });

  /* ---------- ARC-HBR ---------- */
  CARDIO.register({
    id: 'arc-hbr',
    name: 'ARC-HBR Criteria',
    category: 'pci',
    short: 'Academic Research Consortium definition of high bleeding risk after PCI',
    keywords: ['bleeding', 'high bleeding risk', 'hbr', 'stent', 'dapt', 'consensus'],
    kind: 'custom',
    inputs: [
      { id: 'majOac', label: 'MAJOR — Anticipated long-term oral anticoagulation', type: 'check' },
      { id: 'majCkd', label: 'MAJOR — Severe or end-stage CKD (eGFR < 30 mL/min)', type: 'check' },
      { id: 'majHgb', label: 'MAJOR — Hemoglobin < 11 g/dL', type: 'check' },
      { id: 'majBleed', label: 'MAJOR — Spontaneous bleeding requiring hospitalization or transfusion in the past 6 months, or at any time if recurrent', type: 'check' },
      { id: 'majPlt', label: 'MAJOR — Moderate/severe thrombocytopenia (platelets < 100 ×10⁹/L)', type: 'check' },
      { id: 'majDiathesis', label: 'MAJOR — Chronic bleeding diathesis', type: 'check' },
      { id: 'majCirrhosis', label: 'MAJOR — Liver cirrhosis with portal hypertension', type: 'check' },
      { id: 'majCancer', label: 'MAJOR — Active malignancy within the past 12 months', hint: 'Excluding non-melanoma skin cancer', type: 'check' },
      { id: 'majIch', label: 'MAJOR — Prior spontaneous ICH (any time), traumatic ICH within 12 months, brain AVM, or moderate/severe ischemic stroke within 6 months', type: 'check' },
      { id: 'majSurgDapt', label: 'MAJOR — Non-deferrable major surgery on DAPT', type: 'check' },
      { id: 'majRecentSurg', label: 'MAJOR — Major surgery or major trauma within 30 days before PCI', type: 'check' },
      { id: 'minAge', label: 'MINOR — Age ≥ 75 years', type: 'check' },
      { id: 'minCkd', label: 'MINOR — Moderate CKD (eGFR 30–59 mL/min)', type: 'check' },
      { id: 'minHgb', label: 'MINOR — Hemoglobin 11–12.9 g/dL (men) or 11–11.9 g/dL (women)', type: 'check' },
      { id: 'minBleed', label: 'MINOR — Spontaneous bleeding requiring hospitalization or transfusion within the past 12 months, not meeting the major criterion', type: 'check' },
      { id: 'minNsaid', label: 'MINOR — Long-term oral NSAIDs or steroids', type: 'check' },
      { id: 'minStroke', label: 'MINOR — Any ischemic stroke at any time, not meeting the major criterion', type: 'check' }
    ],
    compute: function (v) {
      var majors = ['majOac', 'majCkd', 'majHgb', 'majBleed', 'majPlt', 'majDiathesis', 'majCirrhosis', 'majCancer', 'majIch', 'majSurgDapt', 'majRecentSurg'];
      var minors = ['minAge', 'minCkd', 'minHgb', 'minBleed', 'minNsaid', 'minStroke'];
      var nMaj = 0, nMin = 0, i;
      for (i = 0; i < majors.length; i++) { if (v[majors[i]]) nMaj++; }
      for (i = 0; i < minors.length; i++) { if (v[minors[i]]) nMin++; }
      var hbr = nMaj >= 1 || nMin >= 2;
      var text = hbr
        ? 'Meets the ARC-HBR definition of high bleeding risk (≥ 1 major or ≥ 2 minor criteria): anticipated BARC 3 or 5 bleeding ≥ 4%/yr or intracranial hemorrhage ≥ 1%/yr. Favor shorter or less intense antiplatelet regimens and bleeding-avoidance strategies.'
        : 'Does not meet the ARC-HBR definition of high bleeding risk (fewer than 1 major and fewer than 2 minor criteria).';
      return {
        value: hbr ? 'HBR' : 'Not HBR',
        unit: '',
        text: text,
        level: hbr ? 'high' : 'low',
        detail: 'Major criteria met: ' + nMaj + ' · Minor criteria met: ' + nMin,
        badge: hbr ? 'High bleeding risk' : 'Not high bleeding risk'
      };
    },
    notes: 'Consensus definition, not a weighted score: a patient is at high bleeding risk if ≥ 1 major or ≥ 2 minor criteria are met. HBR is defined as an anticipated 1-year risk of BARC 3 or 5 bleeding ≥ 4% or of intracranial hemorrhage ≥ 1%.',
    refs: [
      'Urban P et al. Circulation 2019;140:240-61.',
      'Urban P et al. Eur Heart J 2019;40:2632-53.'
    ]
  });

  /* ---------- Mehran score (2004) — contrast-induced nephropathy ---------- */
  CARDIO.register({
    id: 'mehran-cin',
    name: 'Mehran Score (CIN after PCI)',
    category: 'pci',
    short: 'Risk of contrast-induced nephropathy after percutaneous coronary intervention',
    keywords: ['contrast', 'nephropathy', 'cin', 'aki', 'kidney', 'angiography', 'mehran'],
    kind: 'custom',
    inputs: [
      { id: 'hypo', label: 'Hypotension', hint: 'SBP < 80 mmHg for ≥ 1 h requiring inotropic support or IABP within 24 h of the procedure', type: 'check', points: 5 },
      { id: 'iabp', label: 'Intra-aortic balloon pump (IABP)', type: 'check', points: 5 },
      { id: 'chf', label: 'Congestive heart failure', hint: 'NYHA class III/IV or history of pulmonary edema', type: 'check', points: 5 },
      { id: 'age', label: 'Age > 75 years', type: 'check', points: 4 },
      { id: 'anemia', label: 'Anemia', hint: 'Baseline hematocrit < 39% (men) or < 36% (women)', type: 'check', points: 3 },
      { id: 'dm', label: 'Diabetes mellitus', type: 'check', points: 3 },
      { id: 'contrast', label: 'Contrast volume', type: 'number', unit: 'mL', min: 0, max: 1500, step: 10, placeholder: 'e.g., 150', hint: '1 point per 100 mL' },
      { id: 'egfr', label: 'Estimated GFR (mL/min/1.73 m²)', type: 'select', options: [
        { label: '≥ 60', points: 0 },
        { label: '40–60', points: 2 },
        { label: '20–40', points: 4 },
        { label: '< 20', points: 6 }
      ] }
    ],
    compute: function (v) {
      if (v.contrast == null || v.contrast < 0) return null;
      var pts = 0;
      var parts = [];
      if (v.hypo) { pts += 5; parts.push('hypotension +5'); }
      if (v.iabp) { pts += 5; parts.push('IABP +5'); }
      if (v.chf) { pts += 5; parts.push('CHF +5'); }
      if (v.age) { pts += 4; parts.push('age > 75 +4'); }
      if (v.anemia) { pts += 3; parts.push('anemia +3'); }
      if (v.dm) { pts += 3; parts.push('diabetes +3'); }
      var eg = v.egfr || 0;
      if (eg) { pts += eg; parts.push('eGFR +' + eg); }
      var cv = v.contrast / 100;
      pts += cv;
      parts.push('contrast +' + (Math.round(cv * 10) / 10));
      var score = Math.round(pts);
      var text, level;
      if (score <= 5) {
        text = 'Low risk (score ≤ 5): ~7.5% risk of CIN; ~0.04% risk of dialysis.'; level = 'low';
      } else if (score <= 10) {
        text = 'Moderate risk (score 6–10): ~14.0% risk of CIN; ~0.12% risk of dialysis.'; level = 'mod';
      } else if (score <= 15) {
        text = 'High risk (score 11–15): ~26.1% risk of CIN; ~1.09% risk of dialysis.'; level = 'high';
      } else {
        text = 'Very high risk (score ≥ 16): ~57.3% risk of CIN; ~12.6% risk of dialysis.'; level = 'vhigh';
      }
      return { value: String(score), unit: 'points', text: text, level: level, detail: 'Points: ' + (parts.length ? parts.join(', ') : 'none') };
    },
    notes: 'CIN = rise in serum creatinine ≥ 25% or ≥ 0.5 mg/dL within 48 h of contrast. Contrast contributes 1 point per 100 mL (prorated here; the total is rounded to the nearest integer). The original score alternatively assigns 4 points for serum creatinine > 1.5 mg/dL in place of the eGFR bands. Derived and validated in PCI cohorts; event rates are from the 2004 derivation.',
    refs: ['Mehran R et al. J Am Coll Cardiol 2004;44:1393-9.']
  });

  /* ---------- PRECISE-DAPT (local nomogram approximation) ----------
   * The PRECISE-DAPT score is a graphical nomogram (Costa 2017, Fig 2); exact per-unit
   * point coefficients were never published as a table. This implements a local
   * approximation using the confirmed nomogram axis endpoints/truncations with linear
   * interpolation between them. Confirmed anchors:
   *   Age:        <=50 -> 0 pts; >=90 -> ~19 pts (truncated 50-90)
   *   CrCl:       >=100 -> 0 pts; 0 -> ~25 pts   (truncated at 100)
   *   Hemoglobin: >=12 -> 0 pts; <=10 -> ~15 pts (truncated 10-12)
   *   WBC:        <=5 -> 0 pts; >=20 -> ~15 pts   (truncated 5-20)
   *   Prior spontaneous bleeding: 26 pts
   * Only the >=25 vs <25 dichotomy is a validated primary-source interpretation band. */
  CARDIO.register({
    id: 'precise-dapt',
    name: 'PRECISE-DAPT',
    category: 'pci',
    short: 'Out-of-hospital bleeding risk during DAPT after coronary stenting',
    keywords: ['bleeding', 'dual antiplatelet', 'dapt duration', 'stent'],
    kind: 'custom',
    inputs: [
      { id: 'age', label: 'Age', type: 'number', unit: 'years', min: 18, max: 110, step: 1, placeholder: 'e.g., 72', hint: 'Nomogram truncated 50–90 years' },
      { id: 'crcl', label: 'Creatinine clearance (Cockcroft-Gault)', type: 'number', unit: 'mL/min', min: 0, max: 200, step: 1, placeholder: 'e.g., 55', hint: 'Truncated at 100 mL/min (values ≥100 add 0)' },
      { id: 'hgb', label: 'Hemoglobin', type: 'number', unit: 'g/dL', min: 4, max: 20, step: 0.1, placeholder: 'e.g., 11.5', hint: 'Truncated 10–12 g/dL' },
      { id: 'wbc', label: 'White blood cell count', type: 'number', unit: '×10⁹/L', min: 1, max: 50, step: 0.1, placeholder: 'e.g., 8.5', hint: 'Truncated 5–20 ×10⁹/L' },
      { id: 'bleed', label: 'Prior spontaneous bleeding', hint: 'Documented prior spontaneous bleeding requiring medical attention', type: 'check' }
    ],
    compute: function (v) {
      if (v.age == null || v.crcl == null || v.hgb == null || v.wbc == null) return null;
      var pAge = interpAxis(v.age, [[50, 0], [90, 19]]);
      var pCrcl = interpAxis(v.crcl, [[0, 25], [100, 0]]);
      var pHgb = interpAxis(v.hgb, [[10, 15], [12, 0]]);
      var pWbc = interpAxis(v.wbc, [[5, 0], [20, 15]]);
      var pBleed = v.bleed ? 26 : 0;
      var total = pAge + pCrcl + pHgb + pWbc + pBleed;
      var score = Math.round(total);
      var text, level;
      if (score >= 25) {
        text = 'Score ≥ 25: high bleeding risk. In Costa 2017, prolonging DAPT (12–24 mo) in this group significantly increased bleeding with no ischemic benefit — favor shorter DAPT (3–6 months).';
        level = 'high';
      } else {
        text = 'Score < 25: not high bleeding risk. Longer DAPT (12–24 mo) did not significantly increase bleeding and provided ischemic benefit; standard or longer DAPT is reasonable.';
        level = 'low';
      }
      var detail = 'Approx. nomogram points — age ' + Math.round(pAge) +
        ', CrCl ' + Math.round(pCrcl) + ', Hgb ' + Math.round(pHgb) +
        ', WBC ' + Math.round(pWbc) + ', prior bleeding ' + pBleed;
      return { value: String(score), unit: '/100', text: text, level: level, detail: detail };
    },
    notes: 'LOCAL APPROXIMATION of a graphical nomogram. Costa 2017 published PRECISE-DAPT only as a nomogram (Fig 2); exact per-unit point values were never tabulated. This tool uses the confirmed axis endpoints (age →19, CrCl →25, Hgb →15, WBC →15, prior bleeding = 26) with LINEAR interpolation, so intermediate values are approximate (the true axes are mildly curved splines) and may differ by a few points near mid-range. Only the ≥ 25 vs < 25 high-bleeding-risk dichotomy is a validated primary-source cut-off. Uses Cockcroft-Gault creatinine clearance as in the original. Verify against the primary publication before clinical use.',
    refs: ['Costa F et al. Lancet 2017;389:1025-34.']
  });

  /* ---------- SYNTAX score (local single-lesion component tool) ----------
   * The full anatomical SYNTAX score sums per-lesion values across an interactive
   * coronary tree: base = segment weight x (2 non-occlusive, 5 total occlusion),
   * plus fixed additive modifier points. The SEGMENT WEIGHTS (dominance-dependent,
   * 0.5-6.0 per segment) require the official interactive tool. This local tool lets
   * the clinician enter a segment weight and the standard modifier points for ONE
   * lesion and returns that lesion's contribution; a full score is the sum across all
   * diseased lesions. Modifier point values below are the fixed algorithm weights
   * (Sianos 2005 / syntaxscore.org tutorial) and are exact. */
  CARDIO.register({
    id: 'syntax',
    name: 'SYNTAX Score (per-lesion tool)',
    category: 'pci',
    short: 'Angiographic complexity of coronary artery disease (PCI vs CABG decision-making)',
    keywords: ['anatomy', 'cabg', 'left main', 'multivessel', 'revascularization', 'heart team'],
    kind: 'custom',
    inputs: [
      { id: 'weight', label: 'Segment weight (from SYNTAX segment map)', type: 'number', min: 0, max: 6, step: 0.5, placeholder: 'e.g., 3.5', hint: 'Dominance-dependent value 0.5–6.0 for the diseased segment (see segment weighting chart)' },
      { id: 'occ', label: 'Occlusion severity', type: 'select', options: [
        { label: 'Significant stenosis 50–99% (×2)', value: 2 },
        { label: 'Total occlusion 100% (×5)', value: 5 }
      ] },
      { id: 'toAge', label: 'Total occlusion: age > 3 months / unknown', type: 'check', points: 1 },
      { id: 'toStump', label: 'Total occlusion: blunt stump', type: 'check', points: 1 },
      { id: 'toBridge', label: 'Total occlusion: bridging collaterals', type: 'check', points: 1 },
      { id: 'toSeg', label: 'Total occlusion: non-visible segments beyond occlusion', type: 'select', options: [
        { label: 'None', value: 0 },
        { label: '1 segment (+1)', value: 1 },
        { label: '2 segments (+2)', value: 2 },
        { label: '3 segments (+3)', value: 3 }
      ] },
      { id: 'toSide', label: 'Total occlusion: side branch ≥1.5 mm at occlusion', type: 'check', points: 1 },
      { id: 'trif', label: 'Trifurcation (diseased segments)', type: 'select', options: [
        { label: 'Not a trifurcation', value: 0 },
        { label: '1 segment (+3)', value: 3 },
        { label: '2 segments (+4)', value: 4 },
        { label: '3 segments (+5)', value: 5 },
        { label: '4 segments (+6)', value: 6 }
      ] },
      { id: 'bifur', label: 'Bifurcation type', type: 'select', options: [
        { label: 'Not a bifurcation', value: 0 },
        { label: 'Medina A/B/C (+1)', value: 1 },
        { label: 'Medina D/E/F/G (+2)', value: 2 }
      ] },
      { id: 'bifAngle', label: 'Bifurcation angulation < 70°', type: 'check', points: 1 },
      { id: 'ostial', label: 'Aorto-ostial lesion', type: 'check', points: 1 },
      { id: 'tort', label: 'Severe tortuosity proximal to lesion', type: 'check', points: 2 },
      { id: 'length', label: 'Lesion length > 20 mm', type: 'check', points: 1 },
      { id: 'calc', label: 'Heavy calcification', type: 'check', points: 2 },
      { id: 'thromb', label: 'Thrombus', type: 'check', points: 1 },
      { id: 'diffuse', label: 'Diffuse disease / small vessels (segments)', type: 'select', options: [
        { label: 'None', value: 0 },
        { label: '1 segment (+1)', value: 1 },
        { label: '2 segments (+2)', value: 2 },
        { label: '3 segments (+3)', value: 3 },
        { label: '4 segments (+4)', value: 4 }
      ] }
    ],
    compute: function (v) {
      if (v.weight == null) return null;
      var mult = v.occ || 2;
      var base = v.weight * mult;
      var adds = 0;
      var parts = [];
      parts.push('base ' + v.weight + ' ×' + mult + ' = ' + base);
      if (mult === 5) {
        if (v.toAge) { adds += 1; parts.push('occ >3 mo +1'); }
        if (v.toStump) { adds += 1; parts.push('blunt stump +1'); }
        if (v.toBridge) { adds += 1; parts.push('bridging collaterals +1'); }
        if (v.toSeg) { adds += v.toSeg; parts.push('non-visible segments +' + v.toSeg); }
        if (v.toSide) { adds += 1; parts.push('side branch +1'); }
      }
      if (v.trif) { adds += v.trif; parts.push('trifurcation +' + v.trif); }
      if (v.bifur) { adds += v.bifur; parts.push('bifurcation +' + v.bifur); }
      if (v.bifAngle) { adds += 1; parts.push('bifurcation angle <70° +1'); }
      if (v.ostial) { adds += 1; parts.push('aorto-ostial +1'); }
      if (v.tort) { adds += 2; parts.push('severe tortuosity +2'); }
      if (v.length) { adds += 1; parts.push('length >20 mm +1'); }
      if (v.calc) { adds += 2; parts.push('heavy calcification +2'); }
      if (v.thromb) { adds += 1; parts.push('thrombus +1'); }
      if (v.diffuse) { adds += v.diffuse; parts.push('diffuse disease +' + v.diffuse); }
      var lesion = base + adds;
      return {
        value: String(Math.round(lesion * 10) / 10),
        unit: 'points (this lesion)',
        text: 'Contribution of THIS lesion to the anatomical SYNTAX score. Sum this across every diseased lesion for the total. Tertiles (total score): low 0–22, intermediate 23–32, high ≥ 33 — high scores favor CABG over PCI in complex/left-main disease.',
        level: 'info',
        detail: parts.join(', ')
      };
    },
    notes: 'SIMPLIFIED per-lesion aid, NOT the full calculator. The complete anatomical SYNTAX score requires the official interactive segment tree (syntaxscore.org): it depends on coronary dominance and the 0.5–6.0 segment-weight map, which this tool asks you to supply per lesion rather than derive. The additive modifier weights implemented here are the exact fixed algorithm values (Sianos 2005). Use the full per-segment SYNTAX algorithm for revascularization decisions. Verify against the primary publication before clinical use.',
    refs: [
      'Sianos G et al. EuroIntervention 2005;1:219-27.',
      'Serruys PW et al. N Engl J Med 2009;360:961-72.'
    ]
  });

  /* ---------- SYNTAX score II (local simplified directional aid) ----------
   * The validated SYNTAX Score II (Farooq 2013) is a Cox model with treatment
   * interaction terms rendered as a nomogram; its exact per-variable coefficients live
   * only in the paywalled Lancet supplementary appendix and cannot be reproduced here.
   * This tool collects the 8 correct inputs and returns a clearly-labeled DIRECTIONAL
   * steer based on the published interaction directions (which factors shift the
   * PCI-vs-CABG crossover) — it does NOT output a numeric predicted mortality. */
  CARDIO.register({
    id: 'syntax-2',
    name: 'SYNTAX Score II (simplified aid)',
    category: 'pci',
    short: 'Anatomical SYNTAX plus clinical variables to compare mortality after CABG vs PCI',
    keywords: ['cabg', 'revascularization', 'mortality', 'heart team', 'left main', 'multivessel'],
    kind: 'custom',
    inputs: [
      { id: 'anat', label: 'Anatomical SYNTAX score', type: 'number', min: 0, max: 100, step: 1, placeholder: 'e.g., 26' },
      { id: 'age', label: 'Age', type: 'number', unit: 'years', min: 18, max: 110, step: 1, placeholder: 'e.g., 68' },
      { id: 'crcl', label: 'Creatinine clearance', type: 'number', unit: 'mL/min', min: 0, max: 200, step: 1, placeholder: 'e.g., 60' },
      { id: 'lvef', label: 'Left ventricular ejection fraction', type: 'number', unit: '%', min: 5, max: 80, step: 1, placeholder: 'e.g., 55' },
      { id: 'ulm', label: 'Unprotected left main disease', type: 'check' },
      { id: 'pvd', label: 'Peripheral vascular disease', type: 'check' },
      { id: 'sex', label: 'Female sex', type: 'check' },
      { id: 'copd', label: 'COPD', type: 'check' }
    ],
    compute: function (v) {
      if (v.anat == null || v.age == null || v.crcl == null || v.lvef == null) return null;
      // Directional heuristic only (NOT the validated nomogram): count published
      // factors that push toward CABG vs toward PCI, anchored on anatomical complexity.
      var cabg = [], pci = [];
      if (v.anat >= 33) cabg.push('high anatomical SYNTAX (≥33)');
      else if (v.anat <= 22) pci.push('low anatomical SYNTAX (≤22)');
      if (v.age >= 75) pci.push('older age');
      else if (v.age <= 60) cabg.push('younger age');
      if (v.copd) pci.push('COPD');
      if (v.ulm) pci.push('unprotected left main');
      if (v.lvef < 40) cabg.push('reduced LVEF');
      if (v.sex) cabg.push('female sex');
      if (v.crcl < 60) cabg.push('reduced creatinine clearance');
      var text, level;
      if (v.anat >= 33) {
        text = 'High anatomical complexity generally favors CABG. Confirm with the official SYNTAX Score II calculator, which weighs the clinical factors quantitatively.';
        level = 'high';
      } else if (v.anat <= 22) {
        text = 'Lower anatomical complexity often permits equipoise or favors PCI, subject to the clinical variables. Confirm with the official SYNTAX Score II calculator.';
        level = 'mod';
      } else {
        text = 'Intermediate anatomical complexity: the CABG-vs-PCI choice hinges on the clinical variables and must be quantified with the official SYNTAX Score II calculator.';
        level = 'mod';
      }
      var detail = 'Directional factors — toward CABG: ' + (cabg.length ? cabg.join(', ') : 'none') +
        '\nToward PCI: ' + (pci.length ? pci.join(', ') : 'none') +
        '\n(Directional only; no numeric mortality is computed here.)';
      return { value: '—', unit: '', text: text, level: level, detail: detail, badge: 'Directional aid' };
    },
    notes: 'SIMPLIFIED, NON-VALIDATED directional aid — it does NOT reproduce the SYNTAX Score II and outputs no numeric predicted mortality. The real model (Farooq 2013) is a Cox model with treatment-interaction terms whose exact coefficients are only in the paywalled Lancet supplementary appendix, so they are not implemented here. The heuristic above reflects the published directions in which each factor shifts the PCI-vs-CABG crossover (e.g., older age/COPD/left main tend to favor PCI; higher anatomical complexity, reduced LVEF, female sex tend to favor CABG). Use the official SYNTAX Score II calculator for any decision. Verify against the primary publication before clinical use.',
    refs: ['Farooq V et al. Lancet 2013;381:639-50.']
  });

  /* ---------- NCDR CathPCI in-hospital mortality (Brennan 2013 bedside score) ----------
   * Integer additive bedside risk score with a published total-points -> in-hospital
   * mortality lookup (Brennan 2013, NCDR CathPCI, 1,208,137 procedures; bedside score
   * C-index 0.925). Points and the lookup table below are reproduced verbatim from the
   * published table. This is the MORTALITY model (not bleeding or AKI). */
  CARDIO.register({
    id: 'ncdr-cathpci',
    name: 'NCDR CathPCI Mortality Score',
    category: 'pci',
    short: 'In-hospital mortality risk after PCI (ACC NCDR CathPCI bedside model, Brennan 2013)',
    keywords: ['mortality', 'registry', 'cathpci', 'ncdr', 'bedside', 'pci'],
    kind: 'custom',
    inputs: [
      { id: 'stemi', label: 'STEMI presentation', type: 'check', points: 6 },
      { id: 'age', label: 'Age', type: 'select', options: [
        { label: '< 60 years', value: 0 },
        { label: '60–70 years', value: 4 },
        { label: '70–80 years', value: 9 },
        { label: '≥ 80 years', value: 15 }
      ] },
      { id: 'bmi', label: 'Body mass index', type: 'select', options: [
        { label: '30–40 kg/m²', value: 0 },
        { label: '20–30 kg/m²', value: 1 },
        { label: '≥ 40 kg/m²', value: 3 },
        { label: '< 20 kg/m²', value: 5 }
      ] },
      { id: 'cvd', label: 'Cerebrovascular disease', type: 'check', points: 2 },
      { id: 'pad', label: 'Peripheral arterial disease', type: 'check', points: 3 },
      { id: 'lung', label: 'Chronic lung disease', type: 'check', points: 3 },
      { id: 'noPriorPci', label: 'No prior PCI', hint: 'Absence of prior PCI adds 3 points', type: 'check', points: 3 },
      { id: 'dm', label: 'Diabetes mellitus', type: 'select', options: [
        { label: 'None', value: 0 },
        { label: 'Non-insulin treated', value: 2 },
        { label: 'Insulin treated', value: 3 }
      ] },
      { id: 'gfr', label: 'Renal function (GFR, mL/min/1.73 m²)', type: 'select', options: [
        { label: '≥ 90', value: 0 },
        { label: '60–90', value: 3 },
        { label: '45–60', value: 7 },
        { label: '30–45', value: 11 },
        { label: 'Renal failure / dialysis', value: 16 }
      ] },
      { id: 'ef', label: 'Left ventricular ejection fraction', type: 'select', options: [
        { label: '≥ 50%', value: 0 },
        { label: '40–50%', value: 2 },
        { label: '30–40%', value: 4 },
        { label: '< 30%', value: 9 }
      ] },
      { id: 'shock', label: 'Cardiogenic shock / PCI status', type: 'select', options: [
        { label: 'Elective, no shock/salvage', value: 0 },
        { label: 'Urgent, no shock/salvage', value: 11 },
        { label: 'Emergency, no shock/salvage', value: 22 },
        { label: 'Transient shock, not salvage', value: 37 },
        { label: 'Sustained shock OR salvage alone', value: 43 },
        { label: 'Sustained shock AND salvage', value: 54 }
      ] },
      { id: 'nyha', label: 'Heart failure / NYHA class (within 2 weeks)', type: 'select', options: [
        { label: 'No heart failure', value: 0 },
        { label: 'NYHA class < IV', value: 3 },
        { label: 'NYHA class IV', value: 7 }
      ] },
      { id: 'arrest', label: 'Cardiac arrest within 24 h', type: 'check', points: 13 }
    ],
    compute: function (v) {
      var pts = 0;
      pts += v.stemi ? 6 : 0;
      pts += v.age || 0;
      pts += (v.bmi != null ? v.bmi : 0);
      pts += v.cvd ? 2 : 0;
      pts += v.pad ? 3 : 0;
      pts += v.lung ? 3 : 0;
      pts += v.noPriorPci ? 3 : 0;
      pts += v.dm || 0;
      pts += v.gfr || 0;
      pts += v.ef || 0;
      pts += v.shock || 0;
      pts += v.nyha || 0;
      pts += v.arrest ? 13 : 0;
      // Published total-points -> in-hospital mortality (%) lookup (5-point steps).
      var lut = [
        [0, 0], [6, 0.1], [10, 0.1], [15, 0.2], [20, 0.3], [25, 0.6], [30, 0.9],
        [35, 1.4], [40, 2.3], [45, 3.7], [50, 5.9], [55, 9.2], [60, 14.2],
        [65, 21.2], [70, 30.4], [75, 41.5], [80, 53.6], [85, 65.2], [90, 75.3],
        [95, 83.2], [100, 88.9], [105, 92.9], [110, 95.5], [115, 97.2],
        [120, 98.2], [125, 98.9], [130, 99.3], [135, 99.5]
      ];
      // Nearest tabulated total (table is in 5-point increments).
      var mort = lut[0][1];
      for (var i = 0; i < lut.length; i++) {
        if (pts >= lut[i][0]) mort = lut[i][1];
      }
      var level;
      if (mort < 1) level = 'low';
      else if (mort < 5) level = 'mod';
      else if (mort < 15) level = 'high';
      else level = 'vhigh';
      return {
        value: mort.toFixed(1),
        unit: '% in-hospital mortality',
        text: 'Predicted in-hospital mortality after PCI ≈ ' + mort.toFixed(1) + '% (' + pts + ' points). From the NCDR CathPCI bedside model (Brennan 2013; bedside-score C-index 0.925). Overall registry mortality was 1.4%, ranging from ~0.2% (elective) to ~66% (shock plus recent cardiac arrest).',
        level: level,
        detail: 'Total points: ' + pts + ' (mapped to the nearest 5-point row of the published risk table)'
      };
    },
    notes: 'This is the in-hospital MORTALITY model only (the separate CathPCI bleeding and AKI models are not implemented here). Points and the points→mortality lookup are reproduced from the published Brennan 2013 bedside risk score; the total is mapped to the nearest tabulated 5-point row. The full logistic model (Brennan 2013) has additional interaction terms and slightly higher discrimination (C-index 0.930). Verify against the primary publication before clinical use.',
    refs: [
      'Brennan JM et al. JACC Cardiovasc Interv 2013;6:790-9.',
      'Peterson ED et al. J Am Coll Cardiol 2010;55:1923-32.'
    ]
  });

})();
