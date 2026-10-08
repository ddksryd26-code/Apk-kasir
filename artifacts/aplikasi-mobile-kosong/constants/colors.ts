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
    text: '#20352B',
    tint: '#1D634A',
    background: '#F6F5EF',
    foreground: '#20352B',
    card: '#FFFFFF',
    cardForeground: '#20352B',
    primary: '#1D634A',
    primaryForeground: '#FFFFFF',
    secondary: '#E7EFE8',
    secondaryForeground: '#20352B',
    muted: '#EFEEE7',
    mutedForeground: '#737B72',
    accent: '#E9C47C',
    accentForeground: '#26372B',
    destructive: '#B94C43',
    destructiveForeground: '#FFFFFF',
    border: '#E5E3D9',
    input: '#E5E3D9',
  },
  dark: {
    text: '#F2F1E9',
    tint: '#8AC6A5',
    background: '#111A15',
    foreground: '#F2F1E9',
    card: '#1B2820',
    cardForeground: '#F2F1E9',
    primary: '#8AC6A5',
    primaryForeground: '#10271B',
    secondary: '#26362C',
    secondaryForeground: '#EAF0E9',
    muted: '#202D25',
    mutedForeground: '#AAB5AC',
    accent: '#D6B36F',
    accentForeground: '#20271F',
    destructive: '#E1786E',
    destructiveForeground: '#1D1413',
    border: '#304036',
    input: '#304036',
  },

  radius: 22,
};

export default colors;
