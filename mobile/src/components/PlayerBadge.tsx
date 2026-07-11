// =====================================================
// File: PlayerBadge.tsx
//
// Purpose:
// Displays the player's current Roast or Toast identity.
//
// The badge shows:
// • Current title
// • Current level
// • Animated progress toward the next level
// • Current majority-match streak
//
// Heat remains compact so the gameplay screen does not
// feel crowded.
//
// Project: Roast or Toast
// =====================================================

import {
  useEffect,
  useRef,
} from "react";

import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
} from "react-native";

import type {
  PlayerProgress,
} from "../game/progressTypes";

import {
  getPlayerTitle,
} from "../game/titles";

import {
  Colors,
  Radius,
} from "../theme";

// Information required by the player badge.
type PlayerBadgeProps = {
  progress: PlayerProgress;
};

export default function PlayerBadge({
  progress,
}: PlayerBadgeProps) {
  // Gets the personality title associated with the
  // player's current level.
  const playerTitle =
    getPlayerTitle(progress.level);

  // Prevents invalid progress values from producing a
  // broken percentage.
  const safeHeatRequirement = Math.max(
    progress.heatForNextLevel,
    1,
  );

  const levelProgressPercentage = Math.min(
    Math.max(
      progress.currentLevelHeat /
        safeHeatRequirement,
      0,
    ),
    1,
  );

  // Controls the animated width of the level bar.
  const progressAnimation = useRef(
    new Animated.Value(0),
  ).current;

  useEffect(() => {
    Animated.timing(
      progressAnimation,
      {
        toValue:
          levelProgressPercentage,

        duration: 620,

        easing:
          Easing.out(
            Easing.cubic,
          ),

        useNativeDriver: false,
      },
    ).start();
  }, [
    levelProgressPercentage,
    progressAnimation,
  ]);

  // Converts the animated value into a percentage width.
  const animatedProgressWidth =
    progressAnimation.interpolate({
      inputRange: [0, 1],

      outputRange: [
        "0%",
        "100%",
      ],
    });

  return (
    <View style={styles.container}>
      {/* =================================================
          Top Row
      ================================================= */}

      <View style={styles.topRow}>
        {/* Player identity */}
        <View style={styles.identityContainer}>
          <View style={styles.iconContainer}>
            <Text style={styles.heatIcon}>
              🔥
            </Text>
          </View>

          <View style={styles.identityTextContainer}>
            <Text
              style={styles.title}
              numberOfLines={1}
            >
              {playerTitle}
            </Text>

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

          <Text style={styles.streakLabel}>
            streak
          </Text>
        </View>
      </View>

      {/* =================================================
          Level Progress
      ================================================= */}

      <View style={styles.progressHeader}>
        <Text style={styles.progressLabel}>
          NEXT LEVEL
        </Text>

        <Text style={styles.progressAmount}>
          {progress.currentLevelHeat}
          {" / "}
          {progress.heatForNextLevel}
        </Text>
      </View>

      {/* Progress track */}
      <View style={styles.progressTrack}>
        <Animated.View
          style={[
            styles.progressFill,
            {
              width:
                animatedProgressWidth,
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
    backgroundColor: Colors.surface,

    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: Radius.lg,

    paddingVertical: 12,
    paddingHorizontal: 14,

    marginBottom: 18,
  },

  // =====================================================
  // Top Row
  // =====================================================

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    marginBottom: 11,
  },

  identityContainer: {
    flexDirection: "row",
    alignItems: "center",

    flex: 1,
    paddingRight: 12,
  },

  iconContainer: {
    width: 36,
    height: 36,

    borderRadius: 18,

    backgroundColor: "#FFF1EC",

    alignItems: "center",
    justifyContent: "center",

    marginRight: 10,
  },

  heatIcon: {
    fontSize: 20,
  },

  identityTextContainer: {
    flex: 1,
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

    minWidth: 45,
  },

  streakNumber: {
    color: Colors.roast,

    fontSize: 18,
    fontWeight: "900",
  },

  streakLabel: {
    color: Colors.textSecondary,

    fontSize: 9,
    fontWeight: "800",

    textTransform: "uppercase",
    letterSpacing: 0.8,
  },

  // =====================================================
  // Progress Bar
  // =====================================================

  progressHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    marginBottom: 6,
  },

  progressLabel: {
    color: Colors.textSecondary,

    fontSize: 9,
    fontWeight: "900",

    letterSpacing: 1.1,
  },

  progressAmount: {
    color: Colors.textSecondary,

    fontSize: 10,
    fontWeight: "800",
  },

  progressTrack: {
    height: 7,

    backgroundColor:
      Colors.surfaceAlt,

    borderRadius: Radius.pill,

    overflow: "hidden",
  },

  progressFill: {
    height: "100%",

    backgroundColor:
      Colors.roast,

    borderRadius: Radius.pill,
  },
});