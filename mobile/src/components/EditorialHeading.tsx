// =====================================================
// File: EditorialHeading.tsx
//
// Purpose:
// Gives the biggest statements in the game one shared voice.
//
// I use this for:
// • HAVE SPOKEN!
// • YOU CALLED IT!
// • THE RECEIPTS ARE IN.
// • session recap headlines
// • Guess the Crowd headlines
//
// This is one of the pieces that should make the app
// recognizable even if the Roast or Toast name is hidden.
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

import InkUnderline from "./InkUnderline";

type EditorialHeadingProps = {
  eyebrow?: string;
  title: string;
  align?: "left" | "center";
  underlineColor?: string;
  compact?: boolean;
};

export default function EditorialHeading({
  eyebrow,
  title,
  align = "left",
  underlineColor = Colors.roast,
  compact = false,
}: EditorialHeadingProps) {
  const centered =
    align === "center";

  return (
    <View
      style={[
        styles.container,
        centered &&
          styles.centered,
      ]}
    >
      {eyebrow && (
        <Text
          style={[
            styles.eyebrow,
            centered &&
              styles.centerText,
          ]}
        >
          {eyebrow}
        </Text>
      )}

      <Text
        style={[
          compact
            ? styles.compactTitle
            : styles.title,
          centered &&
            styles.centerText,
        ]}
      >
        {title}
      </Text>

      <InkUnderline
        color={underlineColor}
        width={
          compact
            ? 56
            : 74
        }
        align={
          centered
            ? "center"
            : "left"
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "stretch",
  },

  centered: {
    alignItems: "center",
  },

  eyebrow: {
    color:
      Colors.textMuted,

    ...Typography.stamp,

    marginBottom: 4,
  },

  title: {
    color:
      Colors.textPrimary,

    ...Typography.displayLG,
  },

  compactTitle: {
    color:
      Colors.textPrimary,

    ...Typography.displayMD,
  },

  centerText: {
    textAlign: "center",
  },
});
