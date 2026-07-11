// =====================================================
// File: ScenarioCard.tsx
//
// Purpose:
// Displays the current category badge and Moment.
//
// Before voting, the Moment is large and visually bold.
// After voting, compact mode reduces the question size
// so the results fit more comfortably on the screen.
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

  // Compact mode is used after the player votes.
  compact?: boolean;
};

export default function ScenarioCard({
  categoryLabel,
  categoryAccent,
  categorySoft,
  question,
  compact = false,
}: ScenarioCardProps) {
  return (
    <View>
      {/* Category badge changes with the current Moment */}
      <View
        style={[
          styles.categoryBadge,
          {
            backgroundColor: categorySoft,
            borderColor: categoryAccent,
          },
          compact && styles.compactCategoryBadge,
        ]}
      >
        <Text
          style={[
            styles.categoryBadgeText,
            {
              color: categoryAccent,
            },
          ]}
        >
          {categoryLabel}
        </Text>
      </View>

      {/* Main Moment text */}
      <Text
        style={[
          styles.scenarioText,
          compact && styles.compactScenarioText,
        ]}
      >
        {question}
      </Text>
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

  compactCategoryBadge: {
    marginBottom: 16,
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

  // Results do not need the question to remain enormous.
  compactScenarioText: {
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: -1.1,
    marginBottom: 24,
  },
});