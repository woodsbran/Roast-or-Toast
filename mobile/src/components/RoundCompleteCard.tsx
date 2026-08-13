// =====================================================
// File: RoundCompleteCard.tsx
//
// Purpose:
// End-of-round payoff.
//
// Version 1.1 — Full Visual Cohesion Pass
//
// This is the dark poster at the end of the same physical
// game kit. It should feel celebratory without becoming a
// dashboard.
//
// Project: Roast or Toast
// =====================================================

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import type {
  PlayerProgress,
} from "../game/progressTypes";

import {
  getRoundModeConfig,
  type RoundMode,
} from "../game/roundTypes";

import {
  Colors,
  Spacing,
} from "../theme";

import HeatMark from "./HeatMark";
import InkUnderline from "./InkUnderline";
import StampLabel from "./StampLabel";
import VoteMark from "./VoteMark";

type RoundCompleteCardProps = {
  roundMode: RoundMode;
  progress: PlayerProgress;
  completedMoments: number;
  roundStartHeat: number;
  roundStartRoasts: number;
  roundStartToasts: number;
  roundStartMajorityMatches: number;
  onPlayAgain: () => void;
  onHomePress: () => void;
};

export default function RoundCompleteCard({
  roundMode,
  progress,
  completedMoments,
  roundStartHeat,
  roundStartRoasts,
  roundStartToasts,
  roundStartMajorityMatches,
  onPlayAgain,
  onHomePress,
}: RoundCompleteCardProps) {
  const config =
    getRoundModeConfig(
      roundMode,
    );

  const roundHeat =
    Math.max(
      progress.totalHeat -
        roundStartHeat,
      0,
    );

  const roundRoasts =
    Math.max(
      progress.roastCount -
        roundStartRoasts,
      0,
    );

  const roundToasts =
    Math.max(
      progress.toastCount -
        roundStartToasts,
      0,
    );

  const roundMajorityMatches =
    Math.max(
      progress.majorityMatches -
        roundStartMajorityMatches,
      0,
    );

  const crowdMatchPercentage =
    completedMoments > 0
      ? Math.round(
          (
            roundMajorityMatches /
            completedMoments
          ) * 100,
        )
      : 0;

  const recapMessage =
    getRoundMessage(
      roundRoasts,
      roundToasts,
      crowdMatchPercentage,
    );

  return (
    <ImageBackground
      source={require("../../assets/game/backgrounds/round-complete-dark.png")}
      resizeMode="cover"
      style={styles.container}
    >
      <View style={styles.topBar}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Return Home"
          onPress={onHomePress}
          style={({ pressed }) => [
            styles.closeButton,
            pressed &&
              styles.pressed,
          ]}
        >
          <Ionicons
            name="close"
            size={24}
            color={Colors.white}
          />
        </Pressable>

        <Text style={styles.topBrand}>
          ROAST OR TOAST
        </Text>

        <View style={styles.topSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.scrollContent
        }
      >
        <StampLabel
          text="ROUND"
          color={
            Colors.textPrimary
          }
          filled
          rotate={-3}
          size="medium"
        />

        <Text style={styles.completeHeading}>
          COMPLETE!
        </Text>

        <Text style={styles.roundName}>
          {config.title.toUpperCase()}
        </Text>

        <InkUnderline
          color={Colors.roast}
          width={72}
          rotate={-5}
          align="center"
        />

        <View style={styles.paperMedallion}>
          <View style={styles.medallionMarks}>
            <VoteMark
              type="roast"
              size="large"
            />

            <Text style={styles.medallionVs}>
              VS
            </Text>

            <VoteMark
              type="toast"
              size="large"
            />
          </View>

          <View style={styles.voteReceipt}>
            <Text style={styles.voteReceiptValue}>
              {roundRoasts}
            </Text>

            <Text style={styles.voteReceiptLabel}>
              ROAST
            </Text>

            <Text style={styles.voteReceiptDot}>
              •
            </Text>

            <Text style={styles.voteReceiptValue}>
              {roundToasts}
            </Text>

            <Text style={styles.voteReceiptLabel}>
              TOAST
            </Text>
          </View>
        </View>

        <Text style={styles.message}>
          {recapMessage}
        </Text>

        <Text style={styles.earned}>
          YOU EARNED
        </Text>

        <View style={styles.heatHero}>
          <HeatMark
            size="large"
          />

          <Text style={styles.heatValue}>
            +{roundHeat}
          </Text>
        </View>

        <Text style={styles.heatLabel}>
          HEAT
        </Text>

        <View style={styles.statsReceipt}>
          <Stat
            value={`${crowdMatchPercentage}%`}
            label="WITH CROWD"
          />

          <View style={styles.statRule} />

          <Stat
            value={
              progress.bestStreak
            }
            label="BEST STREAK"
          />

          <View style={styles.statRule} />

          <Stat
            value={
              completedMoments
            }
            label="JUDGED"
          />
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Choose another round"
          onPress={onPlayAgain}
          style={({ pressed }) => [
            styles.nextRound,
            pressed &&
              styles.pressed,
          ]}
        >
          <Text style={styles.nextRoundText}>
            NEXT ROUND
          </Text>

          <Text style={styles.nextArrow}>
            →
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Return Home"
          onPress={onHomePress}
          style={({ pressed }) => [
            styles.homeAction,
            pressed &&
              styles.pressed,
          ]}
        >
          <Text style={styles.homeActionText}>
            VIEW HOME
          </Text>
        </Pressable>
      </ScrollView>
    </ImageBackground>
  );
}

function Stat({
  value,
  label,
}: {
  value: string | number;
  label: string;
}) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>
        {value}
      </Text>

      <Text style={styles.statLabel}>
        {label}
      </Text>
    </View>
  );
}

function getRoundMessage(
  roastCount: number,
  toastCount: number,
  crowdMatchPercentage: number,
): string {
  const total =
    roastCount +
    toastCount;

  const roastShare =
    total > 0
      ? roastCount / total
      : 0;

  const toastShare =
    total > 0
      ? toastCount / total
      : 0;

  if (
    roastShare >= 0.75
  ) {
    return "You came here to judge, and honestly, you delivered.";
  }

  if (
    toastShare >= 0.75
  ) {
    return "Everybody got grace today. We are a little suspicious.";
  }

  if (
    crowdMatchPercentage >= 80
  ) {
    return "You and the crowd were basically sharing one brain.";
  }

  if (
    crowdMatchPercentage <= 35
  ) {
    return "The crowd disagreed. You remained deeply unbothered.";
  }

  return "A little judgment. A little mercy. Very unpredictable.";
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        "#171717",
    },

    topBar: {
      minHeight: 76,

      paddingTop: 18,
      paddingHorizontal:
        Spacing.lg,

      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
    },

    closeButton: {
      width: 40,
      height: 40,

      borderColor:
        "#55555A",
      borderWidth: 1,

      alignItems: "center",
      justifyContent: "center",
    },

    topBrand: {
      color:
        "#A7A7AA",

      fontSize: 8,
      fontWeight: "900",
      letterSpacing: 1.4,
    },

    topSpacer: {
      width: 40,
    },

    scrollContent: {
      alignItems: "center",

      paddingHorizontal:
        Spacing.lg,
      paddingTop: 14,
      paddingBottom: 45,
    },

    completeHeading: {
      color:
        Colors.white,

      fontSize: 48,
      fontWeight: "900",
      letterSpacing: -2.1,

      marginTop: 3,
    },

    roundName: {
      color:
        Colors.toast,

      fontSize: 9,
      fontWeight: "900",
      letterSpacing: 1.6,

      marginTop: 2,
    },

    paperMedallion: {
      width: "88%",
      minHeight: 200,

      backgroundColor:
        Colors.background,

      borderTopLeftRadius: 120,
      borderTopRightRadius: 100,
      borderBottomLeftRadius: 110,
      borderBottomRightRadius: 135,

      alignItems: "center",
      justifyContent: "center",

      marginTop: 22,
      paddingVertical: 25,

      transform: [
        {
          rotate: "-1deg",
        },
      ],
    },

    medallionMarks: {
      flexDirection: "row",
      alignItems: "center",

      gap: 16,
    },

    medallionVs: {
      color:
        Colors.textPrimary,

      fontSize: 11,
      fontWeight: "900",
    },

    voteReceipt: {
      flexDirection: "row",
      alignItems: "baseline",

      marginTop: 16,
    },

    voteReceiptValue: {
      color:
        Colors.textPrimary,

      fontSize: 18,
      fontWeight: "900",
    },

    voteReceiptLabel: {
      color:
        Colors.textMuted,

      fontSize: 7,
      fontWeight: "900",
      letterSpacing: 0.9,

      marginLeft: 4,
    },

    voteReceiptDot: {
      color:
        Colors.textMuted,

      marginHorizontal: 9,
    },

    message: {
      color:
        "#D3D3D6",

      fontSize: 13,
      fontWeight: "700",
      lineHeight: 19,

      textAlign: "center",

      maxWidth: 300,

      marginTop: 17,
    },

    earned: {
      color:
        "#9C9C9F",

      fontSize: 8,
      fontWeight: "900",
      letterSpacing: 1.4,

      marginTop: 21,
    },

    heatHero: {
      flexDirection: "row",
      alignItems: "center",

      marginTop: 2,
    },

    heatValue: {
      color:
        Colors.heat,

      fontSize: 57,
      fontWeight: "900",
      letterSpacing: -2.2,

      marginLeft: 7,
    },

    heatLabel: {
      color:
        Colors.white,

      fontSize: 11,
      fontWeight: "900",
      letterSpacing: 1.5,

      marginTop: -7,
    },

    statsReceipt: {
      width: "100%",

      flexDirection: "row",
      alignItems: "center",

      borderTopColor:
        "#444448",
      borderBottomColor:
        "#444448",

      borderTopWidth: 1,
      borderBottomWidth: 1,

      paddingVertical: 14,

      marginTop: 20,
      marginBottom: 22,
    },

    stat: {
      flex: 1,
      alignItems: "center",
    },

    statValue: {
      color:
        Colors.white,

      fontSize: 18,
      fontWeight: "900",
    },

    statLabel: {
      color:
        "#8F8F92",

      fontSize: 7,
      fontWeight: "900",
      letterSpacing: 0.8,

      marginTop: 3,
    },

    statRule: {
      width: 1,
      height: 32,

      backgroundColor:
        "#444448",
    },

    nextRound: {
      width: "100%",
      minHeight: 66,

      backgroundColor:
        Colors.roast,

      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",

      paddingHorizontal: 22,

      transform: [
        {
          rotate: "-0.6deg",
        },
      ],
    },

    nextRoundText: {
      color:
        Colors.white,

      fontSize: 12,
      fontWeight: "900",
      letterSpacing: 1.3,
    },

    nextArrow: {
      color:
        Colors.white,

      fontSize: 26,
      fontWeight: "700",
    },

    homeAction: {
      minHeight: 50,

      justifyContent: "center",

      marginTop: 11,
    },

    homeActionText: {
      color:
        "#A7A7AA",

      fontSize: 8,
      fontWeight: "900",
      letterSpacing: 1.2,
    },

    pressed: {
      opacity: 0.72,
    },
  });
