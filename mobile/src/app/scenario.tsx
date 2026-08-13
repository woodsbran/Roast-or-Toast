// =====================================================
// File: scenario.tsx
//
// Screen: Scenario
//
// Purpose:
// Controls the complete Roast or Toast gameplay loop.
//
// Version 1.1 — Big Design Batch 1 / Integrated Game Flow
//
// I am keeping all of the gameplay logic that already works:
// rounds, saved sessions, Heat, streaks, deck building,
// intermissions, transitions, and navigation.
//
// The change in this file is the regular gameplay frame.
// I want the player to feel like they opened a party game
// instead of another clean app.
//
// What I am adding:
// • A black poster header
// • "Alright..." as the lead-in
// • A huge LET'S BE HONEST. game title
// • The Moment sitting on a paper-poster layer
// • Small rough color marks instead of soft decorations
//
// I am not changing the actual game rules here.
//
// Project: Roast or Toast
// =====================================================

import {
  router,
  useLocalSearchParams,
} from "expo-router";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Animated,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import GuessTheCrowdCard from "../components/GuessTheCrowdCard";
import HeatMark from "../components/HeatMark";
import IntermissionCard from "../components/IntermissionCard";

import MomentTransition, {
  type MomentTransitionHandle,
} from "../components/MomentTransition";

import PlayerBadge from "../components/PlayerBadge";
import ResultsCard from "../components/ResultsCard";
import RoundCompleteCard from "../components/RoundCompleteCard";
import RoundProgress from "../components/RoundProgress";
import ScenarioCard from "../components/ScenarioCard";
import ScenarioHeader from "../components/ScenarioHeader";
import SessionRecapCard from "../components/SessionRecapCard";

import VoteButtons, {
  VoteChoice,
} from "../components/VoteButtons";

import { scenarios } from "../data/scenarios";
import type { Moment } from "../data/types";

import {
  buildSmartDeck,
} from "../game/deckBuilder";

import {
  triggerLevelUpEffect,
  triggerNavigationEffect,
  triggerRoastEffect,
  triggerToastEffect,
} from "../game/effects";

import type {
  VoteProgressResult,
} from "../game/progressTypes";

import {
  loadRecentMomentIds,
  rememberMomentId,
} from "../game/recentMomentsStorage";

import {
  getRoundMode,
  getRoundModeConfig,
  type RoundMode,
} from "../game/roundTypes";

import {
  clearGameSession,
  loadGameSession,
  saveGameSession,
} from "../game/sessionStorage";

import type {
  SavedGameSession,
  SavedIntermissionType,
} from "../game/sessionTypes";

import {
  usePlayerProgress,
} from "../hooks/usePlayerProgress";

import useReducedMotion from "../hooks/useReducedMotion";

import {
  CategoryName,
  CategoryThemes,
  Colors,
  Spacing,
} from "../theme";

// I am deliberately putting breaks closer together now.
//
// Quick 10 should actually show the player that the game has
// rhythm instead of making them answer ten Moments in a row.
//
// New Quick 10 rhythm:
// • after Moment 3  -> Quick Break
// • after Moment 6  -> Guess the Crowd
// • after Moment 9  -> Session Check-In
// • after Moment 10 -> Round Complete
//
// Standard and Endless keep repeating the same three-part
// rhythm every three regular Moments.
const INTERMISSION_FREQUENCY = 3;

// Stores where regular gameplay resumes after Guess the
// Crowd consumes a separate Moment.
type ResumePosition = {
  deck: Moment[];
  index: number;
};

// =====================================================
// Saved Session Helpers
// =====================================================

// Converts saved Moment IDs back into complete Moment
// objects using the current scenario library.
function restoreDeckFromIds(
  deckIds: string[],
): Moment[] {
  const momentLookup = new Map(
    scenarios.map((moment) => [
      moment.id,
      moment,
    ]),
  );

  return deckIds
    .map((id) => momentLookup.get(id))
    .filter(
      (moment): moment is Moment =>
        Boolean(moment),
    );
}

// Finds one complete Moment using its saved ID.
function findMomentById(
  momentId: string | null,
): Moment | null {
  if (!momentId) {
    return null;
  }

  return (
    scenarios.find(
      (moment) =>
        moment.id === momentId,
    ) ?? null
  );
}

// Keeps a restored deck index inside a valid range.
function getSafeIndex(
  requestedIndex: number,
  deckLength: number,
): number {
  if (deckLength <= 0) {
    return 0;
  }

  return Math.min(
    Math.max(requestedIndex, 0),
    deckLength - 1,
  );
}

// =====================================================
// Session Snapshot Helper
// =====================================================

// Converts live gameplay state into a serializable object
// that can be saved with AsyncStorage.
function createSessionSnapshot({
  roundMode,
  momentDeck,
  momentIndex,
  completedMoments,
  selectedVote,
  lastVoteResult,
  intermissionType,
  guessMoment,
  resumePosition,
  roundStartHeat,
  roundStartRoasts,
  roundStartToasts,
  roundStartMajorityMatches,
}: {
  roundMode: RoundMode;
  momentDeck: Moment[];
  momentIndex: number;
  completedMoments: number;
  selectedVote: VoteChoice;
  lastVoteResult:
    | VoteProgressResult
    | null;
  intermissionType:
    SavedIntermissionType;
  guessMoment: Moment | null;
  resumePosition:
    | ResumePosition
    | null;
  roundStartHeat: number;
  roundStartRoasts: number;
  roundStartToasts: number;
  roundStartMajorityMatches: number;
}): SavedGameSession {
  return {
    roundMode,

    deckIds: momentDeck.map(
      (moment) => moment.id,
    ),

    momentIndex,
    completedMoments,
    selectedVote,
    lastVoteResult,
    intermissionType,

    guessMomentId:
      guessMoment?.id ?? null,

    resumePosition:
      resumePosition
        ? {
            deckIds:
              resumePosition.deck.map(
                (moment) =>
                  moment.id,
              ),

            index:
              resumePosition.index,
          }
        : null,

    roundStartHeat,
    roundStartRoasts,
    roundStartToasts,
    roundStartMajorityMatches,

    hasActiveSession: true,

    updatedAt:
      new Date().toISOString(),
  };
}

export default function ScenarioScreen() {
  // I read Reduce Motion here at the gameplay-controller level.
  //
  // This is the right place for it because scenario.tsx owns
  // the transition from voting -> results -> next Moment.
  // I do not want child components fighting animation values
  // that were created by their parent.
  const reduceMotion =
    useReducedMotion();

  // Home sends either fresh or continue.
  //
  // Fresh rounds also include the selected round mode.
  const params =
    useLocalSearchParams<{
      mode?: string;
      roundMode?: string;
    }>();

  const requestedRoundMode =
    getRoundMode(
      params.roundMode,
    );

  // I use the actual phone height here because this screen
  // needs to behave like one composition, not a long page.
  const {
    height: screenHeight,
  } = useWindowDimensions();

  // =====================================================
  // Player Progress
  // =====================================================

  const {
    progress,
    hasLoadedProgress,
    addRegularVote,
    addCrowdGuess,
  } = usePlayerProgress();

  // =====================================================
  // Recent Moment History
  // =====================================================

  // Kept in memory so Endless mode can build another
  // smart deck without repeatedly loading storage.
  const [
    recentMomentIds,
    setRecentMomentIds,
  ] = useState<string[]>([]);

  // =====================================================
  // Round State
  // =====================================================

  const [
    roundMode,
    setRoundMode,
  ] = useState<RoundMode>(
    requestedRoundMode,
  );

  // Starting lifetime totals are saved so the Round
  // Complete screen can calculate round-only statistics.
  const [
    roundStartHeat,
    setRoundStartHeat,
  ] = useState(0);

  const [
    roundStartRoasts,
    setRoundStartRoasts,
  ] = useState(0);

  const [
    roundStartToasts,
    setRoundStartToasts,
  ] = useState(0);

  const [
    roundStartMajorityMatches,
    setRoundStartMajorityMatches,
  ] = useState(0);

  // Stores the Heat and majority result from the most
  // recent regular vote.
  const [
    lastVoteResult,
    setLastVoteResult,
  ] =
    useState<VoteProgressResult | null>(
      null,
    );

  // =====================================================
  // Deck State
  // =====================================================

  const [
    momentDeck,
    setMomentDeck,
  ] = useState<Moment[]>(() =>
    buildSmartDeck(
      scenarios,
      [],
    ),
  );

  const [
    momentIndex,
    setMomentIndex,
  ] = useState(0);

  const [
    selectedVote,
    setSelectedVote,
  ] =
    useState<VoteChoice>(null);

  // Number of regular Moments completed in this round.
  const [
    completedMoments,
    setCompletedMoments,
  ] = useState(0);

  // =====================================================
  // Special Mode State
  // =====================================================

  const [
    intermissionType,
    setIntermissionType,
  ] =
    useState<SavedIntermissionType>(
      null,
    );

  const [
    guessMoment,
    setGuessMoment,
  ] =
    useState<Moment | null>(null);

  const [
    resumePosition,
    setResumePosition,
  ] =
    useState<ResumePosition | null>(
      null,
    );

  // =====================================================
  // Loading State
  // =====================================================

  const [
    sessionReady,
    setSessionReady,
  ] = useState(false);

  // Prevents session initialization from running twice.
  const hasInitializedSession =
    useRef(false);

  // =====================================================
  // Animations
  // =====================================================

  // Controls the slide transition between regular
  // Moments.
  const momentTransitionRef =
    useRef<MomentTransitionHandle>(
      null,
    );

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

  // =====================================================
  // Reduce Motion Result Safety
  // =====================================================

  useEffect(() => {
    // If I already have a completed vote on screen and Reduce
    // Motion is enabled, I force the parent result animation
    // values into their finished state.
    //
    // This fixes the blank cream screen we were seeing after
    // tapping Roast or Toast. The Results component existed,
    // but its parent opacity could still be sitting at 0.
    if (
      reduceMotion &&
      selectedVote &&
      lastVoteResult
    ) {
      resultsOpacity.stopAnimation();
      resultsPosition.stopAnimation();

      resultsOpacity.setValue(1);
      resultsPosition.setValue(0);
    }
  }, [
    lastVoteResult,
    reduceMotion,
    resultsOpacity,
    resultsPosition,
    selectedVote,
  ]);

  // =====================================================
  // Session Initialization
  // =====================================================

  useEffect(() => {
    if (
      hasInitializedSession.current ||
      !hasLoadedProgress
    ) {
      return;
    }

    hasInitializedSession.current =
      true;

    let isActive = true;

    const initializeSession =
      async () => {
        // Load recent Moment history before building a
        // new deck.
        const loadedRecentIds =
          await loadRecentMomentIds();

        if (!isActive) {
          return;
        }

        setRecentMomentIds(
          loadedRecentIds,
        );

        // =================================================
        // Fresh Round
        // =================================================

        if (
          params.mode === "fresh"
        ) {
          await clearGameSession();

          if (!isActive) {
            return;
          }

          setRoundMode(
            requestedRoundMode,
          );

          setRoundStartHeat(
            progress.totalHeat,
          );

          setRoundStartRoasts(
            progress.roastCount,
          );

          setRoundStartToasts(
            progress.toastCount,
          );

          setRoundStartMajorityMatches(
            progress.majorityMatches,
          );

          setMomentDeck(
            buildSmartDeck(
              scenarios,
              loadedRecentIds,
            ),
          );

          setMomentIndex(0);
          setCompletedMoments(0);
          setSelectedVote(null);
          setLastVoteResult(null);
          setIntermissionType(null);
          setGuessMoment(null);
          setResumePosition(null);

          resultsOpacity.setValue(0);
          resultsPosition.setValue(18);

          setSessionReady(true);
          return;
        }

        // =================================================
        // Continue Saved Session
        // =================================================

        const savedSession =
          await loadGameSession();

        if (!isActive) {
          return;
        }

        if (
          params.mode === "continue" &&
          savedSession?.hasActiveSession
        ) {
          const restoredDeck =
            restoreDeckFromIds(
              savedSession.deckIds,
            );

          // If saved content is no longer available, build
          // a safe replacement deck.
          const usableDeck =
            restoredDeck.length > 0
              ? restoredDeck
              : buildSmartDeck(
                  scenarios,
                  loadedRecentIds,
                );

          setRoundMode(
            savedSession.roundMode ??
              "standard",
          );

          setRoundStartHeat(
            savedSession.roundStartHeat ??
              progress.totalHeat,
          );

          setRoundStartRoasts(
            savedSession.roundStartRoasts ??
              progress.roastCount,
          );

          setRoundStartToasts(
            savedSession.roundStartToasts ??
              progress.toastCount,
          );

          setRoundStartMajorityMatches(
            savedSession
              .roundStartMajorityMatches ??
              progress.majorityMatches,
          );

          setMomentDeck(
            usableDeck,
          );

          setMomentIndex(
            getSafeIndex(
              savedSession.momentIndex,
              usableDeck.length,
            ),
          );

          setCompletedMoments(
            Math.max(
              savedSession.completedMoments,
              0,
            ),
          );

          setSelectedVote(
            savedSession.selectedVote,
          );

          setLastVoteResult(
            savedSession.lastVoteResult,
          );

          setIntermissionType(
            savedSession.intermissionType,
          );

          const restoredGuessMoment =
            findMomentById(
              savedSession.guessMomentId,
            );

          setGuessMoment(
            restoredGuessMoment,
          );

          if (
            savedSession.resumePosition
          ) {
            const restoredResumeDeck =
              restoreDeckFromIds(
                savedSession
                  .resumePosition
                  .deckIds,
              );

            if (
              restoredResumeDeck.length >
              0
            ) {
              setResumePosition({
                deck:
                  restoredResumeDeck,

                index:
                  getSafeIndex(
                    savedSession
                      .resumePosition
                      .index,

                    restoredResumeDeck.length,
                  ),
              });
            } else {
              setResumePosition(null);
            }
          } else {
            setResumePosition(null);
          }

          // Restored result screens should already be
          // visible instead of replaying the reveal.
          if (
            savedSession.selectedVote &&
            savedSession.lastVoteResult
          ) {
            resultsOpacity.setValue(1);
            resultsPosition.setValue(0);
          } else {
            resultsOpacity.setValue(0);
            resultsPosition.setValue(18);
          }

          // If a saved Guess the Crowd Moment no longer
          // exists, safely return to regular gameplay.
          if (
            savedSession.intermissionType ===
              "guess" &&
            !restoredGuessMoment
          ) {
            setIntermissionType(null);
          }

          setSessionReady(true);
          return;
        }

        // =================================================
        // Safe Fallback
        // =================================================

        setRoundMode(
          requestedRoundMode,
        );

        setRoundStartHeat(
          progress.totalHeat,
        );

        setRoundStartRoasts(
          progress.roastCount,
        );

        setRoundStartToasts(
          progress.toastCount,
        );

        setRoundStartMajorityMatches(
          progress.majorityMatches,
        );

        setMomentDeck(
          buildSmartDeck(
            scenarios,
            loadedRecentIds,
          ),
        );

        setMomentIndex(0);
        setCompletedMoments(0);
        setSelectedVote(null);
        setLastVoteResult(null);
        setIntermissionType(null);
        setGuessMoment(null);
        setResumePosition(null);

        resultsOpacity.setValue(0);
        resultsPosition.setValue(18);

        setSessionReady(true);
      };

    void initializeSession();

    return () => {
      isActive = false;
    };
  }, [
    hasLoadedProgress,
    params.mode,
    progress,
    requestedRoundMode,
    resultsOpacity,
    resultsPosition,
  ]);

  // =====================================================
  // Current Moment
  // =====================================================

  const currentMoment =
    momentDeck[momentIndex];

  // Remember every regular Moment once it is displayed.
  useEffect(() => {
    if (
      !sessionReady ||
      !currentMoment
    ) {
      return;
    }

    let isActive = true;

    const rememberCurrentMoment =
      async () => {
        const updatedHistory =
          await rememberMomentId(
            currentMoment.id,
          );

        if (isActive) {
          setRecentMomentIds(
            updatedHistory,
          );
        }
      };

    void rememberCurrentMoment();

    return () => {
      isActive = false;
    };
  }, [
    sessionReady,
    currentMoment?.id,
  ]);

  // Guess the Crowd uses a separate Moment, so remember
  // that content too.
  useEffect(() => {
    if (
      !sessionReady ||
      intermissionType !== "guess" ||
      !guessMoment
    ) {
      return;
    }

    let isActive = true;

    const rememberGuessMoment =
      async () => {
        const updatedHistory =
          await rememberMomentId(
            guessMoment.id,
          );

        if (isActive) {
          setRecentMomentIds(
            updatedHistory,
          );
        }
      };

    void rememberGuessMoment();

    return () => {
      isActive = false;
    };
  }, [
    sessionReady,
    intermissionType,
    guessMoment?.id,
  ]);

  // =====================================================
  // Automatic Session Saving
  // =====================================================

  useEffect(() => {
    if (
      !sessionReady ||
      !hasLoadedProgress
    ) {
      return;
    }

    const snapshot =
      createSessionSnapshot({
        roundMode,
        momentDeck,
        momentIndex,
        completedMoments,
        selectedVote,
        lastVoteResult,
        intermissionType,
        guessMoment,
        resumePosition,
        roundStartHeat,
        roundStartRoasts,
        roundStartToasts,
        roundStartMajorityMatches,
      });

    void saveGameSession(
      snapshot,
    );
  }, [
    sessionReady,
    hasLoadedProgress,
    roundMode,
    momentDeck,
    momentIndex,
    completedMoments,
    selectedVote,
    lastVoteResult,
    intermissionType,
    guessMoment,
    resumePosition,
    roundStartHeat,
    roundStartRoasts,
    roundStartToasts,
    roundStartMajorityMatches,
  ]);

  // Avoid reading category data until a deck exists.
  if (!currentMoment) {
    return (
      <View
        style={
          styles.loadingContainer
        }
      >
        <HeatMark
          size="hero"
          style={styles.loadingMark}
        />

        <Text
          style={
            styles.loadingTitle
          }
        >
          Finding better takes...
        </Text>
      </View>
    );
  }

  // Category styling for the current Moment.
  const categoryTheme =
    CategoryThemes[
      currentMoment.category as CategoryName
    ] ??
    CategoryThemes["Everyday Life"];

  // Complete configuration for the selected round.
  const roundConfig =
    getRoundModeConfig(
      roundMode,
    );

  // =====================================================
  // Navigation
  // =====================================================

  // Saves the exact current state before navigation.
  const saveCurrentSession =
    async () => {
      const snapshot =
        createSessionSnapshot({
          roundMode,
          momentDeck,
          momentIndex,
          completedMoments,
          selectedVote,
          lastVoteResult,
          intermissionType,
          guessMoment,
          resumePosition,
          roundStartHeat,
          roundStartRoasts,
          roundStartToasts,
          roundStartMajorityMatches,
        });

      await saveGameSession(
        snapshot,
      );
    };

  const handleBackPress =
    async () => {
      triggerNavigationEffect();

      await saveCurrentSession();

      router.back();
    };

  const handleHomePress =
    async () => {
      triggerNavigationEffect();

      await saveCurrentSession();

      router.replace("/");
    };

  // Returns from a special screen to the previous regular
  // result screen.
  const handleBackFromSpecialScreen =
    () => {
      setCompletedMoments(
        (currentTotal) =>
          Math.max(
            currentTotal - 1,
            0,
          ),
      );

      setIntermissionType(null);
      setGuessMoment(null);
      setResumePosition(null);
    };

  // =====================================================
  // Animation Helpers
  // =====================================================

  // Gives the selected vote button a quick bounce.
  const animateVoteButton = (
    animation: Animated.Value,
  ) => {
    // If the player asked iOS to reduce motion, I keep the
    // vote completely functional and skip the scale bounce.
    if (reduceMotion) {
      animation.stopAnimation();
      animation.setValue(1);
      return;
    }

    Animated.sequence([
      Animated.spring(
        animation,
        {
          toValue: 0.96,
          useNativeDriver: true,
          speed: 35,
          bounciness: 2,
        },
      ),

      Animated.spring(
        animation,
        {
          toValue: 1,
          useNativeDriver: true,
          speed: 28,
          bounciness: 7,
        },
      ),
    ]).start();
  };

  // Reveals results with a fade-and-rise animation.
  const revealResults = () => {
    // This is the main Reduce Motion fix.
    //
    // scenario.tsx owns these two Animated.Values, so I set
    // them to the finished visible state right here instead of
    // expecting ResultsCard to repair them after the vote.
    if (reduceMotion) {
      resultsOpacity.stopAnimation();
      resultsPosition.stopAnimation();

      resultsOpacity.setValue(1);
      resultsPosition.setValue(0);

      return;
    }

    resultsOpacity.stopAnimation();
    resultsPosition.stopAnimation();

    resultsOpacity.setValue(0);
    resultsPosition.setValue(18);

    Animated.parallel([
      Animated.timing(
        resultsOpacity,
        {
          toValue: 1,
          duration: 280,
          useNativeDriver: true,
        },
      ),

      Animated.spring(
        resultsPosition,
        {
          toValue: 0,
          useNativeDriver: true,
          speed: 18,
          bounciness: 4,
        },
      ),
    ]).start();
  };

  // =====================================================
  // Regular Voting
  // =====================================================

  const recordVote = (
    vote: Exclude<
      VoteChoice,
      null
    >,

    animation: Animated.Value,
  ) => {
    // Prevents changing the answer after voting.
    if (selectedVote) {
      return;
    }

    const progressResult =
      addRegularVote(
        vote,
        currentMoment.roastPercentage,
        currentMoment.toastPercentage,
      );

    // Level-up feedback fires shortly after the initial
    // Roast or Toast haptic.
    if (
      progressResult.leveledUp
    ) {
      setTimeout(() => {
        triggerLevelUpEffect();
      }, 350);
    }

    setSelectedVote(vote);

    setLastVoteResult(
      progressResult,
    );

    animateVoteButton(
      animation,
    );

    revealResults();
  };

  const handleRoastVote = () => {
    triggerRoastEffect();

    recordVote(
      "roast",
      roastScale,
    );
  };

  const handleToastVote = () => {
    triggerToastEffect();

    recordVote(
      "toast",
      toastScale,
    );
  };

  // =====================================================
  // Regular Deck Movement
  // =====================================================

  // Clears state from the previous regular Moment.
  const resetRegularMoment =
    () => {
      setSelectedVote(null);
      setLastVoteResult(null);

      resultsOpacity.setValue(0);
      resultsPosition.setValue(18);
    };

  // Moves to the next regular Moment.
  const moveToNextMoment =
    () => {
      const reachedEndOfDeck =
        momentIndex ===
        momentDeck.length - 1;

      if (reachedEndOfDeck) {
        const newDeck =
          buildSmartDeck(
            scenarios,
            recentMomentIds,
            currentMoment.id,
          );

        setMomentDeck(
          newDeck,
        );

        setMomentIndex(0);
      } else {
        setMomentIndex(
          (currentIndex) =>
            currentIndex + 1,
        );
      }

      resetRegularMoment();
    };

  // =====================================================
  // Guess the Crowd Preparation
  // =====================================================

  // Selects a fresh Moment and stores the location where
  // regular gameplay should resume afterward.
  const prepareGuessTheCrowd =
    () => {
      const nextIndex =
        momentIndex + 1;

      const indexAfterGuess =
        momentIndex + 2;

      // At least two unused Moments remain.
      if (
        indexAfterGuess <
        momentDeck.length
      ) {
        setGuessMoment(
          momentDeck[nextIndex],
        );

        setResumePosition({
          deck: momentDeck,
          index:
            indexAfterGuess,
        });

        setIntermissionType(
          "guess",
        );

        return;
      }

      // Exactly one unused Moment remains.
      if (
        nextIndex <
        momentDeck.length
      ) {
        const specialMoment =
          momentDeck[nextIndex];

        const newDeck =
          buildSmartDeck(
            scenarios,
            recentMomentIds,
            specialMoment.id,
          );

        setGuessMoment(
          specialMoment,
        );

        setResumePosition({
          deck: newDeck,
          index: 0,
        });

        setIntermissionType(
          "guess",
        );

        return;
      }

      // Current Moment was the final deck item.
      const newDeck =
        buildSmartDeck(
          scenarios,
          recentMomentIds,
          currentMoment.id,
        );

      const specialMoment =
        newDeck[0];

      setGuessMoment(
        specialMoment,
      );

      setResumePosition({
        deck: newDeck,

        index:
          newDeck.length > 1
            ? 1
            : 0,
      });

      setIntermissionType(
        "guess",
      );
    };

  // =====================================================
  // Next / Round Completion
  // =====================================================

  // Advances the round after the player presses Next.
  const handleNextMoment = () => {
    const newCompletedTotal =
      completedMoments + 1;

    setCompletedMoments(
      newCompletedTotal,
    );

    // Finite rounds end exactly at their selected limit.
    if (
      roundConfig.momentLimit !== null &&
      newCompletedTotal >=
        roundConfig.momentLimit
    ) {
      setIntermissionType(
        "roundComplete",
      );

      return;
    }

    const shouldShowSpecialEvent =
      newCompletedTotal %
        INTERMISSION_FREQUENCY ===
      0;

    if (
      !shouldShowSpecialEvent
    ) {
      moveToNextMoment();
      return;
    }

    // I want the first break to actually feel like a break,
    // so Quick Break comes first instead of immediately
    // throwing another voting mode at the player.
    const breakNumber =
      newCompletedTotal /
      INTERMISSION_FREQUENCY;

    // Repeating rhythm:
    // 1. Quick Break
    // 2. Guess the Crowd
    // 3. Session Check-In
    const eventPosition =
      (breakNumber - 1) % 3;

    if (
      eventPosition === 0
    ) {
      setIntermissionType(
        "quick",
      );

      return;
    }

    if (
      eventPosition === 1
    ) {
      prepareGuessTheCrowd();
      return;
    }

    setIntermissionType(
      "recap",
    );
  };

  // Plays the Moment exit animation before advancing.
  //
  // Special screens such as Guess the Crowd, Quick
  // Break, and Round Complete appear after the old
  // Moment slides away.
  const handleAnimatedNextMoment =
    () => {
      // With Reduce Motion on, I advance immediately.
      // I do not send the old Moment through an exit animation
      // just to arrive at the same next state.
      if (reduceMotion) {
        handleNextMoment();
        return;
      }

      const transition =
        momentTransitionRef.current;

      // Safe fallback in case the animation component has
      // not mounted yet.
      if (!transition) {
        handleNextMoment();
        return;
      }

      transition.playExit(
        handleNextMoment,
      );
    };

  // =====================================================
  // Special Event Continuation
  // =====================================================

  const handleContinueAfterQuickBreak =
    () => {
      triggerNavigationEffect();

      setIntermissionType(null);
      moveToNextMoment();
    };

  const handleContinueAfterRecap =
    () => {
      triggerNavigationEffect();

      setIntermissionType(null);
      moveToNextMoment();
    };

  const handleContinueAfterGuess =
    () => {
      if (!resumePosition) {
        setIntermissionType(null);
        moveToNextMoment();
        return;
      }

      setMomentDeck(
        resumePosition.deck,
      );

      setMomentIndex(
        resumePosition.index,
      );

      setIntermissionType(null);
      setGuessMoment(null);
      setResumePosition(null);

      resetRegularMoment();
    };

  // =====================================================
  // Round Completion Navigation
  // =====================================================

  const handlePlayAgain =
    async () => {
      triggerNavigationEffect();

      await clearGameSession();

      router.replace(
        "/mode-select",
      );
    };

  const handleFinishRound =
    async () => {
      triggerNavigationEffect();

      await clearGameSession();

      router.replace("/");
    };

  // =====================================================
  // Loading Screen
  // =====================================================

  if (
    !sessionReady ||
    !hasLoadedProgress
  ) {
    return (
      <View
        style={
          styles.loadingContainer
        }
      >
        <HeatMark
          size="hero"
          style={styles.loadingMark}
        />

        <Text
          style={
            styles.loadingTitle
          }
        >
          Getting your takes together...
        </Text>
      </View>
    );
  }

  // =====================================================
  // Special Screens
  // =====================================================

  if (
    intermissionType ===
    "roundComplete"
  ) {
    return (
      <RoundCompleteCard
        roundMode={
          roundMode
        }
        progress={
          progress
        }
        completedMoments={
          completedMoments
        }
        roundStartHeat={
          roundStartHeat
        }
        roundStartRoasts={
          roundStartRoasts
        }
        roundStartToasts={
          roundStartToasts
        }
        roundStartMajorityMatches={
          roundStartMajorityMatches
        }
        onPlayAgain={
          handlePlayAgain
        }
        onHomePress={
          handleFinishRound
        }
      />
    );
  }

  if (
    intermissionType ===
    "quick"
  ) {
    return (
      <IntermissionCard
        completedMoments={
          completedMoments
        }
        onContinue={
          handleContinueAfterQuickBreak
        }
        onHomePress={
          handleHomePress
        }
      />
    );
  }

  if (
    intermissionType ===
      "guess" &&
    guessMoment
  ) {
    return (
      <GuessTheCrowdCard
        moment={
          guessMoment
        }
        onRecordGuess={
          addCrowdGuess
        }
        onContinue={
          handleContinueAfterGuess
        }
        onBackPress={
          handleBackFromSpecialScreen
        }
        onHomePress={
          handleHomePress
        }
      />
    );
  }

  if (
    intermissionType ===
    "recap"
  ) {
    return (
      <SessionRecapCard
        progress={
          progress
        }
        onContinue={
          handleContinueAfterRecap
        }
        onBackPress={
          handleBackFromSpecialScreen
        }
        onHomePress={
          handleHomePress
        }
      />
    );
  }

  // =====================================================
  // Standard Gameplay
  // =====================================================

  // I keep the pre-vote screen intentionally compact.
  // The last version had the title, two progress cards,
  // a giant paper, and the vote pieces all stacked like a
  // webpage. This version treats the whole phone as one board.
  const compactBoard =
    !selectedVote;

  return (
    <View style={styles.container}>
      <ScenarioHeader
        accentColor={
          categoryTheme.accent
        }
        onBackPress={
          handleBackPress
        }
        onHomePress={
          handleHomePress
        }
      />

      {/* =================================================
          Compact Game Header

          I am keeping the black LET'S BE HONEST section,
          but it is much shorter now. It should introduce
          the game, not take half the screen.
      ================================================= */}

      <View style={styles.posterHeader}>
        <Text style={styles.posterLead}>
          Alright...
        </Text>

        <Text style={styles.posterTitle}>
          LET&apos;S BE HONEST.
        </Text>

        <View style={styles.headerScratchRow}>
          <View style={styles.roastScratch} />
          <View style={styles.toastScratch} />
        </View>
      </View>

      {/* =================================================
          Compact Status Strip

          I am replacing the two large progress cards on the
          voting screen with one thin strip. The information
          is still here, but it no longer competes with the
          Moment and the actual game choice.
      ================================================= */}

      <View style={styles.statusStrip}>
          <Text style={styles.statusText}>
            {roundMode.toUpperCase()}
          </Text>

          <Text style={styles.statusDivider}>
            •
          </Text>

          <Text style={styles.statusText}>
            {completedMoments + 1}
            {roundConfig.momentLimit !== null
              ? ` / ${roundConfig.momentLimit}`
              : ""}
          </Text>

          <View style={styles.statusSpacer} />

          <Text style={styles.statusText}>
            LVL {progress.level}
          </Text>

          <Text style={styles.statusDivider}>
            •
          </Text>

          <Text style={styles.statusText}>
            {progress.currentStreak} STREAK
          </Text>
        </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          !compactBoard &&
            styles.resultsScrollContent,
        ]}
      >
        <MomentTransition
          ref={
            momentTransitionRef
          }
          transitionKey={
            currentMoment.id
          }
        >
          {compactBoard ? (
            <>
              {/* =================================================
                  One Center Moment

                  I keep the paper inside a fixed visual zone so
                  every question stays part of the same board.

                  The paper is no longer allowed to grow until it
                  pushes the vote choices off-screen.
              ================================================= */}

              <View
                style={[
                  styles.boardArea,
                  screenHeight < 800 &&
                    styles.boardAreaSmall,
                ]}
              >
                <ImageBackground
                  source={require("../../assets/game/paper/moment-paper.png")}
                  resizeMode="stretch"
                  style={[
                    styles.momentPaper,
                    screenHeight < 800 &&
                      styles.momentPaperSmall,
                  ]}
                  imageStyle={styles.momentPaperImage}
                >
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
                </ImageBackground>

                {/* The vote pieces overlap the bottom of the
                    paper on purpose. This is the part that makes
                    the screen feel like one composition. */}
                <VoteButtons
                  roastPhrase={
                    currentMoment.roastPhrase
                  }
                  toastPhrase={
                    currentMoment.toastPhrase
                  }
                  roastScale={
                    roastScale
                  }
                  toastScale={
                    toastScale
                  }
                  onRoastPress={
                    handleRoastVote
                  }
                  onToastPress={
                    handleToastVote
                  }
                />
              </View>
            </>
          ) : (
            <>
              {/* I keep Results on the same compact game frame.
                  The old version brought the two large progress
                  cards back here, which immediately made the
                  screen feel like the older app again. */}
              <ResultsCard
                moment={
                  currentMoment
                }
                selectedVote={
                  selectedVote
                }
                categoryAccent={
                  categoryTheme.accent
                }
                heatEarned={
                  lastVoteResult!.heatEarned
                }
                matchedMajority={
                  lastVoteResult!.matchedMajority
                }
                leveledUp={
                  lastVoteResult!.leveledUp
                }
                currentLevel={
                  lastVoteResult!
                    .updatedProgress
                    .level
                }
                opacity={
                  resultsOpacity
                }
                translateY={
                  resultsPosition
                }
                onNextPress={() => {
                  triggerNavigationEffect();

                  handleAnimatedNextMoment();
                }}
              />
            </>
          )}
        </MomentTransition>
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

    backgroundColor:
      Colors.background,
  },

  // =====================================================
  // Loading
  // =====================================================

  loadingContainer: {
    flex: 1,

    backgroundColor:
      Colors.background,

    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal:
      Spacing.lg,
  },

  loadingMark: {
    marginBottom: 15,
  },

  loadingTitle: {
    color:
      Colors.textPrimary,

    fontSize: 21,
    fontWeight: "900",

    textAlign: "center",
  },

  // =====================================================
  // Compact Poster Header
  // =====================================================

  posterHeader: {
    height: 126,

    backgroundColor:
      Colors.textPrimary,

    alignItems: "center",
    justifyContent: "center",

    paddingTop: 5,
  },

  posterLead: {
    color:
      Colors.toast,

    fontSize: 15,
    fontWeight: "700",

    transform: [
      {
        rotate: "-4deg",
      },
    ],

    marginBottom: 1,
  },

  posterTitle: {
    color:
      Colors.background,

    fontSize: 33,
    fontWeight: "900",

    letterSpacing: 0.2,
  },

  headerScratchRow: {
    flexDirection: "row",

    gap: 52,

    marginTop: 8,
  },

  roastScratch: {
    width: 34,
    height: 3,

    backgroundColor:
      Colors.roast,

    transform: [
      {
        rotate: "-8deg",
      },
    ],
  },

  toastScratch: {
    width: 34,
    height: 3,

    backgroundColor:
      Colors.toast,

    transform: [
      {
        rotate: "8deg",
      },
    ],
  },

  // =====================================================
  // Compact Status
  // =====================================================

  statusStrip: {
    minHeight: 40,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal:
      Spacing.lg,

    borderBottomWidth: 1,
    borderBottomColor:
      Colors.border,

    backgroundColor:
      Colors.background,
  },

  statusText: {
    color:
      Colors.textSecondary,

    fontSize: 9,
    fontWeight: "900",

    letterSpacing: 1,
  },

  statusDivider: {
    color:
      Colors.roast,

    fontSize: 10,
    fontWeight: "900",

    marginHorizontal: 7,
  },

  statusSpacer: {
    flex: 1,
  },

  // =====================================================
  // Main Board
  // =====================================================

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,

    paddingHorizontal:
      Spacing.lg,

    paddingBottom: 18,
  },

  resultsScrollContent: {
    paddingTop: 12,
    paddingBottom: 30,
  },

  boardArea: {
    minHeight: 625,

    justifyContent: "flex-start",

    paddingTop: 8,
  },

  boardAreaSmall: {
    minHeight: 570,
  },

  // I keep the paper in a controlled zone now. Long Moments
  // shrink inside ScenarioCard instead of making the entire
  // page grow taller and taller.
  // I trim the paper a little here because the vote pieces
  // need more room than they had in C2. The Moment still owns
  // the center, but Roast / Toast should not feel squeezed.
  momentPaper: {
    height: 284,

    paddingTop: 30,
    paddingBottom: 30,
    paddingHorizontal: 30,

    justifyContent: "center",

    marginHorizontal: -2,

    zIndex: 3,
  },

  momentPaperSmall: {
    height: 260,

    paddingTop: 26,
    paddingBottom: 26,
  },

  momentPaperImage: {
    transform: [
      {
        rotate: "-0.25deg",
      },
    ],
  },

});