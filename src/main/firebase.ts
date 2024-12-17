import { initializeApp, credential } from 'firebase-admin';
import { FirebaseAppError } from 'firebase-admin/app';
import { readFileSync } from 'fs';
import { join } from 'path';
import { BASE_PATH } from './index';
import { BrowserWindow } from 'electron';
import { dialog } from 'electron';

export const isExsistsFirebaseSDKJson = (): boolean => {
  try {
    return readFileSync(join(BASE_PATH, 'config', 'sdk.json')).length > 0;
  } catch (error) {
    return false;
  }
};

export const initializeFirebase = () => {
  if (!isExsistsFirebaseSDKJson()) {
    dialog.showMessageBox(BrowserWindow.getFocusedWindow() || BrowserWindow.getAllWindows()[0], {
      type: 'error',
      title: 'Firebase SDK 初期化エラー',
      message:
        'Firebase SDKの接続情報が存在しません。マニュアルを参照の上、[設定]から接続情報を設定してください。',
    });
    return;
  }
  try {
    initializeApp({
      credential: credential.cert(
        JSON.parse(readFileSync(join(BASE_PATH, 'config', 'sdk.json')).toString()),
      ),
    });
  } catch (error) {
    if (error instanceof FirebaseAppError) {
      dialog.showMessageBox(BrowserWindow.getFocusedWindow() || BrowserWindow.getAllWindows()[0], {
        type: 'error',
        title: 'エラー',
        message: 'Firebase SDKの初期化に失敗しました。',
      });
      return;
    }
  }
};
