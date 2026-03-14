import { BrowserWindow } from 'electron';
import { execa } from 'execa';
import { BusinessError } from '../errors/BusinessError';
import { MessageCode } from '../types/messageCode';

export const getDefaultPrinter = async (): Promise<Electron.PrinterInfo> => {
  const mainWindow = BrowserWindow.getFocusedWindow() ?? BrowserWindow.getAllWindows()[0];
  const printerConfig = await mainWindow.webContents.getPrintersAsync();

  if (printerConfig.length === 0) {
    throw new BusinessError(MessageCode.PRINTER_NOT_FOUND);
  }

  const wmiQuery = 'Get-WmiObject Win32_Printer | Where-Object { $_.Default -eq $true } | Select-Object -ExpandProperty Name';
  const defaultPrinterName = await execa('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', wmiQuery])
    .then(result => result.stdout.trim())
    .catch((error) => {
      console.error('Error fetching default printer:', error);
      return '';
    });

  if (!defaultPrinterName) {
    console.warn('既定のプリンタが存在しません。接続済みプリンタのうちの1台を使用します。');
    return printerConfig[0];
  }

  const defaultPrinter = printerConfig.find((printer) => printer.displayName === defaultPrinterName);

  return defaultPrinter || printerConfig[0];
};
