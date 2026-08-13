// =====================================================
// File: typography.ts
//
// Purpose:
// This is the typography voice for Roast or Toast.
//
// Version 1.1 — Typography / Design System
//
// I do not want every screen picking random sizes, weights,
// spacing, and capitalization anymore.
//
// These roles give the whole app one recognizable voice:
//
// • display = loud poster statements
// • moment = the actual Moment / scenario
// • stamp = printed labels and category tags
// • note = personality copy
// • body = readable supporting copy
// • number = Heat, percentages, levels, streaks
// • action = buttons / game actions
//
// I am getting personality from scale, compression,
// tracking, casing, rotation, and placement instead of
// throwing a bunch of unrelated fonts into the app.
//
// Project: Roast or Toast
// =====================================================

import type {
  TextStyle,
} from "react-native";

export const Typography = {
  displayXL: {
    fontSize: 46,
    lineHeight: 45,
    fontWeight: "900",
    letterSpacing: -2.3,
  } satisfies TextStyle,

  displayLG: {
    fontSize: 38,
    lineHeight: 39,
    fontWeight: "900",
    letterSpacing: -1.8,
  } satisfies TextStyle,

  displayMD: {
    fontSize: 31,
    lineHeight: 33,
    fontWeight: "900",
    letterSpacing: -1.2,
  } satisfies TextStyle,

  moment: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "900",
    letterSpacing: -1.25,
  } satisfies TextStyle,

  momentCompact: {
    fontSize: 24,
    lineHeight: 29,
    fontWeight: "900",
    letterSpacing: -0.95,
  } satisfies TextStyle,

  stamp: {
    fontSize: 8,
    lineHeight: 11,
    fontWeight: "900",
    letterSpacing: 1.45,
  } satisfies TextStyle,

  stampLarge: {
    fontSize: 9,
    lineHeight: 12,
    fontWeight: "900",
    letterSpacing: 1.6,
  } satisfies TextStyle,

  note: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: "700",
    letterSpacing: -0.35,
  } satisfies TextStyle,

  body: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "650",
  } satisfies TextStyle,

  bodySmall: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "700",
  } satisfies TextStyle,

  numberHero: {
    fontSize: 48,
    lineHeight: 50,
    fontWeight: "900",
    letterSpacing: -2.1,
  } satisfies TextStyle,

  numberLarge: {
    fontSize: 36,
    lineHeight: 38,
    fontWeight: "900",
    letterSpacing: -1.4,
  } satisfies TextStyle,

  numberMedium: {
    fontSize: 26,
    lineHeight: 29,
    fontWeight: "900",
    letterSpacing: -0.8,
  } satisfies TextStyle,

  action: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "900",
    letterSpacing: 1.45,
  } satisfies TextStyle,
} as const;
