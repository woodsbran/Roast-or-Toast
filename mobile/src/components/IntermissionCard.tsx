// =====================================================
// File: IntermissionCard.tsx
//
// Purpose:
// Shows the v1.1 break content.
//
// Version 1.1 — Design + Motion Pass 1
//
// I am NOT changing the intermission content pool or the
// rotation logic in this pass.
//
// I am adding motion that matches the meaning of each break:
//
// • Mini Challenge = card drops / stamps in
// • Food for Thought = slow editorial reveal
// • Quick Reset = breathing pulse
// • Affirmation = warm paper note rises in
// • This or That = coral / teal sides slide toward each other
// • Random Receipt = receipt "prints" up onto the screen
//
// The goal is not constant movement.
// Each type gets one memorable entrance.
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
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  Colors,
  Spacing,
} from "../theme";

import useReducedMotion from "../hooks/useReducedMotion";

import type {
  IntermissionItem,
} from "../game/intermissionContent";

import {
  pickNextIntermission,
} from "../game/intermissionStorage";

import InkUnderline from "./InkUnderline";
import PaperButton from "./PaperButton";
import StampLabel from "./StampLabel";

type IntermissionCardProps = {
  completedMoments: number;
  onContinue: () => void;
  onHomePress: () => void;
};

export default function IntermissionCard({
  completedMoments,
  onContinue,
  onHomePress,
}: IntermissionCardProps) {
  const reduceMotion =
    useReducedMotion();

  const [
    item,
    setItem,
  ] =
    useState<IntermissionItem | null>(
      null,
    );

  const entrance =
    useRef(
      new Animated.Value(0),
    ).current;

  const breath =
    useRef(
      new Animated.Value(0),
    ).current;

  useEffect(() => {
    let active = true;

    const loadBreak =
      async () => {
        const next =
          await pickNextIntermission();

        if (active) {
          setItem(next);
        }
      };

    void loadBreak();

    return () => {
      active = false;
    };
  }, [
    completedMoments,
  ]);

  useEffect(() => {
    if (!item) {
      return;
    }

    // Reduce Motion keeps the same break design, but I skip
    // the card drop, slide, receipt print, and breathing loop.
    if (reduceMotion) {
      entrance.setValue(1);
      breath.stopAnimation();
      breath.setValue(0.5);

      return;
    }

    entrance.setValue(0);

    Animated.spring(
      entrance,
      {
        toValue: 1,
        speed: 18,
        bounciness:
          item.kind ===
          "miniChallenge"
            ? 8
            : 4,

        useNativeDriver: true,
      },
    ).start();

    if (
      item.kind !==
      "quickReset"
    ) {
      breath.stopAnimation();
      breath.setValue(0);
      return;
    }

    breath.setValue(0);

    const loop =
      Animated.loop(
        Animated.sequence([
          Animated.timing(
            breath,
            {
              toValue: 1,
              duration: 1800,
              easing:
                Easing.inOut(
                  Easing.sin,
                ),
              useNativeDriver: true,
            },
          ),

          Animated.timing(
            breath,
            {
              toValue: 0,
              duration: 1800,
              easing:
                Easing.inOut(
                  Easing.sin,
                ),
              useNativeDriver: true,
            },
          ),
        ]),
      );

    loop.start();

    return () => {
      loop.stop();
    };
  }, [
    breath,
    entrance,
    item,
    reduceMotion,
  ]);

  if (!item) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>
          Switching it up...
        </Text>
      </View>
    );
  }

  const accent =
    item.accent === "roast"
      ? Colors.roast
      : item.accent === "toast"
        ? Colors.toast
        : item.accent === "heat"
          ? Colors.heat
          : Colors.textPrimary;

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Return Home"
          accessibilityHint="Leaves the current round and returns to Home."
          onPress={
            onHomePress
          }
          style={({ pressed }) => [
            styles.homeButton,
            pressed &&
              styles.pressed,
          ]}
        >
          <Text style={styles.homeText}>
            HOME
          </Text>
        </Pressable>

        <Text style={styles.breakLabel}>
          QUICK BREAK
        </Text>
      </View>

      {item.kind ===
        "miniChallenge" && (
        <Animated.View
          accessible
          accessibilityLabel={`${item.stamp}. ${item.heading}. ${item.body ?? ""} ${item.footer ?? ""}`}
          style={[
            styles.flexStage,
            {
              opacity:
                entrance,

              transform: [
                {
                  translateY:
                    entrance.interpolate({
                      inputRange:
                        [0, 1],

                      outputRange:
                        [-48, 0],
                    }),
                },

                {
                  rotate:
                    entrance.interpolate({
                      inputRange:
                        [0, 1],

                      outputRange:
                        ["-6deg", "-1deg"],
                    }),
                },

                {
                  scale:
                    entrance.interpolate({
                      inputRange:
                        [0, 1],

                      outputRange:
                        [1.12, 1],
                    }),
                },
              ],
            },
          ]}
        >
          <ImageBackground
            source={require("../../assets/game/paper/paper-plain.png")}
            resizeMode="stretch"
            style={styles.challengePaper}
          >
            <StampLabel
              text={
                item.stamp
              }
              color={
                accent
              }
              rotate={-2}
              size="medium"
            />

            <View style={styles.challengeNumber}>
              <Text style={styles.challengeNumberText}>
                01
              </Text>
            </View>

            <Text style={styles.challengeHeading}>
              {item.heading}
            </Text>

            <InkUnderline
              color={
                accent
              }
              width={72}
              rotate={-4}
            />

            {item.body && (
              <Text style={styles.challengeBody}>
                {item.body}
              </Text>
            )}

            {item.footer && (
              <View style={styles.challengeFooter}>
                <Text style={styles.challengeFooterText}>
                  {item.footer}
                </Text>
              </View>
            )}
          </ImageBackground>
        </Animated.View>
      )}

      {item.kind ===
        "foodForThought" && (
        <Animated.View
          accessible
          accessibilityLabel={`${item.stamp}. ${item.heading}. ${item.footer ?? ""}`}
          style={[
            styles.thoughtStage,
            {
              opacity:
                entrance,

              transform: [
                {
                  translateY:
                    entrance.interpolate({
                      inputRange:
                        [0, 1],

                      outputRange:
                        [28, 0],
                    }),
                },
              ],
            },
          ]}
        >
          <StampLabel
            text={item.stamp}
            color={accent}
            rotate={-2}
            size="medium"
          />

          <Text style={styles.thoughtQuote}>
            “
          </Text>

          <Text style={styles.thoughtHeading}>
            {item.heading}
          </Text>

          <InkUnderline
            color={accent}
            width={88}
            rotate={-3}
          />

          {item.footer && (
            <Text style={styles.thoughtFooter}>
              {item.footer}
            </Text>
          )}
        </Animated.View>
      )}

      {item.kind ===
        "quickReset" && (
        <Animated.View
          accessible
          accessibilityLabel={`${item.stamp}. ${item.heading}. ${item.body ?? ""} ${item.footer ?? ""}`}
          style={[
            styles.resetStage,
            {
              opacity:
                entrance,
            },
          ]}
        >
          <StampLabel
            text={item.stamp}
            color={accent}
            rotate={-2}
            size="medium"
          />

          <Text style={styles.resetHeading}>
            {item.heading}
          </Text>

          {item.body && (
            <Text style={styles.resetBody}>
              {item.body}
            </Text>
          )}

          <Animated.View
            style={[
              styles.breathCircle,
              {
                borderColor:
                  accent,

                opacity:
                  breath.interpolate({
                    inputRange:
                      [0, 1],

                    outputRange:
                      [0.35, 0.9],
                  }),

                transform: [
                  {
                    scale:
                      breath.interpolate({
                        inputRange:
                          [0, 1],

                        outputRange:
                          [0.82, 1.2],
                      }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.breathText}>
              BREATHE
            </Text>
          </Animated.View>

          {item.footer && (
            <Text style={styles.resetFooter}>
              {item.footer}
            </Text>
          )}
        </Animated.View>
      )}

      {item.kind ===
        "affirmation" && (
        <Animated.View
          accessible
          accessibilityLabel={`${item.stamp}. ${item.heading}. ${item.footer ?? ""}`}
          style={[
            styles.flexStage,
            {
              opacity:
                entrance,

              transform: [
                {
                  translateY:
                    entrance.interpolate({
                      inputRange:
                        [0, 1],

                      outputRange:
                        [42, 0],
                    }),
                },

                {
                  rotate:
                    entrance.interpolate({
                      inputRange:
                        [0, 1],

                      outputRange:
                        ["2deg", "-0.5deg"],
                    }),
                },
              ],
            },
          ]}
        >
          <ImageBackground
            source={require("../../assets/game/paper/paper-plain.png")}
            resizeMode="stretch"
            style={styles.affirmationPaper}
          >
            <StampLabel
              text={item.stamp}
              color={accent}
              rotate={-2}
              size="medium"
            />

            <Text style={styles.affirmationHeading}>
              {item.heading}
            </Text>

            <InkUnderline
              color={accent}
              width={72}
              rotate={-5}
            />

            {item.footer && (
              <Text style={styles.affirmationFooter}>
                {item.footer}
              </Text>
            )}
          </ImageBackground>
        </Animated.View>
      )}

      {item.kind ===
        "thisOrThat" && (
        <View
          accessible
          accessibilityLabel={`${item.stamp}. ${item.heading} or ${item.footer}.`}
          style={styles.thisOrThatStage}
        >
          <StampLabel
            text={item.stamp}
            color={accent}
            rotate={-2}
            size="medium"
          />

          <Animated.View
            style={[
              styles.thisOrThatTop,
              {
                transform: [
                  {
                    translateX:
                      entrance.interpolate({
                        inputRange:
                          [0, 1],

                        outputRange:
                          [-260, 0],
                      }),
                  },

                  {
                    rotate:
                      "-1deg",
                  },
                ],
              },
            ]}
          >
            <Text style={styles.thisOrThatLeft}>
              {item.heading}
            </Text>
          </Animated.View>

          <Animated.Text
            style={[
              styles.orWord,
              {
                opacity:
                  entrance,
              },
            ]}
          >
            {item.body ??
              "or"}
          </Animated.Text>

          <Animated.View
            style={[
              styles.thisOrThatBottom,
              {
                transform: [
                  {
                    translateX:
                      entrance.interpolate({
                        inputRange:
                          [0, 1],

                        outputRange:
                          [260, 0],
                      }),
                  },

                  {
                    rotate:
                      "1deg",
                  },
                ],
              },
            ]}
          >
            <Text style={styles.thisOrThatRight}>
              {item.footer}
            </Text>
          </Animated.View>
        </View>
      )}

      {item.kind ===
        "randomReceipt" && (
        <Animated.View
          accessible
          accessibilityLabel={`${item.stamp}. ${item.heading}. ${item.body ?? ""} ${item.footer ?? ""}`}
          style={[
            styles.receiptStage,
            {
              opacity:
                entrance,

              transform: [
                {
                  translateY:
                    entrance.interpolate({
                      inputRange:
                        [0, 1],

                      outputRange:
                        [160, 0],
                    }),
                },
              ],
            },
          ]}
        >
          <StampLabel
            text={item.stamp}
            color={accent}
            rotate={-3}
            size="medium"
          />

          <View style={styles.receiptRule} />

          <Text style={styles.receiptHeading}>
            {item.heading}
          </Text>

          {item.body && (
            <Text style={styles.receiptBody}>
              {item.body}
            </Text>
          )}

          <View style={styles.receiptRule} />

          {item.footer && (
            <Text style={styles.receiptFooter}>
              {item.footer}
            </Text>
          )}
        </Animated.View>
      )}

      <PaperButton
        label="BACK TO IT"
        onPress={onContinue}
        accentColor={accent}
      />
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,

      backgroundColor:
        Colors.background,

      paddingHorizontal:
        Spacing.lg,

      paddingTop: 56,
      paddingBottom: 34,
    },

    loading: {
      flex: 1,

      backgroundColor:
        Colors.background,

      alignItems: "center",
      justifyContent: "center",
    },

    loadingText: {
      color:
        Colors.textPrimary,

      fontSize: 14,
      fontWeight: "900",
    },

    topRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",

      marginBottom: 12,
    },

    homeButton: {
      borderColor:
        Colors.textPrimary,
      borderWidth: 1,

      paddingVertical: 8,
      paddingHorizontal: 11,
    },

    homeText: {
      color:
        Colors.textPrimary,

      fontSize: 8,
      fontWeight: "900",
      letterSpacing: 1.1,
    },

    breakLabel: {
      color:
        Colors.textMuted,

      fontSize: 9,
      fontWeight: "900",
      letterSpacing: 1.5,
    },

    flexStage: {
      flex: 1,
    },

    challengePaper: {
      flex: 1,

      minHeight: 500,

      paddingVertical: 50,
      paddingHorizontal: 36,

      justifyContent: "center",

      marginVertical: 10,
    },

    challengeNumber: {
      position: "absolute",

      top: 94,
      right: 29,

      width: 46,
      height: 46,

      borderColor:
        Colors.textPrimary,
      borderWidth: 1.5,

      alignItems: "center",
      justifyContent: "center",

      transform: [
        {
          rotate: "4deg",
        },
      ],
    },

    challengeNumberText: {
      color:
        Colors.textPrimary,

      fontSize: 14,
      fontWeight: "900",
    },

    challengeHeading: {
      color:
        Colors.textPrimary,

      fontSize: 35,
      lineHeight: 39,
      fontWeight: "900",
      letterSpacing: -1.5,

      marginTop: 36,
    },

    challengeBody: {
      color:
        Colors.textSecondary,

      fontSize: 15,
      lineHeight: 22,
      fontWeight: "700",

      marginTop: 25,
    },

    challengeFooter: {
      borderTopColor:
        Colors.textPrimary,
      borderBottomColor:
        Colors.textPrimary,

      borderTopWidth: 1.4,
      borderBottomWidth: 1.4,

      paddingVertical: 14,

      marginTop: 28,
    },

    challengeFooterText: {
      color:
        Colors.textPrimary,

      fontSize: 11,
      lineHeight: 16,
      fontWeight: "800",
    },

    thoughtStage: {
      flex: 1,

      justifyContent: "center",

      paddingHorizontal: 23,
    },

    thoughtQuote: {
      color:
        Colors.roast,

      fontSize: 72,
      lineHeight: 60,
      fontWeight: "900",

      marginTop: 27,
    },

    thoughtHeading: {
      color:
        Colors.textPrimary,

      fontSize: 33,
      lineHeight: 39,
      fontWeight: "900",
      letterSpacing: -1.4,
    },

    thoughtFooter: {
      color:
        Colors.textSecondary,

      fontSize: 11,
      lineHeight: 17,
      fontWeight: "700",

      marginTop: 24,
    },

    resetStage: {
      flex: 1,

      justifyContent: "center",

      paddingHorizontal: 23,
    },

    resetHeading: {
      color:
        Colors.textPrimary,

      fontSize: 39,
      lineHeight: 43,
      fontWeight: "900",
      letterSpacing: -1.8,

      marginTop: 38,
    },

    resetBody: {
      color:
        Colors.textSecondary,

      fontSize: 19,
      lineHeight: 26,
      fontWeight: "700",

      marginTop: 13,
    },

    breathCircle: {
      width: 112,
      height: 112,

      borderRadius: 56,

      borderWidth: 2,

      alignSelf: "center",

      alignItems: "center",
      justifyContent: "center",

      marginVertical: 45,
    },

    breathText: {
      color:
        Colors.textMuted,

      fontSize: 8,
      fontWeight: "900",
      letterSpacing: 1.6,
    },

    resetFooter: {
      color:
        Colors.textMuted,

      fontSize: 11,
      lineHeight: 17,
      fontWeight: "700",

      textAlign: "center",
    },

    affirmationPaper: {
      flex: 1,

      minHeight: 500,

      justifyContent: "center",

      paddingVertical: 52,
      paddingHorizontal: 38,

      marginVertical: 10,
    },

    affirmationHeading: {
      color:
        Colors.textPrimary,

      fontSize: 34,
      lineHeight: 40,
      fontWeight: "900",
      letterSpacing: -1.4,

      marginTop: 29,
    },

    affirmationFooter: {
      color:
        Colors.textSecondary,

      fontSize: 16,
      lineHeight: 23,
      fontWeight: "700",

      marginTop: 24,
    },

    thisOrThatStage: {
      flex: 1,

      justifyContent: "center",

      overflow: "hidden",
    },

    thisOrThatTop: {
      minHeight: 170,

      backgroundColor:
        Colors.roast,

      borderColor:
        Colors.textPrimary,
      borderWidth: 1.2,

      alignItems: "center",
      justifyContent: "center",

      marginTop: 30,
    },

    thisOrThatBottom: {
      minHeight: 170,

      backgroundColor:
        Colors.toast,

      borderColor:
        Colors.textPrimary,
      borderWidth: 1.2,

      alignItems: "center",
      justifyContent: "center",
    },

    thisOrThatLeft: {
      color:
        Colors.white,

      fontSize: 36,
      fontWeight: "900",
      letterSpacing: -1.3,

      textAlign: "center",
    },

    thisOrThatRight: {
      color:
        Colors.white,

      fontSize: 36,
      fontWeight: "900",
      letterSpacing: -1.3,

      textAlign: "center",
    },

    orWord: {
      color:
        Colors.textPrimary,

      fontSize: 14,
      fontWeight: "900",
      letterSpacing: 1.4,

      textAlign: "center",

      marginVertical: 8,
    },

    receiptStage: {
      flex: 1,

      justifyContent: "center",

      paddingHorizontal: 22,
    },

    receiptRule: {
      height: 1.5,

      backgroundColor:
        Colors.textPrimary,

      marginVertical: 24,

      transform: [
        {
          rotate: "-0.7deg",
        },
      ],
    },

    receiptHeading: {
      color:
        Colors.textPrimary,

      fontSize: 31,
      lineHeight: 37,
      fontWeight: "900",
      letterSpacing: -1.2,
    },

    receiptBody: {
      color:
        Colors.textSecondary,

      fontSize: 18,
      lineHeight: 24,
      fontWeight: "700",

      marginTop: 14,
    },

    receiptFooter: {
      color:
        Colors.textMuted,

      fontSize: 11,
      lineHeight: 17,
      fontWeight: "700",
    },

    pressed: {
      opacity: 0.72,
    },
  });
