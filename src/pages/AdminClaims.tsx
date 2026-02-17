import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/useProducts";
import { useIsAdmin, useApproveClaim, useRejectClaim } from "@/hooks/useClaim";
import { useAuth } from "@/contexts/AuthContext";
import { Check, X, Shield, ShieldCheck, Loader2, ArrowLeft } from "lucide-react";

const AdminClaims = () => {
  const { user } = useAuth();
  const isAdmin = useIsAdmin();
  const { products, isLoading } = useProducts();
  const approveClaim = useApproveClaim();
  const rejectClaim = useRejectClaim();

  const pendingProducts = products.filter((p) => p.claimStatus === 'pending');
  const verifiedProducts = products.filter((p) => p.claimStatus === 'verified');

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Header onSubmitClick={() => {}} />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">アクセス権限がありません</h1>
          <Link to="/" className="text-primary hover:underline">← ホームへ戻る</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onSubmitClick={() => {}} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          ホームへ戻る
        </Link>

        <h1 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-2">
          <Shield className="h-6 w-6" />
          所有権の管理
        </h1>

        {/* Pending Claims */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            承認待ち ({pendingProducts.length})
          </h2>
          {isLoading ? (
            <div className="text-muted-foreground">読み込み中...</div>
          ) : pendingProducts.length === 0 ? (
            <div className="text-muted-foreground bg-card border border-border rounded-xl p-6 text-center">
              承認待ちの申請はありません
            </div>
          ) : (
            <div className="space-y-3">
              {pendingProducts.map((product) => (
                <div key={product.id} className="flex items-center gap-4 bg-card border border-border rounded-xl p-4">
                  <img
                    src={product.iconUrl}
                    alt={product.name}
                    className="w-12 h-12 rounded-xl object-cover border border-border"
                  />
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${product.id}`} className="font-medium text-foreground hover:underline">
                      {product.name}
                    </Link>
                    <p className="text-sm text-muted-foreground truncate">
                      申請者ID: {product.ownerId?.slice(0, 8)}...
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => approveClaim.mutate(product.id)}
                      disabled={approveClaim.isPending}
                      className="gap-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                      {approveClaim.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                      承認
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => rejectClaim.mutate(product.id)}
                      disabled={rejectClaim.isPending}
                    >
                      <X className="h-3 w-3" />
                      却下
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* All Products - Admin can manually verify */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            全プロダクト（手動認証）
          </h2>
          {isLoading ? (
            <div className="text-muted-foreground">読み込み中...</div>
          ) : (
            <div className="space-y-3">
              {products
                .filter((p) => p.claimStatus !== 'pending')
                .map((product) => (
                  <div key={product.id} className="flex items-center gap-4 bg-card border border-border rounded-xl p-4">
                    <img
                      src={product.iconUrl}
                      alt={product.name}
                      className="w-12 h-12 rounded-xl object-cover border border-border"
                    />
                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${product.id}`} className="font-medium text-foreground hover:underline">
                        {product.name}
                      </Link>
                      <p className="text-sm text-muted-foreground truncate">
                        {product.ownerId ? `オーナーID: ${product.ownerId.slice(0, 8)}...` : 'オーナー未設定'}
                      </p>
                    </div>
                    {product.claimStatus === 'verified' ? (
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 text-sm text-primary">
                          <Check className="h-4 w-4" />
                          認証済み
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => rejectClaim.mutate(product.id)}
                          disabled={rejectClaim.isPending}
                          className="text-xs text-muted-foreground"
                        >
                          取消
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => approveClaim.mutate(product.id)}
                        disabled={approveClaim.isPending}
                        className="gap-1 bg-green-600 hover:bg-green-700 text-white"
                      >
                        {approveClaim.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <ShieldCheck className="h-3 w-3" />}
                        手動認証
                      </Button>
                    )}
                  </div>
                ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminClaims;
