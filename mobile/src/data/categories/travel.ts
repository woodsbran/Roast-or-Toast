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
];