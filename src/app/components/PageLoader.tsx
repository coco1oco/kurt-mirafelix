import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export function PageLoader({ onComplete }: { onComplete: () => void }) {
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);

  const overlayRef    = useRef<HTMLDivElement>(null);
  const nameRef       = useRef<HTMLDivElement>(null);
  const labelRef      = useRef<HTMLDivElement>(null);
  const counterRef    = useRef<HTMLDivElement>(null);
  const barFillRef    = useRef<HTMLDivElement>(null);

  // ── entrance ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!nameRef.current || !labelRef.current || !counterRef.current) return;
    const els = [nameRef.current, labelRef.current, counterRef.current];
    gsap.set(els, { opacity: 0, y: 14 });
    gsap.to(els, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      stagger: 0.07,
      ease: 'power3.out',
      delay: 0.1,
    });
  }, []);

  // ── progress ──────────────────────────────────────────────────────────────
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    interval = setInterval(() => {
      progressRef.current = Math.min(
        progressRef.current + (100 - progressRef.current) * 0.09 + 0.8,
        100
      );
      const p = Math.floor(progressRef.current);
      setProgress(p);

      // Drive the bar fill directly via GSAP for silky smoothness
      if (barFillRef.current) {
        gsap.to(barFillRef.current, {
          width: `${progressRef.current}%`,
          duration: 0.12,
          ease: 'none',
          overwrite: 'auto',
        });
      }

      if (progressRef.current >= 100) {
        clearInterval(interval);
        // Short pause so user sees 100%, then exit
        setTimeout(triggerExit, 320);
      }
    }, 22);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── exit ──────────────────────────────────────────────────────────────────
  function triggerExit() {
    if (!overlayRef.current || !nameRef.current || !labelRef.current || !counterRef.current) {
      setIsExiting(true);
      onComplete();
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => { setIsExiting(true); onComplete(); },
    });

    // 1 — content fades up slightly ahead of the panel
    tl.to([nameRef.current, counterRef.current, labelRef.current], {
      opacity: 0,
      y: -12,
      duration: 0.38,
      stagger: 0.04,
      ease: 'power2.in',
    })
    // 2 — panel slides up revealing hero beneath
    .to(overlayRef.current, {
      yPercent: -100,
      duration: 0.88,
      ease: 'power3.inOut',
    }, '-=0.12');
  }

  if (isExiting) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[10000] bg-white dark:bg-[#0c0c0f] overflow-hidden"
    >
      {/* ── Halftone motif — diagonal radial fade from bottom-right ─────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: [
            'radial-gradient(circle, rgba(10,10,10,0.9) 1px, transparent 1px)',
          ].join(','),
          backgroundSize: '9px 9px',
          opacity: 0.13,
          maskImage: 'radial-gradient(ellipse 60% 60% at 80% 80%, black 0%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 60% 60% at 80% 80%, black 0%, transparent 100%)',
        }}
      />
      {/* dark-mode variant — inlined so it responds to .dark class */}
      <div
        className="absolute inset-0 pointer-events-none hidden dark:block"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(244,244,245,0.9) 1px, transparent 1px)',
          backgroundSize: '9px 9px',
          opacity: 0.38,
          maskImage: 'radial-gradient(ellipse 60% 60% at 80% 80%, black 0%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 60% 60% at 80% 80%, black 0%, transparent 100%)',
        }}
      />

      {/* ── Name — anchored bottom-left, editorial ───────────────────────── */}
      <div
        ref={nameRef}
        className="absolute bottom-16 left-8 sm:left-12 select-none"
      >
        <div className="font-pixel text-5xl sm:text-6xl md:text-7xl text-gray-900 dark:text-gray-100 leading-none lowercase tracking-tight">
          kurt
        </div>
        <div className="font-pixel text-5xl sm:text-6xl md:text-7xl text-gray-900 dark:text-gray-100 leading-none lowercase tracking-tight">
          mirafelix
        </div>
      </div>

      {/* ── Micro-label — bottom-left below name ─────────────────────────── */}
      <div
        ref={labelRef}
        className="absolute bottom-10 left-8 sm:left-12"
      >
        <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-gray-400 dark:text-[#8a8a92]">
          portfolio · {new Date().getFullYear()}
        </span>
      </div>

      {/* ── Progress counter — bottom-right ──────────────────────────────── */}
      <div
        ref={counterRef}
        className="absolute bottom-[3.65rem] right-8 sm:right-12"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-gray-900 dark:text-gray-100 tabular-nums">
          {progress.toString().padStart(3, '0')}
        </span>
        <span className="font-mono text-[10px] tracking-[0.06em] text-gray-400 dark:text-[#8a8a92]">
          %
        </span>
      </div>

      {/* ── Progress bar — hairline at bottom ────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gray-200 dark:bg-[#2a2a30]">
        <div
          ref={barFillRef}
          className="h-full bg-gray-900 dark:bg-gray-100"
          style={{ width: '0%' }}
        />
      </div>
    </div>
  );
}
