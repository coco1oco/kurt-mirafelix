import { useState } from 'react';
import { Hero } from './components/Hero';
import { ProjectShowcase } from './components/ProjectShowcase';
import { TechStack } from './components/TechStack';
import { Education } from './components/Education';
import { Experience } from './components/Experience';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { FloatingNav } from './components/FloatingNav';
import { CustomCursor } from './components/CustomCursor';
import { GrainTexture } from './components/GrainTexture';
import { ScrollProgress } from './components/ScrollProgress';
import { BackToTop } from './components/BackToTop';
import { PageLoader } from './components/PageLoader';
import { SmoothScroll } from './components/SmoothScroll';
import { MagneticButton } from './components/MagneticButton';
import { MetaTags } from './components/MetaTags';
import { StatusIndicator } from './components/StatusIndicator';
import { SkipToContent } from './components/SkipToContent';
import { resumeUrl, RESUME_FILENAME } from './lib/resume';
import { useDarkMode } from './hooks/useDarkMode';
import { SectionErrorBoundary } from './components/SectionErrorBoundary';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { isDark, toggle } = useDarkMode();

  return (
    <>
      <MetaTags />
      <PageLoader onComplete={() => setIsLoading(false)} />
      {!isLoading && (
        <SmoothScroll>
          <div className="min-h-screen bg-white dark:bg-gray-950 relative transition-colors duration-300">
            <SkipToContent />
            <CustomCursor />
            <GrainTexture />
            <ScrollProgress />
            <FloatingNav isDark={isDark} onToggleDark={toggle} />
            <StatusIndicator />
            <main id="main-content">
              <SectionErrorBoundary><Hero /></SectionErrorBoundary>
              <SectionErrorBoundary><About /></SectionErrorBoundary>
              <SectionErrorBoundary><ProjectShowcase /></SectionErrorBoundary>
              <SectionErrorBoundary><Experience /></SectionErrorBoundary>
              <SectionErrorBoundary><TechStack /></SectionErrorBoundary>
              <SectionErrorBoundary><Education /></SectionErrorBoundary>
              <SectionErrorBoundary><Contact /></SectionErrorBoundary>
            </main>

            {/* Footer */}
            <footer className="py-20 px-6 text-center border-t border-gray-100 dark:border-gray-800 relative overflow-hidden bg-white dark:bg-gray-950 transition-colors duration-300" role="contentinfo">
              {/* Subtle accent line */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-900 to-transparent" />

              <div className="max-w-6xl mx-auto space-y-8 relative">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="text-left">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Let's Build Something</h3>
                    <p className="text-gray-600 dark:text-gray-400">Open to opportunities and collaboration</p>
                  </div>
                  <MagneticButton
                    href="#contact"
                    className="px-8 py-4 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-colors dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-300"
                  >
                    Get in Touch
                  </MagneticButton>
                </div>

                <div className="flex justify-center gap-8 text-sm text-gray-500">
                  <a
                    href="https://github.com/coco1oco"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 rounded px-2 py-1"
                    aria-label="GitHub Profile"
                  >
                    GitHub
                  </a>
                  <a
                    href="https://www.linkedin.com/in/kurt-michael-mirafelix"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 rounded px-2 py-1"
                    aria-label="LinkedIn Profile"
                  >
                    LinkedIn
                  </a>
                  <a
                    href="mailto:kmirafelix@gmail.com"
                    className="hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 rounded px-2 py-1"
                    aria-label="Send Email"
                  >
                    Email
                  </a>
                  <a
                    href={resumeUrl}
                    download={RESUME_FILENAME}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 rounded px-2 py-1"
                    aria-label="Download résumé (PDF)"
                  >
                    Résumé
                  </a>
                </div>

                <div className="space-y-2">
                  <p className="text-gray-400 dark:text-gray-500 text-sm">© 2026 Kurt Michael Mirafelix. Cavite, Philippines.</p>
                  <p className="text-gray-300 dark:text-gray-600 text-xs">Built with React, TypeScript, Tailwind CSS &amp; Framer Motion</p>
                </div>
              </div>
            </footer>

            <BackToTop />
          </div>
        </SmoothScroll>
      )}
    </>
  );
}
