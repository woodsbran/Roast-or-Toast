// =====================================================
// File: profile.tsx
//
// Screen: Profile
//
// Version 1.1 — Big Design Batch 2
//
// I am keeping all of the actual profile information, but
// I am rebuilding the presentation so it belongs to the
// same physical/editorial game as the Moment screen.
//
// What stays:
// • editable nickname
// • current title and level
// • Heat progress
// • daily streak
// • lifetime stats
// • Roast / Toast split
// • crowd accuracy
// • achievements
//
// What changes:
// • no white stat-card grid
// • fewer rounded cards
// • paper, strips, stamps, rules, and editorial sections
//
// Project: Roast or Toast
// =====================================================

import {
  Ionicons,
} from "@expo/vector-icons";

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
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import EditorialHeading from "../components/EditorialHeading";
import HeatMark from "../components/HeatMark";
import StampLabel from "../components/StampLabel";
import VoteMark from "../components/VoteMark";

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
  Spacing,
} from "../theme";

type AchievementIcon =
  | "verdict"
  | "roast"
  | "toast"
  | "streak"
  | "crowd"
  | "heat"
  | "opinions"
  | "level";

type Achievement = {
  id: string;
  icon: AchievementIcon;
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

  const totalVotes =
    progress.roastCount +
    progress.toastCount;

  const roastPercentage =
    totalVotes > 0
      ? Math.round(
          (
            progress.roastCount /
            totalVotes
          ) * 100,
        )
      : 0;

  const toastPercentage =
    totalVotes > 0
      ? Math.round(
          (
            progress.toastCount /
            totalVotes
          ) * 100,
        )
      : 0;

  const crowdMatchPercentage =
    progress.momentsCompleted > 0
      ? Math.round(
          (
            progress.majorityMatches /
            progress.momentsCompleted
          ) * 100,
        )
      : 0;

  const crowdGuessAccuracy =
    progress.crowdGuesses > 0
      ? Math.round(
          (
            progress.correctCrowdGuesses /
            progress.crowdGuesses
          ) * 100,
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

  const handleBackPress =
    () => {
      router.back();
    };

  const handleHomePress =
    () => {
      router.replace("/");
    };

  const handleEditNickname =
    () => {
      setNicknameDraft(
        nickname,
      );

      setIsEditingNickname(
        true,
      );
    };

  const handleCancelNickname =
    () => {
      setNicknameDraft(
        nickname,
      );

      setIsEditingNickname(
        false,
      );
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

      setIsSavingNickname(
        true,
      );

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

      setIsEditingNickname(
        false,
      );

      setIsSavingNickname(
        false,
      );
    };

  if (
    !hasLoadedProgress ||
    !hasLoadedDailyStreak
  ) {
    return (
      <View style={styles.loading}>
        <HeatMark size="large" />

        <Text style={styles.loadingText}>
          Loading your receipts...
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
      <View style={styles.header}>
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
            color={
              Colors.textPrimary
            }
          />
        </Pressable>

        <Text style={styles.headerTitle}>
          MY PROFILE
        </Text>

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
            color={
              Colors.textPrimary
            }
          />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={
          styles.scrollContent
        }
      >
        <StampLabel
          text="YOUR OPINION HISTORY"
          color={Colors.roast}
          rotate={-2}
          size="medium"
        />

        <View style={styles.profileHeading}>
          <EditorialHeading
            title={"THE RECEIPTS\nARE IN."}
            underlineColor={Colors.roast}
          />
        </View>

        <Text style={styles.subheading}>
          Apparently, you have opinions.
        </Text>

        {/* =================================================
            Identity Paper

            This replaces the giant rounded black profile card.
            I keep all the same data but put it on one piece
            of physical-looking paper.
        ================================================= */}

        <ImageBackground
          source={require("../../assets/game/paper/paper-plain.png")}
          resizeMode="stretch"
          style={styles.identityPaper}
        >
          {!isEditingNickname ? (
            <>
              <Text style={styles.nickname}>
                {nickname}
              </Text>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Edit nickname"
                onPress={
                  handleEditNickname
                }
                style={styles.editNickname}
              >
                <Ionicons
                  name="pencil"
                  size={11}
                  color={
                    Colors.roast
                  }
                />

                <Text style={styles.editNicknameText}>
                  EDIT NICKNAME
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
                placeholderTextColor={
                  Colors.textMuted
                }
                onSubmitEditing={() => {
                  void handleSaveNickname();
                }}
                style={styles.nicknameInput}
              />

              <View style={styles.editorActions}>
                <Pressable
                  onPress={
                    handleCancelNickname
                  }
                  style={styles.editorAction}
                >
                  <Text style={styles.editorActionText}>
                    CANCEL
                  </Text>
                </Pressable>

                <Pressable
                  disabled={
                    isSavingNickname
                  }
                  onPress={() => {
                    void handleSaveNickname();
                  }}
                  style={[
                    styles.editorAction,
                    styles.editorSave,
                  ]}
                >
                  <Text style={styles.editorSaveText}>
                    {isSavingNickname
                      ? "SAVING..."
                      : "SAVE"}
                  </Text>
                </Pressable>
              </View>
            </View>
          )}

          <View style={styles.identityRule} />

          <Text style={styles.energyLabel}>
            CURRENT ENERGY
          </Text>

          <Text style={styles.playerTitle}>
            {playerTitle}
          </Text>

          <View style={styles.levelRow}>
            <Text style={styles.levelText}>
              LEVEL {progress.level}
            </Text>

            <Text style={styles.levelHeat}>
              {progress.currentLevelHeat}
              {" / "}
              {progress.heatForNextLevel}
              {" HEAT"}
            </Text>
          </View>

          <View style={styles.levelTrack}>
            <View
              style={[
                styles.levelFill,
                {
                  width:
                    `${levelProgressPercentage * 100}%`,
                },
              ]}
            />
          </View>
        </ImageBackground>

        {/* Daily streak becomes a strip instead of a card. */}
        <SectionStamp
          text="DAILY STREAK"
          accent={
            Colors.heatDark
          }
        />

        <View style={styles.streakStrip}>
          <HeatMark
            size="small"
          />

          <View style={styles.streakCopy}>
            <Text style={styles.streakDay}>
              DAY {dailyStreak.currentStreak}
            </Text>

            <Text style={styles.streakDescription}>
              Come back tomorrow to keep the Heat going.
            </Text>
          </View>

          <View style={styles.bestWrap}>
            <Text style={styles.bestValue}>
              {dailyStreak.bestStreak}
            </Text>

            <Text style={styles.bestLabel}>
              BEST
            </Text>
          </View>
        </View>

        <SectionStamp
          text="LIFETIME RECEIPTS"
          accent={
            Colors.roast
          }
        />

        <View style={styles.receipts}>
          <Receipt
            label="TOTAL HEAT"
            value={
              progress.totalHeat
            }
            accent={
              Colors.heatDark
            }
          />

          <Receipt
            label="MOMENTS JUDGED"
            value={
              progress.momentsCompleted
            }
            accent={
              Colors.textPrimary
            }
          />

          <Receipt
            label="WITH THE CROWD"
            value={`${crowdMatchPercentage}%`}
            accent={
              Colors.toastDark
            }
          />

          <Receipt
            label="BEST STREAK"
            value={
              progress.bestStreak
            }
            accent={
              Colors.roast
            }
          />
        </View>

        <SectionStamp
          text="YOUR VERDICTS"
          accent={
            Colors.toast
          }
        />

        <View style={styles.verdictBattle}>
          <View style={styles.roastVerdict}>
            <VoteMark
              type="roast"
              size="medium"
            />

            <Text style={styles.verdictPercent}>
              {roastPercentage}%
            </Text>

            <Text style={styles.verdictLabel}>
              ROAST
            </Text>
          </View>

          <View style={styles.toastVerdict}>
            <VoteMark
              type="toast"
              size="medium"
            />

            <Text style={styles.verdictPercent}>
              {toastPercentage}%
            </Text>

            <Text style={styles.verdictLabel}>
              TOAST
            </Text>
          </View>
        </View>

        <View style={styles.crowdEditorial}>
          <Text style={styles.crowdEditorialLabel}>
            CROWD READING
          </Text>

          <Text style={styles.crowdEditorialValue}>
            {crowdGuessAccuracy}%
          </Text>

          <Text style={styles.crowdEditorialCopy}>
            Guess the Crowd accuracy across {progress.crowdGuesses} predictions.
          </Text>
        </View>

        <SectionStamp
          text={`ACHIEVEMENTS ${unlockedAchievements}/${achievements.length}`}
          accent={
            Colors.textPrimary
          }
        />

        <View style={styles.achievementList}>
          {achievements.map(
            (achievement) => (
              <AchievementRow
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function SectionStamp({
  text,
  accent,
}: {
  text: string;
  accent: string;
}) {
  return (
    <View style={styles.sectionStampWrap}>
      <StampLabel
        text={text}
        color={accent}
        rotate={-1.5}
      />
    </View>
  );
}

function Receipt({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent: string;
}) {
  return (
    <View style={styles.receipt}>
      <View
        style={[
          styles.receiptMark,
          {
            backgroundColor:
              accent,
          },
        ]}
      />

      <Text style={styles.receiptValue}>
        {value}
      </Text>

      <Text style={styles.receiptLabel}>
        {label}
      </Text>
    </View>
  );
}

function AchievementRow({
  achievement,
}: {
  achievement:
    Achievement;
}) {
  return (
    <View
      style={[
        styles.achievementRow,
        !achievement.unlocked &&
          styles.achievementLocked,
      ]}
    >
      <View style={styles.achievementIcon}>
        <AchievementIcon
          type={
            achievement.icon
          }
        />
      </View>

      <View style={styles.achievementCopy}>
        <Text style={styles.achievementTitle}>
          {achievement.title}
        </Text>

        <Text style={styles.achievementDescription}>
          {achievement.description}
        </Text>
      </View>

      <Text style={styles.achievementStatus}>
        {achievement.unlocked
          ? "UNLOCKED"
          : "LOCKED"}
      </Text>
    </View>
  );
}

function AchievementIcon({
  type,
}: {
  type:
    AchievementIcon;
}) {
  if (type === "roast") {
    return (
      <VoteMark
        type="roast"
        size="small"
      />
    );
  }

  if (type === "toast") {
    return (
      <VoteMark
        type="toast"
        size="small"
      />
    );
  }

  if (type === "heat") {
    return (
      <HeatMark
        size="small"
      />
    );
  }

  const iconName =
    type === "verdict"
      ? "checkmark-circle-outline"
      : type === "streak"
        ? "trending-up-outline"
        : type === "crowd"
          ? "people-outline"
          : type === "opinions"
            ? "chatbubble-ellipses-outline"
            : "ribbon-outline";

  return (
    <Ionicons
      name={iconName}
      size={20}
      color={
        Colors.textPrimary
      }
    />
  );
}

function getAchievements(
  progress:
    PlayerProgress,
): Achievement[] {
  return [
    {
      id: "first-verdict",
      icon: "verdict",
      title: "First Verdict",
      description:
        "Judge your first Moment.",
      unlocked:
        progress.momentsCompleted >= 1,
    },
    {
      id: "professional-roaster",
      icon: "roast",
      title: "Professional Roaster",
      description:
        "Choose Roast 25 times.",
      unlocked:
        progress.roastCount >= 25,
    },
    {
      id: "soft-spot",
      icon: "toast",
      title: "Soft Spot",
      description:
        "Choose Toast 25 times.",
      unlocked:
        progress.toastCount >= 25,
    },
    {
      id: "hot-streak",
      icon: "streak",
      title: "Hot Streak",
      description:
        "Reach a 5-answer crowd streak.",
      unlocked:
        progress.bestStreak >= 5,
    },
    {
      id: "crowd-whisperer",
      icon: "crowd",
      title: "Crowd Whisperer",
      description:
        "Correctly predict the crowd 5 times.",
      unlocked:
        progress.correctCrowdGuesses >= 5,
    },
    {
      id: "heat-check",
      icon: "heat",
      title: "Heat Check",
      description:
        "Collect 500 total Heat.",
      unlocked:
        progress.totalHeat >= 500,
    },
    {
      id: "opinion-machine",
      icon: "opinions",
      title: "Opinion Machine",
      description:
        "Judge 100 Moments.",
      unlocked:
        progress.momentsCompleted >= 100,
    },
    {
      id: "certified-instigator",
      icon: "level",
      title: "Certified Instigator",
      description:
        "Reach Level 10.",
      unlocked:
        progress.level >= 10,
    },
  ];
}

const styles = StyleSheet.create({
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
  },

  loadingText: {
    color:
      Colors.textPrimary,

    fontSize: 17,
    fontWeight: "900",

    marginTop: 12,
  },

  header: {
    paddingTop: 58,
    paddingBottom: 12,
    paddingHorizontal:
      Spacing.lg,

    flexDirection: "row",
    alignItems: "center",
    justifyContent:
      "space-between",

    borderBottomColor:
      Colors.borderStrong,
    borderBottomWidth: 1,
  },

  headerButton: {
    width: 42,
    height: 42,

    borderColor:
      Colors.textPrimary,
    borderWidth: 1.2,

    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    color:
      Colors.textPrimary,

    fontSize: 9,
    fontWeight: "900",

    letterSpacing: 1.5,
  },

  scrollContent: {
    paddingHorizontal:
      Spacing.lg,

    paddingTop: 20,
    paddingBottom: 55,
  },

  profileHeading: {
    marginTop: 16,
    marginBottom: 8,
  },

  sectionStampWrap: {
    marginTop: 17,
    marginBottom: 10,
  },

  introStamp: {
    alignSelf: "flex-start",

    borderColor:
      Colors.roast,
    borderWidth: 2,

    paddingVertical: 6,
    paddingHorizontal: 13,

    transform: [
      {
        rotate: "-2deg",
      },
    ],

    marginBottom: 14,
  },

  introStampText: {
    color:
      Colors.roast,

    fontSize: 8,
    fontWeight: "900",

    letterSpacing: 1.3,
  },

  heading: {
    color:
      Colors.textPrimary,

    fontSize: 39,
    fontWeight: "900",

    lineHeight: 40,
    letterSpacing: -1.7,
  },

  subheading: {
    color:
      Colors.textSecondary,

    fontSize: 14,
    fontWeight: "700",

    marginTop: 5,
    marginBottom: 8,
  },

  identityPaper: {
    minHeight: 330,

    paddingVertical: 52,
    paddingHorizontal: 40,

    justifyContent: "center",

    marginHorizontal: -5,
    marginBottom: 5,
  },

  nickname: {
    color:
      Colors.textPrimary,

    fontSize: 27,
    fontWeight: "900",

    letterSpacing: -0.8,
  },

  editNickname: {
    flexDirection: "row",
    alignItems: "center",

    gap: 5,

    marginTop: 4,
  },

  editNicknameText: {
    color:
      Colors.roast,

    fontSize: 7,
    fontWeight: "900",

    letterSpacing: 1,
  },

  editor: {
    marginBottom: 5,
  },

  nicknameInput: {
    borderColor:
      Colors.textPrimary,
    borderWidth: 1.5,

    minHeight: 44,

    paddingHorizontal: 10,

    color:
      Colors.textPrimary,

    fontSize: 16,
    fontWeight: "800",
  },

  editorActions: {
    flexDirection: "row",

    gap: 8,

    marginTop: 8,
  },

  editorAction: {
    borderColor:
      Colors.textPrimary,
    borderWidth: 1,

    paddingVertical: 7,
    paddingHorizontal: 11,
  },

  editorActionText: {
    color:
      Colors.textPrimary,

    fontSize: 8,
    fontWeight: "900",
  },

  editorSave: {
    backgroundColor:
      Colors.textPrimary,
  },

  editorSaveText: {
    color:
      Colors.white,

    fontSize: 8,
    fontWeight: "900",
  },

  identityRule: {
    height: 2,

    backgroundColor:
      Colors.textPrimary,

    opacity: 0.45,

    marginVertical: 18,
  },

  energyLabel: {
    color:
      Colors.roast,

    fontSize: 8,
    fontWeight: "900",

    letterSpacing: 1.3,

    marginBottom: 4,
  },

  playerTitle: {
    color:
      Colors.textPrimary,

    fontSize: 25,
    fontWeight: "900",
  },

  levelRow: {
    flexDirection: "row",
    justifyContent:
      "space-between",

    marginTop: 9,
  },

  levelText: {
    color:
      Colors.textMuted,

    fontSize: 8,
    fontWeight: "900",

    letterSpacing: 1,
  },

  levelHeat: {
    color:
      Colors.textMuted,

    fontSize: 8,
    fontWeight: "900",
  },

  levelTrack: {
    height: 7,

    backgroundColor:
      "rgba(29,29,31,0.13)",

    marginTop: 6,

    overflow: "hidden",
  },

  levelFill: {
    height: "100%",

    backgroundColor:
      Colors.roast,
  },

  sectionStamp: {
    alignSelf: "flex-start",

    borderWidth: 1.6,

    paddingVertical: 5,
    paddingHorizontal: 11,

    marginTop: 17,
    marginBottom: 10,

    transform: [
      {
        rotate: "-1.5deg",
      },
    ],
  },

  sectionStampText: {
    fontSize: 7.5,
    fontWeight: "900",

    letterSpacing: 1.2,
  },

  streakStrip: {
    minHeight: 76,

    flexDirection: "row",
    alignItems: "center",

    borderTopColor:
      Colors.borderStrong,
    borderBottomColor:
      Colors.borderStrong,

    borderTopWidth: 1,
    borderBottomWidth: 1,

    paddingHorizontal: 5,
  },

  streakCopy: {
    marginLeft: 9,
  },

  streakDay: {
    color:
      Colors.textPrimary,

    fontSize: 15,
    fontWeight: "900",
  },

  streakDescription: {
    color:
      Colors.textSecondary,

    fontSize: 9.5,
    fontWeight: "700",

    marginTop: 2,

    maxWidth: 220,
  },

  bestWrap: {
    marginLeft: "auto",

    alignItems: "center",
  },

  bestValue: {
    color:
      Colors.roast,

    fontSize: 20,
    fontWeight: "900",
  },

  bestLabel: {
    color:
      Colors.textMuted,

    fontSize: 7,
    fontWeight: "900",

    letterSpacing: 1,
  },

  receipts: {
    borderTopColor:
      Colors.textPrimary,
    borderBottomColor:
      Colors.textPrimary,

    borderTopWidth: 1.4,
    borderBottomWidth: 1.4,
  },

  receipt: {
    position: "relative",

    minHeight: 72,

    borderBottomColor:
      Colors.borderStrong,
    borderBottomWidth: 1,

    justifyContent: "center",

    paddingLeft: 18,
  },

  receiptMark: {
    position: "absolute",

    width: 5,

    left: 0,
    top: 12,
    bottom: 12,
  },

  receiptValue: {
    color:
      Colors.textPrimary,

    fontSize: 24,
    fontWeight: "900",
  },

  receiptLabel: {
    color:
      Colors.textMuted,

    fontSize: 7.5,
    fontWeight: "900",

    letterSpacing: 1,

    marginTop: 1,
  },

  verdictBattle: {
    flexDirection: "row",

    height: 190,

    marginBottom: 10,
  },

  roastVerdict: {
    flex: 1,

    backgroundColor:
      Colors.roast,

    alignItems: "center",
    justifyContent: "center",
  },

  toastVerdict: {
    flex: 1,

    backgroundColor:
      Colors.toast,

    alignItems: "center",
    justifyContent: "center",
  },

  verdictPercent: {
    color:
      Colors.white,

    fontSize: 36,
    fontWeight: "900",

    marginTop: 4,
  },

  verdictLabel: {
    color:
      Colors.white,

    fontSize: 8,
    fontWeight: "900",

    letterSpacing: 1.2,
  },

  crowdEditorial: {
    backgroundColor:
      Colors.toastWash,

    borderLeftColor:
      Colors.toast,
    borderLeftWidth: 6,

    paddingVertical: 15,
    paddingHorizontal: 17,

    marginBottom: 5,
  },

  crowdEditorialLabel: {
    color:
      Colors.toastDark,

    fontSize: 8,
    fontWeight: "900",

    letterSpacing: 1.1,
  },

  crowdEditorialValue: {
    color:
      Colors.toastDark,

    fontSize: 31,
    fontWeight: "900",

    marginTop: 3,
  },

  crowdEditorialCopy: {
    color:
      Colors.textPrimary,

    fontSize: 11,
    fontWeight: "700",

    lineHeight: 16,

    marginTop: 2,
  },

  achievementList: {
    borderTopColor:
      Colors.textPrimary,
    borderTopWidth: 1.4,
  },

  achievementRow: {
    minHeight: 82,

    borderBottomColor:
      Colors.borderStrong,
    borderBottomWidth: 1,

    flexDirection: "row",
    alignItems: "center",

    paddingVertical: 10,
  },

  achievementLocked: {
    opacity: 0.38,
  },

  achievementIcon: {
    width: 42,

    alignItems: "center",
  },

  achievementCopy: {
    flex: 1,
  },

  achievementTitle: {
    color:
      Colors.textPrimary,

    fontSize: 12,
    fontWeight: "900",
  },

  achievementDescription: {
    color:
      Colors.textSecondary,

    fontSize: 9.5,
    fontWeight: "700",

    marginTop: 2,
  },

  achievementStatus: {
    color:
      Colors.textMuted,

    fontSize: 6.5,
    fontWeight: "900",

    letterSpacing: 0.9,
  },

  pressed: {
    opacity: 0.7,

    transform: [
      {
        scale: 0.985,
      },
    ],
  },
});
