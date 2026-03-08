import { Response } from '../../types/response';
import { StudentData } from '../../types/studentData';
import { dialog } from 'electron';
import { client } from '../client';

export const acceptReception = async (studentId: string): Promise<Response<StudentData>> => {
  const { data, error } = await client.POST('/api/v1/Student/{studentId}/check-in', {
    params: {
      path: {
        studentId: studentId
      }
    }
  });

  if (error?.status === 404) {
    dialog.showErrorBox(
      'Error',
      '対象の学籍番号の学生が見つかりませんでした。',
    );
    throw new Error('Student not found.');
  }

  if (error) {
    dialog.showErrorBox(
      'Error',
      '受付処理に失敗しました。',
    );
    throw new Error('Failed to accept reception.');
  }

  return {
    status: true,
    data: {
      studentName: data.name,
      kana: data.kanaName,
      department: data.faculty,
      remarks: data.remarks || '',
      supply: data.supply,
      isDeprecatedPC: data.pcType === 'NonStandard',
      isNeedNotify: data.checkInBlock,
      receptionStatus: data.isCheckedIn,
    },
  };
};
