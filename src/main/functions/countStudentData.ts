import { MessageCode } from '../../types/messageCode';
import { BusinessError } from '../../errors/BusinessError';
import { client } from '../client';

export const countStudentData = async (): Promise<string> => {
  const { data, error } = await client.GET('/api/v1/Student/count');

  if (error) {
    throw new BusinessError(MessageCode.INTERNAL_SERVER_ERROR);
  }

  return data.totalCount;
};
