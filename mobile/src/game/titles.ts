// =====================================================
// File: titles.ts
//
// Purpose:
// Assigns a Roast or Toast personality title based on
// the player's current level.
//
// Titles give progress more personality than displaying
// a level number by itself.
//
// Project: Roast or Toast
// =====================================================

// Returns the title associated with the current level.
export function getPlayerTitle(level: number): string {
  if (level >= 40) {
    return "CEO of Hot Takes";
  }

  if (level >= 30) {
    return "Internet Menace";
  }

  if (level >= 25) {
    return "Roast Royalty";
  }

  if (level >= 20) {
    return "Chaos Consultant";
  }

  if (level >= 15) {
    return "Neighborhood Menace";
  }

  if (level >= 10) {
    return "Certified Instigator";
  }

  if (level >= 5) {
    return "Professional Side-Eye";
  }

  return "Opinion Owner";
}