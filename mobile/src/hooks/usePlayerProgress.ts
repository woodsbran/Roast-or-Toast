// =====================================================
// File: usePlayerProgress.ts
//
// Purpose:
// Loads, updates, and permanently saves the player's
// Roast or Toast progress.
//
// Important:
// The hook exposes hasLoadedProgress so gameplay screens
// do not render temporary zero values while AsyncStorage
// is still restoring the real progress.
//
// Project: Roast or Toast
// =====================================================

import { useEffect, useState } from "react";

import {
  createInitialProgress,
  recordCrowdGuess,
  recordRegularVote,
} from "../game/progress";

import {
  clearSavedPlayerProgress,
  loadPlayerProgress,
  savePlayerProgress,
} from "../game/progressStorage";

import type {
  CrowdGuessProgressResult,
  PlayerProgress,
  PlayerVote,
  VoteProgressResult,
} from "../game/progressTypes";

// Ensures older or incomplete saved objects still contain
// every property expected by the current app version.
function normalizeProgress(
  savedProgress: PlayerProgress,
): PlayerProgress {
  const freshProgress = createInitialProgress();

  return {
    ...freshProgress,
    ...savedProgress,
  };
}

export function usePlayerProgress() {
  // Temporary starting values are used only until device
  // storage finishes loading.
  const [progress, setProgress] =
    useState<PlayerProgress>(
      createInitialProgress,
    );

  // Prevents gameplay and recap screens from displaying
  // temporary zero values.
  const [
    hasLoadedProgress,
    setHasLoadedProgress,
  ] = useState(false);

  // =====================================================
  // Restore Saved Progress
  // =====================================================

  useEffect(() => {
    let isMounted = true;

    const restoreProgress = async () => {
      const savedProgress =
        await loadPlayerProgress();

      if (!isMounted) {
        return;
      }

      if (savedProgress) {
        setProgress(
          normalizeProgress(savedProgress),
        );
      }

      setHasLoadedProgress(true);
    };

    void restoreProgress();

    return () => {
      isMounted = false;
    };
  }, []);

  // =====================================================
  // Save Updated Progress
  // =====================================================

  useEffect(() => {
    // This guard is critical.
    //
    // Without it, the initial zero-value object could
    // overwrite the real saved progress before loading
    // finishes.
    if (!hasLoadedProgress) {
      return;
    }

    void savePlayerProgress(progress);
  }, [
    progress,
    hasLoadedProgress,
  ]);

  // =====================================================
  // Regular Roast or Toast Vote
  // =====================================================

  const addRegularVote = (
    vote: PlayerVote,
    roastPercentage: number,
    toastPercentage: number,
  ): VoteProgressResult => {
    // Calculate from the latest available state.
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

  const resetProgress =
    async (): Promise<void> => {
      const freshProgress =
        createInitialProgress();

      setProgress(freshProgress);

      await clearSavedPlayerProgress();

      // Save the new blank state so the app remains
      // consistent after restarting.
      await savePlayerProgress(
        freshProgress,
      );
    };

  return {
    progress,
    hasLoadedProgress,
    addRegularVote,
    addCrowdGuess,
    resetProgress,
  };
}