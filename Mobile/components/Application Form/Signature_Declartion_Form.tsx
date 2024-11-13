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
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: wp("4%"),
    paddingBottom: hp("15%"),
  },
  title: {
    fontSize: wp("6%"),
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: hp("2%"),
    color: "#2c3e50",
  },
  card: {
    marginBottom: hp("1%"),
    borderRadius: wp("2%"),
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardContent: {
    padding: wp("3%"),
  },
  inputWrapper: {
    paddingVertical: hp("1%"),
  },
  input: {
    height: hp("3%"),
    borderRadius: wp("1%"),
    marginBottom: hp("1%"),
  },
  disclaimer: {
    fontSize: wp("3.5%"),
    color: "#e74c3c",
    marginTop: hp("2%"),
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
              <Text style={{ marginBottom: hp("2%") }}>
                I/We declare that this is a full, true and correct statement of
                my/our personal assets and liabilities and that my/our assets
                are not encumbered other than stated above.
              </Text>
              <InputField
                label="Full Name"
                placeholder="Enter Full Name"
                textContentType="name"
                className="h-8"
                onChangeText={(value) => {
                  updateState({ declarationSignedBy: value });
                }}
                value={application.declarationSignedBy ?? ""}
                icon={<Ionicons name="person" size={20} color="gray" />}
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
