// =====================================================
// File: scenarios.ts
//
// Purpose:
// Combines every completed Roast or Toast category into
// one playable list.
//
// The Scenario screen shuffles this complete list when
// a new gameplay session begins.
//
// Project: Roast or Toast
// =====================================================

import { datingMoments } from "./categories/dating";
import { foodMoments } from "./categories/food";
import { friendMoments } from "./categories/friends";
import { travelMoments } from "./categories/travel";
import { workMoments } from "./categories/work";

import type { Moment } from "./types";

// Combines every completed category.
//
// The order written here does not control the order shown
// in the app because scenario.tsx shuffles the full list.
export const scenarios: Moment[] = [
  ...workMoments,
  ...friendMoments,
  ...datingMoments,
  ...foodMoments,
  ...travelMoments,
];