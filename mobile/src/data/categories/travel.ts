// =====================================================
// File: travel.ts
//
// Purpose:
// Stores Travel category Moments.
//
// Content Direction:
// • Airport and flight etiquette
// • Group-trip behavior
// • Hotels, road trips, and planning
// • Situations where convenience and consideration clash
//
// Important:
// Existing IDs are preserved so saved sessions remain
// compatible after this content update.
//
// Project: Roast or Toast
// =====================================================

import type { Moment } from "../types";

export const travelMoments: Moment[] = [
  {
    id: "travel-001",
    category: "Travel",
    question:
      "Someone claps when the plane lands after a flight with heavy turbulence.",
    roastPhrase: "Please remain seated.",
    toastPhrase: "They survived emotionally.",
    roastPercentage: 44,
    toastPercentage: 56,
    topComment:
      "Under normal conditions, unnecessary. After that turbulence, understandable.",
  },
  {
    id: "travel-002",
    category: "Travel",
    question:
      "Someone stands up as soon as the plane lands even though the door will not open for another ten minutes.",
    roastPhrase: "Sit back down.",
    toastPhrase: "They need to stretch.",
    roastPercentage: 82,
    toastPercentage: 18,
    topComment:
      "Standing early has never convinced the door to open faster.",
  },
  {
    id: "travel-003",
    category: "Travel",
    question:
      "Someone gives up their aisle seat so a parent can sit beside their young child.",
    roastPhrase: "The airline should fix it.",
    toastPhrase: "That was thoughtful.",
    roastPercentage: 22,
    toastPercentage: 78,
    topComment:
      "Not their responsibility, but still a kind thing to do.",
  },
  {
    id: "travel-004",
    category: "Travel",
    question:
      "Someone reclines their seat on a daytime flight after asking the person behind them first.",
    roastPhrase: "There is still no room.",
    toastPhrase: "They asked politely.",
    roastPercentage: 39,
    toastPercentage: 61,
    topComment:
      "Permission does not create legroom, but it helps.",
  },
  {
    id: "travel-005",
    category: "Travel",
    question:
      "Someone takes off their shoes during a long flight but keeps clean socks on.",
    roastPhrase: "Keep the shoes on.",
    toastPhrase: "Long flights require comfort.",
    roastPercentage: 56,
    toastPercentage: 44,
    topComment:
      "Clean socks have prevented a stronger public reaction.",
  },
  {
    id: "travel-006",
    category: "Travel",
    question:
      "Someone helps a stranger lift a heavy bag into the overhead bin, then jokingly asks for a tip.",
    roastPhrase: "The joke ruined it.",
    toastPhrase: "They still helped.",
    roastPercentage: 33,
    toastPercentage: 67,
    topComment:
      "Community service with a brief comedy surcharge.",
  },
  {
    id: "travel-007",
    category: "Travel",
    question:
      "Someone saves pool chairs early in the morning but actually returns within fifteen minutes.",
    roastPhrase: "A towel is not a reservation.",
    toastPhrase: "They planned ahead.",
    roastPercentage: 53,
    toastPercentage: 47,
    topComment:
      "Fifteen minutes feels reasonable until every chair has a towel on it.",
  },
  {
    id: "travel-008",
    category: "Travel",
    question:
      "The person in the middle seat uses both armrests for the entire flight.",
    roastPhrase: "Pick one.",
    toastPhrase: "The middle seat gets both.",
    roastPercentage: 42,
    toastPercentage: 58,
    topComment:
      "The middle seat deserves one guaranteed benefit.",
  },
  {
    id: "travel-009",
    category: "Travel",
    question:
      "Someone joins their family farther ahead in the boarding line instead of waiting alone.",
    roastPhrase: "Go to the back.",
    toastPhrase: "Families board together.",
    roastPercentage: 57,
    toastPercentage: 43,
    topComment:
      "One person joining feels different from twelve people appearing.",
  },
  {
    id: "travel-010",
    category: "Travel",
    question:
      "Someone brings strong-smelling food onto the plane because the airport had no other affordable options.",
    roastPhrase: "The cabin did not consent.",
    toastPhrase: "People need to eat.",
    roastPercentage: 61,
    toastPercentage: 39,
    topComment:
      "Valid hunger. Unfortunate shared air.",
  },
  {
    id: "travel-011",
    category: "Travel",
    question:
      "Your travel partner gives you the window seat both ways because they know flying makes you anxious.",
    roastPhrase: "They probably prefer the aisle.",
    toastPhrase: "That is considerate.",
    roastPercentage: 8,
    toastPercentage: 92,
    topComment:
      "Comfort offered without being asked is premium travel behavior.",
  },
  {
    id: "travel-012",
    category: "Travel",
    question:
      "Someone puts their bag in an overhead bin several rows ahead because the space above their seat is full.",
    roastPhrase: "Keep it near your seat.",
    toastPhrase: "Space is space.",
    roastPercentage: 48,
    toastPercentage: 52,
    topComment:
      "Reasonable in theory. Chaotic during deplaning.",
  },
  {
    id: "travel-013",
    category: "Travel",
    question:
      "Someone moves into an empty better seat after boarding without asking a flight attendant.",
    roastPhrase: "Return to your assignment.",
    toastPhrase: "Nobody was using it.",
    roastPercentage: 63,
    toastPercentage: 37,
    topComment:
      "The empty seat was available. The permission was not.",
  },
  {
    id: "travel-014",
    category: "Travel",
    question:
      "Someone checks on an older passenger traveling alone but asks several personal questions while helping.",
    roastPhrase: "Helpful became nosy.",
    toastPhrase: "They were being friendly.",
    roastPercentage: 49,
    toastPercentage: 51,
    topComment:
      "Kindness and interrogation were seated beside each other.",
  },
  {
    id: "travel-015",
    category: "Travel",
    question:
      "Someone records the plane taking off because it is their first flight.",
    roastPhrase: "Watch it with your own eyes.",
    toastPhrase: "That is a big memory.",
    roastPercentage: 21,
    toastPercentage: 79,
    topComment:
      "The camera roll may actually revisit this one.",
  },
  {
    id: "travel-016",
    category: "Travel",
    question:
      "Someone arrives at the airport four hours early and expects everyone traveling with them to do the same.",
    roastPhrase: "That is excessive.",
    toastPhrase: "Missing flights is worse.",
    roastPercentage: 54,
    toastPercentage: 46,
    topComment:
      "Personal anxiety has become a group itinerary.",
  },
  {
    id: "travel-017",
    category: "Travel",
    question:
      "Someone reaches airport security completely unprepared but apologizes and lets others go ahead.",
    roastPhrase: "They should have prepared.",
    toastPhrase: "At least they handled it well.",
    roastPercentage: 58,
    toastPercentage: 42,
    topComment:
      "Accountability does not speed up the line, but it lowers the temperature.",
  },
  {
    id: "travel-018",
    category: "Travel",
    question:
      "Someone offers to take a stranger’s family photo, then suggests several poses.",
    roastPhrase: "Take the picture and move on.",
    toastPhrase: "They are making it special.",
    roastPercentage: 36,
    toastPercentage: 64,
    topComment:
      "The volunteer photographer has entered creative-director mode.",
  },
  {
    id: "travel-019",
    category: "Travel",
    question:
      "Someone talks through most of the flight because the stranger beside them keeps responding enthusiastically.",
    roastPhrase: "The whole cabin can hear.",
    toastPhrase: "They are both enjoying it.",
    roastPercentage: 51,
    toastPercentage: 49,
    topComment:
      "A mutual conversation can still become public programming.",
  },
  {
    id: "travel-020",
    category: "Travel",
    question:
      "Someone packs snacks for the road trip but chooses everything without asking what anyone else likes.",
    roastPhrase: "This is not your personal menu.",
    toastPhrase: "At least they planned.",
    roastPercentage: 46,
    toastPercentage: 54,
    topComment:
      "Excellent preparation. Questionable snack democracy.",
  },
    {
      id: "travel-021",
      category: "Travel",

      question:
        "Your friend says they are a low-maintenance traveler, then complains about the hotel, the food, the weather, and every activity.",

      roastPhrase:
        "Nothing was going to satisfy them.",

      toastPhrase:
        "Bad trips happen.",

      roastPercentage: 79,
      toastPercentage: 21,

      topComment:
        "The destination changed. The complaining remained consistent.",
    },

    {
      id: "travel-022",
      category: "Travel",

      question:
        "Someone plans the entire trip, makes the reservations, and sends everyone a clear itinerary so nobody has to stress.",

      roastPhrase:
        "They are controlling the vacation.",

      toastPhrase:
        "That is excellent planning.",

      roastPercentage: 14,
      toastPercentage: 86,

      topComment:
        "Call it controlling if you want. I still knew where dinner was.",
    },

    {
      id: "travel-023",
      category: "Travel",

      question:
        "A friend agrees to a group trip, then waits until the last minute to say they cannot afford most of the plans.",

      roastPhrase:
        "That should have been discussed earlier.",

      toastPhrase:
        "Money situations can change.",

      roastPercentage: 68,
      toastPercentage: 32,

      topComment:
        "The budget conversation arrived after the nonrefundable deposits.",
    },

    {
      id: "travel-024",
      category: "Travel",

      question:
        "Someone brings snacks, chargers, medicine, and everything else the group forgot.",

      roastPhrase:
        "They packed for a crisis.",

      toastPhrase:
        "That person saved the trip.",

      roastPercentage: 5,
      toastPercentage: 95,

      topComment:
        "Every trip needs one person carrying the entire group's common sense.",
    },

    {
      id: "travel-025",
      category: "Travel",

      question:
        "Your travel partner wants to take pictures everywhere but gets annoyed whenever you ask them to take one of you.",

      roastPhrase:
        "The camera only works for them.",

      toastPhrase:
        "They may be tired of photos.",

      roastPercentage: 76,
      toastPercentage: 24,

      topComment:
        "Interesting how photography became exhausting once I entered the frame.",
    },

    {
      id: "travel-026",
      category: "Travel",

      question:
        "Someone sleeps through most of the road trip but criticizes the driver for missing one turn.",

      roastPhrase:
        "The passenger seat was very opinionated.",

      toastPhrase:
        "They were just trying to help.",

      roastPercentage: 85,
      toastPercentage: 15,

      topComment:
        "They contributed nothing but one perfectly timed complaint.",
    },

    {
      id: "travel-027",
      category: "Travel",

      question:
        "A friend quietly checks that everyone got back to the hotel safely before going to sleep.",

      roastPhrase:
        "They are doing too much.",

      toastPhrase:
        "That is real care.",

      roastPercentage: 6,
      toastPercentage: 94,

      topComment:
        "The trip planner deserves appreciation. The safety checker deserves protection.",
    },

    {
      id: "travel-028",
      category: "Travel",

      question:
        "Someone insists on splitting every group expense exactly, including a charge that is less than two dollars.",

      roastPhrase:
        "Let the dollar go.",

      toastPhrase:
        "Fair is fair.",

      roastPercentage: 53,
      toastPercentage: 47,

      topComment:
        "The friendship survived the trip but may not survive the spreadsheet.",
    },

    {
      id: "travel-029",
      category: "Travel",

      question:
        "Your friend keeps saying they want an authentic local experience but only wants to eat at familiar chain restaurants.",

      roastPhrase:
        "That is not exploring.",

      toastPhrase:
        "Comfort food is still food.",

      roastPercentage: 69,
      toastPercentage: 31,

      topComment:
        "They traveled two thousand miles to order the exact same meal.",
    },

    {
      id: "travel-030",
      category: "Travel",

      question:
        "Someone gives up the better hotel bed because they know you have trouble sleeping.",

      roastPhrase:
        "They probably wanted something.",

      toastPhrase:
        "That was genuinely thoughtful.",

      roastPercentage: 7,
      toastPercentage: 93,

      topComment:
        "Small sacrifices tell you a lot about who you are traveling with.",
    },
      {
        id: "travel-031",
        category: "Travel",

        question:
          "Your friend invites you on a trip, then reveals after booking that you will be sharing one hotel room with six people.",

        roastPhrase:
          "That needed to be disclosed.",

        toastPhrase:
          "It keeps the trip affordable.",

        roastPercentage: 79,
        toastPercentage: 21,

        topComment:
          "The vacation quietly became a sleepover with luggage fees.",
      },

      {
        id: "travel-032",
        category: "Travel",

        question:
          "Someone creates a shared photo album after the trip and uploads pictures of everyone, not only the ones where they look good.",

        roastPhrase:
          "Some pictures should stay private.",

        toastPhrase:
          "Everyone deserves the memories.",

        roastPercentage: 16,
        toastPercentage: 84,

        topComment:
          "A rare photographer who remembered the trip had other people on it.",
      },

      {
        id: "travel-033",
        category: "Travel",

        question:
          "Your travel partner wakes everyone up early for a planned activity, then takes an hour to get ready themselves.",

        roastPhrase:
          "They wasted the head start.",

        toastPhrase:
          "At least everyone is awake.",

        roastPercentage: 88,
        toastPercentage: 12,

        topComment:
          "They became the alarm and the delay.",
      },

      {
        id: "travel-034",
        category: "Travel",

        question:
          "A friend notices you are running low on money during the trip and quietly covers one activity without embarrassing you.",

        roastPhrase:
          "Now I owe them.",

        toastPhrase:
          "That was thoughtful and respectful.",

        roastPercentage: 7,
        toastPercentage: 93,

        topComment:
          "Helping without announcing it protected more than the budget.",
      },

      {
        id: "travel-035",
        category: "Travel",

        question:
          "Someone insists the group follow every item on the itinerary even when everyone is exhausted and no longer having fun.",

        roastPhrase:
          "The schedule is not the vacation.",

        toastPhrase:
          "Everyone agreed to the plan.",

        roastPercentage: 69,
        toastPercentage: 31,

        topComment:
          "We completed the itinerary and lost the will to travel.",
      },

      {
        id: "travel-036",
        category: "Travel",

        question:
          "Your friend spends the entire vacation looking for content to post instead of enjoying where you actually are.",

        roastPhrase:
          "The trip became a photoshoot.",

        toastPhrase:
          "Creating memories is part of traveling.",

        roastPercentage: 72,
        toastPercentage: 28,

        topComment:
          "The followers saw the destination more than they did.",
      },

      {
        id: "travel-037",
        category: "Travel",

        question:
          "Someone offers to switch seats so you can sit next to the person you are traveling with, even though their original seat was better.",

        roastPhrase:
          "They gave up too much.",

        toastPhrase:
          "That was genuinely kind.",

        roastPercentage: 6,
        toastPercentage: 94,

        topComment:
          "A stranger improved the trip before it even started.",
      },

      {
        id: "travel-038",
        category: "Travel",

        question:
          "Your group spends months planning a trip, then everyone sits in the hotel scrolling on their phones once you arrive.",

        roastPhrase:
          "We could have stayed home.",

        toastPhrase:
          "Resting together still counts.",

        roastPercentage: 61,
        toastPercentage: 39,

        topComment:
          "We traveled across the country to use the same apps in a different room.",
      },

      {
        id: "travel-039",
        category: "Travel",

        question:
          "One person handles every reservation and problem during the trip, but everyone criticizes their choices afterward.",

        roastPhrase:
          "Then someone else should have planned.",

        toastPhrase:
          "The group can still give feedback.",

        roastPercentage: 83,
        toastPercentage: 17,

        topComment:
          "Nobody wanted responsibility until it was time to review the results.",
      },

      {
        id: "travel-040",
        category: "Travel",

        question:
          "Your travel partner notices you are overwhelmed and suggests skipping an activity without making you feel guilty.",

        roastPhrase:
          "We paid for the activity.",

        toastPhrase:
          "Your well-being matters more.",

        roastPercentage: 9,
        toastPercentage: 91,

        topComment:
          "The best travel partner knows when the plan needs to change.",
      },
];