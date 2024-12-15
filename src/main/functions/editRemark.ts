import { Response } from '../../types/response';
import { firestore } from 'firebase-admin';
import { StudentData } from '../../types/studentData';
import { MessageCode } from '../../types/messageCode';
import { dialog } from 'electron';

export const editRemarks = async (studentId: string, newRemark: string): Promise<Response<StudentData | null>> => {
    const db = firestore();
    const docRef = db.collection('students').doc(studentId);

    try {
        return await db.runTransaction(async (transaction) => {
            const docSnap = await transaction.get(docRef);
            if (!docSnap.exists) {
                dialog.showErrorBox('Error', '書き込みに失敗しました。アプリケーションを再起動してください。');
                throw new Error("Document does not exist!");
            }

            const res = docSnap.data();

            transaction.update(docRef, {
                remarks: newRemark
            });

            return {
                status: true,
                data: {
                    studentName: res?.studentName,
                    kana: res?.kana,
                    department: res?.department,
                    remarks: newRemark,
                    supply: res?.supply,
                    isDeprecatedPC: res?.isDeprecatedPC,
                    isNeedNotify: res?.isNeedNotify,
                    receptionStatus: res?.receptionStatus,
                }
            };
        });
    } catch (error) {
        console.error("Transaction failed: ", error);
        return {
            status: false,
            data: null,
            error: {
                code: MessageCode.INTERNAL_SERVER_ERROR,
                message: "Transaction failed!"
            }
        };
    }
};
