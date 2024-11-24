import { Redirect, useRootNavigationState } from "expo-router";
import { useAuth } from "@/context/JWTContext";
import { View, ActivityIndicator } from "react-native";

export default function Index() {
  const { authState } = useAuth();
  const rootNavigationState = useRootNavigationState();
  if (!rootNavigationState?.key) return null;
  // Only redirect once we have the auth state
  if (!authState?.authenticated) {
    return <Redirect href="/(root)/(tabs)/home" />;
  }

  switch (authState.role?.toLowerCase()) {
    case "admin":
      return <Redirect href="/(adminroot)/(tabs)/home" />;
    case "student":
      return <Redirect href="/(studentroot)/(tabs)/home" />;
    default:
      return <Redirect href="/(root)/(tabs)/home" />;
  }
}
