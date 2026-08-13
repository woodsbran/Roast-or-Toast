// =====================================================
// File: LevelUpCard.tsx
//
// Purpose:
// Celebrates a new level.
//
// Version 1.1 — Core Identity Application
//
// I am removing the old rounded black card completely.
//
// Level Up should feel like something got stamped across the
// game, not like a modal from a dashboard.
//
// Project: Roast or Toast
// =====================================================

import {
  useEffect,
  useRef,
} from "react";

import {
  Animated,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  getPlayerTitle,
} from "../game/titles";

import {
  Colors,
} from "../theme";

import InkUnderline from "./InkUnderline";
import StampLabel from "./StampLabel";

type LevelUpCardProps = {
  level: number;
};

export default function LevelUpCard({
  level,
}: LevelUpCardProps) {
  const currentTitle =
    getPlayerTitle(level);

  const previousTitle =
    level > 1
      ? getPlayerTitle(
          level - 1,
        )
      : currentTitle;

  const unlockedNewTitle =
    currentTitle !==
    previousTitle;

  const opacity =
    useRef(
      new Animated.Value(0),
    ).current;

  const scale =
    useRef(
      new Animated.Value(0.94),
    ).current;

  const rotate =
    useRef(
      new Animated.Value(-2),
    ).current;

  useEffect(() => {
    opacity.setValue(0);
    scale.setValue(0.94);
    rotate.setValue(-2);

    Animated.parallel([
      Animated.timing(
        opacity,
        {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        },
      ),

      Animated.spring(
        scale,
        {
          toValue: 1,
          speed: 18,
          bounciness: 5,
          useNativeDriver: true,
        },
      ),

      Animated.spring(
        rotate,
        {
          toValue: -0.6,
          speed: 18,
          bounciness: 4,
          useNativeDriver: true,
        },
      ),
    ]).start();
  }, [
    level,
    opacity,
    rotate,
    scale,
  ]);

  const animatedRotation =
    rotate.interpolate({
      inputRange: [
        -2,
        0,
      ],

      outputRange: [
        "-2deg",
        "0deg",
      ],
    });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity,

          transform: [
            {
              scale,
            },
            {
              rotate:
                animatedRotation,
            },
          ],
        },
      ]}
    >
      <StampLabel
        text={
          unlockedNewTitle
            ? "NEW TITLE UNLOCKED"
            : "YOU HEATED UP"
        }
        color={
          Colors.roast
        }
        rotate={-2}
      />

      <Text style={styles.level}>
        LEVEL {level}
      </Text>

      <Text style={styles.title}>
        {unlockedNewTitle
          ? currentTitle
          : "KEEP BRINGING THE HEAT."}
      </Text>

      <InkUnderline
        color={
          unlockedNewTitle
            ? Colors.toast
            : Colors.roast
        }
        width={68}
      />

      <Text style={styles.supporting}>
        {unlockedNewTitle
          ? "Okay, now you're becoming a problem."
          : "The next title is getting closer."}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopColor:
      Colors.textPrimary,
    borderBottomColor:
      Colors.textPrimary,

    borderTopWidth: 1.4,
    borderBottomWidth: 1.4,

    paddingVertical: 16,
    paddingHorizontal: 14,

    marginBottom: 18,

    backgroundColor:
      Colors.background,
  },

  level: {
    color:
      Colors.textMuted,

    fontSize: 8,
    fontWeight: "900",

    letterSpacing: 1.2,

    marginTop: 9,
  },

  title: {
    color:
      Colors.textPrimary,

    fontSize: 24,
    fontWeight: "900",

    lineHeight: 28,
    letterSpacing: -0.9,

    marginTop: 2,
  },

  supporting: {
    color:
      Colors.textSecondary,

    fontSize: 11,
    fontWeight: "700",

    lineHeight: 16,

    marginTop: 8,
  },
});
