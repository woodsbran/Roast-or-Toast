// =====================================================
// File: settingsStorage.ts
//
// Purpose:
// Saves and restores local Roast or Toast preferences.
//
// Current Settings:
// • Haptics enabled or disabled
//
// More preferences such as sound and notifications can
// be added here later.
//
// Project: Roast or Toast
// =====================================================

import AsyncStorage from "@react-native-async-storage/async-storage";

// Unique storage key for local app settings.
const SETTINGS_STORAGE_KEY =
  "@roast_or_toast/settings";

// Complete locally stored settings object.
export type AppSettings = {
  hapticsEnabled: boolean;
};

// Default settings for new players.
export function createDefaultSettings(): AppSettings {
  return {
    hapticsEnabled: true,
  };
}

// Ensures incomplete or older saved settings still
// contain every current property.
function normalizeSettings(
  savedSettings: Partial<AppSettings>,
): AppSettings {
  const defaults = createDefaultSettings();

  return {
    ...defaults,
    ...savedSettings,

    hapticsEnabled:
      typeof savedSettings.hapticsEnabled === "boolean"
        ? savedSettings.hapticsEnabled
        : defaults.hapticsEnabled,
  };
}

// =====================================================
// Load Settings
// =====================================================

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

// =====================================================
// Save Settings
// =====================================================

export async function saveAppSettings(
  settings: AppSettings,
): Promise<void> {
  try {
    const normalizedSettings =
      normalizeSettings(
        settings,
      );

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

// =====================================================
// Update Haptics
// =====================================================

export async function setHapticsEnabled(
  enabled: boolean,
): Promise<void> {
  const currentSettings =
    await loadAppSettings();

  await saveAppSettings({
    ...currentSettings,
    hapticsEnabled: enabled,
  });
}

// Checks the setting before a gameplay effect attempts
// to play any vibration feedback.
export async function areHapticsEnabled(): Promise<boolean> {
  const settings =
    await loadAppSettings();

  return settings.hapticsEnabled;
}