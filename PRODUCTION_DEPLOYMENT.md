# 🚀 Rowly's Conversation Hub v2 — Production Deployment Guide

**Status:** Ready for Production ✅  
**Updated:** 2026-04-05  
**Environment:** Supabase + Next.js 14 on Vercel

---

## ✅ Current Status

| Step | Status | Notes |
|------|--------|-------|
| Code Complete | ✅ | All features built, tested, documented |
| Build Success | ✅ | `npm run build` passes with 0 errors |
| Dev Server | ✅ | `npm run dev -p 3001` runs successfully |
| .env.local | ✅ | Configured with Supabase + OpenClaw tokens |
| DB Migration SQL | ✅ | `SUPABASE_MIGRATION.sql` ready in root |
| GitHub | ⏳ | Awaiting repo creation/linking |
| Vercel | ⏳ | Ready after GitHub setup |

---

## 📋 Step 1: Supabase Database Setup (MANUAL)

### A. Execute SQL Migration

1. Go to **Supabase Dashboard**: https://supabase.com/dashboard
2. Select project: **Rowly's Conversation Hub** (`irvmtabaomcfdbqwulbj`)
3. Navigate to **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy-paste content from `/SUPABASE_MIGRATION.sql` (entire file)
6. Click **Run** (or Ctrl+Enter)

### B. Verify Tables Created

In SQL Editor, run:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
```

**Expected output:**
- ✅ `threads`
- ✅ `messages`
- ✅ `ask_doug_history`

### C. Verify RLS Policies

Run:
```sql
SELECT policyname, tablename FROM pg_policies 
WHERE schemaname = 'public';
```

**Expected output:** 8+ policies listed

### D. Verify Indexes

Run:
```sql
SELECT indexname FROM pg_indexes 
WHERE schemaname = 'public' AND tablename IN ('threads', 'messages', 'ask_doug_history');
```

**Expected output:** 5+ indexes

---

## 🔧 Step 2: Local Testing (COMPLETE)

✅ Already done:
- `npm install` — 136 packages
- `npm run build` — Production build success
- `npm run dev -p 3001` — Dev server starts
- `.env.local` — Supabase + OpenClaw configured

### Manual Test (Optional)

```bash
cd /Users/doug/Projects/rowly-conversation-hub-v2
npm run dev -p 3001
```

Then open: http://localhost:3001

---

## 📤 Step 3: GitHub Setup

### A. Create GitHub Repository (If not existing)

```bash
# If repo doesn't exist yet:
gh repo create rkirishima/rowly-conversation-hub-v2 \
  --public \
  --source=. \
  --remote=origin \
  --push
```

### B. Fix Remote URL (If needed)

```bash
cd /Users/doug/Projects/rowly-conversation-hub-v2
git remote set-url origin https://github.com/rkirishima/rowly-conversation-hub-v2.git
git push origin main
```

### C. Verify GitHub

Open: https://github.com/rkirishima/rowly-conversation-hub-v2

---

## 🚀 Step 4: Vercel Deployment

### A. Create Vercel Project

**Option 1: Via Vercel Dashboard (Recommended)**
1. Go to https://vercel.com/dashboard
2. Click **Add New** → **Project**
3. Select **Import Git Repository**
4. Choose: `rkirishima/rowly-conversation-hub-v2`
5. Click **Import**

**Option 2: Via CLI**
```bash
npm install -g vercel
vercel login
vercel
# Follow prompts
```

### B. Set Environment Variables

In Vercel Dashboard → **Settings** → **Environment Variables**, add:

| Key | Value | Scope |
|-----|-------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://irvmtabaomcfdbqwulbj.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...nUc` | Production, Preview, Development |
| `NEXT_PUBLIC_OPENCLAW_API_URL` | `http://localhost:8000` | Development only |
| `NEXT_PUBLIC_OPENCLAW_API_TOKEN` | `ef6dce0d...798395` | Development only |
| `NEXT_PUBLIC_APP_NAME` | `Rowly's Conversation Hub` | All |

⚠️ **Note:** For production, use your production OpenClaw URL instead of `localhost:8000`

### C. Trigger Deployment

**Option 1:** Push to `main` branch (automatic)
```bash
git push origin main
```

**Option 2:** Manual deploy in Vercel Dashboard
- Click **Deployments** → **Deploy** button

### D. Wait for Build

- Deployment takes 2–5 minutes
- Watch logs in Vercel Dashboard
- Once complete, you'll get a production URL

---

## ✅ Step 5: Production Verification

### A. Test Live URL

1. Open your Vercel URL (e.g., `https://rowly-hub.vercel.app`)
2. Should show login page in Japanese (**ログイン**)

### B. Test Signup/Login

1. Click **アカウント作成** (Create Account)
2. Enter email + password
3. Should redirect to dashboard after signup

### C. Test Thread Creation

1. Click **新規スレッド** (New Thread)
2. Enter thread name (e.g., "Felicity Cafe")
3. Click **作成** (Create)
4. Should appear in sidebar

### D. Test Ask Doug

1. In thread, scroll to bottom
2. Type a question (e.g., "What's the weather?")
3. Click **Ask Doug**
4. Should see response appear in message list

### E. Monitor Errors

- Check Vercel Dashboard → **Logs** for any errors
- Browser DevTools → **Console** for client errors
- Verify Supabase connection (no RLS violations)

---

## 🔍 Troubleshooting

### Login Page Shows But Can't Create Account

**Cause:** Supabase Auth not enabled  
**Fix:** Verify Supabase project is active + Auth enabled

### "RLS policy violation" Error

**Cause:** Missing or incorrect RLS policies  
**Fix:** Re-run SQL migration, verify all policies created

### "Supabase URL/Key missing"

**Cause:** Environment variables not set  
**Fix:** Check Vercel → Settings → Environment Variables

### Messages Not Saving

**Cause:** Database connection issue  
**Fix:** Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 📊 Deployment Checklist

```
Pre-Deployment
- [ ] Supabase tables created (threads, messages, ask_doug_history)
- [ ] RLS policies applied
- [ ] Indexes created
- [ ] GitHub repo exists & has commits
- [ ] .env.local configured locally
- [ ] npm run build succeeds
- [ ] npm run dev works on port 3001

Vercel Setup
- [ ] GitHub repo connected to Vercel
- [ ] Environment variables set in Vercel
- [ ] Deployment triggered (auto or manual)
- [ ] Build logs show no errors
- [ ] Deployment complete (status: success)

Live Testing
- [ ] Live URL accessible
- [ ] Login page loads in Japanese
- [ ] Signup/login works
- [ ] Thread creation works
- [ ] Ask Doug message saves & responds
- [ ] Real-time updates work (2-sec polling)
- [ ] No console errors in DevTools
- [ ] Mobile view responsive

Post-Deployment
- [ ] Monitor Vercel logs for 24 hours
- [ ] Test on mobile/tablet/desktop
- [ ] Verify Supabase backups enabled
- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Document production URL for team
```

---

## 📞 Support

**GitHub:** https://github.com/rkirishima/rowly-conversation-hub-v2

**Supabase Project:** https://supabase.com/dashboard/project/irvmtabaomcfdbqwulbj

**Vercel Project:** https://vercel.com/dashboard (search for `rowly-hub`)

---

## 🎯 Success Criteria

✅ **Deployment Complete When:**
1. Vercel URL is live and accessible
2. Login/signup works with Supabase Auth
3. Threads can be created and deleted
4. Ask Doug message sends and response appears
5. All UI is in Japanese ✓
6. Mobile is fully responsive
7. No errors in console or Vercel logs

---

**Built with ❤️ for Rowly**  
Rowly's Conversation Hub v2 | April 2026
