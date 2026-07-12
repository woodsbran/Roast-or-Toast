// =====================================================
// File: scenario.tsx
//
// Screen: Scenario
//
// Purpose:
// Controls the complete Roast or Toast gameplay loop.
//
// Current Features:
// • Quick 10, Standard 20, and Endless modes
// • Smart category-balanced Moment deck
// • Recently seen Moment avoidance
// • Saved and restored round mode
// • Round progress counter
// • Round completion screen
// • Heat, levels, streaks, and titles
// • Guess the Crowd
// • Quick Break
// • Session Check-In
// • Local session persistence
// • Haptics and gameplay animations
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
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import GuessTheCrowdCard from "../components/GuessTheCrowdCard";
import IntermissionCard from "../components/IntermissionCard";
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

import {
  CategoryName,
  CategoryThemes,
  Colors,
  Spacing,
} from "../theme";

const INTERMISSION_FREQUENCY = 5;

type ResumePosition = {
  deck: Moment[];
  index: number;
};

// =====================================================
// Saved Session Helpers
// =====================================================

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
// Session Snapshot
// =====================================================

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
                (moment) => moment.id,
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
  const params =
    useLocalSearchParams<{
      mode?: string;
      roundMode?: string;
    }>();

  const requestedRoundMode =
    getRoundMode(params.roundMode);

  const {
    progress,
    hasLoadedProgress,
    addRegularVote,
    addCrowdGuess,
  } = usePlayerProgress();

  // =====================================================
  // Recent-History State
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

  const hasInitializedSession =
    useRef(false);

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
        const loadedRecentIds =
          await loadRecentMomentIds();

        if (!isActive) {
          return;
        }

        setRecentMomentIds(
          loadedRecentIds,
        );

        if (params.mode === "fresh") {
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

          setMomentDeck(usableDeck);

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
            }
          }

          if (
            savedSession.selectedVote &&
            savedSession.lastVoteResult
          ) {
            resultsOpacity.setValue(1);
            resultsPosition.setValue(0);
          }

          setSessionReady(true);
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

    void saveGameSession(snapshot);
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
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingEmoji}>
          🔥
        </Text>

        <Text style={styles.loadingTitle}>
          Finding better takes...
        </Text>
      </View>
    );
  }

  const categoryTheme =
    CategoryThemes[
      currentMoment.category as CategoryName
    ] ??
    CategoryThemes["Everyday Life"];

  const roundConfig =
    getRoundModeConfig(roundMode);

  // =====================================================
  // Navigation
  // =====================================================

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

      await saveGameSession(snapshot);
    };

  const handleBackPress =
    async () => {
      await saveCurrentSession();
      router.back();
    };

  const handleHomePress =
    async () => {
      await saveCurrentSession();
      router.replace("/");
    };

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
  // Voting
  // =====================================================

  const recordVote = (
    vote: Exclude<
      VoteChoice,
      null
    >,

    animation: Animated.Value,
  ) => {
    if (selectedVote) {
      return;
    }

    const progressResult =
      addRegularVote(
        vote,
        currentMoment.roastPercentage,
        currentMoment.toastPercentage,
      );

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

    animateVoteButton(animation);
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
  // Deck Movement
  // =====================================================

  const resetRegularMoment =
    () => {
      setSelectedVote(null);
      setLastVoteResult(null);

      resultsOpacity.setValue(0);
      resultsPosition.setValue(18);
    };

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

        setMomentDeck(newDeck);
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
  // Guess the Crowd
  // =====================================================

  const prepareGuessTheCrowd =
    () => {
      const nextIndex =
        momentIndex + 1;

      const indexAfterGuess =
        momentIndex + 2;

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

  const handleNextMoment = () => {
    const newCompletedTotal =
      completedMoments + 1;

    setCompletedMoments(
      newCompletedTotal,
    );

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

    const breakNumber =
      newCompletedTotal /
      INTERMISSION_FREQUENCY;

    const eventPosition =
      breakNumber % 3;

    if (eventPosition === 1) {
      prepareGuessTheCrowd();
      return;
    }

    if (eventPosition === 2) {
      setIntermissionType(
        "quick",
      );

      return;
    }

    setIntermissionType(
      "recap",
    );
  };

  // =====================================================
  // Special Event Continuation
  // =====================================================

  const handleContinueAfterQuickBreak =
    () => {
      setIntermissionType(null);
      moveToNextMoment();
    };

  const handleContinueAfterRecap =
    () => {
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
  // Loading
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
        <Text
          style={
            styles.loadingEmoji
          }
        >
          🔥
        </Text>

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
        roundMode={roundMode}
        progress={progress}
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
    intermissionType === "quick"
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
    intermissionType === "guess" &&
    guessMoment
  ) {
    return (
      <GuessTheCrowdCard
        moment={guessMoment}
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
    intermissionType === "recap"
  ) {
    return (
      <SessionRecapCard
        progress={progress}
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

  return (
    <View style={styles.container}>
      <View
        style={
          styles.categoryBackdrop
        }
      >
        <Text
          style={[
            styles.categoryBackdropText,

            {
              color:
                categoryTheme.accent,
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
            backgroundColor:
              categoryTheme.soft,
          },
        ]}
      />

      <View
        style={
          styles.roastBackdrop
        }
      >
        <Text
          style={
            styles.roastBackdropText
          }
        >
          ROAST
        </Text>
      </View>

      <View
        style={
          styles.toastBackdrop
        }
      >
        <Text
          style={
            styles.toastBackdropText
          }
        >
          TOAST
        </Text>
      </View>

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

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        style={styles.scrollView}
        contentContainerStyle={
          styles.scrollContent
        }
      >
        <RoundProgress
          roundMode={roundMode}
          completedMoments={
            completedMoments
          }
        />

        <PlayerBadge
          progress={progress}
        />

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
          compact={
            selectedVote !== null
          }
        />

        {!selectedVote && (
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
        )}

        {selectedVote &&
          lastVoteResult && (
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
              onNextPress={() => {
                triggerNavigationEffect();
                handleNextMoment();
              }}
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

    backgroundColor:
      Colors.background,

    overflow: "hidden",
  },

  loadingContainer: {
    flex: 1,

    backgroundColor:
      Colors.background,

    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal:
      Spacing.lg,
  },

  loadingEmoji: {
    fontSize: 44,
    marginBottom: 15,
  },

  loadingTitle: {
    color: Colors.textPrimary,

    fontSize: 21,
    fontWeight: "900",

    textAlign: "center",
  },

  scrollView: {
    flex: 1,
    zIndex: 2,
  },

  scrollContent: {
    flexGrow: 1,

    justifyContent: "center",

    paddingHorizontal:
      Spacing.lg,

    paddingTop: 16,
    paddingBottom: 42,
  },

  categoryBackdrop: {
    position: "absolute",

    top: 132,
    right: -48,

    transform: [
      {
        rotate: "8deg",
      },
    ],
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

    transform: [
      {
        rotate: "-8deg",
      },
    ],
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

    transform: [
      {
        rotate: "-8deg",
      },
    ],
  },

  toastBackdropText: {
    color: Colors.toast,

    fontSize: 78,
    fontWeight: "900",
    letterSpacing: -4,

    opacity: 0.055,
  },
});