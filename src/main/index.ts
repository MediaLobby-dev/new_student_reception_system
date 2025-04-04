import { app, shell, BrowserWindow, ipcMain, IpcMainInvokeEvent, dialog } from 'electron';
import { join } from 'path';
import fs from 'fs';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import { saveSdk } from './functions/saveSdk';
import { initializeFirebase } from './firebase';
import { getStudentData } from './functions/getStudentData';
import { acceptReception } from './functions/acceptReception';
import { editRemarks } from './functions/editRemark';
import { cancelReception } from './functions/cancelReception';
import { printRecipt } from './functions/printRecipt';
import { exportPrinterConfigration } from './exportPrinterConfigration';
import { countStudentData } from './functions/countStudentData';

export const BASE_PATH = app.getPath('home');

const createConfigDir = (window: BrowserWindow) => {
  const configDirPath = join(BASE_PATH, 'config');
  // 設定ディレクトリが存在しない場合は作成
  if (!fs.existsSync(configDirPath)) {
    try {
      fs.mkdirSync(configDirPath);
    } catch (error) {
      dialog.showMessageBox(window, {
        type: 'error',
        title: 'エラー',
        message: '設定ディレクトリの作成に失敗しました。',
      });
    }
  }
};

app.commandLine.appendSwitch('--autoplay-policy', 'no-user-gesture-required');

app.whenReady().then(() => {
  electronApp.setAppUserModelId('local.medialobby');

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  const mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    show: false,
    autoHideMenuBar: true,
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

  createConfigDir(mainWindow);
  initializeFirebase();
  exportPrinterConfigration();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// [IPC] Firebase SDK保存
ipcMain.handle('saveSdk', async () => saveSdk());

// [IPC] 生徒情報取得
ipcMain.handle('getStudentData', async (_event: IpcMainInvokeEvent, studentId: string) =>
  getStudentData(studentId),
);

// [IPC] 生徒受付
ipcMain.handle('acceptReception', async (_event: IpcMainInvokeEvent, studentId: string) =>
  acceptReception(studentId),
);

// [IPC] 備考欄編集
ipcMain.handle(
  'editRemarks',
  async (_event: IpcMainInvokeEvent, studentId: string, newRemark: string) =>
    editRemarks(studentId, newRemark),
);

// [IPC] 受付キャンセル
ipcMain.handle('cancelReception', async (_event: IpcMainInvokeEvent, studentId: string) =>
  cancelReception(studentId),
);

// [IPC] 印刷画面表示
ipcMain.handle(
  'printRecipt',
  async (_event: IpcMainInvokeEvent, studentId: string, studentName: string, kana: string) =>
    printRecipt(studentId, studentName, kana, false),
);

// [IPC] テスト印刷
ipcMain.handle('testPrint', async () =>
  printRecipt('00000000', 'テスト太郎', 'テストタロウ', true),
);

// [IPC] 合計学生数取得
ipcMain.handle('countStudentData', async () =>
  await countStudentData()
);
