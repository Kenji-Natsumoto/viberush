-- product_updates — release updates on a maker's own product (MS-VR-7 phase 1)
-- Requirements: co-viberush/docs/requirements/MS-VR-7_release-updates-phase1-v1.0.md §9
-- Applied by hand in the Supabase SQL Editor on 2026-09-06 (Kenji). Kept here as the record.
--
-- Who may write is decided by the ownership model that already exists on `products`
-- (user_id / owner_id) — deliberately NOT by the hardcoded admin UID that `chronicles`
-- uses, so the existing 3-place hardcode does not gain a 4th (§3-2).
create table if not exists public.product_updates (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references public.products(id) on delete cascade,
  author_id   uuid not null references auth.users(id),
  date        date not null default current_date,
  title       text not null,
  body        text not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists product_updates_product_id_idx
  on public.product_updates (product_id, date desc, created_at desc);

alter table public.product_updates enable row level security;

drop policy if exists "anyone can read product_updates" on public.product_updates;
create policy "anyone can read product_updates" on public.product_updates
  for select to anon, authenticated using (true);

drop policy if exists "owner can insert product_updates" on public.product_updates;
create policy "owner can insert product_updates" on public.product_updates
  for insert to authenticated
  with check (
    auth.uid() = author_id
    and exists (select 1 from public.products p
                where p.id = product_id
                  and (p.user_id = auth.uid() or p.owner_id = auth.uid()))
  );

drop policy if exists "owner can update product_updates" on public.product_updates;
create policy "owner can update product_updates" on public.product_updates
  for update to authenticated
  using (
    auth.uid() = author_id
    and exists (select 1 from public.products p
                where p.id = product_id
                  and (p.user_id = auth.uid() or p.owner_id = auth.uid()))
  )
  with check (
    auth.uid() = author_id
    and exists (select 1 from public.products p
                where p.id = product_id
                  and (p.user_id = auth.uid() or p.owner_id = auth.uid()))
  );

-- No delete policy on purpose: deletion was cut from phase 1 (§6-9).
