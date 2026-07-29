# Publishing CardioScores to Google Play & Apple App Store

The app is a Capacitor wrapper around `www/`. Publishing is a one-time setup per store,
then `npx cap sync` + rebuild for each update.

## 0. One-time prerequisites

| | Google Play | Apple App Store |
|---|---|---|
| Developer account | Play Console — $25 once (play.google.com/console) | Apple Developer Program — $99/year (developer.apple.com) |
| Build machine | Any OS + Android Studio | **macOS + Xcode required** |
| App ID | `com.cardioscores.app` (change in `capacitor.config.json` to a domain you own, e.g. `edu.aucegypt.cardioscores`) | same |

Change the `appId` BEFORE the first build — it is permanent once published.

## 1. Generate the native projects

```
npm install
npx cap add android
npx cap add ios          # run on a Mac
npx cap sync
```

## 2. Icons & splash screens

Put a 1024×1024 `icon.png` (and optional `splash.png` 2732×2732) in `assets/`, then:

```
npm install -D @capacitor/assets
npx capacitor-assets generate
```

This fills in all Android mipmap and iOS asset-catalog sizes automatically.

## 3. Android → Google Play

1. Open the project: `npx cap open android`
2. In Android Studio: **Build → Generate Signed App Bundle** (create an upload keystore;
   BACK IT UP — losing it means losing the ability to update the app).
3. In Play Console: create the app → upload the `.aab` to an internal-testing track first.
4. Complete: store listing, content rating questionnaire, data-safety form
   (declare: no data collected — everything runs on-device), privacy-policy URL (required
   even if you collect nothing — host a one-page policy on your website).
5. **Medical-app compliance:** in the listing, state clearly it is a reference/decision-support
   tool for healthcare professionals, not a diagnostic device. Keep the in-app disclaimer.
6. Promote internal testing → production once reviewed.

## 4. iOS → Apple App Store

1. On a Mac: `npx cap open ios`, set your Team + bundle ID in Xcode signing settings.
2. Product → Archive → Distribute to App Store Connect.
3. In App Store Connect: create the app, fill listing, screenshots (6.7" and 5.5" iPhone
   at minimum), privacy "nutrition label" (no data collected), privacy-policy URL.
4. **Apple guideline 5.1.1 / medical apps (2.5.13, 1.4.1):** Apple scrutinizes medical
   calculators. To pass review smoothly:
   - Keep the professional-use disclaimer on first launch (already implemented).
   - Cite primary references for every score (already implemented).
   - Describe the app as "reference for healthcare professionals"; do not claim diagnosis
     or treatment.
5. Submit for review.

## 5. Updating the app

Any change to `www/` is picked up by both platforms:

```
npx cap sync
```

then rebuild/re-archive and upload a new version (bump `versionCode`/`versionName` on
Android, build number on iOS).

## 6. Website deployment

`www/` is fully static. Fastest options:
- **Netlify / Vercel / Cloudflare Pages:** drag-and-drop the `www` folder or point at the repo with publish dir `www`.
- **GitHub Pages:** push the repo, enable Pages on the `www` folder (or copy `www/*` to a `gh-pages` branch).

Because there is no backend and no patient data ever leaves the device, HIPAA/GDPR exposure
is minimal — but keep the privacy policy page accurate about this.
