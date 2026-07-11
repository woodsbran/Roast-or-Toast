// =====================================================
// File: sessionStorage.ts
//
// Purpose:
// Saves, loads, and clears the player's active gameplay
// session using AsyncStorage.
//
// This allows a guest player to close the app, return
// later, and continue on the same device without needing
// an account.
//
// Project: Roast or Toast
// =====================================================

import AsyncStorage from "@react-native-async-storage/async-storage";

import type { SavedGameSession } from "./sessionTypes";

// Unique key used only for active gameplay sessions.
const GAME_SESSION_STORAGE_KEY =
  "@roast_or_toast/active_game_session";

// =====================================================
// Save Session
// =====================================================

// Converts the session into JSON and stores it locally.
export async function saveGameSession(
  session: SavedGameSession,
): Promise<void> {
  try {
    const sessionJson = JSON.stringify(session);

    await AsyncStorage.setItem(
      GAME_SESSION_STORAGE_KEY,
      sessionJson,
    );
  } catch (error) {
    // A storage failure should not crash gameplay.
    console.error(
      "Unable to save active game session:",
      error,
    );
  }
}

// =====================================================
// Load Session
// =====================================================

// Reads the active session from local device storage.
//
// Returns null when no session has been saved.
export async function loadGameSession(): Promise<
  SavedGameSession | null
> {
  try {
    const savedSession = await AsyncStorage.getItem(
      GAME_SESSION_STORAGE_KEY,
    );

    if (!savedSession) {
      return null;
    }

    return JSON.parse(savedSession) as SavedGameSession;
  } catch (error) {
    console.error(
      "Unable to load active game session:",
      error,
    );

    return null;
  }
}

// =====================================================
// Clear Session
// =====================================================

// Removes the active gameplay session.
//
// Permanent player progress such as Heat and level is not
// removed by this function.
export async function clearGameSession(): Promise<void> {
  try {
    await AsyncStorage.removeItem(
      GAME_SESSION_STORAGE_KEY,
    );
  } catch (error) {
    console.error(
      "Unable to clear active game session:",
      error,
    );
  }
}

// =====================================================
// Session Availability
// =====================================================

// Returns true when a valid active session exists.
//
// The Home screen will use this to decide whether to show
// Continue Session.
export async function hasSavedGameSession(): Promise<boolean> {
  const session = await loadGameSession();

  return Boolean(session?.hasActiveSession);
}