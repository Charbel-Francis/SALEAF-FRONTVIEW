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
  StyleSheet,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DualInputField, InputField } from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import { images } from "@/constants";
import { EmailIcon, LockIcon, SVGTopLogin } from "@/assets/authImages/SVGs";
import { useAuth } from "@/context/JWTContext";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

interface SignInModalProps {
  visible: boolean;
  onClose: () => void;
  openSignUp: () => void;
}

const SignInModal = ({ visible, onClose, openSignUp }: SignInModalProps) => {
  const { onLogin } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
    },
    modalContainer: {
      backgroundColor: "white",
      borderTopLeftRadius: wp("6%"),
      borderTopRightRadius: wp("6%"),
      height: hp("85%"),
    },
    closeButton: {
      position: "absolute",
      top: hp("1.5%"),
      right: wp("4%"),
      zIndex: 1,
    },
    headerContainer: {
      width: hp("50px"),
      height: hp("30%"),
      flexDirection: "row",
      overflow: "hidden",
      borderTopLeftRadius: wp("6%"),
      borderTopRightRadius: wp("6%"),
    },
    svgContainer: {
      flex: 1,
    },
    logoContainer: {
      position: "absolute",
      top: hp("8%"),
      right: wp("4%"),
    },
    logo: {
      width: wp("35%"),
      height: hp("12%"),
      resizeMode: "contain",
    },
    contentContainer: {
      position: "absolute",
      top: hp("20%"),
      left: 0,
      right: 0,
      height: hp("65%"),
      alignItems: "center",
      paddingHorizontal: wp("4%"),
    },
    titleContainer: {
      alignItems: "center",
      marginBottom: hp("1%"),
    },
    title: {
      fontSize: wp("12%"),
      fontWeight: "bold",
      color: "black",
      marginBottom: hp("1%"),
    },
    subtitle: {
      fontSize: wp("4.5%"),
      color: "black",
    },
    inputContainer: {
      width: "100%",
      marginBottom: hp("3%"),
    },
    input: {
      height: hp("2%"),
      marginBottom: hp("0%"),
    },
    buttonContainer: {
      width: "100%",
      marginTop: hp("2%"),
    },
    signInButton: {
      height: hp("6%"),
      backgroundColor: "#15783D",
    },
    signUpContainer: {
      marginTop: hp("4%"),
      flexDirection: "row",
      alignItems: "center",
    },
    signUpText: {
      fontSize: wp("4%"),
    },
    signUpLink: {
      color: "#3B82F6",
      textDecorationLine: "underline",
      marginLeft: wp("1%"),
    },
  });

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

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
        <View style={styles.overlay}>
          <SafeAreaView style={{ flex: 1, justifyContent: "flex-end" }}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={{ flex: 1, justifyContent: "flex-end" }}
            >
              <TouchableWithoutFeedback>
                <View style={styles.modalContainer}>
                  <TouchableOpacity
                    onPress={onClose}
                    style={styles.closeButton}
                  >
                    <Ionicons name="close" size={wp("6%")} color="black" />
                  </TouchableOpacity>

                  <View style={styles.headerContainer}>
                    <View style={styles.svgContainer}>
                      <SVGTopLogin />
                    </View>
                  </View>

                  <View style={styles.logoContainer}>
                    <Image source={images.clearLogo} style={styles.logo} />
                  </View>

                  <View style={styles.contentContainer}>
                    <View style={styles.titleContainer}>
                      <Text style={styles.title}>Hello</Text>
                      <Text style={styles.subtitle}>
                        Sign in to your account
                      </Text>
                    </View>

                    <View style={styles.inputContainer}>
                      <InputField
                        label="Email"
                        placeholder="Enter Email"
                        textContentType="emailAddress"
                        value={form.email}
                        icon={
                          <Ionicons name="mail" size={wp("5%")} color="grey" />
                        }
                        style={styles.input}
                        onChangeText={(value) =>
                          setForm({ ...form, email: value })
                        }
                      />
                      <InputField
                        label="Password"
                        placeholder="Enter Password"
                        textContentType="password"
                        secureTextEntry={true}
                        icon={
                          <Ionicons
                            name="lock-closed"
                            size={wp("5%")}
                            color="grey"
                          />
                        }
                        style={styles.input}
                        value={form.password}
                        onChangeText={(value) =>
                          setForm({ ...form, password: value })
                        }
                      />
                    </View>

                    <View style={styles.buttonContainer}>
                      <CustomButton
                        onPress={login}
                        loading={loading}
                        title="Sign In"
                        style={styles.signInButton}
                      />

                      <View style={styles.signUpContainer}>
                        <Text style={styles.signUpText}>
                          Don't have an account?
                        </Text>
                        <TouchableOpacity onPress={openSignUp}>
                          <Text style={styles.signUpLink}>Sign Up</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default SignInModal;
