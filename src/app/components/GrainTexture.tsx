import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

export function GrainTexture() {
  const reduceMotion = usePrefersReducedMotion();

  if (reduceMotion) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9998] opacity-[0.015]">
      <svg className="w-full h-full">
        <filter id="noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="1"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>
    </div>
  );
}
