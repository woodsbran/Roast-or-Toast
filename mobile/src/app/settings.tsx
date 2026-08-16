// =====================================================
// File: settings.tsx
//
// Screen: Settings
//
// Version 1.1 — Full Visual Cohesion Pass
//
// I am removing the old "settings card" look.
//
// This should feel like a utility sheet from the same game:
// labels, rules, paper, ink, and strong typography.
//
// All settings behavior stays the same.
//
// Project: Roast or Toast
// =====================================================

import {
  Ionicons,
} from "@expo/vector-icons";

import Constants from "expo-constants";

import {
  router,
} from "expo-router";

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

import BrandMark from "../components/BrandMark";
import HeatMark from "../components/HeatMark";
import InkUnderline from "../components/InkUnderline";
import StampLabel from "../components/StampLabel";

import {
  clearDailyStreak,
} from "../game/dailyStreakStorage";

import {
  triggerHapticsPreview,
  triggerSoundPreview,
} from "../game/effects";

import {
  clearPlayerProfile,
} from "../game/profileStorage";

import {
  clearIntermissionHistory,
} from "../game/intermissionStorage";

import {
  clearSavedPlayerProgress,
} from "../game/progressStorage";

import {
  clearRecentMomentHistory,
} from "../game/recentMomentsStorage";

import {
  clearGameSession,
} from "../game/sessionStorage";

import {
  createDefaultSettings,
  loadAppSettings,
  saveAppSettings,
} from "../game/settingsStorage";

import {
  Colors,
  Spacing,
} from "../theme";

export default function SettingsScreen() {
  const [
    hapticsEnabled,
    setHapticsEnabledState,
  ] =
    useState(true);

  const [
    soundEffectsEnabled,
    setSoundEffectsEnabledState,
  ] =
    useState(true);

  const [
    hasLoadedSettings,
    setHasLoadedSettings,
  ] =
    useState(false);

  const [
    isResetting,
    setIsResetting,
  ] =
    useState(false);

  const appVersion =
    Constants.expoConfig?.version ??
    "1.0.0";

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

        setSoundEffectsEnabledState(
          savedSettings.soundEffectsEnabled,
        );

        setHasLoadedSettings(
          true,
        );
      };

    void restoreSettings();

    return () => {
      isActive = false;
    };
  }, []);

  const handleBackPress =
    () => {
      router.back();
    };

  const handleHomePress =
    () => {
      router.replace("/");
    };

  const handleHapticsChange =
    async (
      enabled: boolean,
    ) => {
      setHapticsEnabledState(
        enabled,
      );

      await saveAppSettings({
        hapticsEnabled:
          enabled,
      });

      if (enabled) {
        triggerHapticsPreview();
      }
    };

  const handleSoundEffectsChange =
    async (
      enabled: boolean,
    ) => {
      setSoundEffectsEnabledState(
        enabled,
      );

      await saveAppSettings({
        soundEffectsEnabled:
          enabled,
      });

      if (enabled) {
        triggerSoundPreview();
      }
    };

  const handleClearMomentHistory =
    () => {
      Alert.alert(
        "Refresh Moment History?",
        "This clears recently seen Moments. Your Heat, level, achievements, nickname, streak, and active session stay saved.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },

          {
            text: "Clear History",
            onPress:
              async () => {
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

  const handleResetEverything =
    () => {
      Alert.alert(
        "Reset All Progress?",
        "This permanently clears your Heat, level, stats, achievements, nickname, daily streak, recent Moment history, and active session from this device.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },

          {
            text: "Reset Everything",
            style: "destructive",
            onPress:
              async () => {
                setIsResetting(
                  true,
                );

                try {
                  await Promise.all([
                    clearGameSession(),
                    clearSavedPlayerProgress(),
                    clearPlayerProfile(),
                    clearRecentMomentHistory(),
                    clearIntermissionHistory(),
                    clearDailyStreak(),
                  ]);

                  await saveAppSettings(
                    createDefaultSettings(),
                  );

                  setHapticsEnabledState(
                    true,
                  );

                  setSoundEffectsEnabledState(
                    true,
                  );

                  Alert.alert(
                    "Progress Reset",
                    "Your local Roast or Toast profile has been cleared.",
                    [
                      {
                        text: "Return Home",
                        onPress:
                          () => {
                            router.replace(
                              "/",
                            );
                          },
                      },
                    ],
                  );
                } finally {
                  setIsResetting(
                    false,
                  );
                }
              },
          },
        ],
      );
    };

  if (!hasLoadedSettings) {
    return (
      <View style={styles.loading}>
        <BrandMark
          type="roast"
          size="medium"
        />

        <BrandMark
          type="toast"
          size="medium"
        />

        <Text style={styles.loadingText}>
          Loading settings...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.posterHeader}>
        <View style={styles.headerActions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={
              handleBackPress
            }
            style={({ pressed }) => [
              styles.headerButton,
              pressed &&
                styles.pressed,
            ]}
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color={Colors.white}
            />
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Return Home"
            onPress={
              handleHomePress
            }
            style={({ pressed }) => [
              styles.headerButton,
              pressed &&
                styles.pressed,
            ]}
          >
            <Ionicons
              name="home-outline"
              size={21}
              color={Colors.white}
            />
          </Pressable>
        </View>

        <StampLabel
          text="MAKE IT YOURS"
          color={Colors.toast}
          rotate={-2}
        />

        <Text style={styles.heading}>
          YOUR GAME.
          {"\n"}
          YOUR SETTINGS.
        </Text>

        <InkUnderline
          color={Colors.roast}
          width={74}
          rotate={-4}
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.scrollContent
        }
      >
        <SectionLabel
          text="FEEDBACK"
          color={Colors.heatDark}
        />

        <SettingRow
          icon="phone-portrait-outline"
          title="HAPTICS"
          description="Vibrate when you vote, advance, or level up."
          accent={
            Colors.roast
          }
        >
          <Switch
            value={
              hapticsEnabled
            }
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
        </SettingRow>

        <SettingRow
          icon="volume-high-outline"
          title="SOUND EFFECTS"
          description="Short sounds for votes, results, and level-ups."
          accent={
            Colors.toast
          }
        >
          <Switch
            value={
              soundEffectsEnabled
            }
            onValueChange={(enabled) => {
              void handleSoundEffectsChange(
                enabled,
              );
            }}
            trackColor={{
              false: "#D4D1CD",
              true: "#A9DDD2",
            }}
            thumbColor={
              soundEffectsEnabled
                ? Colors.toast
                : "#F5F5F5"
            }
            ios_backgroundColor="#D4D1CD"
          />
        </SettingRow>

        <SectionLabel
          text="CONTENT"
          color={Colors.toastDark}
        />

        <ActionRow
          icon="shuffle-outline"
          title="REFRESH MOMENT HISTORY"
          description="Let new rounds reconsider recently seen Moments."
          accent={
            Colors.toast
          }
          onPress={
            handleClearMomentHistory
          }
        />

        <SectionLabel
          text="ABOUT"
          color={Colors.textPrimary}
        />

        <View style={styles.aboutSheet}>
          <View style={styles.aboutMarks}>
            <BrandMark
              type="roast"
              size="medium"
            />

            <Text style={styles.aboutVs}>
              VS
            </Text>

            <BrandMark
              type="toast"
              size="medium"
            />
          </View>

          <Text style={styles.aboutTitle}>
            ROAST OR TOAST
          </Text>

          <Text style={styles.aboutDescription}>
            A social opinion game for honest takes, questionable decisions, and friendly debates.
          </Text>

          <Text style={styles.version}>
            VERSION {appVersion}
          </Text>
        </View>

        <View style={styles.storageReceipt}>
          <HeatMark
            size="small"
          />

          <Text style={styles.storageText}>
            Your profile and progress are currently saved on this device.
          </Text>
        </View>

        <SectionLabel
          text="DANGER ZONE"
          color={Colors.roast}
        />

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Reset all progress"
          disabled={
            isResetting
          }
          onPress={
            handleResetEverything
          }
          style={({ pressed }) => [
            styles.dangerRow,
            pressed &&
              styles.pressed,
            isResetting &&
              styles.disabled,
          ]}
        >
          <Ionicons
            name="trash-outline"
            size={22}
            color={Colors.roast}
          />

          <View style={styles.dangerCopy}>
            <Text style={styles.dangerTitle}>
              {isResetting
                ? "RESETTING..."
                : "RESET ALL PROGRESS"}
            </Text>

            <Text style={styles.dangerDescription}>
              Clear Heat, level, stats, nickname, streaks, achievements, and the active session.
            </Text>
          </View>
        </Pressable>

        <Text style={styles.footer}>
          The opinions may be temporary. The screenshots are forever.
        </Text>
      </ScrollView>
    </View>
  );
}

function SectionLabel({
  text,
  color,
}: {
  text: string;
  color: string;
}) {
  return (
    <View style={styles.sectionLabelWrap}>
      <StampLabel
        text={text}
        color={color}
        rotate={-1.5}
      />
    </View>
  );
}

function SettingRow({
  icon,
  title,
  description,
  accent,
  children,
}: {
  icon:
    keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  accent: string;
  children:
    React.ReactNode;
}) {
  return (
    <View
      style={[
        styles.settingRow,
        {
          borderLeftColor:
            accent,
        },
      ]}
    >
      <Ionicons
        name={icon}
        size={22}
        color={accent}
      />

      <View style={styles.rowCopy}>
        <Text style={styles.rowTitle}>
          {title}
        </Text>

        <Text style={styles.rowDescription}>
          {description}
        </Text>
      </View>

      {children}
    </View>
  );
}

function ActionRow({
  icon,
  title,
  description,
  accent,
  onPress,
}: {
  icon:
    keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  accent: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.settingRow,
        {
          borderLeftColor:
            accent,
        },
        pressed &&
          styles.pressed,
      ]}
    >
      <Ionicons
        name={icon}
        size={22}
        color={accent}
      />

      <View style={styles.rowCopy}>
        <Text style={styles.rowTitle}>
          {title}
        </Text>

        <Text style={styles.rowDescription}>
          {description}
        </Text>
      </View>

      <Text style={styles.rowArrow}>
        →
      </Text>
    </Pressable>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        Colors.background,
    },

    loading: {
      flex: 1,
      backgroundColor:
        Colors.background,

      alignItems: "center",
      justifyContent: "center",

      flexDirection: "row",
      gap: 10,
    },

    loadingText: {
      color:
        Colors.textPrimary,

      fontSize: 12,
      fontWeight: "800",
    },

    posterHeader: {
      backgroundColor:
        "#1D1D1F",

      paddingTop: 58,
      paddingHorizontal:
        Spacing.lg,
      paddingBottom: 26,
    },

    headerActions: {
      flexDirection: "row",
      justifyContent:
        "space-between",

      marginBottom: 18,
    },

    headerButton: {
      width: 40,
      height: 40,

      borderColor:
        "#55555A",
      borderWidth: 1,

      alignItems: "center",
      justifyContent: "center",
    },

    heading: {
      color:
        Colors.white,

      fontSize: 37,
      lineHeight: 37,
      fontWeight: "900",
      letterSpacing: -1.8,

      marginTop: 13,
    },

    scrollContent: {
      paddingHorizontal:
        Spacing.lg,
      paddingTop: 22,
      paddingBottom: 48,
    },

    sectionLabelWrap: {
      marginTop: 14,
      marginBottom: 9,
    },

    settingRow: {
      minHeight: 84,

      borderTopColor:
        Colors.textPrimary,
      borderBottomColor:
        Colors.textPrimary,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderLeftWidth: 5,

      flexDirection: "row",
      alignItems: "center",

      paddingHorizontal: 11,
      paddingVertical: 12,

      marginBottom: 10,
    },

    rowCopy: {
      flex: 1,
      marginLeft: 11,
      marginRight: 8,
    },

    rowTitle: {
      color:
        Colors.textPrimary,

      fontSize: 12,
      fontWeight: "900",
      letterSpacing: 0.6,
    },

    rowDescription: {
      color:
        Colors.textSecondary,

      fontSize: 10,
      fontWeight: "700",
      lineHeight: 14,

      marginTop: 3,
    },

    rowArrow: {
      color:
        Colors.textPrimary,

      fontSize: 24,
      fontWeight: "700",
    },

    aboutSheet: {
      borderTopColor:
        Colors.textPrimary,
      borderBottomColor:
        Colors.textPrimary,
      borderTopWidth: 1.4,
      borderBottomWidth: 1.4,

      paddingVertical: 23,
      paddingHorizontal: 10,
    },

    aboutMarks: {
      flexDirection: "row",
      alignItems: "center",
      gap: 9,
    },

    aboutVs: {
      color:
        Colors.textMuted,

      fontSize: 8,
      fontWeight: "900",
    },

    aboutTitle: {
      color:
        Colors.textPrimary,

      fontSize: 27,
      fontWeight: "900",
      letterSpacing: -1,

      marginTop: 13,
    },

    aboutDescription: {
      color:
        Colors.textSecondary,

      fontSize: 12,
      fontWeight: "700",
      lineHeight: 18,

      marginTop: 5,
    },

    version: {
      color:
        Colors.textMuted,

      fontSize: 7,
      fontWeight: "900",
      letterSpacing: 1.2,

      marginTop: 12,
    },

    storageReceipt: {
      minHeight: 68,

      flexDirection: "row",
      alignItems: "center",

      borderBottomColor:
        Colors.borderStrong,
      borderBottomWidth: 1,

      paddingHorizontal: 7,
    },

    storageText: {
      flex: 1,

      color:
        Colors.textSecondary,

      fontSize: 10,
      fontWeight: "700",
      lineHeight: 14,

      marginLeft: 9,
    },

    dangerRow: {
      borderColor:
        Colors.roast,
      borderWidth: 1.5,

      flexDirection: "row",
      alignItems: "center",

      minHeight: 92,

      paddingHorizontal: 13,
    },

    dangerCopy: {
      flex: 1,
      marginLeft: 11,
    },

    dangerTitle: {
      color:
        Colors.roastDark,

      fontSize: 12,
      fontWeight: "900",
      letterSpacing: 0.7,
    },

    dangerDescription: {
      color:
        Colors.textSecondary,

      fontSize: 9.5,
      fontWeight: "700",
      lineHeight: 14,

      marginTop: 4,
    },

    footer: {
      color:
        Colors.textMuted,

      fontSize: 9,
      fontWeight: "700",

      textAlign: "center",

      marginTop: 25,
    },

    pressed: {
      opacity: 0.7,
    },

    disabled: {
      opacity: 0.45,
    },
  });
