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

interface SignUpModalProps {
  visible: boolean;
  onClose: () => void;
  openSignIn: () => void;
}

const SignUpModal = () => {
  const { onRegister } = useAuth();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
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
      height: hp("90%"),
    },
    closeButton: {
      position: "absolute",
      top: hp("1.5%"),
      right: wp("4%"),
      zIndex: 1,
    },
    headerContainer: {
      width: "100%",
      height: hp("25%"),
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
      top: hp("5%"),
      right: wp("4%"),
    },
    logo: {
      width: wp("35%"),
      height: hp("12%"),
      resizeMode: "contain",
    },
    contentContainer: {
      position: "absolute",
      top: hp("15%"),
      left: 0,
      right: 0,
      height: hp("75%"),
      alignItems: "center",
      paddingHorizontal: wp("4%"),
    },
    titleContainer: {
      alignItems: "center",
      marginBottom: hp("3%"),
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
      marginBottom: hp("2%"),
    },
    input: {
      height: hp("2%"),
    },

    buttonContainer: {
      width: "100%",
      marginTop: hp("2%"),
    },
    signUpButton: {
      height: hp("6%"),
      backgroundColor: "#15783D",
    },
    signInContainer: {
      marginTop: hp("3%"),
      flexDirection: "row",
      alignItems: "center",
    },
    signInText: {
      fontSize: wp("4%"),
      color: "#3B82F6",
    },
    signInLink: {
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

  const register = async () => {
    setLoading(true);
    if (onRegister) {
      const results = await onRegister(
        form.firstName,
        form.lastName,
        form.email,
        form.password
      );
      if (results) {
        setLoading(false);
      }
    }
  };

  return (
    <View style={styles.contentContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>Create your account</Text>
      </View>

      <View style={styles.inputContainer}>
        <View>
          <DualInputField
            label1="First Name"
            label2="Last Name"
            placeholder1="First Name"
            placeholder2="Last Name"
            value1={form.firstName}
            value2={form.lastName}
            onChange1={(value) => setForm({ ...form, firstName: value })}
            onChange2={(value) => setForm({ ...form, lastName: value })}
            icon1={<Ionicons name="person" size={wp("5%")} color="grey" />}
            icon2={<Ionicons name="person" size={wp("5%")} color="grey" />}
          />
        </View>

        <InputField
          label="Email"
          placeholder="Enter Email"
          textContentType="emailAddress"
          value={form.email}
          icon={<Ionicons name="mail" size={wp("5%")} color="grey" />}
          style={styles.input}
          onChangeText={(value) => setForm({ ...form, email: value })}
        />

        <InputField
          label="Password"
          placeholder="Enter Password"
          textContentType="password"
          secureTextEntry={true}
          icon={<Ionicons name="lock-closed" size={wp("5%")} color="grey" />}
          style={styles.input}
          value={form.password}
          onChangeText={(value) => setForm({ ...form, password: value })}
        />

        <InputField
          label="Confirm Password"
          placeholder="Confirm Password"
          textContentType="password"
          secureTextEntry={true}
          icon={<Ionicons name="lock-closed" size={wp("5%")} color="grey" />}
          style={styles.input}
          value={form.confirmPassword}
          onChangeText={(value) => setForm({ ...form, confirmPassword: value })}
        />
      </View>

      <View style={styles.buttonContainer}>
        <CustomButton
          onPress={register}
          loading={loading}
          title="Sign Up"
          style={styles.signUpButton}
        />
      </View>
    </View>
  );
};

export default SignUpModal;
