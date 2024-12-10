import { Response } from '../../types/response';
import { firestore } from 'firebase-admin';
import { StudentData } from '../../types/studentData';

export const getStudentData = async (studentId: string): Promise<Response<StudentData>> => {
  const db = firestore();

  const docRef = db.collection('students').doc(studentId);
  const docSnap = await docRef.get();
  const res = docSnap.data();

  return {
    status: true,
    data: {
        studentName: res?.studentName,
        kana: res?.kana,
        department: res?.department,
        remarks: res?.remarks,
        supply: res?.supply,
        isDeprecatedPC: res?.isDeprecatedPC,
        isNeedNotify: res?.isNeedNotify,
        receptionStatus: res?.receptionStatus,
    }
  };
};
