# Deploy

Streamlined recipe to get Halo Design System live at https://yonipixellot.github.io/halo-design-system/.

## First-time deploy (≈5 min)

### 1. Create the empty repo on GitHub

Go to https://github.com/new

- Owner: `yonipixellot`
- Name: `halo-design-system`
- Visibility: Public (Pages is free for public repos)
- **Leave the "Initialize this repository" checkboxes unchecked** — no README, no .gitignore, no license. We bring our own.

Click **Create repository**. Don't copy any of the suggested commands — we have our own below.

### 2. Push from your Mac

Open Terminal:

```bash
cd /path/to/Halo/halo-design-system
./deploy.sh "scaffold halo-design-system"
```

The script handles `git init`, remote setup (SSH by default — edit `deploy.sh` if you use HTTPS), staging, committing, and pushing.

### 3. Enable GitHub Pages

On the repo on GitHub:

- **Settings → Pages**
- **Source:** GitHub Actions
- Save

The deploy workflow at `.github/workflows/deploy.yml` runs automatically on every push to `main`.

### 4. Watch the build

- Actions: https://github.com/yonipixellot/halo-design-system/actions
- First build takes ~3 minutes (npm install + storybook build).
- Once green, the live URL will serve the Storybook.

Live URL: **https://yonipixellot.github.io/halo-design-system/**

## Subsequent deploys

After the first push, every change is just:

```bash
./deploy.sh "what changed"
```

GitHub Actions rebuilds and redeploys automatically.

## Local sanity check before pushing

```bash
npm install
npm run storybook       # → http://localhost:6007
npm run build-storybook # produces ./storybook-static — same artifact GH Pages serves
```

If `build-storybook` succeeds locally, GH Actions will succeed too.

## If something breaks

**`npm install` fails on Tailwind v4**
Tailwind v4 needs Node 20+. Confirm with `node -v`. If you're on Node 18, upgrade or use `nvm use 20`.

**Storybook builds but pages render blank on GH Pages**
Check that `vite.base` is set to `/halo-design-system/` in production builds — already wired in `.storybook/main.ts`'s `viteFinal`. If you renamed the repo, set `STORYBOOK_BASE_PATH=/your-new-name/` in the Actions workflow.

**`./deploy.sh: Permission denied`**
`chmod +x deploy.sh` once.

**Git push fails with "Repository not found"**
Either the repo wasn't created on GitHub yet (step 1), or the script's SSH URL doesn't match your auth method. Edit `deploy.sh` and switch `git remote add origin "$REPO_URL_SSH"` to `"$REPO_URL_HTTPS"` if you authenticate with HTTPS + PAT.

**GH Pages still shows 404 after green build**
First build takes 3-5 min for Pages to provision the URL even after the workflow finishes. Check Settings → Pages — it should show "Your site is live at..." once ready.

**Theme switch doesn't work in production but works in dev**
Verify `@theme inline` (not bare `@theme`) in `src/index.css`. The `inline` keyword keeps `var(...)` references intact in built CSS so runtime theme overrides via `[data-theme]` resolve correctly.
