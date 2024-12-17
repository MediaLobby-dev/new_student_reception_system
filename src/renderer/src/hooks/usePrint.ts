import Swal from 'sweetalert2';
import { studentDataAtom, studentIdAtom } from '../atom';
import { useAtomValue } from 'jotai';

export const usePrint = () => {
  const studentId = useAtomValue(studentIdAtom);
  const studentData = useAtomValue(studentDataAtom);

  const printRecipt = async () => {
    return window.electron.ipcRenderer
      .invoke('printRecipt', studentId, studentData.studentName, studentData.kana)
      .catch((e) => {
        console.error(e);
        Swal.fire({
          icon: 'error',
          title: 'レシート印刷エラー',
          text: '現在受付中の学生さんの情報を控えて、再度お試しください。',
        });
      });
  };

  const testPrint = async () => {
    return window.electron.ipcRenderer.invoke('testPrint').catch((e) => {
      console.error(e);
      Swal.fire({
        icon: 'error',
        title: 'テスト印刷エラー',
        text: 'テスト印刷に失敗しました。',
      });
    });
  };

  return {
    printRecipt,
    testPrint,
  };
};
