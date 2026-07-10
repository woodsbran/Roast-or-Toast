// =====================================================
// File: IntermissionCard.tsx
//
// Purpose:
// Gives the player a short break after completing a set
// number of Roast or Toast Moments.
//
// This keeps gameplay from feeling like an endless list
// of questions.
//
// Future Versions:
// • Guess the Crowd
// • Speed Round
// • Session statistics
// • Bonus Moments
// • Rewards and points
//
// Project: Roast or Toast
// =====================================================

import { Pressable, StyleSheet, Text, View } from "react-native";

import { Colors, Radius, Spacing } from "../theme";

// Information required by the intermission card.
type IntermissionCardProps = {
  completedMoments: number;
  onContinue: () => void;
};

export default function IntermissionCard({
  completedMoments,
  onContinue,
}: IntermissionCardProps) {
  return (
    <View style={styles.container}>
      {/* Decorative background words */}
      <Text style={styles.roastBackdrop}>ROAST</Text>
      <Text style={styles.toastBackdrop}>TOAST</Text>

      {/* Small intermission label */}
      <View style={styles.badge}>
        <Text style={styles.badgeText}>QUICK BREAK</Text>
      </View>

      {/* Main break message */}
      <Text style={styles.heading}>Okay, pause.</Text>

      <Text style={styles.message}>
        You just weighed in on {completedMoments} hot takes.
      </Text>

      <Text style={styles.subMessage}>
        Take a breath. The next round is waiting.
      </Text>

      {/* Returns the player to the shuffled Moment deck */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Continue playing"
        onPress={onContinue}
        style={({ pressed }) => [
          styles.continueButton,
          pressed && styles.continueButtonPressed,
        ]}
      >
        <Text style={styles.continueButtonText}>Keep Going</Text>
        <Text style={styles.continueArrow}>→</Text>
      </Pressable>
    </View>
  );
}

// =====================================================
// Styles
// =====================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: "center",
    paddingHorizontal: Spacing.lg,
    overflow: "hidden",
  },

  badge: {
    alignSelf: "flex-start",
    backgroundColor: Colors.surface,
    borderColor: Colors.roast,
    borderWidth: 1.5,
    borderRadius: Radius.pill,
    paddingVertical: 7,
    paddingHorizontal: 15,
    marginBottom: 30,
    transform: [{ rotate: "-2deg" }],
  },

  badgeText: {
    color: Colors.roast,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.7,
  },

  heading: {
    color: Colors.textPrimary,
    fontSize: 48,
    fontWeight: "900",
    letterSpacing: -2,
    lineHeight: 54,
    marginBottom: Spacing.md,
  },

  message: {
    color: Colors.textPrimary,
    fontSize: 23,
    fontWeight: "800",
    lineHeight: 31,
    marginBottom: Spacing.sm,
  },

  subMessage: {
    color: Colors.textSecondary,
    fontSize: 17,
    fontWeight: "600",
    lineHeight: 25,
    marginBottom: 42,
  },

  continueButton: {
    backgroundColor: Colors.textPrimary,
    borderRadius: Radius.pill,
    paddingVertical: 17,
    paddingHorizontal: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.14,
    shadowRadius: 14,
    elevation: 5,
  },

  continueButtonPressed: {
    opacity: 0.78,
    transform: [{ scale: 0.98 }],
  },

  continueButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "900",
  },

  continueArrow: {
    color: Colors.white,
    fontSize: 23,
    fontWeight: "700",
  },

  roastBackdrop: {
    position: "absolute",
    top: 90,
    right: -55,
    color: Colors.roast,
    fontSize: 96,
    fontWeight: "900",
    letterSpacing: -5,
    opacity: 0.08,
    transform: [{ rotate: "8deg" }],
  },

  toastBackdrop: {
    position: "absolute",
    bottom: 70,
    left: -48,
    color: Colors.toast,
    fontSize: 92,
    fontWeight: "900",
    letterSpacing: -5,
    opacity: 0.08,
    transform: [{ rotate: "-8deg" }],
  },
});