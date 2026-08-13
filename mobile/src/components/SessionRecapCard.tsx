// =====================================================
// File: SessionRecapCard.tsx
//
// Purpose:
// Gives the player a personality check-in during a round.
//
// Version 1.1 — Big Design Batch 2
//
// I am making this feel like an editorial intermission,
// not a profile dashboard.
//
// I keep:
// • current title / level
// • Heat
// • Roast vs Toast counts
// • crowd-read percentage
// • best streak
//
// I remove the generic card-grid feeling.
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
  getPlayerTitle,
} from "../game/titles";

import {
  Colors,
  Spacing,
} from "../theme";

import EditorialHeading from "./EditorialHeading";
import HeatMark from "./HeatMark";
import PaperButton from "./PaperButton";
import ScenarioHeader from "./ScenarioHeader";
import StampLabel from "./StampLabel";
import VoteMark from "./VoteMark";

type SessionRecapCardProps = {
  progress: PlayerProgress;
  onContinue: () => void;
  onBackPress: () => void;
  onHomePress: () => void;
};

function getHeading(
  progress:
    PlayerProgress,
): string {
  const total =
    progress.roastCount +
    progress.toastCount;

  if (
    total >= 5 &&
    progress.roastCount >
      progress.toastCount * 1.7
  ) {
    return "YOU CAME TO JUDGE.";
  }

  if (
    total >= 5 &&
    progress.toastCount >
      progress.roastCount * 1.7
  ) {
    return "EVERYBODY GOT GRACE.";
  }

  if (
    progress.currentStreak >= 5
  ) {
    return "YOU'RE READING THE ROOM.";
  }

  return "SO FAR? UNPREDICTABLE.";
}

export default function SessionRecapCard({
  progress,
  onContinue,
  onBackPress,
  onHomePress,
}: SessionRecapCardProps) {
  const title =
    getPlayerTitle(
      progress.level,
    );

  const crowdPercent =
    progress.momentsCompleted > 0
      ? Math.round(
          (
            progress.majorityMatches /
            progress.momentsCompleted
          ) * 100,
        )
      : 0;

  return (
    <View style={styles.container}>
      <ScenarioHeader
        accentColor={
          Colors.roast
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
          text="SESSION CHECK-IN"
          color={Colors.roast}
          rotate={-2}
          size="medium"
        />

        <View style={styles.headingWrap}>
          <EditorialHeading
            title={getHeading(progress)}
            underlineColor={Colors.toast}
          />
        </View>

        <ImageBackground
          source={require("../../assets/game/paper/paper-plain.png")}
          resizeMode="stretch"
          style={styles.paper}
        >
          <Text style={styles.paperEyebrow}>
            CURRENT ENERGY
          </Text>

          <Text style={styles.title}>
            {title}
          </Text>

          <View style={styles.identityMeta}>
            <Text style={styles.level}>
              LEVEL {progress.level}
            </Text>

            <View style={styles.heatMeta}>
              <HeatMark
                size="small"
              />

              <Text style={styles.heatValue}>
                {progress.totalHeat}
              </Text>
            </View>
          </View>

          <View style={styles.paperRule} />

          <View style={styles.verdictRow}>
            <View style={styles.verdictSide}>
              <VoteMark
                type="roast"
                size="small"
              />

              <Text style={styles.verdictNumber}>
                {progress.roastCount}
              </Text>

              <Text style={styles.verdictLabel}>
                ROASTS
              </Text>
            </View>

            <View style={styles.verdictDivider} />

            <View style={styles.verdictSide}>
              <VoteMark
                type="toast"
                size="small"
              />

              <Text style={styles.verdictNumber}>
                {progress.toastCount}
              </Text>

              <Text style={styles.verdictLabel}>
                TOASTS
              </Text>
            </View>
          </View>
        </ImageBackground>

        <View style={styles.crowdStrip}>
          <Text style={styles.crowdLabel}>
            HOW OFTEN YOU READ THE ROOM
          </Text>

          <Text style={styles.crowdPercent}>
            {crowdPercent}%
          </Text>

          <Text style={styles.crowdCopy}>
            {crowdPercent >= 70
              ? "The crowd keeps agreeing with you."
              : crowdPercent <= 35
                ? "You and the crowd are on different planets."
                : "Sometimes you know the room. Sometimes you are the room."}
          </Text>
        </View>

        <View style={styles.streakLine}>
          <Ionicons
            name="flash-outline"
            size={18}
            color={
              Colors.heatDark
            }
          />

          <Text style={styles.streakLabel}>
            BEST STREAK
          </Text>

          <Text style={styles.streakValue}>
            {progress.bestStreak}
          </Text>
        </View>

        <PaperButton
          label="KEEP GOING"
          onPress={onContinue}
          accentColor={Colors.roast}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor:
      Colors.background,
  },

  scrollContent: {
    paddingHorizontal:
      Spacing.lg,

    paddingTop: 18,
    paddingBottom: 42,
  },

  headingWrap: {
    marginTop: 15,
    marginBottom: 12,
  },

  stamp: {
    alignSelf: "flex-start",

    borderColor:
      Colors.roast,
    borderWidth: 2,

    paddingVertical: 6,
    paddingHorizontal: 14,

    transform: [
      {
        rotate: "-2deg",
      },
    ],

    marginBottom: 14,
  },

  stampText: {
    color:
      Colors.roast,

    fontSize: 9,
    fontWeight: "900",

    letterSpacing: 1.5,
  },

  heading: {
    color:
      Colors.textPrimary,

    fontSize: 38,
    fontWeight: "900",

    lineHeight: 41,
    letterSpacing: -1.7,
  },

  headingScratch: {
    width: 76,
    height: 4,

    backgroundColor:
      Colors.toast,

    marginTop: 10,
    marginBottom: 12,

    transform: [
      {
        rotate: "-4deg",
      },
    ],
  },

  paper: {
    minHeight: 305,

    paddingVertical: 47,
    paddingHorizontal: 39,

    justifyContent: "center",

    marginHorizontal: -5,
    marginBottom: 7,
  },

  paperEyebrow: {
    color:
      Colors.roast,

    fontSize: 8,
    fontWeight: "900",

    letterSpacing: 1.3,

    marginBottom: 6,
  },

  title: {
    color:
      Colors.textPrimary,

    fontSize: 25,
    fontWeight: "900",

    lineHeight: 29,
  },

  identityMeta: {
    flexDirection: "row",
    alignItems: "center",

    marginTop: 8,
  },

  level: {
    color:
      Colors.textMuted,

    fontSize: 8,
    fontWeight: "900",

    letterSpacing: 1,
  },

  heatMeta: {
    marginLeft: "auto",

    flexDirection: "row",
    alignItems: "center",

    gap: 4,
  },

  heatValue: {
    color:
      Colors.textPrimary,

    fontSize: 13,
    fontWeight: "900",
  },

  paperRule: {
    height: 2,

    backgroundColor:
      Colors.textPrimary,

    opacity: 0.5,

    marginVertical: 18,
  },

  verdictRow: {
    flexDirection: "row",

    minHeight: 92,
  },

  verdictSide: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",
  },

  verdictDivider: {
    width: 1,

    backgroundColor:
      Colors.textPrimary,

    opacity: 0.25,
  },

  verdictNumber: {
    color:
      Colors.textPrimary,

    fontSize: 24,
    fontWeight: "900",

    marginTop: 3,
  },

  verdictLabel: {
    color:
      Colors.textMuted,

    fontSize: 7.5,
    fontWeight: "900",

    letterSpacing: 1,

    marginTop: 2,
  },

  crowdStrip: {
    backgroundColor:
      Colors.toastWash,

    borderLeftColor:
      Colors.toast,
    borderLeftWidth: 6,

    paddingVertical: 15,
    paddingHorizontal: 17,

    marginBottom: 13,
  },

  crowdLabel: {
    color:
      Colors.toastDark,

    fontSize: 8,
    fontWeight: "900",

    letterSpacing: 1.1,
  },

  crowdPercent: {
    color:
      Colors.toastDark,

    fontSize: 31,
    fontWeight: "900",

    marginTop: 3,
  },

  crowdCopy: {
    color:
      Colors.textPrimary,

    fontSize: 12,
    fontWeight: "700",

    lineHeight: 17,

    marginTop: 3,
  },

  streakLine: {
    flexDirection: "row",
    alignItems: "center",

    minHeight: 48,

    borderTopColor:
      Colors.borderStrong,
    borderBottomColor:
      Colors.borderStrong,

    borderTopWidth: 1,
    borderBottomWidth: 1,

    paddingHorizontal: 3,

    marginBottom: 16,
  },

  streakLabel: {
    color:
      Colors.textMuted,

    fontSize: 8,
    fontWeight: "900",

    letterSpacing: 1,

    marginLeft: 7,
  },

  streakValue: {
    color:
      Colors.textPrimary,

    fontSize: 18,
    fontWeight: "900",

    marginLeft: "auto",
  },

  continueButton: {
    minHeight: 64,

    backgroundColor:
      Colors.textPrimary,

    borderBottomColor:
      Colors.roast,
    borderBottomWidth: 5,

    flexDirection: "row",
    alignItems: "center",
    justifyContent:
      "space-between",

    paddingHorizontal: 22,
  },

  continueText: {
    color:
      Colors.white,

    fontSize: 12,
    fontWeight: "900",

    letterSpacing: 1.4,
  },

  arrow: {
    color:
      Colors.white,

    fontSize: 24,
    fontWeight: "700",
  },

  pressed: {
    opacity: 0.74,

    transform: [
      {
        scale: 0.985,
      },
    ],
  },
});
