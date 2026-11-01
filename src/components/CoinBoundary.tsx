import { Component, type ReactNode } from 'react';
import { AvenzoMark } from './brand/Logos';

/**
 * If WebGL is unavailable (or the 3D scene throws) the page still works:
 * we show a static gold emblem instead of the animated coin.
 */
export default class CoinBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.warn('AvenZo 3D scene unavailable, using static fallback.', error);
  }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div
        className="pointer-events-none fixed inset-0 z-10 flex items-center justify-center"
        aria-hidden="true"
      >
        <div
          className="flex h-[min(60vw,42vh)] w-[min(60vw,42vh)] items-center justify-center rounded-full"
          style={{
            background:
              'radial-gradient(circle at 30% 28%, #fff1b8 0%, #d4af37 38%, #7a5a14 78%, #3d2c08 100%)',
            boxShadow: '0 30px 80px rgba(212,175,55,0.25)',
          }}
        >
          <AvenzoMark className="h-3/4 w-3/4 opacity-60 mix-blend-multiply" />
        </div>
      </div>
    );
  }
}
