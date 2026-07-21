// =====================================================
// File: effects.ts
//
// Purpose:
// Coordinates every haptic and sound effect used
// throughout Roast or Toast.
//
// This file acts as the middle layer between the UI
// and the individual haptic and sound helper files.
//
// The rest of the app should call these functions
// instead of playing sounds or haptics directly.
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

// -----------------------------------------------------
// Runs a haptic only when haptics are enabled in the
// player's settings.
// -----------------------------------------------------
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

// -----------------------------------------------------
// Runs a sound only when sound effects are enabled in
// the player's settings.
// -----------------------------------------------------
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

// -----------------------------------------------------
// Runs a haptic and sound together.
//
// I use this for gameplay moments where both types of
// feedback should happen at the same time.
// -----------------------------------------------------
function runFeedback(
  hapticFunction: () => Promise<void>,
  soundFunction: () => Promise<void>,
): void {
  void Promise.all([
    runHaptic(hapticFunction),
    runSound(soundFunction),
  ]);
}

// -----------------------------------------------------
// Regular Roast selection.
//
// This is used during normal Roast or Toast gameplay,
// where the Roast sound should play with the haptic.
// -----------------------------------------------------
export function triggerRoastEffect(): void {
  runFeedback(
    playRoastHaptic,
    playRoastSound,
  );
}

// -----------------------------------------------------
// Regular Toast selection.
//
// This is used during normal Roast or Toast gameplay,
// where the Toast sound should play with the haptic.
// -----------------------------------------------------
export function triggerToastEffect(): void {
  runFeedback(
    playToastHaptic,
    playToastSound,
  );
}

// -----------------------------------------------------
// Roast selection used during Guess the Crowd.
//
// This intentionally uses haptics only. The applause
// or oops sound will play when the result is revealed,
// so I do not want the Roast sound playing on top of it.
// -----------------------------------------------------
export function triggerCrowdRoastSelectionEffect(): void {
  void runHaptic(playRoastHaptic);
}

// -----------------------------------------------------
// Toast selection used during Guess the Crowd.
//
// This intentionally uses haptics only. The applause
// or oops sound will play when the result is revealed,
// so I do not want the Toast sound playing on top of it.
// -----------------------------------------------------
export function triggerCrowdToastSelectionEffect(): void {
  void runHaptic(playToastHaptic);
}

// -----------------------------------------------------
// General Crowd Guess prediction feedback.
//
// This uses a light navigation haptic only. Navigation
// sounds were removed because they made the app feel
// too noisy.
// -----------------------------------------------------
export function triggerCrowdPredictionEffect(): void {
  void runHaptic(playNavigationHaptic);
}

// -----------------------------------------------------
// Feedback after a Guess the Crowd result is revealed.
//
// A correct guess plays the applause sound.
// A wrong guess plays the oops sound.
//
// Only one result sound should play for each guess.
// -----------------------------------------------------
export function triggerCrowdResultEffect(
  guessedCorrectly: boolean,
): void {
  if (guessedCorrectly) {
    runFeedback(
      playCrowdCorrectHaptic,
      playSuccessSound,
    );

    return;
  }

  runFeedback(
    playCrowdWrongHaptic,
    playWarningSound,
  );
}

// -----------------------------------------------------
// Celebration shown when the player reaches a new
// level.
// -----------------------------------------------------
export function triggerLevelUpEffect(): void {
  runFeedback(
    playLevelUpHaptic,
    playLevelUpSound,
  );
}

// -----------------------------------------------------
// General navigation throughout the app.
//
// I am keeping navigation haptic-only so regular menu
// taps feel responsive without making unnecessary
// sounds.
// -----------------------------------------------------
export function triggerNavigationEffect(): void {
  void runHaptic(playNavigationHaptic);
}

// -----------------------------------------------------
// Plays the short reveal sound.
//
// This does not include a haptic because the reveal
// animation already provides visual feedback.
// -----------------------------------------------------
export function triggerRevealEffect(): void {
  void runSound(playRevealSound);
}

// -----------------------------------------------------
// Preview used on the Settings screen when the player
// turns haptics on.
// -----------------------------------------------------
export function triggerHapticsPreview(): void {
  void playHapticsEnabledPreview();
}

// -----------------------------------------------------
// Preview used on the Settings screen when the player
// turns sound effects on.
//
// I use the Toast sound because it is short and gives
// a clear example without being too loud.
// -----------------------------------------------------
export function triggerSoundPreview(): void {
  void playToastSound();
}