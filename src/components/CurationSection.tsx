import ReactMarkdown from 'react-markdown';
import { useProductCuration } from '@/hooks/useCuration';

// VibeRush flame icon (inline SVG)
const FlameIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M12 2C12 2 7 8 7 13a5 5 0 0 0 10 0c0-2-1-4-2-5 0 0 0 3-2 4-1-2-1-4-1-4S12 10 12 2z" fill="currentColor" strokeLinejoin="round"/>
  </svg>
);

interface Props {
  productId: string;
}

export function CurationSection({ productId }: Props) {
  const { data: curation, isLoading } = useProductCuration(productId);

  if (isLoading || !curation) return null;

  return (
    <div className="relative mt-8 overflow-hidden rounded-2xl border border-orange-500/30 bg-gradient-to-br from-[#0d0d1a] via-[#1a1208] to-[#1a1a2e]">
      {/* Left accent bar */}
      <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-orange-400 via-amber-400 to-yellow-500" />

      {/* Subtle noise overlay */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(ellipse_at_top_right,_hsl(30,100%,60%),_transparent_70%)]" />

      {/* Header */}
      <div className="relative flex items-center gap-3 border-b border-orange-500/20 px-6 py-4">
        <div className="flex items-center gap-2 text-orange-400">
          <FlameIcon />
          <span className="text-xs font-bold tracking-widest uppercase text-orange-400/70">VibeRush</span>
        </div>
        <div className="h-4 w-px bg-orange-500/30" />
        <span className="font-semibold text-orange-100 tracking-wide">Curator's Voice</span>
      </div>

      {/* Body */}
      <div className="relative px-6 py-6">
        <div className="prose prose-sm prose-invert max-w-none
          prose-p:text-orange-100/80 prose-p:leading-relaxed
          prose-strong:text-orange-200 prose-strong:font-semibold
          prose-em:text-orange-300/70
          prose-headings:text-orange-100 prose-headings:font-bold
          prose-a:text-amber-400 prose-a:no-underline hover:prose-a:underline
          prose-ul:text-orange-100/80 prose-ol:text-orange-100/80
          prose-li:marker:text-orange-500
          prose-blockquote:border-l-orange-500/50 prose-blockquote:text-orange-200/60
          prose-code:bg-orange-950/60 prose-code:text-orange-300 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
        ">
          <ReactMarkdown>{curation.content_md}</ReactMarkdown>
        </div>

        {curation.video_url && (
          <div className="mt-6 overflow-hidden rounded-xl border border-orange-500/20" style={{ paddingBottom: '56.25%', position: 'relative' }}>
            <iframe
              src={curation.video_url}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
              allowFullScreen
            />
          </div>
        )}

        <p className="mt-5 text-right text-xs text-orange-500/50 font-medium tracking-wide">
          — Curated by VibeRush
        </p>
      </div>
    </div>
  );
}
