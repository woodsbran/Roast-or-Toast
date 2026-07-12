// =====================================================
// File: useDailyStreak.ts
//
// Purpose:
// Gives screens access to the locally saved daily return
// streak.
//
// The hook:
// • Records today's visit once
// • Exposes current and best streaks
// • Reloads when the screen becomes active
//
// Project: Roast or Toast
// =====================================================

import {
  useCallback,
  useState,
} from "react";

import {
  useFocusEffect,
} from "expo-router";

import {
  createDefaultDailyStreak,
  recordDailyVisit,
  type DailyStreak,
} from "../game/dailyStreakStorage";

export function useDailyStreak() {
  const [
    dailyStreak,
    setDailyStreak,
  ] = useState<DailyStreak>(
    createDefaultDailyStreak,
  );

  const [
    hasLoadedDailyStreak,
    setHasLoadedDailyStreak,
  ] = useState(false);

  // Runs whenever the screen using this hook becomes
  // active.
  //
  // recordDailyVisit prevents duplicate increases on the
  // same calendar day.
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const restoreDailyStreak =
        async () => {
          const updatedStreak =
            await recordDailyVisit();

          if (!isActive) {
            return;
          }

          setDailyStreak(
            updatedStreak,
          );

          setHasLoadedDailyStreak(
            true,
          );
        };

      void restoreDailyStreak();

      return () => {
        isActive = false;
      };
    }, []),
  );

  return {
    dailyStreak,
    hasLoadedDailyStreak,
  };
}