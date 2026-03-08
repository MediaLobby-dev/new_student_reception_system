import { BrowserWindow, dialog } from 'electron';
import { exec } from 'node:child_process';
import { BASE_PATH } from '.';
import { join } from 'node:path';

export const getDefaultPrinter = async (): Promise<Electron.PrinterInfo> => {
  const mainWindow = BrowserWindow.getFocusedWindow() ?? BrowserWindow.getAllWindows()[0];
  const printerConfig = await mainWindow.webContents.getPrintersAsync();

  const configDirPath = join(BASE_PATH, 'config');
  const wmiQuery = 'Get-WmiObject Win32_Printer | Where-Object { $_.Default -eq $true } | Select-Object -ExpandProperty Name';
  const defaultPrinterName = await new Promise<string>((resolve) => {
    exec(wmiQuery, { shell: 'powershell.exe', cwd: configDirPath }, (error, stdout, stderr) => {
      if (error || stderr) {
        console.error('Error fetching default printer:', error || stderr);
        throw new Error('Failed to fetch default printer');
      }
      resolve(stdout.trim());
    });
  });

    if (printerConfig.length === 0) {
    dialog.showErrorBox(
      'エラー',
      'プリンタを検出できませんでした。プリンタを接続してから再度アプリを起動してください。',
    );
    throw new Error('No printers found');
  }

  if (!defaultPrinterName) {
    dialog.showErrorBox(
      'エラー',
      '既定のプリンタが存在しません。代わりに接続済みプリンタのうちの1台を使用します。',
    );
    return printerConfig[0];
  }

  const defaultPrinter = printerConfig.filter((printer) => printer.displayName === defaultPrinterName);

  return defaultPrinter[0] || printerConfig[0];
};
