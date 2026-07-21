// =====================================================
// File: settingsStorage.ts
//
// Purpose:
// Saves and restores local Roast or Toast preferences.
//
// Current Settings:
// • Haptics enabled or disabled
// • Sound effects enabled or disabled
//
// Project: Roast or Toast
// =====================================================

import AsyncStorage from "@react-native-async-storage/async-storage";

const SETTINGS_STORAGE_KEY =
  "@roast_or_toast/settings";

export type AppSettings = {
  hapticsEnabled: boolean;
  soundEffectsEnabled: boolean;
};

export function createDefaultSettings(): AppSettings {
  return {
    hapticsEnabled: true,
    soundEffectsEnabled: true,
  };
}

function normalizeSettings(
  savedSettings: Partial<AppSettings>,
): AppSettings {
  const defaults = createDefaultSettings();

  return {
    hapticsEnabled:
      typeof savedSettings.hapticsEnabled === "boolean"
        ? savedSettings.hapticsEnabled
        : defaults.hapticsEnabled,

    soundEffectsEnabled:
      typeof savedSettings.soundEffectsEnabled === "boolean"
        ? savedSettings.soundEffectsEnabled
        : defaults.soundEffectsEnabled,
  };
}

export async function loadAppSettings(): Promise<AppSettings> {
  try {
    const savedSettingsJson =
      await AsyncStorage.getItem(
        SETTINGS_STORAGE_KEY,
      );

    if (!savedSettingsJson) {
      return createDefaultSettings();
    }

    const parsedSettings =
      JSON.parse(
        savedSettingsJson,
      ) as Partial<AppSettings>;

    return normalizeSettings(
      parsedSettings,
    );
  } catch (error) {
    console.error(
      "Unable to load app settings:",
      error,
    );

    return createDefaultSettings();
  }
}

export async function saveAppSettings(
  settings: Partial<AppSettings>,
): Promise<void> {
  try {
    const currentSettings =
      await loadAppSettings();

    const normalizedSettings =
      normalizeSettings({
        ...currentSettings,
        ...settings,
      });

    await AsyncStorage.setItem(
      SETTINGS_STORAGE_KEY,
      JSON.stringify(
        normalizedSettings,
      ),
    );
  } catch (error) {
    console.error(
      "Unable to save app settings:",
      error,
    );
  }
}

export async function setHapticsEnabled(
  enabled: boolean,
): Promise<void> {
  await saveAppSettings({
    hapticsEnabled: enabled,
  });
}

export async function areHapticsEnabled(): Promise<boolean> {
  const settings =
    await loadAppSettings();

  return settings.hapticsEnabled;
}

export async function setSoundEffectsEnabled(
  enabled: boolean,
): Promise<void> {
  await saveAppSettings({
    soundEffectsEnabled: enabled,
  });
}

export async function areSoundEffectsEnabled(): Promise<boolean> {
  const settings =
    await loadAppSettings();

  return settings.soundEffectsEnabled;
}
