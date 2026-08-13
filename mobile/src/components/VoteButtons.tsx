// =====================================================
// File: VoteButtons.tsx
//
// Purpose:
// Displays the Roast / Toast choices.
//
// Version 1.1 — Composition C3
//
// I am fixing the part that still felt squeezed in C2.
//
// What I am changing:
// • Roast and Toast are much taller
// • The symbols sit deeper in the middle of each choice
// • The label sits directly under the symbol
// • The phrase gets its own readable area underneath
// • I am removing the chopped brush-image footer
// • The footer is now a clean black game strip that I know
//   will actually stay visible on every phone
//
// I am keeping the same tap logic and vote animation.
//
// Project: Roast or Toast
// =====================================================

import {
  Animated,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  Colors,
} from "../theme";

import VoteMark from "./VoteMark";

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
    <View style={styles.container}>
      {/* I keep Pick a Side connected to the Moment instead
          of letting it float far above the choices. */}
      <View style={styles.pickStamp}>
        <Text style={styles.pickStampText}>
          PICK A SIDE
        </Text>
      </View>

      {/* =================================================
          Tall Vote Pieces

          These are intentionally longer now. The symbol,
          label, and phrase each get their own space instead
          of being compressed into one small block.
      ================================================= */}

      <View style={styles.voteRow}>
        <Animated.View
          style={[
            styles.choiceWrapper,
            styles.roastWrapper,
            {
              transform: [
                {
                  scale:
                    roastScale,
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
              styles.choicePressable,
              pressed &&
                styles.pressed,
            ]}
          >
            <ImageBackground
              source={require("../../assets/game/vote/roast-block.png")}
              resizeMode="stretch"
              style={styles.choiceArt}
            >
              <View style={styles.choiceContent}>
                {/* I place the symbol around the middle of the
                    card instead of crowding it at the top. */}
                <View style={styles.seal}>
                  <VoteMark
                    type="roast"
                    size="medium"
                  />
                </View>

                <Text style={styles.choiceLabel}>
                  ROAST
                </Text>

                <Text
                  style={styles.choicePhrase}
                  numberOfLines={3}
                  adjustsFontSizeToFit
                  minimumFontScale={0.82}
                >
                  {roastPhrase}
                </Text>
              </View>
            </ImageBackground>
          </Pressable>
        </Animated.View>

        <Animated.View
          style={[
            styles.choiceWrapper,
            styles.toastWrapper,
            {
              transform: [
                {
                  scale:
                    toastScale,
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
              styles.choicePressable,
              pressed &&
                styles.pressed,
            ]}
          >
            <ImageBackground
              source={require("../../assets/game/vote/toast-block.png")}
              resizeMode="stretch"
              style={styles.choiceArt}
            >
              <View style={styles.choiceContent}>
                <View style={styles.seal}>
                  <VoteMark
                    type="toast"
                    size="medium"
                  />
                </View>

                <Text style={styles.choiceLabel}>
                  TOAST
                </Text>

                <Text
                  style={styles.choicePhrase}
                  numberOfLines={3}
                  adjustsFontSizeToFit
                  minimumFontScale={0.82}
                >
                  {toastPhrase}
                </Text>
              </View>
            </ImageBackground>
          </Pressable>
        </Animated.View>

        {/* OR stays centered between the two choices but I
            keep it small enough that it does not cover copy. */}
        <View style={styles.orPuck}>
          <Text style={styles.orText}>
            OR
          </Text>
        </View>
      </View>

      {/* =================================================
          Bottom Game Strip

          I am deliberately not using the brush PNG here.
          The asset was getting chopped and made the wording
          look broken. This solid strip is still bold and
          graphic, but the label is guaranteed to be readable.
      ================================================= */}

      <View style={styles.footerStrip}>
        <Text style={styles.footerStripText}>
          TAP YOUR CHOICE
        </Text>
      </View>
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      width: "100%",

      marginTop: -19,

      zIndex: 5,
    },

    pickStamp: {
      alignSelf: "center",

      backgroundColor:
        Colors.toast,

      paddingVertical: 5,
      paddingHorizontal: 14,

      marginBottom: -7,

      transform: [
        {
          rotate: "-2deg",
        },
      ],

      zIndex: 12,
    },

    pickStampText: {
      color:
        Colors.textPrimary,

      fontSize: 8,
      fontWeight: "900",

      letterSpacing: 1.35,
    },

    voteRow: {
      position: "relative",

      flexDirection: "row",

      height: 250,

      marginHorizontal: -9,
    },

    choiceWrapper: {
      flex: 1,

      height: "100%",
    },

    // The block assets have torn outside edges but are fuller
    // through the middle, which gives me more usable room for
    // the symbols and phrases than the wedge assets did.
    roastWrapper: {
      marginRight: -2,
    },

    toastWrapper: {
      marginLeft: -2,
    },

    choicePressable: {
      flex: 1,
    },

    choiceArt: {
      flex: 1,

      alignItems: "center",
      justifyContent: "center",

      paddingHorizontal: 14,
    },

    choiceContent: {
      width: "100%",

      alignItems: "center",
      justifyContent: "center",

      paddingTop: 28,
      paddingBottom: 26,
    },

    seal: {
      width: 62,
      height: 62,

      borderRadius: 31,

      backgroundColor:
        "rgba(255,247,239,0.90)",

      borderColor:
        Colors.textPrimary,
      borderWidth: 1.3,

      alignItems: "center",
      justifyContent: "center",

      marginBottom: 8,
    },

    choiceLabel: {
      color:
        Colors.textPrimary,

      fontSize: 24,
      fontWeight: "900",

      letterSpacing: 0.85,
    },

    choicePhrase: {
      width: "90%",

      minHeight: 42,

      color:
        Colors.textPrimary,

      fontSize: 11,
      fontWeight: "700",

      lineHeight: 15,

      textAlign: "center",

      marginTop: 7,
    },

    orPuck: {
      position: "absolute",

      width: 40,
      height: 40,

      borderRadius: 20,

      left: "50%",
      top: 104,

      marginLeft: -20,

      backgroundColor:
        Colors.textPrimary,

      borderColor:
        Colors.background,
      borderWidth: 3,

      alignItems: "center",
      justifyContent: "center",

      zIndex: 20,
    },

    orText: {
      color:
        Colors.white,

      fontSize: 8,
      fontWeight: "900",

      letterSpacing: 0.7,
    },

    footerStrip: {
      alignSelf: "center",

      width: "70%",

      minHeight: 36,

      backgroundColor:
        Colors.textPrimary,

      alignItems: "center",
      justifyContent: "center",

      marginTop: -8,

      transform: [
        {
          rotate: "-1deg",
        },
      ],
    },

    footerStripText: {
      color:
        Colors.white,

      fontSize: 8,
      fontWeight: "900",

      letterSpacing: 1.4,
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
