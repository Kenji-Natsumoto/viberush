import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const BUCKET = 'product-images';
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];

export function useImageUpload() {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);

  const upload = async (file: File): Promise<string | null> => {
    if (!user) {
      toast.error('Please sign in to upload images');
      return null;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error('Unsupported file type. Use JPEG, PNG, WebP, GIF, or SVG.');
      return null;
    }

    if (file.size > MAX_SIZE) {
      toast.error('File too large. Maximum size is 5MB.');
      return null;
    }

    setUploading(true);
    try {
      const ext = file.name.split('.').pop() || 'png';
      const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(fileName, file, { upsert: false });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(fileName);

      toast.success('Image uploaded!');
      return urlData.publicUrl;
    } catch (err: any) {
      console.error('Upload error:', err);
      toast.error(err.message || 'Upload failed');
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { upload, uploading };
}
