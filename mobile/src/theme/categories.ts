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
// Every new playable category should be added here so
// the app can display the proper badge, accent color,
// and background throughout the experience.
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

  // =====================================================
  // School / College
  //
  // I wanted School / College to feel like its own part
  // of the game instead of borrowing Everyday Life.
  //
  // The muted academic blue works with the notebook /
  // campus feel without competing with the permanent
  // coral Roast and teal Toast colors.
  // =====================================================

  "School / College": {
    accent: "#527A92",
    soft: "#E7EFF3",
    label: "SCHOOL / COLLEGE",
  },

  // =====================================================
  // New Category
  //
  // Moral Dilemmas focuses on difficult decisions,
  // ethical situations, accountability, and gray areas.
  //
  // The muted plum palette gives the category a more
  // thoughtful personality while still fitting Roast or
  // Toast's premium aesthetic.
  // =====================================================

  "Moral Dilemmas": {
    accent: "#7A5C86",
    soft: "#EFE7F2",
    label: "MORAL DILEMMAS",
  },
} as const;

// Every playable category name is automatically inferred
// from the keys above. Adding a new category to
// CategoryThemes automatically updates this type.
export type CategoryName = keyof typeof CategoryThemes;