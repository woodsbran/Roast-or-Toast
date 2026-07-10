// =====================================================
// File: index.tsx
//
// Screen: Home
//
// Purpose:
// Introduces the Roast or Toast brand and gives the
// player one clear action to begin the game.
//
// Design Direction:
// Light, modern, conversational, and playful.
// The backdrop uses Roast or Toast imagery instead of
// generic decorative circles.
//
// Project: Roast or Toast
// =====================================================

import { router } from "expo-router";
import { useRef } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Colors, Radius, Spacing } from "../theme";

export default function HomeScreen() {
  // Controls the small animation when the Ready button is pressed.
  const buttonScale = useRef(new Animated.Value(1)).current;

  // Slightly shrinks the button to confirm that it was pressed.
  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 30,
      bounciness: 4,
    }).start();
  };

  // Returns the button to its normal size.
  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 5,
    }).start();
  };

  // Opens the first Roast or Toast scenario.
  const handleReadyPress = () => {
    router.push("/scenario");
  };

  return (
    <View style={styles.container}>
      {/* =================================================
          Themed Background

          These oversized words and symbols make the
          screen feel connected to the actual game.
      ================================================= */}

      {/* Roast backdrop near the top of the screen */}
      <View style={styles.roastBackdrop}>
        <Text style={styles.roastSymbol}>🔥</Text>
        <Text style={styles.roastBackdropText}>ROAST</Text>
      </View>

      {/* Toast backdrop near the bottom of the screen */}
      <View style={styles.toastBackdrop}>
        <Text style={styles.toastBackdropText}>TOAST</Text>
        <Text style={styles.toastSymbol}>♥</Text>
      </View>

      {/* Small decorative debate labels */}
      <View style={styles.hotTakeBadge}>
        <Text style={styles.hotTakeText}>HOT TAKE</Text>
      </View>

      <View style={styles.verdictBadge}>
        <Text style={styles.verdictText}>YOUR VERDICT</Text>
      </View>

      {/* =================================================
          Main Content
      ================================================= */}

      <View style={styles.content}>
        {/* Main brand title */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoPrimary}>Roast</Text>

          <View style={styles.logoSecondLine}>
            <Text style={styles.logoOr}>or</Text>
            <Text style={styles.logoSecondary}>Toast</Text>
          </View>
        </View>

        {/* Conversational greeting */}
        <View style={styles.taglineContainer}>
          <Text style={styles.tagline}>Alright...</Text>
          <Text style={styles.taglineEmphasis}>
            let&apos;s be honest.
          </Text>
        </View>

        {/* Animated Ready button */}
        <Animated.View
          style={[
            styles.buttonWrapper,
            {
              transform: [{ scale: buttonScale }],
            },
          ]}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Ready to begin"
            onPress={handleReadyPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.buttonText}>Ready</Text>
            <Text style={styles.buttonArrow}>→</Text>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}

// =====================================================
// Styles
// =====================================================

const styles = StyleSheet.create({
  // Main screen background
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.lg,
    overflow: "hidden",
  },

  // Centers the main content vertically.
  content: {
    flex: 1,
    justifyContent: "center",
    zIndex: 2,
  },

  // =====================================================
  // Brand Title
  // =====================================================

  logoContainer: {
    marginBottom: 62,
  },

  logoPrimary: {
    color: Colors.textPrimary,
    fontSize: 66,
    fontWeight: "900",
    letterSpacing: -3,
    lineHeight: 69,
  },

  logoSecondLine: {
    flexDirection: "row",
    alignItems: "baseline",
    marginLeft: 52,
  },

  logoOr: {
    color: Colors.roast,
    fontSize: 27,
    fontWeight: "800",
    marginRight: 9,
  },

  logoSecondary: {
    color: Colors.textPrimary,
    fontSize: 52,
    fontWeight: "850",
    letterSpacing: -2.5,
    lineHeight: 57,
  },

  // =====================================================
  // Greeting
  // =====================================================

  taglineContainer: {
    marginBottom: 44,
  },

  tagline: {
    color: Colors.textSecondary,
    fontSize: 25,
    fontWeight: "500",
    lineHeight: 34,
  },

  taglineEmphasis: {
    color: Colors.textPrimary,
    fontSize: 31,
    fontWeight: "800",
    lineHeight: 41,
  },

  // =====================================================
  // Ready Button
  // =====================================================

  buttonWrapper: {
    alignSelf: "flex-start",
  },

  button: {
    minWidth: 188,
    backgroundColor: Colors.textPrimary,
    borderRadius: Radius.pill,
    paddingVertical: 18,
    paddingHorizontal: 27,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    shadowColor: "#1D1D1F",
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.17,
    shadowRadius: 16,
    elevation: 6,
  },

  buttonPressed: {
    backgroundColor: Colors.roast,
  },

  buttonText: {
    color: Colors.white,
    fontSize: 19,
    fontWeight: "800",
  },

  buttonArrow: {
    color: Colors.white,
    fontSize: 24,
    fontWeight: "600",
    marginLeft: Spacing.xl,
  },

  // =====================================================
  // Roast Backdrop
  // =====================================================

  roastBackdrop: {
    position: "absolute",
    top: 72,
    right: -47,
    transform: [{ rotate: "8deg" }],
    alignItems: "flex-end",
  },

  roastBackdropText: {
    color: Colors.roast,
    fontSize: 96,
    fontWeight: "900",
    letterSpacing: -5,
    opacity: 0.09,
  },

  roastSymbol: {
    fontSize: 46,
    opacity: 0.15,
    marginRight: 54,
    marginBottom: -20,
  },

  // =====================================================
  // Toast Backdrop
  // =====================================================

  toastBackdrop: {
    position: "absolute",
    bottom: 68,
    left: -42,
    transform: [{ rotate: "-8deg" }],
    flexDirection: "row",
    alignItems: "center",
  },

  toastBackdropText: {
    color: Colors.toast,
    fontSize: 94,
    fontWeight: "900",
    letterSpacing: -5,
    opacity: 0.09,
  },

  toastSymbol: {
    color: Colors.toast,
    fontSize: 53,
    fontWeight: "900",
    opacity: 0.15,
    marginLeft: 10,
  },

  // =====================================================
  // Small Debate Labels
  // =====================================================

  hotTakeBadge: {
    position: "absolute",
    top: 205,
    left: -18,
    borderColor: Colors.roast,
    borderWidth: 1.5,
    borderRadius: Radius.pill,
    paddingVertical: 7,
    paddingHorizontal: 16,
    opacity: 0.28,
    transform: [{ rotate: "-8deg" }],
  },

  hotTakeText: {
    color: Colors.roast,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.7,
  },

  verdictBadge: {
    position: "absolute",
    bottom: 215,
    right: -24,
    borderColor: Colors.toast,
    borderWidth: 1.5,
    borderRadius: Radius.pill,
    paddingVertical: 7,
    paddingHorizontal: 16,
    opacity: 0.3,
    transform: [{ rotate: "7deg" }],
  },

  verdictText: {
    color: Colors.toast,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.5,
  },
});