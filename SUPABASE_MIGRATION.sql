-- ============================================
-- Rowly's Conversation Hub v2 Database Migration
-- ============================================
-- Execute this in Supabase Dashboard → SQL Editor
-- Project: https://irvmtabaomcfdbqwulbj.supabase.co

-- Create threads table
CREATE TABLE threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  sender VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create ask_doug_history table (optional, for tracking Doug's responses)
CREATE TABLE ask_doug_history (
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
CREATE INDEX idx_threads_user_id ON threads(user_id);
CREATE INDEX idx_messages_thread_id ON messages(thread_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_ask_doug_thread_id ON ask_doug_history(thread_id);
CREATE INDEX idx_ask_doug_user_id ON ask_doug_history(user_id);

-- Enable RLS (Row Level Security)
ALTER TABLE threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ask_doug_history ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS Policies for threads
-- ============================================

-- Users can view their own threads
CREATE POLICY "Users can view their own threads"
ON threads FOR SELECT USING (auth.uid() = user_id);

-- Users can create threads
CREATE POLICY "Users can create threads"
ON threads FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own threads
CREATE POLICY "Users can update their own threads"
ON threads FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own threads
CREATE POLICY "Users can delete their own threads"
ON threads FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- RLS Policies for messages
-- ============================================

-- Users can view messages in their threads
CREATE POLICY "Users can view messages in their threads"
ON messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM threads WHERE threads.id = messages.thread_id AND threads.user_id = auth.uid()
  )
);

-- Users can create messages in their threads
CREATE POLICY "Users can create messages in their threads"
ON messages FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM threads WHERE threads.id = messages.thread_id AND threads.user_id = auth.uid()
  ) AND auth.uid() = user_id
);

-- ============================================
-- RLS Policies for ask_doug_history
-- ============================================

-- Users can view their own ask_doug_history
CREATE POLICY "Users can view their own ask_doug_history"
ON ask_doug_history FOR SELECT USING (auth.uid() = user_id);

-- Users can create ask_doug_history records
CREATE POLICY "Users can create ask_doug_history records"
ON ask_doug_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- Enable Realtime Subscriptions (Optional)
-- ============================================
-- Uncomment to enable realtime updates in the UI
-- ALTER PUBLICATION supabase_realtime ADD TABLE threads;
-- ALTER PUBLICATION supabase_realtime ADD TABLE messages;
-- ALTER PUBLICATION supabase_realtime ADD TABLE ask_doug_history;

-- ============================================
-- Verification Queries
-- ============================================
-- Run these to verify tables are created:
-- SELECT * FROM information_schema.tables WHERE table_schema = 'public';
-- SELECT * FROM information_schema.table_constraints WHERE table_schema = 'public';
