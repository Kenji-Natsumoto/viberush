export function TypographySection() {
  return (
    <section className="mb-20">
      <h2 className="text-2xl font-semibold text-foreground mb-6">
        Typography
      </h2>
      <p className="text-muted-foreground mb-8">
        VibeRush uses Inter as its primary typeface for its clean, modern appearance and excellent readability.
      </p>

      <div className="border border-border rounded-xl overflow-hidden">
        {/* Font Header */}
        <div className="p-6 bg-secondary">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-foreground">Inter</h3>
              <p className="text-sm text-muted-foreground">Primary Typeface</p>
            </div>
            <a
              href="https://fonts.google.com/specimen/Inter"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline"
            >
              Get from Google Fonts →
            </a>
          </div>
        </div>

        {/* Font Weights */}
        <div className="p-6 space-y-6">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Regular (400)</p>
            <p className="text-2xl font-normal text-foreground">
              The quick brown fox jumps over the lazy dog
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Medium (500)</p>
            <p className="text-2xl font-medium text-foreground">
              The quick brown fox jumps over the lazy dog
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Semibold (600)</p>
            <p className="text-2xl font-semibold text-foreground">
              The quick brown fox jumps over the lazy dog
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Bold (700)</p>
            <p className="text-2xl font-bold text-foreground">
              The quick brown fox jumps over the lazy dog
            </p>
          </div>
        </div>
      </div>

      {/* Type Scale */}
      <div className="mt-8 border border-border rounded-xl p-6">
        <h3 className="font-semibold text-foreground mb-6">Type Scale</h3>
        <div className="space-y-4">
          <div className="flex items-baseline gap-4">
            <span className="text-xs text-muted-foreground w-20 shrink-0">4xl / 36px</span>
            <span className="text-4xl font-bold text-foreground">Heading 1</span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="text-xs text-muted-foreground w-20 shrink-0">2xl / 24px</span>
            <span className="text-2xl font-semibold text-foreground">Heading 2</span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="text-xs text-muted-foreground w-20 shrink-0">xl / 20px</span>
            <span className="text-xl font-semibold text-foreground">Heading 3</span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="text-xs text-muted-foreground w-20 shrink-0">lg / 18px</span>
            <span className="text-lg text-foreground">Large Text</span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="text-xs text-muted-foreground w-20 shrink-0">base / 16px</span>
            <span className="text-base text-foreground">Body Text</span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="text-xs text-muted-foreground w-20 shrink-0">sm / 14px</span>
            <span className="text-sm text-muted-foreground">Small Text</span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="text-xs text-muted-foreground w-20 shrink-0">xs / 12px</span>
            <span className="text-xs text-muted-foreground">Extra Small</span>
          </div>
        </div>
      </div>
    </section>
  );
}
