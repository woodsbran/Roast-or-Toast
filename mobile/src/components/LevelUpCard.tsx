// =====================================================
// File: LevelUpCard.tsx
//
// Purpose:
// Celebrates a level increase.
//
// A new title is only announced when the player's title
// actually changes. Normal level increases still receive
// a smaller celebration.
//
// Project: Roast or Toast
// =====================================================

import { StyleSheet, Text, View } from "react-native";

import { getPlayerTitle } from "../game/titles";
import { Colors, Radius } from "../theme";

// Information required by the level-up card.
type LevelUpCardProps = {
  level: number;
};

export default function LevelUpCard({
  level,
}: LevelUpCardProps) {
  const currentTitle = getPlayerTitle(level);

  // Compare the current title with the previous level.
  //
  // When they differ, the player unlocked a new title.
  const previousTitle =
    level > 1 ? getPlayerTitle(level - 1) : currentTitle;

  const unlockedNewTitle = currentTitle !== previousTitle;

  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>
        {unlockedNewTitle
          ? "NEW TITLE UNLOCKED"
          : "YOU HEATED UP"}
      </Text>

      <Text style={styles.level}>Level {level}</Text>

      {unlockedNewTitle ? (
        <Text style={styles.title}>{currentTitle}</Text>
      ) : (
        <Text style={styles.message}>
          Keep bringing the Heat.
        </Text>
      )}
    </View>
  );
}

// =====================================================
// Styles
// =====================================================

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.textPrimary,
    borderRadius: Radius.lg,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 16,
  },

  eyebrow: {
    color: Colors.roast,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.5,
    marginBottom: 5,
  },

  level: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: "700",
  },

  title: {
    color: Colors.white,
    fontSize: 21,
    fontWeight: "900",
    marginTop: 2,
  },

  message: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "800",
    marginTop: 3,
  },
});