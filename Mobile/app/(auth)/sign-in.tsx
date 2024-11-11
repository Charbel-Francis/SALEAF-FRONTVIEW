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
                <View className="relative w-full h-[80%] flex-row overflow-hidden rounded-t-2xl">
                  <View className="flex-1">
                    <SVGTopLogin />
                  </View>
                  <View className="justify-start items-end pr-4 pt-3 top-10 left-10">
                    <Image source={images.clearLogo} style={{ width: 150, height: 100 }} />
                  </View>

                  <View className="flex-col absolute top-[10vh] left-0 right-0 flex h-[80%] items-center">
                    <View className="absolute items-center flex-1">
                      <Text className="text-5xl text-black font-bold">Hello</Text>
                      <Text className="text-black text-xl">Sign in to your account</Text>
                    </View>
                    <View className="px-4 w-full justify-center flex-1">
                      <InputField
                        label="Email"
                        placeholder="Enter Email"
                        textContentType="emailAddress"
                        value={form.email}
                        icon={<Ionicons name="mail" size={20} color="grey" />}
                        className="h-10"
                        onChangeText={(value) => setForm({ ...form, email: value })}
                      />
                      <InputField
                        label="Password"
                        placeholder="Enter Password"
                        textContentType="password"
                        secureTextEntry={true}
                        className="h-10"
                        icon={<Ionicons name="lock-closed" size={20} color="grey" />}
                        value={form.password}
                        onChangeText={(value) => setForm({ ...form, password: value })}
                      />
                    </View>
                    <View className="px-4 pb-4 w-full">
                      <CustomButton
                        onPress={login}
                        loading={loading}
                        title="Sign In"
                        className="bg-mainColor h-[50px]"
                      />
                      <View className="mt-10">
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
