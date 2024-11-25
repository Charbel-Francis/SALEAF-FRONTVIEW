import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  Animated,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Keyboard,
} from "react-native";
import { InputField } from "../InputField";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Card } from "react-native-paper";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { AppUser } from "@/constants";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
    borderRadius: wp("4%"),
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: wp("2%"),
    paddingBottom: hp("15%"),
    gap: hp("2%"),
  },
  title: {
    fontSize: wp("6%"),
    fontWeight: "700",
    textAlign: "center",
    marginVertical: hp("2%"),
    color: "#15783D",
    letterSpacing: 0.5,
  },
  card: {
    width: wp("75%"),
    alignSelf: "center",
    marginBottom: hp("1.5%"),
    borderRadius: wp("3%"),
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#E8EFF5",
  },
  cardContent: {
    padding: wp("4%"),
  },
  declarationText: {
    fontSize: wp("3.5%"),
    color: "#334155",
    lineHeight: wp("5%"),
    marginBottom: hp("2%"),
    letterSpacing: 0.2,
  },
  input: {
    height: hp("6%"),
    borderRadius: wp("2.5%"),
    marginBottom: hp("1.5%"),
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderColor: "#E9ECEF",
    paddingHorizontal: wp("3%"),
    fontSize: wp("3.5%"),
  },
  inputWrapper: {
    paddingVertical: hp("1.5%"),
    gap: hp("1%"),
  },
  disclaimer: {
    width: wp("75%"),
    alignSelf: "center",
    fontSize: wp("3.2%"),
    color: "#DC2626",
    lineHeight: wp("4.8%"),
    marginTop: hp("2%"),
    backgroundColor: "#FEF2F2",
    padding: wp("4%"),
    borderRadius: wp("2.5%"),
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  iconContainer: {
    width: wp("7%"),
    height: wp("7%"),
    borderRadius: wp("3.5%"),
    backgroundColor: "#F0F7F4",
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp("2%"),
  },
});

const Signature_Declaration_Form = ({
  updateState,
  application,
}: {
  updateState: (updates: Partial<AppUser>) => void;
  application: AppUser;
}) => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      }
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <Text style={styles.title}>Signature and Declaration</Text>

        <ScrollView
          contentContainerStyle={[
            styles.contentContainer,
            { paddingBottom: keyboardHeight + hp("10%") },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <Card style={styles.card}>
            <View style={styles.cardContent}>
              <Text style={styles.declarationText}>
                I/We declare that this is a full, true and correct statement of
                my/our personal assets and liabilities and that my/our assets
                are not encumbered other than stated above.
              </Text>
              <InputField
                label="Full Name"
                placeholder="Enter Full Name"
                textContentType="name"
                value={application.declarationSignedBy ?? ""}
                onChangeText={(value) => {
                  updateState({ declarationSignedBy: value });
                }}
                icon={<Ionicons name="person" size={wp("4.5%")} color="#666" />}
                style={styles.input}
              />
            </View>
          </Card>

          <Text style={styles.disclaimer}>
            All information provided is subject to verification. False
            information will disqualify an applicant from receiving a
            Bursary/Financial Assistance. This application will be treated in
            the strictest confidence. You should only apply for Financial
            Assistance to SALEAF as a last resort, after you have explored
            alternative sources of funding. SALEAF HAS LIMITED FUNDS. Should it
            come to light that information relevant to this application has been
            withheld or misrepresented, SALEAF reserves the right to withdraw
            already granted Bursaries / Financial Assistance.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Signature_Declaration_Form;
