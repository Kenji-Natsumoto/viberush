import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SITE_URL = "https://viberush.io";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildShareHtml(product: {
  id: string;
  name: string;
  tagline: string | null;
  icon_url: string;
}): string {
  const title = escapeHtml(`${product.name} — Shipped on VibeRush`);
  const description = escapeHtml(product.tagline ?? "A vibe-coded app on VibeRush");
  const ogImage = `https://nfchuijfdygiclaqecvk.supabase.co/functions/v1/og-image/${product.id}`;
  const productUrl = `${SITE_URL}/product/${product.id}`;
  const shareUrl = `${SITE_URL}/share/${product.id}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${title}</title>

  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${escapeHtml(ogImage)}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:url" content="${escapeHtml(shareUrl)}">
  <meta property="og:site_name" content="VibeRush">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${escapeHtml(ogImage)}">
  <meta name="twitter:site" content="@VibeRush_Kenji">

  <!-- Redirect for browsers -->
  <meta http-equiv="refresh" content="0;url=${escapeHtml(productUrl)}">
</head>
<body>
  <script>window.location.replace(${JSON.stringify(productUrl)});</script>
  <p>Redirecting to <a href="${escapeHtml(productUrl)}">${escapeHtml(product.name)} on VibeRush</a>...</p>
</body>
</html>`;
}

function buildFallbackHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>VibeRush — Your AI app deserves to be seen.</title>
  <meta property="og:type" content="website">
  <meta property="og:title" content="VibeRush — Your AI app deserves to be seen.">
  <meta property="og:description" content="Discover vibe-coded AI apps built by makers worldwide.">
  <meta property="og:url" content="https://viberush.io">
  <meta property="og:site_name" content="VibeRush">
  <meta name="twitter:card" content="summary_large_image">
  <meta http-equiv="refresh" content="0;url=https://viberush.io/explore">
</head>
<body>
  <script>window.location.replace("https://viberush.io/explore");</script>
</body>
</html>`;
}

Deno.serve(async (req: Request) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: CORS_HEADERS });
  }

  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return new Response(buildFallbackHtml(), {
      headers: { ...CORS_HEADERS, "Content-Type": "text/html; charset=utf-8" },
    });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  const { data: product, error } = await supabase
    .from("products")
    .select("id, name, tagline, icon_url")
    .eq("id", id)
    .or("status.neq.removed,status.is.null")
    .maybeSingle();

  if (error || !product) {
    return new Response(buildFallbackHtml(), {
      headers: { ...CORS_HEADERS, "Content-Type": "text/html; charset=utf-8" },
    });
  }

  const html = buildShareHtml(product);

  return new Response(html, {
    headers: {
      ...CORS_HEADERS,
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=300",
    },
  });
});
