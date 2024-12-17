import { join } from 'path';
import fs from 'fs';
import { BASE_PATH } from '../index';
import { app, BrowserWindow, dialog } from 'electron';

export const saveSdk = async () => {
  const configDirPath = join(BASE_PATH, 'config');
  const sdkPath = join(configDirPath, 'sdk.json');

  // 設定ディレクトリが存在しない場合は作成
  if (!fs.existsSync(configDirPath)) {
    try {
      fs.mkdirSync(configDirPath);
    } catch (error) {
      dialog.showMessageBox(BrowserWindow.getFocusedWindow() || BrowserWindow.getAllWindows()[0], {
        type: 'error',
        title: 'エラー',
        message: '設定ディレクトリの作成に失敗しました。',
      });
    }
  } else {
    // ファイルが存在する場合は削除
    if (fs.existsSync(sdkPath)) {
      fs.unlinkSync(sdkPath);
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
    return;
  }

  // ファイルをコピー
  try {
    fs.copyFileSync(paths[0], sdkPath);
  } catch (error) {
    dialog.showMessageBox(mainWin, {
      type: 'error',
      title: 'エラー',
      message: 'SDKファイルのコピーに失敗しました。',
    });
  }

  // アプリの再起動を促す
  dialog
    .showMessageBox(mainWin, {
      type: 'info',
      title: 'アプリの再起動',
      message: 'Firebase SDKの設定が完了しました。\nアプリを再起動してください。',
      buttons: ['再起動'],
    })
    .then((res) => {
      if (res.response === 0) {
        app.relaunch();
        app.exit();
      }
    });
};
