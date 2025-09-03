import React from 'react';
import { motion } from 'framer-motion';
import { 
  FolderIcon,
  TrashIcon,
  ClockIcon,
  ServerIcon,
  DocumentDuplicateIcon 
} from '@heroicons/react/24/outline';
import { MESSAGES, DATE_FORMAT } from '../constants';

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString(DATE_FORMAT.locale, DATE_FORMAT.options);
};

const SnapshotCard = ({ snapshot, index, onOpen, onDelete }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
    className="group bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800 
             hover:border-zinc-700 transition-all duration-200 overflow-hidden"
  >
    <div className="p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-zinc-800 rounded-lg">
            <FolderIcon className="h-5 w-5 text-zinc-400" />
          </div>
          <div>
            <h3 className="font-medium text-sm">{snapshot.project}</h3>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-violet-900/50 text-violet-300 mt-1">
              v{snapshot.version}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2 text-xs text-zinc-500">
        <div className="flex items-center space-x-2">
          <ServerIcon className="h-4 w-4" />
          <span>{snapshot.size}</span>
        </div>
        <div className="flex items-center space-x-2">
          <DocumentDuplicateIcon className="h-4 w-4" />
          <span>{snapshot.file_count || 0} {MESSAGES.UI.FILES}</span>
        </div>
        <div className="flex items-center space-x-2">
          <ClockIcon className="h-4 w-4" />
          <span>{formatDate(snapshot.created_at)}</span>
        </div>
      </div>

      <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-zinc-800">
        <button
          onClick={() => onOpen(snapshot.file)}
          className="flex-1 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs font-medium
                   transition-colors flex items-center justify-center space-x-1"
          aria-label={`Abrir ${snapshot.file}`}
        >
          <FolderIcon className="h-4 w-4" />
          <span>{MESSAGES.UI.OPEN}</span>
        </button>
        <button
          onClick={() => onDelete(snapshot.id, snapshot.file)}
          className="px-3 py-1.5 bg-zinc-800 hover:bg-red-900/50 rounded-lg text-xs font-medium
                   transition-colors flex items-center justify-center hover:text-red-400"
          aria-label={`Excluir ${snapshot.file}`}
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  </motion.div>
);

export default SnapshotCard;