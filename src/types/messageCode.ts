export enum MessageCode {
    SUCCESSFUL_GET_STUDENT_DATA = "SUCCESSFUL_GET_STUDENT_DATA",
    SUCCESSFUL_EDIT_REMARK = "SUCCESSFUL_EDIT_REMARK",
    SUCCESSFUL_CANCEL_RECEPTION = "SUCCESSFUL_CANCEL_RECEPTION",
    SUCCESSFUL_RECEPTION = "SUCCESSFUL_RECEPTION",
    SUCCESSFUL_DISABLE_NOTIFY_FLUG = "SUCCESSFUL_DISABLE_NOTIFY_FLUG",
    BAD_REQUEST = "BAD_REQUEST",
    UNABLE_RECEPTION = "UNABLE_RECEPTION",
    PURCHASED_RECOMMENDED_MACHINE = "PURCHASED_RECOMMENDED_MACHINE",
    NON_RECOMMENDED_MACHINE = "NON_RECOMMENDED_MACHINE",
    NOT_FOUND_STUDENT = "NOT_FOUND_STUDENT",
    INVALID_STUDENT_NUMBER = "INVALID_STUDENT_NUMBER",
    INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
    SUCCESSFUL_FIREBASE_SDK_READ = "SUCCESSFUL_FIREBASE_SDK_READ",
    FAILED_FIREBASE_SDK_READ = "FAILED_FIREBASE_SDK_READ",
    CREATE_DIRECTORY_FAILED = "CREATE_DIRECTORY_FAILED",
    NO_SELECTED_FILE = "NO_SELECTED_FILE",

}

type MessageCodeLists = {
    [key in MessageCode]: {
        title?: string;
        message: string;
        subMessage?: string;
    };
};

export const MessageCodeList: MessageCodeLists = {
    "SUCCESSFUL_GET_STUDENT_DATA": {
        message: 'データ取得に成功しました。',
    },
    "SUCCESSFUL_EDIT_REMARK": {
        message: '備考欄の編集に成功しました。',
    },
    "SUCCESSFUL_CANCEL_RECEPTION": {
        message: '受付の取り消しに成功しました。',
    },
    "SUCCESSFUL_RECEPTION": {
        message: '受付処理に成功しました。',
    },
    "SUCCESSFUL_DISABLE_NOTIFY_FLUG": {
        message: '該当学生の受付を可能にしました。',
    },
    "BAD_REQUEST": {
        message: '不正なリクエストです。',
        subMessage: 'エラーが解決しない場合は、開発者にお問い合わせください。',
    },
    "UNABLE_RECEPTION": {
        title: "告知事項あり",
        message: '受付できません。所定の事務処理が完了していない可能性があります。',
        subMessage: '案内所へ誘導してください。',
    },
    "PURCHASED_RECOMMENDED_MACHINE": {
        title: "推奨機です",
        message: '推奨機を購入済みの学生です。',
        subMessage: '推奨機ガイダンス会場へ誘導してください。',
    },
    "NON_RECOMMENDED_MACHINE": {
        title: "非推奨機です",
        message: '非推奨機をお持ちの学生です。',
        subMessage: '非推奨機ガイダンス会場へ誘導してください。',
    },
    "NOT_FOUND_STUDENT": {
        message: '該当する学生情報が見つかりませんでした。',
        subMessage: '学籍番号が正しいかご確認ください。',
    },
    "INVALID_STUDENT_NUMBER": {
        message: '正しい学籍番号を入力してください。',
        subMessage: '8桁入力されているかご確認ください。',
    },
    "INTERNAL_SERVER_ERROR": {
        message: 'サーバー内部でエラーが発生しました。',
        subMessage: 'エラーが解決しない場合は、開発者にお問い合わせください。',
    },
    "SUCCESSFUL_FIREBASE_SDK_READ": {
        message: 'Firebase SDKの読み込みに成功しました。',
    },
    "FAILED_FIREBASE_SDK_READ": {
        message: 'Firebase SDKの読み込みに失敗しました。',
        subMessage: 'ファイルが正しいかご確認ください。',
    },
    "CREATE_DIRECTORY_FAILED": {
        message: 'ディレクトリの作成に失敗しました。',
    },
    "NO_SELECTED_FILE": {
        message: 'ファイルが選択されていません。',
    },
} as const;
