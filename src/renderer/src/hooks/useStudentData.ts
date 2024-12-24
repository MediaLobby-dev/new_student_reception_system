import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  studentIdAtom,
  isLoadingAtom,
  messageCode,
  studentDataAtom,
  resetStudentData,
  isDeprecatedPCReceptionAtom,
} from '../atom';
import { StudentData } from '../../../types/studentData';
import { Response } from '../../../types/response';
import { useEffect } from 'react';
import { MessageCode } from '../../../types/messageCode';
import { nonRecomendPc, recommendedPcStudent, unableReception } from '../sound';

export const useStudentData = () => {
  const studentId = useAtomValue(studentIdAtom);
  const setIsLoading = useSetAtom(isLoadingAtom);
  const setMessageKeyCode = useSetAtom(messageCode);
  const isDeprecatedPCReception = useAtomValue(isDeprecatedPCReceptionAtom);
  const [studentData, setStudentData] = useAtom(studentDataAtom);
  const resetAll = useSetAtom(resetStudentData);

  useEffect(() => {
    const fetchData = async () => {
      // 学籍番号が8桁でない場合
      if (studentId.length !== 8) {
        setMessageKeyCode(MessageCode.INVALID_STUDENT_NUMBER);
        return;
      }
      setIsLoading({
        status: true,
        message: '検索中...',
      });

      window.electron.ipcRenderer
        .invoke('getStudentData', studentId)
        .then(async (res: Response<StudentData>) => {
          // 学生が存在しない場合
          if (!res.status && res.error?.code === MessageCode.NOT_FOUND_STUDENT) {
            setMessageKeyCode(MessageCode.NOT_FOUND_STUDENT);
            return;
          }

          if (!res.status) {
            setMessageKeyCode(MessageCode.INTERNAL_SERVER_ERROR);
            return;
          }

          setStudentData(res.data);

          // 案内所対応が必要な場合
          if (res.status && res.data.isNeedNotify) {
            setMessageKeyCode(MessageCode.UNABLE_RECEPTION);
            unableReception();
            return;
          }

          // 非推奨PC受付時に推奨PCの人が来た場合
          if (res.status && !res.data.isDeprecatedPC && isDeprecatedPCReception) {
            setMessageKeyCode(MessageCode.PURCHASED_RECOMMENDED_MACHINE);
            recommendedPcStudent();
            return;
          }

          // 推奨PC受付時に非推奨PCの人が来た場合
          if (res.status && res.data.isDeprecatedPC && !isDeprecatedPCReception) {
            setMessageKeyCode(MessageCode.NON_RECOMMENDED_MACHINE);
            nonRecomendPc();
            return;
          }

          setMessageKeyCode(MessageCode.SUCCESSFUL_GET_STUDENT_DATA);
        })
        .catch((err) => {
          console.error(err);
          setMessageKeyCode(MessageCode.INTERNAL_SERVER_ERROR);
        })
        .finally(() => {
          setIsLoading({
            status: false,
            message: '',
          });
        });
    };

    resetAll();
    fetchData();
  }, [studentId]);

  return {
    data: studentData,
  };
};
