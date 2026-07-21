// =====================================================
// File: sounds.ts
//
// Purpose:
// Keeps all short sound effects in one place so the
// rest of the app does not need to know where the
// audio files are stored.
//
// This file:
// • Loads each sound file.
// • Creates reusable audio players.
// • Configures audio the first time a sound is played.
// • Exposes simple helper functions for the rest of
//   the app to use.
//
// Navigation sounds were removed on purpose. Regular
// menu and screen taps now use haptics only so the app
// feels cleaner and less noisy.
//
// Project: Roast or Toast
// =====================================================

import {
  createAudioPlayer,
  setAudioModeAsync,
} from "expo-audio";

// -----------------------------------------------------
// Maps each sound name to the matching file inside
// assets/sounds.
//
// These are the only sound files currently used by
// the app.
// -----------------------------------------------------
const soundSources = {
  roast: require("../../assets/sounds/roast.mp3"),
  toast: require("../../assets/sounds/toast.mp3"),
  reveal: require("../../assets/sounds/reveal.mp3"),
  success: require("../../assets/sounds/correct.mp3"),
  warning: require("../../assets/sounds/wrong.mp3"),
  levelUp: require("../../assets/sounds/level-up.mp3"),
};

// -----------------------------------------------------
// Creates one reusable player for each sound.
//
// Reusing the same players keeps the code simple and
// avoids rebuilding a new audio player every time a
// sound effect is triggered.
// -----------------------------------------------------
const soundPlayers = {
  roast: createAudioPlayer(soundSources.roast),
  toast: createAudioPlayer(soundSources.toast),
  reveal: createAudioPlayer(soundSources.reveal),
  success: createAudioPlayer(soundSources.success),
  warning: createAudioPlayer(soundSources.warning),
  levelUp: createAudioPlayer(soundSources.levelUp),
};

// -----------------------------------------------------
// Audio only needs to be configured once while the
// app is open.
// -----------------------------------------------------
let hasConfiguredAudio = false;

// -----------------------------------------------------
// Configures the app's audio session the first time
// any sound is played.
//
// Sounds respect the phone's silent mode and do not
// continue playing in the background.
// -----------------------------------------------------
async function configureAudioOnce(): Promise<void> {
  if (hasConfiguredAudio) {
    return;
  }

  await setAudioModeAsync({
    playsInSilentMode: false,
    shouldPlayInBackground: false,
    interruptionMode: "mixWithOthers",
  });

  hasConfiguredAudio = true;
}

// This type automatically stays in sync with the keys
// inside soundPlayers.
type SoundName = keyof typeof soundPlayers;

// -----------------------------------------------------
// Shared helper used by every sound function.
//
// The player is moved back to the beginning before it
// plays so the same effect can be triggered again
// without waiting for the previous playback position.
// -----------------------------------------------------
async function playSound(
  soundName: SoundName,
): Promise<void> {
  try {
    await configureAudioOnce();

    const player = soundPlayers[soundName];

    await player.seekTo(0);
    player.play();
  } catch (error) {
    console.warn(
      `Unable to play ${soundName} sound:`,
      error,
    );
  }
}

// -----------------------------------------------------
// Public sound helpers.
//
// The rest of the app should use these functions
// instead of accessing the sound players directly.
// -----------------------------------------------------

export async function playRoastSound(): Promise<void> {
  await playSound("roast");
}

export async function playToastSound(): Promise<void> {
  await playSound("toast");
}

export async function playRevealSound(): Promise<void> {
  await playSound("reveal");
}

export async function playSuccessSound(): Promise<void> {
  await playSound("success");
}

export async function playWarningSound(): Promise<void> {
  await playSound("warning");
}

export async function playLevelUpSound(): Promise<void> {
  await playSound("levelUp");
}