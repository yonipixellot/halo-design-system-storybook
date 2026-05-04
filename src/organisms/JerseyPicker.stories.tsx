import type { Meta, StoryObj } from '@storybook/react';
import { JerseyPicker } from '@/screens/home/JerseyPicker';
import { JERSEY_COLORS } from '@/screens/home/_data';

/* Sub-component of GameCardPre. Three-stage flow: detection prompt →
   manual color picker → confirmed acknowledgement. The wrapper here
   renders the picker inside a glass card so the dashed top-border looks
   right (the picker assumes a parent card with separator). */

const meta = {
  title: 'Organisms/JerseyPicker',
  component: JerseyPicker,
  decorators: [
    (Story) => (
      <div className="px-4 mt-3">
        <div
          className="relative squircle-md p-4 overflow-hidden"
          style={{
            background:
              'radial-gradient(ellipse 60% 70% at 18% 28%, rgba(0,214,254,0.12) 0%, transparent 60%),' +
              'radial-gradient(ellipse 60% 70% at 88% 78%, rgba(132,88,255,0.10) 0%, transparent 60%),' +
              'linear-gradient(180deg, var(--card-base-soft-top) 0%, var(--card-base-soft-bot) 100%)',
            border: '1px solid var(--glass-card-border)',
            backdropFilter: 'blur(36px) saturate(180%)',
            WebkitBackdropFilter: 'blur(36px) saturate(180%)',
            boxShadow:
              'inset 0 1px 0 var(--glass-card-inset-top), var(--glass-card-shadow), 0 0 20px -8px rgba(0,214,254,0.18)',
          }}
        >
          <div
            className="sf text-[11px] mb-2"
            style={{ color: 'var(--text-tertiary)' }}
          >
            (Mock parent card — JerseyPicker sits below)
          </div>
          <Story />
        </div>
      </div>
    ),
  ],
  args: {
    onConfirm: (id) => console.log('jersey confirm', id),
    onToast: (msg) => console.log('toast', msg),
  },
} satisfies Meta<typeof JerseyPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

/* Stage 1 — system asks "We see you in white today, right?" */
export const Detected: Story = {
  name: 'Stage 1 · Jersey detection',
  args: { initialStage: 'detected' },
};

/* Stage 1 with a different detected color (red, common for athletes). */
export const DetectedRed: Story = {
  name: 'Stage 1 · Detected red',
  args: { initialStage: 'detected', initialDetected: JERSEY_COLORS[2] },
};

/* Stage 2 — manual override with home + away color tiles. Tap each to cycle. */
export const Picking: Story = {
  name: 'Stage 2 · Pick your kit',
  args: { initialStage: 'pick' },
};

/* Stage 3 — slim cyan acknowledgement pill. */
export const Confirmed: Story = {
  name: 'Stage 3 · Confirmed',
  args: { initialStage: 'confirmed' },
};
