// =====================================================
// File: ScenarioCard.tsx
//
// Purpose:
// Displays the current category badge and the main
// Roast or Toast Moment.
//
// The scenario remains the visual focus of the screen.
//
// Project: Roast or Toast
// =====================================================

import { StyleSheet, Text, View } from "react-native";

import { Colors, Radius } from "../theme";

// Information required to display one Moment.
type ScenarioCardProps = {
  categoryLabel: string;
  categoryAccent: string;
  categorySoft: string;
  question: string;
};

export default function ScenarioCard({
  categoryLabel,
  categoryAccent,
  categorySoft,
  question,
}: ScenarioCardProps) {
  return (
    <View>
      {/* Category badge changes color for each category */}
      <View
        style={[
          styles.categoryBadge,
          {
            backgroundColor: categorySoft,
            borderColor: categoryAccent,
          },
        ]}
      >
        <Text
          style={[
            styles.categoryBadgeText,
            { color: categoryAccent },
          ]}
        >
          {categoryLabel}
        </Text>
      </View>

      {/* Main situation shown to the player */}
      <Text style={styles.scenarioText}>{question}</Text>
    </View>
  );
}

// =====================================================
// Styles
// =====================================================

const styles = StyleSheet.create({
  categoryBadge: {
    alignSelf: "flex-start",
    borderWidth: 1.5,
    borderRadius: Radius.pill,
    paddingVertical: 7,
    paddingHorizontal: 15,
    marginBottom: 25,
    transform: [{ rotate: "-2deg" }],
  },

  categoryBadgeText: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.7,
  },

  scenarioText: {
    color: Colors.textPrimary,
    fontSize: 37,
    fontWeight: "900",
    letterSpacing: -1.6,
    lineHeight: 47,
    marginBottom: 30,
  },
});