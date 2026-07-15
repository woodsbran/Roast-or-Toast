// =====================================================
// File: recentMomentsStorage.ts
//
// Purpose:
// Remembers Moments the player has recently seen.
//
// This history is separate from the active saved session.
// It helps each new round feel different even after the
// app is closed and reopened.
//
// The Smart Deck system uses these IDs to:
//
// • Prioritize unseen statements
// • Delay recently played statements
// • Reduce repetition between rounds
// • Keep Endless mode feeling fresh
//
// Project: Roast or Toast
// =====================================================

import AsyncStorage from "@react-native-async-storage/async-storage";

// Unique storage key for recently displayed Moments.
const RECENT_MOMENTS_STORAGE_KEY =
  "@roast_or_toast/recent_moments";

// Stores enough history to protect several complete
// rounds from immediate repetition.
//
// This does not permanently remove those Moments. The
// Smart Deck can recycle them after fresher content has
// been used.
const MAX_RECENT_MOMENTS = 60;

// =====================================================
// Normalize Saved History
// =====================================================

// Keeps only valid unique string IDs and prevents an old
// or damaged saved value from breaking deck creation.
function normalizeMomentIds(
  values: unknown[],
): string[] {
  const uniqueMomentIds =
    new Set<string>();

  values.forEach(
    (value) => {
      if (
        typeof value !==
          "string" ||
        value.trim().length ===
          0
      ) {
        return;
      }

      uniqueMomentIds.add(
        value,
      );
    },
  );

  return Array.from(
    uniqueMomentIds,
  ).slice(
    0,
    MAX_RECENT_MOMENTS,
  );
}

// =====================================================
// Load Recent Moment IDs
// =====================================================

export async function loadRecentMomentIds(): Promise<
  string[]
> {
  try {
    const savedHistory =
      await AsyncStorage.getItem(
        RECENT_MOMENTS_STORAGE_KEY,
      );

    if (!savedHistory) {
      return [];
    }

    const parsedHistory =
      JSON.parse(
        savedHistory,
      );

    if (
      !Array.isArray(
        parsedHistory,
      )
    ) {
      return [];
    }

    return normalizeMomentIds(
      parsedHistory,
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
// Save Recent Moment IDs
// =====================================================

async function saveRecentMomentIds(
  momentIds: string[],
): Promise<string[]> {
  const normalizedMomentIds =
    normalizeMomentIds(
      momentIds,
    );

  await AsyncStorage.setItem(
    RECENT_MOMENTS_STORAGE_KEY,
    JSON.stringify(
      normalizedMomentIds,
    ),
  );

  return normalizedMomentIds;
}

// =====================================================
// Remember One Moment
// =====================================================

// Adds a Moment to the front of the history.
//
// Existing copies are removed first so one ID never
// appears more than once.
export async function rememberMomentId(
  momentId: string,
): Promise<string[]> {
  try {
    const existingHistory =
      await loadRecentMomentIds();

    return await saveRecentMomentIds([
      momentId,

      ...existingHistory.filter(
        (savedId) =>
          savedId !==
          momentId,
      ),
    ]);
  } catch (error) {
    console.error(
      "Unable to remember displayed Moment:",
      error,
    );

    return [];
  }
}

// =====================================================
// Remember Several Moments
// =====================================================

// This is available for future game modes that may reveal
// several Moments at once.
//
// The newest supplied ID becomes the first item in saved
// history.
export async function rememberMomentIds(
  momentIds: string[],
): Promise<string[]> {
  try {
    const existingHistory =
      await loadRecentMomentIds();

    const validNewIds =
      normalizeMomentIds(
        momentIds,
      );

    const newIdSet =
      new Set(
        validNewIds,
      );

    return await saveRecentMomentIds([
      ...validNewIds,

      ...existingHistory.filter(
        (savedId) =>
          !newIdSet.has(
            savedId,
          ),
      ),
    ]);
  } catch (error) {
    console.error(
      "Unable to remember displayed Moments:",
      error,
    );

    return [];
  }
}

// =====================================================
// Clear Recent History
// =====================================================

// Used by Refresh Moment History and Reset All Progress.
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