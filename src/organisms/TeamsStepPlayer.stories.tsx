import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TeamsStepPlayer } from '@/screens/onboarding/TeamsStepPlayer';

/* Step 2 of 3 — player branch only. Pick your team (single-select),
   then optionally add division teams (multi-select).

   Stories use real useState so the empty → picking → locked flow
   actually works end-to-end. Pass an `initial` array to seed the state. */

const InteractiveTeams = ({ initial = [] as string[] }: { initial?: string[] }) => {
  const [chosen, setChosen] = useState<string[]>(initial);
  return (
    <TeamsStepPlayer
      chosen={chosen}
      setChosen={setChosen}
      onBack={() => console.log('back')}
      onNext={() => console.log('next', chosen)}
    />
  );
};

const meta = {
  title: 'Organisms/TeamsStepPlayer',
  component: TeamsStepPlayer,
  decorators: [
    (Story) => (
      <div className="absolute inset-0 anim-fade onboard-glass">
        <div className="lg-atmosphere" />
        <div className="absolute inset-0 z-10 flex flex-col">
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof TeamsStepPlayer>;

export default meta;
type Story = StoryObj<typeof meta>;

/* Empty state — no team picked. Shows the dashed CTA. Tap it to enter
   the picking flow; selecting a team locks it in for real. */
export const Empty: Story = {
  render: () => <InteractiveTeams initial={[]} />,
};

/* My team locked — Varsity (t1) pre-selected. Division teams appear
   below; nothing followed yet. */
export const MyTeamLocked: Story = {
  render: () => <InteractiveTeams initial={['t1']} />,
};

/* My team + 2 division follows — Hawks (t5) and Bears (t6) pre-added.
   CTA reads "Continue – 3 teams". */
export const WithDivisionFollows: Story = {
  render: () => <InteractiveTeams initial={['t1', 't5', 't6']} />,
};
