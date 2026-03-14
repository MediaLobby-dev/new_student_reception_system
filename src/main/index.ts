import { app, shell, BrowserWindow, ipcMain, IpcMainInvokeEvent, dialog } from 'electron';
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import { getStudentData } from './functions/getStudentData';
import { acceptReception } from './functions/acceptReception';
import { editRemarks } from './functions/editRemark';
import { cancelReception } from './functions/cancelReception';
import { printRecipt } from './functions/printRecipt';
import { exportPrinterConfigration } from './exportPrinterConfigration';
import { countStudentData } from './functions/countStudentData';
import { initialize } from './initialize';
import { BusinessError } from '../errors/BusinessError';
import { ErrorResponseDto } from '../dto/ErrorResponseDto';
import { MessageCode, MessageCodeList } from '../types/messageCode';

export const BASE_PATH = app.getPath('home');
export const CONFIG_PATH = join(BASE_PATH, 'config');

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

  initialize(CONFIG_PATH);
  exportPrinterConfigration(CONFIG_PATH);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// [IPC] 生徒情報取得
ipcMain.handle('getStudentData', async (_event: IpcMainInvokeEvent, studentId: string) => {
  try {
    return await getStudentData(studentId);
  } catch (err) {
    const code = err instanceof BusinessError ? err.code : MessageCode.INTERNAL_SERVER_ERROR;
    return new ErrorResponseDto(code);
  }
});

// [IPC] 生徒受付
ipcMain.handle('acceptReception', async (_event: IpcMainInvokeEvent, studentId: string) => {
  try {
    return await acceptReception(studentId);
  } catch (err) {
    if (err instanceof BusinessError) {
      const info = MessageCodeList[err.code];
      dialog.showErrorBox(info.title ?? 'エラー', info.message);
      return new ErrorResponseDto(err.code);
    }
    dialog.showErrorBox('エラー', '予期せぬエラーが発生しました');
    return new ErrorResponseDto(MessageCode.INTERNAL_SERVER_ERROR);
  }
});

// [IPC] 備考欄編集
ipcMain.handle(
  'editRemarks',
  async (_event: IpcMainInvokeEvent, studentId: string, newRemark: string) => {
    try {
      return await editRemarks(studentId, newRemark);
    } catch (err) {
      if (err instanceof BusinessError) {
        const info = MessageCodeList[err.code];
        dialog.showErrorBox(info.title ?? 'エラー', info.message);
        return new ErrorResponseDto(err.code);
      }
      dialog.showErrorBox('エラー', '予期せぬエラーが発生しました');
      return new ErrorResponseDto(MessageCode.INTERNAL_SERVER_ERROR);
    }
  },
);

// [IPC] 受付キャンセル
ipcMain.handle('cancelReception', async (_event: IpcMainInvokeEvent, studentId: string) => {
  try {
    return await cancelReception(studentId);
  } catch (err) {
    if (err instanceof BusinessError) {
      const info = MessageCodeList[err.code];
      dialog.showErrorBox(info.title ?? 'エラー', info.message);
      return new ErrorResponseDto(err.code);
    }
    dialog.showErrorBox('エラー', '予期せぬエラーが発生しました');
    return new ErrorResponseDto(MessageCode.INTERNAL_SERVER_ERROR);
  }
});

// [IPC] 印刷画面表示
ipcMain.handle(
  'printRecipt',
  async (_event: IpcMainInvokeEvent, studentId: string, studentName: string, kana: string) => {
    try {
      return await printRecipt(studentId, studentName, kana, false);
    } catch (err) {
      if (err instanceof BusinessError) {
        const info = MessageCodeList[err.code];
        dialog.showErrorBox(info.title ?? 'エラー', info.message);
        return new ErrorResponseDto(err.code);
      }
      dialog.showErrorBox('エラー', '予期せぬエラーが発生しました');
      return new ErrorResponseDto(MessageCode.INTERNAL_SERVER_ERROR);
    }
  },
);

// [IPC] テスト印刷
ipcMain.handle('testPrint', async () => {
  await printRecipt('00000000', 'テスト太郎', 'テストタロウ', true);
});

// [IPC] 合計学生数取得
ipcMain.handle('countStudentData', async () => {
  try {
    return await countStudentData();
  } catch (err) {
    if (err instanceof BusinessError) {
      const info = MessageCodeList[err.code];
      dialog.showErrorBox(info.title ?? 'エラー', info.message);
      return new ErrorResponseDto(err.code);
    }
    dialog.showErrorBox('エラー', '予期せぬエラーが発生しました');
    return new ErrorResponseDto(MessageCode.INTERNAL_SERVER_ERROR);
  }
});
