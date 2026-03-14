import { Response } from '../../types/response';
import { StudentData } from '../../types/studentData';
import { MessageCode } from '../../types/messageCode';
import { BusinessError } from '../../errors/BusinessError';
import { client } from '../client';
import { PcType } from '../api';

export const editRemarks = async (
  studentId: string,
  newRemark: string,
): Promise<Response<StudentData | null>> => {
  const { data, error, response } = await client.PUT('/api/v1/Student/{studentId}/remarks', {
    params: {
      path: {
        studentId: studentId
      }
    },
    body: {
      remarks: newRemark
    }
  });

  if (response.status === 404) {
      throw new BusinessError(MessageCode.NOT_FOUND_STUDENT);
  }

  if (error) {
    throw new BusinessError(MessageCode.INTERNAL_SERVER_ERROR);
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
