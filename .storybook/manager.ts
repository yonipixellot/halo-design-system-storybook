import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming/create';
import positiveLogo from './halo-logo-positive.svg';
import negativeLogo from './halo-logo-negative.svg';

/* Manager theme — replaces the "Halo Design System" text in the
   top-left of the sidebar with the HALO wordmark SVG. Two variants
   so the logo reads correctly against the manager's light or dark
   chrome. We pick at load based on the user's OS color-scheme
   preference; if they change OS theme mid-session, a reload picks
   up the swap. */

const lightTheme = create({
  base: 'light',
  brandTitle: 'Halo Design System',
  brandImage: positiveLogo,
  brandUrl: 'https://yonipixellot.github.io/halo-design-system-storybook/',
  colorPrimary: '#06b6d4',
  colorSecondary: '#0ea5e9',
});

const darkTheme = create({
  base: 'dark',
  brandTitle: 'Halo Design System',
  brandImage: negativeLogo,
  brandUrl: 'https://yonipixellot.github.io/halo-design-system-storybook/',
  colorPrimary: '#00D6FE',
  colorSecondary: '#06b6d4',
});

const prefersDark =
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-color-scheme: dark)').matches;

addons.setConfig({
  theme: prefersDark ? darkTheme : lightTheme,
  sidebar: {
    showRoots: true,
  },
});
