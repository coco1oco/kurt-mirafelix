import { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

export function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState<'default' | 'link' | 'button'>('default');
  const [isVisible, setIsVisible] = useState(false);
  const reduceMotion = usePrefersReducedMotion();

  const cursorX = useSpring(0, { stiffness: 500, damping: 28 });
  const cursorY = useSpring(0, { stiffness: 500, damping: 28 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setIsVisible(true);
    };

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' || target.tagName === 'BUTTON') {
        setCursorVariant(target.tagName === 'BUTTON' ? 'button' : 'link');
      }
    };

    const handleMouseLeave = () => {
      setCursorVariant('default');
    };

    const updateCursorVariant = () => {
      const links = document.querySelectorAll('a, button');
      links.forEach((link) => {
        link.addEventListener('mouseenter', handleMouseEnter as EventListener);
        link.addEventListener('mouseleave', handleMouseLeave);
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    updateCursorVariant();

    // Update on DOM changes
    const observer = new MutationObserver(updateCursorVariant);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      const links = document.querySelectorAll('a, button');
      links.forEach((link) => {
        link.removeEventListener('mouseenter', handleMouseEnter as EventListener);
        link.removeEventListener('mouseleave', handleMouseLeave);
      });
      observer.disconnect();
    };
  }, [cursorX, cursorY]);

  const variants = {
    default: {
      width: 16,
      height: 16,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      border: 'none',
    },
    link: {
      width: 60,
      height: 60,
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      border: '1px solid rgba(0, 0, 0, 0.2)',
    },
    button: {
      width: 60,
      height: 60,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      border: '2px solid rgba(0, 0, 0, 0.3)',
    },
  };

  if (reduceMotion) return null;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full mix-blend-difference hidden md:block"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={cursorVariant}
        variants={variants}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: isVisible ? 1 : 0 }}
      />

    </>
  );
}
