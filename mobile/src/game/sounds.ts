// =====================================================
// File: sounds.ts
//
// Purpose:
// Centralizes short sound effects used throughout
// Roast or Toast.
//
// Project: Roast or Toast
// =====================================================

import {
  createAudioPlayer,
  setAudioModeAsync,
} from "expo-audio";

const soundSources = {
  roast: require("../../assets/sounds/roast.wav"),
  toast: require("../../assets/sounds/toast.wav"),
  navigation: require("../../assets/sounds/navigation.wav"),
  reveal: require("../../assets/sounds/reveal.wav"),
  success: require("../../assets/sounds/success.wav"),
  warning: require("../../assets/sounds/warning.wav"),
  levelUp: require("../../assets/sounds/level-up.wav"),
};

const soundPlayers = {
  roast: createAudioPlayer(soundSources.roast),
  toast: createAudioPlayer(soundSources.toast),
  navigation: createAudioPlayer(soundSources.navigation),
  reveal: createAudioPlayer(soundSources.reveal),
  success: createAudioPlayer(soundSources.success),
  warning: createAudioPlayer(soundSources.warning),
  levelUp: createAudioPlayer(soundSources.levelUp),
};

let hasConfiguredAudio = false;

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
