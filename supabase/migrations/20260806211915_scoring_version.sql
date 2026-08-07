-- IRT scoring v2: tag each result with the scoring model that produced it.
-- null = legacy linear %-correct model (v1); 'irt-v2' = official-pipeline model.
alter table public.test_results add column if not exists scoring_version text;
comment on column public.test_results.scoring_version is
  'Scoring model that produced this row; null = pre-2026-08 linear model';
