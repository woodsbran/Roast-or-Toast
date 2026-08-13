// =====================================================
// File: MomentTransition.tsx
//
// Purpose:
// Handles the transition between regular Moments.
//
// Version 1.1 — Reduce Motion Hotfix
//
// I found one accessibility gap in the first pass:
//
// I updated Results, Guess the Crowd, and Intermissions to
// respect Reduce Motion, but the OUTER Moment transition
// was still responsible for displaying the full gameplay
// board.
//
// When iOS Reduce Motion is on, I do not want this wrapper
// sitting in an unfinished animation state and hiding the
// Roast / Toast vote area.
//
// What I am doing now:
// • normal motion = keep the slide / fade transition
// • Reduce Motion = show the entire Moment immediately
// • Reduce Motion = Next Moment advances immediately instead
//   of trying to animate the old Moment off-screen
//
// The children and gameplay logic do not change.
//
// Project: Roast or Toast
// =====================================================

import {
  forwardRef,
  type ReactNode,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

import {
  Animated,
  Easing,
  StyleSheet,
} from "react-native";

import useReducedMotion from "../hooks/useReducedMotion";

export type MomentTransitionHandle = {
  playExit: (
    onComplete: () => void,
  ) => void;
};

type MomentTransitionProps = {
  transitionKey:
    string | number;

  children:
    ReactNode;
};

const MomentTransition =
  forwardRef<
    MomentTransitionHandle,
    MomentTransitionProps
  >(
    function MomentTransition(
      {
        transitionKey,
        children,
      },
      ref,
    ) {
      const reduceMotion =
        useReducedMotion();

      // I keep opacity and position separate so the regular
      // transition can stay subtle instead of flying across
      // the whole screen.
      const opacity =
        useRef(
          new Animated.Value(1),
        ).current;

      const translateX =
        useRef(
          new Animated.Value(0),
        ).current;

      // =================================================
      // Moment Entrance
      // =================================================

      useEffect(() => {
        // This is the important fix.
        //
        // With Reduce Motion on, I force the wrapper into its
        // finished visible state every time the Moment changes.
        // Nothing inside the wrapper should disappear just
        // because motion is disabled.
        if (reduceMotion) {
          opacity.stopAnimation();
          translateX.stopAnimation();

          opacity.setValue(1);
          translateX.setValue(0);

          return;
        }

        opacity.stopAnimation();
        translateX.stopAnimation();

        opacity.setValue(0);
        translateX.setValue(18);

        Animated.parallel([
          Animated.timing(
            opacity,
            {
              toValue: 1,
              duration: 180,

              easing:
                Easing.out(
                  Easing.cubic,
                ),

              useNativeDriver: true,
            },
          ),

          Animated.timing(
            translateX,
            {
              toValue: 0,
              duration: 240,

              easing:
                Easing.out(
                  Easing.cubic,
                ),

              useNativeDriver: true,
            },
          ),
        ]).start();
      }, [
        opacity,
        reduceMotion,
        transitionKey,
        translateX,
      ]);

      // =================================================
      // Moment Exit
      // =================================================

      useImperativeHandle(
        ref,
        () => ({
          playExit(
            onComplete,
          ) {
            // If the player asked for less motion, I do not
            // fake an invisible "animation." I just advance.
            if (reduceMotion) {
              opacity.stopAnimation();
              translateX.stopAnimation();

              opacity.setValue(1);
              translateX.setValue(0);

              onComplete();
              return;
            }

            Animated.parallel([
              Animated.timing(
                opacity,
                {
                  toValue: 0,
                  duration: 150,

                  easing:
                    Easing.in(
                      Easing.cubic,
                    ),

                  useNativeDriver: true,
                },
              ),

              Animated.timing(
                translateX,
                {
                  toValue: -18,
                  duration: 190,

                  easing:
                    Easing.in(
                      Easing.cubic,
                    ),

                  useNativeDriver: true,
                },
              ),
            ]).start(
              ({
                finished,
              }) => {
                // I still advance if React Native interrupts
                // the animation. The transition should never
                // trap the player on the same Moment.
                if (
                  finished
                ) {
                  onComplete();
                  return;
                }

                onComplete();
              },
            );
          },
        }),
        [
          opacity,
          reduceMotion,
          translateX,
        ],
      );

      return (
        <Animated.View
          // I deliberately do NOT use overflow: hidden here.
          // The new Roast / Toast pieces overlap the Moment
          // paper by design, so this wrapper must not clip them.
          style={[
            styles.container,
            {
              opacity,

              transform: [
                {
                  translateX,
                },
              ],
            },
          ]}
        >
          {children}
        </Animated.View>
      );
    },
  );

export default MomentTransition;

const styles =
  StyleSheet.create({
    container: {
      width: "100%",

      // VoteButtons intentionally extends beyond parts of the
      // paper composition, so I leave overflow visible.
      overflow: "visible",
    },
  });