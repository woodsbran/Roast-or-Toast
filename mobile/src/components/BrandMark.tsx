// =====================================================
// File: BrandMark.tsx
//
// Purpose:
// Central reusable component for the three main
// Roast or Toast Version 1.1 brand symbols.
//
// Roast = Charred R
// Toast = Spark Burst glasses
// Heat  = Ember Spark
//
// Using one component means we can adjust icon sizing
// and presentation globally without changing every
// screen.
//
// Project: Roast or Toast
// =====================================================

import {
  Image,
  ImageStyle,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

export type BrandMarkType =
  | "roast"
  | "toast"
  | "heat";

type BrandMarkSize =
  | "small"
  | "medium"
  | "large"
  | "hero";

type BrandMarkProps = {
  type: BrandMarkType;
  size?: BrandMarkSize;

  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
};

// Static require() calls are important for React Native
// image bundling.
const BRAND_IMAGES = {
  roast: require(
    "../../assets/branding/roast-mark.png",
  ),

  toast: require(
    "../../assets/branding/toast-mark.png",
  ),

  heat: require(
    "../../assets/branding/heat-mark.png",
  ),
};

export default function BrandMark({
  type,
  size = "medium",
  style,
  imageStyle,
}: BrandMarkProps) {
  return (
    <View
      style={[
        styles.container,
        styles[size],
        style,
      ]}
    >
      <Image
        source={BRAND_IMAGES[type]}
        resizeMode="contain"
        style={[
          styles.image,
          imageStyle,
        ]}
      />
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      alignItems: "center",
      justifyContent: "center",
    },

    image: {
      width: "100%",
      height: "100%",
    },

    small: {
      width: 34,
      height: 34,
    },

    medium: {
      width: 50,
      height: 50,
    },

    large: {
      width: 68,
      height: 68,
    },

    hero: {
      width: 92,
      height: 92,
    },
  });