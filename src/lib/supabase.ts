import { createClient } from '@supabase/supabase-js';

// NOTE:
// Vite reads .env at dev-server start. If you edited .env after the preview was already running,
// import.meta.env may still contain the old placeholder values until the dev server restarts.

// Fallback values (URL is not secret; anon key is public/publishable)
const FALLBACK_SUPABASE_URL = 'https://nfchuijfdygiclaqecvk.supabase.co';
const FALLBACK_SUPABASE_ANON_KEY = 'sb_publishable_cMLfw03z-EjVrLu6qnJgHQ_PU0gnYsF';

const normalize = (value: unknown) =>
  typeof value === 'string' ? value.trim().replace(/^['"]|['"]$/g, '') : '';

const isValidHttpUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

const envUrl = normalize(import.meta.env.VITE_SUPABASE_URL);
const envKey = normalize(import.meta.env.VITE_SUPABASE_ANON_KEY);

// Debug (kept intentionally while diagnosing env-loading issues)
console.log('[Supabase Init] URL:', envUrl);
console.log('[Supabase Init] Key present:', !!envKey);

const supabaseUrl = isValidHttpUrl(envUrl) ? envUrl : FALLBACK_SUPABASE_URL;
const supabaseAnonKey = envKey && !envKey.includes('your_') ? envKey : FALLBACK_SUPABASE_ANON_KEY;

if (supabaseUrl !== envUrl) {
  console.warn(
    '[Supabase Init] VITE_SUPABASE_URL is not a valid http(s) URL yet. ' +
      'This usually means the preview dev server has not restarted after a .env change. ' +
      'Using fallback Supabase URL to avoid a blank screen.'
  );
}

if (!isValidHttpUrl(supabaseUrl)) {
  throw new Error(
    `Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL. Received: "${String(envUrl)}"`
  );
}

if (!supabaseAnonKey) {
  throw new Error('Missing Supabase anon key. Please set VITE_SUPABASE_ANON_KEY.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
