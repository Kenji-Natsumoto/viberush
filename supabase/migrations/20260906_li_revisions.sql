-- li_revisions — VR LI（LinkedIn 便）の差し戻し指示の正本（2026-09-06 レオ起草）
-- 目的: Notion（2026-08-12 退役）の「差し戻し＋修正指示」を置き換える。
--   夏本さんが /admin/revise?key=2026-W37:mon で一言書く → status='open'
--   step4_revise_v02.py（30分毎 launchd）が open を読み、改稿・照合し、
--   revised / blocked / failed を書き戻す。指示と結果が1行に並ぶ。
create table if not exists public.li_revisions (
  id           uuid primary key default gen_random_uuid(),
  post_key     text not null,                 -- 例 2026-W37:mon（配信台帳と同じキー）
  instruction  text not null,                 -- 夏本さんの一言
  status       text not null default 'open',  -- open / revised / blocked / failed
  depth        text,                          -- step4 の分類: style / facts / angle
  result       text,                          -- 指示 → 変えた点（Discord にも同文）
  created_by   uuid references auth.users(id),
  created_at   timestamptz not null default now(),
  handled_at   timestamptz
);
create index if not exists li_revisions_status_idx on public.li_revisions (status, created_at);

alter table public.li_revisions enable row level security;

-- 書けるのは管理者本人だけ（useIsAdmin と同じ ID）。service_role は RLS を通らず step4 が使う。
drop policy if exists "admin can insert li_revisions" on public.li_revisions;
create policy "admin can insert li_revisions" on public.li_revisions
  for insert to authenticated
  with check (auth.uid() = 'a23fa7e2-b1e6-40c4-a99e-0bdfbb6f5d31'::uuid);

drop policy if exists "admin can read li_revisions" on public.li_revisions;
create policy "admin can read li_revisions" on public.li_revisions
  for select to authenticated
  using (auth.uid() = 'a23fa7e2-b1e6-40c4-a99e-0bdfbb6f5d31'::uuid);
