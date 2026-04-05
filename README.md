# 🌊 Rowly's Conversation Hub v2

A modern messaging app built with Next.js 14, React 18, and Supabase. Features a Shonan/海 (ocean) themed UI with thread-based conversations and OpenClaw API integration.

## Features

✨ **Core Features**
- 🔐 Supabase Authentication (Email + Password)
- 💬 Thread-based conversation management
- 📨 Ask Doug - Send questions and get responses from OpenClaw API
- 🔄 Real-time message polling (2-second intervals)
- 📱 Fully responsive design
- 🌊 Shonan coastal color palette
- 🇯🇵 Japanese UI

## Tech Stack

- **Frontend**: Next.js 14 (Pages Router), React 18, TypeScript
- **Styling**: Tailwind CSS with custom Shonan color palette
- **Database**: Supabase (PostgreSQL)
- **Backend**: Next.js API routes
- **API Integration**: OpenClaw (optional)

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier works)

### 2. Clone & Install

```bash
cd /Users/doug/Projects/rowly-conversation-hub-v2
npm install
```

### 3. Configure Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Create the database schema:

```sql
-- Create threads table
CREATE TABLE threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users,
  sender VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_threads_user_id ON threads(user_id);
CREATE INDEX idx_messages_thread_id ON messages(thread_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

-- Enable RLS (Row Level Security)
ALTER TABLE threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- RLS policies for threads
CREATE POLICY "Users can view their own threads"
ON threads FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create threads"
ON threads FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own threads"
ON threads FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own threads"
ON threads FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for messages
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

3. Get your Supabase credentials:
   - Go to Settings → API
   - Copy `Project URL` and `anon public` key

### 4. Environment Setup

Create `.env.local` file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Optional: OpenClaw API
NEXT_PUBLIC_OPENCLAW_API_URL=http://localhost:3000/api/ask-doug
NEXT_PUBLIC_OPENCLAW_API_KEY=your-api-key

NEXT_PUBLIC_APP_NAME=Rowly's Conversation Hub
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Sign Up**: Create a new account with your email
2. **Create Thread**: Click "新規スレッド" (New Thread) button
3. **Ask Doug**: Type your question in the "Ask Doug" input box and hit the button
4. **View Messages**: See the conversation history in real-time (updates every 2 seconds)
5. **Manage**: Delete threads by hovering over them in the sidebar

## Pages

| Route | Purpose |
|-------|---------|
| `/login` | Email/password authentication |
| `/dashboard` | View all threads and create new ones |
| `/threads/[id]` | View thread messages and ask questions |
| `/settings` | User account settings and logout |

## API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/ask-doug` | POST | Send question to OpenClaw and save responses |

## Customization

### Colors (Shonan Palette)

Edit `tailwind.config.ts`:

```ts
colors: {
  'shonan': {
    'navy': '#001f3f',      // 深紺
    'teal': '#0db4d4',      // 青緑
    'sky': '#1da3d8',       // 空色
    'white': '#f8f9fa',     // 白
    'sand': '#e8dcc8',      // 砂色
    'dark': '#1a2332',      // 濃い灰
  },
}
```

### OpenClaw Integration

The `/api/ask-doug` endpoint integrates with OpenClaw. Currently, it returns a demo response. To enable real integration:

1. Configure `NEXT_PUBLIC_OPENCLAW_API_URL` in `.env.local`
2. Set up proper authentication with OpenClaw API key
3. The endpoint will automatically forward questions to OpenClaw

## Troubleshooting

### Supabase Connection Error
- Check your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Verify the project is active in Supabase dashboard

### Authentication Issues
- Ensure RLS policies are correctly applied
- Check browser console for detailed error messages
- Confirm email verification is enabled (optional in Supabase settings)

### Real-time Updates Not Working
- Polling runs every 2 seconds by default
- Check network tab in browser devtools
- Verify database tables have correct structure

## Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel login
vercel
```

Follow the prompts and set environment variables in Vercel dashboard.

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Development

- **Styling**: Tailwind CSS classes directly in components
- **Database**: Edit `lib/supabase.ts` for query helpers
- **Components**: Located in `components/` directory
- **Pages**: Located in `pages/` directory

## License

MIT - Feel free to use for personal and commercial projects

---

Built with ❤️ for Rowly | 2025
# rowly-conversation-hub-v2
