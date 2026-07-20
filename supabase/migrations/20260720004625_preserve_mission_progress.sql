-- Cross-device mission progress is monotonic. A stale browser may safely
-- upsert an older local row without changing completed -> in_progress or
-- in_progress -> not_started on the server.

create or replace function public.preserve_study_mission_progress()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if old.status = 'completed' and new.status <> 'completed' then
    new.status := 'completed';
    new.started_at := coalesce(old.started_at, new.started_at);
    new.completed_at := old.completed_at;
  elsif old.status = 'in_progress' and new.status = 'not_started' then
    new.status := 'in_progress';
    new.started_at := old.started_at;
  end if;
  return new;
end;
$$;

revoke all on function public.preserve_study_mission_progress() from public, anon, authenticated;

drop trigger if exists preserve_study_mission_progress_before_update
  on public.study_missions;
create trigger preserve_study_mission_progress_before_update
before update on public.study_missions
for each row execute function public.preserve_study_mission_progress();
