# 🧪 ローカルテストガイド

**Purpose:** npm run dev でローカル開発環境をテストする方法

**Status:** Ready for Rowly  
**Date:** 2026-04-05 JST

---

## 🚀 クイックスタート（5 分）

### ステップ 1: 開発サーバーを起動

```bash
cd /Users/doug/Projects/rowly-conversation-hub-v2
PORT=3002 npm run dev
```

**期待される出力:**
```
> rowly-conversation-hub-v2@1.0.0 dev
> next dev

  ▲ Next.js 14.2.35
  - Local:        http://localhost:3002
  - Environments: .env.local

 ✓ Starting...
 ✓ Ready in 841ms
```

### ステップ 2: ブラウザで http://localhost:3002 にアクセス

```
ブラウザ: Chrome / Safari / Firefox
URL: http://localhost:3002
期待: ログインページが日本語で表示される
```

---

## 📝 テストケース

### テスト 1: ページロード (1 分)

**目的:** UI が正しく表示されることを確認

```
1. http://localhost:3002 にアクセス
2. 以下を確認:
   ✅ 🌊 Rowly's Hub ロゴが表示される
   ✅ メールアドレス入力フィールド
   ✅ パスワード入力フィールド
   ✅ "ログイン" / "アカウント作成" ボタン
   ✅ 青系（Shonan）カラーテーマが適用されている
   ✅ レスポンシブ（F12 で DevTools 開いて確認）

3. コンソールを確認
   ✅ エラーメッセージがない
```

**失敗時の対応:**
```
エラー: "Invalid API key"
→ .env.local の NEXT_PUBLIC_SUPABASE_ANON_KEY を確認
   (完全なキー = 500+ 文字)
```

---

### テスト 2: サインアップフロー (2 分)

**目的:** 新規ユーザー登録フローをテスト

```
1. ログインページで "アカウント作成" ボタンをクリック
   ✅ ボタンテキストが "サインアップ" に変わる

2. テスト用メールアドレスを入力
   Email: rowly-test-001@example.com
   
3. パスワードを入力
   Password: TestPassword123!@
   
4. "サインアップ" ボタンをクリック
   ✅ 期待: アラート "サインアップ成功！メールを確認してください。"
   または
   エラー: "Invalid API key" (Supabase 設定が必要な場合)

5. コンソール確認
   ✅ エラーメッセージがない
```

**注意:**
- メール確認が必要な場合がある（Supabase 設定）
- テスト用メールアドレスは任意

---

### テスト 3: ログインフロー (2 分)

**目的:** 既存ユーザーのログイン機能をテスト

```
1. "ログイン" ボタンをクリック
   ✅ ボタンテキストが "ログイン" に変わる

2. メールアドレスを入力
   Email: rowly-test-001@example.com
   
3. パスワードを入力
   Password: TestPassword123!@
   
4. "ログイン" ボタンをクリック
   ✅ 期待: ダッシュボード (/dashboard) にリダイレクト
   または
   エラー: "Invalid API key" (Supabase 認証が必要)

5. ダッシュボードページ確認
   ✅ URL が http://localhost:3002/dashboard に変わる
   ✅ "スレッド一覧" ページが表示される
```

**失敗時の対応:**
```
リダイレクトが起こらない:
→ DevTools Console でエラーを確認
→ Supabase の API キーが有効であることを確認
→ .env.local を再度確認
```

---

### テスト 4: ダッシュボード (2 分)

**目的:** ダッシュボード UI と スレッド一覧機能をテスト

```
1. ダッシュボードページを確認
   ✅ "スレッド一覧" ヘッダー表示
   ✅ "+ 新規スレッド" ボタン表示
   ✅ (初回) スレッドリストは空 or 既存スレッド表示

2. UI レイアウト確認
   ✅ ヘッダー（ナビゲーション）表示
   ✅ サイドバー表示
   ✅ メインコンテンツエリア表示

3. "+ 新規スレッド" ボタンをクリック
   ✅ スレッド名入力フォームが表示される
   ✅ "作成" / "キャンセル" ボタン表示

4. スレッド名を入力
   例: "Felicity Cafe - 4月営業"
   
5. "作成" ボタンをクリック
   ✅ 期待: スレッド詳細ページに移動
   URL: http://localhost:3002/threads/[UUID]
```

**失敗時の対応:**
```
スレッドが作成されない:
→ DevTools → Network tab でリクエストを確認
→ Supabase DB にテーブルが存在するか確認
→ RLS ポリシーが設定されているか確認
```

---

### テスト 5: スレッド詳細ページ (2 分)

**目的:** スレッド内でメッセージ機能をテスト

```
1. スレッド詳細ページを確認
   ✅ スレッド名表示
   ✅ メッセージリストエリア
   ✅ AskDougForm (メッセージ入力フォーム)
   ✅ サイドバーにスレッドが表示される

2. メッセージ入力フォームに質問を入力
   例: "今日の営業成績は？"
   
3. "Ask Doug" ボタンをクリック
   ✅ 期待: 
      - メッセージが保存される
      - メッセージリストに表示される
      - Doug からの応答が追加される

4. メッセージ確認
   ✅ ユーザーのメッセージ表示
   ✅ Doug の応答表示
   ✅ タイムスタンプ表示
```

**応答パターン:**
```
A. デモ応答（OpenClaw API 未接続時）
   "こんにちは！あなたの質問「...」を受け取りました。
    これはデモ応答です。..."

B. OpenClaw API 応答（API 接続時）
   実際の Doug からの応答が表示される
```

---

### テスト 6: リアルタイムメッセージ更新 (2 分)

**目的:** メッセージの自動更新機能をテスト

```
1. 2 つのブラウザウィンドウを開く
   Window A: http://localhost:3002
   Window B: http://localhost:3002 (同じ Supabase account)

2. 両方で同じスレッドを開く

3. Window A でメッセージを送信
   メッセージ: "テスト用メッセージ"
   "Ask Doug" をクリック

4. Window B を観察
   ✅ 期待: 2 秒以内にメッセージが表示される
   (ポーリング間隔 = 2 秒)

5. タイムスタンプ確認
   ✅ メッセージに日付・時刻が表示される
```

---

### テスト 7: スレッド削除 (1 分)

**目的:** スレッド削除機能をテスト

```
1. ダッシュボード (/dashboard) に戻る

2. スレッドリストを確認
   ✅ 作成したスレッドが一覧に表示されている

3. スレッドの削除ボタンをクリック
   (サイドバーのスレッド横のゴミ箱アイコン)

4. 確認ダイアログが表示される
   ✅ 「このスレッドを削除しますか？」

5. OK をクリック
   ✅ 期待: スレッドがリストから削除される
   ✅ ページが自動更新される
```

---

### テスト 8: モバイルレスポンシブ (2 分)

**目的:** モバイルデバイスでの表示をテスト

```
1. ブラウザ DevTools を開く (F12)

2. デバイスモードを有効
   Ctrl+Shift+M (Windows/Linux)
   Cmd+Shift+M (Mac)

3. 各デバイスサイズでテスト

   iPhone 12 (390×844)
   ✅ 縦向きレイアウト
   ✅ ボタンがタッチ可能
   ✅ テキストが読みやすい

   iPad (768×1024)
   ✅ 2 カラムレイアウト
   ✅ サイドバー表示
   ✅ ドロップダウンメニュー動作

   Desktop (1280×720)
   ✅ フル機能レイアウト
   ✅ ナビゲーション完全表示

4. 各デバイスで以下をテスト
   ✅ ログイン
   ✅ スレッド作成
   ✅ メッセージ送信
```

---

### テスト 9: パフォーマンス (1 分)

**目的:** ローカル環境でのパフォーマンスを確認

```
1. DevTools → Performance タブを開く

2. 録画を開始
   Ctrl+Shift+E (または Record ボタン)

3. ページ操作を実行
   - ページロード
   - スレッド作成
   - メッセージ送信

4. 録画を停止
   ✅ 期待:
      - First Paint < 1 秒
      - First Contentful Paint < 1.5 秒
      - Largest Contentful Paint < 2 秒

5. 軽微な遅延は問題なし（ローカル開発環境）
```

---

### テスト 10: コンソールエラー確認 (1 分)

**目的:** JavaScript エラーがないことを確認

```
1. DevTools → Console タブを開く (F12 → Console)

2. ページを操作しながら確認
   ✅ 赤いエラーメッセージがない
   ✅ 黄色いワーニングは許容（ライブラリ警告）

3. よくあるエラー例
   ❌ "Cannot read property of undefined"
   ❌ "Supabase error: 401 Unauthorized"
   ❌ "Fetch failed: API error"

4. エラーが見つかった場合
   → 詳細メッセージをコピー
   → 開発者に報告
```

---

## 🔍 デバッグテクニック

### Network リクエストの確認

```
DevTools → Network tab

確認項目:
✅ login POST request が 200 OK
✅ dashboard GET request が 200 OK
✅ messages GET request が 200 OK
✅ ask-doug POST request が 200 OK
❌ 4xx, 5xx エラーなし
```

### Supabase クライアント確認

```javascript
// DevTools Console で実行
import { supabase } from '@/lib/supabase'
console.log(supabase)
// 出力: SupabaseClient { ... } ← 正常

// ユーザー情報確認
const { data } = await supabase.auth.getUser()
console.log(data)
```

### データベーステーブル確認

```
Supabase Dashboard → Table Editor

確認項目:
✅ threads テーブル
   - rows: 1+ (作成したスレッド)

✅ messages テーブル
   - rows: 1+ (送信したメッセージ)

✅ ask_doug_history テーブル
   - rows: 0+ (Ask Doug 呼び出し履歴)
```

---

## ✅ テスト完了チェックリスト

> **すべてのテストを完了したら、以下をチェック**

- [ ] ページロード（UI 表示）OK
- [ ] サインアップフロー OK
- [ ] ログインフロー OK
- [ ] ダッシュボード OK
- [ ] スレッド詳細ページ OK
- [ ] メッセージ送信 OK
- [ ] リアルタイム更新 OK
- [ ] スレッド削除 OK
- [ ] モバイル表示 OK
- [ ] パフォーマンス OK
- [ ] コンソールエラーなし

**すべて ✅ なら、本番デプロイ準備完了！**

---

## 📞 問題が発生した場合

### 一般的なエラーと解決策

#### "EADDRINUSE: address already in use :::3002"
```bash
別のプロセスがポート 3002 を使用している

解決:
PORT=3003 npm run dev

または、プロセスを停止:
ps aux | grep node
kill -9 [PID]
```

#### "Cannot find module '@supabase/supabase-js'"
```bash
npm install が完了していない

解決:
npm install
npm run dev
```

#### "TypeError: Cannot read property 'url' of undefined"
```
.env.local が読み込まれていない

解決:
1. .env.local が存在するか確認
2. npm run dev を再起動
3. 必要に応じて kill -9 で強制終了
```

#### "RLS policy error: new row violates..."
```
RLS ポリシーが制限的すぎる

解決:
1. Supabase Dashboard → SQL Editor
2. SUPABASE_MIGRATION_SIMPLIFIED.sql を実行
3. WITH CHECK (true) に簡潔化
```

---

## 🎓 開発者向けのヒント

### ホットリロード
```
.tsx / .css ファイル保存
→ 自動的にブラウザが更新される
```

### TypeScript 検証
```bash
npm run build
または
npx tsc --noEmit
```

### ESLint チェック
```bash
npm run lint
```

---

## 🎉 テスト成功！

**すべてのテストが ✅ で完了したら：**

1. Telegram で報告
2. 本番デプロイに進む
3. FINAL_DEPLOYMENT_CHECKLIST.md を参照

---

**Happy Testing! 🚀**

*Last Updated: 2026-04-05 JST*
