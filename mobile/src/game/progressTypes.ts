// =====================================================
// File: progressTypes.ts
//
// Purpose:
// Defines the information used by the Roast or Toast
// player progress system.
//
// This file contains types only. The actual scoring and
// leveling logic lives inside progress.ts.
//
// Project: Roast or Toast
// =====================================================

// The two choices available during normal gameplay.
export type PlayerVote = "roast" | "toast";

// Stores the player's overall progress.
export type PlayerProgress = {
  // Current player level.
  level: number;

  // Total XP earned across gameplay.
  totalXp: number;

  // XP earned within the current level.
  currentLevelXp: number;

  // XP required to reach the next level.
  xpForNextLevel: number;

  // Number of regular Moments answered.
  momentsCompleted: number;

  // Number of Roast selections.
  roastCount: number;

  // Number of Toast selections.
  toastCount: number;

  // Number of times the player's vote matched the
  // community majority.
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
  xpEarned: number;
  matchedMajority: boolean;
  leveledUp: boolean;
};

// Information returned after Guess the Crowd.
export type CrowdGuessProgressResult = {
  updatedProgress: PlayerProgress;
  xpEarned: number;
  guessedCorrectly: boolean;
  leveledUp: boolean;
};