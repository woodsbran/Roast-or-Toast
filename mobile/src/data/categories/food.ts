// =====================================================
// File: food.ts
//
// Purpose:
// Stores Food category Moments.
//
// Content Direction:
// • Sharing and ordering etiquette
// • Strong food opinions
// • Restaurant behavior
// • Situations that create real disagreement
//
// Important:
// Existing IDs are preserved so saved sessions remain
// compatible after this content update.
//
// Project: Roast or Toast
// =====================================================

import type { Moment } from "../types";

export const foodMoments: Moment[] = [
  {
    id: "food-001",
    category: "Food",
    question:
      "Someone orders pineapple pizza for the whole group without asking because they say everyone secretly likes it.",
    roastPhrase: "Do not impose pineapple.",
    toastPhrase: "Give it a chance.",
    roastPercentage: 58,
    toastPercentage: 42,
    topComment:
      "Personal pizza choices should not become group policy.",
  },
  {
    id: "food-002",
    category: "Food",
    question:
      "Someone orders an expensive steak well done and adds steak sauce before tasting it.",
    roastPhrase: "The steak deserved better.",
    toastPhrase: "They paid for it.",
    roastPercentage: 64,
    toastPercentage: 36,
    topComment:
      "The chef felt that from the kitchen.",
  },
  {
    id: "food-003",
    category: "Food",
    question:
      "Your friend brings food after you have a bad day but chooses something they know you are trying not to eat.",
    roastPhrase: "The thought needed more thought.",
    toastPhrase: "They still showed up.",
    roastPercentage: 43,
    toastPercentage: 57,
    topComment:
      "Comfort food and personal goals have entered negotiations.",
  },
  {
    id: "food-004",
    category: "Food",
    question:
      "Someone dips one fry in your milkshake after asking permission.",
    roastPhrase: "Keep the foods separate.",
    toastPhrase: "One fry is harmless.",
    roastPercentage: 38,
    toastPercentage: 62,
    topComment:
      "Consent was obtained. The combination remains under review.",
  },
  {
    id: "food-005",
    category: "Food",
    question:
      "Someone takes the last slice after asking if anyone wants it and waiting only two seconds.",
    roastPhrase: "That was not enough time.",
    toastPhrase: "Nobody answered.",
    roastPercentage: 59,
    toastPercentage: 41,
    topComment:
      "The question was technically asked. The pause was purely decorative.",
  },
  {
    id: "food-006",
    category: "Food",
    question:
      "Someone adds ketchup to eggs before tasting them because they always eat them that way.",
    roastPhrase: "Taste the food first.",
    toastPhrase: "They know what they like.",
    roastPercentage: 49,
    toastPercentage: 51,
    topComment:
      "Tradition or disrespect to the eggs?",
  },
  {
    id: "food-007",
    category: "Food",
    question:
      "Your friend orders your usual meal for you because you are running late.",
    roastPhrase: "Let me choose for myself.",
    toastPhrase: "They know your order.",
    roastPercentage: 24,
    toastPercentage: 76,
    topComment:
      "Knowing the usual is helpful. Knowing when not to use it is advanced.",
  },
  {
    id: "food-008",
    category: "Food",
    question:
      "Someone eats messy pizza with a fork and knife while everyone else uses their hands.",
    roastPhrase: "Use your hands.",
    toastPhrase: "Let them stay clean.",
    roastPercentage: 46,
    toastPercentage: 54,
    topComment:
      "Slightly dramatic, completely harmless.",
  },
  {
    id: "food-009",
    category: "Food",
    question:
      "Someone asks for ranch before the food arrives because they already know they will use it.",
    roastPhrase: "The food has not had a chance.",
    toastPhrase: "Preparation saves time.",
    roastPercentage: 52,
    toastPercentage: 48,
    topComment:
      "The meal has been judged before entering the room.",
  },
  {
    id: "food-010",
    category: "Food",
    question:
      "Your coworker brings homemade food for the team but repeatedly asks whether everyone likes it.",
    roastPhrase: "The compliments feel required.",
    toastPhrase: "They are just nervous.",
    roastPercentage: 36,
    toastPercentage: 64,
    topComment:
      "Free lunch came with a short performance review.",
  },
  {
    id: "food-011",
    category: "Food",
    question:
      "Someone eats all their fries first because they refuse to let them get cold.",
    roastPhrase: "The burger comes first.",
    toastPhrase: "Cold fries are unacceptable.",
    roastPercentage: 28,
    toastPercentage: 72,
    topComment:
      "The fries have a shorter lifespan and deserve priority.",
  },
  {
    id: "food-012",
    category: "Food",
    question:
      "Someone orders chicken tenders at an expensive restaurant because nothing else sounds good.",
    roastPhrase: "Try something new.",
    toastPhrase: "They should order what they enjoy.",
    roastPercentage: 44,
    toastPercentage: 56,
    topComment:
      "The price of the restaurant does not erase the comfort of a tender.",
  },
  {
    id: "food-013",
    category: "Food",
    question:
      "Someone eats your leftovers but replaces the meal with a fresh order before you get home.",
    roastPhrase: "They still took my food.",
    toastPhrase: "The replacement is better.",
    roastPercentage: 48,
    toastPercentage: 52,
    topComment:
      "The crime was committed, but restitution arrived warm.",
  },
  {
    id: "food-014",
    category: "Food",
    question:
      "Your date offers you the last bite of dessert and genuinely seems happy when you take it.",
    roastPhrase: "They probably did not want it.",
    toastPhrase: "That is affection.",
    roastPercentage: 13,
    toastPercentage: 87,
    topComment:
      "The last bite remains one of love’s most serious currencies.",
  },
  {
    id: "food-015",
    category: "Food",
    question:
      "Someone drinks milk with pizza because they say it balances the acidity.",
    roastPhrase: "That explanation made it worse.",
    toastPhrase: "The logic is technically there.",
    roastPercentage: 72,
    toastPercentage: 28,
    topComment:
      "A scientific explanation cannot rescue every beverage choice.",
  },
  {
    id: "food-016",
    category: "Food",
    question:
      "Someone says they are not hungry, then asks for several bites after your food arrives.",
    roastPhrase: "Order your own meal.",
    toastPhrase: "Sharing is normal.",
    roastPercentage: 66,
    toastPercentage: 34,
    topComment:
      "Not hungry apparently means waiting for visual confirmation.",
  },
  {
    id: "food-017",
    category: "Food",
    question:
      "Your friend saves you the best piece but reminds everyone that they did it.",
    roastPhrase: "The kindness was performative.",
    toastPhrase: "The best piece is still yours.",
    roastPercentage: 42,
    toastPercentage: 58,
    topComment:
      "Generosity arrived with a public-relations department.",
  },
  {
    id: "food-018",
    category: "Food",
    question:
      "Someone reheats fish in the office microwave but warns the team first.",
    roastPhrase: "The warning changes nothing.",
    toastPhrase: "At least they gave notice.",
    roastPercentage: 81,
    toastPercentage: 19,
    topComment:
      "Advance notice does not improve the air quality.",
  },
  {
    id: "food-019",
    category: "Food",
    question:
      "Someone uses water in cereal because they ran out of milk and refuse to waste the cereal.",
    roastPhrase: "Choose another breakfast.",
    toastPhrase: "They made it work.",
    roastPercentage: 84,
    toastPercentage: 16,
    topComment:
      "Resourceful behavior can still be deeply unsettling.",
  },
  {
    id: "food-020",
    category: "Food",
    question:
      "Someone says they will not share fries, then changes their mind after you stop asking.",
    roastPhrase: "The agreement was already made.",
    toastPhrase: "They became generous.",
    roastPercentage: 21,
    toastPercentage: 79,
    topComment:
      "Respecting the boundary somehow unlocked the fries.",
  },
];