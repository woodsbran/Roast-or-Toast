// =====================================================
// File: intermissionStorage.ts
//
// Purpose:
// Controls the intermission rotation.
//
// Version 1.1 — Intermission Overhaul
//
// I do not want:
// • the same card twice
// • the same type twice in a row
// • three heavy reflection cards back-to-back
//
// I save both the recent IDs and the recent break kinds.
//
// The last 8 cards are blocked first.
// The last 2 break types are also avoided when possible.
//
// Project: Roast or Toast
// =====================================================

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  INTERMISSION_ITEMS,
  type IntermissionItem,
  type IntermissionKind,
} from "./intermissionContent";

const IDS_KEY =
  "@roast_or_toast_recent_intermission_ids";

const KINDS_KEY =
  "@roast_or_toast_recent_intermission_kinds";

const ID_HISTORY_LIMIT = 8;
const KIND_HISTORY_LIMIT = 2;

async function loadStringArray(
  key: string,
): Promise<string[]> {
  try {
    const raw =
      await AsyncStorage.getItem(
        key,
      );

    if (!raw) {
      return [];
    }

    const parsed =
      JSON.parse(raw);

    return Array.isArray(parsed)
      ? parsed.filter(
          (value): value is string =>
            typeof value === "string",
        )
      : [];
  } catch {
    return [];
  }
}

async function saveStringArray(
  key: string,
  values: string[],
  limit: number,
): Promise<void> {
  await AsyncStorage.setItem(
    key,
    JSON.stringify(
      values.slice(
        -limit,
      ),
    ),
  );
}

function isKind(
  value: string,
): value is IntermissionKind {
  return [
    "miniChallenge",
    "foodForThought",
    "quickReset",
    "affirmation",
    "thisOrThat",
    "randomReceipt",
  ].includes(value);
}

export async function pickNextIntermission():
  Promise<IntermissionItem> {
  const recentIds =
    await loadStringArray(
      IDS_KEY,
    );

  const recentKindStrings =
    await loadStringArray(
      KINDS_KEY,
    );

  const recentKinds =
    recentKindStrings.filter(
      isKind,
    );

  // First pass:
  // avoid both recently shown cards AND recently used types.
  let pool =
    INTERMISSION_ITEMS.filter(
      (item) =>
        !recentIds.includes(
          item.id,
        ) &&
        !recentKinds.includes(
          item.kind,
        ),
    );

  // Second pass:
  // if that is too strict, keep avoiding recent cards.
  if (pool.length === 0) {
    pool =
      INTERMISSION_ITEMS.filter(
        (item) =>
          !recentIds.includes(
            item.id,
          ),
      );
  }

  // Final fallback:
  // the pool is large enough that this should be rare,
  // but I still keep the app safe.
  if (pool.length === 0) {
    pool =
      INTERMISSION_ITEMS;
  }

  const selected =
    pool[
      Math.floor(
        Math.random() *
          pool.length,
      )
    ];

  await Promise.all([
    saveStringArray(
      IDS_KEY,
      [
        ...recentIds,
        selected.id,
      ],
      ID_HISTORY_LIMIT,
    ),

    saveStringArray(
      KINDS_KEY,
      [
        ...recentKinds,
        selected.kind,
      ],
      KIND_HISTORY_LIMIT,
    ),
  ]);

  return selected;
}

export async function clearIntermissionHistory():
  Promise<void> {
  await Promise.all([
    AsyncStorage.removeItem(
      IDS_KEY,
    ),

    AsyncStorage.removeItem(
      KINDS_KEY,
    ),
  ]);
}
