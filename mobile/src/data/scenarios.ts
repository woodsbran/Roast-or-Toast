// =====================================================
// File: scenarios.ts
//
// Purpose:
// Combines every Roast or Toast category into one
// complete playable Moment library.
//
// Important:
// A category file can exist inside the project, but its
// Moments will not appear in gameplay unless that file is:
//
// • Imported below
// • Added to the scenarios array
//
// The smart deck builder controls the order shown during
// gameplay. The order of the arrays below does not decide
// which question appears first.
//
// Project: Roast or Toast
// =====================================================

import { datingMoments } from "./categories/dating";
import { drivingMoments } from "./categories/driving";
import { everydayLifeMoments } from "./categories/everydayLife";
import { familyMoments } from "./categories/family";
import { foodMoments } from "./categories/food";
import { friendMoments } from "./categories/friends";
import { popCultureMoments } from "./categories/popCulture";
import { socialMediaMoments } from "./categories/socialMedia";
import { travelMoments } from "./categories/travel";
import { workMoments } from "./categories/work";

import type { Moment } from "./types";

// =====================================================
// Complete Playable Library
// =====================================================
//
// Current Categories:
//
// • Dating
// • Driving
// • Everyday Life
// • Family
// • Food
// • Friends
// • Pop Culture
// • Social Media
// • Travel
// • Work
//
// The smart shuffle system will:
//
// • Prioritize recently unseen Moments
// • Mix categories throughout the round
// • Avoid excessive category repetition
// • Push recently displayed Moments toward the end
// • Preserve the exact deck when Continue Session is used
// =====================================================

export const scenarios: Moment[] = [
  ...datingMoments,
  ...drivingMoments,
  ...everydayLifeMoments,
  ...familyMoments,
  ...foodMoments,
  ...friendMoments,
  ...popCultureMoments,
  ...socialMediaMoments,
  ...travelMoments,
  ...workMoments,
];