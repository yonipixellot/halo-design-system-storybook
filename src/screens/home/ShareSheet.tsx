import { useState } from 'react';

/* Cinematic-glass redesign of the prototype's ShareSheet (line 7406).
   The prototype version is still in the pre-glass wireframe (monochrome
   borders, bg-zinc, font-mono) — replaced here to match HighlightViewer.

   Function preserved verbatim:
     • 6 share targets: Copy, Facebook, Instagram, X, TikTok, WhatsApp
     • Hero card with thumbnail + title + subtitle + URL pill
     • Tap target → toast (via onShare callback) → close
     • Backdrop tap also closes
     • "Available platforms vary by tenant + device" footnote */

export interface ShareSheetProps {
  /** Title above the URL pill — e.g. "Tal Weiss · #7" or "Q4 buzzer beater". */
  title: string;
  subtitle?: string;
  url?: string;
  /** Single-character thumbnail glyph (initials, jersey number, etc). */
  thumbnail?: string;
  /** Tapping a target fires this with the target id. */
  onShare?: (targetId: ShareTargetId) => void;
  /** Backdrop tap, X button, or after a target picks. */
  onClose: () => void;
}

export type ShareTargetId = 'copy' | 'facebook' | 'instagram' | 'x' | 'tiktok' | 'whatsapp';

interface ShareTarget {
  key: ShareTargetId;
  label: string;
  /** Inline SVG path data for the target's glyph, drawn at 20×20. */
  glyph: React.ReactNode;
  /** Tile accent color — cyan unless it's a brand-specific target. */
  accent?: string;
}

const TARGETS: ShareTarget[] = [
  {
    key: 'copy',
    label: 'Copy link',
    glyph: (
      <svg width={20} height={20} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20, display: 'block' }}>
        <rect x={3} y={6} width={11} height={11} rx={2} />
        <path d="M6 6 V4 a2 2 0 0 1 2 -2 h7 a2 2 0 0 1 2 2 v7 a2 2 0 0 1 -2 2 h-2" />
      </svg>
    ),
  },
  {
    key: 'facebook',
    label: 'Facebook',
    glyph: (
      <svg width={20} height={20} viewBox="0 0 20 20" fill="currentColor" style={{ width: 20, height: 20, display: 'block' }}>
        <path d="M11.5 18 v-6.7 h2.3 l0.4 -2.7 h-2.7 V6.7 c0 -0.8 0.3 -1.4 1.5 -1.4 h1.4 V2.9 a23 23 0 0 0 -2.1 -0.1 c-2.1 0 -3.5 1.3 -3.5 3.6 v2.2 H6.5 v2.7 h2.3 V18 Z" />
      </svg>
    ),
    accent: '#1877F2',
  },
  {
    key: 'instagram',
    label: 'Instagram',
    glyph: (
      <svg width={20} height={20} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20, display: 'block' }}>
        <rect x={3} y={3} width={14} height={14} rx={4} />
        <circle cx={10} cy={10} r={3.4} />
        <circle cx={14.4} cy={5.6} r={0.6} fill="currentColor" />
      </svg>
    ),
    accent: '#E4405F',
  },
  {
    key: 'x',
    label: 'X',
    glyph: (
      <svg width={20} height={20} viewBox="0 0 20 20" fill="currentColor" style={{ width: 20, height: 20, display: 'block' }}>
        <path d="M11.7 8.5 L17.4 2 h-1.4 L11.1 7.6 L7.2 2 H2.6 l6 8.6 L2.6 18 h1.4 l5.2 -5.9 L13.4 18 h4.6 L11.7 8.5 Z m-1.8 2.1 l-0.6 -0.9 L4.5 3 h2.1 l3.9 5.6 0.6 0.9 5 7.2 h-2.1 l-4.1 -5.9 Z" />
      </svg>
    ),
  },
  {
    key: 'tiktok',
    label: 'TikTok',
    glyph: (
      <svg width={20} height={20} viewBox="0 0 20 20" fill="currentColor" style={{ width: 20, height: 20, display: 'block' }}>
        <path d="M14 2 v3.2 c0.9 0.6 2 1 3.2 1 V9 c-1.1 0 -2.2 -0.3 -3.2 -0.8 V13 a5 5 0 1 1 -5 -5 v3 a2 2 0 1 0 2 2 V2 Z" />
      </svg>
    ),
    accent: '#FF0050',
  },
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    glyph: (
      <svg width={20} height={20} viewBox="0 0 20 20" fill="currentColor" style={{ width: 20, height: 20, display: 'block' }}>
        <path d="M10 2 a8 8 0 0 0 -6.9 12 L2 18 l4.2 -1.1 A8 8 0 1 0 10 2 Z m4.6 11.4 c-0.2 0.5 -1.1 1 -1.5 1.1 -0.4 0 -0.4 0.3 -2.6 -0.6 -2.2 -0.9 -3.5 -3.1 -3.6 -3.3 -0.1 -0.1 -0.9 -1.2 -0.9 -2.3 0 -1.1 0.6 -1.6 0.8 -1.8 0.2 -0.2 0.4 -0.3 0.6 -0.3 h0.4 c0.1 0 0.3 0 0.5 0.4 0.2 0.5 0.6 1.6 0.7 1.7 0 0.1 0.1 0.2 0 0.4 -0.1 0.2 -0.1 0.3 -0.2 0.4 -0.1 0.1 -0.3 0.3 -0.4 0.4 -0.1 0.1 -0.3 0.3 -0.1 0.5 0.2 0.3 0.7 1.1 1.5 1.8 1 0.9 1.9 1.1 2.1 1.2 0.2 0.1 0.4 0.1 0.5 -0.1 0.2 -0.2 0.6 -0.7 0.7 -0.9 0.2 -0.2 0.3 -0.2 0.5 -0.1 0.2 0.1 1.3 0.6 1.5 0.7 0.2 0.1 0.4 0.2 0.4 0.3 0.1 0.1 0.1 0.6 -0.1 1.1 Z" />
      </svg>
    ),
    accent: '#25D366',
  },
];

export const ShareSheet = ({ title, subtitle, url, thumbnail, onShare, onClose }: ShareSheetProps) => {
  /* Brief copied-confirmation state — gives the Copy target a 1.2s feedback
     pulse before firing onShare so the user sees confirmation before the
     sheet dismisses. */
  const [copied, setCopied] = useState(false);

  const pick = (target: ShareTarget) => {
    if (target.key === 'copy') {
      setCopied(true);
      setTimeout(() => {
        onShare?.(target.key);
        onClose();
      }, 700);
      return;
    }
    onShare?.(target.key);
    onClose();
  };

  return (
    <div
      data-theme="dark"
      className="absolute inset-0 z-[60] flex items-end anim-fade lg-keep-dark"
      style={{
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Share"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full anim-slide-sheet relative overflow-hidden"
        style={{
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          background:
            'radial-gradient(ellipse 70% 60% at 25% 20%, rgba(0,214,254,0.18) 0%, transparent 60%),' +
            'radial-gradient(ellipse 70% 60% at 80% 30%, rgba(132,88,255,0.14) 0%, transparent 60%),' +
            'linear-gradient(180deg, var(--card-base-strong-top) 0%, var(--card-base-strong-bot) 100%)',
          backdropFilter: 'blur(48px) saturate(180%)',
          WebkitBackdropFilter: 'blur(48px) saturate(180%)',
          borderTop: '1px solid var(--glass-card-border)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18), 0 -16px 48px -16px rgba(0,0,0,0.6)',
        }}
      >
        {/* Drag handle */}
        <div className="pt-2.5 pb-1 flex items-center justify-center">
          <div
            className="w-10 h-1 rounded-full"
            style={{ background: 'var(--hairline-strong)' }}
          />
        </div>

        {/* Header — eyebrow + close */}
        <div className="px-5 pt-3 pb-3 flex items-center justify-between">
          <span
            className="sf text-[10px] tracking-[0.18em] uppercase font-bold"
            style={{ color: 'var(--brand-cyan-text)' }}
          >
            Share
          </span>
          <button
            onClick={onClose}
            className="w-8 h-8 lg-glass squircle-sm flex items-center justify-center text-white/85"
            aria-label="Close"
          >
            <svg
              width={11}
              height={11}
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              style={{ width: 11, height: 11, display: 'block' }}
            >
              <path d="M3 3 L11 11 M11 3 L3 11" />
            </svg>
          </button>
        </div>

        {/* Hero card — thumbnail + title + subtitle + URL pill */}
        <div className="px-5 pb-4">
          <div
            className="squircle-md p-3 flex items-center gap-3"
            style={{
              background: 'var(--glass-card-bg)',
              border: '1px solid var(--glass-card-border)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              boxShadow: 'inset 0 1px 0 var(--glass-card-inset-top)',
            }}
          >
            <div
              className="w-12 h-12 squircle-sm lg-glass-strong flex items-center justify-center shrink-0"
              style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.30), 0 0 18px -4px rgba(0,214,254,0.40)' }}
            >
              <span
                className="sf-display text-[15px] font-bold tabular-nums text-white"
                style={{ textShadow: '0 0 10px rgba(0,214,254,0.40)' }}
              >
                {thumbnail || (title ? title[0] : '↗')}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="sf-display text-[14px] font-bold text-white leading-tight tracking-[-0.005em] truncate">
                {title}
              </div>
              {subtitle && (
                <div className="sf text-[11.5px] text-white/65 leading-relaxed truncate mt-0.5">
                  {subtitle}
                </div>
              )}
              {url && (
                <div className="sf text-[10.5px] tracking-wide text-white/50 truncate mt-0.5 font-mono">
                  {url}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Target grid — 3 columns × 2 rows */}
        <div className="px-5 pb-4 grid grid-cols-3 gap-2.5">
          {TARGETS.map((t) => {
            const isCopy = t.key === 'copy';
            const showConfirmed = isCopy && copied;
            return (
              <button
                key={t.key}
                onClick={() => pick(t)}
                disabled={copied}
                className="squircle-sm py-3.5 flex flex-col items-center gap-1.5 lg-aura"
                style={{
                  background: showConfirmed ? 'var(--brand-cyan-soft)' : 'var(--glass-card-bg)',
                  border: '1px solid ' + (showConfirmed ? 'var(--brand-cyan-border)' : 'var(--glass-card-border)'),
                  backdropFilter: 'blur(20px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                  color: showConfirmed
                    ? 'var(--brand-cyan-text)'
                    : t.accent ?? 'rgba(255,255,255,0.92)',
                  transition: 'all 200ms',
                }}
              >
                <div className="flex items-center justify-center" style={{ height: 22 }}>
                  {showConfirmed ? (
                    <svg
                      width={20}
                      height={20}
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.4}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ width: 20, height: 20, display: 'block' }}
                    >
                      <path d="M4 10 L8 14 L16 6" />
                    </svg>
                  ) : (
                    t.glyph
                  )}
                </div>
                <span
                  className="sf text-[10px] tracking-[0.10em] uppercase font-bold"
                  style={{ color: showConfirmed ? 'var(--brand-cyan-text)' : 'rgba(255,255,255,0.85)' }}
                >
                  {showConfirmed ? 'Copied' : t.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Footnote */}
        <div className="px-5 pb-6">
          <p
            className="sf text-[10.5px] text-center"
            style={{ color: 'var(--text-faint)' }}
          >
            Available platforms vary by tenant + device.
          </p>
        </div>
      </div>
    </div>
  );
};
