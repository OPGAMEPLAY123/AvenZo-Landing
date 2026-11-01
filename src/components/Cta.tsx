import type { ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { cx } from '../lib/utils';
import { showToast } from '../lib/ui';

type Variant = 'gold' | 'outline' | 'outlineDark';

const styles: Record<Variant, { box: string; sweep: string; text: string }> = {
  gold: {
    box: 'bg-white text-ink',
    sweep: 'bg-neutral-300',
    text: '',
  },
  outline: {
    box: 'border border-white/40 text-white',
    sweep: 'bg-white',
    text: 'group-hover:text-ink',
  },
  outlineDark: {
    box: 'border border-ink/30 text-ink',
    sweep: 'bg-ink',
    text: 'group-hover:text-white',
  },
};

interface Props {
  children: ReactNode;
  variant?: Variant;
  className?: string;
  /** In-page action. */
  onClick?: () => void;
  /** External destination. An empty string shows `fallback` instead of a dead link. */
  href?: string;
  fallback?: string;
  arrow?: boolean;
}

export default function Cta({
  children,
  variant = 'gold',
  className,
  onClick,
  href,
  fallback = 'Coming soon.',
  arrow = true,
}: Props) {
  const v = styles[variant];
  const inner = (
    <span
      className={cx(
        'relative inline-flex items-center justify-center overflow-hidden px-7 py-4 text-[0.72rem] font-bold uppercase tracking-[0.28em] transition-colors duration-500',
        v.box,
      )}
    >
      <span
        aria-hidden="true"
        className={cx(
          'absolute inset-0 translate-y-[101%] transition-transform duration-500 ease-[cubic-bezier(.7,0,.2,1)] group-hover:translate-y-0',
          v.sweep,
        )}
      />
      <span className={cx('relative z-10 flex items-center gap-3 transition-colors duration-500', v.text)}>
        {children}
        {arrow && (
          <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        )}
      </span>
    </span>
  );
  const cls = cx('group inline-block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold', className);

  if (href !== undefined) {
    const live = href.length > 0;
    return (
      <a
        href={live ? href : '#'}
        className={cls}
        onClick={(e) => {
          if (!live) {
            e.preventDefault();
            showToast(fallback);
          }
        }}
      >
        {inner}
      </a>
    );
  }
  return (
    <button type="button" className={cls} onClick={onClick}>
      {inner}
    </button>
  );
}
