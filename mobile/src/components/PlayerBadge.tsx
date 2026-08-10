// =====================================================
// File: PlayerBadge.tsx
//
// Purpose:
// Displays the player's current Roast or Toast identity.
//
// Version 1.1:
// • Uses the custom Ember Spark for progression
// • Heat now has its own orange color system
// • Roast coral is reserved for Roast gameplay
//
// The badge shows:
// • Current title
// • Current level
// • Progress toward the next level
// • Current majority-match streak
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

import HeatMark from "./HeatMark";

type PlayerBadgeProps = {
  progress: PlayerProgress;
};

export default function PlayerBadge({
  progress,
}: PlayerBadgeProps) {
  const playerTitle =
    getPlayerTitle(
      progress.level,
    );

  const safeHeatRequirement =
    Math.max(
      progress.heatForNextLevel,
      1,
    );

  const levelProgressPercentage =
    Math.min(
      Math.max(
        progress.currentLevelHeat /
          safeHeatRequirement,
        0,
      ),
      1,
    );

  const progressAnimation =
    useRef(
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

  const animatedProgressWidth =
    progressAnimation.interpolate({
      inputRange: [0, 1],

      outputRange: [
        "0%",
        "100%",
      ],
    });

  return (
    <View
      style={
        styles.container
      }
    >
      <View
        style={
          styles.topRow
        }
      >
        <View
          style={
            styles.identityContainer
          }
        >
          <View
            style={
              styles.iconContainer
            }
          >
            <HeatMark
              size="small"
            />
          </View>

          <View
            style={
              styles.identityTextContainer
            }
          >
            <Text
              style={
                styles.title
              }
              numberOfLines={
                1
              }
            >
              {playerTitle}
            </Text>

            <Text
              style={
                styles.level
              }
            >
              Level{" "}
              {progress.level}
            </Text>
          </View>
        </View>

        <View
          style={
            styles.streakContainer
          }
        >
          <Text
            style={
              styles.streakNumber
            }
          >
            {
              progress.currentStreak
            }
          </Text>

          <Text
            style={
              styles.streakLabel
            }
          >
            streak
          </Text>
        </View>
      </View>

      <View
        style={
          styles.progressHeader
        }
      >
        <Text
          style={
            styles.progressLabel
          }
        >
          NEXT LEVEL
        </Text>

        <Text
          style={
            styles.progressAmount
          }
        >
          {
            progress.currentLevelHeat
          }
          {" / "}
          {
            progress.heatForNextLevel
          }
        </Text>
      </View>

      <View
        style={
          styles.progressTrack
        }
      >
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

const styles =
  StyleSheet.create({
    container: {
      backgroundColor:
        Colors.surface,

      borderColor:
        Colors.border,

      borderWidth: 1,
      borderRadius:
        Radius.lg,

      paddingVertical: 12,
      paddingHorizontal: 14,

      marginBottom: 18,
    },

    topRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",

      marginBottom: 11,
    },

    identityContainer: {
      flexDirection: "row",
      alignItems: "center",

      flex: 1,
      paddingRight: 12,
    },

    iconContainer: {
      width: 40,
      height: 40,

      borderRadius: 20,

      backgroundColor:
        Colors.heatSoft,

      alignItems: "center",
      justifyContent: "center",

      marginRight: 10,
    },

    identityTextContainer: {
      flex: 1,
    },

    title: {
      color:
        Colors.textPrimary,

      fontSize: 14,
      fontWeight: "900",
    },

    level: {
      color:
        Colors.textSecondary,

      fontSize: 11,
      fontWeight: "700",

      marginTop: 2,
    },

    streakContainer: {
      alignItems: "flex-end",

      minWidth: 45,
    },

    streakNumber: {
      color:
        Colors.heatDark,

      fontSize: 18,
      fontWeight: "900",
    },

    streakLabel: {
      color:
        Colors.textSecondary,

      fontSize: 9,
      fontWeight: "800",

      textTransform:
        "uppercase",

      letterSpacing: 0.8,
    },

    progressHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",

      marginBottom: 6,
    },

    progressLabel: {
      color:
        Colors.textSecondary,

      fontSize: 9,
      fontWeight: "900",

      letterSpacing: 1.1,
    },

    progressAmount: {
      color:
        Colors.textSecondary,

      fontSize: 10,
      fontWeight: "800",
    },

    progressTrack: {
      height: 7,

      backgroundColor:
        Colors.surfaceAlt,

      borderRadius:
        Radius.pill,

      overflow: "hidden",
    },

    progressFill: {
      height: "100%",

      backgroundColor:
        Colors.heat,

      borderRadius:
        Radius.pill,
    },
  });