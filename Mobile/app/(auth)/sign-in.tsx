import React, { useState, useEffect } from "react";
import { Text, View, Keyboard, StyleSheet, Platform } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { InputField } from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import { useAuth } from "@/context/JWTContext";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const SignInSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const SignInModal = () => {
  const { onLogin } = useAuth();
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const styles = StyleSheet.create({
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
    errorText: {
      color: "red",
      fontSize: wp("3.5%"),
      marginTop: hp("0.5%"),
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

  interface FormValues {
    email: string;
    password: string;
  }

  interface FormikHelpers {
    setSubmitting: (isSubmitting: boolean) => void;
    setFieldError: (field: string, message: string) => void;
  }

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting, setFieldError }: FormikHelpers
  ): Promise<void> => {
    setLoading(true);
    try {
      if (onLogin) {
        const results = await onLogin(values.email, values.password);
        if (!results) {
          setFieldError(
            "general",
            "Login failed. Please check your credentials."
          );
        }
      }
    } catch (error) {
      setFieldError("general", "An error occurred during sign in.");
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.contentContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Hello</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>
      </View>

      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={SignInSchema}
        onSubmit={handleSubmit}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          isSubmitting,
        }) => (
          <>
            <View style={styles.inputContainer}>
              <InputField
                label="Email"
                placeholder="Enter Email"
                textContentType="emailAddress"
                value={values.email}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                icon={<Ionicons name="mail" size={wp("5%")} color="grey" />}
                style={styles.input}
              />
              {touched.email && errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}

              <InputField
                label="Password"
                placeholder="Enter Password"
                textContentType="password"
                secureTextEntry={true}
                value={values.password}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                icon={
                  <Ionicons name="lock-closed" size={wp("5%")} color="grey" />
                }
                style={styles.input}
              />
              {touched.password && errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
            </View>

            <View style={styles.buttonContainer}>
              <CustomButton
                onPress={handleSubmit}
                loading={loading || isSubmitting}
                title="Sign In"
                style={styles.signInButton}
              />
            </View>
          </>
        )}
      </Formik>
    </View>
  );
};

export default SignInModal;
