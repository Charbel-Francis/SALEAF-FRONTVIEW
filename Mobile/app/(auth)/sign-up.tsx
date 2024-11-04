import React, { useState, useEffect, useRef } from "react";
import { Text, View, Image, Modal, TouchableOpacity, Keyboard, TouchableWithoutFeedback, Animated, Easing } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DualInputField, InputField } from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import { images } from "@/constants";
import { EmailIcon, LockIcon, SVGTopSignUp, UserIcon } from "@/assets/authImages/SVGs";
import { useAuth } from "@/context/JWTContext";
import Ionicons from "react-native-vector-icons/Ionicons";

interface SignUpModalProps {
  visible: boolean;
  onClose: () => void;
  openSignIn: () => void;
}

const SignUpModal = ({ visible, onClose, openSignIn }: SignUpModalProps) => {
  const { onRegister } = useAuth();
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    isStudent: false,
  });
  const [loading, setLoading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // Animated values for modal
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity
  const slideAnim = useRef(new Animated.Value(100)).current; // Initial position

  // Listen for keyboard events
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

  const Signup = async () => {
    setLoading(true);
    if (onRegister) {
      const results = await onRegister(
        form.firstname,
        form.lastname,
        form.email,
        form.password
      );
      if (results) {
        setLoading(false);
        onClose(); // Close the modal after successful registration
      }
    }
  };

  // Open modal animation
  const openModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  // Close modal animation
  const closeModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    Animated.timing(slideAnim, {
      toValue: 100,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      onClose(); // Call the onClose function after animation completes
    });
  };

  useEffect(() => {
    if (visible) {
      openModal();
    } else {
      closeModal();
    }
  }, [visible]);

  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <SafeAreaView className="flex-1 justify-end">
            <TouchableWithoutFeedback>
              <Animated.View
                style={{
                  backgroundColor: "white",
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                  transform: [{ translateY: slideAnim }],
                  opacity: fadeAnim,
                }}
              >
                {/* Close Icon in Top-Right Corner */}
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
                    <SVGTopSignUp />
                  </View>
                  <View className="justify-start items-end pr-4 pt-3">
                    <Image source={images.clearLogo} style={{ width: 150, height: 100 }} />
                  </View>
                  <View className="absolute bottom-[80] left-0 right-0 flex items-center">
                    <Text className="text-2xl text-black font-bold">
                      Create Your Account
                    </Text>
                  </View>
                </View>

                {/* Input Fields */}
                <View className="px-4 py-2 bottom-[75]">
                  <DualInputField
                    label1="First Name"
                    label2="Last Name"
                    placeholder1="Enter First Name"
                    placeholder2="Enter Last Name"
                    icon1={<UserIcon />}
                    icon2={<UserIcon />}
                    onChange1={(value) => setForm({ ...form, firstname: value })}
                    onChange2={(value) => setForm({ ...form, lastname: value })}
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
                    secureTextEntry
                    icon={<LockIcon />}
                    value={form.password}
                    onChangeText={(value) => setForm({ ...form, password: value })}
                  />
                </View>

                {/* Submit Button and Sign-In Link */}
                <View className="px-4 pb-4 bottom-[60]">
                  <CustomButton
                    onPress={Signup}
                    loading={loading}
                    title="Create Account"
                  />
                  <View className="mt-3">
                    <Text className="text-base text-blue-500 text-right">
                      Already have an account?
                      <TouchableOpacity onPress={openSignIn}>
                        <Text style={{ color: "blue", textDecorationLine: "underline" }}>
                          Sign In
                        </Text>
                      </TouchableOpacity>
                    </Text>
                  </View>
                </View>
              </Animated.View>
            </TouchableWithoutFeedback>
          </SafeAreaView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default SignUpModal;
