import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, Variants } from 'framer-motion';
import avatar from '../../assets/1x1_upscaled.png';
import avatarShades from '../../assets/1x1_shadeupscaled.png';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { ChevronRight } from 'lucide-react';

const ROLES = [
  "Full-Stack Developer",
  "Cloud Engineer",
  "CS Student"
];

export function Hero() {
  const { scrollY } = useScroll();
  const reduceMotion = usePrefersReducedMotion();

  // Scroll parallax effects
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  // Role ticker state
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % ROLES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [reduceMotion]);

  // Variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const lineVariants: Variants = {
    hidden: { scaleY: 0, transformOrigin: "top" },
    visible: { scaleY: 1, transition: { duration: 1.5, ease: "easeInOut" } }
  };

  const hLineVariants: Variants = {
    hidden: { scaleX: 0, transformOrigin: "left" },
    visible: { scaleX: 1, transition: { duration: 1.5, ease: "easeInOut", delay: 0.8 } }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-white dark:bg-black transition-colors duration-300 px-6 sm:px-12 py-24 lg:py-0"
    >
      {/* ── Geometric Accent: Left Vertical Rule ── */}
      <motion.div
        variants={lineVariants}
        initial="hidden"
        animate="visible"
        className="absolute left-6 sm:left-12 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-800 hidden md:block"
      />

      <motion.div
        className="relative w-full max-w-7xl mx-auto z-10 flex-1 flex flex-col justify-center md:pl-8 lg:pl-12 pt-16 lg:pt-0"
        style={reduceMotion ? {} : { y, opacity }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.8fr] gap-12 lg:gap-16 items-center">
          
          {/* ── Left Column: Typography ── */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-start order-2 lg:order-1"
          >
            {/* Small caps name */}
            <motion.div variants={itemVariants} className="mb-8">
              <span className="font-mono text-xs sm:text-sm tracking-[0.3em] uppercase text-gray-500 dark:text-gray-400">
                Kurt Michael Mirafelix
              </span>
            </motion.div>

            {/* Cinematic Headline */}
            <div className="mb-8 font-mono font-bold text-[5rem] leading-[0.9] sm:text-[6rem] lg:text-[8rem] xl:text-[9rem] tracking-tighter text-gray-950 dark:text-gray-50">
              <div className="overflow-hidden">
                <motion.div variants={itemVariants}>Design.</motion.div>
              </div>
              <div className="overflow-hidden">
                <motion.div variants={itemVariants} className="text-gray-400 dark:text-gray-600">Build.</motion.div>
              </div>
              <div className="overflow-hidden">
                <motion.div variants={itemVariants}>Ship.</motion.div>
              </div>
            </div>

            {/* Role Ticker */}
            <motion.div variants={itemVariants} className="mb-12 flex items-center gap-4 border-l-2 border-gray-900 dark:border-gray-100 pl-4 h-8 overflow-hidden">
              <ChevronRight className="w-5 h-5 text-gray-400" />
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={roleIndex}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.5, ease: "anticipate" }}
                  className="text-lg sm:text-xl font-medium text-gray-700 dark:text-gray-300"
                >
                  {ROLES[roleIndex]}
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* CTAs */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-6">
              <a
                href="#projects"
                className="group relative inline-flex items-center justify-center px-8 py-4 font-mono text-sm tracking-widest uppercase overflow-hidden bg-gray-900 text-white dark:bg-white dark:text-gray-900 transition-colors"
              >
                <span className="relative z-10">View Projects</span>
                <div className="absolute inset-0 bg-gray-800 dark:bg-gray-200 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center px-8 py-4 font-mono text-sm tracking-widest uppercase border border-gray-300 dark:border-gray-700 hover:border-gray-900 dark:hover:border-gray-300 text-gray-900 dark:text-gray-100 transition-colors"
              >
                Get in Touch
              </a>
            </motion.div>
          </motion.div>

          {/* ── Right Column: Portrait ── */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full aspect-[3/4] sm:aspect-square lg:aspect-[3/4] max-w-md mx-auto order-1 lg:order-2 hidden lg:block"
          >
            {/* Architectural Corner Brackets */}
            <div className="absolute -top-4 -left-4 w-8 h-8 border-t border-l border-gray-900 dark:border-gray-100" />
            <div className="absolute -top-4 -right-4 w-8 h-8 border-t border-r border-gray-900 dark:border-gray-100" />
            <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b border-l border-gray-900 dark:border-gray-100" />
            <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b border-r border-gray-900 dark:border-gray-100" />

            {/* Portrait Container */}
            <div className="relative w-full h-full overflow-hidden bg-gray-100 dark:bg-gray-900 group">
              <img
                src={avatar}
                alt="Kurt Michael Mirafelix"
                className="absolute inset-0 w-full h-full object-cover object-top grayscale contrast-125 group-hover:opacity-0 transition-all duration-700 ease-out"
              />
              <img
                src={avatarShades}
                alt="Kurt Michael Mirafelix with shades"
                className="absolute inset-0 w-full h-full object-cover object-top grayscale contrast-125 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out"
              />
              
              {/* Halftone Overlay: White dots fading up */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-full opacity-70"
                style={{
                  backgroundImage: `radial-gradient(circle, #ffffff 1.5px, transparent 1.5px)`,
                  backgroundSize: '6px 6px',
                  WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%)',
                  maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%)',
                }}
              />

              {/* Inner subtle border */}
              <div className="absolute inset-0 border border-black/10 dark:border-white/10 pointer-events-none" />
            </div>
          </motion.div>

        </div>
      </motion.div>

      {/* ── Bottom Bar ── */}
      <div className="absolute bottom-0 left-0 right-0 px-6 sm:px-12 pb-8 flex flex-col items-center">
        <motion.div
          variants={hLineVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-7xl h-px bg-gray-200 dark:bg-gray-800 mb-6"
        />
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="w-full max-w-7xl flex justify-between items-center font-mono text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest"
        >
          <span>© 2026</span>
          <span className="hidden sm:inline">Cavite, PH</span>
          <div className="flex items-center gap-2">
            <span>Scroll</span>
            <motion.div
              animate={reduceMotion ? {} : { y: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-px h-4 bg-gray-400 dark:bg-gray-500"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

