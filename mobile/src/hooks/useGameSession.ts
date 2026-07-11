// =====================================================
// File: useGameSession.ts
//
// Purpose:
// Provides screens with an easy way to load, save, and
// clear the active Roast or Toast gameplay session.
//
// This hook does not control gameplay rules. It only
// manages local session persistence.
//
// Project: Roast or Toast
// =====================================================

import { useCallback, useEffect, useState } from "react";

import {
  clearGameSession,
  loadGameSession,
  saveGameSession,
} from "../game/sessionStorage";

import type { SavedGameSession } from "../game/sessionTypes";

export function useGameSession() {
  // Stores the restored session, when one exists.
  const [savedSession, setSavedSession] =
    useState<SavedGameSession | null>(null);

  // Indicates whether the first storage check is complete.
  const [hasLoadedSession, setHasLoadedSession] =
    useState(false);

  // =====================================================
  // Load Session
  // =====================================================

  const refreshSavedSession = useCallback(async () => {
    const session = await loadGameSession();

    setSavedSession(session);
    setHasLoadedSession(true);

    return session;
  }, []);

  // Checks device storage when the hook first opens.
  useEffect(() => {
    refreshSavedSession();
  }, [refreshSavedSession]);

  // =====================================================
  // Save Session
  // =====================================================

  const storeSession = async (
    session: SavedGameSession,
  ): Promise<void> => {
    await saveGameSession(session);
    setSavedSession(session);
  };

  // =====================================================
  // Clear Session
  // =====================================================

  const removeSession = async (): Promise<void> => {
    await clearGameSession();
    setSavedSession(null);
  };

  return {
    savedSession,
    hasLoadedSession,

    refreshSavedSession,
    storeSession,
    removeSession,
  };
}