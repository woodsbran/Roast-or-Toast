// =====================================================
// File: ScenarioCard.tsx
//
// Purpose:
// Displays the category and the current Moment.
//
// Version 1.1 — Screen Composition Rebuild
//
// I am treating the paper like a fixed game board now.
//
// The last version let the question keep growing until the
// whole paper became huge. That pushed the vote choices off
// the screen and made the game feel like a webpage.
//
// What I am doing here:
// • I size the text based on the Moment length
// • Long Moments get smaller before the paper gets taller
// • The category stays compact
// • The question always stays centered inside the artwork
//
// The paper texture itself still comes from scenario.tsx.
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

type ScenarioCardProps = {
  categoryLabel: string;
  categoryAccent: string;
  categorySoft: string;
  question: string;
  compact?: boolean;
};

export default function ScenarioCard({
  categoryLabel,
  categoryAccent,
  categorySoft,
  question,
}: ScenarioCardProps) {
  // I shrink longer Moments before I ever let them break the
  // composition. The goal is for every Moment to feel like it
  // belongs to the same physical game board.
  const questionLength =
    question.length;

  const questionStyle =
    questionLength > 150
      ? styles.scenarioTextSmall
      : questionLength > 105
        ? styles.scenarioTextMedium
        : styles.scenarioTextLarge;

  return (
    <View style={styles.container}>
      {/* =================================================
          Category Stamp
      ================================================= */}

      <View
        style={[
          styles.categoryStamp,
          {
            backgroundColor:
              categorySoft,

            borderColor:
              categoryAccent,
          },
        ]}
      >
        <Text
          style={[
            styles.categoryStampText,
            {
              color:
                categoryAccent,
            },
          ]}
        >
          {categoryLabel.toUpperCase()}
        </Text>
      </View>

      {/* =================================================
          Moment

          The font changes before the paper size changes.
          That is what keeps the board consistent.
      ================================================= */}

      <Text
        style={[
          styles.scenarioText,
          questionStyle,
        ]}
        numberOfLines={8}
        adjustsFontSizeToFit
        minimumFontScale={0.78}
      >
        {question}
      </Text>

      <View style={styles.bottomScratch} />
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,

      width: "100%",

      alignItems: "center",
      justifyContent: "center",
    },

    categoryStamp: {
      borderWidth: 1.5,

      paddingVertical: 5,
      paddingHorizontal: 13,

      marginBottom: 15,

      transform: [
        {
          rotate: "-3deg",
        },
      ],
    },

    categoryStampText: {
      fontSize: 9,
      fontWeight: "900",

      letterSpacing: 1.45,
    },

    scenarioText: {
      color:
        Colors.textPrimary,

      fontWeight: "900",

      textAlign: "center",

      letterSpacing: -1,
    },

    scenarioTextLarge: {
      fontSize: 26,
      lineHeight: 32,
    },

    scenarioTextMedium: {
      fontSize: 22,
      lineHeight: 28,
    },

    scenarioTextSmall: {
      fontSize: 18.5,
      lineHeight: 24,
    },

    bottomScratch: {
      width: "68%",
      height: 3,

      backgroundColor:
        Colors.textPrimary,

      opacity: 0.65,

      marginTop: 16,

      transform: [
        {
          rotate: "-1deg",
        },
      ],
    },
  });
