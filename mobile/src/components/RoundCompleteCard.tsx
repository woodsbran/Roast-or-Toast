// =====================================================
// File: RoundCompleteCard.tsx
//
// Purpose:
// Final finite-round celebration.
//
// Version 1.1 — Celebration Polish Batch
//
// I am keeping the round calculations and navigation exactly
// the same. This pass only makes the payoff feel more alive.
//
// What I am adding:
// • staged entrance motion
// • one restrained confetti reveal
// • a Heat reward pop
// • a round-specific personality line
// • clearer BEST STREAK wording
// • one VoiceOver-friendly summary
// • full Reduce Motion support
//
// Project: Roast or Toast
// =====================================================

import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
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
import useReducedMotion from "../hooks/useReducedMotion";
import { Colors, Spacing } from "../theme";
import HeatMark from "./HeatMark";
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
  const reduceMotion = useReducedMotion();
  const config = getRoundModeConfig(roundMode);

  // I only count what happened during this round here.
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
    progress.majorityMatches - roundStartMajorityMatches,
    0,
  );

  const crowdMatchPercentage =
    completedMoments > 0
      ? Math.round(
          (roundMajorityMatches / completedMoments) * 100,
        )
      : 0;

  const recapMessage = getRoundMessage(
    roundRoasts,
    roundToasts,
    crowdMatchPercentage,
  );

  // =====================================================
  // Celebration Motion
  // =====================================================
  // I keep this animation entirely inside Round Complete.
  // It does not touch gameplay state or session persistence.

  const headlineOpacity = useRef(
    new Animated.Value(reduceMotion ? 1 : 0),
  ).current;

  const headlineY = useRef(
    new Animated.Value(reduceMotion ? 0 : 18),
  ).current;

  const medallionScale = useRef(
    new Animated.Value(reduceMotion ? 1 : 0.86),
  ).current;

  const heatScale = useRef(
    new Animated.Value(reduceMotion ? 1 : 0.78),
  ).current;

  const lowerOpacity = useRef(
    new Animated.Value(reduceMotion ? 1 : 0),
  ).current;

  const lowerY = useRef(
    new Animated.Value(reduceMotion ? 0 : 16),
  ).current;

  const confettiProgress = useRef(
    new Animated.Value(reduceMotion ? 1 : 0),
  ).current;

  useEffect(() => {
    if (reduceMotion) {
      headlineOpacity.setValue(1);
      headlineY.setValue(0);
      medallionScale.setValue(1);
      heatScale.setValue(1);
      lowerOpacity.setValue(1);
      lowerY.setValue(0);
      confettiProgress.setValue(1);
      return;
    }

    headlineOpacity.setValue(0);
    headlineY.setValue(18);
    medallionScale.setValue(0.86);
    heatScale.setValue(0.78);
    lowerOpacity.setValue(0);
    lowerY.setValue(16);
    confettiProgress.setValue(0);

    const celebration = Animated.sequence([
      Animated.parallel([
        Animated.timing(headlineOpacity, {
          toValue: 1,
          duration: 220,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(headlineY, {
          toValue: 0,
          duration: 240,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.spring(medallionScale, {
          toValue: 1,
          speed: 17,
          bounciness: 7,
          useNativeDriver: true,
        }),
        Animated.timing(confettiProgress, {
          toValue: 1,
          duration: 360,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
      Animated.spring(heatScale, {
        toValue: 1,
        speed: 15,
        bounciness: 10,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(lowerOpacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(lowerY, {
          toValue: 0,
          duration: 240,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]);

    celebration.start();

    return () => {
      celebration.stop();
    };
  }, [
    confettiProgress,
    headlineOpacity,
    headlineY,
    heatScale,
    lowerOpacity,
    lowerY,
    medallionScale,
    reduceMotion,
  ]);

  const accessibilitySummary =
    `Round complete. ${config.title}. ` +
    `You earned ${roundHeat} Heat. ` +
    `${roundRoasts} Roasts and ${roundToasts} Toasts. ` +
    `${crowdMatchPercentage} percent with the crowd. ` +
    `Best streak ${progress.bestStreak}.`;

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Return Home"
          onPress={onHomePress}
          hitSlop={8}
          style={({ pressed }) => [
            styles.closeButton,
            pressed && styles.pressed,
          ]}
        >
          <Ionicons
            name="close"
            size={25}
            color={Colors.white}
          />
        </Pressable>

        <View style={styles.topSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View
          accessible
          accessibilityLabel={accessibilitySummary}
          style={styles.summaryGroup}
        >
          <Animated.View
            pointerEvents="none"
            style={[
              styles.confettiLayer,
              {
                opacity: confettiProgress,
                transform: [
                  {
                    translateY: confettiProgress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-18, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Confetti style={styles.confettiOne} color={Colors.heat} />
            <Confetti style={styles.confettiTwo} color={Colors.toast} />
            <Confetti style={styles.confettiThree} color={Colors.roast} />
            <Confetti style={styles.confettiFour} color={Colors.heat} />
            <Confetti style={styles.confettiFive} color={Colors.toast} />
            <Confetti style={styles.confettiSix} color={Colors.roast} />
          </Animated.View>

          <Animated.View
            style={[
              styles.headlineArea,
              {
                opacity: headlineOpacity,
                transform: [{ translateY: headlineY }],
              },
            ]}
          >
            <View style={styles.roundBrush}>
              <Text style={styles.roundBrushText}>ROUND</Text>
            </View>

            <Text style={styles.heading}>COMPLETE!</Text>

            <Text style={styles.roundName}>
              {config.title.toUpperCase()}
            </Text>
          </Animated.View>

          <Animated.View
            style={[
              styles.medallionWrap,
              { transform: [{ scale: medallionScale }] },
            ]}
          >
            <View style={styles.medallion}>
              <VoteMark type="roast" size="large" />

              <View style={styles.medallionVs}>
                <Text style={styles.medallionVsText}>VS</Text>
              </View>

              <VoteMark type="toast" size="large" />
            </View>

            <Text style={styles.voteSplit}>
              {roundRoasts} ROAST
              {"  •  "}
              {roundToasts} TOAST
            </Text>
          </Animated.View>

          <Animated.View
            style={[
              styles.heatArea,
              { transform: [{ scale: heatScale }] },
            ]}
          >
            <Text style={styles.earnedLabel}>YOU EARNED</Text>

            <View style={styles.heatHero}>
              <HeatMark size="medium" />
              <Text style={styles.heatValue}>+{roundHeat}</Text>
            </View>

            <Text style={styles.heatLabel}>HEAT</Text>
          </Animated.View>

          <Animated.View
            style={[
              styles.lowerResults,
              {
                opacity: lowerOpacity,
                transform: [{ translateY: lowerY }],
              },
            ]}
          >
            <Text style={styles.recapMessage}>{recapMessage}</Text>

            <View style={styles.streakStrip}>
              <HeatDot active={progress.bestStreak >= 1} />
              <HeatDot active={progress.bestStreak >= 2} />
              <HeatDot active={progress.bestStreak >= 3} />
              <HeatDot active={progress.bestStreak >= 4} />
              <HeatDot active={progress.bestStreak >= 5} />
            </View>

            <Text style={styles.streakText}>
              BEST STREAK {progress.bestStreak}
            </Text>

            <View style={styles.statsStrip}>
              <StatItem
                value={`${crowdMatchPercentage}%`}
                label="WITH CROWD"
              />
              <View style={styles.statDivider} />
              <StatItem value={completedMoments} label="JUDGED" />
              <View style={styles.statDivider} />
              <StatItem value={roundHeat} label="HEAT" />
            </View>
          </Animated.View>
        </View>

        <Animated.View
          style={[
            styles.actions,
            {
              opacity: lowerOpacity,
              transform: [{ translateY: lowerY }],
            },
          ]}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Choose another round"
            onPress={onPlayAgain}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.pressed,
            ]}
          >
            <View style={styles.buttonSlash} />
            <Text style={styles.primaryButtonText}>NEXT ROUND</Text>
            <Text style={styles.primaryButtonArrow}>→</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Return Home"
            onPress={onHomePress}
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.secondaryButtonText}>VIEW HOME</Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

// =====================================================
// Round Personality
// =====================================================

function getRoundMessage(
  roastCount: number,
  toastCount: number,
  crowdMatchPercentage: number,
): string {
  const totalVotes = roastCount + toastCount;
  const roastPercentage = totalVotes > 0 ? roastCount / totalVotes : 0;
  const toastPercentage = totalVotes > 0 ? toastCount / totalVotes : 0;

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

function Confetti({
  style,
  color,
}: {
  style: object;
  color: string;
}) {
  return (
    <View
      style={[
        styles.confetti,
        style,
        { backgroundColor: color },
      ]}
    />
  );
}

function HeatDot({ active }: { active: boolean }) {
  return (
    <View
      style={[
        styles.heatDot,
        !active && styles.heatDotInactive,
      ]}
    >
      {active && <HeatMark size="small" />}
    </View>
  );
}

function StatItem({
  value,
  label,
}: {
  value: string | number;
  label: string;
}) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#171717",
  },
  topBar: {
    minHeight: 68,
    paddingTop: 18,
    paddingHorizontal: Spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  closeButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  topSpacer: {
    width: 44,
  },
  scrollContent: {
    position: "relative",
    paddingHorizontal: Spacing.lg,
    paddingTop: 1,
    paddingBottom: 44,
    alignItems: "center",
  },
  summaryGroup: {
    width: "100%",
    alignItems: "center",
  },
  headlineArea: {
    alignItems: "center",
  },
  confettiLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  confetti: {
    position: "absolute",
    width: 3,
    height: 13,
    borderRadius: 2,
  },
  confettiOne: {
    left: 14,
    top: 180,
    transform: [{ rotate: "-28deg" }],
  },
  confettiTwo: {
    right: 18,
    top: 205,
    transform: [{ rotate: "31deg" }],
  },
  confettiThree: {
    left: 36,
    top: 335,
    transform: [{ rotate: "20deg" }],
  },
  confettiFour: {
    right: 39,
    top: 395,
    transform: [{ rotate: "-38deg" }],
  },
  confettiFive: {
    left: 28,
    top: 530,
    transform: [{ rotate: "42deg" }],
  },
  confettiSix: {
    right: 22,
    top: 565,
    transform: [{ rotate: "13deg" }],
  },
  roundBrush: {
    backgroundColor: Colors.background,
    paddingVertical: 6,
    paddingHorizontal: 20,
    transform: [{ rotate: "-3deg" }],
  },
  roundBrushText: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 1.7,
  },
  heading: {
    color: Colors.white,
    fontSize: 50,
    fontWeight: "900",
    letterSpacing: -2.2,
    marginTop: 3,
  },
  roundName: {
    color: "#9B9B9B",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.5,
    marginTop: 3,
    marginBottom: 17,
  },
  medallionWrap: {
    alignItems: "center",
  },
  medallion: {
    width: 252,
    height: 190,
    borderRadius: 126,
    backgroundColor: Colors.background,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 8,
  },
  medallionVs: {
    width: 34,
    height: 34,
    backgroundColor: Colors.textPrimary,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    transform: [{ rotate: "-4deg" }],
  },
  medallionVsText: {
    color: Colors.white,
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.8,
  },
  voteSplit: {
    color: "#A0A0A0",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.8,
    marginBottom: 18,
  },
  heatArea: {
    alignItems: "center",
  },
  earnedLabel: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  heatHero: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  heatValue: {
    color: Colors.heat,
    fontSize: 58,
    fontWeight: "900",
    letterSpacing: -2.1,
  },
  heatLabel: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 1.6,
    marginTop: -5,
    marginBottom: 12,
  },
  lowerResults: {
    width: "100%",
    alignItems: "center",
  },
  recapMessage: {
    maxWidth: 310,
    color: "#E4E0DA",
    fontSize: 14,
    fontWeight: "800",
    lineHeight: 20,
    textAlign: "center",
    marginBottom: 15,
  },
  streakStrip: {
    flexDirection: "row",
    gap: 7,
    borderTopColor: "#3A3A3A",
    borderBottomColor: "#3A3A3A",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 7,
    paddingHorizontal: 13,
    marginBottom: 5,
  },
  heatDot: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  heatDotInactive: {
    borderColor: Colors.heatDark,
    borderWidth: 1.4,
    borderRadius: 16,
    opacity: 0.42,
  },
  streakText: {
    color: Colors.white,
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.1,
    marginBottom: 13,
  },
  statsStrip: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderTopColor: "#333333",
    borderBottomColor: "#333333",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 13,
    marginBottom: 21,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "900",
  },
  statLabel: {
    color: "#8F8F8F",
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 0.8,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: "#363636",
  },
  actions: {
    width: "100%",
  },
  primaryButton: {
    position: "relative",
    width: "100%",
    minHeight: 54,
    backgroundColor: Colors.roast,
    paddingVertical: 16,
    paddingHorizontal: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
    marginBottom: 10,
  },
  buttonSlash: {
    position: "absolute",
    left: -16,
    top: -22,
    width: 52,
    height: 100,
    backgroundColor: "rgba(255,255,255,0.10)",
    transform: [{ rotate: "17deg" }],
  },
  primaryButtonText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 1.1,
  },
  primaryButtonArrow: {
    color: Colors.white,
    fontSize: 23,
    fontWeight: "700",
  },
  secondaryButton: {
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 11,
    paddingHorizontal: 16,
  },
  secondaryButtonText: {
    color: "#BEBEBE",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1,
  },
  pressed: {
    opacity: 0.72,
  },
});
