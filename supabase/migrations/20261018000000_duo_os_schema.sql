-- ==============================================================================
-- DUO OS — Comprehensive PostgreSQL Schema & Row Level Security (RLS)
-- Shared productivity, study, exam prep & career platform for two BTech students
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    student_persona TEXT NOT NULL CHECK (student_persona IN ('user_a', 'user_b')),
    degree_program TEXT NOT NULL,
    year_of_study INTEGER NOT NULL,
    college_name TEXT,
    avatar_url TEXT,
    fixed_commitments JSONB DEFAULT '{
        "gym_enabled": true,
        "gym_time": "05:30",
        "gym_duration_minutes": 60,
        "college_days_per_week": 6,
        "college_start_time": "08:00",
        "college_end_time": "17:30",
        "tuition_teaching_enabled": false,
        "tuition_start_time": "17:30",
        "tuition_end_time": "20:00",
        "sleep_target_hours": 7.5,
        "protected_sleep_start": "23:00"
    }'::jsonb,
    theme_preference JSONB DEFAULT '{
        "mode": "dark",
        "accent": "violet",
        "reduced_motion": false
    }'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. SHARED WORKSPACES
CREATE TABLE IF NOT EXISTS public.shared_workspaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL DEFAULT 'DUO Workspace',
    invite_code TEXT UNIQUE NOT NULL,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. WORKSPACE MEMBERS
CREATE TABLE IF NOT EXISTS public.workspace_members (
    workspace_id UUID NOT NULL REFERENCES public.shared_workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'partner' CHECK (role IN ('owner', 'partner')),
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (workspace_id, user_id)
);

-- 4. TASKS
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES public.shared_workspaces(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('academics', 'dsa', 'cat', 'gate', 'career', 'tuition', 'fitness', 'personal')),
    status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'completed', 'skipped')),
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('urgent', 'high', 'medium', 'low')),
    due_date DATE,
    estimated_minutes INTEGER DEFAULT 45,
    actual_minutes INTEGER DEFAULT 0,
    is_locked BOOLEAN NOT NULL DEFAULT FALSE,
    is_private BOOLEAN NOT NULL DEFAULT FALSE,
    subject_id UUID,
    scheduled_start TIME,
    scheduled_end TIME,
    scheduled_date DATE,
    order_index INTEGER DEFAULT 0,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. RECURRING EVENTS & TIMETABLE ENTRIES
CREATE TABLE IF NOT EXISTS public.recurring_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    event_type TEXT NOT NULL CHECK (event_type IN ('college', 'gym', 'tuition', 'sleep', 'meal', 'travel')),
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    location TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.timetable_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    subject_code TEXT,
    subject_name TEXT NOT NULL,
    faculty TEXT,
    room TEXT,
    is_lab BOOLEAN NOT NULL DEFAULT FALSE,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. SUBJECTS & SYLLABUS TOPICS
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    code TEXT,
    title TEXT NOT NULL,
    credits INTEGER DEFAULT 3,
    professor TEXT,
    color_code TEXT DEFAULT '#8B5CF6',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.syllabus_topics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    unit_number INTEGER DEFAULT 1,
    title TEXT NOT NULL,
    difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    revision_count INTEGER NOT NULL DEFAULT 0,
    last_revised_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. EXAMS & MOCK TRACKERS
CREATE TABLE IF NOT EXISTS public.exams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    exam_type TEXT NOT NULL CHECK (exam_type IN ('CAT_2026', 'GATE_CS', 'GATE_DA', 'CAT_2027', 'SEMESTER_FINALS')),
    exam_date DATE NOT NULL,
    target_score NUMERIC,
    target_percentile NUMERIC,
    notes TEXT,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.mock_tests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id UUID REFERENCES public.exams(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    test_series TEXT,
    date_taken DATE NOT NULL,
    section_breakdown JSONB DEFAULT '{"qa": 0, "varc": 0, "dilr": 0}'::jsonb,
    total_score NUMERIC NOT NULL,
    percentile NUMERIC,
    accuracy_percent NUMERIC,
    weak_topics TEXT[],
    time_spent_minutes INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. FOCUS SESSIONS
CREATE TABLE IF NOT EXISTS public.focus_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES public.shared_workspaces(id) ON DELETE SET NULL,
    task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
    subject_name TEXT,
    duration_minutes INTEGER NOT NULL,
    mode TEXT NOT NULL CHECK (mode IN ('pomodoro_25', 'deep_50', 'custom')),
    ambient_sound TEXT DEFAULT 'rain',
    shared_with_partner BOOLEAN NOT NULL DEFAULT TRUE,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. MOOD & ENERGY UPDATES
CREATE TABLE IF NOT EXISTS public.mood_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES public.shared_workspaces(id) ON DELETE CASCADE,
    mood TEXT NOT NULL CHECK (mood IN ('happy', 'focused', 'motivated', 'tired', 'stressed', 'low', 'need_break')),
    energy_level INTEGER NOT NULL CHECK (energy_level BETWEEN 1 AND 5),
    message TEXT,
    is_private BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. REAL-TIME ACTIVITY EVENTS
CREATE TABLE IF NOT EXISTS public.activity_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES public.shared_workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    event_type TEXT NOT NULL,
    summary TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. JOB OPPORTUNITIES & APPLICATIONS
CREATE TABLE IF NOT EXISTS public.job_opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name TEXT NOT NULL,
    job_title TEXT NOT NULL,
    role_category TEXT NOT NULL CHECK (role_category IN ('software_dev', 'data_science', 'ai_ml', 'data_analyst', 'cybersecurity', 'general_fresher')),
    target_persona TEXT CHECK (target_persona IN ('user_a', 'user_b', 'both')),
    required_skills TEXT[],
    eligibility_criteria TEXT,
    location TEXT,
    work_mode TEXT CHECK (work_mode IN ('remote', 'hybrid', 'on_site')),
    compensation TEXT,
    official_url TEXT NOT NULL,
    source TEXT DEFAULT 'Company Careers',
    is_verified BOOLEAN NOT NULL DEFAULT TRUE,
    deadline DATE,
    last_checked TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.job_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    opportunity_id UUID REFERENCES public.job_opportunities(id) ON DELETE SET NULL,
    company_name TEXT NOT NULL,
    job_title TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'saved' CHECK (status IN ('saved', 'interested', 'preparing', 'applied', 'assessment', 'interview', 'offer', 'rejected', 'withdrawn')),
    applied_date DATE,
    resume_version TEXT,
    assessment_date DATE,
    interview_date DATE,
    follow_up_date DATE,
    compensation TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. NOTIFICATIONS & PREFERENCES
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('deadline', 'partner_update', 'schedule_buffer', 'job_alert', 'exam_milestone')),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    action_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shared_workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recurring_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetable_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.syllabus_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mock_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.focus_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Helper security function to check workspace membership
CREATE OR REPLACE FUNCTION public.is_workspace_member(ws_id UUID, uid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.workspace_members
        WHERE workspace_id = ws_id AND user_id = uid
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS POLICIES

-- Profiles: user can see self and partner in shared workspace
CREATE POLICY "Users can manage own profile" ON public.profiles
    FOR ALL USING (auth.uid() = id);

CREATE POLICY "Partner can view shared profile" ON public.profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.workspace_members m1
            JOIN public.workspace_members m2 ON m1.workspace_id = m2.workspace_id
            WHERE m1.user_id = auth.uid() AND m2.user_id = profiles.id
        )
    );

-- Tasks: user can manage own tasks; partner can view non-private tasks
CREATE POLICY "Users can manage own tasks" ON public.tasks
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Partner can view shared tasks" ON public.tasks
    FOR SELECT USING (
        NOT is_private AND workspace_id IS NOT NULL AND
        public.is_workspace_member(workspace_id, auth.uid())
    );

-- Shared Activity Events: members can view and insert
CREATE POLICY "Workspace members can view activity" ON public.activity_events
    FOR SELECT USING (public.is_workspace_member(workspace_id, auth.uid()));

CREATE POLICY "Workspace members can insert activity" ON public.activity_events
    FOR INSERT WITH CHECK (auth.uid() = user_id AND public.is_workspace_member(workspace_id, auth.uid()));

-- Mood updates: viewable by partner if not private
CREATE POLICY "Users manage own mood" ON public.mood_updates
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Partner views shared mood" ON public.mood_updates
    FOR SELECT USING (
        NOT is_private AND public.is_workspace_member(workspace_id, auth.uid())
    );

-- Enable Supabase Realtime publication for shared tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.mood_updates;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.focus_sessions;
