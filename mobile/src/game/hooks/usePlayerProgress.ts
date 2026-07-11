// =====================================================
// File: usePlayerProgress.ts
//
// Purpose:
// Provides an easy way for screens and game modes to
// read and update player progress.
//
// Current Version:
// Progress is stored only in memory. It resets when the
// app fully reloads.
//
// Next Version:
// Save and restore progress using AsyncStorage.
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
  // Stores progress for the current app session.
  const [progress, setProgress] = useState<PlayerProgress>(
    createInitialProgress,
  );

  // Records a normal Roast or Toast vote.
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

  // Records a Guess the Crowd prediction.
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

  // Resets all temporary player progress.
  //
  // This is useful during development and may later be
  // used for a separate New Session option.
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