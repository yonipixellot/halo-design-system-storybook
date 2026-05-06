import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TeamRosterAccordion } from '@/screens/onboarding/TeamRosterAccordion';

/* TeamRosterAccordion — collapsible team list for the player picker.
   Step 3 of onboarding for parent/fan personas. Mirrors LeagueAccordion
   but groups by team → players (not league → teams). */

const meta = {
  title: 'Organisms/TeamRosterAccordion',
  component: TeamRosterAccordion,
  decorators: [
    (Story) => (
      <div
        className="text-white sf p-5"
        style={{ width: 393, minHeight: 600, background: 'var(--canvas-bg)' }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TeamRosterAccordion>;

export default meta;
type Story = StoryObj<typeof meta>;

const Interactive = ({
  teamIds,
  initial = {},
  query = '',
}: {
  teamIds: string[];
  initial?: Record<string, boolean>;
  query?: string;
}) => {
  const [chosenPlayers, setChosenPlayers] = useState<Record<string, boolean>>(initial);
  const togglePlayer = (id: string) =>
    setChosenPlayers((prev) => ({ ...prev, [id]: !prev[id] }));
  return (
    <TeamRosterAccordion
      teamIds={teamIds}
      chosenPlayers={chosenPlayers}
      togglePlayer={togglePlayer}
      setChosenPlayers={setChosenPlayers}
      query={query}
    />
  );
};

export const Default: Story = {
  name: 'Default · followed 3 teams from step 2',
  render: () => <Interactive teamIds={['t1', 't3', 't4']} />,
};

export const AllSixFollowed: Story = {
  name: 'All 6 followed teams · scrollable',
  render: () => <Interactive teamIds={['t1', 't3', 't4', 't8', 't15', 't5']} />,
};

export const SomePreSelected: Story = {
  name: 'Pre-selected players · header shows "followed N"',
  render: () => (
    <Interactive
      teamIds={['t1', 't3', 't4']}
      initial={{ r1: true, r3: true, r9: true, r12: true }}
    />
  ),
};

export const WholeRosterFollowed: Story = {
  name: 'Whole team roster followed · "Unfollow all" affordance',
  render: () => (
    <Interactive
      teamIds={['t1']}
      initial={{ r1: true, r2: true, r3: true, r4: true, r5: true, r6: true }}
    />
  ),
};

export const SearchByName: Story = {
  name: "Search 'theo' · auto-expands matching team",
  render: () => <Interactive teamIds={['t1', 't3', 't4', 't8']} query="theo" />,
};

export const SearchByJersey: Story = {
  name: "Search '7' · matches by jersey #",
  render: () => <Interactive teamIds={['t1', 't3', 't4']} query="7" />,
};

export const TeamWithThinRoster: Story = {
  name: 'Team with 2 players · no Follow All button',
  render: () => <Interactive teamIds={['t5', 't17']} />,
  parameters: {
    docs: {
      description: {
        story:
          'Hawks (t5) and Sparrows (t17) only have 2 players each in seed data. The "Follow all" CTA hides when allRoster.length ≤ 1. With 2 players it still shows but is less essential.',
      },
    },
  },
};

export const TeamWithEmptyRoster: Story = {
  name: 'Team with no roster · empty state',
  render: () => <Interactive teamIds={['t6', 't1']} />,
  parameters: {
    docs: {
      description: {
        story:
          'Bears (t6) has no players in seed data. The accordion shows an empty-state message ("No roster yet for this team.") when expanded.',
      },
    },
  },
};

export const NoTeamsFollowed: Story = {
  name: 'No teams followed · friendly redirect',
  render: () => <Interactive teamIds={[]} />,
  parameters: {
    docs: {
      description: {
        story:
          'When `teamIds` is empty (the user landed here without following any teams in step 2), the component renders a single placeholder card pointing them back to step 2.',
      },
    },
  },
};
