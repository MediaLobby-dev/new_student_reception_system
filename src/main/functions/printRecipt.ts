import { BrowserWindow, dialog } from 'electron';
import { is } from '@electron-toolkit/utils';
import { join } from 'path';
import { BASE_PATH } from '../index';
import { readFileSync } from 'fs';
import { parseStringPromise } from 'xml2js';
import { getDefaultPrinter } from '../getDefaultPrinter';

type PrinterConfig = {
  MediaSizeWidth: number,
  MediaSizeHeight: number,
  ResolutionX: number,
  ResolutionY: number
};

async function extractValuesFromXML(
  xmlString: string
): Promise<PrinterConfig> {
  // XMLをJavaScriptオブジェクトに変換
  const xmlObject = await parseStringPromise(xmlString, {
    explicitArray: false, // 配列ではなく単一のオブジェクトとして取得
    tagNameProcessors: [(name) => name.replace(/^.*:/, "")], // 名前空間を無視
  });

  const results: PrinterConfig = {
    MediaSizeWidth: 0,
    MediaSizeHeight: 0,
    ResolutionX: 0,
    ResolutionY: 0
  };

  const propertyNames = ["MediaSizeWidth", "MediaSizeHeight", "ResolutionX", "ResolutionY"];

  // 再帰的にオブジェクトを探索して値を取得
  function search(obj: unknown, target: string): string | undefined {
    if (!obj || typeof obj !== "object") return undefined;

    for (const key of Object.keys(obj)) {
      if (key === "ScoredProperty") {
        const scoredProps = Array.isArray(obj[key]) ? obj[key] : [obj[key]];
        for (const scoredProp of scoredProps) {
          if (scoredProp.$?.name?.endsWith(target)) {
            return scoredProp.Value?._ || scoredProp.Value; // 値を取得
          }
        }
      } else if (typeof obj[key] === "object") {
        const result = search(obj[key], target);
        if (result) return result;
      }
    }
    return undefined;
  }

  for (const propertyName of propertyNames) {
    results[propertyName] = Number(search(xmlObject, propertyName));
  }

  return results;
}


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

  const configDirPath = join(BASE_PATH, 'config');
  const xml = readFileSync(`${configDirPath}/printerConfig.xml`, 'utf-8');
  const printerCfg = await extractValuesFromXML(xml);

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
    pageSize: { width: printerCfg.MediaSizeWidth, height: printerCfg.MediaSizeHeight },
    dpi: { horizontal: printerCfg.ResolutionX, vertical: printerCfg.ResolutionY },
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
