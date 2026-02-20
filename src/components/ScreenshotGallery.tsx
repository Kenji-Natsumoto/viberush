import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, X, Image as ImageIcon } from "lucide-react";
import type { ProductScreenshot } from "@/hooks/useProductScreenshots";
import { cn } from "@/lib/utils";

interface ScreenshotGalleryProps {
  screenshots: ProductScreenshot[];
}

export function ScreenshotGallery({ screenshots }: ScreenshotGalleryProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.7;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  if (screenshots.length === 0) return null;

  return (
    <>
      <div className="bg-card border border-border rounded-2xl overflow-hidden mb-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-muted-foreground" />
            Screenshots ({screenshots.length})
          </h2>
        </div>

        {/* Horizontal scroll container */}
        <div className="relative group">
          {/* Left arrow */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-background/80 border border-border shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background disabled:hidden"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </button>

          {/* Scrollable area */}
          <div
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto scroll-smooth px-4 py-4 scrollbar-hide"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {screenshots.map((ss, i) => (
              <button
                key={ss.id}
                onClick={() => setLightboxIndex(i)}
                className="flex-shrink-0 rounded-xl border border-border overflow-hidden hover:border-primary/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
                style={{ scrollSnapAlign: "start" }}
              >
                <img
                  src={ss.url}
                  alt={`Screenshot ${i + 1}`}
                  className="h-52 sm:h-64 w-auto object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>

          {/* Right arrow */}
          <button
            onClick={() => scroll("right")}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-background/80 border border-border shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background disabled:hidden"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5 text-foreground" />
          </button>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Close */}
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-background/20 hover:bg-background/40 transition-colors"
          >
            <X className="h-6 w-6 text-white" />
          </button>

          {/* Prev */}
          {lightboxIndex > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(lightboxIndex - 1);
              }}
              className="absolute left-4 p-2 rounded-full bg-background/20 hover:bg-background/40 transition-colors"
            >
              <ChevronLeft className="h-8 w-8 text-white" />
            </button>
          )}

          {/* Image */}
          <img
            src={screenshots[lightboxIndex].url}
            alt={`Screenshot ${lightboxIndex + 1}`}
            className="max-h-[85vh] max-w-[90vw] rounded-xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Next */}
          {lightboxIndex < screenshots.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(lightboxIndex + 1);
              }}
              className="absolute right-4 p-2 rounded-full bg-background/20 hover:bg-background/40 transition-colors"
            >
              <ChevronRight className="h-8 w-8 text-white" />
            </button>
          )}

          {/* Counter */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-sm">
            {lightboxIndex + 1} / {screenshots.length}
          </div>
        </div>
      )}
    </>
  );
}
