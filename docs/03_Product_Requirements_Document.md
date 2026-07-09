# 🔥 Roast or Toast

# Product Requirements Document (PRD)

> Defines the functional and technical requirements for Roast or Toast Version 1.0.

---

| Document Information | |
|----------------------|--------------------------------|
| **Version** | 1.0 |
| **Status** | Draft |
| **Owner** | Branden Woods |
| **Last Updated** | July 2026 |

---

# Table of Contents

1. Product Overview
2. Product Goals
3. Success Metrics
4. Core Gameplay Loop
5. Navigation
6. Screens
7. Functional Requirements
8. Non-Functional Requirements
9. Edge Cases
10. Out of Scope
11. Open Questions
12. Revision History

---

# 1. Product Overview

Roast or Toast is a mobile social voting game where players respond to relatable everyday scenarios by choosing one of two options:

🔥 Roast

❤️ Toast

After voting, players immediately see how the community voted, read the funniest community comments, and continue to the next scenario.

The application is designed for quick, entertaining sessions that encourage daily engagement and social sharing.

The MVP focuses on validating one core gameplay loop before expanding into additional game modes and social features.

---

# 2. Product Goals

Version 1.0 has three primary goals.

## Goal 1

Make voting effortless.

Players should understand how to play within five seconds.

---

## Goal 2

Make results entertaining.

Seeing community opinions should be just as enjoyable as voting.

---

## Goal 3

Encourage daily engagement.

Fresh scenarios and community participation should motivate players to return every day.

---

# 3. Success Metrics

Version 1.0 will be considered successful if the following metrics are achieved.

### Product Metrics

- Players understand gameplay without a tutorial.
- Average session exceeds 5 minutes.
- Players complete at least 10 scenarios per session.
- Users return on multiple days.
- Community comments remain active.

### Business Metrics

- Daily Active Users (DAU)
- Monthly Active Users (MAU)
- Day 1 Retention
- Day 7 Retention
- Day 30 Retention
- Average Session Length
- Scenarios Shared
- Scenarios Submitted

---

# 4. Core Gameplay Loop

The application is centered around one simple gameplay loop.

```
Launch App

↓

Read Scenario

↓

Think

↓

Vote

↓

Watch Results

↓

Read Community Comments

↓

Next Scenario

↓

Repeat
```

Every feature added to Roast or Toast should strengthen this gameplay loop.

---

# 5. Navigation

Version 1.0 uses a simple bottom navigation with four primary sections.

🏠 Home

Browse and vote on scenarios.

🔥 Categories

Browse scenarios by topic.

🏆 Leaderboard

View rankings and community statistics.

👤 Profile

Manage account, statistics, and settings.

Navigation should remain simple and avoid unnecessary complexity.

---

# 6. Screens

Version 1.0 will include the following screens.

### Authentication

- Splash Screen
- Login
- Create Account
- Forgot Password

---

### Gameplay

- Home Feed
- Scenario Screen
- Results Screen
- Comments Screen

---

### Community

- Leaderboard
- Categories
- Submit Scenario

---

### User

- Profile
- Settings
- Notifications

Additional screens may be introduced in future versions.

---

# 7. Functional Requirements

## Voting

### Purpose

Allow players to vote on scenarios.

### Requirements

- User can vote once per scenario.
- Vote cannot be changed.
- Results appear immediately.
- Vote animation completes in under one second.
- Percentages update in real time.
- User can continue to the next scenario.

### Acceptance Criteria

- User cannot vote multiple times.
- Vote is permanently stored.
- Community percentages display correctly.
- Results load within one second under normal network conditions.

---

## Comments

### Purpose

Allow players to discuss scenarios.

### Requirements

- Create comments.
- Like comments.
- Report comments.
- Sort comments by Top and New.

### Acceptance Criteria

- Comments post successfully.
- Reported comments enter moderation.
- Likes update immediately.

---

## Categories

### Purpose

Organize scenarios by topic.

### Initial Categories

- Dating
- Work
- School
- Friends
- Family
- Travel
- Food
- Driving
- Holidays
- Pop Culture
- Social Media

### Requirements

Players can browse scenarios by category.

---

## Profiles

### Requirements

Profiles display:

- Username
- Avatar
- Join Date
- Total Votes
- Roast Percentage
- Toast Percentage
- Comments Posted
- Scenarios Submitted

---

## Submit Scenario

Users can submit their own scenarios for review.

Submitted scenarios are reviewed before becoming public.

---

## Leaderboards

Version 1 includes leaderboards based on:

- Votes Cast
- Comments Posted
- Scenarios Submitted
- Daily Streak

---

## Notifications

Version 1 supports:

- Daily reminder
- Streak reminder
- Scenario approved
- Weekly recap

---

# 8. Non-Functional Requirements

Performance requirements.

- App launches in under two seconds.
- Vote submission completes in under one second.
- Smooth animations at 60 FPS.
- Support Dark Mode.
- Support iOS and Android.
- Responsive layouts.
- Accessible text sizes.
- Secure authentication.
- Cloud synchronization.

---

# 9. Edge Cases

The application must properly handle:

- No internet connection.
- Duplicate votes.
- Deleted scenarios.
- Deleted comments.
- Empty categories.
- Empty leaderboards.
- Slow network.
- Server timeout.
- User logged out.
- Push notifications disabled.

---

# 10. Out of Scope

The following features are intentionally excluded from Version 1.

- Party Mode
- QR Code Rooms
- Friends System
- Direct Messages
- TV Mode
- AI-generated scenarios
- Creator Marketplace
- Paid Themes
- Premium Scenario Packs
- Merchandise

These features are planned for future releases after validating the core gameplay.

---

# 11. Open Questions

The following product decisions remain under consideration.

- Should Guest Mode be supported?
- How many scenarios should appear before repetition?
- Should users be able to edit comments?
- Should profanity filtering be automatic?
- How are featured scenarios selected?
- Should usernames be unique?
- Should comments require moderation before posting?

These questions will be resolved before development begins.

---

# 12. Revision History

| Version | Date | Changes |
|----------|------------|----------------------------|
| 1.0 | July 2026 | Initial Product Requirements Document |