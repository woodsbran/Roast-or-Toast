// =====================================================
// File: effects.ts
//
// Purpose:
// Coordinates the feedback effects used throughout
// Roast or Toast.
//
// Current Effects:
// • Haptics
//
// Future Effects:
// • Sounds
// • Floating Heat animations
// • Confetti
// • Fire and heart particles
// • Screen transitions
//
// Gameplay components call these functions instead of
// directly calling Expo Haptics. This keeps effects
// centralized and easier to change later.
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

// =====================================================
// Vote Effects
// =====================================================

// Runs when the player chooses Roast.
//
// Later, this can also trigger:
// • Fire particles
// • Roast sound
// • Stronger button animation
export function triggerRoastEffect(): void {
  void playRoastHaptic();
}

// Runs when the player chooses Toast.
//
// Later, this can also trigger:
// • Heart particles
// • Toast sound
// • Softer button animation
export function triggerToastEffect(): void {
  void playToastHaptic();
}

// =====================================================
// Guess the Crowd Effects
// =====================================================

// Gives light feedback when the player locks in their
// crowd prediction.
export function triggerCrowdPredictionEffect(): void {
  void playNavigationHaptic();
}

// Runs after the Guess the Crowd prediction is scored.
export function triggerCrowdResultEffect(
  guessedCorrectly: boolean,
): void {
  if (guessedCorrectly) {
    void playCrowdCorrectHaptic();
    return;
  }

  void playCrowdWrongHaptic();
}

// =====================================================
// Level Effects
// =====================================================

// Runs when the player reaches a new level.
//
// Later, this will also trigger confetti and a larger
// title-unlock animation.
export function triggerLevelUpEffect(): void {
  void playLevelUpHaptic();
}

// =====================================================
// Navigation Effects
// =====================================================

// Used by Next, Continue, Back, and Home controls.
export function triggerNavigationEffect(): void {
  void playNavigationHaptic();
}