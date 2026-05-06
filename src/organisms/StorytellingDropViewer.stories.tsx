import type { Meta, StoryObj } from '@storybook/react';
import { StorytellingDropViewer } from '@/screens/home/StorytellingDropViewer';

/* The full-screen 60-40 viewer that opens when a Storytelling card is
   tapped on Home. Top half = horizontal-snap moment carousel; bottom
   half = "HALO Insight" narrative tied to the drop.

   The viewer is `lg-keep-dark` — stays dark even when the rest of the
   app is in light mode. Theme toggle in the storybook header has no
   effect here, by design (matches prototype). */

const meta = {
  title: 'Organisms/StorytellingDropViewer',
  component: StorytellingDropViewer,
  decorators: [
    (Story) => (
      <div
        className="text-white sf"
        style={{ position: 'relative', width: '100%', height: 852, background: '#000' }}
      >
        <Story />
      </div>
    ),
  ],
  args: {
    onClose: () => console.log('close'),
  },
} satisfies Meta<typeof StorytellingDropViewer>;

export default meta;
type Story = StoryObj<typeof meta>;

/* Default — first player drop ("You're 14% sharper in 4Q this month") */
export const Default: Story = {
  name: 'Player · 14% sharper in 4Q',
  args: { audience: 'player', dropId: 'sd1' },
};

/* Career-best assist week — 3 different moment IDs */
export const AssistWeek: Story = {
  name: 'Player · career-best assist week',
  args: { audience: 'player', dropId: 'sd2' },
};

/* Auto-pick first drop when dropId is omitted (defensive fallback) */
export const NoDropIdFallback: Story = {
  name: 'Fallback · no dropId given',
  args: { audience: 'player' },
};

/* Parent audience — different drop set if defined in STORYTELLING_DROPS.parent */
export const ParentAudience: Story = {
  name: 'Parent audience',
  args: { audience: 'parent' },
};

/* Coach audience */
export const CoachAudience: Story = {
  name: 'Coach audience',
  args: { audience: 'coach' },
};
