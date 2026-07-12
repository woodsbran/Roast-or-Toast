// =====================================================
// File: driving.ts
//
// Purpose:
// Stores Driving category Moments.
//
// Content Direction:
// • Traffic and parking etiquette
// • Passenger behavior
// • Courtesy versus inconvenience
// • Situations drivers immediately have opinions about
//
// Important:
// Existing IDs are preserved so saved sessions remain
// compatible after this content update.
//
// Project: Roast or Toast
// =====================================================

import type { Moment } from "../types";

export const drivingMoments: Moment[] = [
  {
    id: "driving-001",
    category: "Driving",
    question:
      "Someone crosses three lanes at the last second because missing the exit would add fifteen minutes.",
    roastPhrase: "Take the next exit.",
    toastPhrase: "Fifteen minutes is a lot.",
    roastPercentage: 91,
    toastPercentage: 9,
    topComment:
      "A missed exit is inconvenient. A three-lane emergency is everyone’s problem.",
  },
  {
    id: "driving-002",
    category: "Driving",
    question:
      "Someone lets several cars merge in front of them during traffic even though the lane behind them is backed up.",
    roastPhrase: "One car was enough.",
    toastPhrase: "That is good road karma.",
    roastPercentage: 52,
    toastPercentage: 48,
    topComment:
      "Generosity feels different when you are trapped directly behind it.",
  },
  {
    id: "driving-003",
    category: "Driving",
    question:
      "Someone leaves a shopping cart beside their car because the cart return is across the parking lot.",
    roastPhrase: "Return the cart.",
    toastPhrase: "Employees collect them.",
    roastPercentage: 93,
    toastPercentage: 7,
    topComment:
      "The distance somehow doubled after unloading the groceries.",
  },
  {
    id: "driving-004",
    category: "Driving",
    question:
      "Someone drives exactly the speed limit in the left lane while faster traffic builds behind them.",
    roastPhrase: "Move over.",
    toastPhrase: "They are following the law.",
    roastPercentage: 69,
    toastPercentage: 31,
    topComment:
      "Legal speed. Questionable lane awareness.",
  },
  {
    id: "driving-005",
    category: "Driving",
    question:
      "Someone flashes their headlights to warn oncoming drivers about a speed trap.",
    roastPhrase: "Let reckless drivers learn.",
    toastPhrase: "That is community service.",
    roastPercentage: 36,
    toastPercentage: 64,
    topComment:
      "Public safety and public solidarity are having a debate.",
  },
  {
    id: "driving-006",
    category: "Driving",
    question:
      "Your passenger changes the music after asking once and hearing no response.",
    roastPhrase: "Driver controls the playlist.",
    toastPhrase: "Silence counted as permission.",
    roastPercentage: 47,
    toastPercentage: 53,
    topComment:
      "No answer is not always consent, especially near the auxiliary cord.",
  },
  {
    id: "driving-007",
    category: "Driving",
    question:
      "Someone takes several attempts to reverse into a space while cars wait behind them.",
    roastPhrase: "Just pull in.",
    toastPhrase: "Let them park safely.",
    roastPercentage: 44,
    toastPercentage: 56,
    topComment:
      "Careful parking is valid. The audience is still becoming restless.",
  },
  {
    id: "driving-008",
    category: "Driving",
    question:
      "Someone stands in a parking space to hold it while their friend drives around the block.",
    roastPhrase: "People are not traffic cones.",
    toastPhrase: "They found it first.",
    roastPercentage: 79,
    toastPercentage: 21,
    topComment:
      "A human body is not an accepted vehicle type.",
  },
  {
    id: "driving-009",
    category: "Driving",
    question:
      "Your friend returns your borrowed car with a full tank but leaves fast-food trash inside.",
    roastPhrase: "Clean the car too.",
    toastPhrase: "A full tank covers it.",
    roastPercentage: 51,
    toastPercentage: 49,
    topComment:
      "Fuel restitution versus interior disrespect.",
  },
  {
    id: "driving-010",
    category: "Driving",
    question:
      "Someone stops traffic to let one car exit a busy driveway.",
    roastPhrase: "Keep traffic moving.",
    toastPhrase: "That was considerate.",
    roastPercentage: 49,
    toastPercentage: 51,
    topComment:
      "One driver felt grateful. Eight drivers felt selected for sacrifice.",
  },
  {
    id: "driving-011",
    category: "Driving",
    question:
      "Someone honks the instant the light turns green because the first driver is looking down.",
    roastPhrase: "Give them one second.",
    toastPhrase: "They should pay attention.",
    roastPercentage: 48,
    toastPercentage: 52,
    topComment:
      "Aggressive timing, accurate diagnosis.",
  },
  {
    id: "driving-012",
    category: "Driving",
    question:
      "Your passenger grips the door and reacts dramatically even though you have never had an accident.",
    roastPhrase: "Walk next time.",
    toastPhrase: "Your driving may still scare them.",
    roastPercentage: 55,
    toastPercentage: 45,
    topComment:
      "A clean record does not always create a calm passenger.",
  },
  {
    id: "driving-013",
    category: "Driving",
    question:
      "Someone leaves a note after lightly scratching a parked car but does not include their insurance information.",
    roastPhrase: "The note is incomplete.",
    toastPhrase: "At least they admitted it.",
    roastPercentage: 72,
    toastPercentage: 28,
    topComment:
      "Honesty arrived without enough paperwork.",
  },
  {
    id: "driving-014",
    category: "Driving",
    question:
      "Someone uses their turn signal in an empty parking lot out of habit.",
    roastPhrase: "Nobody is there.",
    toastPhrase: "Good habits stay consistent.",
    roastPercentage: 18,
    toastPercentage: 82,
    topComment:
      "The unseen audience is still impressed.",
  },
  {
    id: "driving-015",
    category: "Driving",
    question:
      "Someone parks across two spaces because the neighboring cars were already parked badly.",
    roastPhrase: "Do not continue the problem.",
    toastPhrase: "They had no real choice.",
    roastPercentage: 61,
    toastPercentage: 39,
    topComment:
      "A bad parking chain has produced another victim and another suspect.",
  },
  {
    id: "driving-016",
    category: "Driving",
    question:
      "Your friend asks you to drive, then suggests a different route at every turn.",
    roastPhrase: "You should have driven.",
    toastPhrase: "They know the area better.",
    roastPercentage: 76,
    toastPercentage: 24,
    topComment:
      "Free transportation now includes unpaid navigation supervision.",
  },
  {
    id: "driving-017",
    category: "Driving",
    question:
      "Someone stops to let a pedestrian cross even though the pedestrian is waving them through.",
    roastPhrase: "Now everyone is confused.",
    toastPhrase: "Safety comes first.",
    roastPercentage: 58,
    toastPercentage: 42,
    topComment:
      "Two polite people have created a traffic negotiation.",
  },
  {
    id: "driving-018",
    category: "Driving",
    question:
      "Someone records a quick video while fully stopped in traffic, then puts the phone away once cars move.",
    roastPhrase: "Keep the phone down.",
    toastPhrase: "They were not moving.",
    roastPercentage: 63,
    toastPercentage: 37,
    topComment:
      "Stopped traffic is still not a film studio.",
  },
  {
    id: "driving-019",
    category: "Driving",
    question:
      "Your friend cleans trash from your passenger seat without asking because they need somewhere to sit.",
    roastPhrase: "Do not touch my things.",
    toastPhrase: "The seat needed help.",
    roastPercentage: 41,
    toastPercentage: 59,
    topComment:
      "Privacy ended where the empty bottles began.",
  },
  {
    id: "driving-020",
    category: "Driving",
    question:
      "Someone circles for twenty minutes to avoid paying ten dollars for parking.",
    roastPhrase: "Pay and move on.",
    toastPhrase: "Ten dollars is still money.",
    roastPercentage: 55,
    toastPercentage: 45,
    topComment:
      "Ten dollars saved. Time, gas, and group morale spent.",
  },
];