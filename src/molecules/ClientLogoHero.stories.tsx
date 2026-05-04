import type { Meta, StoryObj } from '@storybook/react';
import { ClientLogoHero } from '@/screens/auth/_shared';

const meta = {
  title: 'Molecules/ClientLogoHero',
  component: ClientLogoHero,
} satisfies Meta<typeof ClientLogoHero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
