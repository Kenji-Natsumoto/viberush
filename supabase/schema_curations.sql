-- ─────────────────────────────────────────────
-- Product Curations (1 per product, admin-only)
-- ─────────────────────────────────────────────
create table if not exists public.product_curations (
  id         uuid primary key default gen_random_uuid(),
  product_id uuid not null unique references public.products(id) on delete cascade,
  content_md text not null default '',
  video_url  text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.product_curations enable row level security;

create policy "Anyone can read product_curations"
  on public.product_curations for select using (true);

create policy "Admin can manage product_curations"
  on public.product_curations for all
  using (auth.uid() = 'a23fa7e2-b1e6-40c4-a99e-0bdfbb6f5d31'::uuid);

-- ─────────────────────────────────────────────
-- Maker Respects (1 per maker, admin-only)
-- ─────────────────────────────────────────────
create table if not exists public.maker_respects (
  id         uuid primary key default gen_random_uuid(),
  maker_id   uuid not null unique references public.maker_profiles(id) on delete cascade,
  content_md text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.maker_respects enable row level security;

create policy "Anyone can read maker_respects"
  on public.maker_respects for select using (true);

create policy "Admin can manage maker_respects"
  on public.maker_respects for all
  using (auth.uid() = 'a23fa7e2-b1e6-40c4-a99e-0bdfbb6f5d31'::uuid);
