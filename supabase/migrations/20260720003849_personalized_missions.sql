-- Personalized results + Today’s Mission (Phase 3 persistence).
-- Additive and backward-compatible: legacy test_results rows keep a null
-- client_result_id, while new rows use it for offline/import deduplication.

alter table public.test_results
  add column if not exists client_result_id text;

create unique index if not exists test_results_user_client_result_uidx
  on public.test_results (user_id, client_result_id)
  where client_result_id is not null;

create table if not exists public.study_missions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  client_id text not null,
  version integer not null default 1,
  source_result_client_id text,
  source_completed_at timestamptz,
  test_type text not null default 'practice',
  status text not null default 'not_started',
  primary_section text,
  title text not null,
  summary text not null,
  evidence_note text,
  estimated_minutes integer,
  activity_type text not null,
  target jsonb not null default '{}'::jsonb,
  priority_sections jsonb not null default '[]'::jsonb,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint study_missions_user_client_unique unique (user_id, client_id),
  constraint study_missions_status_check
    check (status in ('not_started', 'in_progress', 'completed')),
  constraint study_missions_section_check
    check (primary_section is null or primary_section in ('AR','MK','WK','PC','GS','EI','AS','MC')),
  constraint study_missions_minutes_check
    check (estimated_minutes is null or estimated_minutes between 1 and 180),
  constraint study_missions_client_id_length
    check (char_length(client_id) between 1 and 160),
  constraint study_missions_target_object
    check (jsonb_typeof(target) = 'object'),
  constraint study_missions_priorities_array
    check (jsonb_typeof(priority_sections) = 'array')
);

create index if not exists study_missions_user_created_idx
  on public.study_missions (user_id, created_at desc);

alter table public.study_missions enable row level security;

revoke all on table public.study_missions from anon, authenticated;
grant select, insert, update on table public.study_missions to authenticated;

drop policy if exists "Users can read own study missions" on public.study_missions;
create policy "Users can read own study missions"
  on public.study_missions for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can create own study missions" on public.study_missions;
create policy "Users can create own study missions"
  on public.study_missions for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update own study missions" on public.study_missions;
create policy "Users can update own study missions"
  on public.study_missions for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

comment on table public.study_missions is
  'Personalized study missions; answer text and personal profile data are intentionally excluded.';
comment on column public.test_results.client_result_id is
  'Client-generated id used to deduplicate offline saves and guest-to-account imports.';
