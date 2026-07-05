import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BrowserData {
  ip: string;
  isp: string;
  city: string;
  region: string;
  country: string;
  loc: string; // coordinates
  cores: number;
  memory: number;
  language: string;
  userAgent: string;
  referrer: string;
}

export function FooterEasterEgg() {
  const [input, setInput] = useState('');
  const [isRevealed, setIsRevealed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<BrowserData | null>(null);

  // Lock scroll completely when modal is open
  useEffect(() => {
    if (isRevealed) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      setInput(''); // Reset input when closed
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isRevealed]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isRevealed) return;

    // Instantly reveal local data
    setData({
      ip: '...',
      isp: '...',
      city: '...',
      region: '...',
      country: '...',
      loc: 'Awaiting signal...',
      cores: navigator.hardwareConcurrency || 0,
      // @ts-ignore
      memory: navigator.deviceMemory || 0,
      language: navigator.language || (navigator.languages && navigator.languages[0]) || 'Unknown',
      userAgent: navigator.userAgent || 'Unknown',
      referrer: document.referrer || 'Direct (No Referrer)'
    });
    
    setIsRevealed(true);

    // Fetch IP asynchronously (fast)
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
          loc: prev.loc.includes('Exact') ? prev.loc : (ipData.latitude && ipData.longitude ? `${ipData.latitude}, ${ipData.longitude} (Approximate)` : 'Unknown')
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
          loc: prev.loc.includes('Exact') ? prev.loc : 'Unknown'
        } : null);
      });

    // Fetch precise GPS asynchronously (slow, triggers permission prompt)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setData(prev => prev ? {
            ...prev,
            loc: `${pos.coords.latitude.toFixed(6)}, ${pos.coords.longitude.toFixed(6)} (Exact)`
          } : null);
        },
        () => {
          setData(prev => prev && prev.loc === 'Awaiting signal...' ? {
            ...prev,
            loc: prev.ip !== '...' ? prev.loc : 'Denied'
          } : prev);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.8 } // Stagger each piece of info
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } }
  };

  return (
    <>
      <div className="w-full max-w-2xl mx-auto mt-24 text-left relative z-10">
        <form onSubmit={handleSubmit} className="relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Send me a message as anonymous:"
            className="w-full bg-transparent border-b border-gray-200 dark:border-gray-800 pb-3 text-sm font-mono text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-gray-900 dark:focus:border-gray-500 transition-colors"
            disabled={isRevealed || isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isRevealed || isLoading}
            className="absolute right-0 bottom-3 text-xs font-mono font-bold tracking-widest text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors disabled:opacity-0"
          >
            {isLoading ? 'WAIT' : 'SEND'}
          </button>
        </form>
      </div>

      <AnimatePresence>
        {isRevealed && data && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-white/60 dark:bg-black/80 backdrop-blur-md p-4 touch-none"
            onClick={() => setIsRevealed(false)}
            data-lenis-prevent
          >
            {/* Modal Container */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
              className="w-full max-w-3xl bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl p-6 sm:p-10 font-mono text-xs sm:text-sm text-gray-600 dark:text-gray-400 cursor-default max-h-[90vh] overflow-y-auto overscroll-contain"
              data-lenis-prevent
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-8"
              >
                <motion.p variants={itemVariants} className="text-gray-900 dark:text-gray-100 font-medium">
                  &gt; before i allow you to send that to me; here is what your browser sent me:
                </motion.p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                  <motion.div variants={itemVariants}>
                    <span className="text-gray-400 dark:text-gray-600 uppercase tracking-widest text-[10px] block mb-1">Public IP</span>
                    <span className="text-gray-900 dark:text-gray-100">{data.ip}</span>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <span className="text-gray-400 dark:text-gray-600 uppercase tracking-widest text-[10px] block mb-1">ISP / Provider</span>
                    <span className="text-gray-900 dark:text-gray-100">{data.isp}</span>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <span className="text-gray-400 dark:text-gray-600 uppercase tracking-widest text-[10px] block mb-1">Location</span>
                    <span className="text-gray-900 dark:text-gray-100">{data.city}, {data.region}</span>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <span className="text-gray-400 dark:text-gray-600 uppercase tracking-widest text-[10px] block mb-1">Coordinates</span>
                    <span className="text-gray-900 dark:text-gray-100">{data.loc}</span>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <span className="text-gray-400 dark:text-gray-600 uppercase tracking-widest text-[10px] block mb-1">CPU Cores</span>
                    <span className="text-gray-900 dark:text-gray-100">{data.cores ? data.cores : 'Unknown'}</span>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <span className="text-gray-400 dark:text-gray-600 uppercase tracking-widest text-[10px] block mb-1">Est. Memory</span>
                    <span className="text-gray-900 dark:text-gray-100">{data.memory ? `>= ${data.memory} GB RAM` : 'Unknown'}</span>
                  </motion.div>

                  {/* New Fields */}
                  <motion.div variants={itemVariants} className="sm:col-span-2">
                    <span className="text-gray-400 dark:text-gray-600 uppercase tracking-widest text-[10px] block mb-1">Language</span>
                    <span className="text-gray-900 dark:text-gray-100">{data.language}</span>
                  </motion.div>
                  <motion.div variants={itemVariants} className="sm:col-span-2">
                    <span className="text-gray-400 dark:text-gray-600 uppercase tracking-widest text-[10px] block mb-1">Referrer</span>
                    <span className="text-gray-900 dark:text-gray-100 truncate block">{data.referrer}</span>
                  </motion.div>
                  <motion.div variants={itemVariants} className="sm:col-span-2">
                    <span className="text-gray-400 dark:text-gray-600 uppercase tracking-widest text-[10px] block mb-1">User-Agent</span>
                    <span className="text-gray-900 dark:text-gray-100 leading-relaxed break-all">{data.userAgent}</span>
                  </motion.div>
                </div>

                <motion.div variants={itemVariants} className="pt-6 border-t border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-500 flex justify-between items-center">
                  <span>A gentle reminder that true anonymity on the web is an illusion. Stay safe.</span>
                  <button
                    onClick={() => setIsRevealed(false)}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-full font-sans font-medium text-xs transition-colors"
                  >
                    Dismiss
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
