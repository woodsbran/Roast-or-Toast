// =====================================================
// File: RoundCompleteCard.tsx
//
// Purpose:
// Displays the final results after completing a Quick 10
// or Standard 20 round.
//
// The screen shows round-specific statistics rather than
// only lifetime totals.
//
// Project: Roast or Toast
// =====================================================

import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import type { PlayerProgress } from "../game/progressTypes";

import {
  getRoundModeConfig,
  type RoundMode,
} from "../game/roundTypes";

import {
  Colors,
  Radius,
  Spacing,
} from "../theme";

import ScenarioHeader from "./ScenarioHeader";

type RoundCompleteCardProps = {
  roundMode: RoundMode;
  progress: PlayerProgress;

  completedMoments: number;

  roundStartHeat: number;
  roundStartRoasts: number;
  roundStartToasts: number;
  roundStartMajorityMatches: number;

  // Opens mode selection for another round.
  onPlayAgain: () => void;

  // Returns directly Home.
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
    getRoundModeConfig(roundMode);

  // Calculate only what happened during this round.
  const roundHeat = Math.max(
    progress.totalHeat - roundStartHeat,
    0,
  );

  const roundRoasts = Math.max(
    progress.roastCount - roundStartRoasts,
    0,
  );

  const roundToasts = Math.max(
    progress.toastCount - roundStartToasts,
    0,
  );

  const roundMajorityMatches = Math.max(
    progress.majorityMatches -
      roundStartMajorityMatches,
    0,
  );

  const crowdMatchPercentage =
    completedMoments > 0
      ? Math.round(
          (roundMajorityMatches /
            completedMoments) *
            100,
        )
      : 0;

  const recapMessage = getRoundMessage(
    roundRoasts,
    roundToasts,
    crowdMatchPercentage,
  );

  return (
    <View style={styles.container}>
      {/* Decorative background */}
      <Text style={styles.roastBackdrop}>
        ROAST
      </Text>

      <Text style={styles.toastBackdrop}>
        TOAST
      </Text>

      {/* Home remains available.
          Back also returns Home because this round is done. */}
      <ScenarioHeader
        accentColor={Colors.roast}
        onBackPress={onHomePress}
        onHomePress={onHomePress}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={
          styles.scrollContent
        }
      >
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            ROUND COMPLETE
          </Text>
        </View>

        <Text style={styles.heading}>
          {config.title}?
        </Text>

        <Text style={styles.subheading}>
          Handled.
        </Text>

        <Text style={styles.personalityMessage}>
          {recapMessage}
        </Text>

        {/* Main Heat reward */}
        <View style={styles.heatCard}>
          <Text style={styles.heatEyebrow}>
            HEAT EARNED THIS ROUND
          </Text>

          <Text style={styles.heatValue}>
            🔥 {roundHeat}
          </Text>
        </View>

        {/* Round statistics */}
        <View style={styles.statsGrid}>
          <StatCard
            emoji="🔥"
            value={roundRoasts}
            label="Roasts"
          />

          <StatCard
            emoji="♥"
            value={roundToasts}
            label="Toasts"
          />

          <StatCard
            emoji="🎯"
            value={`${crowdMatchPercentage}%`}
            label="With the crowd"
          />

          <StatCard
            emoji="⚡"
            value={progress.bestStreak}
            label="Best streak"
          />
        </View>

        {/* Play another round */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Choose another round"
          onPress={onPlayAgain}
          style={({ pressed }) => [
            styles.primaryButton,
            pressed &&
              styles.buttonPressed,
          ]}
        >
          <View>
            <Text
              style={
                styles.primaryButtonText
              }
            >
              One More?
            </Text>

            <Text
              style={
                styles.primaryButtonSubtext
              }
            >
              Pick another round and keep the Heat going.
            </Text>
          </View>

          <Text style={styles.buttonArrow}>
            →
          </Text>
        </Pressable>

        {/* Finish for now */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Return Home"
          onPress={onHomePress}
          style={({ pressed }) => [
            styles.secondaryButton,
            pressed &&
              styles.buttonPressed,
          ]}
        >
          <Text
            style={
              styles.secondaryButtonText
            }
          >
            I&apos;m Done for Now
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

// =====================================================
// Round Message
// =====================================================

function getRoundMessage(
  roastCount: number,
  toastCount: number,
  crowdMatchPercentage: number,
): string {
  const totalVotes =
    roastCount + toastCount;

  const roastPercentage =
    totalVotes > 0
      ? roastCount / totalVotes
      : 0;

  const toastPercentage =
    totalVotes > 0
      ? toastCount / totalVotes
      : 0;

  if (roastPercentage >= 0.75) {
    return "You came here to judge, and honestly, you delivered.";
  }

  if (toastPercentage >= 0.75) {
    return "Everybody got grace today. We are a little suspicious.";
  }

  if (crowdMatchPercentage >= 80) {
    return "You and the crowd were basically sharing one brain.";
  }

  if (crowdMatchPercentage <= 35) {
    return "The crowd disagreed. You remained deeply unbothered.";
  }

  return "A little judgment. A little mercy. Very unpredictable.";
}

// =====================================================
// Statistic Card
// =====================================================

type StatCardProps = {
  emoji: string;
  value: string | number;
  label: string;
};

function StatCard({
  emoji,
  value,
  label,
}: StatCardProps) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statEmoji}>
        {emoji}
      </Text>

      <Text style={styles.statValue}>
        {value}
      </Text>

      <Text style={styles.statLabel}>
        {label}
      </Text>
    </View>
  );
}

// =====================================================
// Styles
// =====================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: Colors.background,

    overflow: "hidden",
  },

  scrollView: {
    flex: 1,
    zIndex: 2,
  },

  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 18,
    paddingBottom: 48,
  },

  badge: {
    alignSelf: "flex-start",

    borderColor: Colors.roast,
    borderWidth: 1.5,
    borderRadius: Radius.pill,

    paddingVertical: 7,
    paddingHorizontal: 15,

    marginBottom: 23,

    transform: [{ rotate: "-2deg" }],
  },

  badgeText: {
    color: Colors.roast,

    fontSize: 11,
    fontWeight: "900",

    letterSpacing: 1.6,
  },

  heading: {
    color: Colors.textPrimary,

    fontSize: 45,
    fontWeight: "900",

    letterSpacing: -2,
    lineHeight: 48,
  },

  subheading: {
    color: Colors.roast,

    fontSize: 32,
    fontWeight: "900",

    marginBottom: 10,
  },

  personalityMessage: {
    color: Colors.textSecondary,

    fontSize: 15,
    fontWeight: "700",

    lineHeight: 22,

    marginBottom: 25,
  },

  heatCard: {
    backgroundColor: Colors.textPrimary,

    borderRadius: Radius.lg,

    padding: 20,
    marginBottom: 18,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  heatEyebrow: {
    color: Colors.roast,

    fontSize: 10,
    fontWeight: "900",

    letterSpacing: 1.2,
  },

  heatValue: {
    color: Colors.white,

    fontSize: 25,
    fontWeight: "900",
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",

    gap: 12,

    marginBottom: 20,
  },

  statCard: {
    width: "48%",

    backgroundColor: Colors.surface,

    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: Radius.lg,

    padding: 16,
  },

  statEmoji: {
    fontSize: 20,

    marginBottom: 7,
  },

  statValue: {
    color: Colors.textPrimary,

    fontSize: 24,
    fontWeight: "900",
  },

  statLabel: {
    color: Colors.textSecondary,

    fontSize: 11,
    fontWeight: "700",

    marginTop: 3,
  },

  primaryButton: {
    backgroundColor: Colors.textPrimary,

    borderRadius: Radius.lg,

    paddingVertical: 17,
    paddingHorizontal: 21,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    marginBottom: 12,
  },

  primaryButtonText: {
    color: Colors.white,

    fontSize: 18,
    fontWeight: "900",
  },

  primaryButtonSubtext: {
    color: "#CFCFCF",

    fontSize: 11,
    fontWeight: "600",

    marginTop: 3,
  },

  buttonArrow: {
    color: Colors.white,

    fontSize: 23,
    fontWeight: "700",

    marginLeft: 14,
  },

  secondaryButton: {
    borderColor: Colors.border,
    borderWidth: 1.5,
    borderRadius: Radius.lg,

    paddingVertical: 15,

    alignItems: "center",

    marginBottom: 18,
  },

  secondaryButtonText: {
    color: Colors.textPrimary,

    fontSize: 15,
    fontWeight: "900",
  },

  buttonPressed: {
    opacity: 0.72,

    transform: [{ scale: 0.985 }],
  },

  roastBackdrop: {
    position: "absolute",

    top: 145,
    right: -50,

    color: Colors.roast,

    fontSize: 94,
    fontWeight: "900",

    opacity: 0.06,

    transform: [{ rotate: "8deg" }],
  },

  toastBackdrop: {
    position: "absolute",

    bottom: 50,
    left: -45,

    color: Colors.toast,

    fontSize: 91,
    fontWeight: "900",

    opacity: 0.06,

    transform: [{ rotate: "-8deg" }],
  },
});