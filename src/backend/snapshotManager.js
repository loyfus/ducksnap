const fs = require('fs').promises;
const path = require('path');
const archiver = require('archiver');
const { createReadStream, createWriteStream, statSync } = require('fs');

class SnapshotManager {
  constructor(userDataPath) {
    // Usar um caminho fixo no home do usuário para desenvolvimento
    const os = require('os');
    const homeDir = os.homedir();
    const appDataDir = path.join(homeDir, '.duck-snap');
    
    this.snapshotsDir = path.join(appDataDir, 'snapshots');
    this.metadataPath = path.join(appDataDir, 'snapshots-metadata.json');
    this.snapshots = [];
    this.nextId = 1;
    
    this.initializeStorage();
    this.loadMetadata();
  }

  async initializeStorage() {
    try {
      await fs.mkdir(this.snapshotsDir, { recursive: true });
    } catch (error) {
      console.error('Error creating snapshots directory:', error);
    }
  }

  async loadMetadata() {
    try {
      const data = await fs.readFile(this.metadataPath, 'utf8');
      const metadata = JSON.parse(data);
      this.snapshots = metadata.snapshots || [];
      this.nextId = metadata.nextId || 1;
    } catch (error) {
      this.snapshots = [];
      this.nextId = 1;
    }
  }

  async saveMetadata() {
    try {
      const metadata = {
        snapshots: this.snapshots,
        nextId: this.nextId
      };
      await fs.writeFile(this.metadataPath, JSON.stringify(metadata, null, 2));
    } catch (error) {
      console.error('Error saving metadata:', error);
    }
  }

  async createSnapshot(folderPath, version, projectName) {
    const stats = statSync(folderPath);
    if (!stats.isDirectory()) {
      throw new Error('O caminho fornecido não é uma pasta válida');
    }

    projectName = projectName || path.basename(folderPath);
    const fileName = `${projectName}_v${version}.zip`;
    const filePath = path.join(this.snapshotsDir, fileName);

    const fileCount = await this.countFiles(folderPath);
    
    await this.createZip(folderPath, filePath);

    const fileStats = statSync(filePath);
    const fileSize = fileStats.size;

    const snapshot = {
      id: this.nextId++,
      project: projectName,
      version,
      file: fileName,
      size: fileSize,
      file_count: fileCount,
      created_at: new Date().toISOString(),
      original_path: folderPath
    };

    this.snapshots.push(snapshot);
    await this.saveMetadata();

    return {
      ...snapshot,
      size: this.formatFileSize(fileSize),
      fileCount
    };
  }

  async createZip(sourcePath, targetPath) {
    return new Promise((resolve, reject) => {
      const output = createWriteStream(targetPath);
      const archive = archiver('zip', {
        zlib: { level: 9 }
      });

      output.on('close', () => {
        resolve();
      });

      archive.on('error', (err) => {
        reject(err);
      });

      archive.pipe(output);

      const ignoreDirs = ['node_modules', '.git', 'target', 'dist', 'build', '.idea', '.vscode', '__pycache__', '.pytest_cache', '.next', '.nuxt', 'coverage', '.env'];
      
      archive.glob('**/*', {
        cwd: sourcePath,
        ignore: ignoreDirs.map(dir => `**/${dir}/**`),
        dot: true
      });

      archive.finalize();
    });
  }

  async countFiles(dirPath) {
    let count = 0;
    const ignoreDirs = ['node_modules', '.git', 'target', 'dist', 'build', '.idea', '.vscode', '__pycache__', '.pytest_cache', '.next', '.nuxt', 'coverage'];

    async function walkDir(currentPath) {
      const entries = await fs.readdir(currentPath, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(currentPath, entry.name);
        
        if (entry.isDirectory()) {
          if (!ignoreDirs.includes(entry.name)) {
            await walkDir(fullPath);
          }
        } else {
          count++;
        }
      }
    }

    await walkDir(dirPath);
    return count;
  }

  listSnapshots(projectName) {
    const snapshots = this.snapshots
      .filter(s => s.project === projectName)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    return snapshots.map(s => ({
      ...s,
      size: this.formatFileSize(s.size)
    }));
  }

  listAllSnapshots() {
    const snapshots = [...this.snapshots]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    return snapshots.map(s => ({
      ...s,
      size: this.formatFileSize(s.size)
    }));
  }

  async deleteSnapshot(snapshotId) {
    const snapshot = this.snapshots.find(s => s.id === snapshotId);

    if (snapshot) {
      const filePath = path.join(this.snapshotsDir, snapshot.file);
      try {
        await fs.unlink(filePath);
      } catch (error) {
        console.error('Error deleting file:', error);
      }

      this.snapshots = this.snapshots.filter(s => s.id !== snapshotId);
      await this.saveMetadata();
    }
  }

  getSnapshotFolderPath() {
    return this.snapshotsDir;
  }

  getNextVersion(projectName) {
    const projectSnapshots = this.snapshots
      .filter(s => s.project === projectName)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    const lastSnapshot = projectSnapshots[0];
    
    if (!lastSnapshot) {
      return '0.1';
    }

    const lastVersion = lastSnapshot.version;
    const parts = lastVersion.split('.');
    
    if (parts.length === 1) {
      const num = parseFloat(parts[0]);
      return (num + 0.1).toFixed(1);
    } else if (parts.length === 2) {
      const major = parseInt(parts[0]);
      const minor = parseInt(parts[1]);
      
      if (minor >= 9) {
        return `${major + 1}.0`;
      } else {
        return `${major}.${minor + 1}`;
      }
    }
    
    return '0.1';
  }

  compareSnapshots(snapshotId1, snapshotId2) {
    const snapshot1 = this.snapshots.find(s => s.id === snapshotId1);
    const snapshot2 = this.snapshots.find(s => s.id === snapshotId2);

    if (!snapshot1 || !snapshot2) {
      throw new Error('Snapshot não encontrado');
    }

    const sizeDiff = snapshot2.size - snapshot1.size;
    const fileCountDiff = snapshot2.file_count - snapshot1.file_count;
    
    const date1 = new Date(snapshot1.created_at);
    const date2 = new Date(snapshot2.created_at);
    const daysDiff = Math.ceil((date2 - date1) / (1000 * 60 * 60 * 24));

    return {
      snapshot1: {
        ...snapshot1,
        size: this.formatFileSize(snapshot1.size)
      },
      snapshot2: {
        ...snapshot2,
        size: this.formatFileSize(snapshot2.size)
      },
      differences: {
        sizeDiff: this.formatFileSize(Math.abs(sizeDiff)),
        sizeChange: sizeDiff > 0 ? 'increased' : sizeDiff < 0 ? 'decreased' : 'same',
        fileCountDiff,
        fileCountChange: fileCountDiff > 0 ? 'increased' : fileCountDiff < 0 ? 'decreased' : 'same',
        daysBetween: daysDiff
      }
    };
  }

  async exportProjectSnapshots(projectName, exportPath) {
    const snapshots = this.listSnapshots(projectName);
    const projectExportPath = path.join(exportPath, 'LoyfusSnaps', projectName);

    await fs.mkdir(projectExportPath, { recursive: true });

    for (const snapshot of snapshots) {
      const sourcePath = path.join(this.snapshotsDir, snapshot.file);
      const targetPath = path.join(projectExportPath, snapshot.file);
      
      await fs.copyFile(sourcePath, targetPath);
    }

    const metadataPath = path.join(projectExportPath, 'metadata.json');
    await fs.writeFile(metadataPath, JSON.stringify(snapshots, null, 2));

    return projectExportPath;
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  }

  close() {
    // No cleanup needed for JSON storage
  }
}

module.exports = SnapshotManager;