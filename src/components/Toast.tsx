import { useEffect, useRef, useState } from 'react';

export default function Toast() {
  const [msg, setMsg] = useState<string | null>(null);
  const timer = useRef<number>();

  useEffect(() => {
    const on = (e: Event) => {
      setMsg((e as CustomEvent<string>).detail);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setMsg(null), 3600);
    };
    window.addEventListener('avz:toast', on);
    return () => {
      window.removeEventListener('avz:toast', on);
      window.clearTimeout(timer.current);
    };
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`pointer-events-none fixed inset-x-0 bottom-6 z-[90] flex justify-center px-4 transition-all duration-500 ${
        msg ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
    >
      <div className="border border-gold/50 bg-black/90 px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur">
        {msg}
      </div>
    </div>
  );
}
