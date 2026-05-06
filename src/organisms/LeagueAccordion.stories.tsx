import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { LeagueAccordion } from '@/screens/onboarding/LeagueAccordion';
import { LEAGUES } from '@/screens/onboarding/_data';

/* LeagueAccordion — collapsible list of leagues used by TeamsStep
   (parent / fan flow). Single-open accordion, search auto-expands
   leagues with matches, "Follow all" CTA on each header. */

const meta = {
  title: 'Organisms/LeagueAccordion',
  component: LeagueAccordion,
  decorators: [
    (Story) => (
      <div
        className="text-white sf p-5"
        style={{
          width: 393,
          minHeight: 600,
          background: 'var(--canvas-bg)',
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LeagueAccordion>;

export default meta;
type Story = StoryObj<typeof meta>;

/* === Interactive wrapper — local state so toggle/setChosen actually work. */
const Interactive = ({ initial = [] as string[], query = '' }) => {
  const [chosen, setChosen] = useState<string[]>(initial);
  const toggle = (id: string) =>
    setChosen((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  return (
    <LeagueAccordion
      chosen={chosen}
      toggle={toggle}
      setChosen={setChosen}
      query={query}
    />
  );
};

export const Default: Story = {
  name: 'Default · all collapsed',
  render: () => <Interactive />,
};

export const SomePreSelected: Story = {
  name: 'Some pre-selected · header shows "followed" count',
  render: () => <Interactive initial={['t1', 't3', 't15']} />,
};

export const AllSelectedInOneLeague: Story = {
  name: 'Whole league selected · "Unfollow all" affordance',
  render: () => <Interactive initial={['t1', 't3', 't8']} />,
};

export const SearchActive: Story = {
  name: "Search 'tigers' · auto-expands matching leagues",
  render: () => <Interactive query="tigers" />,
  parameters: {
    docs: {
      description: {
        story:
          'When a search query is supplied, the first league with a matching team auto-expands and leagues with zero matches are hidden. Clearing the query collapses everything.',
      },
    },
  },
};

export const SingleTeamLeague: Story = {
  name: 'Sparse league · only 1 team (no Follow All button)',
  render: () => (
    <Interactive
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The Boys U16 league only has one team in seed data. The "Follow all" CTA is hidden when allTeams.length ≤ 1 since it would have no purpose.',
      },
    },
  },
};

export const CustomLeagues: Story = {
  name: 'Custom leagues prop · 2 leagues',
  render: () => {
    const [chosen, setChosen] = useState<string[]>([]);
    const toggle = (id: string) =>
      setChosen((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
    return (
      <LeagueAccordion
        chosen={chosen}
        toggle={toggle}
        setChosen={setChosen}
        leagues={LEAGUES.slice(0, 2)}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Pass `leagues={[...]}` to override the seed list — useful for tenant-specific configs (e.g. an NBA-only build that hides youth leagues).',
      },
    },
  },
};
