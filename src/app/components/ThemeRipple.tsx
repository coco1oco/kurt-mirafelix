import { useEffect, useRef, useState } from 'react';
import type { RippleOrigin } from '../hooks/useDarkMode';

interface ThemeRippleProps {
  origin: RippleOrigin;
  targetDark: boolean;
  id: number;
  onDone: () => void;
  onThemeApply: (dark: boolean) => void;
}

/**
 * Renders a fixed overlay that performs a clip-path circle expansion
 * from the toggle button's position, revealing the new theme beneath.
 *
 * Timeline:
 *  0ms    → overlay mounts at clip-path 0px (invisible circle)
 *  1 RAF  → class added → CSS transition kicks in, expands to full radius
 *  180ms  → theme class toggled on <html>
 *  500ms  → clip-path fully expanded
 *  520ms  → overlay begins fading
 *  660ms  → component unmounts
 */
export function ThemeRipple({ origin, targetDark, id, onDone, onThemeApply }: ThemeRippleProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Compute max radius to cover entire viewport from origin
    const maxRadius = Math.hypot(
      Math.max(origin.x, window.innerWidth - origin.x),
      Math.max(origin.y, window.innerHeight - origin.y)
    ) + 50; // small buffer

    const el = overlayRef.current;
    if (!el) return;

    // Set dynamic CSS custom properties
    el.style.setProperty('--rx', `${origin.x}px`);
    el.style.setProperty('--ry', `${origin.y}px`);
    el.style.setProperty('--rmax', `${maxRadius}px`);

    // Next frame: trigger CSS transition expansion
    const raf = requestAnimationFrame(() => {
      setExpanded(true);
    });

    // Apply theme at midpoint so the reveal feels seamless
    const applyTimer = setTimeout(() => onThemeApply(targetDark), 180);

    // Start fade-out after clip-path is done
    const fadeTimer = setTimeout(() => setFading(true), 520);

    // Unmount after fade completes
    const doneTimer = setTimeout(() => onDone(), 680);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(applyTimer);
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const bg = targetDark ? '#000000' : '#ffffff';

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        pointerEvents: 'none',
        backgroundColor: bg,
        // Start: tiny circle at origin
        clipPath: expanded
          ? 'circle(var(--rmax, 150vmax) at var(--rx, 50%) var(--ry, 50%))'
          : 'circle(0px at var(--rx, 50%) var(--ry, 50%))',
        transition: fading
          ? 'opacity 140ms ease'
          : 'clip-path 500ms cubic-bezier(0.22, 1, 0.36, 1)',
        opacity: fading ? 0 : 1,
        willChange: 'clip-path, opacity',
      }}
    />
  );
}
