// =====================================================
// File: RoundProgress.tsx
//
// Purpose:
// Shows the player's position inside the current round.
//
// Examples:
// • Quick 10: 4 of 10
// • Standard 20: 12 of 20
// • Endless: Endless Round
//
// Project: Roast or Toast
// =====================================================

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  getRoundModeConfig,
  type RoundMode,
} from "../game/roundTypes";

import {
  Colors,
  Radius,
} from "../theme";

type RoundProgressProps = {
  roundMode: RoundMode;

  // Number of completed regular Moments.
  completedMoments: number;
};

export default function RoundProgress({
  roundMode,
  completedMoments,
}: RoundProgressProps) {
  const config =
    getRoundModeConfig(roundMode);

  // Endless rounds do not have a fixed destination.
  if (config.momentLimit === null) {
    return (
      <View style={styles.endlessContainer}>
        <Text style={styles.endlessIcon}>
          ∞
        </Text>

        <View>
          <Text style={styles.endlessLabel}>
            ENDLESS ROUND
          </Text>

          <Text style={styles.endlessCount}>
            {completedMoments} judged so far
          </Text>
        </View>
      </View>
    );
  }

  // The current question is the next unanswered Moment.
  const currentQuestion = Math.min(
    completedMoments + 1,
    config.momentLimit,
  );

  const progressPercentage = Math.min(
    completedMoments /
      config.momentLimit,
    1,
  );

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.modeLabel}>
          {config.title.toUpperCase()}
        </Text>

        <Text style={styles.countLabel}>
          {currentQuestion} of{" "}
          {config.momentLimit}
        </Text>
      </View>

      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${progressPercentage * 100}%`,
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
  container: {
    marginBottom: 15,
  },

  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    marginBottom: 6,
  },

  modeLabel: {
    color: Colors.textSecondary,

    fontSize: 9,
    fontWeight: "900",

    letterSpacing: 1.1,
  },

  countLabel: {
    color: Colors.textPrimary,

    fontSize: 11,
    fontWeight: "900",
  },

  progressTrack: {
    height: 6,

    backgroundColor: Colors.surfaceAlt,

    borderRadius: Radius.pill,

    overflow: "hidden",
  },

  progressFill: {
    height: "100%",

    backgroundColor: Colors.roast,

    borderRadius: Radius.pill,
  },

  endlessContainer: {
    backgroundColor: Colors.surface,

    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: Radius.lg,

    paddingVertical: 10,
    paddingHorizontal: 13,

    marginBottom: 15,

    flexDirection: "row",
    alignItems: "center",
  },

  endlessIcon: {
    color: Colors.roast,

    fontSize: 27,
    fontWeight: "900",

    marginRight: 11,
  },

  endlessLabel: {
    color: Colors.textPrimary,

    fontSize: 10,
    fontWeight: "900",

    letterSpacing: 1,
  },

  endlessCount: {
    color: Colors.textSecondary,

    fontSize: 11,
    fontWeight: "700",

    marginTop: 2,
  },
});