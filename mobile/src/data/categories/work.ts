// =====================================================
// File: work.ts
//
// Purpose:
// Stores Work category moments.
//
// Project: Roast or Toast
// =====================================================

import type { Moment } from "../types";

export const workMoments: Moment[] = [
  {
    id: "work-001",
    category: "Work",
    question: 'Your coworker replied all just to say "Thanks."',
    roastPhrase: "Absolutely not.",
    toastPhrase: "They were being polite.",
    roastPercentage: 86,
    toastPercentage: 14,
    topComment: "Outlook privileges revoked immediately.",
  },
  {
    id: "work-002",
    category: "Work",
    question: "Your boss scheduled a meeting that could have been an email.",
    roastPhrase: "Calendar crime.",
    toastPhrase: "Maybe it needed discussion.",
    roastPercentage: 91,
    toastPercentage: 9,
    topComment: "Thirty minutes gone for three bullet points.",
  },
  {
    id: "work-003",
    category: "Work",
    question: "Your coworker covered your shift during an emergency.",
    roastPhrase: "They want something.",
    toastPhrase: "That is a real one.",
    roastPercentage: 7,
    toastPercentage: 93,
    topComment: "Protect that coworker at all costs.",
  },
  {
    id: "work-004",
    category: "Work",
    question: "Your coworker gives you credit for your idea in front of the boss.",
    roastPhrase: "Bare minimum.",
    toastPhrase: "That deserves respect.",
    roastPercentage: 13,
    toastPercentage: 87,
    topComment: "A rare workplace sighting.",
  },
  {
    id: "work-005",
    category: "Work",
    question: 'Your coworker sends "???" five minutes after messaging you.',
    roastPhrase: "Blocked on Teams.",
    toastPhrase: "They need an answer.",
    roastPercentage: 84,
    toastPercentage: 16,
    topComment: "Five minutes is not a service-level agreement.",
  },
];