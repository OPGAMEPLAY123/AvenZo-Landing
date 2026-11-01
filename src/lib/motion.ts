import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
// Mobile browsers resize the viewport as the URL bar collapses; don't re-layout every time.
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger };

export const prefersReducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** 0 → 1 once the loader has lifted; drives the coin/camera intro. */
export const intro = { p: prefersReducedMotion ? 1 : 0 };

/** Normalised pointer (-1..1), updated on desktop only. */
export const pointer = { x: 0, y: 0 };

if (typeof window !== 'undefined') {
  window.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType === 'touch') return;
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    },
    { passive: true },
  );
}
