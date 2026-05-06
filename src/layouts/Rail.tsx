import { useEffect, useRef, useState, type ReactNode } from 'react';

/* Rail — horizontal scroll container with desktop hover arrows.

   Behaviour:
     - Below lg: same as the existing flex+overflow-x-auto pattern. No
       arrows. Phone users swipe.
     - At lg+: thumbnails fit naturally up to the viewport width; arrows
       only appear when content is wider than the rail. Clicking an
       arrow scrolls one page-width worth of content. Arrows fade in/out
       depending on whether you're at the start, end, or middle of the
       scroll range.
     - RTL-safe via inline-start / inline-end and the icon-flip-rtl
       utility.

   Usage:
     <Rail className="px-5 lg:px-8">
       {items.map(item => <Thumb key={item.id} {...item} />)}
     </Rail>

   The children are placed inside a flex row with `gap-3`. Pages can
   override the gap by passing it in className. */

export interface RailProps {
  children: ReactNode;
  className?: string;
  /** Tailwind gap class, default `gap-3`. */
  gap?: string;
}

const ChevronStart = () => (
  <svg
    width={20}
    height={20}
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="icon-flip-rtl"
    style={{ width: 20, height: 20, display: 'block' }}
    aria-hidden="true"
  >
    <path d="M12 4 L6 10 L12 16" />
  </svg>
);

const ChevronEnd = () => (
  <svg
    width={20}
    height={20}
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="icon-flip-rtl"
    style={{ width: 20, height: 20, display: 'block' }}
    aria-hidden="true"
  >
    <path d="M8 4 L14 10 L8 16" />
  </svg>
);

export const Rail = ({ children, className = '', gap = 'gap-3' }: RailProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const overflow = el.scrollWidth > el.clientWidth + 2;
      setHasOverflow(overflow);
      const isRTL =
        getComputedStyle(el).direction === 'rtl' ||
        document.documentElement.dir === 'rtl';
      const sl = el.scrollLeft;
      /* In RTL, scrollLeft can be negative or behave differently across
         browsers — use absolute value so the arrow logic stays simple. */
      const absSl = Math.abs(sl);
      const max = el.scrollWidth - el.clientWidth;
      setShowStart(overflow && absSl > 8);
      setShowEnd(overflow && absSl < max - 8);
      void isRTL; /* reserved for future RTL-specific tweaks */
    };

    update();
    el.addEventListener('scroll', update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);

    return () => {
      el.removeEventListener('scroll', update);
      ro.disconnect();
    };
  }, []);

  const scrollByPage = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const isRTL =
      getComputedStyle(el).direction === 'rtl' ||
      document.documentElement.dir === 'rtl';
    /* page = 85% of viewport width so the user can see context bleeding
       between pages (rather than clean disjoint pages). */
    const dx = el.clientWidth * 0.85 * dir * (isRTL ? -1 : 1);
    el.scrollBy({ left: dx, behavior: 'smooth' });
  };

  const arrowBase: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    width: 44,
    height: 44,
    borderRadius: 9999,
    background: 'var(--glass-strong-bg)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    border: '1px solid var(--glass-strong-border)',
    color: 'var(--text-primary)',
    boxShadow: '0 6px 20px -6px rgba(0,0,0,0.45)',
    cursor: 'pointer',
    transition: 'opacity 180ms ease, transform 180ms ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  };

  return (
    <div className="relative group">
      <div
        ref={ref}
        className={`flex ${gap} overflow-x-auto pb-1 no-scrollbar scroll-smooth ${className}`}
      >
        {children}
      </div>

      {/* Arrows — only ever rendered at lg+ via `hidden lg:flex`. They
          fade in/out based on scroll position; pointer-events disabled
          when faded so they don't intercept clicks. */}
      {hasOverflow && (
        <>
          <button
            type="button"
            aria-label="Previous"
            onClick={() => scrollByPage(-1)}
            className={`hidden lg:flex ${showStart ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            style={{ ...arrowBase, insetInlineStart: 12 }}
          >
            <ChevronStart />
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={() => scrollByPage(1)}
            className={`hidden lg:flex ${showEnd ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            style={{ ...arrowBase, insetInlineEnd: 12 }}
          >
            <ChevronEnd />
          </button>
        </>
      )}
    </div>
  );
};
