// =====================================================
// File: work.ts
//
// Purpose:
// Stores Work category Moments.
//
// Content Direction:
// • Remote-work behavior
// • Meetings and messaging
// • Credit, boundaries, and office politics
// • Helpful coworkers
// • Situations that feel specific and familiar
//
// Important:
// Existing IDs are preserved so saved sessions remain
// compatible after this content update.
//
// Project: Roast or Toast
// =====================================================

import type { Moment } from "../types";

export const workMoments: Moment[] = [
  {
    id: "work-001",
    category: "Work",
    question:
      'Your coworker replies all to a company-wide email just to say, "Thanks!"',
    roastPhrase: "Revoke Reply All.",
    toastPhrase: "They were being polite.",
    roastPercentage: 88,
    toastPercentage: 12,
    topComment:
      "Three thousand inboxes received their gratitude.",
  },
  {
    id: "work-002",
    category: "Work",
    question:
      "Your boss schedules a thirty-minute meeting, reads three bullet points aloud, and ends eight minutes early.",
    roastPhrase: "Send the email next time.",
    toastPhrase: "At least it ended early.",
    roastPercentage: 69,
    toastPercentage: 31,
    topComment:
      "Twenty-two minutes were returned, but the calendar still has questions.",
  },
  {
    id: "work-003",
    category: "Work",
    question:
      "Your coworker covers your shift during an emergency but reminds everyone about it for weeks.",
    roastPhrase: "The favor has expired.",
    toastPhrase: "They still helped.",
    roastPercentage: 48,
    toastPercentage: 52,
    topComment:
      "Generosity with a recurring announcement is still technically generosity.",
  },
  {
    id: "work-004",
    category: "Work",
    question:
      "Your coworker gives you credit for your idea in front of leadership even though they helped improve it.",
    roastPhrase: "They should mention their part too.",
    toastPhrase: "That shows integrity.",
    roastPercentage: 15,
    toastPercentage: 85,
    topComment:
      "A coworker who shares credit without being asked is workplace luxury.",
  },
  {
    id: "work-005",
    category: "Work",
    question:
      'Your coworker sends "???" five minutes after asking a nonurgent question.',
    roastPhrase: "Blocked on Teams.",
    toastPhrase: "Maybe they need it quickly.",
    roastPercentage: 84,
    toastPercentage: 16,
    topComment:
      "Five minutes is not a service-level agreement.",
  },
  {
    id: "work-006",
    category: "Work",
    question:
      "Your coworker volunteers the entire team for an extra project because it could increase visibility.",
    roastPhrase: "Volunteer yourself.",
    toastPhrase: "It might help everyone.",
    roastPercentage: 79,
    toastPercentage: 21,
    topComment:
      "Exposure has once again been assigned without consent.",
  },
  {
    id: "work-007",
    category: "Work",
    question:
      'Your manager messages during lunch asking for "a quick favor" that takes twenty minutes.',
    roastPhrase: "Lunch is not office hours.",
    toastPhrase: "Some things cannot wait.",
    roastPercentage: 71,
    toastPercentage: 29,
    topComment:
      "The quickest part was how fast lunch disappeared.",
  },
  {
    id: "work-008",
    category: "Work",
    question:
      "Your coworker keeps their camera off in every meeting but consistently contributes and finishes their work.",
    roastPhrase: "Turn the camera on sometimes.",
    toastPhrase: "Performance matters more.",
    roastPercentage: 28,
    toastPercentage: 72,
    topComment:
      "A black square with excellent deliverables is still an excellent coworker.",
  },
  {
    id: "work-009",
    category: "Work",
    question:
      "Your boss sends emails late at night but schedules them so they arrive the next morning.",
    roastPhrase: "They should log off too.",
    toastPhrase: "That respects boundaries.",
    roastPercentage: 18,
    toastPercentage: 82,
    topComment:
      "Workaholic behavior, responsibly packaged.",
  },
  {
    id: "work-010",
    category: "Work",
    question:
      "Your coworker brings breakfast for the team but asks everyone to send money afterward.",
    roastPhrase: "That was not a gift.",
    toastPhrase: "Breakfast was still organized.",
    roastPercentage: 74,
    toastPercentage: 26,
    topComment:
      "A surprise invoice is not team morale.",
  },
  {
    id: "work-011",
    category: "Work",
    question:
      "Your coworker says they are overwhelmed, then spends twenty minutes explaining every task they have.",
    roastPhrase: "Use that time to work.",
    toastPhrase: "They may need support.",
    roastPercentage: 62,
    toastPercentage: 38,
    topComment:
      "The workload presentation became another item on the workload.",
  },
  {
    id: "work-012",
    category: "Work",
    question:
      "Your manager praises the team publicly but describes the success as their own during an executive meeting.",
    roastPhrase: "That is credit theft.",
    toastPhrase: "They represent the team.",
    roastPercentage: 92,
    toastPercentage: 8,
    topComment:
      "Our work has become their leadership story.",
  },
  {
    id: "work-013",
    category: "Work",
    question:
      "Your coworker quietly corrects your mistake, then tells you privately so it does not happen again.",
    roastPhrase: "They should have asked first.",
    toastPhrase: "That is professional.",
    roastPercentage: 11,
    toastPercentage: 89,
    topComment:
      "Protected publicly, corrected privately. Perfect execution.",
  },
  {
    id: "work-014",
    category: "Work",
    question:
      "Your coworker marks every email as high importance because they believe their work is always urgent.",
    roastPhrase: "Nothing is urgent now.",
    toastPhrase: "At least expectations are clear.",
    roastPercentage: 89,
    toastPercentage: 11,
    topComment:
      "The red exclamation mark has lost all legal authority.",
  },
  {
    id: "work-015",
    category: "Work",
    question:
      "Your manager asks for honest feedback, then explains why every criticism is unfair.",
    roastPhrase: "They wanted compliments.",
    toastPhrase: "They are allowed to respond.",
    roastPercentage: 83,
    toastPercentage: 17,
    topComment:
      "This feedback session has become a defense hearing.",
  },
  {
    id: "work-016",
    category: "Work",
    question:
      "Your coworker leaves exactly at five while the rest of the team stays late to finish a shared deadline.",
    roastPhrase: "Read the room.",
    toastPhrase: "Their workday is over.",
    roastPercentage: 46,
    toastPercentage: 54,
    topComment:
      "A boundary can still feel inconvenient to people without one.",
  },
  {
    id: "work-017",
    category: "Work",
    question:
      "Your coworker schedules an early meeting because every reasonable time conflicts across time zones.",
    roastPhrase: "Find another solution.",
    toastPhrase: "Someone has to compromise.",
    roastPercentage: 51,
    toastPercentage: 49,
    topComment:
      "Global collaboration means local resentment.",
  },
  {
    id: "work-018",
    category: "Work",
    question:
      "Your coworker corrects your grammar in a casual message but ignores the actual question.",
    roastPhrase: "Answer the question.",
    toastPhrase: "Accuracy matters.",
    roastPercentage: 91,
    toastPercentage: 9,
    topComment:
      "The sentence is fixed. The problem remains completely untouched.",
  },
  {
    id: "work-019",
    category: "Work",
    question:
      "Your manager encourages you to take vacation and does not contact you once while you are away.",
    roastPhrase: "That should be normal.",
    toastPhrase: "That is excellent leadership.",
    roastPercentage: 9,
    toastPercentage: 91,
    topComment:
      "The bar is low, but this manager brought a ladder.",
  },
  {
    id: "work-020",
    category: "Work",
    question:
      "Your coworker misses a deadline and says nobody reminded them, even though it was on the shared calendar.",
    roastPhrase: "The deadline was the reminder.",
    toastPhrase: "The team could communicate better.",
    roastPercentage: 87,
    toastPercentage: 13,
    topComment:
      "The calendar invitation would like to enter evidence.",
  },
];