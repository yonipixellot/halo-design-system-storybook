/* Mock seed data for home — subset of prototype's SEED_GAMES + SEED_MOMENTS + helpers. */

export type GameStatus = 'upcoming' | 'live' | 'just-ended' | 'final';

export interface Game {
  id: string;
  home: string;
  away: string;
  teamId: string;
  status: GameStatus;
  kickoffInSec?: number;
  scoreHome?: number;
  scoreAway?: number;
  venue?: string;
  momentsCount?: number;
  /** Live games only — quarter / half / period label rendered in the chip. */
  period?: string;
}

/* Verbatim port: halo-v3.2-glass.html line 8494.
   Used by JerseyPicker (sub-component of GameCardPre). */
export interface JerseyColor {
  id: string;
  name: string;
  fill: string;
  stroke: string;
}
export const JERSEY_COLORS: JerseyColor[] = [
  { id: 'white',  name: 'White',  fill: '#ffffff', stroke: '#000' },
  { id: 'black',  name: 'Black',  fill: '#000000', stroke: '#000' },
  { id: 'red',    name: 'Red',    fill: '#dc2626', stroke: '#000' },
  { id: 'blue',   name: 'Blue',   fill: '#2563eb', stroke: '#000' },
  { id: 'yellow', name: 'Yellow', fill: '#facc15', stroke: '#000' },
  { id: 'green',  name: 'Green',  fill: '#16a34a', stroke: '#000' },
];

export const SEED_GAMES: Game[] = [
  { id: 'g1', home: 'Varsity',  away: 'Lincoln',     teamId: 't1', status: 'upcoming', kickoffInSec: 32 * 60 * 60, venue: 'Eastside Gym' },
  { id: 'g2', home: 'Varsity',  away: 'Northside',   teamId: 't1', status: 'upcoming', kickoffInSec: 4 * 24 * 3600 },
  { id: 'g3', home: 'Tigers',   away: 'Eastside',    teamId: 't3', status: 'upcoming', kickoffInSec: 2 * 24 * 3600 },
  { id: 'g4', home: 'Wolves',   away: 'Falcons',     teamId: 't4', status: 'upcoming', kickoffInSec: 18 * 3600 },
  { id: 'gL', home: 'Varsity',  away: 'Westfield Hawks', teamId: 't1', status: 'live', scoreHome: 28, scoreAway: 24, period: 'Q2', momentsCount: 5 },
  { id: 'gE', home: 'Varsity',  away: 'Northside',   teamId: 't1', status: 'just-ended', scoreHome: 64, scoreAway: 58, momentsCount: 8 },
];

export type MomentTag = 'top' | 'hot' | 'coach' | 'streak' | null;

export interface Moment {
  id: string;
  gameId: string;
  personId: string;
  title: string;
  sub: string;
  duration: number;
  tag: MomentTag;
  reactions: number;
}

export const SEED_MOMENTS: Moment[] = [
  { id: 'm1', gameId: 'gE', personId: 'self', title: 'Game-winning 3',  sub: 'Q4 · 0:08', duration: 9,  tag: 'top',    reactions: 24 },
  { id: 'm2', gameId: 'gE', personId: 'self', title: 'Steal + break',   sub: 'Q3 · 8:42', duration: 11, tag: 'hot',    reactions: 18 },
  { id: 'm3', gameId: 'gE', personId: 'self', title: 'Block on Lakewood', sub: 'Q2 · 4:11', duration: 8,  tag: 'coach',  reactions: 14 },
  { id: 'm4', gameId: 'gE', personId: 'self', title: 'Half-court 3',    sub: 'Q3 · 1:22', duration: 12, tag: 'streak', reactions: 22 },
  { id: 'm5', gameId: 'gE', personId: 'self', title: 'Crossover floater', sub: 'Q4 · 6:04', duration: 10, tag: null,   reactions: 9  },
  { id: 'm6', gameId: 'gE', personId: 'self', title: 'No-look pass',    sub: 'Q1 · 7:33', duration: 14, tag: 'hot',    reactions: 16 },
];

export const ROSTER_LITE = [
  { id: 'r1',   name: 'Tal Weiss',  number: 7,  position: 'SG', teamId: 't1' },
  { id: 'r2',   name: 'Sarah Kim',  number: 12, position: 'PG', teamId: 't1' },
  { id: 'self', name: 'Tal Weiss',  number: 7,  position: 'SG', teamId: 't1' },
];

export const findMoment = (id: string): Moment | undefined => SEED_MOMENTS.find((m) => m.id === id);
export const findGame = (id: string): Game | undefined => SEED_GAMES.find((g) => g.id === id);

/* Verbatim port of prototype's fmt object (line 2488). */
export const fmt = {
  countdown(sec?: number): string {
    const s = Math.max(0, sec ?? 0);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const ss = s % 60;
    if (h > 0) return `${h}h ${String(m).padStart(2, '0')}m`;
    return `${String(m).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
  },
  ago(sec: number): string {
    const a = Math.abs(sec);
    if (a < 3600) return `${Math.round(a / 60)}m ago`;
    if (a < 86400) return `${Math.round(a / 3600)}h ago`;
    if (a < 86400 * 2) return 'yesterday';
    return `${Math.round(a / 86400)}d ago`;
  },
  /* Future-tense relative label for upcoming games. The prototype's
     NextGameTeaser used `fmt.ago` which mislabels a 32h-out game as
     "yesterday" — wrong tense for an upcoming event. */
  until(sec: number): string {
    if (sec < 3600) return `in ${Math.round(sec / 60)}m`;
    if (sec < 86400) return `in ${Math.round(sec / 3600)}h`;
    if (sec < 86400 * 2) return 'tomorrow';
    return `in ${Math.round(sec / 86400)}d`;
  },
  dur(sec: number): string {
    return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
  },
};

/* Stub for useT — translation. Returns the key as the value (English). */
export const useT = () => (k: string) => {
  const dict: Record<string, string> = {
    gameDay: 'Game day',
    talsPlaying: "Tal's playing",
    teamStatus: 'Team status',
    followingUpcoming: 'Following — upcoming',
    recentRecaps: 'Recent recaps',
    watch: 'Watch',
    drops: 'Drops',
    dropsThisWeek: 'Drops this week',
    teamMoments: 'Team moments',
    storytellingDrops: 'Story drops',
  };
  return dict[k] ?? k;
};

/* STORYTELLING_DROPS — verbatim from prototype line 9103 */
export type Audience = 'player' | 'parent' | 'coach';
export interface StorytellingDrop {
  id: string;
  title: string;
  body: string;
  momentIds: string[];
}
export const STORYTELLING_DROPS: Record<Audience, StorytellingDrop[]> = {
  player: [
    {
      id: 'sd1',
      title: "You're 14% sharper in 4Q this month",
      body: 'Last 5 games — 18/24 from the field after the 8:00 mark of the 4th quarter. Coach is leaning on you late.',
      momentIds: ['m17', 'm18', 'm20'],
    },
    {
      id: 'sd2',
      title: 'Career-best assist week',
      body: '5.4 assists / game · top of the league for shooting guards in your division.',
      momentIds: ['m22', 'm25', 'm10'],
    },
    {
      id: 'sd3',
      title: 'Your defense set the tone vs Lincoln',
      body: '3 stops in the first 4 minutes of OT — single-handedly killed their run.',
      momentIds: ['m18', 'm19'],
    },
  ],
  parent: [
    { id: 'sd4', title: "Tal's averaging 18 pts this week", body: 'Up from his 12-pt season average. The breakout is real — big efficiency jump on catch-and-shoot.', momentIds: ['m1', 'm13', 'm17'] },
    { id: 'sd5', title: 'Tal · most-improved on defense', body: 'Coach Miles called him out twice this week for closeouts. Big steps from start of the season.', momentIds: ['m11', 'm24'] },
    { id: 'sd6', title: 'Tal hit a triple-double', body: '18 points · 11 rebounds · 10 assists · all in 26 minutes vs Northside.', momentIds: ['m21', 'm22'] },
  ],
  coach: [
    { id: 'sd7', title: 'Defense up 38% in the 4th', body: 'Last 5 games · opponents shooting 31% in 4Q vs 50% earlier in season. Shift is real.', momentIds: ['m24', 'm18', 'm19'] },
    { id: 'sd8', title: '#7 is your closer', body: 'In clutch (last 4 min, score within 5), Tal is 9/11 FG and +14 net. Lean in.', momentIds: ['m1', 'm17', 'm20'] },
  ],
};

/* TEAM_RECAPS — verbatim from prototype line 1987 */
export type RecapKind = 'full-recap' | 'top-plays' | 'comeback';
export interface Recap {
  id: string;
  gameId: string;
  kind: RecapKind;
  title: string;
  sub: string;
  duration: number;
  views: number;
}
export const TEAM_RECAPS: Recap[] = [
  { id: 'tr1', gameId: 'gE', kind: 'full-recap', title: 'Full Game Recap', sub: 'Varsity 51 · Northside 47', duration: 185, views: 0 },
  { id: 'tr2', gameId: 'g4', kind: 'full-recap', title: 'Full Game Recap', sub: 'Varsity 55 · Westfield 48', duration: 185, views: 1240 },
  { id: 'tr3', gameId: 'g5', kind: 'top-plays',  title: 'Top 10 Plays',    sub: 'vs Lincoln · OT thriller', duration: 127, views: 2103 },
  { id: 'tr4', gameId: 'g5', kind: 'comeback',   title: 'Q4 Comeback',     sub: '14-2 run to force OT',     duration: 94,  views: 2103 },
  { id: 'tr5', gameId: 'g8', kind: 'full-recap', title: 'Full Game Recap', sub: 'Varsity 71 · Northside 63', duration: 195, views: 744 },
];

/* Verbatim from prototype line 9403 */
export const dropTagEmoji = (tag: MomentTag): string => {
  if (tag === 'top') return '\u{1F3AF}';   // 🎯 game-winner / target
  if (tag === 'hot') return '\u{1F525}';   // 🔥 hot streak
  if (tag === 'coach') return '\u{1F6E1}️'; // 🛡️ coach pick / defense
  if (tag === 'streak') return '\u{1F680}'; // 🚀 streak / rocket
  return '\u{1F525}';
};

/* Verbatim from prototype line 9410 */
export const dropEditorialCopy = (
  moment: Moment,
  game: Game | null | undefined,
  player: { number?: number } | null | undefined,
): { title: string; body: string } => {
  const num = player?.number || 7;
  const title = `${dropTagEmoji(moment.tag)} #${num} Best plays`;
  let body = '';
  if (game && game.scoreHome != null && game.scoreAway != null) {
    const win = game.scoreHome >= game.scoreAway;
    const opp = (game.away || 'opp').split(' ')[0];
    if (moment.tag === 'top') {
      body = win
        ? `Crushed ${opp} ${game.scoreHome}–${game.scoreAway}. #${num} led with 18 pts, 9 reb.`
        : `Lost to ${opp} ${game.scoreHome}–${game.scoreAway}. #${num} dropped 22 pts.`;
    } else if (moment.tag === 'hot') {
      body = `${win ? 'Beat' : 'Battle vs'} ${opp} ${game.scoreHome}–${game.scoreAway}. #${num} went 9/12 from the field.`;
    } else if (moment.tag === 'coach') {
      body = `${win ? 'Held' : 'Pushed'} ${opp} — #${num} locked the perimeter.`;
    } else {
      body = `${win ? 'Took down' : 'Faced'} ${opp} ${game.scoreHome}–${game.scoreAway}. #${num} put up a clutch line.`;
    }
  } else {
    body = `${moment.title || 'Highlight'} · ${moment.sub || ''}`;
  }
  return { title, body };
};

export interface FollowState {
  persona: 'player' | 'parent' | 'coach';
  followedTeams: string[];
  followedPlayers: string[];
}

export const defaultPlayerState: FollowState = {
  persona: 'player',
  followedTeams: ['t1', 't3', 't4'],
  followedPlayers: ['r1', 'r2'],
};
