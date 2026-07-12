// =====================================================
// File: mode-select.tsx
//
// Screen: Mode Select
//
// Purpose:
// Allows the player to choose the length of a new Roast
// or Toast round.
//
// Available Modes:
// • Quick 10
// • Standard 20
// • Endless
//
// Important:
// The existing session is not cleared until the player
// actually chooses a mode.
//
// Project: Roast or Toast
// =====================================================

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  triggerNavigationEffect,
} from "../game/effects";

import {
  resetSavedCurrentStreak,
} from "../game/progressStorage";

import {
  ROUND_MODES,
  type RoundMode,
} from "../game/roundTypes";

import {
  clearGameSession,
} from "../game/sessionStorage";

import {
  Colors,
  Radius,
  Spacing,
} from "../theme";

export default function ModeSelectScreen() {
  // Prevents duplicate taps while storage is being reset.
  let isStartingRound = false;

  // Returns to Home without touching the saved session.
  const handleBackPress = () => {
    triggerNavigationEffect();
    router.back();
  };

  // Starts a fresh session using the selected mode.
  const handleModePress = async (
    roundMode: RoundMode,
  ) => {
    if (isStartingRound) {
      return;
    }

    isStartingRound = true;

    triggerNavigationEffect();

    // Remove only the active question session.
    await clearGameSession();

    // A new round starts with a fresh current streak.
    // Heat, level, best streak, and lifetime totals stay.
    await resetSavedCurrentStreak();

    router.replace({
      pathname: "/scenario",

      params: {
        mode: "fresh",
        roundMode,
      },
    });
  };

  return (
    <View style={styles.container}>
      {/* Decorative background words */}
      <Text style={styles.roastBackdrop}>
        ROAST
      </Text>

      <Text style={styles.toastBackdrop}>
        TOAST
      </Text>

      {/* Top navigation */}
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Return to Home"
          onPress={handleBackPress}
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.buttonPressed,
          ]}
        >
          <Ionicons
            name="arrow-back"
            size={25}
            color={Colors.textPrimary}
          />
        </Pressable>

        <Text style={styles.headerTitle}>
          Choose Your Round
        </Text>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.scrollContent
        }
      >
        {/* Intro */}
        <View style={styles.introContainer}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              HOW MUCH TIME DO YOU HAVE?
            </Text>
          </View>

          <Text style={styles.heading}>
            Pick your level of commitment.
          </Text>

          <Text style={styles.subheading}>
            Your Heat and level stay with you no matter
            which round you choose.
          </Text>
        </View>

        <ModeCard
          mode="quick"
          icon="flash"
          onPress={() =>
            void handleModePress("quick")
          }
        />

        <ModeCard
          mode="standard"
          icon="flame"
          featured
          onPress={() =>
            void handleModePress("standard")
          }
        />

        <ModeCard
          mode="endless"
          icon="infinite"
          onPress={() =>
            void handleModePress("endless")
          }
        />
      </ScrollView>
    </View>
  );
}

// =====================================================
// Mode Card
// =====================================================

type ModeCardProps = {
  mode: RoundMode;
  icon:
    | "flash"
    | "flame"
    | "infinite";
  featured?: boolean;
  onPress: () => void;
};

function ModeCard({
  mode,
  icon,
  featured = false,
  onPress,
}: ModeCardProps) {
  const config = ROUND_MODES[mode];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Start ${config.title}`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.modeCard,
        featured && styles.featuredModeCard,
        pressed && styles.modeCardPressed,
      ]}
    >
      <View
        style={[
          styles.modeIconContainer,
          featured &&
            styles.featuredModeIconContainer,
        ]}
      >
        <Ionicons
          name={icon}
          size={25}
          color={
            featured
              ? Colors.white
              : Colors.roast
          }
        />
      </View>

      <View style={styles.modeTextContainer}>
        <View style={styles.modeTitleRow}>
          <Text style={styles.modeTitle}>
            {config.title}
          </Text>

          {featured && (
            <View style={styles.recommendedBadge}>
              <Text
                style={
                  styles.recommendedBadgeText
                }
              >
                RECOMMENDED
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.modeDescription}>
          {config.description}
        </Text>

        <Text style={styles.modeFlavorText}>
          {config.flavorText}
        </Text>
      </View>

      <Ionicons
        name="arrow-forward"
        size={22}
        color={Colors.textPrimary}
      />
    </Pressable>
  );
}

// =====================================================
// Styles
// =====================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    overflow: "hidden",
  },

  header: {
    paddingTop: 62,
    paddingBottom: 14,
    paddingHorizontal: Spacing.lg,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    zIndex: 5,
  },

  backButton: {
    width: 44,
    height: 44,

    borderRadius: Radius.pill,

    backgroundColor: Colors.surface,

    borderColor: Colors.border,
    borderWidth: 1,

    alignItems: "center",
    justifyContent: "center",
  },

  buttonPressed: {
    opacity: 0.68,
    transform: [{ scale: 0.96 }],
  },

  headerTitle: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: "900",
  },

  headerSpacer: {
    width: 44,
  },

  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 20,
    paddingBottom: 48,
  },

  introContainer: {
    marginBottom: 26,
  },

  badge: {
    alignSelf: "flex-start",

    borderColor: Colors.roast,
    borderWidth: 1.5,
    borderRadius: Radius.pill,

    paddingVertical: 7,
    paddingHorizontal: 14,

    marginBottom: 18,

    transform: [{ rotate: "-2deg" }],
  },

  badgeText: {
    color: Colors.roast,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.4,
  },

  heading: {
    color: Colors.textPrimary,

    fontSize: 38,
    fontWeight: "900",

    letterSpacing: -1.6,
    lineHeight: 43,

    marginBottom: 8,
  },

  subheading: {
    color: Colors.textSecondary,

    fontSize: 15,
    fontWeight: "600",

    lineHeight: 22,
  },

  modeCard: {
    minHeight: 132,

    backgroundColor: Colors.surface,

    borderColor: Colors.border,
    borderWidth: 1.5,
    borderRadius: Radius.lg,

    paddingVertical: 18,
    paddingHorizontal: 17,

    marginBottom: 14,

    flexDirection: "row",
    alignItems: "center",
  },

  featuredModeCard: {
    backgroundColor: "#FFF1EC",
    borderColor: Colors.roast,
    borderWidth: 2,
  },

  modeCardPressed: {
    opacity: 0.72,
    transform: [{ scale: 0.985 }],
  },

  modeIconContainer: {
    width: 48,
    height: 48,

    borderRadius: 24,

    backgroundColor: "#FFF1EC",

    alignItems: "center",
    justifyContent: "center",

    marginRight: 14,
  },

  featuredModeIconContainer: {
    backgroundColor: Colors.roast,
  },

  modeTextContainer: {
    flex: 1,
    paddingRight: 10,
  },

  modeTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",

    marginBottom: 4,
  },

  modeTitle: {
    color: Colors.textPrimary,

    fontSize: 20,
    fontWeight: "900",

    marginRight: 8,
  },

  recommendedBadge: {
    backgroundColor: Colors.roast,

    borderRadius: Radius.pill,

    paddingVertical: 4,
    paddingHorizontal: 8,
  },

  recommendedBadgeText: {
    color: Colors.white,

    fontSize: 8,
    fontWeight: "900",

    letterSpacing: 0.8,
  },

  modeDescription: {
    color: Colors.textPrimary,

    fontSize: 13,
    fontWeight: "700",

    lineHeight: 18,

    marginBottom: 5,
  },

  modeFlavorText: {
    color: Colors.textSecondary,

    fontSize: 11,
    fontWeight: "600",

    lineHeight: 16,
  },

  roastBackdrop: {
    position: "absolute",

    top: 128,
    right: -54,

    color: Colors.roast,

    fontSize: 94,
    fontWeight: "900",
    letterSpacing: -5,

    opacity: 0.06,

    transform: [{ rotate: "8deg" }],
  },

  toastBackdrop: {
    position: "absolute",

    bottom: 38,
    left: -47,

    color: Colors.toast,

    fontSize: 91,
    fontWeight: "900",
    letterSpacing: -5,

    opacity: 0.06,

    transform: [{ rotate: "-8deg" }],
  },
});