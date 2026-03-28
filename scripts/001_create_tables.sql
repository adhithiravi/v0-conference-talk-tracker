-- Create profiles table for speaker information
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  title TEXT,
  bio TEXT,
  email TEXT,
  twitter TEXT,
  linkedin TEXT,
  website TEXT,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create talks table
CREATE TABLE IF NOT EXISTS talks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  abstract TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create conference_submissions table
CREATE TABLE IF NOT EXISTS conference_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  talk_id UUID NOT NULL REFERENCES talks(id) ON DELETE CASCADE,
  conference_name TEXT NOT NULL,
  location TEXT,
  date DATE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('submitted', 'accepted', 'rejected', 'pending')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE talks ENABLE ROW LEVEL SECURITY;
ALTER TABLE conference_submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own profile" ON profiles FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for talks
CREATE POLICY "Users can view their own talks" ON talks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own talks" ON talks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own talks" ON talks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own talks" ON talks FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for conference_submissions
CREATE POLICY "Users can view their own submissions" ON conference_submissions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own submissions" ON conference_submissions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own submissions" ON conference_submissions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own submissions" ON conference_submissions FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_talks_user_id ON talks(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON conference_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_talk_id ON conference_submissions(talk_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON conference_submissions(status);
