// =====================================================
// File: recentMomentsStorage.ts
//
// Purpose:
// Remembers Moments the player has recently seen.
//
// This history is separate from the active saved session.
// It helps new rounds feel different even after the app
// is closed and reopened.
//
// Project: Roast or Toast
// =====================================================

import AsyncStorage from "@react-native-async-storage/async-storage";

// Unique storage key for recently displayed Moments.
const RECENT_MOMENTS_STORAGE_KEY =
  "@roast_or_toast/recent_moments";

// Keeps enough history to reduce repetition without
// permanently locking Moments out of the game.
const MAX_RECENT_MOMENTS = 30;

// =====================================================
// Load Recent Moment IDs
// =====================================================

export async function loadRecentMomentIds(): Promise<string[]> {
  try {
    const savedHistory = await AsyncStorage.getItem(
      RECENT_MOMENTS_STORAGE_KEY,
    );

    if (!savedHistory) {
      return [];
    }

    const parsedHistory = JSON.parse(savedHistory);

    if (!Array.isArray(parsedHistory)) {
      return [];
    }

    // Keep only valid string IDs.
    return parsedHistory.filter(
      (value): value is string =>
        typeof value === "string",
    );
  } catch (error) {
    console.error(
      "Unable to load recent Moment history:",
      error,
    );

    return [];
  }
}

// =====================================================
// Remember One Moment
// =====================================================

// Adds a Moment to the front of the recent-history list.
//
// Existing copies are removed first so the same ID never
// appears more than once.
export async function rememberMomentId(
  momentId: string,
): Promise<string[]> {
  try {
    const existingHistory =
      await loadRecentMomentIds();

    const updatedHistory = [
      momentId,

      ...existingHistory.filter(
        (savedId) => savedId !== momentId,
      ),
    ].slice(0, MAX_RECENT_MOMENTS);

    await AsyncStorage.setItem(
      RECENT_MOMENTS_STORAGE_KEY,
      JSON.stringify(updatedHistory),
    );

    return updatedHistory;
  } catch (error) {
    console.error(
      "Unable to remember displayed Moment:",
      error,
    );

    return [];
  }
}

// =====================================================
// Clear Recent History
// =====================================================

// This is mainly useful for development or a future
// Reset Content History option.
export async function clearRecentMomentHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(
      RECENT_MOMENTS_STORAGE_KEY,
    );
  } catch (error) {
    console.error(
      "Unable to clear recent Moment history:",
      error,
    );
  }
}