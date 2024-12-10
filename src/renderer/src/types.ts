export type StudentData = {
  studentName: string; // 氏名
  kana: string; // カナ
  department: string; // 学科
  remarks: string; // 備考欄
  supply: string; // サプライ品購入状況
  isDeprecatedPC: boolean; // 非推奨PCフラグ
  isNeedNotify: boolean; // 案内所要フラグ
  receptionStatus: boolean; // 受付状況
};

export type queryProps = {
  isLoading: boolean;
  data: StudentData | null;
};

export type departmentColor = {
  departmentName: string;
  styleName: string;
};

export type departmentColorList = departmentColor[];
