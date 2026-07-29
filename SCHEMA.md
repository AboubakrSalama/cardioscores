# CardioScores calculator schema

Calculator modules live in `www/js/calculators/*.js`. Each file is a **classic browser script**
(NO ES modules, NO imports/exports, NO Node APIs) wrapped in an IIFE, registering calculators
via the global `CARDIO.register({...})`. See `af-anticoagulation.js` for the canonical example.

```js
(function () {
  'use strict';
  CARDIO.register({ /* calculator 1 */ });
  CARDIO.register({ /* calculator 2 */ });
})();
```

## Common fields (all kinds)

| field      | required | description |
|------------|----------|-------------|
| `id`       | yes      | unique kebab-case, e.g. `'heart-score'` |
| `name`     | yes      | display name, e.g. `'HEART Score'` |
| `category` | yes      | one of: `prevention, acs, ischemia, hf, af, ep, ecg, pci, surgery, preop, vte, advhf, congenital, imaging, misc` |
| `short`    | yes      | one-line purpose, clinician-facing |
| `keywords` | no       | extra search terms (array of strings) |
| `notes`    | no       | caveats / guideline context (plain text, no HTML) |
| `refs`     | yes      | array of citation strings, primary publication first |
| `kind`     | no       | `'points'` (default), `'custom'`, or `'external'` |

## kind: 'points'  (additive scores — most calculators)

`inputs`: array of:
- Checkbox: `{ id, label, type: 'check', points: <int>, hint?: '<criteria detail>' }`
- Select:   `{ id, label, type: 'select', options: [ { label, points }, ... ] }`
  — the FIRST option must be the default / 0-point choice. Add `hidePoints: true` on the
  input to hide "(+n)" suffixes (for classifications).

`interpret`: ordered array of bands `{ upTo: <max score for band>, text, level }`.
`level` is one of `'low' | 'mod' | 'high' | 'vhigh' | 'info'`.
Engine picks the FIRST band where `score <= upTo`. Include published event rates in `text`
when you are confident of them.

Optional `result: { unit: 'points' }` (unit label shown next to the score).

## kind: 'custom'  (formulas: QTc, logistic models, etc.)

Same `inputs`, plus `type: 'number'` inputs:
`{ id, label, type: 'number', unit?: 'ms', min?, max?, step?, placeholder?, hint? }`

Provide `compute(v)` where `v` maps input id → value:
- check → boolean; select → the option's `value` if defined else its `points`; number → float or `null` if empty.
Return `null` if required numbers are missing, else:
```js
{ value: '432', unit: 'ms', text: 'Normal QTc.', level: 'low', detail: 'optional multi-line breakdown', badge: 'optional badge label' }
```
`value` must be a STRING already rounded for display.

## kind: 'external'  (models too complex/proprietary to reimplement safely)

```js
{ id, name, category, short, kind: 'external',
  external: { url: 'https://...', reason: 'why it must be computed on the official tool' },
  refs: [...] }
```

## Accuracy rules (non-negotiable — this is a medical app)

1. Only implement point values / thresholds / coefficients you are CONFIDENT match the
   primary publication. If unsure of ANY point value, register the score as `kind: 'external'`
   linking to the official calculator instead. An external link is correct; a guessed point value is harmful.
2. Include the derivation cohort's event rates in `interpret[].text` only when confident.
3. Use conventional US units with SI hints where relevant (e.g., creatinine mg/dL).
4. Do NOT use `Date`, `fetch`, `localStorage`, or any DOM APIs in calculator files.
5. Plain ASCII in ids; UTF-8 (₂, ≥, µ) is fine in labels/text.
6. Escape apostrophes in single-quoted strings (`'O\'Brien'`).
