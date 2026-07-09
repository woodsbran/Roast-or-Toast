// =====================================================
// File: index.tsx
//
// Screen: Home
//
// Purpose:
// This is the first screen players see when they open
// Roast or Toast. It introduces the brand and gives
// players a simple way to start the game.
//
// Project: Roast or Toast
// =====================================================

import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* App title / brand */}
      <Text style={styles.logo}>🔥 Roast or Toast</Text>

      {/* Short product tagline */}
      <Text style={styles.tagline}>
        The funniest place on the internet to settle everyday debates.
      </Text>

      {/* Start button sends the player to the first scenario */}
      <Pressable style={styles.button} onPress={() => router.push("/scenario")}>
        <Text style={styles.buttonText}>Start</Text>
      </Pressable>
    </View>
  );
}

// Styles for the Home screen.
// Keeping them in this file for now makes the first screen easy to understand.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  logo: {
    fontSize: 36,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 16,
  },

  tagline: {
    fontSize: 18,
    color: "#CFCFCF",
    textAlign: "center",
    lineHeight: 26,
    marginBottom: 32,
  },

  button: {
    backgroundColor: "#FF5A36",
    paddingVertical: 16,
    paddingHorizontal: 44,
    borderRadius: 999,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
});