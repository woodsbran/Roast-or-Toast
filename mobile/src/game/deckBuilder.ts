// =====================================================
// File: deckBuilder.ts
//
// Purpose:
// Builds a fresh, category-balanced gameplay deck.
//
// The Smart Deck system:
//
// • Shuffles every individual Moment
// • Prioritizes Moments the player has not seen recently
// • Spreads categories throughout the deck
// • Avoids showing the same category back-to-back
// • Pushes recently seen Moments toward the end
// • Prevents the first Moment from matching the last
//   Moment shown in the previous deck
// • Safely recycles content when the library has been
//   heavily played
//
// Continue Session does not call this file. Saved sessions
// restore their exact existing Moment order.
//
// Project: Roast or Toast
// =====================================================

import type {
  Moment,
} from "../data/types";

// =====================================================
// Internal Types
// =====================================================

// Groups Moments by their category name.
type CategoryMomentMap = Map<
  string,
  Moment[]
>;

// Tracks one shuffled category while the final deck is
// being assembled.
type CategoryQueue = {
  category: string;
  moments: Moment[];
};

// =====================================================
// Basic Shuffle
// =====================================================

// Returns a new shuffled array without changing the
// original array.
//
// This uses the Fisher-Yates shuffle so every individual
// Moment has a fair opportunity to move to any position.
function shuffleArray<T>(
  items: T[],
): T[] {
  const shuffledItems = [
    ...items,
  ];

  for (
    let currentIndex =
      shuffledItems.length - 1;

    currentIndex > 0;

    currentIndex -= 1
  ) {
    const randomIndex =
      Math.floor(
        Math.random() *
          (currentIndex + 1),
      );

    const temporaryItem =
      shuffledItems[
        currentIndex
      ];

    shuffledItems[
      currentIndex
    ] =
      shuffledItems[
        randomIndex
      ];

    shuffledItems[
      randomIndex
    ] =
      temporaryItem;
  }

  return shuffledItems;
}

// =====================================================
// Remove Invalid or Duplicate Moments
// =====================================================

// Protects the deck from accidentally receiving duplicate
// IDs if the same Moment is imported more than once.
function getUniqueMoments(
  moments: Moment[],
): Moment[] {
  const seenMomentIds =
    new Set<string>();

  return moments.filter(
    (moment) => {
      if (
        !moment.id ||
        seenMomentIds.has(
          moment.id,
        )
      ) {
        return false;
      }

      seenMomentIds.add(
        moment.id,
      );

      return true;
    },
  );
}

// =====================================================
// Group Moments by Category
// =====================================================

function groupMomentsByCategory(
  moments: Moment[],
): CategoryMomentMap {
  const categoryMap:
    CategoryMomentMap =
      new Map();

  moments.forEach(
    (moment) => {
      const existingCategory =
        categoryMap.get(
          moment.category,
        );

      if (existingCategory) {
        existingCategory.push(
          moment,
        );

        return;
      }

      categoryMap.set(
        moment.category,
        [moment],
      );
    },
  );

  return categoryMap;
}

// =====================================================
// Build Shuffled Category Queues
// =====================================================

// Every category receives its own independently shuffled
// Moment queue.
//
// This is what ensures the actual statements change—not
// only the order of the category labels.
function createCategoryQueues(
  moments: Moment[],
): CategoryQueue[] {
  const categoryMap =
    groupMomentsByCategory(
      moments,
    );

  return shuffleArray(
    Array.from(
      categoryMap.entries(),
    ).map(
      ([
        category,
        categoryMoments,
      ]) => ({
        category,

        moments:
          shuffleArray(
            categoryMoments,
          ),
      }),
    ),
  );
}

// =====================================================
// Select the Next Category
// =====================================================

// Selects a category that still contains Moments.
//
// It strongly prefers a category different from the one
// used immediately before it.
function chooseNextCategoryQueue(
  availableQueues:
    CategoryQueue[],

  previousCategory:
    string | null,
): CategoryQueue | null {
  const nonEmptyQueues =
    availableQueues.filter(
      (queue) =>
        queue.moments.length >
        0,
    );

  if (
    nonEmptyQueues.length ===
    0
  ) {
    return null;
  }

  // Prefer categories that are different from the last
  // category shown.
  const differentCategoryQueues =
    nonEmptyQueues.filter(
      (queue) =>
        queue.category !==
        previousCategory,
    );

  const candidateQueues =
    differentCategoryQueues.length >
    0
      ? differentCategoryQueues
      : nonEmptyQueues;

  // Categories with more remaining content receive a
  // slightly better chance of selection. This keeps large
  // categories from being stranded at the end while still
  // allowing category variety.
  const totalRemainingMoments =
    candidateQueues.reduce(
      (
        total,
        queue,
      ) =>
        total +
        queue.moments.length,

      0,
    );

  let randomPosition =
    Math.random() *
    totalRemainingMoments;

  for (
    const queue of
    candidateQueues
  ) {
    randomPosition -=
      queue.moments.length;

    if (
      randomPosition <= 0
    ) {
      return queue;
    }
  }

  return (
    candidateQueues[
      candidateQueues.length -
        1
    ] ?? null
  );
}

// =====================================================
// Interleave Categories
// =====================================================

// Builds one complete deck by repeatedly selecting from
// independently shuffled category queues.
function interleaveCategoryQueues(
  moments: Moment[],
): Moment[] {
  const categoryQueues =
    createCategoryQueues(
      moments,
    );

  const finalDeck:
    Moment[] = [];

  let previousCategory:
    string | null = null;

  while (
    finalDeck.length <
    moments.length
  ) {
    const selectedQueue =
      chooseNextCategoryQueue(
        categoryQueues,
        previousCategory,
      );

    if (!selectedQueue) {
      break;
    }

    const nextMoment =
      selectedQueue.moments.shift();

    if (!nextMoment) {
      continue;
    }

    finalDeck.push(
      nextMoment,
    );

    previousCategory =
      nextMoment.category;
  }

  return finalDeck;
}

// =====================================================
// Prevent an Immediate Repeat
// =====================================================

// If a previous Moment ID is supplied, the new deck should
// not begin with that exact same Moment.
//
// This is especially useful when Endless mode reaches the
// end of one deck and immediately builds another.
function movePreviousMomentAwayFromFront(
  deck: Moment[],

  previousMomentId?:
    string,
): Moment[] {
  if (
    !previousMomentId ||
    deck.length <= 1 ||
    deck[0]?.id !==
      previousMomentId
  ) {
    return deck;
  }

  const replacementIndex =
    deck.findIndex(
      (
        moment,
        index,
      ) =>
        index > 0 &&
        moment.id !==
          previousMomentId &&
        moment.category !==
          deck[0]?.category,
    );

  // If no different category exists, use any different
  // Moment instead.
  const safeReplacementIndex =
    replacementIndex >= 0
      ? replacementIndex
      : deck.findIndex(
          (
            moment,
            index,
          ) =>
            index > 0 &&
            moment.id !==
              previousMomentId,
        );

  if (
    safeReplacementIndex <
    0
  ) {
    return deck;
  }

  const updatedDeck = [
    ...deck,
  ];

  const firstMoment =
    updatedDeck[0];

  updatedDeck[0] =
    updatedDeck[
      safeReplacementIndex
    ];

  updatedDeck[
    safeReplacementIndex
  ] = firstMoment;

  return updatedDeck;
}

// =====================================================
// Smart Deck Builder
// =====================================================

// Builds a fresh deck from every available Moment.
//
// Recently seen Moments are not deleted permanently.
// They are moved behind unseen content so the player gets
// the freshest possible statements first.
//
// Parameters:
//
// allMoments:
// Complete playable Moment library.
//
// recentMomentIds:
// IDs saved by recentMomentsStorage.ts.
//
// previousMomentId:
// Optional ID of the Moment shown immediately before this
// new deck is built.
export function buildSmartDeck(
  allMoments: Moment[],

  recentMomentIds:
    string[] = [],

  previousMomentId?:
    string,
): Moment[] {
  const uniqueMoments =
    getUniqueMoments(
      allMoments,
    );

  if (
    uniqueMoments.length <=
    1
  ) {
    return uniqueMoments;
  }

  const recentMomentIdSet =
    new Set(
      recentMomentIds,
    );

  // Moments the player has not seen recently.
  const freshMoments =
    uniqueMoments.filter(
      (moment) =>
        !recentMomentIdSet.has(
          moment.id,
        ),
    );

  // Moments that are still inside recent history.
  const recentMoments =
    uniqueMoments.filter(
      (moment) =>
        recentMomentIdSet.has(
          moment.id,
        ),
    );

  // Build each section independently so statements and
  // categories are shuffled in both sections.
  const freshDeck =
    interleaveCategoryQueues(
      freshMoments,
    );

  const recycledDeck =
    interleaveCategoryQueues(
      recentMoments,
    );

  // Fresh content always appears before recycled content.
  //
  // When almost everything has been seen, the recycled
  // section still guarantees that gameplay can continue.
  const combinedDeck = [
    ...freshDeck,
    ...recycledDeck,
  ];

  return movePreviousMomentAwayFromFront(
    combinedDeck,
    previousMomentId,
  );
}