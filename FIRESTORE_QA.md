# Firestore統合に関する質問への回答

## 質問1: このプロジェクトはFirestoreとどのように結合されているか？

### 回答の要約

このプロジェクトは**Firebase Admin SDK**を使用して、Electronのメインプロセスから直接Firestoreに接続しています。フロントエンド（レンダラープロセス）は、IPC（プロセス間通信）を介してメインプロセスと通信し、間接的にFirestoreを操作します。

### 統合の詳細

1. **認証方式**: サービスアカウントキー（`sdk.json`）を使用
   - ファイル位置: `{ユーザーのホームディレクトリ}/config/sdk.json`
   - Firebase Consoleからダウンロードした秘密鍵JSONファイル

2. **初期化**: アプリ起動時に自動実行
   ```typescript
   // src/main/firebase.ts
   initializeApp({
     credential: credential.cert(JSON.parse(sdk.json))
   });
   ```

3. **データベース操作**: 
   - コレクション: `students`
   - ドキュメントID: 学籍番号
   - 操作: 取得、更新、トランザクション

4. **通信フロー**:
   ```
   React Component 
   → Custom Hook 
   → IPC通信 
   → メインプロセスの関数 
   → Firebase Admin SDK 
   → Firestore
   ```

### 実装されている主な機能

| 機能 | 実装ファイル | Firestoreの操作 |
|-----|------------|----------------|
| 学生情報取得 | `getStudentData.ts` | `db.collection('students').doc(id).get()` |
| 受付処理 | `acceptReception.ts` | トランザクションで`receptionStatus`を更新 |
| 受付キャンセル | `cancelReception.ts` | トランザクションで`receptionStatus`を戻す |
| 備考編集 | `editRemark.ts` | トランザクションで`remarks`を更新 |
| 学生数カウント | `countStudentData.ts` | `db.collection('students').get().size` |

---

## 質問2: Firestoreのアカウントはどこで管理されているか予測できるか？

### 回答の要約

Firestoreのアカウントとプロジェクトは、**Firebase Console**（https://console.firebase.google.com/）と**Google Cloud Console**（https://console.cloud.google.com/）で管理されていると予測されます。

### 管理場所の詳細

#### 1. Firebase Console（プロジェクト管理）
- **役割**: Firebaseプロジェクトの全般的な管理
- **URL**: https://console.firebase.google.com/
- **管理できる内容**:
  - Firestoreデータベースの閲覧と管理
  - セキュリティルールの設定
  - 利用状況とクォータの確認
  - プロジェクトメンバーの管理
  - サービスアカウントキーの生成

#### 2. Google Cloud Console（バックエンド管理）
- **役割**: Google Cloud Platform（GCP）リソースの管理
- **URL**: https://console.cloud.google.com/
- **管理できる内容**:
  - サービスアカウントの作成と管理
  - IAM権限の設定
  - 課金とクォータ管理
  - 監査ログの確認
  - APIの有効化/無効化

### 予測されるアクセス権限構造

```
┌─────────────────────────────────────────┐
│ Google Cloud Platform 組織              │
│ (東京工科大学 または MediaLobby)        │
└────────────────┬────────────────────────┘
                 │
        ┌────────┴────────┐
        │                  │
┌───────▼───────┐  ┌──────▼──────┐
│ Firebaseプロジェ│  │ Firebaseプロジェ│
│ クト（開発環境）│  │クト（本番環境） │
└───────┬────────┘  └──────┬──────┘
        │                  │
   ┌────┴────┐        ┌────┴────┐
   │         │        │         │
┌──▼──┐  ┌──▼──┐  ┌──▼──┐  ┌──▼──┐
│管理者│  │開発者│  │管理者│  │限定  │
│権限 │  │権限 │  │権限 │  │権限 │
└─────┘  └─────┘  └─────┘  └─────┘
```

### サービスアカウントの管理

**生成手順**:
1. Firebase Console → プロジェクトの設定 → サービスアカウント
2. 「新しい秘密鍵の生成」をクリック
3. JSONファイル（`sdk.json`）がダウンロードされる

**予測される管理方法**:
- プロジェクト管理者が秘密鍵を生成
- セキュアなチャネル（社内共有、暗号化メール等）で配布
- 各エンドユーザーが自分のマシンの`config/sdk.json`に配置
- 定期的なキーローテーション（セキュリティベストプラクティス）

### 組織・プロジェクトの予測

**プロジェクト名の可能性**:
- `medialobby-tut-student-system`
- `tokyo-tech-reception-system`
- `mel-tut-new-student-reception`

**所有組織**:
- 東京工科大学（Tokyo University of Technology）
- MediaLobby開発チーム

**アクセス権限の種類**:
- **Owner（オーナー）**: プロジェクトの完全な管理権限
- **Editor（編集者）**: データの読み書き権限
- **Viewer（閲覧者）**: データの読み取り専用権限
- **Service Account（サービスアカウント）**: アプリケーション用の自動認証

### セキュリティ上の考慮事項

1. **秘密鍵の管理**
   - ✅ Gitリポジトリには含まれていない（`.gitignore`で除外）
   - ✅ ユーザーのホームディレクトリに保存（アプリケーション外）
   - ⚠️ 定期的なキーローテーションが推奨される

2. **アクセス制御**
   - サービスアカウントには最小限の権限（Firestore読み書きのみ）
   - 本番環境と開発環境で異なるプロジェクトを使用
   - IAMで適切なロールとポリシーを設定

3. **監査と監視**
   - Google Cloud Consoleで操作ログを確認可能
   - 異常なアクセスパターンの検知
   - クォータ超過の通知設定

---

## 結論

### 統合の仕組み
このプロジェクトは、**Firebase Admin SDK**を使用してElectronアプリからFirestoreに接続しています。認証は**サービスアカウントキー**（`sdk.json`）を使用し、メインプロセスで初期化されます。フロントエンドは**IPC通信**を通じてメインプロセスに依頼し、間接的にFirestoreを操作します。

### アカウント管理
Firestoreアカウントは**Firebase Console**と**Google Cloud Console**で管理されており、東京工科大学またはMediaLobby組織の管理者がアクセス権限を持っていると予測されます。サービスアカウントキーは、プロジェクト管理者が生成し、セキュアに配布されていると考えられます。

---

**より詳しい情報は以下のドキュメントを参照してください**:
- [Firestore統合ドキュメント（詳細版）](./FIRESTORE_INTEGRATION.md)
- [アーキテクチャ図](./ARCHITECTURE.md)

**作成日**: 2026-02-02
