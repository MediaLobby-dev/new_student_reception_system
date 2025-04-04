import { Response } from '../../types/response';
import { firestore } from 'firebase-admin';
import { StudentData } from '../../types/studentData';
import { dialog } from 'electron';

export const cancelReception = async (studentId: string): Promise<Response<StudentData>> => {
  const db = firestore();

  return await db.runTransaction(async (transaction) => {
    const docRef = db.collection('students').doc(studentId);
    const docSnap = await transaction.get(docRef);
    const res = docSnap.data();

    // 変更が可能かどうかチェック
    if (!res || res.receptionStatus === false) {
      dialog.showErrorBox(
        'Error',
        'データの整合性検証に失敗しました。再度学籍番号を読み込み直してください。',
      );
      throw new Error('Reception status is already false or document does not exist.');
    }

    // 更新処理
    transaction.update(docRef, {
      receptionStatus: false,
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
      },
    };
  });
};
