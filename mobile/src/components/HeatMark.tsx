// =====================================================
// File: HeatMark.tsx
//
// Purpose:
// Reusable Heat / progression symbol.
//
// Heat is now represented by the custom Ember Spark
// instead of the standard flame emoji.
//
// Project: Roast or Toast
// =====================================================

import {
  StyleProp,
  ViewStyle,
} from "react-native";

import BrandMark from "./BrandMark";

type HeatMarkProps = {
  size?:
    | "small"
    | "medium"
    | "large"
    | "hero";

  style?: StyleProp<ViewStyle>;
};

export default function HeatMark({
  size = "medium",
  style,
}: HeatMarkProps) {
  return (
    <BrandMark
      type="heat"
      size={size}
      style={style}
    />
  );
}