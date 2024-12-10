import { errorKey, receptionStatusAtom, studentIdAtom } from "../atom";
import { useAtomValue, useSetAtom } from "jotai";
import { useState } from "react";
import { Response } from "../../../types/response";
import { StudentData } from "../../../types/studentData";
import { ErrorCode } from "../../../types/errorCode";

export const useCancelReception = () => {
    const studentId = useAtomValue(studentIdAtom);
    const receptionStatus = useSetAtom(receptionStatusAtom);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);

    const setErrorKeyCode = useSetAtom(errorKey);

    const cancelReception = () => {
        window.electron.ipcRenderer
            .invoke("cancelReception", studentId)
            .then((res: Response<StudentData>) => {
                console.log(res);
                if (res.status) {
                    setErrorKeyCode(ErrorCode.SUCCESSFUL_CANCEL_RECEPTION);
                    receptionStatus(false);
                    setIsSuccess(true);
                } else {
                    setErrorKeyCode(ErrorCode.INTERNAL_SERVER_ERROR);
                    setIsError(true);
                }
            })
            .catch((err) => {
                console.error(err);
                setIsError(true);
                setErrorKeyCode(ErrorCode.INTERNAL_SERVER_ERROR);
            });
    };

    return { isSuccess, isError, cancelReception };
};
