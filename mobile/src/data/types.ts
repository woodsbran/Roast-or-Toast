// =====================================================
// File: types.ts
//
// Purpose:
// Defines the shared structure used by every Roast or
// Toast moment.
//
// Keeping this type in its own file prevents circular
// imports between scenarios.ts and the category files.
//
// Project: Roast or Toast
// =====================================================

export type Moment = {
  // Unique ID used to identify the moment.
  id: string;

  // Category used for styling and future filtering.
  category: string;

  // Main situation shown to the player.
  question: string;

  // Short phrase shown below the Roast option.
  roastPhrase: string;

  // Short phrase shown below the Toast option.
  toastPhrase: string;

  // Temporary prototype result percentages.
  roastPercentage: number;
  toastPercentage: number;

  // Temporary top community comment.
  topComment: string;
};