/* GameCardError — fallback variant when drop generation fails or the
   home request errors out. NOT in v3.2 prototype; invented to match the
   visual language: same squircle-md surface, neutral (no cyan ember
   because nothing positive is happening), warm desaturated tint instead
   of the cool reward cyan, friendly copy, cyan "Report a bug" text link. */

export interface GameCardErrorProps {
  onRetry?: () => void;
  onReport?: () => void;
}

export const GameCardError = ({ onRetry, onReport }: GameCardErrorProps) => (
  <div
    className="relative squircle-md overflow-hidden"
    style={{
      background:
        'radial-gradient(ellipse 55% 60% at 22% 28%, rgba(255,170,90,0.10) 0%, transparent 60%),' +
        'radial-gradient(ellipse 50% 60% at 80% 78%, rgba(255,255,255,0.04) 0%, transparent 60%),' +
        'linear-gradient(180deg, var(--card-base-soft-top) 0%, var(--card-base-soft-bot) 100%)',
      border: '1px solid var(--glass-card-border)',
      backdropFilter: 'blur(36px) saturate(180%)',
      WebkitBackdropFilter: 'blur(36px) saturate(180%)',
      boxShadow: 'inset 0 1px 0 var(--glass-card-inset-top), var(--glass-card-shadow)',
    }}
  >
    <div
      className="relative z-10 px-4 pt-3 pb-2 flex items-center justify-between"
      style={{ borderBottom: '1px solid var(--hairline)' }}
    >
      <div className="flex items-center gap-2">
        <svg
          width={14}
          height={14}
          viewBox="0 0 14 14"
          fill="none"
          stroke="rgba(255,170,90,0.95)"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ width: 14, height: 14, display: 'block' }}
        >
          <path d="M7 1 L13 12 L1 12 Z" />
          <path d="M7 5 L7 8" />
          <path d="M7 10 L7 10.5" />
        </svg>
        <span
          className="sf text-[10px] font-bold tracking-[0.14em] uppercase"
          style={{ color: 'rgba(255,170,90,0.95)' }}
        >
          WE HIT A SNAG
        </span>
      </div>
      <span
        className="sf text-[10px] font-bold tracking-[0.14em] uppercase"
        style={{ color: 'var(--text-tertiary)' }}
      >
        OFFLINE
      </span>
    </div>

    <div className="relative z-10 p-4 pb-3">
      <div
        className="sf-display text-[17px] font-bold tracking-[-0.01em] leading-tight mb-1"
        style={{ color: 'var(--text-primary)' }}
      >
        Couldn't load your drop
      </div>
      <div className="sf text-[12.5px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        Something went wrong on our end. We'll keep trying — or you can give it a kick.
      </div>
    </div>

    <div className="relative z-10 px-4 pb-4 flex items-center justify-between gap-3">
      <button
        onClick={onRetry}
        className="lg-glass squircle-sm px-3 py-2 sf text-[11.5px] font-semibold flex items-center gap-1.5"
        style={{ color: 'var(--text-primary)' }}
      >
        <svg
          width={11}
          height={11}
          viewBox="0 0 14 14"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ width: 11, height: 11, display: 'block' }}
        >
          <path d="M2 7 a5 5 0 1 0 1.5 -3.5" />
          <path d="M2 1 L2 4 L5 4" />
        </svg>
        <span>Try again</span>
      </button>
      <button
        onClick={onReport}
        className="sf text-[11.5px] font-semibold flex items-center gap-1"
        style={{ color: 'var(--brand-cyan-text)' }}
      >
        <span>Report a bug</span>
        <span className="text-[14px] leading-none icon-flip-rtl">›</span>
      </button>
    </div>
  </div>
);
