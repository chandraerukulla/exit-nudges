/**
 * TYPOGRAPHY TOKENS — Generated from Origin foundations
 *
 * DO NOT EDIT. Regenerate with: node scripts/build-ts.mjs
 */

import type React from 'react';

export type RToken = {
  fs: string;   // font-size step
  lh: string;   // line-height step
  w: number;    // font-weight
  ls: string;   // letter-spacing step
  uc?: boolean; // uppercase
  tnum?: boolean;
};

export const R = {
  /* Display */
  displaySm:         { fs: '1000', lh: '100', w: 900, ls: 'tight-2', uc: true },
  displayMd:         { fs: '1100', lh: '100', w: 900, ls: 'tight-2', uc: true },
  displayLg:         { fs: '1200', lh: '095', w: 900, ls: 'tight-2', uc: true },
  /* Header */
  headerSm:          { fs: '700', lh: '120', w: 700, ls: 'tight-2' },
  headerMd:          { fs: '800', lh: '120', w: 700, ls: 'tight-2' },
  headerLg:          { fs: '900', lh: '120', w: 700, ls: 'tight-2' },
  /* Title */
  titleSm:           { fs: '400', lh: '140', w: 600, ls: 'tight-0' },
  titleMd:           { fs: '450', lh: '130', w: 600, ls: 'tight-1' },
  titleLg:           { fs: '500', lh: '120', w: 600, ls: 'tight-3' },
  /* Label */
  labelSm:           { fs: '100', lh: '140', w: 400, ls: 'wide-1' },
  labelMd:           { fs: '200', lh: '140', w: 400, ls: 'none' },
  labelLg:           { fs: '300', lh: '140', w: 400, ls: 'tight-0' },
  /* Label Heavy */
  labelHeavySm:      { fs: '100', lh: '140', w: 500, ls: 'wide-1' },
  labelHeavyMd:      { fs: '200', lh: '140', w: 500, ls: 'none' },
  labelHeavyLg:      { fs: '300', lh: '140', w: 500, ls: 'tight-0' },
  /* Label Mono */
  labelMonoSm:       { fs: '100', lh: '140', w: 400, ls: 'wide-1' },
  labelMonoMd:       { fs: '200', lh: '140', w: 400, ls: 'none' },
  labelMonoLg:       { fs: '300', lh: '140', w: 400, ls: 'tight-0' },
  /* Label Mono Heavy */
  labelMonoHeavySm:  { fs: '100', lh: '140', w: 500, ls: 'wide-1' },
  labelMonoHeavyMd:  { fs: '200', lh: '140', w: 500, ls: 'none' },
  labelMonoHeavyLg:  { fs: '300', lh: '140', w: 500, ls: 'tight-0' },
  /* Body */
  bodySm:            { fs: '200', lh: '150', w: 400, ls: 'none' },
  bodyMd:            { fs: '300', lh: '150', w: 400, ls: 'tight-0' },
  bodyLg:            { fs: '400', lh: '150', w: 400, ls: 'tight-1' },
  /* Number */
  numberSm:          { fs: '200', lh: '140', w: 500, ls: 'none', tnum: true },
  numberMd:          { fs: '300', lh: '140', w: 500, ls: 'tight-0', tnum: true },
  numberLg:          { fs: '400', lh: '140', w: 500, ls: 'tight-1', tnum: true },
  numberDisplayXs:   { fs: '800', lh: '100', w: 900, ls: 'tight-2', uc: true },
  numberDisplaySm:   { fs: '1000', lh: '100', w: 900, ls: 'tight-2', uc: true },
  numberDisplayMd:   { fs: '1100', lh: '100', w: 900, ls: 'tight-2', uc: true },
  numberDisplayLg:   { fs: '1200', lh: '095', w: 900, ls: 'tight-2', uc: true },
  /* Overline */
  overline:          { fs: '100', lh: '140', w: 600, ls: 'wide-2', uc: true },
  overlineLg:        { fs: '200', lh: '140', w: 600, ls: 'wide-2', uc: true },
} satisfies Record<string, RToken>;

export function rs(token: RToken): React.CSSProperties {
  return {
    fontSize: `var(--typo-fs-${token.fs})`,
    lineHeight: `var(--typo-lh-${token.lh})`,
    fontWeight: token.w,
    letterSpacing: `var(--typo-ls-${token.ls})`,
    textTransform: token.uc ? 'uppercase' : undefined,
    fontVariantNumeric: token.tnum ? 'tabular-nums' : undefined,
  };
}
