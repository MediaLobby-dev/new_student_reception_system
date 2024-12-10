import { useCallback, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import {remarkAtom, errorKey, studentIdAtom} from "../atom";
import { ErrorCode } from "../../../types/errorCode";

export const useEditRemark = () => {
    const studentId = useAtomValue(studentIdAtom);
    const originalRemark = useAtomValue(remarkAtom);
    const [remark, setRemark] = useState<string>(originalRemark);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);

    const setErrorKeyCode = useSetAtom(errorKey);

    const updateRemark = useCallback(async () => {
        console.log('updateRemark');
        console.log(studentId);
        setErrorKeyCode(ErrorCode.INTERNAL_SERVER_ERROR);
        setIsError(true);
        
        // TODO: IPC通信処理を実装
    }, [studentId, remark]);


    return {
        isSuccess,
        isError,
        updateRemark,
        remark,
        setRemark,
    };
}
