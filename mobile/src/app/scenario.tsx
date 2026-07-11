// =====================================================
// File: scenario.tsx
//
// Screen: Scenario
//
// Purpose:
// Controls the main Roast or Toast gameplay experience.
//
// Layout Rules:
// • Back and Home remain available in the header.
// • All gameplay content lives inside one ScrollView.
// • The Next button follows the Top Comment.
// • Nothing floats over or covers result content.
//
// Project: Roast or Toast
// =====================================================

import { router } from "expo-router";
import { useRef, useState } from "react";

import {
  Animated,
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
  Spacing,
} from "../theme";

// A special event appears after every five regular
// Moments.
const INTERMISSION_FREQUENCY = 5;

// Special screen currently being displayed.
type IntermissionType =
  | "quick"
  | "guess"
  | "recap"
  | null;

// Stores where regular gameplay resumes after Guess the
// Crowd consumes a fresh Moment.
type ResumePosition = {
  deck: Moment[];
  index: number;
};

// =====================================================
// Shuffle Helpers
// =====================================================

// Creates a randomized copy of the Moment list.
function shuffleMoments(moments: Moment[]): Moment[] {
  const shuffledMoments = [...moments];

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

// Creates a fresh deck while avoiding an immediate repeat.
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

  // Stores reward details from the latest regular vote.
  const [lastVoteResult, setLastVoteResult] =
    useState<VoteProgressResult | null>(null);

  // =====================================================
  // Shuffled Deck
  // =====================================================

  const [momentDeck, setMomentDeck] = useState<Moment[]>(() =>
    createFreshDeck(),
  );

  const [momentIndex, setMomentIndex] = useState(0);

  const [selectedVote, setSelectedVote] =
    useState<VoteChoice>(null);

  const [completedMoments, setCompletedMoments] =
    useState(0);

  // =====================================================
  // Special Modes
  // =====================================================

  const [intermissionType, setIntermissionType] =
    useState<IntermissionType>(null);

  const [guessMoment, setGuessMoment] =
    useState<Moment | null>(null);

  const [resumePosition, setResumePosition] =
    useState<ResumePosition | null>(null);

  // =====================================================
  // Animations
  // =====================================================

  const roastScale = useRef(
    new Animated.Value(1),
  ).current;

  const toastScale = useRef(
    new Animated.Value(1),
  ).current;

  const resultsOpacity = useRef(
    new Animated.Value(0),
  ).current;

  const resultsPosition = useRef(
    new Animated.Value(18),
  ).current;

  const currentMoment = momentDeck[momentIndex];

  const categoryTheme =
    CategoryThemes[currentMoment.category as CategoryName] ??
    CategoryThemes["Everyday Life"];

  // =====================================================
  // Navigation
  // =====================================================

  const handleBackPress = () => {
    router.back();
  };

  const handleHomePress = () => {
    router.replace("/");
  };

  // =====================================================
  // Animation Helpers
  // =====================================================

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

  const recordVote = (
    vote: Exclude<VoteChoice, null>,
    animation: Animated.Value,
  ) => {
    if (selectedVote) {
      return;
    }

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

  const handleRoastVote = () => {
    recordVote("roast", roastScale);
  };

  const handleToastVote = () => {
    recordVote("toast", toastScale);
  };

  // =====================================================
  // Regular Deck Movement
  // =====================================================

  const resetRegularMoment = () => {
    setSelectedVote(null);
    setLastVoteResult(null);

    resultsOpacity.setValue(0);
    resultsPosition.setValue(18);
  };

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

  const prepareGuessTheCrowd = () => {
    const nextIndex = momentIndex + 1;
    const indexAfterGuess = momentIndex + 2;

    if (indexAfterGuess < momentDeck.length) {
      setGuessMoment(momentDeck[nextIndex]);

      setResumePosition({
        deck: momentDeck,
        index: indexAfterGuess,
      });

      setIntermissionType("guess");
      return;
    }

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

    const newDeck = createFreshDeck(currentMoment.id);
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

  const handleNextMoment = () => {
    const newCompletedTotal =
      completedMoments + 1;

    setCompletedMoments(newCompletedTotal);

    const shouldShowSpecialEvent =
      newCompletedTotal %
        INTERMISSION_FREQUENCY ===
      0;

    if (!shouldShowSpecialEvent) {
      moveToNextMoment();
      return;
    }

    const breakNumber =
      newCompletedTotal /
      INTERMISSION_FREQUENCY;

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

  const handleContinueAfterQuickBreak = () => {
    setIntermissionType(null);
    moveToNextMoment();
  };

  const handleContinueAfterRecap = () => {
    setIntermissionType(null);
    moveToNextMoment();
  };

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

  // =====================================================
  // Special Screens
  // =====================================================

  if (intermissionType === "quick") {
    return (
      <IntermissionCard
        completedMoments={completedMoments}
        onContinue={handleContinueAfterQuickBreak}
        onHomePress={handleHomePress}
      />
    );
  }

  if (
    intermissionType === "guess" &&
    guessMoment
  ) {
    return (
      <GuessTheCrowdCard
        moment={guessMoment}
        onRecordGuess={addCrowdGuess}
        onContinue={handleContinueAfterGuess}
      />
    );
  }

  if (intermissionType === "recap") {
    return (
      <SessionRecapCard
        progress={progress}
        onContinue={handleContinueAfterRecap}
      />
    );
  }

  // =====================================================
  // Standard Scenario Screen
  // =====================================================

  return (
    <View style={styles.container}>
      {/* Category decorations */}
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

      <View
        style={[
          styles.categoryCircle,
          {
            backgroundColor: categoryTheme.soft,
          },
        ]}
      />

      <View style={styles.roastBackdrop}>
        <Text style={styles.roastBackdropText}>
          ROAST
        </Text>
      </View>

      <View style={styles.toastBackdrop}>
        <Text style={styles.toastBackdropText}>
          TOAST
        </Text>
      </View>

      {/* Shared Back, brand, and Home navigation */}
      <ScenarioHeader
        accentColor={categoryTheme.accent}
        onBackPress={handleBackPress}
        onHomePress={handleHomePress}
      />

      {/* All gameplay content scrolls together */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <PlayerBadge progress={progress} />

        <ScenarioCard
          categoryLabel={categoryTheme.label}
          categoryAccent={categoryTheme.accent}
          categorySoft={categoryTheme.soft}
          question={currentMoment.question}
          compact={selectedVote !== null}
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

        {selectedVote && lastVoteResult && (
          <ResultsCard
            moment={currentMoment}
            selectedVote={selectedVote}
            categoryAccent={categoryTheme.accent}
            heatEarned={lastVoteResult.heatEarned}
            matchedMajority={
              lastVoteResult.matchedMajority
            }
            leveledUp={lastVoteResult.leveledUp}
            currentLevel={
              lastVoteResult.updatedProgress.level
            }
            opacity={resultsOpacity}
            translateY={resultsPosition}
            onNextPress={handleNextMoment}
          />
        )}
      </ScrollView>
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
    paddingBottom: 42,
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