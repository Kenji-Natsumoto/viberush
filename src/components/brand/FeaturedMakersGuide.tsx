import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export function FeaturedMakersGuide() {
  return (
    <section className="mb-20">
      <h2 className="text-2xl font-semibold text-foreground mb-6">
        Featured Makers Section
      </h2>
      <p className="text-muted-foreground mb-8">
        The Featured Makers section highlights top community members with a warm, inviting design that encourages engagement.
      </p>

      {/* Live Preview */}
      <div className="border border-border rounded-xl overflow-hidden mb-8">
        <div className="p-4 bg-secondary border-b border-border">
          <span className="text-sm font-medium text-foreground">Live Preview</span>
        </div>
        <div className="py-10 px-4 bg-gradient-to-b from-[hsl(35,20%,93%)] to-[hsl(35,18%,90%)] dark:from-[hsl(35,10%,12%)] dark:to-[hsl(35,8%,10%)]">
          <div className="text-center mb-8">
            <span className="inline-block px-3 py-1 text-xs font-medium tracking-wider uppercase text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-3">
              Community
            </span>
            <h3 className="text-xl font-bold text-foreground">
              Featured Makers
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Meet the creators behind the most vibed apps
            </p>
          </div>
          
          <div className="flex justify-center gap-12">
            {["Alice", "Bob", "Carol"].map((name) => (
              <div key={name} className="group flex flex-col items-center gap-3">
                <div className="relative pt-3">
                  <Avatar className="h-20 w-20 ring-[3px] ring-amber-200/80 dark:ring-amber-700/50 bg-background transition-all duration-300 ease-out group-hover:ring-amber-400 dark:group-hover:ring-amber-500 group-hover:-translate-y-2 group-hover:shadow-xl group-hover:shadow-amber-500/20">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`}
                      alt={name}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-amber-100 to-orange-100 text-amber-800">
                      {name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px]">✨</span>
                  </div>
                </div>
                <span className="text-sm font-semibold text-foreground group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Design Specifications */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Background */}
        <div className="border border-border rounded-xl p-6">
          <h4 className="font-semibold text-foreground mb-4">Background Gradient</h4>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-gradient-to-b from-[hsl(35,20%,93%)] to-[hsl(35,18%,90%)] border border-border" />
              <div>
                <p className="font-medium text-foreground">Light Mode</p>
                <p className="text-muted-foreground font-mono text-xs">
                  from: hsl(35, 20%, 93%)<br />
                  to: hsl(35, 18%, 90%)
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-gradient-to-b from-[hsl(35,10%,12%)] to-[hsl(35,8%,10%)] border border-border" />
              <div>
                <p className="font-medium text-foreground">Dark Mode</p>
                <p className="text-muted-foreground font-mono text-xs">
                  from: hsl(35, 10%, 12%)<br />
                  to: hsl(35, 8%, 10%)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Avatar Styling */}
        <div className="border border-border rounded-xl p-6">
          <h4 className="font-semibold text-foreground mb-4">Avatar Styling</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Size: 80×80px (h-20 w-20)</li>
            <li>• Ring: 3px amber-200/80 (dark: amber-700/50)</li>
            <li>• Hover ring: amber-400 (dark: amber-500)</li>
            <li>• Hover lift: -translate-y-2 (8px up)</li>
            <li>• Transition: 300ms ease-out</li>
          </ul>
        </div>

        {/* Badge */}
        <div className="border border-border rounded-xl p-6">
          <h4 className="font-semibold text-foreground mb-4">Community Badge</h4>
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-block px-3 py-1 text-xs font-medium tracking-wider uppercase text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 rounded-full">
              Community
            </span>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Font: xs, medium, uppercase, letter-spacing wider</li>
            <li>• Text: amber-700 (dark: amber-400)</li>
            <li>• Background: amber-100 (dark: amber-900/30)</li>
            <li>• Border radius: full (pill shape)</li>
          </ul>
        </div>

        {/* Sparkle Indicator */}
        <div className="border border-border rounded-xl p-6">
          <h4 className="font-semibold text-foreground mb-4">Sparkle Indicator</h4>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
              <span className="text-xs">✨</span>
            </div>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Size: 20×20px (h-5 w-5)</li>
            <li>• Position: top-right of avatar</li>
            <li>• Gradient: amber-400 → orange-500</li>
            <li>• Shows on hover with scale animation</li>
          </ul>
        </div>
      </div>

      {/* Usage Guidelines */}
      <div className="mt-8 p-6 bg-secondary rounded-xl">
        <h4 className="font-semibold text-foreground mb-4">Usage Guidelines</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Display minimum 3 featured makers at a time</li>
          <li>• Use overflow-visible to allow hover lift animations</li>
          <li>• Add pt-3 padding on avatar wrapper for lift animation space</li>
          <li>• Featured makers are determined by is_featured flag in database</li>
          <li>• Fallback to curated list if fewer than 3 featured in DB</li>
        </ul>
      </div>
    </section>
  );
}
