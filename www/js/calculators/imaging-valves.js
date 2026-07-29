/* Category: imaging — Echocardiography, valve assessment & endocarditis
 * Each entry follows SCHEMA.md. Formulas/point values verified against primary
 * publications. Anything not certain is registered kind:'external' or omitted. */
(function () {
  'use strict';

  /* ---------- Wilkins (Abascal) mitral valve score (points) ---------- */
  CARDIO.register({
    id: 'wilkins-score',
    name: 'Wilkins Score (mitral valve)',
    category: 'imaging',
    short: 'Echo suitability of the mitral valve for balloon valvuloplasty',
    keywords: ['wilkins', 'mitral stenosis', 'balloon valvuloplasty', 'pmbv', 'abascal', 'echo score'],
    inputs: [
      { id: 'mobility', label: 'Leaflet mobility', type: 'select', options: [
        { label: '1 — Highly mobile, only leaflet tips restricted', points: 1 },
        { label: '2 — Mid and base portions have normal mobility', points: 2 },
        { label: '3 — Valve moves forward in diastole mainly from the base', points: 3 },
        { label: '4 — No or minimal forward movement in diastole', points: 4 }
      ] },
      { id: 'thickening', label: 'Leaflet thickening', type: 'select', options: [
        { label: '1 — Near normal (4–5 mm)', points: 1 },
        { label: '2 — Mid-leaflets normal, marked thickening of margins (5–8 mm)', points: 2 },
        { label: '3 — Thickening extending through entire leaflet (5–8 mm)', points: 3 },
        { label: '4 — Marked thickening of all leaflet tissue (> 8–10 mm)', points: 4 }
      ] },
      { id: 'calcification', label: 'Calcification', type: 'select', options: [
        { label: '1 — Single area of increased echo brightness', points: 1 },
        { label: '2 — Scattered brightness confined to leaflet margins', points: 2 },
        { label: '3 — Brightness extending into mid-portion of leaflets', points: 3 },
        { label: '4 — Extensive brightness throughout much of the leaflet tissue', points: 4 }
      ] },
      { id: 'subvalvular', label: 'Subvalvular thickening', type: 'select', options: [
        { label: '1 — Minimal thickening just below the leaflets', points: 1 },
        { label: '2 — Thickening of chordae up to one third of chordal length', points: 2 },
        { label: '3 — Thickening extending to the distal third of the chordae', points: 3 },
        { label: '4 — Extensive thickening/shortening to the papillary muscles', points: 4 }
      ] }
    ],
    result: { unit: 'points' },
    interpret: [
      { upTo: 8, text: 'Favorable for percutaneous mitral balloon valvuloplasty (score ≤ 8); good immediate and long-term results are expected in suitable anatomy.', level: 'low' },
      { upTo: 11, text: 'Intermediate suitability (score 9–11); higher risk of a suboptimal result — weigh against surgery.', level: 'mod' },
      { upTo: 16, text: 'Unfavorable for valvuloplasty (score ≥ 12); surgery is usually preferred.', level: 'high' }
    ],
    notes: 'Total of four components (leaflet mobility, thickening, calcification, subvalvular thickening), each graded 1–4, range 4–16. The score does not capture commissural calcification or the degree of mitral regurgitation, which also influence candidacy; integrate with the overall echo and clinical picture.',
    refs: [
      'Wilkins GT, Weyman AE, Abascal VM, Block PC, Palacios IF. Percutaneous balloon dilatation of the mitral valve: an analysis of echocardiographic variables. Br Heart J 1988;60:299-308.'
    ]
  });

  /* ---------- Modified Duke criteria for infective endocarditis (custom) ---------- */
  CARDIO.register({
    id: 'duke-ie',
    name: 'Modified Duke Criteria (infective endocarditis)',
    category: 'imaging',
    short: 'Clinical classification of infective endocarditis likelihood',
    keywords: ['duke', 'endocarditis', 'ie', 'vegetation', 'blood culture', 'valve'],
    kind: 'custom',
    inputs: [
      { id: 'major_bc', label: 'Major — blood cultures positive for typical IE organisms', type: 'check', hint: 'Typical organisms from 2 separate cultures; persistently positive cultures; or single positive for Coxiella burnetii / phase I IgG > 1:800' },
      { id: 'major_endo', label: 'Major — imaging evidence of endocardial involvement', type: 'check', hint: 'Echo vegetation, abscess, or new prosthetic-valve dehiscence; or new valvular regurgitation' },
      { id: 'minor_predis', label: 'Minor — predisposing heart condition or injection drug use', type: 'check' },
      { id: 'minor_fever', label: 'Minor — fever ≥ 38°C (100.4°F)', type: 'check' },
      { id: 'minor_vasc', label: 'Minor — vascular phenomena', type: 'check', hint: 'Arterial emboli, septic pulmonary infarcts, mycotic aneurysm, intracranial or conjunctival hemorrhage, Janeway lesions' },
      { id: 'minor_immuno', label: 'Minor — immunologic phenomena', type: 'check', hint: 'Glomerulonephritis, Osler nodes, Roth spots, rheumatoid factor' },
      { id: 'minor_micro', label: 'Minor — microbiologic evidence not meeting a major criterion', type: 'check' }
    ],
    compute: function (v) {
      var major = (v.major_bc ? 1 : 0) + (v.major_endo ? 1 : 0);
      var minor = (v.minor_predis ? 1 : 0) + (v.minor_fever ? 1 : 0) + (v.minor_vasc ? 1 : 0)
        + (v.minor_immuno ? 1 : 0) + (v.minor_micro ? 1 : 0);

      var cls, level, text;
      if (major >= 2 || (major >= 1 && minor >= 3) || minor >= 5) {
        cls = 'Definite (clinical)'; level = 'high';
        text = 'Meets clinical criteria for DEFINITE infective endocarditis.';
      } else if ((major >= 1 && minor >= 1) || minor >= 3) {
        cls = 'Possible'; level = 'mod';
        text = 'Meets criteria for POSSIBLE infective endocarditis.';
      } else {
        cls = 'Not met'; level = 'low';
        text = 'Modified Duke criteria for definite/possible IE are not met (this does not exclude endocarditis).';
      }

      return {
        value: cls, unit: '', text: text, level: level,
        badge: major + ' major, ' + minor + ' minor',
        detail: 'Definite = 2 major, or 1 major + 3 minor, or 5 minor.\nPossible = 1 major + 1 minor, or 3 minor.\nRejected = firm alternative diagnosis, resolution with ≤ 4 days of antibiotics, or no pathologic evidence at surgery/autopsy.'
      };
    },
    notes: 'Implements the modified Duke criteria (Li 2000). Pathologic criteria (organisms on culture/histology of a vegetation or intracardiac abscess, or active endocarditis on histology) independently establish a definite diagnosis and are not captured by this checklist. The 2023 Duke-ISCVID and 2015 ESC modifications add PET/CT and cardiac CT findings, additional typical organisms, and prosthetic-material criteria; use those where available.',
    refs: [
      'Li JS, Sexton DJ, Mick N, et al. Proposed modifications to the Duke criteria for the diagnosis of infective endocarditis. Clin Infect Dis 2000;30:633-8.',
      'Durack DT, Lukes AS, Bright DK. Am J Med 1994;96:200-9.',
      'Fowler VG, Durack DT, Selton-Suty C, et al. The 2023 Duke-ISCVID Criteria. Clin Infect Dis 2023;77:518-526.'
    ]
  });

  /* ---------- Aortic stenosis severity grading (custom) ---------- */
  CARDIO.register({
    id: 'aortic-stenosis-severity',
    name: 'Aortic Stenosis Severity',
    category: 'imaging',
    short: 'Grade AS from peak velocity, mean gradient and valve area',
    keywords: ['aortic stenosis', 'as severity', 'peak velocity', 'mean gradient', 'ava', 'low-flow low-gradient'],
    kind: 'custom',
    inputs: [
      { id: 'vmax', label: 'Peak aortic jet velocity', type: 'number', unit: 'm/s', min: 1, max: 8, step: 0.1, placeholder: 'e.g., 4.2' },
      { id: 'mg', label: 'Mean transvalvular gradient', type: 'number', unit: 'mmHg', min: 0, max: 150, step: 1, placeholder: 'e.g., 45' },
      { id: 'ava', label: 'Aortic valve area', type: 'number', unit: 'cm²', min: 0.2, max: 5, step: 0.1, placeholder: 'e.g., 0.9' }
    ],
    compute: function (v) {
      var vmax = v.vmax, mg = v.mg, ava = v.ava;
      if (vmax == null && mg == null && ava == null) return null;
      var names = ['aortic sclerosis / no significant stenosis', 'mild', 'moderate', 'severe'];
      var sevs = [], lines = [];

      if (vmax != null) {
        var sv = vmax >= 4 ? 3 : vmax >= 3 ? 2 : vmax >= 2.6 ? 1 : 0;
        sevs.push(sv);
        lines.push('Peak velocity ' + vmax + ' m/s → ' + names[sv]);
      }
      if (mg != null) {
        var sm = mg >= 40 ? 3 : mg >= 20 ? 2 : 1;
        sevs.push(sm);
        lines.push('Mean gradient ' + mg + ' mmHg → ' + names[sm]);
      }
      if (ava != null) {
        var sa = ava < 1.0 ? 3 : ava <= 1.5 ? 2 : 1;
        sevs.push(sa);
        lines.push('AVA ' + ava + ' cm² → ' + names[sa]);
      }

      var overall = Math.max.apply(null, sevs);
      var lowest = Math.min.apply(null, sevs);
      var discord = lowest !== overall;
      var levelMap = ['low', 'low', 'mod', 'high'];
      var labelMap = ['Aortic sclerosis', 'Mild', 'Moderate', 'Severe'];

      var text = 'Overall grade: ' + names[overall] + '.';
      if (discord) {
        text += ' Parameters are discordant — consider flow state (e.g., low-flow, low-gradient severe AS with reduced or preserved EF), measurement error, and the dimensionless index before finalizing. Correlate with stroke volume index and symptoms.';
      }

      return {
        value: labelMap[overall], unit: '', text: text, level: levelMap[overall],
        detail: lines.join('\n') + '\n\nSevere AS cut-offs (ASE/EACVI): Vmax ≥ 4 m/s, mean gradient ≥ 40 mmHg, AVA < 1.0 cm² (indexed < 0.6 cm²/m²).'
      };
    },
    notes: 'Grading integrates velocity, mean gradient and valve area; these usually agree. Discordance (e.g., small AVA with low gradient) commonly reflects low transvalvular flow — assess LV ejection fraction, stroke volume index (< 35 mL/m² = low flow), and consider dobutamine stress echo or CT calcium scoring. Vmax and mean gradient are flow-dependent; AVA is comparatively flow-independent.',
    refs: [
      'Baumgartner H, Hung J, Bermejo J, et al. Recommendations on the echocardiographic assessment of aortic valve stenosis. J Am Soc Echocardiogr 2017;30:372-392.',
      'Otto CM, Nishimura RA, Bonow RO, et al. 2020 ACC/AHA Valvular Heart Disease Guideline. Circulation 2021;143:e72-e227.'
    ]
  });

  /* ---------- Aortic valve area by continuity equation (custom) ---------- */
  CARDIO.register({
    id: 'ava-continuity',
    name: 'AVA by Continuity Equation',
    category: 'imaging',
    short: 'Aortic valve area and dimensionless index from Doppler and LVOT',
    keywords: ['continuity equation', 'ava', 'dimensionless index', 'lvot', 'vti', 'aortic stenosis'],
    kind: 'custom',
    inputs: [
      { id: 'lvot_d', label: 'LVOT diameter', type: 'number', unit: 'cm', min: 1.2, max: 3.5, step: 0.1, placeholder: 'e.g., 2.0' },
      { id: 'vti_lvot', label: 'LVOT velocity–time integral', type: 'number', unit: 'cm', min: 5, max: 50, step: 0.1, placeholder: 'e.g., 20' },
      { id: 'vti_av', label: 'Aortic valve VTI (CW)', type: 'number', unit: 'cm', min: 20, max: 200, step: 1, placeholder: 'e.g., 90' }
    ],
    compute: function (v) {
      var d = v.lvot_d, vlvot = v.vti_lvot, vav = v.vti_av;
      if (d == null || vlvot == null || vav == null) return null;
      if (d <= 0 || vav <= 0) return null;
      var csa = 0.785 * d * d;
      var ava = csa * vlvot / vav;
      var di = vlvot / vav;

      var level, text;
      var severeByArea = ava < 1.0;
      var severeByDi = di < 0.25;
      if (severeByArea || severeByDi) { level = 'high'; text = 'Suggests severe aortic stenosis (AVA < 1.0 cm² and/or dimensionless index < 0.25).'; }
      else if (ava <= 1.5 || di < 0.50) { level = 'mod'; text = 'Suggests moderate aortic stenosis.'; }
      else { level = 'low'; text = 'Suggests mild or no significant aortic stenosis.'; }

      return {
        value: ava.toFixed(2), unit: 'cm²', text: text, level: level,
        detail: 'LVOT cross-sectional area = 0.785 × ' + d + '² = ' + csa.toFixed(2) + ' cm²\n' +
          'Dimensionless index (VTI LVOT / VTI AV) = ' + di.toFixed(2) + ' (severe < 0.25).\n' +
          'The dimensionless index avoids error from squaring the LVOT diameter and is useful when LVOT measurement is uncertain.'
      };
    },
    notes: 'AVA = (0.785 × LVOT diameter²) × VTI(LVOT) / VTI(AV). The largest source of error is the LVOT diameter (squared), so measure it carefully in mid-systole; the dimensionless index (velocity or VTI ratio) is more reproducible. Peak velocities may substitute for VTIs in the ratio.',
    refs: [
      'Baumgartner H, Hung J, Bermejo J, et al. J Am Soc Echocardiogr 2017;30:372-392.',
      'Otto CM, Nishimura RA, Bonow RO, et al. Circulation 2021;143:e72-e227.'
    ]
  });

  /* ---------- Mitral valve area by pressure half-time (custom) ---------- */
  CARDIO.register({
    id: 'mva-pht',
    name: 'Mitral Valve Area by Pressure Half-Time',
    category: 'imaging',
    short: 'MVA in mitral stenosis from the diastolic pressure half-time',
    keywords: ['mitral stenosis', 'mva', 'pressure half-time', 'pht', 'hatle', 'doppler'],
    kind: 'custom',
    inputs: [
      { id: 'pht', label: 'Pressure half-time', type: 'number', unit: 'ms', min: 30, max: 600, step: 1, placeholder: 'e.g., 220' }
    ],
    compute: function (v) {
      var pht = v.pht;
      if (pht == null || pht <= 0) return null;
      var mva = 220 / pht;

      var level, text;
      if (mva < 1.0) { level = 'high'; text = 'Severe mitral stenosis (MVA < 1.0 cm²).'; }
      else if (mva <= 1.5) { level = 'mod'; text = 'Moderate mitral stenosis (MVA 1.0–1.5 cm²).'; }
      else { level = 'low'; text = 'Mild or no significant mitral stenosis (MVA > 1.5 cm²).'; }

      return {
        value: mva.toFixed(2), unit: 'cm²', text: text, level: level,
        detail: 'MVA = 220 / PHT (empirical constant, Hatle).\n' +
          'ACC/AHA classifies progressive MS as MVA > 1.5 cm² and severe (stage C/D) as MVA ≤ 1.5 cm² (very severe ≤ 1.0 cm²).\n' +
          'The PHT method is unreliable immediately after balloon valvuloplasty, with significant aortic regurgitation, or when LA/LV compliance is abnormal (e.g., tachycardia, high filling pressures). Planimetry is the reference method.'
      };
    },
    notes: 'Applies the Hatle empirical formula (220 / pressure half-time). Older echo grading labels severe MS as MVA < 1.0 cm²; the 2014/2020 ACC/AHA guideline defines hemodynamically severe MS as MVA ≤ 1.5 cm². Confirm with 2D/3D planimetry and mean gradient when the PHT is unreliable.',
    refs: [
      'Hatle L, Angelsen B, Tromsdal A. Noninvasive assessment of atrioventricular pressure half-time by Doppler ultrasound. Circulation 1979;60:1096-104.',
      'Baumgartner H, Hung J, Bermejo J, et al. J Am Soc Echocardiogr 2009;22:1-23.'
    ]
  });

  /* ---------- LV mass (ASE cube formula) + geometry (custom) ---------- */
  CARDIO.register({
    id: 'lv-mass-ase',
    name: 'LV Mass & Geometry (ASE)',
    category: 'imaging',
    short: 'LV mass by the ASE cube formula, indexed, with geometry class',
    keywords: ['lv mass', 'ase', 'linear', 'relative wall thickness', 'rwt', 'hypertrophy', 'concentric', 'eccentric'],
    kind: 'custom',
    inputs: [
      { id: 'ivs', label: 'Interventricular septum thickness (IVSd)', type: 'number', unit: 'cm', min: 0.4, max: 3, step: 0.1, placeholder: 'e.g., 1.0' },
      { id: 'lvid', label: 'LV internal diameter, diastole (LVIDd)', type: 'number', unit: 'cm', min: 2, max: 8, step: 0.1, placeholder: 'e.g., 4.8' },
      { id: 'pw', label: 'Posterior wall thickness (PWd)', type: 'number', unit: 'cm', min: 0.4, max: 3, step: 0.1, placeholder: 'e.g., 1.0' },
      { id: 'bsa', label: 'Body surface area (optional, for indexing)', type: 'number', unit: 'm²', min: 0.5, max: 3, step: 0.01, placeholder: 'e.g., 1.9' },
      { id: 'sex', label: 'Sex (for geometry cut-offs)', type: 'select', options: [
        { label: 'Male', value: 'male', points: 0 },
        { label: 'Female', value: 'female', points: 0 }
      ] }
    ],
    compute: function (v) {
      var ivs = v.ivs, lvid = v.lvid, pw = v.pw;
      if (ivs == null || lvid == null || pw == null) return null;
      if (lvid <= 0) return null;

      var mass = 0.8 * 1.04 * (Math.pow(ivs + lvid + pw, 3) - Math.pow(lvid, 3)) + 0.6;
      var rwt = 2 * pw / lvid;
      var bsa = v.bsa;
      var female = v.sex === 'female';

      var detail = 'ASE formula: LV mass = 0.8 × 1.04 × [(IVSd + LVIDd + PWd)³ − LVIDd³] + 0.6 g.\n' +
        'Relative wall thickness (2 × PWd / LVIDd) = ' + rwt.toFixed(2) + ' (increased > 0.42).';

      var level = 'info', text = 'LV mass ' + mass.toFixed(0) + ' g. Provide BSA and sex to classify geometry.';

      if (bsa != null && bsa > 0) {
        var lvmi = mass / bsa;
        var hiMass = female ? lvmi > 95 : lvmi > 115;
        var thick = rwt > 0.42;
        var geo;
        if (!hiMass && !thick) { geo = 'Normal geometry'; level = 'low'; }
        else if (!hiMass && thick) { geo = 'Concentric remodeling'; level = 'mod'; }
        else if (hiMass && thick) { geo = 'Concentric hypertrophy'; level = 'high'; }
        else { geo = 'Eccentric hypertrophy'; level = 'high'; }
        text = 'LV mass index ' + lvmi.toFixed(0) + ' g/m² — ' + geo + '.';
        detail += '\nLV mass index = ' + lvmi.toFixed(0) + ' g/m² (upper normal: men ≤ 115, women ≤ 95 g/m²).';
      }

      return { value: mass.toFixed(0), unit: 'g', text: text, level: level, detail: detail };
    },
    notes: 'Linear (M-mode/2D) cube-formula mass is validated for normally shaped ventricles and overestimates mass with distorted geometry; indexing to BSA is standard (indexing to height^2.7 is an alternative in obesity). Geometry classification (2 × 2 of LV mass index vs relative wall thickness) and the sex-specific upper-normal limits (men 115, women 95 g/m²; RWT 0.42) follow the ASE/EACVI 2015 chamber-quantification recommendations.',
    refs: [
      'Devereux RB, Alonso DR, Lutas EM, et al. Echocardiographic assessment of left ventricular hypertrophy: comparison to necropsy findings. Am J Cardiol 1986;57:450-8.',
      'Lang RM, Badano LP, Mor-Avi V, et al. Recommendations for cardiac chamber quantification by echocardiography in adults. J Am Soc Echocardiogr 2015;28:1-39.'
    ]
  });

  /* ---------- Diastolic function (2016 ASE) — omitted by accuracy rule ----------
   * The 2016 ASE/EACVI algorithm is a multi-branch decision tree with separate
   * pathways for normal vs reduced EF (septal/lateral e', E/e', TR velocity, LA
   * volume index, plus special cases: AF, mitral disease, HCM, constriction).
   * It cannot be reduced to a single reliable formula here and there is no official
   * interactive calculator to link to, so it is intentionally not registered.
   * Reference: Nagueh SF, Smiseth OA, Appleton CP, et al. Recommendations for the
   * Evaluation of LV Diastolic Function by Echocardiography. J Am Soc Echocardiogr
   * 2016;29:277-314. */

})();
