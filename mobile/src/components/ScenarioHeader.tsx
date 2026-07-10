// =====================================================
// File: ScenarioHeader.tsx
//
// Purpose:
// Displays the top navigation area of the Scenario
// screen, including the back button, app name, and
// category-colored dot.
//
// Project: Roast or Toast
// =====================================================

import { Pressable, StyleSheet, Text, View } from "react-native";

import { Colors, Radius, Spacing } from "../theme";

// Information required by the header.
type ScenarioHeaderProps = {
  categoryAccent: string;
  onBackPress: () => void;
};

export default function ScenarioHeader({
  categoryAccent,
  onBackPress,
}: ScenarioHeaderProps) {
  return (
    <View style={styles.topBar}>
      {/* Returns the player to the Home screen */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Return to Home"
        onPress={onBackPress}
        style={({ pressed }) => [
          styles.backButton,
          pressed && styles.buttonPressed,
        ]}
      >
        <Text style={styles.backArrow}>←</Text>
      </Pressable>

      {/* Small app logo with the current category color */}
      <View style={styles.logoContainer}>
        <View
          style={[
            styles.categoryDot,
            { backgroundColor: categoryAccent },
          ]}
        />

        <Text style={styles.logoText}>Roast or Toast</Text>
      </View>

      {/* Keeps the logo centered between both sides */}
      <View style={styles.rightSpacer} />
    </View>
  );
}

// =====================================================
// Styles
// =====================================================

const styles = StyleSheet.create({
  topBar: {
    paddingTop: 68,
    paddingHorizontal: Spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 3,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: Radius.pill,
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
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
  },

  backArrow: {
    color: Colors.textPrimary,
    fontSize: 25,
    fontWeight: "600",
    marginTop: -2,
  },

  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 7,
  },

  logoText: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: -0.6,
  },

  rightSpacer: {
    width: 44,
  },
});