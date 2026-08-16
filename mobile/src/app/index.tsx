// =====================================================
// File: index.tsx
// Screen: Home
// Version 1.1 — Cover / Poster Redesign
// =====================================================

import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import {
  DEFAULT_PLAYER_NICKNAME,
  loadPlayerProfile,
} from "../game/profileStorage";
import { loadGameSession } from "../game/sessionStorage";
import { useDailyStreak } from "../hooks/useDailyStreak";
import { Colors, Spacing } from "../theme";

import BrandMark from "../components/BrandMark";
import HeatMark from "../components/HeatMark";
import InkUnderline from "../components/InkUnderline";
import StampLabel from "../components/StampLabel";

export default function HomeScreen() {
  const [hasSavedSession, setHasSavedSession] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [nickname, setNickname] = useState(DEFAULT_PLAYER_NICKNAME);
  const { dailyStreak, hasLoadedDailyStreak } = useDailyStreak();

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const restoreHomeData = async () => {
        setIsCheckingSession(true);
        const [savedSession, savedProfile] = await Promise.all([
          loadGameSession(),
          loadPlayerProfile(),
        ]);

        if (!isActive) return;

        setHasSavedSession(Boolean(savedSession?.hasActiveSession));
        setNickname(savedProfile.nickname);
        setIsCheckingSession(false);
      };

      void restoreHomeData();
      return () => {
        isActive = false;
      };
    }, []),
  );

  const handleContinueSession = () => {
    router.push({ pathname: "/scenario", params: { mode: "continue" } });
  };

  const handleNewRound = () => router.push("/mode-select");
  const handleProfilePress = () => router.push("/profile");
  const handleSettingsPress = () => router.push("/settings");

  const hasCustomNickname = nickname !== DEFAULT_PLAYER_NICKNAME;

  return (
    <View style={styles.container}>
      {/* The top now behaves like the game's masthead, not an app dashboard. */}
      <View style={styles.masthead}>
        <View style={styles.utilityRow}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open player profile"
            onPress={handleProfilePress}
            style={({ pressed }) => [styles.utilityButton, pressed && styles.pressed]}
          >
            <Ionicons name="person-outline" size={17} color={Colors.white} />
            <Text style={styles.utilityText}>PROFILE</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open settings"
            onPress={handleSettingsPress}
            style={({ pressed }) => [styles.utilityIconButton, pressed && styles.pressed]}
          >
            <Ionicons name="settings-outline" size={19} color={Colors.white} />
          </Pressable>
        </View>

        <Text style={styles.alright}>Alright...</Text>
        <Text style={styles.title}>LET&apos;S BE HONEST.</Text>

        <View style={styles.underlineRow}>
          <InkUnderline color={Colors.roast} width={58} rotate={-7} />
          <InkUnderline color={Colors.toast} width={58} rotate={7} />
        </View>
      </View>

      {/* No giant parchment sheet. The cream page itself is the canvas. */}
      <View style={styles.body}>
        <View style={styles.identityRow}>
          <View style={[styles.identitySide, styles.roastIdentity]}>
            <BrandMark type="roast" size="large" />
            <Text style={styles.roastWord}>ROAST</Text>
          </View>

          <View style={styles.orPuck}>
            <Text style={styles.orText}>OR</Text>
          </View>

          <View style={[styles.identitySide, styles.toastIdentity]}>
            <BrandMark type="toast" size="large" />
            <Text style={styles.toastWord}>TOAST</Text>
          </View>
        </View>

        <View style={styles.rule} />

        {hasCustomNickname && (
          <Text style={styles.greeting}>WELCOME BACK, {nickname.toUpperCase()}.</Text>
        )}

        {hasLoadedDailyStreak && (
          <View style={styles.streakStrip}>
            <View style={styles.streakLead}>
              <HeatMark size="small" />
              <View style={styles.streakCopy}>
                <Text style={styles.streakDay}>DAY {dailyStreak.currentStreak}</Text>
                <Text style={styles.streakLabel}>DAILY OPINION STREAK</Text>
              </View>
            </View>

            <View style={styles.bestBlock}>
              <Text style={styles.bestValue}>{dailyStreak.bestStreak}</Text>
              <Text style={styles.bestLabel}>BEST</Text>
            </View>
          </View>
        )}

        {isCheckingSession ? (
          <Text style={styles.loadingText}>CHECKING YOUR LAST ROUND...</Text>
        ) : hasSavedSession ? (
          <View style={styles.actionStack}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Continue session"
              onPress={handleContinueSession}
              style={({ pressed }) => [styles.heroAction, pressed && styles.pressed]}
            >
              <View>
                <Text style={styles.heroEyebrow}>PICK UP WHERE YOU LEFT OFF</Text>
                <Text style={styles.heroActionText}>CONTINUE SESSION</Text>
              </View>
              <Text style={styles.heroArrow}>→</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Choose a new round"
              onPress={handleNewRound}
              style={({ pressed }) => [styles.secondaryAction, pressed && styles.pressed]}
            >
              <View>
                <StampLabel text="NEW ROUND" color={Colors.roast} rotate={-2} />
                <Text style={styles.secondaryCopy}>Quick 10, Standard 20, or Endless</Text>
              </View>
              <Text style={styles.secondaryArrow}>→</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Choose a new Roast or Toast round"
            onPress={handleNewRound}
            style={({ pressed }) => [styles.startBlock, pressed && styles.pressed]}
          >
            <View>
              <StampLabel text="NEW ROUND" color={Colors.roast} rotate={-2} />
              <Text style={styles.startTitle}>READY?</Text>
              <Text style={styles.startCopy}>Pick a round. Pick a side.</Text>
            </View>
            <Text style={styles.startArrow}>→</Text>
          </Pressable>
        )}

        {/* =================================================
            Suggest a Moment Preview

            I am bringing this back because it was part of
            the game before the visual redesign.

            The submission system is not live yet, so I am
            keeping this honest and showing it as Coming Soon.
        ================================================= */}

        <View
          accessible
          accessibilityLabel="Suggest a Moment. Coming soon."
          style={styles.suggestionBlock}
        >
          <View style={styles.suggestionTopRow}>
            <View style={styles.suggestionHeadingRow}>
              <Ionicons name="bulb-outline" size={20} color={Colors.roast} />
              <Text style={styles.suggestionEyebrow}>GOT A BETTER TAKE?</Text>
            </View>

            <StampLabel text="COMING SOON" color={Colors.toastDark} rotate={2} />
          </View>

          <Text style={styles.suggestionTitle}>SUGGEST A MOMENT</Text>

          <Text style={styles.suggestionCopy}>
            Your takes belong in the game too. Community submissions are coming
            in a future update.
          </Text>

          <View style={styles.suggestionFooter}>
            <Text style={styles.suggestionFooterText}>COMMUNITY FEATURE</Text>
            <Ionicons name="lock-closed-outline" size={14} color={Colors.textMuted} />
          </View>
        </View>

        <View style={styles.bottomNote}>
          <View style={styles.bottomRule} />
          <Text style={styles.bottomText}>JUDGE THE MOMENT. OWN THE TAKE.</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  masthead: {
    backgroundColor: "#1D1D1F",
    paddingTop: 56,
    paddingHorizontal: Spacing.lg,
    paddingBottom: 25,
  },
  utilityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  utilityButton: {
    minHeight: 34,
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: "#66666A",
    borderBottomWidth: 1,
    paddingHorizontal: 2,
  },
  utilityIconButton: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderBottomColor: "#66666A",
    borderBottomWidth: 1,
  },
  utilityText: {
    color: Colors.white,
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1.4,
    marginLeft: 6,
  },
  alright: {
    color: Colors.toast,
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
    transform: [{ rotate: "-3deg" }],
  },
  title: {
    color: Colors.white,
    fontSize: 43,
    lineHeight: 46,
    fontWeight: "900",
    letterSpacing: -2,
    textAlign: "center",
  },
  underlineRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 42,
    marginTop: 4,
  },

  body: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: 24,
    paddingBottom: 24,
  },
  identityRow: {
    minHeight: 128,
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  identitySide: { flex: 1, alignItems: "center", justifyContent: "center" },
  roastIdentity: { transform: [{ rotate: "-1.5deg" }] },
  toastIdentity: { transform: [{ rotate: "1.5deg" }] },
  roastWord: {
    color: Colors.roastDark,
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 1.3,
    marginTop: 3,
  },
  toastWord: {
    color: Colors.toastDark,
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 1.3,
    marginTop: 3,
  },
  orPuck: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.textPrimary,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  orText: { color: Colors.white, fontSize: 8, fontWeight: "900", letterSpacing: 0.5 },
  rule: { height: 2, backgroundColor: Colors.textPrimary, marginBottom: 13 },
  greeting: {
    color: Colors.textMuted,
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1.1,
    textAlign: "center",
    marginBottom: 10,
  },

  streakStrip: {
    minHeight: 70,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomColor: Colors.borderStrong,
    borderBottomWidth: 1,
    paddingHorizontal: 6,
    paddingBottom: 12,
    marginBottom: 17,
  },
  streakLead: { flexDirection: "row", alignItems: "center" },
  streakCopy: { marginLeft: 10 },
  streakDay: { color: Colors.textPrimary, fontSize: 16, fontWeight: "900" },
  streakLabel: {
    color: Colors.textMuted,
    fontSize: 7,
    fontWeight: "900",
    letterSpacing: 1.2,
    marginTop: 1,
  },
  bestBlock: { alignItems: "center", paddingLeft: 14 },
  bestValue: { color: Colors.heatDark, fontSize: 22, fontWeight: "900" },
  bestLabel: { color: Colors.textMuted, fontSize: 7, fontWeight: "900", letterSpacing: 1.1 },
  loadingText: {
    color: Colors.textMuted,
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1,
    textAlign: "center",
    marginVertical: 22,
  },

  actionStack: { gap: 13 },
  heroAction: {
    minHeight: 104,
    backgroundColor: Colors.textPrimary,
    borderBottomColor: Colors.toast,
    borderBottomWidth: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    transform: [{ rotate: "-0.6deg" }],
  },
  heroEyebrow: {
    color: Colors.roast,
    fontSize: 7,
    fontWeight: "900",
    letterSpacing: 1.4,
    marginBottom: 7,
  },
  heroActionText: { color: Colors.white, fontSize: 18, fontWeight: "900", letterSpacing: 1.1 },
  heroArrow: { color: Colors.white, fontSize: 32, fontWeight: "700" },
  secondaryAction: {
    minHeight: 88,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopColor: Colors.textPrimary,
    borderBottomColor: Colors.textPrimary,
    borderTopWidth: 1.5,
    borderBottomWidth: 1.5,
    paddingHorizontal: 8,
  },
  secondaryCopy: { color: Colors.textSecondary, fontSize: 11, fontWeight: "700", marginTop: 8 },
  secondaryArrow: { color: Colors.textPrimary, fontSize: 30, fontWeight: "700" },
  startBlock: {
    minHeight: 145,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopColor: Colors.textPrimary,
    borderBottomColor: Colors.textPrimary,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    paddingHorizontal: 8,
    paddingVertical: 18,
  },
  startTitle: { color: Colors.textPrimary, fontSize: 38, fontWeight: "900", letterSpacing: -1.5, marginTop: 9 },
  startCopy: { color: Colors.textSecondary, fontSize: 12, fontWeight: "700", marginTop: 2 },
  startArrow: { color: Colors.roast, fontSize: 38, fontWeight: "700" },

  // =====================================================
  // Suggest a Moment
  //
  // I want this to feel like a teaser printed onto the
  // Home page, not another rounded app card.
  // =====================================================

  suggestionBlock: {
    marginTop: 18,
    borderTopColor: Colors.textPrimary,
    borderTopWidth: 2,
    borderBottomColor: Colors.textPrimary,
    borderBottomWidth: 2,
    paddingVertical: 15,
    paddingHorizontal: 8,
    transform: [{ rotate: "0.35deg" }],
  },
  suggestionTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  suggestionHeadingRow: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
  },
  suggestionEyebrow: {
    color: Colors.roastDark,
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1.25,
    marginLeft: 7,
  },
  suggestionTitle: {
    color: Colors.textPrimary,
    fontSize: 23,
    lineHeight: 26,
    fontWeight: "900",
    letterSpacing: -0.6,
    marginTop: 12,
  },
  suggestionCopy: {
    color: Colors.textSecondary,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "700",
    marginTop: 5,
    maxWidth: 330,
  },
  suggestionFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopColor: Colors.borderStrong,
    borderTopWidth: 1,
    marginTop: 13,
    paddingTop: 9,
  },
  suggestionFooterText: {
    color: Colors.textMuted,
    fontSize: 7,
    fontWeight: "900",
    letterSpacing: 1.3,
  },

  bottomNote: { marginTop: "auto", paddingTop: 18 },
  bottomRule: { width: 62, height: 4, backgroundColor: Colors.toast, marginBottom: 8, transform: [{ rotate: "-3deg" }] },
  bottomText: { color: Colors.textMuted, fontSize: 7, fontWeight: "900", letterSpacing: 1.4 },
  pressed: { opacity: 0.72 },
});