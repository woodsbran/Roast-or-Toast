// =====================================================
// File: deckBuilder.ts
//
// Purpose:
// Builds a smarter Roast or Toast Moment deck.
//
// The deck builder:
// • Removes duplicate IDs
// • Prioritizes Moments not seen recently
// • Balances categories
// • Avoids long same-category streaks
// • Avoids repeating the final Moment from the last deck
//
// Project: Roast or Toast
// =====================================================

import type { Moment } from "../data/types";

// Number of recently seen Moments that receive the
// strongest repetition penalty.
const STRONG_RECENT_WINDOW = 15;

// =====================================================
// Basic Shuffle
// =====================================================

function shuffleArray<T>(
  items: T[],
): T[] {
  const shuffledItems = [...items];

  for (
    let currentIndex =
      shuffledItems.length - 1;
    currentIndex > 0;
    currentIndex -= 1
  ) {
    const randomIndex = Math.floor(
      Math.random() *
        (currentIndex + 1),
    );

    [
      shuffledItems[currentIndex],
      shuffledItems[randomIndex],
    ] = [
      shuffledItems[randomIndex],
      shuffledItems[currentIndex],
    ];
  }

  return shuffledItems;
}

// =====================================================
// Remove Duplicate Moment IDs
// =====================================================

function removeDuplicateMoments(
  moments: Moment[],
): Moment[] {
  const seenIds = new Set<string>();

  return moments.filter((moment) => {
    if (seenIds.has(moment.id)) {
      return false;
    }

    seenIds.add(moment.id);
    return true;
  });
}

// =====================================================
// Category-Balanced Ordering
// =====================================================

// Rotates through category buckets while avoiding more
// than two consecutive Moments from one category.
function balanceCategories(
  moments: Moment[],
): Moment[] {
  const categoryBuckets =
    new Map<string, Moment[]>();

  for (const moment of moments) {
    const existingBucket =
      categoryBuckets.get(
        moment.category,
      ) ?? [];

    existingBucket.push(moment);

    categoryBuckets.set(
      moment.category,
      existingBucket,
    );
  }

  // Shuffle every category independently.
  for (const [
    category,
    bucket,
  ] of categoryBuckets) {
    categoryBuckets.set(
      category,
      shuffleArray(bucket),
    );
  }

  const balancedDeck: Moment[] = [];

  let previousCategory: string | null =
    null;

  let sameCategoryCount = 0;

  while (categoryBuckets.size > 0) {
    const availableCategories =
      [...categoryBuckets.entries()]
        .filter(
          ([, bucket]) =>
            bucket.length > 0,
        )
        .map(([category]) => category);

    if (
      availableCategories.length === 0
    ) {
      break;
    }

    // Prefer a category different from the previous one.
    let eligibleCategories =
      availableCategories.filter(
        (category) =>
          category !==
          previousCategory,
      );

    // If only one category remains, allow it.
    if (
      eligibleCategories.length === 0
    ) {
      eligibleCategories =
        availableCategories;
    }

    // If the previous category has already appeared twice
    // consecutively, strongly require another category.
    if (
      sameCategoryCount >= 2
    ) {
      const alternatives =
        availableCategories.filter(
          (category) =>
            category !==
            previousCategory,
        );

      if (alternatives.length > 0) {
        eligibleCategories =
          alternatives;
      }
    }

    const chosenCategory =
      eligibleCategories[
        Math.floor(
          Math.random() *
            eligibleCategories.length,
        )
      ];

    const chosenBucket =
      categoryBuckets.get(
        chosenCategory,
      );

    if (
      !chosenBucket ||
      chosenBucket.length === 0
    ) {
      categoryBuckets.delete(
        chosenCategory,
      );

      continue;
    }

    const nextMoment =
      chosenBucket.shift();

    if (!nextMoment) {
      continue;
    }

    balancedDeck.push(nextMoment);

    if (
      chosenCategory ===
      previousCategory
    ) {
      sameCategoryCount += 1;
    } else {
      previousCategory =
        chosenCategory;

      sameCategoryCount = 1;
    }

    if (
      chosenBucket.length === 0
    ) {
      categoryBuckets.delete(
        chosenCategory,
      );
    }
  }

  return balancedDeck;
}

// =====================================================
// Smart Deck Builder
// =====================================================

export function buildSmartDeck(
  moments: Moment[],
  recentMomentIds: string[] = [],
  lastMomentId?: string,
): Moment[] {
  const uniqueMoments =
    removeDuplicateMoments(moments);

  const strongRecentIds = new Set(
    recentMomentIds.slice(
      0,
      STRONG_RECENT_WINDOW,
    ),
  );

  const olderRecentIds = new Set(
    recentMomentIds.slice(
      STRONG_RECENT_WINDOW,
    ),
  );

  // First priority:
  // Moments not contained anywhere in recent history.
  const unseenMoments =
    uniqueMoments.filter(
      (moment) =>
        !strongRecentIds.has(
          moment.id,
        ) &&
        !olderRecentIds.has(
          moment.id,
        ),
    );

  // Second priority:
  // Moments seen less recently.
  const olderRecentMoments =
    uniqueMoments.filter(
      (moment) =>
        olderRecentIds.has(
          moment.id,
        ),
    );

  // Final priority:
  // Moments shown most recently.
  const stronglyRecentMoments =
    uniqueMoments.filter(
      (moment) =>
        strongRecentIds.has(
          moment.id,
        ),
    );

  const balancedUnseen =
    balanceCategories(
      unseenMoments,
    );

  const balancedOlderRecent =
    balanceCategories(
      olderRecentMoments,
    );

  const balancedStrongRecent =
    balanceCategories(
      stronglyRecentMoments,
    );

  const smartDeck = [
    ...balancedUnseen,
    ...balancedOlderRecent,
    ...balancedStrongRecent,
  ];

  // Avoid opening the new deck with the exact Moment
  // shown at the end of the previous deck.
  if (
    lastMomentId &&
    smartDeck.length > 1 &&
    smartDeck[0].id ===
      lastMomentId
  ) {
    const replacementIndex =
      smartDeck.findIndex(
        (moment, index) =>
          index > 0 &&
          moment.id !==
            lastMomentId &&
          moment.category !==
            smartDeck[0].category,
      );

    const safeReplacementIndex =
      replacementIndex > 0
        ? replacementIndex
        : 1;

    [
      smartDeck[0],
      smartDeck[
        safeReplacementIndex
      ],
    ] = [
      smartDeck[
        safeReplacementIndex
      ],
      smartDeck[0],
    ];
  }

  return smartDeck;
}