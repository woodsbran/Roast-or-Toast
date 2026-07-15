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
// The Smart Deck builder controls the order shown during
// gameplay. The order of the arrays below does not decide
// which Moment appears first.
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
// • Moral Dilemmas
// • Pop Culture
// • Social Media
// • Travel
// • Work
//
// The Smart Deck system:
//
// • Shuffles every individual Moment
// • Prioritizes recently unseen Moments
// • Mixes categories throughout the round
// • Avoids excessive category repetition
// • Pushes recently displayed Moments toward the end
// • Preserves the exact deck for Continue Session
// =====================================================

export const scenarios: Moment[] = [
  ...datingMoments,
  ...drivingMoments,
  ...everydayLifeMoments,
  ...familyMoments,
  ...foodMoments,
  ...friendMoments,
  ...moralDilemmaMoments,
  ...popCultureMoments,
  ...socialMediaMoments,
  ...travelMoments,
  ...workMoments,
];