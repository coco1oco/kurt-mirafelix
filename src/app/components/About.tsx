import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

function AnimatedCounter({ end, duration = 2, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);

      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, end, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export function About() {
  return (
    <section className="py-32 px-6 bg-white dark:bg-black relative overflow-hidden transition-colors duration-300" id="about">
      {/* Geometric accents */}
      <div className="absolute top-20 left-0 w-px h-64 bg-gradient-to-b from-transparent via-gray-200 to-transparent" />
      <div className="absolute bottom-20 right-0 w-px h-64 bg-gradient-to-b from-transparent via-gray-200 to-transparent" />

      <div className="max-w-6xl mx-auto">
        <motion.div
          className="space-y-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <div className="space-y-4">
            <motion.div
              className="text-sm font-pixel text-gray-400 dark:text-gray-500 lowercase"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              01 — about
            </motion.div>
            <motion.h2
              className="text-5xl md:text-6xl font-pixel font-normal text-gray-900 dark:text-gray-100 max-w-3xl lowercase"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Building experiences that matter
            </motion.h2>
          </div>

          {/* Bio */}
          <motion.div
            className="grid md:grid-cols-2 gap-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <div className="space-y-6 text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              <p>
                I'm a Computer Science student and an aspiring Cloud Engineer who's drawn to understanding how
                things work underneath — not just how they look on the surface.
              </p>
              <p>
                My focus spans full-stack development, cloud infrastructure, and backend systems. I like working
                across the whole stack because it gives me a grounded view of how applications and the
                infrastructure they run on actually fit together — and how we keep all of it secure.
              </p>
              <p>
                I found this direction somewhat by accident: I started out just wanting to build things, and
                along the way discovered that what genuinely pulls me in is the systems side — reliability,
                scalability, and the engineering underneath good software.
              </p>
            </div>

            <div className="space-y-6 text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              <p>
                Right now, I'm building toward my first real milestone in cloud engineering, starting with the
                fundamentals, while completing a hands-on OJT that's given me exposure across QA, enterprise
                implementation, and full-stack development.
              </p>
              <p>
                Beyond code, I'm interested in cybersecurity, exploring how different technical disciplines
                connect, playing racquet sports, and online games. Always up for a conversation about cloud
                engineering, software development, or where the industry's heading.
              </p>
              <blockquote className="border-l-2 border-gray-300 dark:border-gray-600 pl-4 italic text-base text-gray-500 dark:text-gray-500">
                "I don't want to be the smartest one in the room. For me, being in a room with people much more
                capable than I am is far more important — it gives me a place to learn and grow."
              </blockquote>
            </div>
          </motion.div>

          {/* Metrics */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-gray-100 dark:border-gray-800"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100">
                <AnimatedCounter end={95} suffix="%" />
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 tracking-wide">Performance Gain</div>
              <div className="text-xs text-gray-400 dark:text-gray-500">40s → 200ms load time</div>
            </div>

            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100">
                <AnimatedCounter end={1} suffix=".31" duration={2.5} />
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 tracking-wide">GWA</div>
              <div className="text-xs text-gray-400 dark:text-gray-500">President's Lister</div>
            </div>

            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100">
                <AnimatedCounter end={3} suffix="+" />
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 tracking-wide">Major Projects</div>
              <div className="text-xs text-gray-400 dark:text-gray-500">Full-stack solutions</div>
            </div>

            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100">
                <AnimatedCounter end={3} />
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 tracking-wide">Certifications</div>
              <div className="text-xs text-gray-400 dark:text-gray-500">Cisco × 2 + Azure</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
