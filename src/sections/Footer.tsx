import { AvenzoMark, OpgMark } from '../components/brand/Logos';
import Cta from '../components/Cta';
import { config, copy } from '../config';
import { scrollToId } from '../lib/scroll';
import { openLegal, showToast } from '../lib/ui';

const linkCls =
  'group relative inline-block py-1 text-sm text-white/70 transition-colors duration-300 hover:text-white focus-visible:outline-2 focus-visible:outline-gold';

function Underline() {
  return (
    <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gold transition-transform duration-500 group-hover:scale-x-100" />
  );
}

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer id="footer" data-theme="dark" className="relative overflow-hidden">
      <div className="absolute inset-0 z-0 bg-black" />
      <div className="relative z-20 mx-auto max-w-[1600px] px-5 pb-6 pt-24 md:px-12 md:pt-32">
        <div className="flex flex-col gap-10 border-b border-white/15 pb-16 md:flex-row md:items-end md:justify-between">
          <h2 className="max-w-3xl text-[10vw] font-extrabold uppercase leading-[0.95] tracking-[-0.03em] md:text-[5vw]">
            Ready when <span className="text-gold-gradient">you are.</span>
          </h2>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
            <Cta href={config.shopUrl} fallback={copy.shopSoon}>
              Start Shopping
            </Cta>
            <Cta variant="outline" arrow={false} href={config.signupUrl} fallback={copy.loginSoon}>
              Login / Get Started
            </Cta>
          </div>
        </div>

        <div className="grid gap-12 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <AvenzoMark className="h-10 w-10" />
              <span className="text-sm font-extrabold tracking-[0.34em]">AVENZO</span>
            </div>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.35em] text-gold">Shop. Earn. Cashback.</p>
            <p className="mt-5 max-w-xs text-xs leading-relaxed text-white/45">{copy.disclaimer}</p>
          </div>

          <nav aria-label="Explore">
            <h3 className="mb-4 text-[0.65rem] font-bold uppercase tracking-[0.35em] text-white/40">Explore</h3>
            <ul className="space-y-1">
              {[
                ['Cashback', 'cashback'],
                ['How it works', 'how-it-works'],
                ['Why AvenZo', 'why'],
              ].map(([label, id]) => (
                <li key={id}>
                  <button className={linkCls} onClick={() => scrollToId(id)}>
                    {label}
                    <Underline />
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Legal">
            <h3 className="mb-4 text-[0.65rem] font-bold uppercase tracking-[0.35em] text-white/40">Legal</h3>
            <ul className="space-y-1">
              {[
                ['Terms and Conditions', 'terms'],
                ['Privacy Policy', 'privacy'],
                ['Cashback Terms', 'cashback'],
              ].map(([label, id]) => (
                <li key={id}>
                  <button className={linkCls} onClick={() => openLegal(id as 'terms' | 'privacy' | 'cashback')}>
                    {label}
                    <Underline />
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Follow">
            <h3 className="mb-4 text-[0.65rem] font-bold uppercase tracking-[0.35em] text-white/40">Follow</h3>
            <ul className="space-y-1">
              {config.socials.map((s) => (
                <li key={s.name}>
                  <a
                    className={linkCls}
                    href={s.url || '#'}
                    target={s.url ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      if (!s.url) {
                        e.preventDefault();
                        showToast(`Our ${s.name} page is coming soon.`);
                      }
                    }}
                  >
                    {s.name}
                    <Underline />
                  </a>
                </li>
              ))}
              {config.contactEmail && (
                <li>
                  <a className={linkCls} href={`mailto:${config.contactEmail}`}>
                    Contact
                    <Underline />
                  </a>
                </li>
              )}
            </ul>
          </nav>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/15 pt-6 text-xs text-white/45 md:flex-row md:items-center md:justify-between">
          <p>© {year} AvenZo. All rights reserved.</p>
          <a
            href={config.opgUrl || '#'}
            target={config.opgUrl ? '_blank' : undefined}
            rel="noopener noreferrer"
            onClick={(e) => {
              if (!config.opgUrl) {
                e.preventDefault();
                showToast('OPG Studios — AvenZo is proudly powered by us.');
              }
            }}
            className="group flex items-center gap-3 transition-colors hover:text-white"
          >
            <span className="uppercase tracking-[0.3em]">Powered by</span>
            <OpgMark className="h-5 w-5 text-white" />
            <span className="font-bold uppercase tracking-[0.2em] text-white">OPG Studios</span>
          </a>
        </div>
      </div>

      <div
        className="outline-light pointer-events-none relative z-10 -mb-[3.5vw] select-none whitespace-nowrap text-center text-[23vw] font-extrabold leading-[0.8] tracking-[-0.04em]"
        aria-hidden="true"
      >
        AVENZO
      </div>
    </footer>
  );
}
