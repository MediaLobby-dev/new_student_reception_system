import { dialog } from 'electron';
import { client } from '../client';

export const countStudentData = async (): Promise<string> => {
    const { data, error } = await client.GET('/api/v1/Student/count');

    if (error) {
        dialog.showErrorBox(
            'Error',
            '接続に失敗しました。ネットワーク接続を確認してください。'
        );
        throw new Error('Failed to fetch student count.');
    }

    return data.totalCount;
}
