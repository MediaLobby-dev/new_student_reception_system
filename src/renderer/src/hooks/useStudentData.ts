import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { studentIdAtom, isLoadingAtom, statusCodeAtom, studentDataAtom, resetStudentData } from "../atom";
import { StudentData } from "../types";
import { Response } from "../../../types/response";
import { useEffect } from "react";

export const useStudentData = () => {
    const studentId = useAtomValue(studentIdAtom);
    const setIsLoading = useSetAtom(isLoadingAtom);
    const setStatusCode = useSetAtom(statusCodeAtom);

    const [studentData, setStudentData] = useAtom(studentDataAtom);
    const resetAll = useSetAtom(resetStudentData);


    console.log(studentId);

    useEffect(() => {
        const fetchData = async () => {

        if (studentId.length !== 8) {
            setStatusCode(405);
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
                if (res.status) {
                    setStudentData(res.data);
                    setStatusCode(200);
                } else {
                    setStatusCode(404);
                }
            })
            .catch((err) => {
                console.error(err);
                setStatusCode(500);
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
