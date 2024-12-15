import { BrowserWindow, dialog } from 'electron';
import { join } from 'path';

export const printRecipt = async (studentId: string, studentName: string, kana: string, isTest: boolean) => {
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

    printWindow.loadURL(`${url}?studentId=${studentId}&studentName=${studentName}&kana=${kana}&timestamp=${timestamp}`);

    printWindow.webContents.on('did-finish-load', () => {
        if (isTest) {
            dialog.showMessageBox({
                type: 'question',
                title: '印刷テスト',
                message: 'レシート印刷機の電源投入、Windows側で「規定のプリンター」に設定されているか確認してください。\n確認が完了したら「OK」を押してください。',
                normalizeAccessKeys: true,
                noLink: true,
                buttons: ['OK', 'キャンセル'],
            }).then((res) => {
                if (res.response === 0) {
                    printWindow.webContents.print({ margins: { marginType: "default" }, silent: true, printBackground: true },
                        (success, error) => {
                            if (success) {
                                dialog.showMessageBox({
                                    type: 'info',
                                    title: 'ジョブ送信完了',
                                    message: '印刷機へのジョブ送信が完了しました。\nレシートが出てこない場合は、設定を確認してください。',
                                });

                                console.log('Print successfully.');
                                printWindow.close();
                            } else {
                                console.log(error);
                            }
                        });
                } 
                else {
                    dialog.showMessageBox({
                        type: 'info',
                        title: '印刷テスト',
                        message: '印刷テストがキャンセルされました。',
                    });
                }

                printWindow.close();
            });
            return;
        }

        printWindow.webContents.print({ margins: { marginType: "default" }, silent: true, printBackground: true },
            (success, error) => {
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
}
