/**
 * Generate a consistent, minimalist product icon URL using DiceBear's identicon style.
 * Uses a muted Gold ↔ Sky Blue palette that matches the Sanctuary design system.
 */

// Muted Gold → Teal → Sky Blue backgrounds (low saturation, medium lightness)
const ICON_BG_COLORS = [
  'b09a6b', // muted gold
  'a0926a', // warm sand
  '8a9a7e', // sage
  '7a9a92', // teal mist
  '6a8fa5', // steel blue
  '7d8ea0', // slate blue
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
