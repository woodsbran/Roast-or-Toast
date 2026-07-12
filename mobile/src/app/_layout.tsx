// =====================================================
// File: _layout.tsx
//
// Purpose:
// Controls the main navigation stack for the app.
//
// Project: Roast or Toast
// =====================================================

import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Home */}
      <Stack.Screen name="index" />

      {/* Player profile and lifetime statistics */}
      <Stack.Screen name="profile" />

      {/* Local app preferences and reset controls */}
      <Stack.Screen name="settings" />

      {/* Round-mode selection */}
      <Stack.Screen name="mode-select" />

      {/* Main gameplay */}
      <Stack.Screen name="scenario" />
    </Stack>
  );
}