import Swal from "sweetalert2";

export const useFirebase = () => {

  const openAndSaveSDKFile = () => {
    // フロントからは呼び出すだけ、メインプロセスでハンドリングまで行う
    window.electron.ipcRenderer.invoke('saveSdk');
  };

  const countStudentData = async () => {
    // フロントからは呼び出すだけ、メインプロセスでハンドリングまで行う
    const total = await window.electron.ipcRenderer.invoke('countStudentData');
    Swal.fire({
      title: '接続に成功しました',
      text: `登録済みレコード数: ${total}件`,
      icon: 'success',
      confirmButtonText: '閉じる'
    });
  }

  return {
    openAndSaveSDKFile,
    countStudentData
  };
};
