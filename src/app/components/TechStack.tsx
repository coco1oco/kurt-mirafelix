import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { IconType } from 'react-icons';
import {
  SiTypescript,
  SiReact,
  SiTailwindcss,
  SiHtml5,
  SiCss,
  SiVite,
  SiJavascript,
  SiPhp,
  SiSupabase,
  SiPostgresql,
  SiFirebase,
  SiCloudinary,
  SiPython,
  SiPandas,
  SiNumpy,
  SiScikitlearn,
  SiJupyter,
  SiGit,
  SiGithub,
  SiOpenai,
  SiGooglegemini,
  SiAnthropic,
} from 'react-icons/si';
import { Database, Network, Code2, BarChart3, Brain, Sparkles } from 'lucide-react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

type Tech = { name: string; Icon: IconType };

const technologies: Tech[] = [
  { name: 'TypeScript', Icon: SiTypescript },
  { name: 'React', Icon: SiReact },
  { name: 'Tailwind CSS', Icon: SiTailwindcss },
  { name: 'HTML5', Icon: SiHtml5 },
  { name: 'CSS3', Icon: SiCss },
  { name: 'Vite', Icon: SiVite },
  { name: 'JavaScript', Icon: SiJavascript },
  { name: 'PHP', Icon: SiPhp },
  { name: 'Supabase', Icon: SiSupabase },
  { name: 'PostgreSQL', Icon: SiPostgresql },
  { name: 'SQL', Icon: Database },
  { name: 'REST APIs', Icon: Network },
  { name: 'Firebase', Icon: SiFirebase },
  { name: 'Cloudinary', Icon: SiCloudinary },
  { name: 'Python', Icon: SiPython },
  { name: 'Pandas', Icon: SiPandas },
  { name: 'NumPy', Icon: SiNumpy },
  { name: 'Matplotlib', Icon: BarChart3 },
  { name: 'scikit-learn', Icon: SiScikitlearn },
  { name: 'Jupyter', Icon: SiJupyter },
  { name: 'Git', Icon: SiGit },
  { name: 'GitHub', Icon: SiGithub },
  { name: 'VS Code', Icon: Code2 },
  { name: 'AI & LLMs', Icon: Brain },
  { name: 'OpenAI', Icon: SiOpenai },
  { name: 'Gemini', Icon: SiGooglegemini },
  { name: 'Claude', Icon: SiAnthropic },
  { name: 'Prompt Engineering', Icon: Sparkles },
];

function Chip({ name, Icon }: Tech) {
  return (
    <div className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 whitespace-nowrap">
      <Icon className="w-5 h-5 text-gray-900 dark:text-gray-300" aria-hidden />
      <span className="text-sm font-medium text-gray-900 dark:text-gray-200">{name}</span>
    </div>
  );
}

// One horizontal row that scrolls continuously. The list is duplicated so the
// translateX loop wraps seamlessly. `reverse` and `duration` vary per row.
function MarqueeRow({
  items,
  reverse = false,
  duration = 40,
}: {
  items: Tech[];
  reverse?: boolean;
  duration?: number;
}) {
  const [isTouched, setIsTouched] = useState(false);
  const animation = `${reverse ? 'tech-marquee-reverse' : 'tech-marquee'} ${duration}s linear infinite`;
  
  return (
    <div 
      className="group flex overflow-hidden cursor-pointer" 
      role="list"
      onTouchStart={() => setIsTouched(true)}
      onTouchEnd={() => setIsTouched(false)}
      onTouchCancel={() => setIsTouched(false)}
    >
      <div
        className="flex shrink-0 gap-4 pr-4 group-hover:[animation-play-state:paused]"
        style={{ animation, animationPlayState: isTouched ? 'paused' : undefined }}
      >
        {items.map((tech) => (
          <Chip key={tech.name} {...tech} />
        ))}
      </div>
      <div
        aria-hidden
        className="flex shrink-0 gap-4 pr-4 group-hover:[animation-play-state:paused]"
        style={{ animation, animationPlayState: isTouched ? 'paused' : undefined }}
      >
        {items.map((tech) => (
          <Chip key={`${tech.name}-dup`} {...tech} />
        ))}
      </div>
    </div>
  );
}

export function TechStack() {
  const ref = useRef(null);
  const reduceMotion = usePrefersReducedMotion();

  const mid = Math.ceil(technologies.length / 2);
  const rowOne = technologies.slice(0, mid);
  const rowTwo = technologies.slice(mid);

  return (
    <section id="skills" ref={ref} className="relative py-32 bg-gray-50 dark:bg-black overflow-hidden transition-colors duration-300">
      {/* Keyframes for the marquee scroll */}
      <style>{`
        @keyframes tech-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-100%); }
        }
        @keyframes tech-marquee-reverse {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `}</style>

      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <motion.div
          className="mb-16 space-y-4"
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-px bg-gray-900" />
            <span className="text-sm font-medium tracking-widest text-gray-400 dark:text-gray-500 uppercase">
              Technical Skills
            </span>
          </div>
          <h2 className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            Tech Stack
          </h2>
        </motion.div>
      </div>

      {reduceMotion ? (
        // Static wrapped grid when reduced motion is preferred.
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="flex flex-wrap gap-4">
            {technologies.map((tech) => (
              <Chip key={tech.name} {...tech} />
            ))}
          </div>
        </div>
      ) : (
        // Animated horizontal scroller with edge fade masks.
        <div
          className="relative z-10 space-y-4"
          style={{
            WebkitMaskImage:
              'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
            maskImage:
              'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
          }}
        >
          <MarqueeRow items={rowOne} duration={42} />
          <MarqueeRow items={rowTwo} reverse duration={48} />
        </div>
      )}
    </section>
  );
}
