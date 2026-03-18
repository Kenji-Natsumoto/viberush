-- ─────────────────────────────────────────────
-- maker_respects: バーチャルプロフィール対応
-- ─────────────────────────────────────────────

-- maker_id を nullable に変更（バーチャルプロフィールには maker_id がない）
alter table public.maker_respects
  alter column maker_id drop not null;

-- proxy_creator_name 列を追加（バーチャルプロフィール用）
alter table public.maker_respects
  add column if not exists proxy_creator_name text;

-- proxy_creator_name に部分ユニークインデックス
create unique index if not exists maker_respects_proxy_name_unique
  on public.maker_respects(lower(proxy_creator_name))
  where proxy_creator_name is not null;

-- どちらか一方は必須
alter table public.maker_respects
  add constraint maker_respects_identity_check
  check (maker_id is not null or proxy_creator_name is not null);
