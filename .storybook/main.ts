import type { StorybookConfig } from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  typescript: {
    check: false,
  },
  // Explicitly add the Tailwind v4 Vite plugin in Storybook's own vite config —
  // Storybook 10 doesn't reliably inherit plugins from the project's vite.config.ts,
  // which is why utility classes like `flex`, `px-6`, `gap-3` weren't generating CSS.
  async viteFinal(viteConfig, { configType }) {
    viteConfig.plugins = [...(viteConfig.plugins ?? []), tailwindcss()];
    if (configType === 'PRODUCTION') {
      viteConfig.base = process.env.STORYBOOK_BASE_PATH ?? '/halo-design-system-storybook/';
    }
    return viteConfig;
  },
};

export default config;
