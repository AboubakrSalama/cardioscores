/* Category: advhf — Advanced heart failure, LVAD & transplantation
 * Each entry follows SCHEMA.md. Point values / formulas verified against primary
 * publications; anything not verifiable with certainty is registered kind:'external'. */
(function () {
  'use strict';

  /* Build the HMRS risk-category graph (Cowger 2013): score axis with Low/Medium/High
   * zones, each zone's predicted 90-day mortality as a step, and the patient plotted as a dot. */
  function hmrsGraph(score, group, mortality) {
    var X0 = 46, X1 = 466, Y0 = 258, YT = 34;      // plot area
    var sMin = -1, sMax = 5, mMax = 30;             // axis domains
    function sx(s) { return (X0 + (s - sMin) / (sMax - sMin) * (X1 - X0)); }
    function my(m) { return (Y0 - (m / mMax) * (Y0 - YT)); }
    function r(n) { return Math.round(n * 10) / 10; }

    var GREEN = '#1e8e3e', AMBER = '#b8860b', RED = '#c62828';
    var b1 = sx(1.58), b2 = sx(2.48);
    var yLow = my(8), yMed = my(11), yHigh = my(25);
    var cs = Math.max(sMin, Math.min(sMax, score));
    var px = sx(cs), py = my(mortality);
    var pClamped = (score < sMin || score > sMax);

    var s = [];
    s.push('<svg viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg" font-family="inherit" fill="currentColor">');
    s.push('<text x="240" y="18" text-anchor="middle" font-size="13" font-weight="700">HeartMate II Risk Score — predicted 90-day mortality</text>');

    // y gridlines + labels
    [0, 10, 20, 30].forEach(function (m) {
      var y = r(my(m));
      s.push('<line x1="' + X0 + '" y1="' + y + '" x2="' + X1 + '" y2="' + y + '" stroke="currentColor" stroke-opacity="0.12"/>');
      s.push('<text x="' + (X0 - 6) + '" y="' + (y + 4) + '" text-anchor="end" font-size="10" fill-opacity="0.75">' + m + '%</text>');
    });

    // risk zones (shaded)
    s.push('<rect x="' + r(sx(sMin)) + '" y="' + YT + '" width="' + r(b1 - sx(sMin)) + '" height="' + r(Y0 - YT) + '" fill="' + GREEN + '" fill-opacity="0.10"/>');
    s.push('<rect x="' + r(b1) + '" y="' + YT + '" width="' + r(b2 - b1) + '" height="' + r(Y0 - YT) + '" fill="' + AMBER + '" fill-opacity="0.12"/>');
    s.push('<rect x="' + r(b2) + '" y="' + YT + '" width="' + r(sx(sMax) - b2) + '" height="' + r(Y0 - YT) + '" fill="' + RED + '" fill-opacity="0.11"/>');

    // zone labels
    s.push('<text x="' + r((sx(sMin) + b1) / 2) + '" y="' + (YT + 14) + '" text-anchor="middle" font-size="11" font-weight="700" fill="' + GREEN + '">LOW &lt;1.58</text>');
    s.push('<text x="' + r((b1 + b2) / 2) + '" y="' + (YT + 14) + '" text-anchor="middle" font-size="10" font-weight="700" fill="' + AMBER + '">MED</text>');
    s.push('<text x="' + r((b2 + sx(sMax)) / 2) + '" y="' + (YT + 14) + '" text-anchor="middle" font-size="11" font-weight="700" fill="' + RED + '">HIGH &gt;2.48</text>');

    // mortality step line per zone
    s.push('<line x1="' + r(sx(sMin)) + '" y1="' + r(yLow) + '" x2="' + r(b1) + '" y2="' + r(yLow) + '" stroke="' + GREEN + '" stroke-width="3"/>');
    s.push('<line x1="' + r(b1) + '" y1="' + r(yMed) + '" x2="' + r(b2) + '" y2="' + r(yMed) + '" stroke="' + AMBER + '" stroke-width="3"/>');
    s.push('<line x1="' + r(b2) + '" y1="' + r(yHigh) + '" x2="' + r(sx(sMax)) + '" y2="' + r(yHigh) + '" stroke="' + RED + '" stroke-width="3"/>');
    // step risers
    s.push('<line x1="' + r(b1) + '" y1="' + r(yLow) + '" x2="' + r(b1) + '" y2="' + r(yMed) + '" stroke="currentColor" stroke-opacity="0.3" stroke-dasharray="2 2"/>');
    s.push('<line x1="' + r(b2) + '" y1="' + r(yMed) + '" x2="' + r(b2) + '" y2="' + r(yHigh) + '" stroke="currentColor" stroke-opacity="0.3" stroke-dasharray="2 2"/>');

    // axes
    s.push('<line x1="' + X0 + '" y1="' + Y0 + '" x2="' + X1 + '" y2="' + Y0 + '" stroke="currentColor" stroke-opacity="0.5"/>');
    // x ticks/labels
    [-1, 0, 1, 2, 3, 4, 5].forEach(function (t) {
      var x = r(sx(t));
      s.push('<line x1="' + x + '" y1="' + Y0 + '" x2="' + x + '" y2="' + (Y0 + 4) + '" stroke="currentColor" stroke-opacity="0.5"/>');
      s.push('<text x="' + x + '" y="' + (Y0 + 16) + '" text-anchor="middle" font-size="10" fill-opacity="0.75">' + t + '</text>');
    });
    s.push('<text x="' + r((X0 + X1) / 2) + '" y="' + (Y0 + 32) + '" text-anchor="middle" font-size="11" fill-opacity="0.85">HMRS score</text>');

    // patient dropline + dot + label
    s.push('<line x1="' + r(px) + '" y1="' + r(py) + '" x2="' + r(px) + '" y2="' + Y0 + '" stroke="currentColor" stroke-opacity="0.55" stroke-dasharray="3 3"/>');
    s.push('<circle cx="' + r(px) + '" cy="' + r(py) + '" r="7" fill="#0f4c81" stroke="#fff" stroke-width="2"/>');
    var labX = px > (X0 + X1) / 2 ? r(px - 8) : r(px + 8);
    var anchor = px > (X0 + X1) / 2 ? 'end' : 'start';
    s.push('<text x="' + labX + '" y="' + r(py - 12) + '" text-anchor="' + anchor + '" font-size="11" font-weight="700">This patient: ' + score.toFixed(2) + (pClamped ? ' (off-scale)' : '') + '</text>');
    s.push('<text x="' + labX + '" y="' + r(py - 0) + '" text-anchor="' + anchor + '" font-size="10" fill-opacity="0.8">' + group + ' risk · ~' + mortality + '%</text>');

    s.push('</svg>');
    return s.join('');
  }

  /* Donor:recipient predicted-heart-mass ratio gauge, with the pair plotted as a dot. */
  function phmGauge(ratio) {
    var X0 = 46, X1 = 466, Y = 74, H = 26;
    var rMin = 0.5, rMax = 1.5;
    function gx(v) { return X0 + (Math.max(rMin, Math.min(rMax, v)) - rMin) / (rMax - rMin) * (X1 - X0); }
    function r1(n) { return Math.round(n * 10) / 10; }
    var GREEN = '#1e8e3e', AMBER = '#b8860b', RED = '#c62828';
    var bLow = gx(0.86), bHigh = gx(1.30);
    var dx = gx(ratio);

    var s = [];
    s.push('<svg viewBox="0 0 480 150" xmlns="http://www.w3.org/2000/svg" font-family="inherit" fill="currentColor">');
    s.push('<text x="240" y="18" text-anchor="middle" font-size="13" font-weight="700">Donor : recipient predicted heart mass</text>');
    // bands
    s.push('<rect x="' + r1(gx(rMin)) + '" y="' + Y + '" width="' + r1(bLow - gx(rMin)) + '" height="' + H + '" fill="' + RED + '" fill-opacity="0.18"/>');
    s.push('<rect x="' + r1(bLow) + '" y="' + Y + '" width="' + r1(bHigh - bLow) + '" height="' + H + '" fill="' + GREEN + '" fill-opacity="0.18"/>');
    s.push('<rect x="' + r1(bHigh) + '" y="' + Y + '" width="' + r1(gx(rMax) - bHigh) + '" height="' + H + '" fill="' + AMBER + '" fill-opacity="0.18"/>');
    s.push('<rect x="' + X0 + '" y="' + Y + '" width="' + (X1 - X0) + '" height="' + H + '" fill="none" stroke="currentColor" stroke-opacity="0.35"/>');
    // band labels
    s.push('<text x="' + r1((gx(rMin) + bLow) / 2) + '" y="' + (Y - 6) + '" text-anchor="middle" font-size="10" font-weight="700" fill="' + RED + '">Undersized</text>');
    s.push('<text x="' + r1((bLow + bHigh) / 2) + '" y="' + (Y - 6) + '" text-anchor="middle" font-size="10" font-weight="700" fill="' + GREEN + '">Acceptable</text>');
    s.push('<text x="' + r1((bHigh + gx(rMax)) / 2) + '" y="' + (Y - 6) + '" text-anchor="middle" font-size="10" font-weight="700" fill="' + AMBER + '">Oversized</text>');
    // ticks
    [0.5, 0.86, 1.0, 1.30, 1.5].forEach(function (t) {
      var x = r1(gx(t));
      s.push('<line x1="' + x + '" y1="' + (Y + H) + '" x2="' + x + '" y2="' + (Y + H + 5) + '" stroke="currentColor" stroke-opacity="0.5"/>');
      s.push('<text x="' + x + '" y="' + (Y + H + 18) + '" text-anchor="middle" font-size="10" fill-opacity="0.75">' + t.toFixed(2) + '</text>');
    });
    s.push('<text x="' + r1((X0 + X1) / 2) + '" y="' + (Y + H + 34) + '" text-anchor="middle" font-size="11" fill-opacity="0.85">Donor : recipient PHM ratio</text>');
    // dot + dropline
    s.push('<line x1="' + r1(dx) + '" y1="' + Y + '" x2="' + r1(dx) + '" y2="' + (Y + H) + '" stroke="#0f4c81" stroke-width="2"/>');
    s.push('<circle cx="' + r1(dx) + '" cy="' + (Y + H / 2) + '" r="8" fill="#0f4c81" stroke="#fff" stroke-width="2"/>');
    s.push('<text x="' + r1(dx) + '" y="' + (Y - 20) + '" text-anchor="middle" font-size="12" font-weight="700">This pair: ' + ratio.toFixed(2) + '</text>');
    s.push('</svg>');
    return s.join('');
  }

  /* HeartMate 3 survival: Cox S(t)=S0(t)^exp(LP). Baseline cumulative hazard anchored
   * at S0(1yr)=0.9928, S0(2yr)=0.9880 (from the authors' official HM3RS calculator),
   * interpolated piecewise-linearly in cumulative hazard between 0, 12 and 24 months. */
  function hm3Surv(score, months) {
    var H12 = 0.0072256, H24 = 0.0120718; // -ln(0.9928), -ln(0.9880)
    var H0 = months <= 12 ? H12 * (months / 12) : H12 + (H24 - H12) * ((months - 12) / 12);
    return Math.exp(-H0 * Math.exp(score));
  }

  /* HM3RS survival-curve graph: the three risk-group curves (as in the paper) with the
   * patient's predicted survival plotted as dots at 1 and 2 years. */
  function hm3Graph(patientScore) {
    var X0 = 52, X1 = 452, YT = 30, YB = 240;
    function mx(t) { return X0 + (t / 24) * (X1 - X0); }
    function my(p) { return YB - (p / 100) * (YB - YT); }
    function r1(n) { return Math.round(n * 10) / 10; }
    var GREEN = '#1e8e3e', AMBER = '#b8860b', RED = '#c62828', BLUE = '#0f4c81';
    var groups = [
      { sc: 1.96, c: GREEN, lab: 'Higher-than-avg' },
      { sc: 2.69, c: AMBER, lab: 'Average' },
      { sc: 3.41, c: RED, lab: 'Lower-than-avg' }
    ];
    function curve(sc) {
      var pts = [];
      for (var t = 0; t <= 24; t += 2) pts.push(r1(mx(t)) + ',' + r1(my(100 * hm3Surv(sc, t))));
      return pts.join(' ');
    }
    var s = [];
    s.push('<svg viewBox="0 0 480 320" xmlns="http://www.w3.org/2000/svg" font-family="inherit" fill="currentColor">');
    s.push('<text x="240" y="18" text-anchor="middle" font-size="13" font-weight="700">HeartMate 3 predicted survival</text>');
    // y gridlines + labels
    [0, 25, 50, 75, 100].forEach(function (p) {
      var y = r1(my(p));
      s.push('<line x1="' + X0 + '" y1="' + y + '" x2="' + X1 + '" y2="' + y + '" stroke="currentColor" stroke-opacity="0.12"/>');
      s.push('<text x="' + (X0 - 6) + '" y="' + (y + 4) + '" text-anchor="end" font-size="10" fill-opacity="0.75">' + p + '</text>');
    });
    s.push('<text x="16" y="' + r1((YT + YB) / 2) + '" text-anchor="middle" font-size="10" fill-opacity="0.8" transform="rotate(-90 16 ' + r1((YT + YB) / 2) + ')">Survival (%)</text>');
    // x axis ticks/labels (months)
    [0, 6, 12, 18, 24].forEach(function (t) {
      var x = r1(mx(t));
      s.push('<line x1="' + x + '" y1="' + YB + '" x2="' + x + '" y2="' + (YB + 4) + '" stroke="currentColor" stroke-opacity="0.5"/>');
      s.push('<text x="' + x + '" y="' + (YB + 16) + '" text-anchor="middle" font-size="10" fill-opacity="0.75">' + t + '</text>');
    });
    s.push('<text x="' + r1((X0 + X1) / 2) + '" y="' + (YB + 30) + '" text-anchor="middle" font-size="10" fill-opacity="0.85">Months after implant</text>');
    // group reference curves
    groups.forEach(function (g) {
      s.push('<polyline points="' + curve(g.sc) + '" fill="none" stroke="' + g.c + '" stroke-width="1.6" stroke-opacity="0.65"/>');
    });
    // guide lines at 12 and 24 months
    [12, 24].forEach(function (t) {
      s.push('<line x1="' + r1(mx(t)) + '" y1="' + YT + '" x2="' + r1(mx(t)) + '" y2="' + YB + '" stroke="currentColor" stroke-opacity="0.18" stroke-dasharray="3 3"/>');
    });
    // patient curve + dots at 1 and 2 years
    s.push('<polyline points="' + curve(patientScore) + '" fill="none" stroke="' + BLUE + '" stroke-width="2.6"/>');
    [12, 24].forEach(function (t) {
      var p = 100 * hm3Surv(patientScore, t);
      var cx = r1(mx(t)), cy = r1(my(p));
      s.push('<circle cx="' + cx + '" cy="' + cy + '" r="6" fill="' + BLUE + '" stroke="#fff" stroke-width="2"/>');
      s.push('<text x="' + (cx - 6) + '" y="' + (cy - 10) + '" text-anchor="end" font-size="11" font-weight="700" fill="' + BLUE + '">' + Math.round(p) + '%</text>');
    });
    // legend
    var ly = 300;
    var items = [
      { c: GREEN, lab: 'Higher-than-avg' }, { c: AMBER, lab: 'Average' },
      { c: RED, lab: 'Lower-than-avg' }, { c: BLUE, lab: 'This patient' }
    ];
    var lx = X0;
    items.forEach(function (it) {
      s.push('<line x1="' + lx + '" y1="' + ly + '" x2="' + (lx + 16) + '" y2="' + ly + '" stroke="' + it.c + '" stroke-width="3"/>');
      s.push('<text x="' + (lx + 20) + '" y="' + (ly + 4) + '" font-size="10" fill-opacity="0.85">' + it.lab + '</text>');
      lx += 24 + it.lab.length * 5.6 + 8;
    });
    s.push('</svg>');
    return s.join('');
  }

  /* ---------- INTERMACS profiles ---------- */
  CARDIO.register({
    id: 'intermacs-profile',
    name: 'INTERMACS Profiles (1–7)',
    category: 'advhf',
    short: 'Clinical severity profiles for advanced heart failure — timing of MCS/transplant',
    keywords: ['lvad', 'mcs', 'transplant', 'cardiogenic shock', 'inotropes', 'profile'],
    inputs: [
      { id: 'profile', label: 'Clinical profile', type: 'select', hidePoints: true, options: [
        { label: 'Profile 1 — Critical cardiogenic shock (“crash and burn”)', points: 1 },
        { label: 'Profile 2 — Progressive decline on inotropic support (“sliding on inotropes”)', points: 2 },
        { label: 'Profile 3 — Stable but inotrope dependent (“dependent stability”)', points: 3 },
        { label: 'Profile 4 — Resting symptoms on oral therapy at home', points: 4 },
        { label: 'Profile 5 — Exertion intolerant (“housebound”)', points: 5 },
        { label: 'Profile 6 — Exertion limited (“walking wounded”)', points: 6 },
        { label: 'Profile 7 — Advanced NYHA class III', points: 7 }
      ] }
    ],
    result: { unit: '' },
    interpret: [
      { upTo: 1, text: 'Profile 1 — Critical cardiogenic shock: life-threatening hypotension and hypoperfusion despite rapidly escalating inotropic support. Definitive intervention needed within hours.', level: 'vhigh' },
      { upTo: 2, text: 'Profile 2 — Progressive decline: worsening function, nutrition, or renal/hepatic indices despite IV inotropic support. Definitive intervention needed within a few days.', level: 'vhigh' },
      { upTo: 3, text: 'Profile 3 — Stable but inotrope dependent: clinically stable on continuous inotropes (or temporary support) but repeatedly fails weaning. Elective intervention over weeks to a few months.', level: 'high' },
      { upTo: 4, text: 'Profile 4 — Resting symptoms: at home on oral therapy but with daily symptoms of congestion at rest or with activities of daily living. Elective intervention over weeks to a few months.', level: 'high' },
      { upTo: 5, text: 'Profile 5 — Exertion intolerant: comfortable at rest but unable to engage in any other activity; largely housebound. Variable urgency — depends on nutrition, organ function, and activity.', level: 'mod' },
      { upTo: 6, text: 'Profile 6 — Exertion limited: comfortable at rest and with activities of daily living but fatigues after the first few minutes of any meaningful activity. Variable urgency.', level: 'mod' },
      { upTo: 7, text: 'Profile 7 — Advanced NYHA III: clinically stable without current or recent episodes of unstable fluid balance; living comfortably with meaningful activity limited to mild exertion. Transplant or MCS not currently indicated.', level: 'low' }
    ],
    notes: 'The displayed number is the profile (1–7), not a point score. Modifiers: TCS (temporary circulatory support, hospitalized profiles), A (recurrent arrhythmia, any profile), FF (“frequent flyer” — repeated hospitalizations in outpatient profiles).',
    refs: [
      'Stevenson LW et al. INTERMACS profiles of advanced heart failure: the current picture. J Heart Lung Transplant 2009;28:535-41.'
    ]
  });

  /* ---------- EUROMACS-RHF risk score ---------- */
  CARDIO.register({
    id: 'euromacs-rhf',
    name: 'EUROMACS-RHF Risk Score',
    category: 'advhf',
    short: 'Early right heart failure after continuous-flow LVAD implantation',
    keywords: ['lvad', 'right heart failure', 'rhf', 'rvad', 'euromacs', 'mcs'],
    inputs: [
      { id: 'rapcwp', label: 'RA/PCWP ratio > 0.54', hint: 'Right atrial pressure to pulmonary capillary wedge pressure ratio', type: 'check', points: 2 },
      { id: 'hgb', label: 'Hemoglobin ≤ 10 g/dL', type: 'check', points: 1 },
      { id: 'inotropes', label: 'Multiple (≥ 3) IV inotropes before implant', type: 'check', points: 2.5 },
      { id: 'intermacs', label: 'INTERMACS class 1–3', type: 'check', points: 2 },
      { id: 'rvdys', label: 'Severe RV dysfunction on echocardiography', type: 'check', points: 2 }
    ],
    interpret: [
      { upTo: 2, text: 'Low risk — early (post-operative) right heart failure ~11%.', level: 'low' },
      { upTo: 4, text: 'Intermediate risk — early right heart failure roughly 20–37% (rises across this band).', level: 'high' },
      { upTo: 9.5, text: 'High risk — early right heart failure ~43%. Consider planned biventricular support / RVAD strategy and optimize RV protection.', level: 'vhigh' }
    ],
    notes: 'Predicts early RHF after continuous-flow LVAD. Total ranges 0–9.5. Derivation c-index ~0.70 (validation ~0.67); performance in single-center external validations has been variable. RA/PCWP > 0.54 = 2, Hgb ≤ 10 g/dL = 1, ≥ 3 IV inotropes = 2.5, INTERMACS 1–3 = 2, severe RV dysfunction = 2.',
    refs: [
      'Soliman OII et al. Derivation and validation of a novel right-sided heart failure model after implantation of continuous flow left ventricular assist devices: the EUROMACS-RHF risk score. Circulation 2018;137:891-906.'
    ]
  });

  /* ---------- HeartMate II Risk Score (HMRS) — local calculator + risk graph ---------- */
  CARDIO.register({
    id: 'hmrs',
    name: 'HeartMate II Risk Score (HMRS)',
    category: 'advhf',
    short: '90-day mortality after continuous-flow LVAD implantation',
    keywords: ['lvad', 'heartmate', 'mortality', 'destination therapy', 'hmrs'],
    kind: 'custom',
    inputs: [
      { id: 'age', label: 'Age', type: 'number', unit: 'years', min: 18, max: 90, step: 1, placeholder: 'e.g. 60' },
      { id: 'albumin', label: 'Serum albumin', type: 'number', unit: 'g/dL', min: 1, max: 6, step: 0.1, placeholder: 'e.g. 3.5', hint: 'g/L ÷ 10 = g/dL' },
      { id: 'creatinine', label: 'Serum creatinine', type: 'number', unit: 'mg/dL', min: 0.2, max: 12, step: 0.1, placeholder: 'e.g. 1.2', hint: 'µmol/L ÷ 88.4 = mg/dL' },
      { id: 'inr', label: 'INR (off warfarin)', type: 'number', unit: '', min: 0.7, max: 8, step: 0.1, placeholder: 'e.g. 1.2' },
      { id: 'lowvol', label: 'Low-volume implanting center', type: 'check', hint: 'Center performing few continuous-flow LVAD implants (≤ 15 in the trial period). Leave unchecked for high-volume centers.' }
    ],
    compute: function (v) {
      if (v.age == null || v.albumin == null || v.creatinine == null || v.inr == null) return null;
      if (v.albumin <= 0 || v.creatinine <= 0 || v.inr <= 0) return null;
      var lowvol = v.lowvol ? 1 : 0;
      var hmrs = 0.0274 * v.age
               - 0.723 * v.albumin
               + 0.74 * v.creatinine
               + 1.136 * v.inr
               + 0.807 * lowvol;

      var group, mortality, level, badge;
      if (hmrs < 1.58) { group = 'Low'; mortality = 8; level = 'low'; badge = 'Low risk'; }
      else if (hmrs <= 2.48) { group = 'Medium'; mortality = 11; level = 'mod'; badge = 'Medium risk'; }
      else { group = 'High'; mortality = 25; level = 'high'; badge = 'High risk'; }

      var detail = 'HMRS = 0.0274×age − 0.723×albumin + 0.74×creatinine + 1.136×INR + 0.807×(low-volume center)\n' +
        '= 0.0274×' + v.age + ' − 0.723×' + v.albumin.toFixed(1) + ' + 0.74×' + v.creatinine.toFixed(1) +
        ' + 1.136×' + v.inr.toFixed(1) + ' + 0.807×' + lowvol + '\n' +
        'Risk groups (Cowger 2013): Low < 1.58 (~8%), Medium 1.58–2.48 (~11%), High > 2.48 (~25% predicted 90-day mortality).';

      return {
        value: hmrs.toFixed(2),
        unit: 'points',
        badge: badge,
        level: level,
        text: group + ' risk group — predicted 90-day mortality ≈ ' + mortality + '% (derivation cohort).',
        detail: detail,
        svg: hmrsGraph(hmrs, group, mortality)
      };
    },
    notes: 'Continuous-flow LVAD 90-day mortality model. HMRS = 0.0274×age(yr) − 0.723×albumin(g/dL) + 0.74×creatinine(mg/dL) + 1.136×INR + 0.807×(1 if low-volume center, else 0). Risk groups and the graph reproduce Cowger et al. 2013 (Low <1.58, Medium 1.58–2.48, High >2.48; predicted 90-day mortality ~8/11/25%). Discrimination in later registry validations was modest (AUC ~0.60–0.70) — interpret alongside INTERMACS profile, RV function, and the full clinical picture. Verify against the primary publication before clinical use.',
    refs: [
      'Cowger J et al. Predicting survival in patients receiving continuous flow left ventricular assist devices: the HeartMate II risk score. J Am Coll Cardiol 2013;61:313-21.'
    ]
  });

  /* ---------- HeartMate 3 Risk Score (HM3RS) — local calculator + survival curves ---------- */
  CARDIO.register({
    id: 'hm3rs',
    name: 'HeartMate 3 Risk Score (HM3RS)',
    category: 'advhf',
    short: '1- and 2-year survival after HeartMate 3 (fully magnetically levitated) LVAD',
    keywords: ['lvad', 'heartmate 3', 'hm3', 'hm3rs', 'survival', 'momentum 3', 'destination therapy'],
    kind: 'custom',
    inputs: [
      { id: 'age', label: 'Age', type: 'number', unit: 'years', min: 18, max: 90, step: 1, placeholder: 'e.g. 60' },
      { id: 'priorsurg', label: 'Prior cardiac surgery (CABG or valve)', type: 'check' },
      { id: 'sodium', label: 'Serum sodium', type: 'number', unit: 'mEq/L', min: 110, max: 160, step: 1, placeholder: 'e.g. 137' },
      { id: 'bun', label: 'Blood urea nitrogen (BUN)', type: 'number', unit: 'mg/dL', min: 2, max: 200, step: 1, placeholder: 'e.g. 24', hint: 'Urea (mmol/L) ÷ 0.357 = BUN (mg/dL)' },
      { id: 'lvedd', label: 'LV end-diastolic diameter', type: 'number', unit: 'cm', min: 3, max: 9, step: 0.1, placeholder: 'e.g. 6.5', hint: 'Enters the model as an indicator: LVEDD < 5.5 cm adds risk' },
      { id: 'rap', label: 'Right atrial pressure (RAP)', type: 'number', unit: 'mmHg', min: 0, max: 40, step: 1, placeholder: 'e.g. 8' },
      { id: 'pcwp', label: 'Pulmonary capillary wedge pressure (PCWP)', type: 'number', unit: 'mmHg', min: 1, max: 55, step: 1, placeholder: 'e.g. 18', hint: 'RAP/PCWP > 0.6 adds risk' }
    ],
    compute: function (v) {
      if (v.age == null || v.sodium == null || v.bun == null || v.lvedd == null || v.rap == null || v.pcwp == null) return null;
      if (v.pcwp <= 0 || v.sodium <= 0) return null;
      var ratio = v.rap / v.pcwp;
      var lveddInd = v.lvedd < 5.5 ? 1 : 0;
      var ratioInd = ratio > 0.6 ? 1 : 0;
      var score = 5.59
        + 0.0348 * v.age
        + 0.53 * (v.priorsurg ? 1 : 0)
        - 0.041 * v.sodium
        + 0.0107 * v.bun
        + 0.62 * lveddInd
        + 0.44 * ratioInd;
      var surv1 = Math.pow(0.9928, Math.exp(score)) * 100;
      var surv2 = Math.pow(0.9880, Math.exp(score)) * 100;

      var level, badge, grp;
      if (score < 2.41) { level = 'low'; badge = 'Higher-than-average survival'; grp = 'Higher-than-average expected survival'; }
      else if (score < 2.97) { level = 'mod'; badge = 'Average survival'; grp = 'Average expected survival'; }
      else { level = 'high'; badge = 'Lower-than-average survival'; grp = 'Lower-than-average expected survival'; }

      var detail =
        'Predicted survival: ' + surv1.toFixed(0) + '% at 1 year · ' + surv2.toFixed(0) + '% at 2 years\n' +
        'LVEDD < 5.5 cm: ' + (lveddInd ? 'yes (+0.62)' : 'no') + ' · RAP/PCWP = ' + ratio.toFixed(2) + ' (> 0.6: ' + (ratioInd ? 'yes, +0.44' : 'no') + ')\n' +
        'Risk tertiles: higher < 2.41 · average 2.41–2.97 · lower > 2.97';

      return {
        value: score.toFixed(2),
        unit: 'HM3RS',
        badge: badge,
        level: level,
        text: grp + '. Predicted survival ≈ ' + surv1.toFixed(0) + '% at 1 year and ≈ ' + surv2.toFixed(0) + '% at 2 years.',
        detail: detail,
        svg: hm3Graph(score)
      };
    },
    notes: 'Pre-implant survival model for the fully magnetically levitated HeartMate 3 LVAD, derived from MOMENTUM 3 (Mehra et al. 2022). Cox linear predictor: HM3RS = 5.59 + 0.0348·age + 0.53·(prior cardiac surgery) − 0.041·sodium + 0.0107·BUN + 0.62·(LVEDD < 5.5 cm) + 0.44·(RAP/PCWP > 0.6). Predicted survival = S0(t)^exp(HM3RS) with S0 = 0.9928 (1 yr) and 0.9880 (2 yr). The graph shows the three risk-group survival curves with this patient plotted as dots at 1 and 2 years. IMPORTANT: the JACC article is paywalled; these coefficients were recovered from the authors’ own official online HM3RS calculator (they reproduce it to displayed precision) and the model structure was corroborated with secondary sources — the exact published decimals could not be read from the paper. Verify against the primary publication before clinical use.',
    refs: [
      'Mehra MR et al. Prediction of survival after implantation of a fully magnetically levitated left ventricular assist device. JACC Heart Fail 2022;10(12):948-959.',
      'Authors’ official HM3RS calculator: codetoheal.shinyapps.io/HeartMate3RS'
    ]
  });

  /* ---------- MELD-XI ---------- */
  CARDIO.register({
    id: 'meld-xi',
    name: 'MELD-XI',
    category: 'advhf',
    short: 'MELD excluding INR — hepatorenal dysfunction in heart failure (useful on anticoagulation)',
    keywords: ['meld', 'liver', 'renal', 'bilirubin', 'creatinine', 'lvad', 'transplant', 'cardiohepatic'],
    kind: 'custom',
    inputs: [
      { id: 'bili', label: 'Total bilirubin', type: 'number', unit: 'mg/dL', min: 0.1, max: 50, step: 0.1, placeholder: 'e.g., 1.2', hint: 'µmol/L ÷ 17.1 = mg/dL' },
      { id: 'cr', label: 'Creatinine', type: 'number', unit: 'mg/dL', min: 0.1, max: 15, step: 0.1, placeholder: 'e.g., 1.0', hint: 'µmol/L ÷ 88.4 = mg/dL. Values above 4.0 are capped at 4.0.' }
    ],
    compute: function (v) {
      if (v.bili === null || v.cr === null) return null;
      if (v.bili <= 0 || v.cr <= 0) return null;
      var b = Math.max(v.bili, 1.0);
      var c = Math.max(v.cr, 1.0);
      if (c > 4.0) c = 4.0;
      var score = 5.11 * Math.log(b) + 11.76 * Math.log(c) + 9.44;
      var detail = 'MELD-XI = 5.11 × ln(bilirubin) + 11.76 × ln(creatinine) + 9.44\n' +
        'Bilirubin used: ' + b.toFixed(1) + ' mg/dL' + (v.bili < 1.0 ? ' (floored at 1.0)' : '') + '\n' +
        'Creatinine used: ' + c.toFixed(1) + ' mg/dL' + (v.cr < 1.0 ? ' (floored at 1.0)' : (v.cr > 4.0 ? ' (capped at 4.0)' : '')) + '\n' +
        'Minimum possible score (normal labs) is 9.4.';
      return {
        value: score.toFixed(1),
        unit: 'points',
        text: 'Higher MELD-XI indicates worse hepatorenal dysfunction and has been associated with worse survival in advanced heart failure, LVAD, and transplant cohorts. No single universal cut-off is established — compare serially and against your program\'s experience.',
        level: 'info',
        detail: detail
      };
    },
    notes: 'MELD variant that omits INR, developed for patients on anticoagulation (in whom INR does not reflect liver synthetic function) — the usual situation in advanced HF/LVAD candidates. Bilirubin and creatinine below 1.0 mg/dL are set to 1.0; creatinine is capped at 4.0 mg/dL.',
    refs: [
      'Heuman DM et al. MELD-XI: a rational approach to “sickest first” liver transplantation in cirrhotic patients requiring anticoagulant therapy. Liver Transpl 2007;13:30-7.'
    ]
  });

  /* ---------- MELD (original, INR-based) ---------- */
  CARDIO.register({
    id: 'meld',
    name: 'MELD Score (original)',
    category: 'advhf',
    short: 'Model for End-stage Liver Disease — hepatorenal risk marker in advanced HF work-up',
    keywords: ['meld', 'liver', 'inr', 'bilirubin', 'creatinine', 'lvad', 'transplant'],
    kind: 'custom',
    inputs: [
      { id: 'bili', label: 'Total bilirubin', type: 'number', unit: 'mg/dL', min: 0.1, max: 50, step: 0.1, placeholder: 'e.g., 1.2', hint: 'µmol/L ÷ 17.1 = mg/dL' },
      { id: 'cr', label: 'Creatinine', type: 'number', unit: 'mg/dL', min: 0.1, max: 15, step: 0.1, placeholder: 'e.g., 1.0', hint: 'µmol/L ÷ 88.4 = mg/dL. Values above 4.0 are capped at 4.0.' },
      { id: 'inr', label: 'INR', type: 'number', unit: '', min: 0.5, max: 20, step: 0.1, placeholder: 'e.g., 1.1' },
      { id: 'dialysis', label: 'Dialysis at least twice in the past week (or 24 h of CVVHD)', type: 'check', points: 0, hint: 'If checked, creatinine is set to 4.0 mg/dL per UNOS convention' }
    ],
    compute: function (v) {
      if (v.bili === null || v.cr === null || v.inr === null) return null;
      if (v.bili <= 0 || v.cr <= 0 || v.inr <= 0) return null;
      var b = Math.max(v.bili, 1.0);
      var c = Math.max(v.cr, 1.0);
      var i = Math.max(v.inr, 1.0);
      if (v.dialysis) c = 4.0;
      if (c > 4.0) c = 4.0;
      var raw = 3.78 * Math.log(b) + 11.2 * Math.log(i) + 9.57 * Math.log(c) + 6.43;
      var score = Math.round(raw);
      if (score > 40) score = 40;
      var text, level;
      if (score <= 9) { text = '3-month mortality ~1.9% (hospitalized cirrhotic derivation cohort).'; level = 'low'; }
      else if (score <= 19) { text = '3-month mortality ~6.0% (hospitalized cirrhotic derivation cohort).'; level = 'mod'; }
      else if (score <= 29) { text = '3-month mortality ~19.6% (hospitalized cirrhotic derivation cohort).'; level = 'high'; }
      else if (score <= 39) { text = '3-month mortality ~52.6% (hospitalized cirrhotic derivation cohort).'; level = 'vhigh'; }
      else { text = '3-month mortality ~71.3% (hospitalized cirrhotic derivation cohort).'; level = 'vhigh'; }
      var detail = 'MELD = 3.78 × ln(bilirubin) + 11.2 × ln(INR) + 9.57 × ln(creatinine) + 6.43\n' +
        'Bilirubin used: ' + b.toFixed(1) + ' mg/dL' + (v.bili < 1.0 ? ' (floored at 1.0)' : '') + '\n' +
        'Creatinine used: ' + c.toFixed(1) + ' mg/dL' + (v.dialysis ? ' (set to 4.0 — dialysis)' : (v.cr < 1.0 ? ' (floored at 1.0)' : (v.cr > 4.0 ? ' (capped at 4.0)' : ''))) + '\n' +
        'INR used: ' + i.toFixed(1) + (v.inr < 1.0 ? ' (floored at 1.0)' : '') + '\n' +
        'Unrounded: ' + raw.toFixed(1) + '; rounded and capped at 40 per UNOS convention.';
      return { value: String(score), unit: 'points', text: text, level: level, detail: detail };
    },
    notes: 'Derived and validated in liver disease; in advanced HF it is used as a marker of cardiohepatic/renal risk before LVAD or transplant — the quoted mortality bands are from cirrhotic cohorts, not HF. INR is uninterpretable on vitamin K antagonists: use MELD-XI in anticoagulated patients.',
    refs: [
      'Kamath PS et al. A model to predict survival in patients with end-stage liver disease. Hepatology 2001;33:464-70.',
      'Wiesner R et al. Model for end-stage liver disease (MELD) and allocation of donor livers. Gastroenterology 2003;124:91-6.'
    ]
  });

  /* ---------- IMPACT recipient risk index (local points) ---------- */
  CARDIO.register({
    id: 'impact-transplant',
    name: 'IMPACT Score (post-heart-transplant mortality)',
    category: 'advhf',
    short: 'Recipient risk index for 1-year mortality after heart transplantation',
    keywords: ['transplant', 'mortality', 'recipient risk', 'impact', 'weiss', 'oht'],
    inputs: [
      { id: 'age', label: 'Recipient age > 60 years', type: 'check', points: 3 },
      { id: 'female', label: 'Female recipient', type: 'check', points: 3 },
      { id: 'race', label: 'Black / African-American race', type: 'check', points: 3 },
      { id: 'etiology', label: 'Cause of heart failure', type: 'select', options: [
        { label: 'Dilated (non-ischemic) cardiomyopathy — reference', points: 0 },
        { label: 'Ischemic cardiomyopathy / coronary disease', points: 2 },
        { label: 'Restrictive / other cardiomyopathy', points: 4 },
        { label: 'Congenital heart disease', points: 9 }
      ] },
      { id: 'bili', label: 'Total bilirubin', type: 'select', options: [
        { label: '≤ 2.0 mg/dL', points: 0 },
        { label: '2.1–4.0 mg/dL', points: 2 },
        { label: '> 4.0 mg/dL', points: 3 }
      ] },
      { id: 'renal', label: 'Renal function', type: 'select', options: [
        { label: 'Creatinine clearance > 30 mL/min, no dialysis', points: 0 },
        { label: 'Creatinine clearance ≤ 30 mL/min (no dialysis)', points: 3 },
        { label: 'On dialysis', points: 4 }
      ] },
      { id: 'infection', label: 'Recent infection requiring IV antibiotics', type: 'check', points: 3 },
      { id: 'support', label: 'Mechanical circulatory / ventilatory support', hint: 'Select the single highest-risk support in place before transplant', type: 'select', options: [
        { label: 'None', points: 0 },
        { label: 'Ventricular assist device (durable)', points: 2 },
        { label: 'Intra-aortic balloon pump (IABP)', points: 2 },
        { label: 'Other temporary circulatory support', points: 3 },
        { label: 'Mechanical ventilation', points: 5 },
        { label: 'ECMO', points: 5 }
      ] }
    ],
    interpret: [
      { upTo: 2, text: 'IMPACT 0–2 — ~1-year survival ≈ 92.5% (validation cohort). Lower recipient risk.', level: 'low' },
      { upTo: 5, text: 'IMPACT 3–5 — ~1-year survival ≈ 89.9% (validation cohort).', level: 'mod' },
      { upTo: 9, text: 'IMPACT 6–9 — ~1-year survival ≈ 86.3% (validation cohort).', level: 'high' },
      { upTo: 50, text: 'IMPACT ≥ 10 — ~1-year survival ≈ 74.9% (validation cohort), falling below ~50% as scores approach 20+. Higher recipient risk.', level: 'vhigh' }
    ],
    notes: 'Index for Mortality Prediction After Cardiac Transplantation (Weiss et al. 2011), a UNOS-derived recipient risk index for 1-year mortality after first-time orthotopic heart transplantation (theoretical range 0–50; observed derivation range 0–33, mean ~6). Each point raised the odds of 1-year death by ~14%. The 1-year survival bands (0–2, 3–5, 6–9, ≥10) are from the validation cohort. Only recipient factors are scored — donor and matching factors are not included. The mechanical-support item takes the single highest-risk device in place. Point weights reproduce the published component structure but a few individual category weights should be confirmed against Weiss et al. Table before any weight-sensitive use; discrimination in external validations has been modest (c-statistic ~0.6). Verify against the primary publication before clinical use.',
    refs: [
      'Weiss ES et al. Creation of a quantitative recipient risk index for mortality prediction after cardiac transplantation (IMPACT). Ann Thorac Surg 2011;92:914-21.',
      'Weiss ES et al. Validation of the United States-derived IMPACT score using international registry data. J Heart Lung Transplant 2013;32:492-8.'
    ]
  });

  /* ---------- Michigan RVFRS (local points) ---------- */
  CARDIO.register({
    id: 'rvfrs-michigan',
    name: 'Right Ventricular Failure Risk Score (Michigan RVFRS)',
    category: 'advhf',
    short: 'Risk of RV failure / need for RVAD after LVAD implantation',
    keywords: ['lvad', 'right ventricular failure', 'rvad', 'rv failure', 'rvfrs', 'matthews'],
    inputs: [
      { id: 'vasopressor', label: 'Vasopressor requirement', hint: 'Pre-operative need for a vasopressor agent', type: 'check', points: 4 },
      { id: 'ast', label: 'AST ≥ 80 IU/L', hint: 'Aspartate aminotransferase', type: 'check', points: 2 },
      { id: 'bili', label: 'Total bilirubin ≥ 2.0 mg/dL', hint: '≥ 34 µmol/L', type: 'check', points: 2.5 },
      { id: 'creat', label: 'Creatinine ≥ 2.3 mg/dL', hint: '≥ 203 µmol/L', type: 'check', points: 3 }
    ],
    interpret: [
      { upTo: 3.0, text: 'RVFRS ≤ 3.0 — lower risk. RV failure odds ratio ~0.49; 180-day survival ~90% in the derivation cohort.', level: 'low' },
      { upTo: 5.0, text: 'RVFRS 4.0–5.0 — intermediate risk. RV failure odds ratio ~2.8; 180-day survival ~80% in the derivation cohort.', level: 'high' },
      { upTo: 11.5, text: 'RVFRS ≥ 5.5 — high risk. RV failure odds ratio ~7.6; 180-day survival ~66% in the derivation cohort. Consider a planned biventricular support / RVAD strategy.', level: 'vhigh' }
    ],
    notes: 'Matthews et al. 2008. Points: vasopressor requirement 4, AST ≥ 80 IU/L 2, total bilirubin ≥ 2.0 mg/dL 2.5, creatinine ≥ 2.3 mg/dL 3 (total range 0–11.5). Risk strata: ≤ 3.0 lower, 4.0–5.0 intermediate, ≥ 5.5 high — odds of RV failure rise stepwise across strata and 180-day survivals were ~90/80/66%. Derived in an early, largely pulsatile-era single-center LVAD cohort (n=197); external validation in contemporary continuous-flow devices has been modest, so interpret alongside INTERMACS profile, hemodynamics, and echocardiographic RV assessment. Verify against the primary publication before clinical use.',
    refs: [
      'Matthews JC et al. The right ventricular failure risk score: a pre-operative tool for assessing the risk of right ventricular failure in left ventricular assist device candidates. J Am Coll Cardiol 2008;51:2163-72.'
    ]
  });

  /* ---------- Heart transplant donor risk index (local points) ---------- */
  CARDIO.register({
    id: 'heart-donor-risk-index',
    name: 'Heart Transplant Donor Risk Index',
    category: 'advhf',
    short: 'Quantitative donor risk index for post-transplant outcome',
    keywords: ['transplant', 'donor', 'allograft', 'donor risk index', 'dri', 'weiss'],
    inputs: [
      { id: 'ischemia', label: 'Allograft ischemic time', hint: 'Cross-clamp to reperfusion', type: 'select', options: [
        { label: '< 2 hours', points: 0 },
        { label: '2 to < 4 hours', points: 2 },
        { label: '≥ 4 hours', points: 4 }
      ] },
      { id: 'age', label: 'Donor age', type: 'select', options: [
        { label: '< 30 years', points: 0 },
        { label: '30–49 years', points: 2 },
        { label: '≥ 50 years', points: 4 }
      ] },
      { id: 'mismatch', label: 'Donor–recipient race mismatch', hint: 'Donor and recipient of different race/ethnicity', type: 'check', points: 3 },
      { id: 'buncr', label: 'BUN / creatinine ratio ≥ 30', type: 'check', points: 2 }
    ],
    interpret: [
      { upTo: 3, text: 'Lower donor-risk band. Donor factors contribute relatively little additional 1-year mortality risk.', level: 'low' },
      { upTo: 7, text: 'Intermediate donor-risk band. Each additional point raised the odds of 1-year death by roughly 9–13% in the derivation/validation cohorts.', level: 'mod' },
      { upTo: 13, text: 'Higher donor-risk band. Consider donor factors alongside recipient risk (e.g., IMPACT) and expected ischemic time when accepting the offer.', level: 'high' }
    ],
    notes: 'Weiss et al. 2012 UNOS-derived donor risk index for short-term (1-year) mortality after orthotopic heart transplantation. Four donor/matching variables: ischemic time, donor age, donor–recipient race mismatch, and BUN/creatinine ratio (published scale ~1–15; observed derivation range 1–15, mean ~4). Each 1-point increase raised the odds of 1-year death by ~9% (derivation) to ~13% (validation). SIMPLIFICATION: the primary publication\'s exact per-category point weights are not reproduced here — the category cut-points and weights above approximate the published structure and the ordering of risk, not the exact coefficients. Treat the total as a relative donor-risk index, not an exact published score. Verify against the primary publication before clinical use.',
    refs: [
      'Weiss ES et al. Development of a quantitative donor risk index to predict short-term mortality in orthotopic heart transplantation. J Heart Lung Transplant 2012;31:266-73.'
    ]
  });

  /* ---------- Predicted Heart Mass donor–recipient size matching ---------- */
  CARDIO.register({
    id: 'phm-sizing',
    name: 'Heart Transplant Sizing (Predicted Heart Mass)',
    category: 'advhf',
    short: 'Donor–recipient size match by predicted heart mass (PHM) ratio',
    keywords: ['transplant', 'donor', 'recipient', 'sizing', 'predicted heart mass', 'phm', 'size match', 'matching'],
    kind: 'custom',
    inputs: [
      { id: 'dsex', label: 'Donor sex', type: 'select', options: [
        { label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }
      ] },
      { id: 'dage', label: 'Donor age', type: 'number', unit: 'years', min: 1, max: 90, step: 1, placeholder: 'e.g. 30' },
      { id: 'dht', label: 'Donor height', type: 'number', unit: 'cm', units: [{ label: 'cm', factor: 1, system: 'si' }, { label: 'in', factor: 2.54, system: 'us' }], min: 100, max: 220, step: 1, placeholder: 'e.g. 178' },
      { id: 'dwt', label: 'Donor weight', type: 'number', unit: 'kg', units: [{ label: 'kg', factor: 1, system: 'si' }, { label: 'lb', factor: 0.45359237, system: 'us' }], min: 20, max: 250, step: 0.5, placeholder: 'e.g. 80' },
      { id: 'rsex', label: 'Recipient sex', type: 'select', options: [
        { label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }
      ] },
      { id: 'rage', label: 'Recipient age', type: 'number', unit: 'years', min: 1, max: 90, step: 1, placeholder: 'e.g. 55' },
      { id: 'rht', label: 'Recipient height', type: 'number', unit: 'cm', units: [{ label: 'cm', factor: 1, system: 'si' }, { label: 'in', factor: 2.54, system: 'us' }], min: 100, max: 220, step: 1, placeholder: 'e.g. 175' },
      { id: 'rwt', label: 'Recipient weight', type: 'number', unit: 'kg', units: [{ label: 'kg', factor: 1, system: 'si' }, { label: 'lb', factor: 0.45359237, system: 'us' }], min: 20, max: 250, step: 0.5, placeholder: 'e.g. 85' }
    ],
    compute: function (v) {
      if (v.dage == null || v.dht == null || v.dwt == null || v.rage == null || v.rht == null || v.rwt == null) return null;
      if (v.dage <= 0 || v.dht <= 0 || v.dwt <= 0 || v.rage <= 0 || v.rht <= 0 || v.rwt <= 0) return null;
      function phm(sex, age, htcm, wt) {
        var h = htcm / 100;
        var lv = (sex === 'female' ? 6.82 : 8.25) * Math.pow(h, 0.54) * Math.pow(wt, 0.61);
        var rv = (sex === 'female' ? 10.59 : 11.25) * Math.pow(age, -0.32) * Math.pow(h, 1.135) * Math.pow(wt, 0.315);
        return { lv: lv, rv: rv, total: lv + rv };
      }
      var d = phm(v.dsex || 'male', v.dage, v.dht, v.dwt);
      var r = phm(v.rsex || 'male', v.rage, v.rht, v.rwt);
      var ratio = d.total / r.total;
      var mismatch = (d.total - r.total) / r.total * 100;

      var level, badge, text;
      if (ratio < 0.86) {
        level = 'high'; badge = 'Undersized donor';
        text = 'Donor heart is undersized for the recipient (PHM ratio < 0.86). This threshold was associated with increased post-transplant mortality (Kransdorf 2019). Reassess acceptance, especially with elevated PVR or pulmonary hypertension.';
      } else if (ratio <= 1.30) {
        level = 'low'; badge = 'Acceptable match';
        text = 'Donor–recipient size match is within the generally acceptable range (PHM ratio 0.86–1.30).';
      } else {
        level = 'mod'; badge = 'Oversized donor';
        text = 'Donor heart is oversized relative to the recipient. Oversizing is usually better tolerated than undersizing, but consider recipient chest-cavity capacity and risk of delayed chest closure.';
      }

      var detail =
        'Donor PHM: ' + d.total.toFixed(0) + ' g  (LV ' + d.lv.toFixed(0) + ' + RV ' + d.rv.toFixed(0) + ')\n' +
        'Recipient PHM: ' + r.total.toFixed(0) + ' g  (LV ' + r.lv.toFixed(0) + ' + RV ' + r.rv.toFixed(0) + ')\n' +
        'PHM ratio (donor ÷ recipient): ' + ratio.toFixed(2) + '\n' +
        'PHM mismatch: ' + (mismatch >= 0 ? '+' : '') + mismatch.toFixed(0) + '%';

      return {
        value: ratio.toFixed(2),
        unit: 'donor : recipient PHM',
        badge: badge,
        level: level,
        text: text,
        detail: detail,
        svg: phmGauge(ratio)
      };
    },
    notes: 'Predicted heart mass (PHM) is the guideline-preferred metric for donor–recipient size matching (superior to weight or height matching). PHM = predicted LV mass + predicted RV mass, from the MESA cardiac-MRI equations: LV = a·height(m)^0.54·weight(kg)^0.61 (a = 8.25 male, 6.82 female); RV = a·age^−0.32·height(m)^1.135·weight(kg)^0.315 (a = 11.25 male, 10.59 female). A donor:recipient PHM ratio < 0.86 (donor heart ≳14% smaller) was associated with increased mortality; oversizing is generally better tolerated. Verify against the primary publication before clinical use.',
    refs: [
      'Kransdorf EP et al. Predicted heart mass is the optimal metric for size match in heart transplantation. J Heart Lung Transplant 2019;38:156-165.',
      'Bluemke DA et al. The relationship of LV mass and geometry to incident cardiovascular events (MESA). J Am Coll Cardiol 2008;52:2148-55.',
      'Kawut SM et al. Sex and race differences in right ventricular structure and function (MESA-RV). Circulation 2011;123:2542-51.'
    ]
  });

})();
