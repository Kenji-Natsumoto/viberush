import { useState, useRef } from 'react';
import { Upload, Copy, Trash2, Loader2, Image as ImageIcon, Check } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useImageUpload } from '@/hooks/useImageUpload';
import { toast } from 'sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface StoredImage {
  name: string;
  url: string;
  created_at: string;
}

const Images = () => {
  const { user } = useAuth();
  const { upload, uploading } = useImageUpload();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const { data: images = [], isLoading } = useQuery({
    queryKey: ['user-images', user?.id],
    queryFn: async (): Promise<StoredImage[]> => {
      if (!user) return [];
      const { data, error } = await supabase.storage
        .from('product-images')
        .list(user.id, { sortBy: { column: 'created_at', order: 'desc' } });
      if (error) throw error;
      return (data || []).map((f) => ({
        name: f.name,
        url: supabase.storage.from('product-images').getPublicUrl(`${user.id}/${f.name}`).data.publicUrl,
        created_at: f.created_at || '',
      }));
    },
    enabled: !!user,
  });

  const handleUpload = async (files: FileList) => {
    for (const file of Array.from(files)) {
      await upload(file);
    }
    queryClient.invalidateQueries({ queryKey: ['user-images'] });
  };

  const handleDelete = async (name: string) => {
    if (!user) return;
    const { error } = await supabase.storage
      .from('product-images')
      .remove([`${user.id}/${name}`]);
    if (error) {
      toast.error('Delete failed');
    } else {
      toast.success('Image deleted');
      queryClient.invalidateQueries({ queryKey: ['user-images'] });
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    toast.success('URL copied!');
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onSubmitClick={() => {}} />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Image Manager</h1>
            <p className="text-muted-foreground mt-1">Upload images and copy their URLs to use in your products.</p>
          </div>

          {!user ? (
            <div className="text-center py-16 text-muted-foreground">
              <p>Please <a href="/auth" className="text-primary underline">sign in</a> to manage images.</p>
            </div>
          ) : (
            <>
              {/* Upload area */}
              <div
                className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files.length) handleUpload(e.dataTransfer.files);
                }}
              >
                {uploading ? (
                  <Loader2 className="h-8 w-8 mx-auto text-primary animate-spin" />
                ) : (
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                )}
                <p className="mt-2 text-sm text-muted-foreground">
                  {uploading ? 'Uploading...' : 'Click or drag & drop images here'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">JPEG, PNG, WebP, GIF, SVG • Max 5MB</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.length) handleUpload(e.target.files);
                    e.target.value = '';
                  }}
                />
              </div>

              {/* Image grid */}
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading...</div>
              ) : images.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <ImageIcon className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>No images yet. Upload your first one!</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {images.map((img) => (
                    <div key={img.name} className="group relative rounded-lg border border-border overflow-hidden bg-secondary">
                      <img
                        src={img.url}
                        alt={img.name}
                        className="w-full aspect-square object-cover"
                      />
                      <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/60 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-8 gap-1"
                          onClick={() => copyUrl(img.url)}
                        >
                          {copiedUrl === img.url ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                          {copiedUrl === img.url ? 'Copied' : 'Copy URL'}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="h-8 w-8 p-0"
                          onClick={() => handleDelete(img.name)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Images;
