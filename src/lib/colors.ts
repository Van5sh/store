// src/theme/colors.ts

export const colors = {
  stone: {
    50:  "#FAFAF9",
    100: "#F5F5F4",
    200: "#E7E5E4",
    300: "#D6D3D1",
    400: "#A8A29E",
    500: "#78716C",
    600: "#57534E", // Brand Stone
    700: "#44403C",
    800: "#292524",
    900: "#1C1917",
  },

  amber: {
    50:  "#FFFBEB",
    100: "#FEF3C7",
    200: "#FDE68A",
    300: "#FCD34D",
    400: "#FBBF24",
    500: "#F59E0B", // Accent
    600: "#D97706",
    700: "#B45309",
    800: "#92400E",
    900: "#78350F",
  },

  neutral: {
    50:  "#FAFAFA",
    100: "#F4F4F5",
    200: "#E4E4E7",
    300: "#D4D4D8",
    400: "#A1A1AA",
    500: "#71717A",
    600: "#52525B",
    700: "#3F3F46",
    800: "#27272A",
    900: "#18181B",
  },

  white: "#FFFFFF",
  black: "#000000",

  background: {
    app: "#FAFAF9",     // warm off-white
    card: "#FFFFFF",
    muted: "#F5F5F4",
    accent: "#FFFBEB",
  },

  text: {
    primary: "#1C1917",
    secondary: "#44403C",
    muted: "#78716C",
    inverse: "#FFFFFF",
    accent: "#92400E",
  },

  border: {
    light: "#E7E5E4",
    soft: "#D6D3D1",
    accent: "#FDE68A",
    focus: "#D97706",
  },
} as const;

export type Colors = typeof colors;
