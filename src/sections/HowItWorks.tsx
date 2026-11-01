import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import SplitText from '../components/SplitText';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/motion';

const STEPS = [
  { n: '01', title: 'Shop', body: 'Discover offers from participating brands and open your preferred deal through AvenZo.' },
  { n: '02', title: 'Earn', body: 'Complete an eligible purchase and allow the partner to track and confirm the cashback.' },
  { n: '03', title: 'Redeem', body: 'Use your available rewards through the redemption options supported by AvenZo.' },
];

export default function HowItWorks() {
  const root = useRef<HTMLElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const stepEls = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(-1);

  // Progress → active step, rail fill.
  useLayoutEffect(() => {
    const st = ScrollTrigger.create({
      trigger: root.current,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        if (rail.current) rail.current.style.transform = `scaleX(${self.progress})`;
        const idx = Math.min(STEPS.length - 1, Math.floor(self.progress * STEPS.length));
        setActive((prev) => (prev < 0 && self.progress <= 0 ? prev : idx));
      },
    });
    const enter = ScrollTrigger.create({
      trigger: root.current,
      start: 'top 55%',
      once: true,
      onEnter: () => setActive((p) => (p < 0 ? 0 : p)),
    });
    return () => {
      st.kill();
      enter.kill();
    };
  }, []);

  // Animate step changes.
  useEffect(() => {
    if (active < 0) return;
    stepEls.current.forEach((el, i) => {
      if (!el) return;
      gsap.killTweensOf(el);
      const chars = el.querySelectorAll('.char');
      gsap.killTweensOf(chars);
      if (prefersReducedMotion) {
        gsap.set(el, { autoAlpha: i === active ? 1 : 0 });
        gsap.set(chars, { yPercent: 0 });
        return;
      }
      if (i === active) {
        gsap.fromTo(el, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out' });
        gsap.fromTo(chars, { yPercent: 115 }, { yPercent: 0, duration: 1, stagger: 0.045, ease: 'power4.out' });
      } else {
        gsap.to(el, { autoAlpha: 0, y: -50, duration: 0.5, ease: 'power2.in' });
      }
    });
    if (!prefersReducedMotion) {
      gsap.to('.hw-ring', { scale: (i: number) => 1 + active * 0.28 + i * 0.0, duration: 1.6, ease: 'power3.out' });
    }
  }, [active]);

  return (
    <section id="how-it-works" ref={root} data-theme="dark" className="relative h-[430svh]">
      <div className="absolute inset-0 z-0 bg-black" />

      <div className="sticky top-0 z-20 h-[100svh] overflow-hidden">
        {/* Concentric rings that breathe outward with each step, centred on the coin */}
        <div className="pointer-events-none absolute left-1/2 top-[27%] -translate-x-1/2 -translate-y-1/2 md:left-[25%] md:top-1/2" aria-hidden="true">
          {[34, 52, 72, 96].map((vm, i) => (
            <div
              key={vm}
              className="hw-ring absolute left-1/2 top-1/2 rounded-full border border-gold/20"
              style={{
                width: `${vm}vmin`,
                height: `${vm}vmin`,
                marginLeft: `-${vm / 2}vmin`,
                marginTop: `-${vm / 2}vmin`,
                opacity: 1 - i * 0.2,
              }}
            />
          ))}
        </div>

        <div className="mx-auto flex h-full max-w-[1600px] items-end px-5 pb-24 md:items-center md:px-12 md:pb-0">
          <div className="w-full md:ml-auto md:w-[46%]">
            <p className="mb-6 text-[0.65rem] font-bold uppercase tracking-[0.45em] text-gold md:text-xs">How it works</p>
            <p className="-mt-3 mb-6 text-sm text-white/55 md:text-base">Three simple steps to start earning cashback.</p>

            <div className="relative h-[250px] md:h-[400px]">
              {STEPS.map((s, i) => (
                <div
                  key={s.n}
                  ref={(el) => (stepEls.current[i] = el)}
                  className="invisible absolute inset-0 opacity-0"
                  aria-hidden={active !== i}
                >
                  <div className="outline-gold text-[26vw] font-extrabold leading-[0.85] tracking-[-0.04em] md:text-[12rem]">
                    {s.n}
                  </div>
                  <SplitText
                    text={s.title}
                    auto={false}
                    as="h3"
                    className="mt-3 text-[11vw] font-extrabold uppercase leading-none tracking-[-0.02em] md:mt-5 md:text-[5.2rem]"
                  />
                  <p className="mt-4 max-w-md text-sm leading-relaxed text-white/65 md:mt-6 md:text-lg">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Progress rail */}
        <div className="absolute inset-x-5 bottom-8 z-20 md:inset-x-12 md:bottom-10">
          <div className="flex justify-between text-[0.65rem] font-semibold tracking-[0.3em]">
            {STEPS.map((s, i) => (
              <span key={s.n} className={`transition-colors duration-500 ${active >= i ? 'text-gold' : 'text-white/30'}`}>
                {s.n}
              </span>
            ))}
          </div>
          <div className="mt-3 h-px w-full bg-white/15">
            <div ref={rail} className="h-full origin-left scale-x-0 bg-gold" />
          </div>
        </div>
      </div>
    </section>
  );
}
