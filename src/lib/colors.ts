// src/theme/colors.ts

export const colors = {
  green: {
    50:  "#F0FDF4",
    100: "#DCFCE7",
    200: "#BBF7D0",
    300: "#86EFAC",
    400: "#4ADE80",
    500: "#22C55E", // Accent Green
    600: "#16A34A", // Brand Green
    700: "#15803D",
    800: "#166534",
    900: "#14532D",
  },

  slate: {
    50:  "#F9FAFB",
    100: "#F3F4F6",
    200: "#E5E7EB",
    300: "#D1D5DB",
    400: "#9CA3AF",
    500: "#6B7280",
    600: "#4B5563", // Main Gray
    700: "#374151",
    800: "#1F2937",
    900: "#111827",
  },

  orange: {
    50:  "#FFF7ED",
    100: "#FFEDD5",
    200: "#FED7AA",
    300: "#FDBA74",
    400: "#FB923C",
    500: "#F97316", // Warning
    600: "#EA580C",
    700: "#C2410C",
    800: "#9A3412",
  },

  red: {
    50:  "#FEF2F2",
    100: "#FEE2E2",
    200: "#FECACA",
    300: "#FCA5A5",
    400: "#F87171",
    500: "#EF4444",
    600: "#DC2626",
    700: "#B91C1C",
  },

  white: "#FFFFFF",
  black: "#000000",

  background: {
    app: "#F0FDF4",
    card: "#FFFFFF",
    muted: "#DCFCE7",
  },

  text: {
    dark: "#0F172A",
    gray: "#4B5563",
    muted: "#6B7280",
    light: "#FFFFFF",
  },

  border: {
    light: "#E5E7EB",
    focus: "#22C55E",
  },
} as const;

export type Colors = typeof colors;
