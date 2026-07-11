// =====================================================
// File: PlayerBadge.tsx
//
// Purpose:
// Displays the player's current Roast or Toast identity.
//
// The badge shows:
// • Current title
// • Current level
// • Current majority-match streak
//
// Heat remains mostly behind the scenes so the gameplay
// screen does not feel crowded.
//
// Project: Roast or Toast
// =====================================================

import { StyleSheet, Text, View } from "react-native";

import type { PlayerProgress } from "../game/progressTypes";
import { getPlayerTitle } from "../game/titles";
import { Colors, Radius } from "../theme";

// Information required by the player badge.
type PlayerBadgeProps = {
  progress: PlayerProgress;
};

export default function PlayerBadge({
  progress,
}: PlayerBadgeProps) {
  const playerTitle = getPlayerTitle(progress.level);

  return (
    <View style={styles.container}>
      {/* Player identity */}
      <View style={styles.identityContainer}>
        <Text style={styles.heatIcon}>🔥</Text>

        <View>
          <Text style={styles.title}>{playerTitle}</Text>

          <Text style={styles.level}>
            Level {progress.level}
          </Text>
        </View>
      </View>

      {/* Current crowd-match streak */}
      <View style={styles.streakContainer}>
        <Text style={styles.streakNumber}>
          {progress.currentStreak}
        </Text>

        <Text style={styles.streakLabel}>streak</Text>
      </View>
    </View>
  );
}

// =====================================================
// Styles
// =====================================================

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: Radius.lg,
    paddingVertical: 11,
    paddingHorizontal: 14,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    marginBottom: 18,
  },

  identityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  heatIcon: {
    fontSize: 22,
    marginRight: 10,
  },

  title: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: "900",
  },

  level: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: "700",
    marginTop: 2,
  },

  streakContainer: {
    alignItems: "flex-end",
  },

  streakNumber: {
    color: Colors.roast,
    fontSize: 17,
    fontWeight: "900",
  },

  streakLabel: {
    color: Colors.textSecondary,
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
});