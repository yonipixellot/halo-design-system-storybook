# First-time setup

This scaffold lives in your `Halo/halo-design-system/` folder. To get it onto GitHub and live on Pages, run these steps from your Mac terminal.

## 1. Create the empty repo on GitHub

Go to https://github.com/new and create:

- Owner: `yonipixellot`
- Name: `halo-design-system`
- Visibility: your call (Public if you want a free public Pages URL)
- **Do NOT** add a README, .gitignore, or license (we already have them)

Click **Create repository**. Do not copy any of the suggested commands — we have our own below.

## 2. Initialize git locally and push

From your Mac terminal:

```bash
cd /path/to/Halo/halo-design-system

git init
git add .
git commit -m "scaffold halo-design-system"
git branch -M main
git remote add origin git@github.com:yonipixellot/halo-design-system.git
git push -u origin main
```

If you use HTTPS instead of SSH: `git remote add origin https://github.com/yonipixellot/halo-design-system.git`.

## 3. Install and verify locally

```bash
npm install
npm run storybook
```

Storybook should boot at http://localhost:6007 with the Welcome page, plus Atoms/Button and Atoms/GlassSurface visible. Use the Themes toolbar (paint-brush icon, top of preview) to flip between **Halo** (cyan) and **Acme** (orange) — brand color should change live across both stories. That's the multi-tenant promise working.

## 4. Enable GitHub Pages

On the GitHub repo:

- Settings → Pages
- **Source:** GitHub Actions
- Save

The deploy workflow (`.github/workflows/deploy.yml`) is already in the scaffold. It runs on every push to `main`. After a couple of minutes the live URL will be:

`https://yonipixellot.github.io/halo-design-system/`

## 5. Verify the live deploy

Push any small change (e.g. edit `README.md`) to trigger the workflow. Watch the run under the **Actions** tab. Once green, the URL above should serve your Storybook.

Done. From here on, every push to `main` re-deploys.

## Common snags

- **`npm install` fails on Tailwind v4** — v4 is in beta. If you hit version drift, `npm cache clean --force && rm -rf node_modules package-lock.json && npm install`.
- **Storybook errors about Tailwind** — confirm `postcss.config.js` is at the repo root (not under `.storybook/`) and `src/index.css` is imported from `.storybook/preview.tsx`.
- **GH Pages 404** — make sure Settings → Pages → Source is set to **GitHub Actions**, not Branch. The first deploy can take 3-5 minutes.
- **Multi-theme not working in toolbar** — confirm `@storybook/addon-themes` is in `.storybook/main.ts` addons array.
