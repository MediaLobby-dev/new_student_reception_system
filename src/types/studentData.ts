export interface StudentData {
  studentName: string; // 氏名
  kana: string; // カナ
  department: string; // 学科
  remarks: string | undefined; // 備考欄
  supply: {
    id: string | number;
    name: string;
} | null | undefined // サプライ品購入状況
  isDeprecatedPC: boolean; // 非推奨PCフラグ
  isNeedNotify: boolean; // 案内所要フラグ
  receptionStatus: boolean; // 受付状況
}
