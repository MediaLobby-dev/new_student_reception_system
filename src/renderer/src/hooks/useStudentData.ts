import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { studentIdAtom, isLoadingAtom, errorKey, studentDataAtom, resetStudentData, isDeprecatedPCReceptionAtom } from "../atom";
import { StudentData } from "../types";
import { Response } from "../../../types/response";
import { useEffect } from "react";
import { ErrorCode } from "../../../types/errorCode";

export const useStudentData = () => {
    const studentId = useAtomValue(studentIdAtom);
    const setIsLoading = useSetAtom(isLoadingAtom);
    const setErrorKeyCode = useSetAtom(errorKey);
    const isDeprecatedPCReception = useAtomValue(isDeprecatedPCReceptionAtom);

    const [studentData, setStudentData] = useAtom(studentDataAtom);
    const resetAll = useSetAtom(resetStudentData);

    useEffect(() => {
        const fetchData = async () => {

        if (studentId.length !== 8) {
            setErrorKeyCode(ErrorCode.INVALID_STUDENT_NUMBER);
            return;
        }

        setIsLoading({
            status: true,
            message: "検索中...",
        });

        window.electron.ipcRenderer
            .invoke("getStudentData", studentId)
            .then((res: Response<StudentData>) => {
                console.log(res);
                // 案内所対応が必要な場合
                if (res.status && res.data.isNeedNotify) {
                    setErrorKeyCode(ErrorCode.UNABLE_RECEPTION);
                    return;
                }

                // 非推奨PC受付時に推奨PCの人が来た場合
                if (res.status && res.data.isDeprecatedPC && isDeprecatedPCReception) {
                    setErrorKeyCode(ErrorCode.PURCHASED_RECOMMENDED_MACHINE);
                    return;
                }

                // 推奨PC受付時に非推奨PCの人が来た場合
                if (res.status && !res.data.isDeprecatedPC && !isDeprecatedPCReception) {
                    setErrorKeyCode(ErrorCode.NON_RECOMMENDED_MACHINE);
                    return;
                }

                if (res.status && res.data) {
                    setStudentData(res.data);
                    setErrorKeyCode(ErrorCode.SUCCESSFUL_GET_STUDENT_DATA);
                } else {
                    setErrorKeyCode(ErrorCode.NOT_FOUND_STUDENT);
                }
            })
            .catch((err) => {
                console.error(err);
                setErrorKeyCode(ErrorCode.INTERNAL_SERVER_ERROR);
            })
            .finally(() => {
                setIsLoading({
                    status: false,
                    message: "",
                });
            });
        }

        resetAll();
        fetchData();
    }, [studentId]);

    return {
        data: studentData,
    };
}
