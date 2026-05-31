/**
 * Origin design tokens — re-exports of the canonical TS exports from
 * /origin-main/outputs/ts/. Tokens are also available as CSS variables
 * (see app/tokens.css) and Tailwind utility classes (see tailwind.config.ts).
 *
 * Note: Origin's responsive-typography.ts is intentionally NOT re-exported —
 * its responsive behavior is delivered via CSS vars at runtime.
 */

// Typography
export { R, rs, type RToken } from "./typography";

// Color
export {
  COLOR_PRIMITIVES,
  COLOR_ANCHORS,
  SEMANTIC_LIGHT,
  SEMANTIC_DARK,
  type ColorRamp,
  type ColorStep,
} from "./colors";

// Spacing
export { SPACING, type SpacingStep } from "./spacing";

// Radius
export { RADIUS, type RadiusStep } from "./radius";
