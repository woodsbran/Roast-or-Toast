// =====================================================
// File: ResultsCard.tsx
//
// Purpose:
// Displays results after a regular Roast or Toast vote.
//
// Current Features:
// • Confirms the player's vote
// • Displays community percentages
// • Shows Heat earned
// • Shows majority-match feedback
// • Celebrates level increases
// • Displays the top comment
//
// Important:
// The Next button is controlled by scenario.tsx so it
// can remain fixed at the bottom of the screen.
//
// Project: Roast or Toast
// =====================================================

import {
  Animated,
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
  // Current Roast or Toast Moment.
  moment: Moment;

  // Player's selected answer.
  selectedVote: Exclude<VoteChoice, null>;

  // Current category color used by the comment card.
  categoryAccent: string;

  // Progress information earned from this vote.
  heatEarned: number;
  matchedMajority: boolean;
  leveledUp: boolean;
  currentLevel: number;

  // Values used by the result reveal animation.
  opacity: Animated.Value;
  translateY: Animated.Value;
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

      {/* Confirms the answer selected by the player */}
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

      {/* Shows the Heat earned and crowd-match message */}
      <FloatingHeat
        heatEarned={heatEarned}
        matchedMajority={matchedMajority}
      />

      {/* Only appears when the player reaches a new level */}
      {leveledUp && (
        <LevelUpCard level={currentLevel} />
      )}

      {/* Roast community result */}
      <ResultBar
        label="🔥 Roast"
        percentage={moment.roastPercentage}
        fillColor={Colors.roast}
      />

      {/* Toast community result */}
      <ResultBar
        label="♥ Toast"
        percentage={moment.toastPercentage}
        fillColor={Colors.toast}
      />

      {/* Current top community comment */}
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
    </Animated.View>
  );
}

// =====================================================
// Result Bar
//
// Reusable percentage bar for Roast and Toast results.
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
      {/* Label and percentage */}
      <View style={styles.resultLabelRow}>
        <Text style={styles.resultLabel}>{label}</Text>

        <Text style={styles.resultPercentage}>
          {percentage}%
        </Text>
      </View>

      {/* Background track */}
      <View style={styles.resultBarBackground}>
        {/* Colored percentage fill */}
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
    marginTop: -5,

    // Creates space beneath the final comment so the
    // fixed Next button never covers the content.
    paddingBottom: 120,
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
    marginTop: 8,
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
});