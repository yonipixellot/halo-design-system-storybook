/* Verbatim port: halo-v3.2-glass.html line 6244-6300.
   Step 3 onboarding card for player persona who has NOT yet come from a
   deep link. Per Yam's spec: no in-app claim entry — the link must come
   from the coach. The URL pill is a demo shortcut that simulates the
   deep link landing them on ClaimPage. */

export interface ClaimAthleteExplainerProps {
  /** Tap the demo URL pill — wire to your claim-page trigger. */
  onClaim?: (teamCode: string) => void;
}

export const ClaimAthleteExplainer = ({ onClaim }: ClaimAthleteExplainerProps) => (
  <div className="anim-fade">
    <div
      className="squircle-md p-5"
      style={{
        background: 'var(--glass-card-bg)',
        backdropFilter: 'blur(36px) saturate(180%)',
        WebkitBackdropFilter: 'blur(36px) saturate(180%)',
        border: '1px solid var(--glass-card-border)',
        boxShadow: 'inset 0 1px 0 var(--glass-card-inset-top), var(--glass-card-shadow)',
      }}
    >
      <div
        className="w-12 h-12 squircle-sm flex items-center justify-center mb-4"
        style={{
          background: 'var(--brand-cyan-soft)',
          border: '1px solid var(--brand-cyan-border)',
          color: 'var(--brand-cyan-text)',
        }}
      >
        <svg
          width={22}
          height={22}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ width: 22, height: 22, display: 'block' }}
        >
          <path d="M9 12 a3 3 0 0 0 4.24 0 l3 -3 a3 3 0 0 0 -4.24 -4.24 l-1 1" />
          <path d="M11 8 a3 3 0 0 0 -4.24 0 l-3 3 a3 3 0 0 0 4.24 4.24 l1 -1" />
        </svg>
      </div>

      <div
        className="sf text-[10px] tracking-[0.18em] uppercase font-bold mb-2"
        style={{ color: 'var(--brand-cyan-text)' }}
      >
        Athlete profile
      </div>
      <div className="sf-display text-[18px] font-bold text-white leading-tight tracking-[-0.01em] mb-2">
        Get your profile from your coach
      </div>
      <p className="sf text-[12.5px] text-white/65 leading-relaxed mb-4">
        Your coach will share a team invite link — in the team chat, by email, or as a poster in the
        locker room. Tap it to claim your jersey and unlock your highlights. You can also continue
        as a Fan and claim later.
      </p>

      <button
        type="button"
        onClick={() => onClaim?.('varsity-eastside-2026')}
        className="w-full squircle-sm px-3 py-2.5 flex items-center gap-2 mb-1 lg-aura"
        style={{
          background: 'var(--hatch-grain)',
          border: '1px dashed var(--hairline-strong)',
          cursor: 'pointer',
        }}
      >
        <svg
          width={14}
          height={14}
          viewBox="0 0 20 20"
          fill="none"
          stroke="var(--brand-cyan-text)"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ width: 14, height: 14, display: 'block' }}
        >
          <path d="M9 12 a3 3 0 0 0 4.24 0 l3 -3 a3 3 0 0 0 -4.24 -4.24 l -1 1" />
          <path d="M11 8 a3 3 0 0 0 -4.24 0 l -3 3 a3 3 0 0 0 4.24 4.24 l 1 -1" />
        </svg>
        <span className="sf text-[12px] truncate flex-1 text-left" style={{ color: 'var(--text-secondary)' }}>
          halo.app/claim/varsity-eastside-2026
        </span>
        <span
          className="sf text-[8.5px] tracking-[0.18em] uppercase font-bold px-1.5 py-0.5 squircle-sm shrink-0"
          style={{
            background: 'var(--brand-cyan-soft)',
            border: '1px solid var(--brand-cyan-border)',
            color: 'var(--brand-cyan-text)',
          }}
        >
          Demo
        </span>
      </button>
    </div>
  </div>
);
