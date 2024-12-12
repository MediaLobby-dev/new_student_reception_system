import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { studentIdAtom, isLoadingAtom, messageCode, studentDataAtom, resetStudentData, isDeprecatedPCReceptionAtom, isAdminModeAtom } from "../atom";
import { StudentData } from "../../../types/studentData";
import { Response } from "../../../types/response";
import { useEffect } from "react";
import { MessageCode } from "../../../types/messageCode";
import { nonRecomendPc, recommendedPcStudent, unableReception } from "../sound";


export const useStudentData = () => {
    const studentId = useAtomValue(studentIdAtom);
    const setIsLoading = useSetAtom(isLoadingAtom);
    const setMessageKeyCode = useSetAtom(messageCode);
    const isDeprecatedPCReception = useAtomValue(isDeprecatedPCReceptionAtom);
    const isAdminMode = useAtomValue(isAdminModeAtom);
    const [studentData, setStudentData] = useAtom(studentDataAtom);
    const resetAll = useSetAtom(resetStudentData);

    // 学生情報をセットしてチェック
    const setAndCheckStudentData = (res: Response<StudentData>) => {
        if (res.status && res.data) {
            setStudentData(res.data);
            setMessageKeyCode(MessageCode.SUCCESSFUL_GET_STUDENT_DATA);
        } else {
            setMessageKeyCode(MessageCode.NOT_FOUND_STUDENT);
        }
    }

    useEffect(() => {
        const fetchData = async () => {

            // 学籍番号が8桁でない場合
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
                .then(async (res: Response<StudentData>) => {
                    // エラーが発生した場合
                    if (!res) {
                        setMessageKeyCode(MessageCode.INTERNAL_SERVER_ERROR);
                        return;
                    }

                    // 管理者モードの場合
                    if (isAdminMode) {
                        setAndCheckStudentData(res);
                        return;
                    }

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

                    setAndCheckStudentData(res);
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
