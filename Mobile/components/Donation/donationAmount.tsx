import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Keyboard,
  Platform,
  Animated,
} from "react-native";
import { styled } from "nativewind";
import { DonateInputField } from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import { images, pretextDonationAmount } from "@/constants";
import axiosInstance from "@/utils/axios";
import ButtonMultiselect, {
  ButtonLayout,
} from "react-native-button-multiselect";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useAuth } from "@/context/JWTContext";
import { useAuthVisibility } from "@/context/AuthVisibilityContext";

const StyledText = styled(Text);

const DonationAmountComponent = ({
  setSelectedAmount,
  setSteps,
}: {
  setSelectedAmount: (amount: number) => void;
  setSteps: (steps: number) => void;
}) => {
  const [inputDonatedAmount, setInputDonatedAmount] = useState<string>("");
  const [selectedButtons, setSelectedButtons] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [contentPosition] = useState(new Animated.Value(0));
  const { authState } = useAuth();
  const { showSignIn } = useAuthVisibility();
  useEffect(() => {
    const keyboardWillShow = (event: any) => {
      Animated.timing(contentPosition, {
        duration: 250,
        toValue: -event.endCoordinates.height / 2,
        useNativeDriver: true,
      }).start();
    };

    const keyboardWillHide = () => {
      Animated.timing(contentPosition, {
        duration: 250,
        toValue: 0,
        useNativeDriver: true,
      }).start();
    };

    const showSubscription = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      keyboardWillShow
    );
    const hideSubscription = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      keyboardWillHide
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "white",
    },
    animatedContent: {
      flex: 1,
    },
    logoSection: {
      height: hp("20%"),
      alignItems: "center",
      justifyContent: "flex-end",
      paddingBottom: hp("2%"),
    },
    logo: {
      width: wp("60%"),
      height: hp("20%"),
      resizeMode: "contain",
    },
    content: {
      paddingHorizontal: wp("4%"),
    },
    title: {
      fontSize: wp("4.5%"),
      textAlign: "center",
      marginVertical: hp("2%"),
    },
    buttonMultiselectContainer: {
      marginVertical: hp("2%"),
    },
    divider: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: hp("2%"),
    },
    line: {
      flex: 1,
      height: 1,
      backgroundColor: "#E5E7EB",
    },
    orText: {
      paddingHorizontal: wp("4%"),
      color: "#6B7280",
    },
    inputContainer: {
      marginVertical: hp("2%"),
    },
    input: {
      height: hp("4%"),
    },
    buttonContainer: {
      marginTop: hp("2%"),
      paddingHorizontal: wp("1%"),
    },
    button: {
      height: hp("6%"),
      backgroundColor: "#15783D",
    },
    helperText: {
      textAlign: "center",
      color: "#4B5563",
      marginTop: hp("2%"),
      fontSize: wp("3.8%"),
    },
  });

  const handleButtonSelected = (selectedValue: string) => {
    setSelectedButtons(selectedValue);
    setSelectedAmount(parseInt(selectedValue));
    setInputDonatedAmount("");
  };

  const handleInputChange = (value: string) => {
    setSelectedAmount(parseInt(value));
    setSelectedButtons("");
    setInputDonatedAmount(value);
  };

  const handleContinue = async () => {
    setLoading(true);

    try {
      if (authState?.authenticated) {
        const response = await axiosInstance.get(
          `/api/DonorCertificateInfo/donor-certificate-info-exist`
        );
        if (!response.data) {
          setSteps(1);
        } else {
          setSteps(2);
          setLoading(false);
        }
      } else {
        showSignIn();
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error during handleContinue:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.animatedContent,
          { transform: [{ translateY: contentPosition }] },
        ]}
      >
        <View style={styles.logoSection}>
          <Image source={images.clearLogo} style={styles.logo} />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Select Donation Amount</Text>

          <View style={styles.buttonMultiselectContainer}>
            <ButtonMultiselect
              layout={ButtonLayout.CAROUSEL}
              buttons={pretextDonationAmount}
              selectedButtons={selectedButtons}
              onButtonSelected={handleButtonSelected}
              horizontalPadding={30}
            />
          </View>

          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.line} />
          </View>

          <View style={styles.inputContainer}>
            <DonateInputField
              label="Other Amount"
              placeholder="Enter Amount"
              style={styles.input}
              value={inputDonatedAmount}
              icon={<Ionicons name="cash" size={wp("5%")} color="grey" />}
              onChangeText={handleInputChange}
            />
          </View>

          {selectedButtons || inputDonatedAmount ? (
            <View style={styles.buttonContainer}>
              <CustomButton
                loading={loading}
                onPress={handleContinue}
                style={styles.button}
                title="Continue"
              />
            </View>
          ) : (
            <Text style={styles.helperText}>
              Select or enter an amount to continue
            </Text>
          )}
        </View>
      </Animated.View>
    </View>
  );
};

export default DonationAmountComponent;
