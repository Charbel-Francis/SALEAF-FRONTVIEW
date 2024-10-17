import { useAuth } from "@/context/JWTContext";
import { Redirect } from "expo-router";

const Page = () => {
  const { authState } = useAuth();

  if (authState?.authenticated) return <Redirect href="/(root)/(tabs)/home" />;

  return <Redirect href="/(root)/(tabs)/home" />;
};

export default Page;
