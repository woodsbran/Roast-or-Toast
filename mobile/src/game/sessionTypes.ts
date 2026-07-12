// =====================================================
// File: sessionTypes.ts
//
// Purpose:
// Defines everything required to save and restore an
// active Roast or Toast gameplay session.
//
// Player progress such as Heat, level, and lifetime stats
// is stored separately.
//
// Project: Roast or Toast
// =====================================================

import type { VoteProgressResult } from "./progressTypes";
import type { RoundMode } from "./roundTypes";

// A normal Roast or Toast answer.
export type SavedVoteChoice =
  | "roast"
  | "toast"
  | null;

// Special gameplay screen currently being displayed.
export type SavedIntermissionType =
  | "quick"
  | "guess"
  | "recap"
  | "roundComplete"
  | null;

// Stores where regular gameplay resumes after Guess the
// Crowd uses a fresh Moment.
export type SavedResumePosition = {
  // Ordered Moment IDs for the saved deck.
  deckIds: string[];

  // Position inside the saved deck.
  index: number;
};

// Complete locally saved gameplay session.
export type SavedGameSession = {
  // Selected round length.
  roundMode: RoundMode;

  // Ordered Moment IDs for the current shuffled deck.
  deckIds: string[];

  // Current position inside the shuffled deck.
  momentIndex: number;

  // Number of regular Moments completed in this round.
  completedMoments: number;

  // Vote already selected on the current Moment.
  selectedVote: SavedVoteChoice;

  // Reward details from the current result screen.
  lastVoteResult: VoteProgressResult | null;

  // Current special gameplay screen.
  intermissionType: SavedIntermissionType;

  // Moment currently being used by Guess the Crowd.
  guessMomentId: string | null;

  // Position where regular gameplay resumes after Guess
  // the Crowd is complete.
  resumePosition: SavedResumePosition | null;

  // Round-specific starting totals.
  //
  // These allow the round-complete screen to calculate
  // what happened during this round instead of showing
  // only lifetime statistics.
  roundStartHeat: number;
  roundStartRoasts: number;
  roundStartToasts: number;
  roundStartMajorityMatches: number;

  // Used by Home to decide whether Continue Session
  // should be displayed.
  hasActiveSession: boolean;

  // Timestamp of the most recent save.
  updatedAt: string;
};