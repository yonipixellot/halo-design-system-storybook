import type { Meta, StoryObj } from '@storybook/react';
import { HighlightCircles } from '@/screens/home/HighlightCircles';
import { IdentityCircle } from '@/screens/home/IdentityCircle';
import { defaultPlayerState } from '@/screens/home/_data';

/* The Following row at the top of Home. Composes IdentityCircle in
   locked sort order:  YOU → followed teams (LIVE first) → followed players
   (claimed first, unclaimed last).

   Variants below cover both data-driven scenarios (different FollowState
   shapes) and a showcase render that mirrors the IdentityCircle spec
   sheet directly — including the LIVE state, which can't be reached
   through the seed data alone. */

const meta = {
  title: 'Organisms/HighlightCircles',
  component: HighlightCircles,
  decorators: [
    (Story) => (
      <div className="anim-fade text-white sf relative" style={{ minHeight: 200 }}>
        <div className="lg-atmosphere" />
        <div className="relative z-10 pt-3">
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof HighlightCircles>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ============ Persona-driven variants (real data path) ============ */

export const Player: Story = {
  name: 'Player · default',
  args: { s: defaultPlayerState },
};

export const Parent: Story = {
  name: 'Parent · viewing Tal',
  args: { s: { ...defaultPlayerState, persona: 'parent', followedPlayers: ['r1'] } },
};

export const Coach: Story = {
  name: 'Coach · empty',
  args: { s: { ...defaultPlayerState, persona: 'coach', followedPlayers: [] } },
};

/* First-day player — followed nothing yet. Just the self circle. */
export const OnlySelf: Story = {
  name: 'Player · day-one (self only)',
  args: {
    s: { persona: 'player', followedTeams: [], followedPlayers: [] },
  },
};

/* Empty state — non-player persona with zero follows. Renders the
   "Follow your team & players" invite card instead of an empty row. */
export const Empty: Story = {
  name: 'Empty · day-one (parent / fan / coach)',
  args: {
    s: { persona: 'parent', followedTeams: [], followedPlayers: [] },
  },
};

/* No teams followed but several players — different sort path. */
export const PlayersOnly: Story = {
  name: 'Player · only following players',
  args: {
    s: {
      persona: 'player',
      followedTeams: [],
      followedPlayers: ['r2', 'r3'],
    },
  },
};

/* Heavy state — multiple teams + multiple players. The row scrolls
   horizontally, sort order still locks: self → teams → claimed → unclaimed. */
export const ManyFollows: Story = {
  name: 'Player · many follows (scrolls)',
  args: {
    s: {
      persona: 'player',
      followedTeams: ['t1', 't3', 't4'],
      followedPlayers: ['r2', 'r3'],
    },
  },
};

/* ============ Showcase variants (compositional render) ============ */
/* These bypass the seed-data path so they can show LIVE state + a fully
   mixed row exactly like the IdentityCircle spec sheet. Useful for FE
   handoff: copy the JSX directly. */

const ShowcaseRow = ({ children }: { children: React.ReactNode }) => (
  <div className="flex gap-4 px-5 pt-2 pb-5 overflow-x-auto no-scrollbar">{children}</div>
);

export const WithLiveTeam: Story = {
  name: 'With live team · ember + LIVE pill',
  render: () => (
    <ShowcaseRow>
      <IdentityCircle kind="self" avatar={{ initial: 'T' }} label="You" />
      <IdentityCircle
        kind="team"
        avatar={{ initial: 'EP' }}
        label="Varsity"
        liveGame={{ gameId: 'g1' }}
      />
      <IdentityCircle kind="team" avatar={{ initial: 'WC' }} label="Hawks" isNew />
      <IdentityCircle
        kind="player"
        avatar={{ initial: 'S' }}
        team={{ initial: 'EP' }}
        label="Sarah"
        isClaimed
      />
    </ShowcaseRow>
  ),
};

/* Full sort-order showcase — every variant in their proper sequence.
   Mirrors the "Row in context" demo from identity-circle-spec.html. */
export const SortOrderShowcase: Story = {
  name: 'Sort order · every variant',
  render: () => (
    <ShowcaseRow>
      <IdentityCircle kind="self" avatar={{ initial: 'T' }} label="You" />
      <IdentityCircle
        kind="team"
        avatar={{ initial: 'EP' }}
        label="Varsity"
        liveGame={{ gameId: 'g1' }}
      />
      <IdentityCircle kind="team" avatar={{ initial: 'WC' }} label="Hawks" />
      <IdentityCircle
        kind="player"
        avatar={{ initial: 'S' }}
        team={{ initial: 'EP' }}
        label="Sarah"
        isClaimed
        isNew
      />
      <IdentityCircle
        kind="player"
        avatar={{ initial: 'D' }}
        team={{ initial: 'EP' }}
        label="Dylan"
        isClaimed
      />
      <IdentityCircle
        kind="player"
        avatar={{ jersey: 12 }}
        team={{ initial: 'EP' }}
        label="Player #12"
        isClaimed={false}
      />
      <IdentityCircle
        kind="player"
        avatar={{ jersey: 7 }}
        team={{ initial: 'WC' }}
        label="Player #7"
        isClaimed={false}
      />
    </ShowcaseRow>
  ),
};

/* All four kinds side-by-side at rest — useful for visual diff. */
export const KindsAtRest: Story = {
  name: 'Kinds · self / team / claimed / unclaimed',
  render: () => (
    <ShowcaseRow>
      <IdentityCircle kind="self" avatar={{ initial: 'T' }} label="You" />
      <IdentityCircle kind="team" avatar={{ initial: 'EP' }} label="Varsity" />
      <IdentityCircle
        kind="player"
        avatar={{ initial: 'S' }}
        team={{ initial: 'EP' }}
        label="Sarah"
        isClaimed
      />
      <IdentityCircle
        kind="player"
        avatar={{ jersey: 23 }}
        team={{ initial: 'EP' }}
        label="Player #23"
        isClaimed={false}
      />
    </ShowcaseRow>
  ),
};

/* All four kinds with the new-content dot. */
export const KindsWithNewDot: Story = {
  name: 'Kinds · with new-content dot',
  render: () => (
    <ShowcaseRow>
      <IdentityCircle kind="self" avatar={{ initial: 'T' }} label="You" isNew />
      <IdentityCircle kind="team" avatar={{ initial: 'EP' }} label="Varsity" isNew />
      <IdentityCircle
        kind="player"
        avatar={{ initial: 'S' }}
        team={{ initial: 'EP' }}
        label="Sarah"
        isClaimed
        isNew
      />
      <IdentityCircle
        kind="player"
        avatar={{ jersey: 23 }}
        team={{ initial: 'EP' }}
        label="Player #23"
        isClaimed={false}
        isNew
      />
    </ShowcaseRow>
  ),
};
