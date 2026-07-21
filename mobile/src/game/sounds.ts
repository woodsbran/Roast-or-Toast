// =====================================================
// File: sounds.ts
//
// Purpose:
// Keeps all short sound effects in one place so the
// rest of the app doesn't need to know where audio
// files are stored.
//
// This file:
// • Loads every sound once.
// • Creates reusable audio players.
// • Configures audio the first time a sound is played.
// • Exposes simple helper functions like
//   playRoastSound() and playToastSound().
//
// If a sound ever needs to be replaced, update the
// filename below instead of changing code throughout
// the app.
//
// Project: Roast or Toast
// =====================================================

import {
  createAudioPlayer,
  setAudioModeAsync,
} from "expo-audio";

// -----------------------------------------------------
// Maps each sound name to its corresponding file in
// assets/sounds.
// -----------------------------------------------------
const soundSources = {
  roast: require("../../assets/sounds/roast.mp3"),
  toast: require("../../assets/sounds/toast.mp3"),
  navigation: require("../../assets/sounds/navigation.wav"),
  reveal: require("../../assets/sounds/reveal.mp3"),
  success: require("../../assets/sounds/correct.mp3"),
  warning: require("../../assets/sounds/wrong.mp3"),
  levelUp: require("../../assets/sounds/level-up.mp3"),
};

// -----------------------------------------------------
// Create each audio player once when the app starts.
// Reusing the same player is much faster than creating
// a new one every time a sound is played.
// -----------------------------------------------------
const soundPlayers = {
  roast: createAudioPlayer(soundSources.roast),
  toast: createAudioPlayer(soundSources.toast),
  navigation: createAudioPlayer(soundSources.navigation),
  reveal: createAudioPlayer(soundSources.reveal),
  success: createAudioPlayer(soundSources.success),
  warning: createAudioPlayer(soundSources.warning),
  levelUp: createAudioPlayer(soundSources.levelUp),
};

// -----------------------------------------------------
// Audio settings only need to be configured once while
// the app is running.
// -----------------------------------------------------
let hasConfiguredAudio = false;

// -----------------------------------------------------
// Configure the audio session the first time a sound
// is played.
//
// This prevents repeating the same setup work every
// time another sound effect is triggered.
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

type SoundName = keyof typeof soundPlayers;

// -----------------------------------------------------
// Generic helper used by every sound effect.
//
// Before playing, rewind the sound back to the
// beginning so rapid taps always play from the start.
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
// The rest of the app should call these functions
// instead of interacting with the audio players
// directly.
// -----------------------------------------------------

export async function playRoastSound(): Promise<void> {
  await playSound("roast");
}

export async function playToastSound(): Promise<void> {
  await playSound("toast");
}

export async function playNavigationSound(): Promise<void> {
  await playSound("navigation");
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