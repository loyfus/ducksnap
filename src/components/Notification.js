import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon 
} from '@heroicons/react/24/outline';
import { ANIMATION_CONFIG } from '../constants';

const notificationStyles = {
  success: 'bg-emerald-900/90 text-emerald-100 border-emerald-800',
  error: 'bg-red-900/90 text-red-100 border-red-800',
  info: 'bg-blue-900/90 text-blue-100 border-blue-800'
};

const notificationIcons = {
  success: CheckCircleIcon,
  error: XCircleIcon,
  info: InformationCircleIcon
};

const Notification = ({ notification }) => {
  if (!notification) return null;
  
  const Icon = notificationIcons[notification.type];
  
  return (
    <AnimatePresence>
      <motion.div
        {...ANIMATION_CONFIG.notification}
        className="fixed top-20 right-6 z-50"
      >
        <div className={`
          flex items-center space-x-2 px-4 py-3 rounded-lg shadow-xl
          backdrop-blur-sm border ${notificationStyles[notification.type]}
        `}>
          <Icon className="h-5 w-5" />
          <span className="text-sm font-medium">{notification.message}</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Notification;