// =====================================================
// File: progressStorage.ts
//
// Purpose:
// Saves and restores Roast or Toast player progress.
//
// Permanent saved progress includes:
// • Heat
// • Level
// • Roast and Toast totals
// • Majority matches
// • Best streak
// • Guess the Crowd totals
//
// Current streak is also stored so Continue Session can
// restore it. Starting a new game resets only the current
// streak while preserving permanent progress.
//
// Project: Roast or Toast
// =====================================================

import AsyncStorage from "@react-native-async-storage/async-storage";

import type { PlayerProgress } from "./progressTypes";

// Unique storage key used only for player progress.
const PLAYER_PROGRESS_STORAGE_KEY =
  "@roast_or_toast/player_progress";

// =====================================================
// Save Progress
// =====================================================

// Converts the progress object into JSON and saves it
// locally on the player's device.
export async function savePlayerProgress(
  progress: PlayerProgress,
): Promise<void> {
  try {
    const progressJson = JSON.stringify(progress);

    await AsyncStorage.setItem(
      PLAYER_PROGRESS_STORAGE_KEY,
      progressJson,
    );
  } catch (error) {
    // Storage problems should never crash gameplay.
    console.error(
      "Unable to save player progress:",
      error,
    );
  }
}

// =====================================================
// Load Progress
// =====================================================

// Reads saved progress from the device.
//
// Returns null when the player has no saved progress yet.
export async function loadPlayerProgress(): Promise<
  PlayerProgress | null
> {
  try {
    const savedProgress = await AsyncStorage.getItem(
      PLAYER_PROGRESS_STORAGE_KEY,
    );

    if (!savedProgress) {
      return null;
    }

    return JSON.parse(savedProgress) as PlayerProgress;
  } catch (error) {
    console.error(
      "Unable to load player progress:",
      error,
    );

    return null;
  }
}

// =====================================================
// Reset Current Session Streak
// =====================================================

// Resets only the player's active majority-match streak.
//
// This is used when the player starts a new game.
//
// The following permanent information remains untouched:
// • Total Heat
// • Level
// • Best streak
// • Roast and Toast totals
// • Guess the Crowd totals
export async function resetSavedCurrentStreak(): Promise<void> {
  try {
    const savedProgress = await loadPlayerProgress();

    // A first-time player may not have any stored
    // progress yet.
    if (!savedProgress) {
      return;
    }

    const updatedProgress: PlayerProgress = {
      ...savedProgress,
      currentStreak: 0,
    };

    await savePlayerProgress(updatedProgress);
  } catch (error) {
    console.error(
      "Unable to reset the current streak:",
      error,
    );
  }
}

// =====================================================
// Clear All Progress
// =====================================================

// Removes all saved player progress.
//
// This is intended for development or a future Reset
// Profile option. Starting a new game should not call
// this function.
export async function clearSavedPlayerProgress(): Promise<void> {
  try {
    await AsyncStorage.removeItem(
      PLAYER_PROGRESS_STORAGE_KEY,
    );
  } catch (error) {
    console.error(
      "Unable to clear player progress:",
      error,
    );
  }
}