import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Plus, Pencil, Trash2, BookOpen, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  useChronicles,
  useCreateChronicle,
  useUpdateChronicle,
  useDeleteChronicle,
  useIsAdmin,
  type Chronicle,
  type ChronicleInput,
} from '@/hooks/useChronicles';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ImageUpload } from '@/components/ImageUpload';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ReactMarkdown from 'react-markdown';

const CATEGORIES = ['Feature', 'Infrastructure', 'Community Driven', 'Design', 'Security', 'Performance'];

const emptyForm: ChronicleInput = {
  date: new Date().toISOString().split('T')[0],
  title: '',
  category: 'Feature',
  content: '',
  illustration_url: null,
};

export default function ChroniclesAdmin() {
  const { user, loading: authLoading } = useAuth();
  const isAdmin = useIsAdmin();
  const { data: entries = [], isLoading } = useChronicles();

  const createMutation = useCreateChronicle();
  const updateMutation = useUpdateChronicle();
  const deleteMutation = useDeleteChronicle();

  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ChronicleInput>(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  if (!authLoading && (!user || !isAdmin)) {
    return <Navigate to="/dashboard" replace />;
  }

  const openNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setPreviewMode(false);
    setEditorOpen(true);
  };

  const openEdit = (entry: Chronicle) => {
    setEditingId(entry.id);
    setForm({
      date: entry.date,
      title: entry.title,
      category: entry.category,
      content: entry.content,
      illustration_url: entry.illustration_url,
    });
    setPreviewMode(false);
    setEditorOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.content.trim()) return;

    if (editingId) {
      await updateMutation.mutateAsync({ id: editingId, ...form });
    } else {
      await createMutation.mutateAsync(form);
    }
    setEditorOpen(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteMutation.mutateAsync(deleteTarget);
    setDeleteTarget(null);
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header onSubmitClick={() => {}} />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-12">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-semibold text-foreground tracking-tight flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Manage Chronicles
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Create, edit, and manage changelog entries.
            </p>
          </div>
          <Button onClick={openNew} className="gap-1.5">
            <Plus className="h-4 w-4" />
            New Entry
          </Button>
        </div>

        {/* Loading */}
        {(isLoading || authLoading) && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}><CardContent className="p-5"><Skeleton className="h-16 w-full" /></CardContent></Card>
            ))}
          </div>
        )}

        {/* Empty */}
        {!isLoading && entries.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground mb-4">No entries yet.</p>
            <Button onClick={openNew} variant="outline" className="gap-1.5">
              <Plus className="h-4 w-4" /> Create First Entry
            </Button>
          </div>
        )}

        {/* Entries List */}
        <div className="space-y-3">
          {entries.map((entry) => (
            <Card key={entry.id} className="border border-border hover:shadow-card-hover transition-shadow">
              <CardContent className="p-5 flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <time className="text-xs text-muted-foreground tabular-nums">
                      {format(new Date(entry.date), 'yyyy-MM-dd')}
                    </time>
                    <Badge variant="secondary" className="text-[10px]">
                      {entry.category}
                    </Badge>
                  </div>
                  <h3 className="text-sm font-medium text-foreground truncate">{entry.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                    {entry.content.slice(0, 120)}...
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(entry)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => setDeleteTarget(entry.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <Footer />

      {/* Editor Dialog */}
      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Entry' : 'New Chronicle Entry'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            {/* Date */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
              />
            </div>

            {/* Title */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="[Update] Feature name..."
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
              />
            </div>

            {/* Category */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Category</label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Illustration */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Illustration (16:9)
              </label>
              <ImageUpload
                value={form.illustration_url || ''}
                onChange={(url) => setForm({ ...form, illustration_url: url || null })}
                placeholder="https://... or upload"
              />
            </div>

            {/* Content with preview toggle */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-muted-foreground">Content (Markdown)</label>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1 text-xs"
                  onClick={() => setPreviewMode(!previewMode)}
                >
                  <Eye className="h-3 w-3" />
                  {previewMode ? 'Edit' : 'Preview'}
                </Button>
              </div>
              {previewMode ? (
                <div className="min-h-[200px] rounded-md border border-input bg-background p-4 prose prose-sm prose-neutral dark:prose-invert max-w-none">
                  <ReactMarkdown>{form.content}</ReactMarkdown>
                </div>
              ) : (
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Write in Markdown..."
                  className="w-full min-h-[200px] rounded-md border border-input bg-background px-3 py-2 text-sm font-mono resize-y"
                />
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setEditorOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving || !form.title.trim() || !form.content.trim()}>
                {isSaving ? 'Saving...' : editingId ? 'Update' : 'Publish'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this entry?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The chronicle entry will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
