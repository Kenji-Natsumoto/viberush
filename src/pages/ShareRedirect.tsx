import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

/**
 * /share/:id へブラウザで直接アクセスした場合のリダイレクト。
 * SNS クローラー向けの OG タグは Supabase Edge Function (share-product) が担当するため、
 * このコンポーネントは人間ユーザーを /product/:id へ転送するだけ。
 */
const ShareRedirect = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      navigate(`/product/${id}`, { replace: true });
    } else {
      navigate("/explore", { replace: true });
    }
  }, [id, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground">Redirecting...</div>
    </div>
  );
};

export default ShareRedirect;
