/* Mock data — subset of prototype's TEAMS_DB / ROSTER / PERSONAS so the
   onboarding screens render with realistic content. */

export const TEAMS_DB = [
  { id: 't1', name: 'Varsity',   org: 'Eastside Prep',       division: 'U14', initial: 'EP', claimCode: 'varsity-eastside-2026' },
  { id: 't2', name: 'Girls JV',  org: 'Eastside Prep',       division: 'U16', initial: 'EP', claimCode: 'girls-jv-eastside-2026' },
  { id: 't3', name: 'Tigers',    org: 'Lincoln High',        division: 'U18', initial: 'LH', claimCode: 'tigers-lincoln-2026' },
  { id: 't4', name: 'Wolves',    org: 'Northside Academy',   division: 'U16', initial: 'NA', claimCode: 'wolves-northside-2026' },
  { id: 't5', name: 'Hawks',     org: 'Westfield Catholic',  division: 'U14', initial: 'WC', claimCode: 'hawks-westfield-2026' },
  { id: 't6', name: 'Bears',     org: 'Madison Heights',     division: 'U14', initial: 'MH', claimCode: 'bears-madison-2026' },
  { id: 't7', name: 'Falcons',   org: 'Riverside Academy',   division: 'U14', initial: 'RA', claimCode: 'falcons-riverside-2026' },
  { id: 't8', name: 'Spartans',  org: 'Oakwood Prep',        division: 'U14', initial: 'OP', claimCode: 'spartans-oakwood-2026' },
  { id: 't9',  name: 'Knights',  org: 'Saint Marks',     division: 'U14', initial: 'SM', claimCode: 'knights-saintmarks-2026' },
  { id: 't10', name: 'Pioneers', org: 'Cedar Valley',    division: 'U14', initial: 'CV', claimCode: 'pioneers-cedarvalley-2026' },
  { id: 't11', name: 'Raptors',  org: 'Bayview Charter', division: 'U14', initial: 'BC', claimCode: 'raptors-bayview-2026' },
  { id: 't12', name: 'Cyclones', org: 'Hilltop Academy', division: 'U14', initial: 'HA', claimCode: 'cyclones-hilltop-2026' },
  { id: 't13', name: 'Comets',   org: 'Northgate High',  division: 'U14', initial: 'NH', claimCode: 'comets-northgate-2026' },
  { id: 't14', name: 'Mustangs', org: 'Briarcliff Prep', division: 'U14', initial: 'BP', claimCode: 'mustangs-briarcliff-2026' },
];

export const ROSTER = [
  { id: 'r1', name: 'Tal Weiss',     number: 7,  position: 'SG', teamId: 't1', claimed: false },
  { id: 'r2', name: 'Sarah Kim',     number: 12, position: 'PG', teamId: 't1', claimed: true  },
  { id: 'r3', name: 'Dylan Torres',  number: 23, position: 'SF', teamId: 't1', claimed: true  },
  { id: 'r4', name: 'Marcus Johnson', number: 5, position: 'C',  teamId: 't1', claimed: false },
  { id: 'r5', name: 'Jalen Wright',  number: 11, position: 'PF', teamId: 't1', claimed: false },
  { id: 'r6', name: 'Alex Chen',     number: 3,  position: 'SG', teamId: 't1', claimed: false },
];

/* Verbatim port: halo-v3.2-glass.html line 1555.
   Star players from rival teams in the same division — shown in the
   PlayersStep player branch as "Top rivals" follow suggestions. */
export const RIVAL_STARS = [
  { id: 'rv1', name: 'Marcus Webb',   number: 4,  position: 'PG', teamId: 't2', teamInitial: 'WC', teamName: 'Hawks',   role: 'Division MVP'   },
  { id: 'rv2', name: 'Devon Hayes',   number: 11, position: 'SF', teamId: 't3', teamInitial: 'MH', teamName: 'Bears',   role: 'Top scorer'     },
  { id: 'rv3', name: 'Theo Lin',      number: 22, position: 'C',  teamId: 't4', teamInitial: 'RA', teamName: 'Falcons', role: 'Defensive POY'  },
  { id: 'rv4', name: 'Jaylen Reeves', number: 7,  position: 'PG', teamId: 't2', teamInitial: 'WC', teamName: 'Hawks',   role: 'Rising star'    },
];

export type Persona = 'player' | 'parent' | 'fan' | 'coach';
