import { useCallback, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import {remarkAtom, statusCodeAtom, studentIdAtom} from "../atom";

export const useEditRemark = () => {
    const studentId = useAtomValue(studentIdAtom);
    const originalRemark = useAtomValue(remarkAtom);
    const [remark, setRemark] = useState<string>(originalRemark);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);

    const setStatusCode = useSetAtom(statusCodeAtom);

    const updateRemark = useCallback(async () => {
        console.log('updateRemark');
        console.log(studentId);
        setStatusCode(500);
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
