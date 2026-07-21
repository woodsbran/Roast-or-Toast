// =====================================================
// File: effects.ts
//
// Purpose:
// Coordinates haptic and sound feedback used throughout
// Roast or Toast.
//
// Project: Roast or Toast
// =====================================================

import {
  playCrowdCorrectHaptic,
  playCrowdWrongHaptic,
  playHapticsEnabledPreview,
  playLevelUpHaptic,
  playNavigationHaptic,
  playRoastHaptic,
  playToastHaptic,
} from "./haptics";

import {
  playLevelUpSound,
  playNavigationSound,
  playRevealSound,
  playRoastSound,
  playSuccessSound,
  playToastSound,
  playWarningSound,
} from "./sounds";

import {
  areHapticsEnabled,
  areSoundEffectsEnabled,
} from "./settingsStorage";

async function runHaptic(
  hapticFunction: () => Promise<void>,
): Promise<void> {
  try {
    if (await areHapticsEnabled()) {
      await hapticFunction();
    }
  } catch (error) {
    console.warn("Unable to run haptic effect:", error);
  }
}

async function runSound(
  soundFunction: () => Promise<void>,
): Promise<void> {
  try {
    if (await areSoundEffectsEnabled()) {
      await soundFunction();
    }
  } catch (error) {
    console.warn("Unable to run sound effect:", error);
  }
}

function runFeedback(
  hapticFunction: () => Promise<void>,
  soundFunction: () => Promise<void>,
): void {
  void Promise.all([
    runHaptic(hapticFunction),
    runSound(soundFunction),
  ]);
}

export function triggerRoastEffect(): void {
  runFeedback(playRoastHaptic, playRoastSound);
}

export function triggerToastEffect(): void {
  runFeedback(playToastHaptic, playToastSound);
}

export function triggerCrowdPredictionEffect(): void {
  runFeedback(playNavigationHaptic, playNavigationSound);
}

export function triggerCrowdResultEffect(
  guessedCorrectly: boolean,
): void {
  if (guessedCorrectly) {
    runFeedback(playCrowdCorrectHaptic, playSuccessSound);
    return;
  }

  runFeedback(playCrowdWrongHaptic, playWarningSound);
}

export function triggerLevelUpEffect(): void {
  runFeedback(playLevelUpHaptic, playLevelUpSound);
}

export function triggerNavigationEffect(): void {
  runFeedback(playNavigationHaptic, playNavigationSound);
}

export function triggerRevealEffect(): void {
  void runSound(playRevealSound);
}

export function triggerHapticsPreview(): void {
  void playHapticsEnabledPreview();
}

export function triggerSoundPreview(): void {
  void playToastSound();
}
