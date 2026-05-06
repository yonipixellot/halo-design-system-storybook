# Halo Responsive Plan — Phone / Tablet / Desktop

**Author:** Yoni · **Date:** 2026-05-06
**Status:** plan, not yet executed
**Goal:** ship Halo as a real responsive product. Phone-first stays the canon, tablet is a wider phone, desktop becomes an app shell with side nav and content grid.

---

## 1. Constraints picked

| Decision | Choice | Implication |
|---|---|---|
| Desktop layout | App shell + side nav | Persistent rail (start edge), main content reflows in a grid, optional right rail. Linear/Slack feel. |
| Breakpoints | Tailwind default | `sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536` |
| Tablet | "Phone-wider" | Single column, max-width content, bottom dock stays. No side nav until `lg`. |
| Bottom dock | → side nav at `lg` | Same destinations, repositioned. RTL-flips via `inline-start`. |
| Goal | Real product | Native responsive, not a demo veneer. Components must reflow, not just scale. |
| Viewer (drop) | Theatre mode on desktop | Black canvas, vertical 9:16 player centered, info pane on trailing edge. |
| Storybook | Viewport addon + explicit stories | Every hero screen exposes Phone / Tablet / Desktop story variants. |

---

## 2. Breakpoint contract

```
phone     <  640   (sm)   single column · bottom dock · phone frame in storybook
sm-md   640 – 1023        single column wider · bottom dock · phone-wider frame
lg     1024 – 1279        app shell · side nav · main column ≤ 720px · optional right rail
xl     1280 – 1535        app shell · side nav 280 · main 720 · right rail 320 (when used)
2xl    ≥ 1536             same as xl, content max-width 1440 centered
```

**One source of truth.** A new file `src/lib/responsive.ts` exports:
- `BREAKPOINTS` token map (numbers)
- `useBreakpoint()` hook returning `'phone' | 'tablet' | 'desktop' | 'desktop-xl'`
- `useIsDesktop()` shorthand for `lg+`

Components that need behavioural divergence (not just CSS) consume the hook. Pure layout uses Tailwind classes.

---

## 3. App shell architecture (new primitives)

A single `AppShell` layout wraps every **post-login** page on `lg+`. On `<lg` it's a passthrough. **Pre-login flows (Auth, both Onboarding orchestrators) do not use AppShell at all** — they have their own desktop-native layouts (split-screen / multi-column hero) that fill the canvas without any phone frame.

```
src/layouts/
  AppShell.tsx          — SideNav + AppHeader + Main + (RightRail) on lg+; passthrough on <lg
  SideNav.tsx           — extracted from current bottom-dock destinations
  AppHeader.tsx         — searchbar, user menu, notifications (lg+ only; phone uses page-local headers)
  RightRail.tsx         — slot component; pages opt-in
  SplitHero.tsx         — pre-login template: brand panel + content panel (auth + onboarding share this)
```

**No PhoneFrame primitive.** Desktop is desktop. Pre-login screens use `SplitHero` (or a multi-column variant), post-login screens use `AppShell`. Nothing renders a 393-wide column floating on a wider canvas.

### SideNav contents (lg+)
1. Home
2. Drops
3. Following
4. (Coach only) Roster · Review queue
5. Notifications
6. User chip → opens user menu (replaces current SideMenu sheet)

Width: 240 at `lg`, 280 at `xl`. Always at `inline-start`. RTL-safe.

### Main column widths
| Page family | Phone | Tablet (`md`) | Desktop (`lg+`) |
|---|---|---|---|
| Feed (Home) | full | max 640 | max 720 + right rail (in AppShell) |
| Auth | full | max 480 centered | full-canvas SplitHero — brand panel + form panel |
| Onboarding (player + parent/fan) | full | max 560 centered | full-canvas SplitHero or 2-col grid; CTA bar inline |
| Viewer (theatre) | full bleed | full bleed | black canvas, player 480 wide centered, info pane 360 at end edge |
| Settings / list pages | full | max 720 | max 720 (in AppShell) |

---

## 4. Per-screen treatment

### Home
- **Phone:** unchanged.
- **Tablet:** content max-w-[640px] mx-auto, more vertical breathing room (`py-` increased). Bottom dock stays.
- **Desktop:** AppShell with SideNav. Main = feed (max 720). Right rail shows: Next game card, Team status, Daily insight stack — pulled from existing widgets. Header with search + notifications.

### PlayerOnboarding (coach-invite flow)
- **Phone:** unchanged.
- **Tablet:** existing screens centered as a 560-wide card. OnboardDock CTA stays at the bottom of the card (not pinned to viewport).
- **Desktop:** native desktop layouts using `SplitHero` — no phone frame. Per step:
  - **PlayerInviteEntry** → SplitHero. Brand panel (start edge): coach initials disc large, atmosphere bg, "Welcome to Halo" hero copy. Content panel (end edge): "FROM YOUR COACH" caption, headline, team chip, Sign up / Sign in CTAs.
  - **TeamsStepLocked** → 2-column inside `SplitHero`. Sticky left: locked-team hero card + step explainer + Continue CTA. Right: scrollable LeagueAccordion of additional teams.
  - **ClaimAndFollow** → 2-column. Sticky left: step explainer ("Find yourself on the roster"), claimed-self card once picked, Continue CTA. Right: roster as a 2-column **grid of player cards** (more horizontal real estate → grid beats list). Toggle to "Compact list" available.
  - **NotifUpsell** → centered hero. Bell at hero size (160×160), perks rendered as a 3-column grid below the headline. CTAs full-width inside a max-w-[480px] container.

### Onboarding (parent / fan persona picker)
- **Phone:** unchanged.
- **Tablet:** centered card max-w-[560px].
- **Desktop:** native layouts. Persona picker = 4-card row instead of 2×2 grid. Team / player selection screens = 2-column with explainer + Continue CTA on the start edge, league accordion or roster grid on the end edge. Same `SplitHero` template.

### Auth (SignIn / SignUp / Forgot / Reset)
- **Phone:** unchanged.
- **Tablet:** centered card max-w-[480px].
- **Desktop:** `SplitHero`. Brand panel (start edge, ~55% width): atmosphere bg + cyan halo wordmark + a single rotating hero line. Form panel (end edge, ~45%): centered, max-w-[420px], stacked auth fields + SSO buttons + footer link. RTL mirrors via `inline-start` / `inline-end`.

### Viewer (HighlightViewer + StorytellingDropViewer) — Theatre mode
- **Phone:** unchanged full-bleed vertical player.
- **Tablet:** centered, max-h-[100vh], max-w-[480px].
- **Desktop:** black canvas, vertical 9:16 player ~480px wide centered, **info pane** on the trailing edge (360px) showing: title, attribution, score chip, moment count, "Up next" rail. Close button at start-edge top. Keyboard shortcuts (←/→ to navigate moments, esc to close).

### SideMenu
- **Phone:** stays as the current end-edge slide-out sheet (unchanged).
- **Desktop:** repurposed as the AppHeader user menu dropdown. The contents (language, notifications, privacy, help, sign-out) become a popover; LanguagePage stays a sub-route.

---

## 5. Storybook integration

### Viewport addon
- Install/configure `@storybook/addon-viewport` (v8.4 ships it under essentials; just configure custom devices).
- Custom viewports: `Phone` (393×852), `Tablet` (834×1112), `Desktop` (1280×800), `Desktop XL` (1920×1080).
- Default: `Phone`.

### Decorator changes (`.storybook/preview.tsx`)
Today the decorator wraps every story in a 393px-wide phone column. New behaviour:
- Read viewport from Storybook context.
- `Phone` → wrap in the existing 393×852 phone shell (Storybook visual aid only — the rendered component itself is full-width inside).
- `Tablet` → wrap in a tablet shell (834×1112) for review comfort. Component still uses its own responsive classes.
- `Desktop / Desktop XL` → no shell at all. Story renders edge-to-edge so the AppShell / SplitHero layout fills the canvas as it would in production.
- Atom and molecule stories that aren't full pages (e.g. `Button`, `JerseyBadge`, `IdentityCircle`) opt out of the shell entirely via `parameters.layout = 'centered'`.

### Explicit story variants for hero screens
Per the picked option, hero pages (Home, PlayerOnboarding, Onboarding, Auth, Viewer) ship explicit stories per viewport so reviewers can see all three side-by-side without flipping the toolbar:
- `Home / Phone`
- `Home / Tablet`
- `Home / Desktop`
- `Home / Desktop XL`

Implemented via a `viewportVariants(meta, render)` helper to avoid copy-paste.

### Theme persistence
Already shipped — light/dark choice persists via `localStorage`. No change needed.

---

## 6. Tokens & CSS additions

Add to `src/index.css`:

```css
/* Responsive container widths */
--shell-side-nav: 240px;
--shell-side-nav-xl: 280px;
--shell-right-rail: 320px;
--shell-content-max: 720px;
--shell-form-max: 480px;
--viewer-player-max: 480px;
--viewer-info-pane: 360px;

/* Desktop typography lift (subtle, not aggressive) */
@media (min-width: 1024px) {
  html { font-size: 16.5px; }   /* base bumps slightly */
}
```

No change to colors, glass classes, or spacing scale — those already work at any size.

---

## 7. Component audit (work the build needs)

### Components hardcoded to phone width (must fix)
- Anything with literal `w-[393px]` or fixed pixel widths inside content body.
- `lg-atmosphere` background tuned to phone aspect ratio — needs a desktop variant or made aspect-aware.
- `BottomDock` — currently `position: fixed`, must be parent-controlled on desktop (rendered inside SideNav, not viewport).
- Hero glass cards in onboarding screens — fixed paddings assume phone width; switch to fluid `clamp()` paddings.

### Components that need a desktop variant
- `OnboardDock` (CTA bar)
- `BottomDock` → becomes `SideNavRail`
- `HighlightViewer` / `StorytellingDropViewer` (theatre mode)
- `IdentityCircle` (sizes up on desktop hero)
- `GameCard` (gets richer hover on desktop)

### Components that just work
- All form inputs, pills, buttons, badges, jersey badges
- League/team accordions
- Persona cards
- Auth forms (just need split-screen wrapper)

---

## 8. Phasing

Each phase is a session-sized chunk.

### Phase 1 — Foundation
- Install + configure viewport addon
- `BREAKPOINTS` + `useBreakpoint()` in `src/lib/responsive.ts`
- Build `AppShell`, `SideNav`, `AppHeader`, `RightRail`, `SplitHero` primitives (basic, no polish)
- Update `.storybook/preview.tsx` decorator: viewport-aware
- New Storybook docs page: "Layouts & Breakpoints" (with token docs + visual diagram)

### Phase 2 — Home + Auth
- Home responsive (single column → grid + side nav + right rail)
- Auth split-screen (SignIn, SignUp, Forgot, Reset)
- Explicit Phone/Tablet/Desktop stories for both

### Phase 3 — Viewer theatre mode
- HighlightViewer + StorytellingDropViewer desktop layout
- Info pane component
- Keyboard navigation
- Explicit Phone/Tablet/Desktop stories

### Phase 4 — Onboarding (both flows)
- PlayerOnboarding desktop layouts (SplitHero per step, 2-column grids for roster/leagues)
- Onboarding desktop layouts (persona picker as 4-row, team/player selection 2-column)
- Visual QA each step at each breakpoint

### Phase 5 — Long-tail audit + a11y
- Sweep remaining stories at desktop sizes
- Run a11y addon at each viewport
- RTL spot-check at desktop
- Storybook README updated

---

## 9. RTL impact

- SideNav lives at `inline-start` (auto-flips in RTL).
- AppHeader user menu opens at `inline-end` (auto-flips).
- Auth split-screen: brand panel at `inline-start`, form at `inline-end` — flips correctly in RTL.
- Viewer theatre: info pane at `inline-end` — flips.

All new code uses logical properties per existing convention.

---

## 10. Open items / things to revisit

- **Touch on desktop.** Halo on a touchscreen Windows laptop or iPad-with-keyboard? Hover states should not be the only affordance. Plan: every hover treatment must have a focus equivalent. Defer real testing to Phase 5.
- **Coach-only chrome.** When the coach side ships (deferred), the SideNav gets coach-specific destinations. Build SideNav data-driven by persona from day 1.
- **Density.** Linear-style dense vs. Apple-style spacious — currently leaning Apple-style. Revisit at end of Phase 2 with the actual screens to decide.
- **Right rail content.** The widgets exist but were designed phone-vertical. May need reflow into rail-friendly variants (less hero, more compact).
- **Atmosphere bg on wide canvases.** `lg-atmosphere` was tuned to phone aspect ratio. On desktop split-screens it lives in the brand panel (~700px wide), where it'll need re-tuned blob positions. Audit during Phase 2.

---

## 11. Acceptance criteria (per phase)

A phase is "done" when:
1. All target stories render correctly at Phone, Tablet, Desktop, Desktop XL viewports.
2. No console warnings or layout overflow at any breakpoint.
3. Light + dark + LTR + RTL spot-check passes.
4. Type-check (`tsc -p .`) passes.
5. Storybook builds (`npm run build-storybook`) without warnings.
