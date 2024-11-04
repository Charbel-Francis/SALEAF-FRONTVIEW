import { Text, View, Image } from "react-native";
import { useState, useEffect } from "react";
import { DualInputField, InputField } from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import { images } from "@/constants";
import {
  EmailIcon,
  LockIcon,
  SVGTopSignUp,
  UserIcon,
} from "@/assets/authImages/SVGs";
import { styled } from "nativewind";
import axiosInstance from "@/utils/config";

const DonatorDetails = () => {
  const [form, setForm] = useState({
    identityNoOrCompanyRegNo: "",
    incomeTaxNumber: "",
    address: "",
    phoneNumber: "",
  });
  const StyledText = styled(Text);
  const [loading, setLoading] = useState<boolean>(false);
  const isFormValid = Object.values(form).every((value) => value.trim() !== "");
  const handleContinue = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(
        `/api/DonorCertificateInfo/create-donor-certificate-info`,
        form
      );
    } catch (error) {
      setLoading(false);
      console.error("Error during handleContinue:", error);
    }
  };
  return (
    <View>
      <View className="pt-10 w-full">
        <View className="absolute bottom-5 left-0 right-0 flex items-center">
          <Text className="text-black  text-lg">
            We need a few details from you
          </Text>
        </View>
      </View>
      <View className="py-3 p-3">
        <DualInputField
          label1="ID | Company Reg No"
          label2="Income Tax Number"
          placeholder1="ID | Company Reg No"
          placeholder2="Income Tax Number"
          icon1={<UserIcon />}
          icon2={<UserIcon />}
          onChange1={(value) => {
            setForm((prevForm) => ({
              ...prevForm,
              identityNoOrCompanyRegNo: value,
            }));
          }}
          onChange2={(value) => {
            setForm((prevForm) => ({ ...prevForm, incomeTaxNumber: value }));
          }}
        />
        <InputField
          label="Address"
          placeholder="Enter Home or Company Address"
          textContentType="addressCity"
          value={form.address}
          icon={<EmailIcon />}
          onChangeText={(value) =>
            setForm((prevForm) => ({ ...prevForm, address: value }))
          }
        />
        <InputField
          label="Phone Number"
          placeholder="Enter Phone Number"
          textContentType="telephoneNumber"
          icon={<LockIcon />}
          value={form.phoneNumber}
          onChangeText={(value) =>
            setForm((prevForm) => ({ ...prevForm, phoneNumber: value }))
          }
        />
      </View>
      <View className="pt-3 pr-4 pl-4">
        {isFormValid ? (
          <CustomButton
            onPress={() => {
              handleContinue();
            }}
            loading={loading}
            title="Create Account"
          />
        ) : (
          <StyledText className="text-center text-gray-700 mt-4 mb-2">
            Enter All Details to Continue
          </StyledText>
        )}
      </View>
    </View>
  );
};

export default DonatorDetails;
