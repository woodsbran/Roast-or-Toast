// =====================================================
// File: scenario.tsx
//
// Screen: Scenario
//
// Purpose:
// Controls the main Roast or Toast gameplay experience.
//
// Session Features:
// • Starts a fresh shuffled session
// • Restores a locally saved session
// • Restores the exact regular question
// • Restores regular results after voting
// • Restores Quick Break, Guess the Crowd, or Recap
// • Automatically saves session changes
// • Saves before returning Home
//
// Note:
// Guess the Crowd restores the same special Moment, but
// currently restarts that mini-game at its prediction
// stage.
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
import ScenarioCard from "../components/ScenarioCard";
import ScenarioHeader from "../components/ScenarioHeader";
import SessionRecapCard from "../components/SessionRecapCard";

import VoteButtons, {
  VoteChoice,
} from "../components/VoteButtons";

import {
  scenarios,
} from "../data/scenarios";

import type {
  Moment,
} from "../data/types";

import {
  clearGameSession,
  loadGameSession,
  saveGameSession,
} from "../game/sessionStorage";

import type {
  SavedGameSession,
  SavedIntermissionType,
} from "../game/sessionTypes";

import type {
  VoteProgressResult,
} from "../game/progressTypes";

import {
  usePlayerProgress,
} from "../hooks/usePlayerProgress";

import {
  CategoryName,
  CategoryThemes,
  Colors,
  Spacing,
} from "../theme";

// A special event appears after every five regular
// Moments.
const INTERMISSION_FREQUENCY = 5;

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
function shuffleMoments(
  moments: Moment[],
): Moment[] {
  const shuffledMoments = [...moments];

  // Fisher-Yates shuffle prevents predictable ordering.
  for (
    let currentIndex =
      shuffledMoments.length - 1;
    currentIndex > 0;
    currentIndex -= 1
  ) {
    const randomIndex = Math.floor(
      Math.random() *
        (currentIndex + 1),
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

// Creates a fresh deck while avoiding an immediate repeat
// whenever possible.
function createFreshDeck(
  lastMomentId?: string,
): Moment[] {
  const newDeck =
    shuffleMoments(scenarios);

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

// =====================================================
// Saved-ID Helpers
// =====================================================

// Converts saved Moment IDs back into complete Moment
// objects using the current content library.
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

// Finds one Moment from its saved ID.
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

// Keeps a restored index inside the available deck.
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
// that can be written to AsyncStorage.
function createSessionSnapshot({
  momentDeck,
  momentIndex,
  completedMoments,
  selectedVote,
  lastVoteResult,
  intermissionType,
  guessMoment,
  resumePosition,
}: {
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
}): SavedGameSession {
  return {
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

    hasActiveSession: true,

    updatedAt:
      new Date().toISOString(),
  };
}

export default function ScenarioScreen() {
  // Determines whether Home requested a fresh session or
  // a restored session.
  const {
    mode,
  } = useLocalSearchParams<{
    mode?: string;
  }>();

  // =====================================================
  // Player Progress
  // =====================================================

  const {
    progress,
    addRegularVote,
    addCrowdGuess,
  } = usePlayerProgress();

  // Stores reward details from the latest regular vote.
  const [
    lastVoteResult,
    setLastVoteResult,
  ] =
    useState<VoteProgressResult | null>(
      null,
    );

  // =====================================================
  // Shuffled Deck
  // =====================================================

  const [
    momentDeck,
    setMomentDeck,
  ] = useState<Moment[]>(() =>
    createFreshDeck(),
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
  // Special Modes
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
  // Session Loading
  // =====================================================

  // Prevents gameplay from displaying before saved data
  // has been restored or a fresh session has been made.
  const [
    sessionReady,
    setSessionReady,
  ] = useState(false);

  // Prevents the initialization effect from running more
  // than once.
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
  // Initialize or Restore Session
  // =====================================================

  useEffect(() => {
    if (
      hasInitializedSession.current
    ) {
      return;
    }

    hasInitializedSession.current =
      true;

    let isActive = true;

    const initializeSession =
      async () => {
        // A fresh request deliberately removes the old
        // active session without touching Heat or level.
        if (mode === "fresh") {
          await clearGameSession();

          if (!isActive) {
            return;
          }

          setMomentDeck(
            createFreshDeck(),
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

        // Continue requests attempt to restore the saved
        // session.
        const savedSession =
          await loadGameSession();

        if (!isActive) {
          return;
        }

        if (
          mode === "continue" &&
          savedSession?.hasActiveSession
        ) {
          const restoredDeck =
            restoreDeckFromIds(
              savedSession.deckIds,
            );

          // If content was removed or changed and the old
          // deck is no longer valid, begin a safe new deck.
          const usableDeck =
            restoredDeck.length > 0
              ? restoredDeck
              : createFreshDeck();

          const safeMomentIndex =
            getSafeIndex(
              savedSession.momentIndex,
              usableDeck.length,
            );

          setMomentDeck(usableDeck);
          setMomentIndex(
            safeMomentIndex,
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

          // Restored results should be visible immediately
          // rather than replaying from zero opacity.
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

          // A broken Guess state safely returns to the
          // regular screen.
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

        // If Continue was requested but nothing valid was
        // saved, begin a fresh session.
        setMomentDeck(
          createFreshDeck(),
        );

        setMomentIndex(0);
        setCompletedMoments(0);
        setSelectedVote(null);
        setLastVoteResult(null);
        setIntermissionType(null);
        setGuessMoment(null);
        setResumePosition(null);

        setSessionReady(true);
      };

    void initializeSession();

    return () => {
      isActive = false;
    };
  }, [
    mode,
    resultsOpacity,
    resultsPosition,
  ]);

  // =====================================================
  // Automatic Session Saving
  // =====================================================

  // Saves whenever important session state changes.
  useEffect(() => {
    if (!sessionReady) {
      return;
    }

    const snapshot =
      createSessionSnapshot({
        momentDeck,
        momentIndex,
        completedMoments,
        selectedVote,
        lastVoteResult,
        intermissionType,
        guessMoment,
        resumePosition,
      });

    void saveGameSession(snapshot);
  }, [
    sessionReady,
    momentDeck,
    momentIndex,
    completedMoments,
    selectedVote,
    lastVoteResult,
    intermissionType,
    guessMoment,
    resumePosition,
  ]);

  // Current regular Moment.
  const currentMoment =
    momentDeck[momentIndex];

  // Category styling associated with the current Moment.
  const categoryTheme =
    CategoryThemes[
      currentMoment.category as CategoryName
    ] ??
    CategoryThemes["Everyday Life"];

  // =====================================================
  // Navigation
  // =====================================================

  // Saves before returning to the previous route.
  const handleBackPress =
    async () => {
      const snapshot =
        createSessionSnapshot({
          momentDeck,
          momentIndex,
          completedMoments,
          selectedVote,
          lastVoteResult,
          intermissionType,
          guessMoment,
          resumePosition,
        });

      await saveGameSession(
        snapshot,
      );

      router.back();
    };

  // Saves before returning directly Home.
  const handleHomePress =
    async () => {
      const snapshot =
        createSessionSnapshot({
          momentDeck,
          momentIndex,
          completedMoments,
          selectedVote,
          lastVoteResult,
          intermissionType,
          guessMoment,
          resumePosition,
        });

      await saveGameSession(
        snapshot,
      );

      router.replace("/");
    };

  // Returns from a special event to the previous results
  // without permanently skipping the event.
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
  // Regular Voting
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

    setSelectedVote(vote);

    setLastVoteResult(
      progressResult,
    );

    animateVoteButton(animation);
    revealResults();
  };

  const handleRoastVote = () => {
    recordVote(
      "roast",
      roastScale,
    );
  };

  const handleToastVote = () => {
    recordVote(
      "toast",
      toastScale,
    );
  };

  // =====================================================
  // Regular Deck Movement
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
        setMomentDeck(
          createFreshDeck(
            currentMoment.id,
          ),
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
          createFreshDeck(
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
        createFreshDeck(
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
  // Special Event Selection
  // =====================================================

  const handleNextMoment = () => {
    const newCompletedTotal =
      completedMoments + 1;

    setCompletedMoments(
      newCompletedTotal,
    );

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
  // Loading Screen
  // =====================================================

  if (!sessionReady) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingEmoji}>
          🔥
        </Text>

        <Text style={styles.loadingTitle}>
          Getting your takes together...
        </Text>
      </View>
    );
  }

  // =====================================================
  // Special Screens
  // =====================================================

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
  // Standard Scenario Screen
  // =====================================================

  return (
    <View style={styles.container}>
      {/* Category decorations */}
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

      {/* Shared Back, brand, and Home navigation */}
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

      {/* All standard gameplay content scrolls together */}
      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        style={styles.scrollView}
        contentContainerStyle={
          styles.scrollContent
        }
      >
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
              onNextPress={
                handleNextMoment
              }
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

    paddingTop: 18,
    paddingBottom: 42,
  },

  // =====================================================
  // Category Decorations
  // =====================================================

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

  // =====================================================
  // Brand Decorations
  // =====================================================

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