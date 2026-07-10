// =====================================================
// File: categories.ts
//
// Purpose:
// Gives each content category its own visual identity
// while preserving the main Roast or Toast brand.
//
// Category colors should remain subtle. Roast and Toast
// voting colors stay consistent across every screen.
//
// Project: Roast or Toast
// =====================================================

export const CategoryThemes = {
  Work: {
    accent: "#5F7FA8",
    soft: "#E9EFF6",
    label: "WORK",
  },

  Dating: {
    accent: "#C96D7B",
    soft: "#F7E8EB",
    label: "DATING",
  },

  Friends: {
    accent: "#8069A8",
    soft: "#EEE9F6",
    label: "FRIENDS",
  },

  Food: {
    accent: "#D39A43",
    soft: "#F8EFD9",
    label: "FOOD",
  },

  Travel: {
    accent: "#5C9DB5",
    soft: "#E4F1F5",
    label: "TRAVEL",
  },

  Driving: {
    accent: "#66727F",
    soft: "#E9EDF0",
    label: "DRIVING",
  },

  "Social Media": {
    accent: "#9A70A8",
    soft: "#F0E8F3",
    label: "SOCIAL MEDIA",
  },

  Family: {
    accent: "#738D6A",
    soft: "#EAF0E7",
    label: "FAMILY",
  },

  "Everyday Life": {
    accent: "#D77461",
    soft: "#F7E9E4",
    label: "EVERYDAY LIFE",
  },

  "Pop Culture": {
    accent: "#B9913E",
    soft: "#F6EFD9",
    label: "POP CULTURE",
  },
} as const;

export type CategoryName = keyof typeof CategoryThemes;