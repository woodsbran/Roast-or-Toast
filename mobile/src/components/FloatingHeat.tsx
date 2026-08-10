// =====================================================
// File: FloatingHeat.tsx
//
// Purpose:
// Celebrates the Heat earned after a regular Roast or
// Toast vote.
//
// Version 1.1:
// • Uses the custom Ember Spark Heat mark
// • Heat has its own orange identity
// • Roast coral is no longer used for progression
//
// Animation Sequence:
// • Card fades and rises into view
// • Heat amount counts from 0 to the earned total
// • Final Heat number pops slightly
// • Crowd feedback appears shortly afterward
//
// Project: Roast or Toast
// =====================================================

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  Colors,
  Radius,
} from "../theme";

import HeatMark from "./HeatMark";

type FloatingHeatProps = {
  heatEarned: number;
  matchedMajority: boolean;
};

export default function FloatingHeat({
  heatEarned,
  matchedMajority,
}: FloatingHeatProps) {
  const safeHeatEarned = Math.max(
    Math.round(heatEarned),
    0,
  );

  const [
    displayedHeat,
    setDisplayedHeat,
  ] = useState(0);

  const cardOpacity = useRef(
    new Animated.Value(0),
  ).current;

  const cardTranslateY = useRef(
    new Animated.Value(18),
  ).current;

  const cardScale = useRef(
    new Animated.Value(0.96),
  ).current;

  const heatCountProgress = useRef(
    new Animated.Value(0),
  ).current;

  const heatScale = useRef(
    new Animated.Value(0.82),
  ).current;

  const messageOpacity = useRef(
    new Animated.Value(0),
  ).current;

  const messageTranslateX = useRef(
    new Animated.Value(10),
  ).current;

  useEffect(() => {
    // Reset animation state.
    cardOpacity.stopAnimation();
    cardTranslateY.stopAnimation();
    cardScale.stopAnimation();
    heatCountProgress.stopAnimation();
    heatScale.stopAnimation();
    messageOpacity.stopAnimation();
    messageTranslateX.stopAnimation();

    cardOpacity.setValue(0);
    cardTranslateY.setValue(18);
    cardScale.setValue(0.96);

    heatCountProgress.setValue(0);
    heatScale.setValue(0.82);

    messageOpacity.setValue(0);
    messageTranslateX.setValue(10);

    setDisplayedHeat(0);

    const heatListenerId =
      heatCountProgress.addListener(
        ({ value }) => {
          setDisplayedHeat(
            Math.round(
              value *
                safeHeatEarned,
            ),
          );
        },
      );

    Animated.sequence([
      Animated.parallel([
        Animated.timing(
          cardOpacity,
          {
            toValue: 1,
            duration: 190,
            easing:
              Easing.out(
                Easing.cubic,
              ),
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

        Animated.spring(
          cardScale,
          {
            toValue: 1,
            speed: 20,
            bounciness: 5,
            useNativeDriver: true,
          },
        ),
      ]),

      Animated.timing(
        heatCountProgress,
        {
          toValue: 1,
          duration: 520,
          easing:
            Easing.out(
              Easing.cubic,
            ),
          useNativeDriver: false,
        },
      ),

      Animated.sequence([
        Animated.spring(
          heatScale,
          {
            toValue: 1.14,
            speed: 25,
            bounciness: 9,
            useNativeDriver: true,
          },
        ),

        Animated.spring(
          heatScale,
          {
            toValue: 1,
            speed: 22,
            bounciness: 4,
            useNativeDriver: true,
          },
        ),
      ]),

      Animated.parallel([
        Animated.timing(
          messageOpacity,
          {
            toValue: 1,
            duration: 180,
            easing:
              Easing.out(
                Easing.quad,
              ),
            useNativeDriver: true,
          },
        ),

        Animated.spring(
          messageTranslateX,
          {
            toValue: 0,
            speed: 22,
            bounciness: 4,
            useNativeDriver: true,
          },
        ),
      ]),
    ]).start(() => {
      setDisplayedHeat(
        safeHeatEarned,
      );
    });

    return () => {
      heatCountProgress.removeListener(
        heatListenerId,
      );

      cardOpacity.stopAnimation();
      cardTranslateY.stopAnimation();
      cardScale.stopAnimation();
      heatCountProgress.stopAnimation();
      heatScale.stopAnimation();
      messageOpacity.stopAnimation();
      messageTranslateX.stopAnimation();
    };
  }, [
    safeHeatEarned,
    matchedMajority,
    cardOpacity,
    cardScale,
    cardTranslateY,
    heatCountProgress,
    heatScale,
    messageOpacity,
    messageTranslateX,
  ]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: cardOpacity,

          transform: [
            {
              translateY:
                cardTranslateY,
            },
            {
              scale:
                cardScale,
            },
          ],
        },
      ]}
    >
      <Animated.View
        style={[
          styles.rewardContainer,
          {
            transform: [
              {
                scale:
                  heatScale,
              },
            ],
          },
        ]}
      >
        <HeatMark size="small" />

        <Text
          style={
            styles.rewardText
          }
        >
          +{displayedHeat} Heat
        </Text>
      </Animated.View>

      <View
        style={
          styles.divider
        }
      />

      <Animated.Text
        style={[
          styles.matchText,
          {
            opacity:
              messageOpacity,

            transform: [
              {
                translateX:
                  messageTranslateX,
              },
            ],
          },
        ]}
      >
        {matchedMajority
          ? "You were with the crowd."
          : "You had your own take."}
      </Animated.Text>
    </Animated.View>
  );
}

// =====================================================
// Styles
// =====================================================

const styles =
  StyleSheet.create({
    container: {
      minHeight: 66,

      backgroundColor:
        Colors.heatSoft,

      borderColor:
        "#F2C89E",

      borderWidth: 1.25,
      borderRadius:
        Radius.lg,

      paddingVertical: 13,
      paddingHorizontal: 15,

      flexDirection: "row",
      alignItems: "center",

      marginBottom: 18,

      shadowColor:
        Colors.heatDark,

      shadowOffset: {
        width: 0,
        height: 5,
      },

      shadowOpacity: 0.08,
      shadowRadius: 10,

      elevation: 2,
    },

    rewardContainer: {
      flexDirection: "row",
      alignItems: "center",

      flexShrink: 0,

      minWidth: 110,
    },

    rewardText: {
      color:
        Colors.heatDark,

      fontSize: 15,
      fontWeight: "900",

      letterSpacing: -0.25,

      marginLeft: 7,
    },

    divider: {
      width: 1,
      height: 25,

      backgroundColor:
        "#E8C29D",

      marginHorizontal: 13,
    },

    matchText: {
      color:
        Colors.textPrimary,

      fontSize: 12,
      fontWeight: "800",
      lineHeight: 17,

      flex: 1,
    },
  });