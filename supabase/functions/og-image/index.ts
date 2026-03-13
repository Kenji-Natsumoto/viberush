import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { initWasm, Resvg } from "npm:@resvg/resvg-wasm@2.6.2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const OG_BUCKET = "og-images";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// WASM + font initialization — runs once per cold start
let wasmReady = false;
let fontBytes: Uint8Array | null = null;

async function ensureWasm() {
  if (!wasmReady) {
    const [wasmResp, fontResp] = await Promise.all([
      fetch("https://cdn.jsdelivr.net/npm/@resvg/resvg-wasm@2.6.2/index_bg.wasm"),
      fetch("https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2"),
    ]);
    await initWasm(wasmResp);
    fontBytes = new Uint8Array(await fontResp.arrayBuffer());
    wasmReady = true;
  }
}

function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function clip(str: string, max: number): string {
  return str.length > max ? str.slice(0, max - 3) + "..." : str;
}

interface ProductRow {
  id: string;
  name: string;
  tagline: string | null;
  tools_used: string[] | null;
  vibe_score: number | null;
  proxy_creator_name: string | null;
  created_at: string;
}

function buildSvg(p: ProductRow): string {
  const name = esc(clip(p.name, 28));
  const tagline = esc(clip(p.tagline ?? "A vibe-coded app on VibeRush", 65));
  const tools = (p.tools_used ?? []).slice(0, 3);
  const vibeScore = p.vibe_score ?? 0;
  const maker = esc(p.proxy_creator_name ?? "Vibe Coder");
  const date = new Date(p.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Tool badges
  let badges = "";
  let bx = 50;
  for (const t of tools) {
    const label = esc(t);
    const w = Math.max(label.length * 11 + 24, 80);
    badges += `
    <rect x="${bx}" y="430" width="${w}" height="36" rx="8" fill="#1e1e2e" stroke="#6366f1" stroke-width="1.5"/>
    <text x="${bx + w / 2}" y="454" font-family="Inter, sans-serif" font-size="17" fill="#a5b4fc" text-anchor="middle">${label}</text>`;
    bx += w + 14;
  }

  const VibeText = `\u26A1 ${vibeScore} Vibes`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0d0d1a"/>
      <stop offset="100%" stop-color="#1a1a2e"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- Left accent line -->
  <rect x="0" y="0" width="8" height="630" fill="#6366f1"/>

  <!-- Header bar -->
  <rect x="0" y="0" width="1200" height="84" fill="#6366f108"/>

  <!-- Brand -->
  <text x="50" y="56" font-family="Inter, sans-serif" font-size="30" font-weight="bold" fill="#6366f1">VibeRush</text>
  <text x="192" y="56" font-family="Inter, sans-serif" font-size="20" fill="#52525b">.io</text>
  <text x="1150" y="56" font-family="Inter, sans-serif" font-size="17" fill="#3f3f46" text-anchor="end">Your AI app deserves to be seen.</text>

  <!-- Header divider -->
  <rect x="30" y="84" width="1140" height="1" fill="#27272a"/>

  <!-- Product name -->
  <text x="50" y="225" font-family="Inter, sans-serif" font-size="66" font-weight="bold" fill="#ffffff">${name}</text>

  <!-- Tagline -->
  <text x="50" y="292" font-family="Inter, sans-serif" font-size="28" fill="#a1a1aa">${tagline}</text>

  <!-- Section divider -->
  <rect x="30" y="402" width="1140" height="1" fill="#27272a"/>

  <!-- Tool badges -->
  ${badges}

  <!-- Vibe score -->
  <text x="1150" y="462" font-family="Inter, sans-serif" font-size="26" fill="#facc15" text-anchor="end">${VibeText}</text>

  <!-- Footer divider -->
  <rect x="30" y="572" width="1140" height="1" fill="#27272a"/>

  <!-- Footer -->
  <text x="50" y="610" font-family="Inter, sans-serif" font-size="19" fill="#71717a">Shipped on VibeRush</text>
  <text x="280" y="610" font-family="Inter, sans-serif" font-size="19" fill="#3f3f46"> · </text>
  <text x="305" y="610" font-family="Inter, sans-serif" font-size="19" fill="#71717a">by ${maker}</text>
  <text x="1150" y="610" font-family="Inter, sans-serif" font-size="19" fill="#71717a" text-anchor="end">${date}</text>
</svg>`;
}

function fallbackSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#0d0d1a"/>
  <rect x="0" y="0" width="8" height="630" fill="#6366f1"/>
  <text x="600" y="300" font-family="Inter, sans-serif" font-size="64" font-weight="bold" fill="#6366f1" text-anchor="middle">VibeRush</text>
  <text x="600" y="372" font-family="Inter, sans-serif" font-size="26" fill="#71717a" text-anchor="middle">Your AI app deserves to be seen.</text>
</svg>`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: CORS_HEADERS });
  }

  try {
    const url = new URL(req.url);
    // Support /og-image/{id} path OR ?id= query param
    const pathParts = url.pathname.split("/").filter(Boolean);
    const lastPart = pathParts[pathParts.length - 1];
    const id = (lastPart && lastPart !== "og-image")
      ? lastPart
      : url.searchParams.get("id");

    // Fast path: serve from Storage cache (no WASM cold start needed)
    if (id) {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
      const { data: cached, error: cacheErr } = await supabase.storage
        .from(OG_BUCKET)
        .download(`${id}.png`);

      if (!cacheErr && cached) {
        const bytes = new Uint8Array(await cached.arrayBuffer());
        return new Response(bytes, {
          headers: {
            ...CORS_HEADERS,
            "Content-Type": "image/png",
            "Cache-Control": "public, max-age=86400, s-maxage=86400",
          },
        });
      }
    }

    // Cache miss — generate with WASM
    await ensureWasm();

    const fontOpts = fontBytes
      ? { loadSystemFonts: false, fontBuffers: [fontBytes] }
      : { loadSystemFonts: false };

    if (!id) {
      const resvg = new Resvg(fallbackSvg(), { font: fontOpts });
      return new Response(resvg.render().asPng(), {
        headers: { ...CORS_HEADERS, "Content-Type": "image/png", "Cache-Control": "public, max-age=3600" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    const { data: product, error } = await supabase
      .from("products")
      .select("id, name, tagline, tools_used, vibe_score, proxy_creator_name, created_at")
      .eq("id", id)
      .or("status.neq.removed,status.is.null")
      .maybeSingle();

    const svg = (!error && product) ? buildSvg(product) : fallbackSvg();
    const resvg = new Resvg(svg, { font: fontOpts });
    const png = resvg.render().asPng();

    // Store in Storage for future requests — fire-and-forget
    if (!error && product) {
      createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY).storage
        .from(OG_BUCKET)
        .upload(`${id}.png`, png, {
          contentType: "image/png",
          cacheControl: "86400",
          upsert: true,
        })
        .catch(() => {});
    }

    return new Response(png, {
      headers: {
        ...CORS_HEADERS,
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  } catch (err) {
    console.error("og-image error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }
});
