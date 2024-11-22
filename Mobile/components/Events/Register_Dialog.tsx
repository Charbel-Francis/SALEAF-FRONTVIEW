import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, Platform } from "react-native";
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
} from "react-native-paper";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

// Package types with their base prices
const PACKAGES = [
  { id: "standard", label: "Standard Package", basePrice: 2500 },
  { id: "premium", label: "Premium Package", basePrice: 3500 },
  { id: "vip", label: "VIP Package", basePrice: 5000 },
];

type RegistrationDialogProps = {
  visible: boolean;
  onDismiss: () => void;
  onSubmit: (registrationData: {
    package: string;
    quantity: number;
    totalPrice: number;
    name: string;
    email: string;
    phone: string;
  }) => void;
  eventTitle: string;
};

export default function RegistrationDialog({
  visible,
  onDismiss,
  onSubmit,
  eventTitle,
}: RegistrationDialogProps) {
  const [selectedPackage, setSelectedPackage] = useState(PACKAGES[0].id);
  const [quantity, setQuantity] = useState("1");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [totalPrice, setTotalPrice] = useState(PACKAGES[0].basePrice);

  // Validate email format
  const emailIsValid = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Calculate total price whenever package or quantity changes
  useEffect(() => {
    const selectedPackageDetails = PACKAGES.find(
      (pkg) => pkg.id === selectedPackage
    );
    if (selectedPackageDetails) {
      const qty = parseInt(quantity) || 0;
      setTotalPrice(selectedPackageDetails.basePrice * qty);
    }
  }, [selectedPackage, quantity]);

  const handleSubmit = () => {
    if (!name || !emailIsValid(email) || !phone || parseInt(quantity) < 1) {
      return;
    }

    onSubmit({
      package: selectedPackage,
      quantity: parseInt(quantity),
      totalPrice,
      name,
      email,
      phone,
    });
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
                  {PACKAGES.map((pkg) => (
                    <View key={pkg.id} style={styles.packageRow}>
                      <RadioButton.Item
                        label={`${
                          pkg.label
                        } - R${pkg.basePrice.toLocaleString()}`}
                        value={pkg.id}
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
              <TextInput
                mode="outlined"
                label="Full Name"
                value={name}
                onChangeText={setName}
                style={styles.input}
                outlineColor="#ccc"
                activeOutlineColor="#2196F3"
              />
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
                  R{totalPrice.toLocaleString()}
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
          >
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={handleSubmit}
            disabled={
              !name || !emailIsValid(email) || !phone || parseInt(quantity) < 1
            }
            buttonColor="#2196F3"
            textColor="white"
            style={styles.actionButton}
          >
            Register
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
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
