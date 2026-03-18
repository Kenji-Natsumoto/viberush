import ReactMarkdown from 'react-markdown';
import { useMakerRespect } from '@/hooks/useCuration';

const StarIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
  </svg>
);

interface Props {
  makerId: string;
}

export function MakerRespectSection({ makerId }: Props) {
  const { data: respect, isLoading } = useMakerRespect(makerId);

  if (isLoading || !respect) return null;

  return (
    <div className="relative mt-8 overflow-hidden rounded-2xl border border-violet-500/30 bg-gradient-to-br from-[#0d0d1a] via-[#0f0a1a] to-[#1a1a2e]">
      {/* Left accent bar */}
      <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-violet-400 via-indigo-400 to-blue-500" />

      {/* Glow overlay */}
      <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(ellipse_at_top_left,_hsl(270,80%,70%),_transparent_70%)]" />

      {/* Header */}
      <div className="relative flex items-center gap-3 border-b border-violet-500/20 px-6 py-4">
        <div className="flex items-center gap-2 text-violet-400">
          <StarIcon />
          <span className="text-xs font-bold tracking-widest uppercase text-violet-400/70">VibeRush</span>
        </div>
        <div className="h-4 w-px bg-violet-500/30" />
        <span className="font-semibold text-violet-100 tracking-wide">Curator's Respect</span>
      </div>

      {/* Body */}
      <div className="relative px-6 py-6">
        <div className="prose prose-sm prose-invert max-w-none
          prose-p:text-violet-100/80 prose-p:leading-relaxed
          prose-strong:text-violet-200 prose-strong:font-semibold
          prose-em:text-violet-300/70
          prose-headings:text-violet-100 prose-headings:font-bold
          prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline
          prose-ul:text-violet-100/80 prose-ol:text-violet-100/80
          prose-li:marker:text-violet-500
          prose-blockquote:border-l-violet-500/50 prose-blockquote:text-violet-200/60
          prose-code:bg-violet-950/60 prose-code:text-violet-300 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
        ">
          <ReactMarkdown>{respect.content_md}</ReactMarkdown>
        </div>

        <p className="mt-5 text-right text-xs text-violet-500/50 font-medium tracking-wide">
          — With respect, VibeRush
        </p>
      </div>
    </div>
  );
}
