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
  Pressable,
  Dimensions,
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
import { BlurView } from "expo-blur";

const AuthContainer = ({
  isSignInVisible,
  setSignInVisible,
}: {
  isSignInVisible: boolean;
  setSignInVisible: (visible: boolean) => void;
}) => {
  const [authScreen, setAuthScreen] = useState("signIn");
  const { authState } = useAuth();
  const [modalAnimation] = useState(new Animated.Value(0));

  const styles = StyleSheet.create({
    container: {
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
    overlay: {
      flex: 1,
      width: "100%",
      height:
        Platform.OS === "android" ? Dimensions.get("window").height : "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
    },
    backButtonBlur: {
      width: wp("12%"),
      height: wp("12%"),
      borderRadius: wp("6%"),
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
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
    backButton: {
      position: "absolute",
      top: hp("1.5%"),
      left: wp("4%"),
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
      top: hp("2%"),
      right: wp("4%"),
    },
    logo: {
      width: wp("30%"),
      height: hp("12%"),
      resizeMode: "contain",
    },
    contentContainer: {
      position: "absolute",
      bottom: hp("2%"),
      left: 0,
      right: 0,
      alignItems: "center",
      paddingHorizontal: wp("4%"),
    },
    signUpContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: hp("4%"),
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

  const closeModal = () => {
    setSignInVisible(false);
  };

  const handleBack = () => {
    setAuthScreen("signIn");
  };

  useEffect(() => {
    if (authState?.authenticated) {
      closeModal();
    }
  }, [authState?.authenticated]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isSignInVisible}
      onRequestClose={closeModal}
    >
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.overlay}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={{ width: "100%", justifyContent: "flex-end" }}
              keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -500}
            >
              <TouchableWithoutFeedback>
                <View style={styles.modalContainer}>
                  <TouchableOpacity
                    onPress={closeModal}
                    style={styles.closeButton}
                  >
                    <Ionicons name="close" size={wp("6%")} color="black" />
                  </TouchableOpacity>

                  {authScreen === "signUp" && (
                    <Pressable
                      style={styles.backButton}
                      onPress={() => handleBack()}
                    >
                      <BlurView intensity={80} style={styles.backButtonBlur}>
                        <Ionicons
                          name="arrow-back"
                          size={wp("6%")}
                          color="black"
                        />
                      </BlurView>
                    </Pressable>
                  )}

                  <View style={styles.headerContainer}>
                    <View style={styles.svgContainer}>
                      <SVGTopLogin />
                    </View>
                  </View>

                  <View style={styles.logoContainer}>
                    <Image source={images.clearLogo} style={styles.logo} />
                  </View>

                  {authScreen === "signIn" ? <SignInModal /> : <SignUpModal />}

                  {authScreen === "signIn" && (
                    <View style={styles.contentContainer}>
                      <View style={styles.signUpContainer}>
                        <Text style={styles.signUpText}>
                          Don't have an account?
                        </Text>
                        <TouchableOpacity
                          onPress={() => setAuthScreen("signUp")}
                        >
                          <Text style={styles.signUpLink}>Sign Up</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>
              </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </Modal>
  );
};

export default AuthContainer;
