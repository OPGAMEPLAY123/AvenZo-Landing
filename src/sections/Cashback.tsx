import { useLayoutEffect, useRef } from 'react';
import SplitText from '../components/SplitText';
import { copy } from '../config';
import { gsap, prefersReducedMotion } from '../lib/motion';
import { openLegal } from '../lib/ui';

export default function Cashback() {
  const root = useRef<HTMLElement>(null);
  const count = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion) {
      if (count.current) count.current.textContent = '100';
      gsap.set('.cb-ring', { strokeDashoffset: 0 });
      gsap.set('.cb-para', { display: 'none' });
      gsap.set('.cb-reward', { autoAlpha: 1 });
      return;
    }
    const ctx = gsap.context(() => {
      const ring = root.current!.querySelector<SVGCircleElement>('.cb-ring')!;
      const len = ring.getTotalLength();
      gsap.set(ring, { strokeDasharray: len, strokeDashoffset: len });
      const counter = { v: 0 };

      // Scrubbed across the section's whole sticky range (matches the coin's stops).
      gsap
        .timeline({
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
          },
        })
        .to('.cb-para', { autoAlpha: 0, y: -24, duration: 0.18 }, 0.34)
        .fromTo('.cb-reward', { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.2 }, 0.44)
        .to(ring, { strokeDashoffset: 0, duration: 0.34, ease: 'power2.inOut' }, 0.5)
        .to(
          counter,
          {
            v: 100,
            duration: 0.34,
            ease: 'power2.inOut',
            onUpdate: () => {
              if (count.current) count.current.textContent = String(Math.round(counter.v));
            },
          },
          0.5,
        )
        .to({}, { duration: 0.16 }, 0.84);
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="cashback" ref={root} data-theme="light" className="relative h-[260svh]">
      <div className="absolute inset-0 z-0 bg-bone" />

      <div className="sticky top-0 z-20 h-[100svh] overflow-hidden text-ink">
        <div className="mx-auto flex h-full max-w-[1600px] items-end px-5 pb-12 md:items-center md:px-12 md:pb-0">
          <div className="w-full md:w-[47%]">
            <p className="mb-5 text-[0.65rem] font-bold uppercase tracking-[0.45em] text-gold-deep md:text-xs">
              The cashback experience
            </p>
            <h2 className="text-[8.6vw] font-extrabold uppercase leading-[0.95] tracking-[-0.03em] md:text-[4.6vw]">
              <SplitText as="span" text="Your shopping." className="block pb-[0.04em]" />
              <SplitText as="span" text="Your rewards." className="block pb-[0.04em] text-gold-mid" delay={0.15} />
            </h2>

            {/* Two stages that cross-fade while scrolling */}
            <div className="relative mt-7 h-[190px] md:mt-10 md:h-[210px]">
              <div className="cb-para absolute inset-0">
                <p className="max-w-md text-base leading-relaxed text-ink/70 md:text-lg">
                  Shop through eligible AvenZo offers and get cashback according to the applicable offer terms.
                </p>
                <p className="mt-5 max-w-md text-xs leading-relaxed text-ink/45">{copy.disclaimer}</p>
              </div>

              <div className="cb-reward invisible absolute inset-0 opacity-0">
                <div className="flex items-center gap-5 md:gap-8">
                  <svg viewBox="0 0 120 120" className="h-24 w-24 shrink-0 -rotate-90 md:h-32 md:w-32" fill="none" aria-hidden="true">
                    <circle cx="60" cy="60" r="54" stroke="#0a0a0a" strokeOpacity="0.1" strokeWidth="3" />
                    <circle className="cb-ring" cx="60" cy="60" r="54" stroke="#b8902a" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  <div>
                    <div className="flex items-baseline text-[4.6rem] font-extrabold leading-none tracking-[-0.04em] md:text-[7rem]">
                      <span className="text-gold-gradient">₹</span>
                      <span className="text-gold-gradient" ref={count} aria-label="100">
                        100
                      </span>
                    </div>
                    <div className="mt-2 text-[0.62rem] font-bold uppercase tracking-[0.28em] md:text-xs">
                      {copy.offerLabel}
                    </div>
                  </div>
                </div>
                <p className="mt-5 max-w-md text-xs leading-relaxed text-ink/55">
                  On your first eligible purchase. Subject to offer eligibility and conditions.{' '}
                  <button
                    onClick={() => openLegal('cashback')}
                    className="underline decoration-gold-deep/60 underline-offset-4 hover:text-gold-deep"
                  >
                    Read the Cashback Terms
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
