-- =====================================================
-- Chronicles (Changelog) Table for VibeRush
-- Run this SQL in your Supabase Dashboard > SQL Editor
-- =====================================================

-- Admin UID constant used in RLS policies
-- a23fa7e2-b1e6-40c4-a99e-0bdfbb6f5d31

CREATE TABLE IF NOT EXISTS public.chronicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Feature',
  content TEXT NOT NULL DEFAULT '',
  illustration_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS chronicles_date_idx ON public.chronicles(date DESC);

-- Auto-update updated_at
DROP TRIGGER IF EXISTS chronicles_updated_at ON public.chronicles;
CREATE TRIGGER chronicles_updated_at
  BEFORE UPDATE ON public.chronicles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Enable RLS
ALTER TABLE public.chronicles ENABLE ROW LEVEL SECURITY;

-- Anyone can read
DROP POLICY IF EXISTS "Anyone can read chronicles" ON public.chronicles;
CREATE POLICY "Anyone can read chronicles"
  ON public.chronicles FOR SELECT
  USING (true);

-- Only admin can insert
DROP POLICY IF EXISTS "Admin can insert chronicles" ON public.chronicles;
CREATE POLICY "Admin can insert chronicles"
  ON public.chronicles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = 'a23fa7e2-b1e6-40c4-a99e-0bdfbb6f5d31'::uuid);

-- Only admin can update
DROP POLICY IF EXISTS "Admin can update chronicles" ON public.chronicles;
CREATE POLICY "Admin can update chronicles"
  ON public.chronicles FOR UPDATE
  TO authenticated
  USING (auth.uid() = 'a23fa7e2-b1e6-40c4-a99e-0bdfbb6f5d31'::uuid)
  WITH CHECK (auth.uid() = 'a23fa7e2-b1e6-40c4-a99e-0bdfbb6f5d31'::uuid);

-- Only admin can delete
DROP POLICY IF EXISTS "Admin can delete chronicles" ON public.chronicles;
CREATE POLICY "Admin can delete chronicles"
  ON public.chronicles FOR DELETE
  TO authenticated
  USING (auth.uid() = 'a23fa7e2-40c4-a99e-0bdfbb6f5d31'::uuid);

-- =====================================================
-- Seed: First entry
-- =====================================================
INSERT INTO public.chronicles (date, title, category, content) VALUES (
  '2026-02-19',
  '[Update] Product Identity & The "Wagner" Patch',
  'Community Driven',
  E'VibeRush evolves with its builders. Today, following insightful feedback from QuietMode Maker **Wagner Carvalho**, we implemented the ability to independently set the **"Product Avatar (iconUrl)"**.\n\nThis allows you to completely separate and manage your personal profile from your product''s specific brand identity. Makers, please check the top of the **"Edit App."**\n\nCreating an environment where makers can take pride in their "SHIP" and pay close attention to every detail is our promise at VibeRush.\n\n*Special thanks to Wagner for the collaboration!*'
);
