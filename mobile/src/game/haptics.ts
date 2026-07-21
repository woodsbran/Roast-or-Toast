// =====================================================
// File: haptics.ts
//
// Purpose:
// Centralizes every haptic pattern used throughout
// Roast or Toast.
//
// Instead of calling Expo Haptics directly throughout
// the app, every screen calls one of these helpers.
//
// These patterns use small pauses between taps so Roast,
// Toast, correct guesses, and level-ups each feel
// noticeably different on a physical iPhone.
//
// Important:
// iOS haptics feel like short Taptic Engine taps rather
// than a long Android-style vibration.
//
// Project: Roast or Toast
// =====================================================

import * as Haptics from "expo-haptics";

// =====================================================
// Timing Helper
// =====================================================

// Adds a small pause between taps in a haptic pattern.
function wait(
  durationInMilliseconds: number,
): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(
      resolve,
      durationInMilliseconds,
    );
  });
}

// =====================================================
// Safe Haptic Runner
// =====================================================

// Haptics should never crash gameplay.
//
// If the device cannot perform a requested pattern, the
// error is logged during development and the game keeps
// running normally.
async function safelyRunHaptic(
  hapticAction: () => Promise<void>,
): Promise<void> {
  try {
    await hapticAction();
  } catch (error) {
    console.warn(
      "Unable to play haptic feedback:",
      error,
    );
  }
}

// =====================================================
// Regular Votes
// =====================================================

// Roast receives one strong, decisive impact.
export async function playRoastHaptic(): Promise<void> {
  await safelyRunHaptic(
    async () => {
      await Haptics.impactAsync(
        Haptics.ImpactFeedbackStyle.Heavy,
      );
    },
  );
}

// Toast receives two lighter taps.
//
// This gives Toast a warmer and more playful feel without
// making it as forceful as Roast.
export async function playToastHaptic(): Promise<void> {
  await safelyRunHaptic(
    async () => {
      await Haptics.impactAsync(
        Haptics.ImpactFeedbackStyle.Light,
      );

      await wait(85);

      await Haptics.impactAsync(
        Haptics.ImpactFeedbackStyle.Medium,
      );
    },
  );
}

// =====================================================
// Guess the Crowd
// =====================================================

// Correct prediction gets a success notification followed
// by a small celebratory tap.
export async function playCrowdCorrectHaptic(): Promise<void> {
  await safelyRunHaptic(
    async () => {
      await Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success,
      );

      await wait(110);

      await Haptics.impactAsync(
        Haptics.ImpactFeedbackStyle.Light,
      );
    },
  );
}

// Incorrect prediction gets a warning pattern.
//
// We keep this noticeable but not harsh because guessing
// incorrectly should still feel playful.
export async function playCrowdWrongHaptic(): Promise<void> {
  await safelyRunHaptic(
    async () => {
      await Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Warning,
      );
    },
  );
}

// =====================================================
// Heat / Leveling
// =====================================================

// Leveling up gets the largest celebration pattern.
//
// The pattern rises from light to medium to heavy so the
// player can feel that something special happened.
export async function playLevelUpHaptic(): Promise<void> {
  await safelyRunHaptic(
    async () => {
      await Haptics.impactAsync(
        Haptics.ImpactFeedbackStyle.Light,
      );

      await wait(90);

      await Haptics.impactAsync(
        Haptics.ImpactFeedbackStyle.Medium,
      );

      await wait(100);

      await Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success,
      );
    },
  );
}

// =====================================================
// Navigation
// =====================================================

// Small tap used for Next, Continue, Back, and Home.
//
// Navigation should feel responsive without becoming
// distracting during a full round.
export async function playNavigationHaptic(): Promise<void> {
  await safelyRunHaptic(
    async () => {
      await Haptics.selectionAsync();
    },
  );
}

// =====================================================
// Settings Preview
// =====================================================

// Lets the Settings screen immediately demonstrate that
// haptics were turned on.
//
// We will connect this during the next settings update.
export async function playHapticsEnabledPreview(): Promise<void> {
  await safelyRunHaptic(
    async () => {
      await Haptics.impactAsync(
        Haptics.ImpactFeedbackStyle.Medium,
      );

      await wait(80);

      await Haptics.impactAsync(
        Haptics.ImpactFeedbackStyle.Light,
      );
    },
  );
}