// =====================================================
// File: VoteButtons.tsx
//
// Purpose:
// Displays the main Roast and Toast voting choices.
//
// Version 1.1 moves away from two generic white cards
// and makes Roast and Toast feel like two opposing
// sides of the game.
//
// Roast:
// • Coral panel
// • Charred R mark
//
// Toast:
// • Teal panel
// • Clinking-glasses mark
//
// The flame is no longer used for Roast. It is reserved
// for Heat and progression.
//
// Project: Roast or Toast
// =====================================================

import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  Colors,
  Radius,
} from "../theme";

import VoteMark from "./VoteMark";

// A vote can be Roast, Toast, or not selected yet.
export type VoteChoice =
  | "roast"
  | "toast"
  | null;

type VoteButtonsProps = {
  roastPhrase: string;
  toastPhrase: string;
  roastScale: Animated.Value;
  toastScale: Animated.Value;
  onRoastPress: () => void;
  onToastPress: () => void;
};

export default function VoteButtons({
  roastPhrase,
  toastPhrase,
  roastScale,
  toastScale,
  onRoastPress,
  onToastPress,
}: VoteButtonsProps) {
  return (
    <View>
      {/* Short prompt that leads into the vote */}
      <Text style={styles.votePrompt}>
        Pick a side.
      </Text>

      <View style={styles.buttonContainer}>
        {/* =================================================
            Roast
        ================================================= */}

        <Animated.View
          style={[
            styles.animatedButton,
            {
              transform: [
                {
                  scale:
                    roastScale,
                },
                {
                  rotate:
                    "-1deg",
                },
              ],
            },
          ]}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Vote Roast"
            onPress={onRoastPress}
            style={({ pressed }) => [
              styles.votePanel,
              styles.roastPanel,

              pressed &&
                styles.roastPressed,
            ]}
          >
            {/* Decorative stamped text */}
            <Text
              style={
                styles.roastBackdrop
              }
            >
              ROAST
            </Text>

            <View
              style={
                styles.panelContent
              }
            >
              <VoteMark
                type="roast"
                size="large"
              />

              <View
                style={
                  styles.voteTextContainer
                }
              >
                <Text
                  style={[
                    styles.voteLabel,
                    styles.roastLabel,
                  ]}
                >
                  ROAST
                </Text>

                <Text
                  style={[
                    styles.votePhrase,
                    styles.roastPhrase,
                  ]}
                >
                  {roastPhrase}
                </Text>
              </View>

              <Text
                style={[
                  styles.arrow,
                  styles.roastArrow,
                ]}
              >
                →
              </Text>
            </View>
          </Pressable>
        </Animated.View>

        {/* =================================================
            Divider
        ================================================= */}

        <View
          style={
            styles.orDivider
          }
        >
          <View
            style={
              styles.dividerLine
            }
          />

          <Text
            style={
              styles.orText
            }
          >
            OR
          </Text>

          <View
            style={
              styles.dividerLine
            }
          />
        </View>

        {/* =================================================
            Toast
        ================================================= */}

        <Animated.View
          style={[
            styles.animatedButton,
            {
              transform: [
                {
                  scale:
                    toastScale,
                },
                {
                  rotate:
                    "1deg",
                },
              ],
            },
          ]}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Vote Toast"
            onPress={onToastPress}
            style={({ pressed }) => [
              styles.votePanel,
              styles.toastPanel,

              pressed &&
                styles.toastPressed,
            ]}
          >
            {/* Decorative stamped text */}
            <Text
              style={
                styles.toastBackdrop
              }
            >
              TOAST
            </Text>

            <View
              style={
                styles.panelContent
              }
            >
              <VoteMark
                type="toast"
                size="large"
              />

              <View
                style={
                  styles.voteTextContainer
                }
              >
                <Text
                  style={[
                    styles.voteLabel,
                    styles.toastLabel,
                  ]}
                >
                  TOAST
                </Text>

                <Text
                  style={[
                    styles.votePhrase,
                    styles.toastPhrase,
                  ]}
                >
                  {toastPhrase}
                </Text>
              </View>

              <Text
                style={[
                  styles.arrow,
                  styles.toastArrow,
                ]}
              >
                →
              </Text>
            </View>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}

// =====================================================
// Styles
// =====================================================

const styles =
  StyleSheet.create({
    votePrompt: {
      color:
        Colors.textPrimary,
      fontSize: 19,
      fontWeight: "900",
      letterSpacing: -0.3,
      marginBottom: 16,
    },

    buttonContainer: {
      gap: 10,
    },

    animatedButton: {
      width: "100%",
    },

    votePanel: {
      minHeight: 126,

      borderRadius:
        Radius.xl,

      paddingVertical: 19,
      paddingHorizontal: 19,

      justifyContent:
        "center",

      overflow: "hidden",

      shadowColor:
        Colors.black,

      shadowOffset: {
        width: 0,
        height: 8,
      },

      shadowOpacity: 0.1,
      shadowRadius: 18,

      elevation: 4,
    },

    roastPanel: {
      backgroundColor:
        Colors.roastSoft,

      borderColor:
        Colors.roast,

      borderWidth: 2,
    },

    toastPanel: {
      backgroundColor:
        Colors.toastSoft,

      borderColor:
        Colors.toast,

      borderWidth: 2,
    },

    roastPressed: {
      backgroundColor:
        Colors.roast,

      transform: [
        {
          scale: 0.985,
        },
      ],
    },

    toastPressed: {
      backgroundColor:
        Colors.toast,

      transform: [
        {
          scale: 0.985,
        },
      ],
    },

    panelContent: {
      flexDirection: "row",
      alignItems: "center",
      zIndex: 2,
    },

    voteTextContainer: {
      flex: 1,
      marginLeft: 18,
      marginRight: 10,
    },

    voteLabel: {
      fontSize: 27,
      fontWeight: "900",
      letterSpacing: 1.6,
    },

    roastLabel: {
      color:
        Colors.roastDark,
    },

    toastLabel: {
      color:
        Colors.toastDark,
    },

    votePhrase: {
      fontSize: 14,
      fontWeight: "700",
      lineHeight: 19,
      marginTop: 3,
    },

    roastPhrase: {
      color:
        Colors.roastDark,
    },

    toastPhrase: {
      color:
        Colors.toastDark,
    },

    arrow: {
      fontSize: 25,
      fontWeight: "900",
    },

    roastArrow: {
      color:
        Colors.roastDark,
    },

    toastArrow: {
      color:
        Colors.toastDark,
    },

    // Large faded words add personality without
    // competing with the main button content.
    roastBackdrop: {
      position: "absolute",
      right: -8,
      bottom: -22,

      color:
        Colors.roast,

      fontSize: 67,
      fontWeight: "900",
      letterSpacing: -3,

      opacity: 0.08,

      transform: [
        {
          rotate: "5deg",
        },
      ],
    },

    toastBackdrop: {
      position: "absolute",
      right: -5,
      bottom: -21,

      color:
        Colors.toast,

      fontSize: 64,
      fontWeight: "900",
      letterSpacing: -3,

      opacity: 0.09,

      transform: [
        {
          rotate: "-4deg",
        },
      ],
    },

    // Small OR divider keeps both sides connected
    // without bringing back another card.
    orDivider: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,

      paddingHorizontal: 14,
    },

    dividerLine: {
      flex: 1,
      height: 1,

      backgroundColor:
        Colors.borderStrong,
    },

    orText: {
      color:
        Colors.textMuted,

      fontSize: 10,
      fontWeight: "900",
      letterSpacing: 1.6,
    },
  });