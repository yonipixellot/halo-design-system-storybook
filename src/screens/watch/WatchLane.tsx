import type { ReactNode } from 'react';

/* WatchLane — generic horizontal rail with a title + "All ›" cyan link.
   Verbatim port of halo-v3.2-glass.html line 10852. The cards inside
   are passed as children (each call site decides whether to render
   LiveCard, PosterCard, etc.). */

export interface WatchLaneProps {
  title: string;
  /** Show the "All ›" link in the header. Default true. */
  more?: boolean;
  onAll?: () => void;
  children: ReactNode;
}

export const WatchLane = ({ title, more = true, onAll, children }: WatchLaneProps) => (
  <div className="relative z-10 mb-6 sf">
    <div className="px-4 lg:px-8 xl:px-12 mb-3 flex items-baseline justify-between">
      <span className="sf-display text-[20px] lg:text-[22px] font-bold text-white tracking-[-0.02em]">
        {title}
      </span>
      {more && (
        <button
          onClick={onAll}
          className="text-[13px] font-semibold sf flex items-center gap-0.5 transition-colors hover:opacity-80"
          style={{ color: '#00D6FE' }}
        >
          All <span className="text-[14px]">›</span>
        </button>
      )}
    </div>
    <div className="flex gap-3 lg:gap-4 px-4 lg:px-8 xl:px-12 overflow-x-auto no-scrollbar pb-1">
      {children}
    </div>
  </div>
);
