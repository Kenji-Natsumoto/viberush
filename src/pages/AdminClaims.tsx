import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProducts } from "@/hooks/useProducts";
import { useIsAdmin, useTransferOwnership, useRevokeOwnership } from "@/hooks/useClaim";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowRightLeft, X, Shield, ArrowLeft, User, Search } from "lucide-react";

const ADMIN_ID = 'a23fa7e2-b1e6-40c4-a99e-0bdfbb6f5d31';

const AdminClaims = () => {
  const { user } = useAuth();
  const isAdmin = useIsAdmin();
  const { products, isLoading } = useProducts();
  const transferOwnership = useTransferOwnership();
  const revokeOwnership = useRevokeOwnership();
  const [transferTarget, setTransferTarget] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");

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

  // Admin's proxy-submitted products (user_id = admin)
  const proxyProducts = products.filter(
    (p) => p.userId === ADMIN_ID
  );

  // All other products (self-submitted by users)
  const userProducts = products.filter(
    (p) => p.userId !== ADMIN_ID
  );

  const filterProducts = (list: typeof products) =>
    search
      ? list.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
      : list;

  const handleTransfer = (productId: string) => {
    const newOwnerId = transferTarget[productId]?.trim();
    if (!newOwnerId) return;
    transferOwnership.mutate({ productId, newOwnerId });
    setTransferTarget((prev) => ({ ...prev, [productId]: "" }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onSubmitClick={() => {}} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          ホームへ戻る
        </Link>

        <h1 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
          <Shield className="h-6 w-6" />
          権限譲渡の管理
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          代理登録したプロダクトの所有権を「本当の作者」に譲渡します。
        </p>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="プロダクト名で検索..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Proxy-submitted products (admin submitted on behalf of others) */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            代理登録プロダクト ({proxyProducts.length})
          </h2>
          {isLoading ? (
            <div className="text-muted-foreground">読み込み中...</div>
          ) : filterProducts(proxyProducts).length === 0 ? (
            <div className="text-muted-foreground bg-card border border-border rounded-xl p-6 text-center">
              {search ? "該当するプロダクトがありません" : "代理登録したプロダクトはありません"}
            </div>
          ) : (
            <div className="space-y-3">
              {filterProducts(proxyProducts).map((product) => (
                <div key={product.id} className="bg-card border border-border rounded-xl p-4">
                  <div className="flex items-center gap-4 mb-3">
                    <img
                      src={product.iconUrl}
                      alt={product.name}
                      className="w-12 h-12 rounded-[6px] object-cover border border-border"
                    />
                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${product.id}`} className="font-medium text-foreground hover:underline">
                        {product.name}
                      </Link>
                      <p className="text-sm text-muted-foreground truncate">
                        {product.proxyCreatorName
                          ? `制作者: ${product.proxyCreatorName}`
                          : "制作者名未設定"}
                        {product.ownerId && (
                          <span className="ml-2 text-primary">
                            → 譲渡済み ({product.ownerId.slice(0, 8)}...)
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {product.ownerId ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-primary flex items-center gap-1">
                        <User className="h-3.5 w-3.5" />
                        オーナー: {product.ownerId.slice(0, 8)}...
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => revokeOwnership.mutate(product.id)}
                        disabled={revokeOwnership.isPending}
                        className="text-xs text-muted-foreground"
                      >
                        <X className="h-3 w-3 mr-1" />
                        取消
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="譲渡先のユーザーUUID"
                        value={transferTarget[product.id] || ""}
                        onChange={(e) =>
                          setTransferTarget((prev) => ({
                            ...prev,
                            [product.id]: e.target.value,
                          }))
                        }
                        className="text-xs h-8 flex-1"
                      />
                      <Button
                        size="sm"
                        onClick={() => handleTransfer(product.id)}
                        disabled={
                          transferOwnership.isPending ||
                          !transferTarget[product.id]?.trim()
                        }
                        className="gap-1 bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        <ArrowRightLeft className="h-3 w-3" />
                        譲渡
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* User-submitted products (for reference) */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            ユーザー自身のプロダクト ({userProducts.length})
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            これらはユーザーが自分でSHIPしたプロダクトです。編集権限は本人にあります。
          </p>
          {isLoading ? (
            <div className="text-muted-foreground">読み込み中...</div>
          ) : (
            <div className="space-y-3">
              {filterProducts(userProducts).map((product) => (
                <div key={product.id} className="flex items-center gap-4 bg-card border border-border rounded-xl p-4">
                  <img
                    src={product.iconUrl}
                    alt={product.name}
                    className="w-10 h-10 rounded-[6px] object-cover border border-border"
                  />
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${product.id}`} className="font-medium text-foreground hover:underline text-sm">
                      {product.name}
                    </Link>
                    <p className="text-xs text-muted-foreground truncate">
                      投稿者: {product.userId.slice(0, 8)}...
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">自己管理</span>
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
