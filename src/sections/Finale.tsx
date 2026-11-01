import { useLayoutEffect, useRef } from 'react';
import { AvenzoMark, OpgMark } from '../components/brand/Logos';
import SplitText from '../components/SplitText';
import Cta from '../components/Cta';
import { config, copy } from '../config';
import { gsap, prefersReducedMotion } from '../lib/motion';

/**
 * Final reveal. One scrubbed timeline over a tall sticky stage:
 * coin rushes the camera → gold flash → AvenZo mark + wordmark → "Powered by OPG Studios".
 * The coin itself is driven by lib/choreography (its `finale` stops line up with this timeline).
 */
export default function Finale() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion) {
      gsap.set('.fn-caption, .fn-opg', { autoAlpha: 0 });
      gsap.set('.fn-brand', { autoAlpha: 1 });
      return;
    }
    const ctx = gsap.context(() => {
      const draws = root.current!.querySelectorAll<SVGGeometryElement>('.fn-mark [data-draw]');
      draws.forEach((el) => {
        const len = el.getTotalLength();
        gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
      });
      gsap.set('.fn-mark [data-fill]', { fillOpacity: 0 });
      const chars = root.current!.querySelectorAll('.fn-word .char');

      gsap
        .timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: 0.6 },
        })
        // caption while the coin approaches
        .fromTo('.fn-caption', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.12 }, 0.04)
        .to('.fn-caption', { autoAlpha: 0, y: -20, duration: 0.08 }, 0.26)
        // flash as the coin fills the lens
        .fromTo('.fn-flash', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.1 }, 0.34)
        .to('.fn-flash', { autoAlpha: 0, duration: 0.14 }, 0.45)
        // brand reveal
        .fromTo('.fn-brand', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.02 }, 0.46)
        .to(draws, { strokeDashoffset: 0, duration: 0.14, stagger: 0.03 }, 0.48)
        .to('.fn-mark [data-fill]', { fillOpacity: 1, duration: 0.08 }, 0.56)
        .fromTo(chars, { yPercent: 115 }, { yPercent: 0, duration: 0.1, stagger: 0.012, ease: 'power3.out' }, 0.54)
        .fromTo('.fn-tag', { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.07 }, 0.64)
        .fromTo('.fn-cta', { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.07, stagger: 0.02 }, 0.7)
        // hand-off to OPG Studios
        .to('.fn-brand', { autoAlpha: 0, y: -40, scale: 0.96, duration: 0.08 }, 0.82)
        .fromTo('.fn-opg', { autoAlpha: 0, y: 30, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.09 }, 0.86)
        .to({}, { duration: 0.05 }, 0.95);
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="finale" ref={root} data-theme="dark" className="relative h-[480svh]">
      <div className="absolute inset-0 z-0 bg-black" />

      <div className="sticky top-0 z-20 h-[100svh] overflow-hidden">
        {/* caption */}
        <p className="fn-caption invisible absolute inset-x-0 top-[16%] px-6 text-center text-[0.7rem] font-semibold uppercase tracking-[0.5em] text-gold opacity-0 md:text-sm">
          The reward is waiting
        </p>

        {/* gold flash */}
        <div
          className="fn-flash invisible absolute inset-0 opacity-0"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, #fff6d2 0%, #e8c25a 28%, #8a6a1c 62%, #000 100%)',
          }}
        />

        {/* AvenZo brand reveal */}
        <div className="fn-brand invisible absolute inset-0 flex flex-col items-center justify-center px-6 text-center opacity-0">
          <div className="fn-mark">
            <AvenzoMark className="h-24 w-24 md:h-32 md:w-32" />
          </div>
          <SplitText
            as="div"
            text="AVENZO"
            auto={false}
            className="fn-word mt-6 text-[17vw] font-extrabold leading-[0.9] tracking-[-0.03em] md:text-[11vw]"
          />
          <p className="fn-tag mt-3 text-sm font-light uppercase tracking-[0.5em] text-gold md:text-xl">
            Shop. Earn. Repeat.
          </p>
          <div className="mt-9 flex w-full max-w-sm flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center sm:gap-4">
            <Cta className="fn-cta" href={config.shopUrl} fallback={copy.shopSoon}>
              Start Shopping
            </Cta>
            <Cta className="fn-cta" variant="outline" arrow={false} href={config.signupUrl} fallback={copy.loginSoon}>
              Login / Get Started
            </Cta>
          </div>
          <p className="mt-8 max-w-md text-[0.68rem] leading-relaxed text-white/45">{copy.disclaimer}</p>
        </div>

        {/* Powered by OPG Studios */}
        <div className="fn-opg invisible absolute inset-0 flex flex-col items-center justify-center px-6 text-center opacity-0">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.6em] pl-[0.6em] text-white/55 md:text-sm">
            Powered by
          </p>
          <OpgMark className="mt-8 h-24 w-24 text-white md:h-36 md:w-36" />
          <p className="mt-8 text-[9vw] font-extrabold uppercase leading-none tracking-[0.14em] pl-[0.14em] md:text-[4.6vw]">
            OPG Studios
          </p>
          <div className="mt-8 h-px w-24 bg-gold" />
        </div>
      </div>
    </section>
  );
}
