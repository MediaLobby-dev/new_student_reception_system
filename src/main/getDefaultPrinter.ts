import { BrowserWindow, dialog } from 'electron';

export const getDefaultPrinter = async (): Promise<Electron.PrinterInfo> => {
  const mainWindow = BrowserWindow.getFocusedWindow() ?? BrowserWindow.getAllWindows()[0];
  const printerConfig = await mainWindow.webContents.getPrintersAsync();

  const isDefaultPrinter = printerConfig.filter((res) => res.isDefault === true);

  if (isDefaultPrinter && isDefaultPrinter.length >= 1) {
    return isDefaultPrinter[0];
  }

  dialog.showErrorBox(
    'エラー',
    '既定のプリンタが存在しません。代わりに接続済みプリンタのうちの1台を使用します',
  );

  return printerConfig[0];
};
