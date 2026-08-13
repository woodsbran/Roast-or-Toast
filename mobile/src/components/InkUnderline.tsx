// =====================================================
// File: InkUnderline.tsx
//
// Purpose:
// Shared imperfect underline / scratch.
//
// I want little marks like this to replace some of the
// perfectly straight digital dividers in the app.
//
// Project: Roast or Toast
// =====================================================

import {
  StyleSheet,
  View,
} from "react-native";

import {
  Colors,
} from "../theme";

type InkUnderlineProps = {
  color?: string;
  width?: number;
  height?: number;
  align?: "left" | "center" | "right";
  rotate?: number;
};

export default function InkUnderline({
  color = Colors.roast,
  width = 72,
  height = 4,
  align = "left",
  rotate = -4,
}: InkUnderlineProps) {
  return (
    <View
      style={[
        styles.line,
        {
          width,
          height,

          backgroundColor:
            color,

          alignSelf:
            align === "center"
              ? "center"
              : align === "right"
                ? "flex-end"
                : "flex-start",

          transform: [
            {
              rotate:
                `${rotate}deg`,
            },
          ],
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  line: {
    marginTop: 8,
  },
});
