import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BrowserData {
  ip: string;
  isp: string;
  city: string;
  region: string;
  country: string;
  cores: number;
  memory: number;
  language: string;
  userAgent: string;
  parsedBrowser: string;
  referrer: string;
  timezone: string;
  localTime: string;
  screen: string;
  connection: string;
}

// ─── UA Parser ────────────────────────────────────────────────────────────────
function parseBrowser(ua: string): string {
  const rules: [RegExp, (m: RegExpMatchArray) => string][] = [
    [/Edg\/(\d+)/, (m) => `Edge ${m[1]}`],
    [/SamsungBrowser\/(\d+)/, (m) => `Samsung Browser ${m[1]}`],
    [/OPR\/(\d+)/, (m) => `Opera ${m[1]}`],
    [/Opera\/(\d+)/, (m) => `Opera ${m[1]}`],
    [/Firefox\/(\d+)/, (m) => `Firefox ${m[1]}`],
    [/Chrome\/(\d+)/, (m) => `Chrome ${m[1]}`],
    [/Version\/(\d+).*Safari/, (m) => `Safari ${m[1]}`],
    [/Safari\/(\d+)/, (m) => `Safari ${m[1]}`],
  ];

  let browser = 'Unknown Browser';
  for (const [pattern, label] of rules) {
    const m = ua.match(pattern);
    if (m) { browser = label(m); break; }
  }

  const osRules: [RegExp, string][] = [
    [/Windows NT 10\.0/, 'Windows 10/11'],
    [/Windows NT 6\.3/, 'Windows 8.1'],
    [/Windows NT 6\.2/, 'Windows 8'],
    [/Windows NT 6\.1/, 'Windows 7'],
    [/Mac OS X (\d+[_\d]+)/, 'macOS'],
    [/iPhone OS (\d+)/, 'iOS'],
    [/iPad.*OS (\d+)/, 'iPadOS'],
    [/Android (\d+)/, 'Android'],
    [/Linux/, 'Linux'],
  ];

  let os = '';
  for (const [pattern, label] of osRules) {
    if (pattern.test(ua)) { os = label; break; }
  }

  return os ? `${browser} on ${os}` : browser;
}

// ─── Connection ───────────────────────────────────────────────────────────────
function getConnection(): string {
  const nav = navigator as Navigator & { connection?: { effectiveType?: string; type?: string } };
  const conn = nav.connection;
  if (!conn) return 'Unknown';
  const parts: string[] = [];
  if (conn.type) parts.push(conn.type);
  if (conn.effectiveType) parts.push(conn.effectiveType);
  return parts.length ? parts.join(' — ') : 'Unknown';
}

// ─── Screen ───────────────────────────────────────────────────────────────────
function getScreen(): string {
  const w = window.screen.width * window.devicePixelRatio;
  const h = window.screen.height * window.devicePixelRatio;
  const depth = window.screen.colorDepth;
  return `${Math.round(w)}×${Math.round(h)} — ${depth}-bit`;
}

// ─── Timezone ─────────────────────────────────────────────────────────────────
function getTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

function getLocalTime(): string {
  return new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: true });
}

// ─── Referrer ─────────────────────────────────────────────────────────────────
function formatReferrer(raw: string): string {
  if (!raw) return 'kurtmichaelmirafelix.dev';
  try {
    return new URL(raw).hostname || raw;
  } catch {
    return raw;
  }
}

// ─── Terminal Prompt Trigger ──────────────────────────────────────────────────
export function FooterTerminal() {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [localTime, setLocalTime] = useState(getLocalTime());
  const [data, setData] = useState<BrowserData | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep local time ticking while modal is open
  useEffect(() => {
    if (!isRevealed) return;
    const id = setInterval(() => setLocalTime(getLocalTime()), 10_000);
    return () => clearInterval(id);
  }, [isRevealed]);

  // Lock scroll when modal is open
  useEffect(() => {
    if (isRevealed) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      setInput('');
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isRevealed]);

  const handlePromptClick = () => {
    inputRef.current?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isRevealed) return;

    const ua = navigator.userAgent || 'Unknown';

    setData({
      ip: '...',
      isp: '...',
      city: '...',
      region: '...',
      country: '...',
      cores: navigator.hardwareConcurrency || 0,
      // @ts-ignore
      memory: navigator.deviceMemory || 0,
      language: navigator.language || (navigator.languages && navigator.languages[0]) || 'Unknown',
      userAgent: ua,
      parsedBrowser: parseBrowser(ua),
      referrer: formatReferrer(document.referrer),
      timezone: getTimezone(),
      localTime: getLocalTime(),
      screen: getScreen(),
      connection: getConnection(),
    });

    setIsRevealed(true);

    // Fetch IP asynchronously
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(ipData => {
        setData(prev => prev ? {
          ...prev,
          ip: ipData.ip || 'Unknown',
          isp: ipData.org || 'Unknown',
          city: ipData.city || 'Unknown',
          region: ipData.region || 'Unknown',
          country: ipData.country_name || 'Unknown',
        } : null);
      })
      .catch(() => {
        setData(prev => prev ? {
          ...prev,
          ip: 'Blocked by client',
          isp: 'Blocked by client',
          city: 'Unknown',
          region: 'Unknown',
          country: 'Unknown',
        } : null);
      });
  };

  // ─── Animation variants ────────────────────────────────────────────────────
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { delayChildren: 1, staggerChildren: 1 }
    }
  };

  const headingVariants = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] as const } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } }
  };

  // Alt+K shortcut — focus the terminal input from anywhere on the page
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === 'k' && !isRevealed) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isRevealed]);


  return (
    <>
      {/* Terminal prompt line */}
      <div
        className="flex items-center gap-0 cursor-text group"
        onClick={handlePromptClick}
        role="button"
        tabIndex={-1}
        aria-label="Anonymous message prompt (Alt+K)"
      >
        {/* Prompt prefix */}
        <span className="font-mono text-[11px] text-gray-500 dark:text-gray-500 select-none transition-colors duration-200 group-hover:text-gray-900 dark:group-hover:text-gray-100 mr-1.5">
          &gt;
        </span>

        <div className="relative flex-1 flex items-center h-6">
          {/* Idle state overlay — grouped together on the left */}
          <AnimatePresence>
            {!isFocused && !input && !isRevealed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 flex items-center gap-1.5 pointer-events-none"
              >
                <span className="font-mono text-[11px] text-gray-500 dark:text-gray-500 select-none transition-colors duration-200 group-hover:text-gray-900 dark:group-hover:text-gray-100">
                  ask me something
                </span>

                {/* Keycap badge */}
                <span className="flex items-center gap-0.5 select-none opacity-80 group-hover:opacity-100 transition-opacity duration-200" aria-label="keyboard shortcut Alt K">
                  <kbd className="font-mono text-[9px] text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-800 rounded px-1 py-px leading-none">
                    Alt
                  </kbd>
                  <span className="font-mono text-[9px] text-gray-400 dark:text-gray-500">+</span>
                  <kbd className="font-mono text-[9px] text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-800 rounded px-1 py-px leading-none">
                    K
                  </kbd>
                </span>

                {/* Blinking _ */}
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
                  className="font-mono text-[11px] text-gray-500 dark:text-gray-500 select-none group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-200 ml-0.5"
                >
                  _
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actual hidden input */}
          <form onSubmit={handleSubmit} className="w-full flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              disabled={isRevealed}
              aria-label="Type a message to send anonymously"
              className="w-full bg-transparent border-none outline-none font-mono text-[11px] text-gray-700 dark:text-gray-300 caret-gray-500 dark:caret-gray-400 placeholder-transparent disabled:cursor-not-allowed"
              style={{ caretColor: 'currentColor' }}
            />
          </form>
        </div>
      </div>



      {/* Modal overlay */}
      <AnimatePresence>
        {isRevealed && data && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-white/60 dark:bg-black/80 backdrop-blur-md p-4 touch-none overflow-hidden"
            onClick={() => setIsRevealed(false)}
            onWheel={(e) => e.preventDefault()}
            onTouchMove={(e) => e.preventDefault()}
            data-lenis-prevent
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
              className="w-full max-w-2xl bg-white dark:bg-[#0c0c0f] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-[0px_40px_90px_-20px_rgba(0,0,0,0.30)] dark:shadow-[0px_40px_90px_-20px_rgba(0,0,0,0.60)] p-7 sm:p-10 cursor-default overflow-hidden"
              data-lenis-prevent
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-7"
              >
                {/* ── Heading ─────────────────────────────────────────── */}
                <motion.p
                  variants={headingVariants}
                  className="font-pixel text-sm text-gray-900 dark:text-gray-100 lowercase leading-snug"
                >
                  before i allow you to send that to me —<br />
                  here is what your browser sent me:
                </motion.p>

                {/* ── Data grid ───────────────────────────────────────── */}
                <div className="border-t border-gray-200 dark:border-gray-800">
                  {[
                    { label: 'Public IP', value: data.ip, span: false },
                    { label: 'ISP', value: data.isp, span: false },
                    { label: 'Location', value: `${data.city}, ${data.region}`, span: false },
                    { label: 'Connection', value: data.connection, span: false },
                    { label: 'CPU Cores', value: data.cores ? String(data.cores) : 'Unknown', span: false },
                    { label: 'Memory', value: data.memory ? `≥ ${data.memory} GB RAM` : 'Unknown', span: false },
                    { label: 'Screen', value: data.screen, span: false },
                    { label: 'Language', value: data.language, span: false },
                    { label: 'Timezone', value: `${data.timezone} — ${localTime} local`, span: false },
                    { label: 'Referrer', value: data.referrer, span: true },
                  ].map(({ label, value }) => (
                    <motion.div
                      key={label}
                      variants={itemVariants}
                      className="grid grid-cols-[7rem_1fr] border-b border-gray-100 dark:border-gray-800/60 py-2.5 gap-4"
                    >
                      <span className="font-mono text-[9px] uppercase tracking-widest text-gray-400 dark:text-gray-600 pt-px leading-none self-start">
                        {label}
                      </span>
                      <span className="font-sans text-[13px] text-gray-900 dark:text-gray-100 leading-snug truncate">
                        {value}
                      </span>
                    </motion.div>
                  ))}

                  {/* Browser — two-line: parsed label + raw UA */}
                  <motion.div
                    variants={itemVariants}
                    className="grid grid-cols-[7rem_1fr] border-b border-gray-100 dark:border-gray-800/60 py-2.5 gap-4"
                  >
                    <span className="font-mono text-[9px] uppercase tracking-widest text-gray-400 dark:text-gray-600 pt-px leading-none self-start">
                      Browser
                    </span>
                    <span className="space-y-1">
                      <span className="font-sans text-[13px] text-gray-900 dark:text-gray-100 leading-snug block">
                        {data.parsedBrowser}
                      </span>
                      <span className="font-mono text-[9px] text-gray-400 dark:text-gray-600 leading-relaxed break-all block">
                        {data.userAgent}
                      </span>
                    </span>
                  </motion.div>
                </div>

                {/* ── Footer bar ──────────────────────────────────────── */}
                <motion.div
                  variants={itemVariants}
                  className="flex items-center justify-between pt-1"
                >
                  <p className="font-mono text-[10px] text-gray-400 dark:text-gray-600 leading-relaxed max-w-xs">
                    true anonymity on the web is an illusion. stay safe.
                  </p>
                  <button
                    onClick={() => setIsRevealed(false)}
                    className="font-mono text-[11px] uppercase tracking-widest text-gray-400 dark:text-gray-600 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200 focus:outline-none whitespace-nowrap"
                  >
                    dismiss →
                  </button>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// backward-compat alias
export { FooterTerminal as FooterEasterEgg };
