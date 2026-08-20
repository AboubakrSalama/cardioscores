# Launching CardioScores online

The web app is a **static site** in `www/` (no build step, no backend). It uses hash-based routing, so it works on any static host with **no redirect/rewrite rules**. It's also an installable, offline-capable PWA (service worker in `www/sw.js`).

Pick one of the paths below.

## Option A — GitHub Pages (free)
The repo already exists (private) at **github.com/AboubakrSalama/cardioscores**.
A ready-to-use Pages workflow is saved at `deploy/github-pages-workflow.yml`. To enable Pages:
1. In GitHub: **Add file → Create new file**, name it `.github/workflows/deploy-pages.yml`, and paste the contents of `deploy/github-pages-workflow.yml`. (Adding it via the web UI avoids the CLI `workflow`-scope restriction.)
2. **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Make the repo public (Settings → General → Danger Zone) when you're ready.

The site goes live at `https://aboubakrsalama.github.io/cardioscores/`. (All asset links are relative, so the `/cardioscores/` subpath works without changes.)

> Because the site is served from a `/cardioscores/` subpath on Pages, all asset links in the app are already relative (`./…`), so it works without changes.

## Option B — Netlify Drop (no CLI, no repo)
1. Go to https://app.netlify.com/drop
2. Drag the **`www`** folder onto the page.
3. You get a live `https://<name>.netlify.app` URL instantly. `netlify.toml` is already configured if you connect the repo later.

## Option C — Vercel
Import the repo at https://vercel.com/new and it will use `vercel.json` (output directory `www`). Or:
```bash
npx vercel --prod
```

## Custom domain
All three hosts let you attach a custom domain for free once the site is live.

### Custom domain: cardiacrisk.info (chosen)
The site is live on GitHub Pages, so wiring `cardiacrisk.info` takes three steps. **Do them in this order to avoid downtime** (adding the CNAME before DNS resolves would break the live `github.io` URL).

1. **Register** `cardiacrisk.info` at a registrar (Namecheap, Porkbun, or Cloudflare). Unlike `.app`, `.info` does not force HTTPS — but GitHub Pages still issues a free certificate, so enable "Enforce HTTPS" anyway.
2. **Add DNS records** at the registrar for the apex domain:

   | Type | Host/Name | Value |
   |------|-----------|-------|
   | A | `@` | `185.199.108.153` |
   | A | `@` | `185.199.109.153` |
   | A | `@` | `185.199.110.153` |
   | A | `@` | `185.199.111.153` |
   | AAAA | `@` | `2606:50c0:8000::153` |
   | AAAA | `@` | `2606:50c0:8001::153` |
   | AAAA | `@` | `2606:50c0:8002::153` |
   | AAAA | `@` | `2606:50c0:8003::153` |
   | CNAME | `www` | `aboubakrsalama.github.io.` |

3. **Activate on GitHub** (once DNS above is saved): copy `deploy/CNAME` into the site root — i.e., set the Pages custom domain to `cardiacrisk.info` (Settings → Pages → Custom domain), or push a `CNAME` file containing `cardiacrisk.info` to the `gh-pages` branch. Then tick **Enforce HTTPS** after the certificate is issued (can take up to an hour).

After that, `https://cardiacrisk.info` serves the app. (I can do step 3 for you the moment steps 1–2 are done.)

## Before going public (medical software)
- Have a cardiologist verify the calculators against primary sources — especially the regression models and the 7 flagged approximations (see the in-app disclaimer).
- Confirm the footer disclaimer and `privacy.html` reflect your intended terms.
- Consider gating clinical use behind the "healthcare professional" acknowledgment (already present on first load).

## Mobile apps (stores)
The same `www/` is wrapped with Capacitor:
- Android: `npx cap open android` → build a signed AAB → Google Play Console.
- iOS: on a Mac, `npx cap add ios` → `npx cap open ios` → Xcode → App Store Connect.
