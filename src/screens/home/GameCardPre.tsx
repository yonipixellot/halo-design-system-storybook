import { useEffect, useState } from 'react';
import { cls } from '@/lib/cls';
import { fmt, useT, useLocalized, type Game } from './_data';
import { JerseyPicker } from './JerseyPicker';

/* Verbatim port: halo-v3.2-glass.html line 8525.
   Pre-game card with live countdown. < 10 min flips to "imminent" mode —
   stronger cyan glow, tighter ember. When `!parent`, the JerseyPicker
   sub-component renders below the progress bar. */

export interface GameCardPreProps {
  game: Game;
  parent?: boolean;
  /** Forwarded to the embedded JerseyPicker — fired with the chosen color id. */
  onJerseyConfirm?: (colorId: string) => void;
  /** Forwarded to the embedded JerseyPicker — toast trigger. */
  onJerseyToast?: (msg: string) => void;
}

export const GameCardPre = ({
  game,
  parent = false,
  onJerseyConfirm,
  onJerseyToast,
}: GameCardPreProps) => {
  const t = useT();
  const localized = useLocalized();
  const [remaining, setRemaining] = useState(Math.max(0, Math.min(game.kickoffInSec ?? 7200, 7200)));
  useEffect(() => {
    const tick = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000);
    return () => clearInterval(tick);
  }, []);

  const isImminent = remaining > 0 && remaining < 600;
  const progress = 100 - Math.min(100, remaining / 72);

  return (
    <div
      className={cls('relative squircle-md p-4 overflow-hidden lg-aura', isImminent && 'lg-pre-imminent')}
      style={{
        background:
          'radial-gradient(ellipse 60% 70% at 18% 28%, rgba(0,214,254,' + (isImminent ? '0.22' : '0.12') + ') 0%, transparent 60%),' +
          'radial-gradient(ellipse 60% 70% at 88% 78%, rgba(132,88,255,0.10) 0%, transparent 60%),' +
          'linear-gradient(180deg, var(--card-base-soft-top) 0%, var(--card-base-soft-bot) 100%)',
        border: '1px solid var(--glass-card-border)',
        backdropFilter: 'blur(36px) saturate(180%)',
        WebkitBackdropFilter: 'blur(36px) saturate(180%)',
        boxShadow:
          'inset 0 1px 0 var(--glass-card-inset-top), var(--glass-card-shadow), 0 0 ' +
          (isImminent ? '40px' : '20px') +
          ' -8px rgba(0,214,254,' +
          (isImminent ? '0.40' : '0.18') +
          ')',
      }}
    >
      <div className="relative z-10 flex items-center mb-3">
        <div className="flex items-center gap-2">
          <div
            className="w-1.5 h-1.5 rounded-full bg-halo-cyan anim-pulse-dot"
            style={{ boxShadow: '0 0 8px rgba(0,214,254,0.7)' }}
          />
          <span
            className="sf text-[10px] font-bold tracking-[0.16em] uppercase"
            style={{ color: 'var(--brand-cyan-text)' }}
          >
            {parent ? t('home.talsNextGame') : isImminent ? t('home.startingSoon') : t('home.dropIncomingPreGame')}
          </span>
        </div>
      </div>

      <div className="relative z-10">
        <div
          className="sf-display text-[20px] font-bold tracking-[-0.015em] leading-none"
          style={{ color: 'var(--text-primary)' }}
        >
          {localized(game, 'home')}
        </div>
        <div className="sf text-[12.5px] mt-1" style={{ color: 'var(--text-secondary)' }}>
          {t('common.vs')} {localized(game, 'away')}
        </div>
        <div className="sf text-[11px] mt-1" style={{ color: 'var(--text-tertiary)' }}>
          {localized(game, 'venue') || 'Eastside Gym'}
        </div>
      </div>

      <div className="relative z-10 mt-4 flex items-baseline gap-2">
        <div
          className="sf-display text-[34px] font-bold tabular-nums leading-none"
          style={{
            color: 'var(--text-primary)',
            textShadow: isImminent ? '0 0 18px rgba(0,214,254,0.40)' : 'none',
          }}
        >
          {fmt.countdown(remaining)}
        </div>
        <span className="sf text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
          {t('home.tipoff').toLowerCase()}
        </span>
      </div>

      <div
        className="relative z-10 h-[3px] mt-3 overflow-hidden rounded-full"
        style={{ background: 'var(--hairline-strong)' }}
      >
        <div
          className="h-full bg-halo-cyan"
          style={{
            width: progress + '%',
            transition: 'width 1s linear',
            boxShadow: '0 0 ' + (isImminent ? '14px' : '8px') + ' rgba(0,214,254,' + (isImminent ? '0.75' : '0.5') + ')',
          }}
        />
      </div>

      {/* JerseyPicker — only when this card is the player's own (not parent
          viewing their kid). Verbatim per prototype line 8618. */}
      {!parent && <JerseyPicker onConfirm={onJerseyConfirm} onToast={onJerseyToast} />}
    </div>
  );
};
