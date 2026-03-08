import { Response } from '../../types/response';
import { StudentData } from '../../types/studentData';
import { MessageCode } from '../../types/messageCode';
import { client } from '../client';

export const editRemarks = async (
  studentId: string,
  newRemark: string,
): Promise<Response<StudentData | null>> => {
    const { data, error } = await client.PUT('/api/v1/Student/{studentId}/remarks', {
      params: {
        path: {
          studentId: studentId
        }
      },
      body: {
        remarks: newRemark
      }
    });

    if (error?.status === 404) {
      return {
        status: false,
        data: null,
        error: {
          code: MessageCode.NOT_FOUND_STUDENT,
          message: '対象の学籍番号の学生が見つかりませんでした',
        },
      };
    }

    if (error) {
      return {
        status: false,
        data: null,
        error: {
          code: MessageCode.INTERNAL_SERVER_ERROR,
          message: '備考欄の編集に失敗しました',
        },
      };
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
