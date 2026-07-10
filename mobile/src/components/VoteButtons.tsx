// =====================================================
// File: VoteButtons.tsx
//
// Purpose:
// Displays the Roast and Toast choices for the current
// Moment.
//
// Each Moment can provide its own short phrase beneath
// the Roast and Toast labels.
//
// Project: Roast or Toast
// =====================================================

import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Colors, Radius } from "../theme";

// A vote can be Roast, Toast, or not selected yet.
export type VoteChoice = "roast" | "toast" | null;

// Information required by the voting buttons.
type VoteButtonsProps = {
  roastPhrase: string;
  toastPhrase: string;
  roastScale: Animated.Value;
  toastScale: Animated.Value;
  onRoastPress: () => void;
  onToastPress: () => void;
};

export default function VoteButtons({
  roastPhrase,
  toastPhrase,
  roastScale,
  toastScale,
  onRoastPress,
  onToastPress,
}: VoteButtonsProps) {
  return (
    <View>
      {/* Conversational prompt above the choices */}
      <Text style={styles.votePrompt}>Let&apos;s get real...</Text>

      <View style={styles.buttonContainer}>
        {/* Roast option */}
        <Animated.View
          style={{
            transform: [{ scale: roastScale }],
          }}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Vote Roast"
            onPress={onRoastPress}
            style={({ pressed }) => [
              styles.voteButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <View style={styles.voteButtonContent}>
              <Text style={styles.roastIcon}>🔥</Text>

              <View style={styles.voteTextContainer}>
                <Text style={styles.voteButtonText}>Roast</Text>

                <Text style={styles.voteButtonSubtext}>
                  {roastPhrase}
                </Text>
              </View>
            </View>
          </Pressable>
        </Animated.View>

        {/* Toast option */}
        <Animated.View
          style={{
            transform: [{ scale: toastScale }],
          }}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Vote Toast"
            onPress={onToastPress}
            style={({ pressed }) => [
              styles.voteButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <View style={styles.voteButtonContent}>
              <Text style={styles.toastIcon}>♥</Text>

              <View style={styles.voteTextContainer}>
                <Text style={styles.voteButtonText}>Toast</Text>

                <Text style={styles.voteButtonSubtext}>
                  {toastPhrase}
                </Text>
              </View>
            </View>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}

// =====================================================
// Styles
// =====================================================

const styles = StyleSheet.create({
  votePrompt: {
    color: Colors.textSecondary,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 16,
  },

  buttonContainer: {
    gap: 14,
  },

  voteButton: {
    minHeight: 86,
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1.5,
    borderRadius: Radius.lg,
    paddingVertical: 16,
    paddingHorizontal: 19,
    flexDirection: "row",
    alignItems: "center",

    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },

  buttonPressed: {
    opacity: 0.76,
  },

  voteButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },

  voteTextContainer: {
    flexShrink: 1,
  },

  roastIcon: {
    fontSize: 28,
    marginRight: 15,
  },

  toastIcon: {
    color: Colors.toast,
    fontSize: 31,
    fontWeight: "900",
    marginRight: 15,
  },

  voteButtonText: {
    color: Colors.textPrimary,
    fontSize: 20,
    fontWeight: "900",
  },

  voteButtonSubtext: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: "600",
    marginTop: 3,
  },
});