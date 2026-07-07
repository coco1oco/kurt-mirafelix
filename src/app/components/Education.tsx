import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Award, Trophy, Shield } from 'lucide-react';

const education = {
  institution: 'Cavite State University',
  degree: 'Bachelor of Science in Computer Science',
  period: 'Expected 2027',
  gwa: '1.31',
  gwaNote: '(1.00 = highest)',
  honors: 'President\'s Lister (Freshman-Present)'
};

const certifications = [
  {
    title: 'Introduction to Cybersecurity',
    issuer: 'Cisco Networking Academy',
    date: 'May 2026',
    inProgress: false
  },
  {
    title: 'Cyber Threat Management',
    issuer: 'Cisco Networking Academy',
    date: 'May 2026',
    inProgress: false
  },
  {
    title: 'Responsible AI: Applying AI Principles with Google Cloud',
    issuer: 'Google',
    date: 'June 2026',
    inProgress: false
  },
  {
    title: ' Understanding Data Science',
    issuer: 'DataCamp',
    date: 'July 2025',
    inProgress: false
  },
  {
    title: 'Azure Fundamentals (AZ-900)',
    issuer: 'Microsoft Azure',
    date: 'In Progress',
    inProgress: true
  }
];

const achievements = [
  {
    title: 'C(Old) (ST)art Hackathon',
    organization: 'Old.St Labs',
    role: 'Participant',
    description: 'Contributed to UI/UX design and implementation, led final pitch',
    date: 'Nov 23, 2025',
    icon: Trophy
  }
];

export function Education() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-100px" });

  return (
    <section id="education" ref={ref} className="relative py-32 px-6 bg-white dark:bg-black overflow-hidden transition-colors duration-300">
      {/* Geometric background */}
      <motion.div
        className="absolute bottom-20 right-20 w-[400px] h-[400px] border border-gray-100 rounded-full"
        style={{
          y: useTransform(scrollYProgress, [0, 1], [50, -50]),
          opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0.2, 0.4, 0.2])
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
            <h2 className="text-sm font-pixel text-gray-400 dark:text-gray-500 lowercase">
              05 — education
            </h2>
          </div>
          <h2 className="text-5xl sm:text-6xl font-pixel font-normal text-gray-900 dark:text-gray-100 tracking-tight lowercase mt-4">
            background
          </h2>
        </motion.div>

        <div className="space-y-8">
          {/* Main Education Card */}
          <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="relative bg-white dark:bg-black border-2 border-gray-900 dark:border-gray-700 p-10 hover:shadow-2xl transition-all duration-500 group"
          >
            {/* Accent corner */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 0)' }} />

            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div className="space-y-4 flex-1">
                <div className="space-y-2">
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {education.institution}
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
                    {education.degree}
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    {education.period}
                  </p>
                </div>

                <div className="flex items-center gap-6 pt-4">
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">{education.gwa}</span>
                      <span className="text-sm text-gray-400 dark:text-gray-500">{education.gwaNote}</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500 uppercase tracking-wider">GPA</p>
                  </div>

                  <div className="w-px h-12 bg-gray-200" />

                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-gray-900" />
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-200">
                      {education.honors}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Certifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <h3 className="text-sm font-mono text-gray-400 uppercase tracking-wider flex items-center gap-3">
              <Shield className="w-4 h-4" />
              Certifications
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {certifications.map((cert, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 p-6 hover:border-gray-900 dark:hover:border-gray-500 hover:shadow-lg transition-all group"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-200 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors">
                        {cert.title}
                      </h4>
                      {cert.inProgress && (
                        <span className="shrink-0 flex items-center gap-1.5 px-2 py-0.5 border border-gray-300 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">In Progress</span>
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{cert.issuer}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 font-mono">{cert.date}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Achievements/Hackathons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-6"
          >
            <h3 className="text-sm font-mono text-gray-400 uppercase tracking-wider flex items-center gap-3">
              <Trophy className="w-4 h-4" />
              Hackathons & Competitions
            </h3>
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ x: 10 }}
                  className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 p-8 hover:border-gray-900 dark:hover:border-gray-500 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-start gap-6">
                    <div className="p-3 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-gray-700 group-hover:border-gray-900 dark:group-hover:border-gray-400 group-hover:bg-gray-900 dark:group-hover:bg-gray-200 transition-all">
                      <Icon className="w-6 h-6 text-gray-900 group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h4 className="font-bold text-lg text-gray-900 dark:text-gray-100">
                            {achievement.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {achievement.organization} • {achievement.role}
                          </p>
                        </div>
                        <span className="text-xs text-gray-400 dark:text-gray-500 font-mono whitespace-nowrap">
                          {achievement.date}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
