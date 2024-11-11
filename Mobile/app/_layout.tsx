import { AuthProvider, useAuth } from "@/context/JWTContext";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { NativeWindStyleSheet } from "nativewind";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "react-native";
import AuthContainer from "./components/Modals/AuthContainer";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
NativeWindStyleSheet.setOutput({
  default: "native",
});

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const [isSignInVisible, setSignInVisible] = useState(false); // State for sign-in modal

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
      <AuthContainer
        isSignInVisible={isSignInVisible}
        setSignInVisible={setSignInVisible}
      />
      <RootLayoutNav setSignInVisible={setSignInVisible} />
    </AuthProvider>
  );
}

function RootLayoutNav({
  setSignInVisible,
}: {
  setSignInVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { authState } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";
    const protectedPages = ["events", "donate", "profile", "students"];

    if (!authState?.authenticated && !authState?.anonomous) {
      console.log(authState?.anonomous);
      if (!inAuthGroup && segments[2] && protectedPages.includes(segments[2])) {
        setSignInVisible(true); // Show modal instead of navigating
      }
    } else {
      if (inAuthGroup) {
        router.replace("/(tabs)/home"); // Redirect to home if authenticated
      }
    }
  }, [authState?.authenticated, segments, setSignInVisible]);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(root)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
