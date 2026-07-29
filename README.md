# CardioScores — Cardiology Risk Calculators

A fast, offline-capable collection of cardiology risk scores and clinical calculators for
healthcare professionals. One codebase ships three ways:

- **Website** — static files in `www/` (host anywhere: Netlify, GitHub Pages, any web server)
- **Android app** — via Capacitor (`android/` project → Google Play)
- **iOS app** — via Capacitor (`ios/` project → Apple App Store; requires a Mac to build)

> **Disclaimer:** clinical decision-support aid for healthcare professionals. Verify every
> score against its primary reference before clinical use. No warranty of accuracy.

## Project layout

```
www/                  the entire app (plain HTML/CSS/JS — no build step)
  index.html
  css/styles.css
  js/registry.js      categories + CARDIO.register()
  js/app.js           rendering engine (routing, forms, scoring)
  js/calculators/     one file per category; each score is a data object
SCHEMA.md             how to add a calculator
docs/SCORES_CATALOG.md  full taxonomy of cardiology scores
docs/STORE_PUBLISHING.md how to ship to Google Play & App Store
test/smoke.js         schema + execution tests (node test/smoke.js)
```

## Run the website locally

No build step. Either open `www/index.html` directly in a browser, or serve it:

```
npm run serve        # http://localhost:3000
```

## Run tests

```
node test/smoke.js
```

Validates every calculator's schema, interpretation bands, and exercises every `compute()`.

## Add a calculator

Read `SCHEMA.md`, then add a `CARDIO.register({...})` block to the right file in
`www/js/calculators/`. Scores whose models are too complex or proprietary to reimplement
safely are registered as `kind: 'external'` links to the official calculator — never guess
point values.

## Build the mobile apps

```
npm install
npx cap add android    # creates android/ (open in Android Studio)
npx cap add ios        # creates ios/ (macOS + Xcode only)
npx cap sync           # re-copy www/ into both after any change
```

See `docs/STORE_PUBLISHING.md` for signing, store listings, and review-compliance notes
(medical-app policies apply on both stores).
