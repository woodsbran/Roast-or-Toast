// =====================================================
// File: ProgressBar.tsx
//
// Purpose:
// Displays the player's current level and progress
// toward the next level.
//
// Design Direction:
// Clean and subtle. Progress should support the game,
// not distract from the current Moment.
//
// Project: Roast or Toast
// =====================================================

import { StyleSheet, Text, View } from "react-native";

import type { PlayerProgress } from "../game/progressTypes";
import { Colors, Radius } from "../theme";

// Information required by the progress display.
type ProgressBarProps = {
  progress: PlayerProgress;
};

export default function ProgressBar({
  progress,
}: ProgressBarProps) {
  // Prevents division errors if the leveling rules are
  // ever changed unexpectedly.
  const progressPercentage =
    progress.xpForNextLevel > 0
      ? Math.min(
          (progress.currentLevelXp /
            progress.xpForNextLevel) *
            100,
          100,
        )
      : 0;

  return (
    <View style={styles.container}>
      {/* Current level and XP information */}
      <View style={styles.labelRow}>
        <Text style={styles.levelText}>
          Level {progress.level}
        </Text>

        <Text style={styles.xpText}>
          {progress.currentLevelXp} /{" "}
          {progress.xpForNextLevel} XP
        </Text>
      </View>

      {/* Progress track */}
      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            {
              width: `${progressPercentage}%`,
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
    width: "100%",
  },

  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 7,
  },

  levelText: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: "900",
  },

  xpText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: "700",
  },

  track: {
    height: 7,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.pill,
    overflow: "hidden",
  },

  fill: {
    height: "100%",
    backgroundColor: Colors.roast,
    borderRadius: Radius.pill,
  },
});