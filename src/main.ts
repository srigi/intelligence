// App's specific main process code
import { BrowserWindow, app, ipcMain, screen } from 'electron';
import ElectronStore from 'electron-store';
import started from 'electron-squirrel-startup';
import fs from 'node:fs';
import path from 'node:path';

import { MAIN_WINDOW_WIDTH, MAIN_WINDOW_HEIGHT } from '~/constants/MainWindow';
import { Settings } from '~/types/Settings';
import { Tool } from '~/types/Tool';
import { debounce } from '~/utils/debounce';

const settings = new ElectronStore<Settings>();
const toolsDir = app.isPackaged ? path.join(app.getPath('userData'), 'tools') : path.join(process.cwd(), 'src/tools');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

// Set app icon on macOS during development.
if (!app.isPackaged && app.dock != null) {
  app.dock.setIcon(path.resolve(process.cwd(), `src/assets/icons/icon.png`));
}

ElectronStore.initRenderer();

const createMainWindow = () => {
  const display = screen.getPrimaryDisplay();
  const [x, y] = settings.get('mainWindowPosition', [(display.bounds.width - MAIN_WINDOW_WIDTH) / 2, 150]);
  const mainWindow = new BrowserWindow({
    fullscreenable: false,
    width: MAIN_WINDOW_WIDTH,
    height: MAIN_WINDOW_HEIGHT,
    x,
    y,
    webPreferences: {
      contextIsolation: true,
      devTools: !app.isPackaged,
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.on(
    'move',
    debounce(500, () => settings.set('mainWindowPosition', mainWindow.getPosition())),
  );

  // Load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }
};

app.on('window-all-closed', () => {
  // Quit when all windows are closed, except on macOS. There, it's common
  // for applications and their menu bar to stay active until the user quits
  // explicitly with Cmd + Q.
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
function getAvailableTools() {
  const tools: Tool[] = [];

  try {
    const toolDirs = fs.readdirSync(toolsDir).filter((dir) => fs.statSync(path.join(toolsDir, dir)).isDirectory());
    for (const dir of toolDirs) {
      try {
        // Dynamic import would be ideal, but for simplicity we'll use require
        const toolPath = app.isPackaged
          ? path.join(toolsDir, dir, 'index.js') // In production, it's compiled to .js
          : path.join(toolsDir, dir, 'index.ts'); // In development, it's .ts
        const toolModule = require(toolPath).default;

        tools.push(toolModule);
        console.log(`Loaded tool: ${toolModule.id} - ${toolModule.description}`);
      } catch (err) {
        console.error(`Error loading tool from directory ${dir}:`, err);
      }
    }
    console.log(`Loaded ${tools.length} tools`);
  } catch (err) {
    console.error('Error scanning tools directory:', err);
  }

  return tools;
}

// Some APIs can only be used after this event occurs.
app.on('ready', function () {
  createMainWindow();
  ipcMain.handle('get-available-tools', getAvailableTools);
});
