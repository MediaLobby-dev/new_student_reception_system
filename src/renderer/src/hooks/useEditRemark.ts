import { useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import {remarkAtom, errorKey, studentIdAtom} from "../atom";
import { ErrorCode } from "../../../types/errorCode";
import { StudentData } from "../../../types/studentData";
import { Response } from "../../../types/response";

export const useEditRemark = () => {
    const studentId = useAtomValue(studentIdAtom);
    const originalRemark = useAtomValue(remarkAtom);
    const [remark, setRemark] = useState<string>(originalRemark);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);

    const setErrorKeyCode = useSetAtom(errorKey);

    const updateRemark = () => {
        console.log(studentId, remark);
        window.electron.ipcRenderer
        .invoke("editRemarks", studentId, remark)
        .then((res: Response<StudentData>) => {
            if (res.status) {
                setIsSuccess(true);
                setErrorKeyCode(ErrorCode.SUCCESSFUL_EDIT_REMARK);
            } else {
                setErrorKeyCode(ErrorCode.INTERNAL_SERVER_ERROR);
            }
        })
        .catch((err) => {
            console.error(err);
            setIsError(true);
            setErrorKeyCode(ErrorCode.INTERNAL_SERVER_ERROR);
        })
        .finally(() => {
        });
    };


    return {
        isSuccess,
        isError,
        updateRemark,
        remark,
        setRemark,
    };
}
