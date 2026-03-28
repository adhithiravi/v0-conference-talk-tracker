-- Add RLS policies to allow reading demo user data without authentication
-- This allows the app to display seeded data before auth is set up

-- Demo user ID
-- 00000000-0000-0000-0000-000000000000

-- Allow anyone to read the demo profile
CREATE POLICY "Allow reading demo profile" ON profiles
  FOR SELECT
  USING (id = '00000000-0000-0000-0000-000000000000'::uuid);

-- Allow anyone to read demo talks
CREATE POLICY "Allow reading demo talks" ON talks
  FOR SELECT
  USING (user_id = '00000000-0000-0000-0000-000000000000'::uuid);

-- Allow anyone to read demo submissions
CREATE POLICY "Allow reading demo submissions" ON conference_submissions
  FOR SELECT
  USING (user_id = '00000000-0000-0000-0000-000000000000'::uuid);
