import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { User, Check, Loader2, Globe, Github, Linkedin } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { ImageUpload } from "@/components/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

// X icon
const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

interface MakerProfileRow {
  id: string;
  username: string;
  bio: string | null;
  avatar_url: string | null;
  x_url: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  portfolio_url: string | null;
}

function useMakerProfileForEdit() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["maker-profile-edit", user?.id],
    queryFn: async (): Promise<MakerProfileRow | null> => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("maker_profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function MakerProfileEditor() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: existing, isLoading } = useMakerProfileForEdit();

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [xUrl, setXUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  const isNew = !existing;

  // Populate form when data loads
  useEffect(() => {
    if (existing) {
      setUsername(existing.username || "");
      setBio(existing.bio || "");
      setAvatarUrl(existing.avatar_url || "");
      setXUrl(existing.x_url || "");
      setLinkedinUrl(existing.linkedin_url || "");
      setGithubUrl(existing.github_url || "");
      setPortfolioUrl(existing.portfolio_url || "");
    }
  }, [existing]);

  const handleSave = async () => {
    if (!user) return;
    if (!username.trim()) {
      toast.error("Username is required");
      return;
    }

    // Basic username validation
    if (!/^[a-zA-Z0-9_-]+$/.test(username.trim())) {
      toast.error("Username can only contain letters, numbers, hyphens, and underscores");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        id: user.id,
        username: username.trim().toLowerCase(),
        bio: bio.trim() || null,
        avatar_url: avatarUrl.trim() || null,
        x_url: xUrl.trim() || null,
        linkedin_url: linkedinUrl.trim() || null,
        github_url: githubUrl.trim() || null,
        portfolio_url: portfolioUrl.trim() || null,
      };

      if (isNew) {
        const { error } = await supabase.from("maker_profiles").insert(payload);
        if (error) {
          if (error.code === "23505") {
            toast.error("This username is already taken. Please choose another.");
          } else {
            throw error;
          }
          return;
        }
        toast.success("Maker profile created! 🎉");
      } else {
        const { id, ...updatePayload } = payload;
        const { error } = await supabase
          .from("maker_profiles")
          .update(updatePayload)
          .eq("id", user.id);
        if (error) {
          if (error.code === "23505") {
            toast.error("This username is already taken. Please choose another.");
          } else {
            throw error;
          }
          return;
        }
        toast.success("Profile updated!");
      }

      // Also sync avatar to user_metadata for product display
      if (avatarUrl.trim()) {
        await supabase.auth.updateUser({
          data: { global_avatar_url: avatarUrl.trim() },
        });
      }

      queryClient.invalidateQueries({ queryKey: ["maker-profile-edit"] });
      queryClient.invalidateQueries({ queryKey: ["maker-profile"] });
      queryClient.invalidateQueries({ queryKey: ["maker-username"] });
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 3000);
    } catch (err: any) {
      toast.error(err.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-5 bg-card border border-border rounded-2xl flex items-center gap-3">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Loading profile...</span>
      </div>
    );
  }

  const defaultAvatar = user
    ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`
    : "";
  const displayAvatar = avatarUrl || defaultAvatar;

  return (
    <div className="p-5 bg-card border border-border rounded-2xl space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <User className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-foreground">
            {isNew ? "Create Maker Profile" : "Edit Maker Profile"}
          </h2>
          <p className="text-xs text-muted-foreground">
            {isNew
              ? "Set up your public profile to showcase your builds."
              : "Update your public maker identity."}
          </p>
        </div>
      </div>

      {/* Avatar */}
      <div className="flex items-start gap-4">
        <img
          src={displayAvatar}
          alt="Avatar"
          className="h-16 w-16 rounded-full object-cover border-2 border-border shadow-sm flex-shrink-0"
          onError={(e) => {
            e.currentTarget.src = defaultAvatar;
          }}
        />
        <div className="flex-1 space-y-1.5">
          <Label className="text-sm font-medium">Avatar</Label>
          <ImageUpload
            value={avatarUrl}
            onChange={setAvatarUrl}
            placeholder="https://... or upload"
          />
        </div>
      </div>

      {/* Username */}
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">
          Username <span className="text-destructive">*</span>
        </Label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">@</span>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="your_username"
            disabled={!isNew} // Can't change username after creation
            className="flex-1"
          />
        </div>
        {!isNew && (
          <p className="text-xs text-muted-foreground">Username cannot be changed after creation.</p>
        )}
      </div>

      {/* Bio */}
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Bio</Label>
        <Textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell the world what you build..."
          rows={3}
          className="resize-none"
        />
      </div>

      {/* Social Links */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-muted-foreground">Social Links</Label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs flex items-center gap-1.5">
              <XIcon className="h-3 w-3" /> X (Twitter)
            </Label>
            <Input
              value={xUrl}
              onChange={(e) => setXUrl(e.target.value)}
              placeholder="https://x.com/handle"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs flex items-center gap-1.5">
              <Linkedin className="h-3 w-3" /> LinkedIn
            </Label>
            <Input
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://linkedin.com/in/profile"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs flex items-center gap-1.5">
              <Github className="h-3 w-3" /> GitHub
            </Label>
            <Input
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/username"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs flex items-center gap-1.5">
              <Globe className="h-3 w-3" /> Portfolio
            </Label>
            <Input
              value={portfolioUrl}
              onChange={(e) => setPortfolioUrl(e.target.value)}
              placeholder="https://your-awesome-site.com"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center gap-3 pt-1">
        <Button
          onClick={handleSave}
          disabled={saving || !username.trim()}
          className="gap-2"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : justSaved ? (
            <Check className="h-4 w-4" />
          ) : null}
          {saving ? "Saving..." : justSaved ? "Saved!" : isNew ? "Create Profile" : "Save Changes"}
        </Button>
        {existing && (
          <a
            href={`/maker/@${existing.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline"
          >
            View public profile →
          </a>
        )}
      </div>
    </div>
  );
}
