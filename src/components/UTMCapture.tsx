import { useUTMCapture } from '@/hooks/useUTMTracking';

/**
 * Side-effect-only component: reads UTM params from the current URL
 * and stores them in sessionStorage. Renders nothing.
 * Place once inside <BrowserRouter> so it runs on every navigation.
 */
export function UTMCapture() {
  useUTMCapture();
  return null;
}
