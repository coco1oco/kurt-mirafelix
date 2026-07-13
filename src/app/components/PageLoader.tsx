import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Entrance stagger variants
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
  exit: {
    transition: { staggerChildren: 0.04, staggerDirection: -1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, y: -12, transition: { duration: 0.38, ease: [0.55, 0, 1, 0.45] } },
};

export function PageLoader({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'enter' | 'exit'>('enter');
  const [progress, setProgress] = useState(0);
  const [barWidth, setBarWidth] = useState(0);
  const progressRef = useRef(0);

  // ── progress ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      progressRef.current = Math.min(
        progressRef.current + (100 - progressRef.current) * 0.09 + 0.8,
        100
      );
      const p = Math.floor(progressRef.current);
      setProgress(p);
      setBarWidth(progressRef.current);

      if (progressRef.current >= 100) {
        clearInterval(interval);
        // Short pause so user sees 100%, then exit
        setTimeout(() => setPhase('exit'), 320);
      }
    }, 22);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {phase === 'enter' && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[10000] bg-white dark:bg-[#0c0c0f] overflow-hidden"
          exit={{ y: '-100%', transition: { duration: 0.88, ease: [0.76, 0, 0.24, 1], delay: 0.26 } }}
        >
          {/* ── Halftone motif — light mode ───────────────────────────────── */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(10,10,10,0.9) 1px, transparent 1px)',
              backgroundSize: '9px 9px',
              opacity: 0.13,
              maskImage: 'radial-gradient(ellipse 60% 60% at 80% 80%, black 0%, transparent 100%)',
              WebkitMaskImage: 'radial-gradient(ellipse 60% 60% at 80% 80%, black 0%, transparent 100%)',
            }}
          />
          {/* ── Halftone motif — dark mode ────────────────────────────────── */}
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

          {/* ── Staggered content ─────────────────────────────────────────── */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={phase === 'enter' ? 'visible' : 'exit'}
          >
            {/* Name — anchored bottom-left */}
            <motion.div
              variants={itemVariants}
              className="absolute bottom-16 left-8 sm:left-12 select-none"
            >
              <div className="font-pixel text-5xl sm:text-6xl md:text-7xl text-gray-900 dark:text-gray-100 leading-none lowercase tracking-tight">
                kurt
              </div>
              <div className="font-pixel text-5xl sm:text-6xl md:text-7xl text-gray-900 dark:text-gray-100 leading-none lowercase tracking-tight">
                mirafelix
              </div>
            </motion.div>

            {/* Micro-label */}
            <motion.div
              variants={itemVariants}
              className="absolute bottom-10 left-8 sm:left-12"
            >
              <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-gray-400 dark:text-[#8a8a92]">
                portfolio · {new Date().getFullYear()}
              </span>
            </motion.div>

            {/* Progress counter — bottom-right */}
            <motion.div
              variants={itemVariants}
              className="absolute bottom-[3.65rem] right-8 sm:right-12"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-gray-900 dark:text-gray-100 tabular-nums">
                {progress.toString().padStart(3, '0')}
              </span>
              <span className="font-mono text-[10px] tracking-[0.06em] text-gray-400 dark:text-[#8a8a92]">
                %
              </span>
            </motion.div>
          </motion.div>

          {/* ── Progress bar — hairline at bottom ─────────────────────────── */}
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gray-200 dark:bg-[#2a2a30]">
            <div
              className="h-full bg-gray-900 dark:bg-gray-100"
              style={{
                width: `${barWidth}%`,
                transition: 'width 120ms linear',
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
