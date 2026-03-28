-- Complete RLS fix: Add policies for ALL tables including profiles
-- And ensure demo user profile exists

-- First, create the demo user profile if it doesn't exist
INSERT INTO profiles (id, name, title, bio, email)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Demo Speaker',
  'Conference Speaker',
  'Demo profile for testing',
  'demo@example.com'
)
ON CONFLICT (id) DO NOTHING;

-- Drop all existing demo policies
DROP POLICY IF EXISTS "Allow public read for demo user talks" ON talks;
DROP POLICY IF EXISTS "Allow public read for demo user submissions" ON conference_submissions;
DROP POLICY IF EXISTS "Allow public read for demo user profile" ON profiles;

-- Create new public read policies for demo user on ALL tables
CREATE POLICY "Allow public read for demo user profile" ON profiles
  FOR SELECT USING (id = '00000000-0000-0000-0000-000000000001'::uuid);

CREATE POLICY "Allow public read for demo user talks" ON talks
  FOR SELECT USING (user_id = '00000000-0000-0000-0000-000000000001'::uuid);

CREATE POLICY "Allow public read for demo user submissions" ON conference_submissions
  FOR SELECT USING (user_id = '00000000-0000-0000-0000-000000000001'::uuid);
