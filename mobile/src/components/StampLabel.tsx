// =====================================================
// File: StampLabel.tsx
//
// Purpose:
// Shared stamped label.
//
// I use this instead of a generic pill.
// Categories, TOP TAKE, SESSION CHECK-IN, GUESS THE CROWD,
// QUICK RESET, etc. should all feel printed into the game.
//
// Project: Roast or Toast
// =====================================================

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  Colors,
} from "../theme";

import {
  Typography,
} from "../theme/typography";

type StampLabelProps = {
  text: string;
  color?: string;
  filled?: boolean;
  rotate?: number;
  size?: "small" | "medium";
};

export default function StampLabel({
  text,
  color = Colors.textPrimary,
  filled = false,
  rotate = -2,
  size = "small",
}: StampLabelProps) {
  return (
    <View
      style={[
        styles.stamp,

        size === "medium" &&
          styles.mediumStamp,

        {
          borderColor:
            color,

          backgroundColor:
            filled
              ? color
              : "transparent",

          transform: [
            {
              rotate:
                `${rotate}deg`,
            },
          ],
        },
      ]}
    >
      <Text
        style={[
          size === "medium"
            ? styles.mediumText
            : styles.text,

          {
            color:
              filled
                ? Colors.white
                : color,
          },
        ]}
      >
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  stamp: {
    alignSelf: "flex-start",

    borderWidth: 1.8,

    paddingVertical: 5,
    paddingHorizontal: 11,
  },

  mediumStamp: {
    paddingVertical: 7,
    paddingHorizontal: 14,
  },

  text: {
    ...Typography.stamp,
  },

  mediumText: {
    ...Typography.stampLarge,
  },
});
