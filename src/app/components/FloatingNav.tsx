import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Code, Briefcase, Layers, GraduationCap, FileDown, Moon, Sun, Mail } from 'lucide-react';
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
}

export function FloatingNav({ isDark, onToggleDark }: FloatingNavProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('Home');

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
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-2 border-gray-900 dark:border-gray-700 shadow-xl px-6 py-3 transition-colors duration-300">
            <ul className="flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.name;

                return (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="relative group focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 focus:ring-offset-2 rounded"
                      aria-label={item.name}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <motion.div
                        className={`flex items-center gap-2 px-4 py-2 transition-colors ${
                          isActive
                            ? 'text-white'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeBackground"
                            className="absolute inset-0 bg-gray-900 dark:bg-gray-100"
                            transition={{ type: "spring", duration: 0.6 }}
                          />
                        )}
                        <Icon
                          className={`w-4 h-4 relative z-10 ${isActive ? 'dark:text-gray-900' : ''}`}
                          strokeWidth={isActive ? 2 : 1.5}
                        />
                        <span className={`text-sm font-medium relative z-10 hidden sm:inline ${isActive ? 'dark:text-gray-900' : ''}`}>
                          {item.name}
                        </span>
                      </motion.div>
                    </a>
                  </li>
                );
              })}

              {/* Résumé download */}
              <li className="flex items-center">
                <span className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-2" aria-hidden />
                <a
                  href={resumeUrl}
                  download={RESUME_FILENAME}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Download résumé (PDF)"
                  className="focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 focus:ring-offset-2 rounded"
                >
                  <motion.div
                    className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 transition-colors duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FileDown className="w-4 h-4" strokeWidth={2} />
                    <span className="text-sm font-medium hidden sm:inline">Résumé</span>
                  </motion.div>
                </a>
              </li>

              {/* Dark mode toggle */}
              <li className="flex items-center">
                <span className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-2" aria-hidden />
                <motion.button
                  onClick={onToggleDark}
                  aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                  className="flex items-center justify-center p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 rounded"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <AnimatePresence mode="wait">
                    {isDark ? (
                      <motion.span
                        key="sun"
                        initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                        exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Sun className="w-4 h-4" strokeWidth={1.5} />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="moon"
                        initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                        exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Moon className="w-4 h-4" strokeWidth={1.5} />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </li>
            </ul>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

