/**
 * Generate a consistent, minimalist product icon URL using DiceBear's identicon style.
 * Uses a muted Gold ↔ Sky Blue palette that matches the Sanctuary design system.
 */

// Muted Gold → Teal → Sky Blue backgrounds (low saturation, medium lightness)
const ICON_BG_COLORS = [
  '00A6FF', // Sky Blue (Primary)
  '3C9BD4', // Muted Cyan
  '5A8A9E', // Grey-Blue
  '8C7D5A', // Olive/Gold transition
  'B37D00', // Deep Gold
  'D49600', // Bright Amber
];

function hashSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function getProductIconUrl(seed: string): string {
  const bgIndex = hashSeed(seed) % ICON_BG_COLORS.length;
  const bg = ICON_BG_COLORS[bgIndex];
  return `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(seed)}&backgroundColor=${bg}&scale=70`;
}
