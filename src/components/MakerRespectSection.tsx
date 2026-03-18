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
        <div className="prose prose-sm prose-invert max-w-none [&_p]:text-violet-100/90 [&_p]:leading-[1.85] [&_p]:mb-5 [&_strong]:text-violet-200 [&_em]:text-violet-300/80 [&_h1]:text-violet-100 [&_h2]:text-violet-100 [&_h3]:text-violet-100 [&_h4]:text-violet-100 [&_h2]:mt-7 [&_h3]:mt-5 [&_a]:text-indigo-400 [&_li]:text-violet-100/90 [&_li]:mb-1.5 [&_ul]:mb-5 [&_ol]:mb-5 [&_blockquote]:text-violet-200/70 [&_blockquote]:border-l-violet-500/50 [&_blockquote]:pl-4 [&_blockquote]:my-5 [&_code]:bg-violet-950/60 [&_code]:text-violet-300">
          <ReactMarkdown>{respect.content_md}</ReactMarkdown>
        </div>

        <p className="mt-5 text-right text-xs text-violet-500/50 font-medium tracking-wide">
          — With respect, VibeRush
        </p>
      </div>
    </div>
  );
}
