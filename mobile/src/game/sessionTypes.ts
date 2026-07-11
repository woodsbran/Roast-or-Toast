// =====================================================
// File: sessionTypes.ts
//
// Purpose:
// Defines the information required to save and restore
// an active Roast or Toast gameplay session.
//
// Player progress such as Heat and level is stored
// separately. This file focuses on where the player
// currently is inside the game.
//
// Project: Roast or Toast
// =====================================================

import type { VoteProgressResult } from "./progressTypes";

// A normal Roast or Toast answer.
export type SavedVoteChoice = "roast" | "toast" | null";

// Special gameplay screen currently being displayed.
export type SavedIntermissionType =
  | "quick"
  | "guess"
  | "recap"
  | null;

// Stores where regular gameplay resumes after a fresh
// Moment is used by Guess the Crowd.
export type SavedResumePosition = {
  // Ordered Moment IDs for the saved deck.
  deckIds: string[];

  // Position inside that saved deck.
  index: number;
};

// Complete locally saved gameplay session.
export type SavedGameSession = {
  // Ordered Moment IDs for the current shuffled deck.
  deckIds: string[];

  // Current position inside the shuffled deck.
  momentIndex: number;

  // Number of regular Moments completed in this session.
  completedMoments: number;

  // Vote already selected on the current Moment.
  //
  // Keeping this allows the player to return to the
  // results they were viewing instead of voting twice.
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

  // Used by Home to determine whether Continue Session
  // should be displayed.
  hasActiveSession: boolean;

  // Timestamp of the most recent save.
  updatedAt: string;
};