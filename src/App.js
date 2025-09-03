import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { 
  FolderPlusIcon,
  DocumentDuplicateIcon,
  ArrowPathIcon,
  SparklesIcon 
} from '@heroicons/react/24/outline';
import { FolderIcon as FolderSolidIcon } from '@heroicons/react/24/solid';

import Header from './components/Header';
import Notification from './components/Notification';
import SnapshotCard from './components/SnapshotCard';
import { MESSAGES, NOTIFICATION_DURATION, ANIMATION_CONFIG } from './constants';

const extractProjectName = (path) => path.split('/').pop();

function App() {
  const [snapshots, setSnapshots] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [version, setVersion] = useState('');
  const [projectName, setProjectName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [notification, setNotification] = useState(null);
  const [selectedProject, setSelectedProject] = useState('all');

  useEffect(() => {
    loadSnapshots();
  }, []);

  useEffect(() => {
    if (selectedFolder && projectName) {
      fetchSuggestedVersion();
    }
  }, [selectedFolder, projectName]);

  const loadSnapshots = async () => {
    const result = await window.electronAPI.listAllSnapshots();
    if (result.success) {
      setSnapshots(result.data);
    }
  };

  const fetchSuggestedVersion = async () => {
    if (!projectName) return;
    
    const result = await window.electronAPI.getNextVersion(projectName);
    if (result.success) {
      setVersion(result.data);
    }
  };

  const handleFolderSelection = useCallback((path) => {
    setSelectedFolder(path);
    setProjectName(extractProjectName(path));
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0 && acceptedFiles[0].path) {
      handleFolderSelection(acceptedFiles[0].path);
    }
  }, [handleFolderSelection]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: false,
    noKeyboard: true
  });

  const showNotification = useCallback((type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), NOTIFICATION_DURATION);
  }, []);

  const resetForm = () => {
    setVersion('');
    setSelectedFolder(null);
    setProjectName('');
  };

  const handleCreateSnapshot = async () => {
    if (!selectedFolder || !version || !projectName) {
      showNotification('error', MESSAGES.ERRORS.FILL_FIELDS);
      return;
    }

    setIsCreating(true);
    
    try {
      const result = await window.electronAPI.createSnapshot(selectedFolder, version, projectName);
      
      if (result.success) {
        showNotification('success', MESSAGES.SUCCESS.SNAPSHOT_CREATED.replace('{version}', version));
        await loadSnapshots();
        resetForm();
      } else {
        showNotification('error', result.error || MESSAGES.ERRORS.CREATE_FAILED);
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteSnapshot = async (id) => {
    const result = await window.electronAPI.deleteSnapshot(id);
    
    if (result.success) {
      showNotification('success', MESSAGES.SUCCESS.SNAPSHOT_DELETED);
      await loadSnapshots();
    } else {
      showNotification('error', MESSAGES.ERRORS.DELETE_FAILED);
    }
  };

  const handleOpenFolder = async (fileName) => {
    const result = await window.electronAPI.openSnapshotFolder(fileName);
    
    if (!result.success) {
      showNotification('error', result.error || MESSAGES.ERRORS.OPEN_FOLDER_FAILED);
    }
  };

  const getUniqueProjects = () => [...new Set(snapshots.map(s => s.project))];

  const filteredSnapshots = selectedProject === 'all' 
    ? snapshots 
    : snapshots.filter(s => s.project === selectedProject);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
      <Header onRefresh={loadSnapshots} />
      <Notification notification={notification} />

      <div className="max-w-7xl mx-auto p-6">
        {/* Create Snapshot Section */}
        <motion.div {...ANIMATION_CONFIG.fadeIn} className="mb-8">
          <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center space-x-2 mb-6">
                <SparklesIcon className="h-5 w-5 text-amber-400" />
                <h2 className="text-lg font-semibold">{MESSAGES.UI.CREATE_SNAPSHOT}</h2>
              </div>

              {/* Dropzone */}
              <div
                {...getRootProps()}
                className={`
                  relative group cursor-pointer
                  border-2 border-dashed rounded-lg p-8
                  transition-all duration-200
                  ${isDragActive 
                    ? 'border-violet-500 bg-violet-500/10' 
                    : selectedFolder
                    ? 'border-emerald-600 bg-emerald-900/20'
                    : 'border-zinc-700 hover:border-zinc-600 bg-zinc-800/30'
                  }
                `}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center space-y-3">
                  {selectedFolder ? (
                    <>
                      <FolderSolidIcon className="h-12 w-12 text-emerald-500" />
                      <div className="text-center">
                        <p className="text-sm font-medium text-zinc-100">{selectedFolder}</p>
                        <p className="text-xs text-zinc-500 mt-1">{MESSAGES.UI.READY_TO_CREATE}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <FolderPlusIcon className="h-12 w-12 text-zinc-600 group-hover:text-zinc-500 transition-colors" />
                      <div className="text-center">
                        <p className="text-sm font-medium text-zinc-300">
                          {isDragActive ? MESSAGES.UI.DRAG_ACTIVE : MESSAGES.UI.DRAG_INACTIVE}
                        </p>
                        <p className="text-xs text-zinc-500 mt-1">{MESSAGES.UI.CLICK_TO_BROWSE}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Form Controls */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-2">
                    {MESSAGES.UI.PROJECT_NAME}
                  </label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm
                             focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500
                             transition-colors"
                    placeholder="meu-projeto"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-2">
                    {MESSAGES.UI.VERSION}
                  </label>
                  <input
                    type="text"
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm
                             focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500
                             transition-colors"
                    placeholder="1.0.0"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    onClick={handleCreateSnapshot}
                    disabled={isCreating || !selectedFolder || !version || !projectName}
                    className="w-full px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-zinc-900 rounded-lg
                             font-medium text-sm hover:from-amber-600 hover:to-yellow-600
                             disabled:opacity-50 disabled:cursor-not-allowed
                             transition-all duration-200 transform hover:scale-[1.02]
                             shadow-lg shadow-amber-500/20"
                  >
                    {isCreating ? (
                      <span className="flex items-center justify-center space-x-2">
                        <ArrowPathIcon className="h-4 w-4 animate-spin" />
                        <span>{MESSAGES.UI.CREATING}</span>
                      </span>
                    ) : (
                      MESSAGES.UI.CREATE_BUTTON
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Snapshots List */}
        <motion.div
          {...ANIMATION_CONFIG.fadeIn}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">{MESSAGES.UI.SAVED_SNAPSHOTS}</h2>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm
                       focus:outline-none focus:border-violet-500 transition-colors"
              aria-label="Filtrar por projeto"
            >
              <option value="all">{MESSAGES.UI.ALL_PROJECTS}</option>
              {getUniqueProjects().map(project => (
                <option key={project} value={project}>{project}</option>
              ))}
            </select>
          </div>

          {filteredSnapshots.length === 0 ? (
            <div className="bg-zinc-900/30 rounded-xl border border-zinc-800 p-12">
              <div className="text-center">
                <DocumentDuplicateIcon className="h-16 w-16 text-zinc-700 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-zinc-400 mb-2">{MESSAGES.UI.NO_SNAPSHOTS}</h3>
                <p className="text-sm text-zinc-600">{MESSAGES.UI.NO_SNAPSHOTS_HINT}</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSnapshots.map((snapshot, index) => (
                <SnapshotCard
                  key={snapshot.id}
                  snapshot={snapshot}
                  index={index}
                  onOpen={handleOpenFolder}
                  onDelete={handleDeleteSnapshot}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default App;