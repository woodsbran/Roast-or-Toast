// =====================================================
// File: _layout.tsx
//
// Purpose:
// Controls the main navigation stack for the app.
//
// The native splash screen stays visible briefly so the
// Roast or Toast branding does not disappear too fast.
//
// Project: Roast or Toast
// =====================================================

import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

import {
  useEffect,
  useState,
} from "react";

// Keep the native splash screen visible until we
// explicitly hide it.
//
// This must run outside the component so it begins as
// early as possible during app startup.
void SplashScreen.preventAutoHideAsync();

// Adds a smooth fade when the splash disappears.
SplashScreen.setOptions({
  duration: 500,
  fade: true,
});

// Minimum amount of time the splash remains visible.
//
// 3000 milliseconds = 3 seconds.
const MINIMUM_SPLASH_TIME = 3000;

export default function RootLayout() {
  const [
    isAppReady,
    setIsAppReady,
  ] = useState(false);

  // =====================================================
  // Prepare App
  // =====================================================

  useEffect(() => {
    let isActive = true;

    const prepareApp =
      async () => {
        try {
          // Keeps the branded splash visible long enough
          // to be seen during a fast native launch.
          await new Promise<void>(
            (resolve) => {
              setTimeout(
                resolve,
                MINIMUM_SPLASH_TIME,
              );
            },
          );
        } catch (error) {
          console.warn(
            "Unable to prepare app:",
            error,
          );
        } finally {
          if (isActive) {
            setIsAppReady(true);
          }
        }
      };

    void prepareApp();

    return () => {
      isActive = false;
    };
  }, []);

  // =====================================================
  // Hide Native Splash
  // =====================================================

  useEffect(() => {
    if (!isAppReady) {
      return;
    }

    void SplashScreen.hideAsync();
  }, [isAppReady]);

  // Do not render the navigation stack behind the splash
  // until startup preparation is complete.
  if (!isAppReady) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Home */}
      <Stack.Screen name="index" />

      {/* Player profile and lifetime statistics */}
      <Stack.Screen name="profile" />

      {/* Local app preferences and reset controls */}
      <Stack.Screen name="settings" />

      {/* Round-mode selection */}
      <Stack.Screen name="mode-select" />

      {/* Main gameplay */}
      <Stack.Screen name="scenario" />
    </Stack>
  );
}