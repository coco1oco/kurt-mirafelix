import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Code, Briefcase, Layers, GraduationCap, FileDown, Moon, Sun, Mail, Menu, X } from 'lucide-react';
import { resumeUrl, RESUME_FILENAME } from '../lib/resume';

const navItems = [
  { name: 'Home', href: '#', icon: Home },
  { name: 'Projects', href: '#projects', icon: Code },
  { name: 'Experience', href: '#experience', icon: Briefcase },
  { name: 'Skills', href: '#skills', icon: Layers },
  { name: 'Education', href: '#education', icon: GraduationCap },
  { name: 'Contact', href: '#contact', icon: Mail },
];

interface FloatingNavProps {
  isDark: boolean;
  onToggleDark: () => void;
  onToggleDarkWithRipple?: (origin: { x: number; y: number }) => void;
}

export function FloatingNav({ isDark, onToggleDark, onToggleDarkWithRipple }: FloatingNavProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('Home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const desktopToggleRef = useRef<HTMLButtonElement>(null);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);

  const handleToggle = (ref: React.RefObject<HTMLButtonElement | null>) => {
    if (onToggleDarkWithRipple && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      onToggleDarkWithRipple({
        x: Math.round(rect.left + rect.width / 2),
        y: Math.round(rect.top + rect.height / 2),
      });
    } else {
      onToggleDark();
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);

      const threshold = window.innerHeight * 0.35;
      const sections = navItems
        .map(item => {
          if (!item.href || item.href === '#' || item.href.length <= 1) return null;
          let element: Element | null = null;
          try { element = document.querySelector(item.href); } catch { element = null; }
          if (!element) return null;
          const rect = element.getBoundingClientRect();
          return { name: item.name, top: rect.top, bottom: rect.bottom };
        })
        .filter((s): s is { name: string; top: number; bottom: number } => !!s);

      const passed = sections.filter(s => s.top <= threshold);
      if (passed.length === 0) {
        setActiveSection('Home');
      } else {
        setActiveSection(passed[passed.length - 1].name);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* ── Desktop Navigation ─────────────────────────────────────── */}
          <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 hidden md:block"
          >
            <div className="bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-md border border-gray-200 dark:border-gray-800 rounded-lg px-2 py-1.5 shadow-[0px_4px_16px_rgba(0,0,0,0.04)] dark:shadow-[0px_4px_16px_rgba(0,0,0,0.2)] transition-colors duration-300">
              <ul className="flex items-center gap-1">
                {navItems.map((item) => {
                  const isActive = activeSection === item.name;

                  return (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className={`block px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest whitespace-nowrap focus:outline-none transition-colors duration-200 ${isActive
                          ? 'text-gray-900 dark:text-gray-100 font-medium'
                          : 'text-gray-400 dark:text-gray-600 hover:text-gray-900 dark:hover:text-gray-100'
                          }`}
                        aria-label={item.name}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        {isActive ? `[ ${item.name} ]` : `\u00A0\u00A0${item.name}\u00A0\u00A0`}
                      </a>
                    </li>
                  );
                })}

                <span className="w-px h-4 bg-gray-200 dark:bg-gray-800 mx-2" aria-hidden />

                {/* Résumé text link */}
                <li>
                  <a
                    href={resumeUrl}
                    download={RESUME_FILENAME}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Download résumé (PDF)"
                    className="block px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-600 hover:text-gray-900 dark:hover:text-gray-100 focus:outline-none transition-colors duration-200"
                  >
                    RÉSUMÉ
                  </a>
                </li>

                <span className="w-px h-4 bg-gray-200 dark:bg-gray-800 mx-2" aria-hidden />

                {/* Dark mode toggle */}
                <li>
                  <motion.button
                    ref={desktopToggleRef}
                    onClick={() => handleToggle(desktopToggleRef)}
                    aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                    className="flex items-center justify-center p-2 text-gray-400 dark:text-gray-600 hover:text-gray-900 dark:hover:text-gray-100 transition-colors focus:outline-none"
                    whileTap={{ scale: 0.9 }}
                  >
                    <AnimatePresence mode="wait">
                      {isDark ? (
                        <motion.span
                          key="sun"
                          initial={{ opacity: 0, rotate: -90 }}
                          animate={{ opacity: 1, rotate: 0 }}
                          exit={{ opacity: 0, rotate: 90 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Sun className="w-3.5 h-3.5" strokeWidth={1.5} />
                        </motion.span>
                      ) : (
                        <motion.span
                          key="moon"
                          initial={{ opacity: 0, rotate: 90 }}
                          animate={{ opacity: 1, rotate: 0 }}
                          exit={{ opacity: 0, rotate: -90 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Moon className="w-3.5 h-3.5" strokeWidth={1.5} />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </li>
              </ul>
            </div>
          </motion.nav>

          {/* ── Mobile Bar ─────────────────────────────────────────────── */}
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-6 inset-x-4 z-[60] md:hidden"
          >
            <div className="bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-md border border-gray-200 dark:border-gray-800 rounded-lg shadow-[0px_4px_16px_rgba(0,0,0,0.04)] dark:shadow-[0px_4px_16px_rgba(0,0,0,0.2)] flex items-center justify-between px-4 py-2.5 transition-colors duration-300">
              {/* Name */}
              <span className="font-mono text-[11px] uppercase tracking-widest text-gray-900 dark:text-gray-100 select-none">
                Kurt Mirafelix
              </span>

              {/* Menu toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors focus:outline-none"
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div key="close" initial={{ opacity: 0, rotate: -45 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 45 }} transition={{ duration: 0.15 }}>
                      <X className="w-4 h-4" strokeWidth={1.5} />
                    </motion.div>
                  ) : (
                    <motion.div key="menu" initial={{ opacity: 0, rotate: 45 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -45 }} transition={{ duration: 0.15 }}>
                      <Menu className="w-4 h-4" strokeWidth={1.5} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </motion.div>

          {/* ── Mobile Dropdown Menu ────────────────────────────────────── */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="fixed inset-x-4 top-20 z-50 bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-xl shadow-[0px_8px_30px_rgba(0,0,0,0.08)] dark:shadow-[0px_8px_30px_rgba(0,0,0,0.4)] p-1.5 md:hidden"
              >
                <ul className="flex flex-col">
                  {navItems.map((item) => {
                    const isActive = activeSection === item.name;
                    return (
                      <li key={item.name} className="border-b border-gray-100 dark:border-gray-800/60">
                        <a
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`relative flex items-center justify-center py-3.5 px-4 font-mono text-[10px] uppercase tracking-widest transition-colors ${
                            isActive
                              ? 'text-gray-900 dark:text-gray-100'
                              : 'text-gray-400 dark:text-gray-600'
                          }`}
                        >
                          {isActive && <span className="absolute left-4 text-gray-900 dark:text-gray-100">[</span>}
                          <span>{item.name}</span>
                          {isActive && <span className="absolute right-4 text-gray-900 dark:text-gray-100">]</span>}
                        </a>
                      </li>
                    );
                  })}

                  {/* Résumé row */}
                  <li className="border-b border-gray-100 dark:border-gray-800/60">
                    <a
                      href={resumeUrl}
                      download={RESUME_FILENAME}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center py-3.5 px-4 font-mono text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-600 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                    >
                      RÉSUMÉ ↗
                    </a>
                  </li>

                  {/* Theme Toggle row */}
                  <li>
                    <button
                      ref={mobileToggleRef}
                      onClick={() => handleToggle(mobileToggleRef)}
                      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                      className="w-full flex items-center justify-center py-3 font-mono text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-600 hover:text-gray-900 dark:hover:text-gray-100 transition-colors focus:outline-none"
                    >
                      <span className="flex items-center gap-2">
                        {isDark ? 'DARK MODE' : 'LIGHT MODE'}
                        <AnimatePresence mode="wait">
                          {isDark ? (
                            <motion.span key="sun" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }} transition={{ duration: 0.2 }}>
                              <Sun className="w-3.5 h-3.5" strokeWidth={1.5} />
                            </motion.span>
                          ) : (
                            <motion.span key="moon" initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -90 }} transition={{ duration: 0.2 }}>
                              <Moon className="w-3.5 h-3.5" strokeWidth={1.5} />
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </span>
                    </button>
                  </li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}
