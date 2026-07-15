// =====================================================
// File: popCulture.ts
//
// Purpose:
// Stores Pop Culture category Moments.
//
// Content Direction:
// • Movies, television, music, and fandom
// • Spoilers and streaming etiquette
// • Popularity, criticism, and fan behavior
// • Situations that remain understandable over time
//
// Important:
// Existing IDs are preserved so saved sessions remain
// compatible after this content update.
//
// Project: Roast or Toast
// =====================================================

import type { Moment } from "../types";

export const popCultureMoments: Moment[] = [
  {
    id: "pop-culture-001",
    category: "Pop Culture",
    question:
      "Someone decides a popular show is terrible after watching half of the first episode.",
    roastPhrase: "Give it one full episode.",
    toastPhrase: "They know what they dislike.",
    roastPercentage: 62,
    toastPercentage: 38,
    topComment:
      "Thirty minutes may be enough for chemistry, but not always for a whole series.",
  },
  {
    id: "pop-culture-002",
    category: "Pop Culture",
    question:
      "Someone posts a major spoiler the morning after an episode releases because they believe everyone had enough time.",
    roastPhrase: "Some people were asleep.",
    toastPhrase: "Avoid social media.",
    roastPercentage: 84,
    toastPercentage: 16,
    topComment:
      "The spoiler window cannot be one commute long.",
  },
  {
    id: "pop-culture-003",
    category: "Pop Culture",
    question:
      "Someone wears a band shirt because they like the design but has never listened to the band.",
    roastPhrase: "Learn one song.",
    toastPhrase: "It is just clothing.",
    roastPercentage: 43,
    toastPercentage: 57,
    topComment:
      "The shirt is merchandise, not a music certification.",
  },
  {
    id: "pop-culture-004",
    category: "Pop Culture",
    question:
      "Someone watches two episodes ahead in a show you started together but agrees to rewatch them with you.",
    roastPhrase: "The betrayal already happened.",
    toastPhrase: "They are willing to rewatch.",
    roastPercentage: 54,
    toastPercentage: 46,
    topComment:
      "The agreement was broken, but restitution includes snacks.",
  },
  {
    id: "pop-culture-005",
    category: "Pop Culture",
    question:
      "Someone refuses to watch a subtitled movie after a long workday because they do not want to read.",
    roastPhrase: "You are missing great movies.",
    toastPhrase: "Entertainment should feel easy.",
    roastPercentage: 51,
    toastPercentage: 49,
    topComment:
      "A fair mood-based decision that becomes questionable as a permanent rule.",
  },
  {
    id: "pop-culture-006",
    category: "Pop Culture",
    question:
      "Someone records their favorite song at a concert but watches the rest without their phone.",
    roastPhrase: "Experience it fully.",
    toastPhrase: "That is a good balance.",
    roastPercentage: 19,
    toastPercentage: 81,
    topComment:
      "One memory captured. The rest actually lived.",
  },
  {
    id: "pop-culture-007",
    category: "Pop Culture",
    question:
      "Someone discovers an older song through a viral video and calls it their new favorite.",
    roastPhrase: "You are late.",
    toastPhrase: "Good music has no deadline.",
    roastPercentage: 24,
    toastPercentage: 76,
    topComment:
      "The discovery was late. The enjoyment is still valid.",
  },
  {
    id: "pop-culture-008",
    category: "Pop Culture",
    question:
      "Someone skips the opening theme every episode except the season premiere and finale.",
    roastPhrase: "Respect the intro.",
    toastPhrase: "That is efficient.",
    roastPercentage: 39,
    toastPercentage: 61,
    topComment:
      "A reasonable compromise in the ongoing war against theme songs.",
  },
  {
    id: "pop-culture-009",
    category: "Pop Culture",
    question:
      "Someone rates a movie immediately after leaving the theater, then changes the score the next day.",
    roastPhrase: "Think before reviewing.",
    toastPhrase: "Opinions can evolve.",
    roastPercentage: 37,
    toastPercentage: 63,
    topComment:
      "The first review was emotional. The second had breakfast.",
  },
  {
    id: "pop-culture-010",
    category: "Pop Culture",
    question:
      "Someone avoids an artist because the fanbase makes every conversation exhausting.",
    roastPhrase: "Judge the music itself.",
    toastPhrase: "Fandom affects the experience.",
    roastPercentage: 53,
    toastPercentage: 47,
    topComment:
      "The songs are innocent. The comment section is not.",
  },
  {
    id: "pop-culture-011",
    category: "Pop Culture",
    question:
      "Someone calls a movie overrated after enjoying it because they think the praise became excessive.",
    roastPhrase: "You still liked it.",
    toastPhrase: "Good can still be overrated.",
    roastPercentage: 47,
    toastPercentage: 53,
    topComment:
      "Enjoyment and cultural exhaustion can apparently coexist.",
  },
  {
    id: "pop-culture-012",
    category: "Pop Culture",
    question:
      "Someone talks during a movie they have already seen but only to explain details you ask about.",
    roastPhrase: "Wait until it ends.",
    toastPhrase: "You asked the question.",
    roastPercentage: 41,
    toastPercentage: 59,
    topComment:
      "Requested commentary is different from an unsolicited director’s cut.",
  },
  {
    id: "pop-culture-013",
    category: "Pop Culture",
    question:
      "Someone feels genuinely sad when a celebrity couple they followed for years breaks up.",
    roastPhrase: "You do not know them.",
    toastPhrase: "People get emotionally invested.",
    roastPercentage: 58,
    toastPercentage: 42,
    topComment:
      "Parasocial grief is still grief, just with better publicists.",
  },
  {
    id: "pop-culture-014",
    category: "Pop Culture",
    question:
      "Someone buys another movie ticket because they slept through part of the first showing.",
    roastPhrase: "The nap was the review.",
    toastPhrase: "They deserve a real chance.",
    roastPercentage: 42,
    toastPercentage: 58,
    topComment:
      "Expensive accountability, but accountability nonetheless.",
  },
  {
    id: "pop-culture-015",
    category: "Pop Culture",
    question:
      "Someone says the book was better but still recommends the movie to people who do not like reading.",
    roastPhrase: "Stop comparing everything.",
    toastPhrase: "Both can have value.",
    roastPercentage: 18,
    toastPercentage: 82,
    topComment:
      "A book person displaying restraint and practical judgment.",
  },
  {
    id: "pop-culture-016",
    category: "Pop Culture",
    question:
      "Someone wears a full costume to a movie premiere even though nobody else in their group dresses up.",
    roastPhrase: "That is doing too much.",
    toastPhrase: "Commit to the experience.",
    roastPercentage: 29,
    toastPercentage: 71,
    topComment:
      "Being the only one dressed up is either brave or spiritually exhausting.",
  },
  {
    id: "pop-culture-017",
    category: "Pop Culture",
    question:
      "Someone refuses to watch a classic because the pacing feels too slow by modern standards.",
    roastPhrase: "Give it a chance.",
    toastPhrase: "Entertainment tastes change.",
    roastPercentage: 57,
    toastPercentage: 43,
    topComment:
      "Historical importance does not guarantee personal enjoyment.",
  },
  {
    id: "pop-culture-018",
    category: "Pop Culture",
    question:
      "Someone plays the same album daily for a month because it helps them focus.",
    roastPhrase: "Find new music.",
    toastPhrase: "They found what works.",
    roastPercentage: 27,
    toastPercentage: 73,
    topComment:
      "The album is employed full time now.",
  },
  {
    id: "pop-culture-019",
    category: "Pop Culture",
    question:
      "Someone brings their favorite celebrity into nearly every unrelated conversation.",
    roastPhrase: "Develop another topic.",
    toastPhrase: "Let people enjoy things.",
    roastPercentage: 71,
    toastPercentage: 29,
    topComment:
      "The celebrity has range. The conversation does not.",
  },
  {
    id: "pop-culture-020",
    category: "Pop Culture",
    question:
      "Someone pauses a documentary repeatedly to verify claims and read more about the topic.",
    roastPhrase: "Let the documentary finish.",
    toastPhrase: "Curiosity is a good thing.",
    roastPercentage: 44,
    toastPercentage: 56,
    topComment:
      "The two-hour documentary has become an independent research course.",
  },
    {
      id: "popculture-021",
      category: "Pop Culture",

      question:
        "Someone refuses to watch a popular show because too many people keep telling them they have to see it.",

      roastPhrase:
        "They are missing out to be different.",

      toastPhrase:
        "The hype became annoying.",

      roastPercentage: 48,
      toastPercentage: 52,

      topComment:
        "Nothing kills curiosity faster than receiving homework from the entire internet.",
    },

    {
      id: "popculture-022",
      category: "Pop Culture",

      question:
        "Your friend starts a show without you after you both agreed to watch every episode together.",

      roastPhrase:
        "That is streaming betrayal.",

      toastPhrase:
        "They could not wait.",

      roastPercentage: 81,
      toastPercentage: 19,

      topComment:
        "The relationship may recover. The shared watch history will not.",
    },

    {
      id: "popculture-023",
      category: "Pop Culture",

      question:
        "Someone says they hate celebrity gossip but knows every detail before anyone else does.",

      roastPhrase:
        "They are secretly subscribed.",

      toastPhrase:
        "The news is impossible to avoid.",

      roastPercentage: 72,
      toastPercentage: 28,

      topComment:
        "They hate gossip with an impressive amount of supporting evidence.",
    },

    {
      id: "popculture-024",
      category: "Pop Culture",

      question:
        "A person stops supporting an artist completely after learning the artist did something they strongly disagree with.",

      roastPhrase:
        "Separate the art from the artist.",

      toastPhrase:
        "Support is still a choice.",

      roastPercentage: 45,
      toastPercentage: 55,

      topComment:
        "The playlist became an ethics exam.",
    },

    {
      id: "popculture-025",
      category: "Pop Culture",

      question:
        "Someone claims a musician only became good after the rest of the internet started praising them.",

      roastPhrase:
        "They needed permission to like it.",

      toastPhrase:
        "Sometimes music grows on you.",

      roastPercentage: 59,
      toastPercentage: 41,

      topComment:
        "The song improved dramatically once it became socially approved.",
    },

    {
      id: "popculture-026",
      category: "Pop Culture",

      question:
        "Your friend sends you a song because the lyrics reminded them of something you are going through.",

      roastPhrase:
        "Now I have to be emotional.",

      toastPhrase:
        "That is a thoughtful way to connect.",

      roastPercentage: 5,
      toastPercentage: 95,

      topComment:
        "Sometimes a song knows what your friend could not find the words to say.",
    },

    {
      id: "popculture-027",
      category: "Pop Culture",

      question:
        "Someone records themselves reacting to a movie while everyone else is trying to watch it quietly.",

      roastPhrase:
        "The movie already has actors.",

      toastPhrase:
        "Their reaction is part of the fun.",

      roastPercentage: 78,
      toastPercentage: 22,

      topComment:
        "I bought a ticket for the film, not their live commentary track.",
    },

    {
      id: "popculture-028",
      category: "Pop Culture",

      question:
        "A person wears merchandise from a band but cannot name a single song when someone asks.",

      roastPhrase:
        "They are wearing a costume.",

      toastPhrase:
        "They liked the design.",

      roastPercentage: 51,
      toastPercentage: 49,

      topComment:
        "The shirt looked good. The surprise music exam was unnecessary.",
    },

    {
      id: "popculture-029",
      category: "Pop Culture",

      question:
        "Your friend remembers the movie you loved as a child and surprises you with tickets to a special screening.",

      roastPhrase:
        "That is suspiciously thoughtful.",

      toastPhrase:
        "They really pay attention.",

      roastPercentage: 4,
      toastPercentage: 96,

      topComment:
        "Nostalgia feels different when someone remembers it for you.",
    },

    {
      id: "popculture-030",
      category: "Pop Culture",

      question:
        "Someone decides an entire movie is terrible after watching only ten minutes while scrolling on their phone.",

      roastPhrase:
        "They did not actually watch it.",

      toastPhrase:
        "Ten minutes can be enough.",

      roastPercentage: 76,
      toastPercentage: 24,

      topComment:
        "The movie failed to compete with three apps and a group chat.",
    },

    {
      id: "popculture-031",
      category: "Pop Culture",

      question:
        "A person complains that every new movie is a remake, but refuses to watch anything that is not already familiar.",

      roastPhrase:
        "They are creating the problem.",

      toastPhrase:
        "Familiar stories are comforting.",

      roastPercentage: 67,
      toastPercentage: 33,

      topComment:
        "They demand originality and purchase nostalgia.",
    },

    {
      id: "popculture-032",
      category: "Pop Culture",

      question:
        "Someone spends hundreds of dollars on a concert, then watches most of it through their phone screen.",

      roastPhrase:
        "Put the phone down.",

      toastPhrase:
        "They want to keep the memory.",

      roastPercentage: 71,
      toastPercentage: 29,

      topComment:
        "The memory now includes forty minutes of shaky vertical video.",
    },

    {
      id: "popculture-033",
      category: "Pop Culture",

      question:
        "Your friend listens to an album you recommended, then calls you because they genuinely want to discuss it.",

      roastPhrase:
        "This became a music seminar.",

      toastPhrase:
        "That is real engagement.",

      roastPercentage: 8,
      toastPercentage: 92,

      topComment:
        "They did not just say they would listen. They came back with notes.",
    },

    {
      id: "popculture-034",
      category: "Pop Culture",

      question:
        "Someone changes their entire opinion of a celebrity because of one carefully edited interview clip.",

      roastPhrase:
        "They need more context.",

      toastPhrase:
        "The clip still revealed something.",

      roastPercentage: 62,
      toastPercentage: 38,

      topComment:
        "A twelve-second clip just completed a full character investigation.",
    },

    {
      id: "popculture-035",
      category: "Pop Culture",

      question:
        "A person says an artist has sold out because their music became popular outside the original fan base.",

      roastPhrase:
        "Success is not betrayal.",

      toastPhrase:
        "The music may have changed.",

      roastPercentage: 57,
      toastPercentage: 43,

      topComment:
        "They supported the dream until other people discovered it.",
    },

    {
      id: "popculture-036",
      category: "Pop Culture",

      question:
        "Your friend spoils the ending of a show, then says you had plenty of time to watch it.",

      roastPhrase:
        "Spoilers still count.",

      toastPhrase:
        "The episode has been out for months.",

      roastPercentage: 68,
      toastPercentage: 32,

      topComment:
        "The statute of limitations on spoilers remains under debate.",
    },

    {
      id: "popculture-037",
      category: "Pop Culture",

      question:
        "Someone admits they were wrong about a performer and gives their work another honest chance.",

      roastPhrase:
        "They should have listened earlier.",

      toastPhrase:
        "Changing your mind is healthy.",

      roastPercentage: 10,
      toastPercentage: 90,

      topComment:
        "Growth sometimes sounds like finally adding the song to your playlist.",
    },

    {
      id: "popculture-038",
      category: "Pop Culture",

      question:
        "A person makes liking one artist, show, or franchise their entire personality.",

      roastPhrase:
        "There has to be more.",

      toastPhrase:
        "Let people enjoy things deeply.",

      roastPercentage: 55,
      toastPercentage: 45,

      topComment:
        "The interest is fine. The full-time brand partnership is where questions begin.",
    },

    {
      id: "popculture-039",
      category: "Pop Culture",

      question:
        "Someone refuses to admit they enjoyed a movie because critics and social media said it was bad.",

      roastPhrase:
        "Form your own opinion.",

      toastPhrase:
        "Reviews can change the experience.",

      roastPercentage: 73,
      toastPercentage: 27,

      topComment:
        "They had fun until the internet informed them they did not.",
    },

    {
      id: "popculture-040",
      category: "Pop Culture",

      question:
        "Your friend makes you a playlist for a specific mood instead of sending a random collection of songs.",

      roastPhrase:
        "They had too much time.",

      toastPhrase:
        "That is personal and thoughtful.",

      roastPercentage: 6,
      toastPercentage: 94,

      topComment:
        "A carefully made playlist is a letter written in songs.",
    },
];