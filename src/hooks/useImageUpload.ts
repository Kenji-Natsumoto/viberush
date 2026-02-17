import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const BUCKET = "product-images";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

interface UploadResult {
  url: string;
  path: string;
}

export function useImageUpload() {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);

  const upload = async (file: File, folder: "banners" | "icons" | "avatars"): Promise<UploadResult | null> => {
    if (!user) {
      toast.error("Please sign in to upload images");
      return null;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size must be under 5MB");
      return null;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Unsupported file type. Use JPG, PNG, WebP, GIF, or SVG.");
      return null;
    }

    setIsUploading(true);

    try {
      const ext = file.name.split(".").pop() || "png";
      const fileName = `${user.id}/${folder}/${Date.now()}.${ext}`;

      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(fileName);

      toast.success("Image uploaded!");
      return { url: urlData.publicUrl, path: fileName };
    } catch (err: any) {
      console.error("Upload error:", err);
      toast.error(err.message || "Upload failed");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return { upload, isUploading };
}
