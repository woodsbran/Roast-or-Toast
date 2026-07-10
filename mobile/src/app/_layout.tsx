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
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="scenario" />
    </Stack>
  );
}