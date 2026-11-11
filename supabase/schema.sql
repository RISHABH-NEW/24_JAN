-- LEVEL UP 73 Database Schema
-- Supabase PostgreSQL with Row Level Security (RLS)

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT DEFAULT 'Rishabh',
    avatar_url TEXT,
    current_xp INTEGER NOT NULL DEFAULT 0,
    current_level INTEGER NOT NULL DEFAULT 1,
    streak_count INTEGER NOT NULL DEFAULT 0,
    best_streak INTEGER NOT NULL DEFAULT 0,
    last_active_date DATE,
    exam_mode TEXT NOT NULL DEFAULT 'normal' CHECK (exam_mode IN ('normal', 'put', 'practical', 'end_sem')),
    challenge_start_date DATE NOT NULL DEFAULT '2026-11-11',
    challenge_end_date DATE NOT NULL DEFAULT '2027-01-23',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. User Settings Table
CREATE TABLE IF NOT EXISTS public.user_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    theme TEXT NOT NULL DEFAULT 'dark' CHECK (theme IN ('dark', 'light')),
    notification_enabled BOOLEAN NOT NULL DEFAULT true,
    daily_review_time TEXT NOT NULL DEFAULT '21:00',
    target_dsa_problems INTEGER NOT NULL DEFAULT 100,
    target_editing_projects INTEGER NOT NULL DEFAULT 8,
    target_web_projects INTEGER NOT NULL DEFAULT 3,
    daily_schedule JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_user_settings UNIQUE(user_id)
);

-- 3. Daily Logs Table
CREATE TABLE IF NOT EXISTS public.daily_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    academics_minutes INTEGER NOT NULL DEFAULT 0,
    dsa_minutes INTEGER NOT NULL DEFAULT 0,
    editing_minutes INTEGER NOT NULL DEFAULT 0,
    english_minutes INTEGER NOT NULL DEFAULT 0,
    gym_minutes INTEGER NOT NULL DEFAULT 0,
    web_minutes INTEGER NOT NULL DEFAULT 0,
    total_focused_minutes INTEGER NOT NULL DEFAULT 0,
    notes TEXT,
    review_completed BOOLEAN NOT NULL DEFAULT false,
    review_data JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_user_log_date UNIQUE(user_id, log_date)
);

-- 4. Daily Tasks Table
CREATE TABLE IF NOT EXISTS public.daily_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    task_date DATE NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('academics', 'dsa', 'editing', 'english', 'gym', 'web', 'other')),
    title TEXT NOT NULL,
    description TEXT,
    time_block TEXT,
    duration_minutes INTEGER NOT NULL DEFAULT 30,
    is_completed BOOLEAN NOT NULL DEFAULT false,
    completed_at TIMESTAMPTZ,
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    xp_awarded BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Academic Subjects
CREATE TABLE IF NOT EXISTS public.academic_subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    code TEXT,
    name TEXT NOT NULL,
    professor TEXT,
    credits INTEGER DEFAULT 3,
    color TEXT DEFAULT '#3987FF',
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    target_score NUMERIC(5,2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. Academic Exams
CREATE TABLE IF NOT EXISTS public.exams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES public.academic_subjects(id) ON DELETE CASCADE,
    exam_type TEXT NOT NULL CHECK (exam_type IN ('PUT', 'Practical', 'End-Sem')),
    exam_date DATE NOT NULL,
    time_slot TEXT,
    syllabus_coverage_percent INTEGER NOT NULL DEFAULT 0,
    marks_obtained NUMERIC(5,2),
    max_marks NUMERIC(5,2) DEFAULT 100,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'completed', 'graded')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. Academic Syllabus Topics
CREATE TABLE IF NOT EXISTS public.syllabus_topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id UUID NOT NULL REFERENCES public.academic_subjects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    unit_name TEXT,
    title TEXT NOT NULL,
    is_completed BOOLEAN NOT NULL DEFAULT false,
    importance TEXT NOT NULL DEFAULT 'medium' CHECK (importance IN ('low', 'medium', 'high', 'critical')),
    revision_count INTEGER NOT NULL DEFAULT 0,
    last_revised DATE,
    resource_url TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. Academic Study Sessions
CREATE TABLE IF NOT EXISTS public.study_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.academic_subjects(id) ON DELETE SET NULL,
    topic_id UUID REFERENCES public.syllabus_topics(id) ON DELETE SET NULL,
    session_date DATE NOT NULL DEFAULT CURRENT_DATE,
    duration_minutes INTEGER NOT NULL DEFAULT 45,
    notes TEXT,
    xp_awarded BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. DSA Solved Problems
CREATE TABLE IF NOT EXISTS public.dsa_problems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    problem_name TEXT NOT NULL,
    platform TEXT NOT NULL CHECK (platform IN ('LeetCode', 'GeeksforGeeks', 'CodeChef', 'Codeforces', 'HackerRank', 'Other')),
    topic TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    problem_url TEXT,
    solution_notes TEXT,
    time_complexity TEXT,
    space_complexity TEXT,
    date_solved DATE NOT NULL DEFAULT CURRENT_DATE,
    revision_status TEXT NOT NULL DEFAULT 'needs_revision' CHECK (revision_status IN ('mastered', 'revising', 'needs_revision')),
    next_revision_date DATE,
    xp_awarded BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_user_problem UNIQUE(user_id, problem_name, platform)
);

-- 10. Video Editing Projects
CREATE TABLE IF NOT EXISTS public.editing_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    project_name TEXT NOT NULL,
    project_type TEXT NOT NULL,
    software_used TEXT NOT NULL,
    techniques_learned TEXT[] DEFAULT '{}',
    time_spent_minutes INTEGER NOT NULL DEFAULT 0,
    completion_status TEXT NOT NULL DEFAULT 'in_progress' CHECK (completion_status IN ('planned', 'in_progress', 'completed')),
    portfolio_link TEXT,
    thumbnail_url TEXT,
    notes TEXT,
    completion_date DATE,
    xp_awarded BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 11. English Practice Sessions
CREATE TABLE IF NOT EXISTS public.english_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    session_date DATE NOT NULL DEFAULT CURRENT_DATE,
    practice_type TEXT NOT NULL CHECK (practice_type IN ('Speaking Challenge', 'Vocabulary', 'Grammar', 'Pronunciation', 'Listening', 'Daily Journal')),
    speaking_minutes INTEGER NOT NULL DEFAULT 0,
    topic TEXT,
    recording_url TEXT,
    journal_entry TEXT,
    notes TEXT,
    confidence_score INTEGER NOT NULL DEFAULT 5 CHECK (confidence_score BETWEEN 1 AND 10),
    xp_awarded BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 12. English Vocabulary
CREATE TABLE IF NOT EXISTS public.vocabulary (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    word TEXT NOT NULL,
    part_of_speech TEXT,
    definition TEXT NOT NULL,
    example_sentence TEXT,
    pronunciation TEXT,
    learned_date DATE NOT NULL DEFAULT CURRENT_DATE,
    mastery_level INTEGER NOT NULL DEFAULT 1 CHECK (mastery_level BETWEEN 1 AND 5),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_user_word UNIQUE(user_id, word)
);

-- 13. Gym Workouts
CREATE TABLE IF NOT EXISTS public.gym_workouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    workout_date DATE NOT NULL DEFAULT CURRENT_DATE,
    workout_name TEXT NOT NULL,
    is_rest_day BOOLEAN NOT NULL DEFAULT false,
    duration_minutes INTEGER NOT NULL DEFAULT 60,
    notes TEXT,
    exercises JSONB DEFAULT '[]'::jsonb,
    xp_awarded BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 14. Gym Body Metrics
CREATE TABLE IF NOT EXISTS public.body_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    recorded_date DATE NOT NULL DEFAULT CURRENT_DATE,
    weight_kg NUMERIC(5,2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_user_metric_date UNIQUE(user_id, recorded_date)
);

-- 15. Web Development Projects
CREATE TABLE IF NOT EXISTS public.web_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    milestone_number INTEGER NOT NULL CHECK (milestone_number IN (1, 2, 3)),
    title TEXT NOT NULL,
    description TEXT,
    tech_stack TEXT[] DEFAULT '{}',
    github_url TEXT,
    live_url TEXT,
    screenshot_url TEXT,
    status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('planned', 'in_progress', 'completed')),
    completed_date DATE,
    xp_awarded BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 16. Web Topics Roadmap
CREATE TABLE IF NOT EXISTS public.web_topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    topic_name TEXT NOT NULL,
    category TEXT NOT NULL,
    is_completed BOOLEAN NOT NULL DEFAULT false,
    notes TEXT,
    completed_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_user_web_topic UNIQUE(user_id, topic_name)
);

-- 17. Achievements Definitions
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    category TEXT NOT NULL,
    xp_reward INTEGER NOT NULL DEFAULT 50,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 18. User Achievements
CREATE TABLE IF NOT EXISTS public.user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_user_achievement UNIQUE(user_id, achievement_id)
);

-- 19. XP Transactions
CREATE TABLE IF NOT EXISTS public.xp_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    activity_type TEXT NOT NULL,
    activity_id TEXT,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.syllabus_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dsa_problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.editing_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.english_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gym_workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.body_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.web_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.web_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_transactions ENABLE ROW LEVEL SECURITY;

-- Achievements are readable by all authenticated users
CREATE POLICY "Achievements are viewable by everyone" ON public.achievements FOR SELECT USING (true);

-- User-owned tables policies (SELECT, INSERT, UPDATE, DELETE for auth.uid() = user_id or id)
CREATE POLICY "Users can manage own profile" ON public.profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users can manage own settings" ON public.user_settings FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own logs" ON public.daily_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own tasks" ON public.daily_tasks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own subjects" ON public.academic_subjects FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own exams" ON public.exams FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own syllabus" ON public.syllabus_topics FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own study sessions" ON public.study_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own dsa" ON public.dsa_problems FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own editing projects" ON public.editing_projects FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own english sessions" ON public.english_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own vocabulary" ON public.vocabulary FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own workouts" ON public.gym_workouts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own body metrics" ON public.body_metrics FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own web projects" ON public.web_projects FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own web topics" ON public.web_topics FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own achievements" ON public.user_achievements FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own xp transactions" ON public.xp_transactions FOR ALL USING (auth.uid() = user_id);

-- Profile creation trigger on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'full_name', 'Rishabh'));

  INSERT INTO public.user_settings (user_id)
  VALUES (new.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Initial achievements seeds
INSERT INTO public.achievements (code, title, description, icon, category, xp_reward) VALUES
('FIRST_PROBLEM', 'First Byte', 'Solve your first DSA problem', 'Code2', 'dsa', 50),
('DSA_STREAK_10', 'Algorithm Novice', 'Solve 10 DSA problems', 'Cpu', 'dsa', 100),
('DSA_HALF_CENTURY', 'Problem Crusher', 'Solve 50 DSA problems', 'Zap', 'dsa', 250),
('DSA_CENTURY', 'Algorithm Master', 'Achieve 100 solved DSA problems target', 'Crown', 'dsa', 500),
('FIRST_EDIT', 'Action!', 'Log your first completed video editing project', 'Film', 'editing', 50),
('EDIT_DIRECTOR', 'Cinematic Vision', 'Complete all 8 video editing projects', 'Award', 'editing', 500),
('FIRST_SPEAK', 'Voice Unleashed', 'Complete your first English speaking session', 'Mic', 'english', 50),
('VOCAB_EXPLORER', 'Lexicon Builder', 'Add 25 words to your vocabulary', 'BookOpen', 'english', 100),
('FIRST_LIFT', 'Iron Initiate', 'Log your first workout in the gym', 'Dumbbell', 'gym', 50),
('GYM_WARRIOR', 'Iron Discipline', 'Log 20 workout sessions', 'Trophy', 'gym', 200),
('FIRST_SITE', 'Hello World', 'Complete Milestone 1: Personal Portfolio', 'Globe', 'web', 100),
('WEB_TRILOGY', 'Full Stack Prodigy', 'Complete all 3 web development project milestones', 'Sparkles', 'web', 500),
('STREAK_7', 'Weekly Dominance', 'Maintain a 7-day productivity streak', 'Flame', 'streak', 150),
('STREAK_30', 'Unstoppable Habit', 'Maintain a 30-day streak', 'Flame', 'streak', 500),
('EXAM_READY', 'Scholar Supreme', 'Achieve 90%+ syllabus completion in any subject', 'GraduationCap', 'academics', 200)
ON CONFLICT (code) DO NOTHING;

