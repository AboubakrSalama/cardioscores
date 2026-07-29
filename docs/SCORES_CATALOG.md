# Cardiology Risk Scores & Clinical Tools — Catalog

A comprehensive catalog of validated cardiology risk scores and clinical tools considered for the app, grouped using the app's category taxonomy. For each entry: name, what it predicts/assesses, and the key primary reference.

**Legend:** Entries flagged **(complex/proprietary model — official calculator recommended)** rely on multivariable regression coefficients, machine-derived models, or licensed/registry-owned algorithms that should not be re-implemented from the paper alone. For these, deep-link to the official calculator or use a licensed API (see roadmap at the end).

> References give first author, journal, and year of the key primary/derivation publication. Where a criterion set comes from a guideline or consensus statement, that document is cited instead.

---

## 1. Prevention & Primary Risk

| Score | Purpose | Reference |
|---|---|---|
| ASCVD Pooled Cohort Equations (PCE) | 10-year risk of first hard ASCVD event (MI, stroke, CV death) in primary prevention, ages 40–79 | Goff et al., Circulation, 2013 (ACC/AHA Risk Assessment Guideline) |
| Framingham Risk Score (general CVD) | 10-year global cardiovascular risk; older CHD-specific versions also exist | D'Agostino et al., Circulation, 2008 (CHD version: Wilson et al., Circulation, 1998) |
| SCORE2 (complex/proprietary model — official calculator recommended) | 10-year fatal + non-fatal CVD risk, ages 40–69, region-calibrated for Europe | SCORE2 Working Group & ESC Cardiovascular Risk Collaboration, Eur Heart J, 2021 |
| SCORE2-OP (complex/proprietary model — official calculator recommended) | 10-year CVD risk in older persons (age ≥70) | SCORE2-OP Working Group, Eur Heart J, 2021 |
| SCORE2-Diabetes (complex/proprietary model — official calculator recommended) | 10-year CVD risk in patients with type 2 diabetes | SCORE2-Diabetes Working Group, Eur Heart J, 2023 |
| QRISK3 (complex/proprietary model — official calculator recommended) | 10-year CVD risk (UK-derived; includes CKD, migraine, steroids, SLE, etc.) | Hippisley-Cox et al., BMJ, 2017 |
| AHA PREVENT equations (complex/proprietary model — official calculator recommended) | 10- and 30-year total CVD, ASCVD, and HF risk, ages 30–79; includes eGFR, optional UACR/HbA1c/SDI | Khan et al., Circulation, 2024 |
| Reynolds Risk Score | 10-year CVD risk incorporating hsCRP and family history (sex-specific versions) | Ridker et al., JAMA, 2007 (women); Ridker et al., Circulation, 2008 (men) |
| MESA CHD Risk Score (with CAC) | 10-year CHD risk integrating coronary artery calcium into traditional risk factors | McClelland et al., J Am Coll Cardiol, 2015 |
| Lp(a) interpretation thresholds | Risk-enhancer interpretation of lipoprotein(a) level (nmol/L vs mg/dL, risk categories) | Kronenberg et al., Eur Heart J, 2022 (EAS consensus statement) |
| Friedewald LDL-C formula | Calculated LDL-C from TC, HDL, TG (invalid at TG >400 mg/dL) | Friedewald et al., Clin Chem, 1972 |
| Martin–Hopkins LDL-C | LDL-C with adjustable TG:VLDL factor; more accurate at low LDL/high TG | Martin et al., JAMA, 2013 |
| Sampson (NIH equation 2) LDL-C | LDL-C equation valid up to TG 800 mg/dL | Sampson et al., JAMA Cardiol, 2020 |

## 2. ER / Chest Pain / ACS

| Score | Purpose | Reference |
|---|---|---|
| HEART Score | Risk of major adverse cardiac events (MACE) at 6 weeks in ED chest-pain patients; disposition aid | Six, Backus et al., Neth Heart J, 2008 |
| EDACS (+ accelerated diagnostic protocol) | Identify chest-pain patients safe for early discharge with negative serial troponins | Than et al., Emerg Med Australas, 2014 |
| TIMI Risk Score (UA/NSTEMI) | 14-day death/MI/urgent revascularization risk in UA/NSTEMI | Antman et al., JAMA, 2000 |
| TIMI Risk Score (STEMI) | 30-day mortality after STEMI | Morrow et al., Circulation, 2000 |
| GRACE / GRACE 2.0 (complex/proprietary model — official calculator recommended) | In-hospital and post-discharge mortality in ACS (guideline-endorsed for NSTE-ACS risk stratification) | Granger et al., Arch Intern Med, 2003; GRACE 2.0: Fox et al., BMJ Open, 2014 |
| CRUSADE Bleeding Score | In-hospital major bleeding risk in NSTEMI | Subherwal et al., Circulation, 2009 |
| ACTION ICU Score | Need for ICU-level care in initially stable NSTEMI | Fanaroff et al., 2018 |
| Killip Classification | Hemodynamic class on presentation with acute MI; mortality gradient | Killip & Kimball, Am J Cardiol, 1967 |
| Forrester Classification | Hemodynamic subsets in acute MI (perfusion × congestion; invasive counterpart of Killip) | Forrester et al., N Engl J Med, 1976 |
| Vancouver Chest Pain Rule | Identify low-risk chest pain eligible for early ED discharge | Christenson et al., Ann Emerg Med, 2006 |
| Zwolle Risk Score | Post-primary-PCI STEMI triage: identifies low-risk patients for early discharge / non-CCU care | De Luca et al., Circulation, 2004 |

## 3. Stable CAD & Ischemia

| Score | Purpose | Reference |
|---|---|---|
| Diamond–Forrester Model | Classic pretest probability of obstructive CAD from age/sex/chest-pain type | Diamond & Forrester, N Engl J Med, 1979 |
| ESC Pretest Probability (2019/2024 CCS guidelines) | Contemporary (recalibrated, lower) PTP tables; 2024 adds risk-factor-weighted clinical likelihood (RF-CL) | Knuuti et al., Eur Heart J, 2020 (2019 ESC CCS guidelines); update: Vrints et al., Eur Heart J, 2024 |
| Duke Clinical Score | Probability of significant CAD from history and exam | Pryor et al., Ann Intern Med, 1993 |
| Duke Treadmill Score | Prognosis (5-year survival) from exercise ECG: time, ST deviation, angina index | Mark et al., N Engl J Med, 1991 |
| CAC Score (Agatston) | Quantifies coronary artery calcium burden on non-contrast CT; risk reclassification | Agatston et al., J Am Coll Cardiol, 1990 |
| MESA CAC Percentile | Age/sex/ethnicity percentile for an observed Agatston score | McClelland et al., Circulation, 2006 |

## 4. Heart Failure

| Score | Purpose | Reference |
|---|---|---|
| NYHA Functional Classification | Symptom-based functional class I–IV | Criteria Committee, New York Heart Association (9th ed., 1994) |
| Framingham HF Diagnostic Criteria | Clinical diagnosis of heart failure (major/minor criteria) | McKee et al., N Engl J Med, 1971 |
| GWTG-HF Risk Score | In-hospital mortality in acute HF (point-based) | Peterson et al., Circ Cardiovasc Qual Outcomes, 2010 |
| ADHERE Risk Tree | In-hospital mortality in ADHF from BUN, SBP, creatinine (classification tree) | Fonarow et al., JAMA, 2005 |
| EFFECT Risk Score | 30-day and 1-year mortality after HF hospitalization | Lee et al., JAMA, 2003 |
| OPTIMIZE-HF Risk Nomogram | In-hospital mortality in hospitalized HF | Abraham et al., J Am Coll Cardiol, 2008 |
| MAGGIC Risk Score | 1- and 3-year mortality in chronic HF (integer score version is implementable) | Pocock et al., Eur Heart J, 2013 |
| Seattle Heart Failure Model (complex/proprietary model — official calculator recommended) | 1/2/5-year survival in chronic HF, with therapy-effect modeling | Levy et al., Circulation, 2006 |
| MECKI Score (complex/proprietary model — official calculator recommended) | Mortality/urgent transplant risk in HFrEF from CPET + clinical variables | Agostoni et al., Int J Cardiol, 2013 |
| 3C-HF Score | 1-year mortality in chronic HF from routine clinical variables | Senni et al., Int J Cardiol, 2013 |
| BCN Bio-HF Calculator (complex/proprietary model — official calculator recommended) | Mortality/hospitalization risk in chronic HF incorporating biomarkers (NT-proBNP, hs-TnT, ST2) | Lupón et al., PLoS One, 2014 |
| H2FPEF Score | Probability of HFpEF in unexplained exertional dyspnea (point score; continuous version also published) | Reddy et al., Circulation, 2018 |
| HFA-PEFF Algorithm | Stepwise diagnostic algorithm/score for HFpEF (functional, morphological, biomarker domains) | Pieske et al., Eur Heart J, 2019 |
| MEESSI-AHF (complex/proprietary model — official calculator recommended) | 30-day mortality in ED acute HF; disposition aid | Miró et al., Ann Intern Med, 2017 |
| Ottawa Heart Failure Risk Scale | Serious adverse event risk in ED acute HF; safe-discharge aid | Stiell et al., Acad Emerg Med, 2013 |
| ESCAPE Risk Model & Discharge Score | 6-month mortality after hospitalization for advanced HF | O'Connor et al., J Am Coll Cardiol, 2010 |
| EVEREST Risk Model | Post-discharge mortality/rehospitalization after ADHF admission (derived from the EVEREST trial cohort) | — |

## 5. AF & Anticoagulation

| Score | Purpose | Reference |
|---|---|---|
| CHA₂DS₂-VASc | Ischemic stroke/thromboembolism risk in non-valvular AF; anticoagulation decision | Lip et al., Chest, 2010 |
| CHA₂DS₂-VA | Sex-category-free update of CHA₂DS₂-VASc adopted by the 2024 ESC AF guideline | Van Gelder et al., Eur Heart J, 2024 (ESC AF guidelines) |
| CHADS₂ | Legacy AF stroke-risk score | Gage et al., JAMA, 2001 |
| HAS-BLED | Major bleeding risk on anticoagulation; flags modifiable bleeding factors | Pisters et al., Chest, 2010 |
| ORBIT Bleeding Score | Major bleeding risk in AF on anticoagulation (5 items) | O'Brien et al., Eur Heart J, 2015 |
| ATRIA Stroke Risk Score | Stroke risk in AF (alternative to CHADS-family) | Singer et al., J Am Heart Assoc, 2013 |
| ATRIA Bleeding Risk Score | Warfarin-associated major hemorrhage risk | Fang et al., J Am Coll Cardiol, 2011 |
| HEMORR₂HAGES | Bleeding risk in elderly AF patients on warfarin | Gage et al., Am Heart J, 2006 |
| SAMe-TT₂R₂ | Predicts poor INR time-in-therapeutic-range on VKA (choose DOAC vs VKA) | Apostolakis et al., Chest, 2013 |
| EHRA Symptom Classification (modified) | AF symptom severity class 1–4 (2a/2b) | Wynn et al., Europace, 2014 (original: EHRA consensus, 2007) |
| APPLE Score | Rhythm outcome / low-voltage substrate prediction after AF catheter ablation | Kornej et al., Clin Res Cardiol, 2015 |
| CAAP-AF Score | Freedom from AF after catheter ablation | Winkle et al., Heart Rhythm, 2016 |
| ABC-Stroke / ABC-Bleeding Scores (complex/proprietary model — official calculator recommended) | Biomarker-based (troponin, NT-proBNP, GDF-15) stroke and bleeding risk in AF | Hijazi et al., Eur Heart J, 2016 (stroke); Hijazi et al., Lancet, 2016 (bleeding) |

*Note: an "AF-BLEED" entry from the app taxonomy was intentionally omitted pending verification of the primary source; do not ship without a confirmed reference.*

## 6. EP / Syncope / SCD

| Score | Purpose | Reference |
|---|---|---|
| HCM Risk-SCD (complex/proprietary model — official calculator recommended) | 5-year sudden cardiac death risk in hypertrophic cardiomyopathy; ICD decision (ESC) | O'Mahony et al., Eur Heart J, 2014 |
| HCM Risk-Kids | 5-year SCD risk in childhood HCM | Norrish et al., JAMA Cardiol, 2019 |
| PRIMaCY (complex/proprietary model — official calculator recommended) | SCD risk prediction in pediatric HCM | Miron et al., Circulation, 2020 |
| Schwartz Score (LQTS) | Diagnostic probability of congenital long QT syndrome | Schwartz et al., Circulation, 1993 (updated 2011) |
| Tisdale Risk Score | Risk of drug-associated QT prolongation in hospitalized patients | Tisdale et al., Circ Cardiovasc Qual Outcomes, 2013 |
| Shanghai Score (Brugada) | Diagnostic probability of Brugada syndrome | Antzelevitch et al., 2016 (J-wave syndromes expert consensus, Heart Rhythm/Europace) |
| 2010 ARVC Task Force Criteria | Diagnosis of arrhythmogenic right ventricular cardiomyopathy (major/minor criteria) | Marcus et al., Circulation / Eur Heart J, 2010 |
| San Francisco Syncope Rule | Serious outcome risk after ED syncope (CHESS mnemonic) | Quinn et al., Ann Emerg Med, 2004 |
| Canadian Syncope Risk Score | 30-day serious adverse event risk after ED syncope | Thiruganasambandamoorthy et al., CMAJ, 2016 |
| EGSYS Score | Likelihood that syncope is cardiac | Del Rosso et al., Heart, 2008 |
| OESIL Risk Score | 1-year mortality after syncope | Colivicchi et al., Eur Heart J, 2003 |
| ROSE Rule | 1-month serious outcome/death after ED syncope (includes BNP) | Reed et al., J Am Coll Cardiol, 2010 |
| Boston Syncope Criteria | Adverse outcome risk in ED syncope | Grossman et al., J Emerg Med, 2007 |
| Brugada Algorithm (wide-QRS tachycardia) | Stepwise ECG algorithm to distinguish VT from SVT with aberrancy | Brugada et al., Circulation, 1991 |
| Vereckei aVR Algorithm | Single-lead (aVR) algorithm for VT vs SVT | Vereckei et al., Heart Rhythm, 2008 |
| MADIT-ICD Benefit Score | Balances predicted VT/VF benefit vs non-arrhythmic mortality for primary-prevention ICD | Younis et al., Eur Heart J, 2021 |

## 7. ECG Tools

| Score | Purpose | Reference |
|---|---|---|
| QTc — Bazett | Heart-rate-corrected QT (overcorrects at high HR) | Bazett, Heart, 1920 |
| QTc — Fridericia | Cube-root QT correction; preferred at extremes of rate | Fridericia, Acta Med Scand, 1920 |
| QTc — Framingham (Sagie) | Linear QT correction | Sagie et al., Am J Cardiol, 1992 |
| QTc — Hodges | Rate-linear QT correction | Hodges et al., 1983 |
| Sokolow–Lyon Index | ECG LVH voltage criterion (SV1 + RV5/6) | Sokolow & Lyon, Am Heart J, 1949 |
| Cornell Voltage / Product | Sex-specific ECG LVH criterion (RaVL + SV3) | Casale et al., Circulation, 1987 |
| Romhilt–Estes Point Score | Multifactor ECG LVH point system | Romhilt & Estes, Am Heart J, 1968 |
| Peguero–Lo Presti Criterion | Newer LVH voltage criterion (SD + SV4); higher sensitivity | Peguero et al., J Am Coll Cardiol, 2017 |
| Sgarbossa Criteria | Acute MI diagnosis in LBBB/ventricular pacing | Sgarbossa et al., N Engl J Med, 1996 |
| Modified Sgarbossa (Smith) | Proportional ST/S ratio rule for OMI in LBBB | Smith et al., Ann Emerg Med, 2012 |
| QRS Axis Calculator | Frontal-plane axis from limb leads; axis-deviation classification | Standard method — no single primary reference |
| Early Repolarization Pattern | Standardized definition/measurement of ER (J-point elevation) | Macfarlane et al., J Am Coll Cardiol, 2015 (consensus) |

## 8. Interventional / PCI

| Score | Purpose | Reference |
|---|---|---|
| SYNTAX Score I (complex/proprietary model — official calculator recommended) | Angiographic coronary complexity; CABG-vs-PCI decision support | Sianos et al., EuroIntervention, 2005 |
| SYNTAX Score II (complex/proprietary model — official calculator recommended) | 4-year mortality prediction for CABG vs PCI combining anatomy + clinical factors (SYNTAX II 2020 update exists) | Farooq et al., Lancet, 2013 |
| DAPT Score | Benefit/harm of extending DAPT beyond 12 months post-PCI | Yeh et al., JAMA, 2016 |
| PRECISE-DAPT Score | Out-of-hospital bleeding risk on DAPT after PCI; guides short DAPT | Costa et al., Lancet, 2017 |
| ARC-HBR Criteria | Standardized definition of high bleeding risk in PCI (major/minor criteria) | Urban et al., Circulation / Eur Heart J, 2019 |
| Mehran Score (CIN) | Contrast-induced nephropathy risk after PCI (2021 updated model also published) | Mehran et al., J Am Coll Cardiol, 2004 |
| NCDR CathPCI Mortality Model (complex/proprietary model — official calculator recommended) | In-hospital mortality after PCI (registry model) | Peterson et al., J Am Coll Cardiol, 2010 |
| NCDR CathPCI Bleeding Model (complex/proprietary model — official calculator recommended) | Post-PCI major bleeding risk | Rao et al., JACC Cardiovasc Interv, 2013 |
| NCDR AKI Model (complex/proprietary model — official calculator recommended) | Acute kidney injury / dialysis risk after PCI | Tsai et al., 2014 |
| EuroSCORE II in heart-team context (complex/proprietary model — official calculator recommended) | Surgical-risk anchor used when weighing PCI vs surgery in heart-team discussions | Nashef et al., Eur J Cardiothorac Surg, 2012 |
| Zwolle Risk Score | (Cross-listed from ACS) early-discharge triage after primary PCI for STEMI | De Luca et al., Circulation, 2004 |

## 9. Cardiac Surgery / CABG / Valve / TAVR

| Score | Purpose | Reference |
|---|---|---|
| EuroSCORE I (additive & logistic) | Operative mortality in cardiac surgery (legacy; overestimates in modern practice) | Nashef et al., Eur J Cardiothorac Surg, 1999; logistic: Roques et al., 2003 |
| EuroSCORE II (complex/proprietary model — official calculator recommended) | Contemporary operative mortality model for cardiac surgery | Nashef et al., Eur J Cardiothorac Surg, 2012 |
| STS PROM (complex/proprietary model — official calculator recommended) | Predicted risk of mortality/morbidity for CABG and valve surgery (STS registry models) | O'Brien, Shahian et al., Ann Thorac Surg, 2009 (2018 update: O'Brien et al., Ann Thorac Surg, 2018) |
| ACEF Score | Simple operative mortality estimate: Age / EF / Creatinine | Ranucci et al., Circulation, 2009 |
| ACEF II | ACEF updated with anemia and emergency status | Ranucci et al., Eur Heart J, 2018 |
| Parsonnet Score | Historic additive risk model for cardiac surgery | Parsonnet et al., Circulation, 1989 |
| Ambler Score | Mortality risk in heart valve surgery (UK) | Ambler et al., Circulation, 2005 |
| STS/ACC TVT Registry TAVR Model (complex/proprietary model — official calculator recommended) | In-hospital mortality after TAVR (registry model) | Edwards et al., JAMA Cardiol, 2016 |
| German Aortic Valve Score | Mortality after aortic valve procedures (German registry) | Kötting et al., Eur J Cardiothorac Surg, 2013 |
| Wilkins Score | Mitral valve anatomy suitability for percutaneous balloon mitral valvuloplasty (cross-listed in Imaging) | Wilkins et al., Br Heart J, 1988 |

## 10. Preop Assessment for Non-cardiac Surgery

| Score | Purpose | Reference |
|---|---|---|
| RCRI (Revised Cardiac Risk Index / Lee) | Major cardiac complication risk after non-cardiac surgery (6 items) | Lee et al., Circulation, 1999 |
| Gupta MICA | Perioperative MI or cardiac arrest risk (NSQIP-derived logistic model) | Gupta et al., Circulation, 2011 |
| ACS NSQIP Surgical Risk Calculator (complex/proprietary model — official calculator recommended) | Procedure-specific multi-outcome perioperative risk | Bilimoria et al., J Am Coll Surg, 2013 |
| DASI (Duke Activity Status Index) | Functional capacity questionnaire; estimates peak METs/VO₂ | Hlatky et al., Am J Cardiol, 1989 |
| METs Functional Capacity Assessment | Threshold-based functional assessment (<4 METs flag) in preop guidelines | Fleisher et al., Circulation, 2014 (ACC/AHA perioperative guideline) |
| Perioperative Troponin Surveillance (MINS) — context | hs-troponin thresholds after non-cardiac surgery associated with 30-day mortality (surveillance protocol, not a score) | Devereaux et al. (VISION), JAMA, 2017 |
| Caprini VTE Risk Score | Perioperative venous thromboembolism risk; prophylaxis intensity | Caprini, Dis Mon, 2005 |
| POSSUM / Portsmouth-POSSUM (complex/proprietary model — official calculator recommended) | Physiologic + operative severity model for perioperative morbidity/mortality | Copeland et al., Br J Surg, 1991 |

## 11. PE / VTE / Aorta / Pulmonary Hypertension

| Score | Purpose | Reference |
|---|---|---|
| Wells Score (PE) | Pretest probability of pulmonary embolism (two- and three-tier) | Wells et al., Thromb Haemost, 2000 |
| Wells Score (DVT) | Pretest probability of deep vein thrombosis | Wells et al., Lancet, 1997 |
| Revised Geneva Score | Objective pretest probability of PE (no clinician gestalt item) | Le Gal et al., Ann Intern Med, 2006 |
| PERC Rule | Rules out PE without testing in low-prevalence, low-gestalt patients | Kline et al., J Thromb Haemost, 2004 |
| YEARS Algorithm | Simplified PE workup with variable D-dimer threshold | van der Hulle et al., Lancet, 2017 |
| PEGeD | Clinical-probability-adjusted D-dimer strategy for PE | Kearon et al., N Engl J Med, 2019 |
| PESI / sPESI | 30-day mortality after acute PE; outpatient-treatment triage | Aujesky et al., Am J Respir Crit Care Med, 2005; simplified: Jiménez et al., Arch Intern Med, 2010 |
| Bova Score | Risk of PE-related complications in normotensive PE (intermediate-risk stratification) | Bova et al., Eur Respir J, 2014 |
| Hestia Criteria | Eligibility for outpatient PE treatment (exclusion checklist) | Zondag et al., J Thromb Haemost, 2011 |
| FAST Score | Prognostication in normotensive PE (H-FABP/troponin, syncope, tachycardia) | Dellas et al., 2014 |
| ADD-RS (Aortic Dissection Detection Risk Score) | Pretest probability of acute aortic syndrome; pairs with D-dimer (ADvISED) | Rogers et al., Circulation, 2011 (validation: Nazerian et al., Circulation, 2018) |
| IRAD — context | Registry describing presentation/mortality of acute aortic dissection; in-hospital mortality predictors published | Hagan et al., JAMA, 2000 |
| REVEAL 2.0 / REVEAL Lite 2 | Mortality risk in pulmonary arterial hypertension (point-based registry score) | Benza et al., Chest, 2019 |
| ESC/ERS PH Risk Table (3-strata & 4-strata) | Low/intermediate/high 1-year mortality stratification in PAH; COMPERA 4-strata follow-up tool | Humbert et al., Eur Heart J, 2022 (2022 ESC/ERS PH guidelines) |
| Khorana Score | VTE risk in ambulatory cancer patients starting chemotherapy; thromboprophylaxis decision | Khorana et al., Blood, 2008 |

## 12. Advanced HF / LVAD / Transplant

| Score | Purpose | Reference |
|---|---|---|
| INTERMACS Profiles | 7-level clinical severity classification of advanced HF; MCS timing | Stevenson et al., J Heart Lung Transplant, 2009 |
| HeartMate II Risk Score | 90-day mortality after continuous-flow LVAD implant | Cowger et al., J Am Coll Cardiol, 2013 |
| EUROMACS-RHF Score | Right heart failure risk after LVAD implantation | Soliman et al., Circulation, 2018 |
| Michigan RV Failure Score | RV failure risk after LVAD | Matthews et al., J Am Coll Cardiol, 2008 |
| CRT Response Prediction — context | No single guideline-endorsed score; app should surface guideline predictors (LBBB morphology, QRS ≥150 ms, NICM) rather than a specific model | Glikson et al., Eur Heart J, 2021 (ESC pacing/CRT guidelines) |
| IMPACT Score | 1-year mortality after heart transplantation | Weiss et al., Ann Thorac Surg, 2011 |
| RADIAL Score | Primary graft failure risk after heart transplant (donor/recipient factors) | Segovia et al., J Heart Lung Transplant, 2011 |
| MELD | Liver dysfunction severity; prognostic in cardiohepatic syndrome and pre-LVAD/transplant assessment | Kamath et al., Hepatology, 2001 |
| MELD-XI | INR-free MELD variant for anticoagulated cardiac patients | Heuman et al., Liver Transpl, 2007 |

## 13. Congenital & Pregnancy

| Score | Purpose | Reference |
|---|---|---|
| CARPREG I | Maternal cardiac event risk in pregnancy with heart disease | Siu et al., Circulation, 2001 |
| CARPREG II | Updated 10-predictor maternal cardiac risk index | Silversides et al., J Am Coll Cardiol, 2018 |
| ZAHARA | Maternal/neonatal risk in pregnancy with congenital heart disease | Drenthen et al., Eur Heart J, 2010 |
| Modified WHO (mWHO) Classification | Lesion-based maternal risk classification I–IV; guideline-preferred tool | Regitz-Zagrosek et al., Eur Heart J, 2018 (ESC pregnancy guidelines) |
| RACHS-1 | Surgical mortality risk categories for congenital heart surgery | Jenkins et al., J Thorac Cardiovasc Surg, 2002 |
| RACHS-2 | Updated congenital heart surgery risk categories | Allen et al., 2022 |
| Aristotle Basic Complexity Score | Procedure-based complexity/performance scoring in congenital heart surgery | Lacour-Gayet et al., Eur J Cardiothorac Surg, 2004 |
| STAT Mortality Categories | Empirically derived 5-category mortality risk for congenital heart operations | O'Brien et al., J Thorac Cardiovasc Surg, 2009 |
| Fontan Surveillance — context | Structured multi-organ surveillance schedule for Fontan physiology (not a score) | Rychik et al., Circulation, 2019 (AHA statement) |
| ACHD Anatomic & Physiological Classification (Bethesda-derived) | Severity classification of adult congenital heart disease (simple/moderate/complex; AP stages A–D) | Warnes et al., J Am Coll Cardiol, 2001 (32nd Bethesda); Stout et al., Circulation, 2019 (2018 ACC/AHA ACHD guideline) |

## 14. Imaging / Valves / Endocarditis

| Score | Purpose | Reference |
|---|---|---|
| Wilkins Score | Mitral stenosis anatomy (leaflet mobility, thickening, calcification, subvalvular) for PMBV suitability | Wilkins et al., Br Heart J, 1988 |
| Cormier Classification | Alternative anatomic grouping of MS for balloon commissurotomy | Iung, Cormier et al., 1996 |
| Modified Duke Criteria | Diagnosis of infective endocarditis (definite/possible/rejected) | Durack et al., Am J Med, 1994; modified: Li et al., Clin Infect Dis, 2000 |
| 2023 Duke-ISCVID Criteria | Updated IE criteria (PET/CT, prosthetic material, new microbiology) | Fowler et al., Clin Infect Dis, 2023 |
| ASE/EACVI Diastolic Function Algorithm | Stepwise grading of diastolic function and LV filling pressure | Nagueh et al., J Am Soc Echocardiogr, 2016 |
| AS Severity Grading | Aortic stenosis severity by Vmax, mean gradient, AVA; low-flow/low-gradient categories | Baumgartner et al., J Am Soc Echocardiogr / Eur Heart J Cardiovasc Imaging, 2017 |
| Continuity Equation (AVA) | Aortic valve area from LVOT and AV Doppler | Standard method (per Baumgartner et al., 2017) |
| Pressure Half-Time MVA | Mitral valve area from Doppler pressure half-time (220/PHT) | Hatle et al., Circulation, 1979 |
| LV Mass (Devereux) & Relative Wall Thickness | LV mass from linear echo dimensions; geometry classification (RWT 0.42 cutoff) | Devereux et al., Am J Cardiol, 1986; Lang et al., J Am Soc Echocardiogr, 2015 |
| PISA MR Quantification / EROA Thresholds | Quantitative MR grading (EROA, regurgitant volume/fraction) with severity thresholds | Zoghbi et al., J Am Soc Echocardiogr, 2017 |

## 15. Other Tools

| Score | Purpose | Reference |
|---|---|---|
| Jones Criteria (revised) | Diagnosis of acute rheumatic fever, risk-stratified by population | Gewitz et al., Circulation, 2015 (AHA statement) |
| Kawasaki Disease Criteria | Diagnosis of complete/incomplete Kawasaki disease; coronary surveillance | McCrindle et al., Circulation, 2017 (AHA statement) |
| Ghent Nosology (revised) | Diagnosis of Marfan syndrome (aortic Z-score, ectopia lentis, systemic score) | Loeys et al., J Med Genet, 2010 |
| Cockcroft–Gault | Creatinine clearance estimate (drug dosing, e.g., DOACs) | Cockcroft & Gault, Nephron, 1976 |
| CKD-EPI eGFR (2021) | Race-free GFR estimate (contrast risk, drug dosing, PREVENT input) | Inker et al., N Engl J Med, 2021 |
| BSA (Du Bois; Mosteller) | Body surface area for indexing (AVA, LV mass, aortic dimensions) | Du Bois & Du Bois, Arch Intern Med, 1916; Mosteller, N Engl J Med, 1987 |
| BMI / MAP Calculators | Body mass index; mean arterial pressure (DBP + PP/3) | Standard formulas |
| Shock Index | HR/SBP ratio; hemodynamic instability screen | Allgöwer & Burri, 1967 |
| Acute Pericarditis Criteria & Recurrence Risk | Diagnosis (2 of 4 criteria), high-risk features, CRP-guided taper; colchicine reduces recurrence | Adler et al., Eur Heart J, 2015 (ESC pericardial guidelines); Imazio et al., N Engl J Med, 2013 (ICAP) |

---

## Suggested Roadmap

### v1 — Simple, validated point scores (implement natively)

Deterministic integer/point scores and criteria sets with published, easily unit-testable logic. Low legal/IP risk, offline-capable:

- **ER/ACS:** HEART, EDACS, TIMI (both), CRUSADE, Killip, Zwolle, Vancouver
- **AF:** CHA₂DS₂-VASc / CHA₂DS₂-VA, CHADS₂, HAS-BLED, ORBIT, ATRIA (both), HEMORR₂HAGES, SAMe-TT₂R₂, EHRA
- **HF:** NYHA, Framingham criteria, GWTG-HF, MAGGIC (integer version), H2FPEF (point score), HFA-PEFF, Ottawa HF Risk Scale
- **Syncope/EP:** San Francisco, Canadian Syncope, EGSYS, OESIL, ROSE, Schwartz, Tisdale, Shanghai, Brugada & Vereckei algorithms (decision trees), 2010 ARVC TFC
- **ECG:** all QTc formulas, all LVH criteria, Sgarbossa/Modified Sgarbossa, QRS axis
- **PE/VTE:** Wells (both), Geneva, PERC, YEARS, PEGeD logic, PESI/sPESI, Bova, Hestia, Khorana, Caprini, ADD-RS
- **PCI/Surgery-adjacent:** DAPT, PRECISE-DAPT (nomogram), ARC-HBR, Mehran, ACEF/ACEF II, Wilkins
- **Preop:** RCRI, DASI, METs helper
- **Pregnancy/CHD:** CARPREG II, ZAHARA, mWHO
- **Imaging/Other:** Duke/Duke-ISCVID criteria, diastolic algorithm, AS grading, continuity equation, PHT MVA, LV mass/RWT, PISA/EROA, Jones, Kawasaki, Ghent, Cockcroft–Gault, CKD-EPI, BSA/BMI/MAP, shock index, pericarditis criteria
- **Classifications:** INTERMACS, Forrester, ACHD AP classification, STAT/RACHS categories (lookup tables)

### v2 — Complex regression / proprietary models (official links or licensed APIs)

Cox/logistic models with many coefficients, registry-owned or licensed algorithms, or models with periodic recalibration. Ship as deep links to official calculators, embedded web views where licensing allows, or licensed API integrations — with an in-app explainer of inputs and interpretation:

- **Primary prevention:** ASCVD PCE*, PREVENT, SCORE2/SCORE2-OP/SCORE2-Diabetes, QRISK3, MESA CHD*, Reynolds*
- **ACS:** GRACE 2.0
- **HF:** Seattle HFM, MEESSI-AHF, BCN Bio-HF, MECKI, EFFECT/OPTIMIZE nomograms
- **EP:** HCM Risk-SCD (ESC calculator), PRIMaCY, MADIT-ICD benefit
- **Interventional/Surgical:** SYNTAX I/II, NCDR CathPCI models, STS PROM, EuroSCORE II, STS/ACC TVT, German AV
- **Preop:** ACS NSQIP, Gupta MICA*, POSSUM
- **Advanced HF:** HeartMate II RS, EUROMACS-RHF, Michigan RVF, IMPACT
- **PH:** REVEAL 2.0 (point-based — could graduate to v1 after validation testing)

\* Published coefficients exist and native implementation is feasible if the team commits to coefficient-level unit tests against the original publications; otherwise link out.

**General cautions for v2:** verify licensing terms before embedding (QRISK3 is open-source under LGPL but UK-calibrated; STS and NCDR models are registry-owned; SYNTAX has an official web calculator), display model version/recalibration date, and keep a per-score reference screen citing the derivation paper and validation studies.
