/* CardioScores registry — loaded before all calculator files.
 * Calculator files call CARDIO.register({...}); see SCHEMA.md at repo root. */
(function () {
  'use strict';

  var CATEGORIES = [
    { id: 'prevention',  name: 'Prevention & Primary Risk',          icon: '🛡️', blurb: 'ASCVD, Framingham, SCORE2, lipids' },
    { id: 'acs',         name: 'ER · Chest Pain · ACS',              icon: '🚑', blurb: 'HEART, TIMI, GRACE, CRUSADE, Killip' },
    { id: 'ischemia',    name: 'Stable CAD & Ischemia',              icon: '🩸', blurb: 'Pretest probability, Duke treadmill, CAC' },
    { id: 'hf',          name: 'Heart Failure',                      icon: '💔', blurb: 'NYHA, GWTG-HF, MAGGIC, H2FPEF' },
    { id: 'af',          name: 'AF & Anticoagulation',               icon: '🌀', blurb: 'CHA₂DS₂-VASc, HAS-BLED, ORBIT' },
    { id: 'ep',          name: 'EP · Syncope · SCD',                 icon: '⚡', blurb: 'HCM Risk-SCD, LQTS, Brugada, syncope rules' },
    { id: 'ecg',         name: 'ECG Tools',                          icon: '📈', blurb: 'QTc, LVH criteria, Sgarbossa' },
    { id: 'pci',         name: 'Interventional · PCI',               icon: '🧷', blurb: 'DAPT, PRECISE-DAPT, ARC-HBR, Mehran' },
    { id: 'surgery',     name: 'Cardiac Surgery · TAVR',             icon: '🏥', blurb: 'EuroSCORE II, STS, ACEF' },
    { id: 'preop',       name: 'Preop Assessment (Non-cardiac)',     icon: '📋', blurb: 'RCRI, Gupta MICA, DASI, METs' },
    { id: 'vte',         name: 'PE · VTE · Aorta · PH',              icon: '🫁', blurb: 'Wells, PERC, PESI, ADD-RS, REVEAL' },
    { id: 'advhf',       name: 'Advanced HF · LVAD · Transplant',    icon: '🔋', blurb: 'INTERMACS, HeartMate II RS, MELD-XI' },
    { id: 'congenital',  name: 'Congenital & Pregnancy',             icon: '🧸', blurb: 'CARPREG II, mWHO, ZAHARA, RACHS-1' },
    { id: 'imaging',     name: 'Imaging · Valves · Endocarditis',    icon: '🩺', blurb: 'Wilkins, Duke criteria, echo formulas' },
    { id: 'misc',        name: 'Other Tools',                        icon: '🧮', blurb: 'Jones criteria, Kawasaki, BSA, MAP' }
  ];

  window.CARDIO = {
    categories: CATEGORIES,
    calculators: [],
    _ids: {},
    register: function (calc) {
      if (!calc || !calc.id || !calc.name || !calc.category) {
        throw new Error('CARDIO.register: id, name and category are required');
      }
      if (this._ids[calc.id]) {
        throw new Error('CARDIO.register: duplicate id "' + calc.id + '"');
      }
      var catOk = CATEGORIES.some(function (c) { return c.id === calc.category; });
      if (!catOk) {
        throw new Error('CARDIO.register: unknown category "' + calc.category + '" for ' + calc.id);
      }
      if (!calc.kind) calc.kind = 'points';
      this._ids[calc.id] = true;
      this.calculators.push(calc);
    }
  };
})();
