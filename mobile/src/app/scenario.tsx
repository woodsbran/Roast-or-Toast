// =====================================================
// File: scenario.tsx
//
// Screen: Scenario
//
// Purpose:
// Displays one Roast or Toast scenario and allows the
// player to choose a side.
//
// Current Version:
// • Uses the same visual identity as the Home screen
// • Displays one temporary hard-coded scenario
// • Adds animated vote buttons
// • Highlights the selected answer
//
// Next:
// • Reveal community voting percentages
// • Display funny community comments
// • Add multiple scenarios and a Next button
//
// Project: Roast or Toast
// =====================================================

import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Colors, Radius, Spacing } from "../theme";

// The two choices available for a scenario.
type VoteChoice = "roast" | "toast" | null;

export default function ScenarioScreen() {
  // Stores the player's current vote.
  const [selectedVote, setSelectedVote] = useState<VoteChoice>(null);

  // Controls the small bounce effect on the Roast button.
  const roastScale = useRef(new Animated.Value(1)).current;

  // Controls the small bounce effect on the Toast button.
  const toastScale = useRef(new Animated.Value(1)).current;

  // Runs a quick scale animation when a vote is selected.
  const animateVoteButton = (animation: Animated.Value) => {
    Animated.sequence([
      Animated.spring(animation, {
        toValue: 0.96,
        useNativeDriver: true,
        speed: 35,
        bounciness: 2,
      }),

      Animated.spring(animation, {
        toValue: 1,
        useNativeDriver: true,
        speed: 28,
        bounciness: 7,
      }),
    ]).start();
  };

  // Saves the Roast vote and animates the Roast button.
  const handleRoastVote = () => {
    setSelectedVote("roast");
    animateVoteButton(roastScale);
  };

  // Saves the Toast vote and animates the Toast button.
  const handleToastVote = () => {
    setSelectedVote("toast");
    animateVoteButton(toastScale);
  };

  // Returns the player to the Home screen.
  const handleBackPress = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* =================================================
          Themed Backdrop

          These oversized faded words match the Home
          screen and make the page feel distinctly like
          Roast or Toast.
      ================================================= */}

      <View style={styles.roastBackdrop}>
        <Text style={styles.roastBackdropText}>ROAST</Text>
      </View>

      <View style={styles.toastBackdrop}>
        <Text style={styles.toastBackdropText}>TOAST</Text>
      </View>

      {/* Small decorative symbols in the backdrop */}
      <Text style={styles.fireBackdrop}>🔥</Text>
      <Text style={styles.heartBackdrop}>♥</Text>

      {/* =================================================
          Top Navigation
      ================================================= */}

      <View style={styles.topBar}>
        {/* Back button */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Return to Home"
          onPress={handleBackPress}
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.backButtonPressed,
          ]}
        >
          <Text style={styles.backArrow}>←</Text>
        </Pressable>

        {/* Small app name keeps the screen branded */}
        <Text style={styles.smallLogo}>Roast or Toast</Text>

        {/* Empty space balances the back button */}
        <View style={styles.topBarSpacer} />
      </View>

      {/* =================================================
          Main Scenario Content
      ================================================= */}

      <View style={styles.content}>
        {/* Scenario category label */}
        <View style={styles.hotTakeBadge}>
          <Text style={styles.hotTakeText}>TODAY&apos;S HOT TAKE</Text>
        </View>

        {/* Main scenario */}
        <Text style={styles.scenarioText}>
          Your coworker hits{"\n"}
          &quot;Reply All&quot;{"\n"}
          just to say{"\n"}
          &quot;Thanks.&quot;
        </Text>

        {/* Short prompt above the voting buttons */}
        <Text style={styles.votePrompt}>What&apos;s your verdict?</Text>

        {/* =================================================
            Voting Buttons
        ================================================= */}

        <View style={styles.buttonContainer}>
          {/* Roast Button */}
          <Animated.View
            style={{
              transform: [{ scale: roastScale }],
              opacity:
                selectedVote === "toast"
                  ? 0.48
                  : 1,
            }}
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Vote Roast"
              onPress={handleRoastVote}
              style={({ pressed }) => [
                styles.voteButton,

                selectedVote === "roast"
                  ? styles.roastButtonSelected
                  : styles.voteButtonIdle,

                pressed && styles.voteButtonPressed,
              ]}
            >
              <View style={styles.voteButtonContent}>
                <Text style={styles.voteIcon}>🔥</Text>

                <View>
                  <Text
                    style={[
                      styles.voteButtonText,

                      selectedVote === "roast" &&
                        styles.selectedButtonText,
                    ]}
                  >
                    Roast
                  </Text>

                  <Text
                    style={[
                      styles.voteButtonSubtext,

                      selectedVote === "roast" &&
                        styles.selectedButtonSubtext,
                    ]}
                  >
                    Absolutely not.
                  </Text>
                </View>
              </View>

              {/* Check mark appears after selecting Roast */}
              {selectedVote === "roast" && (
                <Text style={styles.selectedCheck}>✓</Text>
              )}
            </Pressable>
          </Animated.View>

          {/* Toast Button */}
          <Animated.View
            style={{
              transform: [{ scale: toastScale }],
              opacity:
                selectedVote === "roast"
                  ? 0.48
                  : 1,
            }}
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Vote Toast"
              onPress={handleToastVote}
              style={({ pressed }) => [
                styles.voteButton,

                selectedVote === "toast"
                  ? styles.toastButtonSelected
                  : styles.voteButtonIdle,

                pressed && styles.voteButtonPressed,
              ]}
            >
              <View style={styles.voteButtonContent}>
                <Text style={styles.voteIcon}>♥</Text>

                <View>
                  <Text
                    style={[
                      styles.voteButtonText,

                      selectedVote === "toast" &&
                        styles.selectedButtonText,
                    ]}
                  >
                    Toast
                  </Text>

                  <Text
                    style={[
                      styles.voteButtonSubtext,

                      selectedVote === "toast" &&
                        styles.selectedButtonSubtext,
                    ]}
                  >
                    I&apos;ll allow it.
                  </Text>
                </View>
              </View>

              {/* Check mark appears after selecting Toast */}
              {selectedVote === "toast" && (
                <Text style={styles.selectedCheck}>✓</Text>
              )}
            </Pressable>
          </Animated.View>
        </View>

        {/* Temporary message confirms that voting works */}
        {selectedVote && (
          <Text style={styles.voteConfirmation}>
            Vote locked. Community results are coming next.
          </Text>
        )}
      </View>
    </View>
  );
}

// =====================================================
// Styles
// =====================================================

const styles = StyleSheet.create({
  // Main page background
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    overflow: "hidden",
  },

  // =====================================================
  // Top Navigation
  // =====================================================

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

    shadowColor: "#1D1D1F",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },

  backButtonPressed: {
    opacity: 0.65,
  },

  backArrow: {
    color: Colors.textPrimary,
    fontSize: 25,
    fontWeight: "600",
    marginTop: -2,
  },

  smallLogo: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: -0.7,
  },

  topBarSpacer: {
    width: 44,
  },

  // =====================================================
  // Main Content
  // =====================================================

  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: Spacing.lg,
    paddingBottom: 42,
    zIndex: 2,
  },

  hotTakeBadge: {
    alignSelf: "flex-start",
    borderColor: Colors.roast,
    borderWidth: 1.5,
    borderRadius: Radius.pill,
    paddingVertical: 7,
    paddingHorizontal: 15,
    marginBottom: 30,
    transform: [{ rotate: "-2deg" }],
  },

  hotTakeText: {
    color: Colors.roast,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.7,
  },

  scenarioText: {
    color: Colors.textPrimary,
    fontSize: 39,
    fontWeight: "900",
    letterSpacing: -1.8,
    lineHeight: 49,
    marginBottom: 35,
  },

  votePrompt: {
    color: Colors.textSecondary,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: Spacing.md,
  },

  // =====================================================
  // Voting Buttons
  // =====================================================

  buttonContainer: {
    gap: 14,
  },

  voteButton: {
    minHeight: 86,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    paddingVertical: 16,
    paddingHorizontal: 19,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    shadowColor: "#1D1D1F",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 3,
  },

  voteButtonIdle: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
  },

  roastButtonSelected: {
    backgroundColor: Colors.roast,
    borderColor: Colors.roast,
  },

  toastButtonSelected: {
    backgroundColor: Colors.toast,
    borderColor: Colors.toast,
  },

  voteButtonPressed: {
    opacity: 0.88,
  },

  voteButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },

  voteIcon: {
    color: Colors.toast,
    fontSize: 28,
    fontWeight: "900",
    marginRight: 15,
  },

  voteButtonText: {
    color: Colors.textPrimary,
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: -0.5,
  },

  voteButtonSubtext: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: "600",
    marginTop: 3,
  },

  selectedButtonText: {
    color: Colors.white,
  },

  selectedButtonSubtext: {
    color: "rgba(255, 255, 255, 0.82)",
  },

  selectedCheck: {
    color: Colors.white,
    fontSize: 24,
    fontWeight: "900",
  },

  voteConfirmation: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 18,
  },

  // =====================================================
  // Themed Backdrop
  // =====================================================

  roastBackdrop: {
    position: "absolute",
    top: 125,
    right: -78,
    transform: [{ rotate: "9deg" }],
  },

  roastBackdropText: {
    color: Colors.roast,
    fontSize: 90,
    fontWeight: "900",
    letterSpacing: -5,
    opacity: 0.065,
  },

  toastBackdrop: {
    position: "absolute",
    bottom: 45,
    left: -67,
    transform: [{ rotate: "-8deg" }],
  },

  toastBackdropText: {
    color: Colors.toast,
    fontSize: 88,
    fontWeight: "900",
    letterSpacing: -5,
    opacity: 0.07,
  },

  fireBackdrop: {
    position: "absolute",
    top: 185,
    right: 26,
    fontSize: 39,
    opacity: 0.12,
    transform: [{ rotate: "8deg" }],
  },

  heartBackdrop: {
    position: "absolute",
    bottom: 113,
    right: 43,
    color: Colors.toast,
    fontSize: 44,
    fontWeight: "900",
    opacity: 0.12,
    transform: [{ rotate: "9deg" }],
  },
});