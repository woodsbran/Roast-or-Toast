// =====================================================
// File: index.tsx
//
// Screen: Home
//
// Purpose:
// Introduces the Roast or Toast brand and provides two
// clear gameplay actions:
//
// • Continue Session:
//   Resumes the exact saved question or special screen.
//
// • New Round:
//   Starts a new shuffled round while keeping permanent
//   Heat, level, totals, and best streak.
//
// Reset Progress will eventually live inside Settings,
// away from the primary gameplay actions.
//
// Project: Roast or Toast
// =====================================================

import {
  router,
  useFocusEffect,
} from "expo-router";

import {
  useCallback,
  useRef,
  useState,
} from "react";

import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  resetSavedCurrentStreak,
} from "../game/progressStorage";

import {
  clearGameSession,
  loadGameSession,
} from "../game/sessionStorage";

import {
  Colors,
  Radius,
  Spacing,
} from "../theme";

export default function HomeScreen() {
  // Controls the subtle press animation on the primary
  // action button.
  const buttonScale = useRef(
    new Animated.Value(1),
  ).current;

  // Determines whether a resumable session exists.
  const [
    hasSavedSession,
    setHasSavedSession,
  ] = useState(false);

  // Prevents the wrong Home actions from briefly showing
  // before local storage is checked.
  const [
    isCheckingSession,
    setIsCheckingSession,
  ] = useState(true);

  // =====================================================
  // Check for an Active Session
  // =====================================================

  // Runs whenever Home becomes the active route.
  //
  // This ensures Continue Session appears immediately
  // after the player returns from gameplay.
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const checkForSavedSession =
        async () => {
          setIsCheckingSession(true);

          const savedSession =
            await loadGameSession();

          if (!isActive) {
            return;
          }

          setHasSavedSession(
            Boolean(
              savedSession?.hasActiveSession,
            ),
          );

          setIsCheckingSession(false);
        };

      void checkForSavedSession();

      return () => {
        isActive = false;
      };
    }, []),
  );

  // =====================================================
  // Button Animation
  // =====================================================

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 30,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 5,
    }).start();
  };

  // =====================================================
  // Continue Session
  // =====================================================

  // Resumes the exact saved question, result screen, or
  // special gameplay event.
  const handleContinueSession = () => {
    router.push({
      pathname: "/scenario",

      params: {
        mode: "continue",
      },
    });
  };

  // =====================================================
  // New Round
  // =====================================================

  // Starts a new shuffled gameplay round.
  //
  // Keeps:
  // • Total Heat
  // • Level
  // • Best streak
  // • Lifetime Roast and Toast counts
  // • Guess the Crowd statistics
  //
  // Resets:
  // • Current question deck
  // • Current session position
  // • Current streak
  const handleNewRound = async () => {
    await clearGameSession();
    await resetSavedCurrentStreak();

    setHasSavedSession(false);

    router.push({
      pathname: "/scenario",

      params: {
        mode: "fresh",
      },
    });
  };

  return (
    <View style={styles.container}>
      {/* =================================================
          Themed Background
      ================================================= */}

      {/* Roast backdrop */}
      <View style={styles.roastBackdrop}>
        <Text style={styles.roastSymbol}>
          🔥
        </Text>

        <Text style={styles.roastBackdropText}>
          ROAST
        </Text>
      </View>

      {/* Toast backdrop */}
      <View style={styles.toastBackdrop}>
        <Text style={styles.toastBackdropText}>
          TOAST
        </Text>

        <Text style={styles.toastSymbol}>
          ♥
        </Text>
      </View>

      {/* Decorative debate labels */}
      <View style={styles.hotTakeBadge}>
        <Text style={styles.hotTakeText}>
          HOT TAKE
        </Text>
      </View>

      <View style={styles.verdictBadge}>
        <Text style={styles.verdictText}>
          YOUR VERDICT
        </Text>
      </View>

      {/* =================================================
          Main Content
      ================================================= */}

      <View style={styles.content}>
        {/* Main brand title */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoPrimary}>
            Roast
          </Text>

          <View style={styles.logoSecondLine}>
            <Text style={styles.logoOr}>
              or
            </Text>

            <Text style={styles.logoSecondary}>
              Toast
            </Text>
          </View>
        </View>

        {/* Conversational greeting */}
        <View style={styles.taglineContainer}>
          <Text style={styles.tagline}>
            Alright...
          </Text>

          <Text style={styles.taglineEmphasis}>
            let&apos;s be honest.
          </Text>
        </View>

        {/* Brief storage check */}
        {isCheckingSession && (
          <Text style={styles.loadingText}>
            Checking your last round...
          </Text>
        )}

        {/* =================================================
            No Active Session
        ================================================= */}

        {!isCheckingSession &&
          !hasSavedSession && (
            <Animated.View
              style={[
                styles.buttonWrapper,

                {
                  transform: [
                    {
                      scale: buttonScale,
                    },
                  ],
                },
              ]}
            >
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Start a new Roast or Toast round"
                onPress={handleNewRound}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={({ pressed }) => [
                  styles.primaryButton,

                  pressed &&
                    styles.primaryButtonPressed,
                ]}
              >
                <Text style={styles.primaryButtonText}>
                  Ready
                </Text>

                <Text style={styles.primaryButtonArrow}>
                  →
                </Text>
              </Pressable>
            </Animated.View>
          )}

        {/* =================================================
            Active Session Available
        ================================================= */}

        {!isCheckingSession &&
          hasSavedSession && (
            <View style={styles.sessionActions}>
              {/* Primary action: Resume gameplay */}
              <Animated.View
                style={[
                  styles.fullWidthButtonWrapper,

                  {
                    transform: [
                      {
                        scale: buttonScale,
                      },
                    ],
                  },
                ]}
              >
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Continue saved game session"
                  onPress={handleContinueSession}
                  onPressIn={handlePressIn}
                  onPressOut={handlePressOut}
                  style={({ pressed }) => [
                    styles.primaryButton,
                    styles.fullWidthButton,

                    pressed &&
                      styles.primaryButtonPressed,
                  ]}
                >
                  <View style={styles.actionText}>
                    <Text style={styles.primaryButtonText}>
                      Continue Session
                    </Text>

                    <Text
                      style={
                        styles.primaryButtonSubtext
                      }
                    >
                      Pick up where you left off.
                    </Text>
                  </View>

                  <Text style={styles.primaryButtonArrow}>
                    →
                  </Text>
                </Pressable>
              </Animated.View>

              {/* Secondary action: Begin new questions */}
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Start a new round"
                onPress={handleNewRound}
                style={({ pressed }) => [
                  styles.newRoundButton,

                  pressed &&
                    styles.secondaryButtonPressed,
                ]}
              >
                <View style={styles.actionText}>
                  <Text style={styles.newRoundButtonText}>
                    New Round
                  </Text>

                  <Text
                    style={
                      styles.newRoundButtonSubtext
                    }
                  >
                    New questions. Same Heat and level.
                  </Text>
                </View>

                <Text style={styles.newRoundButtonArrow}>
                  ↻
                </Text>
              </Pressable>
            </View>
          )}
      </View>
    </View>
  );
}

// =====================================================
// Styles
// =====================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.lg,
    overflow: "hidden",
  },

  content: {
    flex: 1,
    justifyContent: "center",
    zIndex: 2,
  },

  // =====================================================
  // Logo
  // =====================================================

  logoContainer: {
    marginBottom: 52,
  },

  logoPrimary: {
    color: Colors.textPrimary,
    fontSize: 66,
    fontWeight: "900",
    letterSpacing: -3,
    lineHeight: 69,
  },

  logoSecondLine: {
    flexDirection: "row",
    alignItems: "baseline",
    marginLeft: 52,
  },

  logoOr: {
    color: Colors.roast,
    fontSize: 27,
    fontWeight: "800",
    marginRight: 9,
  },

  logoSecondary: {
    color: Colors.textPrimary,
    fontSize: 52,
    fontWeight: "850",
    letterSpacing: -2.5,
    lineHeight: 57,
  },

  // =====================================================
  // Greeting
  // =====================================================

  taglineContainer: {
    marginBottom: 34,
  },

  tagline: {
    color: Colors.textSecondary,
    fontSize: 25,
    fontWeight: "500",
    lineHeight: 34,
  },

  taglineEmphasis: {
    color: Colors.textPrimary,
    fontSize: 31,
    fontWeight: "800",
    lineHeight: 41,
  },

  loadingText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: "700",
  },

  // =====================================================
  // Action Layout
  // =====================================================

  sessionActions: {
    width: "100%",
    gap: 14,
  },

  buttonWrapper: {
    alignSelf: "flex-start",
  },

  fullWidthButtonWrapper: {
    width: "100%",
  },

  fullWidthButton: {
    width: "100%",
  },

  actionText: {
    flex: 1,
    paddingRight: 12,
  },

  // =====================================================
  // Primary Button
  // =====================================================

  primaryButton: {
    minWidth: 188,
    backgroundColor: Colors.textPrimary,
    borderRadius: Radius.pill,

    paddingVertical: 17,
    paddingHorizontal: 27,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    shadowColor: "#1D1D1F",

    shadowOffset: {
      width: 0,
      height: 9,
    },

    shadowOpacity: 0.17,
    shadowRadius: 16,
    elevation: 6,
  },

  primaryButtonPressed: {
    backgroundColor: Colors.roast,
  },

  primaryButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "900",
  },

  primaryButtonSubtext: {
    color: "#CFCFCF",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 3,
  },

  primaryButtonArrow: {
    color: Colors.white,
    fontSize: 24,
    fontWeight: "600",
    marginLeft: Spacing.xl,
  },

  // =====================================================
  // New Round Button
  // =====================================================

  newRoundButton: {
    width: "100%",
    backgroundColor: Colors.surface,

    borderColor: Colors.border,
    borderWidth: 1.5,
    borderRadius: Radius.lg,

    paddingVertical: 15,
    paddingHorizontal: 20,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  newRoundButtonText: {
    color: Colors.textPrimary,
    fontSize: 17,
    fontWeight: "900",
  },

  newRoundButtonSubtext: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: "600",
    marginTop: 3,
  },

  newRoundButtonArrow: {
    color: Colors.roast,
    fontSize: 25,
    fontWeight: "800",
  },

  secondaryButtonPressed: {
    opacity: 0.68,

    transform: [
      {
        scale: 0.985,
      },
    ],
  },

  // =====================================================
  // Roast Backdrop
  // =====================================================

  roastBackdrop: {
    position: "absolute",
    top: 72,
    right: -47,

    transform: [
      {
        rotate: "8deg",
      },
    ],

    alignItems: "flex-end",
  },

  roastBackdropText: {
    color: Colors.roast,
    fontSize: 96,
    fontWeight: "900",
    letterSpacing: -5,
    opacity: 0.09,
  },

  roastSymbol: {
    fontSize: 46,
    opacity: 0.15,
    marginRight: 54,
    marginBottom: -20,
  },

  // =====================================================
  // Toast Backdrop
  // =====================================================

  toastBackdrop: {
    position: "absolute",
    bottom: 68,
    left: -42,

    transform: [
      {
        rotate: "-8deg",
      },
    ],

    flexDirection: "row",
    alignItems: "center",
  },

  toastBackdropText: {
    color: Colors.toast,
    fontSize: 94,
    fontWeight: "900",
    letterSpacing: -5,
    opacity: 0.09,
  },

  toastSymbol: {
    color: Colors.toast,
    fontSize: 53,
    fontWeight: "900",
    opacity: 0.15,
    marginLeft: 10,
  },

  // =====================================================
  // Decorative Labels
  // =====================================================

  hotTakeBadge: {
    position: "absolute",
    top: 205,
    left: -18,

    borderColor: Colors.roast,
    borderWidth: 1.5,
    borderRadius: Radius.pill,

    paddingVertical: 7,
    paddingHorizontal: 16,

    opacity: 0.28,

    transform: [
      {
        rotate: "-8deg",
      },
    ],
  },

  hotTakeText: {
    color: Colors.roast,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.7,
  },

  verdictBadge: {
    position: "absolute",
    bottom: 215,
    right: -24,

    borderColor: Colors.toast,
    borderWidth: 1.5,
    borderRadius: Radius.pill,

    paddingVertical: 7,
    paddingHorizontal: 16,

    opacity: 0.3,

    transform: [
      {
        rotate: "7deg",
      },
    ],
  },

  verdictText: {
    color: Colors.toast,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.5,
  },
});