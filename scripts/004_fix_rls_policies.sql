-- Fix RLS policies to use the correct demo user ID (ending in 0001)
DROP POLICY IF EXISTS "Allow public read for demo user talks" ON talks;
DROP POLICY IF EXISTS "Allow public read for demo user submissions" ON conference_submissions;
DROP POLICY IF EXISTS "Allow public read for demo user profile" ON profiles;

-- Allow public read access for demo user data
CREATE POLICY "Allow public read for demo user talks" ON talks
  FOR SELECT USING (user_id = '00000000-0000-0000-0000-000000000001'::uuid);

CREATE POLICY "Allow public read for demo user submissions" ON conference_submissions
  FOR SELECT USING (user_id = '00000000-0000-0000-0000-000000000001'::uuid);

CREATE POLICY "Allow public read for demo user profile" ON profiles
  FOR SELECT USING (id = '00000000-0000-0000-0000-000000000001'::uuid);
