import { OnboardStepper, OnboardDock } from './_chrome';
import { PlayersStepPlayer } from './PlayersStepPlayer';
import { ROSTER, type Persona } from './_data';

/* Verbatim port: halo-v3.2-glass.html line 6962 — parent/fan/coach branch.
   Player branch lives in PlayersStepPlayer.tsx — short-circuited at the
   top of this function so the parent/coach JSX below stays byte-identical. */

export const PlayersStep = ({
  chosenPlayers,
  notify,
  persona,
  togglePlayer,
  handleNotifyToggle,
  onBack,
  onFinish,
  onSkip,
  onClaim,
}: {
  chosenTeams: string[];
  chosenPlayers: Record<string, boolean>;
  notify: Record<string, boolean>;
  persona: Persona;
  togglePlayer: (id: string) => void;
  handleNotifyToggle: (id: string, on: boolean) => void;
  onBack: () => void;
  onFinish: () => void;
  onSkip?: () => void;
  onClaim?: (teamCode: string) => void;
}) => {
  if (persona === 'player') {
    return (
      <PlayersStepPlayer
        chosenPlayers={chosenPlayers}
        togglePlayer={togglePlayer}
        onBack={onBack}
        onFinish={onFinish}
        onSkip={onSkip}
        onClaim={onClaim}
      />
    );
  }
  const totalSelected = Object.keys(chosenPlayers).filter((k) => chosenPlayers[k]).length;
  const players = ROSTER;

  return (
    <>
      <OnboardStepper step={3} total={3} onBack={onBack} />
      <div className="flex-1 min-h-0 overflow-y-auto px-5 pt-4 pb-[120px] anim-fade">
        <h1 className="sf-display text-[24px] font-bold text-white leading-[1.05] tracking-[-0.025em] mb-2">
          Follow players
        </h1>
        <p className="sf text-[13px] text-white/65 leading-relaxed mb-6">
          Pick the players you want to track. We'll surface their drops in your feed.
        </p>
        <div className="space-y-2">
          {players.map((p) => {
            const active = !!chosenPlayers[p.id];
            const notifying = !!notify[p.id];
            return (
              <div
                key={p.id}
                className="squircle-md p-3.5 flex items-center gap-3.5"
                style={
                  active
                    ? {
                        background: 'rgba(0,214,254,0.10)',
                        backdropFilter: 'blur(36px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(36px) saturate(180%)',
                        border: '1px solid rgba(0,214,254,0.55)',
                      }
                    : {
                        background: 'var(--glass-card-bg)',
                        backdropFilter: 'blur(36px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(36px) saturate(180%)',
                        border: '1px solid var(--glass-card-border)',
                      }
                }
              >
                <div className="w-11 h-11 squircle-sm lg-glass-strong flex flex-col items-center justify-center shrink-0">
                  <span className="sf text-[8px] tracking-[0.16em] uppercase font-bold text-white/65 leading-none">
                    NO.
                  </span>
                  <span className="sf-display text-[14px] font-bold tabular-nums text-white leading-none mt-0.5">
                    {p.number}
                  </span>
                </div>
                <button
                  onClick={() => togglePlayer(p.id)}
                  className="flex-1 min-w-0 text-left"
                >
                  <div className="sf-display text-[14.5px] font-bold text-white truncate">
                    {p.name}
                  </div>
                  <div className="sf text-[11px] text-white/60 truncate mt-0.5">
                    {p.position}
                  </div>
                </button>
                {/* Notify bell — appears when followed */}
                {active && (
                  <button
                    onClick={() => handleNotifyToggle(p.id, !notifying)}
                    aria-label={notifying ? 'Mute notifications' : 'Get notifications'}
                    className="w-9 h-9 squircle-sm flex items-center justify-center shrink-0"
                    style={
                      notifying
                        ? {
                            background: 'rgba(0,214,254,0.20)',
                            border: '1px solid rgba(0,214,254,0.55)',
                            color: '#00D6FE',
                          }
                        : {
                            background: 'var(--hatch-grain)',
                            border: '1px solid var(--hairline-strong)',
                            color: 'var(--text-faint)',
                          }
                    }
                  >
                    <svg
                      width={14}
                      height={14}
                      viewBox="0 0 14 14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.7}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 5 a4 4 0 0 1 8 0 v3 l1.5 2 H1.5 L3 8 Z" />
                      <path d="M5.5 11 a1.5 1.5 0 0 0 3 0" />
                    </svg>
                  </button>
                )}
                {/* Follow toggle */}
                <button
                  onClick={() => togglePlayer(p.id)}
                  className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                  style={
                    active
                      ? { background: '#00D6FE' }
                      : {
                          background: 'var(--hatch-grain)',
                          border: '1px solid var(--hairline-strong)',
                        }
                  }
                >
                  {active && (
                    <svg
                      width={12}
                      height={12}
                      viewBox="0 0 14 14"
                      fill="none"
                      stroke="#000"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 7 L6 10 L11 4" />
                    </svg>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <OnboardDock>
        <button
          onClick={onFinish}
          className="lg-btn-primary lg-shine lg-aura squircle-md py-4 w-full sf text-[14.5px] font-semibold"
        >
          {totalSelected > 0 ? `Finish – following ${totalSelected}` : 'Finish'}
        </button>
      </OnboardDock>
    </>
  );
};
