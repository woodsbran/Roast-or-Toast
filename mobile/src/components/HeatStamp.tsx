// =====================================================
// File: HeatStamp.tsx
//
// Purpose:
// Shared Heat reward treatment.
//
// Heat is progression. It is NOT the Roast symbol.
// I keep it visually separate with its own ticket language.
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

import HeatMark from "./HeatMark";
import StampLabel from "./StampLabel";

type HeatStampProps = {
  amount: number;
  caption?: string;
};

export default function HeatStamp({
  amount,
  caption = "HEAT",
}: HeatStampProps) {
  return (
    <View style={styles.ticket}>
      <View style={styles.label}>
        <StampLabel
          text="HEAT EARNED"
          color={
            Colors.textPrimary
          }
          filled
          rotate={-3}
        />
      </View>

      <HeatMark
        size="medium"
      />

      <View style={styles.copy}>
        <View style={styles.amountRow}>
          <Text style={styles.amount}>
            +{amount}
          </Text>

          <Text style={styles.heatWord}>
            HEAT
          </Text>
        </View>

        <Text style={styles.caption}>
          {caption}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ticket: {
    position: "relative",

    minHeight: 88,

    backgroundColor:
      Colors.heatSoft,

    borderColor:
      "#E4B675",
    borderWidth: 1.4,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    paddingTop: 17,
    paddingBottom: 11,
    paddingHorizontal: 18,

    transform: [
      {
        rotate: "0.6deg",
      },
    ],
  },

  label: {
    position: "absolute",

    left: 14,
    top: -10,
  },

  copy: {
    marginLeft: 10,
  },

  amountRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },

  amount: {
    color:
      Colors.heatDark,

    ...Typography.numberMedium,
  },

  heatWord: {
    color:
      Colors.heatDark,

    fontSize: 13,
    fontWeight: "900",

    marginLeft: 5,
  },

  caption: {
    color:
      Colors.textSecondary,

    ...Typography.stamp,

    marginTop: 1,
  },
});
