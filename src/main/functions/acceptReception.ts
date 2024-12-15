import { Response } from '../../types/response';
import { firestore } from 'firebase-admin';
import { StudentData } from '../../types/studentData';
import { dialog } from 'electron';

export const acceptReception = async (studentId: string): Promise<Response<StudentData>> => {
  const db = firestore();

  return await db.runTransaction(async (transaction) => {
    const docRef = db.collection('students').doc(studentId);
    const docSnap = await transaction.get(docRef);
    const res = docSnap.data();

    // 変更が可能かどうかチェック
    if (!res || res.receptionStatus === true) {
        dialog.showErrorBox('Error', '書き込みに失敗しました。アプリケーションを再起動してください。');
        throw new Error('Reception status is already false or document does not exist.');
    }

    // 更新処理
    transaction.update(docRef, {
        receptionStatus: true,
    });

    return {
        status: true,
        data: {
            studentName: res.studentName,
            kana: res.kana,
            department: res.department,
            remarks: res.remarks,
            supply: res.supply,
            isDeprecatedPC: res.isDeprecatedPC,
            isNeedNotify: res.isNeedNotify,
            receptionStatus: false,
        }
    };
});
}
