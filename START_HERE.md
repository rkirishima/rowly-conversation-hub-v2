# 🌊 START HERE - Rowly's Conversation Hub v2

## What You Have

A complete, production-ready Next.js app for managing conversations with Doug. Built from scratch, zero code reuse.

## Quick Links

📖 **Setup Help**
- [QUICKSTART.md](./QUICKSTART.md) ← Start here (1-5 minutes)
- [README.md](./README.md) ← Full documentation
- [IMPLEMENTATION.md](./IMPLEMENTATION.md) ← Technical details

✅ **Verification**
- [VERIFICATION.md](./VERIFICATION.md) ← Everything works ✓

---

## 60-Second Setup

### 1. Get Supabase Credentials (5 min)
```
→ Go to supabase.com
→ Create new project
→ Get URL and anon key from Settings > API
```

### 2. Setup This Project (3 min)
```bash
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials
npm install  # (already done, but for reference)
```

### 3. Create Database (2 min)
Paste this in Supabase SQL Editor:

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

### 4. Run It (1 min)
```bash
npm run dev
```

Open: http://localhost:3000

**That's it! 🎉**

---

## Features

✨ **What's Included**
- 🔐 Email/password auth via Supabase
- 💬 Create & manage conversation threads
- 📨 "Ask Doug" button → message saved to DB
- 🔄 Real-time updates (2-second polling)
- 📱 Fully responsive mobile/tablet/desktop
- 🌊 Beautiful Shonan ocean theme
- 🇯🇵 100% Japanese UI
- 🛡️ Secure (RLS policies, no SQL injection, etc.)

---

## Pages

| Page | URL | What It Does |
|------|-----|--------------|
| Login | `/login` | Sign up / log in |
| Dashboard | `/dashboard` | List all threads |
| Thread | `/threads/[id]` | View messages + Ask Doug |
| Settings | `/settings` | Account info + logout |

---

## File Structure

```
📦 rowly-conversation-hub-v2
├── 📄 pages/              ← All pages & API routes
├── 🎨 components/         ← Reusable UI components
├── 🎯 lib/supabase.ts     ← Database client
├── 🌊 styles/globals.css  ← Global styles
├── ⚙️ Configuration files  ← Next.js, Tailwind, TS
├── 📚 Documentation       ← README, guides
└── 📦 package.json        ← Dependencies
```

---

## Customization

Change colors? Edit `tailwind.config.ts`

```js
'shonan': {
  'navy': '#001f3f',     // 深紺
  'teal': '#0db4d4',     // 青緑
  'sky': '#1da3d8',      // 空色
  'sand': '#e8dcc8',     // 砂色
  'dark': '#1a2332',     // 濃い灰
}
```

---

## Troubleshooting

### "Missing Supabase environment variables"
→ Check `.env.local` has correct URL and key

### "RLS policy violation"
→ Make sure all SQL policies are created in Supabase

### Can't login
→ Check Supabase Auth is enabled (it is by default)

---

## Deploy to Production

### Vercel (easiest)
```bash
vercel login
vercel
```

### Self-hosted
```bash
npm run build
npm start
```

See [README.md](./README.md#deployment) for more options.

---

## Tech Stack

- **Frontend**: Next.js 14 + React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Hosting**: Vercel / any Node server

---

## Questions?

📖 Full docs in [README.md](./README.md)

All features documented with:
- Step-by-step setup
- Troubleshooting guide
- Customization tips
- Deployment options

---

## What's Working ✅

- [x] Signup/Login with email
- [x] Create threads
- [x] Send messages
- [x] Ask Doug integration
- [x] Delete threads
- [x] Real-time updates
- [x] Mobile responsive
- [x] Error handling
- [x] Japanese UI
- [x] Production ready

---

**Ready? Run this:**

```bash
npm run dev
```

**Then open:** http://localhost:3000

Enjoy! 🌊✨
