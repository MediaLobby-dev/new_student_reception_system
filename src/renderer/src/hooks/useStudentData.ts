import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { studentIdAtom, isLoadingAtom, messageCode, studentDataAtom, resetStudentData, isDeprecatedPCReceptionAtom } from "../atom";
import { StudentData } from "../types";
import { Response } from "../../../types/response";
import { useEffect } from "react";
import { MessageCode } from "../../../types/errorCode";

export const useStudentData = () => {
    const studentId = useAtomValue(studentIdAtom);
    const setIsLoading = useSetAtom(isLoadingAtom);
    const setMessageKeyCode = useSetAtom(messageCode);
    const isDeprecatedPCReception = useAtomValue(isDeprecatedPCReceptionAtom);

    const [studentData, setStudentData] = useAtom(studentDataAtom);
    const resetAll = useSetAtom(resetStudentData);

    useEffect(() => {
        const fetchData = async () => {

        if (studentId.length !== 8) {
            setMessageKeyCode(MessageCode.INVALID_STUDENT_NUMBER);
            return;
        }

        setIsLoading({
            status: true,
            message: "検索中...",
        });

        window.electron.ipcRenderer
            .invoke("getStudentData", studentId)
            .then((res: Response<StudentData>) => {
                // エラーが発生した場合
                if (!res) {
                    setMessageKeyCode(MessageCode.INTERNAL_SERVER_ERROR);
                    return;
                }

                // 案内所対応が必要な場合
                if (res.status && res.data.isNeedNotify) {
                    setMessageKeyCode(MessageCode.UNABLE_RECEPTION);
                    return;
                }

                // 非推奨PC受付時に推奨PCの人が来た場合
                if (res.status && res.data.isDeprecatedPC && isDeprecatedPCReception) {
                    setMessageKeyCode(MessageCode.PURCHASED_RECOMMENDED_MACHINE);
                    return;
                }

                // 推奨PC受付時に非推奨PCの人が来た場合
                if (res.status && !res.data.isDeprecatedPC && !isDeprecatedPCReception) {
                    setMessageKeyCode(MessageCode.NON_RECOMMENDED_MACHINE);
                    return;
                }

                if (res.status && res.data) {
                    setStudentData(res.data);
                    setMessageKeyCode(MessageCode.SUCCESSFUL_GET_STUDENT_DATA);
                } else {
                    setMessageKeyCode(MessageCode.NOT_FOUND_STUDENT);
                }
            })
            .catch((err) => {
                console.error(err);
                setMessageKeyCode(MessageCode.INTERNAL_SERVER_ERROR);
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
