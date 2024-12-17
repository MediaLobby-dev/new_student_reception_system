import { BrowserWindow, dialog } from 'electron';
import { is } from '@electron-toolkit/utils';
import { join } from 'path';
import { BASE_PATH } from '../index';
import { readFileSync } from 'fs';
import { parseString } from 'xml2js';
import { getDefaultPrinter } from '../getDefaultPrinter';

type PrinterConfig = {
  mediaSizeWidth: number;
  mediaSizeHeight: number;
  resolutionX: number;
  resolutionY: number;
};

const getPrnterConfig = (): PrinterConfig => {
  const configDirPath = join(BASE_PATH, 'config');
  const xml = readFileSync(`${configDirPath}/printerConfig.xml`, 'utf-8');

  const config: PrinterConfig = {
    mediaSizeWidth: 0,
    mediaSizeHeight: 0,
    resolutionX: 0,
    resolutionY: 0,
  };

  parseString(xml, function (err, result) {
    if (err) {
      dialog.showErrorBox('エラー', 'プリンタ情報の取得に失敗しました。file: printRecipt.ts');
      return;
    }
    config.mediaSizeWidth = Number(
      result['psf:PrintTicket']['psf:Feature'][2]['psf:Option'][0]['psf:ScoredProperty'][0][
        'psf:Value'
      ][0]['_'],
    );
    config.mediaSizeHeight = Number(
      result['psf:PrintTicket']['psf:Feature'][2]['psf:Option'][0]['psf:ScoredProperty'][1][
        'psf:Value'
      ][0]['_'],
    );
    config.resolutionX = Number(
      result['psf:PrintTicket']['psf:Feature'][5]['psf:Option'][0]['psf:ScoredProperty'][0][
        'psf:Value'
      ][0]['_'],
    );
    config.resolutionY = Number(
      result['psf:PrintTicket']['psf:Feature'][5]['psf:Option'][0]['psf:ScoredProperty'][1][
        'psf:Value'
      ][0]['_'],
    );
  });

  return config;
};
export const printRecipt = async (
  studentId: string,
  studentName: string,
  kana: string,
  isTest: boolean,
) => {
  const mainWindow = BrowserWindow.getFocusedWindow() ?? BrowserWindow.getAllWindows()[0];

  const printWindow = new BrowserWindow({
    width: 400,
    autoHideMenuBar: true,
    show: false,
    parent: mainWindow,
  });

  printWindow.on('ready-to-show', () => {
    printWindow.show();
  });

  const url = join(__dirname, '../renderer/print.html');
  const timestamp = new Date().toLocaleString();

  const printer = await getDefaultPrinter();
  const printerCfg = getPrnterConfig();

  const printerOptions: Electron.WebContentsPrintOptions = {
    silent: true,
    deviceName: printer.displayName,
    margins: {
      marginType: 'custom',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
    pageSize: { width: printerCfg.mediaSizeWidth, height: printerCfg.mediaSizeHeight },
    dpi: { horizontal: printerCfg.resolutionX, vertical: printerCfg.resolutionY },
  };

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    printWindow.loadURL(
      `${process.env['ELECTRON_RENDERER_URL']}/print.html?studentId=${studentId}&studentName=${studentName}&kana=${kana}&timestamp=${timestamp}`,
    );
  } else {
    printWindow.loadURL(
      `${url}?studentId=${studentId}&studentName=${studentName}&kana=${kana}&timestamp=${timestamp}`,
    );
  }

  printWindow.webContents.on('did-finish-load', () => {
    if (isTest) {
      dialog
        .showMessageBox({
          type: 'question',
          title: '印刷テスト',
          message:
            'レシート印刷機の電源投入、Windows側で「規定のプリンター」に設定されているか確認してください。\n確認が完了したら「OK」を押してください。',
          normalizeAccessKeys: true,
          noLink: true,
          buttons: ['OK', 'キャンセル'],
        })
        .then((res) => {
          if (res.response === 0) {
            printWindow.webContents.print(printerOptions, (success, error) => {
              if (success) {
                dialog.showMessageBox({
                  type: 'info',
                  title: 'ジョブ送信完了',
                  message:
                    '印刷機へのジョブ送信が完了しました。\nレシートが出てこない場合は、設定を確認してください。',
                });
                console.log('Print successfully.');
              } else {
                console.log(error);
                dialog.showErrorBox(
                  'Error',
                  '印刷に失敗しました。プリンタ設定を確認してください。',
                );
              }
              printWindow.close();
            });
          } else {
            dialog.showMessageBox({
              type: 'info',
              title: '印刷テスト',
              message: '印刷テストがキャンセルされました。',
            });
          }
        });
      return;
    }

    printWindow.webContents.print(printerOptions, (success, error) => {
      if (success) {
        console.log('Print successfully.');
        printWindow.close();
      } else {
        console.log(error);
        dialog.showErrorBox('Error', '印刷に失敗しました。');
      }
    });
  });

  printWindow.on('close', (event) => {
    event.preventDefault();
    printWindow.hide();
  });
};
