import { useLayoutEffect, useRef } from 'react';
import SplitText from '../components/SplitText';
import { gsap, prefersReducedMotion } from '../lib/motion';

const PARTNERS = ['Amazon', 'Flipkart', 'Meesho', 'Myntra', 'AJIO', 'Tata CLiQ'];

export default function Partners() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.from('.pt-item', {
        y: 50,
        autoAlpha: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: { trigger: '.pt-grid', start: 'top 85%', once: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="partners" ref={root} data-theme="dark" className="relative">
      <div className="absolute inset-0 z-0 bg-black" />
      <div className="relative z-20 mx-auto max-w-[1600px] px-5 py-[16svh] md:px-12">
        <p className="mb-6 text-[0.65rem] font-bold uppercase tracking-[0.45em] text-gold md:text-xs">Featured partners</p>
        <h2 className="text-[10vw] font-extrabold uppercase leading-[0.95] tracking-[-0.03em] md:text-[5.4vw]">
          <SplitText as="span" text="Brands you know" className="block pb-[0.04em]" />
          <SplitText as="span" text="and love." className="block pb-[0.04em] text-gold" delay={0.15} />
        </h2>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-white/60 md:text-lg">
          Explore offers from brands you know and love.
        </p>

        <ul className="pt-grid mt-[10svh] grid grid-cols-2 border-l border-t border-white/15 md:grid-cols-3">
          {PARTNERS.map((name, i) => (
            <li
              key={name}
              className="pt-item group relative flex min-h-[28svw] items-end justify-between overflow-hidden border-b border-r border-white/15 p-5 md:min-h-[14vw] md:p-8"
            >
              <span className="absolute inset-0 origin-bottom scale-y-0 bg-gold transition-transform duration-700 ease-[cubic-bezier(.7,0,.2,1)] group-hover:scale-y-100" />
              <span className="relative text-[0.65rem] font-bold tracking-[0.3em] text-gold transition-colors duration-500 group-hover:text-ink">
                0{i + 1}
              </span>
              <span className="relative text-[6vw] font-extrabold uppercase leading-none tracking-[-0.02em] transition-colors duration-500 group-hover:text-ink md:text-[2.4vw]">
                {name}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-xs text-white/40">
          Brand names belong to their respective owners. Offers depend on each partner's terms; cashback is not guaranteed.
        </p>
      </div>
    </section>
  );
}
