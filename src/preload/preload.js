const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  createSnapshot: (folderPath, version, projectName) => 
    ipcRenderer.invoke('create-snapshot', folderPath, version, projectName),
  
  listSnapshots: (projectName) => 
    ipcRenderer.invoke('list-snapshots', projectName),
  
  listAllSnapshots: () => 
    ipcRenderer.invoke('list-all-snapshots'),
  
  deleteSnapshot: (snapshotId) => 
    ipcRenderer.invoke('delete-snapshot', snapshotId),
  
  openSnapshotFolder: (fileName) => 
    ipcRenderer.invoke('open-snapshot-folder', fileName),
  
  getNextVersion: (projectName) => 
    ipcRenderer.invoke('get-next-version', projectName),
  
  selectFolder: () => 
    ipcRenderer.invoke('select-folder'),
  
  compareSnapshots: (snapshotId1, snapshotId2) => 
    ipcRenderer.invoke('compare-snapshots', snapshotId1, snapshotId2),
  
  exportProjectSnapshots: (projectName) => 
    ipcRenderer.invoke('export-project-snapshots', projectName)
});