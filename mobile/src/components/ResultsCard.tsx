// =====================================================
// File: ResultsCard.tsx
//
// Purpose:
// Displays the regular Roast / Toast result.
//
// Version 1.1 — Design + Motion Pass 1
//
// I am keeping the result design we already liked.
//
// What I am adding:
// • THE PEOPLE stamp lands first
// • HAVE SPOKEN follows behind it
// • the coral / teal result field starts at 50 / 50
// • both sides physically fight for space before settling
// • the percentages count into place
// • the player's pick stamps in
// • Heat lands after the verdict instead of everything
//   appearing at the exact same time
//
// I am intentionally NOT turning this into a cartoon.
// The motion should feel like printed game pieces landing
// on a table.
//
// Project: Roast or Toast
// =====================================================

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  AccessibilityInfo,
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import type {
  Moment,
} from "../data/types";

import {
  Colors,
} from "../theme";

import HeatMark from "./HeatMark";
import LevelUpCard from "./LevelUpCard";
import VoteMark from "./VoteMark";

import type {
  VoteChoice,
} from "./VoteButtons";

import useReducedMotion from "../hooks/useReducedMotion";

type ResultsCardProps = {
  moment: Moment;

  selectedVote:
    Exclude<
      VoteChoice,
      null
    >;

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
  const reduceMotion =
    useReducedMotion();

  // I stagger the pieces instead of making the whole result
  // fade in as one flat screenshot.
  const stampIn =
    useRef(
      new Animated.Value(0),
    ).current;

  const headingIn =
    useRef(
      new Animated.Value(0),
    ).current;

  const pickIn =
    useRef(
      new Animated.Value(0),
    ).current;

  const heatIn =
    useRef(
      new Animated.Value(0),
    ).current;

  useEffect(() => {
    // If Reduce Motion is on, I show the finished design
    // immediately instead of making the player sit through
    // the stamp / slide / scale sequence.
    if (reduceMotion) {
      stampIn.setValue(1);
      headingIn.setValue(1);
      pickIn.setValue(1);
      heatIn.setValue(1);

      return;
    }

    stampIn.setValue(0);
    headingIn.setValue(0);
    pickIn.setValue(0);
    heatIn.setValue(0);

    Animated.sequence([
      Animated.spring(
        stampIn,
        {
          toValue: 1,
          speed: 22,
          bounciness: 8,
          useNativeDriver: true,
        },
      ),

      Animated.parallel([
        Animated.spring(
          headingIn,
          {
            toValue: 1,
            speed: 20,
            bounciness: 5,
            useNativeDriver: true,
          },
        ),

        Animated.timing(
          pickIn,
          {
            toValue: 1,
            duration: 260,
            delay: 560,
            easing:
              Easing.out(
                Easing.cubic,
              ),
            useNativeDriver: true,
          },
        ),

        Animated.spring(
          heatIn,
          {
            toValue: 1,
            delay: 720,
            speed: 18,
            bounciness: 7,
            useNativeDriver: true,
          },
        ),
      ]),
    ]).start();
  }, [
    heatIn,
    headingIn,
    pickIn,
    reduceMotion,
    stampIn,
    moment.id,
  ]);

  // I announce the finished verdict after the visual reveal.
  // This keeps VoiceOver users from having to hunt through
  // the screen just to learn the crowd result.
  useEffect(() => {
    const delay =
      reduceMotion
        ? 80
        : 1150;

    const timer =
      setTimeout(() => {
        AccessibilityInfo
          .announceForAccessibility(
            `The people have spoken. Roast ${moment.roastPercentage} percent. Toast ${moment.toastPercentage} percent. You picked ${selectedVote}. ${matchedMajority ? "You called it." : "You had your own take."} You earned ${heatEarned} Heat.`,
          );
      }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [
    heatEarned,
    matchedMajority,
    moment.id,
    moment.roastPercentage,
    moment.toastPercentage,
    reduceMotion,
    selectedVote,
  ]);

  return (
    <Animated.View
      style={[
        styles.container,
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
      {/* =================================================
          Verdict Header
      ================================================= */}

      <View style={styles.headingArea}>
        <Animated.View
          style={[
            styles.peopleBrush,
            {
              opacity:
                stampIn,

              transform: [
                {
                  scale:
                    stampIn.interpolate({
                      inputRange:
                        [0, 1],

                      outputRange:
                        [1.28, 1],
                    }),
                },

                {
                  rotate:
                    stampIn.interpolate({
                      inputRange:
                        [0, 1],

                      outputRange:
                        ["-8deg", "-3deg"],
                    }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.peopleBrushText}>
            THE PEOPLE
          </Text>
        </Animated.View>

        <Animated.Text
          style={[
            styles.heading,
            {
              opacity:
                headingIn,

              transform: [
                {
                  translateY:
                    headingIn.interpolate({
                      inputRange:
                        [0, 1],

                      outputRange:
                        [18, 0],
                    }),
                },
              ],
            },
          ]}
        >
          HAVE SPOKEN!
        </Animated.Text>

        <Animated.View
          style={[
            styles.headingScratch,
            {
              transform: [
                {
                  scaleX:
                    headingIn,
                },
                {
                  rotate:
                    "-5deg",
                },
              ],
            },
          ]}
        />
      </View>

      {/* =================================================
          Signature Crowd Reveal

          This starts visually at 50 / 50.

          I do not let a 95 / 5 result literally make one
          side only 5% wide because the artwork would become
          unreadable. The seam moves toward the real result
          while keeping both marks visible.
      ================================================= */}

      <BattleResult
        roastPercentage={
          moment.roastPercentage
        }
        toastPercentage={
          moment.toastPercentage
        }
        reduceMotion={
          reduceMotion
        }
      />

      {/* =================================================
          Player Pick
      ================================================= */}

      <Animated.View
        accessible
        accessibilityLabel={`You picked ${selectedVote}. ${matchedMajority ? "You called it." : "You had your own take."}`}
        style={[
          styles.playerResponse,
          {
            opacity:
              pickIn,

            transform: [
              {
                translateY:
                  pickIn.interpolate({
                    inputRange:
                      [0, 1],

                    outputRange:
                      [16, 0],
                  }),
              },
            ],
          },
        ]}
      >
        <View style={styles.pickRow}>
          <Text style={styles.pickLead}>
            YOU PICKED
          </Text>

          <Animated.View
            style={[
              styles.pickStamp,
              {
                borderColor:
                  selectedVote === "roast"
                    ? Colors.roast
                    : Colors.toast,

                transform: [
                  {
                    scale:
                      pickIn.interpolate({
                        inputRange:
                          [0, 1],

                        outputRange:
                          [1.18, 1],
                      }),
                  },

                  {
                    rotate:
                      selectedVote === "roast"
                        ? "-2deg"
                        : "2deg",
                  },
                ],
              },
            ]}
          >
            <VoteMark
              type={selectedVote}
              size="small"
            />

            <Text
              style={[
                styles.pickText,
                {
                  color:
                    selectedVote === "roast"
                      ? Colors.roastDark
                      : Colors.toastDark,
                },
              ]}
            >
              {selectedVote === "roast"
                ? "ROAST"
                : "TOAST"}
            </Text>
          </Animated.View>
        </View>

        <Text style={styles.reactionLine}>
          {matchedMajority
            ? "You called it."
            : "You had your own take."}
        </Text>
      </Animated.View>

      {/* =================================================
          Heat
      ================================================= */}

      <Animated.View
        accessible
        accessibilityLabel={`Heat earned, ${heatEarned}. ${matchedMajority ? "With the crowd." : "Own take."}`}
        style={[
          styles.heatTicket,
          {
            opacity:
              heatIn,

            transform: [
              {
                scale:
                  heatIn.interpolate({
                    inputRange:
                      [0, 1],

                    outputRange:
                      [1.12, 1],
                  }),
              },

              {
                rotate:
                  heatIn.interpolate({
                    inputRange:
                      [0, 1],

                    outputRange:
                      ["3deg", "0.5deg"],
                  }),
              },
            ],
          },
        ]}
      >
        <View style={styles.heatStampLabel}>
          <Text style={styles.heatStampLabelText}>
            HEAT EARNED
          </Text>
        </View>

        <HeatMark
          size="medium"
        />

        <View style={styles.heatCopy}>
          <Text style={styles.heatAmount}>
            +{heatEarned} HEAT
          </Text>

          <Text style={styles.heatSubtext}>
            {matchedMajority
              ? "WITH THE CROWD"
              : "OWN TAKE"}
          </Text>
        </View>
      </Animated.View>

      {leveledUp && (
        <LevelUpCard
          level={
            currentLevel
          }
        />
      )}

      {/* =================================================
          Top Take
      ================================================= */}

      <View
        accessible
        accessibilityLabel={`Top take. ${moment.topComment}`}
        style={styles.topTake}
      >
        <View
          style={[
            styles.topTakeTape,
            {
              backgroundColor:
                categoryAccent,
            },
          ]}
        >
          <Text style={styles.topTakeTapeText}>
            TOP TAKE
          </Text>
        </View>

        <Text style={styles.topTakeText}>
          “{moment.topComment}”
        </Text>

        <View style={styles.topTakeRule} />
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Show next moment"
        accessibilityHint="Moves to the next Roast or Toast Moment."
        onPress={onNextPress}
        style={({ pressed }) => [
          styles.nextAction,
          pressed &&
            styles.pressed,
        ]}
      >
        <View style={styles.nextButton}>
          <Text style={styles.nextText}>
            NEXT MOMENT
          </Text>

          <Text style={styles.nextArrow}>
            →
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

// =====================================================
// Crowd Result
// =====================================================

function BattleResult({
  roastPercentage,
  toastPercentage,
  reduceMotion,
}: {
  roastPercentage: number;
  toastPercentage: number;
  reduceMotion: boolean;
}) {
  const safeRoast =
    Math.min(
      Math.max(
        roastPercentage,
        0,
      ),
      100,
    );

  const safeToast =
    Math.min(
      Math.max(
        toastPercentage,
        0,
      ),
      100,
    );

  // I let the seam move, but keep each side usable.
  const visualRoast =
    50 +
    (safeRoast - 50) *
      0.5;

  const visualToast =
    100 -
    visualRoast;

  const reveal =
    useRef(
      new Animated.Value(0),
    ).current;

  const [
    shownRoast,
    setShownRoast,
  ] =
    useState(50);

  const [
    shownToast,
    setShownToast,
  ] =
    useState(50);

  useEffect(() => {
    // I keep the same final crowd split with Reduce Motion,
    // I just skip the moving seam and count-up.
    if (reduceMotion) {
      reveal.setValue(1);
      setShownRoast(
        safeRoast,
      );
      setShownToast(
        safeToast,
      );

      return;
    }

    reveal.setValue(0);

    setShownRoast(50);
    setShownToast(50);

    const listener =
      reveal.addListener(
        ({
          value,
        }) => {
          setShownRoast(
            Math.round(
              50 +
                (
                  safeRoast -
                  50
                ) *
                  value,
            ),
          );

          setShownToast(
            Math.round(
              50 +
                (
                  safeToast -
                  50
                ) *
                  value,
            ),
          );
        },
      );

    Animated.sequence([
      Animated.delay(180),

      Animated.timing(
        reveal,
        {
          toValue: 1,
          duration: 900,

          easing:
            Easing.out(
              Easing.back(1.15),
            ),

          useNativeDriver:
            false,
        },
      ),
    ]).start();

    return () => {
      reveal.removeListener(
        listener,
      );
    };
  }, [
    reduceMotion,
    reveal,
    safeRoast,
    safeToast,
  ]);

  const roastWidth =
    reveal.interpolate({
      inputRange:
        [0, 1],

      outputRange: [
        "50%",
        `${visualRoast}%`,
      ],
    });

  const toastWidth =
    reveal.interpolate({
      inputRange:
        [0, 1],

      outputRange: [
        "50%",
        `${visualToast}%`,
      ],
    });

  return (
    <View
      accessible
      accessibilityLabel={`Crowd result. Roast ${safeRoast} percent. Toast ${safeToast} percent.`}
      style={styles.battle}
    >
      <Animated.View
        style={[
          styles.roastHalf,
          {
            width:
              roastWidth,
          },
        ]}
      >
        <View style={styles.resultSeal}>
          <VoteMark
            type="roast"
            size="medium"
          />
        </View>

        <Text style={styles.percent}>
          {shownRoast}%
        </Text>

        <Text style={styles.battleLabel}>
          ROAST
        </Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.toastHalf,
          {
            width:
              toastWidth,
          },
        ]}
      >
        <View style={styles.resultSeal}>
          <VoteMark
            type="toast"
            size="medium"
          />
        </View>

        <Text style={styles.percent}>
          {shownToast}%
        </Text>

        <Text style={styles.battleLabel}>
          TOAST
        </Text>
      </Animated.View>

      <View style={styles.centerLine} />

      <Animated.View
        style={[
          styles.vsPuck,
          {
            transform: [
              {
                scale:
                  reveal.interpolate({
                    inputRange:
                      [0, 0.75, 1],

                    outputRange:
                      [0.7, 1.12, 1],
                  }),
              },
            ],
          },
        ]}
      >
        <Text style={styles.vsText}>
          VS
        </Text>
      </Animated.View>
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      paddingBottom: 28,
    },

    headingArea: {
      alignItems: "center",

      paddingTop: 14,
      marginBottom: 16,
    },

    peopleBrush: {
      backgroundColor:
        Colors.textPrimary,

      paddingVertical: 7,
      paddingHorizontal: 18,

      marginBottom: 4,
    },

    peopleBrushText: {
      color:
        Colors.white,

      fontSize: 9,
      fontWeight: "900",
      letterSpacing: 1.8,
    },

    heading: {
      color:
        Colors.textPrimary,

      fontSize: 38,
      lineHeight: 40,
      fontWeight: "900",
      letterSpacing: -1.8,

      textAlign: "center",
    },

    headingScratch: {
      width: 64,
      height: 4,

      backgroundColor:
        Colors.roast,

      marginTop: 8,
    },

    battle: {
      position: "relative",

      height: 235,

      flexDirection: "row",

      marginHorizontal: -18,
      marginBottom: 17,

      overflow: "hidden",
    },

    roastHalf: {
      height: "100%",

      backgroundColor:
        Colors.roast,

      alignItems: "center",
      justifyContent: "center",

      paddingHorizontal: 8,
    },

    toastHalf: {
      height: "100%",

      backgroundColor:
        Colors.toast,

      alignItems: "center",
      justifyContent: "center",

      paddingHorizontal: 8,
    },

    resultSeal: {
      width: 68,
      height: 68,

      borderRadius: 34,

      backgroundColor:
        "rgba(255,247,239,0.9)",

      alignItems: "center",
      justifyContent: "center",

      marginBottom: 5,
    },

    percent: {
      color:
        Colors.white,

      fontSize: 44,
      lineHeight: 48,
      fontWeight: "900",
      letterSpacing: -1.6,
    },

    battleLabel: {
      color:
        Colors.white,

      fontSize: 10,
      fontWeight: "900",
      letterSpacing: 1.6,
    },

    centerLine: {
      position: "absolute",

      left: "50%",
      top: 0,
      bottom: 0,

      width: 4,
      marginLeft: -2,

      backgroundColor:
        Colors.textPrimary,
    },

    vsPuck: {
      position: "absolute",

      left: "50%",
      top: "50%",

      width: 54,
      height: 54,

      marginLeft: -27,
      marginTop: -27,

      borderRadius: 27,

      backgroundColor:
        Colors.textPrimary,

      borderColor:
        Colors.background,
      borderWidth: 4,

      alignItems: "center",
      justifyContent: "center",
    },

    vsText: {
      color:
        Colors.white,

      fontSize: 9,
      fontWeight: "900",
      letterSpacing: 1,
    },

    playerResponse: {
      alignItems: "center",

      marginBottom: 15,
    },

    pickRow: {
      flexDirection: "row",
      alignItems: "center",

      gap: 10,

      marginBottom: 8,
    },

    pickLead: {
      color:
        Colors.textMuted,

      fontSize: 8,
      fontWeight: "900",
      letterSpacing: 1.4,
    },

    pickStamp: {
      minWidth: 145,

      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",

      borderWidth: 1.6,

      paddingVertical: 10,
      paddingHorizontal: 16,
    },

    pickText: {
      fontSize: 12,
      fontWeight: "900",
      letterSpacing: 1.2,

      marginLeft: 8,
    },

    reactionLine: {
      color:
        Colors.textPrimary,

      fontSize: 22,
      lineHeight: 27,
      fontWeight: "900",
      letterSpacing: -0.7,

      textAlign: "center",
    },

    heatTicket: {
      position: "relative",

      width: "78%",
      minHeight: 96,

      alignSelf: "center",

      backgroundColor:
        Colors.heatSoft,

      borderColor:
        "#E6B66F",
      borderWidth: 1.4,

      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",

      paddingVertical: 15,
      paddingHorizontal: 18,

      marginBottom: 21,
    },

    heatStampLabel: {
      position: "absolute",

      left: 14,
      top: -11,

      backgroundColor:
        Colors.textPrimary,

      paddingVertical: 6,
      paddingHorizontal: 12,

      transform: [
        {
          rotate: "-2deg",
        },
      ],
    },

    heatStampLabelText: {
      color:
        Colors.white,

      fontSize: 7.5,
      fontWeight: "900",
      letterSpacing: 1.5,
    },

    heatCopy: {
      marginLeft: 11,
    },

    heatAmount: {
      color:
        Colors.heatDark,

      fontSize: 23,
      fontWeight: "900",
      letterSpacing: -0.5,
    },

    heatSubtext: {
      color:
        Colors.textMuted,

      fontSize: 7.5,
      fontWeight: "900",
      letterSpacing: 1.2,

      marginTop: 1,
    },

    topTake: {
      paddingHorizontal: 8,

      marginTop: 2,
      marginBottom: 20,
    },

    topTakeTape: {
      alignSelf: "flex-start",

      paddingVertical: 5,
      paddingHorizontal: 12,

      marginBottom: 12,

      transform: [
        {
          rotate: "-2deg",
        },
      ],
    },

    topTakeTapeText: {
      color:
        Colors.white,

      fontSize: 8,
      fontWeight: "900",
      letterSpacing: 1.4,
    },

    topTakeText: {
      color:
        Colors.textPrimary,

      fontSize: 19,
      lineHeight: 27,
      fontWeight: "500",

      paddingHorizontal: 5,
    },

    topTakeRule: {
      height: 1.2,

      backgroundColor:
        Colors.borderStrong,

      marginTop: 15,
    },

    nextAction: {
      marginHorizontal: 7,
    },

    nextButton: {
      minHeight: 68,

      backgroundColor:
        Colors.textPrimary,

      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",

      paddingHorizontal: 22,

      borderBottomColor:
        Colors.toast,
      borderBottomWidth: 5,

      transform: [
        {
          rotate: "-0.8deg",
        },
      ],
    },

    nextText: {
      color:
        Colors.white,

      fontSize: 11,
      fontWeight: "900",
      letterSpacing: 1.5,
    },

    nextArrow: {
      color:
        Colors.white,

      fontSize: 26,
      fontWeight: "700",
    },

    pressed: {
      opacity: 0.72,

      transform: [
        {
          scale: 0.985,
        },
      ],
    },
  });
