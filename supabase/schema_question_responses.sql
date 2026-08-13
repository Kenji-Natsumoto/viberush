-- ─────────────────────────────────────────────
-- Question Responses (/question — public, no login required)
--
-- Answers to the one open question we ask in the weekly Builder's Issue.
-- Anyone can submit. Nobody can read from the browser.
-- ─────────────────────────────────────────────
create table if not exists public.question_responses (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  shipped_kind text not null check (shipped_kind in ('confirmed', 'assumed', 'mix')),
  story        text,
  shipped_url  text,
  handle       text,
  utm_source   text,
  utm_campaign text,
  user_agent   text
);

create index if not exists question_responses_created_at_idx
  on public.question_responses (created_at desc);

alter table public.question_responses enable row level security;

-- Anyone may submit, signed in or not. Respondents arrive from social posts
-- and must never be asked to create an account first.
create policy "Anyone can submit a question response"
  on public.question_responses for insert
  to anon, authenticated
  with check (true);

-- IMPORTANT: there is deliberately NO select / update / delete policy.
-- Responses contain what people chose to tell us privately, including their
-- handle. With RLS enabled and no select policy, the browser can never read
-- this table — not even the row it just inserted. Reading is done server-side
-- with the service role key only. Do not add a select policy "for convenience";
-- doing so would publish every answer to the entire internet.
