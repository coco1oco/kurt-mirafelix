import { ReactNode, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    // When the user prefers reduced motion, skip Lenis entirely and fall back
    // to native scrolling. Anchor clicks use scrollIntoView instead.
    if (reduceMotion) {
      const handleNativeAnchor = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const anchor = target.closest('a[href^="#"]');
        if (!anchor) return;
        const href = anchor.getAttribute('href');
        if (!href) return;
        e.preventDefault();
        if (href === '#' || href.length <= 1) {
          window.scrollTo({ top: 0 });
          return;
        }
        try {
          document.querySelector(href)?.scrollIntoView();
        } catch {
          // invalid selector, ignore
        }
      };
      document.addEventListener('click', handleNativeAnchor);
      return () => document.removeEventListener('click', handleNativeAnchor);
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenisRef.current = lenis;
    // @ts-ignore - expose globally for modals to lock scroll
    window.lenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Handle anchor link clicks
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');

      if (anchor) {
        const href = anchor.getAttribute('href');
        if (!href) return;
        e.preventDefault();
        if (href === '#' || href.length <= 1) {
          lenis.scrollTo(0, { duration: 1.5 });
          return;
        }
        try {
          const element = document.querySelector(href) as HTMLElement;
          if (element) {
            lenis.scrollTo(element, { offset: 0, duration: 1.5 });
          }
        } catch {
          // invalid selector, ignore
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      lenis.destroy();
      document.removeEventListener('click', handleAnchorClick);
    };
  }, [reduceMotion]);

  return <>{children}</>;
}
