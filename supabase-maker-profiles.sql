-- =====================================================
-- Maker Profiles Schema for VibeRush
-- Run this SQL in your Supabase Dashboard > SQL Editor
-- =====================================================

-- 1. Maker Profiles Table
CREATE TABLE IF NOT EXISTS public.maker_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  bio TEXT DEFAULT '',
  x_url TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  portfolio_url TEXT,
  avatar_url TEXT,
  invited_by_id UUID REFERENCES public.maker_profiles(id) ON DELETE SET NULL,
  featured_product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  total_upvotes INTEGER NOT NULL DEFAULT 0,
  total_vibe_score INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS maker_profiles_username_idx ON public.maker_profiles(username);
CREATE INDEX IF NOT EXISTS maker_profiles_invited_by_idx ON public.maker_profiles(invited_by_id);

-- Updated_at trigger
DROP TRIGGER IF EXISTS maker_profiles_updated_at ON public.maker_profiles;
CREATE TRIGGER maker_profiles_updated_at
  BEFORE UPDATE ON public.maker_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 2. RLS Policies
ALTER TABLE public.maker_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read maker profiles" ON public.maker_profiles;
CREATE POLICY "Anyone can read maker profiles"
  ON public.maker_profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can create their own profile" ON public.maker_profiles;
CREATE POLICY "Users can create their own profile"
  ON public.maker_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.maker_profiles;
CREATE POLICY "Users can update their own profile"
  ON public.maker_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 3. Refresh schema cache
NOTIFY pgrst, 'reload schema';
