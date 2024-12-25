import { firestore } from 'firebase-admin';
import { dialog } from 'electron';

export const countStudentData = async (): Promise<number> => {
    const db = firestore();

    const docRef = db.collection('students');
    const totalCount = await docRef.get().then((snapshot) => {
        return snapshot.size;
    }).catch((error) => {
        dialog.showErrorBox(
            'Error',
            '接続に失敗しました。ネットワーク接続を確認してください。'
        );
        throw error;
    });

    return totalCount;
}
