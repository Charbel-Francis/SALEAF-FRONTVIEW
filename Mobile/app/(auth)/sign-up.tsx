import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  Animated,
  TextInput,
  Pressable,
} from "react-native";
import { useAuth } from "@/context/JWTContext";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import CustomButton from "@/components/CustomButton";

// Modern Input Component (same as before)
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

  const labelStyle: Animated.WithAnimatedObject<any> = {
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

// Modern Dual Input Component for First Name and Last Name
interface ModernDualInputProps extends React.ComponentProps<typeof TextInput> {
  label1: string;
  label2: string;
  value1: string;
  value2: string;
  onChange1: (value: string) => void;
  onChange2: (value: string) => void;
  icon1?: React.ReactNode;
  icon2?: React.ReactNode;
  error1?: string;
  error2?: string;
  touched1?: boolean;
  touched2?: boolean;
  placeholder1?: string;
  placeholder2?: string;
}

const ModernDualInput = ({
  label1,
  label2,
  value1,
  value2,
  onChange1,
  onChange2,
  icon1,
  icon2,
  error1,
  error2,
  touched1,
  touched2,
  ...props
}: ModernDualInputProps) => {
  const [isFocused1, setIsFocused1] = useState(false);
  const [isFocused2, setIsFocused2] = useState(false);
  const animatedLabelPosition1 = new Animated.Value(value1 ? 1 : 0);
  const animatedLabelPosition2 = new Animated.Value(value2 ? 1 : 0);

  interface AnimationConfig {
    toValue: number;
    duration: number;
    useNativeDriver: boolean;
  }

  const animateLabel = (animation: Animated.Value, toValue: number): void => {
    Animated.timing(animation, {
      toValue,
      duration: 200,
      useNativeDriver: false,
    } as AnimationConfig).start();
  };

  interface LabelStyle {
    position: "absolute";
    left: number;
    top: Animated.AnimatedInterpolation<number>;
    fontSize: Animated.AnimatedInterpolation<number>;
    color: string;
  }

  const createLabelStyle = (animation: Animated.Value): LabelStyle => ({
    position: "absolute",
    left: wp("12%"),
    top: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [hp("2%"), hp("0.5%")],
    }),
    fontSize: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [wp("4%"), wp("3%")],
    }),
    color: "#666",
  });

  return (
    <View style={dualInputStyles.container}>
      <View style={dualInputStyles.inputWrapper}>
        <Animated.Text style={createLabelStyle(animatedLabelPosition1)}>
          {label1}
        </Animated.Text>
        <View
          style={[
            dualInputStyles.input,
            isFocused1 && dualInputStyles.focused,
            error1 && touched1 ? dualInputStyles.error : null,
          ]}
        >
          <View style={dualInputStyles.iconContainer}>{icon1}</View>
          <TextInput
            {...props}
            style={dualInputStyles.textInput}
            value={value1}
            onChangeText={onChange1}
            onFocus={() => {
              setIsFocused1(true);
              animateLabel(animatedLabelPosition1, 1);
            }}
            onBlur={() => {
              setIsFocused1(false);
              if (!value1) {
                animateLabel(animatedLabelPosition1, 0);
              }
            }}
            placeholderTextColor="#999"
          />
        </View>
      </View>

      <View style={dualInputStyles.inputWrapper}>
        <Animated.Text style={createLabelStyle(animatedLabelPosition2)}>
          {label2}
        </Animated.Text>
        <View
          style={[
            dualInputStyles.input,
            isFocused2 && dualInputStyles.focused,
            error2 && touched2 ? dualInputStyles.error : null,
          ]}
        >
          <View style={dualInputStyles.iconContainer}>{icon2}</View>
          <TextInput
            {...props}
            style={dualInputStyles.textInput}
            value={value2}
            onChangeText={onChange2}
            onFocus={() => {
              setIsFocused2(true);
              animateLabel(animatedLabelPosition2, 1);
            }}
            onBlur={() => {
              setIsFocused2(false);
              if (!value2) {
                animateLabel(animatedLabelPosition2, 0);
              }
            }}
            placeholderTextColor="#999"
          />
        </View>
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

const dualInputStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: hp("3%"),
  },
  inputWrapper: {
    width: "48%",
    height: hp("8%"),
  },
  input: {
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
  textInput: {
    flex: 1,
    fontSize: wp("4%"),
    color: "#000000",
    paddingHorizontal: wp("2%"),
  },
  iconContainer: {
    padding: wp("2%"),
  },
});

const SignUpModal = () => {
  const { onRegister } = useAuth();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    isStudent: false,
  });
  const [loading, setLoading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [toggleAnimation] = useState(new Animated.Value(0));

  const styles = StyleSheet.create({
    contentContainer: {
      position: "absolute",
      top: hp("8%"),
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
      color: "#15783D",
      marginBottom: hp("1%"),
    },
    subtitle: {
      fontSize: wp("4.5%"),
      color: "#666",
    },
    inputContainer: {
      width: "100%",
      marginBottom: hp("2%"),
    },
    buttonContainer: {
      width: "100%",
    },
    signUpButton: {
      height: hp("6%"),
      backgroundColor: "#15783D",
      borderRadius: wp("3%"),
    },
    toggleContainer: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: hp("2%"),
      marginBottom: hp("2%"),
    },
    toggleLabel: {
      fontSize: wp("4%"),
      color: "#374151",
      fontWeight: "500",
    },
    toggleWrapper: {
      width: wp("12%"),
      height: hp("3%"),
      borderRadius: hp("1.5%"),
      backgroundColor: "#D1D5DB",
      padding: 2,
    },
    toggleWrapperActive: {
      backgroundColor: "#15783D",
    },
    toggleCircle: {
      width: hp("2.6%"),
      height: hp("2.6%"),
      backgroundColor: "white",
      borderRadius: hp("1.3%"),
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    studentIcon: {
      marginRight: wp("2%"),
    },
    toggleLabelContainer: {
      flexDirection: "row",
      alignItems: "center",
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

  const toggleSwitch = () => {
    const toValue = form.isStudent ? 0 : 1;
    Animated.spring(toggleAnimation, {
      toValue,
      useNativeDriver: true,
      speed: 20,
      bounciness: 8,
    }).start();

    setForm((prev) => ({ ...prev, isStudent: !prev.isStudent }));
  };

  const translateX = toggleAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [2, wp("7%")],
  });

  const register = async () => {
    setLoading(true);
    if (onRegister) {
      const results = await onRegister(
        form.firstName,
        form.lastName,
        form.email,
        form.password,
        form.isStudent
      );
      if (results) {
        setLoading(false);
      }
    }
  };

  const renderToggle = () => (
    <View style={styles.toggleContainer}>
      <View style={styles.toggleLabelContainer}>
        <Ionicons
          name="school"
          size={wp("5%")}
          color="grey"
          style={styles.studentIcon}
        />
        <Text style={styles.toggleLabel}>Register as Student</Text>
      </View>
      <TouchableOpacity activeOpacity={0.8} onPress={toggleSwitch}>
        <View
          style={[
            styles.toggleWrapper,
            form.isStudent && styles.toggleWrapperActive,
          ]}
        >
          <Animated.View
            style={[
              styles.toggleCircle,
              {
                transform: [
                  {
                    translateX,
                  },
                ],
              },
            ]}
          />
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.contentContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>Create your account</Text>
      </View>

      <View style={styles.inputContainer}>
        <ModernDualInput
          label1="First Name"
          label2="Last Name"
          value1={form.firstName}
          value2={form.lastName}
          onChange1={(value) => setForm({ ...form, firstName: value })}
          onChange2={(value) => setForm({ ...form, lastName: value })}
          icon1={<Ionicons name="person" size={wp("5%")} color="grey" />}
          icon2={<Ionicons name="person" size={wp("5%")} color="grey" />}
          placeholder1="Enter first name"
          placeholder2="Enter last name"
        />

        <ModernInput
          label="Email"
          placeholder="Enter your email"
          textContentType="emailAddress"
          value={form.email}
          onChangeText={(value) => setForm({ ...form, email: value })}
          icon={<Ionicons name="mail" size={wp("5%")} color="grey" />}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <ModernInput
          label="Password"
          placeholder="Enter your password"
          textContentType="password"
          secureTextEntry={true}
          value={form.password}
          onChangeText={(value) => setForm({ ...form, password: value })}
          icon={<Ionicons name="lock-closed" size={wp("5%")} color="grey" />}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <ModernInput
          label="Confirm Password"
          placeholder="Confirm your password"
          textContentType="password"
          secureTextEntry={true}
          value={form.confirmPassword}
          onChangeText={(value) => setForm({ ...form, confirmPassword: value })}
          icon={<Ionicons name="lock-closed" size={wp("5%")} color="grey" />}
          autoCapitalize="none"
          autoCorrect={false}
        />

        {renderToggle()}
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
