import { useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { remarkAtom, messageCode, studentIdAtom } from '../atom';
import { MessageCode } from '../../../types/messageCode';
import { StudentData } from '../../../types/studentData';
import { Response } from '../../../types/response';

export const useEditRemark = () => {
  const studentId = useAtomValue(studentIdAtom);
  const originalRemark = useAtomValue(remarkAtom);
  const [remark, setRemark] = useState<string>(originalRemark);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const setMessageKeyCode = useSetAtom(messageCode);

  const updateRemark = () => {
    console.log(studentId, remark);
    window.electron.ipcRenderer
      .invoke('editRemarks', studentId, remark)
      .then((res: Response<StudentData>) => {
        if (res.status) {
          setIsSuccess(true);
          setMessageKeyCode(MessageCode.SUCCESSFUL_EDIT_REMARK);
        } else {
          setMessageKeyCode(MessageCode.INTERNAL_SERVER_ERROR);
        }
      })
      .catch((err) => {
        console.error(err);
        setIsError(true);
        setMessageKeyCode(MessageCode.INTERNAL_SERVER_ERROR);
      })
      .finally(() => {});
  };

  return {
    isSuccess,
    isError,
    updateRemark,
    remark,
    setRemark,
  };
};
