import { useId } from 'react';

/**
 * AvenZo mark: a coin ring holding a chevron "A" whose crossbar is a single coin-dot.
 * Elements tagged `data-draw` can be stroke-animated; `data-fill` fades in after.
 */
export function AvenzoMark({ className = '', title = 'AvenZo' }: { className?: string; title?: string }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 120 120" className={className} role="img" aria-label={title} fill="none">
      <defs>
        <linearGradient id={`g${id}`} x1="10" y1="5" x2="110" y2="115" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff1b8" />
          <stop offset="0.45" stopColor="#d4af37" />
          <stop offset="1" stopColor="#8a6a1c" />
        </linearGradient>
      </defs>
      <circle data-draw cx="60" cy="60" r="56" stroke={`url(#g${id})`} strokeWidth="2.5" />
      <g transform="translate(60 62) scale(.7) translate(-60 -57)">
        <path
          data-draw
          data-fill
          d="M10 110 L60 5 L110 110 L93 110 L60 41 L27 110 Z"
          fill={`url(#g${id})`}
          stroke={`url(#g${id})`}
          strokeWidth="1.5"
          strokeLinejoin="miter"
        />
        <circle data-fill cx="60" cy="89" r="8.5" fill={`url(#g${id})`} />
      </g>
    </svg>
  );
}

/** OPG Studios mark: an open ring (O/G) enclosing a P. Swap for the official artwork when available. */
export function OpgMark({ className = '', title = 'OPG Studios' }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} role="img" aria-label={title} fill="none">
      <circle
        cx="60"
        cy="60"
        r="50"
        stroke="currentColor"
        strokeWidth="9"
        strokeDasharray="244 70"
        transform="rotate(42 60 60)"
      />
      <path d="M44 84 V36 H62 a14 14 0 0 1 0 28 H44" stroke="currentColor" strokeWidth="9" strokeLinejoin="miter" />
    </svg>
  );
}

export function AvenzoWordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`font-extrabold tracking-[0.28em] ${className}`} aria-label="AvenZo">
      AVENZO
    </span>
  );
}
