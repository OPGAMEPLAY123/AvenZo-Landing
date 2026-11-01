import Lenis from 'lenis';
import { gsap, ScrollTrigger, prefersReducedMotion } from './motion';

let lenis: Lenis | null = null;
let locked = false;

export function initSmoothScroll() {
  if (prefersReducedMotion) return () => {};
  lenis = new Lenis({ lerp: 0.085, smoothWheel: true });
  if (locked) lenis.stop(); // the loader may already be holding the page
  lenis.on('scroll', ScrollTrigger.update);
  const tick = (time: number) => lenis?.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  return () => {
    gsap.ticker.remove(tick);
    lenis?.destroy();
    lenis = null;
  };
}

/** Lock the page (loader, menu, modal). Lenis handles wheel input; the class handles touch. */
export const stopScroll = () => {
  locked = true;
  lenis?.stop();
  document.documentElement.classList.add('avz-locked');
};

export const startScroll = () => {
  locked = false;
  lenis?.start();
  document.documentElement.classList.remove('avz-locked');
};

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) {
    lenis.scrollTo(el, { offset: 0, duration: 2, easing: (t: number) => 1 - Math.pow(1 - t, 4) });
  } else {
    el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  }
}
