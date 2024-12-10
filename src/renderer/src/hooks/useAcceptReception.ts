import { useState } from "react";
import { errorKey, receptionStatusAtom, studentIdAtom } from "../atom";
import { useAtomValue, useSetAtom } from "jotai";
import { Response } from "../../../types/response";
import { StudentData } from "../../../types/studentData";
import { ErrorCode } from "../../../types/errorCode";

export const useAcceptReception = () => {
    const studentId = useAtomValue(studentIdAtom);
    const receptionStatus = useSetAtom(receptionStatusAtom);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);

    const setErrorKeyCode = useSetAtom(errorKey);
    
    const acceptReception = () => {
        window.electron.ipcRenderer
            .invoke("acceptReception", studentId)
            .then((res: Response<StudentData>) => {
                if (res.status) {
                    setErrorKeyCode(ErrorCode.SUCCESSFUL_RECEPTION);
                    receptionStatus(true);
                    setIsSuccess(true);
                } else {
                    setErrorKeyCode(ErrorCode.INTERNAL_SERVER_ERROR);
                    setIsError(true);
                }
            })
            .catch((err) => {
                console.error(err);
                setIsError(true);
            });
        
    }

    return { isSuccess, isError, acceptReception };
};
