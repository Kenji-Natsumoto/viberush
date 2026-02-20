import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Settings, Rocket, Plus, ArrowRight, BookOpen } from "lucide-react";
import { useIsAdmin } from "@/hooks/useChronicles";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EditProductModal } from "@/components/EditProductModal";
import { GlobalMakerProfile } from "@/components/GlobalMakerProfile";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DbProduct, Product, dbProductToProduct } from "@/types/database";

function useMyProducts() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["my-products", user?.id],
    queryFn: async (): Promise<Product[]> => {
      if (!user) return [];

      const globalAvatarUrl = user.user_metadata?.global_avatar_url || undefined;

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data as DbProduct[]).map((p) => dbProductToProduct(p, globalAvatarUrl));
    },
    enabled: !!user,
  });
}

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const { data: products = [], isLoading } = useMyProducts();
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const isAdmin = useIsAdmin();

  // Redirect to auth if not logged in
  if (!authLoading && !user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header onSubmitClick={() => {}} />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-12">
        {/* Page Title */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">
              My Projects
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Products you own and manage on VibeRush.
            </p>
          </div>
          {isAdmin && (
            <Link to="/dashboard/chronicles">
              <Button variant="outline" size="sm" className="gap-1.5">
                <BookOpen className="h-4 w-4" />
                Manage Chronicles
              </Button>
            </Link>
          )}
        </div>

        {/* Loading State */}
        {(isLoading || authLoading) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="border border-border">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-8 w-20 mt-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !authLoading && products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center mb-5">
              <Rocket className="h-6 w-6 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Your Sanctuary is empty.
            </h2>
            <p className="text-sm text-muted-foreground max-w-sm mb-6">
              Claim your first product or SHIP something new!
            </p>
            <Link to="/">
              <Button variant="default" size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Explore & Ship
              </Button>
            </Link>
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && !authLoading && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <Card
                key={product.id}
                className="group border border-border hover:shadow-card-hover transition-shadow duration-200"
              >
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={product.iconUrl}
                      alt={product.name}
                      className="h-10 w-10 rounded-lg object-cover bg-muted"
                    />
                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/product/${product.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-foreground hover:underline underline-offset-2 truncate block"
                      >
                        {product.name}
                      </Link>
                      {product.tagline && (
                        <p className="text-xs text-muted-foreground truncate">
                          {product.tagline}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Link
                      to={`/product/${product.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                    >
                      View <ArrowRight className="h-3 w-3" />
                    </Link>
                    <Button
                      variant="default"
                      size="sm"
                      className="gap-1.5 text-xs h-8"
                      onClick={() => setEditProduct(product)}
                    >
                      <Settings className="h-3.5 w-3.5" />
                      Edit App
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Global Maker Profile */}
        <div className="mt-12">
          <GlobalMakerProfile />
        </div>
      </main>

      <Footer />

      {/* Edit Modal */}
      <EditProductModal
        isOpen={!!editProduct}
        onClose={() => setEditProduct(null)}
        product={editProduct}
      />
    </div>
  );
}
