import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Animated,
  StyleSheet,
  Keyboard,
  Platform,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  ToastAndroid,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator, Text } from "react-native-paper";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AcademicHistory_form from "@/components/Application Form/AcademicHistory_form";
import Additioanl_Assets_Form from "@/components/Application Form/Additional_Assets";
import Additional_Information_Form from "@/components/Application Form/Additional_Information";
import Applicants_Details from "@/components/Application Form/ApplicationDetail";
import Fixed_Assets_Form from "@/components/Application Form/Assets_Fixed";
import Vehicle_Assets_Form from "@/components/Application Form/Assets_Vehicles";
import Dependants_Form from "@/components/Application Form/Dependants_form";
import FamilyBackGround_Form from "@/components/Application Form/FamilyBackground";
import Liabilities_Form from "@/components/Application Form/Libilities_form";
import LifeAssurance_Assets_Form from "@/components/Application Form/LifeAssurance_Assets";
import Listed_Shared_Asset_Form from "@/components/Application Form/Listed_Shares_Asset_Form";
import Signature_Declaration_Form from "@/components/Application Form/Signature_Declartion_Form";
import Study_Form from "@/components/Application Form/Study_Form";
import CustomButton from "@/components/CustomButton";
import { AppUser, initialAppUser } from "@/constants";
import axiosInstance from "@/utils/config";
import { useRouter } from "expo-router";
import { isAxiosError } from "axios";
import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";

const Application_Form = () => {
  const [stepper, setStepper] = useState(0);
  const progress = useRef(new Animated.Value(0)).current;
  const [progressText, setProgressText] = useState("0%");
  const totalSteps = 12;
  const [application, setApplication] = useState<AppUser>(initialAppUser);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const buttonPosition = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#F7F9FC", // Lighter, more modern background
    },
    header: {
      paddingVertical: hp("4%"),
      paddingHorizontal: wp("4%"),
      backgroundColor: "#15783D", // Solid color instead of rgba
      borderBottomLeftRadius: wp("5%"),
      borderBottomRightRadius: wp("5%"),
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 5,
    },
    headerText: {
      fontSize: wp("5.5%"),
      color: "#fff",
      fontWeight: "700",
      textAlign: "center",
      letterSpacing: 0.5,
    },
    subHeaderText: {
      fontSize: wp("3.5%"),
      color: "#fff",
      textAlign: "center",
      marginTop: hp("1%"),
      opacity: 0.9,
      letterSpacing: 0.25,
    },
    progressContainer: {
      backgroundColor: "#fff",
      paddingVertical: hp("2%"),
      paddingHorizontal: wp("4%"),
      marginTop: hp("2%"),
      marginHorizontal: wp("4%"),
      borderRadius: wp("3%"),
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.08,
      shadowRadius: 2,
      elevation: 2,
    },
    progressBar: {
      width: wp("85%"),
      alignSelf: "center",
      marginTop: hp("1%"),
    },
    progressBackground: {
      height: hp("1.2%"),
      backgroundColor: "#E8F0E9",
      borderRadius: wp("2%"),
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      backgroundColor: "#15783D",
      borderRadius: wp("2%"),
    },
    progressText: {
      textAlign: "center",
      marginTop: hp("1%"),
      fontSize: wp("3.5%"),
      color: "#15783D",
      fontWeight: "600",
      letterSpacing: 0.5,
    },
    stepIndicator: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: hp("0.5%"),
      alignItems: "center",
    },
    stepText: {
      fontSize: wp("3.2%"),
      color: "#666",
      fontWeight: "500",
    },
    formScrollView: {
      flex: 1,
      marginTop: hp("2%"),
    },
    formContainer: {
      backgroundColor: "#fff",
      borderRadius: wp("4%"),
      marginHorizontal: wp("4%"),
      marginBottom: hp("2%"),
      padding: wp("5%"),
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.05,
      shadowRadius: 5,
      elevation: 3,
    },
    sectionTitle: {
      fontSize: wp("4.8%"),
      fontWeight: "700",
      color: "#15783D",
      marginBottom: hp("2.5%"),
      letterSpacing: 0.5,
      borderBottomWidth: 2,
      borderBottomColor: "#E8F0E9",
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-evenly",
      alignItems: "center",
      paddingVertical: hp("2%"),
      paddingHorizontal: wp("4%"),
      backgroundColor: "transparent",
      width: "100%",
    },
    button: {
      width: wp("15%"),
      height: hp("6%"),
      borderRadius: wp("2%"),
      justifyContent: "center",
      alignItems: "center",
      marginHorizontal: wp("2%"),
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 2,
    },
    submitButton: {
      width: wp("40%"),
    },
    backButton: {
      backgroundColor: "#fff",
      borderWidth: 1,
      borderColor: "rgba(21, 120, 61, 1)",
    },
    nextButton: {
      backgroundColor: "rgba(21, 120, 61, 1)",
    },
    submitText: {
      fontSize: wp("4%"),
      fontWeight: "600",
      color: "#fff",
    },
  });

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
        Animated.timing(buttonPosition, {
          toValue: 1000,
          duration: 250,
          useNativeDriver: true,
        }).start();
      }
    );

    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
        Animated.timing(buttonPosition, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }).start();
      }
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

  useEffect(() => {
    const newProgress = stepper / totalSteps;
    Animated.timing(progress, {
      toValue: newProgress,
      duration: 500,
      useNativeDriver: false,
    }).start();

    const progressListener = progress.addListener(({ value }) => {
      const percentage = Math.round(value * 100);
      setProgressText(`${percentage}%`);
    });

    return () => {
      progress.removeListener(progressListener);
    };
  }, [stepper]);

  const updateState = (updates: Partial<AppUser>) => {
    setApplication((prevUser) => ({ ...prevUser, ...updates }));
  };

  const NavigateToNextApplication = () => {
    if (stepper < totalSteps) {
      setStepper((prevStepper) => prevStepper + 1);
    }
  };

  const NavigateToPreviousApplication = () => {
    if (stepper > 0) {
      setStepper((prevStepper) => prevStepper - 1);
    }
  };

  const FinishApplication = async () => {
    if (isSubmitting) return;

    const showToast = (message: string) => {
      if (Platform.OS === "android") {
        ToastAndroid.show(message, ToastAndroid.LONG);
      } else {
        // For iOS, you might want to add Alert.alert here
        Alert.alert("Notice", message);
      }
    };

    try {
      setIsSubmitting(true);
      const response = await axiosInstance.post(
        "/api/BursaryApplication",
        application,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data) {
        showToast("Application submitted successfully!");
        router.replace("/(tabs)/home");
      }
    } catch (error: any) {
      setIsSubmitting(false);

      if (isAxiosError(error)) {
        const errorResponse = error.response?.data;

        // Handle different error scenarios
        if (error.response) {
          switch (error.response.status) {
            case 400:
              // Handle validation errors
              if (errorResponse?.errors) {
                const errorMessages = Object.entries(errorResponse.errors)
                  .map(
                    ([field, messages]) =>
                      `${field}: ${(messages as string[]).join(", ")}`
                  )
                  .join("\n");
                Alert.alert("Validation Error", errorMessages);
              } else {
                Alert.alert(
                  "Error",
                  errorResponse?.message || "Invalid form data"
                );
              }
              break;

            case 403:
              Alert.alert(
                "Access Denied",
                "You do not have permission to submit this application"
              );
              break;

            case 413:
              Alert.alert(
                "Error",
                "The application data is too large. Please reduce file sizes."
              );
              break;

            case 422:
              // Handle specific validation errors from server
              const validationErrors = errorResponse?.errors || {};
              const errorList = Object.entries(validationErrors)
                .map(([field, message]) => `${field}: ${message}`)
                .join("\n");
              Alert.alert(
                "Validation Error",
                errorList || "Please check your form data"
              );
              break;

            case 500:
              Alert.alert(
                "Server Error",
                "An unexpected error occurred. Please try again later or contact support."
              );
              break;

            default:
              Alert.alert(
                "Error",
                errorResponse?.message ||
                  "Failed to submit application. Please try again."
              );
          }
        } else if (error.request) {
          // Network error
          Alert.alert(
            "Connection Error",
            "Unable to connect to the server. Please check your internet connection and try again."
          );
        }
      } else {
        // Handle non-axios errors
        Alert.alert(
          "Error",
          "An unexpected error occurred. Please try again or contact support."
        );
        console.error("Non-axios error:", error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSectionTitle = () => {
    switch (stepper) {
      case 0:
        return "Personal Details";
      case 1:
        return "Study Information";
      case 2:
        return "Academic History";
      case 3:
        return "Additional Information";
      case 4:
        return "Family Background";
      case 5:
        return "Dependants";
      case 6:
        return "Fixed Assets";
      case 7:
        return "Vehicle Assets";
      case 8:
        return "Life Assurance";
      case 9:
        return "Listed Shares";
      case 10:
        return "Additional Assets";
      case 11:
        return "Liabilities";
      case 12:
        return "Declaration";
      default:
        return "";
    }
  };

  const renderStepContent = () => {
    switch (stepper) {
      case 0:
        return (
          <Applicants_Details
            application={application}
            updateState={updateState}
          />
        );
      case 1:
        return (
          <Study_Form application={application} updateState={updateState} />
        );
      case 2:
        return (
          <AcademicHistory_form
            application={application}
            updateState={updateState}
          />
        );
      case 3:
        return (
          <Additional_Information_Form
            application={application}
            updateState={updateState}
          />
        );
      case 4:
        return (
          <FamilyBackGround_Form
            application={application}
            updateState={updateState}
          />
        );
      case 5:
        return (
          <Dependants_Form
            application={application}
            updateState={updateState}
          />
        );
      case 6:
        return (
          <Fixed_Assets_Form
            application={application}
            updateState={updateState}
          />
        );
      case 7:
        return (
          <Vehicle_Assets_Form
            application={application}
            updateState={updateState}
          />
        );
      case 8:
        return (
          <LifeAssurance_Assets_Form
            application={application}
            updateState={updateState}
          />
        );
      case 9:
        return (
          <Listed_Shared_Asset_Form
            application={application}
            updateState={updateState}
          />
        );
      case 10:
        return (
          <Additioanl_Assets_Form
            application={application}
            updateState={updateState}
          />
        );
      case 11:
        return (
          <Liabilities_Form
            application={application}
            updateState={updateState}
          />
        );
      case 12:
        return (
          <Signature_Declaration_Form
            application={application}
            updateState={updateState}
          />
        );
      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>Bursary Application Form</Text>
        <Text style={styles.subHeaderText}>
          Complete all sections to submit your application
        </Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <Animated.View style={styles.progressBackground}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0%", "100%"],
                  }),
                },
              ]}
            />
          </Animated.View>
        </View>
        <Text style={styles.progressText}>{progressText}</Text>
        <View style={styles.stepIndicator}>
          <Text style={styles.stepText}>
            Step {stepper + 1} of {totalSteps + 1}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.formScrollView}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>{getSectionTitle()}</Text>
          {renderStepContent()}
        </View>
      </ScrollView>
      <View style={{ width: "100%" }}>
        <Animated.View
          style={[
            styles.buttonContainer,
            {
              transform: [{ translateY: buttonPosition }],
            },
          ]}
        >
          {stepper === 0 ? (
            <TouchableOpacity
              onPress={() => router.back()}
              style={[styles.button, styles.backButton]}
            >
              <MaterialIcons
                name="close"
                size={24}
                color="rgba(21, 120, 61, 1)"
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={NavigateToPreviousApplication}
              style={[styles.button, styles.backButton]}
            >
              <MaterialIcons
                name="arrow-back"
                size={24}
                color="rgba(21, 120, 61, 1)"
              />
            </TouchableOpacity>
          )}

          {stepper === 12 ? (
            <TouchableOpacity
              onPress={FinishApplication}
              style={[styles.button, styles.nextButton, styles.submitButton]}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitText}>Submit Application</Text>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={NavigateToNextApplication}
              style={[styles.button, styles.nextButton]}
            >
              <MaterialIcons name="arrow-forward" size={24} color="#fff" />
            </TouchableOpacity>
          )}
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Application_Form;
