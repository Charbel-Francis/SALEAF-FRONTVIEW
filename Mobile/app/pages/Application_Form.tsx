import React, { useState, useRef, useEffect } from "react";
import { View, Animated, StyleSheet, Keyboard, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MD3Colors } from "react-native-paper";
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

const Application_Form = () => {
  const [stepper, setStepper] = useState(0);
  const progress = useRef(new Animated.Value(0)).current;
  const [progressText, setProgressText] = useState("0%");
  const totalSteps = 12;
  const [application, setApplication] = useState<AppUser>(initialAppUser);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const buttonPosition = useRef(new Animated.Value(0)).current;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "transparent",
    },
    contentContainer: {
      flex: 1,
      justifyContent: "space-between",
      paddingHorizontal: wp("4%"),
      paddingVertical: hp("4%"),
    },
    progressContainer: {
      justifyContent: "center",
      alignItems: "center",
      marginVertical: hp("2%"),
      paddingTop: hp("2%"),
    },
    progressBar: {
      position: "relative",
      width: wp("80%"),
      marginTop: hp("2%"),
    },
    progressBackground: {
      height: hp("1%"),
      width: "100%",
      backgroundColor: "#e0e0e0",
      borderRadius: wp("1%"),
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      backgroundColor: "green",
    },
    progressText: {
      position: "absolute",
      top: -hp("2.5%"),
      left: "50%",
      transform: [{ translateX: -wp("6%") }],
      fontSize: wp("4%"),
      fontWeight: "bold",
      color: "green",
    },
    formContainer: {
      flex: 2,
      backgroundColor: "transparent",
      borderRadius: wp("4%"),
    },
    buttonContainer: {
      flexDirection: "row",
      paddingHorizontal: wp("4%"),
      paddingVertical: hp("2%"),
      backgroundColor: "transparent",
      borderRadius: wp("4%"),

      width: "55%",
      height: "11%",
      color: "transparent",
    },
    button: {
      flex: 1,
      marginHorizontal: wp("2%"),
      borderRadius: wp("2%"),
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
      // Handle success (e.g., show success message, navigate away)
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
    <LinearGradient
      colors={[
        "rgba(21, 120, 61, 0.3)",
        "rgba(21, 120, 61, 0.3)",
        "rgba(21, 120, 61, 0.4)",
        "rgba(21, 120, 61, 0.5)",
        "rgba(21, 120, 61, 0.8)",
        "rgba(21, 120, 61, 0.4)",
      ]}
      style={styles.container}
    >
      <View style={styles.contentContainer}>
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
            <Animated.Text style={styles.progressText}>
              {progressText}
            </Animated.Text>
          </View>
        </View>

        <View style={styles.formContainer}>{renderStepContent()}</View>

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
              onPress={() => {}}
              style={[styles.button, { marginRight: wp("2%") }]}
              className="bg-red text-white py-3 rounded-md"
              title="Cancel"
            />
          ) : (
            <CustomButton
              onPress={NavigateToPreviousApplication}
              style={[styles.button, { marginRight: wp("2%") }]}
              className="bg-red text-white py-3 rounded-md"
              title="Back"
            />
          )}

          {stepper === 12 ? (
            <CustomButton
              onPress={FinishApplication}
              style={[styles.button, { marginLeft: wp("2%") }]}
              className="bg-mainColor text-white py-3 rounded-md"
              title="Submit Application"
            />
          ) : (
            <CustomButton
              onPress={NavigateToNextApplication}
              style={[styles.button, { marginLeft: wp("2%") }]}
              className="bg-mainColor text-white py-3 rounded-md"
              title="Continue"
            />
          )}
        </Animated.View>
      </View>
    </LinearGradient>
  );
};

export default Application_Form;
