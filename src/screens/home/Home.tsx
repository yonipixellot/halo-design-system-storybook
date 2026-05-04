import { useState } from 'react';
import { HomeHeader } from './HomeHeader';
import { HighlightCircles } from './HighlightCircles';
import { GameCard, type GameCardState } from './GameCard';
import { DropsSection } from './DropsSection';
import { FollowingStrip } from './FollowingStrip';
import { StorytellingDropsRail } from './StorytellingDropsRail';
import { TeamMomentsRail } from './TeamMomentsRail';
import { HighlightViewer } from './HighlightViewer';
import { PackReveal } from './PackReveal';
import { defaultPlayerState, SEED_MOMENTS, type FollowState } from './_data';

/* Verbatim composition mirroring halo-v3.2-glass.html HomePlayer (line 7491):
   Header → Circles → GameCard → Drops → Following → Storytelling → TeamMoments
   Plus the HighlightViewer modal (drop card → story player) and the PackReveal
   ceremony (unrevealed drop → unwrap animation).

   Layout: outer wrapper absolute-fills the .glass-app phone column. The
   sections render in an inner scroll container so Home content can be
   taller than 852px without growing the column. The modals (HighlightViewer
   and PackReveal) are siblings of the scroll container — they absolute-fill
   the wrapper (= the visible 852 frame) instead of the grown content. */

export interface HomeProps {
  s?: FollowState;
  /** Override the morphing GameCard variant. Default = 'off' (NextGameTeaser). */
  gameState?: GameCardState;
  /** Game IDs that haven't been revealed yet — tapping a drop from these
      will play the PackReveal ceremony before opening HighlightViewer. */
  unrevealedGameIds?: string[];
}

export const Home = ({
  s = defaultPlayerState,
  gameState = 'off',
  unrevealedGameIds = [],
}: HomeProps) => {
  const [viewer, setViewer] = useState<{ ids: string[]; index: number } | null>(null);
  const [reveal, setReveal] = useState<string | null>(null);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());

  const playerMomentIds = SEED_MOMENTS.filter((m) => m.personId === 'self').slice(0, 6);

  const handlePick = (_id: string, index: number) => {
    const moment = playerMomentIds[index];
    const needsReveal =
      moment && unrevealedGameIds.includes(moment.gameId) && !revealed.has(moment.gameId);
    if (needsReveal) {
      setReveal(moment.gameId);
    } else {
      setViewer({ ids: playerMomentIds.map((m) => m.id), index });
    }
  };

  return (
    <div
      className="anim-fade text-white sf"
      style={{ position: 'absolute', inset: 0 }}
    >
      {/* Scrolling content — Home sections live here. Atmosphere + vignette
          scroll with the content (matches the prototype's behaviour). */}
      <div
        className="pb-28"
        style={{
          position: 'absolute',
          inset: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        <div className="lg-atmosphere" />
        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, var(--vignette-corner) 0%, transparent 30%, transparent 70%, var(--vignette-corner-soft) 100%)',
          }}
        />
        <div className="relative z-10">
          <HomeHeader greeting="Game day" />
          <HighlightCircles s={s} />
          <GameCard state={gameState} onReveal={(gid) => setReveal(gid)} />
          <DropsSection onPick={handlePick} />
          <FollowingStrip s={s} />
          <StorytellingDropsRail audience={s.persona} />
          <TeamMomentsRail />
        </div>
      </div>

      {/* Modals — siblings of the scroll container, so their absolute-fill
          resolves to this 852 wrapper rather than the grown Home content. */}
      {viewer && (
        <HighlightViewer
          ids={viewer.ids}
          index={viewer.index}
          onClose={() => setViewer(null)}
        />
      )}

      {reveal && (
        <PackReveal
          gameId={reveal}
          onDismiss={() => {
            setRevealed((prev) => new Set(prev).add(reveal));
            setReveal(null);
          }}
          onOpenMoment={(ids, index) => setViewer({ ids, index })}
        />
      )}
    </div>
  );
};
