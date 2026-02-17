import { useState } from "react";
import { Copy, Check, Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SubmitModal } from "@/components/SubmitModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useAuth } from "@/contexts/AuthContext";

type Folder = "banners" | "icons" | "avatars";

const FOLDERS: { key: Folder; label: string; hint: string }[] = [
  { key: "banners", label: "Banner Image", hint: "Recommended: 896×192px" },
  { key: "icons", label: "App Icon", hint: "Recommended: 80×80px, square" },
  { key: "avatars", label: "Maker Avatar", hint: "Recommended: 80×80px, square" },
];

export default function ImageManager() {
  const { user } = useAuth();
  const { upload, isUploading } = useImageUpload();
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState<{ url: string; folder: Folder }[]>([]);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<Folder>("banners");

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const result = await upload(file, selectedFolder);
    if (result) {
      setUploadedUrls((prev) => [{ url: result.url, folder: selectedFolder }, ...prev]);
    }
    e.target.value = "";
  };

  const copyUrl = async (url: string) => {
    await navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header onSubmitClick={() => setIsSubmitModalOpen(true)} />
        <main className="container mx-auto px-4 py-20 text-center">
          <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Image Manager</h1>
          <p className="text-muted-foreground mb-6">Sign in to upload and manage images for your apps.</p>
          <Button asChild>
            <a href="/auth">Sign In</a>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onSubmitClick={() => setIsSubmitModalOpen(true)} />
      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">Image Manager</h1>
          <p className="text-muted-foreground text-sm">
            Upload images and copy their URLs to use in your product listings.
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-card border border-border rounded-xl p-6 mb-8">
          <h2 className="font-semibold text-foreground mb-4">Upload New Image</h2>

          {/* Folder selector */}
          <div className="space-y-2 mb-4">
            <Label className="text-sm font-medium">Image Type</Label>
            <div className="flex flex-wrap gap-2">
              {FOLDERS.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setSelectedFolder(f.key)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-all ${
                    selectedFolder === f.key
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-secondary text-muted-foreground border-transparent hover:text-foreground hover:border-border"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {FOLDERS.find((f) => f.key === selectedFolder)?.hint}
            </p>
          </div>

          {/* File input */}
          <label className="flex flex-col items-center gap-3 p-8 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 hover:bg-secondary/50 transition-colors">
            {isUploading ? (
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            ) : (
              <Upload className="h-8 w-8 text-muted-foreground" />
            )}
            <span className="text-sm text-muted-foreground">
              {isUploading ? "Uploading…" : "Click or drop an image here"}
            </span>
            <span className="text-xs text-muted-foreground">JPG, PNG, WebP, GIF, SVG — Max 5MB</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
              onChange={handleFileSelect}
              className="hidden"
              disabled={isUploading}
            />
          </label>
        </div>

        {/* Uploaded URLs */}
        {uploadedUrls.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold text-foreground mb-4">
              Uploaded Images ({uploadedUrls.length})
            </h2>
            <div className="space-y-3">
              {uploadedUrls.map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                  <img
                    src={item.url}
                    alt="Uploaded"
                    className="h-10 w-10 rounded object-cover shrink-0"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-medium text-muted-foreground uppercase">{item.folder}</span>
                    <Input
                      readOnly
                      value={item.url}
                      className="mt-1 text-xs bg-background"
                      onClick={(e) => (e.target as HTMLInputElement).select()}
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyUrl(item.url)}
                    className="shrink-0 gap-1.5"
                  >
                    {copiedUrl === item.url ? (
                      <Check className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    {copiedUrl === item.url ? "Copied!" : "Copy"}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
      <SubmitModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onOpenDetails={() => {}}
      />
    </div>
  );
}
