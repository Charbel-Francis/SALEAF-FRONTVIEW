import React, { useRef, useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, Dimensions } from "react-native";
import { styled } from "nativewind";
import LottieView from "lottie-react-native";
import axiosInstance from "@/utils/config";
import CustomButton from "@/components/CustomButton";
import * as DocumentPicker from "expo-document-picker";
import { IconButton } from "react-native-paper";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#ffffff",
      padding: wp("4%"),
    },
    animationContainer: {
      width: "100%",
      height: hp("20%"), // Reduced from 30%
      marginBottom: hp("2%"),
    },
    lottie: {
      width: "100%",
      height: "100%",
    },
    titleText: {
      fontSize: wp("4%"), // Reduced from 7%
      fontWeight: "bold",
      color: "#4CAF50",
      textAlign: "center",
      marginBottom: hp("2%"),
    },
    detailsContainer: {
      backgroundColor: "#f9f9f9",
      borderRadius: wp("2.5%"),
      padding: wp("4%"),
      marginBottom: hp("2%"),
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 2,
    },
    detailsText: {
      fontSize: wp("3.8%"), // Reduced from 4%
      color: "#333",
      marginBottom: hp("1%"),
      lineHeight: hp("2.5%"),
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "50%",
      gap: wp("2%"), // Add gap between buttons
    },
    button: {
      flex: 1, // Changed from 0.48 to 1
      minWidth: wp("30%"), // Add minimum width
      maxWidth: wp("45%"), // Add maximum width
    },
    selectedFileContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#f0f0f0",
      padding: wp("2%"),
      borderRadius: wp("2%"),
      marginTop: hp("4%"),
      marginHorizontal: wp("1%"), // Add horizontal margin
    },
    selectedFileText: {
      fontSize: wp("3.5%"),
      color: "#333",
      fontStyle: "italic",
      flex: 1,
    },
    closeIcon: {
      padding: wp("1%"),
    },
  });

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
    } catch (error) {
      console.error("Error picking document:", error);
    } finally {
      setFileLoading(false);
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
        Alert.alert("Upload failed", "Please try again later.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      Alert.alert("Error", "File upload failed. Please try again.");
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
      </View>

      <Text style={styles.titleText}>Manual Payment</Text>

      <View style={styles.detailsContainer}>
        <Text style={styles.detailsText}>
          Donation Amount: R{donationAmount}
        </Text>
        <Text style={styles.detailsText}>
          Reference Number: {referenceNumber}
        </Text>
        <Text style={styles.detailsText}>Branch: {accountDetails.branch}</Text>
        <Text style={styles.detailsText}>
          Branch Code: {accountDetails.branchCode}
        </Text>
        <Text style={styles.detailsText}>
          Account Number: {accountDetails.accountNo}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <CustomButton
          onPress={pickDocument}
          title="Select File"
          loading={fileLoading}
          className="bg-mainColor"
          style={styles.button}
        />
        {selectedFile ? (
          <CustomButton
            onPress={continuePayment}
            title="Continue"
            loading={uploading}
            className="bg-mainColor"
            style={styles.button}
          />
        ) : (
          <CustomButton
            onPress={uploadLater}
            title="Upload Later"
            className="bg-mainColor"
            style={styles.button}
          />
        )}
      </View>

      {selectedFile && (
        <View style={styles.selectedFileContainer}>
          <Text
            style={styles.selectedFileText}
            numberOfLines={1}
            ellipsizeMode="middle"
          >
            {selectedFile.name}
          </Text>
          <IconButton
            icon="close"
            iconColor="red"
            size={wp("5%")}
            onPress={deselectFile}
            style={styles.closeIcon}
          />
        </View>
      )}
    </View>
  );
};

export default ManualPayment;
