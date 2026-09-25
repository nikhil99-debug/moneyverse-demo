-- MoneyMania Database Schema for Supabase
-- Run this in your Supabase SQL Editor to create all tables

-- Users (synced with Clerk)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id TEXT UNIQUE NOT NULL,
  display_name TEXT,
  email TEXT,
  avatar_url TEXT,
  university TEXT,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  streak_count INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_active_date DATE,
  streak_freeze_available INTEGER DEFAULT 1,
  is_pro BOOLEAN DEFAULT FALSE,
  pro_plan TEXT, -- 'monthly' | 'yearly' | 'bundle' | 'campus'
  pro_expires_at TIMESTAMPTZ,
  referral_code TEXT UNIQUE,
  referred_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chapter Progress
CREATE TABLE chapter_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  character_slug TEXT NOT NULL,
  chapter_number INTEGER NOT NULL,
  sections_completed JSONB DEFAULT '[]',
  quiz_score INTEGER,
  quiz_attempts INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, character_slug, chapter_number)
);

-- Quiz Attempts (for analytics + leaderboard)
CREATE TABLE quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  character_slug TEXT NOT NULL,
  chapter_number INTEGER NOT NULL,
  score INTEGER NOT NULL,
  answers JSONB NOT NULL,
  xp_earned INTEGER NOT NULL,
  attempted_at TIMESTAMPTZ DEFAULT NOW()
);

-- XP Transactions (audit log)
CREATE TABLE xp_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  reason TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily Activity (for streaks)
CREATE TABLE daily_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  activity_date DATE NOT NULL,
  actions JSONB DEFAULT '[]',
  UNIQUE(user_id, activity_date)
);

-- Friendships
CREATE TABLE friendships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  friend_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, friend_id)
);

-- Badges
CREATE TABLE user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  badge_slug TEXT NOT NULL,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, badge_slug)
);

-- Payments
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  amount INTEGER NOT NULL, -- in paise
  plan TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_users_clerk_id ON users(clerk_id);
CREATE INDEX idx_chapter_progress_user ON chapter_progress(user_id);
CREATE INDEX idx_quiz_attempts_user ON quiz_attempts(user_id);
CREATE INDEX idx_xp_transactions_user ON xp_transactions(user_id);
CREATE INDEX idx_daily_activity_user_date ON daily_activity(user_id, activity_date);
CREATE INDEX idx_users_xp ON users(xp DESC);

-- Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapter_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;

-- RLS Policies: users can read/write their own data
-- Service role key bypasses RLS for webhooks and admin operations

CREATE POLICY "Users can read own data" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid()::text = clerk_id);

CREATE POLICY "Users can read own progress" ON chapter_progress FOR SELECT USING (true);
CREATE POLICY "Users can insert own progress" ON chapter_progress FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own progress" ON chapter_progress FOR UPDATE USING (true);

CREATE POLICY "Users can read own quiz attempts" ON quiz_attempts FOR SELECT USING (true);
CREATE POLICY "Users can insert quiz attempts" ON quiz_attempts FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can read own xp" ON xp_transactions FOR SELECT USING (true);
CREATE POLICY "Users can insert xp" ON xp_transactions FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can read own activity" ON daily_activity FOR SELECT USING (true);
CREATE POLICY "Users can insert activity" ON daily_activity FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update activity" ON daily_activity FOR UPDATE USING (true);

CREATE POLICY "Users can read own badges" ON user_badges FOR SELECT USING (true);
CREATE POLICY "Users can insert badges" ON user_badges FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can read own payments" ON payments FOR SELECT USING (true);

CREATE POLICY "Users can read friendships" ON friendships FOR SELECT USING (true);
CREATE POLICY "Users can insert friendships" ON friendships FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update friendships" ON friendships FOR UPDATE USING (true);
