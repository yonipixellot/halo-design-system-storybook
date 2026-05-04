import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming/create';

const haloTheme = create({
  base: 'light',
  brandTitle: 'Halo Design System',
  brandUrl: 'https://yonipixellot.github.io/halo-design-system/',
  colorPrimary: '#06b6d4',
  colorSecondary: '#0ea5e9',
});

addons.setConfig({
  theme: haloTheme,
  sidebar: {
    showRoots: true,
  },
});
