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
    {
      id: "food-021",
      category: "Food",

      question:
        "Your friend says they don't want anything, then spends the entire meal eating off your plate.",

      roastPhrase:
        "Order your own food.",

      toastPhrase:
        "Sharing is caring.",

      roastPercentage: 81,
      toastPercentage: 19,

      topComment:
        "The fries apparently came with a community membership.",
    },

    {
      id: "food-022",
      category: "Food",

      question:
        "Someone remembers your favorite snack every time they stop at the store without you ever asking.",

      roastPhrase:
        "Now I owe them snacks.",

      toastPhrase:
        "That is thoughtful.",

      roastPercentage: 8,
      toastPercentage: 92,

      topComment:
        "Remembering the little things is underrated.",
    },

    {
      id: "food-023",
      category: "Food",

      question:
        "Your friend orders the most expensive thing on the menu after suggesting everyone split the bill evenly.",

      roastPhrase:
        "Absolutely not.",

      toastPhrase:
        "It keeps things simple.",

      roastPercentage: 89,
      toastPercentage: 11,

      topComment:
        "Funny how the split gets easier once the lobster arrives.",
    },

    {
      id: "food-024",
      category: "Food",

      question:
        "Someone asks for a bite of your dessert... then takes almost half.",

      roastPhrase:
        "That was not a bite.",

      toastPhrase:
        "Dessert is meant to be shared.",

      roastPercentage: 87,
      toastPercentage: 13,

      topComment:
        "We clearly have different definitions of 'just a taste.'",
    },

    {
      id: "food-025",
      category: "Food",

      question:
        "Your grandma insists you take home leftovers even after you've told her three times you're full.",

      roastPhrase:
        "Respect my stomach.",

      toastPhrase:
        "That is love.",

      roastPercentage: 11,
      toastPercentage: 89,

      topComment:
        "The meal ends when Grandma says it ends.",
    },

    {
      id: "food-026",
      category: "Food",

      question:
        "Someone says they're on a diet... but asks to taste everyone else's food.",

      roastPhrase:
        "Calories still count.",

      toastPhrase:
        "One bite won't hurt.",

      roastPercentage: 58,
      toastPercentage: 42,

      topComment:
        "Apparently borrowed calories don't exist.",
    },

    {
      id: "food-027",
      category: "Food",

      question:
        "Your friend quietly pays for everyone's meal without telling anyone.",

      roastPhrase:
        "Now I feel guilty.",

      toastPhrase:
        "That is incredibly generous.",

      roastPercentage: 5,
      toastPercentage: 95,

      topComment:
        "Some people flex with money. Others make people feel appreciated.",
    },

    {
      id: "food-028",
      category: "Food",

      question:
        "Someone double dips the chip after making eye contact with everyone at the table.",

      roastPhrase:
        "Straight to jail.",

      toastPhrase:
        "It's just family.",

      roastPercentage: 84,
      toastPercentage: 16,

      topComment:
        "The confidence was honestly impressive.",
    },

    {
      id: "food-029",
      category: "Food",

      question:
        "Your friend says they'll only have one fry... then finishes half your order.",

      roastPhrase:
        "You owe me potatoes.",

      toastPhrase:
        "Friends share food.",

      roastPercentage: 79,
      toastPercentage: 21,

      topComment:
        "The first fry was permission. The next fourteen were a crime.",
    },

    {
      id: "food-030",
      category: "Food",

      question:
        "Someone cooks your favorite meal after hearing you've had a rough week.",

      roastPhrase:
        "Now I'm emotional.",

      toastPhrase:
        "That is real care.",

      roastPercentage: 4,
      toastPercentage: 96,

      topComment:
        "Sometimes a meal says what words can't.",
    },
      {
        id: "food-031",
        category: "Food",

        question:
          "You tell your friend you are saving the leftovers for tomorrow, and they eat them later that night without asking.",

        roastPhrase:
          "Those leftovers had plans.",

        toastPhrase:
          "Food should not go to waste.",

        roastPercentage: 94,
        toastPercentage: 6,

        topComment:
          "I was emotionally depending on that container.",
      },

      {
        id: "food-032",
        category: "Food",

        question:
          "Someone notices you have not eaten all day and quietly orders enough food for both of you.",

        roastPhrase:
          "Now I feel watched.",

        toastPhrase:
          "That is genuine care.",

        roastPercentage: 5,
        toastPercentage: 95,

        topComment:
          "They noticed the need before I had to ask.",
      },

      {
        id: "food-033",
        category: "Food",

        question:
          "Your friend says they are not hungry, refuses to order anything, then asks for a separate plate when your food arrives.",

        roastPhrase:
          "The kitchen is still open.",

        toastPhrase:
          "Just share a little.",

        roastPercentage: 82,
        toastPercentage: 18,

        topComment:
          "Not hungry somehow required utensils.",
      },

      {
        id: "food-034",
        category: "Food",

        question:
          "Someone brings a homemade dish to the gathering, but spends the entire night asking whether everyone liked it.",

        roastPhrase:
          "Let the food speak.",

        toastPhrase:
          "They put effort into it.",

        roastPercentage: 44,
        toastPercentage: 56,

        topComment:
          "The meal came with a mandatory performance review.",
      },

      {
        id: "food-035",
        category: "Food",

        question:
          "Your family argues over who gets the last piece of food, then secretly saves it for the oldest person in the room.",

        roastPhrase:
          "That drama was unnecessary.",

        toastPhrase:
          "The ending was sweet.",

        roastPercentage: 18,
        toastPercentage: 82,

        topComment:
          "The argument was loud, but the love quietly won.",
      },

      {
        id: "food-036",
        category: "Food",

        question:
          "Someone claims they can taste the difference between expensive bottled water brands and asks everyone to test them.",

        roastPhrase:
          "It is still water.",

        toastPhrase:
          "Some people have refined taste.",

        roastPercentage: 63,
        toastPercentage: 37,

        topComment:
          "The water tasting had notes of confidence and plastic.",
      },

      {
        id: "food-037",
        category: "Food",

        question:
          "Your coworker remembers your dietary restriction and makes sure there is something you can eat at the team lunch.",

        roastPhrase:
          "That should be standard.",

        toastPhrase:
          "They made sure you were included.",

        roastPercentage: 8,
        toastPercentage: 92,

        topComment:
          "Being considered before arriving feels different.",
      },

      {
        id: "food-038",
        category: "Food",

        question:
          "Someone orders food for the table without asking, then expects everyone to pay for dishes they did not want.",

        roastPhrase:
          "You ordered it. You pay.",

        toastPhrase:
          "Group meals are for sharing.",

        roastPercentage: 86,
        toastPercentage: 14,

        topComment:
          "Their generosity became expensive once the bill arrived.",
      },

      {
        id: "food-039",
        category: "Food",

        question:
          "Your friend takes one bite of the meal you cooked, adds several seasonings, and says they are only helping.",

        roastPhrase:
          "Taste it first.",

        toastPhrase:
          "Maybe it needed help.",

        roastPercentage: 74,
        toastPercentage: 26,

        topComment:
          "The seasoning cabinet opened before the compliment arrived.",
      },

      {
        id: "food-040",
        category: "Food",

        question:
          "Someone learns how to make your favorite childhood meal because you said you missed it.",

        roastPhrase:
          "That is almost too much effort.",

        toastPhrase:
          "That is incredibly thoughtful.",

        roastPercentage: 3,
        toastPercentage: 97,

        topComment:
          "They did not just feed me. They brought back a memory.",
      },
];