import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export function DirectoryCTA() {
  const { data: count } = useQuery({
    queryKey: ['total-ship-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });
      if (error) throw error;
      return count ?? 0;
    },
  });

  return (
    <section className="py-20 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto text-center">
        <Link
          to="/explore"
          className="group relative block rounded-2xl bg-card p-10 sm:p-14 transition-all duration-300 hover:scale-[1.01] overflow-hidden"
        >
          {/* Animated glowing border */}
          <div className="absolute inset-0 rounded-2xl border-glow" />

          {/* Inner content container to sit above the glow */}
          <div className="relative z-10">
            <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground mb-4">
              The Backstage Directory
            </p>

            <h2 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight leading-snug">
              Discover all{" "}
              <span className="tabular-nums">{count > 0 ? `${count}+` : "…"}</span>{" "}
              Products in our Directory
            </h2>

            <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-200">
              Browse now
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
