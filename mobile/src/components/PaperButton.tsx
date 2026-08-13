// =====================================================
// File: PaperButton.tsx
//
// Purpose:
// Shared main action.
//
// I am keeping main actions bold and physical.
// No rounded pill. No floating soft-shadow card.
//
// The colored bottom edge lets the button inherit Roast,
// Toast, Heat, or category energy without rebuilding it.
//
// Project: Roast or Toast
// =====================================================

import {
  Pressable,
  StyleSheet,
  Text,
} from "react-native";

import {
  Colors,
} from "../theme";

import {
  Typography,
} from "../theme/typography";

type PaperButtonProps = {
  label: string;
  onPress: () => void;
  accentColor?: string;
  backgroundColor?: string;
  accessibilityLabel?: string;
};

export default function PaperButton({
  label,
  onPress,
  accentColor = Colors.roast,
  backgroundColor = Colors.textPrimary,
  accessibilityLabel,
}: PaperButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={
        accessibilityLabel ??
        label
      }
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor,
          borderBottomColor:
            accentColor,
        },
        pressed &&
          styles.pressed,
      ]}
    >
      <Text style={styles.label}>
        {label}
      </Text>

      <Text style={styles.arrow}>
        →
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 64,

    borderBottomWidth: 5,

    flexDirection: "row",
    alignItems: "center",
    justifyContent:
      "space-between",

    paddingHorizontal: 22,

    transform: [
      {
        rotate: "-0.7deg",
      },
    ],
  },

  label: {
    color:
      Colors.white,

    ...Typography.action,
  },

  arrow: {
    color:
      Colors.white,

    fontSize: 25,
    fontWeight: "700",
  },

  pressed: {
    opacity: 0.74,

    transform: [
      {
        scale: 0.985,
      },
    ],
  },
});
