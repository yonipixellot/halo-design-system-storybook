# Halo Design System

Multi-tenant Storybook for the Halo product. Atomic Design + shadcn-style copy-paste recipes.

**Live:** https://yonipixellot.github.io/halo-design-system/ *(after first deploy)*

## What this is

The canonical reference for the Halo UI — extracted from the v3.2 glass prototype, organised by Atomic Design (Tokens → Atoms → Molecules → Organisms → Templates → Pages).

This is **not** an npm package. Each component's MDX page has a copy-paste code block — bring the source into your own codebase, like shadcn/ui. Tokens are different: copy `src/tokens/` once and import it from your app's CSS root.

## Stack

- Vite + React 18 + TypeScript
- Tailwind CSS v4 (CSS-first `@theme` config)
- Storybook 8 (Vite builder, CSF3 stories, MDX docs)
- Multi-theme via `@storybook/addon-themes`

## Local dev

```bash
npm install
npm run storybook    # -> http://localhost:6007
npm run dev          # -> Vite dev surface (sanity check)
```

## Theming

Brand color is per-tenant. Every brand-tinted style flows through `--color-brand-50…900` CSS variables. Switch themes:

- in Storybook: toolbar at the top
- in your app: `<html data-theme="halo">` or `<html data-theme="acme">`

Adding a new client = one new CSS file at `src/tokens/themes/{client}.css` overriding `--color-brand-*` and `--tenant-*`.

## Folder layout

```
src/
  tokens/          base + glass + per-theme CSS
  atoms/           Button, Input, Avatar, Icon, GlassSurface, …
  molecules/       FormField, GlassField, BackBar, Toast, Rail, VThumb, …
  organisms/       SignInForm, PersonaStep, FollowingStrip, BottomNav, …
  templates/       AuthShell, OnboardingShell, AppShell
  pages/           SignIn, SignUp, Onboarding, Home
  lib/             cn(), helpers
```

Every component lives in `src/{layer}/{Component}/` with three files:
- `Component.tsx` — the implementation
- `Component.stories.tsx` — CSF3 stories
- `Component.mdx` — copy-paste docs page for the frontend team

## Contributing

See [SETUP.md](./SETUP.md) for first-time push instructions.

When adding a component, follow the existing atom pattern (see `src/atoms/Button`).

## License

Internal — Pixellot / Halo.
