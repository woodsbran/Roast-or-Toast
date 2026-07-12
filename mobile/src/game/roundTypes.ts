// =====================================================
// File: roundTypes.ts
//
// Purpose:
// Defines the available Roast or Toast round modes.
//
// Current Modes:
// • Quick 10
// • Standard 20
// • Endless
//
// This file keeps mode names, limits, and display text
// in one place so gameplay screens stay consistent.
//
// Project: Roast or Toast
// =====================================================

// Internal value saved and passed between routes.
export type RoundMode =
  | "quick"
  | "standard"
  | "endless";

// Complete configuration for one game mode.
export type RoundModeConfig = {
  // Internal mode value.
  id: RoundMode;

  // Main name shown to the player.
  title: string;

  // Short description shown beneath the title.
  description: string;

  // Number of regular Moments in the round.
  //
  // Endless uses null because it has no automatic ending.
  momentLimit: number | null;

  // Small label used by the mode-selection screen.
  badge: string;

  // Playful supporting line.
  flavorText: string;
};

// =====================================================
// Mode Configurations
// =====================================================

export const ROUND_MODES: Record<
  RoundMode,
  RoundModeConfig
> = {
  quick: {
    id: "quick",
    title: "Quick 10",
    description:
      "Ten takes. Fast judgment. Minimal commitment.",
    momentLimit: 10,
    badge: "QUICK ROUND",
    flavorText:
      "Perfect when you only have a few minutes to judge people.",
  },

  standard: {
    id: "standard",
    title: "Standard 20",
    description:
      "A full round with breaks, surprises, and a final recap.",
    momentLimit: 20,
    badge: "FULL EXPERIENCE",
    flavorText:
      "Enough time for your real personality to show.",
  },

  endless: {
    id: "endless",
    title: "Endless",
    description:
      "Keep going until your opinions—or your thumbs—give out.",
    momentLimit: null,
    badge: "NO LIMITS",
    flavorText:
      "There is always one more person to judge.",
  },
};

// =====================================================
// Mode Helpers
// =====================================================

// Safely converts a route parameter into a supported
// RoundMode value.
//
// Invalid or missing values fall back to Standard 20.
export function getRoundMode(
  value: string | string[] | undefined,
): RoundMode {
  const resolvedValue = Array.isArray(value)
    ? value[0]
    : value;

  if (
    resolvedValue === "quick" ||
    resolvedValue === "standard" ||
    resolvedValue === "endless"
  ) {
    return resolvedValue;
  }

  return "standard";
}

// Returns the complete configuration for a mode.
export function getRoundModeConfig(
  mode: RoundMode,
): RoundModeConfig {
  return ROUND_MODES[mode];
}