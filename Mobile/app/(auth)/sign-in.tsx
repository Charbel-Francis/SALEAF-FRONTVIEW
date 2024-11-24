import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  Keyboard,
  StyleSheet,
  Platform,
  TextInput,
  Pressable,
  Animated,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import CustomButton from "@/components/CustomButton";
import { useAuth } from "@/context/JWTContext";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

// Enhanced Input Component
interface ModernInputProps extends React.ComponentProps<typeof TextInput> {
  label: string;
  icon?: React.ReactNode;
  error?: string;
  touched?: boolean;
  secureTextEntry?: boolean;
}

const ModernInput = ({
  label,
  icon,
  error,
  touched,
  secureTextEntry = false,
  ...props
}: ModernInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);
  const animatedLabelPosition = new Animated.Value(props.value ? 1 : 0);

  interface AnimationConfig {
    toValue: number;
    duration: number;
    useNativeDriver: boolean;
  }

  const animateLabel = (toValue: number): void => {
    Animated.timing(animatedLabelPosition, {
      toValue,
      duration: 200,
      useNativeDriver: false,
    } as AnimationConfig).start();
  };

  const labelStyle = {
    position: "absolute" as const,
    left: wp("12%"),
    top: animatedLabelPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [hp("2%"), hp("0.5%")],
    }),
    fontSize: animatedLabelPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [wp("4%"), wp("3%")],
    }),
    color: isFocused ? "#15783D" : "#666",
  };

  return (
    <View style={inputStyles.container}>
      <Animated.Text style={labelStyle}>{label}</Animated.Text>
      <View
        style={[
          inputStyles.inputContainer,
          isFocused && inputStyles.focused,
          error && touched ? inputStyles.error : null,
        ]}
      >
        <View style={inputStyles.iconContainer}>{icon}</View>
        <TextInput
          {...props}
          style={inputStyles.input}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          onFocus={() => {
            setIsFocused(true);
            animateLabel(1);
          }}
          onBlur={() => {
            setIsFocused(false);
            if (!props.value) {
              animateLabel(0);
            }
          }}
          placeholderTextColor="#999"
        />
        {secureTextEntry && (
          <Pressable
            style={inputStyles.iconContainer}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            <Ionicons
              name={isPasswordVisible ? "eye-off" : "eye"}
              size={wp("5%")}
              color="grey"
            />
          </Pressable>
        )}
      </View>
    </View>
  );
};

const inputStyles = StyleSheet.create({
  container: {
    marginBottom: hp("3%"),
    height: hp("8%"),
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
    borderRadius: wp("3%"),
    paddingHorizontal: wp("2%"),
    height: hp("7%"),
    backgroundColor: "#F8F9FA",
  },
  focused: {
    borderColor: "#15783D",
    backgroundColor: "#FFFFFF",
    shadowColor: "#15783D",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  error: {
    borderColor: "#DC3545",
  },
  input: {
    flex: 1,
    fontSize: wp("4%"),
    color: "#000000",
    paddingHorizontal: wp("2%"),
  },
  iconContainer: {
    padding: wp("2%"),
  },
});

// Form validation schema
const SignInSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

// TypeScript interfaces
interface FormValues {
  email: string;
  password: string;
  general?: string;
}

interface FormikHelpers {
  setSubmitting: (isSubmitting: boolean) => void;
  setFieldError: (field: string, message: string) => void;
}

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
      marginBottom: hp("4%"),
    },
    title: {
      fontSize: wp("12%"),
      fontWeight: "bold",
      color: "#15783D",
      marginBottom: hp("1%"),
    },
    subtitle: {
      fontSize: wp("4.5%"),
      color: "#666",
    },
    inputContainer: {
      width: "100%",
      marginBottom: hp("3%"),
    },
    buttonContainer: {
      width: "100%",
      marginTop: hp("2%"),
    },
    signInButton: {
      height: hp("6%"),
      backgroundColor: "#15783D",
      borderRadius: wp("3%"),
    },
    errorText: {
      color: "#DC3545",
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

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting, setFieldError }: FormikHelpers
  ): Promise<boolean> => {
    setLoading(true);
    try {
      if (onLogin) {
        const results = await onLogin(values.email, values.password);
        if (!results) {
          setFieldError(
            "general",
            "Login failed. Please check your credentials."
          );
          return false;
        }
        if (results.error) {
          setFieldError("general", "Email or Password incorrect");
          return false;
        }
        return true;
      }
      return false;
    } catch (error) {
      setFieldError("general", "An error occurred during sign in.");
      return false;
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
        initialValues={{ email: "", password: "", general: "" }}
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
              <ModernInput
                label="Email"
                placeholder="Enter your email"
                textContentType="emailAddress"
                value={values.email}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                icon={<Ionicons name="mail" size={wp("5%")} color="grey" />}
                error={errors.email}
                touched={touched.email}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {touched.email && errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}

              <ModernInput
                label="Password"
                placeholder="Enter your password"
                textContentType="password"
                secureTextEntry={true}
                value={values.password}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                icon={
                  <Ionicons name="lock-closed" size={wp("5%")} color="grey" />
                }
                error={errors.password}
                touched={touched.password}
                autoCapitalize="none"
                autoCorrect={false}
              />
              {touched.password && errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
              {errors.general && (
                <Text style={styles.errorText}>{errors.general}</Text>
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
