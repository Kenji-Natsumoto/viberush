import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useProductUpdates } from "@/hooks/useProductUpdates";

/**
 * Public timeline of a product's release updates (MS-VR-7 phase 1, §5-1 A).
 *
 * Renders nothing at all when there are no updates: at launch every product has
 * zero, and an "no updates yet" line on every page would announce that the whole
 * site is empty (requirements §5-1 A / AC-5).
 */
const PREVIEW_COUNT = 3;

const formatDate = (d: string) =>
  new Date(`${d}T00:00:00`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });

export const ProductUpdatesTimeline = ({ productId }: { productId: string }) => {
  const { data: updates } = useProductUpdates(productId);
  const [showAll, setShowAll] = useState(false);

  // Deep links from a maker's own post: /product/:id#update-{id} (§7 / AC-8).
  // The list must be expanded before the browser can reach an entry past the fold.
  const hash = typeof window !== "undefined" ? window.location.hash : "";
  useEffect(() => {
    if (!hash.startsWith("#update-") || !updates?.length) return;
    setShowAll(true);
    const el = document.getElementById(hash.slice(1));
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [hash, updates]);

  if (!updates || updates.length === 0) return null;

  const shown = showAll ? updates : updates.slice(0, PREVIEW_COUNT);

  return (
    <section className="mt-10 pt-8 border-t border-border">
      <div className="flex items-baseline justify-between mb-6">
        <h2 className="text-lg font-bold text-foreground">Updates</h2>
        <span className="text-sm text-muted-foreground">{updates.length}</span>
      </div>

      <div className="space-y-8">
        {shown.map((entry) => (
          <article key={entry.id} id={`update-${entry.id}`} className="scroll-mt-24">
            <time className="text-xs font-mono text-muted-foreground">{formatDate(entry.date)}</time>
            <h3 className="text-base font-semibold text-foreground mt-1 mb-2">{entry.title}</h3>
            <div className="prose prose-sm prose-neutral dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
              <ReactMarkdown
                components={{
                  code: ({ children, className, ...props }) => {
                    const isBlock = className?.includes("language-");
                    if (isBlock) {
                      return (
                        <pre className="bg-muted rounded-md p-4 overflow-x-auto text-xs">
                          <code className={className} {...props}>{children}</code>
                        </pre>
                      );
                    }
                    return (
                      <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono" {...props}>
                        {children}
                      </code>
                    );
                  },
                  img: ({ src, alt }) => (
                    <div className="rounded-lg overflow-hidden border border-border my-4">
                      <img src={src} alt={alt || ""} className="w-full" loading="lazy" />
                    </div>
                  ),
                }}
              >
                {entry.body}
              </ReactMarkdown>
            </div>
          </article>
        ))}
      </div>

      {!showAll && updates.length > PREVIEW_COUNT && (
        <button
          onClick={() => setShowAll(true)}
          className="mt-6 text-sm text-primary hover:underline"
        >
          Show all {updates.length} updates
        </button>
      )}
    </section>
  );
};

export default ProductUpdatesTimeline;
