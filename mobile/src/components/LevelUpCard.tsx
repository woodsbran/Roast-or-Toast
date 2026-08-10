// =====================================================
// File: LevelUpCard.tsx
//
// Purpose:
// Celebrates a player reaching a new level.
//
// Version 1.1:
// • Uses the custom Ember Spark mark
// • Heat has its own progression identity
// • Roast coral is no longer used for leveling
//
// Celebration Types:
// • Normal Level
// • New Title Unlock
//
// Animation:
// • Card fades and rises into view
// • Heat mark pops
// • Main message scales into place
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
  Radius,
} from "../theme";

import HeatMark from "./HeatMark";

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

  const cardOpacity =
    useRef(
      new Animated.Value(0),
    ).current;

  const cardTranslateY =
    useRef(
      new Animated.Value(18),
    ).current;

  const iconScale =
    useRef(
      new Animated.Value(0.45),
    ).current;

  const messageScale =
    useRef(
      new Animated.Value(0.92),
    ).current;

  useEffect(() => {
    cardOpacity.setValue(0);
    cardTranslateY.setValue(18);
    iconScale.setValue(0.45);
    messageScale.setValue(0.92);

    Animated.sequence([
      Animated.parallel([
        Animated.timing(
          cardOpacity,
          {
            toValue: 1,
            duration: 220,
            useNativeDriver: true,
          },
        ),

        Animated.spring(
          cardTranslateY,
          {
            toValue: 0,
            speed: 18,
            bounciness: 5,
            useNativeDriver: true,
          },
        ),
      ]),

      Animated.parallel([
        Animated.spring(
          iconScale,
          {
            toValue: 1.18,
            speed: 24,
            bounciness: 9,
            useNativeDriver: true,
          },
        ),

        Animated.spring(
          messageScale,
          {
            toValue: 1,
            speed: 20,
            bounciness: 6,
            useNativeDriver: true,
          },
        ),
      ]),

      Animated.spring(
        iconScale,
        {
          toValue: 1,
          speed: 22,
          bounciness: 4,
          useNativeDriver: true,
        },
      ),
    ]).start();
  }, [
    level,
    cardOpacity,
    cardTranslateY,
    iconScale,
    messageScale,
  ]);

  return (
    <Animated.View
      style={[
        styles.container,

        {
          opacity:
            cardOpacity,

          transform: [
            {
              translateY:
                cardTranslateY,
            },
          ],
        },
      ]}
    >
      <View
        style={
          styles.glowCircle
        }
      />

      <Animated.View
        style={[
          styles.iconContainer,

          {
            transform: [
              {
                scale:
                  iconScale,
              },
            ],
          },
        ]}
      >
        <HeatMark
          size="medium"
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.content,

          {
            transform: [
              {
                scale:
                  messageScale,
              },
            ],
          },
        ]}
      >
        <Text
          style={
            styles.eyebrow
          }
        >
          {unlockedNewTitle
            ? "NEW TITLE UNLOCKED"
            : "YOU HEATED UP"}
        </Text>

        <Text
          style={
            styles.level
          }
        >
          Level {level}
        </Text>

        {unlockedNewTitle ? (
          <>
            <Text
              style={
                styles.title
              }
            >
              {currentTitle}
            </Text>

            <Text
              style={
                styles.supportingText
              }
            >
              Okay, now you&apos;re becoming a problem.
            </Text>
          </>
        ) : (
          <>
            <Text
              style={
                styles.message
              }
            >
              Keep bringing the Heat.
            </Text>

            <Text
              style={
                styles.supportingText
              }
            >
              The next title is getting closer.
            </Text>
          </>
        )}
      </Animated.View>
    </Animated.View>
  );
}

// =====================================================
// Styles
// =====================================================

const styles =
  StyleSheet.create({
    container: {
      position: "relative",

      backgroundColor:
        Colors.textPrimary,

      borderRadius:
        Radius.lg,

      paddingVertical: 18,
      paddingHorizontal: 18,

      marginBottom: 18,

      flexDirection: "row",
      alignItems: "center",

      overflow: "hidden",

      shadowColor:
        Colors.black,

      shadowOffset: {
        width: 0,
        height: 8,
      },

      shadowOpacity: 0.14,
      shadowRadius: 14,

      elevation: 5,
    },

    glowCircle: {
      position: "absolute",

      width: 130,
      height: 130,

      borderRadius: 65,

      right: -45,
      top: -52,

      backgroundColor:
        Colors.heat,

      opacity: 0.18,
    },

    iconContainer: {
      width: 58,
      height: 58,

      borderRadius: 29,

      backgroundColor:
        "#35291F",

      alignItems: "center",
      justifyContent: "center",

      marginRight: 15,
    },

    content: {
      flex: 1,
    },

    eyebrow: {
      color:
        Colors.heat,

      fontSize: 10,
      fontWeight: "900",

      letterSpacing: 1.5,

      marginBottom: 5,
    },

    level: {
      color:
        "#D7D7D7",

      fontSize: 13,
      fontWeight: "800",
    },

    title: {
      color:
        Colors.white,

      fontSize: 22,
      fontWeight: "900",

      lineHeight: 27,

      marginTop: 2,
    },

    message: {
      color:
        Colors.white,

      fontSize: 19,
      fontWeight: "900",

      marginTop: 2,
    },

    supportingText: {
      color:
        "#CFCFCF",

      fontSize: 11,
      fontWeight: "600",

      lineHeight: 16,

      marginTop: 5,
    },
  });