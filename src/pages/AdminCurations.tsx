import { useState } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useIsAdmin } from '@/hooks/useClaim';
import { useAuth } from '@/contexts/AuthContext';
import { useProducts } from '@/hooks/useProducts';
import {
  useAllProductCurations,
  useUpsertProductCuration,
  useDeleteProductCuration,
  useAllMakerRespects,
  useAllMakerProfilesSimple,
  useUpsertMakerRespect,
  useDeleteMakerRespect,
} from '@/hooks/useCuration';
import { ArrowLeft, Pencil, Trash2, Save, Eye, EyeOff, Plus, Search, Flame, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Tab = 'products' | 'makers';

// ── Product Curations Tab ───────────────────────────────────────────────────
function ProductCurationsTab() {
  const { toast } = useToast();
  const { products } = useProducts();
  const { data: curations = [] } = useAllProductCurations();
  const upsert = useUpsertProductCuration();
  const del = useDeleteProductCuration();

  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null); // product_id being edited
  const [draft, setDraft] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [preview, setPreview] = useState(false);

  const curationMap = Object.fromEntries(curations.map((c) => [c.product_id, c]));

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const startEdit = (productId: string) => {
    const existing = curationMap[productId];
    setDraft(existing?.content_md ?? '');
    setVideoUrl(existing?.video_url ?? '');
    setPreview(false);
    setEditingId(productId);
  };

  const handleSave = async () => {
    if (!editingId) return;
    try {
      await upsert.mutateAsync({ product_id: editingId, content_md: draft, video_url: videoUrl || undefined });
      toast({ title: 'Curation saved ✓' });
      setEditingId(null);
    } catch (e) {
      toast({ title: 'Error', description: String(e), variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this curation?')) return;
    try {
      await del.mutateAsync(id);
      toast({ title: 'Deleted' });
      setEditingId(null);
    } catch (e) {
      toast({ title: 'Error', description: String(e), variant: 'destructive' });
    }
  };

  return (
    <div>
      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search products…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Product list */}
      <div className="space-y-2 mb-6">
        {filtered.map((p) => {
          const hasCuration = !!curationMap[p.id];
          const isEditing = editingId === p.id;
          return (
            <div key={p.id} className="rounded-xl border border-border bg-card overflow-hidden">
              {/* Row */}
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img src={p.iconUrl} alt={p.name} className="w-8 h-8 rounded-lg object-cover border border-border flex-shrink-0"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  <span className="font-medium text-sm text-foreground truncate">{p.name}</span>
                  {hasCuration && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-400 font-medium flex-shrink-0">Curated</span>
                  )}
                </div>
                <Button
                  variant={isEditing ? 'default' : 'outline'}
                  size="sm"
                  className="gap-1.5 flex-shrink-0"
                  onClick={() => isEditing ? setEditingId(null) : startEdit(p.id)}
                >
                  {isEditing ? 'Close' : hasCuration ? <><Pencil className="h-3.5 w-3.5" /> Edit</> : <><Plus className="h-3.5 w-3.5" /> Add</>}
                </Button>
              </div>

              {/* Inline editor */}
              {isEditing && (
                <div className="border-t border-border px-4 py-4 bg-secondary/30 space-y-4">
                  {/* Toolbar */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground font-medium">Markdown · Curator's Voice</span>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="gap-1.5 h-7 text-xs" onClick={() => setPreview(!preview)}>
                        {preview ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        {preview ? 'Edit' : 'Preview'}
                      </Button>
                      {hasCuration && (
                        <Button variant="ghost" size="sm" className="gap-1.5 h-7 text-xs text-destructive hover:text-destructive"
                          onClick={() => handleDelete(curationMap[p.id].id)}>
                          <Trash2 className="h-3 w-3" /> Delete
                        </Button>
                      )}
                      <Button size="sm" className="gap-1.5 h-7 text-xs" onClick={handleSave} disabled={upsert.isPending}>
                        <Save className="h-3 w-3" /> Save
                      </Button>
                    </div>
                  </div>

                  {preview ? (
                    <div className="min-h-[140px] rounded-lg border border-border bg-background p-4 prose prose-sm prose-invert max-w-none">
                      <ReactMarkdown>{draft || '_No content_'}</ReactMarkdown>
                    </div>
                  ) : (
                    <Textarea
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder="Write your curation in Markdown…&#10;&#10;**Bold**, *italic*, ## Headings, > Blockquotes all work."
                      className="min-h-[180px] font-mono text-sm resize-y"
                    />
                  )}

                  <Input
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="Video embed URL (optional, e.g. YouTube embed URL)"
                    className="text-sm"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Maker Respects Tab ─────────────────────────────────────────────────────
function MakerRespectsTab() {
  const { toast } = useToast();
  const { data: makers = [] } = useAllMakerProfilesSimple();
  const { data: respects = [] } = useAllMakerRespects();
  const upsert = useUpsertMakerRespect();
  const del = useDeleteMakerRespect();

  const [search, setSearch] = useState('');
  // editingId: maker UUID or "proxy:username"
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [preview, setPreview] = useState(false);
  const [newProxyName, setNewProxyName] = useState('');

  const respectByMakerId = Object.fromEntries(
    respects.filter((r) => r.maker_id).map((r) => [r.maker_id!, r])
  );
  const respectByProxy = Object.fromEntries(
    respects.filter((r) => r.proxy_creator_name).map((r) => [r.proxy_creator_name!.toLowerCase(), r])
  );
  const proxyRespects = respects.filter((r) => !r.maker_id && r.proxy_creator_name);

  const filtered = makers.filter((m) =>
    (m.username + (m.display_name ?? '')).toLowerCase().includes(search.toLowerCase())
  );

  const startEditMaker = (makerId: string) => {
    setDraft(respectByMakerId[makerId]?.content_md ?? '');
    setPreview(false);
    setEditingId(makerId);
  };

  const startEditProxy = (proxyName: string) => {
    setDraft(respectByProxy[proxyName.toLowerCase()]?.content_md ?? '');
    setPreview(false);
    setEditingId(`proxy:${proxyName}`);
  };

  const handleSave = async () => {
    if (!editingId) return;
    try {
      if (editingId.startsWith('proxy:')) {
        await upsert.mutateAsync({ proxy_creator_name: editingId.slice(6), content_md: draft });
      } else {
        await upsert.mutateAsync({ maker_id: editingId, content_md: draft });
      }
      toast({ title: 'Respect saved ✓' });
      setEditingId(null);
    } catch (e) {
      toast({ title: 'Error', description: String(e), variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this respect entry?')) return;
    try {
      await del.mutateAsync(id);
      toast({ title: 'Deleted' });
      setEditingId(null);
    } catch (e) {
      toast({ title: 'Error', description: String(e), variant: 'destructive' });
    }
  };

  const handleAddProxy = () => {
    const name = newProxyName.trim();
    if (!name) return;
    setNewProxyName('');
    startEditProxy(name);
  };

  return (
    <div>
      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search makers…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Real profiles */}
      <div className="space-y-2 mb-8">
        {filtered.map((m) => {
          const hasRespect = !!respectByMakerId[m.id];
          const isEditing = editingId === m.id;
          return (
            <div key={m.id} className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-medium text-sm text-foreground">
                    {m.display_name || m.username}
                  </span>
                  <span className="text-xs text-muted-foreground">@{m.username}</span>
                  {hasRespect && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-400 font-medium flex-shrink-0">Respected</span>
                  )}
                </div>
                <Button
                  variant={isEditing ? 'default' : 'outline'}
                  size="sm"
                  className="gap-1.5 flex-shrink-0"
                  onClick={() => isEditing ? setEditingId(null) : startEditMaker(m.id)}
                >
                  {isEditing ? 'Close' : hasRespect ? <><Pencil className="h-3.5 w-3.5" /> Edit</> : <><Plus className="h-3.5 w-3.5" /> Add</>}
                </Button>
              </div>

              {isEditing && (
                <RespectEditor
                  draft={draft}
                  setDraft={setDraft}
                  preview={preview}
                  setPreview={setPreview}
                  hasExisting={hasRespect}
                  existingId={hasRespect ? respectByMakerId[m.id].id : undefined}
                  onSave={handleSave}
                  onDelete={handleDelete}
                  isPending={upsert.isPending}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Virtual / Unclaimed profiles section */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
          <Star className="h-4 w-4 text-violet-400" />
          Virtual Profiles (Unclaimed)
        </h3>

        {/* Existing proxy respects */}
        <div className="space-y-2 mb-4">
          {proxyRespects.map((r) => {
            const name = r.proxy_creator_name!;
            const isEditing = editingId === `proxy:${name}`;
            return (
              <div key={r.id} className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-medium text-sm text-foreground">{name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-400 font-medium flex-shrink-0">Virtual · Respected</span>
                  </div>
                  <Button
                    variant={isEditing ? 'default' : 'outline'}
                    size="sm"
                    className="gap-1.5 flex-shrink-0"
                    onClick={() => isEditing ? setEditingId(null) : startEditProxy(name)}
                  >
                    {isEditing ? 'Close' : <><Pencil className="h-3.5 w-3.5" /> Edit</>}
                  </Button>
                </div>
                {isEditing && (
                  <RespectEditor
                    draft={draft}
                    setDraft={setDraft}
                    preview={preview}
                    setPreview={setPreview}
                    hasExisting={true}
                    existingId={r.id}
                    onSave={handleSave}
                    onDelete={handleDelete}
                    isPending={upsert.isPending}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Add new virtual profile */}
        <div className="flex gap-2">
          <Input
            placeholder="Creator name (e.g. Max Musing)"
            value={newProxyName}
            onChange={(e) => setNewProxyName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddProxy()}
            className="text-sm"
          />
          <Button size="sm" variant="outline" className="gap-1.5 flex-shrink-0" onClick={handleAddProxy}>
            <Plus className="h-3.5 w-3.5" /> Add Virtual
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Shared inline editor ─────────────────────────────────────────────────────
function RespectEditor({
  draft, setDraft, preview, setPreview,
  hasExisting, existingId, onSave, onDelete, isPending,
}: {
  draft: string;
  setDraft: (v: string) => void;
  preview: boolean;
  setPreview: (v: boolean) => void;
  hasExisting: boolean;
  existingId?: string;
  onSave: () => void;
  onDelete: (id: string) => void;
  isPending: boolean;
}) {
  return (
    <div className="border-t border-border px-4 py-4 bg-secondary/30 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground font-medium">Markdown · Curator's Respect</span>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="gap-1.5 h-7 text-xs" onClick={() => setPreview(!preview)}>
            {preview ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            {preview ? 'Edit' : 'Preview'}
          </Button>
          {hasExisting && existingId && (
            <Button variant="ghost" size="sm" className="gap-1.5 h-7 text-xs text-destructive hover:text-destructive"
              onClick={() => onDelete(existingId)}>
              <Trash2 className="h-3 w-3" /> Delete
            </Button>
          )}
          <Button size="sm" className="gap-1.5 h-7 text-xs" onClick={onSave} disabled={isPending}>
            <Save className="h-3 w-3" /> Save
          </Button>
        </div>
      </div>

      {preview ? (
        <div className="min-h-[140px] rounded-lg border border-border bg-background p-4 prose prose-sm prose-invert max-w-none">
          <ReactMarkdown>{draft || '_No content_'}</ReactMarkdown>
        </div>
      ) : (
        <Textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Write your respect message in Markdown…"
          className="min-h-[180px] font-mono text-sm resize-y"
        />
      )}
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────────────────────
const AdminCurations = () => {
  const { user } = useAuth();
  const isAdmin = useIsAdmin();
  const [tab, setTab] = useState<Tab>('products');

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Header onSubmitClick={() => {}} />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">アクセス権限がありません</h1>
          <Link to="/" className="text-primary hover:underline">← ホームへ戻る</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onSubmitClick={() => {}} />
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-1">Curation & Respect</h1>
          <p className="text-sm text-muted-foreground">
            特別に認めたプロダクトとMakerへの熱量を込めた記事を管理します。
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-secondary/50 rounded-xl p-1 mb-6">
          <button
            onClick={() => setTab('products')}
            className={`flex-1 flex items-center justify-center gap-2 text-sm font-medium py-2.5 rounded-lg transition-colors ${
              tab === 'products'
                ? 'bg-card text-foreground shadow-sm border border-border'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Flame className="h-4 w-4 text-orange-400" />
            Curator's Voice
          </button>
          <button
            onClick={() => setTab('makers')}
            className={`flex-1 flex items-center justify-center gap-2 text-sm font-medium py-2.5 rounded-lg transition-colors ${
              tab === 'makers'
                ? 'bg-card text-foreground shadow-sm border border-border'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Star className="h-4 w-4 text-violet-400" />
            Curator's Respect
          </button>
        </div>

        {tab === 'products' ? <ProductCurationsTab /> : <MakerRespectsTab />}
      </main>
    </div>
  );
};

export default AdminCurations;
