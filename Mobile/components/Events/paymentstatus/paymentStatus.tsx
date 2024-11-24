import React, { useEffect } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { MaterialIcons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";

// Success Screen Component
export const PaymentSuccessScreen = () => {
  const scaleValue = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(scaleValue, {
      toValue: 1,
      duration: 500,
      easing: Easing.bounce,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.iconContainer, { transform: [{ scale: scaleValue }] }]}
      >
        <LottieView
          source={require("../assets/success-animation.json")}
          autoPlay
          loop={false}
          style={styles.lottie}
        />
      </Animated.View>
      <Text style={styles.title}>Payment Successful!</Text>
      <Text style={styles.message}>
        Your transaction has been completed successfully. Thank you for your
        payment!
      </Text>
    </View>
  );
};

// Failure Screen Component
export const PaymentFailureScreen = () => {
  const shakeAnimation = new Animated.Value(0);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.iconContainer,
          { transform: [{ translateX: shakeAnimation }] },
        ]}
      >
        <MaterialIcons name="error" size={hp("15%")} color="#FF4444" />
      </Animated.View>
      <Text style={[styles.title, { color: "#FF4444" }]}>Payment Failed</Text>
      <Text style={styles.message}>
        We couldn't process your payment. Please try again or contact support
        for assistance.
      </Text>
    </View>
  );
};

// Cancelled Screen Component
export const PaymentCancelledScreen = () => {
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.iconContainer, { opacity: fadeAnim }]}>
        <MaterialIcons name="cancel" size={hp("15%")} color="#FFB74D" />
      </Animated.View>
      <Text style={[styles.title, { color: "#FFB74D" }]}>
        Payment Cancelled
      </Text>
      <Text style={styles.message}>
        Your payment has been cancelled. Feel free to try again when you're
        ready.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: wp("5%"),
  },
  iconContainer: {
    marginBottom: hp("4%"),
  },
  lottie: {
    width: hp("20%"),
    height: hp("20%"),
  },
  title: {
    fontSize: hp("3.5%"),
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: hp("2%"),
    textAlign: "center",
  },
  message: {
    fontSize: hp("2%"),
    color: "#666666",
    textAlign: "center",
    maxWidth: wp("80%"),
    lineHeight: hp("3%"),
  },
});
