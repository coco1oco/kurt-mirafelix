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
import { SmoothScroll } from './components/SmoothScroll';
import { MetaTags } from './components/MetaTags';
import { StatusIndicator } from './components/StatusIndicator';
import { SkipToContent } from './components/SkipToContent';
import { resumeUrl, RESUME_FILENAME } from './lib/resume';
import { useDarkMode } from './hooks/useDarkMode';
import { SectionErrorBoundary } from './components/SectionErrorBoundary';
import { FooterEasterEgg } from './components/FooterEasterEgg';
import { PageLoader } from './components/PageLoader';

export default function App() {
  const { isDark, toggle, toggleWithRipple } = useDarkMode();

  return (
    <>
      <PageLoader onComplete={() => {}} />
      <MetaTags />
      <SmoothScroll>
          <div
            className="min-h-screen bg-white dark:bg-black relative transition-colors duration-500"
          >
            <SkipToContent />
            <CustomCursor />
            <GrainTexture />
            <ScrollProgress />
            <FloatingNav isDark={isDark} onToggleDark={toggle} onToggleDarkWithRipple={toggleWithRipple} />
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

            {/* ── Footer ───────────────────────────────────────────────── */}
            <footer
              className="px-6 pt-14 pb-10 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black transition-colors duration-300 relative"
              role="contentinfo"
            >
              <div className="max-w-5xl mx-auto">

                {/* ── Row 1: name + links ─────────────────────────────── */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-8 sm:gap-4">
                  {/* Name + terminal prompt */}
                  <div className="space-y-2">
                    <span className="font-pixel font-normal text-xl text-gray-900 dark:text-gray-100 lowercase tracking-tight select-none block">
                      kurt michael mirafelix
                    </span>
                    <FooterEasterEgg />
                  </div>

                  {/* Links */}
                  <nav aria-label="Footer navigation" className="flex flex-row sm:flex-col gap-x-5 gap-y-1 sm:text-right">
                    {[
                      { label: 'GitHub', href: 'https://github.com/coco1oco', external: true, aria: 'GitHub profile' },
                      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/kurt-michael-mirafelix', external: true, aria: 'LinkedIn profile' },
                      { label: 'Email', href: 'mailto:kmirafelix@gmail.com', external: false, aria: 'Send email' },
                      { label: 'Résumé', href: resumeUrl, external: true, download: RESUME_FILENAME, aria: 'Download résumé (PDF)' },
                    ].map(({ label, href, external, download, aria }) => (
                      <a
                        key={label}
                        href={href}
                        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        {...(download ? { download } : {})}
                        aria-label={aria}
                        className="font-mono text-[11px] uppercase tracking-widest text-gray-400 dark:text-gray-600 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200 focus:outline-none focus-visible:underline"
                      >
                        {label}{external ? '\u00a0↗' : ''}
                      </a>
                    ))}
                  </nav>
                </div>

                {/* ── Hairline divider ────────────────────────────────── */}
                <div className="border-t border-gray-200 dark:border-gray-800 my-8" />

                {/* ── Row 2: copyright + tech stack ───────────────────── */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-600">
                    © 2026 · Cavite, Philippines
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-gray-300 dark:text-gray-700">
                    React · TypeScript · Tailwind · Framer Motion
                  </p>
                </div>


              </div>
            </footer>


            <BackToTop />
          </div>
      </SmoothScroll>
    </>
  );
}
