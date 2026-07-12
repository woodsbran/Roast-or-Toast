// =====================================================
// File: effects.ts
//
// Purpose:
// Coordinates feedback effects used throughout
// Roast or Toast.
//
// Current Effects:
// • Haptics
//
// Every haptic checks the player's local Settings before
// running.
//
// Future Effects:
// • Sounds
// • Floating Heat animations
// • Confetti
// • Fire and heart particles
//
// Project: Roast or Toast
// =====================================================

import {
  playCrowdCorrectHaptic,
  playCrowdWrongHaptic,
  playLevelUpHaptic,
  playNavigationHaptic,
  playRoastHaptic,
  playToastHaptic,
} from "./haptics";

import {
  areHapticsEnabled,
} from "./settingsStorage";

// Runs one haptic only when the player has haptics
// enabled in Settings.
async function runHaptic(
  hapticFunction: () => Promise<void>,
): Promise<void> {
  const hapticsEnabled =
    await areHapticsEnabled();

  if (!hapticsEnabled) {
    return;
  }

  await hapticFunction();
}

// =====================================================
// Vote Effects
// =====================================================

export function triggerRoastEffect(): void {
  void runHaptic(
    playRoastHaptic,
  );
}

export function triggerToastEffect(): void {
  void runHaptic(
    playToastHaptic,
  );
}

// =====================================================
// Guess the Crowd Effects
// =====================================================

export function triggerCrowdPredictionEffect(): void {
  void runHaptic(
    playNavigationHaptic,
  );
}

export function triggerCrowdResultEffect(
  guessedCorrectly: boolean,
): void {
  if (guessedCorrectly) {
    void runHaptic(
      playCrowdCorrectHaptic,
    );

    return;
  }

  void runHaptic(
    playCrowdWrongHaptic,
  );
}

// =====================================================
// Level Effects
// =====================================================

export function triggerLevelUpEffect(): void {
  void runHaptic(
    playLevelUpHaptic,
  );
}

// =====================================================
// Navigation Effects
// =====================================================

export function triggerNavigationEffect(): void {
  void runHaptic(
    playNavigationHaptic,
  );
}