import { useState } from 'react';
import { findMoment, findGame, ROSTER_LITE, useT, useLocalized } from './_data';
import { ShareSheet, type ShareTargetId } from './ShareSheet';

/* Verbatim port: halo-v3.2-glass.html line 13517.
   The Instagram-style story player that opens when a drop card is tapped.
   Top progress segments, prev/next tap zones, hero glass play button,
   bottom info block with score chip + Watch full game CTA + Share. */

export interface HighlightViewerProps {
  ids: string[];
  index?: number;
  onClose: () => void;
  onWatchFullGame?: (gameId: string, momentId: string) => void;
  /** Fired when the user picks a share target — receives the target id
      ('copy' | 'facebook' | 'instagram' | 'x' | 'tiktok' | 'whatsapp'). */
  onShare?: (targetId: ShareTargetId) => void;
}

export const HighlightViewer = ({
  ids,
  index = 0,
  onClose,
  onWatchFullGame,
  onShare,
}: HighlightViewerProps) => {
  const [i, setI] = useState(index);
  const [shareOpen, setShareOpen] = useState(false);
  const t = useT();
  const localized = useLocalized();
  const m = findMoment(ids[i]);
  if (!m) return null;
  const game = findGame(m.gameId);
  const player =
    ROSTER_LITE.find((p) => p.id === m.personId) ||
    (m.personId === 'self' ? ROSTER_LITE[0] : null);
  const isPlayerHL = !!player;
  const sectionLabel = isPlayerHL ? t('viewer.playerHighlights') : t('viewer.teamMoment');
  const jerseyNum = player ? player.number : null;
  const lower = m.title.toLowerCase();
  const caption =
    isPlayerHL && player
      ? (lower.includes('block') || lower.includes('rebound') || lower.includes('steal')
          ? m.title.split(' ')[0]
          : 'Play') + ' by #' + player.number
      : null;

  return (
    <div
      data-theme="dark"
      className="absolute inset-0 z-50 anim-fade flex flex-col lg-keep-dark"
      style={{
        background:
          'radial-gradient(ellipse 60% 45% at 50% 35%, rgba(0,214,254,0.14) 0%, transparent 65%),' +
          'radial-gradient(ellipse 70% 50% at 50% 100%, rgba(132,88,255,0.10) 0%, transparent 70%),' +
          'linear-gradient(180deg, #050810 0%, #020308 100%)',
      }}
    >
      {/* === Top bar — story progress segments + close === */}
      <div className="absolute top-0 inset-x-0 z-30 px-4 pt-11 flex items-center justify-between">
        <div className="flex gap-1 flex-1 me-4">
          {ids.map((_, idx) => (
            <div
              key={idx}
              className="flex-1 h-[2.5px] overflow-hidden rounded-full"
              style={{ background: 'rgba(255,255,255,0.18)' }}
            >
              <div
                className="h-full"
                style={{
                  width: idx < i ? '100%' : idx === i ? '60%' : '0%',
                  background: '#fff',
                  boxShadow: idx === i ? '0 0 6px rgba(255,255,255,0.65)' : 'none',
                  transition: 'width 200ms linear',
                }}
              />
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 lg-glass squircle-sm flex items-center justify-center text-white"
          aria-label="Close"
        >
          <svg width={12} height={12} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
            <path d="M3 3 L11 11 M11 3 L3 11" />
          </svg>
        </button>
      </div>

      {/* === Section chip — jersey badge + label === */}
      <div className="absolute top-[68px] start-4 z-30 flex items-center gap-2 lg-glass-strong squircle-sm ps-1 pe-2.5 py-1">
        {jerseyNum != null && (
          <div
            className="w-6 h-6 squircle-sm flex items-center justify-center shrink-0"
            style={{
              background: 'var(--brand-cyan-soft)',
              border: '1px solid var(--brand-cyan-border)',
              color: 'var(--brand-cyan-text)',
            }}
          >
            <span className="sf-display text-[11px] font-bold tabular-nums leading-none">{jerseyNum}</span>
          </div>
        )}
        <span className="sf text-[10px] tracking-[0.18em] uppercase font-bold text-white">{sectionLabel}</span>
      </div>

      {/* === Hero video area === */}
      <div className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'var(--hatch-grain)' }} />

        {/* Tap zones */}
        <button
          onClick={() => setI(Math.max(0, i - 1))}
          className="absolute start-0 top-0 bottom-0 w-1/3 z-10"
          aria-label="Previous"
        />
        <button
          onClick={() => setI(Math.min(ids.length - 1, i + 1))}
          className="absolute end-0 top-0 bottom-0 w-1/3 z-10"
          aria-label="Next"
        />

        {/* Centered play glyph */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="relative w-20 h-20 rounded-full lg-glass-strong flex items-center justify-center"
            style={{
              boxShadow:
                'inset 0 1px 0 rgba(255,255,255,0.30), 0 0 40px -8px rgba(0,214,254,0.50), 0 8px 32px -8px rgba(0,0,0,0.55)',
              border: '1px solid rgba(255,255,255,0.25)',
            }}
          >
            <svg
              width={22}
              height={26}
              viewBox="0 0 22 26"
              fill="#fff"
              style={{ marginInlineStart: 4, filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.40))' }}
            >
              <path d="M2 2 L20 13 L2 24 Z" />
            </svg>
          </div>
        </div>

        {/* Bottom info block */}
        <div
          className="absolute bottom-0 inset-x-0 z-10 pt-20"
          style={{
            background:
              'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.45) 30%, rgba(0,0,0,0.85) 100%)',
          }}
        >
          <div className="px-5 pb-5 pt-2">
            <div className="mb-3 flex items-center gap-2">
              <span className="lg-glass-strong squircle-sm sf text-[10px] tracking-[0.14em] uppercase font-bold text-white px-2 py-0.5 leading-none">
                {m.sub}
              </span>
              {isPlayerHL && (
                <>
                  <div
                    className="w-1 h-1 rounded-full"
                    style={{ background: '#00D6FE', boxShadow: '0 0 6px rgba(0,214,254,0.85)' }}
                  />
                  <span className="sf text-[10px] tracking-[0.14em] uppercase font-bold" style={{ color: '#00D6FE' }}>
                    {t('viewer.yours')}
                  </span>
                </>
              )}
            </div>
            <div
              className="sf-display text-white font-bold tracking-[-0.025em] leading-[1.0] mb-2"
              style={{ fontSize: 30, textShadow: '0 2px 12px rgba(0,0,0,0.45)' }}
            >
              {isPlayerHL && jerseyNum != null ? `#${jerseyNum} ${t('viewer.playerHighlights')}` : t('viewer.teamMoment')}
            </div>
            <div className="sf text-[13px] mb-4" style={{ color: 'rgba(255,255,255,0.75)' }}>
              {localized(m, 'title') || caption || (game ? `${localized(game, 'home')} ${t('common.vs')} ${localized(game, 'away')}` : '')}
            </div>

            {game && (
              <div
                className="squircle-sm px-3 py-2.5 mb-4 flex items-center justify-between"
                style={{
                  background: 'var(--glass-card-bg)',
                  backdropFilter: 'blur(20px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                  border: '1px solid var(--glass-card-border)',
                  boxShadow: 'inset 0 1px 0 var(--glass-card-inset-top)',
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full lg-glass-strong flex items-center justify-center sf-display text-[10px] font-bold text-white">
                    {game.home.charAt(0)}
                  </div>
                  <span className="sf text-[11.5px] font-semibold text-white">{localized(game, 'home')}</span>
                </div>
                <div className="sf-display text-[18px] font-bold tabular-nums text-white leading-none flex items-center gap-2">
                  <span>{game.scoreHome}</span>
                  <span style={{ color: 'rgba(255,255,255,0.30)' }}>·</span>
                  <span>{game.scoreAway}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="sf text-[11.5px] font-semibold text-white">{localized(game, 'away')}</span>
                  <div className="w-7 h-7 rounded-full lg-glass-strong flex items-center justify-center sf-display text-[10px] font-bold text-white">
                    {game.away.charAt(0)}
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-stretch gap-2">
              <button
                onClick={() => {
                  onClose();
                  onWatchFullGame?.(m.gameId, m.id);
                }}
                className="flex-1 lg-btn-primary lg-shine squircle-sm py-3 sf text-[12.5px] font-semibold flex items-center justify-center gap-2"
              >
                <svg width={11} height={12} viewBox="0 0 11 12" fill="currentColor">
                  <path d="M1 1 L10 6 L1 11 Z" />
                </svg>
                <span>{t('viewer.watchFullGame')}</span>
              </button>
              <button
                onClick={() => setShareOpen(true)}
                className="w-12 lg-glass squircle-sm flex items-center justify-center text-white"
                aria-label="Share"
              >
                <svg
                  width={14}
                  height={14}
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 8 v5 h10 v-5" />
                  <path d="M8 2 v9 M5 5 L8 2 L11 5" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ShareSheet — bottom-sheet modal that overlays the viewer when the
          share button is tapped. Closes via backdrop tap, X button, or
          after a target picks. */}
      {shareOpen && (
        <ShareSheet
          title={isPlayerHL && jerseyNum != null ? `#${jerseyNum} ${t('viewer.playerHighlights')}` : t('viewer.teamMoment')}
          subtitle={game ? `${localized(game, 'home')} ${t('common.vs')} ${localized(game, 'away')}` : undefined}
          url={`halo.app/m/${m.id}`}
          thumbnail={jerseyNum != null ? String(jerseyNum) : undefined}
          onShare={(targetId) => onShare?.(targetId)}
          onClose={() => setShareOpen(false)}
        />
      )}
    </div>
  );
};
