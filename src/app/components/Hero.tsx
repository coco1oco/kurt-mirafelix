import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, Download } from 'lucide-react';
import portrait from '../../imports/Generated_Image_May_31__2026_-_1_22AM.jpg';
import avatar from '../../imports/1x1.png';
import { MagneticButton } from './MagneticButton';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { resumeUrl, RESUME_FILENAME } from '../lib/resume';

export function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [revealPos, setRevealPos] = useState({ x: -1000, y: -1000 });
  const [isHovering, setIsHovering] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const reduceMotion = usePrefersReducedMotion();

  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.8]);
  const y = useTransform(scrollY, [0, 300], [0, 100]);

  useEffect(() => {
    if (reduceMotion) return;
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 15,
        y: (e.clientY / window.innerHeight - 0.5) * 15,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [reduceMotion]);

  const handleSectionMouseMove = (e: React.MouseEvent) => {
    if (reduceMotion) return;
    const rect = sectionRef.current?.getBoundingClientRect();
    if (rect) {
      setRevealPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  };

  const REVEAL_RADIUS = 220;

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center px-6 py-20 overflow-hidden bg-white dark:bg-gray-950 transition-colors duration-300"
      onMouseEnter={() => !reduceMotion && setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setRevealPos({ x: -1000, y: -1000 });
      }}
      onMouseMove={handleSectionMouseMove}
      style={{ cursor: isHovering && !reduceMotion ? 'none' : 'auto' }}
    >
      {/* Permanent avatar — top-left corner */}
      <motion.div
        className="absolute top-8 left-8 z-20 group pointer-events-auto"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1.2, ease: 'easeOut' }}
      >
        <div className="relative">
          <img
            src={avatar}
            alt="Kurt Michael Mirafelix"
            className="w-14 h-14 rounded-full object-cover transition-all duration-500 border-2 border-gray-300 group-hover:border-gray-900 shadow-sm"
          />
          {/* Tooltip — slides in on group hover */}
          <div className="absolute left-16 top-1/2 -translate-y-1/2 whitespace-nowrap pointer-events-none opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out">
            <div className="bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-full tracking-wide shadow-lg">
              Kurt Michael Mirafelix
            </div>
            {/* Arrow */}
            <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45" />
          </div>
        </div>
      </motion.div>

      {/* Photo reveal layer — masked to a circle that follows the cursor */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0"
        animate={{ opacity: isHovering ? 1 : 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        style={{
          WebkitMaskImage: `radial-gradient(circle ${REVEAL_RADIUS}px at ${revealPos.x}px ${revealPos.y}px, black 45%, transparent 75%)`,
          maskImage: `radial-gradient(circle ${REVEAL_RADIUS}px at ${revealPos.x}px ${revealPos.y}px, black 45%, transparent 75%)`,
        }}
      >
        <img
          src={portrait}
          alt="Kurt Michael Mirafelix featured"
          className="absolute inset-0 w-full h-full object-cover grayscale"
        />
        {/* Subtle wash to keep things airy */}
        <div className="absolute inset-0 bg-white/10 dark:bg-black/20" />
      </motion.div>

      {/* Cursor ring */}
      <motion.div
        className="absolute pointer-events-none z-30 border border-gray-900/30 rounded-full mix-blend-difference"
        animate={{
          opacity: isHovering ? 1 : 0,
          scale: isHovering ? 1 : 0.5,
        }}
        transition={{ type: 'spring', stiffness: 250, damping: 25 }}
        style={{
          width: REVEAL_RADIUS * 2,
          height: REVEAL_RADIUS * 2,
          left: revealPos.x - REVEAL_RADIUS,
          top: revealPos.y - REVEAL_RADIUS,
        }}
      />

      {/* Geometric background elements */}
      <motion.div
        className="absolute top-20 right-20 w-[500px] h-[500px] border border-gray-100 rounded-full z-10"
        style={{ x: mousePosition.x * 0.5, y: mousePosition.y * 0.5 }}
        animate={reduceMotion ? undefined : { scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-20 left-20 w-[400px] h-[400px] border border-gray-100 z-10"
        style={{ x: -mousePosition.x * 0.3, y: -mousePosition.y * 0.3, rotate: 45 }}
        animate={reduceMotion ? undefined : { scale: [1, 1.08, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      {/* Subtle grid lines */}
      <div className="absolute inset-0 opacity-[0.015] z-10 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-20 max-w-5xl mx-auto text-center space-y-12"
        style={{ opacity, scale, y }}
      >
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-block"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="px-6 py-2 border border-gray-200 dark:border-gray-700 rounded-full text-sm font-medium text-gray-600 dark:text-gray-400 tracking-wide bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
              Computer Science Student
            </div>
          </motion.div>

          <div className="space-y-4 relative">
            <motion.div
              className="absolute -top-10 left-1/2 -translate-x-1/2 text-xs tracking-[0.3em] uppercase text-gray-400 pointer-events-none whitespace-nowrap"
              animate={{ opacity: isHovering ? 0 : 1 }}
              transition={{ duration: 0.3 }}
            >
            </motion.div>

            <motion.h1
              className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold leading-none tracking-tight transition-colors duration-300 mix-blend-difference text-gray-900 dark:text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Kurt Michael
            </motion.h1>
            <motion.h2
              className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tight transition-colors duration-300 mix-blend-difference text-gray-900 dark:text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Mirafelix
            </motion.h2>
          </div>
        </motion.div>

        <motion.div
          className="space-y-6 flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <p className="text-xl sm:text-2xl text-gray-900 dark:text-gray-100 max-w-3xl mx-auto leading-relaxed font-light bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm px-4 py-1 rounded-sm text-center">
            Fullstack developer with a growing focus on cloud infrastructure and cybersecurity
          </p>
          <motion.div
            className="flex items-center justify-center gap-3 text-sm text-gray-700 dark:text-gray-300 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm px-4 py-1 rounded-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <span>Cavite, Philippines</span>
            <span>•</span>
            <span>President's Lister</span>
            <span>•</span>
            <span>GPA 1.31</span>
          </motion.div>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <MagneticButton
            href="#projects"
            className="group px-10 py-4 bg-gray-900 text-white rounded-none font-medium hover:bg-gray-800 transition-all hover:scale-105 hover:shadow-2xl backdrop-blur-sm"
          >
            <span className="flex items-center gap-2">View Projects</span>
          </MagneticButton>
          <MagneticButton
            href="mailto:kmirafelix@gmail.com"
            className="px-10 py-4 bg-white/90 text-gray-900 rounded-none font-medium border border-gray-900 hover:border-gray-900 transition-all hover:scale-105 backdrop-blur-sm"
          >
            Contact
          </MagneticButton>
          <MagneticButton
            href={resumeUrl}
            download={RESUME_FILENAME}
            target="_blank"
            rel="noopener noreferrer"
            ariaLabel="Download résumé (PDF)"
            className="px-10 py-4 bg-white/90 text-gray-900 rounded-none font-medium border border-gray-900 hover:border-gray-900 transition-all hover:scale-105 backdrop-blur-sm"
          >
            <span className="flex items-center gap-2">
              <Download className="w-4 h-4" strokeWidth={1.5} />
              Résumé
            </span>
          </MagneticButton>
        </motion.div>

        <motion.div className="pt-16" animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <ArrowDown className="w-5 h-5 text-gray-300 dark:text-gray-600 mx-auto" strokeWidth={1.5} />
        </motion.div>
      </motion.div>
    </section>
  );
}
