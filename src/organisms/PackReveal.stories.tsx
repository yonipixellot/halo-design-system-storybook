import type { Meta, StoryObj } from '@storybook/react';
import { PackReveal } from '@/screens/home/PackReveal';

/* Drop reveal ceremony — full-screen unwrap animation that plays once
   when the user opens an unrevealed drop. Three stages, each ~600ms:
   locked → revealing → reveal. Reload the story to replay the animation. */

const meta = {
  title: 'Organisms/PackReveal',
  component: PackReveal,
  args: {
    gameId: 'gE',
    onDismiss: () => console.log('dismiss'),
    onOpenMoment: (ids, index) => console.log('open moment', { ids, index }),
  },
} satisfies Meta<typeof PackReveal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
