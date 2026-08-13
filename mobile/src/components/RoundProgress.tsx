// =====================================================
// File: RoundProgress.tsx
//
// Purpose:
// Shows the player's progress through the current round.
//
// Finite Modes:
// • Quick 10
// • Standard 20
//
// Endless Mode:
// • Shows the number of Moments judged so far
// • Uses a looping animated Heat indicator
//
// Animation:
// • Progress bar smoothly fills after each completed
//   Moment
// • Current question number gently pops when it changes
// • Endless icon pulses without distracting the player
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

import {
  getRoundModeConfig,
  type RoundMode,
} from "../game/roundTypes";

import {
  Colors,
  Radius,
} from "../theme";

import HeatMark from "./HeatMark";

// Information required by the round progress display.
type RoundProgressProps = {
  roundMode: RoundMode;

  // Number of regular Moments already completed.
  completedMoments: number;
};

export default function RoundProgress({
  roundMode,
  completedMoments,
}: RoundProgressProps) {
  const config =
    getRoundModeConfig(roundMode);

  // Endless mode uses a separate animated presentation.
  if (config.momentLimit === null) {
    return (
      <EndlessProgress
        completedMoments={
          completedMoments
        }
      />
    );
  }

  return (
    <FiniteRoundProgress
      roundTitle={config.title}
      momentLimit={config.momentLimit}
      completedMoments={
        completedMoments
      }
    />
  );
}

// =====================================================
// Finite Round Progress
// =====================================================

type FiniteRoundProgressProps = {
  roundTitle: string;
  momentLimit: number;
  completedMoments: number;
};

function FiniteRoundProgress({
  roundTitle,
  momentLimit,
  completedMoments,
}: FiniteRoundProgressProps) {
  // Restricts the completed count to the valid range.
  const safeCompletedMoments =
    Math.min(
      Math.max(
        completedMoments,
        0,
      ),
      momentLimit,
    );

  // The currently displayed question is the next
  // unanswered Moment.
  const currentQuestion =
    Math.min(
      safeCompletedMoments + 1,
      momentLimit,
    );

  // Stores the bar's progress from zero to one.
  const progressAnimation = useRef(
    new Animated.Value(
      safeCompletedMoments /
        momentLimit,
    ),
  ).current;

  // Gives the question counter a subtle pop whenever it
  // changes.
  const counterScale = useRef(
    new Animated.Value(1),
  ).current;

  // Briefly highlights the progress bar after advancing.
  const glowOpacity = useRef(
    new Animated.Value(0),
  ).current;

  useEffect(() => {
    const targetProgress =
      safeCompletedMoments /
      momentLimit;

    // Stop any unfinished animations from the previous
    // Moment before starting the next sequence.
    progressAnimation.stopAnimation();
    counterScale.stopAnimation();
    glowOpacity.stopAnimation();

    // Animate the bar, counter, and glow together.
    Animated.parallel([
      Animated.timing(
        progressAnimation,
        {
          toValue: targetProgress,

          duration: 550,

          easing:
            Easing.out(
              Easing.cubic,
            ),

          useNativeDriver: false,
        },
      ),

      Animated.sequence([
        Animated.spring(
          counterScale,
          {
            toValue: 1.08,
            speed: 28,
            bounciness: 7,
            useNativeDriver: true,
          },
        ),

        Animated.spring(
          counterScale,
          {
            toValue: 1,
            speed: 24,
            bounciness: 4,
            useNativeDriver: true,
          },
        ),
      ]),

      Animated.sequence([
        Animated.timing(
          glowOpacity,
          {
            toValue: 0.32,
            duration: 160,
            useNativeDriver: true,
          },
        ),

        Animated.timing(
          glowOpacity,
          {
            toValue: 0,
            duration: 430,
            useNativeDriver: true,
          },
        ),
      ]),
    ]).start();
  }, [
    safeCompletedMoments,
    momentLimit,
    progressAnimation,
    counterScale,
    glowOpacity,
  ]);

  // Converts the progress value into a percentage width.
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
      {/* Round label and current question */}
      <View style={styles.labelRow}>
        <View style={styles.modeLabelContainer}>
          <Text style={styles.modeDot}>
            •
          </Text>

          <Text style={styles.modeLabel}>
            {roundTitle.toUpperCase()}
          </Text>
        </View>

        <Animated.View
          style={{
            transform: [
              {
                scale:
                  counterScale,
              },
            ],
          }}
        >
          <Text style={styles.countLabel}>
            {currentQuestion}
            {" of "}
            {momentLimit}
          </Text>
        </Animated.View>
      </View>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        {/* Brief glow shown after advancing */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.progressGlow,

            {
              opacity:
                glowOpacity,
            },
          ]}
        />

        {/* Animated coral fill */}
        <Animated.View
          style={[
            styles.progressFill,

            {
              width:
                animatedProgressWidth,
            },
          ]}
        />

        {/* Small marker at the edge of the fill */}
        {safeCompletedMoments > 0 && (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.progressMarkerContainer,

              {
                width:
                  animatedProgressWidth,
              },
            ]}
          >
            <View
              style={
                styles.progressMarker
              }
            />
          </Animated.View>
        )}
      </View>

      {/* Small completion caption */}
      <View style={styles.captionRow}>
        <Text style={styles.captionText}>
          {safeCompletedMoments === 0
            ? "Your opinions are waiting."
            : safeCompletedMoments ===
                momentLimit
              ? "Round complete."
              : `${safeCompletedMoments} judged`}
        </Text>

        <Text style={styles.remainingText}>
          {safeCompletedMoments <
          momentLimit
            ? `${momentLimit - safeCompletedMoments} left`
            : "DONE"}
        </Text>
      </View>
    </View>
  );
}

// =====================================================
// Endless Progress
// =====================================================

type EndlessProgressProps = {
  completedMoments: number;
};

function EndlessProgress({
  completedMoments,
}: EndlessProgressProps) {
  // Pulses the Endless icon gently.
  const iconScale = useRef(
    new Animated.Value(1),
  ).current;

  // Gives the judged count a pop whenever it changes.
  const countScale = useRef(
    new Animated.Value(1),
  ).current;

  useEffect(() => {
    const pulseAnimation =
      Animated.loop(
        Animated.sequence([
          Animated.timing(
            iconScale,
            {
              toValue: 1.08,
              duration: 850,
              easing:
                Easing.inOut(
                  Easing.ease,
                ),
              useNativeDriver: true,
            },
          ),

          Animated.timing(
            iconScale,
            {
              toValue: 1,
              duration: 850,
              easing:
                Easing.inOut(
                  Easing.ease,
                ),
              useNativeDriver: true,
            },
          ),
        ]),
      );

    pulseAnimation.start();

    return () => {
      pulseAnimation.stop();
    };
  }, [iconScale]);

  useEffect(() => {
    countScale.stopAnimation();

    Animated.sequence([
      Animated.spring(
        countScale,
        {
          toValue: 1.1,
          speed: 28,
          bounciness: 7,
          useNativeDriver: true,
        },
      ),

      Animated.spring(
        countScale,
        {
          toValue: 1,
          speed: 24,
          bounciness: 4,
          useNativeDriver: true,
        },
      ),
    ]).start();
  }, [
    completedMoments,
    countScale,
  ]);

  return (
    <View style={styles.endlessContainer}>
      {/* Endless icon */}
      <Animated.View
        style={[
          styles.endlessIconContainer,

          {
            transform: [
              {
                scale: iconScale,
              },
            ],
          },
        ]}
      >
        <HeatMark size="small" />
      </Animated.View>

      {/* Endless mode text */}
      <View style={styles.endlessTextContainer}>
        <Text style={styles.endlessLabel}>
          ENDLESS ROUND
        </Text>

        <Text style={styles.endlessMessage}>
          Keep the Heat going.
        </Text>
      </View>

      {/* Number judged */}
      <Animated.View
        style={[
          styles.endlessCountContainer,

          {
            transform: [
              {
                scale: countScale,
              },
            ],
          },
        ]}
      >
        <Text style={styles.endlessCount}>
          {completedMoments}
        </Text>

        <Text style={styles.endlessCountLabel}>
          JUDGED
        </Text>
      </Animated.View>
    </View>
  );
}

// =====================================================
// Styles
// =====================================================

const styles = StyleSheet.create({
  // =====================================================
  // Finite Progress
  // =====================================================

  container: {
    backgroundColor:
      Colors.surface,

    borderColor:
      Colors.border,

    borderWidth: 1,
    borderRadius: Radius.lg,

    paddingVertical: 11,
    paddingHorizontal: 13,

    marginBottom: 14,
  },

  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    marginBottom: 8,
  },

  modeLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  modeDot: {
    color: Colors.heat,

    fontSize: 18,
    fontWeight: "900",

    lineHeight: 14,

    marginRight: 5,
  },

  modeLabel: {
    color:
      Colors.textSecondary,

    fontSize: 9,
    fontWeight: "900",

    letterSpacing: 1.15,
  },

  countLabel: {
    color:
      Colors.textPrimary,

    fontSize: 12,
    fontWeight: "900",
  },

  progressTrack: {
    position: "relative",

    height: 8,

    backgroundColor:
      Colors.surfaceAlt,

    borderRadius:
      Radius.pill,

    overflow: "hidden",
  },

  progressGlow: {
    ...StyleSheet.absoluteFillObject,

    backgroundColor:
      Colors.heat,

    borderRadius:
      Radius.pill,
  },

  progressFill: {
    height: "100%",

    backgroundColor:
      Colors.heat,

    borderRadius:
      Radius.pill,
  },

  progressMarkerContainer: {
    position: "absolute",

    top: 0,
    bottom: 0,
    left: 0,

    alignItems: "flex-end",
    justifyContent: "center",
  },

  progressMarker: {
    width: 10,
    height: 10,

    borderRadius: 5,

    backgroundColor:
      Colors.white,

    borderColor:
      Colors.heat,

    borderWidth: 2,
  },

  captionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    marginTop: 6,
  },

  captionText: {
    color:
      Colors.textSecondary,

    fontSize: 9,
    fontWeight: "700",
  },

  remainingText: {
    color: Colors.heat,

    fontSize: 9,
    fontWeight: "900",
  },

  // =====================================================
  // Endless Progress
  // =====================================================

  endlessContainer: {
    backgroundColor:
      Colors.surface,

    borderColor:
      Colors.border,

    borderWidth: 1,
    borderRadius: Radius.lg,

    paddingVertical: 10,
    paddingHorizontal: 12,

    marginBottom: 14,

    flexDirection: "row",
    alignItems: "center",
  },

  endlessIconContainer: {
    width: 38,
    height: 38,

    borderRadius: 19,

    backgroundColor:
      Colors.heatSoft,

    alignItems: "center",
    justifyContent: "center",

    marginRight: 10,
  },


  endlessTextContainer: {
    flex: 1,
  },

  endlessLabel: {
    color:
      Colors.textPrimary,

    fontSize: 10,
    fontWeight: "900",

    letterSpacing: 1,
  },

  endlessMessage: {
    color:
      Colors.textSecondary,

    fontSize: 10,
    fontWeight: "700",

    marginTop: 2,
  },

  endlessCountContainer: {
    alignItems: "flex-end",

    marginLeft: 12,
  },

  endlessCount: {
    color: Colors.heat,

    fontSize: 18,
    fontWeight: "900",
  },

  endlessCountLabel: {
    color:
      Colors.textSecondary,

    fontSize: 8,
    fontWeight: "900",

    letterSpacing: 0.8,
  },
});