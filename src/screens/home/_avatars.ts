/* Sample team logos + player portraits.
   These stand in for what production will load from the company CMS
   (team logos) and from user uploads (player profile pics). The
   IdentityCircle takes a regular URL prop, so swapping these to real
   S3 / CMS URLs is zero-touch.

   May 2026 Option-B pass: portraits are now hotlinked to randomuser.me
   (real stock-photo headshots, no API key, stable URLs) so the demo
   row reads as a real product instead of a wireframe. Team logos
   stayed inline-SVG but were upgraded with multi-stop gradients,
   inner glow, and a shine line so they look "designed" rather than
   "placeholder monogram." */

/* === Premium team logo factory ===
   Generates a 128×128 SVG with:
     - Radial gradient disc (highlight + mid + shadow, hue-rotated)
     - Bold sans-serif monogram with subtle text-shadow inset
     - Diagonal "shine" stripe across the top quadrant
     - Inset stroke for bezel feel
   Renders crisply at any size — IdentityCircle clips to 64×64. */
export const teamLogo = (initial: string, hue: number): string => {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 128 128'>
    <defs>
      <radialGradient id='disc' cx='32%25' cy='28%25' r='75%25'>
        <stop offset='0%25' stop-color='hsl(${hue},92%25,72%25)'/>
        <stop offset='55%25' stop-color='hsl(${hue},80%25,48%25)'/>
        <stop offset='100%25' stop-color='hsl(${hue},75%25,22%25)'/>
      </radialGradient>
      <linearGradient id='shine' x1='0%25' y1='0%25' x2='100%25' y2='100%25'>
        <stop offset='0%25' stop-color='white' stop-opacity='0.42'/>
        <stop offset='45%25' stop-color='white' stop-opacity='0.06'/>
        <stop offset='100%25' stop-color='white' stop-opacity='0'/>
      </linearGradient>
      <radialGradient id='innerGlow' cx='50%25' cy='50%25' r='60%25'>
        <stop offset='60%25' stop-color='black' stop-opacity='0'/>
        <stop offset='100%25' stop-color='black' stop-opacity='0.32'/>
      </radialGradient>
    </defs>
    <circle cx='64' cy='64' r='62' fill='url(%23disc)'/>
    <path d='M 6 50 Q 60 -10 122 28 L 122 8 Q 60 -22 6 24 Z' fill='url(%23shine)'/>
    <circle cx='64' cy='64' r='62' fill='url(%23innerGlow)'/>
    <text x='64' y='82' text-anchor='middle' font-family='-apple-system,SF Pro Display,Inter,sans-serif' font-weight='900' font-size='${initial.length > 1 ? 46 : 56}' fill='white' letter-spacing='-1.2' style='filter: drop-shadow(0 2px 3px rgba(0,0,0,0.35));'>${initial}</text>
    <circle cx='64' cy='64' r='62' fill='none' stroke='rgba(255,255,255,0.18)' stroke-width='1.5'/>
  </svg>`;
  return `data:image/svg+xml;utf8,${svg.replace(/\n/g, '').replace(/\s{2,}/g, ' ').trim()}`;
};

/* Pre-baked logos for the 5 most-referenced teams. Rest fall back to
   the initial letter rendering. */
export const TEAM_LOGOS = {
  EP: teamLogo('EP', 195),  // cyan — Eagles Prep
  LH: teamLogo('LH', 270),  // purple — Lincoln High
  WC: teamLogo('WC', 30),   // amber — West Coast
  NA: teamLogo('NA', 145),  // green — North Academy
  MH: teamLogo('MH', 0),    // red — Mountain High
};

/* === Player portraits ===
   Real stock-photo headshots from randomuser.me. Free, no API key,
   stable URLs, varied demographics. Each one is 128×128 jpeg of a
   distinct person against a soft outdoor or studio background — looks
   like actual user-uploaded profile pics, which is the whole point of
   Option B (premium feel, not synthetic).

   Production swap: replace each URL with the player's uploaded pic from
   S3. The IdentityCircle's <img> + skeleton + onError fallback already
   handles slow loads and broken URLs gracefully. */
export const SAMPLE_PORTRAITS = {
  /* Tal (self) — male teen athlete, light skin, neutral background */
  tal:    'https://randomuser.me/api/portraits/men/32.jpg',
  /* Sarah — female teen, varied background */
  sarah:  'https://randomuser.me/api/portraits/women/44.jpg',
  /* Dylan — male teen */
  dylan:  'https://randomuser.me/api/portraits/men/52.jpg',
  /* Marcus — male teen, darker skin */
  marcus: 'https://randomuser.me/api/portraits/men/68.jpg',
};
