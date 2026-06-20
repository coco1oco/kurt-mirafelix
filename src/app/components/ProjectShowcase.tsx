import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ExternalLink, Github, ArrowRight } from 'lucide-react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

const projects = [
  {
    id: 1,
    title: 'PawPal',
    subtitle: 'Pet Community & Records Platform',
    description: 'Installable PWA for Youth For Animals (PAWS Philippines). Led end-to-end delivery including community feed, pet profiles, medical records, and real-time group chat.',
    impact: 'Optimized messaging architecture: 40s → 200ms load time',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'Supabase', 'Firebase', 'Cloudinary'],
    period: 'Dec 2025 – Jan 2026',
    link: 'https://pawpal-taupe.vercel.app/welcome',
    github: 'https://github.com/coco1oco/CSync'
  },
  {
    id: 2,
    title: 'Hype',
    subtitle: 'Event Manager & Ticketing Platform',
    description: 'Marketplace platform for second-hand ticket sales with live auction mechanics. Built during C(Old) (ST)art Hackathon under strict time constraints.',
    impact: 'Led final product pitch and Q&A session',
    tags: ['React 18', 'Vite', 'UI/UX Design'],
    period: 'Nov 2025',
    link: null,
    github: 'https://github.com/coco1oco/Hype'
  },
  {
    id: 3,
    title: 'Real Estate Price Prediction',
    subtitle: 'Machine Learning Model',
    description: 'Multiple linear regression model predicting real estate sale amounts based on assessed property values and categorical types. Academic research project.',
    impact: 'Feature engineering with one-hot encoding, MSE & R² evaluation',
    tags: ['Python', 'Pandas', 'scikit-learn', 'Seaborn', 'Matplotlib'],
    period: 'May 2026',
    link: null,
    github: null
  }
];

function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const reduceMotion = usePrefersReducedMotion();
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (reduceMotion || !ref.current || window.innerWidth < 768) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateXValue = ((y - centerY) / centerY) * -10;
    const rotateYValue = ((x - centerX) / centerX) * 10;
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX, rotateY } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: index * 0.15, rotateX: { duration: 0.3 }, rotateY: { duration: 0.3 } }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-gray-900 dark:hover:border-gray-500 transition-all duration-500 p-6 sm:p-10 hover:shadow-2xl"
      style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
    >
      {/* Hover accent line */}
      <motion.div
        className="absolute top-0 left-0 w-full h-0.5 bg-gray-900 dark:bg-gray-400 origin-left"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: isInView ? 1 : 0 }}
        transition={{ duration: 0.6, delay: 0.8 + index * 0.15 }}
      />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-3">
              <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {project.title}
              </h3>
              {index === 0 && (
                <span className="px-2 py-0.5 bg-gray-900 text-white text-xs font-medium">
                  FEATURED
                </span>
              )}
            </div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 tracking-wide">
              {project.subtitle}
            </p>
          </div>
          <span className="text-sm text-gray-400 dark:text-gray-500 font-light whitespace-nowrap">
            {project.period}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          {project.description}
        </p>

        {/* Impact metric */}
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
          whileHover={{ backgroundColor: '#f9fafb', borderColor: '#000' }}
        >
          <div className="w-1.5 h-1.5 bg-gray-900 dark:bg-gray-400 rounded-full" />
          <span className="text-sm font-medium text-gray-900 dark:text-gray-200">{project.impact}</span>
        </motion.div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 pt-2">
          {project.tags.map((tag, i) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
              transition={{ duration: 0.3, delay: 0.4 + i * 0.05 }}
              className="text-xs font-mono text-gray-600 dark:text-gray-400 px-3 py-1 border border-gray-200 dark:border-gray-700"
            >
              {tag}
            </motion.span>
          ))}
        </div>

        {/* Links */}
        <div className="flex gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
          {project.link && (
            <motion.a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-gray-200 hover:gap-3 transition-all"
              whileHover={{ x: 5 }}
            >
              View Live
              <ArrowRight className="w-4 h-4" />
            </motion.a>
          )}
          {project.github && (
            <motion.a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
            >
              <Github className="w-4 h-4" />
              Source
            </motion.a>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export function ProjectShowcase() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  return (
    <section id="projects" ref={ref} className="relative py-32 px-6 bg-white dark:bg-gray-950 overflow-hidden transition-colors duration-300">
      {/* Subtle geometric background */}
      <motion.div
        className="absolute top-40 right-20 w-96 h-96 border border-gray-100 rotate-45"
        style={{
          y: useTransform(scrollYProgress, [0, 1], [0, -50]),
          opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.5, 0.3])
        }}
      />

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          className="mb-20 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-px bg-gray-900" />
            <span className="text-sm font-medium tracking-widest text-gray-400 dark:text-gray-500 uppercase">
              Selected Work
            </span>
          </div>
          <h2 className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            Projects
          </h2>
        </motion.div>

        <div className="space-y-6">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
