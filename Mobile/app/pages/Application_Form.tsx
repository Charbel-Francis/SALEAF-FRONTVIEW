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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "react-native-paper";
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

const Application_Form = () => {
  const [stepper, setStepper] = useState(0);
  const progress = useRef(new Animated.Value(0)).current;
  const [progressText, setProgressText] = useState("0%");
  const totalSteps = 12;
  const [application, setApplication] = useState<AppUser>(initialAppUser);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const buttonPosition = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#f5f5f5",
    },
    safeArea: {
      flex: 1,
    },
    contentContainer: {
      flex: 1,
      backgroundColor: "#fff",
    },
    header: {
      paddingVertical: hp("3%"),
      paddingHorizontal: wp("4%"),
      backgroundColor: "rgba(21, 120, 61, 0.9)",
    },
    headerText: {
      fontSize: wp("5%"),
      color: "#fff",
      fontWeight: "bold",
      textAlign: "center",
    },
    subHeaderText: {
      fontSize: wp("3.5%"),
      color: "#fff",
      textAlign: "center",
      marginTop: hp("1%"),
      opacity: 0.9,
    },
    progressContainer: {
      backgroundColor: "#fff",
      paddingVertical: hp("2%"),
      paddingHorizontal: wp("4%"),
      borderBottomWidth: 1,
      borderBottomColor: "#e0e0e0",
    },
    progressBar: {
      width: wp("90%"),
      alignSelf: "center",
      marginTop: hp("1%"),
    },
    progressBackground: {
      height: hp("1%"),
      backgroundColor: "#e0e0e0",
      borderRadius: wp("2%"),
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      backgroundColor: "rgba(21, 120, 61, 1)",
      borderRadius: wp("2%"),
    },
    progressText: {
      textAlign: "center",
      marginTop: hp("1%"),
      fontSize: wp("3.5%"),
      color: "rgba(21, 120, 61, 1)",
      fontWeight: "600",
    },
    stepIndicator: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: hp("1%"),
    },
    stepText: {
      fontSize: wp("3.5%"),
      color: "#666",
    },
    formScrollView: {
      flex: 1,
      backgroundColor: "#f5f5f5",
    },
    formContainer: {
      flex: 1,
      backgroundColor: "#fff",
      margin: wp("4%"),
      borderRadius: wp("4%"),
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
      padding: wp("4%"),
    },
    sectionTitle: {
      fontSize: wp("4.5%"),
      fontWeight: "600",
      color: "rgba(21, 120, 61, 1)",
      marginBottom: hp("2%"),
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: hp("2%"),
      backgroundColor: "#fff",
      borderTopWidth: 1,
      width: "50%",
      borderTopColor: "#e0e0e0",
    },
    button: {
      flex: 1,
      marginHorizontal: wp("2%"),
      borderRadius: wp("2%"),
      height: hp("6%"),
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 2,
    },
    backButton: {
      backgroundColor: "#fff",
      borderWidth: 1,
      borderColor: "rgba(21, 120, 61, 1)",
    },
    nextButton: {
      backgroundColor: "rgba(21, 120, 61, 1)",
    },
    buttonText: {
      fontSize: wp("4%"),
      fontWeight: "600",
    },
    backButtonText: {
      color: "rgba(21, 120, 61, 1)",
    },
    nextButtonText: {
      color: "#fff",
    },
    errorText: {
      color: "#ff3333",
      fontSize: wp("3.5%"),
      marginTop: hp("1%"),
      textAlign: "center",
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
    try {
      const response = await axiosInstance.post(
        "/api/BursaryApplication",
        application,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Application submitted successfully:", response.data);
    } catch (error: any) {
      if (error.response) {
        console.error("Server Error:", error.response.data);
        // Handle server error (e.g., show error message)
      } else if (error.request) {
        console.error("Network Error:", error.request);
        // Handle network error
      } else {
        console.error("Error:", error.message);
        // Handle other errors
      }
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
    <SafeAreaView style={styles.safeArea}>
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

        <Animated.View
          style={[
            styles.buttonContainer,
            {
              transform: [{ translateY: buttonPosition }],
            },
          ]}
        >
          {stepper === 0 ? (
            <CustomButton
              onPress={() => router.back()}
              style={[styles.button, styles.backButton]}
              textStyle={[styles.buttonText, styles.backButtonText]}
              title="Cancel"
            />
          ) : (
            <CustomButton
              onPress={NavigateToPreviousApplication}
              style={[styles.button, styles.backButton]}
              textStyle={[styles.buttonText, styles.backButtonText]}
              title="Back"
            />
          )}

          {stepper === 12 ? (
            <CustomButton
              onPress={FinishApplication}
              style={[styles.button, styles.nextButton]}
              textStyle={[styles.buttonText, styles.nextButtonText]}
              title="Submit Application"
            />
          ) : (
            <CustomButton
              onPress={NavigateToNextApplication}
              style={[styles.button, styles.nextButton]}
              textStyle={[styles.buttonText, styles.nextButtonText]}
              title="Continue"
            />
          )}
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const formSectionStyles = StyleSheet.create({
  sectionContainer: {
    marginBottom: hp("3%"),
  },
  inputContainer: {
    marginBottom: hp("2%"),
  },
  label: {
    fontSize: wp("3.8%"),
    color: "#333",
    marginBottom: hp("1%"),
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: wp("2%"),
    padding: wp("3%"),
    fontSize: wp("3.8%"),
  },
  errorInput: {
    borderColor: "#ff3333",
  },
  errorText: {
    color: "#ff3333",
    fontSize: wp("3.2%"),
    marginTop: hp("0.5%"),
  },
  helperText: {
    fontSize: wp("3.2%"),
    color: "#666",
    marginTop: hp("0.5%"),
  },
  required: {
    color: "#ff3333",
    marginLeft: wp("1%"),
  },
  radioGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: hp("1%"),
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: wp("4%"),
    marginBottom: hp("1%"),
  },
  radioLabel: {
    fontSize: wp("3.8%"),
    color: "#333",
    marginLeft: wp("2%"),
  },
  datePicker: {
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: wp("2%"),
    padding: wp("3%"),
  },
  dropdown: {
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: wp("2%"),
    padding: wp("3%"),
  },
  dropdownItem: {
    padding: wp("3%"),
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  dropdownItemText: {
    fontSize: wp("3.8%"),
    color: "#333",
  },
  fileInput: {
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#e0e0e0",
    borderRadius: wp("2%"),
    padding: wp("3%"),
    alignItems: "center",
    justifyContent: "center",
  },
  fileInputText: {
    fontSize: wp("3.8%"),
    color: "rgba(21, 120, 61, 1)",
    textAlign: "center",
  },
  uploadedFile: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f9f4",
    padding: wp("2%"),
    borderRadius: wp("1%"),
    marginTop: hp("1%"),
  },
  uploadedFileName: {
    flex: 1,
    fontSize: wp("3.5%"),
    color: "#333",
  },
  removeFileButton: {
    padding: wp("2%"),
  },
  removeFileText: {
    color: "#ff3333",
    fontSize: wp("3.5%"),
  },
  helpText: {
    fontSize: wp("3.2%"),
    color: "#666",
    marginTop: hp("0.5%"),
    fontStyle: "italic",
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: hp("2%"),
  },
});

export default Application_Form;
