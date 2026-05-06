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

Five named layout patterns, one per screen family. All ship at `lg+` and degrade to passthrough on `<lg` (phone screens unchanged).

```
src/layouts/
  HomeShell.tsx         — post-login: SideNav + Main feed (max 720). NO right rail.
  AuthCanvas.tsx        — auth screens: full-canvas atmosphere + centered glass form card (max 440)
  MomentCanvas.tsx      — intimate "moment" screens (PlayerInviteEntry, NotifUpsell): atmosphere fills, glass card holds the moment (max 560)
  WizardRail.tsx        — multi-step onboarding (TeamsStepLocked, ClaimAndFollow): step nav rail at start edge, content at end
  SideNav.tsx           — vertical primary-nav rail (240/280, inline-start, RTL-safe)
  AppHeader.tsx         — top bar slot (lg+; phone uses page-local headers)
```

**Key shape decisions (from May 2026 layout review):**
- Auth and moment screens get *cinematic* treatment — atmosphere blobs fill the canvas, the form/content lives inside a glass card centered on top.
- Multi-step onboarding gets a *wizard rail* — the user always sees where they are in the flow, the rail shows all steps with the current one highlighted, content fills the rest.
- Home is intentionally *quieter* — SideNav + feed only. No right rail. The feed is the product; widgets would compete with it.
- No `SplitHero`, no `RightRail`, no `PhoneFrame`. The plan in section 4 below replaces them.

**Hard CTA rule.** Primary buttons must NEVER stretch full-width on desktop. Cap at `max-w-[360px]` (or `[400px]` for forms with longer labels). Apply via `.cta-constrained` utility. Phone keeps full-width buttons — only the desktop layouts constrain.

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
| Feed (Home) | full | max 640 | HomeShell — SideNav + feed (max 720). No right rail. |
| Auth | full | max 480 centered | AuthCanvas — atmosphere full canvas, glass form card max 440 centered |
| Moment (PlayerInviteEntry, NotifUpsell) | full | max 560 centered | MomentCanvas — atmosphere full canvas, glass card max 560 centered |
| Multi-step onboarding (TeamsStepLocked, ClaimAndFollow) | full | max 640 centered | WizardRail — step nav (~280) on start, content (max 720) on end |
| Viewer (theatre) | full bleed | full bleed | black canvas, player 480 wide centered, info pane 360 at end edge |
| Settings / list pages | full | max 720 | max 720 (in HomeShell) |

**CTA widths inside these layouts:**
- Phone: full-width primary buttons (unchanged)
- Tablet: full-width inside the centered card
- Desktop: capped at `max-w-[360px]` (CTAs) or `max-w-[400px]` (form submit). Centered or aligned to the form's start edge as appropriate.

---

## 4. Per-screen treatment

### Home (post-login)
- **Phone:** unchanged.
- **Tablet:** content max-w-[640px] mx-auto, more vertical breathing room. Bottom dock stays.
- **Desktop (HomeShell):** SideNav (240/280) + Main feed (max 720). NO right rail. The feed is the hero; widgets would compete with it. AppHeader with search + user avatar pinned at top of main column.

### Auth (SignIn / SignUp / Forgot / Reset)
- **Phone:** unchanged.
- **Tablet:** centered card max-w-[480px].
- **Desktop (AuthCanvas):** atmosphere fills the full canvas (re-tuned blobs for 1280+ widths so they don't cluster at the start edge). Glass form card centered, `lg-glass-card` treatment, `max-w-[440px]`, padding-block 40, padding-inline 36. Inside the card: HALO wordmark + tagline at top → SSO buttons → "or" divider → email + password (or single email for Forgot) → primary CTA → footer link. **CTA capped at max-w-[400px]** so it doesn't stretch the full card width.

### PlayerOnboarding (coach-invite flow)
- **Phone:** unchanged.
- **Tablet:** existing screens centered as a 560-wide card.
- **Desktop:** per step, by pattern:
  - **PlayerInviteEntry → MomentCanvas.** Atmosphere fills canvas. Centered glass card max-w-[560px], padding-block 48, padding-inline 40. Inside: HALO + "From Your Coach" eyebrow → coach initials disc (120×120, cyan halo + whistle chip) → "Added by Coach Sarah" caption → "You're in." headline → team chip → body copy → Create my account CTA (max-w-[360px]) → "Already on Halo? Sign in" footer.
  - **TeamsStepLocked → WizardRail.** Rail (start edge, 280 wide): "Step 1 of 2" eyebrow, all-steps list with current highlighted, step explainer paragraph, Continue CTA pinned at bottom of the rail (capped at 240 inside the rail). Content (end edge, max 720): locked-team hero card pinned at top → LeagueAccordion of additional teams scrolls below.
  - **ClaimAndFollow → WizardRail.** Rail content same shape. Content: roster as a **2-column grid of player cards** at lg, **3-column** at xl (grid beats list at desktop widths).
  - **NotifUpsell → MomentCanvas.** Atmosphere fills canvas. Glass card max-w-[560px]. Inside: bell hero (140×140, cyan halo + pulse dot) → "Stay in the moment" headline → body copy → 3-perk grid (3-column at lg+) → "Turn on notifications" CTA (max-w-[360px]) → "Maybe later" footer.

### Onboarding (parent / fan persona picker)
- **Phone:** unchanged.
- **Tablet:** centered card max-w-[560px].
- **Desktop:** persona picker → MomentCanvas with persona cards as a **4-card row** below the headline. Team / player selection screens → WizardRail with the same rail+content split as PlayerOnboarding.

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
