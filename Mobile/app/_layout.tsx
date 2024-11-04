import { AuthProvider, useAuth } from "@/context/JWTContext";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { NativeWindStyleSheet } from "nativewind";
import { useEffect } from "react";
import "react-native-reanimated";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "react-native";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
NativeWindStyleSheet.setOutput({
  default: "native",
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
    <AuthProvider>
      <StatusBar hidden={true} />
      <RootLayoutNav></RootLayoutNav>
    </AuthProvider>
  );
}

function RootLayoutNav() {
  const { authState } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";
    const inRootGroup = segments[0] === "(root)";
    const isHomePage = segments[2] === "home";
    const protectedPages = ["events", "donate", "profile", "students"];

    if (!authState?.authenticated) {
      if (inAuthGroup) {
        return;
      }
      if (!isHomePage && segments[2] && protectedPages.includes(segments[2])) {
        router.replace("/(auth)/sign-in");
      }
    } else {
      if (inAuthGroup) {
        router.replace("/(tabs)/home");
      }
    }
    if (
      inRootGroup &&
      !isHomePage &&
      segments[2] &&
      !protectedPages.includes(segments[2])
    ) {
      router.replace("/(tabs)/home");
    }
  }, [authState?.authenticated, segments]);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(root)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
