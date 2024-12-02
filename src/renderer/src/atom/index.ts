import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";

// StudentData
export const studentIdAtom = atomWithReset<string>('');
export const studentNameAtom = atomWithReset<string>('');
export const kanaAtom = atomWithReset<string>('');
export const departmentAtom = atomWithReset<string>('');
export const remarksAtom = atomWithReset<string>('');
export const supplyAtom = atomWithReset<string>('');
export const receptionStatusAtom = atomWithReset<boolean>(false);
export const isNeedNotifyAtom = atomWithReset<boolean>(false);
export const isDeprecatedPCAtom = atomWithReset<boolean>(false);

export const studentDataAtom = atom((get) => {
    return {
        studentId: get(studentIdAtom),
        studentName: get(studentNameAtom),
        kana: get(kanaAtom),
        department: get(departmentAtom),
        remarks: get(remarksAtom),
        supply: get(supplyAtom),
        receptionStatus: get(receptionStatusAtom),
        isNeedNotify: get(isNeedNotifyAtom),
        isDeprecatedPC: get(isDeprecatedPCAtom),
    };
});

// ReplicationMode
export const isDeprecatedPCReceptionAtom = atom<boolean>(false);

// ResponseCode
export const statusCodeAtom = atom<number>(0);

// Loading
export const isLoadingAtom = atom<{ status: boolean, message: string }>({ status: false, message: '' });
