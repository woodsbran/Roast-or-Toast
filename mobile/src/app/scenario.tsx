// =====================================================
// File: scenario.tsx
//
// Screen: Scenario
//
// Purpose:
// Displays a shuffled deck of Roast or Toast Moments,
// allows the player to vote, reveals results, and moves
// through the deck without immediate repeats.
//
// Current Features:
// • Randomized Moment order for every session
// • No repeats until the full deck is completed
// • Automatic reshuffle after the deck is completed
// • Category-based visual styling
// • Changing Roast and Toast phrases
// • Animated results reveal
// • Temporary community percentages and top comments
//
// Later:
// • Store real votes
// • Load live results and comments from Supabase
// • Save session progress
//
// Project: Roast or Toast
// =====================================================

import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { scenarios } from "../data/scenarios";
import type { Moment } from "../data/types";
import {
  CategoryName,
  CategoryThemes,
  Colors,
  Radius,
  Spacing,
} from "../theme";

// The player can choose Roast, Toast, or nothing yet.
type VoteChoice = "roast" | "toast" | null;

// =====================================================
// Shuffle Helper
// =====================================================

// Creates a new shuffled copy of the Moment list.
//
// The original scenarios array is never modified.
function shuffleMoments(moments: Moment[]): Moment[] {
  const shuffledMoments = [...moments];

  // Fisher-Yates shuffle gives every Moment a fair
  // chance of appearing anywhere in the deck.
  for (
    let currentIndex = shuffledMoments.length - 1;
    currentIndex > 0;
    currentIndex -= 1
  ) {
    const randomIndex = Math.floor(
      Math.random() * (currentIndex + 1),
    );

    [
      shuffledMoments[currentIndex],
      shuffledMoments[randomIndex],
    ] = [
      shuffledMoments[randomIndex],
      shuffledMoments[currentIndex],
    ];
  }

  return shuffledMoments;
}

export default function ScenarioScreen() {
  // Creates a shuffled deck only when the screen first loads.
  const [momentDeck, setMomentDeck] = useState<Moment[]>(() =>
    shuffleMoments(scenarios),
  );

  // Tracks the player's position within the shuffled deck.
  const [momentIndex, setMomentIndex] = useState(0);

  // Stores the player's vote for the current Moment.
  const [selectedVote, setSelectedVote] =
    useState<VoteChoice>(null);

  // Controls the bounce effect for each voting button.
  const roastScale = useRef(new Animated.Value(1)).current;
  const toastScale = useRef(new Animated.Value(1)).current;

  // Controls the fade-and-rise animation for results.
  const resultsOpacity = useRef(new Animated.Value(0)).current;
  const resultsPosition = useRef(new Animated.Value(18)).current;

  // Gets the current Moment from the shuffled deck.
  const currentMoment = momentDeck[momentIndex];

  // Gets the correct visual theme for the current category.
  //
  // Everyday Life is used as a fallback if a category
  // does not yet have a custom theme.
  const categoryTheme =
    CategoryThemes[currentMoment.category as CategoryName] ??
    CategoryThemes["Everyday Life"];

  // =====================================================
  // Animation Helpers
  // =====================================================

  // Gives the selected voting button a small bounce.
  const animateVoteButton = (animation: Animated.Value) => {
    Animated.sequence([
      Animated.spring(animation, {
        toValue: 0.96,
        useNativeDriver: true,
        speed: 35,
        bounciness: 2,
      }),

      Animated.spring(animation, {
        toValue: 1,
        useNativeDriver: true,
        speed: 28,
        bounciness: 7,
      }),
    ]).start();
  };

  // Reveals the results with a short fade-and-rise effect.
  const revealResults = () => {
    resultsOpacity.setValue(0);
    resultsPosition.setValue(18);

    Animated.parallel([
      Animated.timing(resultsOpacity, {
        toValue: 1,
        duration: 280,
        useNativeDriver: true,
      }),

      Animated.spring(resultsPosition, {
        toValue: 0,
        useNativeDriver: true,
        speed: 18,
        bounciness: 4,
      }),
    ]).start();
  };

  // =====================================================
  // Voting
  // =====================================================

  // Records a Roast vote.
  const handleRoastVote = () => {
    // Prevents the player from changing their vote.
    if (selectedVote) {
      return;
    }

    setSelectedVote("roast");
    animateVoteButton(roastScale);
    revealResults();
  };

  // Records a Toast vote.
  const handleToastVote = () => {
    // Prevents the player from changing their vote.
    if (selectedVote) {
      return;
    }

    setSelectedVote("toast");
    animateVoteButton(toastScale);
    revealResults();
  };

  // =====================================================
  // Deck Navigation
  // =====================================================

  // Moves to the next Moment in the shuffled deck.
  //
  // After the final Moment, a new deck is shuffled.
  const handleNextMoment = () => {
    const reachedEndOfDeck =
      momentIndex === momentDeck.length - 1;

    if (reachedEndOfDeck) {
      let newDeck = shuffleMoments(scenarios);

      // Prevents the first Moment of the new deck from
      // matching the Moment the player just completed.
      if (
        newDeck.length > 1 &&
        newDeck[0].id === currentMoment.id
      ) {
        [newDeck[0], newDeck[1]] = [newDeck[1], newDeck[0]];
      }

      setMomentDeck(newDeck);
      setMomentIndex(0);
    } else {
      setMomentIndex((currentIndex) => currentIndex + 1);
    }

    // Clears the previous vote for the new Moment.
    setSelectedVote(null);

    // Resets the results animation.
    resultsOpacity.setValue(0);
    resultsPosition.setValue(18);
  };

  // Returns the player to the Home screen.
  const handleBackPress = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* =================================================
          Category Background

          These decorations change automatically based
          on the category of the current Moment.
      ================================================= */}

      {/* Large faded category name */}
      <View style={styles.categoryBackdrop}>
        <Text
          style={[
            styles.categoryBackdropText,
            { color: categoryTheme.accent },
          ]}
        >
          {categoryTheme.label}
        </Text>
      </View>

      {/* Soft category-colored circle */}
      <View
        style={[
          styles.categoryCircle,
          { backgroundColor: categoryTheme.soft },
        ]}
      />

      {/* Main Roast or Toast brand decorations */}
      <View style={styles.roastBackdrop}>
        <Text style={styles.roastBackdropText}>ROAST</Text>
      </View>

      <View style={styles.toastBackdrop}>
        <Text style={styles.toastBackdropText}>TOAST</Text>
      </View>

      {/* =================================================
          Top Navigation
      ================================================= */}

      <View style={styles.topBar}>
        {/* Back button */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Return to Home"
          onPress={handleBackPress}
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.backArrow}>←</Text>
        </Pressable>

        {/* App name and changing category dot */}
        <View style={styles.smallLogoContainer}>
          <View
            style={[
              styles.categoryDot,
              { backgroundColor: categoryTheme.accent },
            ]}
          />

          <Text style={styles.smallLogo}>Roast or Toast</Text>
        </View>

        {/* Keeps the logo centered */}
        <View style={styles.topBarSpacer} />
      </View>

      {/* =================================================
          Main Content
      ================================================= */}

      <View style={styles.content}>
        {/* Category badge */}
        <View
          style={[
            styles.categoryBadge,
            {
              backgroundColor: categoryTheme.soft,
              borderColor: categoryTheme.accent,
            },
          ]}
        >
          <Text
            style={[
              styles.categoryBadgeText,
              { color: categoryTheme.accent },
            ]}
          >
            {categoryTheme.label}
          </Text>
        </View>

        {/* Main Moment text */}
        <Text style={styles.scenarioText}>
          {currentMoment.question}
        </Text>

        {/* Voting options shown before the player votes */}
        {!selectedVote && (
          <>
            <Text style={styles.votePrompt}>Let&apos;s get real...</Text>

            <View style={styles.buttonContainer}>
              {/* Roast option */}
              <Animated.View
                style={{
                  transform: [{ scale: roastScale }],
                }}
              >
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Vote Roast"
                  onPress={handleRoastVote}
                  style={({ pressed }) => [
                    styles.voteButton,
                    styles.voteButtonIdle,
                    pressed && styles.buttonPressed,
                  ]}
                >
                  <View style={styles.voteButtonContent}>
                    <Text style={styles.roastIcon}>🔥</Text>

                    <View style={styles.voteTextContainer}>
                      <Text style={styles.voteButtonText}>
                        Roast
                      </Text>

                      <Text style={styles.voteButtonSubtext}>
                        {currentMoment.roastPhrase}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              </Animated.View>

              {/* Toast option */}
              <Animated.View
                style={{
                  transform: [{ scale: toastScale }],
                }}
              >
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Vote Toast"
                  onPress={handleToastVote}
                  style={({ pressed }) => [
                    styles.voteButton,
                    styles.voteButtonIdle,
                    pressed && styles.buttonPressed,
                  ]}
                >
                  <View style={styles.voteButtonContent}>
                    <Text style={styles.toastIcon}>♥</Text>

                    <View style={styles.voteTextContainer}>
                      <Text style={styles.voteButtonText}>
                        Toast
                      </Text>

                      <Text style={styles.voteButtonSubtext}>
                        {currentMoment.toastPhrase}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              </Animated.View>
            </View>
          </>
        )}

        {/* =================================================
            Results

            Results fade and rise into view after voting.
        ================================================= */}

        {selectedVote && (
          <Animated.View
            style={[
              styles.resultsContainer,
              {
                opacity: resultsOpacity,
                transform: [
                  {
                    translateY: resultsPosition,
                  },
                ],
              },
            ]}
          >
            <Text style={styles.resultsHeading}>
              The People Have Spoken
            </Text>

            {/* Confirms the player's choice */}
            <Text style={styles.yourVoteText}>
              You chose{" "}
              <Text
                style={
                  selectedVote === "roast"
                    ? styles.roastText
                    : styles.toastText
                }
              >
                {selectedVote === "roast"
                  ? "Roast"
                  : "Toast"}
              </Text>
            </Text>

            {/* Roast result */}
            <View style={styles.resultSection}>
              <View style={styles.resultLabelRow}>
                <Text style={styles.resultLabel}>
                  🔥 Roast
                </Text>

                <Text style={styles.resultPercentage}>
                  {currentMoment.roastPercentage}%
                </Text>
              </View>

              <View style={styles.resultBarBackground}>
                <View
                  style={[
                    styles.resultBarFill,
                    styles.roastResultBar,
                    {
                      width: `${currentMoment.roastPercentage}%`,
                    },
                  ]}
                />
              </View>
            </View>

            {/* Toast result */}
            <View style={styles.resultSection}>
              <View style={styles.resultLabelRow}>
                <Text style={styles.resultLabel}>♥ Toast</Text>

                <Text style={styles.resultPercentage}>
                  {currentMoment.toastPercentage}%
                </Text>
              </View>

              <View style={styles.resultBarBackground}>
                <View
                  style={[
                    styles.resultBarFill,
                    styles.toastResultBar,
                    {
                      width: `${currentMoment.toastPercentage}%`,
                    },
                  ]}
                />
              </View>
            </View>

            {/* Temporary top community comment */}
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
                  { color: categoryTheme.accent },
                ]}
              >
                TOP COMMENT
              </Text>

              <Text style={styles.commentText}>
                “{currentMoment.topComment}”
              </Text>
            </View>

            {/* Moves to the next shuffled Moment */}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Show next moment"
              onPress={handleNextMoment}
              style={({ pressed }) => [
                styles.nextButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.nextButtonText}>Next</Text>
              <Text style={styles.nextButtonArrow}>→</Text>
            </Pressable>
          </Animated.View>
        )}
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

  // =====================================================
  // Top Navigation
  // =====================================================

  topBar: {
    paddingTop: 68,
    paddingHorizontal: Spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 3,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: Radius.pill,
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  backArrow: {
    color: Colors.textPrimary,
    fontSize: 25,
    fontWeight: "600",
  },

  smallLogoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 7,
  },

  smallLogo: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: -0.6,
  },

  topBarSpacer: {
    width: 44,
  },

  // =====================================================
  // Main Content
  // =====================================================

  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: Spacing.lg,
    paddingBottom: 28,
    zIndex: 2,
  },

  categoryBadge: {
    alignSelf: "flex-start",
    borderWidth: 1.5,
    borderRadius: Radius.pill,
    paddingVertical: 7,
    paddingHorizontal: 15,
    marginBottom: 25,
    transform: [{ rotate: "-2deg" }],
  },

  categoryBadgeText: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.7,
  },

  scenarioText: {
    color: Colors.textPrimary,
    fontSize: 37,
    fontWeight: "900",
    letterSpacing: -1.6,
    lineHeight: 47,
    marginBottom: 30,
  },

  votePrompt: {
    color: Colors.textSecondary,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: Spacing.md,
  },

  // =====================================================
  // Voting Buttons
  // =====================================================

  buttonContainer: {
    gap: 14,
  },

  voteButton: {
    minHeight: 86,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    paddingVertical: 16,
    paddingHorizontal: 19,
    flexDirection: "row",
    alignItems: "center",
  },

  voteButtonIdle: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
  },

  buttonPressed: {
    opacity: 0.76,
  },

  voteButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },

  voteTextContainer: {
    flexShrink: 1,
  },

  roastIcon: {
    fontSize: 28,
    marginRight: 15,
  },

  toastIcon: {
    color: Colors.toast,
    fontSize: 31,
    fontWeight: "900",
    marginRight: 15,
  },

  voteButtonText: {
    color: Colors.textPrimary,
    fontSize: 20,
    fontWeight: "900",
  },

  voteButtonSubtext: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: "600",
    marginTop: 3,
  },

  // =====================================================
  // Results
  // =====================================================

  resultsContainer: {
    marginTop: -5,
  },

  resultsHeading: {
    color: Colors.textPrimary,
    fontSize: 26,
    fontWeight: "900",
    marginBottom: 5,
  },

  yourVoteText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 23,
  },

  roastText: {
    color: Colors.roast,
    fontWeight: "900",
  },

  toastText: {
    color: Colors.toast,
    fontWeight: "900",
  },

  resultSection: {
    marginBottom: 17,
  },

  resultLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  resultLabel: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: "800",
  },

  resultPercentage: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: "900",
  },

  resultBarBackground: {
    height: 12,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.pill,
    overflow: "hidden",
  },

  resultBarFill: {
    height: "100%",
    borderRadius: Radius.pill,
  },

  roastResultBar: {
    backgroundColor: Colors.roast,
  },

  toastResultBar: {
    backgroundColor: Colors.toast,
  },

  // =====================================================
  // Comment and Next Button
  // =====================================================

  commentCard: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    borderLeftWidth: 5,
    borderRadius: Radius.lg,
    padding: 18,
    marginTop: 8,
    marginBottom: 20,
  },

  commentLabel: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.5,
    marginBottom: 8,
  },

  commentText: {
    color: Colors.textPrimary,
    fontSize: 17,
    fontWeight: "700",
    lineHeight: 24,
  },

  nextButton: {
    backgroundColor: Colors.textPrimary,
    borderRadius: Radius.pill,
    paddingVertical: 16,
    paddingHorizontal: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  nextButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "900",
  },

  nextButtonArrow: {
    color: Colors.white,
    fontSize: 23,
  },

  // =====================================================
  // Category Background Decorations
  // =====================================================

  categoryBackdrop: {
    position: "absolute",
    top: 132,
    right: -48,
    transform: [{ rotate: "8deg" }],
  },

  categoryBackdropText: {
    fontSize: 76,
    fontWeight: "900",
    letterSpacing: -4,
    opacity: 0.09,
  },

  categoryCircle: {
    position: "absolute",
    width: 235,
    height: 235,
    borderRadius: 118,
    bottom: -105,
    right: -90,
    opacity: 0.75,
  },

  // =====================================================
  // Roast or Toast Brand Decorations
  // =====================================================

  roastBackdrop: {
    position: "absolute",
    top: 225,
    left: -40,
    transform: [{ rotate: "-8deg" }],
  },

  roastBackdropText: {
    color: Colors.roast,
    fontSize: 70,
    fontWeight: "900",
    letterSpacing: -4,
    opacity: 0.04,
  },

  toastBackdrop: {
    position: "absolute",
    bottom: 35,
    left: -42,
    transform: [{ rotate: "-8deg" }],
  },

  toastBackdropText: {
    color: Colors.toast,
    fontSize: 78,
    fontWeight: "900",
    letterSpacing: -4,
    opacity: 0.055,
  },
});