# Firestore統合アーキテクチャ図 / Firestore Integration Architecture Diagram

## システムアーキテクチャ / System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Electron Application                         │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │           Renderer Process (Frontend)                          │ │
│  │                                                                 │ │
│  │  ┌──────────────────────────────────────────────────────────┐ │ │
│  │  │  React Components                                        │ │ │
│  │  │  - UserView                                              │ │ │
│  │  │  - StudentIdInputBox                                     │ │ │
│  │  │  - Modal/Setting                                         │ │ │
│  │  └──────────────────────────────────────────────────────────┘ │ │
│  │                         ↓                                       │ │
│  │  ┌──────────────────────────────────────────────────────────┐ │ │
│  │  │  Custom Hooks                                            │ │ │
│  │  │  - useFirebase()                                         │ │ │
│  │  │  - useStudentData()                                      │ │ │
│  │  │  - useAcceptReception()                                  │ │ │
│  │  │  - useInitializeFirebase()                               │ │ │
│  │  └──────────────────────────────────────────────────────────┘ │ │
│  │                         ↓                                       │ │
│  │  ┌──────────────────────────────────────────────────────────┐ │ │
│  │  │  IPC Renderer                                            │ │ │
│  │  │  window.electron.ipcRenderer.invoke()                    │ │ │
│  │  └──────────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│                    ═══════════════════════                           │
│                         IPC Bridge                                   │
│                    ═══════════════════════                           │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │           Main Process (Backend)                               │ │
│  │                                                                 │ │
│  │  ┌──────────────────────────────────────────────────────────┐ │ │
│  │  │  IPC Main Handlers                                       │ │ │
│  │  │  ipcMain.handle('getStudentData', ...)                   │ │ │
│  │  │  ipcMain.handle('acceptReception', ...)                  │ │ │
│  │  │  ipcMain.handle('saveSdk', ...)                          │ │ │
│  │  │  ipcMain.handle('countStudentData', ...)                 │ │ │
│  │  └──────────────────────────────────────────────────────────┘ │ │
│  │                         ↓                                       │ │
│  │  ┌──────────────────────────────────────────────────────────┐ │ │
│  │  │  Firebase Functions                                      │ │ │
│  │  │  - getStudentData.ts                                     │ │ │
│  │  │  - acceptReception.ts                                    │ │ │
│  │  │  - cancelReception.ts                                    │ │ │
│  │  │  - editRemark.ts                                         │ │ │
│  │  │  - countStudentData.ts                                   │ │ │
│  │  └──────────────────────────────────────────────────────────┘ │ │
│  │                         ↓                                       │ │
│  │  ┌──────────────────────────────────────────────────────────┐ │ │
│  │  │  Firebase Admin SDK                                      │ │ │
│  │  │  - initializeApp()                                       │ │ │
│  │  │  - firestore()                                           │ │ │
│  │  │  - credential.cert()                                     │ │ │
│  │  └──────────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
                                ↓
                    HTTPS (REST/gRPC)
                                ↓
┌─────────────────────────────────────────────────────────────────────┐
│                    Firebase Firestore (Cloud)                        │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  Collection: students                                          │ │
│  │                                                                 │ │
│  │  Document: {studentId}                                         │ │
│  │  ├─ studentName: string                                        │ │
│  │  ├─ kana: string                                               │ │
│  │  ├─ department: string                                         │ │
│  │  ├─ remarks: string                                            │ │
│  │  ├─ supply: any                                                │ │
│  │  ├─ isDeprecatedPC: boolean                                    │ │
│  │  ├─ isNeedNotify: boolean                                      │ │
│  │  └─ receptionStatus: boolean                                   │ │
│  └────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

## 認証フロー / Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│  アプリ起動 / Application Startup                                   │
└────────────────────┬────────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────────────┐
│  1. config/sdk.json の存在確認                                       │
│     Check for config/sdk.json                                       │
│     Location: {HOME_DIRECTORY}/config/sdk.json                      │
└────────────────────┬────────────────────────────────────────────────┘
                     ↓
          ┌──────────┴──────────┐
          │                      │
      存在する              存在しない
      Exists               Not Found
          │                      │
          ↓                      ↓
┌──────────────────┐   ┌──────────────────┐
│ Firebase初期化   │   │ エラーダイアログ  │
│ Initialize       │   │ Error Dialog     │
│ Firebase         │   │ 表示 / Display   │
└────────┬─────────┘   └──────────────────┘
         ↓
┌─────────────────────────────────────────────────────────────────────┐
│  2. サービスアカウントキーで認証                                      │
│     Authenticate with Service Account Key                            │
│     - JSON形式のクレデンシャル読み込み                               │
│       Load JSON credentials                                         │
│     - Firebase Admin SDK初期化                                       │
│       Initialize Firebase Admin SDK                                 │
└────────────────────┬────────────────────────────────────────────────┘
                     ↓
          ┌──────────┴──────────┐
          │                      │
        成功                   失敗
       Success               Failure
          │                      │
          ↓                      ↓
┌──────────────────┐   ┌──────────────────┐
│ Firestore接続完了│   │ 初期化エラー      │
│ Firestore        │   │ Initialization   │
│ Connected        │   │ Error            │
└──────────────────┘   └──────────────────┘
```

## データフロー例 / Data Flow Example

### 学生受付処理 / Student Reception Process

```
┌────────────────┐
│  ユーザー入力  │
│  User Input    │
│  (学籍番号)    │
│  (Student ID)  │
└────────┬───────┘
         ↓
┌────────────────────────────────────────┐
│  StudentIdInputBox Component           │
│  - 学籍番号の検証 / Validate ID        │
└────────┬───────────────────────────────┘
         ↓
┌────────────────────────────────────────┐
│  useStudentData Hook                   │
│  - invoke('getStudentData', id)        │
└────────┬───────────────────────────────┘
         ↓ IPC
┌────────────────────────────────────────┐
│  Main Process                          │
│  - getStudentData(id) 関数呼び出し     │
└────────┬───────────────────────────────┘
         ↓
┌────────────────────────────────────────┐
│  Firestore Query                       │
│  db.collection('students').doc(id)     │
│    .get()                              │
└────────┬───────────────────────────────┘
         ↓
┌────────────────────────────────────────┐
│  学生データ取得 / Get Student Data     │
│  {                                      │
│    studentName, kana, department,      │
│    receptionStatus, ...                │
│  }                                      │
└────────┬───────────────────────────────┘
         ↓ IPC Response
┌────────────────────────────────────────┐
│  Renderer Process                      │
│  - 状態更新 / Update State             │
│  - UI表示 / Display UI                 │
└────────────────────────────────────────┘
         ↓
┌────────────────────────────────────────┐
│  UserView Component                    │
│  - 学生情報表示 / Display Info         │
│  - 受付ボタン / Reception Button       │
└────────┬───────────────────────────────┘
         ↓ (受付ボタンクリック / Click)
┌────────────────────────────────────────┐
│  useAcceptReception Hook               │
│  - invoke('acceptReception', id)       │
└────────┬───────────────────────────────┘
         ↓ IPC
┌────────────────────────────────────────┐
│  Main Process                          │
│  - acceptReception(id) 関数呼び出し    │
└────────┬───────────────────────────────┘
         ↓
┌────────────────────────────────────────┐
│  Firestore Transaction                 │
│  db.runTransaction(async (txn) => {    │
│    // 整合性チェック / Check integrity│
│    // 更新 / Update                    │
│    txn.update(docRef, {                │
│      receptionStatus: true             │
│    })                                   │
│  })                                     │
└────────┬───────────────────────────────┘
         ↓
┌────────────────────────────────────────┐
│  成功レスポンス / Success Response     │
│  - UI更新 / Update UI                  │
│  - 印刷処理 / Print Receipt            │
└────────────────────────────────────────┘
```

## ファイル構成 / File Structure

```
new_student_reception_system/
├── src/
│   ├── main/                          # メインプロセス / Main Process
│   │   ├── index.ts                   # エントリーポイント / Entry point
│   │   ├── firebase.ts                # Firebase初期化 / Initialization
│   │   └── functions/                 # Firestore操作関数 / Functions
│   │       ├── getStudentData.ts      # 学生データ取得 / Get student data
│   │       ├── acceptReception.ts     # 受付処理 / Accept reception
│   │       ├── cancelReception.ts     # 受付キャンセル / Cancel reception
│   │       ├── editRemark.ts          # 備考編集 / Edit remarks
│   │       ├── countStudentData.ts    # データ数取得 / Count data
│   │       ├── saveSdk.ts             # SDK保存 / Save SDK
│   │       └── printRecipt.ts         # 印刷処理 / Print receipt
│   │
│   └── renderer/                      # レンダラープロセス / Renderer Process
│       └── src/
│           ├── components/            # UIコンポーネント / UI Components
│           │   ├── UserView/          # 学生情報表示 / Student info view
│           │   ├── StudentIdInputBox/ # ID入力 / ID input
│           │   └── Modal/Setting/     # 設定画面 / Settings
│           └── hooks/                 # カスタムフック / Custom Hooks
│               ├── useFirebase.ts     # Firebase操作 / Firebase ops
│               ├── useStudentData.ts  # 学生データ / Student data
│               └── useInitializeFirebase.ts # 初期化 / Initialization
│
├── {HOME_DIRECTORY}/                  # ユーザーホーム / User Home
│   └── config/
│       └── sdk.json                   # Firebase認証情報 / Credentials
│                                      # (Git管理外 / Not in Git)
│
├── FIRESTORE_INTEGRATION.md           # 本ドキュメント (日本語)
├── FIRESTORE_INTEGRATION_EN.md        # English Documentation
└── README.md                          # プロジェクト概要 / Project Overview
```

## セキュリティレイヤー / Security Layers

```
┌─────────────────────────────────────────────────────────────────────┐
│  Layer 1: ローカルファイルシステム / Local File System               │
│  ├─ sdk.json は Git管理外 (.gitignore)                              │
│  │  sdk.json is excluded from Git (.gitignore)                      │
│  └─ ユーザーホームディレクトリに保存 (アプリ外)                      │
│     Stored in user home directory (outside app)                     │
└─────────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────────┐
│  Layer 2: Firebase サービスアカウント / Service Account              │
│  ├─ 最小権限の原則 / Principle of Least Privilege                   │
│  ├─ Firestore読み書き権限のみ / Read/Write Firestore only          │
│  └─ 定期的なキーローテーション / Regular key rotation               │
└─────────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────────┐
│  Layer 3: Firebase Admin SDK                                        │
│  ├─ サーバーサイド認証 / Server-side authentication                │
│  ├─ トークン管理 / Token management                                 │
│  └─ 自動的な接続管理 / Automatic connection management              │
└─────────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────────┐
│  Layer 4: Firestore セキュリティルール / Security Rules             │
│  ├─ コレクションレベルのアクセス制御                                │
│  │  Collection-level access control                                │
│  ├─ フィールドレベルのバリデーション                                │
│  │  Field-level validation                                         │
│  └─ クエリ制限 / Query restrictions                                │
└─────────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────────┐
│  Layer 5: Google Cloud Platform (GCP)                               │
│  ├─ IAM権限管理 / IAM permission management                         │
│  ├─ 監査ログ / Audit logs                                           │
│  └─ ネットワークセキュリティ / Network security                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

**作成日 / Created**: 2026-02-02  
**バージョン / Version**: 1.0
