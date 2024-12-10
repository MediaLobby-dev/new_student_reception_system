import { join } from 'path';
import fs from 'fs';
import { BASE_PATH } from '../index';
import { Response } from '../../types/response';
import { BrowserWindow, dialog } from 'electron';
import { initializeFirebase } from '../firebase';
import { ErrorCode } from '../../types/errorCode';

export const saveSdk = async (): Promise<Response<null>> => {
  const configDirPath = join(BASE_PATH, 'config');
  const sdkPath = join(configDirPath, 'sdk.json');

  // 設定ディレクトリが存在しない場合は作成
  if (!fs.existsSync(configDirPath)) {
    try {
      fs.mkdirSync(configDirPath);
    } catch (error) {
      return {
        status: false,
        data: null,
        error: {
          code: ErrorCode.CREATE_DIRECTORY_FAILED,
        }
      };
    }
  }

  const mainWin = BrowserWindow.getFocusedWindow() || BrowserWindow.getAllWindows()[0];
  // ファイルを選択
  const paths = dialog.showOpenDialogSync(mainWin, {
    buttonLabel: '開く',
    filters: [
      {
        name: 'sdk',
        extensions: ['json'],
      },
    ],
    properties: ['openFile', 'createDirectory'],
  });

  // ファイルが選択されなかった場合
  if (!paths || paths.length === 0) {
    return {
      status: false,
      data: null,
      error: {
        code: ErrorCode.NO_SELECTED_FILE,
      },
    };
  }

  // ファイルをコピー
  try {
    fs.copyFileSync(paths[0], sdkPath);
  } catch (error) {
    return {
      status: false,
      data: null,
      error: {
        code: ErrorCode.FAILED_FIREBASE_SDK_READ,
      },
    };
  }

  // Firebase SDKの初期化
  initializeFirebase();

  return {
    status: true,
    data: null,
  };
};
