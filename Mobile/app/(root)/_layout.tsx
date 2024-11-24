import FloatingChatbot from "@/components/chatbot/ChatBot";
import { Stack } from "expo-router";
import { View } from "react-native";

const Layout = () => {
  return (
    <View style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <FloatingChatbot />
    </View>
  );
};

export default Layout;
