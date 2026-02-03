-- =====================================================
-- Supabase Schema for VibeRush
-- Run this SQL in your Supabase Dashboard > SQL Editor
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. Products Table
-- =====================================================
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  url TEXT NOT NULL,
  icon_url TEXT NOT NULL DEFAULT 'https://api.dicebear.com/7.x/shapes/svg?seed=default&backgroundColor=6366f1',
  banner_url TEXT,
  demo_url TEXT,
  video_url TEXT,
  ai_prompt TEXT,
  tools_used TEXT[] NOT NULL DEFAULT '{}',
  time_to_build TEXT NOT NULL DEFAULT '1 hour',
  votes_count INTEGER NOT NULL DEFAULT 0,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contact_email TEXT,
  x_url TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  proxy_creator_name TEXT,
  proxy_avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS products_user_id_idx ON public.products(user_id);
CREATE INDEX IF NOT EXISTS products_created_at_idx ON public.products(created_at DESC);
CREATE INDEX IF NOT EXISTS products_votes_count_idx ON public.products(votes_count DESC);

-- =====================================================
-- 2. Votes Table (for unique vote tracking)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

CREATE INDEX IF NOT EXISTS votes_product_id_idx ON public.votes(product_id);
CREATE INDEX IF NOT EXISTS votes_user_id_idx ON public.votes(user_id);

-- =====================================================
-- 3. Helper Functions
-- =====================================================

-- Check if user owns the product
CREATE OR REPLACE FUNCTION public.is_product_owner(product_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.products
    WHERE id = product_id AND user_id = auth.uid()
  );
$$;

-- Check if user has voted for a product
CREATE OR REPLACE FUNCTION public.has_voted(p_product_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.votes
    WHERE product_id = p_product_id AND user_id = auth.uid()
  );
$$;

-- =====================================================
-- 4. Triggers for updated_at
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS products_updated_at ON public.products;
CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- 5. Triggers for vote count
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_vote_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.products 
    SET votes_count = votes_count + 1 
    WHERE id = NEW.product_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.products 
    SET votes_count = votes_count - 1 
    WHERE id = OLD.product_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS votes_count_trigger ON public.votes;
CREATE TRIGGER votes_count_trigger
  AFTER INSERT OR DELETE ON public.votes
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_vote_count();

-- =====================================================
-- 6. Row Level Security (RLS)
-- =====================================================

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- Products Policies
DROP POLICY IF EXISTS "Anyone can read products" ON public.products;
CREATE POLICY "Anyone can read products"
  ON public.products FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can create products" ON public.products;
CREATE POLICY "Authenticated users can create products"
  ON public.products FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own products" ON public.products;
CREATE POLICY "Users can update their own products"
  ON public.products FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own products" ON public.products;
CREATE POLICY "Users can delete their own products"
  ON public.products FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Votes Policies
DROP POLICY IF EXISTS "Users can see their own votes" ON public.votes;
CREATE POLICY "Users can see their own votes"
  ON public.votes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Authenticated users can vote" ON public.votes;
CREATE POLICY "Authenticated users can vote"
  ON public.votes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can remove their own votes" ON public.votes;
CREATE POLICY "Users can remove their own votes"
  ON public.votes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- =====================================================
-- 7. Enable Realtime
-- =====================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
