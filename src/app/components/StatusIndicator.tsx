import { motion } from 'framer-motion';

export function StatusIndicator() {
  return (
    <motion.div
      className="fixed bottom-8 left-8 z-50 hidden md:flex items-center gap-3 bg-white/95 dark:bg-black/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-full shadow-lg"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 2 }}
    >
      <div className="relative">
        <motion.div
          className="w-2 h-2 bg-green-500 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.8, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full"
          animate={{
            scale: [1, 1.8, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>
      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Available for work</span>
    </motion.div>
  );
}
