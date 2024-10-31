import {
  ScrollView,
  Text,
  View,
  Image,
  Pressable,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { DualInputField, InputField } from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import { Defs, LinearGradient, Path, Stop, Svg } from "react-native-svg";
import { images } from "@/constants";
import {
  EmailIcon,
  LockIcon,
  SVGBottom,
  SVGTopLogin,
  SVGTopSignUp,
  UserIcon,
} from "@/assets/authImages/SVGs";
import { Link, router, useRouter } from "expo-router";
import { SocialIcon } from "react-native-elements";
import { useAuth } from "@/context/JWTContext";

const SignIn = () => {
  const { onLogin } = useAuth();
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });
  const router = useRouter();
  const login = async () => {
    if (onLogin) {
      const results = await onLogin(form.email, form.password);
      console.log(results);
    }
  };
  return (
    <KeyboardAvoidingView className="flex-1 bg-white">
      <View className="relative w-full h-[250px] flex-row">
        <View className="flex-1">
          <SVGTopLogin />
        </View>
        <View className="absolute mt-30 bottom-0 left-0 right-0 flex items-center">
          <View className="justify-start items-end pr-0 pt-5">
            <Image
              source={images.clearLogo}
              style={{ width: 120, height: 100 }}
            />
          </View>
          <Text className="text-5xl text-black font-sans">Hello</Text>
          <Text className=" text-black font-sans">Sign in to your account</Text>
        </View>
      </View>
      <View className="py-2 px-4 ">
        <InputField
          label="Email"
          placeholder="Enter Email"
          textContentType="emailAddress"
          value={form.email}
          icon={<EmailIcon />}
          onChangeText={(value) => setForm({ ...form, email: value })}
        />
        <InputField
          label="Password"
          placeholder="Enter Password"
          textContentType="password"
          secureTextEntry={true}
          icon={<LockIcon />}
          value={form.password}
          onChangeText={(value) => setForm({ ...form, password: value })}
        />
      </View>
      <View className="pt-3 pr-5 pl-5">
        <View className="flex-2 justify-end">
          <CustomButton
            onPress={() => {
              login();
            }}
            title="Sign In"
          />
          <View className="mt-4 mr-5">
            <Text className="text-1 text-blue-500 font-sans text-right">
              Don't have an account?{" "}
              <Pressable onPress={() => router.push("/(auth)/sign-up")}>
                <Text
                  style={{ color: "blue", textDecorationLine: "underline" }}
                >
                  Sign Up
                </Text>
              </Pressable>
            </Text>
          </View>
        </View>
        <View className="relative flex items-center my-2 pl-2">
          <View className="absolute left-0 right-0 top-1/2 border-t border-gray-300 w-full " />
          <Text className="bg-white px-4 text-gray-500">OR</Text>
        </View>
        <View className="flex-col items-center">
          <Text>Sign create an account</Text>
          <View className="flex-row ">
            <SocialIcon type="facebook" />
            <SocialIcon type="google" />
            <SocialIcon type="apple" light />
          </View>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingBottom: "10%",
        }}
      >
        <View style={{ transform: [{ rotateY: "0deg" }] }}>
          <SVGBottom />
        </View>
        <View style={{ transform: [{ rotateY: "180deg" }] }}>
          <SVGBottom />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SignIn;
