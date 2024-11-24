import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, Platform, Alert } from "react-native";
import {
  Portal,
  Dialog,
  Button,
  Text,
  RadioButton,
  Divider,
  TextInput,
  HelperText,
  Surface,
  ActivityIndicator,
} from "react-native-paper";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import axiosInstance from "@/utils/config";
import { useRouter } from "expo-router";

interface Package {
  packageName: string;
  packagePrice: number;
}

interface EventRegistrationRequest {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  numberOfParticipant: number;
  eventId: number;
  packageName: string;
  cancelUrl: string;
  successUrl: string;
  failureUrl: string;
  amount: number;
  currency: string;
}

type RegistrationDialogProps = {
  visible: boolean;
  onDismiss: () => void;
  onSubmit: (registrationData: {
    package: string;
    quantity: number;
    totalPrice: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  }) => void;
  eventTitle: string;
  packages: Package[];
  eventId: number;
  successUrl: string;
  cancelUrl: string;
  failureUrl: string;
  currency: string;
};

export default function RegistrationDialog({
  visible,
  onDismiss,
  onSubmit,
  eventTitle,
  packages,
  eventId,
  successUrl,
  cancelUrl,
  failureUrl,
  currency,
}: RegistrationDialogProps) {
  const [selectedPackage, setSelectedPackage] = useState<string>(
    packages?.[0]?.packageName || ""
  );
  const [quantity, setQuantity] = useState("1");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [totalPrice, setTotalPrice] = useState(
    packages?.[0]?.packagePrice || 0
  );
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (packages?.length > 0 && !selectedPackage) {
      setSelectedPackage(packages[0].packageName);
      setTotalPrice(packages[0].packagePrice);
    }
  }, [packages]);

  const emailIsValid = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  useEffect(() => {
    const selectedPackageDetails = packages.find(
      (pkg) => pkg.packageName === selectedPackage
    );
    if (selectedPackageDetails) {
      const qty = parseInt(quantity) || 0;
      setTotalPrice(selectedPackageDetails.packagePrice * qty);
    }
  }, [selectedPackage, quantity, packages]);

  const submitEventRegistration = async (registrationData: {
    package: string;
    quantity: number;
    totalPrice: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  }) => {
    const requestData: EventRegistrationRequest = {
      firstName: registrationData.firstName,
      lastName: registrationData.lastName,
      phoneNumber: registrationData.phone,
      numberOfParticipant: registrationData.quantity,
      eventId,
      packageName: registrationData.package,
      cancelUrl,
      successUrl,
      failureUrl,
      amount: registrationData.totalPrice,
      currency,
    };

    try {
      console.log(
        "Sending request with data:",
        JSON.stringify(requestData, null, 2)
      );
      const response = await axiosInstance.post(
        "/EventRegistration",
        requestData
      );

      if (response.status === 200) {
        console.log("Success response:", response.data);
        router.push({
          pathname: "/pages/paymentGateway",
          params: { donationLink: response.data.redirectUrl },
        });
      }
    } catch (error: any) {
      console.error("Full error object:", error);

      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);

        // Show detailed error to user
        let errorMessage = "Registration failed: ";
        if (error.response.data && error.response.data.message) {
          errorMessage += error.response.data.message;
        } else if (
          error.response.data &&
          typeof error.response.data === "string"
        ) {
          errorMessage += error.response.data;
        } else if (error.response.status === 400) {
          errorMessage +=
            "Invalid registration details. Please check your information.";
        } else {
          errorMessage += "Something went wrong. Please try again.";
        }

        Alert.alert("Registration Error", errorMessage, [
          { text: "OK", onPress: () => console.log("OK Pressed") },
        ]);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Error request:", error.request);
        Alert.alert(
          "Network Error",
          "Unable to connect to the server. Please check your internet connection.",
          [{ text: "OK", onPress: () => console.log("OK Pressed") }]
        );
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error message:", error.message);
        Alert.alert(
          "Error",
          "An unexpected error occurred. Please try again.",
          [{ text: "OK", onPress: () => console.log("OK Pressed") }]
        );
      }
    }
  };

  const handleSubmit = async () => {
    if (
      !firstName ||
      !lastName ||
      !emailIsValid(email) ||
      !phone ||
      parseInt(quantity) < 1
    ) {
      Alert.alert(
        "Validation Error",
        "Please fill in all required fields correctly.",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }]
      );
      return;
    }

    setIsLoading(true);
    try {
      const registrationData = {
        package: selectedPackage,
        quantity: parseInt(quantity),
        totalPrice,
        firstName,
        lastName,
        email,
        phone,
      };

      console.log("Submitting registration with data:", registrationData);
      await submitEventRegistration(registrationData);
      onSubmit(registrationData);
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
        <Dialog.Title style={styles.title}>
          Register for {eventTitle}
        </Dialog.Title>
        <Dialog.ScrollArea>
          <ScrollView style={styles.scrollView}>
            <View style={styles.content}>
              {/* Package Selection */}
              <Text style={styles.sectionTitle}>Select Package</Text>
              <Surface style={styles.packageContainer}>
                <RadioButton.Group
                  onValueChange={(value) => setSelectedPackage(value)}
                  value={selectedPackage}
                >
                  {packages.map((pkg) => (
                    <View key={pkg.packageName} style={styles.packageRow}>
                      <RadioButton.Item
                        label={`${
                          pkg.packageName
                        } - ${currency}${pkg.packagePrice.toLocaleString()}`}
                        value={pkg.packageName}
                        position="leading"
                        labelStyle={styles.radioLabel}
                        style={styles.radioItem}
                        color="#2196F3"
                      />
                    </View>
                  ))}
                </RadioButton.Group>
              </Surface>

              {/* Quantity Selection */}
              <Text style={styles.sectionTitle}>Number of Participants</Text>
              <TextInput
                mode="outlined"
                keyboardType="number-pad"
                value={quantity}
                onChangeText={(text) =>
                  setQuantity(text.replace(/[^0-9]/g, ""))
                }
                style={styles.input}
                placeholder="Enter number of participants"
                placeholderTextColor="#666"
                outlineColor="#ccc"
                activeOutlineColor="#2196F3"
              />

              <Divider style={styles.divider} />

              {/* Personal Information */}
              <Text style={styles.sectionTitle}>Contact Information</Text>
              <View style={styles.nameContainer}>
                <TextInput
                  mode="outlined"
                  label="First Name"
                  value={firstName}
                  onChangeText={setFirstName}
                  style={[styles.input, styles.nameInput]}
                  outlineColor="#ccc"
                  activeOutlineColor="#2196F3"
                />
                <TextInput
                  mode="outlined"
                  label="Last Name"
                  value={lastName}
                  onChangeText={setLastName}
                  style={[styles.input, styles.nameInput]}
                  outlineColor="#ccc"
                  activeOutlineColor="#2196F3"
                />
              </View>
              <TextInput
                mode="outlined"
                label="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                style={styles.input}
                outlineColor="#ccc"
                activeOutlineColor="#2196F3"
              />
              <HelperText
                type="error"
                visible={email.length > 0 && !emailIsValid(email)}
                style={styles.helperText}
              >
                Invalid email address
              </HelperText>
              <TextInput
                mode="outlined"
                label="Phone Number"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                style={styles.input}
                outlineColor="#ccc"
                activeOutlineColor="#2196F3"
              />

              {/* Total Price Display */}
              <Surface style={styles.priceContainer}>
                <Text style={styles.priceLabel}>Total Price:</Text>
                <Text style={styles.priceValue}>
                  {currency}
                  {totalPrice.toLocaleString()}
                </Text>
              </Surface>
            </View>
          </ScrollView>
        </Dialog.ScrollArea>

        <Dialog.Actions style={styles.actions}>
          <Button
            onPress={onDismiss}
            textColor="#666"
            style={styles.actionButton}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={handleSubmit}
            disabled={
              isLoading ||
              !firstName ||
              !lastName ||
              !emailIsValid(email) ||
              !phone ||
              parseInt(quantity) < 1
            }
            buttonColor="#2196F3"
            textColor="white"
            style={styles.actionButton}
          >
            {isLoading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              "Register"
            )}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  // ... (previous styles remain the same)
  nameContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: wp("2%"),
  },
  nameInput: {
    flex: 1,
  },
  dialog: {
    marginVertical: -hp("5%"),
    backgroundColor: "white",
    ...Platform.select({
      android: {
        elevation: 5,
      },
      ios: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
    }),
  },
  title: {
    fontSize: wp("4.5%"),
    textAlign: "center",
    marginBottom: hp("1%"),
    color: "#333",
    fontWeight: "bold",
  },
  scrollView: {
    maxHeight: hp("70%"),
  },
  content: {
    padding: wp("4%"),
  },
  sectionTitle: {
    fontSize: wp("4%"),
    fontWeight: "bold",
    marginVertical: hp("1%"),
    color: "#333",
  },
  packageContainer: {
    borderRadius: wp("2%"),
    marginBottom: hp("2%"),
    backgroundColor: "white",
    ...Platform.select({
      android: {
        elevation: 2,
      },
      ios: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
      },
    }),
  },
  packageRow: {
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  radioItem: {
    paddingVertical: hp("0.5%"),
  },
  radioLabel: {
    color: "#333",
    fontSize: wp("3.8%"),
  },
  input: {
    marginBottom: hp("1%"),
    backgroundColor: "white",
    fontSize: wp("3.8%"),
  },
  helperText: {
    color: "#f44336",
  },
  divider: {
    marginVertical: hp("2%"),
    backgroundColor: "#f0f0f0",
    height: 1,
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: wp("4%"),
    borderRadius: wp("2%"),
    marginTop: hp("2%"),
    backgroundColor: "#f8f8f8",
    ...Platform.select({
      android: {
        elevation: 2,
      },
      ios: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
      },
    }),
  },
  priceLabel: {
    fontSize: wp("4%"),
    fontWeight: "bold",
    color: "#333",
  },
  priceValue: {
    fontSize: wp("5%"),
    fontWeight: "bold",
    color: "#2196F3",
  },
  actions: {
    padding: wp("2%"),
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  actionButton: {
    marginHorizontal: wp("1%"),
  },
});
