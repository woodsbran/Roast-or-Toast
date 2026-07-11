// =====================================================
// File: SessionRecapCard.tsx
//
// Purpose:
// Gives the player a personality-filled summary after
// completing a section of gameplay.
//
// The recap message changes based on:
// • Roast versus Toast behavior
// • Crowd-match percentage
// • Current and best streak
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

import type {
  PlayerProgress,
} from "../game/progressTypes";

import {
  getPlayerTitle,
} from "../game/titles";

import {
  Colors,
  Radius,
  Spacing,
} from "../theme";

import ScenarioHeader from "./ScenarioHeader";

// Information required by the recap screen.
type SessionRecapCardProps = {
  progress: PlayerProgress;

  // Continues the active session.
  onContinue: () => void;

  // Returns to the previous gameplay screen.
  onBackPress: () => void;

  // Returns directly to Home.
  onHomePress: () => void;
};

// Personality message displayed near the top.
type RecapMessage = {
  heading: string;
  message: string;
  supportingText: string;
};

// =====================================================
// Dynamic Recap Message
// =====================================================

// Builds a playful message based on the player's overall
// behavior so the recap does not feel identical every
// time it appears.
function getRecapMessage(
  progress: PlayerProgress,
  crowdMatchPercentage: number,
): RecapMessage {
  const totalVotes =
    progress.roastCount +
    progress.toastCount;

  const roastPercentage =
    totalVotes > 0
      ? Math.round(
          (progress.roastCount /
            totalVotes) *
            100,
        )
      : 0;

  const toastPercentage =
    totalVotes > 0
      ? Math.round(
          (progress.toastCount /
            totalVotes) *
            100,
        )
      : 0;

  // Strong Roast majority.
  if (
    totalVotes >= 5 &&
    roastPercentage >= 75
  ) {
    return {
      heading:
        "You woke up choosing chaos.",

      message:
        "You roasted almost everything in sight.",

      supportingText:
        "At least you’re consistent.",
    };
  }

  // Strong Toast majority.
  if (
    totalVotes >= 5 &&
    toastPercentage >= 75
  ) {
    return {
      heading:
        "Look at you being nice.",

      message:
        "Apparently everybody gets grace today.",

      supportingText:
        "Suspicious, but kind of refreshing.",
    };
  }

  // Very high agreement with the crowd.
  if (
    progress.momentsCompleted >= 5 &&
    crowdMatchPercentage >= 80
  ) {
    return {
      heading:
        "You read the room.",

      message:
        "The crowd keeps agreeing with you.",

      supportingText:
        "Either you get people, or everyone is copying you.",
    };
  }

  // Very low agreement with the crowd.
  if (
    progress.momentsCompleted >= 5 &&
    crowdMatchPercentage <= 35
  ) {
    return {
      heading:
        "You said what you said.",

      message:
        "The crowd does not always understand your vision.",

      supportingText:
        "That sounds like their problem.",
    };
  }

  // Strong active streak.
  if (progress.currentStreak >= 5) {
    return {
      heading:
        "Okay, mind reader.",

      message:
        "You keep calling the crowd correctly.",

      supportingText:
        "Do not let it go to your head.",
    };
  }

  // Strong historical streak.
  if (progress.bestStreak >= 8) {
    return {
      heading:
        "The receipts are there.",

      message:
        "That best streak is doing a lot of talking.",

      supportingText:
        "You clearly know how people think.",
    };
  }

  // Balanced Roast and Toast behavior.
  if (
    totalVotes >= 6 &&
    Math.abs(
      progress.roastCount -
        progress.toastCount,
    ) <= 2
  ) {
    return {
      heading:
        "A little Roast. A little Toast.",

      message:
        "You are keeping everybody guessing.",

      supportingText:
        "Balanced... or just unpredictable.",
    };
  }

  // Default message.
  return {
    heading: "Well...",

    message:
      "That says a lot about you.",

    supportingText:
      "We are still deciding whether that is good or bad.",
  };
}

export default function SessionRecapCard({
  progress,
  onContinue,
  onBackPress,
  onHomePress,
}: SessionRecapCardProps) {
  // Gets the player's current personality title.
  const playerTitle =
    getPlayerTitle(progress.level);

  // Calculates how often regular votes matched the
  // community majority.
  const crowdMatchPercentage =
    progress.momentsCompleted > 0
      ? Math.round(
          (progress.majorityMatches /
            progress.momentsCompleted) *
            100,
        )
      : 0;

  // Builds the dynamic personality recap.
  const recapMessage =
    getRecapMessage(
      progress,
      crowdMatchPercentage,
    );

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

        {/* Dynamic personality message */}
        <Text style={styles.heading}>
          {recapMessage.heading}
        </Text>

        <Text style={styles.subheading}>
          {recapMessage.message}
        </Text>

        <Text style={styles.supportingMessage}>
          {recapMessage.supportingText}
        </Text>

        {/* Current player identity */}
        <View style={styles.identityCard}>
          <View>
            <Text style={styles.identityEyebrow}>
              CURRENT ENERGY
            </Text>

            <Text style={styles.identityTitle}>
              {playerTitle}
            </Text>

            <Text style={styles.identityLevel}>
              Level {progress.level}
            </Text>
          </View>

          <View style={styles.identityHeat}>
            <Text style={styles.identityHeatIcon}>
              🔥
            </Text>

            <Text style={styles.identityHeatValue}>
              {progress.totalHeat}
            </Text>
          </View>
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

        {/* Guess the Crowd summary */}
        {progress.crowdGuesses > 0 && (
          <View style={styles.crowdGuessCard}>
            <View>
              <Text style={styles.crowdGuessLabel}>
                GUESS THE CROWD
              </Text>

              <Text style={styles.crowdGuessText}>
                You called{" "}
                {progress.correctCrowdGuesses}
                {" of "}
                {progress.crowdGuesses}
                {" correctly."}
              </Text>
            </View>

            <Text style={styles.crowdGuessEmoji}>
              👀
            </Text>
          </View>
        )}

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
          <Text style={styles.continueButtonText}>
            Keep Going
          </Text>

          <Text style={styles.continueArrow}>
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

    backgroundColor:
      Colors.background,

    overflow: "hidden",
  },

  scrollView: {
    flex: 1,
    zIndex: 2,
  },

  scrollContent: {
    flexGrow: 1,

    paddingHorizontal:
      Spacing.lg,

    paddingTop: 18,
    paddingBottom: 48,
  },

  badge: {
    alignSelf: "flex-start",

    backgroundColor:
      Colors.surface,

    borderColor:
      Colors.roast,

    borderWidth: 1.5,
    borderRadius: Radius.pill,

    paddingVertical: 7,
    paddingHorizontal: 15,

    marginBottom: 22,

    transform: [
      {
        rotate: "-2deg",
      },
    ],
  },

  badgeText: {
    color: Colors.roast,

    fontSize: 11,
    fontWeight: "900",

    letterSpacing: 1.7,
  },

  heading: {
    color: Colors.textPrimary,

    fontSize: 38,
    fontWeight: "900",

    letterSpacing: -1.7,
    lineHeight: 43,

    marginBottom: 5,
  },

  subheading: {
    color: Colors.textPrimary,

    fontSize: 23,
    fontWeight: "800",

    lineHeight: 30,

    marginBottom: 6,
  },

  supportingMessage: {
    color: Colors.textSecondary,

    fontSize: 14,
    fontWeight: "600",

    lineHeight: 21,

    marginBottom: 24,
  },

  // =====================================================
  // Identity Card
  // =====================================================

  identityCard: {
    backgroundColor:
      Colors.textPrimary,

    borderRadius: Radius.lg,

    padding: 19,
    marginBottom: 18,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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

    fontSize: 22,
    fontWeight: "900",
  },

  identityLevel: {
    color: "#CFCFCF",

    fontSize: 13,
    fontWeight: "700",

    marginTop: 4,
  },

  identityHeat: {
    alignItems: "center",

    marginLeft: 12,
  },

  identityHeatIcon: {
    fontSize: 20,
  },

  identityHeatValue: {
    color: Colors.white,

    fontSize: 15,
    fontWeight: "900",

    marginTop: 3,
  },

  // =====================================================
  // Statistics
  // =====================================================

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",

    gap: 12,

    marginBottom: 18,
  },

  statCard: {
    width: "48%",

    backgroundColor:
      Colors.surface,

    borderColor:
      Colors.border,

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

  // =====================================================
  // Guess the Crowd Summary
  // =====================================================

  crowdGuessCard: {
    backgroundColor: "#FFF1EC",

    borderColor: "#F4C9BE",
    borderWidth: 1,
    borderRadius: Radius.lg,

    paddingVertical: 15,
    paddingHorizontal: 17,

    marginBottom: 20,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  crowdGuessLabel: {
    color: Colors.roast,

    fontSize: 10,
    fontWeight: "900",

    letterSpacing: 1.2,

    marginBottom: 4,
  },

  crowdGuessText: {
    color: Colors.textPrimary,

    fontSize: 13,
    fontWeight: "700",
  },

  crowdGuessEmoji: {
    fontSize: 24,
    marginLeft: 14,
  },

  // =====================================================
  // Continue Button
  // =====================================================

  continueButton: {
    backgroundColor:
      Colors.textPrimary,

    borderRadius:
      Radius.pill,

    paddingVertical: 17,
    paddingHorizontal: 25,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    marginBottom: 18,
  },

  buttonPressed: {
    opacity: 0.76,

    transform: [
      {
        scale: 0.985,
      },
    ],
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

  // =====================================================
  // Background Decorations
  // =====================================================

  roastBackdrop: {
    position: "absolute",

    top: 145,
    right: -50,

    color: Colors.roast,

    fontSize: 94,
    fontWeight: "900",

    opacity: 0.07,

    transform: [
      {
        rotate: "8deg",
      },
    ],
  },

  toastBackdrop: {
    position: "absolute",

    bottom: 50,
    left: -45,

    color: Colors.toast,

    fontSize: 91,
    fontWeight: "900",

    opacity: 0.07,

    transform: [
      {
        rotate: "-8deg",
      },
    ],
  },
});