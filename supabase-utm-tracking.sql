-- =====================================================
-- UTM Source Tracking for vibe_clicks
-- Run this in: Supabase Dashboard > SQL Editor
-- Date: 2026-03-03
-- =====================================================

-- 1. Add source column to vibe_clicks table
ALTER TABLE public.vibe_clicks
  ADD COLUMN IF NOT EXISTS source TEXT;

-- 2. Replace add_vibe_click RPC to accept and store source
CREATE OR REPLACE FUNCTION public.add_vibe_click(
  p_product_id UUID,
  p_source      TEXT DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Record the click with optional source
  INSERT INTO public.vibe_clicks (product_id, user_id, source)
  VALUES (p_product_id, auth.uid(), p_source);

  -- Increment aggregate counter on the product
  UPDATE public.products
  SET vibe_score = vibe_score + 1
  WHERE id = p_product_id;

  -- Increment aggregate counter on the maker profile
  UPDATE public.maker_profiles
  SET total_vibe_score = total_vibe_score + 1
  WHERE id = (
    SELECT user_id FROM public.products WHERE id = p_product_id
  );
END;
$$;
