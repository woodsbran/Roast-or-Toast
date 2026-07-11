// =====================================================
// File: index.tsx
//
// Screen: Home
//
// Purpose:
// Introduces the Roast or Toast brand and allows the
// player to:
//
// • Continue a locally saved game session
// • Start a fresh game session
//
// Player Heat, levels, and totals are saved separately
// from the active question session.
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
  clearGameSession,
  loadGameSession,
} from "../game/sessionStorage";

import {
  Colors,
  Radius,
  Spacing,
} from "../theme";

export default function HomeScreen() {
  // Controls the animation of the main action button.
  const buttonScale = useRef(
    new Animated.Value(1),
  ).current;

  // Tracks whether a resumable game exists locally.
  const [
    hasSavedSession,
    setHasSavedSession,
  ] = useState(false);

  // Prevents buttons from flashing into the wrong state
  // before device storage has been checked.
  const [
    isCheckingSession,
    setIsCheckingSession,
  ] = useState(true);

  // =====================================================
  // Check for a Saved Session
  // =====================================================

  // Runs whenever Home becomes the active screen.
  //
  // This matters because the player may return Home after
  // creating or updating a session.
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const checkForSavedSession = async () => {
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

      // Prevents state updates after Home loses focus.
      return () => {
        isActive = false;
      };
    }, []),
  );

  // =====================================================
  // Button Animation
  // =====================================================

  // Slightly shrinks the main button when pressed.
  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 30,
      bounciness: 4,
    }).start();
  };

  // Returns the main button to its normal size.
  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 5,
    }).start();
  };

  // =====================================================
  // Session Navigation
  // =====================================================

  // Opens the saved session from the same question,
  // result screen, or special event.
  const handleContinueSession = () => {
    router.push({
      pathname: "/scenario",
      params: {
        mode: "continue",
      },
    });
  };

  // Removes only the active session and begins a new
  // shuffled game.
  //
  // Permanent progress such as Heat and level remains.
  const handleStartFresh = async () => {
    await clearGameSession();

    setHasSavedSession(false);

    router.push({
      pathname: "/scenario",
      params: {
        mode: "fresh",
      },
    });
  };

  // Used when there is no saved session yet.
  const handleReadyPress = () => {
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

      {/* Roast backdrop near the top */}
      <View style={styles.roastBackdrop}>
        <Text style={styles.roastSymbol}>
          🔥
        </Text>

        <Text
          style={styles.roastBackdropText}
        >
          ROAST
        </Text>
      </View>

      {/* Toast backdrop near the bottom */}
      <View style={styles.toastBackdrop}>
        <Text
          style={styles.toastBackdropText}
        >
          TOAST
        </Text>

        <Text style={styles.toastSymbol}>
          ♥
        </Text>
      </View>

      {/* Small decorative labels */}
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

            <Text
              style={styles.logoSecondary}
            >
              Toast
            </Text>
          </View>
        </View>

        {/* Conversational greeting */}
        <View
          style={styles.taglineContainer}
        >
          <Text style={styles.tagline}>
            Alright...
          </Text>

          <Text
            style={styles.taglineEmphasis}
          >
            let&apos;s be honest.
          </Text>
        </View>

        {/* Storage check placeholder */}
        {isCheckingSession && (
          <Text style={styles.loadingText}>
            Checking your last round...
          </Text>
        )}

        {/* =================================================
            No Saved Session
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
                accessibilityLabel="Begin a new Roast or Toast game"
                onPress={handleReadyPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={({ pressed }) => [
                  styles.primaryButton,
                  pressed &&
                    styles.primaryButtonPressed,
                ]}
              >
                <Text
                  style={
                    styles.primaryButtonText
                  }
                >
                  Ready
                </Text>

                <Text
                  style={
                    styles.primaryButtonArrow
                  }
                >
                  →
                </Text>
              </Pressable>
            </Animated.View>
          )}

        {/* =================================================
            Saved Session Available
        ================================================= */}

        {!isCheckingSession &&
          hasSavedSession && (
            <View style={styles.sessionActions}>
              {/* Resumes the saved session */}
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
                  onPress={
                    handleContinueSession
                  }
                  onPressIn={handlePressIn}
                  onPressOut={handlePressOut}
                  style={({ pressed }) => [
                    styles.primaryButton,
                    styles.fullWidthButton,
                    pressed &&
                      styles.primaryButtonPressed,
                  ]}
                >
                  <View>
                    <Text
                      style={
                        styles.primaryButtonText
                      }
                    >
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

                  <Text
                    style={
                      styles.primaryButtonArrow
                    }
                  >
                    →
                  </Text>
                </Pressable>
              </Animated.View>

              {/* Starts a new session without deleting Heat */}
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Start a fresh game session"
                onPress={handleStartFresh}
                style={({ pressed }) => [
                  styles.secondaryButton,
                  pressed &&
                    styles.secondaryButtonPressed,
                ]}
              >
                <Text
                  style={
                    styles.secondaryButtonText
                  }
                >
                  Start Fresh
                </Text>

                <Text
                  style={
                    styles.secondaryButtonSubtext
                  }
                >
                  Your Heat and level stay saved.
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
  // Main screen background.
  container: {
    flex: 1,
    backgroundColor:
      Colors.background,
    paddingHorizontal:
      Spacing.lg,
    overflow: "hidden",
  },

  // Centers the main content vertically.
  content: {
    flex: 1,
    justifyContent: "center",
    zIndex: 2,
  },

  // =====================================================
  // Brand Title
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
  // Session Actions
  // =====================================================

  sessionActions: {
    width: "100%",
    gap: 13,
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

  // =====================================================
  // Primary Button
  // =====================================================

  primaryButton: {
    minWidth: 188,
    backgroundColor:
      Colors.textPrimary,
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
  // Secondary Button
  // =====================================================

  secondaryButton: {
    width: "100%",
    backgroundColor: Colors.surface,

    borderColor: Colors.border,
    borderWidth: 1.5,
    borderRadius: Radius.lg,

    paddingVertical: 15,
    paddingHorizontal: 20,
  },

  secondaryButtonPressed: {
    opacity: 0.7,
    transform: [
      {
        scale: 0.985,
      },
    ],
  },

  secondaryButtonText: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: "900",
  },

  secondaryButtonSubtext: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: "600",
    marginTop: 3,
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
  // Small Debate Labels
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