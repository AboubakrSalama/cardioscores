/* Category: congenital — Congenital heart disease & cardiac disease in pregnancy
 * Each entry follows SCHEMA.md. Point values verified against primary publications;
 * anything not verifiable with certainty is registered kind:'external'. */
(function () {
  'use strict';

  /* ---------- Modified WHO (mWHO) classification ---------- */
  CARDIO.register({
    id: 'mwho-pregnancy',
    name: 'Modified WHO (mWHO) Classification of Maternal Cardiovascular Risk',
    category: 'congenital',
    short: 'Maternal cardiac risk class for pregnancy in heart disease (2018 ESC guideline)',
    keywords: ['pregnancy', 'maternal risk', 'who class', 'esc', 'congenital'],
    inputs: [
      { id: 'cls', label: 'mWHO class of the underlying condition', type: 'select', hidePoints: true, options: [
        { label: 'mWHO I — no detectable increase in maternal mortality risk', points: 1 },
        { label: 'mWHO II — small increase in maternal mortality / moderate morbidity', points: 2 },
        { label: 'mWHO II–III — intermediate risk', points: 3 },
        { label: 'mWHO III — significantly increased maternal mortality / severe morbidity', points: 4 },
        { label: 'mWHO IV — extremely high risk; pregnancy contraindicated', points: 5 }
      ] }
    ],
    result: { unit: '' },
    interpret: [
      { upTo: 1, text: 'mWHO I: maternal cardiac event rate ~2.5–5.1%. Examples: small/mild pulmonary stenosis, PDA, or mitral valve prolapse; successfully repaired simple lesions (ASD, VSD, PDA, anomalous pulmonary venous drainage); isolated ectopic beats. Care in a local hospital; cardiology review once or twice during pregnancy.', level: 'low' },
      { upTo: 2, text: 'mWHO II: maternal cardiac event rate ~5.7–10.5%. Examples (if otherwise well): unoperated ASD or VSD, repaired tetralogy of Fallot, most arrhythmias, Turner syndrome without aortic dilatation. Care in a local hospital; cardiology review each trimester.', level: 'mod' },
      { upTo: 3, text: 'mWHO II–III: maternal cardiac event rate ~10–19%. Examples: mild LV impairment (EF > 45%), hypertrophic cardiomyopathy, native or tissue valve disease not in class I or IV, Marfan (or other HTAD) without aortic dilatation, bicuspid aortic valve with aorta < 45 mm, repaired coarctation, AV septal defect. Care in a referral hospital; cardiology review bimonthly.', level: 'mod' },
      { upTo: 4, text: 'mWHO III: maternal cardiac event rate ~19–27%. Examples: moderate LV impairment (EF 30–45%), previous peripartum cardiomyopathy without residual dysfunction, mechanical valve, systemic RV with good or mildly reduced function, uncomplicated Fontan circulation, unrepaired cyanotic heart disease, moderate mitral stenosis, severe asymptomatic aortic stenosis, moderate aortic dilatation, ventricular tachycardia. Expert-centre management; cardiology review monthly or bimonthly.', level: 'high' },
      { upTo: 5, text: 'mWHO IV: maternal cardiac event rate ~40–100% — pregnancy contraindicated; if it occurs, discuss termination and manage in an expert centre with monthly review. Examples: pulmonary arterial hypertension, severe systemic ventricular dysfunction (EF < 30% or NYHA III–IV), previous peripartum cardiomyopathy with residual dysfunction, severe mitral stenosis, severe symptomatic aortic stenosis, systemic RV with moderate/severely reduced function, severe aortic dilatation, vascular Ehlers–Danlos, severe (re)coarctation, Fontan with any complication.', level: 'vhigh' }
    ],
    notes: 'The displayed number is an internal index (1–5), not a point score — read the class from the interpretation. Event rates and condition examples are from the 2018 ESC pregnancy guideline (based on the ROPAC registry and mWHO validation studies). Classify by the most severe applicable lesion; pre-pregnancy counselling and an individualized plan are recommended for all classes above I.',
    refs: [
      'Regitz-Zagrosek V et al. 2018 ESC Guidelines for the management of cardiovascular diseases during pregnancy. Eur Heart J 2018;39:3165-241.',
      'Thorne S et al. Risks of contraception and pregnancy in heart disease. Heart 2006;92:1520-5.'
    ]
  });

  /* ---------- CARPREG II ---------- */
  CARDIO.register({
    id: 'carpreg-ii',
    name: 'CARPREG II',
    category: 'congenital',
    short: 'Risk of a primary maternal cardiac event during pregnancy in heart disease',
    keywords: ['pregnancy', 'maternal risk', 'cardiac event', 'carpreg'],
    inputs: [
      { id: 'prior_event', label: 'Prior cardiac events or arrhythmias', hint: 'Heart failure, arrhythmia, stroke, or TIA before pregnancy', type: 'check', points: 3 },
      { id: 'nyha_cyanosis', label: 'Baseline NYHA class III–IV or cyanosis', type: 'check', points: 3 },
      { id: 'mech_valve', label: 'Mechanical valve prosthesis', type: 'check', points: 3 },
      { id: 'vent_dysfn', label: 'Systemic ventricular dysfunction', hint: 'Reduced systemic ventricular ejection fraction', type: 'check', points: 2 },
      { id: 'valve_lvoto', label: 'High-risk left-sided valve disease / LV outflow tract obstruction', hint: 'e.g., aortic valve area < 1.5 cm², mitral valve area < 2.0 cm², or significant subaortic obstruction', type: 'check', points: 2 },
      { id: 'pah', label: 'Pulmonary hypertension', type: 'check', points: 2 },
      { id: 'cad', label: 'Coronary artery disease', type: 'check', points: 2 },
      { id: 'aortopathy', label: 'High-risk aortopathy', hint: 'e.g., significant aortic dilatation or heritable aortopathy', type: 'check', points: 2 },
      { id: 'no_intervention', label: 'No prior cardiac intervention', hint: 'No previous cardiac surgery or percutaneous cardiac procedure', type: 'check', points: 1 },
      { id: 'late_assess', label: 'Late pregnancy assessment', hint: 'First antenatal cardiac assessment after 20 weeks gestation', type: 'check', points: 1 }
    ],
    interpret: [
      { upTo: 1, text: 'Predicted risk of a primary maternal cardiac event ~5%.', level: 'low' },
      { upTo: 2, text: 'Predicted risk of a primary maternal cardiac event ~10%.', level: 'mod' },
      { upTo: 3, text: 'Predicted risk of a primary maternal cardiac event ~15%.', level: 'mod' },
      { upTo: 4, text: 'Predicted risk of a primary maternal cardiac event ~22%.', level: 'high' },
      { upTo: 21, text: 'Predicted risk of a primary maternal cardiac event ~41%. Expert multidisciplinary (pregnancy-heart-team) management.', level: 'vhigh' }
    ],
    notes: 'Derived in 1,938 pregnancies (Toronto). Primary cardiac events: cardiac death or arrest, sustained arrhythmia requiring treatment, heart failure, thromboembolism, stroke, dissection, and related events. The 2018 ESC guideline recommends risk assessment with the mWHO classification, with CARPREG II as a complementary tool.',
    refs: [
      'Silversides CK et al. Pregnancy outcomes in women with heart disease: the CARPREG II study. J Am Coll Cardiol 2018;71:2419-30.'
    ]
  });

  /* ---------- Original CARPREG ---------- */
  CARDIO.register({
    id: 'carpreg',
    name: 'CARPREG (original)',
    category: 'congenital',
    short: 'Original 4-predictor maternal cardiac risk score for pregnancy in heart disease',
    keywords: ['pregnancy', 'maternal risk', 'carpreg'],
    inputs: [
      { id: 'prior_event', label: 'Prior cardiac event or arrhythmia', hint: 'Heart failure, TIA, or stroke before pregnancy, or prior arrhythmia', type: 'check', points: 1 },
      { id: 'nyha_cyanosis', label: 'Baseline NYHA class > II or cyanosis', type: 'check', points: 1 },
      { id: 'obstruction', label: 'Left heart obstruction', hint: 'Mitral valve area < 2 cm², aortic valve area < 1.5 cm², or peak LV outflow gradient > 30 mmHg', type: 'check', points: 1 },
      { id: 'ef', label: 'Reduced systemic ventricular systolic function (EF < 40%)', type: 'check', points: 1 }
    ],
    interpret: [
      { upTo: 0, text: 'Estimated risk of a maternal cardiac event ~5%.', level: 'low' },
      { upTo: 1, text: 'Estimated risk of a maternal cardiac event ~27%.', level: 'high' },
      { upTo: 4, text: 'Estimated risk of a maternal cardiac event ~75%.', level: 'vhigh' }
    ],
    notes: 'Largely superseded by CARPREG II and the mWHO classification; retained for reference.',
    refs: [
      'Siu SC et al. Prospective multicenter study of pregnancy outcomes in women with heart disease. Circulation 2001;104:515-21.'
    ]
  });

  /* ---------- ZAHARA (local points) ---------- */
  CARDIO.register({
    id: 'zahara',
    name: 'ZAHARA Score',
    category: 'congenital',
    short: 'Maternal cardiovascular event risk in pregnancy with congenital heart disease',
    keywords: ['pregnancy', 'congenital', 'maternal risk', 'zahara', 'drenthen'],
    inputs: [
      { id: 'arrhythmia', label: 'History of arrhythmia', hint: 'Documented significant arrhythmia before pregnancy', type: 'check', points: 1.5 },
      { id: 'cardiacmed', label: 'Cardiac medication before pregnancy', type: 'check', points: 1.5 },
      { id: 'nyha', label: 'NYHA functional class > II (before pregnancy)', type: 'check', points: 0.75 },
      { id: 'lho', label: 'Left heart obstruction', hint: 'Peak LVOT gradient > 50 mmHg or aortic valve area < 1.0 cm²', type: 'check', points: 2.5 },
      { id: 'sysavr', label: 'Systemic AV valve regurgitation (moderate/severe)', type: 'check', points: 0.75 },
      { id: 'pulmavr', label: 'Pulmonary (subpulmonary) AV valve regurgitation (moderate/severe)', type: 'check', points: 0.75 },
      { id: 'mechvalve', label: 'Mechanical valve prosthesis', type: 'check', points: 4.25 },
      { id: 'cyanotic', label: 'Cyanotic heart disease (corrected or uncorrected)', type: 'check', points: 1 }
    ],
    interpret: [
      { upTo: 0.49, text: 'Score < 0.5 — estimated maternal cardiovascular complication rate ~2.9%.', level: 'low' },
      { upTo: 1.5, text: 'Score 0.5–1.5 — estimated maternal cardiovascular complication rate ~7.5%.', level: 'mod' },
      { upTo: 2.5, text: 'Score 1.51–2.5 — estimated maternal cardiovascular complication rate ~17.5%.', level: 'high' },
      { upTo: 3.5, text: 'Score 2.51–3.5 — estimated maternal cardiovascular complication rate ~43.1%.', level: 'vhigh' },
      { upTo: 13, text: 'Score > 3.5 — estimated maternal cardiovascular complication rate ~70%. Expert (pregnancy-heart-team) management.', level: 'vhigh' }
    ],
    notes: 'Drenthen et al. (ZAHARA study), derived exclusively in women with congenital heart disease — do not apply to acquired heart disease. Point weights: history of arrhythmia 1.5, cardiac medication before pregnancy 1.5, NYHA > II 0.75, left heart obstruction 2.5, moderate/severe systemic AV valve regurgitation 0.75, moderate/severe pulmonary AV valve regurgitation 0.75, mechanical valve prosthesis 4.25, cyanotic heart disease 1.0. Risk bands: < 0.5 (2.9%), 0.5–1.5 (7.5%), 1.51–2.5 (17.5%), 2.51–3.5 (43.1%), > 3.5 (70%). The 2018 ESC guideline uses the mWHO classification as the primary tool, with ZAHARA/CARPREG as complementary. Verify against the primary publication before clinical use.',
    refs: [
      'Drenthen W et al. Predictors of pregnancy complications in women with congenital heart disease (ZAHARA study). Eur Heart J 2010;31:2124-32.'
    ]
  });

  /* ---------- RACHS-1 ---------- */
  CARDIO.register({
    id: 'rachs-1',
    name: 'RACHS-1 (Risk Adjustment for Congenital Heart Surgery)',
    category: 'congenital',
    short: 'Risk categories (1–6) for in-hospital mortality after congenital heart surgery',
    keywords: ['congenital', 'surgery', 'pediatric', 'mortality', 'case mix'],
    inputs: [
      { id: 'cat', label: 'Risk category of the primary procedure', type: 'select', hidePoints: true, options: [
        { label: 'Category 1 — e.g., ASD secundum repair; PDA ligation (age > 30 d); coarctation repair (age > 30 d)', points: 1 },
        { label: 'Category 2 — e.g., VSD repair; tetralogy of Fallot repair; bidirectional Glenn; ASD primum repair', points: 2 },
        { label: 'Category 3 — e.g., complete AV septal defect repair; Fontan operation; mitral valve repair/replacement', points: 3 },
        { label: 'Category 4 — e.g., truncus arteriosus repair; interrupted aortic arch repair; Rastelli operation', points: 4 },
        { label: 'Category 5 — e.g., neonatal Ebstein repair (age ≤ 30 d); truncus arteriosus + interrupted arch repair', points: 5 },
        { label: 'Category 6 — e.g., Norwood operation (stage 1); Damus–Kaye–Stansel procedure', points: 6 }
      ] }
    ],
    result: { unit: '' },
    interpret: [
      { upTo: 1, text: 'Category 1: in-hospital mortality ~0.4% in the derivation cohorts.', level: 'low' },
      { upTo: 2, text: 'Category 2: in-hospital mortality ~3.8% in the derivation cohorts.', level: 'low' },
      { upTo: 3, text: 'Category 3: in-hospital mortality ~8.5% in the derivation cohorts.', level: 'mod' },
      { upTo: 4, text: 'Category 4: in-hospital mortality ~19.4% in the derivation cohorts.', level: 'high' },
      { upTo: 5, text: 'Category 5: too few cases in the derivation cohorts for a reliable mortality estimate (between categories 4 and 6 by design).', level: 'vhigh' },
      { upTo: 6, text: 'Category 6: in-hospital mortality ~47.7% in the derivation cohorts.', level: 'vhigh' }
    ],
    notes: 'Only representative procedures are listed — assign the category from the full published procedure tables (Jenkins et al.). If multiple procedures are performed, use the highest-category procedure. Designed for case-mix adjustment between programs, not individual prognosis; mortality figures are from 1996-era cohorts and contemporary rates are substantially lower.',
    refs: [
      'Jenkins KJ et al. Consensus-based method for risk adjustment for surgery for congenital heart disease. J Thorac Cardiovasc Surg 2002;123:110-8.'
    ]
  });

  /* ---------- Aristotle Basic Complexity Score (local, common-procedure subset) ---------- */
  CARDIO.register({
    id: 'aristotle-score',
    name: 'Aristotle Basic Complexity Score',
    category: 'congenital',
    short: 'Complexity adjustment for congenital heart surgery outcomes',
    keywords: ['congenital', 'surgery', 'complexity', 'aristotle'],
    kind: 'custom',
    inputs: [
      { id: 'proc', label: 'Primary procedure', hint: 'A common-procedure subset of the full 145-procedure Aristotle list; select the primary (highest-complexity) procedure.', type: 'select', options: [
        { label: 'Select a procedure…', value: 0 },
        { label: 'PDA closure, surgical — 3.0', value: 3.0 },
        { label: 'ASD repair, primary closure — 3.0', value: 3.0 },
        { label: 'ASD repair, patch — 3.0', value: 3.0 },
        { label: 'Pacemaker implantation, permanent — 3.0', value: 3.0 },
        { label: 'PAPVC repair — 5.0', value: 5.0 },
        { label: 'Valvuloplasty, pulmonic — 5.6', value: 5.6 },
        { label: 'VSD repair, patch — 6.0', value: 6.0 },
        { label: 'Partial AVSD (incomplete/PAVSD) repair — 6.0', value: 6.0 },
        { label: 'Coarctation repair, end to end — 6.0', value: 6.0 },
        { label: 'PA banding — 6.0', value: 6.0 },
        { label: 'ECMO procedure — 6.0', value: 6.0 },
        { label: 'Modified Blalock–Taussig shunt (MBTS) — 6.3', value: 6.3 },
        { label: 'Valve replacement, pulmonic (PVR) — 6.5', value: 6.5 },
        { label: 'Bidirectional Glenn (BDCPA) — 6.8', value: 6.8 },
        { label: 'Valve replacement, aortic (AVR) — 7.0', value: 7.0 },
        { label: 'Aortic arch repair — 7.0', value: 7.0 },
        { label: 'TOF repair, non-transanular patch — 7.5', value: 7.5 },
        { label: 'Valve replacement, mitral (MVR) — 7.5', value: 7.5 },
        { label: 'Conduit placement, RV to PA — 7.5', value: 7.5 },
        { label: 'TOF repair, transanular patch — 8.0', value: 8.0 },
        { label: 'Valvuloplasty, aortic — 8.0', value: 8.0 },
        { label: 'Senning — 8.5', value: 8.5 },
        { label: 'Complete AVSD (CAVSD) repair — 9.0', value: 9.0 },
        { label: 'TAPVC repair — 9.0', value: 9.0 },
        { label: 'Fontan, TCPC, external conduit, non-fenestrated — 9.0', value: 9.0 },
        { label: 'Fontan, TCPC, lateral tunnel, fenestrated — 9.0', value: 9.0 },
        { label: 'Mustard — 9.0', value: 9.0 },
        { label: 'Transplant, heart — 9.3', value: 9.3 },
        { label: 'Damus–Kaye–Stansel (DKS) — 9.5', value: 9.5 },
        { label: 'Arterial switch operation (ASO) — 10.0', value: 10.0 },
        { label: 'Rastelli — 10.0', value: 10.0 },
        { label: 'Ross procedure — 10.3', value: 10.3 },
        { label: 'Interrupted aortic arch repair — 10.8', value: 10.8 },
        { label: 'Truncus arteriosus repair — 11.0', value: 11.0 },
        { label: 'ASO + VSD repair — 11.0', value: 11.0 },
        { label: 'Konno procedure — 11.0', value: 11.0 },
        { label: 'Ross–Konno procedure — 12.5', value: 12.5 },
        { label: 'Double switch (atrial switch + ASO) — 13.8', value: 13.8 },
        { label: 'Norwood procedure (stage 1) — 14.5', value: 14.5 },
        { label: 'HLHS biventricular repair — 15.0', value: 15.0 }
      ] }
    ],
    compute: function (v) {
      var score = v.proc;
      if (!score || score <= 0) return null;
      var level, band, lvl;
      if (score <= 5.9) { level = 1; band = 'Complexity level 1 (lowest)'; lvl = 'low'; }
      else if (score <= 7.9) { level = 2; band = 'Complexity level 2'; lvl = 'mod'; }
      else if (score <= 9.9) { level = 3; band = 'Complexity level 3'; lvl = 'high'; }
      else { level = 4; band = 'Complexity level 4 (highest)'; lvl = 'vhigh'; }
      return {
        value: score.toFixed(1),
        unit: 'points',
        badge: 'Level ' + level,
        level: lvl,
        text: band + '. The basic score is the sum of the potentials for mortality, morbidity, and technical difficulty for the procedure (range 1.5–15).',
        detail: 'Aristotle complexity levels: 1 = 1.5–5.9, 2 = 6.0–7.9, 3 = 8.0–9.9, 4 = 10.0–15.0.\nHigher complexity is used to risk-adjust surgical performance (Complexity × Outcome = Performance), not to give an individual mortality estimate.'
      };
    },
    notes: 'SUBSET of the full Aristotle Basic Complexity Score — the complete expert-consensus system covers 145 congenital heart surgery procedures; the list here includes common operations with their exact published basic scores (Lacour-Gayet et al. 2004, Appendix 1). If the primary procedure is not listed, use the full published table or an STS-EACTS congenital database tool. Assign the primary (highest-complexity) procedure when several are performed. The basic score reflects procedure complexity only; the comprehensive score (1.5–25) adds patient-specific factors and is not implemented here. Verify against the primary publication before clinical use.',
    refs: [
      'Lacour-Gayet F et al. The Aristotle score for congenital heart surgery. Semin Thorac Cardiovasc Surg Pediatr Card Surg Annu 2004;7:185-91 (Appendix 1, Basic Complexity Score).',
      'Lacour-Gayet F et al. The Aristotle score: a complexity-adjusted method to evaluate surgical results. Eur J Cardiothorac Surg 2004;25:911-24.'
    ]
  });

})();
