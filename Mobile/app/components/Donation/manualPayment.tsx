import React, { useRef, useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { styled } from "nativewind";
import LottieView from "lottie-react-native";
import axiosInstance from "@/utils/config";
import CustomButton from "@/components/CustomButton";
import * as DocumentPicker from "expo-document-picker";
import { IconButton } from "react-native-paper";

const StyledText = styled(Text);

const ManualPayment = ({
  setSteps,
  referenceNumber,
  donationAmount,
  setPaymentStatus,
}: {
  setSteps: (steps: number) => void;
  referenceNumber?: string;
  donationAmount?: number;
  setPaymentStatus: (status: number) => void;
}) => {
  const animation = useRef<LottieView>(null);
  const [fileLoading, setFileLoading] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [accountDetails, setAccountDetails] = useState<any>({
    accountNo: "",
    branch: "",
    branchCode: "",
  });
  const [selectedFile, setSelectedFile] = useState<any>(null);

  const requestBankDetails = async () => {
    const response = await axiosInstance.get("/api/BankAccountInfo");
    if (response.status === 200) {
      setAccountDetails(response.data[0]);
    }
  };

  const pickDocument = async () => {
    setFileLoading(true);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
      });
      if (!result.canceled) {
        setSelectedFile(result.assets[0]);
      } else {
        setSelectedFile(null);
      }
      setFileLoading(false);
    } catch (error) {
      setFileLoading(false);
      console.error("Error picking document:", error);
    }
  };

  const deselectFile = () => {
    setSelectedFile(null);
  };
  const uploadLater = () => {
    setSteps(4);
    setPaymentStatus(4);
  };

  const continuePayment = async () => {
    if (!selectedFile) {
      Alert.alert("No file selected", "Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("ReferenceNumber", String(referenceNumber || 0));
    formData.append("Amount", String(donationAmount || 0));
    formData.append("DocFile", {
      uri: selectedFile.uri,
      type: selectedFile.mimeType || "application/pdf",
      name: selectedFile.name || "upload.pdf",
    } as any);

    console.log("Uploading FormData:", formData);

    setUploading(true);
    try {
      const response = await axiosInstance.post(
        "/api/ManualPaymentDoc/upload-manual-payment",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        Alert.alert("Success", "Proof of payment uploaded successfully.");
        setPaymentStatus(5);
        setSteps(4);
      } else {
        console.error("Unexpected response:", response);
        Alert.alert("Upload failed", "Please try again later.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      Alert.alert(
        "Error",
        "File upload failed. Check the console for details."
      );
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    requestBankDetails();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.animationContainer}>
        <LottieView
          autoPlay
          ref={animation}
          style={styles.lottie}
          source={require("@/assets/icons/bank.json")}
          loop
        />
        <StyledText style={styles.titleText}>Manual Payment</StyledText>
        <View style={styles.detailsContainer}>
          <StyledText style={styles.detailsText}>
            Donation Amount: R{donationAmount}
          </StyledText>
          <StyledText style={styles.detailsText}>
            Reference Number: {referenceNumber}
          </StyledText>
          <StyledText style={styles.detailsText}>
            Branch: {accountDetails.branch}
          </StyledText>
          <StyledText style={styles.detailsText}>
            Branch Code: {accountDetails.branchCode}
          </StyledText>
          <StyledText style={styles.detailsText}>
            Account Number: {accountDetails.accountNo}
          </StyledText>
        </View>

        <View style={styles.buttonContainer}>
          <CustomButton
            onPress={pickDocument}
            title="Select File"
            loading={fileLoading}
            className="bg-mainColor w-[45%]"
          />
          {selectedFile ? (
            <CustomButton
              onPress={continuePayment}
              title="Continue"
              loading={uploading}
            />
          ) : (
            <CustomButton
              onPress={uploadLater}
              title="Upload Later"
              className="bg-mainColor w-[45%]"
            />
          )}
        </View>
        {selectedFile && (
          <View style={styles.selectedFileContainer}>
            <StyledText style={styles.selectedFileText}>
              Selected File: {selectedFile.name}
            </StyledText>
            <IconButton
              icon="close"
              iconColor="red"
              size={20}
              onPress={deselectFile}
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 20,
  },
  animationContainer: {
    width: "100%",
    height: "30%",
    top: 0,
    position: "absolute",
  },
  lottie: {
    width: "100%",
    height: "100%",
  },
  titleText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4CAF50",
    textAlign: "center",
    marginTop: 10,
  },
  detailsContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    marginVertical: 20,
    width: "100%",
    alignItems: "center",
  },
  detailsText: {
    fontSize: 16,
    color: "#333",
    marginVertical: 5,
  },
  selectedFileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  selectedFileText: {
    fontSize: 14,
    color: "#333",
    fontStyle: "italic",
    marginRight: 10,
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});

export default ManualPayment;
