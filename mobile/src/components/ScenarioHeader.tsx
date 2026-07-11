// =====================================================
// File: ScenarioHeader.tsx
//
// Purpose:
// Provides consistent navigation across every gameplay
// screen.
//
// The header includes:
// • Back button
// • Roast or Toast branding
// • Home button
//
// Navigation buttons use the shared Game Effects layer
// so their feedback stays consistent.
//
// Project: Roast or Toast
// =====================================================

import { Ionicons } from "@expo/vector-icons";

import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { triggerNavigationEffect } from "../game/effects";

import {
  Colors,
  Radius,
  Spacing,
} from "../theme";

type ScenarioHeaderProps = {
  // Accent color changes with the category or mode.
  accentColor: string;

  // Controls the back button.
  onBackPress: () => void;

  // Returns directly to Home.
  onHomePress: () => void;
};

export default function ScenarioHeader({
  accentColor,
  onBackPress,
  onHomePress,
}: ScenarioHeaderProps) {
  // Provides touch feedback before going back.
  const handleBackPress = () => {
    triggerNavigationEffect();
    onBackPress();
  };

  // Provides touch feedback before returning Home.
  const handleHomePress = () => {
    triggerNavigationEffect();
    onHomePress();
  };

  return (
    <View style={styles.container}>
      {/* Back button */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Go back"
        onPress={handleBackPress}
        style={({ pressed }) => [
          styles.navigationButton,
          pressed && styles.buttonPressed,
        ]}
      >
        <Ionicons
          name="arrow-back"
          size={25}
          color={Colors.textPrimary}
        />
      </Pressable>

      {/* App branding */}
      <View style={styles.logoContainer}>
        <View
          style={[
            styles.accentDot,
            {
              backgroundColor: accentColor,
            },
          ]}
        />

        <Text style={styles.logoText}>
          Roast or Toast
        </Text>
      </View>

      {/* Home button */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Return to Home"
        onPress={handleHomePress}
        style={({ pressed }) => [
          styles.navigationButton,
          pressed && styles.buttonPressed,
        ]}
      >
        <Ionicons
          name="home-outline"
          size={23}
          color={Colors.textPrimary}
        />
      </Pressable>
    </View>
  );
}

// =====================================================
// Styles
// =====================================================

const styles = StyleSheet.create({
  container: {
    paddingTop: 62,
    paddingBottom: 16,
    paddingHorizontal: Spacing.lg,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    backgroundColor: Colors.background,
    zIndex: 20,
  },

  navigationButton: {
    width: 44,
    height: 44,

    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Colors.border,

    backgroundColor: Colors.surface,

    alignItems: "center",
    justifyContent: "center",

    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },

  buttonPressed: {
    opacity: 0.65,
    transform: [{ scale: 0.96 }],
  },

  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  accentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },

  logoText: {
    color: Colors.textPrimary,
    fontSize: 19,
    fontWeight: "900",
    letterSpacing: -0.7,
  },
});