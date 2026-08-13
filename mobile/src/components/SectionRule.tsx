// =====================================================
// File: SectionRule.tsx
//
// Purpose:
// Editorial section divider.
//
// I use this when I need structure without putting another
// card around the content.
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

type SectionRuleProps = {
  color?: string;
  marginVertical?: number;
  rotate?: number;
};

export default function SectionRule({
  color = Colors.textPrimary,
  marginVertical = 14,
  rotate = -0.6,
}: SectionRuleProps) {
  return (
    <View
      style={[
        styles.rule,
        {
          backgroundColor:
            color,

          marginVertical,

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
  rule: {
    height: 1.4,

    opacity: 0.65,

    alignSelf: "stretch",
  },
});
