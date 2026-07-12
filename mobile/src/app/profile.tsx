// =====================================================
// File: profile.tsx
//
// Screen: Profile
//
// Purpose:
// Displays the player's local Roast or Toast identity,
// lifetime statistics, daily return streak, achievements,
// and future community features.
//
// Current Features:
// • Editable nickname
// • Current title and level
// • Heat progress
// • Daily return streak
// • Lifetime gameplay statistics
// • Achievement badges
// • Suggest a Moment preview
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
  useMemo,
  useState,
} from "react";

import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import type {
  PlayerProgress,
} from "../game/progressTypes";

import {
  DEFAULT_PLAYER_NICKNAME,
  loadPlayerProfile,
  savePlayerProfile,
} from "../game/profileStorage";

import {
  getPlayerTitle,
} from "../game/titles";

import {
  useDailyStreak,
} from "../hooks/useDailyStreak";

import {
  usePlayerProgress,
} from "../hooks/usePlayerProgress";

import {
  Colors,
  Radius,
  Spacing,
} from "../theme";

type Achievement = {
  id: string;
  emoji: string;
  title: string;
  description: string;
  unlocked: boolean;
};

export default function ProfileScreen() {
  const {
    progress,
    hasLoadedProgress,
  } = usePlayerProgress();

  const {
    dailyStreak,
    hasLoadedDailyStreak,
  } = useDailyStreak();

  const [
    nickname,
    setNickname,
  ] = useState(
    DEFAULT_PLAYER_NICKNAME,
  );

  const [
    nicknameDraft,
    setNicknameDraft,
  ] = useState(
    DEFAULT_PLAYER_NICKNAME,
  );

  const [
    isEditingNickname,
    setIsEditingNickname,
  ] = useState(false);

  const [
    isSavingNickname,
    setIsSavingNickname,
  ] = useState(false);

  // =====================================================
  // Restore Local Profile
  // =====================================================

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const restoreProfile =
        async () => {
          const savedProfile =
            await loadPlayerProfile();

          if (!isActive) {
            return;
          }

          setNickname(
            savedProfile.nickname,
          );

          setNicknameDraft(
            savedProfile.nickname,
          );
        };

      void restoreProfile();

      return () => {
        isActive = false;
      };
    }, []),
  );

  // =====================================================
  // Statistics
  // =====================================================

  const totalVotes =
    progress.roastCount +
    progress.toastCount;

  const roastPercentage =
    totalVotes > 0
      ? Math.round(
          (progress.roastCount /
            totalVotes) *
            100,
        )
      : 0;

  const toastPercentage =
    totalVotes > 0
      ? Math.round(
          (progress.toastCount /
            totalVotes) *
            100,
        )
      : 0;

  const crowdMatchPercentage =
    progress.momentsCompleted > 0
      ? Math.round(
          (progress.majorityMatches /
            progress.momentsCompleted) *
            100,
        )
      : 0;

  const crowdGuessAccuracy =
    progress.crowdGuesses > 0
      ? Math.round(
          (progress.correctCrowdGuesses /
            progress.crowdGuesses) *
            100,
        )
      : 0;

  const levelProgressPercentage =
    progress.heatForNextLevel > 0
      ? Math.min(
          Math.max(
            progress.currentLevelHeat /
              progress.heatForNextLevel,
            0,
          ),
          1,
        )
      : 0;

  const playerTitle =
    getPlayerTitle(
      progress.level,
    );

  const achievements =
    useMemo(
      () =>
        getAchievements(
          progress,
        ),
      [progress],
    );

  const unlockedAchievements =
    achievements.filter(
      (achievement) =>
        achievement.unlocked,
    ).length;

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
  // Nickname Editing
  // =====================================================

  const handleEditNickname = () => {
    setNicknameDraft(
      nickname,
    );

    setIsEditingNickname(true);
  };

  const handleCancelNickname = () => {
    setNicknameDraft(
      nickname,
    );

    setIsEditingNickname(false);
  };

  const handleSaveNickname =
    async () => {
      const cleanedNickname =
        nicknameDraft
          .trim()
          .slice(0, 24);

      const finalNickname =
        cleanedNickname.length > 0
          ? cleanedNickname
          : DEFAULT_PLAYER_NICKNAME;

      setIsSavingNickname(true);

      await savePlayerProfile({
        nickname:
          finalNickname,
      });

      setNickname(
        finalNickname,
      );

      setNicknameDraft(
        finalNickname,
      );

      setIsEditingNickname(false);
      setIsSavingNickname(false);
    };

  if (
    !hasLoadedProgress ||
    !hasLoadedDailyStreak
  ) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingEmoji}>
          🔥
        </Text>

        <Text style={styles.loadingText}>
          Loading your opinions...
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      <Text style={styles.roastBackdrop}>
        ROAST
      </Text>

      <Text style={styles.toastBackdrop}>
        TOAST
      </Text>

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
          My Profile
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
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={
          styles.scrollContent
        }
      >
        <View style={styles.introBadge}>
          <Text style={styles.introBadgeText}>
            YOUR OPINION HISTORY
          </Text>
        </View>

        <Text style={styles.heading}>
          The receipts are in.
        </Text>

        <Text style={styles.subheading}>
          Apparently, you have opinions.
        </Text>

        {/* =================================================
            Main Identity Card
        ================================================= */}

        <View style={styles.identityCard}>
          <View style={styles.identityTopRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarEmoji}>
                🔥
              </Text>
            </View>

            <View style={styles.identityText}>
              {!isEditingNickname ? (
                <>
                  <Text
                    style={
                      styles.nickname
                    }
                    numberOfLines={1}
                  >
                    {nickname}
                  </Text>

                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Edit nickname"
                    onPress={
                      handleEditNickname
                    }
                    style={({ pressed }) => [
                      styles.editNicknameButton,

                      pressed &&
                        styles.smallButtonPressed,
                    ]}
                  >
                    <Ionicons
                      name="pencil"
                      size={12}
                      color={
                        Colors.roast
                      }
                    />

                    <Text
                      style={
                        styles.editNicknameText
                      }
                    >
                      Edit nickname
                    </Text>
                  </Pressable>
                </>
              ) : (
                <View style={styles.editor}>
                  <TextInput
                    value={
                      nicknameDraft
                    }
                    onChangeText={
                      setNicknameDraft
                    }
                    autoFocus
                    maxLength={24}
                    returnKeyType="done"
                    placeholder="Choose a nickname"
                    placeholderTextColor="#8D8D92"
                    onSubmitEditing={() => {
                      void handleSaveNickname();
                    }}
                    style={styles.nicknameInput}
                  />

                  <View style={styles.editorActions}>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Cancel nickname changes"
                      onPress={
                        handleCancelNickname
                      }
                      style={({ pressed }) => [
                        styles.cancelButton,

                        pressed &&
                          styles.smallButtonPressed,
                      ]}
                    >
                      <Text style={styles.cancelButtonText}>
                        Cancel
                      </Text>
                    </Pressable>

                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Save nickname"
                      disabled={
                        isSavingNickname
                      }
                      onPress={() => {
                        void handleSaveNickname();
                      }}
                      style={({ pressed }) => [
                        styles.saveButton,

                        pressed &&
                          styles.smallButtonPressed,

                        isSavingNickname &&
                          styles.disabledButton,
                      ]}
                    >
                      <Text style={styles.saveButtonText}>
                        {isSavingNickname
                          ? "Saving..."
                          : "Save"}
                      </Text>
                    </Pressable>
                  </View>
                </View>
              )}
            </View>
          </View>

          <View style={styles.identityDivider} />

          <Text style={styles.titleEyebrow}>
            CURRENT ENERGY
          </Text>

          <Text style={styles.playerTitle}>
            {playerTitle}
          </Text>

          <View style={styles.levelRow}>
            <Text style={styles.levelText}>
              Level {progress.level}
            </Text>

            <Text style={styles.levelHeat}>
              {progress.currentLevelHeat}
              {" / "}
              {progress.heatForNextLevel}
              {" Heat"}
            </Text>
          </View>

          <View style={styles.levelTrack}>
            <View
              style={[
                styles.levelFill,

                {
                  width: `${levelProgressPercentage * 100}%`,
                },
              ]}
            />
          </View>
        </View>

        {/* =================================================
            Daily Streak
        ================================================= */}

        <Text style={styles.sectionTitle}>
          Daily Streak
        </Text>

        <View style={styles.dailyStreakCard}>
          <View style={styles.dailyStreakIcon}>
            <Text style={styles.dailyStreakEmoji}>
              🔥
            </Text>
          </View>

          <View style={styles.dailyStreakText}>
            <Text style={styles.dailyStreakValue}>
              Day {dailyStreak.currentStreak}
            </Text>

            <Text style={styles.dailyStreakDescription}>
              Come back tomorrow to keep the Heat going.
            </Text>
          </View>

          <View style={styles.dailyBest}>
            <Text style={styles.dailyBestValue}>
              {dailyStreak.bestStreak}
            </Text>

            <Text style={styles.dailyBestLabel}>
              BEST
            </Text>
          </View>
        </View>

        {/* =================================================
            Main Statistics
        ================================================= */}

        <Text style={styles.sectionTitle}>
          Lifetime Stats
        </Text>

        <View style={styles.statsGrid}>
          <StatCard
            emoji="🔥"
            value={
              progress.totalHeat
            }
            label="Total Heat"
          />

          <StatCard
            emoji="⚖️"
            value={
              progress.momentsCompleted
            }
            label="Moments judged"
          />

          <StatCard
            emoji="🎯"
            value={`${crowdMatchPercentage}%`}
            label="With the crowd"
          />

          <StatCard
            emoji="⚡"
            value={
              progress.bestStreak
            }
            label="Best match streak"
          />
        </View>

        {/* =================================================
            Roast vs Toast
        ================================================= */}

        <Text style={styles.sectionTitle}>
          Your Verdicts
        </Text>

        <View style={styles.verdictCard}>
          <VerdictRow
            emoji="🔥"
            label="Roast"
            count={
              progress.roastCount
            }
            percentage={
              roastPercentage
            }
            fillColor={
              Colors.roast
            }
          />

          <View style={styles.verdictDivider} />

          <VerdictRow
            emoji="♥"
            label="Toast"
            count={
              progress.toastCount
            }
            percentage={
              toastPercentage
            }
            fillColor={
              Colors.toast
            }
          />
        </View>

        {/* =================================================
            Guess the Crowd
        ================================================= */}

        <Text style={styles.sectionTitle}>
          Guess the Crowd
        </Text>

        <View style={styles.crowdCard}>
          <View style={styles.crowdIconContainer}>
            <Text style={styles.crowdIcon}>
              👀
            </Text>
          </View>

          <View style={styles.crowdTextContainer}>
            <Text style={styles.crowdValue}>
              {progress.correctCrowdGuesses}
              {" of "}
              {progress.crowdGuesses}
            </Text>

            <Text style={styles.crowdLabel}>
              predictions correct
            </Text>
          </View>

          <View style={styles.crowdAccuracy}>
            <Text style={styles.crowdAccuracyValue}>
              {crowdGuessAccuracy}%
            </Text>

            <Text style={styles.crowdAccuracyLabel}>
              ACCURACY
            </Text>
          </View>
        </View>

        {/* =================================================
            Achievements
        ================================================= */}

        <View style={styles.achievementHeader}>
          <Text style={styles.sectionTitle}>
            Achievements
          </Text>

          <Text style={styles.achievementCount}>
            {unlockedAchievements}
            {" / "}
            {achievements.length}
          </Text>
        </View>

        <View style={styles.achievementsGrid}>
          {achievements.map(
            (achievement) => (
              <AchievementCard
                key={
                  achievement.id
                }
                achievement={
                  achievement
                }
              />
            ),
          )}
        </View>

        {/* =================================================
            Community Feature Preview
        ================================================= */}

        <Text style={styles.communitySectionTitle}>
          Community
        </Text>

        <View style={styles.suggestionCard}>
          <View style={styles.suggestionTopRow}>
            <View style={styles.suggestionIcon}>
              <Ionicons
                name="bulb-outline"
                size={24}
                color={
                  Colors.roast
                }
              />
            </View>

            <View style={styles.comingSoonBadge}>
              <Text style={styles.comingSoonText}>
                COMING SOON
              </Text>
            </View>
          </View>

          <Text style={styles.suggestionTitle}>
            Got a better take?
          </Text>

          <Text style={styles.suggestionDescription}>
            Soon you&apos;ll be able to submit your own Roast or Toast Moment. Community favorites can be featured in the game, with the winning creator getting credit.
          </Text>

          <View style={styles.weeklyWinnerPreview}>
            <Text style={styles.weeklyWinnerEmoji}>
              🏆
            </Text>

            <View style={styles.weeklyWinnerText}>
              <Text style={styles.weeklyWinnerTitle}>
                Moment of the Week
              </Text>

              <Text style={styles.weeklyWinnerDescription}>
                One featured community submission each week.
              </Text>
            </View>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Suggest a Moment feature coming soon"
            disabled
            style={styles.disabledSuggestionButton}
          >
            <Text style={styles.disabledSuggestionButtonText}>
              Suggest a Moment
            </Text>

            <Ionicons
              name="lock-closed-outline"
              size={16}
              color={
                Colors.textSecondary
              }
            />
          </Pressable>
        </View>

        <Text style={styles.footerText}>
          Your profile is saved on this device.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// =====================================================
// Statistic Card
// =====================================================

type StatCardProps = {
  emoji: string;
  value: string | number;
  label: string;
};

function StatCard({
  emoji,
  value,
  label,
}: StatCardProps) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statEmoji}>
        {emoji}
      </Text>

      <Text style={styles.statValue}>
        {value}
      </Text>

      <Text style={styles.statLabel}>
        {label}
      </Text>
    </View>
  );
}

// =====================================================
// Verdict Row
// =====================================================

type VerdictRowProps = {
  emoji: string;
  label: string;
  count: number;
  percentage: number;
  fillColor: string;
};

function VerdictRow({
  emoji,
  label,
  count,
  percentage,
  fillColor,
}: VerdictRowProps) {
  return (
    <View>
      <View style={styles.verdictTopRow}>
        <View style={styles.verdictName}>
          <Text style={styles.verdictEmoji}>
            {emoji}
          </Text>

          <Text style={styles.verdictLabel}>
            {label}
          </Text>
        </View>

        <View style={styles.verdictNumbers}>
          <Text style={styles.verdictCount}>
            {count}
          </Text>

          <Text style={styles.verdictPercentage}>
            {percentage}%
          </Text>
        </View>
      </View>

      <View style={styles.verdictTrack}>
        <View
          style={[
            styles.verdictFill,

            {
              width: `${percentage}%`,
              backgroundColor:
                fillColor,
            },
          ]}
        />
      </View>
    </View>
  );
}

// =====================================================
// Achievement Card
// =====================================================

type AchievementCardProps = {
  achievement: Achievement;
};

function AchievementCard({
  achievement,
}: AchievementCardProps) {
  return (
    <View
      style={[
        styles.achievementCard,

        !achievement.unlocked &&
          styles.lockedAchievementCard,
      ]}
    >
      <View style={styles.achievementIconRow}>
        <Text
          style={[
            styles.achievementEmoji,

            !achievement.unlocked &&
              styles.lockedAchievementContent,
          ]}
        >
          {achievement.unlocked
            ? achievement.emoji
            : "🔒"}
        </Text>

        {achievement.unlocked && (
          <View style={styles.unlockedBadge}>
            <Text style={styles.unlockedBadgeText}>
              UNLOCKED
            </Text>
          </View>
        )}
      </View>

      <Text
        style={[
          styles.achievementTitle,

          !achievement.unlocked &&
            styles.lockedAchievementContent,
        ]}
      >
        {achievement.title}
      </Text>

      <Text
        style={[
          styles.achievementDescription,

          !achievement.unlocked &&
            styles.lockedAchievementDescription,
        ]}
      >
        {achievement.description}
      </Text>
    </View>
  );
}

// =====================================================
// Achievement Rules
// =====================================================

function getAchievements(
  progress: PlayerProgress,
): Achievement[] {
  return [
    {
      id: "first-verdict",
      emoji: "⚖️",
      title: "First Verdict",
      description:
        "Judge your first Moment.",
      unlocked:
        progress.momentsCompleted >= 1,
    },

    {
      id: "professional-roaster",
      emoji: "🔥",
      title: "Professional Roaster",
      description:
        "Choose Roast 25 times.",
      unlocked:
        progress.roastCount >= 25,
    },

    {
      id: "soft-spot",
      emoji: "♥",
      title: "Soft Spot",
      description:
        "Choose Toast 25 times.",
      unlocked:
        progress.toastCount >= 25,
    },

    {
      id: "hot-streak",
      emoji: "⚡",
      title: "Hot Streak",
      description:
        "Reach a 5-answer crowd streak.",
      unlocked:
        progress.bestStreak >= 5,
    },

    {
      id: "crowd-whisperer",
      emoji: "🎯",
      title: "Crowd Whisperer",
      description:
        "Correctly predict the crowd 5 times.",
      unlocked:
        progress.correctCrowdGuesses >= 5,
    },

    {
      id: "heat-check",
      emoji: "🌶️",
      title: "Heat Check",
      description:
        "Collect 500 total Heat.",
      unlocked:
        progress.totalHeat >= 500,
    },

    {
      id: "opinion-machine",
      emoji: "🗣️",
      title: "Opinion Machine",
      description:
        "Judge 100 Moments.",
      unlocked:
        progress.momentsCompleted >= 100,
    },

    {
      id: "certified-instigator",
      emoji: "😈",
      title: "Certified Instigator",
      description:
        "Reach Level 10.",
      unlocked:
        progress.level >= 10,
    },
  ];
}

// =====================================================
// Styles
// =====================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor:
      Colors.background,
  },

  loadingContainer: {
    flex: 1,

    backgroundColor:
      Colors.background,

    alignItems: "center",
    justifyContent: "center",
  },

  loadingEmoji: {
    fontSize: 44,
    marginBottom: 14,
  },

  loadingText: {
    color:
      Colors.textPrimary,

    fontSize: 19,
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

  introBadge: {
    alignSelf: "flex-start",

    borderColor:
      Colors.roast,

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

  introBadgeText: {
    color:
      Colors.roast,

    fontSize: 10,
    fontWeight: "900",

    letterSpacing: 1.4,
  },

  heading: {
    color:
      Colors.textPrimary,

    fontSize: 39,
    fontWeight: "900",

    letterSpacing: -1.7,
    lineHeight: 44,
  },

  subheading: {
    color:
      Colors.textSecondary,

    fontSize: 18,
    fontWeight: "700",

    marginTop: 4,
    marginBottom: 25,
  },

  identityCard: {
    backgroundColor:
      Colors.textPrimary,

    borderRadius:
      Radius.lg,

    padding: 19,
    marginBottom: 26,

    overflow: "hidden",
  },

  identityTopRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 58,
    height: 58,

    backgroundColor:
      "#3A2724",

    borderRadius: 29,

    alignItems: "center",
    justifyContent: "center",

    marginRight: 14,
  },

  avatarEmoji: {
    fontSize: 29,
  },

  identityText: {
    flex: 1,
  },

  nickname: {
    color:
      Colors.white,

    fontSize: 22,
    fontWeight: "900",
  },

  editNicknameButton: {
    alignSelf: "flex-start",

    flexDirection: "row",
    alignItems: "center",

    marginTop: 5,
  },

  editNicknameText: {
    color:
      Colors.roast,

    fontSize: 11,
    fontWeight: "800",

    marginLeft: 5,
  },

  editor: {
    width: "100%",
  },

  nicknameInput: {
    backgroundColor:
      "#353538",

    borderColor:
      "#56565B",

    borderWidth: 1,
    borderRadius:
      Radius.lg,

    color:
      Colors.white,

    fontSize: 16,
    fontWeight: "800",

    paddingVertical: 10,
    paddingHorizontal: 12,
  },

  editorActions: {
    flexDirection: "row",
    justifyContent: "flex-end",

    gap: 8,

    marginTop: 9,
  },

  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },

  cancelButtonText: {
    color: "#CFCFCF",

    fontSize: 12,
    fontWeight: "800",
  },

  saveButton: {
    backgroundColor:
      Colors.roast,

    borderRadius:
      Radius.pill,

    paddingVertical: 8,
    paddingHorizontal: 15,
  },

  saveButtonText: {
    color:
      Colors.white,

    fontSize: 12,
    fontWeight: "900",
  },

  disabledButton: {
    opacity: 0.5,
  },

  identityDivider: {
    height: 1,

    backgroundColor:
      "#424246",

    marginVertical: 17,
  },

  titleEyebrow: {
    color:
      Colors.roast,

    fontSize: 10,
    fontWeight: "900",

    letterSpacing: 1.5,

    marginBottom: 6,
  },

  playerTitle: {
    color:
      Colors.white,

    fontSize: 24,
    fontWeight: "900",
  },

  levelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    marginTop: 10,
    marginBottom: 7,
  },

  levelText: {
    color:
      Colors.white,

    fontSize: 13,
    fontWeight: "800",
  },

  levelHeat: {
    color: "#CFCFCF",

    fontSize: 10,
    fontWeight: "700",
  },

  levelTrack: {
    height: 7,

    backgroundColor:
      "#3B3B3F",

    borderRadius:
      Radius.pill,

    overflow: "hidden",
  },

  levelFill: {
    height: "100%",

    backgroundColor:
      Colors.roast,

    borderRadius:
      Radius.pill,
  },

  sectionTitle: {
    color:
      Colors.textPrimary,

    fontSize: 18,
    fontWeight: "900",

    marginBottom: 13,
  },

  // =====================================================
  // Daily Streak
  // =====================================================

  dailyStreakCard: {
    backgroundColor:
      "#FFF1EC",

    borderColor:
      "#F4C9BE",

    borderWidth: 1,
    borderRadius:
      Radius.lg,

    padding: 16,
    marginBottom: 27,

    flexDirection: "row",
    alignItems: "center",
  },

  dailyStreakIcon: {
    width: 48,
    height: 48,

    backgroundColor:
      Colors.white,

    borderRadius: 24,

    alignItems: "center",
    justifyContent: "center",

    marginRight: 12,
  },

  dailyStreakEmoji: {
    fontSize: 25,
  },

  dailyStreakText: {
    flex: 1,
  },

  dailyStreakValue: {
    color:
      Colors.textPrimary,

    fontSize: 20,
    fontWeight: "900",
  },

  dailyStreakDescription: {
    color:
      Colors.textSecondary,

    fontSize: 10,
    fontWeight: "700",
    lineHeight: 15,

    marginTop: 3,
  },

  dailyBest: {
    alignItems: "flex-end",

    marginLeft: 10,
  },

  dailyBestValue: {
    color:
      Colors.roast,

    fontSize: 21,
    fontWeight: "900",
  },

  dailyBestLabel: {
    color:
      Colors.textSecondary,

    fontSize: 8,
    fontWeight: "900",

    letterSpacing: 0.8,
  },

  // =====================================================
  // Stats
  // =====================================================

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",

    gap: 12,

    marginBottom: 27,
  },

  statCard: {
    width: "48%",

    backgroundColor:
      Colors.surface,

    borderColor:
      Colors.border,

    borderWidth: 1,
    borderRadius:
      Radius.lg,

    padding: 16,
  },

  statEmoji: {
    fontSize: 21,
    marginBottom: 7,
  },

  statValue: {
    color:
      Colors.textPrimary,

    fontSize: 25,
    fontWeight: "900",
  },

  statLabel: {
    color:
      Colors.textSecondary,

    fontSize: 11,
    fontWeight: "700",

    marginTop: 3,
  },

  verdictCard: {
    backgroundColor:
      Colors.surface,

    borderColor:
      Colors.border,

    borderWidth: 1,
    borderRadius:
      Radius.lg,

    padding: 17,
    marginBottom: 27,
  },

  verdictTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    marginBottom: 9,
  },

  verdictName: {
    flexDirection: "row",
    alignItems: "center",
  },

  verdictEmoji: {
    fontSize: 17,
    marginRight: 7,
  },

  verdictLabel: {
    color:
      Colors.textPrimary,

    fontSize: 15,
    fontWeight: "900",
  },

  verdictNumbers: {
    flexDirection: "row",
    alignItems: "baseline",
  },

  verdictCount: {
    color:
      Colors.textSecondary,

    fontSize: 11,
    fontWeight: "700",

    marginRight: 8,
  },

  verdictPercentage: {
    color:
      Colors.textPrimary,

    fontSize: 15,
    fontWeight: "900",
  },

  verdictTrack: {
    height: 8,

    backgroundColor:
      Colors.surfaceAlt,

    borderRadius:
      Radius.pill,

    overflow: "hidden",
  },

  verdictFill: {
    height: "100%",

    borderRadius:
      Radius.pill,
  },

  verdictDivider: {
    height: 1,

    backgroundColor:
      Colors.border,

    marginVertical: 17,
  },

  crowdCard: {
    backgroundColor:
      "#FFF1EC",

    borderColor:
      "#F4C9BE",

    borderWidth: 1,
    borderRadius:
      Radius.lg,

    padding: 16,
    marginBottom: 27,

    flexDirection: "row",
    alignItems: "center",
  },

  crowdIconContainer: {
    width: 45,
    height: 45,

    backgroundColor:
      Colors.white,

    borderRadius: 23,

    alignItems: "center",
    justifyContent: "center",

    marginRight: 12,
  },

  crowdIcon: {
    fontSize: 22,
  },

  crowdTextContainer: {
    flex: 1,
  },

  crowdValue: {
    color:
      Colors.textPrimary,

    fontSize: 17,
    fontWeight: "900",
  },

  crowdLabel: {
    color:
      Colors.textSecondary,

    fontSize: 10,
    fontWeight: "700",

    marginTop: 2,
  },

  crowdAccuracy: {
    alignItems: "flex-end",
  },

  crowdAccuracyValue: {
    color:
      Colors.roast,

    fontSize: 20,
    fontWeight: "900",
  },

  crowdAccuracyLabel: {
    color:
      Colors.textSecondary,

    fontSize: 8,
    fontWeight: "900",

    letterSpacing: 0.8,
  },

  // =====================================================
  // Achievements
  // =====================================================

  achievementHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  achievementCount: {
    color:
      Colors.roast,

    fontSize: 12,
    fontWeight: "900",

    marginBottom: 13,
  },

  achievementsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",

    gap: 12,
  },

  achievementCard: {
    width: "48%",
    minHeight: 153,

    backgroundColor:
      Colors.surface,

    borderColor:
      Colors.roast,

    borderWidth: 1.25,
    borderRadius:
      Radius.lg,

    padding: 15,
  },

  lockedAchievementCard: {
    borderColor:
      Colors.border,

    backgroundColor:
      Colors.surfaceAlt,
  },

  achievementIconRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    marginBottom: 12,
  },

  achievementEmoji: {
    fontSize: 24,
  },

  unlockedBadge: {
    backgroundColor:
      "#FFF1EC",

    borderRadius:
      Radius.pill,

    paddingVertical: 4,
    paddingHorizontal: 7,
  },

  unlockedBadgeText: {
    color:
      Colors.roast,

    fontSize: 7,
    fontWeight: "900",

    letterSpacing: 0.6,
  },

  achievementTitle: {
    color:
      Colors.textPrimary,

    fontSize: 14,
    fontWeight: "900",

    lineHeight: 18,

    marginBottom: 5,
  },

  achievementDescription: {
    color:
      Colors.textSecondary,

    fontSize: 10,
    fontWeight: "600",

    lineHeight: 15,
  },

  lockedAchievementContent: {
    opacity: 0.45,
  },

  lockedAchievementDescription: {
    opacity: 0.55,
  },

  // =====================================================
  // Community Preview
  // =====================================================

  communitySectionTitle: {
    color:
      Colors.textPrimary,

    fontSize: 18,
    fontWeight: "900",

    marginTop: 28,
    marginBottom: 13,
  },

  suggestionCard: {
    backgroundColor:
      Colors.textPrimary,

    borderRadius:
      Radius.lg,

    padding: 19,

    overflow: "hidden",
  },

  suggestionTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    marginBottom: 15,
  },

  suggestionIcon: {
    width: 45,
    height: 45,

    backgroundColor:
      "#3A2724",

    borderRadius: 23,

    alignItems: "center",
    justifyContent: "center",
  },

  comingSoonBadge: {
    borderColor:
      Colors.toast,

    borderWidth: 1,
    borderRadius:
      Radius.pill,

    paddingVertical: 5,
    paddingHorizontal: 9,
  },

  comingSoonText: {
    color:
      Colors.toast,

    fontSize: 8,
    fontWeight: "900",

    letterSpacing: 1,
  },

  suggestionTitle: {
    color:
      Colors.white,

    fontSize: 23,
    fontWeight: "900",

    marginBottom: 7,
  },

  suggestionDescription: {
    color: "#CFCFCF",

    fontSize: 11,
    fontWeight: "600",
    lineHeight: 18,

    marginBottom: 16,
  },

  weeklyWinnerPreview: {
    backgroundColor:
      "#303034",

    borderRadius:
      Radius.lg,

    padding: 13,

    flexDirection: "row",
    alignItems: "center",

    marginBottom: 14,
  },

  weeklyWinnerEmoji: {
    fontSize: 22,
    marginRight: 10,
  },

  weeklyWinnerText: {
    flex: 1,
  },

  weeklyWinnerTitle: {
    color:
      Colors.white,

    fontSize: 12,
    fontWeight: "900",
  },

  weeklyWinnerDescription: {
    color: "#AFAFB4",

    fontSize: 9,
    fontWeight: "600",

    marginTop: 3,
  },

  disabledSuggestionButton: {
    backgroundColor:
      "#3A3A3E",

    borderRadius:
      Radius.pill,

    paddingVertical: 13,
    paddingHorizontal: 17,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    opacity: 0.75,
  },

  disabledSuggestionButtonText: {
    color: "#AFAFB4",

    fontSize: 13,
    fontWeight: "900",
  },

  footerText: {
    color:
      Colors.textSecondary,

    fontSize: 11,
    fontWeight: "600",

    textAlign: "center",

    marginTop: 24,
  },

  buttonPressed: {
    opacity: 0.68,

    transform: [
      {
        scale: 0.96,
      },
    ],
  },

  smallButtonPressed: {
    opacity: 0.68,
  },

  roastBackdrop: {
    position: "absolute",

    top: 160,
    right: -54,

    color:
      Colors.roast,

    fontSize: 94,
    fontWeight: "900",

    opacity: 0.055,

    transform: [
      {
        rotate: "8deg",
      },
    ],
  },

  toastBackdrop: {
    position: "absolute",

    bottom: 45,
    left: -47,

    color:
      Colors.toast,

    fontSize: 91,
    fontWeight: "900",

    opacity: 0.055,

    transform: [
      {
        rotate: "-8deg",
      },
    ],
  },
});