// =====================================================
// File: popCulture.ts
//
// Purpose:
// Stores Pop Culture category Moments.
//
// Content Direction:
// • Movies, television, music, and fandom
// • Spoilers and streaming etiquette
// • Popularity, criticism, and fan behavior
// • Situations that remain understandable over time
//
// Important:
// Existing IDs are preserved so saved sessions remain
// compatible after this content update.
//
// Project: Roast or Toast
// =====================================================

import type { Moment } from "../types";

export const popCultureMoments: Moment[] = [
  {
    id: "pop-culture-001",
    category: "Pop Culture",
    question:
      "Someone decides a popular show is terrible after watching half of the first episode.",
    roastPhrase: "Give it one full episode.",
    toastPhrase: "They know what they dislike.",
    roastPercentage: 62,
    toastPercentage: 38,
    topComment:
      "Thirty minutes may be enough for chemistry, but not always for a whole series.",
  },
  {
    id: "pop-culture-002",
    category: "Pop Culture",
    question:
      "Someone posts a major spoiler the morning after an episode releases because they believe everyone had enough time.",
    roastPhrase: "Some people were asleep.",
    toastPhrase: "Avoid social media.",
    roastPercentage: 84,
    toastPercentage: 16,
    topComment:
      "The spoiler window cannot be one commute long.",
  },
  {
    id: "pop-culture-003",
    category: "Pop Culture",
    question:
      "Someone wears a band shirt because they like the design but has never listened to the band.",
    roastPhrase: "Learn one song.",
    toastPhrase: "It is just clothing.",
    roastPercentage: 43,
    toastPercentage: 57,
    topComment:
      "The shirt is merchandise, not a music certification.",
  },
  {
    id: "pop-culture-004",
    category: "Pop Culture",
    question:
      "Someone watches two episodes ahead in a show you started together but agrees to rewatch them with you.",
    roastPhrase: "The betrayal already happened.",
    toastPhrase: "They are willing to rewatch.",
    roastPercentage: 54,
    toastPercentage: 46,
    topComment:
      "The agreement was broken, but restitution includes snacks.",
  },
  {
    id: "pop-culture-005",
    category: "Pop Culture",
    question:
      "Someone refuses to watch a subtitled movie after a long workday because they do not want to read.",
    roastPhrase: "You are missing great movies.",
    toastPhrase: "Entertainment should feel easy.",
    roastPercentage: 51,
    toastPercentage: 49,
    topComment:
      "A fair mood-based decision that becomes questionable as a permanent rule.",
  },
  {
    id: "pop-culture-006",
    category: "Pop Culture",
    question:
      "Someone records their favorite song at a concert but watches the rest without their phone.",
    roastPhrase: "Experience it fully.",
    toastPhrase: "That is a good balance.",
    roastPercentage: 19,
    toastPercentage: 81,
    topComment:
      "One memory captured. The rest actually lived.",
  },
  {
    id: "pop-culture-007",
    category: "Pop Culture",
    question:
      "Someone discovers an older song through a viral video and calls it their new favorite.",
    roastPhrase: "You are late.",
    toastPhrase: "Good music has no deadline.",
    roastPercentage: 24,
    toastPercentage: 76,
    topComment:
      "The discovery was late. The enjoyment is still valid.",
  },
  {
    id: "pop-culture-008",
    category: "Pop Culture",
    question:
      "Someone skips the opening theme every episode except the season premiere and finale.",
    roastPhrase: "Respect the intro.",
    toastPhrase: "That is efficient.",
    roastPercentage: 39,
    toastPercentage: 61,
    topComment:
      "A reasonable compromise in the ongoing war against theme songs.",
  },
  {
    id: "pop-culture-009",
    category: "Pop Culture",
    question:
      "Someone rates a movie immediately after leaving the theater, then changes the score the next day.",
    roastPhrase: "Think before reviewing.",
    toastPhrase: "Opinions can evolve.",
    roastPercentage: 37,
    toastPercentage: 63,
    topComment:
      "The first review was emotional. The second had breakfast.",
  },
  {
    id: "pop-culture-010",
    category: "Pop Culture",
    question:
      "Someone avoids an artist because the fanbase makes every conversation exhausting.",
    roastPhrase: "Judge the music itself.",
    toastPhrase: "Fandom affects the experience.",
    roastPercentage: 53,
    toastPercentage: 47,
    topComment:
      "The songs are innocent. The comment section is not.",
  },
  {
    id: "pop-culture-011",
    category: "Pop Culture",
    question:
      "Someone calls a movie overrated after enjoying it because they think the praise became excessive.",
    roastPhrase: "You still liked it.",
    toastPhrase: "Good can still be overrated.",
    roastPercentage: 47,
    toastPercentage: 53,
    topComment:
      "Enjoyment and cultural exhaustion can apparently coexist.",
  },
  {
    id: "pop-culture-012",
    category: "Pop Culture",
    question:
      "Someone talks during a movie they have already seen but only to explain details you ask about.",
    roastPhrase: "Wait until it ends.",
    toastPhrase: "You asked the question.",
    roastPercentage: 41,
    toastPercentage: 59,
    topComment:
      "Requested commentary is different from an unsolicited director’s cut.",
  },
  {
    id: "pop-culture-013",
    category: "Pop Culture",
    question:
      "Someone feels genuinely sad when a celebrity couple they followed for years breaks up.",
    roastPhrase: "You do not know them.",
    toastPhrase: "People get emotionally invested.",
    roastPercentage: 58,
    toastPercentage: 42,
    topComment:
      "Parasocial grief is still grief, just with better publicists.",
  },
  {
    id: "pop-culture-014",
    category: "Pop Culture",
    question:
      "Someone buys another movie ticket because they slept through part of the first showing.",
    roastPhrase: "The nap was the review.",
    toastPhrase: "They deserve a real chance.",
    roastPercentage: 42,
    toastPercentage: 58,
    topComment:
      "Expensive accountability, but accountability nonetheless.",
  },
  {
    id: "pop-culture-015",
    category: "Pop Culture",
    question:
      "Someone says the book was better but still recommends the movie to people who do not like reading.",
    roastPhrase: "Stop comparing everything.",
    toastPhrase: "Both can have value.",
    roastPercentage: 18,
    toastPercentage: 82,
    topComment:
      "A book person displaying restraint and practical judgment.",
  },
  {
    id: "pop-culture-016",
    category: "Pop Culture",
    question:
      "Someone wears a full costume to a movie premiere even though nobody else in their group dresses up.",
    roastPhrase: "That is doing too much.",
    toastPhrase: "Commit to the experience.",
    roastPercentage: 29,
    toastPercentage: 71,
    topComment:
      "Being the only one dressed up is either brave or spiritually exhausting.",
  },
  {
    id: "pop-culture-017",
    category: "Pop Culture",
    question:
      "Someone refuses to watch a classic because the pacing feels too slow by modern standards.",
    roastPhrase: "Give it a chance.",
    toastPhrase: "Entertainment tastes change.",
    roastPercentage: 57,
    toastPercentage: 43,
    topComment:
      "Historical importance does not guarantee personal enjoyment.",
  },
  {
    id: "pop-culture-018",
    category: "Pop Culture",
    question:
      "Someone plays the same album daily for a month because it helps them focus.",
    roastPhrase: "Find new music.",
    toastPhrase: "They found what works.",
    roastPercentage: 27,
    toastPercentage: 73,
    topComment:
      "The album is employed full time now.",
  },
  {
    id: "pop-culture-019",
    category: "Pop Culture",
    question:
      "Someone brings their favorite celebrity into nearly every unrelated conversation.",
    roastPhrase: "Develop another topic.",
    toastPhrase: "Let people enjoy things.",
    roastPercentage: 71,
    toastPercentage: 29,
    topComment:
      "The celebrity has range. The conversation does not.",
  },
  {
    id: "pop-culture-020",
    category: "Pop Culture",
    question:
      "Someone pauses a documentary repeatedly to verify claims and read more about the topic.",
    roastPhrase: "Let the documentary finish.",
    toastPhrase: "Curiosity is a good thing.",
    roastPercentage: 44,
    toastPercentage: 56,
    topComment:
      "The two-hour documentary has become an independent research course.",
  },
];