import type { Meta, StoryObj } from '@storybook/react';
import { ClientLogoMark } from '@/screens/auth/_shared';

/* The Pixellot/Halo brand mark — 220×151 cyan SVG with drop shadow.
   Renders correctly only on a dark backdrop (`data-theme="dark"`). */
const meta = {
  title: 'Atoms/ClientLogoMark',
  component: ClientLogoMark,
} satisfies Meta<typeof ClientLogoMark>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OnNavy: Story = {
  render: () => (
    <div
      className="flex items-center justify-center"
      style={{ background: '#0a1f3d', height: 320, padding: 24 }}
    >
      <ClientLogoMark />
    </div>
  ),
};
