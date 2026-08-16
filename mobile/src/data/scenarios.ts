// =====================================================
// File: scenarios.ts
//
// Purpose:
// Combines every Roast or Toast category into one
// complete playable Moment library.
//
// Version 1.1 — Content + Replayability
//
// I am keeping the category files that already work and
// adding School / College plus a fresh v1.1 content pack.
// I am not changing the Smart Deck here.
//
// Project: Roast or Toast
// =====================================================

import { datingMoments } from "./categories/dating";
import { drivingMoments } from "./categories/driving";
import { everydayLifeMoments } from "./categories/everydayLife";
import { familyMoments } from "./categories/family";
import { foodMoments } from "./categories/food";
import { friendMoments } from "./categories/friends";
import { moralDilemmaMoments } from "./categories/moralDilemmas";
import { popCultureMoments } from "./categories/popCulture";
import { schoolCollegeMoments } from "./categories/schoolCollege";
import { socialMediaMoments } from "./categories/socialMedia";
import { travelMoments } from "./categories/travel";
import { workMoments } from "./categories/work";
import { v11FreshMoments } from "./v11FreshMoments";

import type { Moment } from "./types";

export const scenarios: Moment[] = [
  ...datingMoments,
  ...drivingMoments,
  ...everydayLifeMoments,
  ...familyMoments,
  ...foodMoments,
  ...friendMoments,
  ...moralDilemmaMoments,
  ...popCultureMoments,
  ...schoolCollegeMoments,
  ...socialMediaMoments,
  ...travelMoments,
  ...workMoments,

  // The Smart Deck mixes these into the full library, so
  // putting the new pack here does not make it play last.
  ...v11FreshMoments,
];
