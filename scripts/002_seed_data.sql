-- Seed data for conference talk tracker
-- This script inserts talks and conference submissions
-- It temporarily disables RLS and foreign key checks for seeding

-- Disable RLS temporarily for seeding
ALTER TABLE talks DISABLE ROW LEVEL SECURITY;
ALTER TABLE conference_submissions DISABLE ROW LEVEL SECURITY;

-- Drop the foreign key constraints temporarily
ALTER TABLE talks DROP CONSTRAINT IF EXISTS talks_user_id_fkey;
ALTER TABLE conference_submissions DROP CONSTRAINT IF EXISTS conference_submissions_user_id_fkey;
ALTER TABLE conference_submissions DROP CONSTRAINT IF EXISTS conference_submissions_talk_id_fkey;

DO $$
DECLARE
  demo_user_id UUID := '00000000-0000-0000-0000-000000000001';
  talk_1_id UUID;
  talk_2_id UUID;
  talk_3_id UUID;
  talk_4_id UUID;
  talk_5_id UUID;
  talk_6_id UUID;
  talk_7_id UUID;
  talk_8_id UUID;
  talk_9_id UUID;
BEGIN

-- Insert talks and capture their IDs
INSERT INTO talks (user_id, title, abstract, tags)
VALUES (
  demo_user_id,
  'Stop Writing Everything by Hand: Practical AI for Developers',
  'AI tools are rapidly changing how developers build software. Tasks that once required writing every line of code; from scaffolding applications to generating tests and documentation, can now be accelerated with AI-assisted development tools. While these capabilities offer significant productivity gains, many developers are still unsure how to integrate AI into their daily workflow in a practical and responsible way without compromising code quality or engineering standards.

In this session, we will explore real-world techniques for incorporating AI into common development tasks. Through practical demonstrations, we will walk through how AI can assist developers in generating UI wireframes, scaffolding applications, creating components, refactoring code, generating tests, and supporting code reviews. The talk highlights how AI can support developers throughout the software development lifecycle while still maintaining strong engineering practices and thoughtful review processes.

Attendees will walk away with practical strategies for incorporating AI into their development process; helping them move faster without sacrificing code quality, maintainability, or developer judgment.',
  ARRAY['AI', 'Developer Tools', 'Productivity']
)
RETURNING id INTO talk_1_id;

INSERT INTO talks (user_id, title, abstract, tags)
VALUES (
  demo_user_id,
  'AI Wrote the Code - Is It Secure?',
  'AI-assisted development tools can generate code, tests, and even architectural patterns in seconds, dramatically accelerating how software is built. However, this speed also introduces new security challenges that many teams are not yet prepared to address. AI-generated code can include insecure patterns, outdated dependencies, improper authentication logic, or subtle vulnerabilities that may go unnoticed during rapid development cycles. As organizations increasingly rely on AI-assisted coding, ensuring that AI-generated software remains secure becomes a critical responsibility for developers and engineering teams.

In this session, we explore the security implications of AI-assisted development and the risks that emerge when developers rely too heavily on AI-generated code. Through practical examples, we will examine common vulnerabilities introduced by AI tools and demonstrate how insecure patterns can unintentionally make their way into production systems. The session will also walk through practical techniques for reviewing and validating AI-generated code, including dependency and supply chain checks, secret management, and integrating security scanning into CI/CD workflows.

By the end of this talk, attendees will gain a clearer understanding of how to balance the productivity benefits of AI-assisted development with the security practices required for modern applications. Developers will leave with practical strategies for reviewing AI-generated code, identifying potential vulnerabilities early, and implementing guardrails that allow teams to safely integrate AI into their development workflow without compromising application security.',
  ARRAY['AI', 'Security', 'Code Review']
)
RETURNING id INTO talk_2_id;

INSERT INTO talks (user_id, title, abstract, tags)
VALUES (
  demo_user_id,
  'The Hardest Part of Building Software Is Still Human',
  '',
  ARRAY['Soft Skills', 'Team Dynamics']
)
RETURNING id INTO talk_3_id;

INSERT INTO talks (user_id, title, abstract, tags)
VALUES (
  demo_user_id,
  'AI Can Write Code. Now What Makes an Engineer Valuable?',
  '',
  ARRAY['AI', 'Career', 'Engineering']
)
RETURNING id INTO talk_4_id;

INSERT INTO talks (user_id, title, abstract, tags)
VALUES (
  demo_user_id,
  'The Most Valuable Thing I Do Isn''t Writing Code',
  '',
  ARRAY['Career', 'Leadership']
)
RETURNING id INTO talk_5_id;

INSERT INTO talks (user_id, title, abstract, tags)
VALUES (
  demo_user_id,
  'From Scaffold to Scale: Building an AI-Powered React Native Framework with NX',
  '',
  ARRAY['React Native', 'NX', 'AI', 'Framework']
)
RETURNING id INTO talk_6_id;

INSERT INTO talks (user_id, title, abstract, tags)
VALUES (
  demo_user_id,
  'AI Across the SDLC: A Hands-On Workshop for Modern Software Development',
  '',
  ARRAY['AI', 'SDLC', 'Workshop']
)
RETURNING id INTO talk_7_id;

INSERT INTO talks (user_id, title, abstract, tags)
VALUES (
  demo_user_id,
  'From Prompt to Production: Lessons from Building an AI-Driven Design-to-Code Pipeline with Figma',
  '',
  ARRAY['AI', 'Figma', 'Design', 'Pipeline']
)
RETURNING id INTO talk_8_id;

INSERT INTO talks (user_id, title, abstract, tags)
VALUES (
  demo_user_id,
  'Thriving Beyond Code: Adaptability, Growth, and the Entrepreneurial Mindset in Tech',
  '',
  ARRAY['Career', 'Entrepreneurship', 'Growth']
)
RETURNING id INTO talk_9_id;

-- Insert conference submissions

-- All Things Open 2026 submissions
INSERT INTO conference_submissions (user_id, conference_name, location, date, talk_id, status, notes)
VALUES 
  (demo_user_id, 'All Things Open 2026', 'Raleigh, NC', '2026-10-01', talk_1_id, 'submitted', ''),
  (demo_user_id, 'All Things Open 2026', 'Raleigh, NC', '2026-10-01', talk_2_id, 'submitted', ''),
  (demo_user_id, 'All Things Open 2026', 'Raleigh, NC', '2026-10-01', talk_3_id, 'submitted', ''),
  (demo_user_id, 'All Things Open 2026', 'Raleigh, NC', '2026-10-01', talk_4_id, 'submitted', ''),
  (demo_user_id, 'All Things Open 2026', 'Raleigh, NC', '2026-10-01', talk_5_id, 'submitted', '');

-- KCDC 2026 submissions
INSERT INTO conference_submissions (user_id, conference_name, location, date, talk_id, status, notes)
VALUES 
  (demo_user_id, 'KCDC 2026', 'Kansas City', '2026-06-01', talk_6_id, 'submitted', ''),
  (demo_user_id, 'KCDC 2026', 'Kansas City', '2026-06-01', talk_7_id, 'submitted', ''),
  (demo_user_id, 'KCDC 2026', 'Kansas City', '2026-06-01', talk_8_id, 'submitted', ''),
  (demo_user_id, 'KCDC 2026', 'Kansas City', '2026-06-01', talk_4_id, 'submitted', ''),
  (demo_user_id, 'KCDC 2026', 'Kansas City', '2026-06-01', talk_9_id, 'submitted', ''),
  (demo_user_id, 'KCDC 2026', 'Kansas City', '2026-06-01', talk_2_id, 'submitted', '');

-- CodeStock 2026 submission (Accepted!)
INSERT INTO conference_submissions (user_id, conference_name, location, date, talk_id, status, notes)
VALUES 
  (demo_user_id, 'CodeStock 2026', 'Knoxville, TN', '2026-04-01', talk_9_id, 'accepted', '');

END $$;

-- Re-enable RLS
ALTER TABLE talks ENABLE ROW LEVEL SECURITY;
ALTER TABLE conference_submissions ENABLE ROW LEVEL SECURITY;

-- Note: Foreign key constraints are removed for demo purposes.
-- When you add authentication, you can reassign these records to your real user ID.
