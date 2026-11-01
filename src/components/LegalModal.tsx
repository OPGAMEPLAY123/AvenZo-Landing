import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { LEGAL } from './legal';
import type { LegalId } from '../lib/ui';
import { startScroll, stopScroll } from '../lib/scroll';

const isLegalId = (v: string): v is LegalId => v === 'terms' || v === 'privacy' || v === 'cashback';

export default function LegalModal() {
  const [id, setId] = useState<LegalId | null>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const on = (e: Event) => {
      lastFocus.current = document.activeElement as HTMLElement | null;
      setId((e as CustomEvent<LegalId>).detail);
    };
    window.addEventListener('avz:legal', on);
    const fromHash = window.location.hash.slice(1);
    if (isLegalId(fromHash)) setId(fromHash);
    return () => window.removeEventListener('avz:legal', on);
  }, []);

  useEffect(() => {
    if (!id) return;
    stopScroll();
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    history.replaceState(null, '', `#${id}`);
    return () => {
      window.removeEventListener('keydown', onKey);
      startScroll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const close = () => {
    setId(null);
    history.replaceState(null, '', window.location.pathname + window.location.search);
    lastFocus.current?.focus?.();
  };

  if (!id) return null;
  const doc = LEGAL[id];

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-black/80 backdrop-blur-sm md:items-center md:p-8"
      onMouseDown={(e) => e.target === e.currentTarget && close()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="legal-title"
        className="relative flex max-h-[90svh] w-full max-w-3xl flex-col border border-white/15 bg-[#0a0a0a] text-white"
      >
        <div className="flex items-start justify-between gap-6 border-b border-white/10 px-6 py-6 md:px-10">
          <div>
            <h2 id="legal-title" className="text-2xl font-extrabold uppercase tracking-tight md:text-3xl">
              {doc.title}
            </h2>
            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-white/45">{doc.updated}</p>
          </div>
          <button
            ref={closeBtn}
            onClick={close}
            aria-label="Close"
            className="shrink-0 border border-white/25 p-2 transition-colors hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-gold"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div data-lenis-prevent className="overflow-y-auto px-6 pb-10 pt-2 md:px-10">
          {doc.body}
          <p className="mt-10 border-t border-white/10 pt-6 text-xs leading-relaxed text-white/45">
            Cashback is not guaranteed. It depends on offer eligibility and the applicable offer terms.
          </p>
        </div>
      </div>
    </div>
  );
}
