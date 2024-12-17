import { exec } from 'child_process';
import { dialog } from 'electron';
import { join } from 'path';
import { BASE_PATH } from './index';
import { getDefaultPrinter } from './getDefaultPrinter';

export const exportPrinterConfigration = async () => {
  const configDirPath = join(BASE_PATH, 'config');

  const defaultPrinter = await getDefaultPrinter();
  exec(
    `( Get-PrintConfiguration -PrinterName ${defaultPrinter.displayName} ).PrintTicketXML | Out-File printerConfig.xml -Encoding ascii`,
    { shell: 'powershell.exe', cwd: configDirPath },
    (error, _, stderr) => {
      if (stderr || error) {
        console.log(error);
        dialog.showErrorBox('エラー', 'プリンタ構成情報の出力に失敗しました');
      }
    },
  );
};
