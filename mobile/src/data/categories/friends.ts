// =====================================================
// File: friends.ts
//
// Purpose:
// Stores Friends category moments.
//
// Project: Roast or Toast
// =====================================================

import type { Moment } from "../scenarios";

export const friendMoments: Moment[] = [
  {
    id: "friends-001",
    category: "Friends",
    question: 'Your friend says "I am outside" but has not left home.',
    roastPhrase: "A documented liar.",
    toastPhrase: "They are manifesting.",
    roastPercentage: 89,
    toastPercentage: 11,
    topComment: "Outside of what? Reality?",
  },
  {
    id: "friends-002",
    category: "Friends",
    question: "Your friend drives across town to help you move.",
    roastPhrase: "They love suffering.",
    toastPhrase: "That is a real friend.",
    roastPercentage: 5,
    toastPercentage: 95,
    topComment: "Friendship tested and passed.",
  },
  {
    id: "friends-003",
    category: "Friends",
    question: "Your friend leaves the party without saying goodbye.",
    roastPhrase: "At least say bye.",
    toastPhrase: "The silent exit is elite.",
    roastPercentage: 51,
    toastPercentage: 49,
    topComment: "If I say goodbye, I will be there another hour.",
  },
  {
    id: "friends-004",
    category: "Friends",
    question: "Your friend remembers your coffee order.",
    roastPhrase: "They are keeping notes.",
    toastPhrase: "That is actually sweet.",
    roastPercentage: 9,
    toastPercentage: 91,
    topComment: "Love language: remembering the extra shot.",
  },
  {
    id: "friends-005",
    category: "Friends",
    question: "Your friend sends an eight-minute voice note.",
    roastPhrase: "Start a podcast.",
    toastPhrase: "I want the full story.",
    roastPercentage: 57,
    toastPercentage: 43,
    topComment: "That voice note had chapters.",
  },
];