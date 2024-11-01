import React, { useRef, useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { styled } from "nativewind";
import { SafeAreaView } from "react-native-safe-area-context";
import LottieView from "lottie-react-native";
import { images } from "@/constants";

const StyledText = styled(Text);

const ProofOfPaymentRecieved = ({
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
      <StyledText style={styles.successText}>
        Proof of Payment Recieved!
      </StyledText>
      <StyledText style={styles.messageText}>
        Your Proof of Payment has been recieved. Thank you for your donation.
      </StyledText>
      <StyledText style={styles.redirectText}>
        Redirecting to the donations page in {countdown} seconds...
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
    height: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  lottie: {
    width: "100%",
    height: "50%",
  },
  successText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "green",
    textAlign: "center",
  },
  messageText: {
    fontSize: 18,
    color: "#333",
    marginTop: 10,
    textAlign: "center",
    lineHeight: 24,
  },
  redirectText: {
    fontSize: 16,
    color: "#333",
    marginTop: 20,
    textAlign: "center",
  },
});

export default ProofOfPaymentRecieved;
