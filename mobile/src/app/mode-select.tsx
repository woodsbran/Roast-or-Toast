// =====================================================
// File: mode-select.tsx
//
// Screen: Mode Select
//
// Version 1.1 — Full Visual Cohesion Pass
//
// I am making this feel like choosing printed game tickets,
// not choosing a subscription plan.
//
// Same round behavior underneath.
// New composition only.
//
// Project: Roast or Toast
// =====================================================

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  router,
} from "expo-router";

import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  clearGameSession,
} from "../game/sessionStorage";

import {
  Colors,
  Spacing,
} from "../theme";

import InkUnderline from "../components/InkUnderline";
import StampLabel from "../components/StampLabel";

type RoundChoice = {
  id:
    | "quick"
    | "standard"
    | "endless";
  stamp: string;
  title: string;
  count: string;
  description: string;
  accent: string;
  rotation: number;
};

const choices:
  RoundChoice[] = [
    {
      id: "quick",
      stamp: "QUICK 10",
      title: "SHORT & MESSY",
      count: "10",
      description:
        "A fast round with breaks built in.",
      accent:
        Colors.roast,
      rotation: -1.2,
    },

    {
      id: "standard",
      stamp: "STANDARD 20",
      title: "THE FULL ROUND",
      count: "20",
      description:
        "More Moments. More chances to expose yourself.",
      accent:
        Colors.toast,
      rotation: 0.8,
    },

    {
      id: "endless",
      stamp: "ENDLESS",
      title: "NO EXIT PLAN",
      count: "∞",
      description:
        "Keep judging until somebody takes the phone away.",
      accent:
        Colors.heat,
      rotation: -0.6,
    },
  ];

export default function ModeSelectScreen() {
  const handleBack =
    () => {
      router.back();
    };

  const handleSelect =
    async (
      roundMode:
        RoundChoice["id"],
    ) => {
      await clearGameSession();

      router.push({
        pathname: "/scenario",
        params: {
          mode: "fresh",
          roundMode,
        },
      });
    };

  return (
    <View style={styles.container}>
      <View style={styles.posterHeader}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={handleBack}
          style={({ pressed }) => [
            styles.backButton,
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

        <StampLabel
          text="PICK YOUR DAMAGE"
          color={Colors.toast}
          rotate={-2}
        />

        <Text style={styles.heading}>
          HOW LONG
          {"\n"}
          ARE WE DOING THIS?
        </Text>

        <InkUnderline
          color={Colors.roast}
          width={82}
          rotate={-5}
          align="center"
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
        {choices.map(
          (choice) => (
            <Pressable
              key={choice.id}
              accessibilityRole="button"
              accessibilityLabel={`Start ${choice.stamp}`}
              onPress={() => {
                void handleSelect(
                  choice.id,
                );
              }}
              style={({ pressed }) => [
                styles.ticket,
                {
                  borderLeftColor:
                    choice.accent,

                  transform: [
                    {
                      rotate:
                        `${choice.rotation}deg`,
                    },
                  ],
                },
                pressed &&
                  styles.pressed,
              ]}
            >
              <View style={styles.ticketTop}>
                <StampLabel
                  text={
                    choice.stamp
                  }
                  color={
                    choice.accent
                  }
                  rotate={-2}
                />

                <Text style={styles.ticketCount}>
                  {choice.count}
                </Text>
              </View>

              <Text style={styles.ticketTitle}>
                {choice.title}
              </Text>

              <Text style={styles.ticketDescription}>
                {choice.description}
              </Text>

              <View style={styles.ticketBottom}>
                <Text style={styles.ticketAction}>
                  START ROUND
                </Text>

                <Text
                  style={[
                    styles.ticketArrow,
                    {
                      color:
                        choice.accent,
                    },
                  ]}
                >
                  →
                </Text>
              </View>
            </Pressable>
          ),
        )}

        <Text style={styles.footer}>
          Different length. Same questionable judgment.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,

      backgroundColor:
        Colors.background,
    },

    posterHeader: {
      backgroundColor:
        "#1D1D1F",

      paddingTop: 58,
      paddingBottom: 27,
      paddingHorizontal:
        Spacing.lg,

      alignItems:
        "flex-start",
    },

    backButton: {
      width: 40,
      height: 40,

      borderColor:
        "#55555A",
      borderWidth: 1,

      alignItems: "center",
      justifyContent: "center",

      marginBottom: 19,
    },

    heading: {
      color:
        Colors.white,

      fontSize: 36,
      lineHeight: 36,
      fontWeight: "900",

      letterSpacing: -1.8,

      marginTop: 13,
    },

    scrollContent: {
      paddingTop: 24,
      paddingBottom: 45,
      paddingHorizontal:
        Spacing.lg,

      gap: 18,
    },

    ticket: {
      minHeight: 175,

      backgroundColor:
        Colors.background,

      borderTopColor:
        Colors.textPrimary,
      borderRightColor:
        Colors.textPrimary,
      borderBottomColor:
        Colors.textPrimary,
      borderLeftWidth: 8,
      borderTopWidth: 1.4,
      borderRightWidth: 1.4,
      borderBottomWidth: 1.4,

      paddingVertical: 18,
      paddingHorizontal: 18,
    },

    ticketTop: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
    },

    ticketCount: {
      color:
        Colors.textPrimary,

      fontSize: 34,
      fontWeight: "900",
      letterSpacing: -1.4,
    },

    ticketTitle: {
      color:
        Colors.textPrimary,

      fontSize: 25,
      fontWeight: "900",
      letterSpacing: -0.9,

      marginTop: 12,
    },

    ticketDescription: {
      color:
        Colors.textSecondary,

      fontSize: 11,
      fontWeight: "700",
      lineHeight: 16,

      marginTop: 5,

      maxWidth: 270,
    },

    ticketBottom: {
      borderTopColor:
        Colors.textPrimary,
      borderTopWidth: 1,

      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",

      marginTop: 16,
      paddingTop: 11,
    },

    ticketAction: {
      color:
        Colors.textMuted,

      fontSize: 8,
      fontWeight: "900",
      letterSpacing: 1.2,
    },

    ticketArrow: {
      fontSize: 25,
      fontWeight: "700",
    },

    footer: {
      color:
        Colors.textMuted,

      fontSize: 10,
      fontWeight: "700",

      textAlign: "center",

      marginTop: 5,
    },

    pressed: {
      opacity: 0.72,
    },
  });
