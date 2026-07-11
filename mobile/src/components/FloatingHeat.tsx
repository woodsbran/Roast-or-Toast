// =====================================================
// File: FloatingHeat.tsx
//
// Purpose:
// Shows the Heat earned after the player completes a
// regular Roast or Toast Moment.
//
// The message stays playful without implying that a
// minority opinion was wrong.
//
// Project: Roast or Toast
// =====================================================

import { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Colors, Radius } from "../theme";

// Information required by the Heat reward message.
type FloatingHeatProps = {
  heatEarned: number;
  matchedMajority: boolean;
};

export default function FloatingHeat({
  heatEarned,
  matchedMajority,
}: FloatingHeatProps) {
  // Controls the reward fade and upward movement.
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    // Restart the animation whenever a new reward appears.
    opacity.setValue(0);
    translateY.setValue(10);

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 240,
        useNativeDriver: true,
      }),

      Animated.spring(translateY, {
        toValue: 0,
        speed: 20,
        bounciness: 5,
        useNativeDriver: true,
      }),
    ]).start();
  }, [heatEarned, matchedMajority, opacity, translateY]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      {/* Heat earned from this Moment */}
      <Text style={styles.rewardText}>
        🔥 +{heatEarned} Heat
      </Text>

      <View style={styles.divider} />

      {/* Neutral feedback about the community result */}
      <Text style={styles.matchText}>
        {matchedMajority
          ? "You were with the crowd."
          : "You had your own take."}
      </Text>
    </Animated.View>
  );
}

// =====================================================
// Styles
// =====================================================

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF1EC",
    borderColor: "#F4C9BE",
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingVertical: 11,
    paddingHorizontal: 14,

    flexDirection: "row",
    alignItems: "center",

    marginBottom: 16,
  },

  rewardText: {
    color: Colors.roast,
    fontSize: 14,
    fontWeight: "900",
  },

  divider: {
    width: 1,
    height: 18,
    backgroundColor: "#E7BEB4",
    marginHorizontal: 11,
  },

  matchText: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontWeight: "700",
    flexShrink: 1,
  },
});