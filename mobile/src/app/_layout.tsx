// =====================================================
// File: _layout.tsx
//
// Purpose:
// Controls app navigation and startup splash.
//
// Shows the Roast or Toast splash artwork briefly
// before displaying the main app.
//
// Project: Roast or Toast
// =====================================================

import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

import {
  useEffect,
  useState,
} from "react";

import {
  Image,
  StyleSheet,
  View,
} from "react-native";

// =====================================================
// Native Splash
// =====================================================

// Keep the native splash visible while React starts.
void SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 300,
  fade: true,
});

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);

  // =====================================================
  // Startup
  // =====================================================

  useEffect(() => {
    let isActive = true;

    const startApp = async () => {
      try {
        // React is ready to display our splash artwork,
        // so we can hide the native launch screen.
        await SplashScreen.hideAsync();

        // Leave our branded splash visible long enough
        // for the player to actually see it.
        setTimeout(() => {
          if (isActive) {
            setShowSplash(false);
          }
        }, 1800);
      } catch (error) {
        console.warn(
          "Unable to finish splash:",
          error,
        );

        if (isActive) {
          setShowSplash(false);
        }
      }
    };

    void startApp();

    return () => {
      isActive = false;
    };
  }, []);

  // =====================================================
  // Branded Splash
  // =====================================================

  if (showSplash) {
    return (
      <View style={styles.splashContainer}>
        <Image
          source={require("../../assets/images/splash-icon.png")}
          style={styles.splashImage}
          resizeMode="cover"
        />
      </View>
    );
  }

  // =====================================================
  // Navigation
  // =====================================================

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="mode-select" />
      <Stack.Screen name="scenario" />
    </Stack>
  );
}

// =====================================================
// Styles
// =====================================================

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: "#000000",
  },

  splashImage: {
    width: "100%",
    height: "100%",
  },
});