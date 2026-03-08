import { Response } from '../../types/response';
import { StudentData } from '../../types/studentData';
import { dialog } from 'electron';
import { client } from '../client';

export const cancelReception = async (studentId: string): Promise<Response<StudentData>> => {
  const { data, error } = await client.POST('/api/v1/Student/{studentId}/cancel', {
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
      '受付キャンセル処理に失敗しました。',
    );
    throw new Error('Failed to cancel reception.');
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
      receptionStatus: false,
    },
  };
};
