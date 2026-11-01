import { useEffect, useLayoutEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import SplitText from '../components/SplitText';
import Cta from '../components/Cta';
import { gsap, prefersReducedMotion } from '../lib/motion';
import { scrollToId } from '../lib/scroll';
import { openLegal } from '../lib/ui';

export default function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null);

  // Everything starts hidden; the loader lifting plays the intro.
  useLayoutEffect(() => {
    if (prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.set('.hero-fade', { autoAlpha: 0, y: 24 });
    }, root);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!ready || prefersReducedMotion) {
      if (ready) gsap.set('.hero-fade', { clearProps: 'all' });
      return;
    }
    const ctx = gsap.context(() => {
      gsap
        .timeline({ delay: 0.15 })
        .to('.hero-title .char', { yPercent: 0, duration: 1.6, stagger: 0.07, ease: 'power4.out' }, 0)
        .to('.hero-fade', { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.14, ease: 'power3.out' }, 0.7);
    }, root);
    return () => ctx.revert();
  }, [ready]);

  return (
    <section
      id="hero"
      ref={root}
      data-theme="dark"
      className="relative h-[100svh] min-h-[620px] overflow-hidden"
    >
      <div
        className="absolute inset-0 z-0 bg-black"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 60% 50% at 50% 48%, rgba(212,175,55,0.16), rgba(0,0,0,0) 70%)',
        }}
      />

      {/* Giant wordmark sits BEHIND the coin (canvas is z-10) */}
      <div className="pointer-events-none absolute inset-0 z-[5] flex items-center justify-center" aria-hidden="true">
        <SplitText
          as="div"
          text="AVENZO"
          auto={false}
          className="hero-title outline-gold select-none text-[24vw] font-extrabold leading-none tracking-[-0.03em] md:text-[19vw]"
        />
      </div>

      <div className="relative z-20 mx-auto flex h-full max-w-[1600px] flex-col justify-between px-5 pb-8 pt-28 md:px-12 md:pb-10 md:pt-32">
        <p className="hero-fade text-center text-[0.65rem] font-semibold uppercase tracking-[0.55em] text-gold md:text-xs">
          Shop. Earn. Cashback.
        </p>

        <div className="flex flex-col items-center text-center">
          <h1 className="hero-fade text-[1.35rem] font-light uppercase tracking-[0.28em] md:text-4xl md:tracking-[0.3em]">
            Shop more. <span className="font-semibold text-gold">Earn more.</span>
          </h1>
          <div className="hero-fade mt-8 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:gap-4">
            <Cta onClick={() => scrollToId('cashback')}>Explore AvenZo</Cta>
            <Cta variant="outline" arrow={false} onClick={() => scrollToId('how-it-works')}>
              How it works
            </Cta>
          </div>
          <p className="hero-fade mt-6 max-w-md text-[0.7rem] leading-relaxed text-white/50">
            ₹100 cashback on your first eligible purchase. Cashback is not guaranteed and depends on offer eligibility.{' '}
            <button
              onClick={() => openLegal('cashback')}
              className="underline decoration-gold/60 underline-offset-4 transition-colors hover:text-gold"
            >
              Cashback Terms
            </button>
          </p>
        </div>
      </div>

      <button
        onClick={() => scrollToId('cashback')}
        aria-label="Scroll down"
        className="hero-fade absolute bottom-8 right-12 z-20 hidden items-center gap-3 text-[0.65rem] uppercase tracking-[0.3em] text-white/60 transition-colors hover:text-gold md:flex"
      >
        Scroll
        <ChevronDown className="h-4 w-4 animate-bounce" />
      </button>
    </section>
  );
}
