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

  const saveToMetadata = async (url: string) => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { global_avatar_url: url },
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

  const handleSave = () => saveToMetadata(avatarUrl);

  // Auto-save when avatar URL changes (e.g. after upload)
  const handleAvatarChange = (url: string) => {
    setAvatarUrl(url);
    // Auto-save if it looks like a valid uploaded URL (not empty, not partial typing)
    if (url && url.startsWith("http")) {
      saveToMetadata(url);
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

      // Only update products where this user is the verified owner,
      // NOT products they submitted on behalf of others (proxy submissions).
      // Strategy: update where owner_id matches (claimed products),
      // OR where user_id matches AND owner_id is null (user's own unclaimed products).
      const { error: err1, count: count1 } = await supabase
        .from("products")
        .update({ proxy_avatar_url: avatarUrl }, { count: "exact" })
        .eq("owner_id", user.id);

      const { error: err2, count: count2 } = await supabase
        .from("products")
        .update({ proxy_avatar_url: avatarUrl }, { count: "exact" })
        .eq("user_id", user.id)
        .is("owner_id", null);

      if (err1) throw err1;
      if (err2) throw err2;

      const totalCount = (count1 ?? 0) + (count2 ?? 0);

      // Invalidate caches
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["my-products"] });

      toast.success(
        `Avatar synced to ${totalCount} product${totalCount !== 1 ? "s" : ""}!`
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
              onChange={handleAvatarChange}
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
