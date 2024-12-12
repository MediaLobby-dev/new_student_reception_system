import { Response } from '../../types/response';
import { firestore } from 'firebase-admin';
import { StudentData } from '../../types/studentData';
import { MessageCode } from '../../types/messageCode';

export const disableNotifyFlug = async(studentId: string): Promise<Response<StudentData | null>> => {
    const db = firestore();
    const docRef = db.collection('students').doc(studentId);

    try {
        return await db.runTransaction(async (transaction) => {
            const docSnap = await transaction.get(docRef);
            if (!docSnap.exists) {
                throw new Error("Document does not exist!");
            }

            const res = docSnap.data();

            transaction.update(docRef, {
                isNeedNotify: false
            });

            return {
                status: true,
                data: {
                    studentName: res?.studentName,
                    kana: res?.kana,
                    department: res?.department,
                    remarks: res?.remarks,
                    supply: res?.supply,
                    isDeprecatedPC: res?.isDeprecatedPC,
                    isNeedNotify: false,
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
}
