// =====================================================
// File: ResultsCard.tsx
//
// Purpose:
// Displays results after a regular Roast or Toast vote.
//
// The Next button is included after the Top Comment.
// Because everything is inside the ScrollView, the button
// can never cover or cut off result content.
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

import FloatingHeat from "./FloatingHeat";
import LevelUpCard from "./LevelUpCard";
import type { VoteChoice } from "./VoteButtons";

// Information required to display the results.
type ResultsCardProps = {
  moment: Moment;
  selectedVote: Exclude<VoteChoice, null>;
  categoryAccent: string;

  heatEarned: number;
  matchedMajority: boolean;
  leveledUp: boolean;
  currentLevel: number;

  opacity: Animated.Value;
  translateY: Animated.Value;

  // Moves to the next Moment or special event.
  onNextPress: () => void;
};

export default function ResultsCard({
  moment,
  selectedVote,
  categoryAccent,
  heatEarned,
  matchedMajority,
  leveledUp,
  currentLevel,
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

      {/* Confirms the player's selection */}
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

      {/* Heat earned from this answer */}
      <FloatingHeat
        heatEarned={heatEarned}
        matchedMajority={matchedMajority}
      />

      {/* Level celebration appears only when needed */}
      {leveledUp && (
        <LevelUpCard level={currentLevel} />
      )}

      {/* Community Roast result */}
      <ResultBar
        label="🔥 Roast"
        percentage={moment.roastPercentage}
        fillColor={Colors.roast}
      />

      {/* Community Toast result */}
      <ResultBar
        label="♥ Toast"
        percentage={moment.toastPercentage}
        fillColor={Colors.toast}
      />

      {/* Top community comment */}
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

      {/* Next comes after all result content */}
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
// Result Bar
// =====================================================

type ResultBarProps = {
  label: string;
  percentage: number;
  fillColor: string;
};

function ResultBar({
  label,
  percentage,
  fillColor,
}: ResultBarProps) {
  return (
    <View style={styles.resultSection}>
      <View style={styles.resultLabelRow}>
        <Text style={styles.resultLabel}>{label}</Text>

        <Text style={styles.resultPercentage}>
          {percentage}%
        </Text>
      </View>

      <View style={styles.resultBarBackground}>
        <View
          style={[
            styles.resultBarFill,
            {
              width: `${percentage}%`,
              backgroundColor: fillColor,
            },
          ]}
        />
      </View>
    </View>
  );
}

// =====================================================
// Styles
// =====================================================

const styles = StyleSheet.create({
  resultsContainer: {
    paddingBottom: 28,
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
    marginBottom: 16,
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
    alignItems: "center",
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

  commentCard: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    borderLeftWidth: 5,
    borderRadius: Radius.lg,
    padding: 18,
    marginTop: 7,
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
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 23,
  },

  nextButton: {
    backgroundColor: Colors.textPrimary,
    borderRadius: Radius.pill,
    paddingVertical: 17,
    paddingHorizontal: 25,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    marginBottom: 18,
  },

  buttonPressed: {
    opacity: 0.78,
    transform: [{ scale: 0.985 }],
  },

  nextButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "900",
  },

  nextButtonArrow: {
    color: Colors.white,
    fontSize: 23,
    fontWeight: "700",
  },
});