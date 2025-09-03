const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const SnapshotManager = require('../backend/snapshotManager');

let mainWindow;
let snapshotManager;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 650,
    minWidth: 800,
    minHeight: 500,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, '../preload/preload.js')
    },
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    backgroundColor: '#1a1a1a',
    icon: path.join(__dirname, '../../public/icon.png')
  });

  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../../build/index.html')}`
  );

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  snapshotManager = new SnapshotManager(app.getPath('userData'));
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.handle('create-snapshot', async (event, folderPath, version, projectName) => {
  try {
    const result = await snapshotManager.createSnapshot(folderPath, version, projectName);
    return { success: true, data: result };
  } catch (error) {
    // Error creating snapshot
    return { success: false, error: error.message };
  }
});

ipcMain.handle('list-snapshots', async (event, projectName) => {
  try {
    const snapshots = await snapshotManager.listSnapshots(projectName);
    return { success: true, data: snapshots };
  } catch (error) {
    // Error listing snapshots
    return { success: false, error: error.message };
  }
});

ipcMain.handle('list-all-snapshots', async () => {
  try {
    const snapshots = await snapshotManager.listAllSnapshots();
    return { success: true, data: snapshots };
  } catch (error) {
    // Error listing all snapshots
    return { success: false, error: error.message };
  }
});

ipcMain.handle('delete-snapshot', async (event, snapshotId) => {
  try {
    await snapshotManager.deleteSnapshot(snapshotId);
    return { success: true };
  } catch (error) {
    // Error deleting snapshot
    return { success: false, error: error.message };
  }
});

ipcMain.handle('open-snapshot-folder', async (event, fileName) => {
  try {
    const folderPath = snapshotManager.getSnapshotFolderPath();
    const filePath = path.join(folderPath, fileName);
    
    // Log paths for debugging in development only
    if (isDev) {
      console.log('Opening:', filePath);
    }
    
    // Verificar se o arquivo existe
    const fs = require('fs');
    if (!fs.existsSync(filePath)) {
      // File not found
      // Tentar criar o diretório se não existir
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }
      return { success: false, error: 'Arquivo não encontrado: ' + fileName };
    }
    
    shell.showItemInFolder(filePath);
    return { success: true };
  } catch (error) {
    // Error opening folder
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-next-version', async (event, projectName) => {
  try {
    const nextVersion = await snapshotManager.getNextVersion(projectName);
    return { success: true, data: nextVersion };
  } catch (error) {
    // Error getting next version
    return { success: false, error: error.message };
  }
});

ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  
  if (!result.canceled && result.filePaths.length > 0) {
    return { success: true, path: result.filePaths[0] };
  }
  
  return { success: false };
});

ipcMain.handle('compare-snapshots', async (event, snapshotId1, snapshotId2) => {
  try {
    const comparison = await snapshotManager.compareSnapshots(snapshotId1, snapshotId2);
    return { success: true, data: comparison };
  } catch (error) {
    // Error comparing snapshots
    return { success: false, error: error.message };
  }
});

ipcMain.handle('export-project-snapshots', async (event, projectName) => {
  try {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory', 'createDirectory'],
      title: 'Selecione o destino para exportar os snapshots'
    });
    
    if (!result.canceled && result.filePaths.length > 0) {
      const exportPath = result.filePaths[0];
      await snapshotManager.exportProjectSnapshots(projectName, exportPath);
      return { success: true, path: exportPath };
    }
    
    return { success: false, error: 'Exportação cancelada' };
  } catch (error) {
    // Error exporting snapshots
    return { success: false, error: error.message };
  }
});