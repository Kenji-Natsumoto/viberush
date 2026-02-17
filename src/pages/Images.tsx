import { useState, useRef } from 'react';
import { Upload, Trash2, Loader2, Image as ImageIcon, AlertCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useProducts, useUpdateProduct } from '@/hooks/useProducts';
import { useProductScreenshots, useAddScreenshots, useDeleteScreenshot } from '@/hooks/useProductScreenshots';
import { toast } from 'sonner';
import type { Product } from '@/types/database';
import { cn } from '@/lib/utils';

// Per-product management card
function ProductImageCard({ product }: { product: Product }) {
  const { user } = useAuth();
  const { upload, uploading } = useImageUpload();
  const updateProduct = useUpdateProduct();
  const { data: screenshots = [], isLoading: screenshotsLoading } = useProductScreenshots(product.id);
  const addScreenshots = useAddScreenshots();
  const deleteScreenshot = useDeleteScreenshot();
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const screenshotInputRef = useRef<HTMLInputElement>(null);
  const [expanded, setExpanded] = useState(false);

  const hasBanner = !!product.bannerUrl;
  const hasAvatar = !!product.proxyAvatarUrl;

  const handleBannerUpload = async (file: File) => {
    const url = await upload(file);
    if (url) {
      await updateProduct.mutateAsync({ id: product.id, bannerUrl: url });
    }
  };

  const handleAvatarUpload = async (file: File) => {
    const url = await upload(file);
    if (url) {
      await updateProduct.mutateAsync({ id: product.id, proxyAvatarUrl: url });
    }
  };

  const handleScreenshotUpload = async (files: FileList) => {
    addScreenshots.mutate({ productId: product.id, files: Array.from(files) });
  };

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card">
      {/* Header row */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors text-left"
      >
        <img
          src={product.iconUrl}
          alt={product.name}
          className="w-10 h-10 rounded-lg object-cover border border-border flex-shrink-0"
          onError={(e) => {
            e.currentTarget.src = `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(product.name)}&backgroundColor=6366f1`;
          }}
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">{product.name}</h3>
          <p className="text-xs text-muted-foreground truncate">{product.tagline || 'No tagline'}</p>
        </div>

        {/* Status badges */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {!hasBanner && (
            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-destructive/10 text-destructive border border-destructive/20">
              <AlertCircle className="h-3 w-3" />
              バナー未登録
            </span>
          )}
          {!hasAvatar && (
            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
              <AlertCircle className="h-3 w-3" />
              アバター未登録
            </span>
          )}
          {expanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-border pt-4">
          {/* Banner */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">バナー画像</label>
              <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => bannerInputRef.current?.click()} disabled={uploading}>
                <Upload className="h-3 w-3" />
                アップロード
              </Button>
              <input ref={bannerInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleBannerUpload(f);
                e.target.value = '';
              }} />
            </div>
            {hasBanner ? (
              <div className="relative rounded-lg overflow-hidden border border-border h-24">
                <img src={product.bannerUrl} alt="Banner" className="w-full h-full object-cover" onError={(e) => { (e.currentTarget.parentElement as HTMLElement).style.display = 'none'; }} />
              </div>
            ) : (
              <div className="h-24 rounded-lg border-2 border-dashed border-border flex items-center justify-center text-muted-foreground text-sm">
                バナー画像なし
              </div>
            )}
          </div>

          {/* Avatar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">アバターアイコン</label>
              <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => avatarInputRef.current?.click()} disabled={uploading}>
                <Upload className="h-3 w-3" />
                アップロード
              </Button>
              <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleAvatarUpload(f);
                e.target.value = '';
              }} />
            </div>
            {hasAvatar ? (
              <img src={product.proxyAvatarUrl} alt="Avatar" className="w-16 h-16 rounded-full object-cover border border-border" onError={(e) => { e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${product.userId}`; }} />
            ) : (
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-border flex items-center justify-center text-muted-foreground text-xs">
                なし
              </div>
            )}
          </div>

          {/* Screenshots */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">スクリーンショット ({screenshots.length})</label>
              <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => screenshotInputRef.current?.click()} disabled={addScreenshots.isPending}>
                {addScreenshots.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
                複数追加
              </Button>
              <input ref={screenshotInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => {
                if (e.target.files?.length) handleScreenshotUpload(e.target.files);
                e.target.value = '';
              }} />
            </div>
            {screenshotsLoading ? (
              <div className="text-sm text-muted-foreground">読み込み中...</div>
            ) : screenshots.length === 0 ? (
              <div className="h-20 rounded-lg border-2 border-dashed border-border flex items-center justify-center text-muted-foreground text-sm">
                スクリーンショットなし
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {screenshots.map((ss) => (
                  <div key={ss.id} className="group relative rounded-lg border border-border overflow-hidden aspect-video bg-secondary">
                    <img src={ss.url} alt="Screenshot" className="w-full h-full object-cover" />
                    <button
                      onClick={() => deleteScreenshot.mutate({ id: ss.id, productId: product.id })}
                      className="absolute top-1 right-1 p-1 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const Images = () => {
  const { user } = useAuth();
  const { products, isLoading } = useProducts();

  // Filter to only show user's own products
  const myProducts = products.filter((p) => p.userId === user?.id);

  return (
    <div className="min-h-screen bg-background">
      <Header onSubmitClick={() => {}} />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Image Manager</h1>
            <p className="text-muted-foreground mt-1">プロダクトごとにバナー、アバター、スクリーンショットを管理できます。</p>
          </div>

          {!user ? (
            <div className="text-center py-16 text-muted-foreground">
              <p>画像を管理するには<a href="/auth" className="text-primary underline">サインイン</a>してください。</p>
            </div>
          ) : isLoading ? (
            <div className="text-center py-8 text-muted-foreground">読み込み中...</div>
          ) : myProducts.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <ImageIcon className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>まだプロダクトがありません。先にプロダクトをShipしてください。</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myProducts.map((product) => (
                <ProductImageCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Images;
