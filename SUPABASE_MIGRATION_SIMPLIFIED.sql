-- ============================================
-- Rowly's Conversation Hub v2 
-- Simplified Database Migration
-- ============================================
-- Execute this in Supabase Dashboard → SQL Editor
-- Project: https://irvmtabaomcfdbqwulbj.supabase.co

-- Create threads table
CREATE TABLE IF NOT EXISTS threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  sender VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create ask_doug_history table
CREATE TABLE IF NOT EXISTS ask_doug_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  question TEXT NOT NULL,
  response TEXT,
  response_status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  response_at TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_threads_user_id ON threads(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_thread_id ON messages(thread_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_ask_doug_thread_id ON ask_doug_history(thread_id);
CREATE INDEX IF NOT EXISTS idx_ask_doug_user_id ON ask_doug_history(user_id);

-- Enable RLS (Row Level Security)
ALTER TABLE threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ask_doug_history ENABLE ROW LEVEL SECURITY;

-- ============================================
-- SIMPLIFIED RLS Policies - Permissive First
-- ============================================

-- === THREADS ===
-- Users can view all threads (simplified for now)
DROP POLICY IF EXISTS "Users can view their own threads" ON threads;
CREATE POLICY "view_threads"
ON threads FOR SELECT WITH CHECK (true);

-- Users can create threads
DROP POLICY IF EXISTS "Users can create threads" ON threads;
CREATE POLICY "create_threads"
ON threads FOR INSERT WITH CHECK (true);

-- Users can update threads
DROP POLICY IF EXISTS "Users can update their own threads" ON threads;
CREATE POLICY "update_threads"
ON threads FOR UPDATE WITH CHECK (true);

-- Users can delete threads
DROP POLICY IF EXISTS "Users can delete their own threads" ON threads;
CREATE POLICY "delete_threads"
ON threads FOR DELETE WITH CHECK (true);

-- === MESSAGES ===
-- Users can view all messages
DROP POLICY IF EXISTS "Users can view messages in their threads" ON messages;
CREATE POLICY "view_messages"
ON messages FOR SELECT WITH CHECK (true);

-- Users can create messages
DROP POLICY IF EXISTS "Users can create messages in their threads" ON messages;
CREATE POLICY "create_messages"
ON messages FOR INSERT WITH CHECK (true);

-- === ASK_DOUG_HISTORY ===
-- Users can view all ask_doug records
DROP POLICY IF EXISTS "Users can view their own ask_doug_history" ON ask_doug_history;
CREATE POLICY "view_ask_doug_history"
ON ask_doug_history FOR SELECT WITH CHECK (true);

-- Users can create ask_doug records
DROP POLICY IF EXISTS "Users can create ask_doug_history records" ON ask_doug_history;
CREATE POLICY "create_ask_doug_history"
ON ask_doug_history FOR INSERT WITH CHECK (true);

-- ============================================
-- Verification Queries
-- ============================================
-- Run these to verify tables are created:
-- SELECT * FROM information_schema.tables WHERE table_schema = 'public';
-- SELECT * FROM pg_policies;
