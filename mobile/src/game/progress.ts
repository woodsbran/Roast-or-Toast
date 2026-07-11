// =====================================================
// File: progress.ts
//
// Purpose:
// Contains the scoring, streak, and leveling rules for
// Roast or Toast.
//
// Current Rules:
// • Every regular vote earns XP.
// • Matching the majority earns bonus XP.
// • Correct Guess the Crowd predictions earn bonus XP.
// • Players are never punished for choosing the
//   minority opinion.
//
// These values can easily be adjusted after testing.
//
// Project: Roast or Toast
// =====================================================

import type {
  CrowdGuessProgressResult,
  PlayerProgress,
  PlayerVote,
  VoteProgressResult,
} from "./progressTypes";

// =====================================================
// XP Rules
// =====================================================

// XP earned simply for completing a regular Moment.
export const BASE_VOTE_XP = 10;

// Extra XP earned when the player's vote matches the
// community majority.
export const MAJORITY_MATCH_BONUS_XP = 5;

// XP earned for completing Guess the Crowd.
export const BASE_CROWD_GUESS_XP = 10;

// Extra XP earned for correctly predicting the crowd.
export const CORRECT_CROWD_GUESS_BONUS_XP = 15;

// =====================================================
// Starting Progress
// =====================================================

// Creates a clean progress object for a new player.
//
// Using a function instead of a shared object prevents
// accidental changes to the original default values.
export function createInitialProgress(): PlayerProgress {
  return {
    level: 1,
    totalXp: 0,
    currentLevelXp: 0,
    xpForNextLevel: getXpRequiredForLevel(1),

    momentsCompleted: 0,

    roastCount: 0,
    toastCount: 0,

    majorityMatches: 0,
    currentStreak: 0,
    bestStreak: 0,

    crowdGuesses: 0,
    correctCrowdGuesses: 0,
  };
}

// =====================================================
// Leveling
// =====================================================

// Calculates how much XP is required to complete a
// particular level.
//
// Early levels move quickly so the player feels progress.
// Later levels gradually require more XP.
export function getXpRequiredForLevel(level: number): number {
  return 100 + (level - 1) * 25;
}

// Applies earned XP and calculates whether the player
// reached a new level.
//
// This also supports earning enough XP to cross more
// than one level at once in future bonus modes.
function applyXp(
  progress: PlayerProgress,
  xpEarned: number,
): {
  progress: PlayerProgress;
  leveledUp: boolean;
} {
  let level = progress.level;
  let currentLevelXp = progress.currentLevelXp + xpEarned;
  let xpForNextLevel = getXpRequiredForLevel(level);
  let leveledUp = false;

  // Continue leveling while enough XP remains.
  while (currentLevelXp >= xpForNextLevel) {
    currentLevelXp -= xpForNextLevel;
    level += 1;
    xpForNextLevel = getXpRequiredForLevel(level);
    leveledUp = true;
  }

  return {
    leveledUp,

    progress: {
      ...progress,
      level,
      totalXp: progress.totalXp + xpEarned,
      currentLevelXp,
      xpForNextLevel,
    },
  };
}

// =====================================================
// Majority Helper
// =====================================================

// Determines which side currently has the larger
// community percentage.
//
// A tied result returns null because neither side has a
// true majority.
export function getMajorityChoice(
  roastPercentage: number,
  toastPercentage: number,
): PlayerVote | null {
  if (roastPercentage > toastPercentage) {
    return "roast";
  }

  if (toastPercentage > roastPercentage) {
    return "toast";
  }

  return null;
}

// =====================================================
// Record a Regular Vote
// =====================================================

// Updates player progress after a standard Roast or Toast
// vote.
export function recordRegularVote(
  currentProgress: PlayerProgress,
  playerVote: PlayerVote,
  roastPercentage: number,
  toastPercentage: number,
): VoteProgressResult {
  const majorityChoice = getMajorityChoice(
    roastPercentage,
    toastPercentage,
  );

  // A tied community result does not count as a match.
  const matchedMajority =
    majorityChoice !== null && playerVote === majorityChoice;

  const xpEarned =
    BASE_VOTE_XP +
    (matchedMajority ? MAJORITY_MATCH_BONUS_XP : 0);

  const updatedStreak = matchedMajority
    ? currentProgress.currentStreak + 1
    : 0;

  const progressBeforeXp: PlayerProgress = {
    ...currentProgress,

    momentsCompleted: currentProgress.momentsCompleted + 1,

    roastCount:
      currentProgress.roastCount +
      (playerVote === "roast" ? 1 : 0),

    toastCount:
      currentProgress.toastCount +
      (playerVote === "toast" ? 1 : 0),

    majorityMatches:
      currentProgress.majorityMatches +
      (matchedMajority ? 1 : 0),

    currentStreak: updatedStreak,

    bestStreak: Math.max(
      currentProgress.bestStreak,
      updatedStreak,
    ),
  };

  const xpResult = applyXp(progressBeforeXp, xpEarned);

  return {
    updatedProgress: xpResult.progress,
    xpEarned,
    matchedMajority,
    leveledUp: xpResult.leveledUp,
  };
}

// =====================================================
// Record Guess the Crowd
// =====================================================

// Updates progress after a Guess the Crowd prediction.
//
// The player's personal Roast or Toast vote is handled
// separately from this prediction.
export function recordCrowdGuess(
  currentProgress: PlayerProgress,
  prediction: PlayerVote,
  roastPercentage: number,
  toastPercentage: number,
): CrowdGuessProgressResult {
  const majorityChoice = getMajorityChoice(
    roastPercentage,
    toastPercentage,
  );

  const guessedCorrectly =
    majorityChoice !== null && prediction === majorityChoice;

  const xpEarned =
    BASE_CROWD_GUESS_XP +
    (guessedCorrectly
      ? CORRECT_CROWD_GUESS_BONUS_XP
      : 0);

  const progressBeforeXp: PlayerProgress = {
    ...currentProgress,

    crowdGuesses: currentProgress.crowdGuesses + 1,

    correctCrowdGuesses:
      currentProgress.correctCrowdGuesses +
      (guessedCorrectly ? 1 : 0),
  };

  const xpResult = applyXp(progressBeforeXp, xpEarned);

  return {
    updatedProgress: xpResult.progress,
    xpEarned,
    guessedCorrectly,
    leveledUp: xpResult.leveledUp,
  };
}