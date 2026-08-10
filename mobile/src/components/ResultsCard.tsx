// =====================================================
// File: ResultsCard.tsx
//
// Purpose:
// Displays the results after a regular Roast or Toast
// vote.
//
// Version 1.1 gives the result screen a stronger
// Roast-vs-Toast identity.
//
// Instead of treating both percentages like ordinary
// progress bars, the screen presents them as opposing
// sides of the same decision.
//
// The flame is reserved for Heat and progression.
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

import type {
  Moment,
} from "../data/types";

import {
  Colors,
  Radius,
} from "../theme";

import FloatingHeat from "./FloatingHeat";
import LevelUpCard from "./LevelUpCard";
import VoteMark from "./VoteMark";

import type {
  VoteChoice,
} from "./VoteButtons";

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
      {/* =================================================
          Heading
      ================================================= */}

      <View
        style={
          styles.headingRow
        }
      >
        <Text
          style={
            styles.resultsEyebrow
          }
        >
          THE VERDICT
        </Text>

        <Text
          style={
            styles.resultsHeading
          }
        >
          The People{"\n"}
          Have Spoken
        </Text>
      </View>

      {/* Player's choice */}
      <View
        style={[
          styles.playerVoteCard,

          selectedVote ===
          "roast"
            ? styles.playerVoteRoast
            : styles.playerVoteToast,
        ]}
      >
        <VoteMark
          type={selectedVote}
          size="small"
        />

        <View
          style={
            styles.playerVoteText
          }
        >
          <Text
            style={
              styles.playerVoteLabel
            }
          >
            YOU PICKED
          </Text>

          <Text
            style={[
              styles.playerVoteValue,

              selectedVote ===
              "roast"
                ? styles.roastText
                : styles.toastText,
            ]}
          >
            {selectedVote ===
            "roast"
              ? "ROAST"
              : "TOAST"}
          </Text>
        </View>
      </View>

      {/* Heat reward stays separate from Roast */}
      <FloatingHeat
        heatEarned={
          heatEarned
        }
        matchedMajority={
          matchedMajority
        }
      />

      {leveledUp && (
        <LevelUpCard
          level={
            currentLevel
          }
        />
      )}

      {/* =================================================
          Roast vs Toast
      ================================================= */}

      <View
        style={
          styles.battleCard
        }
      >
        <Text
          style={
            styles.battleLabel
          }
        >
          CROWD SPLIT
        </Text>

        <View
          style={
            styles.battleHeader
          }
        >
          <View
            style={
              styles.battleSide
            }
          >
            <VoteMark
              type="roast"
              size="small"
            />

            <Text
              style={
                styles.roastBattleText
              }
            >
              ROAST
            </Text>
          </View>

          <Text
            style={
              styles.versusText
            }
          >
            VS
          </Text>

          <View
            style={[
              styles.battleSide,
              styles.toastBattleSide,
            ]}
          >
            <Text
              style={
                styles.toastBattleText
              }
            >
              TOAST
            </Text>

            <VoteMark
              type="toast"
              size="small"
            />
          </View>
        </View>

        <BattleResult
          roastPercentage={
            moment.roastPercentage
          }
          toastPercentage={
            moment.toastPercentage
          }
        />
      </View>

      {/* =================================================
          Top Comment
      ================================================= */}

      <View
        style={[
          styles.commentCard,

          {
            borderColor:
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
          TOP TAKE
        </Text>

        <Text
          style={
            styles.commentText
          }
        >
          “{moment.topComment}”
        </Text>
      </View>

      {/* Next Moment */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Show next moment"
        onPress={
          onNextPress
        }
        style={({
          pressed,
        }) => [
          styles.nextButton,

          pressed &&
            styles.buttonPressed,
        ]}
      >
        <Text
          style={
            styles.nextButtonText
          }
        >
          Next Moment
        </Text>

        <Text
          style={
            styles.nextButtonArrow
          }
        >
          →
        </Text>
      </Pressable>
    </Animated.View>
  );
}

// =====================================================
// Battle Result
// =====================================================

type BattleResultProps = {
  roastPercentage: number;
  toastPercentage: number;
};

function BattleResult({
  roastPercentage,
  toastPercentage,
}: BattleResultProps) {
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

  const roastProgress =
    useRef(
      new Animated.Value(0),
    ).current;

  const toastProgress =
    useRef(
      new Animated.Value(0),
    ).current;

  const [
    displayedRoast,
    setDisplayedRoast,
  ] =
    useState(0);

  const [
    displayedToast,
    setDisplayedToast,
  ] =
    useState(0);

  useEffect(() => {
    roastProgress.setValue(0);
    toastProgress.setValue(0);

    setDisplayedRoast(0);
    setDisplayedToast(0);

    const roastListener =
      roastProgress.addListener(
        ({
          value,
        }) => {
          setDisplayedRoast(
            Math.round(
              value *
                safeRoast,
            ),
          );
        },
      );

    const toastListener =
      toastProgress.addListener(
        ({
          value,
        }) => {
          setDisplayedToast(
            Math.round(
              value *
                safeToast,
            ),
          );
        },
      );

    Animated.parallel([
      Animated.timing(
        roastProgress,
        {
          toValue: 1,
          duration: 720,
          delay: 100,

          easing:
            Easing.out(
              Easing.cubic,
            ),

          useNativeDriver:
            false,
        },
      ),

      Animated.timing(
        toastProgress,
        {
          toValue: 1,
          duration: 720,
          delay: 180,

          easing:
            Easing.out(
              Easing.cubic,
            ),

          useNativeDriver:
            false,
        },
      ),
    ]).start();

    return () => {
      roastProgress.removeListener(
        roastListener,
      );

      toastProgress.removeListener(
        toastListener,
      );
    };
  }, [
    roastProgress,
    safeRoast,
    safeToast,
    toastProgress,
  ]);

  const roastWidth =
    roastProgress.interpolate({
      inputRange: [
        0,
        1,
      ],

      outputRange: [
        "0%",
        `${safeRoast}%`,
      ],
    });

  const toastWidth =
    toastProgress.interpolate({
      inputRange: [
        0,
        1,
      ],

      outputRange: [
        "0%",
        `${safeToast}%`,
      ],
    });

  return (
    <View>
      {/* Large percentages */}
      <View
        style={
          styles.percentageRow
        }
      >
        <Text
          style={
            styles.roastPercentage
          }
        >
          {displayedRoast}%
        </Text>

        <Text
          style={
            styles.toastPercentage
          }
        >
          {displayedToast}%
        </Text>
      </View>

      {/* Competing color bar */}
      <View
        style={
          styles.splitTrack
        }
      >
        <Animated.View
          style={[
            styles.roastSplit,

            {
              width:
                roastWidth,
            },
          ]}
        />

        <Animated.View
          style={[
            styles.toastSplit,

            {
              width:
                toastWidth,
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
    resultsContainer: {
      paddingBottom: 28,
    },

    headingRow: {
      marginBottom: 18,
    },

    resultsEyebrow: {
      color:
        Colors.textMuted,

      fontSize: 10,
      fontWeight: "900",
      letterSpacing: 2.2,

      marginBottom: 5,
    },

    resultsHeading: {
      color:
        Colors.textPrimary,

      fontSize: 35,
      fontWeight: "900",
      letterSpacing: -1.6,
      lineHeight: 39,
    },

    playerVoteCard: {
      flexDirection: "row",
      alignItems: "center",

      borderWidth: 1.5,
      borderRadius:
        Radius.lg,

      paddingVertical: 13,
      paddingHorizontal: 15,

      marginBottom: 15,
    },

    playerVoteRoast: {
      backgroundColor:
        Colors.roastWash,

      borderColor:
        Colors.roastSoft,
    },

    playerVoteToast: {
      backgroundColor:
        Colors.toastWash,

      borderColor:
        Colors.toastSoft,
    },

    playerVoteText: {
      marginLeft: 12,
    },

    playerVoteLabel: {
      color:
        Colors.textMuted,

      fontSize: 9,
      fontWeight: "900",
      letterSpacing: 1.5,
    },

    playerVoteValue: {
      fontSize: 18,
      fontWeight: "900",
      letterSpacing: 1,
      marginTop: 1,
    },

    roastText: {
      color:
        Colors.roastDark,
    },

    toastText: {
      color:
        Colors.toastDark,
    },

    battleCard: {
      backgroundColor:
        Colors.surfaceWarm,

      borderColor:
        Colors.borderStrong,

      borderWidth: 1.5,

      borderRadius:
        Radius.xl,

      padding: 18,

      marginTop: 4,
      marginBottom: 18,

      transform: [
        {
          rotate:
            "-0.4deg",
        },
      ],
    },

    battleLabel: {
      color:
        Colors.textMuted,

      fontSize: 9,
      fontWeight: "900",
      letterSpacing: 2,

      textAlign: "center",

      marginBottom: 13,
    },

    battleHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",

      marginBottom: 15,
    },

    battleSide: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },

    toastBattleSide: {
      justifyContent:
        "flex-end",
    },

    roastBattleText: {
      color:
        Colors.roastDark,

      fontSize: 17,
      fontWeight: "900",
      letterSpacing: 1,
    },

    toastBattleText: {
      color:
        Colors.toastDark,

      fontSize: 17,
      fontWeight: "900",
      letterSpacing: 1,
    },

    versusText: {
      color:
        Colors.textMuted,

      fontSize: 10,
      fontWeight: "900",
      letterSpacing: 1.5,
    },

    percentageRow: {
      flexDirection: "row",
      justifyContent:
        "space-between",

      marginBottom: 9,
    },

    roastPercentage: {
      color:
        Colors.roastDark,

      fontSize: 29,
      fontWeight: "900",
    },

    toastPercentage: {
      color:
        Colors.toastDark,

      fontSize: 29,
      fontWeight: "900",
    },

    splitTrack: {
      height: 14,

      flexDirection: "row",

      backgroundColor:
        Colors.surfaceAlt,

      borderRadius:
        Radius.pill,

      overflow: "hidden",
    },

    roastSplit: {
      height: "100%",

      backgroundColor:
        Colors.roast,
    },

    toastSplit: {
      height: "100%",

      backgroundColor:
        Colors.toast,
    },

    commentCard: {
      backgroundColor:
        Colors.surface,

      borderWidth: 1.5,
      borderRadius:
        Radius.lg,

      padding: 18,

      marginBottom: 20,

      transform: [
        {
          rotate:
            "0.4deg",
        },
      ],
    },

    commentLabel: {
      fontSize: 10,
      fontWeight: "900",
      letterSpacing: 1.5,
      marginBottom: 8,
    },

    commentText: {
      color:
        Colors.textPrimary,

      fontSize: 16,
      fontWeight: "700",
      lineHeight: 23,
    },

    nextButton: {
      backgroundColor:
        Colors.textPrimary,

      borderRadius:
        Radius.pill,

      paddingVertical: 17,
      paddingHorizontal: 25,

      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",

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
      color:
        Colors.white,

      fontSize: 18,
      fontWeight: "900",
    },

    nextButtonArrow: {
      color:
        Colors.white,

      fontSize: 23,
      fontWeight: "700",
    },
  });