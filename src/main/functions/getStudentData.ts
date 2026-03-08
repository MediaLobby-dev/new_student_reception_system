import { Response } from '../../types/response';
import { StudentData } from '../../types/studentData';
import { MessageCode } from '../../types/messageCode';
import { client } from '../client';
import { PcType } from '../api';

export const getStudentData = async (studentId: string): Promise<Response<StudentData | null>> => {
  const { data, error } = await client.GET('/api/v1/Student/{studentId}', {
    params: {
      path: {
        studentId: studentId
      },
    }
  });

  if (error) {
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
      studentName: data.name,
      kana: data.kanaName,
      department: data.faculty,
      remarks: data.remarks || '',
      supply: data.supply,
      isDeprecatedPC: data.pcType === PcType.Standard,
      isNeedNotify: data.checkInBlock,
      receptionStatus: data.isCheckedIn,
    },
  };
};
