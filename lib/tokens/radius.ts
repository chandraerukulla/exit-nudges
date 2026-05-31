/**
 * RADIUS TOKENS — Generated from Origin foundations
 *
 * DO NOT EDIT. Regenerate with: node scripts/build-ts.mjs
 */

export const RADIUS = {
  '4': '4px',
  '8': '8px',
  '12': '12px',
  '16': '16px',
  '20': '20px',
  '24': '24px',
  '36': '36px',
  'full': '9999px',
} as const;

export type RadiusStep = keyof typeof RADIUS;
