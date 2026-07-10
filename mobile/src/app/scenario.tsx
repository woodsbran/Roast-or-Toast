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
// • Tracks the current Moment
// • Records the player's temporary vote
// • Controls vote and results animations
// • Shows an intermission after every five Moments
//
// UI responsibilities are separated into reusable
// components so this file remains easier to maintain.
//
// Project: Roast or Toast
// =====================================================

import { router } from "expo-router";
import { useRef, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

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

// Number of regular Moments completed before showing
// a short gameplay break.
const INTERMISSION_FREQUENCY = 5;

// =====================================================
// Shuffle Helper
// =====================================================

// Creates a shuffled copy of the supplied Moment list.
//
// The original scenarios array is never changed.
function shuffleMoments(moments: Moment[]): Moment[] {
  const shuffledMoments = [...moments];

  // Fisher-Yates shuffle prevents predictable ordering.
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
  // Creates one randomized deck when this screen opens.
  const [momentDeck, setMomentDeck] = useState<Moment[]>(() =>
    shuffleMoments(scenarios),
  );

  // Tracks the current position within the shuffled deck.
  const [momentIndex, setMomentIndex] = useState(0);

  // Stores the player's choice for the current Moment.
  const [selectedVote, setSelectedVote] =
    useState<VoteChoice>(null);

  // Counts how many Moments were completed this session.
  const [completedMoments, setCompletedMoments] = useState(0);

  // Controls whether the break screen is being shown.
  const [showIntermission, setShowIntermission] =
    useState(false);

  // Controls the bounce effect for each vote button.
  const roastScale = useRef(new Animated.Value(1)).current;
  const toastScale = useRef(new Animated.Value(1)).current;

  // Controls the results fade-and-rise animation.
  const resultsOpacity = useRef(new Animated.Value(0)).current;
  const resultsPosition = useRef(new Animated.Value(18)).current;

  // Gets the current Moment from the shuffled deck.
  const currentMoment = momentDeck[momentIndex];

  // Gets the visual theme associated with the Moment's
  // category.
  //
  // Everyday Life is used as a safe fallback.
  const categoryTheme =
    CategoryThemes[currentMoment.category as CategoryName] ??
    CategoryThemes["Everyday Life"];

  // =====================================================
  // Animation Helpers
  // =====================================================

  // Gives the selected vote button a small bounce.
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

  // Fades the results in and gently moves them upward.
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

  // Saves a Roast vote and reveals the results.
  const handleRoastVote = () => {
    // The player cannot change their vote after selecting.
    if (selectedVote) {
      return;
    }

    setSelectedVote("roast");
    animateVoteButton(roastScale);
    revealResults();
  };

  // Saves a Toast vote and reveals the results.
  const handleToastVote = () => {
    // The player cannot change their vote after selecting.
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

  // Performs the actual movement to the next Moment.
  //
  // If the deck is finished, a new deck is shuffled.
  const moveToNextMoment = () => {
    const reachedEndOfDeck =
      momentIndex === momentDeck.length - 1;

    if (reachedEndOfDeck) {
      let newDeck = shuffleMoments(scenarios);

      // Prevents the new deck from starting with the
      // exact same Moment the player just completed.
      if (
        newDeck.length > 1 &&
        newDeck[0].id === currentMoment.id
      ) {
        [newDeck[0], newDeck[1]] = [
          newDeck[1],
          newDeck[0],
        ];
      }

      setMomentDeck(newDeck);
      setMomentIndex(0);
    } else {
      setMomentIndex((currentIndex) => currentIndex + 1);
    }

    // Clears the old vote and resets results animation.
    setSelectedVote(null);
    resultsOpacity.setValue(0);
    resultsPosition.setValue(18);
  };

  // Runs when the player presses Next after viewing
  // results.
  const handleNextMoment = () => {
    const newCompletedTotal = completedMoments + 1;

    setCompletedMoments(newCompletedTotal);

    // Pause after every set number of completed Moments.
    if (
      newCompletedTotal % INTERMISSION_FREQUENCY ===
      0
    ) {
      setShowIntermission(true);
      return;
    }

    moveToNextMoment();
  };

  // Closes the break screen and loads the next Moment.
  const handleContinueAfterIntermission = () => {
    setShowIntermission(false);
    moveToNextMoment();
  };

  // Returns the player to the Home screen.
  const handleBackPress = () => {
    router.back();
  };

  // =====================================================
  // Intermission
  // =====================================================

  // The intermission temporarily replaces the standard
  // Scenario screen after every five completed Moments.
  if (showIntermission) {
    return (
      <IntermissionCard
        completedMoments={completedMoments}
        onContinue={handleContinueAfterIntermission}
      />
    );
  }

  // =====================================================
  // Standard Scenario Screen
  // =====================================================

  return (
    <View style={styles.container}>
      {/* Category-colored backdrop word */}
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

      {/* Soft category decoration */}
      <View
        style={[
          styles.categoryCircle,
          {
            backgroundColor: categoryTheme.soft,
          },
        ]}
      />

      {/* Roast or Toast brand decorations */}
      <View style={styles.roastBackdrop}>
        <Text style={styles.roastBackdropText}>ROAST</Text>
      </View>

      <View style={styles.toastBackdrop}>
        <Text style={styles.toastBackdropText}>TOAST</Text>
      </View>

      {/* Top navigation area */}
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

        {/* Vote choices appear before the player votes */}
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

        {/* Results replace the buttons after voting */}
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