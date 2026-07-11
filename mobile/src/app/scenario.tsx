// =====================================================
// File: scenario.tsx
//
// Screen: Scenario
//
// Purpose:
// Controls the main Roast or Toast gameplay experience.
//
// Responsibilities:
// • Creates a shuffled, no-repeat Moment deck
// • Records regular Roast or Toast votes
// • Tracks Heat, levels, streaks, and titles
// • Displays Guess the Crowd
// • Displays Quick Break
// • Displays Session Recap
// • Keeps result content scrollable
// • Keeps the Next button fixed and easy to reach
//
// Project: Roast or Toast
// =====================================================

import { router } from "expo-router";
import { useRef, useState } from "react";

import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import GuessTheCrowdCard from "../components/GuessTheCrowdCard";
import IntermissionCard from "../components/IntermissionCard";
import PlayerBadge from "../components/PlayerBadge";
import ResultsCard from "../components/ResultsCard";
import ScenarioCard from "../components/ScenarioCard";
import ScenarioHeader from "../components/ScenarioHeader";
import SessionRecapCard from "../components/SessionRecapCard";

import VoteButtons, {
  VoteChoice,
} from "../components/VoteButtons";

import { scenarios } from "../data/scenarios";
import type { Moment } from "../data/types";

import type { VoteProgressResult } from "../game/progressTypes";

import { usePlayerProgress } from "../hooks/usePlayerProgress";

import {
  CategoryName,
  CategoryThemes,
  Colors,
  Radius,
  Spacing,
} from "../theme";

// A special gameplay event appears after every five
// completed regular Moments.
const INTERMISSION_FREQUENCY = 5;

// Special gameplay screen currently being displayed.
type IntermissionType =
  | "quick"
  | "guess"
  | "recap"
  | null;

// Stores where the regular deck should resume after
// Guess the Crowd consumes a fresh Moment.
type ResumePosition = {
  deck: Moment[];
  index: number;
};

// =====================================================
// Shuffle Helpers
// =====================================================

// Creates a randomized copy of the supplied Moment list.
//
// The original scenarios list is never changed.
function shuffleMoments(moments: Moment[]): Moment[] {
  const shuffledMoments = [...moments];

  // Fisher-Yates shuffle.
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

// Creates a fresh shuffled deck.
//
// When possible, the new deck will not begin with the
// same Moment that the player just completed.
function createFreshDeck(lastMomentId?: string): Moment[] {
  const newDeck = shuffleMoments(scenarios);

  if (
    lastMomentId &&
    newDeck.length > 1 &&
    newDeck[0].id === lastMomentId
  ) {
    [newDeck[0], newDeck[1]] = [
      newDeck[1],
      newDeck[0],
    ];
  }

  return newDeck;
}

export default function ScenarioScreen() {
  // =====================================================
  // Player Progress
  // =====================================================

  const {
    progress,
    addRegularVote,
    addCrowdGuess,
  } = usePlayerProgress();

  // Stores reward information from the latest regular
  // Roast or Toast vote.
  const [lastVoteResult, setLastVoteResult] =
    useState<VoteProgressResult | null>(null);

  // =====================================================
  // Shuffled Moment Deck
  // =====================================================

  // Creates one shuffled deck when the screen opens.
  const [momentDeck, setMomentDeck] = useState<Moment[]>(() =>
    createFreshDeck(),
  );

  // Tracks the player's current position in the deck.
  const [momentIndex, setMomentIndex] = useState(0);

  // Stores the player's current Roast or Toast selection.
  const [selectedVote, setSelectedVote] =
    useState<VoteChoice>(null);

  // Counts regular Moments completed during this session.
  const [completedMoments, setCompletedMoments] =
    useState(0);

  // =====================================================
  // Special Gameplay Modes
  // =====================================================

  // Tracks which special mode is currently visible.
  const [intermissionType, setIntermissionType] =
    useState<IntermissionType>(null);

  // Stores the fresh Moment used by Guess the Crowd.
  const [guessMoment, setGuessMoment] =
    useState<Moment | null>(null);

  // Stores the deck position that should load when Guess
  // the Crowd is complete.
  const [resumePosition, setResumePosition] =
    useState<ResumePosition | null>(null);

  // =====================================================
  // Animations
  // =====================================================

  // Controls the Roast button bounce.
  const roastScale = useRef(
    new Animated.Value(1),
  ).current;

  // Controls the Toast button bounce.
  const toastScale = useRef(
    new Animated.Value(1),
  ).current;

  // Controls result opacity.
  const resultsOpacity = useRef(
    new Animated.Value(0),
  ).current;

  // Controls the result upward movement.
  const resultsPosition = useRef(
    new Animated.Value(18),
  ).current;

  // Current regular Moment.
  const currentMoment = momentDeck[momentIndex];

  // Visual category theme for the current Moment.
  const categoryTheme =
    CategoryThemes[currentMoment.category as CategoryName] ??
    CategoryThemes["Everyday Life"];

  // =====================================================
  // Animation Helpers
  // =====================================================

  // Gives the selected voting button a quick bounce.
  const animateVoteButton = (
    animation: Animated.Value,
  ) => {
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

  // Fades and raises the results into view.
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
  // Regular Voting
  // =====================================================

  // Handles either a Roast or Toast vote.
  const recordVote = (
    vote: Exclude<VoteChoice, null>,
    animation: Animated.Value,
  ) => {
    // Prevents changing the vote after selecting.
    if (selectedVote) {
      return;
    }

    // Updates Heat, level, totals, and streaks.
    const progressResult = addRegularVote(
      vote,
      currentMoment.roastPercentage,
      currentMoment.toastPercentage,
    );

    setSelectedVote(vote);
    setLastVoteResult(progressResult);

    animateVoteButton(animation);
    revealResults();
  };

  // Records a Roast vote.
  const handleRoastVote = () => {
    recordVote("roast", roastScale);
  };

  // Records a Toast vote.
  const handleToastVote = () => {
    recordVote("toast", toastScale);
  };

  // =====================================================
  // Regular Deck Movement
  // =====================================================

  // Clears the previous vote and result state.
  const resetRegularMoment = () => {
    setSelectedVote(null);
    setLastVoteResult(null);

    resultsOpacity.setValue(0);
    resultsPosition.setValue(18);
  };

  // Moves to the next regular Moment.
  //
  // If the player reaches the end, a fresh deck is
  // shuffled automatically.
  const moveToNextMoment = () => {
    const reachedEndOfDeck =
      momentIndex === momentDeck.length - 1;

    if (reachedEndOfDeck) {
      setMomentDeck(
        createFreshDeck(currentMoment.id),
      );

      setMomentIndex(0);
    } else {
      setMomentIndex(
        (currentIndex) => currentIndex + 1,
      );
    }

    resetRegularMoment();
  };

  // =====================================================
  // Guess the Crowd Preparation
  // =====================================================

  // Removes a fresh, unseen Moment from the regular deck
  // and uses it for Guess the Crowd.
  const prepareGuessTheCrowd = () => {
    const nextIndex = momentIndex + 1;
    const indexAfterGuess = momentIndex + 2;

    // At least two unused Moments remain.
    if (indexAfterGuess < momentDeck.length) {
      setGuessMoment(momentDeck[nextIndex]);

      setResumePosition({
        deck: momentDeck,
        index: indexAfterGuess,
      });

      setIntermissionType("guess");
      return;
    }

    // Exactly one unused Moment remains.
    if (nextIndex < momentDeck.length) {
      const specialMoment =
        momentDeck[nextIndex];

      const newDeck =
        createFreshDeck(specialMoment.id);

      setGuessMoment(specialMoment);

      setResumePosition({
        deck: newDeck,
        index: 0,
      });

      setIntermissionType("guess");
      return;
    }

    // The current Moment was the last item in the deck.
    const newDeck =
      createFreshDeck(currentMoment.id);

    const specialMoment = newDeck[0];

    setGuessMoment(specialMoment);

    setResumePosition({
      deck: newDeck,
      index: newDeck.length > 1 ? 1 : 0,
    });

    setIntermissionType("guess");
  };

  // =====================================================
  // Special Event Selection
  // =====================================================

  // Runs when the player presses Next after viewing
  // regular results.
  const handleNextMoment = () => {
    const newCompletedTotal =
      completedMoments + 1;

    setCompletedMoments(newCompletedTotal);

    const shouldShowSpecialEvent =
      newCompletedTotal %
        INTERMISSION_FREQUENCY ===
      0;

    // Continue to a normal Moment when a special event is
    // not due yet.
    if (!shouldShowSpecialEvent) {
      moveToNextMoment();
      return;
    }

    // Determines which numbered break this is.
    //
    // Break 1 = after 5 Moments
    // Break 2 = after 10 Moments
    // Break 3 = after 15 Moments
    const breakNumber =
      newCompletedTotal /
      INTERMISSION_FREQUENCY;

    // Repeating rhythm:
    //
    // 1. Guess the Crowd
    // 2. Quick Break
    // 3. Session Recap
    const eventPosition = breakNumber % 3;

    if (eventPosition === 1) {
      prepareGuessTheCrowd();
      return;
    }

    if (eventPosition === 2) {
      setIntermissionType("quick");
      return;
    }

    setIntermissionType("recap");
  };

  // =====================================================
  // Special Event Continuation
  // =====================================================

  // Continues after Quick Break.
  const handleContinueAfterQuickBreak = () => {
    setIntermissionType(null);
    moveToNextMoment();
  };

  // Continues after Session Recap.
  const handleContinueAfterRecap = () => {
    setIntermissionType(null);
    moveToNextMoment();
  };

  // Continues after Guess the Crowd.
  const handleContinueAfterGuess = () => {
    if (!resumePosition) {
      setIntermissionType(null);
      moveToNextMoment();
      return;
    }

    setMomentDeck(resumePosition.deck);
    setMomentIndex(resumePosition.index);

    setIntermissionType(null);
    setGuessMoment(null);
    setResumePosition(null);

    resetRegularMoment();
  };

  // Returns the player to the Home screen.
  const handleBackPress = () => {
    router.back();
  };

  // =====================================================
  // Special Screens
  // =====================================================

  // Quick Break screen.
  if (intermissionType === "quick") {
    return (
      <IntermissionCard
        completedMoments={completedMoments}
        onContinue={
          handleContinueAfterQuickBreak
        }
      />
    );
  }

  // Guess the Crowd screen.
  if (
    intermissionType === "guess" &&
    guessMoment
  ) {
    return (
      <GuessTheCrowdCard
        moment={guessMoment}
        onRecordGuess={addCrowdGuess}
        onContinue={
          handleContinueAfterGuess
        }
      />
    );
  }

  // Session Recap screen.
  if (intermissionType === "recap") {
    return (
      <SessionRecapCard
        progress={progress}
        onContinue={
          handleContinueAfterRecap
        }
      />
    );
  }

  // =====================================================
  // Standard Scenario Screen
  // =====================================================

  return (
    <View style={styles.container}>
      {/* Current category backdrop word */}
      <View style={styles.categoryBackdrop}>
        <Text
          style={[
            styles.categoryBackdropText,
            {
              color: categoryTheme.accent,
            },
          ]}
        >
          {categoryTheme.label}
        </Text>
      </View>

      {/* Soft category-colored circle */}
      <View
        style={[
          styles.categoryCircle,
          {
            backgroundColor:
              categoryTheme.soft,
          },
        ]}
      />

      {/* Roast background decoration */}
      <View style={styles.roastBackdrop}>
        <Text style={styles.roastBackdropText}>
          ROAST
        </Text>
      </View>

      {/* Toast background decoration */}
      <View style={styles.toastBackdrop}>
        <Text style={styles.toastBackdropText}>
          TOAST
        </Text>
      </View>

      {/* Fixed top navigation */}
      <ScenarioHeader
        categoryAccent={
          categoryTheme.accent
        }
        onBackPress={handleBackPress}
      />

      {/* Scrollable question and results content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={
          styles.scrollContent
        }
      >
        {/* Player title, level, and current streak */}
        <PlayerBadge progress={progress} />

        {/* Category badge and current Moment */}
        <ScenarioCard
          categoryLabel={
            categoryTheme.label
          }
          categoryAccent={
            categoryTheme.accent
          }
          categorySoft={
            categoryTheme.soft
          }
          question={
            currentMoment.question
          }
        />

        {/* Voting options shown before selection */}
        {!selectedVote && (
          <VoteButtons
            roastPhrase={
              currentMoment.roastPhrase
            }
            toastPhrase={
              currentMoment.toastPhrase
            }
            roastScale={roastScale}
            toastScale={toastScale}
            onRoastPress={
              handleRoastVote
            }
            onToastPress={
              handleToastVote
            }
          />
        )}

        {/* Results shown after voting */}
        {selectedVote &&
          lastVoteResult && (
            <ResultsCard
              moment={currentMoment}
              selectedVote={
                selectedVote
              }
              categoryAccent={
                categoryTheme.accent
              }
              heatEarned={
                lastVoteResult.heatEarned
              }
              matchedMajority={
                lastVoteResult.matchedMajority
              }
              leveledUp={
                lastVoteResult.leveledUp
              }
              currentLevel={
                lastVoteResult
                  .updatedProgress.level
              }
              opacity={
                resultsOpacity
              }
              translateY={
                resultsPosition
              }
            />
          )}
      </ScrollView>

      {/* =================================================
          Fixed Next Button

          This button stays at the bottom while the result
          content above it can scroll independently.
      ================================================= */}

      {selectedVote && lastVoteResult && (
        <View style={styles.fixedNextContainer}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Show next moment"
            onPress={handleNextMoment}
            style={({ pressed }) => [
              styles.fixedNextButton,
              pressed &&
                styles.fixedNextButtonPressed,
            ]}
          >
            <Text style={styles.fixedNextButtonText}>
              Next
            </Text>

            <Text style={styles.fixedNextButtonArrow}>
              →
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

// =====================================================
// Styles
// =====================================================

const styles = StyleSheet.create({
  // Main screen container.
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    overflow: "hidden",
  },

  // Scrollable question and result area.
  scrollView: {
    flex: 1,
    zIndex: 2,
  },

  // Inner spacing for the scrollable area.
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: Spacing.lg,
    paddingTop: 22,

    // Extra space allows the content to scroll above the
    // fixed Next button.
    paddingBottom: 145,
  },

  // =====================================================
  // Fixed Next Button
  // =====================================================

  fixedNextContainer: {
    position: "absolute",
    left: Spacing.lg,
    right: Spacing.lg,
    bottom: 22,
    zIndex: 10,
  },

  fixedNextButton: {
    backgroundColor: Colors.textPrimary,
    borderRadius: Radius.pill,
    paddingVertical: 17,
    paddingHorizontal: 25,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 7,
  },

  fixedNextButtonPressed: {
    opacity: 0.78,
    transform: [{ scale: 0.985 }],
  },

  fixedNextButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "900",
  },

  fixedNextButtonArrow: {
    color: Colors.white,
    fontSize: 23,
    fontWeight: "700",
  },

  // =====================================================
  // Category Decorations
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