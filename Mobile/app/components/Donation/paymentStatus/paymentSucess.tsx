import React, { useRef, useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { styled } from "nativewind";
import { SafeAreaView } from "react-native-safe-area-context";
import LottieView from "lottie-react-native";
import { images } from "@/constants";

const StyledText = styled(Text);

const PaymentSuccessComponent = ({
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
    }; // Cleanup the timer if the component unmounts
  }, [setSteps]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={images.clearLogo} style={styles.logo} />
      </View>
      <View style={styles.animationContainer}>
        <LottieView
          autoPlay
          ref={animation}
          style={styles.lottie}
          source={require("@/assets/icons/paymentsucess.json")}
        />
      </View>
      <StyledText style={styles.successText}>Payment Successful!</StyledText>
      <StyledText style={styles.messageText}>
        Thank you for your donation. Your support is greatly appreciated!
      </StyledText>
      <StyledText style={styles.messageText}>
        A Section 18A certificate will be sent to you shortly.
      </StyledText>
      <StyledText style={styles.redirectText}>
        You are being redirected back to the donations page in {countdown}{" "}
        seconds...
      </StyledText>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 20,
  },
  logoContainer: {
    position: "absolute",
    top: 0,
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 150,
  },
  animationContainer: {
    width: "100%",
    height: "40%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  lottie: {
    width: "100%",
    height: "100%",
  },
  successText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4CAF50",
    marginTop: 20,
    textAlign: "center",
  },
  messageText: {
    fontSize: 18,
    color: "#333",
    marginTop: 10,
    textAlign: "center",
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  redirectText: {
    fontSize: 16,
    color: "#333",
    marginTop: 20,
    textAlign: "center",
  },
});

export default PaymentSuccessComponent;
