// =====================================================
// File: index.tsx
//
// Screen: Home
//
// Purpose:
// Introduces Roast or Toast and provides:
//
// • Continue Session
// • New Round
// • My Profile
// • Settings
//
// A locally saved nickname appears as a subtle greeting.
//
// Project: Roast or Toast
// =====================================================

import { Ionicons } from "@expo/vector-icons";

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
  DEFAULT_PLAYER_NICKNAME,
  loadPlayerProfile,
} from "../game/profileStorage";

import {
  loadGameSession,
} from "../game/sessionStorage";

import {
  Colors,
  Radius,
  Spacing,
} from "../theme";

export default function HomeScreen() {
  const buttonScale = useRef(
    new Animated.Value(1),
  ).current;

  const [
    hasSavedSession,
    setHasSavedSession,
  ] = useState(false);

  const [
    isCheckingSession,
    setIsCheckingSession,
  ] = useState(true);

  const [
    nickname,
    setNickname,
  ] = useState(
    DEFAULT_PLAYER_NICKNAME,
  );

  // =====================================================
  // Restore Home Data
  // =====================================================

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const restoreHomeData =
        async () => {
          setIsCheckingSession(true);

          const [
            savedSession,
            savedProfile,
          ] = await Promise.all([
            loadGameSession(),
            loadPlayerProfile(),
          ]);

          if (!isActive) {
            return;
          }

          setHasSavedSession(
            Boolean(
              savedSession?.hasActiveSession,
            ),
          );

          setNickname(
            savedProfile.nickname,
          );

          setIsCheckingSession(false);
        };

      void restoreHomeData();

      return () => {
        isActive = false;
      };
    }, []),
  );

  // =====================================================
  // Button Animation
  // =====================================================

  const handlePressIn = () => {
    Animated.spring(
      buttonScale,
      {
        toValue: 0.96,
        useNativeDriver: true,
        speed: 30,
        bounciness: 4,
      },
    ).start();
  };

  const handlePressOut = () => {
    Animated.spring(
      buttonScale,
      {
        toValue: 1,
        useNativeDriver: true,
        speed: 30,
        bounciness: 5,
      },
    ).start();
  };

  // =====================================================
  // Navigation
  // =====================================================

  const handleContinueSession = () => {
    router.push({
      pathname: "/scenario",

      params: {
        mode: "continue",
      },
    });
  };

  const handleNewRound = () => {
    router.push(
      "/mode-select",
    );
  };

  const handleProfilePress = () => {
    router.push(
      "/profile",
    );
  };

  const handleSettingsPress = () => {
    router.push(
      "/settings",
    );
  };

  const hasCustomNickname =
    nickname !==
    DEFAULT_PLAYER_NICKNAME;

  return (
    <View style={styles.container}>
      {/* =================================================
          Themed Background
      ================================================= */}

      <View style={styles.roastBackdrop}>
        <Text style={styles.roastSymbol}>
          🔥
        </Text>

        <Text style={styles.roastBackdropText}>
          ROAST
        </Text>
      </View>

      <View style={styles.toastBackdrop}>
        <Text style={styles.toastBackdropText}>
          TOAST
        </Text>

        <Text style={styles.toastSymbol}>
          ♥
        </Text>
      </View>

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
          Top Navigation
      ================================================= */}

      <View style={styles.topActions}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open player profile"
          onPress={
            handleProfilePress
          }
          style={({ pressed }) => [
            styles.profileButton,

            pressed &&
              styles.topButtonPressed,
          ]}
        >
          <Ionicons
            name="person-outline"
            size={18}
            color={
              Colors.textPrimary
            }
          />

          <Text style={styles.profileButtonText}>
            My Profile
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open Settings"
          onPress={
            handleSettingsPress
          }
          style={({ pressed }) => [
            styles.settingsButton,

            pressed &&
              styles.topButtonPressed,
          ]}
        >
          <Ionicons
            name="settings-outline"
            size={20}
            color={
              Colors.textPrimary
            }
          />
        </Pressable>
      </View>

      {/* =================================================
          Main Content
      ================================================= */}

      <View style={styles.content}>
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

        <View style={styles.taglineContainer}>
          {hasCustomNickname && (
            <Text style={styles.nicknameGreeting}>
              Welcome back, {nickname}.
            </Text>
          )}

          <Text style={styles.tagline}>
            Alright...
          </Text>

          <Text style={styles.taglineEmphasis}>
            let&apos;s be honest.
          </Text>
        </View>

        {isCheckingSession && (
          <Text style={styles.loadingText}>
            Checking your last round...
          </Text>
        )}

        {!isCheckingSession &&
          !hasSavedSession && (
            <Animated.View
              style={[
                styles.buttonWrapper,

                {
                  transform: [
                    {
                      scale:
                        buttonScale,
                    },
                  ],
                },
              ]}
            >
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Choose a new Roast or Toast round"
                onPress={
                  handleNewRound
                }
                onPressIn={
                  handlePressIn
                }
                onPressOut={
                  handlePressOut
                }
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

        {!isCheckingSession &&
          hasSavedSession && (
            <View style={styles.sessionActions}>
              <Animated.View
                style={[
                  styles.fullWidthButtonWrapper,

                  {
                    transform: [
                      {
                        scale:
                          buttonScale,
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
                  onPressIn={
                    handlePressIn
                  }
                  onPressOut={
                    handlePressOut
                  }
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

                    <Text style={styles.primaryButtonSubtext}>
                      Pick up where you left off.
                    </Text>
                  </View>

                  <Text style={styles.primaryButtonArrow}>
                    →
                  </Text>
                </Pressable>
              </Animated.View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Choose a new round"
                onPress={
                  handleNewRound
                }
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

                  <Text style={styles.newRoundButtonSubtext}>
                    Choose Quick 10, Standard 20, or Endless.
                  </Text>
                </View>

                <Text style={styles.newRoundButtonArrow}>
                  →
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

    backgroundColor:
      Colors.background,

    paddingHorizontal:
      Spacing.lg,

    overflow: "hidden",
  },

  content: {
    flex: 1,

    justifyContent: "center",

    zIndex: 2,
  },

  // =====================================================
  // Top Navigation
  // =====================================================

  topActions: {
    position: "absolute",

    top: 60,
    right:
      Spacing.lg,

    zIndex: 10,

    flexDirection: "row",
    alignItems: "center",

    gap: 9,
  },

  profileButton: {
    minHeight: 42,

    backgroundColor:
      Colors.surface,

    borderColor:
      Colors.border,

    borderWidth: 1,
    borderRadius:
      Radius.pill,

    paddingVertical: 10,
    paddingHorizontal: 14,

    flexDirection: "row",
    alignItems: "center",

    shadowColor: "#1D1D1F",

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.08,
    shadowRadius: 9,

    elevation: 2,
  },

  profileButtonText: {
    color:
      Colors.textPrimary,

    fontSize: 12,
    fontWeight: "900",

    marginLeft: 6,
  },

  settingsButton: {
    width: 42,
    height: 42,

    backgroundColor:
      Colors.surface,

    borderColor:
      Colors.border,

    borderWidth: 1,
    borderRadius:
      Radius.pill,

    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#1D1D1F",

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.08,
    shadowRadius: 9,

    elevation: 2,
  },

  topButtonPressed: {
    opacity: 0.68,

    transform: [
      {
        scale: 0.96,
      },
    ],
  },

  // =====================================================
  // Logo
  // =====================================================

  logoContainer: {
    marginBottom: 52,
  },

  logoPrimary: {
    color:
      Colors.textPrimary,

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
    color:
      Colors.roast,

    fontSize: 27,
    fontWeight: "800",

    marginRight: 9,
  },

  logoSecondary: {
    color:
      Colors.textPrimary,

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

  nicknameGreeting: {
    color:
      Colors.roast,

    fontSize: 13,
    fontWeight: "900",

    marginBottom: 8,
  },

  tagline: {
    color:
      Colors.textSecondary,

    fontSize: 25,
    fontWeight: "500",

    lineHeight: 34,
  },

  taglineEmphasis: {
    color:
      Colors.textPrimary,

    fontSize: 31,
    fontWeight: "800",

    lineHeight: 41,
  },

  loadingText: {
    color:
      Colors.textSecondary,

    fontSize: 14,
    fontWeight: "700",
  },

  // =====================================================
  // Gameplay Actions
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

  primaryButton: {
    minWidth: 188,

    backgroundColor:
      Colors.textPrimary,

    borderRadius:
      Radius.pill,

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
    backgroundColor:
      Colors.roast,
  },

  primaryButtonText: {
    color:
      Colors.white,

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
    color:
      Colors.white,

    fontSize: 24,
    fontWeight: "600",

    marginLeft:
      Spacing.xl,
  },

  newRoundButton: {
    width: "100%",

    backgroundColor:
      Colors.surface,

    borderColor:
      Colors.border,

    borderWidth: 1.5,
    borderRadius:
      Radius.lg,

    paddingVertical: 15,
    paddingHorizontal: 20,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  newRoundButtonText: {
    color:
      Colors.textPrimary,

    fontSize: 17,
    fontWeight: "900",
  },

  newRoundButtonSubtext: {
    color:
      Colors.textSecondary,

    fontSize: 12,
    fontWeight: "600",

    marginTop: 3,
  },

  newRoundButtonArrow: {
    color:
      Colors.roast,

    fontSize: 23,
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
  // Background Decorations
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
    color:
      Colors.roast,

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
    color:
      Colors.toast,

    fontSize: 94,
    fontWeight: "900",

    letterSpacing: -5,
    opacity: 0.09,
  },

  toastSymbol: {
    color:
      Colors.toast,

    fontSize: 53,
    fontWeight: "900",

    opacity: 0.15,

    marginLeft: 10,
  },

  hotTakeBadge: {
    position: "absolute",

    top: 205,
    left: -18,

    borderColor:
      Colors.roast,

    borderWidth: 1.5,
    borderRadius:
      Radius.pill,

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
    color:
      Colors.roast,

    fontSize: 11,
    fontWeight: "900",

    letterSpacing: 1.7,
  },

  verdictBadge: {
    position: "absolute",

    bottom: 215,
    right: -24,

    borderColor:
      Colors.toast,

    borderWidth: 1.5,
    borderRadius:
      Radius.pill,

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
    color:
      Colors.toast,

    fontSize: 11,
    fontWeight: "900",

    letterSpacing: 1.5,
  },
});