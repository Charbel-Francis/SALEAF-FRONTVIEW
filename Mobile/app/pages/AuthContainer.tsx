import React, { useEffect, useState } from "react";
import {
  View,
  Animated,
  Easing,
  Modal,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Image,
  TouchableOpacity,
  Platform,
  StyleSheet,
  Text,
} from "react-native";
import SignInModal from "@/app/(auth)/sign-in";
import SignUpModal from "@/app/(auth)/sign-up";
import { useAuth } from "@/context/JWTContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants";
import { SVGTopLogin } from "@/assets/authImages/SVGs";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import CustomButton from "@/components/CustomButton";
const AuthContainer = ({
  isSignInVisible,
  setSignInVisible,
}: {
  isSignInVisible: boolean;
  setSignInVisible: (visible: boolean) => void;
}) => {
  const [isSignUpVisible, setSignUpVisible] = useState(false);
  const { authState, onAnonomusLogin } = useAuth();
  const [signInOpacity] = useState(new Animated.Value(isSignInVisible ? 1 : 0));
  const [signUpOpacity] = useState(new Animated.Value(isSignUpVisible ? 1 : 0));
  const [authenicationScreen, setAuthenicationScreen] = useState("signIn");
  const authNav = (modal: string) => {
    setAuthenicationScreen(modal);
  };

  const closeModal = () => {
    setSignInVisible(false);
  };
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
      height: hp("90%"),
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
      top: hp("73%"),
      left: 0,
      right: 0,
      height: hp("65%"),
      alignItems: "flex-end",
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
      bottom: 0,
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
    if (authState?.authenticated) {
      closeModal();
    }
  }, [authState?.authenticated]);

  useEffect(() => {
    Animated.timing(signInOpacity, {
      toValue: isSignInVisible ? 1 : 0,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();

    Animated.timing(signUpOpacity, {
      toValue: isSignUpVisible ? 1 : 0, // Fixed this value (was inverted)
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, [isSignInVisible, isSignUpVisible, signInOpacity, signUpOpacity]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isSignInVisible}
      onRequestClose={closeModal}
    >
      <TouchableWithoutFeedback onPress={closeModal}>
        <View style={styles.overlay}>
          <SafeAreaView style={{ flex: 1, justifyContent: "flex-end" }}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={{ flex: 1, justifyContent: "flex-end" }}
            >
              <TouchableWithoutFeedback>
                <View style={styles.modalContainer}>
                  <TouchableOpacity
                    onPress={closeModal}
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
                  {authenicationScreen === "signIn" && <SignInModal />}
                  {authenicationScreen === "signUp" && <SignUpModal />}
                  {authenicationScreen === "signIn" && (
                    <View style={styles.contentContainer}>
                      <View style={styles.signUpContainer}>
                        <Text style={styles.signUpText}>
                          Do you have an account?
                        </Text>
                        <TouchableOpacity
                          onPress={() => {
                            authNav("signIn");
                          }}
                        >
                          <Text style={styles.signUpLink}>Sign Up</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                  {authenicationScreen === "signUp" && (
                    <View style={styles.contentContainer}>
                      <View style={styles.signUpContainer}>
                        <Text style={styles.signUpText}>
                          Already have an account?
                        </Text>
                        <TouchableOpacity
                          onPress={() => {
                            authNav("signUp");
                          }}
                        >
                          <Text style={styles.signUpLink}>Sign in</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>
              </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default AuthContainer;
