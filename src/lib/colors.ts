// src/theme/colors.ts

export const colors = {
  stone: {
    50:  "#F7F9F6",
    100: "#EEF2ED",
    200: "#E5ECE6",
    300: "#D7E1DA",
    400: "#C7D2CB",
    500: "#B4C1B9",
    600: "#9EAEA4", // Brand Sage
    700: "#7F9286",
    800: "#5F6F66",
    900: "#3F4C45",
  },

  amber: {
    50:  "#EDF4F0",
    100: "#DDE8E1",
    200: "#C5D7CC",
    300: "#A9C3B4",
    400: "#8BA89B",
    500: "#6F8F81", // Accent
    600: "#5C776B",
    700: "#4A5F55",
    800: "#394742",
    900: "#2A3532",
  },

  neutral: {
    50:  "#F6F7F7",
    100: "#ECEFEE",
    200: "#DCE2E0",
    300: "#C6CFCC",
    400: "#A9B6B0",
    500: "#8C9A92",
    600: "#6F7D75",
    700: "#55615B",
    800: "#3D4742",
    900: "#28302B",
  },

  white: "#F2F4F7",
  black: "#000000",

  background: {
    app: "#F2F4F1",
    card: "#F7F9F6",
    muted: "#E5ECE6",
    accent: "#D7E1DA",
  },

  text: {
    primary: "#28302B",
    secondary: "#4A5F55",
    muted: "#6F8F81",
    inverse: "#F2F4F1",
    accent: "#5C776B",
  },

  border: {
    light: "#D7E1DA",
    soft: "#C7D2CB",
    accent: "#8BA89B",
    focus: "#5C776B",
  },
} as const;

export type Colors = typeof colors;
