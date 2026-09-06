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
          <h1 className="text-2xl font-bold text-foreground mb-4">No access</h1>
          <Link to="/" className="text-primary hover:underline">← Back to home</Link>
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
          Back to home
        </Link>

        <h1 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
          <Shield className="h-6 w-6" />
          Ownership transfers
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          Transfer proxy-submitted products to their real creator.
        </p>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by product name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Proxy-submitted products (admin submitted on behalf of others) */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Proxy-submitted products ({proxyProducts.length})
          </h2>
          {isLoading ? (
            <div className="text-muted-foreground">Loading…</div>
          ) : filterProducts(proxyProducts).length === 0 ? (
            <div className="text-muted-foreground bg-card border border-border rounded-xl p-6 text-center">
              {search ? "No matching products" : "No proxy-submitted products"}
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
                          ? `Creator: ${product.proxyCreatorName}`
                          : "No creator name set"}
                        {product.ownerId && (
                          <span className="ml-2 text-primary">
                            → Transferred ({product.ownerId.slice(0, 8)}...)
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {product.ownerId ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-primary flex items-center gap-1">
                        <User className="h-3.5 w-3.5" />
                        Owner: {product.ownerId.slice(0, 8)}...
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => revokeOwnership.mutate(product.id)}
                        disabled={revokeOwnership.isPending}
                        className="text-xs text-muted-foreground"
                      >
                        <X className="h-3 w-3 mr-1" />
                        Revoke
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Recipient user UUID"
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
                        Transfer
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
            Self-submitted products ({userProducts.length})
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            These were shipped by the users themselves; they hold the edit rights.
          </p>
          {isLoading ? (
            <div className="text-muted-foreground">Loading…</div>
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
                      Submitted by: {product.userId.slice(0, 8)}...
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">Self-managed</span>
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
