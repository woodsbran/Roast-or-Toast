// =====================================================
// File: dailyStreakStorage.ts
//
// Purpose:
// Saves and updates the player's daily return streak.
//
// Rules:
// • First app visit starts Day 1.
// • Opening again on the same calendar day does not
//   increase the streak.
// • Returning the following calendar day increases it.
// • Missing one or more full days resets the streak to 1.
// • Best streak remains saved separately.
//
// This is a local streak for the current TestFlight
// version. It can later be moved to Supabase when cloud
// profiles are introduced.
//
// Project: Roast or Toast
// =====================================================

import AsyncStorage from "@react-native-async-storage/async-storage";

// Unique storage key for daily streak information.
const DAILY_STREAK_STORAGE_KEY =
  "@roast_or_toast/daily_streak";

// Complete saved daily-streak state.
export type DailyStreak = {
  // Current number of consecutive calendar days.
  currentStreak: number;

  // Highest daily streak reached on this device.
  bestStreak: number;

  // Local calendar date of the most recent recorded visit.
  //
  // Format:
  // YYYY-MM-DD
  lastVisitDate: string | null;
};

// =====================================================
// Default Streak
// =====================================================

export function createDefaultDailyStreak(): DailyStreak {
  return {
    currentStreak: 0,
    bestStreak: 0,
    lastVisitDate: null,
  };
}

// =====================================================
// Date Helpers
// =====================================================

// Converts a Date into a local YYYY-MM-DD string.
//
// This intentionally uses the player's local calendar
// date instead of UTC so the streak changes at their
// actual local midnight.
function getLocalDateKey(
  date: Date,
): string {
  const year =
    date.getFullYear();

  const month = String(
    date.getMonth() + 1,
  ).padStart(2, "0");

  const day = String(
    date.getDate(),
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// Converts a saved YYYY-MM-DD value into a date positioned
// at local noon.
//
// Noon avoids edge cases around daylight-saving changes.
function parseLocalDateKey(
  dateKey: string,
): Date | null {
  const dateParts =
    dateKey.split("-");

  if (dateParts.length !== 3) {
    return null;
  }

  const year =
    Number(dateParts[0]);

  const month =
    Number(dateParts[1]);

  const day =
    Number(dateParts[2]);

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day)
  ) {
    return null;
  }

  const parsedDate =
    new Date(
      year,
      month - 1,
      day,
      12,
      0,
      0,
      0,
    );

  if (
    Number.isNaN(
      parsedDate.getTime(),
    )
  ) {
    return null;
  }

  return parsedDate;
}

// Calculates the number of calendar days between two
// local date keys.
function getCalendarDayDifference(
  earlierDateKey: string,
  laterDateKey: string,
): number | null {
  const earlierDate =
    parseLocalDateKey(
      earlierDateKey,
    );

  const laterDate =
    parseLocalDateKey(
      laterDateKey,
    );

  if (
    !earlierDate ||
    !laterDate
  ) {
    return null;
  }

  const millisecondsPerDay =
    24 * 60 * 60 * 1000;

  return Math.round(
    (laterDate.getTime() -
      earlierDate.getTime()) /
      millisecondsPerDay,
  );
}

// =====================================================
// Normalize Saved Streak
// =====================================================

function normalizeDailyStreak(
  savedStreak: Partial<DailyStreak>,
): DailyStreak {
  const currentStreak =
    typeof savedStreak.currentStreak === "number" &&
    Number.isFinite(
      savedStreak.currentStreak,
    )
      ? Math.max(
          Math.floor(
            savedStreak.currentStreak,
          ),
          0,
        )
      : 0;

  const bestStreak =
    typeof savedStreak.bestStreak === "number" &&
    Number.isFinite(
      savedStreak.bestStreak,
    )
      ? Math.max(
          Math.floor(
            savedStreak.bestStreak,
          ),
          currentStreak,
        )
      : currentStreak;

  const lastVisitDate =
    typeof savedStreak.lastVisitDate === "string" &&
    savedStreak.lastVisitDate.length > 0
      ? savedStreak.lastVisitDate
      : null;

  return {
    currentStreak,
    bestStreak,
    lastVisitDate,
  };
}

// =====================================================
// Load Daily Streak
// =====================================================

export async function loadDailyStreak(): Promise<DailyStreak> {
  try {
    const savedStreakJson =
      await AsyncStorage.getItem(
        DAILY_STREAK_STORAGE_KEY,
      );

    if (!savedStreakJson) {
      return createDefaultDailyStreak();
    }

    const parsedStreak =
      JSON.parse(
        savedStreakJson,
      ) as Partial<DailyStreak>;

    return normalizeDailyStreak(
      parsedStreak,
    );
  } catch (error) {
    console.error(
      "Unable to load daily streak:",
      error,
    );

    return createDefaultDailyStreak();
  }
}

// =====================================================
// Save Daily Streak
// =====================================================

export async function saveDailyStreak(
  streak: DailyStreak,
): Promise<void> {
  try {
    const normalizedStreak =
      normalizeDailyStreak(
        streak,
      );

    await AsyncStorage.setItem(
      DAILY_STREAK_STORAGE_KEY,
      JSON.stringify(
        normalizedStreak,
      ),
    );
  } catch (error) {
    console.error(
      "Unable to save daily streak:",
      error,
    );
  }
}

// =====================================================
// Record Today's Visit
// =====================================================

// Loads the saved streak, compares it with today's local
// calendar date, and returns the updated result.
export async function recordDailyVisit(
  currentDate: Date = new Date(),
): Promise<DailyStreak> {
  const savedStreak =
    await loadDailyStreak();

  const todayDateKey =
    getLocalDateKey(
      currentDate,
    );

  // First recorded app visit.
  if (!savedStreak.lastVisitDate) {
    const firstVisitStreak: DailyStreak = {
      currentStreak: 1,
      bestStreak: Math.max(
        savedStreak.bestStreak,
        1,
      ),
      lastVisitDate:
        todayDateKey,
    };

    await saveDailyStreak(
      firstVisitStreak,
    );

    return firstVisitStreak;
  }

  // Opening multiple times on the same day should not
  // increase the streak.
  if (
    savedStreak.lastVisitDate ===
    todayDateKey
  ) {
    return savedStreak;
  }

  const dayDifference =
    getCalendarDayDifference(
      savedStreak.lastVisitDate,
      todayDateKey,
    );

  // Returning the next calendar day continues the streak.
  if (dayDifference === 1) {
    const continuedStreak =
      savedStreak.currentStreak + 1;

    const updatedStreak: DailyStreak = {
      currentStreak:
        continuedStreak,

      bestStreak: Math.max(
        savedStreak.bestStreak,
        continuedStreak,
      ),

      lastVisitDate:
        todayDateKey,
    };

    await saveDailyStreak(
      updatedStreak,
    );

    return updatedStreak;
  }

  // If the device date moved backward, avoid awarding or
  // resetting the streak until a valid future day occurs.
  if (
    dayDifference !== null &&
    dayDifference < 0
  ) {
    return savedStreak;
  }

  // Missing one or more days resets the current streak.
  const resetStreak: DailyStreak = {
    currentStreak: 1,

    bestStreak: Math.max(
      savedStreak.bestStreak,
      1,
    ),

    lastVisitDate:
      todayDateKey,
  };

  await saveDailyStreak(
    resetStreak,
  );

  return resetStreak;
}

// =====================================================
// Clear Daily Streak
// =====================================================

// Used by Reset All Progress in Settings.
export async function clearDailyStreak(): Promise<void> {
  try {
    await AsyncStorage.removeItem(
      DAILY_STREAK_STORAGE_KEY,
    );
  } catch (error) {
    console.error(
      "Unable to clear daily streak:",
      error,
    );
  }
}