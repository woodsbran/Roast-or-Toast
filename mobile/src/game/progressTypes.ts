// =====================================================
// File: progressTypes.ts
//
// Purpose:
// Defines the information used by the Roast or Toast
// player progress system.
//
// Roast or Toast uses "Heat" instead of generic XP.
// The scoring and leveling rules live in progress.ts.
//
// Project: Roast or Toast
// =====================================================

// The two choices available during gameplay.
export type PlayerVote = "roast" | "toast";

// Stores the player's overall progress.
export type PlayerProgress = {
  // Current player level.
  level: number;

  // Total Heat earned across all gameplay.
  totalHeat: number;

  // Heat earned toward the player's current level.
  currentLevelHeat: number;

  // Heat required to reach the next level.
  heatForNextLevel: number;

  // Number of regular Moments answered.
  momentsCompleted: number;

  // Number of times the player selected Roast.
  roastCount: number;

  // Number of times the player selected Toast.
  toastCount: number;

  // Number of votes that matched the community majority.
  majorityMatches: number;

  // Current consecutive majority-match streak.
  currentStreak: number;

  // Highest majority-match streak reached.
  bestStreak: number;

  // Number of Guess the Crowd rounds completed.
  crowdGuesses: number;

  // Number of correct Guess the Crowd predictions.
  correctCrowdGuesses: number;
};

// Information returned after recording a regular vote.
export type VoteProgressResult = {
  updatedProgress: PlayerProgress;

  // Heat earned from this specific vote.
  heatEarned: number;

  // Whether the player's vote matched the majority.
  matchedMajority: boolean;

  // Whether the player reached a new level.
  leveledUp: boolean;
};

// Information returned after Guess the Crowd.
export type CrowdGuessProgressResult = {
  updatedProgress: PlayerProgress;

  // Heat earned from this Guess the Crowd round.
  heatEarned: number;

  // Whether the crowd prediction was correct.
  guessedCorrectly: boolean;

  // Whether the player reached a new level.
  leveledUp: boolean;
};