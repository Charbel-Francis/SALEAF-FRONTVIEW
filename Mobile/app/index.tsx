import { useAuth } from "@/context/JWTContext";
import { Redirect } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";

const Page = () => {
  const { authState } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (authState?.authenticated) {
    return <Redirect href="/(studentroot)/(tabs)/home" />;
  }

  return <Redirect href="/(studentroot)/(tabs)/home" />;
};

export default Page;
