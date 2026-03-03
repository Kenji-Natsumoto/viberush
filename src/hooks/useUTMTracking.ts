import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const UTM_SOURCE_KEY = 'vr_utm_source';
const UTM_CAMPAIGN_KEY = 'vr_utm_campaign';

/**
 * Captures utm_source / utm_campaign from the URL and persists them
 * to sessionStorage for the duration of the browser session.
 * Call this inside any component rendered within <BrowserRouter>.
 */
export function useUTMCapture() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const source = searchParams.get('utm_source');
    const campaign = searchParams.get('utm_campaign');
    if (source) sessionStorage.setItem(UTM_SOURCE_KEY, source);
    if (campaign) sessionStorage.setItem(UTM_CAMPAIGN_KEY, campaign);
  }, [searchParams]);
}

/**
 * Returns the utm_source captured earlier in this browser session,
 * or null if the user arrived organically.
 */
export function getVibeSource(): string | null {
  return sessionStorage.getItem(UTM_SOURCE_KEY);
}
