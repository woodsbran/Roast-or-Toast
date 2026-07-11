// =====================================================
 // File: progressStorage.ts
 //
 // Purpose:
 // Saves and restores Roast or Toast player progress.
 //
 // The saved data includes:
 // • Heat
 // • Level
 // • Roast and Toast totals
 // • Majority matches
 // • Current and best streak
 // • Guess the Crowd totals
 //
 // AsyncStorage saves data locally on the device.
 //
 // Project: Roast or Toast
 // =====================================================

 import AsyncStorage from "@react-native-async-storage/async-storage";

 import type { PlayerProgress } from "./progressTypes";

 // Unique storage key used only for player progress.
 const PLAYER_PROGRESS_STORAGE_KEY =
   "@roast_or_toast/player_progress";

 // =====================================================
 // Save Progress
 // =====================================================

 // Converts the progress object into JSON and saves it
 // locally on the player's device.
 export async function savePlayerProgress(
   progress: PlayerProgress,
 ): Promise<void> {
   try {
     const progressJson = JSON.stringify(progress);

     await AsyncStorage.setItem(
       PLAYER_PROGRESS_STORAGE_KEY,
       progressJson,
     );
   } catch (error) {
     // Saving should never crash gameplay.
     //
     // The error is logged so it can still be found during
     // development.
     console.error(
       "Unable to save player progress:",
       error,
     );
   }
 }

 // =====================================================
 // Load Progress
 // =====================================================

 // Reads saved progress from the device.
 //
 // Returns null when no saved progress exists yet.
 export async function loadPlayerProgress(): Promise<
   PlayerProgress | null
 > {
   try {
     const savedProgress = await AsyncStorage.getItem(
       PLAYER_PROGRESS_STORAGE_KEY,
     );

     if (!savedProgress) {
       return null;
     }

     return JSON.parse(savedProgress) as PlayerProgress;
   } catch (error) {
     // Invalid or unavailable saved data should not stop
     // the app from opening.
     console.error(
       "Unable to load player progress:",
       error,
     );

     return null;
   }
 }

 // =====================================================
 // Clear Progress
 // =====================================================

 // Removes all saved player progress.
 //
 // This is useful for development and may later support a
 // Reset Progress option in Settings.
 export async function clearSavedPlayerProgress(): Promise<void> {
   try {
     await AsyncStorage.removeItem(
       PLAYER_PROGRESS_STORAGE_KEY,
     );
   } catch (error) {
     console.error(
       "Unable to clear player progress:",
       error,
     );
   }
 }