import { motion } from 'framer-motion';
import avatar from '../../imports/1x1.png';
import avatarShades from '../../imports/1x1_shades.png';

export function HeroAvatar() {
  return (
    <motion.div
      className="absolute top-8 left-8 z-20 group pointer-events-auto"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 1.2, ease: 'easeOut' }}
    >
      <div className="relative cursor-pointer">
        <img
          src={avatar}
          alt=""
          role="presentation"
          className="w-14 h-14 rounded-full object-cover transition-all duration-500 border-2 border-gray-300 dark:border-gray-700 group-hover:border-gray-900 dark:group-hover:border-gray-300 shadow-sm"
        />
        <img
          src={avatarShades}
          alt=""
          role="presentation"
          className="absolute top-0 left-0 w-14 h-14 rounded-full object-cover transition-all duration-500 border-2 border-gray-300 dark:border-gray-700 group-hover:border-gray-900 dark:group-hover:border-gray-300 shadow-sm opacity-0 group-hover:opacity-100"
        />
        {/* Tooltip — slides in on group hover */}
        <div 
          className="absolute left-16 top-1/2 -translate-y-1/2 whitespace-nowrap pointer-events-none opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out" 
          aria-hidden="true"
        >
          <div className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-medium px-3 py-1.5 rounded-full tracking-wide shadow-lg">
            Kurt Michael Mirafelix
          </div>
          {/* Arrow */}
          <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-gray-900 dark:bg-white rotate-45" />
        </div>
      </div>
    </motion.div>
  );
}
