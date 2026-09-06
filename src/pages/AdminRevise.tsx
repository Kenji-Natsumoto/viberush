import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useIsAdmin } from "@/hooks/useClaim";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Send } from "lucide-react";

/**
 * /admin/revise?key=2026-W37:mon
 *
 * Revision box for the VR LinkedIn posts. Opened from the link at the end of the
 * Discord review message: write one line, hit send. No scrolling.
 * Writes to Supabase `li_revisions` (status=open).
 * The rewrite itself is done by step4_revise_v02.py every 30 minutes — never by hand.
 * The result ("instruction -> what changed") is written back onto the same row below.
 */
type Revision = {
  id: string;
  post_key: string;
  instruction: string;
  status: string;
  depth: string | null;
  result: string | null;
  created_at: string;
  handled_at: string | null;
};

const STATUS_LABEL: Record<string, string> = {
  open: "⏳ Waiting for rewrite (within 30 min)",
  revised: "✅ Rewritten — review message sent",
  blocked: "🛑 Blocked by fact check (draft left unchanged)",
  failed: "❌ Failed",
};

const AdminRevise = () => {
  const { user, loading } = useAuth();
  const isAdmin = useIsAdmin();
  const [params] = useSearchParams();
  const key = (params.get("key") || "").trim();
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: history } = useQuery({
    queryKey: ["li-revisions", key],
    enabled: !!user && isAdmin && !!key,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("li_revisions")
        .select("id,post_key,instruction,status,depth,result,created_at,handled_at")
        .eq("post_key", key)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Revision[];
    },
    refetchInterval: 30 * 1000,
  });

  useEffect(() => {
    document.title = `Revise ${key || ""} | VibeRush`;
  }, [key]);

  // The Supabase session is restored asynchronously. Without this guard a reload
  // flashes "No access" before the user is known.
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header onSubmitClick={() => {}} />
        <div className="container mx-auto px-4 py-16 text-center text-muted-foreground">
          Loading…
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Header onSubmitClick={() => {}} />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">No access</h1>
          <Link to="/auth" className="text-primary hover:underline">Sign in</Link>
        </div>
      </div>
    );
  }

  const submit = async () => {
    const instruction = text.trim();
    if (!key || !instruction) return;
    setSending(true);
    setError(null);
    const { error } = await supabase
      .from("li_revisions")
      .insert({ post_key: key, instruction, created_by: user.id });
    setSending(false);
    if (error) {
      setError(error.message);
      return;
    }
    setText("");
    queryClient.invalidateQueries({ queryKey: ["li-revisions", key] });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onSubmitClick={() => {}} />
      <main className="container mx-auto px-4 py-6 max-w-xl">
        <Link
          to="/admin/analytics"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Analytics
        </Link>
        <h1 className="text-xl font-bold text-foreground mb-1">Revise</h1>
        <p className="text-sm text-muted-foreground mb-4">
          Post: <span className="font-mono text-foreground">{key || "(no key)"}</span>
        </p>
        {!key ? (
          <p className="text-destructive text-sm">
            This URL needs <span className="font-mono">?key=2026-W37:mon</span>. Open it from the link in the Discord review message.
          </p>
        ) : (
          <>
            <textarea
              autoFocus
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="One line. e.g. Open with a question / Match the ranking to the site / Cut the Mockit paragraph"
              className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-muted-foreground">
                The draft is rewritten within 30 minutes and Discord gets "instruction → what changed"
              </span>
              <Button onClick={submit} disabled={sending || !text.trim()}>
                <Send className="w-4 h-4 mr-2" /> Send back
              </Button>
            </div>
            {error && <p className="text-destructive text-sm mt-2">{error}</p>}

            {history && history.length > 0 && (
              <section className="mt-8">
                <h2 className="text-sm font-semibold text-muted-foreground mb-2">Revision history for this post</h2>
                <ul className="space-y-3">
                  {history.map((r) => (
                    <li key={r.id} className="rounded-md border border-border p-3 text-sm">
                      <div className="text-foreground">{r.instruction}</div>
                      <div className="text-muted-foreground mt-1">
                        {STATUS_LABEL[r.status] || r.status}
                        {r.depth ? ` · ${r.depth}` : ""}
                      </div>
                      {r.result && (
                        <div className="mt-1 whitespace-pre-wrap text-foreground/90">{r.result}</div>
                      )}
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(r.created_at).toLocaleString("en-US")}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default AdminRevise;
