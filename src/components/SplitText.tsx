import { useLayoutEffect, useRef, type ElementType } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/motion';

interface Props {
  text: string;
  as?: string;
  className?: string;
  /** Reveal automatically when scrolled into view. Otherwise a parent animates `.char`. */
  auto?: boolean;
  delay?: number;
  stagger?: number;
  start?: string;
}

/**
 * Masked per-character reveal. Characters start hidden below their mask; either
 * this component reveals them on scroll, or a parent timeline animates `.char`.
 */
export default function SplitText({
  text,
  as = 'div',
  className = '',
  auto = true,
  delay = 0,
  stagger = 0.035,
  start = 'top 88%',
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion) return;
    const chars = el.querySelectorAll('.char');
    const ctx = gsap.context(() => {
      gsap.set(chars, { yPercent: 115 });
      if (auto) {
        ScrollTrigger.create({
          trigger: el,
          start,
          once: true,
          onEnter: () =>
            gsap.to(chars, { yPercent: 0, duration: 1.1, ease: 'power4.out', stagger, delay }),
        });
      }
    }, el);
    return () => ctx.revert();
  }, [auto, delay, stagger, start, text]);

  const Tag = as as ElementType;
  const words = text.split(' ');
  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {words.map((w, wi) => (
        <span key={wi} aria-hidden="true">
          <span className="word">
            {[...w].map((ch, ci) => (
              <span key={ci} className="char">
                {ch}
              </span>
            ))}
          </span>
          {wi < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </Tag>
  );
}
