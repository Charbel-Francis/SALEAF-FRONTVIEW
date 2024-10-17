import { ScrollView, Text, View, Image } from "react-native";
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
  SVGTopSignUp,
  UserIcon,
} from "@/assets/authImages/SVGs";
import { Link, router } from "expo-router";
import { SocialIcon, Switch } from "react-native-elements";
import { useAuth } from "@/context/JWTContext";

const SignUp = () => {
  const { onRegister } = useAuth();
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    isStudent: false,
  });

  const toggleSwitch = () =>
    setForm((prevForm) => ({ ...prevForm, isStudent: !prevForm.isStudent }));

  const Signup = async () => {
    if (onRegister) {
      const results = await onRegister(
        form.firstname,
        form.lastname,
        form.email,
        form.password
      );
      console.log(results);
    }
  };
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="relative w-full h-[180px] flex-row">
        {/* SVG on the left */}
        <View className="flex-1">
          <SVGTopSignUp />
        </View>
        {/* Image on the right */}
        <View className="justify-start items-end pr-0 pt-5">
          <Image
            source={images.clearLogo}
            style={{ width: 150, height: 100 }}
          />
        </View>
        {/* Text positioned at the bottom and centered horizontally */}
        <View className="absolute bottom-5 left-0 right-0 flex items-center">
          <Text className="text-2xl text-black font-sans font-bold">
            Create Your Account
          </Text>
        </View>
      </View>
      <View className="py-3 p-3">
        <DualInputField
          label1="First Name"
          label2="Last Name"
          icon1={<UserIcon />}
          icon2={<UserIcon />}
          onChangeFirstName={(value) => {
            setForm({ ...form, firstname: value });
          }}
          onChangeLastName={(value) => {
            setForm({ ...form, lastname: value });
          }}
        />
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
        <View className="flex-row items-center mt-4">
          <Text className="mr-2">Student</Text>
          <Switch value={form.isStudent} onValueChange={toggleSwitch} />
        </View>
      </View>
      <View className="pt-3 pr-4 pl-4">
        <View className="flex-1 justify-end">
          <CustomButton
            onPress={() => {
              Signup();
            }}
            title="Create Account"
          />
          <View className="mt-4 mr-5">
            <Text className="text-1 text-blue-500 font-sans  text-right">
              Already have an account?{" "}
              <Link
                href="/(auth)/sign-in"
                style={{ color: "blue", textDecorationLine: "underline" }}
              >
                Sign In
              </Link>
            </Text>
          </View>
        </View>
        <View className="relative flex items-center my-2 pl-2">
          <View className="absolute left-0 right-0 top-1/2 border-t border-gray-300 w-full " />
          <Text className="bg-white px-4 text-gray-500">OR</Text>
        </View>
      </View>
      <View className="flex-row items-center ">
        <View>
          <SVGBottom />
        </View>
        <View className="flex-row space-x-2 right-1/4 bottom-10">
          <SocialIcon type="facebook" />
          <SocialIcon type="google" />
          <SocialIcon type="apple" light />
        </View>
      </View>
    </ScrollView>
  );
};

export default SignUp;
