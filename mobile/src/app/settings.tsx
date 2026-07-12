// =====================================================
// File: settings.tsx
//
// Screen: Settings
//
// Purpose:
// Gives the player control over local feedback, content
// history, and stored player progress.
//
// Current Controls:
// • Turn haptics on or off
// • Clear recently seen Moment history
// • Reset all player data
// • View app version and local-storage information
//
// Project: Roast or Toast
// =====================================================

import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { router } from "expo-router";

import {
  useEffect,
  useState,
} from "react";

import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";

import {
  clearGameSession,
} from "../game/sessionStorage";

import {
  clearSavedPlayerProgress,
} from "../game/progressStorage";

import {
  clearPlayerProfile,
} from "../game/profileStorage";

import {
  clearRecentMomentHistory,
} from "../game/recentMomentsStorage";

import {
  createDefaultSettings,
  loadAppSettings,
  saveAppSettings,
} from "../game/settingsStorage";

import {
  Colors,
  Radius,
  Spacing,
} from "../theme";

export default function SettingsScreen() {
  const [
    hapticsEnabled,
    setHapticsEnabledState,
  ] = useState(true);

  const [
    hasLoadedSettings,
    setHasLoadedSettings,
  ] = useState(false);

  const [
    isResetting,
    setIsResetting,
  ] = useState(false);

  // Uses the configured app version when available.
  const appVersion =
    Constants.expoConfig?.version ??
    "1.0.0";

  // =====================================================
  // Load Settings
  // =====================================================

  useEffect(() => {
    let isActive = true;

    const restoreSettings =
      async () => {
        const savedSettings =
          await loadAppSettings();

        if (!isActive) {
          return;
        }

        setHapticsEnabledState(
          savedSettings.hapticsEnabled,
        );

        setHasLoadedSettings(true);
      };

    void restoreSettings();

    return () => {
      isActive = false;
    };
  }, []);

  // =====================================================
  // Navigation
  // =====================================================

  const handleBackPress = () => {
    router.back();
  };

  const handleHomePress = () => {
    router.replace("/");
  };

  // =====================================================
  // Haptics
  // =====================================================

  const handleHapticsChange =
    async (
      enabled: boolean,
    ) => {
      setHapticsEnabledState(
        enabled,
      );

      await saveAppSettings({
        hapticsEnabled: enabled,
      });
    };

  // =====================================================
  // Clear Recent Moment History
  // =====================================================

  const handleClearMomentHistory =
    () => {
      Alert.alert(
        "Refresh Moment History?",
        "This clears the list of recently seen Moments. Your Heat, level, achievements, nickname, and active session will stay saved.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },

          {
            text: "Clear History",
            onPress: async () => {
              await clearRecentMomentHistory();

              Alert.alert(
                "History Cleared",
                "Your next new round will build from a refreshed content history.",
              );
            },
          },
        ],
      );
    };

  // =====================================================
  // Reset Everything
  // =====================================================

  const handleResetEverything =
    () => {
      Alert.alert(
        "Reset All Progress?",
        "This permanently clears your Heat, level, stats, achievements, nickname, recent Moment history, and active session from this device.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },

          {
            text: "Reset Everything",
            style: "destructive",

            onPress: async () => {
              setIsResetting(true);

              try {
                await Promise.all([
                  clearGameSession(),
                  clearSavedPlayerProgress(),
                  clearPlayerProfile(),
                  clearRecentMomentHistory(),
                ]);

                // Keep app preferences but restore their
                // normal defaults.
                await saveAppSettings(
                  createDefaultSettings(),
                );

                setHapticsEnabledState(
                  true,
                );

                Alert.alert(
                  "Progress Reset",
                  "Your local Roast or Toast profile has been cleared.",
                  [
                    {
                      text: "Return Home",

                      onPress: () => {
                        router.replace("/");
                      },
                    },
                  ],
                );
              } finally {
                setIsResetting(false);
              }
            },
          },
        ],
      );
    };

  if (!hasLoadedSettings) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingEmoji}>
          ⚙️
        </Text>

        <Text style={styles.loadingText}>
          Loading settings...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Decorative background */}
      <Text style={styles.roastBackdrop}>
        ROAST
      </Text>

      <Text style={styles.toastBackdrop}>
        TOAST
      </Text>

      {/* =================================================
          Header
      ================================================= */}

      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={handleBackPress}
          style={({ pressed }) => [
            styles.headerButton,

            pressed &&
              styles.buttonPressed,
          ]}
        >
          <Ionicons
            name="arrow-back"
            size={23}
            color={
              Colors.textPrimary
            }
          />
        </Pressable>

        <Text style={styles.headerTitle}>
          Settings
        </Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Return Home"
          onPress={handleHomePress}
          style={({ pressed }) => [
            styles.headerButton,

            pressed &&
              styles.buttonPressed,
          ]}
        >
          <Ionicons
            name="home-outline"
            size={22}
            color={
              Colors.textPrimary
            }
          />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.scrollContent
        }
      >
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            MAKE IT YOURS
          </Text>
        </View>

        <Text style={styles.heading}>
          Your game.
        </Text>

        <Text style={styles.subheading}>
          Your settings.
        </Text>

        {/* =================================================
            Feedback
        ================================================= */}

        <Text style={styles.sectionTitle}>
          Feedback
        </Text>

        <View style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingIcon}>
              <Text style={styles.settingEmoji}>
                📳
              </Text>
            </View>

            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>
                Haptics
              </Text>

              <Text style={styles.settingDescription}>
                Vibrate when you vote, advance, or level up.
              </Text>
            </View>

            <Switch
              value={hapticsEnabled}
              onValueChange={(enabled) => {
                void handleHapticsChange(
                  enabled,
                );
              }}
              trackColor={{
                false: "#D4D1CD",
                true: "#F6B3A7",
              }}
              thumbColor={
                hapticsEnabled
                  ? Colors.roast
                  : "#F5F5F5"
              }
              ios_backgroundColor="#D4D1CD"
            />
          </View>
        </View>

        {/* =================================================
            Content
        ================================================= */}

        <Text style={styles.sectionTitle}>
          Content
        </Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Clear recent Moment history"
          onPress={
            handleClearMomentHistory
          }
          style={({ pressed }) => [
            styles.actionCard,

            pressed &&
              styles.actionCardPressed,
          ]}
        >
          <View style={styles.actionIcon}>
            <Ionicons
              name="shuffle-outline"
              size={22}
              color={
                Colors.toast
              }
            />
          </View>

          <View style={styles.actionText}>
            <Text style={styles.actionTitle}>
              Refresh Moment History
            </Text>

            <Text style={styles.actionDescription}>
              Let new rounds reconsider recently seen Moments.
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color={
              Colors.textSecondary
            }
          />
        </Pressable>

        {/* =================================================
            About
        ================================================= */}

        <Text style={styles.sectionTitle}>
          About
        </Text>

        <View style={styles.aboutCard}>
          <View style={styles.aboutLogo}>
            <Text style={styles.aboutLogoEmoji}>
              🔥
            </Text>
          </View>

          <View style={styles.aboutText}>
            <Text style={styles.aboutTitle}>
              Roast or Toast
            </Text>

            <Text style={styles.aboutDescription}>
              A social opinion game for honest takes, questionable decisions, and friendly debates.
            </Text>

            <Text style={styles.versionText}>
              Version {appVersion}
            </Text>
          </View>
        </View>

        <View style={styles.storageNotice}>
          <Ionicons
            name="phone-portrait-outline"
            size={18}
            color={
              Colors.textSecondary
            }
          />

          <Text style={styles.storageNoticeText}>
            Your profile and progress are currently saved only on this device.
          </Text>
        </View>

        {/* =================================================
            Danger Zone
        ================================================= */}

        <Text style={styles.dangerSectionTitle}>
          Danger Zone
        </Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Reset all progress"
          disabled={isResetting}
          onPress={
            handleResetEverything
          }
          style={({ pressed }) => [
            styles.resetButton,

            pressed &&
              styles.resetButtonPressed,

            isResetting &&
              styles.disabledButton,
          ]}
        >
          <View style={styles.resetIcon}>
            <Ionicons
              name="trash-outline"
              size={21}
              color={
                Colors.roast
              }
            />
          </View>

          <View style={styles.actionText}>
            <Text style={styles.resetTitle}>
              {isResetting
                ? "Resetting..."
                : "Reset All Progress"}
            </Text>

            <Text style={styles.resetDescription}>
              Clear Heat, level, stats, nickname, achievements, and the active session.
            </Text>
          </View>
        </Pressable>

        <Text style={styles.footerText}>
          The opinions may be temporary. The screenshots are forever.
        </Text>
      </ScrollView>
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

    overflow: "hidden",
  },

  loadingContainer: {
    flex: 1,

    backgroundColor:
      Colors.background,

    alignItems: "center",
    justifyContent: "center",
  },

  loadingEmoji: {
    fontSize: 42,
    marginBottom: 14,
  },

  loadingText: {
    color:
      Colors.textPrimary,

    fontSize: 18,
    fontWeight: "900",
  },

  header: {
    paddingTop: 60,
    paddingBottom: 12,
    paddingHorizontal:
      Spacing.lg,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    zIndex: 5,
  },

  headerButton: {
    width: 43,
    height: 43,

    backgroundColor:
      Colors.surface,

    borderColor:
      Colors.border,

    borderWidth: 1,
    borderRadius:
      Radius.pill,

    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    color:
      Colors.textPrimary,

    fontSize: 18,
    fontWeight: "900",
  },

  scrollContent: {
    paddingHorizontal:
      Spacing.lg,

    paddingTop: 17,
    paddingBottom: 55,
  },

  badge: {
    alignSelf: "flex-start",

    borderColor:
      Colors.toast,

    borderWidth: 1.5,
    borderRadius:
      Radius.pill,

    paddingVertical: 7,
    paddingHorizontal: 14,

    marginBottom: 19,

    transform: [
      {
        rotate: "-2deg",
      },
    ],
  },

  badgeText: {
    color:
      Colors.toast,

    fontSize: 10,
    fontWeight: "900",

    letterSpacing: 1.4,
  },

  heading: {
    color:
      Colors.textPrimary,

    fontSize: 41,
    fontWeight: "900",

    letterSpacing: -1.7,
    lineHeight: 45,
  },

  subheading: {
    color:
      Colors.textSecondary,

    fontSize: 20,
    fontWeight: "700",

    marginTop: 3,
    marginBottom: 28,
  },

  sectionTitle: {
    color:
      Colors.textPrimary,

    fontSize: 17,
    fontWeight: "900",

    marginBottom: 12,
  },

  settingsCard: {
    backgroundColor:
      Colors.surface,

    borderColor:
      Colors.border,

    borderWidth: 1,
    borderRadius:
      Radius.lg,

    padding: 16,
    marginBottom: 27,
  },

  settingRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  settingIcon: {
    width: 43,
    height: 43,

    backgroundColor:
      "#FFF1EC",

    borderRadius: 22,

    alignItems: "center",
    justifyContent: "center",

    marginRight: 12,
  },

  settingEmoji: {
    fontSize: 21,
  },

  settingText: {
    flex: 1,
    paddingRight: 12,
  },

  settingTitle: {
    color:
      Colors.textPrimary,

    fontSize: 15,
    fontWeight: "900",
  },

  settingDescription: {
    color:
      Colors.textSecondary,

    fontSize: 10,
    fontWeight: "600",
    lineHeight: 15,

    marginTop: 3,
  },

  actionCard: {
    backgroundColor:
      Colors.surface,

    borderColor:
      Colors.border,

    borderWidth: 1,
    borderRadius:
      Radius.lg,

    padding: 16,
    marginBottom: 27,

    flexDirection: "row",
    alignItems: "center",
  },

  actionCardPressed: {
    opacity: 0.7,

    transform: [
      {
        scale: 0.985,
      },
    ],
  },

  actionIcon: {
    width: 43,
    height: 43,

    backgroundColor:
      "#EAF8F5",

    borderRadius: 22,

    alignItems: "center",
    justifyContent: "center",

    marginRight: 12,
  },

  actionText: {
    flex: 1,
    paddingRight: 10,
  },

  actionTitle: {
    color:
      Colors.textPrimary,

    fontSize: 14,
    fontWeight: "900",
  },

  actionDescription: {
    color:
      Colors.textSecondary,

    fontSize: 10,
    fontWeight: "600",
    lineHeight: 15,

    marginTop: 3,
  },

  aboutCard: {
    backgroundColor:
      Colors.textPrimary,

    borderRadius:
      Radius.lg,

    padding: 18,
    marginBottom: 14,

    flexDirection: "row",
    alignItems: "flex-start",
  },

  aboutLogo: {
    width: 50,
    height: 50,

    backgroundColor:
      "#3A2724",

    borderRadius: 25,

    alignItems: "center",
    justifyContent: "center",

    marginRight: 13,
  },

  aboutLogoEmoji: {
    fontSize: 25,
  },

  aboutText: {
    flex: 1,
  },

  aboutTitle: {
    color:
      Colors.white,

    fontSize: 18,
    fontWeight: "900",
  },

  aboutDescription: {
    color: "#CFCFCF",

    fontSize: 11,
    fontWeight: "600",
    lineHeight: 17,

    marginTop: 5,
  },

  versionText: {
    color:
      Colors.roast,

    fontSize: 10,
    fontWeight: "900",

    marginTop: 10,
  },

  storageNotice: {
    backgroundColor:
      Colors.surfaceAlt,

    borderRadius:
      Radius.lg,

    padding: 14,
    marginBottom: 29,

    flexDirection: "row",
    alignItems: "center",
  },

  storageNoticeText: {
    flex: 1,

    color:
      Colors.textSecondary,

    fontSize: 10,
    fontWeight: "600",
    lineHeight: 15,

    marginLeft: 9,
  },

  dangerSectionTitle: {
    color:
      Colors.roast,

    fontSize: 17,
    fontWeight: "900",

    marginBottom: 12,
  },

  resetButton: {
    backgroundColor:
      "#FFF1EC",

    borderColor:
      "#F4C9BE",

    borderWidth: 1,
    borderRadius:
      Radius.lg,

    padding: 16,

    flexDirection: "row",
    alignItems: "center",
  },

  resetButtonPressed: {
    opacity: 0.7,

    transform: [
      {
        scale: 0.985,
      },
    ],
  },

  resetIcon: {
    width: 43,
    height: 43,

    backgroundColor:
      Colors.white,

    borderRadius: 22,

    alignItems: "center",
    justifyContent: "center",

    marginRight: 12,
  },

  resetTitle: {
    color:
      Colors.roast,

    fontSize: 14,
    fontWeight: "900",
  },

  resetDescription: {
    color:
      Colors.textSecondary,

    fontSize: 10,
    fontWeight: "600",
    lineHeight: 15,

    marginTop: 3,
  },

  disabledButton: {
    opacity: 0.5,
  },

  footerText: {
    color:
      Colors.textSecondary,

    fontSize: 10,
    fontWeight: "600",

    textAlign: "center",

    marginTop: 28,
  },

  buttonPressed: {
    opacity: 0.68,

    transform: [
      {
        scale: 0.96,
      },
    ],
  },

  roastBackdrop: {
    position: "absolute",

    top: 165,
    right: -55,

    color:
      Colors.roast,

    fontSize: 94,
    fontWeight: "900",

    opacity: 0.05,

    transform: [
      {
        rotate: "8deg",
      },
    ],
  },

  toastBackdrop: {
    position: "absolute",

    bottom: 45,
    left: -48,

    color:
      Colors.toast,

    fontSize: 91,
    fontWeight: "900",

    opacity: 0.05,

    transform: [
      {
        rotate: "-8deg",
      },
    ],
  },
});