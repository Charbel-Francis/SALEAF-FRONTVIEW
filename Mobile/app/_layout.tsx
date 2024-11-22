// app/_layout.tsx
import React, { useState } from "react";
import { AuthProvider, useAuth } from "@/context/JWTContext";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { NativeWindStyleSheet } from "nativewind";
import { useEffect } from "react";
import "react-native-reanimated";
import { Stack, useRouter, useSegments } from "expo-router";
import { Platform, StatusBar } from "react-native";
import AuthContainer from "./pages/AuthContainer";
import { SharedTransition, withSpring } from "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import {
  AuthVisibilityProvider,
  useAuthVisibility,
} from "@/context/AuthVisibilityContext";

SplashScreen.preventAutoHideAsync();
NativeWindStyleSheet.setOutput({
  default: "native",
});

// Custom transition configuration
const customTransition = SharedTransition.custom((values) => {
  "worklet";
  return {
    height: withSpring(values.targetHeight),
    width: withSpring(values.targetWidth),
    originX: withSpring(values.targetOriginX),
    originY: withSpring(values.targetOriginY),
  };
});

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthVisibilityProvider>
        <PaperProvider>
          <AuthProvider>
            <RootLayoutContent />
          </AuthProvider>
        </PaperProvider>
      </AuthVisibilityProvider>
    </GestureHandlerRootView>
  );
}

function RootLayoutContent() {
  const { isSignInVisible, hideSignIn } = useAuthVisibility();

  return (
    <>
      <StatusBar hidden={Platform.OS === "ios" ? true : false} />
      <AuthContainer
        isSignInVisible={isSignInVisible}
        setSignInVisible={(value) => {
          if (!value) {
            hideSignIn();
          }
        }}
      />
      <RootLayoutNav />
    </>
  );
}

function RootLayoutNav() {
  const { authState } = useAuth();
  const { showSignIn } = useAuthVisibility();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";
    const protectedPages = ["donate", "profile", "students"];

    if (!authState?.authenticated && !authState?.anonomous) {
      if (!inAuthGroup && segments[2] && protectedPages.includes(segments[2])) {
        showSignIn();
      }
    } else {
      if (inAuthGroup) {
        router.replace("/(tabs)/home");
      }
    }
  }, [authState?.authenticated, segments]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "fade",
        customAnimationOnGesture: true,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="(root)"
        options={{
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="(auth)"
        options={{
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen
        name="pages/Application_Form"
        options={{
          animation: "slide_from_right",
          customAnimationOnGesture: true,
        }}
      />
      <Stack.Screen name="pages/barcode" />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export { customTransition };
