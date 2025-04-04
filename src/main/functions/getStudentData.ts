import { Response } from '../../types/response';
import { firestore } from 'firebase-admin';
import { StudentData } from '../../types/studentData';
import { MessageCode } from '../../types/messageCode';

export const getStudentData = async (studentId: string): Promise<Response<StudentData | null>> => {
  const db = firestore();

  const docRef = db.collection('students').doc(studentId);
  const docSnap = await docRef.get();
  const res = docSnap.data();

  if (!res) {
    return {
      status: false,
      data: null,
      error: {
        code: MessageCode.NOT_FOUND_STUDENT,
        message: '対象の学籍番号の学生が見つかりませんでした',
      },
    };
  }

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
    },
  };
};
