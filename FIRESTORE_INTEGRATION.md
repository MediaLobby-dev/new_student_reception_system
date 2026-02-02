# Firestore統合ドキュメント (Firestore Integration Documentation)

このドキュメントは、新入生受付システムにおけるFirestoreの統合方法と、アカウント管理について説明します。

## 目次
1. [概要](#概要)
2. [Firestore統合の仕組み](#firestore統合の仕組み)
3. [Firestoreアカウント管理](#firestoreアカウント管理)
4. [データ構造](#データ構造)
5. [主要な機能](#主要な機能)
6. [セットアップ手順](#セットアップ手順)
7. [セキュリティの考慮事項](#セキュリティの考慮事項)

---

## 概要

このプロジェクトは、Electron + React + TypeScriptで構築された新入生受付システムです。バックエンドデータベースとして**Firebase Firestore**を使用しており、学生情報の管理と受付ステータスの追跡を行います。

### 使用技術
- **Firebase Admin SDK** (v13.0.1): サーバーサイドからFirestoreにアクセス
- **Electron**: デスクトップアプリケーションフレームワーク
- **React + TypeScript**: フロントエンド

---

## Firestore統合の仕組み

### 1. アーキテクチャ概要

このプロジェクトは、Electronの**メインプロセス**でFirebase Admin SDKを初期化し、Firestoreに接続します。フロントエンド（レンダラープロセス）は、IPC（Inter-Process Communication）を通じてメインプロセスと通信し、Firestoreの操作を行います。

```
┌─────────────────────────────────────────────┐
│  Renderer Process (React/TypeScript)        │
│  - UI Components                            │
│  - Hooks (useFirebase, useStudentData)      │
└────────────────┬────────────────────────────┘
                 │ IPC Communication
                 │ (electron.ipcRenderer.invoke)
┌────────────────▼────────────────────────────┐
│  Main Process (Node.js)                     │
│  - Firebase Admin SDK初期化                 │
│  - Firestore接続                            │
│  - CRUD操作                                 │
└────────────────┬────────────────────────────┘
                 │
┌────────────────▼────────────────────────────┐
│  Firebase Firestore (Cloud Database)        │
│  - Collection: "students"                   │
│  - Documents: 学生データ                    │
└─────────────────────────────────────────────┘
```

### 2. 初期化プロセス

#### ステップ1: SDK設定ファイルの配置
- Firebaseの認証情報（サービスアカウントキー）は、**ユーザーのホームディレクトリ**の`config`フォルダに保存されます
- ファイルパス: `{HOME_DIRECTORY}/config/sdk.json`
- このファイルは、Firebase Consoleからダウンロードした**サービスアカウントの秘密鍵JSONファイル**です

#### ステップ2: Firebase初期化
ファイル: `src/main/firebase.ts`

```typescript
export const initializeFirebase = () => {
  // 1. SDK設定ファイルの存在チェック
  if (!isExsistsFirebaseSDKJson()) {
    // エラーダイアログ表示
    return;
  }
  
  // 2. Firebase Admin SDKの初期化
  try {
    initializeApp({
      credential: credential.cert(
        JSON.parse(readFileSync(join(BASE_PATH, 'config', 'sdk.json')).toString())
      ),
    });
  } catch (error) {
    // エラーハンドリング
  }
};
```

この関数は、アプリケーション起動時（`app.whenReady()`）に自動的に呼び出されます（`src/main/index.ts:71`）。

### 3. IPC通信によるFirestore操作

フロントエンドからFirestoreにアクセスする際は、以下のフローで行います：

```typescript
// フロントエンド (Renderer Process)
const studentData = await window.electron.ipcRenderer.invoke('getStudentData', studentId);

// ↓ IPCで通信

// メインプロセス (Main Process)
ipcMain.handle('getStudentData', async (_event, studentId) => 
  getStudentData(studentId)
);
```

### 4. 登録されているIPCハンドラー

`src/main/index.ts`に以下のハンドラーが登録されています：

| IPCチャネル名 | 説明 | 実装ファイル |
|-------------|------|------------|
| `saveSdk` | Firebase SDK設定ファイルの保存 | `functions/saveSdk.ts` |
| `getStudentData` | 学生情報の取得 | `functions/getStudentData.ts` |
| `acceptReception` | 受付処理の実行 | `functions/acceptReception.ts` |
| `editRemarks` | 備考欄の編集 | `functions/editRemark.ts` |
| `cancelReception` | 受付のキャンセル | `functions/cancelReception.ts` |
| `printRecipt` | レシート印刷 | `functions/printRecipt.ts` |
| `testPrint` | テスト印刷 | `functions/printRecipt.ts` |
| `countStudentData` | 学生データ総数の取得 | `functions/countStudentData.ts` |

---

## Firestoreアカウント管理

### アカウント管理の場所

Firestoreのアカウントと認証情報は、以下の場所で管理されます：

#### 1. **Firebase Console** (主な管理場所)
   - URL: https://console.firebase.google.com/
   - ここでFirebaseプロジェクトが作成・管理されます
   - Firestoreデータベースの設定、セキュリティルール、利用状況の確認が可能

#### 2. **Google Cloud Console** (バックエンド管理)
   - URL: https://console.cloud.google.com/
   - Firebaseは内部的にGoogle Cloud Platformを使用しています
   - サービスアカウントの作成と管理はここで行います
   - IAM（Identity and Access Management）でアクセス権限を管理

#### 3. **サービスアカウントキーの生成手順**

以下の手順でサービスアカウントキー（`sdk.json`）を生成します：

1. **Firebase Console**にアクセス
   - プロジェクトを選択
   - 設定（⚙️） → プロジェクトの設定 → サービスアカウント

2. **新しい秘密鍵の生成**をクリック
   - JSONファイルがダウンロードされます
   - このファイルが`sdk.json`として使用されます

3. **重要**: このファイルには機密情報が含まれているため、以下に注意：
   - Gitリポジトリにコミットしない（`.gitignore`で除外済み）
   - セキュアな場所に保管
   - 定期的なローテーション（キーの再生成）を推奨

### プロジェクトでのアカウント管理予測

このプロジェクトの構成から、以下のように管理されていると予測できます：

1. **Firebaseプロジェクト**: 「東京工科大学」または「MediaLobby」組織の所有
2. **アクセス権限**: 
   - 管理者権限を持つメンバーがFirebase Consoleにアクセス可能
   - サービスアカウントには最小限の権限（Firestore読み書き権限）を付与
3. **環境分離**: 
   - 開発環境と本番環境で異なるFirebaseプロジェクトを使用する可能性あり
   - それぞれ異なる`sdk.json`を使用

---

## データ構造

### Firestoreコレクション: `students`

学生情報は`students`コレクションに保存されます。各ドキュメントIDは**学籍番号**です。

```typescript
interface StudentData {
  studentName: string;      // 学生氏名
  kana: string;             // カナ（フリガナ）
  department: string;       // 学科
  remarks: string;          // 備考
  supply: any;              // 配布物情報
  isDeprecatedPC: boolean;  // 旧型PC利用フラグ
  isNeedNotify: boolean;    // 通知必要フラグ
  receptionStatus: boolean; // 受付ステータス (true: 受付済み, false: 未受付)
}
```

### データベース操作例

#### 学生情報の取得
```typescript
const db = firestore();
const docRef = db.collection('students').doc(studentId);
const docSnap = await docRef.get();
const studentData = docSnap.data();
```

#### 受付ステータスの更新（トランザクション使用）
```typescript
await db.runTransaction(async (transaction) => {
  const docRef = db.collection('students').doc(studentId);
  const docSnap = await transaction.get(docRef);
  
  transaction.update(docRef, {
    receptionStatus: true
  });
});
```

---

## 主要な機能

### 1. 学生情報取得 (`getStudentData`)
- 学籍番号を元にFirestoreから学生データを取得
- ファイル: `src/main/functions/getStudentData.ts`

### 2. 受付処理 (`acceptReception`)
- 学生の受付ステータスを`true`に更新
- トランザクションを使用して整合性を保証
- ファイル: `src/main/functions/acceptReception.ts`

### 3. 受付キャンセル (`cancelReception`)
- 受付ステータスを`false`に戻す
- ファイル: `src/main/functions/cancelReception.ts`

### 4. 備考編集 (`editRemarks`)
- 学生の備考欄を更新
- ファイル: `src/main/functions/editRemark.ts`

### 5. 学生数カウント (`countStudentData`)
- データベース内の総学生数を取得
- 接続テストとしても使用
- ファイル: `src/main/functions/countStudentData.ts`

---

## セットアップ手順

### 1. 依存関係のインストール
```bash
npm install
```

### 2. Firebase SDK設定ファイルの配置

#### 方法A: アプリ内から設定（推奨）
1. アプリケーションを起動
2. 設定画面を開く
3. 「Firebase SDK設定」からJSONファイルを選択
4. アプリを再起動

#### 方法B: 手動で配置
1. Firebase Consoleからサービスアカウントキー（JSON）をダウンロード
2. ファイルを以下の場所に配置：
   - Windows: `C:\Users\{USERNAME}\config\sdk.json`
   - macOS/Linux: `/home/{USERNAME}/config/sdk.json`

### 3. アプリケーションの起動
```bash
# 開発モード
npm run dev

# ビルド
npm run build:win  # Windows
```

---

## セキュリティの考慮事項

### 1. 秘密鍵の管理
- ✅ `sdk.json`は`.gitignore`で除外されている
- ✅ ユーザーのホームディレクトリに保存（アプリケーション外）
- ⚠️ 定期的なキーローテーションを推奨
- ⚠️ 本番環境では環境変数やSecrets Managerの使用を検討

### 2. Firestoreセキュリティルール
現在の実装ではFirebase Admin SDKを使用しているため、セキュリティルールをバイパスします。以下を確認してください：

- サービスアカウントには最小限の権限のみを付与
- Firebase Consoleでセキュリティルールを適切に設定
- 不要な読み書き権限を制限

### 3. エラーハンドリング
- 接続エラー時にはユーザーフレンドリーなメッセージを表示
- トランザクションを使用してデータ整合性を保証
- 重要な操作ではデータ検証を実施

---

## トラブルシューティング

### SDK設定ファイルが見つからない
**エラー**: "Firebase SDKの接続情報が存在しません"

**解決策**:
1. `{HOME_DIRECTORY}/config/`ディレクトリが存在するか確認
2. `sdk.json`ファイルが正しく配置されているか確認
3. JSONファイルの形式が正しいか確認
4. Firebase Consoleから新しいキーをダウンロードして再配置

### 接続エラー
**エラー**: "接続に失敗しました"

**解決策**:
1. インターネット接続を確認
2. FirebaseプロジェクトのURLが正しいか確認
3. サービスアカウントキーが有効か確認（無効化されていないか）
4. Firebase Consoleでプロジェクトの状態を確認

### データの整合性エラー
**エラー**: "データの整合性検証に失敗しました"

**解決策**:
1. 学籍番号を再度読み込み直す
2. Firestoreのデータが正しく存在するか確認
3. 複数のユーザーが同時に同じデータを操作していないか確認

---

## まとめ

このプロジェクトにおけるFirestoreの統合は、以下のように設計されています：

1. **セキュア**: サービスアカウントキーを使用し、ローカルに安全に保管
2. **分離**: メインプロセスとレンダラープロセスで責任を分離
3. **トランザクション対応**: データ整合性を保証
4. **エラーハンドリング**: 適切なエラーメッセージとユーザーガイダンス

Firestoreアカウントは**Firebase Console**と**Google Cloud Console**で管理されており、このプロジェクトでは組織の管理者がアクセス権限を持っていると予測されます。

---

**作成日**: 2026-02-02  
**バージョン**: 1.0  
**対象システム**: 新入生受付システム v1.0.5
