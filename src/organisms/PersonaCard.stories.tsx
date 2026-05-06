import type { Meta, StoryObj } from '@storybook/react';
import { PersonaCard } from '@/screens/onboarding/PersonaCard';

/* PersonaCard — single-row picker for the onboarding persona screen.
   Lifted out of PersonaStep (May 2026) so the design language is auditable
   and reusable. Coach is hidden from the picker UI by product but the
   variant exists so stories can demo it. */

const meta = {
  title: 'Organisms/PersonaCard',
  component: PersonaCard,
  decorators: [
    (Story) => (
      <div className="text-white sf p-5" style={{ width: 393, minHeight: 200, background: 'var(--canvas-bg)' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    onClick: () => console.log('pick'),
  },
} satisfies Meta<typeof PersonaCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ============ Per-kind, default state ============ */

export const Player: Story = {
  name: 'Player · default',
  args: { kind: 'player' },
};

export const Parent: Story = {
  name: 'Parent · default',
  args: { kind: 'parent' },
};

export const Fan: Story = {
  name: 'Fan · default',
  args: { kind: 'fan' },
};

export const Coach: Story = {
  name: 'Coach · default (hidden from picker)',
  args: { kind: 'coach' },
  parameters: {
    docs: {
      description: {
        story:
          'Coach kind is shipped as a renderable variant but intentionally omitted from the live PersonaStep picker (May 2026 product call). Re-enable by adding `{ kind: "coach" }` to `VISIBLE_PERSONAS` in PersonaStep.tsx.',
      },
    },
  },
};

/* ============ Tones ============ */

export const Featured: Story = {
  name: 'Featured · cyan halo emphasis',
  args: { kind: 'player', featured: true },
};

export const Selected: Story = {
  name: 'Selected · current choice',
  args: { kind: 'player', selected: true },
};

export const Disabled: Story = {
  name: 'Disabled · non-interactive',
  args: { kind: 'coach', disabled: true },
};

/* ============ Override props ============ */

export const CustomCopy: Story = {
  name: 'Custom title + sub',
  args: {
    kind: 'fan',
    title: 'Bring me on board',
    sub: 'I just want to watch.',
  },
};

/* ============ Showcase ============ */

export const FullPickerStack: Story = {
  name: 'Full picker stack (as shipped)',
  render: () => (
    <div className="space-y-2.5">
      <PersonaCard kind="player" featured onClick={() => {}} />
      <PersonaCard kind="parent" onClick={() => {}} />
      <PersonaCard kind="fan" onClick={() => {}} />
    </div>
  ),
};

export const AllTones: Story = {
  name: 'All tones · default / featured / selected / disabled',
  render: () => (
    <div className="space-y-2.5">
      <PersonaCard kind="player" onClick={() => {}} />
      <PersonaCard kind="player" featured onClick={() => {}} />
      <PersonaCard kind="player" selected onClick={() => {}} />
      <PersonaCard kind="player" disabled onClick={() => {}} />
    </div>
  ),
};
