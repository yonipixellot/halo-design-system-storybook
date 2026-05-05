import type { Meta, StoryObj } from '@storybook/react';
import { IdentityCircle } from '@/screens/home/IdentityCircle';
import { TEAM_LOGOS, SAMPLE_PORTRAITS } from '@/screens/home/_avatars';

/* IdentityCircle is the atom shared by Home (followed-row) and many
   detail screens. Its avatar slot has a 4-step fallback chain:

     src      → image (team logo from CMS, player profile pic from upload)
     [auto]   → gray silhouette (claimed player without a pic)
     jersey   → big jersey number (typically unclaimed players)
     initial  → letter (legacy / team without logo)

   The stories below cover the full matrix so designers can spot-check
   each branch in isolation, plus a Loading variant that demos the
   Gemini-style colored shimmer the avatar shows while images are
   loading. */

const meta = {
  title: 'Atoms/IdentityCircle',
  component: IdentityCircle,
  decorators: [
    (Story) => (
      <div className="text-white sf relative" style={{ minHeight: 160, padding: 24 }}>
        <div className="lg-atmosphere" />
        <div className="relative z-10">
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof IdentityCircle>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ============ Self ============ */

export const SelfWithPic: Story = {
  name: 'Self · with profile pic',
  args: {
    kind: 'self',
    avatar: { src: SAMPLE_PORTRAITS.tal, initial: 'T' },
    label: 'You',
    isNew: true,
  },
};

export const SelfNoPic: Story = {
  name: 'Self · no pic (initial)',
  args: { kind: 'self', avatar: { initial: 'T' }, label: 'You', isNew: true },
};

/* ============ Team ============ */

export const TeamWithLogo: Story = {
  name: 'Team · with logo',
  args: {
    kind: 'team',
    avatar: { src: TEAM_LOGOS.EP, initial: 'EP' },
    label: 'Varsity',
    isNew: true,
  },
};

export const TeamNoLogo: Story = {
  name: 'Team · no logo (initial fallback)',
  args: { kind: 'team', avatar: { initial: 'EP' }, label: 'Varsity', isNew: true },
};

export const TeamLive: Story = {
  name: 'Team · live (logo + ember)',
  args: {
    kind: 'team',
    avatar: { src: TEAM_LOGOS.EP, initial: 'EP' },
    label: 'Varsity',
    liveGame: { gameId: 'g1' },
  },
};

export const TeamLiveNoLogo: Story = {
  name: 'Team · live (no logo)',
  args: {
    kind: 'team',
    avatar: { initial: 'EP' },
    label: 'Varsity',
    liveGame: { gameId: 'g1' },
  },
};

/* ============ Player ============ */

export const PlayerClaimedWithPic: Story = {
  name: 'Player · claimed + profile pic',
  args: {
    kind: 'player',
    avatar: { src: SAMPLE_PORTRAITS.sarah, initial: 'S' },
    team: { src: TEAM_LOGOS.EP, initial: 'EP' },
    label: 'Sarah',
    isClaimed: true,
    isNew: true,
  },
};

export const PlayerClaimedSilhouette: Story = {
  name: 'Player · claimed, no pic (silhouette)',
  args: {
    kind: 'player',
    avatar: { initial: 'D' }, // initial is irrelevant for claimed → silhouette wins
    team: { src: TEAM_LOGOS.EP, initial: 'EP' },
    label: 'Dylan',
    isClaimed: true,
  },
};

export const PlayerUnclaimedJersey: Story = {
  name: 'Player · unclaimed (jersey #)',
  args: {
    kind: 'player',
    avatar: { jersey: 23 },
    team: { src: TEAM_LOGOS.EP, initial: 'EP' },
    label: 'Player #23',
    isClaimed: false,
  },
};

export const PlayerCrestNoLogo: Story = {
  name: 'Player · crest fallback (no team logo)',
  args: {
    kind: 'player',
    avatar: { src: SAMPLE_PORTRAITS.sarah, initial: 'S' },
    team: { initial: 'EP' }, // team has no src → crest renders text
    label: 'Sarah',
    isClaimed: true,
  },
};

/* ============ Loading shimmer ============
   The Gemini-style colored skeleton we render under the avatar while
   the image is fetching. Hard to capture in a normal story because
   data URIs load instantly, so this story renders the shell DOM
   directly — kept in lockstep with IdentityCircle.tsx (May 2026
   Option-C ring tiering: solid cyan border, no conic gradient bg). */

const LoadingRing = ({
  label,
  glassClass,
  withCrest,
}: {
  label: string;
  glassClass: 'lg-glass-card' | 'lg-glass-strong';
  withCrest?: boolean;
}) => (
  <div className="shrink-0 flex flex-col items-center gap-1.5">
    <div
      className="relative w-[64px] h-[64px] rounded-full"
      style={{
        border: '2.5px solid var(--brand-cyan)',
        boxSizing: 'border-box',
        background: 'transparent',
      }}
    >
      <div className={`w-full h-full rounded-full overflow-hidden ${glassClass} relative`}>
        <div className="absolute inset-0 lg-avatar-skeleton" aria-hidden="true" />
      </div>
      {withCrest && (
        <div
          className="absolute rounded-full overflow-hidden"
          style={{
            bottom: 0,
            right: 0,
            width: 'var(--crest-size)',
            height: 'var(--crest-size)',
            background: 'var(--canvas-bg-soft)',
            border: '2px solid var(--canvas-bg)',
            boxShadow:
              'inset 0 1px 0 var(--glass-card-inset-top), 0 3px 8px -2px rgba(0,0,0,0.50)',
          }}
        >
          <div className="absolute inset-0 lg-avatar-skeleton rounded-full" aria-hidden="true" />
        </div>
      )}
    </div>
    <div className="h-[14px] flex items-center justify-center">
      <span
        className="sf text-[11px] font-semibold leading-tight"
        style={{ color: 'var(--text-secondary)' }}
      >
        {label}
      </span>
    </div>
  </div>
);

export const Loading: Story = {
  name: 'Loading · gemini-style shimmer',
  render: () => (
    <div className="flex gap-4">
      <LoadingRing label="You" glassClass="lg-glass-card" />
      <LoadingRing label="Varsity" glassClass="lg-glass-strong" />
      <LoadingRing label="Sarah" glassClass="lg-glass-card" withCrest />
    </div>
  ),
};
