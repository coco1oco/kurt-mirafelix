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
    <section className="py-32 px-6 bg-white dark:bg-gray-950 relative overflow-hidden transition-colors duration-300" id="about">
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
              className="inline-block px-4 py-1 border border-gray-200 dark:border-gray-700 rounded-full text-xs tracking-widest uppercase text-gray-500 dark:text-gray-400"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              About
            </motion.div>
            <motion.h2
              className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 max-w-3xl"
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
                I'm a Computer Science student at Cavite State University with a passion for crafting elegant,
                performant web applications. My approach combines technical precision with user-centered design.
              </p>
              <p>
                Specializing in React and TypeScript, I focus on building scalable frontend architectures that
                deliver exceptional user experiences. From reducing load times by 95% to architecting full-stack
                solutions, I thrive on solving complex technical challenges.
              </p>
            </div>

            <div className="space-y-6 text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              <p>
                Currently maintaining a 1.31 GPA as President's Lister while expanding into cloud infrastructure
                and cybersecurity. Studying for the Microsoft AZ-900 Azure Fundamentals certification and
                actively growing in security concepts through Cisco's Networking Academy.
              </p>
              <p>I believe great software is invisible — it just works, scales, and stays secure.</p>
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
