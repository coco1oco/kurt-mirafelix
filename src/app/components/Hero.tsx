import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import portrait from '../../imports/Generated_Image_May_31__2026_-_1_22AM.jpg';
import { MagneticButton } from './MagneticButton';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { HeroBackground } from './HeroBackground';
import { HeroAvatar } from './HeroAvatar';

export function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const reduceMotion = usePrefersReducedMotion();

  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.8]);
  const y = useTransform(scrollY, [0, 300], [0, 100]);

  // Motion values for global parallax (window-based)
  const windowMouseX = useMotionValue(0);
  const windowMouseY = useMotionValue(0);
  const smoothWindowX = useSpring(windowMouseX, { stiffness: 250, damping: 25 });
  const smoothWindowY = useSpring(windowMouseY, { stiffness: 250, damping: 25 });

  // Motion values for reveal mask (section-based)
  const revealX = useMotionValue(-1000);
  const revealY = useMotionValue(-1000);
  const smoothRevealX = useSpring(revealX, { stiffness: 250, damping: 25 });
  const smoothRevealY = useSpring(revealY, { stiffness: 250, damping: 25 });

  // Track hovering state with motion value for smooth opacity transitions
  const isHovering = useMotionValue(0); // 0 or 1
  const smoothHovering = useSpring(isHovering, { stiffness: 250, damping: 25 });

  useEffect(() => {
    if (reduceMotion) return;
    const handleMouseMove = (e: MouseEvent) => {
      // Scale from -15 to +15 based on window center for parallax effect
      windowMouseX.set((e.clientX / window.innerWidth - 0.5) * 30);
      windowMouseY.set((e.clientY / window.innerHeight - 0.5) * 30);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [reduceMotion, windowMouseX, windowMouseY]);

  const handleSectionMouseMove = (e: React.MouseEvent) => {
    if (reduceMotion) return;
    const rect = sectionRef.current?.getBoundingClientRect();
    if (rect) {
      revealX.set(e.clientX - rect.left);
      revealY.set(e.clientY - rect.top);
    }
  };

  const handleMouseEnter = () => !reduceMotion && isHovering.set(1);
  const handleMouseLeave = () => {
    isHovering.set(0);
    // Move mask out of view on leave
    revealX.set(-1000);
    revealY.set(-1000);
  };

  const REVEAL_RADIUS = 220;

  // Use motion templates to directly generate complex string styles using motion values
  const maskImage = useMotionTemplate`radial-gradient(circle ${REVEAL_RADIUS}px at ${revealX}px ${revealY}px, black 45%, transparent 75%)`;

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center px-6 py-20 overflow-hidden bg-white dark:bg-gray-950 transition-colors duration-300"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleSectionMouseMove}
    >
      <HeroAvatar />

      {/* Photo reveal layer — masked to a circle that follows the cursor */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0 hidden sm:block" // Hidden on touch devices
        style={{
          opacity: smoothHovering,
          WebkitMaskImage: maskImage,
          maskImage: maskImage,
        }}
      >
        <img
          src={portrait}
          alt=""
          role="presentation"
          className="absolute inset-0 w-full h-full object-cover grayscale"
        />
        {/* Subtle wash to keep things airy */}
        <div className="absolute inset-0 bg-white/10 dark:bg-black/20" />
      </motion.div>

      {/* Cursor ring */}
      <motion.div
        className="absolute pointer-events-none z-30 border border-gray-900/30 rounded-full mix-blend-difference hidden sm:block"
        style={{
          width: REVEAL_RADIUS * 2,
          height: REVEAL_RADIUS * 2,
          x: useTransform(smoothRevealX, v => v - REVEAL_RADIUS),
          y: useTransform(smoothRevealY, v => v - REVEAL_RADIUS),
          opacity: smoothHovering,
          scale: useTransform(smoothHovering, [0, 1], [0.5, 1]),
        }}
      />

      <HeroBackground mouseX={smoothWindowX} mouseY={smoothWindowY} />

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
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold leading-none tracking-tight mix-blend-difference text-gray-900 dark:text-white flex flex-col items-center">
              <motion.span
                className="block"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Kurt Michael
              </motion.span>
              <motion.span
                className="block text-4xl sm:text-5xl md:text-6xl font-light"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Mirafelix
              </motion.span>
            </h1>
          </div>
        </motion.div>

        <motion.div
          className="space-y-6 flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <p className="text-xl sm:text-2xl text-gray-900 dark:text-gray-100 max-w-3xl mx-auto leading-relaxed font-light text-center">
            Fullstack developer with a growing focus on cloud infrastructure and cybersecurity
          </p>
          <motion.div
            className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-sm text-gray-700 dark:text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <span>Cavite, Philippines</span>
            <span className="hidden sm:inline">•</span>
            <span>President's Lister</span>
            <span className="hidden sm:inline">•</span>
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
            className="group px-10 py-4 bg-gray-900 text-white rounded-none font-medium hover:bg-gray-800 transition-all hover:shadow-2xl backdrop-blur-sm"
          >
            <span className="flex items-center gap-2">View Projects</span>
          </MagneticButton>
          <MagneticButton
            href="#contact"
            className="px-10 py-4 bg-white/90 text-gray-900 rounded-none font-medium border border-gray-900 hover:border-gray-900 transition-all backdrop-blur-sm"
          >
            Contact
          </MagneticButton>
        </motion.div>

        <motion.div className="pt-16" animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <ArrowDown className="w-5 h-5 text-gray-300 dark:text-gray-600 mx-auto" strokeWidth={1.5} />
        </motion.div>
      </motion.div>
    </section>
  );
}
