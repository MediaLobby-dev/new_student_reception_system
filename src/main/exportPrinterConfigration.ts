import { execa } from 'execa';
import { dialog } from 'electron';
import { getDefaultPrinter } from './getDefaultPrinter';

export const exportPrinterConfigration = async (configPath: string) => {
  const defaultPrinter = await getDefaultPrinter();
  const query = `( Get-PrintConfiguration -PrinterName "${defaultPrinter.displayName}" ).PrintTicketXML | Out-File printerConfig.xml -Encoding ascii`;

  await execa('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', query], { cwd: configPath })
    .catch((error) => {
      console.log(error);
      dialog.showErrorBox('エラー', 'プリンタ構成情報の出力に失敗しました。別のプリンタを接続し、既定のプリンタに設定してください。');
    });
};
