import { useState, useEffect } from "react";
import { User, RefreshCw, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { ImageUpload } from "@/components/ImageUpload";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export function GlobalMakerProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [avatarUrl, setAvatarUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  // Load from user_metadata on mount
  useEffect(() => {
    if (user?.user_metadata?.global_avatar_url) {
      setAvatarUrl(user.user_metadata.global_avatar_url);
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { global_avatar_url: avatarUrl },
      });
      if (error) throw error;
      toast.success("Global avatar saved!");
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 3000);
    } catch (err: any) {
      toast.error(err.message || "Failed to save avatar");
    } finally {
      setSaving(false);
    }
  };

  const handleBulkSync = async () => {
    if (!user || !avatarUrl) return;
    setSyncing(true);
    try {
      // First save the global avatar
      await supabase.auth.updateUser({
        data: { global_avatar_url: avatarUrl },
      });

      // Batch update all user's products
      const { error, count } = await supabase
        .from("products")
        .update({ proxy_avatar_url: avatarUrl }, { count: "exact" })
        .eq("user_id", user.id);

      if (error) throw error;

      // Also try owner_id match
      await supabase
        .from("products")
        .update({ proxy_avatar_url: avatarUrl })
        .eq("owner_id", user.id);

      // Invalidate caches
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["my-products"] });

      toast.success(
        `Avatar synced to ${count ?? 0} product${count !== 1 ? "s" : ""}!`
      );
    } catch (err: any) {
      toast.error(err.message || "Sync failed");
    } finally {
      setSyncing(false);
      setShowConfirm(false);
    }
  };

  const defaultAvatar = user
    ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`
    : "";
  const displayAvatar = avatarUrl || defaultAvatar;

  return (
    <>
      <div className="p-5 bg-card border border-border rounded-2xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Global Maker Profile
            </h2>
            <p className="text-xs text-muted-foreground">
              Set your identity across all shipped products.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          {/* Avatar preview */}
          <img
            src={displayAvatar}
            alt="Global Creator Avatar"
            className="h-16 w-16 rounded-full object-cover border-2 border-border shadow-sm flex-shrink-0"
            onError={(e) => {
              e.currentTarget.src = defaultAvatar;
            }}
          />
          <div className="flex-1 space-y-2">
            <Label className="text-sm font-medium">Global Creator Avatar</Label>
            <ImageUpload
              value={avatarUrl}
              onChange={setAvatarUrl}
              placeholder="https://... or upload"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          <Button
            size="sm"
            variant="default"
            className="gap-1.5 text-xs"
            onClick={handleSave}
            disabled={saving}
          >
            {justSaved ? (
              <Check className="h-3.5 w-3.5" />
            ) : null}
            {saving ? "Saving..." : justSaved ? "Saved" : "Save Avatar"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 text-xs"
            onClick={() => setShowConfirm(true)}
            disabled={!avatarUrl || syncing}
          >
            <RefreshCw className={`h-3.5 w-3.5 ${syncing ? "animate-spin" : ""}`} />
            Apply Global Avatar to All Products
          </Button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sync Global Avatar?</AlertDialogTitle>
            <AlertDialogDescription>
              This will update your profile picture across all your shipped
              products. Individual products can still be overridden from the Edit
              App screen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkSync} disabled={syncing}>
              {syncing ? "Syncing..." : "Continue"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
