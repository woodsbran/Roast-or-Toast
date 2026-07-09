// =====================================================
// Scenario Screen
//
// Purpose:
// Displays a single Roast or Toast scenario and allows
// the player to vote.
//
// Future:
// • Connect to Supabase
// • Load real scenarios
// • Show results after voting
// =====================================================

import { Pressable, StyleSheet, Text, View } from "react-native";

// Main screen component
export default function ScenarioScreen() {
  return (
    <View style={styles.container}>

      {/* Screen Title */}
      <Text style={styles.title}>
        🔥 Roast or ❤️ Toast?
      </Text>

      {/* Scenario Card */}
      <View style={styles.card}>
        <Text style={styles.scenario}>
          Your coworker hits "Reply All" just to say "Thanks."
        </Text>
      </View>

      {/* Voting Buttons */}
      <View style={styles.buttons}>

        {/* Roast Button */}
        <Pressable
          style={[styles.voteButton, styles.roastButton]}
        >
          <Text style={styles.voteText}>🔥 Roast</Text>
        </Pressable>

        {/* Toast Button */}
        <Pressable
          style={[styles.voteButton, styles.toastButton]}
        >
          <Text style={styles.voteText}>❤️ Toast</Text>
        </Pressable>

      </View>

    </View>
  );
}