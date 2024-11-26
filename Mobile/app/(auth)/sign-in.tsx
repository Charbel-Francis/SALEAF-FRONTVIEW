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
  Linking,
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
      {error && touched && <Text style={inputStyles.errorText}>{error}</Text>}
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
  errorText: {
    color: "#DC3545",
    fontSize: wp("3.5%"),
    marginTop: hp("0.5%"),
    marginLeft: wp("2%"),
  },
}); // Form validation schema
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

  const handleForgotPassword = async () => {
    const forgotPasswordUrl =
      "https://saleaffrontend-production.up.railway.app/forgot-password"; // Replace with your actual forgot password URL
    try {
      const supported = await Linking.canOpenURL(forgotPasswordUrl);
      if (supported) {
        await Linking.openURL(forgotPasswordUrl);
      } else {
        console.log("Cannot open URL: " + forgotPasswordUrl);
      }
    } catch (error) {
      console.error("An error occurred while opening the URL:", error);
    }
  };

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
            "email",
            "Login failed. Please check your credentials."
          );
          return;
        }
        if (results.error) {
          setFieldError("email", "Email or Password incorrect");
          return;
        }
      }
    } catch (error) {
      setFieldError("email", "An error occurred during sign in.");
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

      <Formik<FormValues>
        initialValues={{
          email: "",
          password: "",
          general: undefined,
        }}
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
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <ModernInput
                label="Email"
                placeholder="Enter your email"
                textContentType="emailAddress"
                value={values.email}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                icon={<Ionicons name="mail" size={wp("5%")} color="grey" />}
                error={touched.email ? errors.email : undefined}
                touched={touched.email}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />

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
                error={touched.password ? errors.password : undefined}
                touched={touched.password}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <Pressable
              onPress={handleForgotPassword}
              style={styles.forgotPasswordContainer}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </Pressable>

            {errors.general && (
              <Text style={[styles.errorText, styles.generalError]}>
                {errors.general}
              </Text>
            )}

            <View style={styles.buttonContainer}>
              <CustomButton
                onPress={handleSubmit}
                loading={loading || isSubmitting}
                title="Sign In"
                style={styles.signInButton}
              />
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
};

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
  formContainer: {
    width: "100%",
    alignItems: "center",
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
    marginBottom: hp("1%"), // Reduced to make space for forgot password
  },
  forgotPasswordContainer: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: hp("2%"),
  },
  forgotPasswordText: {
    color: "#15783D",
    fontSize: wp("3.5%"),
    textDecorationLine: "underline",
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
  generalError: {
    textAlign: "center",
    marginBottom: hp("2%"),
  },
});

export default SignInModal;
