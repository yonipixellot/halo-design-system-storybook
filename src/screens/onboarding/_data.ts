/* Mock data — subset of prototype's TEAMS_DB / ROSTER / PERSONAS so the
   onboarding screens render with realistic content. */

export const TEAMS_DB = [
  { id: 't1',  name: 'Varsity',   name_he: 'ורסיטי',     org: 'Eastside Prep',       org_he: 'איסטסייד פרפ',       division: 'U18', initial: 'EP', claimCode: 'varsity-eastside-2026' },
  { id: 't2',  name: 'Girls JV',  name_he: "ג'יי-וי בנות", org: 'Eastside Prep',     org_he: 'איסטסייד פרפ',       division: 'U16', initial: 'EP', claimCode: 'girls-jv-eastside-2026' },
  { id: 't3',  name: 'Tigers',    name_he: 'הנמרים',     org: 'Lincoln High',        org_he: 'לינקולן היי',         division: 'U18', initial: 'LH', claimCode: 'tigers-lincoln-2026' },
  { id: 't4',  name: 'Wolves',    name_he: 'הזאבים',     org: 'Northside Academy',   org_he: 'נורת׳סייד אקדמי',    division: 'U16', initial: 'NA', claimCode: 'wolves-northside-2026' },
  { id: 't5',  name: 'Hawks',     name_he: 'הנצים',      org: 'Westfield Catholic',  org_he: 'וסטפילד קתולי',       division: 'U14', initial: 'WC', claimCode: 'hawks-westfield-2026' },
  { id: 't6',  name: 'Bears',     name_he: 'הדובים',     org: 'Madison Heights',     org_he: 'מדיסון הייטס',        division: 'U14', initial: 'MH', claimCode: 'bears-madison-2026' },
  { id: 't7',  name: 'Falcons',   name_he: 'הבזים',      org: 'Riverside Academy',   org_he: 'ריברסייד אקדמי',     division: 'U14', initial: 'RA', claimCode: 'falcons-riverside-2026' },
  { id: 't8',  name: 'Spartans',  name_he: 'הספרטנים',   org: 'Oakwood Prep',        org_he: 'אוקווד פרפ',          division: 'U18', initial: 'OP', claimCode: 'spartans-oakwood-2026' },
  { id: 't9',  name: 'Knights',   name_he: 'האבירים',    org: 'Saint Marks',         org_he: 'סנט מארקס',           division: 'U14', initial: 'SM', claimCode: 'knights-saintmarks-2026' },
  { id: 't10', name: 'Pioneers',  name_he: 'החלוצים',    org: 'Cedar Valley',        org_he: 'סידר ואלי',           division: 'U14', initial: 'CV', claimCode: 'pioneers-cedarvalley-2026' },
  { id: 't11', name: 'Raptors',   name_he: 'הראפטורים',  org: 'Bayview Charter',     org_he: 'ביי-ויו צ׳רטר',        division: 'U14', initial: 'BC', claimCode: 'raptors-bayview-2026' },
  { id: 't12', name: 'Cyclones',  name_he: 'הסופות',     org: 'Hilltop Academy',     org_he: 'הילטופ אקדמי',         division: 'U14', initial: 'HA', claimCode: 'cyclones-hilltop-2026' },
  { id: 't13', name: 'Comets',    name_he: 'השביטים',    org: 'Northgate High',      org_he: 'נורת׳גייט היי',         division: 'U14', initial: 'NH', claimCode: 'comets-northgate-2026' },
  { id: 't14', name: 'Mustangs',  name_he: 'המוסטנגים',  org: 'Briarcliff Prep',     org_he: 'בריארקליף פרפ',        division: 'U14', initial: 'BP', claimCode: 'mustangs-briarcliff-2026' },
  /* Girls/women variants — added May 2026 to populate the women's leagues. */
  { id: 't15', name: 'Lady Eagles',  name_he: 'הנשרות',    org: 'Eastside Prep',     org_he: 'איסטסייד פרפ',       division: 'U18', initial: 'EP', claimCode: 'lady-eagles-eastside-2026' },
  { id: 't16', name: 'Lady Tigers',  name_he: 'נשות הנמרים', org: 'Lincoln High',    org_he: 'לינקולן היי',         division: 'U18', initial: 'LH', claimCode: 'lady-tigers-lincoln-2026' },
  { id: 't17', name: 'Sparrows',     name_he: 'הדרורים',   org: 'Westfield Catholic',org_he: 'וסטפילד קתולי',       division: 'U14', initial: 'WC', claimCode: 'sparrows-westfield-2026' },
  { id: 't18', name: 'Lady Bears',   name_he: 'הדובות',    org: 'Madison Heights',   org_he: 'מדיסון הייטס',        division: 'U14', initial: 'MH', claimCode: 'lady-bears-madison-2026' },
];

/* === LEAGUES — May 2026 ===
   The accordion in TeamsStep groups TEAMS_DB by league. A team can appear
   in multiple leagues (regular season + tournaments — see Pixellot Cup).
   `teamIds` is the source of truth; the accordion just resolves them
   against TEAMS_DB at render time. */
export interface League {
  id: string;
  name: string;
  name_he?: string;
  /** Optional subtitle shown small under the name on the header. */
  sub?: string;
  sub_he?: string;
  teamIds: string[];
}
export const LEAGUES: League[] = [
  {
    id: 'l-mens-varsity',
    name: "Men's Varsity",
    name_he: 'ורסיטי גברים',
    sub: 'Top-tier boys',
    sub_he: 'בנים בליגה הבכירה',
    teamIds: ['t1', 't3', 't8'],
  },
  {
    id: 'l-womens-varsity',
    name: "Women's Varsity",
    name_he: 'ורסיטי נשים',
    sub: 'Top-tier girls',
    sub_he: 'בנות בליגה הבכירה',
    teamIds: ['t2', 't15', 't16'],
  },
  {
    id: 'l-boys-u16',
    name: 'Boys U16',
    name_he: 'בנים עד גיל 16',
    teamIds: ['t4'],
  },
  {
    id: 'l-boys-u14',
    name: 'Boys U14',
    name_he: 'בנים עד גיל 14',
    teamIds: ['t5', 't6', 't7', 't9', 't10', 't11', 't12', 't13', 't14'],
  },
  {
    id: 'l-girls-u14',
    name: 'Girls U14',
    name_he: 'בנות עד גיל 14',
    teamIds: ['t17', 't18'],
  },
  {
    id: 'l-pixellot-cup',
    name: 'Pixellot Cup',
    name_he: 'גביע פיקסלוט',
    sub: 'Open invitational tournament',
    sub_he: 'גביע פתוח להזמנה',
    teamIds: ['t1', 't3', 't15'],
  },
];

export const ROSTER = [
  /* Varsity (t1) */
  { id: 'r1',  name: 'Tal Weiss',      name_he: 'טל וייס',       number: 7,  position: 'SG', teamId: 't1',  claimed: false },
  { id: 'r2',  name: 'Sarah Kim',      name_he: 'שרה קים',       number: 12, position: 'PG', teamId: 't1',  claimed: true  },
  { id: 'r3',  name: 'Dylan Torres',   name_he: 'דילן טורס',      number: 23, position: 'SF', teamId: 't1',  claimed: true  },
  { id: 'r4',  name: 'Marcus Johnson', name_he: 'מרקוס ג׳ונסון',  number: 5,  position: 'C',  teamId: 't1',  claimed: false },
  { id: 'r5',  name: 'Jalen Wright',   name_he: 'ג׳יילן רייט',     number: 11, position: 'PF', teamId: 't1',  claimed: false },
  { id: 'r6',  name: 'Alex Chen',      name_he: 'אלכס צ׳ן',       number: 3,  position: 'SG', teamId: 't1',  claimed: false },

  /* Tigers / Lincoln High (t3) */
  { id: 'r7',  name: 'Ethan Vargas',   name_he: 'איתן ורגאס',     number: 9,  position: 'PG', teamId: 't3',  claimed: false },
  { id: 'r8',  name: 'Caleb Park',     name_he: 'קיילב פארק',     number: 14, position: 'SG', teamId: 't3',  claimed: false },
  { id: 'r9',  name: 'Devon Hayes',    name_he: 'דבון הייז',      number: 11, position: 'SF', teamId: 't3',  claimed: true  },
  { id: 'r10', name: 'Noah Brooks',    name_he: 'נועם ברוקס',     number: 25, position: 'PF', teamId: 't3',  claimed: false },
  { id: 'r11', name: 'Theo Anderson',  name_he: 'תיאו אנדרסון',   number: 4,  position: 'C',  teamId: 't3',  claimed: false },

  /* Wolves / Northside Academy (t4) */
  { id: 'r12', name: 'Ryan Foster',    name_he: 'ריאן פוסטר',     number: 6,  position: 'PG', teamId: 't4',  claimed: false },
  { id: 'r13', name: 'Theo Lin',       name_he: 'תיאו לין',        number: 22, position: 'C',  teamId: 't4',  claimed: true  },
  { id: 'r14', name: 'Owen Mitchell',  name_he: 'אוון מיטשל',      number: 8,  position: 'SF', teamId: 't4',  claimed: false },
  { id: 'r15', name: 'Lucas Reed',     name_he: 'לוקאס ריד',       number: 13, position: 'SG', teamId: 't4',  claimed: false },

  /* Spartans / Oakwood Prep (t8) */
  { id: 'r16', name: 'Mason Carter',   name_he: 'מייסון קרטר',    number: 1,  position: 'PG', teamId: 't8',  claimed: false },
  { id: 'r17', name: 'Kai Sullivan',   name_he: 'קאי סאליבן',     number: 17, position: 'SF', teamId: 't8',  claimed: false },
  { id: 'r18', name: 'Andre Whitfield',name_he: 'אנדרה ויטפילד',  number: 24, position: 'PF', teamId: 't8',  claimed: true  },
  { id: 'r19', name: 'Jordan Pierce',  name_he: 'ג׳ורדן פירס',     number: 32, position: 'C',  teamId: 't8',  claimed: false },

  /* Lady Eagles / Eastside Prep (t15) */
  { id: 'r20', name: 'Maya Robinson',  name_he: 'מאיה רובינסון',  number: 10, position: 'PG', teamId: 't15', claimed: true  },
  { id: 'r21', name: 'Zoe Patel',      name_he: 'זואי פאטל',      number: 8,  position: 'SG', teamId: 't15', claimed: false },
  { id: 'r22', name: 'Nora Jensen',    name_he: 'נורה ג׳נסן',      number: 21, position: 'SF', teamId: 't15', claimed: false },
  { id: 'r23', name: 'Olivia Hart',    name_he: 'אוליביה הארט',   number: 33, position: 'C',  teamId: 't15', claimed: false },

  /* Hawks / Westfield Catholic (t5) — slim roster */
  { id: 'r24', name: 'Eli Kowalski',   name_he: 'אלי קובלסקי',    number: 7,  position: 'SG', teamId: 't5',  claimed: false },
  { id: 'r25', name: 'Diego Morales',  name_he: 'דייגו מוראלס',   number: 19, position: 'PF', teamId: 't5',  claimed: false },

  /* Sparrows / Westfield Catholic (t17) — slim roster */
  { id: 'r26', name: 'Iris Tanaka',    name_he: 'איריס טנאקה',    number: 5,  position: 'PG', teamId: 't17', claimed: false },
  { id: 'r27', name: 'Lila Greenfield',name_he: 'לילה גרינפילד',  number: 14, position: 'SF', teamId: 't17', claimed: false },
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
