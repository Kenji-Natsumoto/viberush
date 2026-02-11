import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

const ShortUrlRedirect = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!code) {
      navigate('/', { replace: true });
      return;
    }

    const lookup = async () => {
      const { data, error } = await supabase
        .from('short_urls')
        .select('product_id')
        .eq('code', code)
        .maybeSingle();

      if (error || !data) {
        navigate('/', { replace: true });
        return;
      }

      navigate(`/product/${data.product_id}`, { replace: true });
    };

    lookup();
  }, [code, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground">Redirecting...</div>
    </div>
  );
};

export default ShortUrlRedirect;
