import { useLayoutEffect, useRef } from 'react';
import SplitText from '../components/SplitText';
import { gsap, prefersReducedMotion } from '../lib/motion';

const POINTS = [
  { title: 'Discover deals.', note: 'Explore offers from supported shopping and partner platforms in one place.' },
  { title: 'Track cashback.', note: 'Check available tracking information and cashback status through the features provided by AvenZo.' },
  { title: 'One simple experience.', note: 'Discover offers, open partner shopping links, and access your rewards from a unified platform.' },
];

export default function Why() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.why-row').forEach((row) => {
        gsap.from(row, {
          y: 70,
          autoAlpha: 0,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: row, start: 'top 88%', once: true },
        });
        gsap.from(row.querySelector('.why-line'), {
          scaleX: 0,
          transformOrigin: 'left center',
          duration: 1.4,
          ease: 'power4.out',
          scrollTrigger: { trigger: row, start: 'top 88%', once: true },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="why" ref={root} data-theme="light" className="relative">
      <div className="absolute inset-0 z-0 bg-bone" />
      <div className="relative z-20 mx-auto max-w-[1600px] px-5 py-[16svh] text-ink md:px-12">
        <p className="mb-6 text-[0.65rem] font-bold uppercase tracking-[0.45em] text-gold-deep md:text-xs">Why AvenZo</p>
        <h2 className="text-[11vw] font-extrabold uppercase leading-[0.92] tracking-[-0.035em] md:text-[7.4vw]">
          <SplitText as="span" text="Why" className="block pb-[0.04em]" />
          <SplitText as="span" text="AvenZo?" className="block pb-[0.04em] text-gold-mid" delay={0.15} />
        </h2>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-ink/65 md:text-lg">A simpler way to discover cashback opportunities while shopping online.</p>

        <ul className="mt-[12svh] md:mt-[14svh]">
          {POINTS.map((p, i) => (
            <li key={p.title} className="why-row group relative">
              <div className="why-line absolute inset-x-0 top-0 h-px bg-ink/20" />
              <div className="grid items-baseline gap-3 py-8 md:grid-cols-[6rem_1fr_22rem] md:gap-8 md:py-12">
                <span className="text-xs font-bold tracking-[0.3em] text-gold-deep">0{i + 1}</span>
                <h3 className="text-[7.4vw] font-extrabold uppercase leading-[1] tracking-[-0.03em] transition-transform duration-700 ease-[cubic-bezier(.2,.7,.2,1)] group-hover:translate-x-3 md:text-[3.8vw]">
                  {p.title}
                </h3>
                <p className="text-sm leading-relaxed text-ink/60 md:text-base">{p.note}</p>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gold-deep transition-transform duration-700 ease-[cubic-bezier(.7,0,.2,1)] group-hover:scale-x-100" />
            </li>
          ))}
        </ul>
        <div className="h-px w-full bg-ink/20" />
      </div>
    </section>
  );
}
