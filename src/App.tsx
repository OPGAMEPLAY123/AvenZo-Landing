import { useCallback, useEffect, useState } from 'react';
import Loader from './components/Loader';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import LegalModal from './components/LegalModal';
import CoinBoundary from './components/CoinBoundary';
import Scene from './three/Scene';
import Hero from './sections/Hero';
import Cashback from './sections/Cashback';
import HowItWorks from './sections/HowItWorks';
import Partners from './sections/Partners';
import Why from './sections/Why';
import Finale from './sections/Finale';
import Footer from './sections/Footer';
import { gsap, ScrollTrigger, intro, prefersReducedMotion } from './lib/motion';
import { initSmoothScroll } from './lib/scroll';
import { rebuildChoreography } from './lib/choreography';
import { useIsMobile } from './lib/useIsMobile';

export default function App() {
  const isMobile = useIsMobile();
  const [revealed, setRevealed] = useState(prefersReducedMotion);
  const [loaded, setLoaded] = useState(prefersReducedMotion);

  // Smooth scrolling, driven by GSAP's ticker so ScrollTrigger stays in sync.
  useEffect(() => initSmoothScroll(), []);

  // Keep the coin's scroll choreography measured against the live layout.
  useEffect(() => {
    const rebuild = () => rebuildChoreography(isMobile);
    rebuild();
    ScrollTrigger.addEventListener('refresh', rebuild);
    const refresh = () => ScrollTrigger.refresh();
    if (document.fonts?.ready) document.fonts.ready.then(refresh);
    window.addEventListener('load', refresh);
    return () => {
      ScrollTrigger.removeEventListener('refresh', rebuild);
      window.removeEventListener('load', refresh);
    };
  }, [isMobile]);

  const onReveal = useCallback(() => {
    setRevealed(true);
    if (!prefersReducedMotion) gsap.to(intro, { p: 1, duration: 3.2, ease: 'power3.out' });
  }, []);
  const onDone = useCallback(() => {
    setLoaded(true);
    ScrollTrigger.refresh();
  }, []);

  return (
    <>
      <CoinBoundary>
        <Scene isMobile={isMobile} />
      </CoinBoundary>

      <Navbar visible={revealed} />

      <main>
        <Hero ready={revealed} />
        <Cashback />
        <HowItWorks />
        <Partners />
        <Why />
        <Finale />
      </main>
      <Footer />

      <LegalModal />
      <Toast />
      {!loaded && <Loader onReveal={onReveal} onDone={onDone} />}
    </>
  );
}
