// =====================================================
// File: GuessTheCrowdCard.tsx
//
// Special Mode: Guess the Crowd
//
// Version 1.1 — Design + Motion Pass 1
//
// The last layout was cleaner, but the five boxes still
// looked too much like UI cards.
//
// I am changing the prediction stage into a physical
// "crowd deck":
//
// • five full-width answer slips
// • each slip lands on screen with a slight angle
// • coral / teal paper edges show which way it leans
// • the custom R / glasses marks do the branding
// • the ratio is secondary instead of becoming a chart
// • tapping a slip makes it lift, straighten, and stamp in
//
// I am keeping the same five reads and the same scoring
// logic underneath.
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
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import type {
  Moment,
} from "../data/types";

import {
  triggerCrowdPredictionEffect,
  triggerCrowdResultEffect,
  triggerCrowdRoastSelectionEffect,
  triggerCrowdToastSelectionEffect,
  triggerNavigationEffect,
} from "../game/effects";

import type {
  CrowdGuessProgressResult,
  PlayerVote,
} from "../game/progressTypes";

import {
  CategoryName,
  CategoryThemes,
  Colors,
  Spacing,
} from "../theme";

import HeatStamp from "./HeatStamp";
import PaperButton from "./PaperButton";
import ScenarioHeader from "./ScenarioHeader";
import StampLabel from "./StampLabel";
import VoteMark from "./VoteMark";

import useReducedMotion from "../hooks/useReducedMotion";

type GuessStage =
  | "prediction"
  | "personalVote"
  | "results";

type CrowdReadId =
  | "mostlyRoast"
  | "leanRoast"
  | "split"
  | "leanToast"
  | "mostlyToast";

type CrowdRead = {
  id: CrowdReadId;
  label: string;
  roast: number;
  toast: number;
  predictedSide:
    PlayerVote | null;
  rotation: number;
  offset: number;
};

const CROWD_READS:
  CrowdRead[] = [
    {
      id: "mostlyRoast",
      label: "MOSTLY ROAST",
      roast: 80,
      toast: 20,
      predictedSide: "roast",
      rotation: -1.4,
      offset: -5,
    },

    {
      id: "leanRoast",
      label: "LEAN ROAST",
      roast: 65,
      toast: 35,
      predictedSide: "roast",
      rotation: 0.8,
      offset: 8,
    },

    {
      id: "split",
      label: "SPLIT",
      roast: 50,
      toast: 50,
      predictedSide: null,
      rotation: -0.4,
      offset: 0,
    },

    {
      id: "leanToast",
      label: "LEAN TOAST",
      roast: 35,
      toast: 65,
      predictedSide: "toast",
      rotation: 1,
      offset: -7,
    },

    {
      id: "mostlyToast",
      label: "MOSTLY TOAST",
      roast: 20,
      toast: 80,
      predictedSide: "toast",
      rotation: -0.8,
      offset: 7,
    },
  ];

type GuessTheCrowdCardProps = {
  moment: Moment;

  onRecordGuess: (
    prediction: PlayerVote,
    roastPercentage: number,
    toastPercentage: number,
  ) => CrowdGuessProgressResult;

  onContinue: () => void;
  onBackPress: () => void;
  onHomePress: () => void;
};

export default function GuessTheCrowdCard({
  moment,
  onRecordGuess,
  onContinue,
  onBackPress,
  onHomePress,
}: GuessTheCrowdCardProps) {
  const reduceMotion =
    useReducedMotion();

  const [
    stage,
    setStage,
  ] =
    useState<GuessStage>(
      "prediction",
    );

  const [
    selectedRead,
    setSelectedRead,
  ] =
    useState<CrowdRead | null>(
      null,
    );

  const [
    crowdPrediction,
    setCrowdPrediction,
  ] =
    useState<PlayerVote | null>(
      null,
    );

  const [
    personalVote,
    setPersonalVote,
  ] =
    useState<PlayerVote | null>(
      null,
    );

  const [
    progressResult,
    setProgressResult,
  ] =
    useState<CrowdGuessProgressResult | null>(
      null,
    );

  const stageIn =
    useRef(
      new Animated.Value(0),
    ).current;

  const resultReveal =
    useRef(
      new Animated.Value(0),
    ).current;

  const categoryTheme =
    CategoryThemes[
      moment.category as CategoryName
    ] ??
    CategoryThemes["Everyday Life"];

  // Every stage gets a small entrance so the player feels
  // a transition instead of a hard React re-render.
  useEffect(() => {
    // I keep stage changes instant when Reduce Motion is on.
    // The screen still changes, but it does not slide at the player.
    if (reduceMotion) {
      // I stop the old native animation before I force this
      // stage visible. Without this, React Native can still
      // have the previous spring attached to stageIn while
      // I am switching from READ THE ROOM to the personal vote.
      stageIn.stopAnimation();
      stageIn.setValue(1);
      return;
    }

    stageIn.stopAnimation();
    stageIn.setValue(0);

    Animated.spring(
      stageIn,
      {
        toValue: 1,
        speed: 20,
        bounciness: 5,
        useNativeDriver: true,
      },
    ).start();
  }, [
    reduceMotion,
    stage,
    stageIn,
  ]);

  useEffect(() => {
    if (
      stage !== "results"
    ) {
      resultReveal.setValue(
        0,
      );

      return;
    }

    if (reduceMotion) {
      // Same idea here: I want the final crowd result to be
      // fully visible, not stuck between an old animation
      // and the reduced-motion version.
      resultReveal.stopAnimation();
      resultReveal.setValue(
        1,
      );

      return;
    }

    resultReveal.stopAnimation();
    resultReveal.setValue(0);

    Animated.timing(
      resultReveal,
      {
        toValue: 1,
        duration: 850,

        easing:
          Easing.out(
            Easing.cubic,
          ),

        useNativeDriver:
          false,
      },
    ).start();
  }, [
    reduceMotion,
    resultReveal,
    stage,
  ]);

  const handlePrediction =
    (
      read:
        CrowdRead,
    ) => {
      triggerCrowdPredictionEffect();

      setSelectedRead(read);

      setCrowdPrediction(
        read.predictedSide,
      );

      setStage(
        "personalVote",
      );
    };

  const handlePersonalVote =
    (
      choice:
        PlayerVote,
    ) => {
      if (!selectedRead) {
        return;
      }

      if (
        choice === "roast"
      ) {
        triggerCrowdRoastSelectionEffect();
      } else {
        triggerCrowdToastSelectionEffect();
      }

      // SPLIT is still stored in a binary progress model.
      // Until that model changes, I use the player's own
      // side as the scoring fallback.
      const scoringPrediction =
        crowdPrediction ??
        choice;

      const result =
        onRecordGuess(
          scoringPrediction,
          moment.roastPercentage,
          moment.toastPercentage,
        );

      setCrowdPrediction(
        scoringPrediction,
      );

      setPersonalVote(
        choice,
      );

      setProgressResult(
        result,
      );

      setStage(
        "results",
      );

      setTimeout(() => {
        triggerCrowdResultEffect(
          result.guessedCorrectly,
        );
      }, 300);
    };

  const handleContinue =
    () => {
      triggerNavigationEffect();

      onContinue();
    };

  // I announce the Guess result once the result stage is ready.
  // The visible cards stay exactly the same for everyone else.
  useEffect(() => {
    if (
      stage !== "results" ||
      !selectedRead ||
      !personalVote ||
      !progressResult
    ) {
      return;
    }

    const delay =
      reduceMotion
        ? 80
        : 950;

    const timer =
      setTimeout(() => {
        AccessibilityInfo
          .announceForAccessibility(
            `${progressResult.guessedCorrectly ? "You called it." : "Missed the room."} The crowd was Roast ${moment.roastPercentage} percent and Toast ${moment.toastPercentage} percent. Your read was ${selectedRead.label}. Your vote was ${personalVote}. You earned ${progressResult.heatEarned} Heat.`,
          );
      }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [
    moment.id,
    moment.roastPercentage,
    moment.toastPercentage,
    personalVote,
    progressResult,
    reduceMotion,
    selectedRead,
    stage,
  ]);

  return (
    <View style={styles.container}>
      <ScenarioHeader
        accentColor={
          categoryTheme.accent
        }
        onBackPress={
          onBackPress
        }
        onHomePress={
          onHomePress
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.scrollContent
        }
      >
        <StampLabel
          text="GUESS THE CROWD"
          color={
            Colors.toastDark
          }
          rotate={-3}
          size="medium"
        />

        <ImageBackground
          source={require("../../assets/game/paper/moment-paper.png")}
          resizeMode="stretch"
          style={styles.momentPaper}
        >
          <Text
            style={styles.question}
            numberOfLines={8}
            adjustsFontSizeToFit
            minimumFontScale={
              0.78
            }
          >
            {moment.question}
          </Text>
        </ImageBackground>

        {/* =================================================
            STAGE 1 — READ THE ROOM
        ================================================= */}

        {stage ===
          "prediction" && (
          <Animated.View
            // With Reduce Motion on, I give this stage plain
            // numeric styles instead of Animated.Value styles.
            // That guarantees READ THE ROOM stays visible even
            // if a previous native animation was still attached.
            style={
              reduceMotion
                ? {
                    opacity: 1,
                    transform: [
                      {
                        translateY: 0,
                      },
                    ],
                  }
                : {
                    opacity:
                      stageIn,

                    transform: [
                      {
                        translateY:
                          stageIn.interpolate({
                            inputRange:
                              [0, 1],

                            outputRange:
                              [20, 0],
                          }),
                      },
                    ],
                  }
            }
          >
            <Text style={styles.readHeading}>
              READ THE
              {"\n"}
              ROOM.
            </Text>

            <View style={styles.readScratch} />

            <Text style={styles.promptSub}>
              Go with your gut.
            </Text>

            <View style={styles.readDeck}>
              {CROWD_READS.map(
                (
                  read,
                  index,
                ) => (
                  <CrowdReadSlip
                    key={read.id}
                    read={read}
                    index={index}
                    reduceMotion={reduceMotion}
                    onPress={() =>
                      handlePrediction(
                        read,
                      )
                    }
                  />
                ),
              )}
            </View>

            <Text style={styles.readHint}>
              PICK THE CLOSEST READ
            </Text>
          </Animated.View>
        )}

        {/* =================================================
            STAGE 2 — PERSONAL VOTE
        ================================================= */}

        {stage ===
          "personalVote" &&
          selectedRead && (
          <Animated.View
            // I make the personal-vote stage fully static when
            // Reduce Motion is on. This is the stage that was
            // disappearing after the player picked a crowd read.
            style={
              reduceMotion
                ? {
                    opacity: 1,
                    transform: [
                      {
                        translateY: 0,
                      },
                    ],
                  }
                : {
                    opacity:
                      stageIn,

                    transform: [
                      {
                        translateY:
                          stageIn.interpolate({
                            inputRange:
                              [0, 1],

                            outputRange:
                              [18, 0],
                          }),
                      },
                    ],
                  }
            }
          >
            <View style={styles.savedRead}>
              <Text style={styles.savedReadLabel}>
                YOUR CROWD READ
              </Text>

              <View style={styles.savedReadRow}>
                <VoteMark
                  type={
                    selectedRead.predictedSide ??
                    "toast"
                  }
                  size="small"
                />

                <Text style={styles.savedReadValue}>
                  {selectedRead.label}
                </Text>
              </View>
            </View>

            <Text style={styles.personalPrompt}>
              NOW WHAT DO
              {"\n"}
              YOU THINK?
            </Text>

            <View style={styles.personalBattle}>
              <PersonalVote
                type="roast"
                reduceMotion={reduceMotion}
                phrase={
                  moment.roastPhrase
                }
                onPress={() =>
                  handlePersonalVote(
                    "roast",
                  )
                }
              />

              <View style={styles.orPuck}>
                <Text style={styles.orText}>
                  OR
                </Text>
              </View>

              <PersonalVote
                type="toast"
                reduceMotion={reduceMotion}
                phrase={
                  moment.toastPhrase
                }
                onPress={() =>
                  handlePersonalVote(
                    "toast",
                  )
                }
              />
            </View>
          </Animated.View>
        )}

        {/* =================================================
            STAGE 3 — RESULT
        ================================================= */}

        {stage ===
          "results" &&
          selectedRead &&
          crowdPrediction &&
          personalVote &&
          progressResult && (
          <Animated.View
            // Results also use a plain visible state with
            // Reduce Motion so every Guess stage follows the
            // same rule.
            style={
              reduceMotion
                ? {
                    opacity: 1,
                  }
                : {
                    opacity:
                      stageIn,
                  }
            }
          >
            <Text style={styles.revealEyebrow}>
              SEE HOW YOU DID
            </Text>

            <Text style={styles.revealHeading}>
              {progressResult.guessedCorrectly
                ? "YOU CALLED IT!"
                : "MISSED THE ROOM."}
            </Text>

            <View style={styles.revealScratch} />

            <CrowdResultBattle
              roastPercentage={
                moment.roastPercentage
              }
              toastPercentage={
                moment.toastPercentage
              }
              reveal={
                resultReveal
              }
            />

            <View style={styles.receiptStrip}>
              <View style={styles.receiptHalf}>
                <Text style={styles.receiptLabel}>
                  YOUR READ
                </Text>

                <Text style={styles.receiptValue}>
                  {selectedRead.label}
                </Text>
              </View>

              <View style={styles.receiptDivider} />

              <View style={styles.receiptHalf}>
                <Text style={styles.receiptLabel}>
                  YOUR VOTE
                </Text>

                <View style={styles.receiptVote}>
                  <VoteMark
                    type={
                      personalVote
                    }
                    size="small"
                  />

                  <Text style={styles.receiptValue}>
                    {personalVote.toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.heatWrap}>
              <HeatStamp
                amount={
                  progressResult.heatEarned
                }
                caption={
                  progressResult.guessedCorrectly
                    ? "YOU KNEW THE ROOM"
                    : "STRONG OPINION"
                }
              />
            </View>

            <View style={styles.topTake}>
              <View
                style={[
                  styles.topTakeStamp,
                  {
                    backgroundColor:
                      categoryTheme.accent,
                  },
                ]}
              >
                <Text style={styles.topTakeStampText}>
                  TOP TAKE
                </Text>
              </View>

              <Text style={styles.topTakeText}>
                “{moment.topComment}”
              </Text>
            </View>

            <PaperButton
              label="KEEP GOING"
              onPress={
                handleContinue
              }
              accentColor={
                Colors.toast
              }
            />
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}

// =====================================================
// Animated Crowd Read Slip
// =====================================================

function CrowdReadSlip({
  read,
  index,
  reduceMotion,
  onPress,
}: {
  read: CrowdRead;
  index: number;
  reduceMotion: boolean;
  onPress: () => void;
}) {
  const entrance =
    useRef(
      new Animated.Value(0),
    ).current;

  const selection =
    useRef(
      new Animated.Value(0),
    ).current;

  useEffect(() => {
    if (reduceMotion) {
      entrance.setValue(1);
      return;
    }

    entrance.setValue(0);

    Animated.spring(
      entrance,
      {
        toValue: 1,
        delay:
          70 +
          index * 70,
        speed: 18,
        bounciness: 6,
        useNativeDriver: true,
      },
    ).start();
  }, [
    entrance,
    index,
    reduceMotion,
  ]);

  const handlePress =
    () => {
      if (reduceMotion) {
        onPress();
        return;
      }

      Animated.sequence([
        Animated.spring(
          selection,
          {
            toValue: 1,
            speed: 25,
            bounciness: 8,
            useNativeDriver: true,
          },
        ),

        Animated.delay(110),
      ]).start(onPress);
    };

  const isRoast =
    read.predictedSide ===
    "roast";

  const isToast =
    read.predictedSide ===
    "toast";

  const isSplit =
    read.id === "split";

  const edgeColor =
    isRoast
      ? Colors.roast
      : isToast
        ? Colors.toast
        : Colors.textPrimary;

  return (
    <Animated.View
      style={[
        styles.slipWrap,

        // I keep the slightly crooked paper position with
        // Reduce Motion, but I stop using animation values
        // to get there.
        reduceMotion
          ? {
              marginLeft:
                read.offset,

              marginRight:
                -read.offset,

              opacity: 1,

              transform: [
                {
                  translateY: 0,
                },
                {
                  rotate:
                    `${read.rotation}deg`,
                },
                {
                  scale: 1,
                },
              ],
            }
          : {
              marginLeft:
                read.offset,

              marginRight:
                -read.offset,

              opacity:
                entrance,

              transform: [
                {
                  translateY:
                    entrance.interpolate({
                      inputRange:
                        [0, 1],

                      outputRange:
                        [34, 0],
                    }),
                },

                {
                  rotate:
                    selection.interpolate({
                      inputRange:
                        [0, 1],

                      outputRange: [
                        `${read.rotation}deg`,
                        "0deg",
                      ],
                    }),
                },

                {
                  scale:
                    Animated.multiply(
                      entrance,
                      selection.interpolate({
                        inputRange:
                          [0, 1],

                        outputRange:
                          [1, 1.055],
                      }),
                    ),
                },
              ],
            },
      ]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${read.label}, ${read.roast} Roast, ${read.toast} Toast`}
        accessibilityHint="Chooses this crowd read and moves to your personal vote."
        onPress={
          handlePress
        }
        style={({ pressed }) => [
          styles.readSlip,
          {
            borderLeftColor:
              edgeColor,
          },
          pressed &&
            styles.pressed,
        ]}
      >
        <View style={styles.slipMark}>
          {isSplit ? (
            <View style={styles.splitMarks}>
              <VoteMark
                type="roast"
                size="small"
              />

              <Text style={styles.splitVs}>
                /
              </Text>

              <VoteMark
                type="toast"
                size="small"
              />
            </View>
          ) : (
            <VoteMark
              type={
                isRoast
                  ? "roast"
                  : "toast"
              }
              size="small"
            />
          )}
        </View>

        <View style={styles.slipCopy}>
          <Text style={styles.slipLabel}>
            {read.label}
          </Text>

          <Text style={styles.slipRatio}>
            {read.roast} / {read.toast}
          </Text>
        </View>

        <View
          style={[
            styles.slipStamp,
            {
              borderColor:
                edgeColor,
            },
          ]}
        >
          <Text
            style={[
              styles.slipStampText,
              {
                color:
                  edgeColor,
              },
            ]}
          >
            PICK
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

// =====================================================
// Personal Vote
// =====================================================

function PersonalVote({
  type,
  phrase,
  reduceMotion,
  onPress,
}: {
  type: PlayerVote;
  phrase: string;
  reduceMotion: boolean;
  onPress: () => void;
}) {
  const isRoast =
    type === "roast";

  const scale =
    useRef(
      new Animated.Value(1),
    ).current;

  const handlePress =
    () => {
      if (reduceMotion) {
        onPress();
        return;
      }

      Animated.sequence([
        Animated.spring(
          scale,
          {
            toValue: 1.06,
            speed: 25,
            bounciness: 7,
            useNativeDriver: true,
          },
        ),

        Animated.spring(
          scale,
          {
            toValue: 0.98,
            speed: 30,
            bounciness: 3,
            useNativeDriver: true,
          },
        ),
      ]).start(onPress);
    };

  return (
    <Animated.View
      style={[
        styles.personalHalf,
        {
          transform: [
            {
              scale,
            },
          ],
        },
      ]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          isRoast
            ? `Vote Roast. ${phrase}`
            : `Vote Toast. ${phrase}`
        }
        accessibilityHint="Records your personal vote and reveals the crowd result."
        onPress={
          handlePress
        }
        style={({ pressed }) => [
          styles.personalPressable,
          pressed &&
            styles.pressed,
        ]}
      >
        <ImageBackground
          source={
            isRoast
              ? require("../../assets/game/vote/roast-block.png")
              : require("../../assets/game/vote/toast-block.png")
          }
          resizeMode="stretch"
          style={styles.personalArt}
        >
          <View style={styles.personalSeal}>
            <VoteMark
              type={type}
              size="medium"
            />
          </View>

          <Text style={styles.personalLabel}>
            {isRoast
              ? "ROAST"
              : "TOAST"}
          </Text>

          <Text
            style={styles.personalPhrase}
            numberOfLines={3}
          >
            {phrase}
          </Text>
        </ImageBackground>
      </Pressable>
    </Animated.View>
  );
}

// =====================================================
// Crowd Reveal
// =====================================================

function CrowdResultBattle({
  roastPercentage,
  toastPercentage,
  reveal,
}: {
  roastPercentage: number;
  toastPercentage: number;
  reveal: Animated.Value;
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

  const visualRoast =
    50 +
    (
      safeRoast -
      50
    ) *
      0.5;

  const visualToast =
    100 -
    visualRoast;

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

    return () => {
      reveal.removeListener(
        listener,
      );
    };
  }, [
    reveal,
    safeRoast,
    safeToast,
  ]);

  return (
    <View
      accessible
      accessibilityLabel={`Crowd result. Roast ${safeRoast} percent. Toast ${safeToast} percent.`}
      style={styles.revealBattle}
    >
      <Animated.View
        style={[
          styles.revealRoast,
          {
            width:
              reveal.interpolate({
                inputRange:
                  [0, 1],

                outputRange: [
                  "50%",
                  `${visualRoast}%`,
                ],
              }),
          },
        ]}
      >
        <VoteMark
          type="roast"
          size="medium"
        />

        <Text style={styles.revealPercent}>
          {shownRoast}%
        </Text>

        <Text style={styles.revealLabel}>
          ROAST
        </Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.revealToast,
          {
            width:
              reveal.interpolate({
                inputRange:
                  [0, 1],

                outputRange: [
                  "50%",
                  `${visualToast}%`,
                ],
              }),
          },
        ]}
      >
        <VoteMark
          type="toast"
          size="medium"
        />

        <Text style={styles.revealPercent}>
          {shownToast}%
        </Text>

        <Text style={styles.revealLabel}>
          TOAST
        </Text>
      </Animated.View>

      <View style={styles.vsPuck}>
        <Text style={styles.vsText}>
          VS
        </Text>
      </View>
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,

      backgroundColor:
        Colors.background,
    },

    scrollContent: {
      flexGrow: 1,

      paddingHorizontal:
        Spacing.lg,

      paddingTop: 14,
      paddingBottom: 42,
    },

    momentPaper: {
      minHeight: 270,

      justifyContent: "center",

      paddingVertical: 31,
      paddingHorizontal: 32,

      marginHorizontal: -4,
      marginBottom: 7,
    },

    question: {
      color:
        Colors.textPrimary,

      fontSize: 26,
      lineHeight: 32,
      fontWeight: "900",
      letterSpacing: -1.2,

      textAlign: "center",
    },

    readHeading: {
      color:
        Colors.textPrimary,

      fontSize: 36,
      lineHeight: 36,
      fontWeight: "900",
      letterSpacing: -1.7,

      textAlign: "center",

      marginTop: 6,
    },

    readScratch: {
      width: 62,
      height: 4,

      alignSelf: "center",

      backgroundColor:
        Colors.toast,

      marginTop: 8,

      transform: [
        {
          rotate: "-4deg",
        },
      ],
    },

    promptSub: {
      color:
        Colors.textMuted,

      fontSize: 10,
      fontWeight: "800",

      textAlign: "center",

      marginTop: 8,
      marginBottom: 17,
    },

    readDeck: {
      gap: 9,

      marginBottom: 15,
    },

    slipWrap: {
      width: "96%",
      alignSelf: "center",
    },

    readSlip: {
      minHeight: 78,

      backgroundColor:
        Colors.background,

      borderTopColor:
        Colors.textPrimary,
      borderRightColor:
        Colors.textPrimary,
      borderBottomColor:
        Colors.textPrimary,

      borderTopWidth: 1.4,
      borderRightWidth: 1.4,
      borderBottomWidth: 1.4,
      borderLeftWidth: 8,

      flexDirection: "row",
      alignItems: "center",

      paddingVertical: 11,
      paddingHorizontal: 13,
    },

    slipMark: {
      width: 52,

      alignItems: "center",
      justifyContent: "center",
    },

    splitMarks: {
      flexDirection: "row",
      alignItems: "center",
    },

    splitVs: {
      color:
        Colors.textPrimary,

      fontSize: 13,
      fontWeight: "900",

      marginHorizontal: -4,
    },

    slipCopy: {
      flex: 1,

      marginLeft: 7,
    },

    slipLabel: {
      color:
        Colors.textPrimary,

      fontSize: 16,
      fontWeight: "900",
      letterSpacing: 0.5,
    },

    slipRatio: {
      color:
        Colors.textMuted,

      fontSize: 8,
      fontWeight: "900",
      letterSpacing: 1.2,

      marginTop: 3,
    },

    slipStamp: {
      borderWidth: 1.3,

      paddingVertical: 5,
      paddingHorizontal: 8,

      transform: [
        {
          rotate: "-4deg",
        },
      ],
    },

    slipStampText: {
      fontSize: 7,
      fontWeight: "900",
      letterSpacing: 1.1,
    },

    readHint: {
      color:
        Colors.textMuted,

      fontSize: 7.5,
      fontWeight: "900",
      letterSpacing: 1.5,

      textAlign: "center",

      marginBottom: 8,
    },

    savedRead: {
      borderTopColor:
        Colors.textPrimary,
      borderBottomColor:
        Colors.textPrimary,

      borderTopWidth: 1.2,
      borderBottomWidth: 1.2,

      paddingVertical: 13,

      marginBottom: 19,
    },

    savedReadLabel: {
      color:
        Colors.textMuted,

      fontSize: 8,
      fontWeight: "900",
      letterSpacing: 1.3,
    },

    savedReadRow: {
      flexDirection: "row",
      alignItems: "center",

      marginTop: 5,
    },

    savedReadValue: {
      color:
        Colors.textPrimary,

      fontSize: 17,
      fontWeight: "900",

      marginLeft: 8,
    },

    personalPrompt: {
      color:
        Colors.textPrimary,

      fontSize: 30,
      lineHeight: 32,
      fontWeight: "900",
      letterSpacing: -1.2,

      marginBottom: 12,
    },

    personalBattle: {
      position: "relative",

      height: 285,

      flexDirection: "row",

      marginHorizontal: -11,
      marginBottom: 20,
    },

    personalHalf: {
      flex: 1,
    },

    personalPressable: {
      flex: 1,
    },

    personalArt: {
      flex: 1,

      alignItems: "center",
      justifyContent: "center",

      paddingHorizontal: 13,
    },

    personalSeal: {
      width: 66,
      height: 66,

      borderRadius: 33,

      backgroundColor:
        "rgba(255,247,239,0.92)",

      alignItems: "center",
      justifyContent: "center",
    },

    personalLabel: {
      color:
        Colors.textPrimary,

      fontSize: 27,
      fontWeight: "900",
      letterSpacing: -0.6,

      marginTop: 8,
    },

    personalPhrase: {
      color:
        Colors.textPrimary,

      fontSize: 11,
      lineHeight: 15,
      fontWeight: "700",

      textAlign: "center",

      marginTop: 5,
    },

    orPuck: {
      position: "absolute",

      left: "50%",
      top: "50%",

      width: 50,
      height: 50,

      marginLeft: -25,
      marginTop: -25,

      borderRadius: 25,

      backgroundColor:
        Colors.textPrimary,

      borderColor:
        Colors.background,
      borderWidth: 4,

      alignItems: "center",
      justifyContent: "center",

      zIndex: 10,
    },

    orText: {
      color:
        Colors.white,

      fontSize: 8,
      fontWeight: "900",
      letterSpacing: 1,
    },

    revealEyebrow: {
      color:
        Colors.textMuted,

      fontSize: 8,
      fontWeight: "900",
      letterSpacing: 1.5,

      textAlign: "center",

      marginTop: 4,
    },

    revealHeading: {
      color:
        Colors.textPrimary,

      fontSize: 34,
      lineHeight: 37,
      fontWeight: "900",
      letterSpacing: -1.5,

      textAlign: "center",

      marginTop: 4,
    },

    revealScratch: {
      width: 62,
      height: 4,

      alignSelf: "center",

      backgroundColor:
        Colors.toast,

      marginTop: 8,
      marginBottom: 14,

      transform: [
        {
          rotate: "-4deg",
        },
      ],
    },

    revealBattle: {
      position: "relative",

      height: 220,

      flexDirection: "row",

      marginHorizontal: -11,
      marginBottom: 14,

      overflow: "hidden",
    },

    revealRoast: {
      height: "100%",

      backgroundColor:
        Colors.roast,

      alignItems: "center",
      justifyContent: "center",

      paddingHorizontal: 7,
    },

    revealToast: {
      height: "100%",

      backgroundColor:
        Colors.toast,

      alignItems: "center",
      justifyContent: "center",

      paddingHorizontal: 7,
    },

    revealPercent: {
      color:
        Colors.white,

      fontSize: 42,
      lineHeight: 46,
      fontWeight: "900",
      letterSpacing: -1.5,

      marginTop: 6,
    },

    revealLabel: {
      color:
        Colors.white,

      fontSize: 9,
      fontWeight: "900",
      letterSpacing: 1.5,
    },

    vsPuck: {
      position: "absolute",

      left: "50%",
      top: "50%",

      width: 52,
      height: 52,

      marginLeft: -26,
      marginTop: -26,

      borderRadius: 26,

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

      fontSize: 8,
      fontWeight: "900",
      letterSpacing: 0.9,
    },

    receiptStrip: {
      flexDirection: "row",

      borderTopColor:
        Colors.borderStrong,
      borderBottomColor:
        Colors.borderStrong,

      borderTopWidth: 1,
      borderBottomWidth: 1,

      paddingVertical: 13,

      marginBottom: 17,
    },

    receiptHalf: {
      flex: 1,

      paddingHorizontal: 10,
    },

    receiptDivider: {
      width: 1,

      backgroundColor:
        Colors.borderStrong,
    },

    receiptLabel: {
      color:
        Colors.textMuted,

      fontSize: 7.5,
      fontWeight: "900",
      letterSpacing: 1.2,
    },

    receiptValue: {
      color:
        Colors.textPrimary,

      fontSize: 12,
      fontWeight: "900",

      marginTop: 5,
    },

    receiptVote: {
      flexDirection: "row",
      alignItems: "center",
    },

    heatWrap: {
      marginBottom: 18,
    },

    topTake: {
      marginBottom: 19,
    },

    topTakeStamp: {
      alignSelf: "flex-start",

      paddingVertical: 5,
      paddingHorizontal: 11,

      marginBottom: 11,

      transform: [
        {
          rotate: "-2deg",
        },
      ],
    },

    topTakeStampText: {
      color:
        Colors.white,

      fontSize: 8,
      fontWeight: "900",
      letterSpacing: 1.3,
    },

    topTakeText: {
      color:
        Colors.textPrimary,

      fontSize: 17,
      lineHeight: 24,
      fontWeight: "500",
    },

    pressed: {
      opacity: 0.72,
    },
  });
