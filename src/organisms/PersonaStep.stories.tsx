import type { Meta, StoryObj } from '@storybook/react';
import { PersonaStep } from '@/screens/onboarding/PersonaStep';

const meta = {
  title: 'Organisms/PersonaStep',
  component: PersonaStep,
  decorators: [
    (Story) => (
      <div className="absolute inset-0 anim-fade onboard-glass" style={{ background: '#000' }}>
        <div className="lg-atmosphere" />
        <div className="absolute inset-0 z-10 flex flex-col">
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof PersonaStep>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { onPick: (p) => console.log('persona', p) },
};
