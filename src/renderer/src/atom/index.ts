import { StudentData } from "../../../types/studentData";
import { MessageCode } from "src/types/errorCode";
import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";

// StudentData
export const studentIdAtom = atomWithReset<string>('');
export const studentNameAtom = atomWithReset<string>('');
export const kanaAtom = atomWithReset<string>('');
export const departmentAtom = atomWithReset<string>('');
export const remarkAtom = atomWithReset<string>('');
export const supplyAtom = atomWithReset<string>('');
export const receptionStatusAtom = atomWithReset<boolean>(false);
export const isNeedNotifyAtom = atomWithReset<boolean>(false);
export const isDeprecatedPCAtom = atomWithReset<boolean>(false);

export const initializedFirebaseAtom = atom<boolean>(false);
export const isAdminModeAtom = atom<boolean>(false);

export const studentDataAtom = atom(
    (get) => {
        return {
            studentName: get(studentNameAtom),
            kana: get(kanaAtom),
            department: get(departmentAtom),
            remarks: get(remarkAtom),
            supply: get(supplyAtom),
            receptionStatus: get(receptionStatusAtom),
            isNeedNotify: get(isNeedNotifyAtom),
            isDeprecatedPC: get(isDeprecatedPCAtom),
        };
    },
    (_get, set, update: StudentData) => {
        set(studentNameAtom, update.studentName);
        set(kanaAtom, update.kana);
        set(departmentAtom, update.department);
        set(remarkAtom, update.remarks);
        set(supplyAtom, update.supply);
        set(receptionStatusAtom, update.receptionStatus);
        set(isNeedNotifyAtom, update.isNeedNotify);
        set(isDeprecatedPCAtom, update.isDeprecatedPC);
    }
);

export const resetStudentData = atom(null, (_get, set) => {
    set(studentNameAtom, '');
    set(kanaAtom, '');
    set(departmentAtom, '');
    set(remarkAtom, '');
    set(supplyAtom, '');
    set(receptionStatusAtom, false);
    set(isNeedNotifyAtom, false);
    set(isDeprecatedPCAtom, false);
});

// ReplicationMode
export const isDeprecatedPCReceptionAtom = atom<boolean>(false);

// ResponseCode
export const messageCode = atom<MessageCode | null>(null);

// Loading
export const isLoadingAtom = atom<{ status: boolean, message: string }>({ status: false, message: '' });
