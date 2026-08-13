// =====================================================
// File: intermissionContent.ts
//
// Purpose:
// Stores the stronger non-voting break content.
//
// Version 1.1 — Intermission Overhaul
//
// I am removing prediction-style breaks completely.
//
// These breaks are supposed to do something different from
// the main game:
//
// • make people laugh
// • make people think
// • give them a tiny reset
// • give them something positive they may not hear enough
// • occasionally make the room interact
//
// I am keeping the free pool strong, but I am not dumping
// every challenge idea I could ever use into v1.1 because
// I still want room for future themed / premium packs.
//
// Project: Roast or Toast
// =====================================================

export type IntermissionKind =
  | "miniChallenge"
  | "foodForThought"
  | "quickReset"
  | "affirmation"
  | "thisOrThat"
  | "randomReceipt";

export type IntermissionItem = {
  id: string;
  kind: IntermissionKind;
  stamp: string;
  heading: string;
  body?: string;
  footer?: string;
  accent:
    | "roast"
    | "toast"
    | "ink"
    | "heat";
};

export const INTERMISSION_ITEMS:
  IntermissionItem[] = [
    // =====================================================
    // MINI CHALLENGES
    //
    // These should feel interactive, but not like another
    // full game mode.
    // =====================================================

    {
      id: "challenge-one-word",
      kind: "miniChallenge",
      stamp: "MINI CHALLENGE",
      heading:
        "Describe your voting style in one word.",
      body:
        "Harsh? Fair? Chaotic? Generous? Delusional?",
      footer:
        "Keep the word. We are absolutely judging it later.",
      accent: "roast",
    },

    {
      id: "challenge-first-instinct",
      kind: "miniChallenge",
      stamp: "MINI CHALLENGE",
      heading:
        "Next Moment: first instinct only.",
      body:
        "Read it once. Pick a side. No courtroom speech.",
      footer:
        "You get three seconds.",
      accent: "toast",
    },

    {
      id: "challenge-compliment",
      kind: "miniChallenge",
      stamp: "MINI CHALLENGE",
      heading:
        "Give someone here one compliment they would not expect.",
      body:
        "Nothing backhanded. Behave.",
      footer:
        "Then get back to judging everybody.",
      accent: "heat",
    },

    {
      id: "challenge-point",
      kind: "miniChallenge",
      stamp: "MINI CHALLENGE",
      heading:
        "Everybody point.",
      body:
        "Who would survive the longest without their phone?",
      footer:
        "3... 2... 1... point.",
      accent: "roast",
    },

    {
      id: "challenge-switch-seat",
      kind: "miniChallenge",
      stamp: "MINI CHALLENGE",
      heading:
        "Let someone else predict your next answer.",
      body:
        "They call Roast or Toast before you vote.",
      footer:
        "See if they actually know you.",
      accent: "toast",
    },

    {
      id: "challenge-finish-sentence",
      kind: "miniChallenge",
      stamp: "MINI CHALLENGE",
      heading:
        "Finish this sentence in your head:",
      body:
        "I am way more judgmental about ______ than I admit.",
      footer:
        "No explanation required.",
      accent: "ink",
    },

    // =====================================================
    // FOOD FOR THOUGHT
    // =====================================================

    {
      id: "thought-outgrown",
      kind: "foodForThought",
      stamp: "FOOD FOR THOUGHT",
      heading:
        "What is something you have outgrown but still make room for?",
      footer:
        "You do not have to answer out loud.",
      accent: "toast",
    },

    {
      id: "thought-prove",
      kind: "foodForThought",
      stamp: "FOOD FOR THOUGHT",
      heading:
        "What are you still trying to prove — and to who?",
      footer:
        "Sometimes the audience left a long time ago.",
      accent: "roast",
    },

    {
      id: "thought-changed-mind",
      kind: "foodForThought",
      stamp: "FOOD FOR THOUGHT",
      heading:
        "When was the last time you changed your mind about someone?",
      footer:
        "People are allowed to surprise you.",
      accent: "toast",
    },

    {
      id: "thought-peace",
      kind: "foodForThought",
      stamp: "FOOD FOR THOUGHT",
      heading:
        "What are you holding onto that costs more peace than it is worth?",
      footer:
        "Just a thought.",
      accent: "ink",
    },

    {
      id: "thought-version",
      kind: "foodForThought",
      stamp: "FOOD FOR THOUGHT",
      heading:
        "Which version of yourself are you still trying to impress?",
      footer:
        "You already survived being that person.",
      accent: "heat",
    },

    {
      id: "thought-misunderstood",
      kind: "foodForThought",
      stamp: "FOOD FOR THOUGHT",
      heading:
        "What is something people misunderstand about you because you stopped explaining it?",
      footer:
        "Not everything needs a defense.",
      accent: "roast",
    },

    // =====================================================
    // QUICK RESET
    // =====================================================

    {
      id: "reset-jaw",
      kind: "quickReset",
      stamp: "QUICK RESET",
      heading:
        "Unclench your jaw.",
      body:
        "Drop your shoulders. Exhale.",
      footer:
        "You can go back to judging everybody in a second.",
      accent: "toast",
    },

    {
      id: "reset-eyes",
      kind: "quickReset",
      stamp: "QUICK RESET",
      heading:
        "Look away from the screen for five seconds.",
      body:
        "Seriously. Your phone will survive.",
      footer:
        "Okay. Welcome back.",
      accent: "ink",
    },

    {
      id: "reset-breathe",
      kind: "quickReset",
      stamp: "QUICK RESET",
      heading:
        "One slow breath.",
      body:
        "In. Hold. Out.",
      footer:
        "That is the whole assignment.",
      accent: "toast",
    },

    {
      id: "reset-water",
      kind: "quickReset",
      stamp: "QUICK RESET",
      heading:
        "Water check.",
      body:
        "If you have some nearby, take a sip.",
      footer:
        "Tiny maintenance still counts.",
      accent: "heat",
    },

    // =====================================================
    // AFFIRMATIONS / GOOD ENERGY
    // =====================================================

    {
      id: "affirmation-progress",
      kind: "affirmation",
      stamp: "A LITTLE REMINDER",
      heading:
        "You do not have to have everything figured out to be making progress.",
      footer:
        "Keep going.",
      accent: "toast",
    },

    {
      id: "affirmation-boundary",
      kind: "affirmation",
      stamp: "A LITTLE REMINDER",
      heading:
        "You are allowed to have a boundary even if someone does not like it.",
      footer:
        "Discomfort is not the same thing as wrongdoing.",
      accent: "roast",
    },

    {
      id: "affirmation-rest",
      kind: "affirmation",
      stamp: "A LITTLE REMINDER",
      heading:
        "Rest is not something you have to earn by burning yourself out first.",
      footer:
        "That rule was fake.",
      accent: "heat",
    },

    {
      id: "affirmation-enough",
      kind: "affirmation",
      stamp: "A LITTLE REMINDER",
      heading:
        "You are allowed to enjoy where you are while you figure out where you are going.",
      footer:
        "Both can be true.",
      accent: "toast",
    },

    {
      id: "affirmation-explain",
      kind: "affirmation",
      stamp: "A LITTLE REMINDER",
      heading:
        "You do not owe everyone the full explanation.",
      footer:
        "Some answers can stay short.",
      accent: "ink",
    },

    // =====================================================
    // THIS OR THAT
    // =====================================================

    {
      id: "choice-peace-closure",
      kind: "thisOrThat",
      stamp: "THIS OR THAT",
      heading:
        "PEACE",
      body:
        "or",
      footer:
        "CLOSURE",
      accent: "toast",
    },

    {
      id: "choice-right-understood",
      kind: "thisOrThat",
      stamp: "THIS OR THAT",
      heading:
        "BEING RIGHT",
      body:
        "or",
      footer:
        "BEING UNDERSTOOD",
      accent: "roast",
    },

    {
      id: "choice-plans-spontaneous",
      kind: "thisOrThat",
      stamp: "THIS OR THAT",
      heading:
        "PLANS",
      body:
        "or",
      footer:
        "SPONTANEOUS",
      accent: "heat",
    },

    {
      id: "choice-text-call",
      kind: "thisOrThat",
      stamp: "THIS OR THAT",
      heading:
        "TEXT IT",
      body:
        "or",
      footer:
        "CALL ME",
      accent: "ink",
    },

    // =====================================================
    // RANDOM RECEIPTS
    // =====================================================

    {
      id: "receipt-access",
      kind: "randomReceipt",
      stamp: "RANDOM RECEIPT",
      heading:
        "Not everyone deserves access to every version of you.",
      footer:
        "That is not secrecy. That is discernment.",
      accent: "roast",
    },

    {
      id: "receipt-deep",
      kind: "randomReceipt",
      stamp: "RANDOM RECEIPT",
      heading:
        "Some things are not that deep.",
      body:
        "Some things absolutely are.",
      footer:
        "Good luck telling the difference.",
      accent: "toast",
    },

    {
      id: "receipt-vibes",
      kind: "randomReceipt",
      stamp: "RANDOM RECEIPT",
      heading:
        "You can learn a lot from what feels easy around someone.",
      footer:
        "Peace is information too.",
      accent: "heat",
    },

    {
      id: "receipt-response",
      kind: "randomReceipt",
      stamp: "RANDOM RECEIPT",
      heading:
        "A delayed response is still a response.",
      footer:
        "Do with that what you will.",
      accent: "ink",
    },
  ];
