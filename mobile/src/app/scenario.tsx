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
// • Tracks the current regular Moment
// • Records Roast or Toast votes
// • Displays results
// • Shows a special break every five Moments
// • Alternates Quick Break and Guess the Crowd
//
// Guess the Crowd:
// A fresh, unseen Moment is removed from the regular
// deck and used for the special mini-game.
//
// Project: Roast or Toast
// =====================================================

import { router } from "expo-router";
import { useRef, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

import GuessTheCrowdCard from "../components/GuessTheCrowdCard";
import IntermissionCard from "../components/IntermissionCard";
import ResultsCard from "../components/ResultsCard";
import ScenarioCard from "../components/ScenarioCard";
import ScenarioHeader from "../components/ScenarioHeader";
import VoteButtons, {
  VoteChoice,
} from "../components/VoteButtons";

import { scenarios } from "../data/scenarios";
import type { Moment } from "../data/types";

import {
  CategoryName,
  CategoryThemes,
  Colors,
  Spacing,
} from "../theme";

// Show a gameplay interruption after this many regular
// Moments.
const INTERMISSION_FREQUENCY = 5;

// The special screen currently being displayed.
type IntermissionType = "quick" | "guess" | null;

// Stores where gameplay should resume after Guess the
// Crowd consumes its fresh Moment.
type ResumePosition = {
  deck: Moment[];
  index: number;
};

// =====================================================
// Shuffle Helper
// =====================================================

// Creates a shuffled copy without changing the original
// scenarios array.
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

// =====================================================
// New Deck Helper
// =====================================================

// Creates a new shuffled deck and tries to prevent the
// first Moment from matching the last Moment shown.
function createFreshDeck(lastMomentId?: string): Moment[] {
  const newDeck = shuffleMoments(scenarios);

  if (
    lastMomentId &&
    newDeck.length > 1 &&
    newDeck[0].id === lastMomentId
  ) {
    [newDeck[0], newDeck[1]] = [newDeck[1], newDeck[0]];
  }

  return newDeck;
}

export default function ScenarioScreen() {
  // Creates one randomized deck when gameplay begins.
  const [momentDeck, setMomentDeck] = useState<Moment[]>(() =>
    createFreshDeck(),
  );

  // Tracks the current regular Moment.
  const [momentIndex, setMomentIndex] = useState(0);

  // Stores the player's choice for the regular Moment.
  const [selectedVote, setSelectedVote] =
    useState<VoteChoice>(null);

  // Counts completed regular Moments.
  const [completedMoments, setCompletedMoments] = useState(0);

  // Tracks whether Quick Break or Guess the Crowd is open.
  const [intermissionType, setIntermissionType] =
    useState<IntermissionType>(null);

  // Stores the fresh Moment used by Guess the Crowd.
  const [guessMoment, setGuessMoment] =
    useState<Moment | null>(null);

  // Stores the deck location that should load after the
  // Guess the Crowd mini-game ends.
  const [resumePosition, setResumePosition] =
    useState<ResumePosition | null>(null);

  // Controls the vote-button bounce effects.
  const roastScale = useRef(new Animated.Value(1)).current;
  const toastScale = useRef(new Animated.Value(1)).current;

  // Controls the regular results reveal.
  const resultsOpacity = useRef(new Animated.Value(0)).current;
  const resultsPosition = useRef(new Animated.Value(18)).current;

  // Current regular Moment.
  const currentMoment = momentDeck[momentIndex];

  // Visual theme for the current category.
  const categoryTheme =
    CategoryThemes[currentMoment.category as CategoryName] ??
    CategoryThemes["Everyday Life"];

  // =====================================================
  // Animation Helpers
  // =====================================================

  // Gives the selected voting button a quick bounce.
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

  // Fades and raises the regular result content.
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

  const handleRoastVote = () => {
    if (selectedVote) {
      return;
    }

    setSelectedVote("roast");
    animateVoteButton(roastScale);
    revealResults();
  };

  const handleToastVote = () => {
    if (selectedVote) {
      return;
    }

    setSelectedVote("toast");
    animateVoteButton(toastScale);
    revealResults();
  };

  // =====================================================
  // Standard Deck Movement
  // =====================================================

  // Moves one position forward through the regular deck.
  const moveToNextMoment = () => {
    const reachedEndOfDeck =
      momentIndex === momentDeck.length - 1;

    if (reachedEndOfDeck) {
      const newDeck = createFreshDeck(currentMoment.id);

      setMomentDeck(newDeck);
      setMomentIndex(0);
    } else {
      setMomentIndex((currentIndex) => currentIndex + 1);
    }

    resetRegularMoment();
  };

  // Clears the vote and result animation state.
  const resetRegularMoment = () => {
    setSelectedVote(null);
    resultsOpacity.setValue(0);
    resultsPosition.setValue(18);
  };

  // =====================================================
  // Guess the Crowd Preparation
  // =====================================================

  // Selects the next unseen deck Moment for Guess the
  // Crowd and determines where regular gameplay resumes.
  const prepareGuessTheCrowd = () => {
    const nextIndex = momentIndex + 1;
    const indexAfterGuess = momentIndex + 2;

    // There are at least two unused Moments remaining in
    // the current deck.
    if (indexAfterGuess < momentDeck.length) {
      setGuessMoment(momentDeck[nextIndex]);

      setResumePosition({
        deck: momentDeck,
        index: indexAfterGuess,
      });

      setIntermissionType("guess");
      return;
    }

    // Exactly one unused Moment remains. Use it for Guess
    // the Crowd, then begin a fresh deck afterward.
    if (nextIndex < momentDeck.length) {
      const specialMoment = momentDeck[nextIndex];
      const newDeck = createFreshDeck(specialMoment.id);

      setGuessMoment(specialMoment);

      setResumePosition({
        deck: newDeck,
        index: 0,
      });

      setIntermissionType("guess");
      return;
    }

    // The regular Moment was the final item in the deck.
    // A fresh deck provides both the special Moment and
    // the next regular Moment.
    const newDeck = createFreshDeck(currentMoment.id);
    const specialMoment = newDeck[0];

    let regularIndex = 1;

    // This safety case matters only if the app ever has
    // fewer than two total Moments.
    if (newDeck.length < 2) {
      regularIndex = 0;
    }

    setGuessMoment(specialMoment);

    setResumePosition({
      deck: newDeck,
      index: regularIndex,
    });

    setIntermissionType("guess");
  };

  // =====================================================
  // Intermission Selection
  // =====================================================

  // Runs when the player presses Next after regular
  // results.
  const handleNextMoment = () => {
    const newCompletedTotal = completedMoments + 1;

    setCompletedMoments(newCompletedTotal);

    const shouldShowIntermission =
      newCompletedTotal % INTERMISSION_FREQUENCY === 0;

    if (!shouldShowIntermission) {
      moveToNextMoment();
      return;
    }

    // Calculates which numbered break this is.
    const intermissionNumber =
      newCompletedTotal / INTERMISSION_FREQUENCY;

    // Odd-numbered breaks use Guess the Crowd.
    //
    // Break 1: Guess the Crowd
    // Break 2: Quick Break
    // Break 3: Guess the Crowd
    const shouldShowGuessTheCrowd =
      intermissionNumber % 2 === 1;

    if (shouldShowGuessTheCrowd) {
      prepareGuessTheCrowd();
      return;
    }

    setIntermissionType("quick");
  };

  // Continues after the normal Quick Break.
  const handleContinueAfterQuickBreak = () => {
    setIntermissionType(null);
    moveToNextMoment();
  };

  // Continues after Guess the Crowd.
  const handleContinueAfterGuess = () => {
    if (!resumePosition) {
      // Safe fallback if resume data is unexpectedly
      // unavailable.
      setIntermissionType(null);
      moveToNextMoment();
      return;
    }

    // Loads the position after the consumed special
    // Moment.
    setMomentDeck(resumePosition.deck);
    setMomentIndex(resumePosition.index);

    setIntermissionType(null);
    setGuessMoment(null);
    setResumePosition(null);

    resetRegularMoment();
  };

  // Returns to the Home screen.
  const handleBackPress = () => {
    router.back();
  };

  // =====================================================
  // Special Screens
  // =====================================================

  if (intermissionType === "quick") {
    return (
      <IntermissionCard
        completedMoments={completedMoments}
        onContinue={handleContinueAfterQuickBreak}
      />
    );
  }

  if (intermissionType === "guess" && guessMoment) {
    return (
      <GuessTheCrowdCard
        moment={guessMoment}
        onContinue={handleContinueAfterGuess}
      />
    );
  }

  // =====================================================
  // Standard Scenario Screen
  // =====================================================

  return (
    <View style={styles.container}>
      {/* Current category backdrop */}
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

      {/* Soft category decoration */}
      <View
        style={[
          styles.categoryCircle,
          {
            backgroundColor: categoryTheme.soft,
          },
        ]}
      />

      {/* Main brand decorations */}
      <View style={styles.roastBackdrop}>
        <Text style={styles.roastBackdropText}>ROAST</Text>
      </View>

      <View style={styles.toastBackdrop}>
        <Text style={styles.toastBackdropText}>TOAST</Text>
      </View>

      {/* Top navigation */}
      <ScenarioHeader
        categoryAccent={categoryTheme.accent}
        onBackPress={handleBackPress}
      />

      {/* Main gameplay content */}
      <View style={styles.content}>
        <ScenarioCard
          categoryLabel={categoryTheme.label}
          categoryAccent={categoryTheme.accent}
          categorySoft={categoryTheme.soft}
          question={currentMoment.question}
        />

        {!selectedVote && (
          <VoteButtons
            roastPhrase={currentMoment.roastPhrase}
            toastPhrase={currentMoment.toastPhrase}
            roastScale={roastScale}
            toastScale={toastScale}
            onRoastPress={handleRoastVote}
            onToastPress={handleToastVote}
          />
        )}

        {selectedVote && (
          <ResultsCard
            moment={currentMoment}
            selectedVote={selectedVote}
            categoryAccent={categoryTheme.accent}
            opacity={resultsOpacity}
            translateY={resultsPosition}
            onNextPress={handleNextMoment}
          />
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

  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: Spacing.lg,
    paddingBottom: 28,
    zIndex: 2,
  },

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