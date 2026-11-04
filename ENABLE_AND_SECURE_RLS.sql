-- =========================================================================
-- SECURE DATABASE: ENABLE RLS ON ALL TABLES & LOCK DOWN PUBLIC REST ACCESS
-- =========================================================================
-- 1. Enable RLS on every table so the public Supabase REST API is locked down.
-- 2. The Express backend uses the SERVICE_ROLE key, which automatically bypasses RLS.
-- 3. Only authenticated SELECT is allowed on Realtime tables so WebSocket subscriptions work.
-- =========================================================================

-- Step 1: Enable RLS on all 34 public tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_content_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_faq ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_onboarding ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_social_analytics_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_installments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.global_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personal_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_descriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salary_advances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salary_bonuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salary_installments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salary_penalties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_call_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_assignees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Step 2: Drop any existing conflicting policies on Realtime tables
DROP POLICY IF EXISTS "realtime_read_tasks" ON public.tasks;
DROP POLICY IF EXISTS "realtime_read_reminders" ON public.reminders;
DROP POLICY IF EXISTS "realtime_read_global_messages" ON public.global_messages;
DROP POLICY IF EXISTS "realtime_read_client_messages" ON public.client_messages;
DROP POLICY IF EXISTS "realtime_read_comments" ON public.comments;

-- Step 3: Grant SELECT-only to authenticated users for tables subscribed via Realtime
-- (All writes/mutations MUST go through the Express backend via service_role)
CREATE POLICY "realtime_read_tasks" ON public.tasks 
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "realtime_read_reminders" ON public.reminders 
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "realtime_read_global_messages" ON public.global_messages 
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "realtime_read_client_messages" ON public.client_messages 
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "realtime_read_comments" ON public.comments 
  FOR SELECT TO authenticated USING (true);

