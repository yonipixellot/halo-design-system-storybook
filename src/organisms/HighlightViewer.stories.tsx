import type { Meta, StoryObj } from '@storybook/react';
import { HighlightViewer } from '@/screens/home/HighlightViewer';
import { SEED_MOMENTS } from '@/screens/home/_data';

const allIds = SEED_MOMENTS.filter((m) => m.personId === 'self').slice(0, 6).map((m) => m.id);

const meta = {
  title: 'Organisms/HighlightViewer',
  component: HighlightViewer,
  args: {
    ids: allIds,
    index: 0,
    onClose: () => console.log('close'),
    onWatchFullGame: (gameId, momentId) => console.log('watch full game', { gameId, momentId }),
    onShare: () => console.log('share'),
  },
} satisfies Meta<typeof HighlightViewer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FirstMoment: Story = { args: { index: 0 } };
export const MiddleMoment: Story = { args: { index: 2 } };
export const LastMoment: Story = { args: { index: 5 } };
