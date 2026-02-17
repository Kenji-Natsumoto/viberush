import { useRef, useState } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useImageUpload } from "@/hooks/useImageUpload";

interface ImageUploadFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder: "banners" | "icons" | "avatars";
  placeholder?: string;
  hint?: string;
  previewClassName?: string;
}

export function ImageUploadField({
  id,
  label,
  value,
  onChange,
  folder,
  placeholder = "https://...",
  hint,
  previewClassName = "h-20 w-20 rounded-lg object-cover",
}: ImageUploadFieldProps) {
  const { upload, isUploading } = useImageUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewError, setPreviewError] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await upload(file, folder);
    if (result) {
      onChange(result.url);
      setPreviewError(false);
    }
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="flex items-center gap-2 text-sm font-medium">
        <ImageIcon className="h-3.5 w-3.5 text-muted-foreground" />
        {label}
      </Label>

      {/* Preview */}
      {value && !previewError && (
        <div className="relative inline-block">
          <img
            src={value}
            alt="Preview"
            className={previewClassName}
            onError={() => setPreviewError(true)}
          />
          <button
            type="button"
            onClick={() => {
              onChange("");
              setPreviewError(false);
            }}
            className="absolute -top-1.5 -right-1.5 p-0.5 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* Upload button + URL input */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
          className="shrink-0 gap-1.5"
        >
          {isUploading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Upload className="h-3.5 w-3.5" />
          )}
          {isUploading ? "Uploading…" : "Upload"}
        </Button>
        <Input
          id={id}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setPreviewError(false);
          }}
          placeholder={placeholder}
          className="bg-secondary border-transparent focus:border-border text-xs"
        />
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        onChange={handleFileChange}
        className="hidden"
      />

      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
