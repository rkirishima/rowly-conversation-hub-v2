# 🚀 Quick Start Guide

## 1分でセットアップする

### Step 1: Supabase プロジェクト作成 (5分)

1. [supabase.com](https://supabase.com) → Free でサインアップ
2. New Project を作成
3. Settings → API からコピー:
   - `Project URL`
   - `anon public` キー

### Step 2: データベーススキーマ作成

Supabase の SQL Editor で以下を実行:

```sql
CREATE TABLE threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users,
  sender VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_threads_user_id ON threads(user_id);
CREATE INDEX idx_messages_thread_id ON messages(thread_id);

ALTER TABLE threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own threads"
ON threads FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create threads"
ON threads FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own threads"
ON threads FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own threads"
ON threads FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view messages in their threads"
ON messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM threads WHERE threads.id = messages.thread_id AND threads.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create messages in their threads"
ON messages FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM threads WHERE threads.id = messages.thread_id AND threads.user_id = auth.uid()
  ) AND auth.uid() = user_id
);
```

### Step 3: 環境設定

```bash
# .env.local を作成
cp .env.local.example .env.local
```

`.env.local` を編集:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxx...
```

### Step 4: 起動

```bash
# 依存関係をインストール (既にしてあれば不要)
npm install

# 開発サーバーを起動
npm run dev
```

**ブラウザで開く**: http://localhost:3000

## テストアカウント

1. `/login` ページに移動
2. メールアドレスとパスワードを入力
3. 「アカウント作成」をクリック
4. ログイン
5. 「新規スレッド」で会話開始！

## 動作確認チェックリスト

- [ ] ログインページが表示される
- [ ] サインアップできる
- [ ] ダッシュボードが開く
- [ ] スレッドが作成できる
- [ ] メッセージが送受信できる
- [ ] サイドバーからスレッド切り替えできる
- [ ] 設定ページが開く
- [ ] ログアウトできる

## トラブルシューティング

### エラー: Supabase接続失敗
```
❌ Missing Supabase environment variables
```
→ `.env.local` に `NEXT_PUBLIC_SUPABASE_URL` と `NEXT_PUBLIC_SUPABASE_ANON_KEY` が正しく設定されているか確認

### エラー: RLS政策エラー
```
❌ Policy violation (new row violates RLS policy)
```
→ Supabase Dashboard の Policies がすべて有効になっているか確認

### ポート3000が使用中
```bash
# 別のポートで起動
npm run dev -- -p 3001
```

## 本番デプロイ

### Vercel へのデプロイ (推奨)

```bash
npm install -g vercel
vercel
```

プロンプトに従って、環境変数を設定してください。

## OpenClaw API 統合

デモ応答ではなく本物の API 統合:

1. `.env.local` に追加:
```env
NEXT_PUBLIC_OPENCLAW_API_URL=<OpenClaw API URL>
NEXT_PUBLIC_OPENCLAW_API_KEY=<API Key>
```

2. `/api/ask-doug.ts` の OpenClaw API 呼び出し部分を有効化

## 次のステップ

- [README.md](./README.md) で詳細なセットアップを確認
- `components/` ディレクトリで UI コンポーネントをカスタマイズ
- `tailwind.config.ts` で色をカスタマイズ
- `pages/` で新しいページを追加

---

質問がある場合は、README.md を確認するか、プロジェクトフォルダを見てください！🌊
