// =====================================================
// File: ResultsCard.tsx
//
// Purpose:
// Displays community results after a regular Roast or
// Toast vote.
//
// Current Features:
// • Confirms the player's vote
// • Displays animated Roast and Toast percentages
// • Shows animated Heat earned
// • Shows majority-match feedback
// • Celebrates level increases
// • Displays the top comment
// • Provides the Next action
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
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import type { Moment } from "../data/types";

import {
  Colors,
  Radius,
} from "../theme";

import FloatingHeat from "./FloatingHeat";
import LevelUpCard from "./LevelUpCard";

import type {
  VoteChoice,
} from "./VoteButtons";

// Information required to display one result screen.
type ResultsCardProps = {
  moment: Moment;
  selectedVote: Exclude<VoteChoice, null>;
  categoryAccent: string;

  heatEarned: number;
  matchedMajority: boolean;
  leveledUp: boolean;
  currentLevel: number;

  opacity: Animated.Value;
  translateY: Animated.Value;

  onNextPress: () => void;
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
  onNextPress,
}: ResultsCardProps) {
  return (
    <Animated.View
      style={[
        styles.resultsContainer,

        {
          opacity,

          transform: [
            {
              translateY,
            },
          ],
        },
      ]}
    >
      {/* Main results heading */}
      <Text style={styles.resultsHeading}>
        The People Have Spoken
      </Text>

      {/* Confirms the player's selected answer */}
      <Text style={styles.yourVoteText}>
        You chose{" "}

        <Text
          style={
            selectedVote === "roast"
              ? styles.roastText
              : styles.toastText
          }
        >
          {selectedVote === "roast"
            ? "Roast"
            : "Toast"}
        </Text>
      </Text>

      {/* Animated Heat reward */}
      <FloatingHeat
        heatEarned={heatEarned}
        matchedMajority={matchedMajority}
      />

      {/* Appears only when the player reaches a new level */}
      {leveledUp && (
        <LevelUpCard
          level={currentLevel}
        />
      )}

      {/* Animated Roast result */}
      <AnimatedResultBar
        label="🔥 Roast"
        percentage={
          moment.roastPercentage
        }
        fillColor={Colors.roast}
        delay={120}
      />

      {/* Animated Toast result */}
      <AnimatedResultBar
        label="♥ Toast"
        percentage={
          moment.toastPercentage
        }
        fillColor={Colors.toast}
        delay={270}
      />

      {/* Top community comment */}
      <View
        style={[
          styles.commentCard,

          {
            borderLeftColor:
              categoryAccent,
          },
        ]}
      >
        <Text
          style={[
            styles.commentLabel,

            {
              color:
                categoryAccent,
            },
          ]}
        >
          TOP COMMENT
        </Text>

        <Text style={styles.commentText}>
          “{moment.topComment}”
        </Text>
      </View>

      {/* Moves to the next Moment or special event */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Show next moment"
        onPress={onNextPress}
        style={({ pressed }) => [
          styles.nextButton,

          pressed &&
            styles.buttonPressed,
        ]}
      >
        <Text style={styles.nextButtonText}>
          Next
        </Text>

        <Text style={styles.nextButtonArrow}>
          →
        </Text>
      </Pressable>
    </Animated.View>
  );
}

// =====================================================
// Animated Result Bar
// =====================================================

type AnimatedResultBarProps = {
  label: string;
  percentage: number;
  fillColor: string;

  // Allows Roast and Toast to animate one after another.
  delay?: number;
};

function AnimatedResultBar({
  label,
  percentage,
  fillColor,
  delay = 0,
}: AnimatedResultBarProps) {
  // Restricts invalid percentage values.
  const safePercentage = Math.min(
    Math.max(percentage, 0),
    100,
  );

  // Controls the visual bar fill from zero to one.
  const fillProgress = useRef(
    new Animated.Value(0),
  ).current;

  // Stores the visible percentage number.
  const [
    displayedPercentage,
    setDisplayedPercentage,
  ] = useState(0);

  useEffect(() => {
    // Reset the bar whenever a new result loads.
    fillProgress.stopAnimation();
    fillProgress.setValue(0);
    setDisplayedPercentage(0);

    // Updates the percentage label during the animation.
    const listenerId =
      fillProgress.addListener(
        ({ value }) => {
          setDisplayedPercentage(
            Math.round(
              value *
                safePercentage,
            ),
          );
        },
      );

    // Smoothly fills the result bar.
    Animated.timing(
      fillProgress,
      {
        toValue: 1,
        duration: 720,
        delay,
        easing:
          Easing.out(
            Easing.cubic,
          ),
        useNativeDriver: false,
      },
    ).start();

    return () => {
      fillProgress.removeListener(
        listenerId,
      );
    };
  }, [
    delay,
    fillProgress,
    safePercentage,
  ]);

  // Converts the animated value into a percentage width.
  const animatedWidth =
    fillProgress.interpolate({
      inputRange: [0, 1],

      outputRange: [
        "0%",
        `${safePercentage}%`,
      ],
    });

  return (
    <View style={styles.resultSection}>
      {/* Label and animated number */}
      <View style={styles.resultLabelRow}>
        <Text style={styles.resultLabel}>
          {label}
        </Text>

        <Text
          style={
            styles.resultPercentage
          }
        >
          {displayedPercentage}%
        </Text>
      </View>

      {/* Empty bar track */}
      <View
        style={
          styles.resultBarBackground
        }
      >
        {/* Animated colored fill */}
        <Animated.View
          style={[
            styles.resultBarFill,

            {
              width: animatedWidth,
              backgroundColor:
                fillColor,
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
    paddingBottom: 28,
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

    minWidth: 44,
    textAlign: "right",
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

    marginTop: 7,
    marginBottom: 20,
  },

  commentLabel: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.5,
    marginBottom: 8,
  },

  commentText: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 23,
  },

  nextButton: {
    backgroundColor: Colors.textPrimary,
    borderRadius: Radius.pill,

    paddingVertical: 17,
    paddingHorizontal: 25,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    marginBottom: 18,
  },

  buttonPressed: {
    opacity: 0.78,

    transform: [
      {
        scale: 0.985,
      },
    ],
  },

  nextButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "900",
  },

  nextButtonArrow: {
    color: Colors.white,
    fontSize: 23,
    fontWeight: "700",
  },
});