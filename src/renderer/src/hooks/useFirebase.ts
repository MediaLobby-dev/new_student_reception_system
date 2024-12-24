export const useFirebase = () => {

  const openAndSaveSDKFile = () => {
    // フロントからは呼び出すだけ、メインプロセスでハンドリングまで行う
    window.electron.ipcRenderer.invoke('saveSdk');
  };

  return {
    openAndSaveSDKFile,
  };
};
