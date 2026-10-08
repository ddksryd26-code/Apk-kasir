/**
 * Semantic design tokens for the mobile app.
 *
 * These tokens mirror the naming conventions used in web artifacts (index.css)
 * so that multi-artifact projects share a cohesive visual identity.
 *
 * Replace the placeholder values below with values that match the project's
 * brand. If a sibling web artifact exists, read its index.css and convert the
 * HSL values to hex so both artifacts use the same palette.
 *
 * To add dark mode, add a `dark` key with the same token names.
 * The useColors() hook will automatically pick it up.
 */

const colors = {
  light: {
    // Legacy aliases (kept for backward compatibility)
    text: '#1f1f1f',
    tint: '#1f1f1f',

    // Core surfaces
    background: '#ffffff',
    foreground: '#1f1f1f',

    // Cards / elevated surfaces
    card: '#ffffff',
    cardForeground: '#1f1f1f',

    // Primary action color (buttons, links, active states)
    primary: '#1f1f1f',
    primaryForeground: '#ffffff',

    // Secondary / less-emphasis interactive surfaces
    secondary: '#f5f5f5',
    secondaryForeground: '#1f1f1f',

    // Muted / subdued elements (dividers, timestamps, placeholders)
    muted: '#f5f5f5',
    mutedForeground: '#737373',

    // Accent highlights (badges, selected items, focus rings)
    accent: '#f5f5f5',
    accentForeground: '#1f1f1f',

    // Destructive actions (delete, error states)
    destructive: '#ef4444',
    destructiveForeground: '#ffffff',

    // Borders and input outlines
    border: '#e3e3e3',
    input: '#e3e3e3',
  },

  // Border radius (in px). Sync from the sibling web artifact's --radius
  // CSS variable. This value applies to cards, buttons, inputs, and modals.
  radius: 8,
};

export default colors;
