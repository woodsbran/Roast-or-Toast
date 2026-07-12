// =====================================================
// File: FloatingHeat.tsx
//
// Purpose:
// Celebrates the Heat earned after a regular Roast or
// Toast vote.
//
// Animation Sequence:
// • Card fades and rises into view
// • Heat amount counts from 0 to the earned total
// • Final Heat number pops slightly
// • Crowd feedback appears shortly afterward
//
// This component remains reusable for future modes such
// as Daily Debate and community challenges.
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

// Information required by the Heat reward card.
type FloatingHeatProps = {
  // Total Heat earned from the current answer.
  heatEarned: number;

  // Whether the player's answer matched the community
  // majority.
  matchedMajority: boolean;
};

export default function FloatingHeat({
  heatEarned,
  matchedMajority,
}: FloatingHeatProps) {
  // Ensures invalid values cannot break the count-up.
  const safeHeatEarned = Math.max(
    Math.round(heatEarned),
    0,
  );

  // Stores the Heat number currently shown on screen.
  const [
    displayedHeat,
    setDisplayedHeat,
  ] = useState(0);

  // Controls the visibility of the entire reward card.
  const cardOpacity = useRef(
    new Animated.Value(0),
  ).current;

  // Starts the card slightly below its final position.
  const cardTranslateY = useRef(
    new Animated.Value(18),
  ).current;

  // Gives the entire card a subtle entrance pop.
  const cardScale = useRef(
    new Animated.Value(0.96),
  ).current;

  // Controls the Heat number count-up.
  //
  // This moves from 0 to 1. The visible number is
  // calculated by multiplying the value by heatEarned.
  const heatCountProgress = useRef(
    new Animated.Value(0),
  ).current;

  // Makes the final Heat amount briefly grow larger.
  const heatScale = useRef(
    new Animated.Value(0.82),
  ).current;

  // Controls when the crowd feedback becomes visible.
  const messageOpacity = useRef(
    new Animated.Value(0),
  ).current;

  // Slides the crowd message in from the right.
  const messageTranslateX = useRef(
    new Animated.Value(10),
  ).current;

  useEffect(() => {
    // ===================================================
    // Reset Animation State
    // ===================================================

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

    // Updates the visible Heat number while the animated
    // value moves from zero to one.
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

    // ===================================================
    // Animation Sequence
    // ===================================================

    Animated.sequence([
      // First, reveal and raise the whole reward card.
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

      // Count from zero to the final Heat reward.
      Animated.timing(
        heatCountProgress,
        {
          toValue: 1,
          duration: 520,
          easing:
            Easing.out(
              Easing.cubic,
            ),

          // The listener updates React text, so this value
          // cannot use the native driver.
          useNativeDriver: false,
        },
      ),

      // Pop and settle the final Heat number.
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

      // Finally, reveal the crowd feedback.
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
      // Guarantees the final amount is exact even if the
      // animation was interrupted by a small frame delay.
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
              scale: cardScale,
            },
          ],
        },
      ]}
    >
      {/* Animated Heat reward */}
      <Animated.View
        style={[
          styles.rewardContainer,

          {
            transform: [
              {
                scale: heatScale,
              },
            ],
          },
        ]}
      >
        <Text style={styles.fireIcon}>
          🔥
        </Text>

        <Text style={styles.rewardText}>
          +{displayedHeat} Heat
        </Text>
      </Animated.View>

      {/* Visual divider */}
      <View style={styles.divider} />

      {/* Animated crowd feedback */}
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

const styles = StyleSheet.create({
  container: {
    minHeight: 66,

    backgroundColor: "#FFF1EC",

    borderColor: "#F4C9BE",
    borderWidth: 1.25,
    borderRadius: Radius.lg,

    paddingVertical: 13,
    paddingHorizontal: 15,

    flexDirection: "row",
    alignItems: "center",

    marginBottom: 18,

    shadowColor: Colors.roast,

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

    minWidth: 92,
  },

  fireIcon: {
    fontSize: 20,
    marginRight: 6,
  },

  rewardText: {
    color: Colors.roast,

    fontSize: 15,
    fontWeight: "900",

    letterSpacing: -0.25,
  },

  divider: {
    width: 1,
    height: 25,

    backgroundColor: "#E7BEB4",

    marginHorizontal: 13,
  },

  matchText: {
    color: Colors.textPrimary,

    fontSize: 12,
    fontWeight: "800",
    lineHeight: 17,

    flex: 1,
  },
});