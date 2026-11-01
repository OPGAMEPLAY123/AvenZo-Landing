import { useEffect, useRef } from 'react';
import { AvenzoMark } from './brand/Logos';
import { gsap, prefersReducedMotion } from '../lib/motion';
import { startScroll, stopScroll } from '../lib/scroll';

interface Props {
  /** Fires as the loader begins to lift, so the hero can start animating underneath. */
  onReveal: () => void;
  onDone: () => void;
}

export default function Loader({ onReveal, onDone }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    stopScroll();
    let dead = false;
    const ctx = gsap.context(() => {
      const draws = root.current!.querySelectorAll<SVGGeometryElement>('[data-draw]');
      draws.forEach((el) => {
        const len = el.getTotalLength();
        gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
      });
      gsap.set('[data-fill]', { fillOpacity: 0 });
      gsap.set(root.current, { clipPath: 'inset(0% 0% 0% 0%)' });

      const counter = { v: 0 };
      const fontsReady = Promise.race([
        document.fonts ? document.fonts.ready : Promise.resolve(),
        new Promise((r) => setTimeout(r, 3000)),
      ]);

      const exit = () => {
        if (dead) return;
        onReveal();
        gsap
          .timeline({
            onComplete: () => {
              startScroll();
              onDone();
            },
          })
          .to('.ld-inner', { scale: 1.12, autoAlpha: 0, duration: 0.7, ease: 'power2.in' })
          .to(root.current, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1, ease: 'power4.inOut' }, 0.25);
      };

      const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
      tl.to(draws, { strokeDashoffset: 0, duration: 1.5, stagger: 0.2 }, 0)
        .to('[data-fill]', { fillOpacity: 1, duration: 0.8 }, 1.2)
        .to(
          counter,
          {
            v: 100,
            duration: 1.9,
            ease: 'power1.inOut',
            onUpdate: () => {
              if (num.current) num.current.textContent = String(Math.round(counter.v)).padStart(3, '0');
            },
          },
          0,
        )
        .fromTo('.ld-tag', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.8)
        .add(() => {
          fontsReady.then(exit);
        });
      if (prefersReducedMotion) tl.timeScale(3);
    }, root);
    return () => {
      dead = true;
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black text-white"
      role="status"
      aria-label="Loading AvenZo"
    >
      <div className="ld-inner flex flex-col items-center">
        <AvenzoMark className="h-28 w-28 md:h-36 md:w-36" />
        <div className="mt-8 text-sm font-extrabold tracking-[0.5em] pl-[0.5em]">AVENZO</div>
        <div className="ld-tag mt-3 text-[0.65rem] uppercase tracking-[0.4em] text-white/50 pl-[0.4em]">
          Shop. Earn. Cashback.
        </div>
        <div className="mt-10 font-mono text-xs tracking-[0.3em] text-gold">
          <span ref={num}>000</span>
        </div>
      </div>
    </div>
  );
}
