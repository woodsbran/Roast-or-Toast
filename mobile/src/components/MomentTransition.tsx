// =====================================================
// File: MomentTransition.tsx
//
// Purpose:
// Animates regular Roast or Toast Moment content.
//
// Transition Sequence:
// • Current Moment slides left and fades out
// • Gameplay advances to the next Moment
// • New Moment enters from the right
//
// The component exposes playExit() so scenario.tsx can
// wait for the exit animation before changing questions.
//
// Project: Roast or Toast
// =====================================================

import {
  forwardRef,
  ReactNode,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

import {
  Animated,
  Easing,
  StyleSheet,
} from "react-native";

// Functions scenario.tsx can call through the component
// reference.
export type MomentTransitionHandle = {
  // Plays the exit animation, runs the provided callback,
  // and then animates the new content into view.
  playExit: (
    onMomentChange: () => void,
  ) => void;
};

type MomentTransitionProps = {
  children: ReactNode;

  // Changes whenever a different Moment becomes active.
  //
  // This helps the component recognize restored sessions
  // and other question changes.
  transitionKey: string;
};

const MomentTransition = forwardRef<
  MomentTransitionHandle,
  MomentTransitionProps
>(function MomentTransition(
  {
    children,
    transitionKey,
  },
  ref,
) {
  // Controls horizontal movement.
  const translateX = useRef(
    new Animated.Value(0),
  ).current;

  // Controls content visibility.
  const opacity = useRef(
    new Animated.Value(1),
  ).current;

  // Prevents Next from being triggered repeatedly while
  // a transition is already running.
  const isTransitioning = useRef(false);

  // Tracks the last Moment key so normal state updates do
  // not accidentally replay the entrance animation.
  const previousTransitionKey =
    useRef(transitionKey);

  // =====================================================
  // Entrance Animation
  // =====================================================

  const playEntrance = () => {
    translateX.setValue(34);
    opacity.setValue(0);

    Animated.parallel([
      Animated.spring(
        translateX,
        {
          toValue: 0,
          speed: 20,
          bounciness: 4,
          useNativeDriver: true,
        },
      ),

      Animated.timing(
        opacity,
        {
          toValue: 1,
          duration: 230,
          easing:
            Easing.out(
              Easing.cubic,
            ),
          useNativeDriver: true,
        },
      ),
    ]).start(() => {
      isTransitioning.current = false;
    });
  };

  // =====================================================
  // Exit Animation
  // =====================================================

  useImperativeHandle(
    ref,
    () => ({
      playExit(
        onMomentChange,
      ) {
        if (
          isTransitioning.current
        ) {
          return;
        }

        isTransitioning.current = true;

        Animated.parallel([
          Animated.timing(
            translateX,
            {
              toValue: -42,
              duration: 190,
              easing:
                Easing.in(
                  Easing.cubic,
                ),
              useNativeDriver: true,
            },
          ),

          Animated.timing(
            opacity,
            {
              toValue: 0,
              duration: 170,
              easing:
                Easing.in(
                  Easing.quad,
                ),
              useNativeDriver: true,
            },
          ),
        ]).start(() => {
          // Change the active Moment only after the old
          // content has left the screen.
          onMomentChange();

          // Give React one brief moment to render the new
          // question before starting its entrance.
          requestAnimationFrame(() => {
            playEntrance();
          });
        });
      },
    }),
  );

  // If the Moment changes from another action, such as a
  // restored session or special-mode continuation, make
  // sure the content is visible and positioned correctly.
  useEffect(() => {
    if (
      previousTransitionKey.current ===
      transitionKey
    ) {
      return;
    }

    previousTransitionKey.current =
      transitionKey;

    if (
      !isTransitioning.current
    ) {
      playEntrance();
    }
  }, [
    transitionKey,
  ]);

  return (
    <Animated.View
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
});

export default MomentTransition;

// =====================================================
// Styles
// =====================================================

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
});