import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { styled } from "nativewind";
import CustomButton from "@/components/CustomButton";
import { donationType, images, pretextDonationAmount } from "@/constants";
import ButtonMultiselect, {
  ButtonLayout,
} from "react-native-button-multiselect";
import axiosInstance from "@/utils/axios";
import LottieView from "lottie-react-native";
const StyledText = styled(Text);

const DonationTypeComponent = ({
  setSteps,
  setDonationResource,
  setPaymentType,
  donationAmount,
}: {
  setSteps: (steps: number) => void;
  setDonationResource: (link: string) => void;
  setPaymentType: (type: number) => void;
  donationAmount: number;
}) => {
  const [selectedButtons, setSelectedButtons] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const animation = useRef<LottieView>(null);
  const handleButtonSelected = (selectedValue: string) => {
    setSelectedButtons(selectedValue);
  };
  const handleContinue = async () => {
    setLoading(true);
    try {
      if (parseInt(selectedButtons) === 3) {
        const response = await axiosInstance.post("/api/Donation", {
          amount: donationAmount,
          currency: "ZAR",
          cancelurl: "http://localhost:3000/cancel",
          successUrl: "http://localhost:3000/success",
          failureUrl: "http://localhost:3000/failure",
          isAnonymous: false,
        });
        if (response.status === 200) {
          setDonationResource(response.data?.redirectUrl);
          setPaymentType(parseInt(selectedButtons));
          setSteps(3);
          setLoading(false);
        }
      } else {
        const response = await axiosInstance.post(
          "/api/Donation/manual-payment-donation",
          { amount: donationAmount, currency: "ZAR", isAnonymous: false }
        );

        if (response.status === 200) {
          setDonationResource(response.data.donationId);
          setPaymentType(parseInt(selectedButtons));
          setSteps(3);
          setLoading(false);
        }
      }
    } catch (error) {
      setLoading(false);
      console.error("Error during handleContinue:", error);
    }
  };
  return (
    <View>
      <View className=" w-full h-[200px] flex-row">
        <View style={styles.animationContainer}>
          <LottieView
            autoPlay
            ref={animation}
            style={styles.lottie}
            source={require("@/assets/icons/paymentType.json")}
          />
        </View>
      </View>
      <View>
        <StyledText className="text-lg  mb-3 text-center">
          Select Payment Type
        </StyledText>
        <View className="py-2 w-50 p-3">
          <ButtonMultiselect
            layout={ButtonLayout.FULL_WIDTH}
            buttons={donationType}
            selectedButtons={selectedButtons}
            onButtonSelected={handleButtonSelected}
            buttonStyle={{ flexWrap: "wrap" }}
            textStyle={{ textAlign: "center", width: "100%" }}

          />
        </View>
      </View>
      {selectedButtons ? (
        <View className="pt-3 pr-5 py pl-5">
          <View className="flex-2 justify-end ">
            <CustomButton
              loading={loading}
              onPress={() => {
                handleContinue();
              }}
              title="Continue"
            />
          </View>
        </View>
      ) : (
        <StyledText className="text-center text-gray-700 mt-4 mb-2">
          Select a payment method
        </StyledText>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  lottie: {
    width: "100%",
    height: "100%",
  },
  animationContainer: {
    width: "100%",
    height: "100%",
    top: 0,
    position: "absolute",
  },
});

export default DonationTypeComponent;
