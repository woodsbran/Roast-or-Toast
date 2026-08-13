// =====================================================
// File: useReducedMotion.ts
//
// Purpose:
// Lets the game respect the player's iPhone motion setting.
//
// Version 1.1 — Finish Batch A
//
// I still want Roast or Toast to feel animated and physical,
// but I do not want the motion to become a barrier for someone
// who has Reduce Motion turned on.
//
// I keep this in one hook so I am not checking the iOS setting
// differently on every screen.
//
// Project: Roast or Toast
// =====================================================

import {
  AccessibilityInfo,
} from "react-native";

import {
  useEffect,
  useState,
} from "react";

export default function useReducedMotion() {
  const [
    reduceMotion,
    setReduceMotion,
  ] =
    useState(false);

  useEffect(() => {
    let isActive = true;

    // I read the current system preference when this hook loads.
    void AccessibilityInfo
      .isReduceMotionEnabled()
      .then(
        (
          enabled,
        ) => {
          if (isActive) {
            setReduceMotion(
              enabled,
            );
          }
        },
      );

    // I also listen for changes so the player does not have
    // to restart the app after changing Reduce Motion.
    const subscription =
      AccessibilityInfo.addEventListener(
        "reduceMotionChanged",
        (
          enabled,
        ) => {
          setReduceMotion(
            enabled,
          );
        },
      );

    return () => {
      isActive = false;

      subscription.remove();
    };
  }, []);

  return reduceMotion;
}
