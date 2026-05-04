import { cls } from '@/lib/cls';

export type CircleKind = 'self' | 'team' | 'player';

export interface IdentityCircleProps {
  kind: CircleKind;
  avatar?: { src?: string; jersey?: number; initial?: string };
  team?: { src?: string; initial?: string };
  label: string;
  isClaimed?: boolean;
  isNew?: boolean;
  liveGame?: { gameId: string };
  onClick?: () => void;
}

/* Verbatim port: halo-v3.2-glass.html line 8064. */
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
  const innerNode = avatar?.src ? (
    <img src={avatar.src} alt="" className="w-full h-full rounded-full object-cover" />
  ) : avatar?.jersey != null ? (
    <span className="sf-display font-bold tabular-nums text-[17px] leading-none tracking-[-0.02em]">
      #{avatar.jersey}
    </span>
  ) : (
    <span className="sf-display font-bold text-[15px] leading-none">
      {avatar?.initial || '?'}
    </span>
  );

  const isUnclaimed = kind === 'player' && isClaimed === false;
  const ringBg = isLive
    ? 'var(--state-live)'
    : isUnclaimed
    ? 'repeating-conic-gradient(from 220deg, #00D6FE 0deg 12deg, transparent 12deg 30deg, #8458FF 30deg 42deg, transparent 42deg 60deg, #FF5A9E 60deg 72deg, transparent 72deg 90deg)'
    : 'conic-gradient(from 220deg, #00D6FE, #8458FF, #FF5A9E, #00D6FE)';

  return (
    <button
      onClick={onClick}
      className="shrink-0 flex flex-col items-center gap-1.5 lg-aura"
      style={isUnclaimed ? { opacity: 0.75 } : undefined}
    >
      <div
        className={cls('relative w-[64px] h-[64px] rounded-full', isLive && 'lg-circle-live-pulse')}
        style={{ background: ringBg, padding: isLive ? 3 : 2.5 }}
      >
        <div
          className={cls(
            'w-full h-full rounded-full flex items-center justify-center overflow-hidden',
            kind === 'team' ? 'lg-glass-strong' : 'lg-glass-card',
          )}
          style={{ color: 'var(--text-primary)' }}
        >
          {innerNode}
        </div>

        {/* New content dot — top-left */}
        {isNew && !isLive && (
          <div
            className="absolute top-0 left-0 w-3.5 h-3.5 rounded-full"
            title="New highlights"
            style={{
              background: 'var(--brand-cyan)',
              boxShadow: '0 0 10px var(--brand-cyan-glow)',
              border: '1.5px solid var(--canvas-bg)',
            }}
          />
        )}

        {/* Team crest — bottom-right, player kind only */}
        {kind === 'player' && team && (
          <div
            className="absolute -bottom-0.5 -right-0.5 rounded-full flex items-center justify-center overflow-hidden"
            style={{
              width: 'var(--crest-size)',
              height: 'var(--crest-size)',
              background: 'var(--canvas-bg-soft)',
              border: '1.5px solid var(--crest-border)',
              color: 'var(--text-primary)',
              fontSize: '8.5px',
              fontWeight: 800,
              letterSpacing: '0.02em',
              boxShadow: 'inset 0 1px 0 var(--glass-card-inset-top), 0 2px 6px -2px rgba(0,0,0,0.20)',
            }}
          >
            {team.src ? (
              <img src={team.src} alt="" className="w-full h-full rounded-full object-cover" />
            ) : (
              team.initial
            )}
          </div>
        )}
      </div>

      {/* Label — LIVE pill replaces text when team is live */}
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
          className="sf text-[10.5px] font-medium max-w-[68px] text-center leading-tight truncate block"
          style={{ color: 'var(--text-secondary)' }}
        >
          {label}
        </span>
      )}
    </button>
  );
};
