// =====================================================
// File: ResultsCard.tsx
//
// Purpose:
// Displays the voting results after the player chooses
// Roast or Toast.
//
// Current Version:
// • Confirms the player's choice
// • Shows temporary community percentages
// • Displays the top comment
// • Provides the Next button
//
// Later:
// • Use real voting totals
// • Add comment likes and reactions
// • Animate percentage bars
//
// Project: Roast or Toast
// =====================================================

import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import type { Moment } from "../data/types";
import { Colors, Radius } from "../theme";
import type { VoteChoice } from "./VoteButtons";

// Information required to display the result screen.
type ResultsCardProps = {
  moment: Moment;
  selectedVote: Exclude<VoteChoice, null>;
  categoryAccent: string;
  opacity: Animated.Value;
  translateY: Animated.Value;
  onNextPress: () => void;
};

export default function ResultsCard({
  moment,
  selectedVote,
  categoryAccent,
  opacity,
  translateY,
  onNextPress,
}: ResultsCardProps) {
  return (
    <Animated.View
      style={[
        styles.resultsContainer,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      {/* Main results heading */}
      <Text style={styles.resultsHeading}>
        The People Have Spoken
      </Text>

      {/* Confirms the option selected by the player */}
      <Text style={styles.yourVoteText}>
        You chose{" "}
        <Text
          style={
            selectedVote === "roast"
              ? styles.roastText
              : styles.toastText
          }
        >
          {selectedVote === "roast" ? "Roast" : "Toast"}
        </Text>
      </Text>

      {/* Roast result */}
      <View style={styles.resultSection}>
        <View style={styles.resultLabelRow}>
          <Text style={styles.resultLabel}>🔥 Roast</Text>

          <Text style={styles.resultPercentage}>
            {moment.roastPercentage}%
          </Text>
        </View>

        <View style={styles.resultBarBackground}>
          <View
            style={[
              styles.resultBarFill,
              styles.roastResultBar,
              {
                width: `${moment.roastPercentage}%`,
              },
            ]}
          />
        </View>
      </View>

      {/* Toast result */}
      <View style={styles.resultSection}>
        <View style={styles.resultLabelRow}>
          <Text style={styles.resultLabel}>♥ Toast</Text>

          <Text style={styles.resultPercentage}>
            {moment.toastPercentage}%
          </Text>
        </View>

        <View style={styles.resultBarBackground}>
          <View
            style={[
              styles.resultBarFill,
              styles.toastResultBar,
              {
                width: `${moment.toastPercentage}%`,
              },
            ]}
          />
        </View>
      </View>

      {/* Top temporary community comment */}
      <View
        style={[
          styles.commentCard,
          {
            borderLeftColor: categoryAccent,
          },
        ]}
      >
        <Text
          style={[
            styles.commentLabel,
            {
              color: categoryAccent,
            },
          ]}
        >
          TOP COMMENT
        </Text>

        <Text style={styles.commentText}>
          “{moment.topComment}”
        </Text>
      </View>

      {/* Moves to the next Moment or an intermission */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Show next moment"
        onPress={onNextPress}
        style={({ pressed }) => [
          styles.nextButton,
          pressed && styles.buttonPressed,
        ]}
      >
        <Text style={styles.nextButtonText}>Next</Text>
        <Text style={styles.nextButtonArrow}>→</Text>
      </Pressable>
    </Animated.View>
  );
}

// =====================================================
// Styles
// =====================================================

const styles = StyleSheet.create({
  resultsContainer: {
    marginTop: -5,
  },

  resultsHeading: {
    color: Colors.textPrimary,
    fontSize: 26,
    fontWeight: "900",
    marginBottom: 5,
  },

  yourVoteText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 23,
  },

  roastText: {
    color: Colors.roast,
    fontWeight: "900",
  },

  toastText: {
    color: Colors.toast,
    fontWeight: "900",
  },

  resultSection: {
    marginBottom: 17,
  },

  resultLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  resultLabel: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: "800",
  },

  resultPercentage: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: "900",
  },

  resultBarBackground: {
    height: 12,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.pill,
    overflow: "hidden",
  },

  resultBarFill: {
    height: "100%",
    borderRadius: Radius.pill,
  },

  roastResultBar: {
    backgroundColor: Colors.roast,
  },

  toastResultBar: {
    backgroundColor: Colors.toast,
  },

  commentCard: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    borderLeftWidth: 5,
    borderRadius: Radius.lg,
    padding: 18,
    marginTop: 8,
    marginBottom: 20,
  },

  commentLabel: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.5,
    marginBottom: 8,
  },

  commentText: {
    color: Colors.textPrimary,
    fontSize: 17,
    fontWeight: "700",
    lineHeight: 24,
  },

  nextButton: {
    backgroundColor: Colors.textPrimary,
    borderRadius: Radius.pill,
    paddingVertical: 16,
    paddingHorizontal: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  buttonPressed: {
    opacity: 0.76,
  },

  nextButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "900",
  },

  nextButtonArrow: {
    color: Colors.white,
    fontSize: 23,
  },
});