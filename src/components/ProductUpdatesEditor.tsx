import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  useProductUpdates,
  useCreateProductUpdate,
  useEditProductUpdate,
  UPDATE_TITLE_MAX,
  UPDATE_BODY_MAX,
} from "@/hooks/useProductUpdates";

/**
 * Post and edit release updates (MS-VR-7 phase 1, §5-1 B).
 *
 * Two inputs only — title and body. The date is the day you post; there is no
 * date field on purpose (requirements §6-13). Posting is an explicit button,
 * unlike the per-field autosave on the other tabs, because this is public.
 *
 * This component is only ever rendered for the owner of the product, and the
 * database enforces the same rule independently (§9-2 / AC-6 / AC-7).
 */
const formatDate = (d: string) =>
  new Date(`${d}T00:00:00`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });

export const ProductUpdatesEditor = ({
  productId,
  authorId,
}: {
  productId: string;
  authorId: string;
}) => {
  const { data: updates } = useProductUpdates(productId);
  const create = useCreateProductUpdate(productId);
  const edit = useEditProductUpdate(productId);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");

  const canPost = title.trim().length > 0 && body.trim().length > 0;

  const post = async () => {
    if (!canPost) return;
    await create.mutateAsync({ title: title.trim(), body: body.trim(), authorId });
    setTitle("");
    setBody("");
  };

  const startEdit = (id: string, t: string, b: string) => {
    setEditingId(id);
    setEditTitle(t);
    setEditBody(b);
  };

  const saveEdit = async () => {
    if (!editingId || !editTitle.trim() || !editBody.trim()) return;
    await edit.mutateAsync({ id: editingId, title: editTitle.trim(), body: editBody.trim() });
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground">New update</h3>

        <div className="space-y-2">
          <Label htmlFor="pu-title" className="text-sm font-medium">Title</Label>
          <Input
            id="pu-title"
            value={title}
            maxLength={UPDATE_TITLE_MAX}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Added CSV export"
            className="bg-secondary border-transparent focus:border-border"
          />
          <p className="text-xs text-muted-foreground text-right">{title.length}/{UPDATE_TITLE_MAX}</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="pu-body" className="text-sm font-medium">Body</Label>
          <Textarea
            id="pu-body"
            value={body}
            maxLength={UPDATE_BODY_MAX}
            onChange={(e) => setBody(e.target.value)}
            placeholder="What changed, and why it matters. Markdown works."
            className="bg-secondary border-transparent focus:border-border min-h-[160px]"
          />
          <p className="text-xs text-muted-foreground text-right">{body.length}/{UPDATE_BODY_MAX}</p>
        </div>

        <div className="flex justify-end">
          <Button onClick={post} disabled={!canPost || create.isPending}>
            {create.isPending ? "Posting…" : "Post"}
          </Button>
        </div>
      </div>

      {updates && updates.length > 0 && (
        <div className="border-t border-border pt-6 space-y-4">
          {updates.map((u) => (
            <div key={u.id} className="rounded-md border border-border p-3">
              {editingId === u.id ? (
                <div className="space-y-3">
                  <Input
                    value={editTitle}
                    maxLength={UPDATE_TITLE_MAX}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="bg-secondary border-transparent focus:border-border"
                  />
                  <Textarea
                    value={editBody}
                    maxLength={UPDATE_BODY_MAX}
                    onChange={(e) => setEditBody(e.target.value)}
                    className="bg-secondary border-transparent focus:border-border min-h-[120px]"
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
                    <Button
                      onClick={saveEdit}
                      disabled={!editTitle.trim() || !editBody.trim() || edit.isPending}
                    >
                      {edit.isPending ? "Saving…" : "Save"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-xs font-mono text-muted-foreground">{formatDate(u.date)}</div>
                    <div className="text-sm text-foreground mt-0.5">{u.title}</div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => startEdit(u.id, u.title, u.body)}>
                    Edit
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductUpdatesEditor;
