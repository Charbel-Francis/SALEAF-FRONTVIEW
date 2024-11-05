import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  Image,
  Modal,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DualInputField, InputField } from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import { images } from "@/constants";
import {
  EmailIcon,
  LockIcon,
  SVGTopLogin,
} from "@/assets/authImages/SVGs";
import { useAuth } from "@/context/JWTContext";
import Ionicons from "react-native-vector-icons/Ionicons";

interface SignInModalProps {
  visible: boolean;
  onClose: () => void;
  openSignUp: () => void; // New prop to open sign-up modal
}

const SignInModal = ({ visible, onClose, openSignUp }: SignInModalProps) => {
  const { onLogin } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const login = async () => {
    setLoading(true);
    if (onLogin) {
      const results = await onLogin(form.email, form.password);
      if (results) {
        setLoading(false);
        Alert.prompt("No file selected", "Please select a file to upload.");
        onClose();
      }
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <SafeAreaView className="flex-1 justify-end">
            <TouchableWithoutFeedback>
              <View className="bg-white rounded-t-2xl">
                <TouchableOpacity
                  onPress={onClose}
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    zIndex: 1,
                  }}
                >
                  <Ionicons name="close" size={24} color="black" />
                </TouchableOpacity>

                {/* Header with SVG and Logo */}
                <View className="relative w-full h-[250px] flex-row overflow-hidden rounded-t-2xl">
                  <View className="flex-1">
                    <SVGTopLogin />
                  </View>
                  <View className="justify-start items-end pr-4 pt-3 top-10 left-10">
                    <Image source={images.clearLogo} style={{ width: 150, height: 100 }} />
                  </View>
                  <View className="absolute bottom-[80] left-0 right-0 flex items-center">
                    <Text className="text-2xl text-black font-bold">Hello</Text>
                    <Text className="text-black">Sign in to your account</Text>
                  </View>
                </View>

                {/* Input Fields */}
                <View className="px-4 py-2 bottom-[75]">
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

                {/* Submit Button and Sign-Up Link */}
                <View className="px-4 pb-4 bottom-[60]">
                  <CustomButton
                    onPress={login}
                    loading={loading}
                    title="Sign In"
                    className="bg-mainColor"
                  />
                  <View className="mt-3">
                    <Text className="text-base text-blue-500 text-right">
                      Don't have an account?{" "}
                      <TouchableOpacity onPress={openSignUp}>
                        <Text style={{ color: "blue", textDecorationLine: "underline" }}>
                          Sign Up
                        </Text>
                      </TouchableOpacity>
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </SafeAreaView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default SignInModal;
