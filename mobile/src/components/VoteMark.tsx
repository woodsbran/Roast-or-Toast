// =====================================================
// File: VoteMark.tsx
//
// Purpose:
// Convenience wrapper for Roast and Toast voting marks.
//
// Version 1.1:
// Roast = Charred Block R
// Toast = Spark Burst glasses
//
// Heat has its own HeatMark component.
//
// Project: Roast or Toast
// =====================================================

import {
  StyleProp,
  ViewStyle,
} from "react-native";

import BrandMark from "./BrandMark";

export type VoteMarkType =
  | "roast"
  | "toast";

type VoteMarkProps = {
  type: VoteMarkType;

  size?:
    | "small"
    | "medium"
    | "large"
    | "hero";

  style?: StyleProp<ViewStyle>;
};

export default function VoteMark({
  type,
  size = "medium",
  style,
}: VoteMarkProps) {
  return (
    <BrandMark
      type={type}
      size={size}
      style={style}
    />
  );
}