import { dropEditorialCopy, ROSTER_LITE, SEED_GAMES, type Moment } from './_data';

/* Verbatim port: halo-v3.2-glass.html line 9431. */
export const EditorialDropThumb = ({
  moment,
  onClick,
}: {
  moment: Moment;
  onClick?: () => void;
}) => {
  const w = 150;
  const h = Math.round((w * 16) / 9); // ~267 — 25% bigger than md (120w)
  const personId = moment?.personId === 'self' ? 'r1' : moment?.personId;
  const player = personId ? ROSTER_LITE.find((p) => p.id === personId) : null;
  const game = moment?.gameId ? SEED_GAMES.find((g) => g.id === moment.gameId) : null;
  const { title, body } = dropEditorialCopy(moment, game, player);
  const durationStr = moment?.duration != null ? `0:${String(moment.duration).padStart(2, '0')}` : null;

  return (
    <button
      onClick={onClick}
      className="relative shrink-0 overflow-hidden text-left squircle-md lg-aura lg-shine"
      style={{
        width: w,
        height: h,
        background: 'linear-gradient(160deg, var(--card-base-soft-top) 0%, var(--card-base-soft-bot) 100%)',
        border: '1px solid var(--glass-card-border)',
        backdropFilter: 'blur(36px) saturate(180%)',
        WebkitBackdropFilter: 'blur(36px) saturate(180%)',
        boxShadow: 'inset 0 1px 0 var(--glass-card-inset-top), var(--glass-card-shadow)',
      }}
    >
      {/* Cinematic radial bleed */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 30% 25%, rgba(0,214,254,0.25) 0%, transparent 60%),' +
            'radial-gradient(ellipse 80% 60% at 75% 75%, rgba(132,88,255,0.20) 0%, transparent 60%)',
        }}
      />
      {/* Diagonal grain */}
      <div className="absolute inset-0 hatch opacity-40" />
      {durationStr && (
        <div className="absolute top-2.5 left-2.5 lg-glass-strong squircle-sm px-2 py-0.5 z-10">
          <span className="sf text-[9.5px] font-semibold leading-none text-white tabular-nums tracking-tight">
            {durationStr}
          </span>
        </div>
      )}
      {/* Play glyph centered */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="w-12 h-12 rounded-full lg-glass-strong flex items-center justify-center">
          <svg
            width={14}
            height={16}
            viewBox="0 0 12 14"
            fill="currentColor"
            className="text-white ml-0.5"
            aria-hidden="true"
          >
            <path d="M0 1.2v11.6c0 .9 1 1.4 1.7 1l9.6-5.8c.7-.4.7-1.5 0-1.9L1.7.2C1 -.2 0 .3 0 1.2z" />
          </svg>
        </div>
      </div>
      {/* Bottom info */}
      <div
        className="absolute bottom-0 inset-x-0 px-3 pt-12 pb-3 z-10"
        style={{
          background:
            'linear-gradient(180deg, var(--bottom-fade-start) 0%, var(--bottom-fade-mid) 60%, var(--bottom-fade-end) 100%)',
        }}
      >
        <div className="sf-display text-white text-[13px] font-bold leading-tight tracking-[-0.01em] mb-1">
          {title}
        </div>
        <div className="sf text-white/70 text-[10.5px] leading-snug clip2">{body}</div>
      </div>
    </button>
  );
};
