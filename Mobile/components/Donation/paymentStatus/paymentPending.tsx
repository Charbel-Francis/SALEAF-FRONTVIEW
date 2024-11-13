import React, { useRef, useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import { styled } from "nativewind";
import { SafeAreaView } from "react-native-safe-area-context";
import LottieView from "lottie-react-native";
import { images } from "@/constants";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const StyledText = styled(Text);

const PaymentPendingComponent = ({
  setSteps,
}: {
  setSteps: (steps: number) => void;
}) => {
  const animation = useRef<LottieView>(null);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const timeout = setTimeout(() => {
      setSteps(0);
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(timeout);
    };
  }, [setSteps]);

  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: "#ffffff",
    },
    container: {
      flex: 1,
      alignItems: "center",
      paddingHorizontal: wp("5%"),
    },
    topSection: {
      height: hp("25%"),
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      paddingTop: hp("2%"),
    },
    logo: {
      width: wp("50%"),
      height: hp("15%"),
      resizeMode: "contain",
    },
    animationContainer: {
      width: wp("80%"),
      height: hp("25%"),
      justifyContent: "center",
      alignItems: "center",
      marginVertical: hp("2%"),
    },
    lottie: {
      width: "100%",
      height: "100%",
    },
    textContainer: {
      alignItems: "center",
      paddingHorizontal: wp("5%"),
      marginTop: hp("2%"),
    },
    pendingText: {
      fontSize: wp("7%"),
      fontWeight: "bold",
      color: "#F7CB73",
      marginBottom: hp("2%"),
      textAlign: "center",
    },
    messageText: {
      fontSize: wp("4.2%"),
      color: "#333",
      textAlign: "center",
      lineHeight: hp("3%"),
      marginBottom: hp("2%"),
    },
    emailText: {
      fontSize: wp("4%"),
      color: "#333",
      textAlign: "center",
      lineHeight: hp("3%"),
      marginBottom: hp("2%"),
      paddingHorizontal: wp("2%"),
    },
    redirectText: {
      fontSize: wp("4%"),
      color: "#666",
      textAlign: "center",
      marginTop: hp("2%"),
    },
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.animationContainer}>
          <LottieView
            autoPlay
            ref={animation}
            style={styles.lottie}
            source={require("@/assets/icons/bank.json")}
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.pendingText}>Payment Pending!</Text>

          <Text style={styles.messageText}>
            Thank you for your donation. Your support is greatly appreciated!
          </Text>

          <Text style={styles.emailText}>
            You may email the proof of payment to charbel.ff@gmail.com or upload
            directly from our app
          </Text>

          <Text style={styles.redirectText}>
            You are being redirected back to the donations page in {countdown}{" "}
            seconds...
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PaymentPendingComponent;
