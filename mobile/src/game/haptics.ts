// =====================================================
// File: haptics.ts
//
// Purpose:
// Centralizes every vibration used throughout Roast or
// Toast.
//
// Instead of calling Expo Haptics directly throughout
// the app, every screen calls one of these helper
// functions.
//
// This keeps gameplay code cleaner and makes it easy to
// adjust the feel of the game later.
//
// Project: Roast or Toast
// =====================================================

import * as Haptics from "expo-haptics";

// =====================================================
// Regular Votes
// =====================================================

// Roast should feel stronger.
export async function playRoastHaptic() {
  await Haptics.impactAsync(
    Haptics.ImpactFeedbackStyle.Medium,
  );
}

// Toast is softer.
export async function playToastHaptic() {
  await Haptics.impactAsync(
    Haptics.ImpactFeedbackStyle.Light,
  );
}

// =====================================================
// Guess the Crowd
// =====================================================

// Correct prediction.
export async function playCrowdCorrectHaptic() {
  await Haptics.notificationAsync(
    Haptics.NotificationFeedbackType.Success,
  );
}

// Incorrect prediction.
export async function playCrowdWrongHaptic() {
  await Haptics.notificationAsync(
    Haptics.NotificationFeedbackType.Warning,
  );
}

// =====================================================
// Heat / Leveling
// =====================================================

// Leveling up should feel exciting.
export async function playLevelUpHaptic() {
  await Haptics.notificationAsync(
    Haptics.NotificationFeedbackType.Success,
  );
}

// =====================================================
// Navigation
// =====================================================

// Small tap used for Next and Continue.
export async function playNavigationHaptic() {
  await Haptics.selectionAsync();
}