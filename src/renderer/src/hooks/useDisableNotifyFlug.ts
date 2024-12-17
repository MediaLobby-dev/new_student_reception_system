import { MessageCode } from '../../../types/messageCode';
import { messageCode, studentDataAtom, studentIdAtom } from '../atom';
import { useAtomValue, useSetAtom } from 'jotai';
import { StudentData } from '../../../types/studentData';
import { Response } from '../../../types/response';
import { useState } from 'react';

export const useDisableNotifyFlug = () => {
  const studentId = useAtomValue(studentIdAtom);
  const setStudentData = useSetAtom(studentDataAtom);
  const setMessageKeyCode = useSetAtom(messageCode);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const disableNotifyFlug = () => {
    window.electron.ipcRenderer
      .invoke('disableNotifyFlug', studentId)
      .then((res: Response<StudentData>) => {
        if (res.status) {
          setIsSuccess(true);
          setStudentData(res.data);
          setMessageKeyCode(MessageCode.SUCCESSFUL_DISABLE_NOTIFY_FLUG);
        } else {
          setIsError(true);
          setMessageKeyCode(MessageCode.INTERNAL_SERVER_ERROR);
        }
      })
      .catch((err) => {
        console.error(err);
        setIsError(true);
        setMessageKeyCode(MessageCode.INTERNAL_SERVER_ERROR);
      });
  };

  return {
    isSuccess,
    isError,
    disableNotifyFlug,
  };
};
