import Swal from "sweetalert2";
import { Response } from "../../../types/response";
import { MessageCode, MessageCodeList } from "../../../types/messageCode";

export const useConnectionTest = () => {
  const countStudentData = async () => {
    const result: string | Response<null> = await window.electron.ipcRenderer.invoke('countStudentData');

    if (typeof result === 'object' && !result.status) {
      const code = result.error?.code ?? MessageCode.INTERNAL_SERVER_ERROR;
      const info = MessageCodeList[code];
      Swal.fire({
        title: '接続に失敗しました',
        text: info.message,
        icon: 'error',
        confirmButtonText: '閉じる',
      });
      return;
    }

    Swal.fire({
      title: '接続に成功しました',
      text: `登録済みレコード数: ${result}件`,
      icon: 'success',
      confirmButtonText: '閉じる',
    });
  };

  return {
    countStudentData,
  };
};
