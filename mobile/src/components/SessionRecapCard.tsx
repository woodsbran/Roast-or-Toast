// =====================================================
// File: SessionRecapCard.tsx
//
// Purpose:
// Gives the player a personality-filled summary after
// completing a section of gameplay.
//
// Navigation:
// • Back returns to regular gameplay.
// • Home returns directly to the landing screen.
//
// The recap appears after every third special event:
//
// 5 Moments  = Guess the Crowd
// 10 Moments = Quick Break
// 15 Moments = Session Recap
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
import { getPlayerTitle } from "../game/titles";

import {
  Colors,
  Radius,
  Spacing,
} from "../theme";

import ScenarioHeader from "./ScenarioHeader";

// Information required by the recap screen.
type SessionRecapCardProps = {
  // Player totals and current progression.
  progress: PlayerProgress;

  // Continues the active session.
  onContinue: () => void;

  // Returns to the previous gameplay screen.
  onBackPress: () => void;

  // Returns directly to Home.
  onHomePress: () => void;
};

export default function SessionRecapCard({
  progress,
  onContinue,
  onBackPress,
  onHomePress,
}: SessionRecapCardProps) {
  // Gets the player's current personality title.
  const playerTitle =
    getPlayerTitle(progress.level);

  // Calculates how often the player's regular votes
  // matched the community majority.
  const crowdMatchPercentage =
    progress.momentsCompleted > 0
      ? Math.round(
          (progress.majorityMatches /
            progress.momentsCompleted) *
            100,
        )
      : 0;

  return (
    <View style={styles.container}>
      {/* Branded decorative background */}
      <Text style={styles.roastBackdrop}>
        ROAST
      </Text>

      <Text style={styles.toastBackdrop}>
        TOAST
      </Text>

      {/* Shared Back, brand, and Home navigation */}
      <ScenarioHeader
        accentColor={Colors.roast}
        onBackPress={onBackPress}
        onHomePress={onHomePress}
      />

      {/* Scrollable recap content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={
          styles.scrollContent
        }
      >
        {/* Recap badge */}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            SESSION CHECK-IN
          </Text>
        </View>

        <Text style={styles.heading}>
          Well...
        </Text>

        <Text style={styles.subheading}>
          That says a lot about you.
        </Text>

        {/* Current player identity */}
        <View style={styles.identityCard}>
          <Text
            style={
              styles.identityEyebrow
            }
          >
            CURRENT ENERGY
          </Text>

          <Text
            style={
              styles.identityTitle
            }
          >
            {playerTitle}
          </Text>

          <Text
            style={
              styles.identityLevel
            }
          >
            Level {progress.level}
          </Text>
        </View>

        {/* Session statistics */}
        <View style={styles.statsGrid}>
          <StatItem
            emoji="🔥"
            value={progress.roastCount}
            label="Roasts"
          />

          <StatItem
            emoji="♥"
            value={progress.toastCount}
            label="Toasts"
          />

          <StatItem
            emoji="🎯"
            value={`${crowdMatchPercentage}%`}
            label="With the crowd"
          />

          <StatItem
            emoji="⚡"
            value={progress.bestStreak}
            label="Best streak"
          />
        </View>

        {/* Total Heat earned */}
        <View style={styles.heatSummary}>
          <Text style={styles.heatLabel}>
            HEAT COLLECTED
          </Text>

          <Text style={styles.heatValue}>
            🔥 {progress.totalHeat}
          </Text>
        </View>

        {/* Continues the current session */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Continue playing"
          onPress={onContinue}
          style={({ pressed }) => [
            styles.continueButton,

            pressed &&
              styles.buttonPressed,
          ]}
        >
          <Text
            style={
              styles.continueButtonText
            }
          >
            Keep Going
          </Text>

          <Text
            style={
              styles.continueArrow
            }
          >
            →
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

// =====================================================
// Individual Statistic
// =====================================================

type StatItemProps = {
  emoji: string;
  value: string | number;
  label: string;
};

function StatItem({
  emoji,
  value,
  label,
}: StatItemProps) {
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
    flexGrow: 1,
    justifyContent: "center",

    paddingHorizontal: Spacing.lg,
    paddingTop: 18,
    paddingBottom: 48,
  },

  badge: {
    alignSelf: "flex-start",

    backgroundColor: Colors.surface,

    borderColor: Colors.roast,
    borderWidth: 1.5,
    borderRadius: Radius.pill,

    paddingVertical: 7,
    paddingHorizontal: 15,

    marginBottom: 25,

    transform: [{ rotate: "-2deg" }],
  },

  badgeText: {
    color: Colors.roast,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.7,
  },

  heading: {
    color: Colors.textPrimary,

    fontSize: 48,
    fontWeight: "900",
    letterSpacing: -2,
    lineHeight: 52,
  },

  subheading: {
    color: Colors.textPrimary,

    fontSize: 27,
    fontWeight: "800",
    lineHeight: 35,

    marginBottom: 28,
  },

  identityCard: {
    backgroundColor: Colors.textPrimary,

    borderRadius: Radius.lg,

    padding: 20,
    marginBottom: 18,
  },

  identityEyebrow: {
    color: Colors.roast,

    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.5,

    marginBottom: 6,
  },

  identityTitle: {
    color: Colors.white,
    fontSize: 24,
    fontWeight: "900",
  },

  identityLevel: {
    color: "#CFCFCF",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 4,
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",

    gap: 12,

    marginBottom: 18,
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

  heatSummary: {
    backgroundColor: "#FFF1EC",

    borderColor: "#F4C9BE",
    borderWidth: 1,
    borderRadius: Radius.lg,

    padding: 17,
    marginBottom: 20,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  heatLabel: {
    color: Colors.textPrimary,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.2,
  },

  heatValue: {
    color: Colors.roast,
    fontSize: 20,
    fontWeight: "900",
  },

  continueButton: {
    backgroundColor: Colors.textPrimary,
    borderRadius: Radius.pill,

    paddingVertical: 17,
    paddingHorizontal: 25,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    marginBottom: 18,
  },

  buttonPressed: {
    opacity: 0.76,
    transform: [{ scale: 0.985 }],
  },

  continueButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "900",
  },

  continueArrow: {
    color: Colors.white,
    fontSize: 23,
    fontWeight: "700",
  },

  roastBackdrop: {
    position: "absolute",
    top: 145,
    right: -50,

    color: Colors.roast,

    fontSize: 94,
    fontWeight: "900",

    opacity: 0.07,

    transform: [{ rotate: "8deg" }],
  },

  toastBackdrop: {
    position: "absolute",
    bottom: 50,
    left: -45,

    color: Colors.toast,

    fontSize: 91,
    fontWeight: "900",

    opacity: 0.07,

    transform: [{ rotate: "-8deg" }],
  },
});