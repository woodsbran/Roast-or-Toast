// =====================================================
// File: profileStorage.ts
//
// Purpose:
// Saves and restores the player's local Roast or Toast
// profile information.
//
// Current Profile Data:
// • Nickname
//
// Gameplay statistics remain stored through the existing
// player progress system.
//
// This local profile can later be migrated to Supabase
// when real accounts and cloud saving are introduced.
//
// Project: Roast or Toast
// =====================================================

import AsyncStorage from "@react-native-async-storage/async-storage";

// Unique storage key for local profile information.
const PROFILE_STORAGE_KEY =
  "@roast_or_toast/player_profile";

// Default nickname used before the player chooses one.
export const DEFAULT_PLAYER_NICKNAME =
  "Opinionated Guest";

// Information saved for the local player profile.
export type LocalPlayerProfile = {
  nickname: string;
};

// =====================================================
// Create Default Profile
// =====================================================

export function createDefaultProfile(): LocalPlayerProfile {
  return {
    nickname: DEFAULT_PLAYER_NICKNAME,
  };
}

// =====================================================
// Normalize Saved Profile
// =====================================================

// Ensures older or incomplete saved profile objects still
// contain every property required by the current app.
function normalizeProfile(
  savedProfile: Partial<LocalPlayerProfile>,
): LocalPlayerProfile {
  const trimmedNickname =
    typeof savedProfile.nickname === "string"
      ? savedProfile.nickname.trim()
      : "";

  return {
    nickname:
      trimmedNickname.length > 0
        ? trimmedNickname
        : DEFAULT_PLAYER_NICKNAME,
  };
}

// =====================================================
// Load Profile
// =====================================================

export async function loadPlayerProfile(): Promise<LocalPlayerProfile> {
  try {
    const savedProfileJson =
      await AsyncStorage.getItem(
        PROFILE_STORAGE_KEY,
      );

    if (!savedProfileJson) {
      return createDefaultProfile();
    }

    const parsedProfile =
      JSON.parse(savedProfileJson) as Partial<LocalPlayerProfile>;

    return normalizeProfile(
      parsedProfile,
    );
  } catch (error) {
    console.error(
      "Unable to load player profile:",
      error,
    );

    return createDefaultProfile();
  }
}

// =====================================================
// Save Profile
// =====================================================

export async function savePlayerProfile(
  profile: LocalPlayerProfile,
): Promise<void> {
  try {
    const normalizedProfile =
      normalizeProfile(profile);

    await AsyncStorage.setItem(
      PROFILE_STORAGE_KEY,
      JSON.stringify(
        normalizedProfile,
      ),
    );
  } catch (error) {
    console.error(
      "Unable to save player profile:",
      error,
    );
  }
}

// =====================================================
// Clear Profile
// =====================================================

// This can later be used by the Settings screen when the
// player chooses Reset Progress.
export async function clearPlayerProfile(): Promise<void> {
  try {
    await AsyncStorage.removeItem(
      PROFILE_STORAGE_KEY,
    );
  } catch (error) {
    console.error(
      "Unable to clear player profile:",
      error,
    );
  }
}