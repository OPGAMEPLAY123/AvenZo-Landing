import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { AvenzoMark } from './brand/Logos';
import Cta from './Cta';
import { config, copy } from '../config';
import { ScrollTrigger } from '../lib/motion';
import { scrollToId, startScroll, stopScroll } from '../lib/scroll';
import { cx } from '../lib/utils';

const LINKS = [
  { label: 'Cashback', id: 'cashback' },
  { label: 'How it works', id: 'how-it-works' },
  { label: 'Why AvenZo', id: 'why' },
];

export default function Navbar({ visible }: { visible: boolean }) {
  const [light, setLight] = useState(false);
  const [open, setOpen] = useState(false);

  // Flip nav colours depending on which section sits under it.
  useEffect(() => {
    const triggers = Array.from(document.querySelectorAll<HTMLElement>('[data-theme]')).map((el) =>
      ScrollTrigger.create({
        trigger: el,
        start: 'top 36px',
        end: 'bottom 36px',
        onToggle: (self) => self.isActive && setLight(el.dataset.theme === 'light'),
      }),
    );
    return () => triggers.forEach((t) => t.kill());
  }, []);

  useEffect(() => {
    if (!open) return;
    stopScroll();
    return () => startScroll();
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    // let the menu release scroll lock first
    window.setTimeout(() => scrollToId(id), open ? 60 : 0);
  };

  const tone = light && !open ? 'text-ink' : 'text-white';

  return (
    <>
      <header
        className={cx(
          'fixed inset-x-0 top-0 z-50 transition-all duration-700',
          visible ? 'translate-y-0 opacity-100' : '-translate-y-6 opacity-0',
          tone,
        )}
      >
        <nav className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-5 md:px-12" aria-label="Primary">
          <button
            onClick={() => go('hero')}
            className="flex items-center gap-3 focus-visible:outline-2 focus-visible:outline-gold"
            aria-label="AvenZo, back to top"
          >
            <AvenzoMark className="h-8 w-8" />
            <span className="text-sm font-extrabold tracking-[0.34em]">AVENZO</span>
          </button>

          <ul className="hidden items-center gap-10 md:flex">
            {LINKS.map((l) => (
              <li key={l.id}>
                <button
                  onClick={() => go(l.id)}
                  className="group relative py-2 text-[0.7rem] font-semibold uppercase tracking-[0.26em]"
                >
                  {l.label}
                  <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gold transition-transform duration-500 group-hover:scale-x-100" />
                </button>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-6 md:flex">
            <a
              href={config.loginUrl || '#'}
              onClick={(e) => {
                if (!config.loginUrl) {
                  e.preventDefault();
                  window.dispatchEvent(new CustomEvent('avz:toast', { detail: copy.loginSoon }));
                }
              }}
              className="text-[0.7rem] font-semibold uppercase tracking-[0.26em] transition-opacity hover:opacity-60"
            >
              Login
            </a>
            <Cta href={config.signupUrl} fallback={copy.loginSoon} arrow={false} className="[&>span]:py-3">
              Get Started
            </Cta>
          </div>

          <button
            className="p-2 md:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>
      </header>

      {/* Mobile menu */}
      <div
        className={cx(
          'fixed inset-0 z-40 flex flex-col justify-between bg-black px-6 pb-10 pt-28 text-white transition-all duration-700 ease-[cubic-bezier(.7,0,.2,1)] md:hidden',
          open ? 'visible opacity-100 [clip-path:inset(0_0_0_0)]' : 'invisible opacity-0 [clip-path:inset(0_0_100%_0)]',
        )}
        aria-hidden={!open}
      >
        <ul className="space-y-6">
          {LINKS.map((l, i) => (
            <li key={l.id}>
              <button onClick={() => go(l.id)} className="flex items-baseline gap-4 text-left">
                <span className="text-xs tracking-[0.3em] text-gold">0{i + 1}</span>
                <span className="text-4xl font-extrabold uppercase tracking-tight">{l.label}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-4">
          <Cta href={config.shopUrl} fallback={copy.shopSoon}>
            Start Shopping
          </Cta>
          <Cta variant="outline" href={config.signupUrl} fallback={copy.loginSoon} arrow={false}>
            Login / Get Started
          </Cta>
        </div>
      </div>
    </>
  );
}
