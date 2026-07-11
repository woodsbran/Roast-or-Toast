// =====================================================
// File: progress.ts
//
// Purpose:
// Contains the Heat, streak, and leveling rules for
// Roast or Toast.
//
// Current Rules:
// • Every regular vote earns Heat.
// • Matching the community majority earns bonus Heat.
// • Guess the Crowd earns Heat.
// • Correct crowd predictions earn bonus Heat.
// • Players never lose Heat for choosing the minority.
//
// These values can be adjusted later after testing.
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
// Heat Rules
// =====================================================

// Heat earned for completing a normal Roast or Toast
// Moment.
export const BASE_VOTE_HEAT = 10;

// Extra Heat earned when the player's vote matches the
// community majority.
export const MAJORITY_MATCH_BONUS_HEAT = 5;

// Heat earned for completing Guess the Crowd.
export const BASE_CROWD_GUESS_HEAT = 10;

// Extra Heat earned for correctly predicting what the
// community chose.
export const CORRECT_CROWD_GUESS_BONUS_HEAT = 15;

// =====================================================
// Starting Progress
// =====================================================

// Creates a fresh progress object for a new player.
//
// A function is used instead of one shared object so each
// new game session receives its own independent values.
export function createInitialProgress(): PlayerProgress {
  return {
    level: 1,

    totalHeat: 0,
    currentLevelHeat: 0,
    heatForNextLevel: getHeatRequiredForLevel(1),

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

// Calculates how much Heat is required to complete a
// specific level.
//
// Early levels move faster so new players can feel
// progress quickly. Later levels gradually require more.
export function getHeatRequiredForLevel(level: number): number {
  return 100 + (level - 1) * 25;
}

// Adds earned Heat and calculates whether the player
// reached a new level.
//
// This supports crossing more than one level if future
// game modes award larger Heat bonuses.
function applyHeat(
  progress: PlayerProgress,
  heatEarned: number,
): {
  progress: PlayerProgress;
  leveledUp: boolean;
} {
  let level = progress.level;

  let currentLevelHeat =
    progress.currentLevelHeat + heatEarned;

  let heatForNextLevel = getHeatRequiredForLevel(level);

  let leveledUp = false;

  // Keep leveling while enough Heat remains.
  while (currentLevelHeat >= heatForNextLevel) {
    currentLevelHeat -= heatForNextLevel;
    level += 1;

    heatForNextLevel = getHeatRequiredForLevel(level);
    leveledUp = true;
  }

  return {
    leveledUp,

    progress: {
      ...progress,

      level,

      totalHeat: progress.totalHeat + heatEarned,

      currentLevelHeat,

      heatForNextLevel,
    },
  };
}

// =====================================================
// Majority Helper
// =====================================================

// Determines which side has the larger community
// percentage.
//
// A tied result returns null because neither option has
// a true majority.
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

// Updates player progress after a normal Roast or Toast
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

  // Tied community results do not count as a majority
  // match.
  const matchedMajority =
    majorityChoice !== null &&
    playerVote === majorityChoice;

  // Every vote earns base Heat.
  //
  // Matching the majority earns a small bonus.
  const heatEarned =
    BASE_VOTE_HEAT +
    (matchedMajority
      ? MAJORITY_MATCH_BONUS_HEAT
      : 0);

  // A majority match continues the streak.
  //
  // Choosing the minority resets the majority-match
  // streak, but the player never loses Heat.
  const updatedStreak = matchedMajority
    ? currentProgress.currentStreak + 1
    : 0;

  const progressBeforeHeat: PlayerProgress = {
    ...currentProgress,

    momentsCompleted:
      currentProgress.momentsCompleted + 1,

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

  const heatResult = applyHeat(
    progressBeforeHeat,
    heatEarned,
  );

  return {
    updatedProgress: heatResult.progress,
    heatEarned,
    matchedMajority,
    leveledUp: heatResult.leveledUp,
  };
}

// =====================================================
// Record Guess the Crowd
// =====================================================

// Updates progress after the player predicts what most
// people selected.
//
// The player's personal Roast or Toast answer is separate
// from this prediction.
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
    majorityChoice !== null &&
    prediction === majorityChoice;

  // Every Guess the Crowd round earns base Heat.
  //
  // A correct prediction earns a larger bonus because it
  // requires reading the community.
  const heatEarned =
    BASE_CROWD_GUESS_HEAT +
    (guessedCorrectly
      ? CORRECT_CROWD_GUESS_BONUS_HEAT
      : 0);

  const progressBeforeHeat: PlayerProgress = {
    ...currentProgress,

    crowdGuesses:
      currentProgress.crowdGuesses + 1,

    correctCrowdGuesses:
      currentProgress.correctCrowdGuesses +
      (guessedCorrectly ? 1 : 0),
  };

  const heatResult = applyHeat(
    progressBeforeHeat,
    heatEarned,
  );

  return {
    updatedProgress: heatResult.progress,
    heatEarned,
    guessedCorrectly,
    leveledUp: heatResult.leveledUp,
  };
}