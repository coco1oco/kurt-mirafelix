import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, ArrowRight, ArrowUpRight, X } from 'lucide-react';
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
  },
  {
    id: 4,
    title: 'Windy',
    subtitle: 'Weather Forecast Platform',
    description: 'My first Github project that I made using HTML, CSS and JS. I used OpenWeatherMap API to fetch weather data and display it in a user-friendly interface.',
    impact: 'Learned how to use APIs and how to display data in a user-friendly interface. Which then I revisit and migrated to React.',
    tags: ['HTML', 'CSS', 'JavaScript'],
    period: 'Oct 2025',
    link: null,
    github: 'https://github.com/coco1oco/weather'
  }
];

function ProjectCard({ project, index, onClick }: { project: typeof projects[0]; index: number; onClick: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  // The first project is featured and takes up 2 columns on medium screens and up
  const isFeatured = index === 0;
  const colSpanClass = isFeatured ? "md:col-span-2" : "col-span-1";

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={onClick}
      className={`group relative bg-white dark:bg-black border border-gray-200 dark:border-gray-800 p-8 cursor-pointer flex flex-col justify-between hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors ${colSpanClass}`}
    >
      {/* Top right indicator */}
      <div className="absolute top-6 right-6 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
        <ArrowUpRight className="w-6 h-6 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
      </div>

      <div className="space-y-4 pr-8">
        <div>
          {isFeatured && (
            <span className="inline-block px-2 py-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-mono font-bold mb-4">
              FEATURED
            </span>
          )}
          <h3 className="text-2xl sm:text-3xl font-mono font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            {project.title}
          </h3>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-2 font-medium">
            {project.subtitle}
          </p>
        </div>
      </div>

      <div className="mt-12 flex flex-wrap gap-2">
        {project.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="text-xs font-mono text-gray-600 dark:text-gray-400 px-2 py-1 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black"
          >
            {tag}
          </span>
        ))}
        {project.tags.length > 3 && (
          <span className="text-xs font-mono text-gray-600 dark:text-gray-400 px-2 py-1 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
            +{project.tags.length - 3}
          </span>
        )}
      </div>
    </motion.article>
  );
}

function ProjectModal({ project, onClose }: { project: typeof projects[0]; onClose: () => void }) {
  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
      />

      {/* Modal Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-black border border-gray-200 dark:border-gray-800 shadow-2xl z-10"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-900 rounded-none transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 sm:p-12 space-y-12">
          {/* Header */}
          <div className="space-y-4 pr-12">
            <h2 className="text-4xl sm:text-5xl font-pixel font-normal text-gray-900 dark:text-white tracking-tight">
              {project.title}
            </h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">
              {project.subtitle} • {project.period}
            </p>
          </div>

          {/* Placeholder for Screenshots */}
          <div className="w-full aspect-[16/9] bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-center justify-center">
            <span className="text-gray-400 font-mono text-sm tracking-widest uppercase">Screenshot Area</span>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-2 space-y-8">
              <div className="space-y-4">
                <h4 className="font-mono text-sm font-bold tracking-widest uppercase text-gray-900 dark:text-white">Overview</h4>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                  {project.description}
                </p>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-mono text-sm font-bold tracking-widest uppercase text-gray-900 dark:text-white">Impact</h4>
                <div className="inline-flex items-center gap-3 px-5 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                  <div className="w-2 h-2 bg-gray-900 dark:bg-white" />
                  <span className="font-medium text-gray-900 dark:text-gray-200">{project.impact}</span>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <h4 className="font-mono text-sm font-bold tracking-widest uppercase text-gray-900 dark:text-white">Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-mono text-gray-600 dark:text-gray-400 px-3 py-1.5 border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-mono text-sm font-bold tracking-widest uppercase text-gray-900 dark:text-white">Links</h4>
                <div className="flex flex-col gap-3">
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-mono font-bold text-white bg-gray-900 dark:bg-white dark:text-gray-900 px-4 py-3 hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                    >
                      View Live Site
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  )}
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 text-sm font-mono font-bold text-gray-900 dark:text-white border border-gray-900 dark:border-white px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      View Source
                    </a>
                  )}
                  {!project.link && !project.github && (
                    <span className="text-sm text-gray-500 italic">No public links available.</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function ProjectShowcase() {
  const ref = useRef(null);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  return (
    <section id="projects" ref={ref} className="relative py-32 px-6 bg-white dark:bg-black overflow-hidden transition-colors duration-300">
      {/* Subtle geometric background */}
      <motion.div
        className="absolute top-40 right-20 w-96 h-96 border border-gray-100 dark:border-gray-900 rotate-45 pointer-events-none"
        style={{
          y: useTransform(scrollYProgress, [0, 1], [0, -50]),
          opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.5, 0.3])
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          className="mb-16 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-pixel text-gray-400 dark:text-gray-500 lowercase">
              02 — projects
            </h2>
          </div>
          <h2 className="text-5xl sm:text-6xl font-pixel font-normal text-gray-900 dark:text-gray-100 tracking-tight lowercase mt-4">
            selected work
          </h2>
        </motion.div>

        {/* Bento Box Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              index={index} 
              onClick={() => setSelectedProjectId(project.id)} 
            />
          ))}
        </div>
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal 
            project={selectedProject} 
            onClose={() => setSelectedProjectId(null)} 
          />
        )}
      </AnimatePresence>
    </section>
  );
}

