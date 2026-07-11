// =====================================================
// File: GuessTheCrowdCard.tsx
//
// Special Mode: Guess the Crowd
//
// Purpose:
// Gives the player a fresh Moment and asks them to:
//
// 1. Predict what most people chose.
// 2. Give their own personal vote.
// 3. Compare both choices with the community results.
// 4. Earn Heat for completing the round.
//
// Project: Roast or Toast
// =====================================================

import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import type { Moment } from "../data/types";
import type {
  CrowdGuessProgressResult,
  PlayerVote,
} from "../game/progressTypes";

import {
  CategoryName,
  CategoryThemes,
  Colors,
  Radius,
  Spacing,
} from "../theme";

// The three stages within Guess the Crowd.
type GuessStage = "prediction" | "personalVote" | "results";

// Information required by this special mode.
type GuessTheCrowdCardProps = {
  moment: Moment;

  // Records the prediction in the Heat engine and
  // returns the reward information.
  onRecordGuess: (
    prediction: PlayerVote,
    roastPercentage: number,
    toastPercentage: number,
  ) => CrowdGuessProgressResult;

  onContinue: () => void;
};

export default function GuessTheCrowdCard({
  moment,
  onRecordGuess,
  onContinue,
}: GuessTheCrowdCardProps) {
  // Tracks which stage is currently visible.
  const [stage, setStage] =
    useState<GuessStage>("prediction");

  // Stores what the player believes the crowd chose.
  const [crowdPrediction, setCrowdPrediction] =
    useState<PlayerVote | null>(null);

  // Stores the player's personal opinion.
  const [personalVote, setPersonalVote] =
    useState<PlayerVote | null>(null);

  // Stores the Heat result after the prediction is scored.
  const [progressResult, setProgressResult] =
    useState<CrowdGuessProgressResult | null>(null);

  // Gets the correct category styling.
  const categoryTheme =
    CategoryThemes[moment.category as CategoryName] ??
    CategoryThemes["Everyday Life"];

  // Saves the crowd prediction without revealing whether
  // it was correct yet.
  const handlePrediction = (choice: PlayerVote) => {
    setCrowdPrediction(choice);
    setStage("personalVote");
  };

  // Saves the player's own opinion, records the crowd
  // prediction, and reveals results.
  const handlePersonalVote = (choice: PlayerVote) => {
    if (!crowdPrediction) {
      return;
    }

    const result = onRecordGuess(
      crowdPrediction,
      moment.roastPercentage,
      moment.toastPercentage,
    );

    setPersonalVote(choice);
    setProgressResult(result);
    setStage("results");
  };

  return (
    <View style={styles.container}>
      {/* Decorative backdrop words */}
      <Text style={styles.roastBackdrop}>ROAST</Text>
      <Text style={styles.toastBackdrop}>TOAST</Text>

      {/* Soft category decoration */}
      <View
        style={[
          styles.categoryCircle,
          {
            backgroundColor: categoryTheme.soft,
          },
        ]}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Special mode badge */}
        <View
          style={[
            styles.modeBadge,
            {
              borderColor: categoryTheme.accent,
              backgroundColor: categoryTheme.soft,
            },
          ]}
        >
          <Text
            style={[
              styles.modeBadgeText,
              {
                color: categoryTheme.accent,
              },
            ]}
          >
            GUESS THE CROWD
          </Text>
        </View>

        {/* Category name */}
        <Text
          style={[
            styles.categoryLabel,
            {
              color: categoryTheme.accent,
            },
          ]}
        >
          {categoryTheme.label}
        </Text>

        {/* Fresh Moment */}
        <Text style={styles.question}>
          {moment.question}
        </Text>

        {/* =================================================
            Stage 1: Predict the Crowd
        ================================================= */}

        {stage === "prediction" && (
          <View>
            <Text style={styles.stageHeading}>
              What did most people choose?
            </Text>

            <Text style={styles.stageDescription}>
              Predict the crowd before giving your own answer.
            </Text>

            <View style={styles.choiceContainer}>
              <ChoiceButton
                label="Roast"
                phrase="The crowd roasted it."
                type="roast"
                onPress={() => handlePrediction("roast")}
              />

              <ChoiceButton
                label="Toast"
                phrase="The crowd approved."
                type="toast"
                onPress={() => handlePrediction("toast")}
              />
            </View>
          </View>
        )}

        {/* =================================================
            Stage 2: Personal Vote
        ================================================= */}

        {stage === "personalVote" && crowdPrediction && (
          <View>
            <Text style={styles.savedChoiceLabel}>
              Your crowd prediction
            </Text>

            <Text
              style={[
                styles.savedChoice,
                crowdPrediction === "roast"
                  ? styles.roastText
                  : styles.toastText,
              ]}
            >
              {crowdPrediction === "roast"
                ? "Roast"
                : "Toast"}
            </Text>

            <Text style={styles.stageHeading}>
              Now, what do you think?
            </Text>

            <Text style={styles.stageDescription}>
              Your own answer can be completely different.
            </Text>

            <View style={styles.choiceContainer}>
              <ChoiceButton
                label="Roast"
                phrase={moment.roastPhrase}
                type="roast"
                onPress={() =>
                  handlePersonalVote("roast")
                }
              />

              <ChoiceButton
                label="Toast"
                phrase={moment.toastPhrase}
                type="toast"
                onPress={() =>
                  handlePersonalVote("toast")
                }
              />
            </View>
          </View>
        )}

        {/* =================================================
            Stage 3: Results
        ================================================= */}

        {stage === "results" &&
          crowdPrediction &&
          personalVote &&
          progressResult && (
            <View>
              <Text style={styles.resultsHeading}>
                The People Have Spoken
              </Text>

              {/* Prediction and personal vote summary */}
              <View style={styles.choiceSummary}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>
                    Crowd guess
                  </Text>

                  <Text
                    style={[
                      styles.summaryValue,
                      crowdPrediction === "roast"
                        ? styles.roastText
                        : styles.toastText,
                    ]}
                  >
                    {crowdPrediction === "roast"
                      ? "Roast"
                      : "Toast"}
                  </Text>
                </View>

                <View style={styles.summaryDivider} />

                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>
                    Your vote
                  </Text>

                  <Text
                    style={[
                      styles.summaryValue,
                      personalVote === "roast"
                        ? styles.roastText
                        : styles.toastText,
                    ]}
                  >
                    {personalVote === "roast"
                      ? "Roast"
                      : "Toast"}
                  </Text>
                </View>
              </View>

              {/* Heat reward */}
              <View style={styles.heatCard}>
                <Text style={styles.heatAmount}>
                  🔥 +{progressResult.heatEarned} Heat
                </Text>

                <Text style={styles.heatMessage}>
                  {progressResult.guessedCorrectly
                    ? "You called it."
                    : "The crowd surprised you."}
                </Text>
              </View>

              {/* Roast result */}
              <ResultBar
                label="🔥 Roast"
                percentage={moment.roastPercentage}
                fillColor={Colors.roast}
              />

              {/* Toast result */}
              <ResultBar
                label="♥ Toast"
                percentage={moment.toastPercentage}
                fillColor={Colors.toast}
              />

              {/* Top comment */}
              <View
                style={[
                  styles.commentCard,
                  {
                    borderLeftColor: categoryTheme.accent,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.commentLabel,
                    {
                      color: categoryTheme.accent,
                    },
                  ]}
                >
                  TOP COMMENT
                </Text>

                <Text style={styles.commentText}>
                  “{moment.topComment}”
                </Text>
              </View>

              {/* Returns to regular gameplay */}
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Continue playing"
                onPress={onContinue}
                style={({ pressed }) => [
                  styles.continueButton,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Text style={styles.continueButtonText}>
                  Keep Going
                </Text>

                <Text style={styles.continueArrow}>→</Text>
              </Pressable>
            </View>
          )}
      </ScrollView>
    </View>
  );
}

// =====================================================
// Choice Button
// =====================================================

type ChoiceButtonProps = {
  label: string;
  phrase: string;
  type: PlayerVote;
  onPress: () => void;
};

function ChoiceButton({
  label,
  phrase,
  type,
  onPress,
}: ChoiceButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Choose ${label}`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.choiceButton,
        pressed && styles.buttonPressed,
      ]}
    >
      <Text
        style={[
          styles.choiceIcon,
          type === "toast" && styles.toastIcon,
        ]}
      >
        {type === "roast" ? "🔥" : "♥"}
      </Text>

      <View style={styles.choiceTextContainer}>
        <Text style={styles.choiceLabel}>{label}</Text>
        <Text style={styles.choicePhrase}>{phrase}</Text>
      </View>
    </Pressable>
  );
}

// =====================================================
// Result Bar
// =====================================================

type ResultBarProps = {
  label: string;
  percentage: number;
  fillColor: string;
};

function ResultBar({
  label,
  percentage,
  fillColor,
}: ResultBarProps) {
  return (
    <View style={styles.resultSection}>
      <View style={styles.resultLabelRow}>
        <Text style={styles.resultLabel}>{label}</Text>

        <Text style={styles.resultPercentage}>
          {percentage}%
        </Text>
      </View>

      <View style={styles.resultBarBackground}>
        <View
          style={[
            styles.resultBarFill,
            {
              width: `${percentage}%`,
              backgroundColor: fillColor,
            },
          ]}
        />
      </View>
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

  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: Spacing.lg,
    paddingTop: 72,
    paddingBottom: 48,
    zIndex: 2,
  },

  modeBadge: {
    alignSelf: "flex-start",
    borderWidth: 1.5,
    borderRadius: Radius.pill,
    paddingVertical: 7,
    paddingHorizontal: 15,
    marginBottom: 20,
    transform: [{ rotate: "-2deg" }],
  },

  modeBadgeText: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.7,
  },

  categoryLabel: {
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 1.3,
    marginBottom: 12,
  },

  question: {
    color: Colors.textPrimary,
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: -1.5,
    lineHeight: 43,
    marginBottom: 30,
  },

  stageHeading: {
    color: Colors.textPrimary,
    fontSize: 23,
    fontWeight: "900",
    lineHeight: 30,
    marginBottom: 6,
  },

  stageDescription: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 21,
    marginBottom: 20,
  },

  choiceContainer: {
    gap: 13,
  },

  choiceButton: {
    minHeight: 82,
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1.5,
    borderRadius: Radius.lg,
    paddingVertical: 15,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
  },

  buttonPressed: {
    opacity: 0.72,
    transform: [{ scale: 0.985 }],
  },

  choiceIcon: {
    fontSize: 27,
    marginRight: 14,
  },

  toastIcon: {
    color: Colors.toast,
    fontSize: 30,
    fontWeight: "900",
  },

  choiceTextContainer: {
    flexShrink: 1,
  },

  choiceLabel: {
    color: Colors.textPrimary,
    fontSize: 19,
    fontWeight: "900",
  },

  choicePhrase: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: "600",
    marginTop: 3,
  },

  savedChoiceLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },

  savedChoice: {
    fontSize: 21,
    fontWeight: "900",
    marginTop: 3,
    marginBottom: 25,
  },

  resultsHeading: {
    color: Colors.textPrimary,
    fontSize: 27,
    fontWeight: "900",
    marginBottom: 18,
  },

  choiceSummary: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: Radius.lg,
    paddingVertical: 15,
    paddingHorizontal: 18,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  summaryItem: {
    flex: 1,
  },

  summaryLabel: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  summaryValue: {
    fontSize: 18,
    fontWeight: "900",
    marginTop: 4,
  },

  summaryDivider: {
    width: 1,
    height: 37,
    backgroundColor: Colors.border,
    marginHorizontal: 15,
  },

  heatCard: {
    backgroundColor: "#FFF1EC",
    borderColor: "#F4C9BE",
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 20,
  },

  heatAmount: {
    color: Colors.roast,
    fontSize: 15,
    fontWeight: "900",
  },

  heatMessage: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 4,
  },

  roastText: {
    color: Colors.roast,
  },

  toastText: {
    color: Colors.toast,
  },

  resultSection: {
    marginBottom: 16,
  },

  resultLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 7,
  },

  resultLabel: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: "800",
  },

  resultPercentage: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: "900",
  },

  resultBarBackground: {
    height: 11,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.pill,
    overflow: "hidden",
  },

  resultBarFill: {
    height: "100%",
    borderRadius: Radius.pill,
  },

  commentCard: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    borderLeftWidth: 5,
    borderRadius: Radius.lg,
    padding: 16,
    marginTop: 5,
    marginBottom: 18,
  },

  commentLabel: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.4,
    marginBottom: 7,
  },

  commentText: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 22,
  },

  continueButton: {
    backgroundColor: Colors.textPrimary,
    borderRadius: Radius.pill,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    top: 70,
    right: -48,
    color: Colors.roast,
    fontSize: 91,
    fontWeight: "900",
    letterSpacing: -5,
    opacity: 0.07,
    transform: [{ rotate: "8deg" }],
  },

  toastBackdrop: {
    position: "absolute",
    bottom: 50,
    left: -43,
    color: Colors.toast,
    fontSize: 89,
    fontWeight: "900",
    letterSpacing: -5,
    opacity: 0.07,
    transform: [{ rotate: "-8deg" }],
  },

  categoryCircle: {
    position: "absolute",
    width: 230,
    height: 230,
    borderRadius: 115,
    bottom: -105,
    right: -90,
    opacity: 0.75,
  },
});