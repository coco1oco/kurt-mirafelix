import { useState, useEffect, useCallback } from 'react';

export interface RippleOrigin {
  x: number;
  y: number;
}

export interface DarkModeReturn {
  isDark: boolean;
  toggle: () => void;
  toggleWithRipple: (origin: RippleOrigin) => void;
}

export function useDarkMode(): DarkModeReturn {
  const [isDark, setIsDark] = useState<boolean>(() => {
    // Only go dark if the user has explicitly chosen dark mode before.
    // Never infer from system preference — portfolio defaults to light.
    const stored = localStorage.getItem('theme');
    return stored === 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggle = useCallback(() => setIsDark(prev => !prev), []);

  const toggleWithRipple = useCallback((origin: RippleOrigin) => {
    const applyTheme = () => setIsDark(prev => !prev);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Use the View Transitions API for a seamless circular reveal of the actual
    // new-theme content. Falls back to an instant switch if unsupported or if reduced motion is preferred.
    if ('startViewTransition' in document && !prefersReducedMotion) {
      // @ts-ignore
      const transition = document.startViewTransition(applyTheme);
      transition.ready.then(() => {
        const radius = Math.hypot(
          Math.max(origin.x, window.innerWidth - origin.x),
          Math.max(origin.y, window.innerHeight - origin.y)
        );
        document.documentElement.animate(
          [
            { clipPath: `circle(0px at ${origin.x}px ${origin.y}px)` },
            { clipPath: `circle(${radius}px at ${origin.x}px ${origin.y}px)` }
          ],
          {
            duration: 540,
            easing: 'cubic-bezier(1, 0.1, 0.3, 0.5)', // The SKILL.md strong ease-out curve
            pseudoElement: '::view-transition-new(root)'
          }
        );
      });
    } else {
      applyTheme();
    }
  }, []);

  return { isDark, toggle, toggleWithRipple };
}
