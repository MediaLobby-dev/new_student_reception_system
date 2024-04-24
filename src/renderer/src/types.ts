export type StudentData = {
    studentId: string; // 学籍番号
    studentName: string; // 氏名
    kana: string; // カナ
    department: string; // 学科
    remarks: string; // 備考欄
    supply: string; // サプライ品購入状況
    isDeprecatedPC: boolean; // 非推奨PCフラグ
    isNeedNotify: boolean; // 案内所要フラグ
    receptionStatus: boolean; // 受付状況
}

export type queryProps = {
    isLoading: boolean,
    data: StudentData | null,
}

export type departmentColor = {
    departmentName: string,
    styleName: string,
}

export type departmentColorList = departmentColor[];

export type ErrorCode = {
    code: number,
    message: string,
    subMessage?: string,
}

export const ErrorCodeList: ErrorCode[] = [
    {
        code: 200,
        message: "データ取得に成功しました。",
    },
    {
        code: 201,
        message: "備考欄の編集に成功しました。",
    },
    {
        code: 202,
        message: "受付の取り消しに成功しました。",
    },
    {
        code: 203,
        message: "受付処理に成功しました。",
    },
    {
        code: 400,
        message: "不正なリクエストです。",
        subMessage: "エラーが解決しない場合は、開発者にお問い合わせください。",
    },
    {
        code: 401,
        message: "受付できません。所定の事務処理が完了していない可能性があります。",
        subMessage: "案内所へ誘導してください。",
    },
    {
        code: 4021,
        message: "推奨機を購入済みの学生です。",
        subMessage: "推奨機ガイダンス会場へ誘導してください。",
    },
    {
        code: 4022,
        message: "非推奨機をお持ちの学生です。",
        subMessage: "非推奨機ガイダンス会場へ誘導してください。",
    },
    {
        code: 404,
        message: "該当する学生情報が見つかりませんでした。",
        subMessage: "学籍番号が正しいかご確認ください。",
    },
    {
        code: 405,
        message: "正しい学籍番号を入力してください。",
        subMessage: "8桁入力されているかご確認ください。",
    },
    {
        code: 500,
        message: "サーバー内部でエラーが発生しました。",
        subMessage: "エラーが解決しない場合は、開発者にお問い合わせください。",
    }
] as const;
