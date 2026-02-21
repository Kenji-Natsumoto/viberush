import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Share2, Heart, Zap, Calendar, Users, Globe, Github, Linkedin, Rocket } from 'lucide-react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ToolBadge } from '@/components/ToolBadge';
import { useMakerProfile } from '@/hooks/useMakerProfile';
import { getProductIconUrl } from '@/lib/iconUtils';
import type { Product } from '@/types/database';

// X icon
const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// ── Featured Product Card (Crown Jewel) ──
function FeaturedProductCard({ product }: { product: Product }) {
  return (
    <Link to={`/product/${product.id}`} className="block group">
      <div className="relative overflow-hidden rounded-2xl border-2 border-[hsl(var(--upvote))] bg-card/80 backdrop-blur-md transition-all duration-300 hover:shadow-lg hover:shadow-[hsl(var(--upvote)/0.15)]">
        {/* Crown badge */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full bg-[hsl(var(--upvote))] text-[hsl(var(--upvote-foreground))] text-xs font-bold">
          👑 Crown Jewel
        </div>

        {product.bannerUrl && (
          <div className="w-full overflow-hidden" style={{ aspectRatio: '1584 / 396' }}>
            <img src={product.bannerUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
        )}

        <div className="p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <img
              src={product.iconUrl}
              alt={product.name}
              className="w-16 h-16 rounded-xl object-cover border border-border"
              onError={(e) => { e.currentTarget.src = getProductIconUrl(product.name); }}
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-foreground group-hover:text-[hsl(var(--upvote))] transition-colors truncate">{product.name}</h3>
              {product.tagline && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{product.tagline}</p>}
              <div className="flex flex-wrap gap-1 mt-3">
                {product.tools.slice(0, 4).map((tool) => <ToolBadge key={tool} tool={tool} />)}
              </div>
            </div>
            <div className="flex flex-col items-center gap-1 text-muted-foreground">
              <Heart className="h-4 w-4" />
              <span className="text-sm font-semibold">{product.votes}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── Product Grid Card ──
function ProductGridCard({ product }: { product: Product }) {
  return (
    <Link to={`/product/${product.id}`} className="block group">
      <div className="bg-card/60 backdrop-blur-sm border border-border rounded-xl overflow-hidden transition-all duration-200 hover:shadow-card-hover hover:border-muted-foreground/20 h-full">
        {product.bannerUrl && (
          <div className="w-full overflow-hidden" style={{ aspectRatio: '16/9' }}>
            <img src={product.bannerUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          </div>
        )}
        <div className="p-4">
          <div className="flex items-start gap-3">
            <img
              src={product.iconUrl}
              alt={product.name}
              className="w-10 h-10 rounded-lg object-cover border border-border flex-shrink-0"
              onError={(e) => { e.currentTarget.src = getProductIconUrl(product.name); }}
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-foreground truncate">{product.name}</h4>
              {product.tagline && <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{product.tagline}</p>}
            </div>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
            <div className="flex flex-wrap gap-1">
              {product.tools.slice(0, 2).map((tool) => <ToolBadge key={tool} tool={tool} />)}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Heart className="h-3 w-3" />
              <span>{product.votes}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── Stat Pill ──
function StatPill({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | number }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/80 backdrop-blur-sm border border-border text-sm">
      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground">{value}</span>
    </div>
  );
}

// ── Empty State ──
function EmptyState() {
  return (
    <div className="text-center py-16 px-6">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary mb-4">
        <Rocket className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">Ready to Build</h3>
      <p className="text-muted-foreground max-w-md mx-auto">
        This maker hasn't shipped any products yet. Their first SHIP is on the way! 🚀
      </p>
    </div>
  );
}

// ── Loading Skeleton ──
function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <Header onSubmitClick={() => {}} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Skeleton className="h-5 w-32 mb-8" />
        <div className="text-center mb-8">
          <Skeleton className="w-24 h-24 rounded-full mx-auto mb-4" />
          <Skeleton className="h-8 w-48 mx-auto mb-2" />
          <Skeleton className="h-4 w-64 mx-auto mb-4" />
          <div className="flex gap-2 justify-center"><Skeleton className="h-8 w-24" /><Skeleton className="h-8 w-24" /></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-48 rounded-xl" />)}
        </div>
      </main>
    </div>
  );
}

// ── Main Page ──
const MakerProfile = () => {
  const { username } = useParams<{ username: string }>();
  const cleanUsername = username?.replace('@', '');
  const { data, isLoading, error } = useMakerProfile(cleanUsername);

  const handleShare = () => {
    const url = window.location.href;
    const text = data
      ? `Check out @${data.profile.username}'s builds on VibeRush 🚀`
      : 'Check out this maker on VibeRush!';
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
  };

  if (isLoading) return <ProfileSkeleton />;

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background">
        <Header onSubmitClick={() => {}} />
        <main className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Maker Not Found</h1>
          <p className="text-muted-foreground mb-6">This maker profile doesn't exist yet.</p>
          <Link to="/" className="text-primary hover:underline">← Back to Home</Link>
        </main>
      </div>
    );
  }

  const { profile, products, featuredProduct } = data;
  const isArchitect = products.length >= 3;
  const nonFeaturedProducts = featuredProduct
    ? products.filter((p) => p.id !== featuredProduct.id)
    : products;
  const defaultAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.id}`;
  const joinDate = new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });

  // Dynamic SEO (document.title)
  document.title = `${profile.username} — Maker Profile | VibeRush`;

  return (
    <div className="min-h-screen bg-background">
      {/* SEO meta tags */}
      <MetaTags profile={profile} productCount={products.length} />

      <Header onSubmitClick={() => {}} />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back */}
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        {/* ── Profile Header (glassmorphism) ── */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-md mb-8">
          {/* Subtle gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[hsl(220,80%,50%,0.06)] to-[hsl(16,100%,60%,0.06)]" />

          <div className="relative p-6 sm:p-8 text-center">
            {/* Avatar */}
            <img
              src={profile.avatarUrl || defaultAvatar}
              alt={profile.username}
              className="w-24 h-24 rounded-full border-4 border-background shadow-lg mx-auto mb-4 object-cover"
              onError={(e) => { e.currentTarget.src = defaultAvatar; }}
            />

            {/* Name & username */}
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
              @{profile.username}
            </h1>

            {/* Lineage badge */}
            {profile.invitedByUsername && (
              <Link
                to={`/maker/@${profile.invitedByUsername}`}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mt-1"
              >
                <Users className="h-3 w-3" />
                Invited by <span className="font-medium text-foreground">@{profile.invitedByUsername}</span>
              </Link>
            )}

            {/* Bio */}
            {profile.bio && (
              <p className="text-muted-foreground max-w-lg mx-auto mt-3 leading-relaxed">{profile.bio}</p>
            )}

            {/* Stats */}
            <div className="flex flex-wrap gap-2 justify-center mt-5">
              <StatPill icon={Rocket} label="Ships" value={products.length} />
              <StatPill icon={Heart} label="Upvotes" value={profile.totalUpvotes} />
              <StatPill icon={Zap} label="Vibe" value={profile.totalVibeScore} />
              <StatPill icon={Calendar} label="Joined" value={joinDate} />
            </div>

            {/* Social links & actions */}
            <div className="flex flex-wrap gap-2 justify-center mt-5">
              {profile.xUrl && (
                <Button variant="outline" size="sm" asChild className="gap-1.5">
                  <a href={profile.xUrl} target="_blank" rel="noopener noreferrer"><XIcon className="h-3.5 w-3.5" /> X</a>
                </Button>
              )}
              {profile.linkedinUrl && (
                <Button variant="outline" size="sm" asChild className="gap-1.5">
                  <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer"><Linkedin className="h-3.5 w-3.5" /> LinkedIn</a>
                </Button>
              )}
              {profile.githubUrl && (
                <Button variant="outline" size="sm" asChild className="gap-1.5">
                  <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer"><Github className="h-3.5 w-3.5" /> GitHub</a>
                </Button>
              )}
              {profile.portfolioUrl && (
                <Button variant="outline" size="sm" asChild className="gap-1.5">
                  <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer"><Globe className="h-3.5 w-3.5" /> Portfolio</a>
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={handleShare} className="gap-1.5">
                <Share2 className="h-3.5 w-3.5" /> Share
              </Button>
            </div>
          </div>
        </div>

        {/* ── Products Section ── */}
        {products.length === 0 ? (
          <EmptyState />
        ) : (
          <div>
            {/* Section header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">
                {isArchitect ? 'Portfolio' : 'Flagship'}
              </h2>
              <span className="text-sm text-muted-foreground">{products.length} ship{products.length !== 1 ? 's' : ''}</span>
            </div>

            {/* Featured product (Crown Jewel) */}
            {featuredProduct && (
              <div className="mb-6">
                <FeaturedProductCard product={featuredProduct} />
              </div>
            )}

            {/* Adaptive layout */}
            {isArchitect ? (
              /* Architect: Portfolio Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {nonFeaturedProducts.map((p) => (
                  <ProductGridCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              /* Visionary: Flagship View — large cards */
              <div className="flex flex-col gap-5">
                {nonFeaturedProducts.map((p) => (
                  <FeaturedProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

// ── SEO Meta Tags (injected via DOM for SPA) ──
function MetaTags({ profile, productCount }: { profile: { username: string; bio: string; avatarUrl?: string; totalUpvotes: number }; productCount: number }) {
  const title = `@${profile.username} — Maker Profile | VibeRush`;
  const description = profile.bio
    ? `${profile.bio.slice(0, 120)} — ${productCount} ships, ${profile.totalUpvotes} upvotes on VibeRush.`
    : `@${profile.username} has shipped ${productCount} product${productCount !== 1 ? 's' : ''} on VibeRush with ${profile.totalUpvotes} total upvotes.`;
  const image = profile.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`;
  const url = `${window.location.origin}/maker/@${profile.username}`;

  // Update meta tags
  const setMeta = (property: string, content: string) => {
    let el = document.querySelector(`meta[property="${property}"]`) || document.querySelector(`meta[name="${property}"]`);
    if (!el) {
      el = document.createElement('meta');
      if (property.startsWith('og:') || property.startsWith('twitter:')) {
        el.setAttribute('property', property);
      } else {
        el.setAttribute('name', property);
      }
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  setMeta('og:title', title);
  setMeta('og:description', description);
  setMeta('og:image', image);
  setMeta('og:url', url);
  setMeta('og:type', 'profile');
  setMeta('twitter:card', 'summary');
  setMeta('twitter:title', title);
  setMeta('twitter:description', description);
  setMeta('twitter:image', image);

  return null;
}

export default MakerProfile;
