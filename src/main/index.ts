import { app, shell, BrowserWindow, ipcMain, IpcMainInvokeEvent } from 'electron';
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import icon from '../../resources/icon.png?asset';
import { saveSdk } from './functions/saveSdk';
import { initializeFirebase } from './firebase';
import { getStudentData } from './functions/getStudentData';

export const BASE_PATH = app.getPath('home');

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 1400,
    height: 850,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux'
      ? {
        icon,
      }
      : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
    },
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return {
      action: 'deny',
    };
  });

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron');

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  createWindow();
  initializeFirebase();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// [IPC] Firebase SDK準備完了確認
ipcMain.handle('initializeFirebase', async () => initializeFirebase());

// [IPC] Firebase SDK保存
ipcMain.handle('saveSdk', async () => saveSdk());

// [IPC] 生徒情報取得
ipcMain.handle('getStudentData', async (event: IpcMainInvokeEvent, studentId: string) => getStudentData(studentId));

// [IPC] 生徒受付
ipcMain.handle('acceptReception', async () => {
  return [];
});

// [IPC] 備考欄編集
ipcMain.handle('editRemarks', async () => {
  return [];
});

// [IPC] 受付キャンセル
ipcMain.handle('cancelReception', async () => {
  return [];
});
