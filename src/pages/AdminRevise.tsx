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
 * VR LI（LinkedIn 便）の差し戻し。Discord のレビュー便に貼られたリンクから開き、
 * 一言書いて送るだけ。スクロール無し。書き先は Supabase `li_revisions`（status=open）。
 * 改稿するのは 30 分毎の step4_revise_v02.py（セッションは手で直さない）。
 * 結果（指示 → 変えた点）は同じ行に書き戻され、下の履歴に出る。
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
  open: "⏳ 改稿待ち（30分以内）",
  revised: "✅ 改稿済み・再レビュー便を送信",
  blocked: "🛑 照合で止まった（原稿は変えていない）",
  failed: "❌ 失敗",
};

const AdminRevise = () => {
  const { user } = useAuth();
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
    document.title = `差し戻し ${key || ""} | VibeRush`;
  }, [key]);

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Header onSubmitClick={() => {}} />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">アクセス権限がありません</h1>
          <Link to="/auth" className="text-primary hover:underline">ログインする</Link>
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
        <h1 className="text-xl font-bold text-foreground mb-1">差し戻し</h1>
        <p className="text-sm text-muted-foreground mb-4">
          便: <span className="font-mono text-foreground">{key || "（key が無い）"}</span>
        </p>
        {!key ? (
          <p className="text-destructive text-sm">
            URL に <span className="font-mono">?key=2026-W37:mon</span> が要ります。Discord のレビュー便のリンクから開いてください。
          </p>
        ) : (
          <>
            <textarea
              autoFocus
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="一言で。例: 冒頭を問いかけに／順位はサイト表示に合わせて／Mockit の段落を削る"
              className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-muted-foreground">
                送ると 30 分以内に改稿され、Discord に「指示 → 変えた点」が届きます
              </span>
              <Button onClick={submit} disabled={sending || !text.trim()}>
                <Send className="w-4 h-4 mr-2" /> 差し戻す
              </Button>
            </div>
            {error && <p className="text-destructive text-sm mt-2">{error}</p>}

            {history && history.length > 0 && (
              <section className="mt-8">
                <h2 className="text-sm font-semibold text-muted-foreground mb-2">この便の差し戻し履歴</h2>
                <ul className="space-y-3">
                  {history.map((r) => (
                    <li key={r.id} className="rounded-md border border-border p-3 text-sm">
                      <div className="text-foreground">{r.instruction}</div>
                      <div className="text-muted-foreground mt-1">
                        {STATUS_LABEL[r.status] || r.status}
                        {r.depth ? ` · 分類 ${r.depth}` : ""}
                      </div>
                      {r.result && (
                        <div className="mt-1 whitespace-pre-wrap text-foreground/90">{r.result}</div>
                      )}
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(r.created_at).toLocaleString("ja-JP")}
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
