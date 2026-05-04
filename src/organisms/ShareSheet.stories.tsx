import type { Meta, StoryObj } from '@storybook/react';
import { ShareSheet } from '@/screens/home/ShareSheet';

/* ShareSheet is a bottom-sheet modal that overlays HighlightViewer when
   the share button is tapped. Three variants documented:
     • Athlete share — single moment from a game
     • Event share   — full game recap
     • Plain         — title only (no subtitle / url) */

const meta = {
  title: 'Organisms/ShareSheet',
  component: ShareSheet,
  args: {
    onClose: () => console.log('close'),
    onShare: (id) => console.log('share to', id),
  },
} satisfies Meta<typeof ShareSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

/* Default — athlete share (a moment from a player's drop). */
export const AthleteShare: Story = {
  name: 'Athlete share',
  args: {
    title: '#7 Player Highlight',
    subtitle: 'Varsity vs Northside · Q4 buzzer',
    url: 'halo.app/m/m1',
    thumbnail: '7',
  },
};

/* Event share — full game recap. Larger context, no jersey number. */
export const EventShare: Story = {
  name: 'Event share',
  args: {
    title: 'Varsity vs Northside · Recap',
    subtitle: 'Final · 64–58 · Eastside Gym',
    url: 'halo.app/g/gE',
    thumbnail: 'V',
  },
};

/* Plain — title only, no subtitle or URL. Edge case. */
export const TitleOnly: Story = {
  name: 'Title only',
  args: {
    title: 'Share',
  },
};
