// =====================================================
// File: usePlayerProgress.ts
//
// Purpose:
// Provides screens and game modes with an easy way to
// read and update player progress.
//
// Current Version:
// Progress is stored in memory and resets after the app
// fully reloads.
//
// Later:
// • Save progress with AsyncStorage
// • Resume the current game session
// • Sync progress with a user account
//
// Project: Roast or Toast
// =====================================================

import { useState } from "react";

import {
  createInitialProgress,
  recordCrowdGuess,
  recordRegularVote,
} from "../game/progress";

import type {
  CrowdGuessProgressResult,
  PlayerProgress,
  PlayerVote,
  VoteProgressResult,
} from "../game/progressTypes";

export function usePlayerProgress() {
  // Stores the player's current progress during this app
  // session.
  const [progress, setProgress] = useState<PlayerProgress>(
    createInitialProgress,
  );

  // =====================================================
  // Regular Vote
  // =====================================================

  // Records a normal Roast or Toast vote.
  //
  // The function returns details such as Heat earned,
  // majority match, and whether the player leveled up.
  const addRegularVote = (
    vote: PlayerVote,
    roastPercentage: number,
    toastPercentage: number,
  ): VoteProgressResult => {
    const result = recordRegularVote(
      progress,
      vote,
      roastPercentage,
      toastPercentage,
    );

    setProgress(result.updatedProgress);

    return result;
  };

  // =====================================================
  // Guess the Crowd
  // =====================================================

  // Records the player's Guess the Crowd prediction.
  const addCrowdGuess = (
    prediction: PlayerVote,
    roastPercentage: number,
    toastPercentage: number,
  ): CrowdGuessProgressResult => {
    const result = recordCrowdGuess(
      progress,
      prediction,
      roastPercentage,
      toastPercentage,
    );

    setProgress(result.updatedProgress);

    return result;
  };

  // =====================================================
  // Reset Progress
  // =====================================================

  // Clears all temporary progress.
  //
  // This is useful during development and could later
  // support a separate New Session option.
  const resetProgress = () => {
    setProgress(createInitialProgress());
  };

  return {
    progress,
    addRegularVote,
    addCrowdGuess,
    resetProgress,
  };
}