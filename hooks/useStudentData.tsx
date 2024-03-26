import { useEffect, useState, useContext } from 'react'
import { getStudentData } from '../src/gas'
import { StudentData } from '../src/types'
import { StateStore } from '../src/App'

type queryProps = {
    isLoading: boolean,
    data: StudentData | null,
}

export function useStudentData(studentId: string) {
    const [query, setQuery] = useState<queryProps>({
        isLoading: true,
        data: null,
    });

    const { setStatusCode, setData, isDeprecatedPCReception } = useContext(StateStore);

    useEffect(() => {
        if (query.data) setData(query.data);
    }, [query.data, setData]);

    useEffect(() => {
        const fetchData = (async () => {
            // 学籍番号が8桁でない場合
            if (studentId.length !== 8) {
                setQuery({
                    isLoading: false,
                    data: null,
                });
                setStatusCode(405);
                return;
            }

            // データ取得
            await getStudentData(studentId).then((data: StudentData | null) => {
                // 検索結果が空の場合
                if (data === null) {
                    setQuery({
                        isLoading: false,
                        data: null,
                    });
                    setStatusCode(404);
                    return;
                }

                // 告知事項ありの場合
                if (data.isNeedNotify) {
                    setQuery({
                        isLoading: false,
                        data: data,
                    });
                    setStatusCode(401);
                    return;
                }

                console.log(isDeprecatedPCReception, data.isDeprecatedPC);

                // 推奨機の人が非推奨機の受付会場に来た場合
                if (isDeprecatedPCReception && !data.isDeprecatedPC) {
                    setQuery({
                        isLoading: false,
                        data: data,
                    });
                    setStatusCode(4021);
                    return;
                }

                // 非推奨機の人が推奨機の受付会場に来た場合
                if (!isDeprecatedPCReception && data.isDeprecatedPC) {
                    setQuery({
                        isLoading: false,
                        data: data,
                    });
                    setStatusCode(4022);
                    return;
                }

                setQuery({
                    isLoading: false,
                    data: data,
                });
                setStatusCode(200);
            }).catch((err) => {
                console.error(err);
                setQuery({
                    isLoading: false,
                    data: null,
                });
                setStatusCode(500);
            });
        });

        // データ取得前にステータスを初期化
        setQuery({
            isLoading: true,
            data: null,
        });
        setStatusCode(0);

        fetchData();
    }, [studentId, setStatusCode]);

    return {
        isDataLoading: query.isLoading,
        data: query.data,
    };
}
