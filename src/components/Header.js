import React from 'react';
import { motion } from 'framer-motion';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { DuckIconSimple } from '../DuckIcon';
import { MESSAGES, ANIMATION_CONFIG } from '../constants';

const Header = ({ onRefresh }) => (
  <header 
    className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-xl sticky top-0 z-50" 
    style={{ WebkitAppRegion: 'drag' }}
  >
    <div className="px-6 py-4 pt-8">
      <div className="flex items-center justify-center relative">
        <div className="absolute left-0 w-20" />
        
        <div className="flex items-center space-x-3">
          <motion.div 
            className="p-2 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-lg shadow-lg shadow-amber-500/20"
            whileHover={{ scale: 1.05, rotate: -5 }}
            whileTap={{ scale: 0.95 }}
            transition={ANIMATION_CONFIG.spring}
            style={{ WebkitAppRegion: 'no-drag' }}
          >
            <DuckIconSimple className="h-6 w-6 text-white" />
          </motion.div>
          <div>
            <h1 className="text-xl font-semibold bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
              Duck Snap
            </h1>
            <p className="text-xs text-zinc-500">{MESSAGES.UI.APP_SUBTITLE}</p>
          </div>
        </div>
        
        <div className="absolute right-0" style={{ WebkitAppRegion: 'no-drag' }}>
          <button
            onClick={onRefresh}
            className="p-2 text-zinc-400 hover:text-zinc-100 transition-colors"
            aria-label="Atualizar lista"
          >
            <ArrowPathIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  </header>
);

export default Header;