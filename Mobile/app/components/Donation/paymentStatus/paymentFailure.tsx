import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { styled } from "nativewind";
import { SafeAreaView } from "react-native-safe-area-context";
import LottieView from "lottie-react-native";
import { images } from "@/constants";

const StyledText = styled(Text);

const PaymentFailureComponent = ({
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
          source={require("@/assets/icons/paymentfailure.json")}
        />
      </View>
      <StyledText style={styles.cancelText}>
        Payment was unsuccessful!
      </StyledText>
      <StyledText style={styles.messageText}>
        Unfortunately, your payment was not successful. Please try again or use
        the manual donation option.
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
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  logoContainer: {
    position: "absolute",
    top: 50,
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
  cancelText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF0000", // Red color for cancellation
    marginTop: 20,
    textAlign: "center",
  },
  messageText: {
    fontSize: 16,
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

export default PaymentFailureComponent;
