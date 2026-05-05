import { useEffect, useState } from 'react';
import { cls } from '@/lib/cls';

export type CircleKind = 'self' | 'team' | 'player';

export interface IdentityCircleProps {
  kind: CircleKind;
  /** Avatar fallback chain (highest to lowest priority):
   *    src        → image (team logo from CMS, player profile pic from upload)
   *    [auto]     → gray silhouette (kind='player' && isClaimed=true && no src)
   *    jersey     → big jersey number (typically unclaimed players)
   *    initial    → letter (legacy / team without logo)
   *    undefined  → skeleton (treats missing avatar prop as "still loading") */
  avatar?: { src?: string; jersey?: number; initial?: string };
  /** Sub-circle bottom-right — player kind only. Same fallback chain
   *  (src for team logo, initial as fallback). */
  team?: { src?: string; initial?: string };
  label: string;
  isClaimed?: boolean;
  isNew?: boolean;
  liveGame?: { gameId: string };
  onClick?: () => void;
}

/* Verbatim port: halo-v3.2-glass.html line 8064.
   May 2026 alignment pass — fixes from /design:design-system-management
   audit:
     1. Label slot is fixed-height container so LIVE pill / text don't
        shift the row's vertical rhythm.
     2. Ring padding constant at 2.5; live state no longer mutates it
        (extra glow lives in lg-circle-live-pulse instead).
     3. Crest sits flush at bottom-right=0 inside the bounding box.
     4. New-content dot anchored at top:2px / left:2px so the canvas-bg
        halo bites the gradient ring symmetrically instead of overlapping.
     5. Label width clamped to 64px (= ring width) so truncation reads
        centered under the ring.
     6. All four avatar branches (image, silhouette, jersey, initial)
        share an absolute-fill flex-center positioning model so failed
        images fall back without reflowing layout.
     7. Silhouette downsized 60% → 56% to optically match letter/jersey.
     8. Initial size scales by char count: 1 char → 18px, 2 → 15px.
     9. Unclaimed dim is on the ring only, not the label — keeps label
        contrast against canvas.
    10. focus-visible ring on the button (a11y).
    11. aria-label on the button (a11y).
    12. Defensive `?` fallback replaced with skeleton — undefined avatar
        is treated as "still loading", which is the realistic case. */
export const IdentityCircle = ({
  kind,
  avatar,
  team,
  label,
  isClaimed,
  isNew,
  liveGame,
  onClick,
}: IdentityCircleProps) => {
  const isLive = kind === 'team' && !!liveGame;
  const isUnclaimed = kind === 'player' && isClaimed === false;
  const isClaimedPlayer = kind === 'player' && isClaimed === true;

  /* May 2026 Option-C ring tiering — replace the busy multi-color conic
     with a calm solid cyan ring that reads as brand without competing
     with the avatar inside. Unclaimed swaps to a dashed cyan border.

     Architecture note: we use `border` (not background+padding) because
     `lg-glass-card` is translucent with backdrop-filter blur, so any
     ring bg painted underneath the glass disc bleeds through wherever
     there's no opaque image (silhouette, jersey, initial branches).
     A real CSS border avoids the bleed entirely. */
  const ringColor = isLive
    ? 'var(--state-live)'
    : isUnclaimed
    ? 'rgba(0, 214, 254, 0.55)' // softer cyan for the dashed signal
    : 'var(--brand-cyan)';

  const ringStyle = isUnclaimed ? 'dashed' : 'solid';
  const ringWidth = isLive ? 3 : isUnclaimed ? 1.75 : 2.5;

  return (
    <button
      onClick={onClick}
      aria-label={isLive ? `${label}, live now` : label}
      className="shrink-0 flex flex-col items-center gap-1.5 lg-aura rounded-full focus-visible:outline-2 focus-visible:outline-offset-2"
      style={{ outlineColor: 'var(--brand-cyan)' }}
    >
      <div
        className={cls('relative w-[64px] h-[64px] rounded-full', isLive && 'lg-circle-live-pulse')}
        style={{
          /* Solid border instead of bg+padding — see ringColor block above */
          border: `${ringWidth}px ${ringStyle} ${ringColor}`,
          boxSizing: 'border-box',
          background: 'transparent',
          /* FIX #9: dim the ring only when unclaimed; label stays full-color. */
          opacity: isUnclaimed ? 0.85 : 1,
        }}
      >
        <div
          className={cls(
            'relative w-full h-full rounded-full overflow-hidden',
            kind === 'team' ? 'lg-glass-strong' : 'lg-glass-card',
          )}
          style={{ color: 'var(--text-primary)' }}
        >
          <AvatarContent
            src={avatar?.src}
            jersey={avatar?.jersey}
            initial={avatar?.initial}
            isClaimedPlayer={isClaimedPlayer}
            avatarUndefined={!avatar}
          />
        </div>

        {/* New content dot — top-LEFT so it sits diagonally opposite the
            bottom-right crest (no collision when player has both new
            content + a team crest). Floats outside the ring on canvas
            so the halo border reads. */}
        {isNew && !isLive && (
          <div
            className="absolute rounded-full"
            title="New highlights"
            style={{
              top: -2,
              left: -2,
              width: 14,
              height: 14,
              background: 'var(--brand-cyan)',
              boxShadow:
                '0 0 14px var(--brand-cyan-glow), 0 1px 3px rgba(0,0,0,0.40)',
              border: '2px solid var(--canvas-bg)',
            }}
          />
        )}

        {/* Team crest — bottom-right inside the bounding box (no overhang).
            May 2026 polish: thicker border (2px), drop-shadow halo so the
            crest visually detaches from the ring instead of bleeding into it. */}
        {kind === 'player' && team && (
          <div
            className="absolute rounded-full overflow-hidden flex items-center justify-center"
            style={{
              bottom: 0,
              right: 0,
              width: 'var(--crest-size)',
              height: 'var(--crest-size)',
              background: 'var(--canvas-bg-soft)',
              border: '2px solid var(--canvas-bg)',
              color: 'var(--text-primary)',
              fontSize: '8.5px',
              fontWeight: 800,
              letterSpacing: '0.02em',
              boxShadow:
                'inset 0 1px 0 var(--glass-card-inset-top), 0 3px 8px -2px rgba(0,0,0,0.50)',
            }}
          >
            {team.src ? (
              <CrestImage src={team.src} fallback={team.initial} />
            ) : (
              team.initial
            )}
          </div>
        )}
      </div>

      {/* Label slot — fixed-height container so the LIVE pill and the
          text label sit on identical baselines across a mixed row. */}
      <div className="h-[14px] flex items-center justify-center" style={{ minWidth: 0 }}>
        {isLive ? (
          <div className="live-red squircle-sm px-1.5 py-0.5 inline-flex items-center gap-1">
            <div
              className="w-1.5 h-1.5 rounded-full bg-white anim-pulse-dot"
              style={{ boxShadow: '0 0 4px rgba(255,255,255,0.95)', flexShrink: 0 }}
            />
            <span
              className="sf text-[8.5px] font-bold tracking-[0.18em] uppercase leading-none"
              style={{ color: '#FFF' }}
            >
              LIVE
            </span>
          </div>
        ) : (
          <span
            className="sf text-[11px] font-semibold max-w-[64px] text-center leading-tight truncate block"
            style={{ color: 'var(--text-secondary)' }}
          >
            {label}
          </span>
        )}
      </div>
    </button>
  );
};

/* === AvatarContent ===
   All four branches use the same absolute-fill flex-center positioning
   model so a failed image fallback doesn't reflow the layout.

   Decision tree:
     0. avatar prop missing  → skeleton (treat as "still loading")
     1. src given            → <img> (skeleton while loading, fallback on error)
     2. claimed player       → silhouette icon
     3. jersey given         → big jersey number
     4. initial given        → letter (size by char count)
     5. defensive            → skeleton (was '?', looked like a bug) */
const AvatarContent = ({
  src,
  jersey,
  initial,
  isClaimedPlayer,
  avatarUndefined,
}: {
  src?: string;
  jersey?: number;
  initial?: string;
  isClaimedPlayer: boolean;
  avatarUndefined: boolean;
}) => {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  /* Reset load state when the src changes (e.g. story arg flip). */
  useEffect(() => {
    setLoaded(false);
    setErrored(false);
  }, [src]);

  // 0. avatar prop entirely missing → skeleton
  if (avatarUndefined) {
    return <div className="absolute inset-0 lg-avatar-skeleton" aria-hidden="true" />;
  }

  // 1. Image branch
  if (src && !errored) {
    return (
      <>
        {!loaded && (
          /* Gemini-style colored skeleton drifting underneath. */
          <div className="absolute inset-0 lg-avatar-skeleton" aria-hidden="true" />
        )}
        <img
          src={src}
          alt=""
          onLoad={() => setLoaded(true)}
          onError={() => {
            setErrored(true);
            // eslint-disable-next-line no-console
            console.warn('[IdentityCircle] avatar image failed to load:', src);
          }}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: loaded ? 1 : 0, transition: 'opacity 240ms ease' }}
        />
      </>
    );
  }

  // 2. Silhouette — claimed player without a pic (or after image error)
  if (isClaimedPlayer) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <SilhouetteAvatar />
      </div>
    );
  }

  // 3. Jersey number — typically unclaimed players
  if (jersey != null) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="sf-display font-bold tabular-nums text-[17px] leading-none tracking-[-0.02em]">
          #{jersey}
        </span>
      </div>
    );
  }

  // 4. Initial letter — team or legacy. Size scales with char count
  //    so 1-char ('T') and 2-char ('EP') match optical weight.
  if (initial) {
    const sizeClass = initial.length > 1 ? 'text-[15px]' : 'text-[18px]';
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`sf-display font-bold ${sizeClass} leading-none`}>{initial}</span>
      </div>
    );
  }

  // 5. Defensive — avatar object given but empty. Skeleton beats '?'.
  return <div className="absolute inset-0 lg-avatar-skeleton" aria-hidden="true" />;
};

/* Apple-Contacts-style monochrome silhouette. Sized at 56% of the
   inner disc to optically match the letter/jersey siblings. */
const SilhouetteAvatar = () => (
  <svg
    width={32}
    height={32}
    viewBox="0 0 32 32"
    fill="none"
    aria-hidden="true"
    style={{ width: '56%', height: '56%', display: 'block', color: 'var(--text-tertiary)' }}
  >
    <circle cx={16} cy={11} r={5.5} fill="currentColor" />
    <path
      d="M5 30 c0 -6 5 -10 11 -10 s11 4 11 10"
      fill="currentColor"
    />
  </svg>
);

/* Crest sub-circle image with graceful fallback to text initial.
   Same shimmer + onError pattern as the main avatar but at smaller size. */
const CrestImage = ({ src, fallback }: { src: string; fallback?: string }) => {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  if (errored && fallback) {
    return <>{fallback}</>;
  }

  return (
    <>
      {!loaded && !errored && (
        <div className="absolute inset-0 lg-avatar-skeleton rounded-full" aria-hidden="true" />
      )}
      <img
        src={src}
        alt=""
        onLoad={() => setLoaded(true)}
        onError={() => setErrored(true)}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: loaded ? 1 : 0, transition: 'opacity 240ms ease' }}
      />
    </>
  );
};
