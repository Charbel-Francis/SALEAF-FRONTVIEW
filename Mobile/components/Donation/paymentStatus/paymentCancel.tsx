import React, { useEffect, useRef, useState } from "react";
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

const PaymentCancelComponent = ({
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
      backgroundColor: "#f5f5f5",
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
    },
    logo: {
      width: wp("50%"),
      height: hp("15%"),
      resizeMode: "contain",
    },
    animationContainer: {
      width: wp("80%"),
      height: hp("20%"),
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
    cancelText: {
      fontSize: wp("6%"),
      fontWeight: "bold",
      color: "grey",
      marginBottom: hp("2%"),
      textAlign: "center",
    },
    messageText: {
      fontSize: wp("4.5%"),
      color: "#333",
      textAlign: "center",
      lineHeight: hp("3%"),
      marginBottom: hp("2%"),
    },
    redirectText: {
      fontSize: wp("4%"),
      color: "#666",
      textAlign: "center",
      marginTop: hp("1%"),
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
            source={require("@/assets/icons/paymentfailure.json")}
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.cancelText}>Payment Cancelled!</Text>

          <Text style={styles.messageText}>
            Unfortunately, your payment was not cancelled.
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

export default PaymentCancelComponent;
