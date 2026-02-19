import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import { Flame, BookOpen } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useChronicles } from '@/hooks/useChronicles';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const CATEGORY_COLORS: Record<string, string> = {
  Feature: 'bg-primary/10 text-primary',
  Infrastructure: 'bg-blue-500/10 text-blue-600',
  'Community Driven': 'bg-orange-500/10 text-orange-600',
  Community: 'bg-orange-500/10 text-orange-600',
};

export default function Chronicles() {
  const { data: entries = [], isLoading } = useChronicles();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header onSubmitClick={() => {}} />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border">
          {/* Background gradient — Blue × Orange homage */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/8 via-transparent to-orange-500/8 pointer-events-none" />

          <div className="max-w-3xl mx-auto px-4 py-16 sm:py-24 text-center relative z-10">
            {/* Playful icon cluster */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg -ml-2 -mt-4">
                <Flame className="h-5 w-5 text-white" />
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Changelog{' '}
              <span className="text-muted-foreground font-normal">
                –VibeRush Chronicles–
              </span>
            </h1>
            <p className="mt-3 text-sm text-muted-foreground italic font-serif">
              "This page will eventually become 'Legendary Bomber'"
            </p>
          </div>
        </section>

        {/* Timeline */}
        <section className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
          {isLoading && (
            <div className="space-y-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-64" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ))}
            </div>
          )}

          {!isLoading && entries.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No chronicles yet. The story begins soon.</p>
            </div>
          )}

          <div className="space-y-12">
            {entries.map((entry) => (
              <article key={entry.id} className="group relative">
                {/* Timeline dot */}
                <div className="absolute -left-[29px] top-1.5 hidden sm:block">
                  <div className="h-3 w-3 rounded-full border-2 border-border bg-background group-hover:border-primary transition-colors" />
                </div>

                {/* Meta */}
                <div className="flex items-center gap-3 mb-2">
                  <time className="text-xs font-medium text-muted-foreground tabular-nums">
                    {format(new Date(entry.date), 'MMM d, yyyy')}
                  </time>
                  <Badge
                    variant="secondary"
                    className={`text-[10px] font-medium uppercase tracking-wider ${
                      CATEGORY_COLORS[entry.category] || 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {entry.category}
                  </Badge>
                </div>

                {/* Title */}
                <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-3 leading-snug">
                  {entry.title}
                </h2>

                {/* Illustration */}
                {entry.illustration_url && (
                  <div className="mb-4 rounded-lg overflow-hidden border border-border">
                    <AspectRatio ratio={16 / 9}>
                      <img
                        src={entry.illustration_url}
                        alt={entry.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </AspectRatio>
                  </div>
                )}

                {/* Content — Markdown */}
                <div className="prose prose-sm prose-neutral dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                  <ReactMarkdown
                    components={{
                      code: ({ children, className, ...props }) => {
                        const isBlock = className?.includes('language-');
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
                          <img src={src} alt={alt || ''} className="w-full" loading="lazy" />
                        </div>
                      ),
                    }}
                  >
                    {entry.content}
                  </ReactMarkdown>
                </div>

                {/* Divider */}
                <div className="mt-8 border-b border-border/50" />
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
