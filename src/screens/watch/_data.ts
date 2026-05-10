/* Watch-tab fixtures.

   Verbatim port of halo-v3.2-glass.html:
     - SEED_GAMES (line 1666) — extended slightly with more `ended`
       games so the rails feel populated on a 1200-wide desktop.
     - CLIENTS (line 2362) — kept just `aba` for now; multi-client
       picker is parked until a future pass adds it.
     - SEED_MOMENTS — re-uses Player moments from home/_data.ts via
       re-export so the cross-tab data stays in one place. The Watch
       PlayerHighlightsRail extends the seed with three teammates
       (sarah, dylan, marcus) used in the v3.2 rail.

   Persona handling:
     - 'player' → PlayerHighlightsRail filters to personId === 'self'
       (their own moments).
     - 'fan' → PlayerHighlightsRail title flips to "From players you
       follow" and seeds from a passed `followedPlayers` array. If
       empty, the rail hides (clean empty state). */

import type { Moment } from '@/screens/home/_data';

export type GameStatus = 'live' | 'upcoming' | 'just-ended' | 'ended';

export interface WatchGame {
  id: string;
  home: string;
  away: string;
  /** Hebrew variants follow Halo's `field + field_he` pattern. */
  home_he?: string;
  away_he?: string;
  teamId: string;
  status: GameStatus;
  scoreHome?: number;
  scoreAway?: number;
  period?: string;
  period_he?: string;
  momentsCount?: number;
  venue?: string;
  /** Division id this game belongs to (filters the rails when active). */
  divisionId?: string;
}

export const SEED_WATCH_GAMES: WatchGame[] = [
  /* ── Live ────────────────────────────────────────────────────── */
  {
    id: 'g1',
    home: 'Varsity',
    home_he: 'ורסיטי',
    away: 'Westfield Hawks',
    away_he: 'נצי וסטפילד',
    teamId: 't1',
    status: 'live',
    scoreHome: 28,
    scoreAway: 24,
    period: 'Q2',
    period_he: 'רבע 2',
    momentsCount: 5,
    venue: 'Eastside Gym',
    divisionId: 'varsity',
  },
  /* ── Upcoming ────────────────────────────────────────────────── */
  {
    id: 'g2',
    home: 'Varsity',
    away: 'Lincoln Tigers',
    teamId: 't1',
    status: 'upcoming',
    momentsCount: 0,
    venue: 'Lincoln HS',
    divisionId: 'varsity',
  },
  /* ── Just-ended (eligible for hero fallback) ─────────────────── */
  {
    id: 'gE',
    home: 'Varsity',
    away: 'Northside Wolves',
    teamId: 't1',
    status: 'just-ended',
    scoreHome: 51,
    scoreAway: 47,
    momentsCount: 8,
    venue: 'Eastside Gym',
    divisionId: 'varsity',
  },
  /* ── Ended (the bulk of the rails) ───────────────────────────── */
  { id: 'g4', home: 'Varsity',  away: 'Westfield',     teamId: 't1', status: 'ended', scoreHome: 55, scoreAway: 48, momentsCount: 8,  divisionId: 'varsity' },
  { id: 'g5', home: 'Varsity',  away: 'Lincoln',       teamId: 't1', status: 'ended', scoreHome: 62, scoreAway: 59, momentsCount: 12, divisionId: 'varsity' },
  { id: 'g6', home: 'Varsity',  away: 'Riverside',     teamId: 't1', status: 'ended', scoreHome: 44, scoreAway: 51, momentsCount: 6,  divisionId: 'varsity' },
  { id: 'g7', home: 'Girls JV', away: 'Lincoln',       teamId: 't2', status: 'ended', scoreHome: 38, scoreAway: 35, momentsCount: 9,  divisionId: 'girls-jv' },
  { id: 'g8', home: 'Varsity',  away: 'Northside',     teamId: 't1', status: 'ended', scoreHome: 71, scoreAway: 63, momentsCount: 15, divisionId: 'varsity' },
  { id: 'g9', home: 'Varsity',  away: 'Hilltop',       teamId: 't1', status: 'ended', scoreHome: 49, scoreAway: 52, momentsCount: 7,  divisionId: 'varsity' },
  { id: 'gA', home: 'Middle',   away: 'Lakewood',      teamId: 't5', status: 'ended', scoreHome: 41, scoreAway: 38, momentsCount: 5,  divisionId: 'middle' },
  { id: 'gB', home: 'Girls JV', away: 'Hilltop Girls', teamId: 't2', status: 'ended', scoreHome: 47, scoreAway: 39, momentsCount: 8,  divisionId: 'girls-jv' },
  { id: 'gC', home: 'Middle',   away: 'Westfield MS',  teamId: 't5', status: 'ended', scoreHome: 36, scoreAway: 31, momentsCount: 4,  divisionId: 'middle' },
];

/* ── CLIENTS / divisions — port of v3.2 line 2362 ─────────────── */

export interface Division {
  id: string;
  name: string;
  full: string;
  sub: string;
  /** True if any game in this division is currently live. Drives the
      red dot indicator on the division pill. */
  live: boolean;
}

export interface Client {
  id: string;
  label: string;
  short: string;
  featured: {
    id: string;
    title: string;
    sub: string;
    kicker: string;
  };
  divisions: Division[];
}

export const CLIENT_EASTSIDE: Client = {
  id: 'eastside',
  label: 'Eastside Athletic',
  short: 'EA',
  featured: {
    id: 'feat-ea',
    title: 'Eastside Varsity vs Westfield',
    sub: 'CROSS-TOWN RIVALRY · TONIGHT 6:30',
    kicker: 'FEATURED EVENT',
  },
  divisions: [
    { id: 'varsity',   name: 'VARSITY',  full: 'VARSITY · BOYS',    sub: 'U18 · 16 players', live: true  },
    { id: 'girls-jv',  name: 'GIRLS JV', full: 'GIRLS JV',          sub: 'U16 · 14 players', live: false },
    { id: 'middle',    name: 'MIDDLE',   full: 'MIDDLE SCHOOL',     sub: 'U14 · 18 players', live: true  },
    { id: 'football',  name: 'FOOTBALL', full: 'FOOTBALL · VARSITY', sub: '40 players',      live: false },
    { id: 'track',     name: 'TRACK',    full: 'TRACK & FIELD',     sub: 'Co-ed · 24',       live: false },
    { id: 'wrestling', name: 'WREST',    full: 'WRESTLING',         sub: 'Boys · 12',        live: false },
  ],
};

/* === Player highlights moments — extends home seed ===
   The Watch PlayerHighlightsRail wants ~8 thumbs from a few players,
   not just 'self'. Home's SEED_MOMENTS has only `personId: 'self'`.
   We augment with three teammates so the rail composes correctly. */

export const WATCH_TEAMMATE_MOMENTS: Moment[] = [
  { id: 'wm1', gameId: 'gE', personId: 'sarah',  title: "Sarah · clutch FT",   sub: 'Q4 · 0:24', duration: 6,  tag: null,    reactions: 12 },
  { id: 'wm2', gameId: 'gE', personId: 'dylan',  title: 'Alley-oop',           sub: 'Q2 · 4:11', duration: 7,  tag: 'hot',   reactions: 15 },
  { id: 'wm3', gameId: 'gE', personId: 'marcus', title: 'Putback dunk',        sub: 'Q4 · 2:30', duration: 6,  tag: 'coach', reactions: 22 },
  { id: 'wm4', gameId: 'g1', personId: 'sarah',  title: "Sarah · drive + dish",sub: 'Q1 · 4:30', duration: 9,  tag: null,    reactions: 4  },
  { id: 'wm5', gameId: 'g1', personId: 'dylan',  title: 'And-1 finish',        sub: 'Q2 · 9:50', duration: 8,  tag: 'hot',   reactions: 7  },
];

/* Re-export i18n helper from home so all screens use one hook impl. */
export { useT } from '@/screens/home/_data';
