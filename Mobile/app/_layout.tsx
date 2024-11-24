import React from "react";
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

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

// Configure NativeWind
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
  // Load custom fonts
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  // Hide splash screen once fonts are loaded
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
            <RootLayoutNav />
          </AuthProvider>
        </PaperProvider>
      </AuthVisibilityProvider>
    </GestureHandlerRootView>
  );
}

function RootLayoutNav() {
  const { authState } = useAuth();
  const segments = useSegments();
  const { showSignIn, isSignInVisible, hideSignIn } = useAuthVisibility();
  const router = useRouter();

  useEffect(() => {
    // Check if segments exists before comparing
    const firstSegment = segments[0] || "";
    console.log("Current segments:", segments);

    // Check current route segments
    const inAuthGroup = firstSegment === "(auth)";
    const inAdminGroup = firstSegment === "(adminroot)";
    const inStudentGroup = firstSegment === "(studentroot)";
    const inSponsorGroup = firstSegment === "(root)";
    const inPagesGroup = firstSegment === "pages";

    // Define protected pages (these would be under the role-based routes, not in /pages/)
    const protectedPages = ["donate", "profile", "students"];

    // If we're in the pages group, allow access
    if (inPagesGroup) {
      // Allow the navigation to continue
      return;
    }

    if (!authState?.authenticated) {
      // Only check protection for non-pages routes
      if (!inAuthGroup && segments[2] && protectedPages.includes(segments[2])) {
        showSignIn();
      }
    } else {
      // Handle authenticated users
      if (inAuthGroup) {
        // Redirect from auth pages based on role
        const userRole = authState.role?.toLowerCase();
        switch (userRole) {
          case "admin":
            router.replace("/(adminroot)/(tabs)/home");
            break;
          case "student":
            router.replace("/(studentroot)/(tabs)/home");
            break;
          default:
            router.replace("/(root)/(tabs)/home");
            break;
        }
      } else {
        // Only check role-based routes
        const userRole = authState.role?.toLowerCase();
        const isInWrongSection =
          (userRole === "admin" && !inAdminGroup) ||
          (userRole === "student" && !inStudentGroup) ||
          (userRole === "sponsor" && !inSponsorGroup);

        if (isInWrongSection) {
          switch (userRole) {
            case "admin":
              router.replace("/(adminroot)/(tabs)/home");
              break;
            case "student":
              router.replace("/(studentroot)/(tabs)/home");
              break;
            default:
              router.replace("/(root)/(tabs)/home");
              break;
          }
        }
      }
    }
  }, [authState?.authenticated, authState?.role, segments]);

  return (
    <>
      <StatusBar hidden={Platform.OS === "ios"} />
      <AuthContainer
        isSignInVisible={isSignInVisible}
        setSignInVisible={(value) => {
          if (!value) {
            hideSignIn();
          }
        }}
      />
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

        {/* Existing Routes */}
        <Stack.Screen
          name="(root)"
          options={{ animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="(adminroot)"
          options={{ animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="(studentroot)"
          options={{ animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="(auth)"
          options={{ animation: "slide_from_bottom" }}
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
    </>
  );
}

export { customTransition };
