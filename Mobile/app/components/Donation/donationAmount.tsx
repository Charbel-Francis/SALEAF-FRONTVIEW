import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { styled } from "nativewind";
import { DonateInputField } from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import { images, pretextDonationAmount } from "@/constants";
import axiosInstance from "@/utils/axios";
import ButtonMultiselect, {
  ButtonLayout,
} from "react-native-button-multiselect";
import { SafeAreaView } from "react-native-safe-area-context";
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
      const response = await axiosInstance.get(
        `/api/DonorCertificateInfo/donor-certificate-info-exist`
      );

      if (!response.data) {
        setSteps(1);
      } else {
        setSteps(2);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error during handleContinue:", error);
    }
  };
  return (
    <View>
      <View className=" w-full h-[200px] flex-row">
        <View className="absolute mt-30 bottom-0 left-0 right-0 flex items-center">
          <View className="justify-start items-end pr-0 pt-5">
            <Image
              source={images.clearLogo}
              style={{ width: 250, height: 200 }}
            />
          </View>
        </View>
      </View>
      <View className="py-2 px-4">
        <StyledText className="text-lg font-sans mb-3 text-center">
          Select Donation Amount
        </StyledText>
        <ButtonMultiselect
          layout={ButtonLayout.CAROUSEL}
          buttons={pretextDonationAmount}
          selectedButtons={selectedButtons}
          onButtonSelected={handleButtonSelected}
          horizontalPadding={30}
        />
      </View>
      <View className="relative flex items-center my-2 pl-10 pr-10">
        <View className="absolute top-1/2 border-t border-gray-300 w-full" />
        <Text className="bg-white px-4 text-gray-500">OR</Text>
      </View>
      <View className="py-2 px-4">
        <DonateInputField
          label="Other Amount"
          placeholder="Enter Amount"
          value={inputDonatedAmount}
          onChangeText={handleInputChange}
        />
      </View>

      {selectedButtons || inputDonatedAmount ? (
        <View className="pt-3 pr-5 pl-5">
          <View className="flex-2 justify-end">
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
          Select or enter an amount to continue
        </StyledText>
      )}
    </View>
  );
};

export default DonationAmountComponent;
